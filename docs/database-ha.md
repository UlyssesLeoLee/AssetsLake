# Database HA Mirror Topology

AssetsLake's local Compose stack now runs one mirror for each persistent backend:

| Layer | Primary | Mirror | Mode |
| --- | --- | --- | --- |
| PostgreSQL | `postgres` | `postgres-replica` | physical streaming standby |
| MinIO | `minio` | `minio-mirror` | async object mirror via `mc mirror --watch` |
| Qdrant | `qdrant` | `qdrant-replica` | Qdrant cluster peer with collection replication factor `2` |

The stack also runs `ha-maintenance`, a periodic batch maintenance worker. Every
`HA_MAINTENANCE_INTERVAL_SECONDS` seconds it:

- checks PostgreSQL streaming replication and warns when WAL lag exceeds `HA_POSTGRES_LAG_WARN_BYTES`;
- runs a one-shot MinIO mirror reconciliation so the watch process is backed by scheduled full comparison;
- checks Qdrant peers and automatically replicates missing local shards for each collection in `HA_QDRANT_COLLECTIONS`.

AI write scope is intentionally replica-only:

- AI control buttons call `/api/management/replica-actions` and must send `x-assetslake-ai-write-scope: replica`.
- The endpoint writes shadow action records to `AI_REPLICA_QDRANT_URL` / `AI_REPLICA_ACTION_COLLECTION`, not to primary PostgreSQL business tables or primary MinIO objects. The Qdrant shadow collection is created with `shard_number=1`, `replication_factor=1`, and `write_consistency_factor=1` so the shard remains local to the configured replica peer.
- Ordinary asset, issue, and delivery-package write endpoints do not receive AI API headers automatically.
- Maintenance and mirror jobs use least-privilege replica accounts: `POSTGRES_AI_REPLICA_USER` is read-only/monitoring, and `MINIO_AI_REPLICA_USER` gets a custom primary policy limited to bucket location, listing, object reads, and bucket event listening; the same user is read-write only on the MinIO mirror.

Start the stack:

```powershell
docker compose -f infra\docker-compose.yml up -d --build
```

Useful checks:

```powershell
docker exec assetslake-postgres psql -U assetslake -d assetslake -c "SELECT application_name, state, sync_state FROM pg_stat_replication;"
docker exec assetslake-postgres-replica psql -U assetslake_replicator -d assetslake -c "SELECT pg_is_in_recovery();"
Invoke-RestMethod http://127.0.0.1:6333/cluster | ConvertTo-Json -Depth 8
Invoke-RestMethod http://127.0.0.1:6333/collections/assetslake_operation_memories/cluster | ConvertTo-Json -Depth 8
docker logs assetslake-ha-maintenance --tail 120
```

Failover notes:

- PostgreSQL has a hot standby mirror. Compose does not include automatic primary election. Promote manually with `docker exec assetslake-postgres-replica pg_ctl promote -D /var/lib/postgresql/data`, then point `DATABASE_URL` at `postgres-replica`.
- MinIO mirroring is one-way from primary to mirror. For a primary outage, point `MINIO_ENDPOINT` at `http://minio-mirror:9000` and use `MINIO_PUBLIC_ENDPOINT=http://localhost:9010` for local clients.
- Qdrant is accessed through `qdrant-lb`, which routes to the primary and falls back to the replica for HTTP traffic. A two-peer cluster satisfies the requested single mirror, but production-grade consensus availability should use an odd number of voters.
- Existing Qdrant collections keep their previous replication factor until migrated. For the default RAG collection, use `/cluster` and `/collections/assetslake_operation_memories/cluster` to find the primary and mirror peer IDs, then call `POST /collections/assetslake_operation_memories/cluster` with `{"replicate_shard":{"shard_id":0,"from_peer_id":PRIMARY_PEER_ID,"to_peer_id":MIRROR_PEER_ID}}`.

Batch maintenance settings:

```env
HA_MAINTENANCE_INTERVAL_SECONDS=300
HA_MAINTENANCE_MAX_STALENESS_SECONDS=900
HA_POSTGRES_LAG_WARN_BYTES=104857600
HA_QDRANT_COLLECTIONS=assetslake_operation_memories
POSTGRES_AI_REPLICA_USER=assetslake_ai_replica
POSTGRES_AI_REPLICA_PASSWORD=assetslake_ai_replica_secret
MINIO_AI_REPLICA_USER=assetslake_ai_replica
MINIO_AI_REPLICA_PASSWORD=assetslake_ai_replica_secret
QDRANT_REPLICA_URL=http://qdrant-replica:6333
AI_REPLICA_WRITE_ENABLED=true
AI_REPLICA_QDRANT_URL=http://qdrant-replica:6333
AI_REPLICA_ACTION_COLLECTION=assetslake_ai_replica_actions
AI_REPLICA_VECTOR_SIZE=64
```

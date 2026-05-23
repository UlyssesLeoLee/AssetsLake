#!/usr/bin/env bash
# ```cypher
# CREATE
#   (f:File {name: "ha-maintenance.sh", type: "file", language: "bash"}),
#   (fn1:Function {name: "log", type: "function", language: "bash", signature: "log(level, message)"}),
#   (fn2:Function {name: "postgres_value", type: "function", language: "bash", signature: "postgres_value(host, user, password, sql)"}),
#   (fn3:Function {name: "maintain_postgres", type: "function", language: "bash", signature: "maintain_postgres()"}),
#   (fn4:Function {name: "maintain_minio", type: "function", language: "bash", signature: "maintain_minio()"}),
#   (fn5:Function {name: "qdrant_json", type: "function", language: "bash", signature: "qdrant_json(path)"}),
#   (fn6:Function {name: "maintain_qdrant_collection", type: "function", language: "bash", signature: "maintain_qdrant_collection(collection)"}),
#   (fn7:Function {name: "maintain_qdrant", type: "function", language: "bash", signature: "maintain_qdrant()"}),
#   (fn8:Function {name: "run_cycle", type: "function", language: "bash", signature: "run_cycle()"}),
#   (fn9:Function {name: "main", type: "function", language: "bash", signature: "main()"}),
#   (v1:Variable {name: "HA_MAINTENANCE_INTERVAL_SECONDS", type: "variable"}),
#   (v2:Variable {name: "HA_POSTGRES_LAG_WARN_BYTES", type: "variable"}),
#   (v3:Variable {name: "HA_QDRANT_COLLECTIONS", type: "variable"}),
#   (v4:Variable {name: "QDRANT_REPLICATION_FACTOR", type: "variable"}),
#   (v5:Variable {name: "QDRANT_REPLICA_URL", type: "variable"}),
#   (f)-[:CONTAINS]->(fn1),
#   (f)-[:CONTAINS]->(fn2),
#   (f)-[:CONTAINS]->(fn3),
#   (f)-[:CONTAINS]->(fn4),
#   (f)-[:CONTAINS]->(fn5),
#   (f)-[:CONTAINS]->(fn6),
#   (f)-[:CONTAINS]->(fn7),
#   (f)-[:CONTAINS]->(fn8),
#   (f)-[:CONTAINS]->(fn9),
#   (fn3)-[:CALLS]->(fn1),
#   (fn3)-[:CALLS]->(fn2),
#   (fn4)-[:CALLS]->(fn1),
#   (fn5)-[:CALLS]->(fn1),
#   (fn6)-[:CALLS]->(fn1),
#   (fn6)-[:CALLS]->(fn5),
#   (fn7)-[:CALLS]->(fn1),
#   (fn7)-[:CALLS]->(fn6),
#   (fn8)-[:CALLS]->(fn3),
#   (fn8)-[:CALLS]->(fn4),
#   (fn8)-[:CALLS]->(fn7),
#   (fn9)-[:CALLS]->(fn8),
#   (fn9)-[:USES]->(v1),
#   (fn3)-[:USES]->(v2),
#   (fn7)-[:USES]->(v3),
#   (fn7)-[:USES]->(v4),
#   (fn6)-[:USES]->(v5);
# ```

set -Eeuo pipefail

HA_MAINTENANCE_INTERVAL_SECONDS="${HA_MAINTENANCE_INTERVAL_SECONDS:-300}"
HA_POSTGRES_LAG_WARN_BYTES="${HA_POSTGRES_LAG_WARN_BYTES:-104857600}"
HA_QDRANT_COLLECTIONS="${HA_QDRANT_COLLECTIONS:-assetslake_operation_memories}"
HA_STATUS_FILE="${HA_STATUS_FILE:-/tmp/ha-maintenance.ok}"

POSTGRES_DB="${POSTGRES_DB:-assetslake}"
POSTGRES_AI_REPLICA_USER="${POSTGRES_AI_REPLICA_USER:-assetslake_ai_replica}"
POSTGRES_AI_REPLICA_PASSWORD="${POSTGRES_AI_REPLICA_PASSWORD:-assetslake_ai_replica_secret}"

MINIO_AI_REPLICA_USER="${MINIO_AI_REPLICA_USER:-assetslake_ai_replica}"
MINIO_AI_REPLICA_PASSWORD="${MINIO_AI_REPLICA_PASSWORD:-assetslake_ai_replica_secret}"
MINIO_BUCKET="${MINIO_BUCKET:-art-assets}"

QDRANT_URL="${QDRANT_URL:-http://qdrant-lb:6333}"
QDRANT_REPLICA_URL="${QDRANT_REPLICA_URL:-http://qdrant-replica:6333}"
QDRANT_REPLICATION_FACTOR="${QDRANT_REPLICATION_FACTOR:-2}"

log() {
  local level="$1"
  shift
  printf '%s [%s] %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$level" "$*"
}

postgres_value() {
  local host="$1"
  local user="$2"
  local password="$3"
  local sql="$4"

  PGPASSWORD="$password" psql \
    -h "$host" \
    -U "$user" \
    -d "$POSTGRES_DB" \
    -v ON_ERROR_STOP=1 \
    -tAc "$sql"
}

maintain_postgres() {
  log info "checking PostgreSQL streaming mirror"

  local streaming_count
  streaming_count="$(postgres_value postgres "$POSTGRES_AI_REPLICA_USER" "$POSTGRES_AI_REPLICA_PASSWORD" "SELECT count(*) FROM pg_stat_replication WHERE state = 'streaming';")"
  if [ "${streaming_count:-0}" -lt 1 ]; then
    log warn "PostgreSQL has no streaming replica"
    return 1
  fi

  local lag_bytes
  lag_bytes="$(postgres_value postgres "$POSTGRES_AI_REPLICA_USER" "$POSTGRES_AI_REPLICA_PASSWORD" "SELECT COALESCE(max(pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)), 0)::bigint FROM pg_stat_replication;")"
  if [ "${lag_bytes:-0}" -gt "$HA_POSTGRES_LAG_WARN_BYTES" ]; then
    log warn "PostgreSQL replica lag is ${lag_bytes} bytes, threshold is ${HA_POSTGRES_LAG_WARN_BYTES}"
  else
    log info "PostgreSQL replica lag is ${lag_bytes} bytes"
  fi

  local in_recovery
  in_recovery="$(postgres_value postgres-replica "$POSTGRES_AI_REPLICA_USER" "$POSTGRES_AI_REPLICA_PASSWORD" "SELECT pg_is_in_recovery();")"
  if [ "$in_recovery" != "t" ]; then
    log warn "PostgreSQL mirror is not in recovery mode"
    return 1
  fi
}

maintain_minio() {
  log info "reconciling MinIO primary bucket to mirror bucket"

  mc alias set local http://minio:9000 "$MINIO_AI_REPLICA_USER" "$MINIO_AI_REPLICA_PASSWORD" >/dev/null
  mc alias set mirror http://minio-mirror:9000 "$MINIO_AI_REPLICA_USER" "$MINIO_AI_REPLICA_PASSWORD" >/dev/null
  mc mirror --overwrite --remove "local/${MINIO_BUCKET}" "mirror/${MINIO_BUCKET}" >/tmp/ha-minio-mirror.log

  log info "MinIO mirror reconciliation completed"
}

qdrant_json() {
  local path="$1"
  curl -fsS "${QDRANT_URL%/}${path}"
}

maintain_qdrant_collection() {
  local collection="$1"
  local cluster_json="$2"

  local collection_json
  if ! collection_json="$(qdrant_json "/collections/${collection}/cluster")"; then
    log warn "Qdrant collection ${collection} is not available for cluster maintenance"
    return 0
  fi

  local current_peer
  current_peer="$(jq -r '.result.peer_id' <<<"$collection_json")"
  local target_peer
  target_peer="$(jq -r --arg current "$current_peer" '.result.peers | keys[] | select(. != $current) | select(length > 0)' <<<"$cluster_json" | head -n 1)"

  if [ -z "$target_peer" ]; then
    log warn "Qdrant has no mirror peer available for ${collection}"
    return 1
  fi

  local shard_id
  while IFS= read -r shard_id; do
    [ -n "$shard_id" ] || continue

    local remote_count
    remote_count="$(jq -r --argjson shard "$shard_id" '[.result.remote_shards[]? | select(.shard_id == $shard and .state == "Active")] | length' <<<"$collection_json")"
    if [ "$remote_count" -gt 0 ]; then
      log info "Qdrant collection ${collection} shard ${shard_id} already has an active mirror"
      continue
    fi

    log warn "Qdrant collection ${collection} shard ${shard_id} has no active mirror; replicating to peer ${target_peer}"
    curl -fsS \
      -X POST \
      -H 'Content-Type: application/json' \
      -d "{\"replicate_shard\":{\"shard_id\":${shard_id},\"from_peer_id\":${current_peer},\"to_peer_id\":${target_peer}}}" \
      "${QDRANT_REPLICA_URL%/}/collections/${collection}/cluster?timeout=30" >/dev/null
  done < <(jq -r '.result.local_shards[]?.shard_id' <<<"$collection_json")
}

maintain_qdrant() {
  log info "checking Qdrant cluster mirror state"

  if [ "$QDRANT_REPLICATION_FACTOR" -lt 2 ]; then
    log info "Qdrant replication factor is ${QDRANT_REPLICATION_FACTOR}; mirror repair skipped"
    return 0
  fi

  local cluster_json
  cluster_json="$(qdrant_json /cluster)"
  local peer_count
  peer_count="$(jq -r '.result.peers | length' <<<"$cluster_json")"
  if [ "$peer_count" -lt 2 ]; then
    log warn "Qdrant cluster has ${peer_count} peer(s), expected at least 2"
    return 1
  fi

  local collection
  IFS=',' read -ra collections <<<"$HA_QDRANT_COLLECTIONS"
  for collection in "${collections[@]}"; do
    collection="$(xargs <<<"$collection")"
    [ -n "$collection" ] || continue
    maintain_qdrant_collection "$collection" "$cluster_json"
  done
}

run_cycle() {
  local failed=0

  maintain_postgres || failed=1
  maintain_minio || failed=1
  maintain_qdrant || failed=1

  if [ "$failed" -eq 0 ]; then
    date -u +'%s' >"$HA_STATUS_FILE"
    log info "HA maintenance cycle completed"
  else
    log warn "HA maintenance cycle completed with warnings"
  fi

  return "$failed"
}

main() {
  log info "starting HA maintenance batch loop, interval=${HA_MAINTENANCE_INTERVAL_SECONDS}s"

  while true; do
    run_cycle || true
    sleep "$HA_MAINTENANCE_INTERVAL_SECONDS"
  done
}

main "$@"

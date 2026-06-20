# AssetsLake — AI Art Asset Management Platform

> Production-grade asset pipeline for game studios, animation teams, and outsourcing workflows.
> MinIO object storage · PostgreSQL metadata · Rust/Actix-Web API · Next.js interface · AI-extensible.

---

## Project Positioning

AssetsLake is an **Asset Lake / AI Asset Management** platform designed for:

- **Game art outsourcing pipelines** — manage deliverables from external studios with status tracking, review workflows, and version history
- **Game R&D teams** — centralize all art assets (3D models, textures, VFX, audio, shaders) with project-level organization
- **Film & animation production** — manage concept art, animatics, renders, and final deliverables across departments
- **Enterprise art asset management** — structured metadata, tagging taxonomy, lifecycle management, and future AI integration

The platform is intentionally designed with **clear extension boundaries** for AI features (vector search, auto-tagging, dependency graphs, event pipelines) that are stubbed in the current implementation and ready for production wiring.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AssetsLake Monorepo                         │
│                                                                     │
│  ┌──────────────┐      ┌─────────────────┐      ┌──────────────┐  │
│  │  Next.js     │ HTTP │  Rust/Actix-Web  │ SQL  │  PostgreSQL  │  │
│  │  Frontend    │─────▶│  Backend API     │─────▶│  Metadata DB │  │
│  │  :3000       │      │  :8080           │      │  :5432       │  │
│  └──────────────┘      └────────┬────────┘      └──────────────┘  │
│                                  │ S3 API                           │
│                         ┌────────▼────────┐                        │
│                         │     MinIO        │                        │
│                         │  Object Storage  │                        │
│                         │  :9000 (API)     │                        │
│                         │  :9001 (Console) │                        │
│                         └─────────────────┘                        │
│                                                                     │
│  ── Future Extensions (stubs ready) ──────────────────────────     │
│  Qdrant (vector search)  ·  OpenSearch (full-text)                 │
│  Neo4j (dependency graph)  ·  Kafka (event pipeline)               │
│  Thumbnail Worker  ·  AI Auto-Tagger  ·  Audit Pipeline            │
└─────────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
AssetsLake/
├── frontend/               # Next.js 14 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # UI components (assets, upload, ui, shared, layout)
│   │   ├── hooks/          # React Query hooks
│   │   ├── lib/            # API client, utilities
│   │   └── types/          # TypeScript types
│   └── Dockerfile
├── backend/                # Rust + Actix-Web
│   ├── src/
│   │   ├── config.rs       # Environment configuration
│   │   ├── errors.rs       # Unified error types and API response shapes
│   │   ├── handlers/       # HTTP request handlers
│   │   ├── models/         # Data models
│   │   ├── repositories/   # PostgreSQL queries
│   │   ├── routes/         # Route configuration
│   │   └── services/       # Business logic + extension stubs
│   │       ├── asset_service.rs        # Upload, list, search, CRUD
│   │       ├── storage_service.rs      # MinIO S3 operations
│   │       ├── ai_index_service.rs     # Stub: Qdrant vector indexing
│   │       ├── search_index_service.rs # Stub: OpenSearch indexing
│   │       ├── graph_relation_service.rs # Stub: Neo4j dependency graph
│   │       └── event_publisher_service.rs # Stub: Kafka event publishing
│   └── Dockerfile
├── database/
│   └── migrations/
│       └── 001_init_schema.sql   # Full PostgreSQL schema
├── infra/
│   ├── docker-compose.yml
│   └── .env.example
└── README.md
```

---

## MinIO Role in the System

MinIO serves as the **binary object store** — the authoritative location for all actual asset files.

- Every uploaded file (`.fbx`, `.blend`, `.png`, `.psd`, `.wav`, `.mp4`, `.zip`, etc.) is stored in MinIO
- Objects are organized by type and date: `textures/2024/06/15/{uuid}.png`
- PostgreSQL stores only the **reference** (`bucket` + `object_key` + `file_url`) — never binary data
- Object keys are globally unique (UUID-based), preventing collisions across projects
- MinIO's S3-compatible API enables future migration to AWS S3, GCS, or Azure Blob with zero code changes
- Soft-deletes in PostgreSQL mark assets as deleted without touching MinIO objects; hard purge is a separate scheduled operation

---

## PostgreSQL Role in the System

PostgreSQL manages all **structured metadata** about assets:

- Asset identity: name, filename, description, MIME type, file size, SHA-256 checksum
- Classification: `asset_type` enum, `tags[]` array, `ai_tags[]` array
- Storage reference: `bucket`, `object_key`, `file_url`
- Versioning: `version` integer, `parent_id` FK, full `asset_versions` history table
- Project organization: `project_id` FK to `projects` table
- Lifecycle: `status` enum (pending → active → archived/rejected), `reviewed_by`, `reviewed_at`, `review_note`
- Search hooks: `embedding_id` (Qdrant), `search_doc_id` (OpenSearch), `graph_node_id` (Neo4j)
- Audit trail: append-only `audit_log` table
- Soft delete: `deleted_at` timestamp with partial indexes

---

## Quick Start

### Prerequisites

- Docker and Docker Compose v2+

### 1. Configure

```bash
cp infra/.env.example infra/.env
# Edit infra/.env if needed
```

### 2. Start All Services

```bash
cd infra
docker compose up -d
```

| Service       | URL                   | Purpose                      |
| ------------- | --------------------- | ---------------------------- |
| Frontend      | http://localhost:3000 | Next.js management UI        |
| Backend API   | http://localhost:8080 | Rust/Actix-Web REST API      |
| MinIO API     | http://localhost:9000 | S3-compatible object storage |
| MinIO Console | http://localhost:9001 | MinIO web management         |
| PostgreSQL    | localhost:5432        | Metadata database            |

### 3. Verify

```bash
curl http://localhost:8080/api/health
# {"status":"ok","service":"assetslake-backend","version":"0.1.0"}
```

### Kubernetes Microservices

The backend image supports route-scoped service roles through `ASSETSLAKE_SERVICE`.
Docker Compose keeps `gateway` for local compatibility, while Kubernetes runs separate
Deployments and Services:

| Service Role | Routes                                                     |
| ------------ | ---------------------------------------------------------- |
| `assets`     | `/api/assets`, `/api/assets/search`, `/api/assets/upload`  |
| `production` | `/api/issues`, `/api/milestones`, `/api/delivery-packages` |
| `projects`   | `/api/projects`                                            |

Kubernetes manifests live under `infra/k8s`:

```bash
kubectl apply -k infra/k8s
```

The default Ingress hosts are `assetslake.local`, `minio.assetslake.local`, and
`minio-console.assetslake.local`. Build or retag local images as
`assetslake-backend:latest` and `assetslake-frontend:latest` before applying to a
local cluster.

### Frontend Plugin Groups

Frontend navigation and feature ownership are defined in
`frontend/src/plugin-groups`. The frontend product architecture is declared as:

`ProductArchitecture -> PluginApp -> PluginGroup -> Plugin -> PluginRoute`

Each product contains multiple plugin apps, each app is composed from multiple
plugin groups, each group owns multiple plugins, and plugins expose page routes.
Plugin groups define feature ownership, while failure-prone capabilities run
through the failure-isolation kernel in `frontend/src/plugin-groups/failure-isolation-kernel.ts`.
The kernel keeps plugin-to-plugin calls out of the core path by registering
capability contracts with input/output schemas, kernel compatibility, timeout,
idempotency, retry, and fallback policies, then executing requests through a
correlated kernel boundary instead of direct plugin chaining.
The production app is split into management, planning, execution, timeline,
reporting, workflow, delivery, and enterprise plugin groups. It includes
`/management`, `/planning`, `/board`, `/issues`, `/reviews`, `/approvals`,
`/gantt`, `/calendar`, `/reports`, `/workflow`, `/automation`, `/delivery-packages`,
and `/enterprise` surfaces. The backend exposes `/api/project-management/*`
boundaries for plans, epics, sprints, dependencies, issue events, Gantt,
calendar, reports, workflow, automation, and enterprise controls. The final-phase
architecture and regression contracts are in place; deep Jira-style behavior
such as drag scheduling, workflow editing, automation execution, permissions UI,
notifications, and import/export execution remains staged in the roadmap. The
phased plan is tracked in
`docs/project-management-roadmap.md`. App Router pages stay as thin route
adapters. From `frontend/`, run `pnpm run test:ut` for the architecture unit
test, `pnpm run test:it` for the cross-layer management contract test,
`pnpm run test:smoke` for the live backend/MinIO data lake smoke test, or
`pnpm run test:all` for the frontend test bundle. Set
`SMOKE_REQUIRE_MANAGEMENT=1` when the deployed backend image includes the
management intelligence endpoint and that route should be part of live smoke.
From `backend/`, run
`cargo +1.91.1-x86_64-pc-windows-msvc test management_intelligence_endpoint_returns_contract`
to verify the management intelligence endpoint through Actix.

---

## Accessing Services

**Frontend** — http://localhost:3000

- `/` Home, `/assets` Library, `/upload` Upload, `/assets/{id}` Detail

**MinIO Console** — http://localhost:9001

- Username: `minioadmin` / Password: `minioadmin_secret` (default, configurable via `.env`)

**Backend API** — http://localhost:8080/api

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| GET    | `/api/health`        | Health check                       |
| POST   | `/api/assets/upload` | Upload asset (multipart/form-data) |
| GET    | `/api/assets`        | List assets (paginated, filtered)  |
| GET    | `/api/assets/search` | Full-text search                   |
| GET    | `/api/assets/{id}`   | Asset detail                       |
| PATCH  | `/api/assets/{id}`   | Update metadata                    |
| DELETE | `/api/assets/{id}`   | Soft-delete                        |

---

## Environment Variables

All variables documented in `infra/.env.example`:

```dotenv
POSTGRES_DB=assetslake
POSTGRES_USER=assetslake
POSTGRES_PASSWORD=assetslake_secret
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin_secret
MINIO_BUCKET=art-assets
MINIO_PUBLIC_ENDPOINT=http://localhost:9000
MAX_UPLOAD_SIZE_MB=500
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Testing Uploads

### Upload PNG

```bash
curl -X POST http://localhost:8080/api/assets/upload \
  -F "file=@texture.png" \
  -F "name=Dragon Scale Texture" \
  -F "tags=dragon,pbr,4k" \
  -F "uploader=artist.name"
```

### Upload FBX

```bash
curl -X POST http://localhost:8080/api/assets/upload \
  -F "file=@character.fbx" \
  -F "name=Dragon Character Rig" \
  -F "tags=character,rigged,fbx" \
  -F "uploader=3d.artist"
```

### Upload PSD

```bash
curl -X POST http://localhost:8080/api/assets/upload \
  -F "file=@concept.psd" \
  -F "name=Environment Concept Art" \
  -F "tags=concept,environment" \
  -F "uploader=concept.artist"
```

### Upload ZIP

```bash
curl -X POST http://localhost:8080/api/assets/upload \
  -F "file=@asset_pack.zip" \
  -F "name=UI Asset Pack v2" \
  -F "tags=ui,icons,pack" \
  -F "uploader=ui.designer"
```

### List and Filter

```bash
curl "http://localhost:8080/api/assets?asset_type=3d_model&status=pending"
curl "http://localhost:8080/api/assets/search?q=dragon"
curl "http://localhost:8080/api/assets?tag=pbr&page=2&page_size=12"
```

---

## Currently Implemented

| Capability                                                                | Status |
| ------------------------------------------------------------------------- | ------ |
| File upload to MinIO (all formats)                                        | ✅     |
| SHA-256 checksum on upload                                                | ✅     |
| MIME + extension type detection                                           | ✅     |
| Object key: `type/date/uuid.ext`                                          | ✅     |
| PostgreSQL metadata record                                                | ✅     |
| Paginated asset list                                                      | ✅     |
| Filter by type, status, project, tag                                      | ✅     |
| Full-text search                                                          | ✅     |
| Asset detail                                                              | ✅     |
| Soft-delete                                                               | ✅     |
| Metadata update (PATCH)                                                   | ✅     |
| `asset_versions` table (schema)                                           | ✅     |
| `audit_log` table (schema)                                                | ✅     |
| `asset_uploaded` hook (logs)                                              | ✅     |
| AI/search/graph extension stubs                                           | ✅     |
| Frontend grid + table view                                                | ✅     |
| Frontend upload with progress                                             | ✅     |
| Frontend image/video/audio preview                                        | ✅     |
| Frontend filter sidebar                                                   | ✅     |
| Frontend pagination                                                       | ✅     |
| Plugin app/group architecture through project management Phase 5          | ✅     |
| Project management planning/productization API boundaries                 | ✅     |
| Gantt, calendar, reports, workflow, automation, enterprise route surfaces | ✅     |
| Issue core loop: edit, comments, work logs, soft delete, planning fields  | ✅     |
| Frontend empty + loading states                                           | ✅     |
| Docker Compose full stack                                                 | ✅     |
| MinIO bucket auto-init                                                    | ✅     |
| PostgreSQL schema auto-init                                               | ✅     |

---

## Extension Roadmap

### Qdrant — Vector Similarity Search

Stub: `ai_index_service.rs` · Column: `embedding_id` · Use case: "Find Similar Assets"

### OpenSearch — Full-Text & Tag Search

Stub: `search_index_service.rs` · Column: `search_doc_id` · Replaces interim ILIKE search

### Neo4j — Asset Dependency Graph

Stub: `graph_relation_service.rs` · Column: `graph_node_id` · Use case: impact analysis before deletion

### Kafka — Event Pipeline

Stub: `event_publisher_service.rs` · Events: `AssetUploadedEvent`, `AssetDeletedEvent` · Consumers: thumbnail worker, AI tagger, audit pipeline

### Thumbnail Generation

Column: `preview_url` reserved · Workflow: `asset_uploaded` → Kafka → thumbnail worker → MinIO → update preview_url

### AI Auto-Tagging

Column: `ai_tags[]` reserved · Workflow: `asset_uploaded` → AI model → PATCH ai_tags

### Version Comparison

Table: `asset_versions` fully schemaed · FK: `parent_id` on assets

### Review Workflow

Columns: `reviewed_by`, `reviewed_at`, `review_note` · Status: `pending → active | rejected`

### Outsourcing Delivery

Project-level approval → ZIP export → client-facing expiring links

### Role-Based Access Control

Table: `users` with `role` column · Future: JWT middleware + per-project permissions

---

## License

MIT

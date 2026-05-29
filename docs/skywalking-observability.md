# SkyWalking APM Companion

AssetsLake keeps SkyWalking as the trace/APM companion for the Kiali topology app. The live runtime topology is now documented in [Kiali Runtime Topology](kiali-observability.md).

AssetsLake deploys SkyWalking as an in-cluster APM stack:

- `assetslake-skywalking-banyandb`: SkyWalking storage.
- `assetslake-skywalking-oap`: OAP backend and OTLP trace receiver.
- `assetslake-skywalking-ui`: SkyWalking web UI.
- `assetslake-observability-frontend`: AssetsLake-styled wrapper app that embeds Kiali and links to SkyWalking.

Access points:

- AssetsLake app: `http://assetslake.local/app/observability`
- Raw SkyWalking host: `http://observability.assetslake.local/dashboard/GENERAL/All/General-Root`
- Local AssetsLake app: `http://localhost:3000/observability`
- Local raw SkyWalking UI: `http://localhost:18088/dashboard/GENERAL/All/General-Root`

SkyWalking trace views are generated from real spans. Each Rust API service exports Actix request spans through OTLP/gRPC to OAP at `assetslake-skywalking-oap:11800`. Internal API calls use W3C `traceparent` propagation, so production-to-assets validation calls can be inspected when those workflows execute.

Required service env:

- `OTEL_TRACES_ENABLED=true`
- `OTEL_EXPORTER_OTLP_ENDPOINT=http://assetslake-skywalking-oap:11800`
- `OTEL_EXPORTER_OTLP_PROTOCOL=grpc`
- `OTEL_SERVICE_NAME=assetslake-<domain>-api`

Validation:

```powershell
kubectl apply -k infra/k8s
kubectl -n assetslake get pods -l app.kubernetes.io/part-of=assetslake-observability
kubectl -n assetslake port-forward svc/assetslake-observability-frontend 3000:3000
kubectl -n assetslake port-forward svc/assetslake-skywalking-ui 8088:8080
```

Then open `http://localhost:3000/observability` for the AssetsLake app shell, or `http://localhost:8088` for the raw SkyWalking UI. Exercise a cross-service workflow such as issue asset linking, and check SkyWalking traces for `assetslake-production-api -> assetslake-assets-api`.

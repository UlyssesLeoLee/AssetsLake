# Kiali Runtime Topology

AssetsLake uses Kiali as the primary runtime topology app for the Kubernetes cluster. SkyWalking stays in the stack for trace/APM drilldown, while Kiali reads Istio mesh telemetry from Prometheus and renders the live service graph.

## Components

- `assetslake-kiali`: in-cluster Kiali UI, mounted at `/kiali`.
- `assetslake-prometheus`: local Prometheus instance scraping Istio sidecar metrics.
- `assetslake-topology-traffic`: low-rate traffic generator that calls AssetsLake frontends and APIs so the graph has fresh runtime edges.
- `assetslake-observability-frontend`: AssetsLake-styled app page that embeds Kiali and links to SkyWalking.

## Prerequisites

Install Istio before applying the AssetsLake overlay. The namespace is labeled with `istio-injection=enabled`, so new Pods get Envoy sidecars. Existing Pods must be restarted once to appear as full mesh workloads.

```powershell
kubectl get deploy -n istio-system istiod
kubectl apply -k infra/k8s
kubectl -n assetslake rollout restart deployment
```

## Open The Topology

Use the dedicated script for a local browser session:

```powershell
.\scripts\open-assetslake-topology.ps1 -RestartWorkloads
```

After the first sidecar-injection restart, later sessions can skip the restart:

```powershell
.\scripts\open-assetslake-topology.ps1
```

The integrated page is exposed at:

- Ingress: `http://assetslake.local/app/observability`
- Local port-forward: `http://localhost:3000/observability`
- Raw Kiali fallback: `http://localhost:20001/kiali/console/graph/namespaces?namespaces=assetslake&graphType=service&duration=300&refresh=15000`

## Notes

- Kiali is language-neutral; it observes Rust services through Istio sidecar telemetry, so Rust does not need a Kiali agent.
- Prometheus must scrape `istio_requests_total` from sidecars before the graph shows request-rate edges.
- The current Kiali config uses anonymous, view-only access for development. Put `/kiali` behind the gateway auth layer before exposing it beyond a local or private cluster.

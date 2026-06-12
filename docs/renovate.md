# Renovate dependency management

AssetsLake uses Renovate to keep application dependencies, lock files, container images, Kubernetes manifests, and explicitly annotated documentation references current.

## Managed sources

Renovate discovers these files with built-in managers:

- `frontend/package.json` and `frontend/pnpm-lock.yaml`
- `backend/Cargo.toml` and `backend/Cargo.lock`
- Dockerfiles and `infra/docker-compose.yml`
- Kubernetes YAML under `infra/k8s/`

The root `renovate.json` also defines an opt-in regex manager for dependency versions in `README.md` and `docs/**/*.md`. Ordinary prose, dates, ports, schema versions, and examples are not changed.

## Managed documentation references

Place the annotation immediately before a backtick-wrapped version. The table below contains working examples and is itself managed by Renovate:

| Component | Version |
| --- | --- |
| Next.js | <!-- renovate: datasource=npm depName=next --> `14.2.3` |
| Rust builder image | <!-- renovate: datasource=docker depName=rust --> `1.91.1-slim-bookworm` |
| Node.js image | <!-- renovate: datasource=docker depName=node --> `20-alpine` |
| PostgreSQL image | <!-- renovate: datasource=docker depName=postgres --> `16-alpine` |

Use a Renovate datasource name and the exact upstream dependency name. Add `versioning=<scheme>` only when the datasource default cannot parse the version correctly.

## Update policy

- Renovate creates a Dependency Dashboard issue for visibility and manual retries.
- Major updates remain on the dashboard until explicitly approved.
- Non-major npm/pnpm, Cargo, and container updates are grouped by ecosystem.
- Lock file maintenance runs monthly before 06:00 on the first day of the month, using the `Asia/Shanghai` timezone.
- Automatic merging is disabled. CI and human review remain required.
- At most five Renovate pull requests may be open and at most two may be created per hour.

Mutable tags such as `latest` do not provide deterministic deployments. Replace them with concrete tags before relying on Renovate for normal version updates. Digest pinning can be introduced separately after the resulting infrastructure-wide change has been reviewed.

## Enable the hosted app

1. Install the [Mend Renovate GitHub App](https://github.com/apps/renovate).
2. Select only the `UlyssesLeoLee/AssetsLake` repository unless broader access is intended.
3. Review the onboarding pull request and verify that it uses the committed `renovate.json`.
4. Merge the onboarding pull request only after its warnings are resolved.

Renovate does not create dependency update pull requests until onboarding is accepted. Closing the onboarding pull request opts the repository out without changing application code.

## Validation

Validate configuration changes before merging:

```powershell
npx --yes --package renovate -- renovate-config-validator --strict
```

After the app is enabled, use the Dependency Dashboard to request deferred major updates or retry a closed update.

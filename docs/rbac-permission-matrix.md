# RBAC Permission Matrix

Mutating API methods (`POST`, `PUT`, `PATCH`, `DELETE`) are guarded by the backend authorization middleware.

Public write exceptions are limited to login and verification bootstrap flows:

- `POST /api/auth/login`
- `POST /api/verification/challenges`
- `POST /api/verification/challenges/{id}/verify`
- `POST /api/verification/register`
- `POST /api/verification/password`

| Permission | admin | producer | artist | reviewer |
| --- | --- | --- | --- | --- |
| Authenticated write: logout and locks | yes | yes | yes | yes |
| Asset write | yes | yes | yes | no |
| Issue write | yes | yes | yes | no |
| Issue review actions | yes | yes | no | yes |
| Delivery package write | yes | yes | no | no |
| Project management write | yes | yes | no | no |
| Data lake SQL/Cypher query | yes | yes | no | yes |
| AI control and replica actions | yes | yes | no | no |
| Unknown mutating route fallback | yes | no | no | no |

Lock tokens are now stored as `lock_token_hash`; raw lock tokens are only returned at acquire, renew, and release time, or accepted through `x-assetslake-lock-token` for guarded writes.

Session and lock cleanup runs through the backend maintenance loop:

- Expired active locks are marked released.
- Old released locks are deleted after `RELEASED_LOCK_RETENTION_HOURS`.
- Revoked sessions and old expired sessions are deleted after `SESSION_RETENTION_HOURS`.

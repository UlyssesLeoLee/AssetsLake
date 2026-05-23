#!/usr/bin/env bash
# ```cypher
# CREATE
#   (f:File {name: "ha-healthcheck.sh", type: "file", language: "bash"}),
#   (fn1:Function {name: "main", type: "function", language: "bash", signature: "main()"}),
#   (v1:Variable {name: "HA_STATUS_FILE", type: "variable"}),
#   (v2:Variable {name: "HA_MAINTENANCE_MAX_STALENESS_SECONDS", type: "variable"}),
#   (f)-[:CONTAINS]->(fn1),
#   (fn1)-[:USES]->(v1),
#   (fn1)-[:USES]->(v2);
# ```

set -Eeuo pipefail

main() {
  local status_file="${HA_STATUS_FILE:-/tmp/ha-maintenance.ok}"
  local max_staleness="${HA_MAINTENANCE_MAX_STALENESS_SECONDS:-900}"

  [ -s "$status_file" ] || exit 1

  local last_ok
  last_ok="$(cat "$status_file")"
  [[ "$last_ok" =~ ^[0-9]+$ ]] || exit 1

  local now
  now="$(date -u +'%s')"
  [ $((now - last_ok)) -le "$max_staleness" ]
}

main "$@"

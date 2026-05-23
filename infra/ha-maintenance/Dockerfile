# ```cypher
# CREATE
#   (f:File {name: "Dockerfile", type: "file", language: "dockerfile"}),
#   (s1:Logic {name: "install_runtime_tools", type: "logic", language: "dockerfile", signature: "RUN apk add bash curl jq postgresql16-client ca-certificates"}),
#   (s2:Logic {name: "install_minio_client", type: "logic", language: "dockerfile", signature: "RUN curl -fsSL .../mc"}),
#   (s3:Logic {name: "copy_maintenance_script", type: "logic", language: "dockerfile", signature: "COPY ha-maintenance.sh /usr/local/bin/ha-maintenance"}),
#   (s4:Logic {name: "copy_healthcheck_script", type: "logic", language: "dockerfile", signature: "COPY ha-healthcheck.sh /usr/local/bin/ha-maintenance-healthcheck"}),
#   (f)-[:CONTAINS]->(s1),
#   (f)-[:CONTAINS]->(s2),
#   (f)-[:CONTAINS]->(s3),
#   (f)-[:CONTAINS]->(s4);
# ```

FROM alpine:3.20

RUN apk add --no-cache bash ca-certificates curl jq postgresql16-client

RUN curl -fsSL https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/mc \
    && chmod +x /usr/local/bin/mc

COPY ha-maintenance.sh /usr/local/bin/ha-maintenance
COPY ha-healthcheck.sh /usr/local/bin/ha-maintenance-healthcheck
RUN chmod +x /usr/local/bin/ha-maintenance /usr/local/bin/ha-maintenance-healthcheck

ENTRYPOINT ["/usr/local/bin/ha-maintenance"]

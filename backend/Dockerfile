# ─── Build stage ─────────────────────────────────────────────
FROM rust:1.91.1-slim-bookworm AS builder

WORKDIR /app

# Install system dependencies for OpenSSL / native-tls
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Cache dependencies layer
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main(){}" > src/main.rs
RUN cargo build --release 2>/dev/null || true
RUN rm src/main.rs

# Build application
COPY src ./src
RUN touch src/main.rs && cargo build --release

# ─── Runtime stage ────────────────────────────────────────────
FROM debian:bookworm-slim AS runtime

WORKDIR /app

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/assetslake-backend /app/assetslake-backend

EXPOSE 8080

CMD ["/app/assetslake-backend"]

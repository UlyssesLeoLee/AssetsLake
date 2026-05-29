/*
```cypher
CREATE
  (f:File {name: "telemetry_service.rs", type: "file", language: "rust"}),
  (m:Module {name: "crate::services::telemetry_service", type: "module"}),
  (c1:Class {name: "TelemetryGuard", type: "class", language: "rust", signature: "struct TelemetryGuard"}),
  (c2:Class {name: "RequestBuilderInjector", type: "class", language: "rust", signature: "struct RequestBuilderInjector"}),
  (fn1:Function {name: "init", type: "function", language: "rust", signature: "pub fn init(service: DomainService) -> TelemetryGuard"}),
  (fn2:Function {name: "inject_trace_context", type: "function", language: "rust", signature: "pub fn inject_trace_context(builder: reqwest::RequestBuilder) -> reqwest::RequestBuilder"}),
  (fn3:Function {name: "build_tracer_provider", type: "function", language: "rust", signature: "fn build_tracer_provider(service: DomainService) -> anyhow::Result<(SdkTracerProvider, String)>"}),
  (fn4:Function {name: "traces_enabled", type: "function", language: "rust", signature: "fn traces_enabled() -> bool"}),
  (fn5:Function {name: "service_name", type: "function", language: "rust", signature: "fn service_name(service: DomainService) -> String"}),
  (fn6:Function {name: "parse_bool_env", type: "function", language: "rust", signature: "fn parse_bool_env(key: &str) -> Option<bool>"}),
  (fn7:Function {name: "TelemetryGuard::drop", type: "function", language: "rust", signature: "fn drop(&mut self)"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (c1)-[:HAS_METHOD]->(fn7),
  (fn1)-[:CALLS]->(fn3),
  (fn1)-[:CALLS]->(fn4),
  (fn2)-[:USES]->(c2),
  (fn3)-[:CALLS]->(fn5),
  (fn4)-[:CALLS]->(fn6);
```
*/

use std::{env, time::Duration};

use opentelemetry::{global, propagation::Injector, trace::TracerProvider as _, KeyValue};
use opentelemetry_otlp::WithExportConfig;
use opentelemetry_sdk::{
    propagation::TraceContextPropagator,
    trace::{Sampler, SdkTracerProvider},
    Resource,
};
use tracing::{info, warn};
use tracing_opentelemetry::OpenTelemetrySpanExt;
use tracing_subscriber::{prelude::*, EnvFilter};

use crate::config::DomainService;

pub struct TelemetryGuard {
    tracer_provider: Option<SdkTracerProvider>,
}

pub fn init(service: DomainService) -> TelemetryGuard {
    global::set_text_map_propagator(TraceContextPropagator::new());

    let env_filter = EnvFilter::from_default_env()
        .add_directive(
            "assetslake_backend=info"
                .parse()
                .expect("valid tracing directive"),
        )
        .add_directive(
            "tracing_actix_web=info"
                .parse()
                .expect("valid tracing-actix-web directive"),
        );
    let fmt_layer = tracing_subscriber::fmt::layer().json();

    if !traces_enabled() {
        tracing_subscriber::registry()
            .with(env_filter)
            .with(fmt_layer)
            .init();
        return TelemetryGuard {
            tracer_provider: None,
        };
    }

    match build_tracer_provider(service) {
        Ok((tracer_provider, endpoint)) => {
            let tracer = tracer_provider.tracer("assetslake-backend");
            let otel_layer = tracing_opentelemetry::layer().with_tracer(tracer);

            tracing_subscriber::registry()
                .with(env_filter)
                .with(fmt_layer)
                .with(otel_layer)
                .init();

            info!(
                endpoint = %endpoint,
                service = service.as_str(),
                "OpenTelemetry trace export enabled"
            );

            TelemetryGuard {
                tracer_provider: Some(tracer_provider),
            }
        }
        Err(error) => {
            tracing_subscriber::registry()
                .with(env_filter)
                .with(fmt_layer)
                .init();
            warn!(error = %error, "OpenTelemetry trace export disabled");
            TelemetryGuard {
                tracer_provider: None,
            }
        }
    }
}

pub fn inject_trace_context(builder: reqwest::RequestBuilder) -> reqwest::RequestBuilder {
    let context = tracing::Span::current().context();
    let mut injector = RequestBuilderInjector {
        builder: Some(builder),
    };

    global::get_text_map_propagator(|propagator| {
        propagator.inject_context(&context, &mut injector);
    });

    injector
        .builder
        .expect("request builder is restored after injection")
}

fn build_tracer_provider(service: DomainService) -> anyhow::Result<(SdkTracerProvider, String)> {
    let endpoint = env::var("OTEL_EXPORTER_OTLP_TRACES_ENDPOINT")
        .or_else(|_| env::var("OTEL_EXPORTER_OTLP_ENDPOINT"))
        .unwrap_or_else(|_| "http://assetslake-skywalking-oap:11800".to_string());
    let timeout = env::var("OTEL_EXPORTER_OTLP_TIMEOUT_SECONDS")
        .ok()
        .and_then(|value| value.parse::<u64>().ok())
        .unwrap_or(3);
    let service_name = service_name(service);

    let exporter = opentelemetry_otlp::SpanExporter::builder()
        .with_tonic()
        .with_endpoint(endpoint.clone())
        .with_timeout(Duration::from_secs(timeout))
        .build()?;

    let tracer_provider = SdkTracerProvider::builder()
        .with_batch_exporter(exporter)
        .with_sampler(Sampler::AlwaysOn)
        .with_resource(
            Resource::builder()
                .with_service_name(service_name)
                .with_attributes([
                    KeyValue::new("service.namespace", "assetslake"),
                    KeyValue::new("assetslake.domain_service", service.as_str()),
                ])
                .build(),
        )
        .build();

    Ok((tracer_provider, endpoint))
}

fn traces_enabled() -> bool {
    if parse_bool_env("OTEL_SDK_DISABLED").unwrap_or(false) {
        return false;
    }

    parse_bool_env("OTEL_TRACES_ENABLED").unwrap_or(false)
}

fn service_name(service: DomainService) -> String {
    env::var("OTEL_SERVICE_NAME")
        .ok()
        .filter(|value| !value.trim().is_empty())
        .unwrap_or_else(|| format!("assetslake-{}-api", service.as_str()))
}

fn parse_bool_env(key: &str) -> Option<bool> {
    env::var(key).ok().map(|value| {
        matches!(
            value.trim().to_ascii_lowercase().as_str(),
            "1" | "true" | "yes" | "on"
        )
    })
}

impl Drop for TelemetryGuard {
    fn drop(&mut self) {
        if let Some(provider) = &self.tracer_provider {
            if let Err(error) = provider.shutdown() {
                eprintln!("failed to shut down OpenTelemetry tracer provider: {error}");
            }
        }
    }
}

struct RequestBuilderInjector {
    builder: Option<reqwest::RequestBuilder>,
}

impl Injector for RequestBuilderInjector {
    fn set(&mut self, key: &str, value: String) {
        if let Some(builder) = self.builder.take() {
            self.builder = Some(builder.header(key, value));
        }
    }
}

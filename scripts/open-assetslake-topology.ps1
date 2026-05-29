<#
```cypher
CREATE
  (f:File {name: "open-assetslake-topology.ps1", type: "file", language: "powershell"}),
  (m:Module {name: "scripts.open-assetslake-topology", type: "module"}),
  (fn1:Function {name: "Invoke-RequiredCommand", type: "function", language: "powershell", signature: "function Invoke-RequiredCommand([string]$CommandName)"}),
  (fn2:Function {name: "Invoke-Kubectl", type: "function", language: "powershell", signature: "function Invoke-Kubectl([string[]]$Arguments)"}),
  (fn3:Function {name: "Test-KubernetesResource", type: "function", language: "powershell", signature: "function Test-KubernetesResource([string[]]$Arguments)"}),
  (fn4:Function {name: "Test-LocalPortOpen", type: "function", language: "powershell", signature: "function Test-LocalPortOpen([int]$Port)"}),
  (fn5:Function {name: "Get-FreePort", type: "function", language: "powershell", signature: "function Get-FreePort([int]$PreferredPort)"}),
  (fn6:Function {name: "Start-KubectlPortForward", type: "function", language: "powershell", signature: "function Start-KubectlPortForward([string]$ServiceName, [int]$LocalPort, [int]$RemotePort)"}),
  (fn7:Function {name: "Wait-HttpReady", type: "function", language: "powershell", signature: "function Wait-HttpReady([string]$Name, [string]$Url, [int]$TimeoutSeconds)"}),
  (fn8:Function {name: "Restart-AssetsLakeWorkloads", type: "function", language: "powershell", signature: "function Restart-AssetsLakeWorkloads()"}),
  (fn9:Function {name: "Show-TopologySummary", type: "function", language: "powershell", signature: "function Show-TopologySummary([string]$PageUrl, [string]$KialiUrl)"}),
  (v1:Variable {name: "Namespace", type: "variable"}),
  (v2:Variable {name: "RepoRoot", type: "variable"}),
  (v3:Variable {name: "K8sDir", type: "variable"}),
  (v4:Variable {name: "KialiGraphPath", type: "variable"}),
  (v5:Variable {name: "KialiLocalPort", type: "variable"}),
  (v6:Variable {name: "FrontendLocalPort", type: "variable"}),
  (v7:Variable {name: "PageUrl", type: "variable"}),
  (v8:Variable {name: "KialiUrl", type: "variable"}),
  (v9:Variable {name: "Arguments", type: "variable"}),
  (v10:Variable {name: "Port", type: "variable"}),
  (v11:Variable {name: "ServiceName", type: "variable"}),
  (v12:Variable {name: "DeploymentNames", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
  (m)-[:CONTAINS]->(fn8),
  (m)-[:CONTAINS]->(fn9),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v5),
  (m)-[:USES]->(v6),
  (m)-[:USES]->(v7),
  (m)-[:USES]->(v8),
  (m)-[:CALLS]->(fn1),
  (m)-[:CALLS]->(fn2),
  (m)-[:CALLS]->(fn3),
  (m)-[:CALLS]->(fn5),
  (m)-[:CALLS]->(fn6),
  (m)-[:CALLS]->(fn7),
  (m)-[:CALLS]->(fn8),
  (m)-[:CALLS]->(fn9),
  (fn2)-[:USES]->(v9),
  (fn3)-[:USES]->(v9),
  (fn4)-[:USES]->(v10),
  (fn5)-[:CALLS]->(fn4),
  (fn5)-[:USES]->(v10),
  (fn6)-[:USES]->(v1),
  (fn6)-[:USES]->(v11),
  (fn8)-[:CALLS]->(fn2),
  (fn8)-[:USES]->(v1),
  (fn8)-[:USES]->(v12),
  (fn9)-[:USES]->(v7),
  (fn9)-[:USES]->(v8);
```
#>

[CmdletBinding()]
param(
    [string]$Namespace = "assetslake",
    [int]$KialiPort = 20001,
    [int]$FrontendPort = 3000,
    [int]$TimeoutSeconds = 180,
    [switch]$SkipApply,
    [switch]$RestartWorkloads,
    [switch]$NoBrowser
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$K8sDir = Join-Path $RepoRoot "infra/k8s"
$KialiGraphPath = "/kiali/console/graph/namespaces?namespaces=$Namespace&graphType=service&duration=300&refresh=15000"

function Invoke-RequiredCommand([string]$CommandName) {
    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        throw "$CommandName is required but was not found in PATH."
    }
}

function Invoke-Kubectl([string[]]$Arguments) {
    & kubectl @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "kubectl $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

function Test-KubernetesResource([string[]]$Arguments) {
    try {
        if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
            $PSNativeCommandUseErrorActionPreference = $false
        }

        & kubectl @Arguments 1>$null 2>$null
        return $LASTEXITCODE -eq 0
    } catch {
        return $false
    }
}

function Test-LocalPortOpen([int]$Port) {
    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $connection = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
        if (-not $connection.AsyncWaitHandle.WaitOne(200, $false)) {
            return $false
        }
        $client.EndConnect($connection)
        return $true
    } catch {
        return $false
    } finally {
        $client.Dispose()
    }
}

function Get-FreePort([int]$PreferredPort) {
    for ($Port = $PreferredPort; $Port -lt ($PreferredPort + 30); $Port++) {
        if (-not (Test-LocalPortOpen $Port)) {
            return $Port
        }
    }

    throw "No free local port found from $PreferredPort to $($PreferredPort + 29)."
}

function Start-KubectlPortForward([string]$ServiceName, [int]$LocalPort, [int]$RemotePort) {
    $argumentList = @(
        "-n",
        $Namespace,
        "port-forward",
        "svc/$ServiceName",
        "${LocalPort}:${RemotePort}"
    )

    Write-Host "Starting port-forward: $ServiceName -> http://localhost:$LocalPort"
    return Start-Process -FilePath "kubectl" -ArgumentList $argumentList -PassThru -WindowStyle Hidden
}

function Wait-HttpReady([string]$Name, [string]$Url, [int]$TimeoutSeconds) {
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    Write-Host "Waiting for $Name at $Url ..."

    while ((Get-Date) -lt $deadline) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
                Write-Host "$Name is ready ($($response.StatusCode))."
                return
            }
        } catch {
            Start-Sleep -Seconds 3
            continue
        }

        Start-Sleep -Seconds 3
    }

    throw "$Name did not become ready within $TimeoutSeconds seconds: $Url"
}

function Restart-AssetsLakeWorkloads() {
    $DeploymentNames = (& kubectl -n $Namespace get deployments -o jsonpath="{range .items[*]}{.metadata.name}{'\n'}{end}") -split "`n" |
        Where-Object { $_ -and $_ -notin @("assetslake-kiali", "assetslake-prometheus", "assetslake-topology-traffic") }

    if ($LASTEXITCODE -ne 0) {
        throw "Failed to list deployments in namespace $Namespace."
    }

    foreach ($name in $DeploymentNames) {
        Invoke-Kubectl @("-n", $Namespace, "rollout", "restart", "deployment/$name")
    }

    foreach ($name in $DeploymentNames) {
        Invoke-Kubectl @("-n", $Namespace, "rollout", "status", "deployment/$name", "--timeout=$($TimeoutSeconds)s")
    }
}

function Show-TopologySummary([string]$PageUrl, [string]$KialiUrl) {
    Write-Host ""
    Write-Host "AssetsLake topology entry is ready:"
    Write-Host "  App page   $PageUrl"
    Write-Host "  Kiali raw  $KialiUrl"
    Write-Host ""
}

Invoke-RequiredCommand "kubectl"

if (-not (Test-KubernetesResource @("cluster-info"))) {
    throw "Kubernetes API is not reachable for the current kubectl context. Start the cluster or switch context, then re-run this script."
}

if (-not (Test-KubernetesResource @("get", "namespace", "istio-system"))) {
    throw "Istio namespace was not found. Install Istio first, then re-run this script."
}

if (-not (Test-KubernetesResource @("-n", "istio-system", "get", "deployment", "istiod"))) {
    throw "Istio control plane deployment istiod was not found in namespace istio-system."
}

if (-not $SkipApply) {
    Invoke-Kubectl @("apply", "-f", (Join-Path $K8sDir "namespace.yaml"))
    Invoke-Kubectl @("label", "namespace", $Namespace, "istio-injection=enabled", "topology.istio.io/network=assetslake", "--overwrite")
    Invoke-Kubectl @("-n", $Namespace, "apply", "-f", (Join-Path $K8sDir "configmap.yaml"))
    Invoke-Kubectl @("-n", $Namespace, "apply", "-f", (Join-Path $K8sDir "observability-mesh.yaml"))
    Invoke-Kubectl @("-n", $Namespace, "apply", "-f", (Join-Path $K8sDir "ingress.yaml"))
}

if ($RestartWorkloads) {
    Restart-AssetsLakeWorkloads
} else {
    Write-Host "Skipping workload restart. Run with -RestartWorkloads after first install to inject Istio sidecars into existing AssetsLake pods."
}

Invoke-Kubectl @("-n", $Namespace, "rollout", "status", "deployment/assetslake-prometheus", "--timeout=$($TimeoutSeconds)s")
Invoke-Kubectl @("-n", $Namespace, "rollout", "status", "deployment/assetslake-kiali", "--timeout=$($TimeoutSeconds)s")
Invoke-Kubectl @("-n", $Namespace, "rollout", "status", "deployment/assetslake-topology-traffic", "--timeout=$($TimeoutSeconds)s")

$KialiLocalPort = Get-FreePort $KialiPort
$KialiPortForwardProcess = Start-KubectlPortForward "assetslake-kiali" $KialiLocalPort 20001
$KialiUrl = "http://localhost:$KialiLocalPort$KialiGraphPath"

Wait-HttpReady "Kiali" "http://localhost:$KialiLocalPort/kiali/healthz" $TimeoutSeconds

if (Test-KubernetesResource @("-n", $Namespace, "get", "service", "assetslake-observability-frontend")) {
    $FrontendLocalPort = Get-FreePort $FrontendPort
    $FrontendPortForwardProcess = Start-KubectlPortForward "assetslake-observability-frontend" $FrontendLocalPort 3000
    $PageUrl = "http://localhost:$FrontendLocalPort/observability"
    Wait-HttpReady "AssetsLake Observability App" $PageUrl $TimeoutSeconds
} else {
    $FrontendPortForwardProcess = $null
    $PageUrl = $KialiUrl
    Write-Host "assetslake-observability-frontend service was not found; opening raw Kiali graph."
}

Write-Host "Waiting for Prometheus to scrape fresh mesh metrics ..."
Start-Sleep -Seconds 35

Show-TopologySummary $PageUrl $KialiUrl

if (-not $NoBrowser) {
    Start-Process $PageUrl
}

Write-Host "Port-forward processes:"
Write-Host "  Kiali PID    $($KialiPortForwardProcess.Id)"
if ($FrontendPortForwardProcess) {
    Write-Host "  Frontend PID $($FrontendPortForwardProcess.Id)"
}

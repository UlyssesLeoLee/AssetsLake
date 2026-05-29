<#
```cypher
CREATE
  (f:File {name: "start-assetslake.ps1", type: "file", language: "powershell"}),
  (m:Module {name: "scripts.start-assetslake", type: "module"}),
  (fn1:Function {name: "Get-EnvValue", type: "function", language: "powershell", signature: "function Get-EnvValue([string]$Name, [string]$DefaultValue)"}),
  (fn2:Function {name: "Invoke-RequiredCommand", type: "function", language: "powershell", signature: "function Invoke-RequiredCommand([string]$CommandName)"}),
  (fn3:Function {name: "Wait-HttpReady", type: "function", language: "powershell", signature: "function Wait-HttpReady([string]$Name, [string]$Url, [int]$TimeoutSeconds)"}),
  (fn4:Function {name: "Show-UrlSummary", type: "function", language: "powershell", signature: "function Show-UrlSummary()"}),
  (v1:Variable {name: "RepoRoot", type: "variable"}),
  (v2:Variable {name: "InfraDir", type: "variable"}),
  (v3:Variable {name: "EnvFile", type: "variable"}),
  (v4:Variable {name: "ComposeFile", type: "variable"}),
  (v5:Variable {name: "FrontendPort", type: "variable"}),
  (v6:Variable {name: "BackendPort", type: "variable"}),
  (v7:Variable {name: "MinioApiPort", type: "variable"}),
  (v8:Variable {name: "MinioConsolePort", type: "variable"}),
  (v9:Variable {name: "SkyWalkingUiPort", type: "variable"}),
  (v10:Variable {name: "ComposeArgs", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v3),
  (m)-[:USES]->(v4),
  (m)-[:USES]->(v5),
  (m)-[:USES]->(v6),
  (m)-[:USES]->(v7),
  (m)-[:USES]->(v8),
  (m)-[:USES]->(v9),
  (m)-[:USES]->(v10),
  (fn4)-[:USES]->(v5),
  (fn4)-[:USES]->(v6),
  (fn4)-[:USES]->(v7),
  (fn4)-[:USES]->(v8),
  (fn4)-[:USES]->(v9);
```
#>

[CmdletBinding()]
param(
    [switch]$SkipBuild,
    [switch]$OpenBrowser,
    [int]$HealthTimeoutSeconds = 180
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$InfraDir = Join-Path $RepoRoot "infra"
$EnvFile = Join-Path $InfraDir ".env"
$ComposeFile = Join-Path $InfraDir "docker-compose.yml"

function Get-EnvValue([string]$Name, [string]$DefaultValue) {
    if (-not (Test-Path -LiteralPath $EnvFile)) {
        return $DefaultValue
    }

    $pattern = "^\s*$([regex]::Escape($Name))\s*=\s*(.*)\s*$"
    foreach ($line in Get-Content -LiteralPath $EnvFile) {
        if ($line -match "^\s*#" -or $line.Trim() -eq "") {
            continue
        }
        if ($line -match $pattern) {
            return $Matches[1].Trim().Trim('"').Trim("'")
        }
    }

    return $DefaultValue
}

function Invoke-RequiredCommand([string]$CommandName) {
    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        throw "$CommandName is required but was not found in PATH."
    }
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

function Show-UrlSummary() {
    Write-Host ""
    Write-Host "AssetsLake latest stack is running:"
    Write-Host "  Frontend      http://localhost:$FrontendPort"
    Write-Host "  Backend API   http://localhost:$BackendPort/api/health"
    Write-Host "  MinIO API     http://localhost:$MinioApiPort"
    Write-Host "  MinIO Console http://localhost:$MinioConsolePort"
    Write-Host "  SkyWalking    http://localhost:$SkyWalkingUiPort"
    Write-Host ""
}

Invoke-RequiredCommand "docker"
docker info *> $null

if (-not (Test-Path -LiteralPath $EnvFile)) {
    Copy-Item -LiteralPath (Join-Path $InfraDir ".env.example") -Destination $EnvFile
    Write-Host "Created infra/.env from infra/.env.example."
}

$FrontendPort = Get-EnvValue "FRONTEND_PORT" "3000"
$BackendPort = Get-EnvValue "BACKEND_PORT" "8080"
$MinioApiPort = Get-EnvValue "MINIO_API_PORT" "9000"
$MinioConsolePort = Get-EnvValue "MINIO_CONSOLE_PORT" "9001"
$SkyWalkingUiPort = Get-EnvValue "SKYWALKING_UI_PORT" "18088"

$ComposeArgs = @("compose", "--env-file", $EnvFile, "-f", $ComposeFile, "up", "-d")
if (-not $SkipBuild) {
    $ComposeArgs += "--build"
}

Write-Host "Starting AssetsLake from $ComposeFile ..."
& docker @ComposeArgs
if ($LASTEXITCODE -ne 0) {
    throw "docker compose up failed with exit code $LASTEXITCODE."
}

Wait-HttpReady "Backend API" "http://localhost:$BackendPort/api/health" $HealthTimeoutSeconds
Wait-HttpReady "Frontend" "http://localhost:$FrontendPort" $HealthTimeoutSeconds
Wait-HttpReady "SkyWalking APM UI" "http://localhost:$SkyWalkingUiPort" $HealthTimeoutSeconds

docker compose --env-file $EnvFile -f $ComposeFile ps
Show-UrlSummary

if ($OpenBrowser) {
    Start-Process "http://localhost:$FrontendPort"
    Start-Process "http://localhost:$SkyWalkingUiPort"
}

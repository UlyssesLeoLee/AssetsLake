<#
```cypher
CREATE
  (f:File {name: "test-assetslake-quality-gates.ps1", type: "file", language: "powershell"}),
  (m:Module {name: "scripts.test_assetslake_quality_gates", type: "module"}),
  (fn1:Function {name: "Resolve-RepoRoot", type: "function", language: "powershell", signature: "function Resolve-RepoRoot"}),
  (fn2:Function {name: "Assert-Command", type: "function", language: "powershell", signature: "function Assert-Command([string]$Name)"}),
  (fn3:Function {name: "Invoke-Step", type: "function", language: "powershell", signature: "function Invoke-Step([string]$Name, [string]$WorkingDirectory, [scriptblock]$Action)"}),
  (fn4:Function {name: "Use-FrontendEnv", type: "function", language: "powershell", signature: "function Use-FrontendEnv([scriptblock]$Action)"}),
  (fn5:Function {name: "Expand-Layers", type: "function", language: "powershell", signature: "function Expand-Layers([string[]]$RequestedLayers)"}),
  (fn6:Function {name: "Invoke-FrontendScript", type: "function", language: "powershell", signature: "function Invoke-FrontendScript([string]$ScriptName)"}),
  (fn7:Function {name: "Invoke-K6Baseline", type: "function", language: "powershell", signature: "function Invoke-K6Baseline"}),
  (v1:Variable {name: "Layer", type: "variable"}),
  (v2:Variable {name: "IncludeLive", type: "variable"}),
  (v3:Variable {name: "IncludePerf", type: "variable"}),
  (v4:Variable {name: "SkipRust", type: "variable"}),
  (v5:Variable {name: "SkipFrontend", type: "variable"}),
  (v6:Variable {name: "ApiUrl", type: "variable"}),
  (v7:Variable {name: "PerfDuration", type: "variable"}),
  (v8:Variable {name: "RepoRoot", type: "variable"}),
  (v9:Variable {name: "FrontendRoot", type: "variable"}),
  (v10:Variable {name: "BackendRoot", type: "variable"}),
  (v11:Variable {name: "expandedLayers", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (m)-[:CONTAINS]->(fn5),
  (m)-[:CONTAINS]->(fn6),
  (m)-[:CONTAINS]->(fn7),
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
  (m)-[:USES]->(v11),
  (fn4)-[:USES]->(v6),
  (fn5)-[:USES]->(v2),
  (fn5)-[:USES]->(v3),
  (fn6)-[:CALLS]->(fn3),
  (fn6)-[:CALLS]->(fn4),
  (fn6)-[:CALLS]->(fn2),
  (fn6)-[:USES]->(v9),
  (fn6)-[:USES]->(v5),
  (fn7)-[:CALLS]->(fn2),
  (fn7)-[:CALLS]->(fn3),
  (fn7)-[:USES]->(v7),
  (fn7)-[:USES]->(v8);
```
#>

[CmdletBinding()]
param(
  [ValidateSet('static', 'ut', 'contract', 'it', 'e2e', 'uat', 'smoke', 'perf', 'all')]
  [string[]]$Layer = @('all'),
  [switch]$IncludeLive,
  [switch]$IncludePerf,
  [switch]$SkipRust,
  [switch]$SkipFrontend,
  [string]$ApiUrl = $env:ASSETSLAKE_API_URL,
  [string]$PerfDuration = '1m'
)

$ErrorActionPreference = 'Stop'

function Resolve-RepoRoot {
  return (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
}

$RepoRoot = Resolve-RepoRoot
$FrontendRoot = Join-Path $RepoRoot 'frontend'
$BackendRoot = Join-Path $RepoRoot 'backend'

function Assert-Command([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' is not available on PATH."
  }
}

function Invoke-Step([string]$Name, [string]$WorkingDirectory, [scriptblock]$Action) {
  Write-Host ""
  Write-Host "==> $Name" -ForegroundColor Cyan
  Push-Location $WorkingDirectory
  try {
    & $Action
    if ($LASTEXITCODE -ne 0) {
      throw "$Name failed with exit code $LASTEXITCODE."
    }
  } finally {
    Pop-Location
  }
}

function Use-FrontendEnv([scriptblock]$Action) {
  $previousApiUrl = $env:ASSETSLAKE_API_URL
  if ($ApiUrl) {
    $env:ASSETSLAKE_API_URL = $ApiUrl
  }
  try {
    & $Action
  } finally {
    $env:ASSETSLAKE_API_URL = $previousApiUrl
  }
}

function Expand-Layers([string[]]$RequestedLayers) {
  $expanded = [System.Collections.Generic.List[string]]::new()
  foreach ($item in $RequestedLayers) {
    if ($item -eq 'all') {
      foreach ($defaultLayer in @('static', 'ut', 'contract', 'it', 'uat')) {
        $expanded.Add($defaultLayer)
      }
      if ($IncludeLive) {
        $expanded.Add('smoke')
      }
      if ($IncludePerf) {
        $expanded.Add('perf')
      }
    } else {
      $expanded.Add($item)
    }
  }
  return $expanded | Select-Object -Unique
}

function Invoke-FrontendScript([string]$ScriptName) {
  if ($SkipFrontend) {
    Write-Host "Skipping frontend $ScriptName because -SkipFrontend was supplied." -ForegroundColor Yellow
    return
  }

  Assert-Command 'pnpm'
  Invoke-Step "frontend $ScriptName" $FrontendRoot {
    Use-FrontendEnv { pnpm run $ScriptName }
  }
}

function Invoke-K6Baseline {
  Assert-Command 'docker'
  $resultsDir = Join-Path $RepoRoot '.run-logs\perf'
  New-Item -ItemType Directory -Force -Path $resultsDir | Out-Null
  Invoke-Step 'k6 performance baseline' $RepoRoot {
    docker run --rm `
      -e BASE_URL=http://host.docker.internal:18080 `
      -e DURATION=$PerfDuration `
      -e HEALTH_RPS=1000 `
      -e AUTH_RPS=200 `
      -e ISSUE_RPS=100 `
      -e LOCK_RPS=100 `
      -e MAX_VUS=1500 `
      -e LOCK_HOLD_SECONDS=0.2 `
      -v "$RepoRoot\perf\k6:/scripts" `
      -v "$RepoRoot\.run-logs\perf:/results" `
      grafana/k6:latest run /scripts/assetslake-api-load.js `
      --summary-export /results/assetslake-k6-load-summary.json
  }
}

$expandedLayers = Expand-Layers $Layer
Write-Host "Running AssetsLake quality gates: $($expandedLayers -join ', ')" -ForegroundColor Green

foreach ($currentLayer in $expandedLayers) {
  switch ($currentLayer) {
    'static' {
      if (-not $SkipRust) {
        Assert-Command 'cargo'
        Invoke-Step 'backend cargo fmt --check' $BackendRoot { cargo fmt --check }
      }
      Invoke-FrontendScript 'type-check'
    }
    'ut' {
      if (-not $SkipRust) {
        Assert-Command 'cargo'
        Invoke-Step 'backend cargo test' $BackendRoot { cargo test }
      }
      Invoke-FrontendScript 'test:ut'
    }
    'contract' {
      Invoke-FrontendScript 'test:contract'
    }
    'it' {
      Invoke-FrontendScript 'test:it'
    }
    'e2e' {
      Invoke-FrontendScript 'test:e2e'
    }
    'uat' {
      Invoke-FrontendScript 'test:uat'
    }
    'smoke' {
      Invoke-FrontendScript 'test:smoke'
      Invoke-FrontendScript 'test:auth-locks'
      Invoke-FrontendScript 'test:concurrency'
    }
    'perf' {
      Invoke-K6Baseline
    }
  }
}

Write-Host ""
Write-Host 'AssetsLake quality gates completed.' -ForegroundColor Green

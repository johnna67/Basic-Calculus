$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js is required. Install Node.js 22.12 or later."
}

$versionParts = ((node -p "process.versions.node") -split '\.')
$major = [int]$versionParts[0]
$minor = [int]$versionParts[1]
if (($major -lt 22) -or (($major -eq 22) -and ($minor -lt 12))) {
    throw "Node.js 22.12 or later is required. Current version: $(node --version)"
}

Write-Host "Using Node $(node --version) and npm $(npm --version)"
Write-Host "Installing locked dependencies..."
npm ci
Write-Host "Running type checks and automated tests..."
npm run check
Write-Host "Building the production game..."
npm run build
Write-Host ""
Write-Host "Setup complete."
Write-Host "Start development: powershell -ExecutionPolicy Bypass -File .\scripts\run-dev.ps1"
Write-Host "Preview production: npm run preview -- --host 0.0.0.0"
Write-Host "Standalone file: dist\index.html"

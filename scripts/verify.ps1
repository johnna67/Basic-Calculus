$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
npm run check
npm run build

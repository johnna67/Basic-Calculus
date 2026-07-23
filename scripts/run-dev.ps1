$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
npm run dev -- --host 0.0.0.0

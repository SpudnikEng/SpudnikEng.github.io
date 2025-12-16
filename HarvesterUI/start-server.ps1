# PowerShell script to start the development server
Set-Location $PSScriptRoot
Write-Host "Starting server on http://localhost:8080" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
python -m http.server 8080


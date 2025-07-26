# start-server-verified.ps1

Write-Host "`n===============================" -ForegroundColor Cyan
Write-Host "Akcija: PROVERA KONFIGURACIJE (.env)" -ForegroundColor Cyan
Write-Host "===============================`n" -ForegroundColor Cyan

powershell -ExecutionPolicy Bypass -File "check-env.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nServer nece biti pokrenut zbog greske u konfiguraciji." -ForegroundColor Red
    exit 1
}

Write-Host "`n===============================" -ForegroundColor Green
Write-Host "Akcija: POKRETANJE SERVERA" -ForegroundColor Green
Write-Host "===============================`n" -ForegroundColor Green

Start-Process "node" -ArgumentList "server.js" -NoNewWindow

Start-Sleep -Seconds 2

Write-Host "`nOtvaram http://localhost:3001" -ForegroundColor Blue
Start-Process "http://localhost:3001"

Write-Host "`nServer pokrenut (proveri browser)" -ForegroundColor Green 
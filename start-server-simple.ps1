# start-server-simple.ps1
# Pokretanje Node.js servera (port 3001)

$serverFile = "server.js"

Write-Host "`n===============================" -ForegroundColor Cyan
Write-Host "Akcija: POKRETANJE SERVERA" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

if (-not (Test-Path $serverFile)) {
    Write-Host "❌ Fajl $serverFile nije pronađen." -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Pokušavam da pokrenem server na portu 3001..." -ForegroundColor Gray

Start-Process -NoNewWindow -FilePath "node" -ArgumentList $serverFile

Start-Sleep -Seconds 1
Write-Host "🧪 Veloura API server pokrenut na portu 3001" -ForegroundColor Cyan
Write-Host "🌐 API dostupan na: http://localhost:3001" -ForegroundColor Yellow
Write-Host "🔐 Auth endpoint: http://localhost:3001/api/auth" -ForegroundColor DarkYellow
Write-Host "✅ Server uspešno pokrenut na portu 3001!" -ForegroundColor Green 
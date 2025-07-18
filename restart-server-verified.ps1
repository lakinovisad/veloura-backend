Write-Host "`n===============================" -ForegroundColor Cyan
Write-Host "  AKCIJA: RESTART SERVERA" -ForegroundColor Cyan
Write-Host "===============================`n" -ForegroundColor Cyan

# Proveri .env fajl
Write-Host "Proveravam .env konfiguraciju..." -ForegroundColor Yellow
$envCheck = & "./check-env.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Neuspesna validacija .env fajla. Restart otkazan." -ForegroundColor Red
    exit 1
}

# Zaustavi postojeci server
Write-Host "Gasi postojeci server..." -ForegroundColor Yellow
& "./stop-server-verified.ps1"
Start-Sleep -Seconds 1

# Pokreni server
Write-Host "Pokrecem novi server..." -ForegroundColor Green
& "./start-server-simple.ps1"

exit 0 
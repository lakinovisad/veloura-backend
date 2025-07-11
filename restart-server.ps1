# PowerShell skripta za restartovanje Node.js servera sa izolovanim procesima
# Kompatibilna sa PowerShell 5+

$stopScript = "force-stop-server.ps1"
$startScript = "start-server-retry.ps1"

Write-Host "=== Restartujem Node.js server sa izolovanim procesima ===" -ForegroundColor Cyan

# Provera skripti
if (-not (Test-Path $stopScript)) {
    Write-Host "❌ $stopScript nije pronađena." -ForegroundColor Red
    exit 2
}
if (-not (Test-Path $startScript)) {
    Write-Host "❌ $startScript nije pronađena." -ForegroundColor Red
    exit 2
}

# STOP proces
Write-Host "`n→ Zaustavljam Node.js procese..." -ForegroundColor Yellow
$stop = Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File `"$stopScript`"" -Wait -PassThru

if ($stop.ExitCode -ne 0) {
    Write-Host "❌ force-stop-server.ps1 nije uspešno izvršena. ExitCode: $($stop.ExitCode)" -ForegroundColor Red
    exit 3
}
Write-Host "✅ Server zaustavljen." -ForegroundColor Green

# Pauza
Start-Sleep -Seconds 2

# START proces
Write-Host "`n→ Pokrećem server..." -ForegroundColor Yellow
$start = Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File `"$startScript`"" -Wait -PassThru

if ($start.ExitCode -ne 0) {
    Write-Host "❌ start-server-retry.ps1 nije uspešno izvršena. ExitCode: $($start.ExitCode)" -ForegroundColor Red
    exit 4
}
Write-Host "✅ Server pokrenut." -ForegroundColor Green

Write-Host "`n✔️ Restart završen." -ForegroundColor Cyan
exit 0

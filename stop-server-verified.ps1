# Zaustavlja sve Node.js procese bez potvrde
Write-Host "`n===============================" -ForegroundColor Yellow
Write-Host "  AKCIJA: ZAUSTAVLJANJE SERVERA" -ForegroundColor Yellow
Write-Host "===============================`n" -ForegroundColor Yellow

$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue

if (!$nodeProcesses) {
    Write-Host "Nema aktivnih Node.js procesa za zaustavljanje." -ForegroundColor Cyan
    exit 0
}

foreach ($proc in $nodeProcesses) {
    try {
        Stop-Process -Id $proc.Id -Force
        Write-Host "Proces $($proc.Id) zaustavljen." -ForegroundColor Green
    } catch {
        Write-Host "Greska pri zaustavljanju procesa $($proc.Id): $_" -ForegroundColor Red
    }
}

Write-Host "`nServer je zaustavljen." -ForegroundColor Green
exit 0 
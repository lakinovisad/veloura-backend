# stop-server-simple.ps1
# Zaustavljanje svih Node.js procesa

Write-Host "`n===============================" -ForegroundColor Cyan
Write-Host "Akcija: ZAUSTAVLJANJE SERVERA" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if (-not $nodeProcesses) {
    Write-Host "⚠️ Nema aktivnih Node.js procesa." -ForegroundColor Yellow
    exit 0
}

foreach ($proc in $nodeProcesses) {
    try {
        Stop-Process -Id $proc.Id -Force
        Write-Host "🛑 Zaustavljen PID: $($proc.Id)" -ForegroundColor Red
    } catch {
        Write-Host "❌ Greška pri zaustavljanju PID: $($proc.Id)" -ForegroundColor DarkRed
    }
}

Write-Host "✅ Svi Node.js procesi su zaustavljeni." -ForegroundColor Green 
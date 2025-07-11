# 🕒 Automatski backup - pokretanje u beskonačnoj petlji
# Prekinite sa Ctrl + C

Write-Host "🕒 Automatski backup pokrenut..." -ForegroundColor Green
Write-Host "📝 Skripta će pokretati backup.ps1 svakih 6 sati" -ForegroundColor Yellow
Write-Host "⏹️  Za prekid pritisnite Ctrl + C" -ForegroundColor Red
Write-Host ""

# Interval u sekundama (6 sati = 21600 sekundi)
$intervalSeconds = 21600

try {
    while ($true) {
        # Pokretanje backup.ps1
        Write-Host "🔄 Pokretanje backup-a..." -ForegroundColor Cyan
        & .\backup.ps1
        
        # Prikaz vremena sledećeg backup-a
        $nextBackup = (Get-Date).AddSeconds($intervalSeconds)
        Write-Host "⏰ Sledeći backup: $($nextBackup.ToString('dd.MM.yyyy HH:mm:ss'))" -ForegroundColor Magenta
        Write-Host "💤 Čekanje $($intervalSeconds / 3600) sati..." -ForegroundColor Gray
        Write-Host ""
        
        # Čekanje do sledećeg backup-a
        Start-Sleep -Seconds $intervalSeconds
    }
} catch {
    Write-Host ""
    Write-Host "🛑 Automatski backup prekinut." -ForegroundColor Red
    Write-Host "👋 Doviđenja!" -ForegroundColor Green
} 
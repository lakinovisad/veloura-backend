# PowerShell skripta za automatsko zaustavljanje Node.js procesa
# Kompatibilna sa PowerShell 5+

Write-Host "Automatsko zaustavljanje Node.js procesa..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Gray

# Pronadji sve aktivne node procese
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if (-not $nodeProcesses) {
    Write-Host "Nema aktivnih Node.js procesa." -ForegroundColor Yellow
    Write-Host "Zavrseno" -ForegroundColor Gray
    exit 0
}

Write-Host "Pronadjeni aktivni Node.js procesi:" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray

# Prikazi listu procesa
foreach ($process in $nodeProcesses) {
    try {
        $startTime = $process.StartTime.ToString("HH:mm:ss")
        $memory = [math]::Round($process.WorkingSet64 / 1MB, 2)
        Write-Host "PID: $($process.Id) | Start: $startTime | Memory: $memory MB" -ForegroundColor Green
    } catch {
        Write-Host "PID: $($process.Id) | Info: N/A" -ForegroundColor Green
    }
}

Write-Host "`nUkupno procesa za zaustavljanje: $($nodeProcesses.Count)" -ForegroundColor White
Write-Host "----------------------------------------" -ForegroundColor Gray

# Zaustavi svaki proces
$successCount = 0
$errorCount = 0

foreach ($process in $nodeProcesses) {
    try {
        Write-Host "Zaustavljam proces PID: $($process.Id)..." -NoNewline -ForegroundColor White
        
        # Prvo pokusaj graceful shutdown
        $null = $process.CloseMainWindow()
        
        # Cekaj 2 sekunde za graceful shutdown
        if (-not $process.WaitForExit(2000)) {
            # Ako graceful shutdown ne uspe, forsiraj zaustavljanje
            $process.Kill()
            $null = $process.WaitForExit(1000)
        }
        
        if ($process.HasExited) {
            Write-Host " ZAUSTAVLJEN" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host " GRESKA" -ForegroundColor Red
            $errorCount++
        }
        
    } catch {
        Write-Host " GRESKA: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

# Prikazi rezultat
Write-Host "`n================================================" -ForegroundColor Gray
Write-Host "Rezultat:" -ForegroundColor White

if ($successCount -gt 0) {
    Write-Host "Uspesno zaustavljeno: $successCount procesa" -ForegroundColor Green
}

if ($errorCount -gt 0) {
    Write-Host "Greska pri zaustavljanju: $errorCount procesa" -ForegroundColor Red
}

if ($errorCount -eq 0 -and $successCount -gt 0) {
    Write-Host "Svi Node.js procesi su uspesno zaustavljeni!" -ForegroundColor Green
} elseif ($errorCount -gt 0) {
    Write-Host "Neki procesi nisu mogli biti zaustavljeni." -ForegroundColor Yellow
}

Write-Host "Zavrseno" -ForegroundColor Gray 
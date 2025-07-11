# PowerShell skripta za zaustavljanje Node.js procesa
# Kompatibilna sa PowerShell 5+

Write-Host "Zaustavljanje Node.js procesa..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Gray

# Pronadji sve aktivne node procese
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if (-not $nodeProcesses) {
    Write-Host "Nema aktivnih Node.js procesa." -ForegroundColor Yellow
    exit 0
}

Write-Host "Pronadjeni aktivni Node.js procesi:" -ForegroundColor White
Write-Host "----------------------------------------" -ForegroundColor Gray

# Prikazi informacije o procesima
$processInfo = @()
foreach ($process in $nodeProcesses) {
    try {
        $startTime = $process.StartTime
        $cpuTime = $process.TotalProcessorTime
        $processInfo += [PSCustomObject]@{
            PID = $process.Id
            ProcessName = $process.ProcessName
            StartTime = $startTime.ToString("HH:mm:ss")
            CPU = $cpuTime.ToString("mm\:ss\.fff")
            Memory = [math]::Round($process.WorkingSet64 / 1MB, 2)
        }
    } catch {
        # Ako ne mozemo da dobijemo informacije o procesu
        $processInfo += [PSCustomObject]@{
            PID = $process.Id
            ProcessName = $process.ProcessName
            StartTime = "N/A"
            CPU = "N/A"
            Memory = "N/A"
        }
    }
}

# Prikazi tabelu procesa
$processInfo | Format-Table -AutoSize

Write-Host "`nUkupno procesa: $($nodeProcesses.Count)" -ForegroundColor White

# Pitaj korisnika za potvrdu
Write-Host "`nDa li zelite da zaustavite sve ove procese?" -ForegroundColor Yellow
$confirmation = Read-Host "Unesite Y za potvrdu ili N za otkazivanje (Y/N)"

if ($confirmation -ne "Y" -and $confirmation -ne "y") {
    Write-Host "`nOperacija otkazana. Procesi ostaju aktivni." -ForegroundColor Yellow
    exit 0
}

Write-Host "`nZaustavljam procese..." -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray

# Zaustavi svaki proces
$successCount = 0
$errorCount = 0

foreach ($process in $nodeProcesses) {
    try {
        Write-Host "Zaustavljam proces PID: $($process.Id)..." -NoNewline -ForegroundColor White
        
        # Prvo pokusaj graceful shutdown
        $process.CloseMainWindow()
        
        # Cekaj 3 sekunde za graceful shutdown
        if (-not $process.WaitForExit(3000)) {
            # Ako graceful shutdown ne uspe, forsiraj zaustavljanje
            $process.Kill()
            $process.WaitForExit(2000)
        }
        
        if ($process.HasExited) {
            Write-Host " OK" -ForegroundColor Green
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
Write-Host "Rezultat zaustavljanja:" -ForegroundColor White

if ($successCount -gt 0) {
    Write-Host "Uspesno zaustavljeno: $successCount procesa" -ForegroundColor Green
}

if ($errorCount -gt 0) {
    Write-Host "Greska pri zaustavljanju: $errorCount procesa" -ForegroundColor Red
}

if ($errorCount -eq 0) {
    Write-Host "`nSvi Node.js procesi su uspesno zaustavljeni!" -ForegroundColor Green
} else {
    Write-Host "`nNeki procesi nisu mogli biti zaustavljeni." -ForegroundColor Yellow
    Write-Host "Proverite Task Manager za dodatne informacije." -ForegroundColor Gray
}

Write-Host "`nSkripta zavrsena." -ForegroundColor Gray 
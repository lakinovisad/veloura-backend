# ------------------------------
# auto-test.ps1
# Pokreće npm test na svakih 60 sekundi i gasi se nakon N krugova
# ------------------------------

# ✅ Podesi UTF-8 encoding za terminal i fajl
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 📁 Putanja do log fajla
$logDir = "logs"
$logFile = "$logDir/auto-test-log.txt"

# 📁 Ako logs folder ne postoji, kreiraj ga
if (!(Test-Path -Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

# ⚙️ Postavi maksimalan broj ponavljanja
$maxRounds = 10   # 🔁 Menjaj ovo po potrebi (npr. 5, 20, itd.)

# 🔁 Petlja sa ograničenjem
for ($i = 1; $i -le $maxRounds; $i++) {
    $runTimestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "`n[$runTimestamp] [START] Krug testiranja $i / $maxRounds" -ForegroundColor Cyan
    "[$runTimestamp] 🚀 Pokrećem testove (krug $i)..." | Out-File -FilePath $logFile -Encoding utf8 -Append

    try {
        # Pokreni testove
        $result = npm test 2>&1
        $exitCode = $LASTEXITCODE
        $result | Out-File -FilePath $logFile -Encoding utf8 -Append

        if ($exitCode -eq 0) {
            Write-Host "[SUCCESS] Testovi uspešni u krugu $i" -ForegroundColor Green
            "[$runTimestamp] ✅ Testovi uspešni u krugu $i" | Out-File -FilePath $logFile -Encoding utf8 -Append
        } else {
            Write-Host "[ERROR] Neki testovi nisu prošli u krugu $i" -ForegroundColor Red
            "[$runTimestamp] ❌ Greška u testovima (krug $i)" | Out-File -FilePath $logFile -Encoding utf8 -Append
        }
    }
    catch {
        Write-Host "[CRITICAL] Greška tokom pokretanja testova u krugu $i" -ForegroundColor Red
        "[$runTimestamp] ⚠️ Exception u krugu $i`: $($_.Exception.Message)" | Out-File -FilePath $logFile -Encoding utf8 -Append
    }

    if ($i -lt $maxRounds) {
        Write-Host "[PAUSE] Pauza 60 sekundi pre sledećeg kruga..." -ForegroundColor Yellow
        "[$runTimestamp] ⏸️ Pauza pre sledećeg kruga" | Out-File -FilePath $logFile -Encoding utf8 -Append
        Start-Sleep -Seconds 60
    }
}

# 🏁 Završetak
$endTimestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "`n[$endTimestamp] [FINISHED] Završeni svi krugovi testiranja ($maxRounds)." -ForegroundColor Magenta
"[$endTimestamp] 🏁 Završeni svi krugovi testiranja ($maxRounds)" | Out-File -FilePath $logFile -Encoding utf8 -Append 
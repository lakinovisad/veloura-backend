# run-all-tests.ps1
# Automatski pokreće sve testove i loguje rezultat u logs/test-log.txt

$logDir = "logs"
$logFile = "$logDir/test-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Proveri da li postoji logs folder, ako ne postoji - kreiraj ga
if (!(Test-Path -Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

# Pokreni testove i uhvati rezultat
Write-Host "`n[TEST] Pokrećem testove..." -ForegroundColor Cyan
"[$timestamp] 🔄 Pokretanje testova..." | Out-File -FilePath $logFile -Encoding utf8 -Append

try {
    $result = npm test 2>&1
    $exitCode = $LASTEXITCODE
    $result | Out-File -FilePath $logFile -Encoding utf8 -Append

    if ($exitCode -eq 0) {
        Write-Host "`n[SUCCESS] SVI TESTOVI PROŠLI!" -ForegroundColor Green
        "[$timestamp] ✅ Testovi uspešni" | Out-File -FilePath $logFile -Encoding utf8 -Append
    } else {
        Write-Host "`n[ERROR] NEKI TESTOVI SU PALI!" -ForegroundColor Red
        "[$timestamp] ❌ Greške u testovima" | Out-File -FilePath $logFile -Encoding utf8 -Append
    }
}
catch {
    Write-Host "`n[CRITICAL] Greška tokom izvršavanja testova!" -ForegroundColor Red
    "[$timestamp] 🚨 Greška: $_" | Out-File -FilePath $logFile -Encoding utf8 -Append
} 
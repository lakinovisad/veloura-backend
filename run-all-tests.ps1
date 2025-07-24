# run-all-tests.ps1
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logDir = "logs"
$logFile = "$logDir/test-log.txt"
$testScript = "test.ps1"
$serverUrl = "http://localhost:3001/api/health"

# Kreiraj folder za log ako ne postoji
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
    Write-Host "Kreiran folder za logove: $logDir" -ForegroundColor Green
}

# Proveri da li test skripta postoji
if (!(Test-Path $testScript)) {
    Write-Host "Test skripta '$testScript' nije pronadjena." -ForegroundColor Red
    exit 1
}

# Proveri da li je server aktivan
Write-Host "Proveravam da li je server aktivan na $serverUrl..." -ForegroundColor Blue

try {
    $response = Invoke-WebRequest -Uri $serverUrl -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "Server je aktivan i odgovara na health check." -ForegroundColor Green
    } else {
        Write-Host "Server odgovara, ali sa status kodom: $($response.StatusCode)" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "Server nije aktivan ili nije dostupan na $serverUrl" -ForegroundColor Red
    Write-Host "Greska: $($_.Exception.Message)" -ForegroundColor DarkRed
    Write-Host "Pokrenite server pre pokretanja testova." -ForegroundColor Yellow
    exit 1
}

# Pokreni test skriptu i sačuvaj rezultat
Write-Host "Pokrećem testove iz '$testScript'..." -ForegroundColor Cyan

try {
    $output = powershell -ExecutionPolicy Bypass -File $testScript 2>&1
    $exitCode = $LASTEXITCODE
} catch {
    $output = $_.Exception.Message
    $exitCode = 1
}

# Loguj rezultat sa vremenskom oznakom
Add-Content -Path $logFile -Value "`n[$timestamp] Rezultat testiranja:"
Add-Content -Path $logFile -Value "Server URL: $serverUrl"
Add-Content -Path $logFile -Value "Test skripta: $testScript"
Add-Content -Path $logFile -Value "Exit kod: $exitCode"
Add-Content -Path $logFile -Value "Izlaz:"
Add-Content -Path $logFile -Value $output

# Prikaz u konzoli
Write-Host "`nRezultati testova:" -ForegroundColor Cyan
Write-Host $output

# Proveri da li su testovi uspešni
$testFailed = $false

# Proveri exit kod
if ($exitCode -ne 0) {
    $testFailed = $true
    Write-Host "Test skripta je zavrsila sa exit kodom: $exitCode" -ForegroundColor Red
}

# Proveri izlaz za ključne reči koje označavaju grešku
if ($output -match "fail|error|exception|FAIL|ERROR|EXCEPTION") {
    $testFailed = $true
    Write-Host "Pronadjene ključne reči koje označavaju grešku u izlazu." -ForegroundColor Red
}

# Status
if ($testFailed) {
    Write-Host "Testovi su prijavili greške." -ForegroundColor Yellow
    Write-Host "Detaljni log je sačuvan u: $logFile" -ForegroundColor Gray
    exit 1
} else {
    Write-Host "Testovi su uspešno prošli." -ForegroundColor Green
    Write-Host "Detaljni log je sačuvan u: $logFile" -ForegroundColor Gray
    exit 0
} 
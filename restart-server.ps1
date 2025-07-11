# PowerShell skripta za restart Node.js servera
# Kompatibilna sa PowerShell 5+

Write-Host "Restart Node.js servera..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Gray

# Proveri da li fajl force-stop-server.ps1 postoji
if (-not (Test-Path ".\force-stop-server.ps1")) {
    Write-Host "GRESKA: Fajl force-stop-server.ps1 nije pronadjen!" -ForegroundColor Red
    Write-Host "Proveri da li je fajl u istom direktorijumu." -ForegroundColor Red
    exit 1
}

# Proveri da li fajl start-server-retry.ps1 postoji
if (-not (Test-Path ".\start-server-retry.ps1")) {
    Write-Host "GRESKA: Fajl start-server-retry.ps1 nije pronadjen!" -ForegroundColor Red
    Write-Host "Proveri da li je fajl u istom direktorijumu." -ForegroundColor Red
    exit 1
}

Write-Host "Fajlovi provereni - sve OK" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray

# Korak 1: Zaustavi sve Node.js procese
Write-Host "Korak 1: Zaustavljam sve Node.js procese..." -ForegroundColor Yellow

try {
    & ".\force-stop-server.ps1"
    $exitCode = $LASTEXITCODE
    
    # Proveri da li su svi procesi zaista zaustavljeni
    $remainingProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    
    if (-not $remainingProcesses) {
        Write-Host "Zaustavljanje uspesno zavrseno." -ForegroundColor Green
    } else {
        Write-Host "Upozorenje: Neki procesi su ostali aktivni." -ForegroundColor Yellow
        Write-Host "Broj preostalih procesa: $($remainingProcesses.Count)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Greska pri pozivanju force-stop-server.ps1: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Korak 2: Pauza
Write-Host "`nKorak 2: Pauza 2 sekunde..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Write-Host "Pauza zavrsena." -ForegroundColor Green

# Korak 3: Pokreni server sa retry logikom
Write-Host "`nKorak 3: Pokrecem server sa retry logikom..." -ForegroundColor Yellow

try {
    & ".\start-server-retry.ps1"
    $exitCode = $LASTEXITCODE
    
    # Proveri da li je server pokrenut
    Start-Sleep -Seconds 3
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    
    if ($nodeProcesses) {
        Write-Host "Server uspesno pokrenut." -ForegroundColor Green
        Write-Host "Broj aktivnih Node.js procesa: $($nodeProcesses.Count)" -ForegroundColor Green
    } else {
        Write-Host "Upozorenje: Server se mozda nije pokrenuo." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Greska pri pozivanju start-server-retry.ps1: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Finalni rezultat
Write-Host "`n================================================" -ForegroundColor Gray
Write-Host "Restart servera zavrsen!" -ForegroundColor Green
Write-Host "Server je zaustavljen i ponovo pokrenut." -ForegroundColor White
Write-Host "Zavrseno" -ForegroundColor Gray 
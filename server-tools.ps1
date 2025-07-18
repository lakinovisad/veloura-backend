# PowerShell skripta za upravljanje Node.js serverom
# Kompatibilna sa PowerShell 5+

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "stop", "restart")]
    [string]$Action
)

Write-Host "Server Tools - Node.js Server Management" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Gray

# Proveri da li potrebni fajlovi postoje
$requiredFiles = @("start-server-retry.ps1", "force-stop-server.ps1")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (-not (Test-Path ".\$file")) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "GRESKA: Nedostaju sledeci fajlovi:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Red
    }
    Write-Host "Proveri da li su svi fajlovi u istom direktorijumu." -ForegroundColor Red
    exit 1
}

Write-Host "Fajlovi provereni - sve OK" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray

# Funkcija za pokretanje servera
function Start-Server {
    Write-Host "Pokrecem Node.js server..." -ForegroundColor Yellow
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
        Write-Host "Greska pri pokretanju servera: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Funkcija za zaustavljanje servera
function Stop-Server {
    Write-Host "Zaustavljam sve Node.js procese..." -ForegroundColor Yellow
    try {
        & ".\force-stop-server.ps1"
        
        # Proveri da li su svi procesi zaista zaustavljeni
        $remainingProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
        
        if (-not $remainingProcesses) {
            Write-Host "Svi Node.js procesi su uspesno zaustavljeni." -ForegroundColor Green
        } else {
            Write-Host "Upozorenje: Neki procesi su ostali aktivni." -ForegroundColor Yellow
            Write-Host "Broj preostalih procesa: $($remainingProcesses.Count)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Greska pri zaustavljanju servera: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Funkcija za restart servera
function Restart-Server {
    Write-Host "Restartujem Node.js server..." -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Gray
    
    # Korak 1: Zaustavi server
    Write-Host "Korak 1: Zaustavljam server..." -ForegroundColor Yellow
    Stop-Server
    
    # Korak 2: Pauza
    Write-Host "`nKorak 2: Pauza 2 sekunde..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    Write-Host "Pauza zavrsena." -ForegroundColor Green
    
    # Korak 3: Pokreni server
    Write-Host "`nKorak 3: Pokrecem server..." -ForegroundColor Yellow
    Start-Server
}

# Glavna logika
switch ($Action.ToLower()) {
    "start" {
        Write-Host "Akcija: POKRETANJE SERVERA" -ForegroundColor White
        Start-Server
    }
    "stop" {
        Write-Host "Akcija: ZAUSTAVLJANJE SERVERA" -ForegroundColor White
        Stop-Server
    }
    "restart" {
        Write-Host "Akcija: RESTART SERVERA" -ForegroundColor White
        Restart-Server
    }
}

# Finalni rezultat
Write-Host "`n================================================" -ForegroundColor Gray
Write-Host "Akcija '$Action' zavrsena!" -ForegroundColor Green
Write-Host "Zavrseno" -ForegroundColor Gray

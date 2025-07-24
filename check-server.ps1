# check-server.ps1
# Skripta za proveru da li je Node server ispravno pokrenut u pozadini

Write-Host "Proveravam status Node servera..." -ForegroundColor Cyan

# 1. Proveri da li postoji pokrenut node proces sa server.js kao argumentom
Write-Host "`n1. Proveravam da li postoji node proces sa server.js..." -ForegroundColor Blue

$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
$serverProcess = $null

if ($nodeProcesses) {
    foreach ($process in $nodeProcesses) {
        try {
            $commandLine = (Get-WmiObject -Class Win32_Process -Filter "ProcessId = $($process.Id)").CommandLine
            if ($commandLine -and $commandLine.Contains("server.js")) {
                $serverProcess = $process
                break
            }
        } catch {
            # Ignoriši greške pri dohvatanju command line-a
        }
    }
}

if ($serverProcess) {
    Write-Host "✅ Pronađen node proces (PID: $($serverProcess.Id)) koji pokreće server.js" -ForegroundColor Green
    Write-Host "   Vreme pokretanja: $($serverProcess.StartTime)" -ForegroundColor Gray
} else {
    Write-Host "❌ Nije pronađen node proces koji pokreće server.js" -ForegroundColor Red
    Write-Host "   Pronađeni node procesi: $($nodeProcesses.Count)" -ForegroundColor Yellow
}

# 2. Proveri da li http://localhost:3001/api/health vraća HTTP status 200
Write-Host "`n2. Proveravam health check endpoint..." -ForegroundColor Blue

$healthUrl = "http://localhost:3001/api/health"
$healthStatus = $null

try {
    $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 10 -ErrorAction Stop
    $healthStatus = $response.StatusCode
    Write-Host "✅ Health check uspešan - Status: $healthStatus" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check neuspešan" -ForegroundColor Red
    Write-Host "   Greška: $($_.Exception.Message)" -ForegroundColor Red
    $healthStatus = "ERROR"
}

# 3. Pokušaj da pokreneš server ako nije aktivan
if (-not $serverProcess -or $healthStatus -ne 200) {
    Write-Host "`n3. Pokušavam da pokrenem server..." -ForegroundColor Blue
    
    try {
        Start-Process node -ArgumentList "server.js" -WindowStyle Hidden
        Write-Host "✅ Komanda za pokretanje servera izvršena" -ForegroundColor Green
        
        # Sačekaj malo da se server pokrene
        Write-Host "   Čekam 5 sekundi da se server pokrene..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        
        # Proveri ponovo health check
        try {
            $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 10 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Server je uspešno pokrenut i odgovara na health check" -ForegroundColor Green
                $healthStatus = 200
            } else {
                Write-Host "⚠️ Server pokrenut, ali health check vraća status: $($response.StatusCode)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "❌ Server možda nije uspešno pokrenut - health check i dalje neuspešan" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Greška pri pokretanju servera: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 4. Konačna preporuka
Write-Host "`n=== KONAČNA PREPORUKA ===" -ForegroundColor Cyan

if ($serverProcess -and $healthStatus -eq 200) {
    Write-Host "✅ Backend server je ispravno pokrenut!" -ForegroundColor Green
    Write-Host "   - Node proces: AKTIVAN (PID: $($serverProcess.Id))" -ForegroundColor Green
    Write-Host "   - Health check: USPEŠAN (Status: 200)" -ForegroundColor Green
    Write-Host "   - Server je spreman za testiranje" -ForegroundColor Green
    exit 0
} elseif ($serverProcess -and $healthStatus -ne 200) {
    Write-Host "⚠️ Backend server je pokrenut, ali ima problema" -ForegroundColor Yellow
    Write-Host "   - Node proces: AKTIVAN (PID: $($serverProcess.Id))" -ForegroundColor Green
    Write-Host "   - Health check: NEUSPEŠAN (Status: $healthStatus)" -ForegroundColor Red
    Write-Host "   - Proverite logove servera za detalje" -ForegroundColor Yellow
    exit 1
} elseif (-not $serverProcess -and $healthStatus -eq 200) {
    Write-Host "⚠️ Neočekivana situacija" -ForegroundColor Yellow
    Write-Host "   - Node proces: NIJE PRONAĐEN" -ForegroundColor Red
    Write-Host "   - Health check: USPEŠAN (Status: 200)" -ForegroundColor Green
    Write-Host "   - Možda server radi na drugom portu ili procesu" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "❌ Backend server nije ispravno pokrenut" -ForegroundColor Red
    Write-Host "   - Node proces: NIJE PRONAĐEN" -ForegroundColor Red
    Write-Host "   - Health check: NEUSPEŠAN" -ForegroundColor Red
    Write-Host "   - Potrebno je ručno pokrenuti server" -ForegroundColor Yellow
    exit 1
} 
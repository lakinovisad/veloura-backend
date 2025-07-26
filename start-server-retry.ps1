# PowerShell skripta za pokretanje Node.js servera sa retry logikom
# Kompatibilna sa PowerShell 5+

param(
    [string]$ServerPath = "server.js",
    [string]$NodePath = "node",
    [int]$MaxRetries = 5,
    [int]$RetryDelaySeconds = 3
)

Write-Host "Pokrecem Node.js server sa retry logikom..." -ForegroundColor Cyan
Write-Host "Max pokusaja: $MaxRetries | Pauza: $RetryDelaySeconds sekundi" -ForegroundColor Gray

# Validacija
if (-not (Test-Path $ServerPath)) {
    Write-Host "Fajl $ServerPath nije pronadjen!" -ForegroundColor Red
    Write-Host "Trenutni direktorijum: $(Get-Location)" -ForegroundColor DarkGray
    exit 1
}

try {
    $null = Get-Command $NodePath -ErrorAction Stop
} catch {
    Write-Host "Node.js nije pronadjen! Dodaj ga u PATH." -ForegroundColor Red
    exit 1
}

# Obrada izlaza
function Process-OutputLine {
    param([string]$line, [string]$source)
    if ([string]::IsNullOrWhiteSpace($line)) { return }
    $line = $line.Trim()

    switch -Regex ($line) {
        "Veloura API server pokrenut na portu (\d+)" {
            Write-Host "Server pokrenut na portu $($Matches[1])" -ForegroundColor Green
        }
        "Server uspesno pokrenut na portu (\d+)" {
            Write-Host "Port: $($Matches[1])" -ForegroundColor Green
        }
        "error|greska|EADDRINUSE|ECONNREFUSED|ENOTFOUND|Exception" {
            Write-Host "GRESKA: $line" -ForegroundColor Red
        }
        "Inicijalizujem bazu" {
            Write-Host "Inicijalizacija: $line" -ForegroundColor Yellow
        }
        "Baza podataka uspesno inicijalizovana" {
            Write-Host "Baza OK: $line" -ForegroundColor Green
        }
        "Auth endpoint:" {
            Write-Host $line -ForegroundColor Magenta
        }
        "API dostupan na:" {
            Write-Host $line -ForegroundColor Cyan
        }
        default {
            Write-Host $line -ForegroundColor White
        }
    }
}

# Funkcija za pokretanje servera
function Start-NodeServer {
    param([int]$attemptNumber)

    Write-Host "`n--- Pokusaj $attemptNumber/$MaxRetries ---" -ForegroundColor Yellow

    $processInfo = New-Object System.Diagnostics.ProcessStartInfo
    $processInfo.FileName = $NodePath
    $processInfo.Arguments = $ServerPath
    $processInfo.UseShellExecute = $false
    $processInfo.RedirectStandardOutput = $true
    $processInfo.RedirectStandardError = $true
    $processInfo.CreateNoWindow = $true
    $processInfo.WorkingDirectory = Get-Location

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $processInfo

    # Event handleri koristeci Add_Event umesto +=
    $stdoutHandler = {
        param($sender, $e)
        if ($e.Data) { Process-OutputLine -line $e.Data -source "stdout" }
    }
    
    $stderrHandler = {
        param($sender, $e)
        if ($e.Data) { Process-OutputLine -line $e.Data -source "stderr" }
    }

    try {
        # Registruj event handleri
        $process.Add_OutputDataReceived($stdoutHandler)
        $process.Add_ErrorDataReceived($stderrHandler)
        
        if (-not $process.Start()) {
            Write-Host "Neuspesno pokretanje procesa." -ForegroundColor Red
            return $false
        }

        Write-Host "Server proces pokrenut (PID: $($process.Id))" -ForegroundColor DarkGray

        $process.BeginOutputReadLine()
        $process.BeginErrorReadLine()
        $process.WaitForExit()

        $exitCode = $process.ExitCode
        Write-Host "Proces zavrsen (Exit Code: $exitCode)" -ForegroundColor Gray

        return ($exitCode -eq 0)
    } catch {
        Write-Host "Izuzetak: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    } finally {
        if ($process -and -not $process.HasExited) {
            try { $process.Kill() } catch {}
        }
        $process.Dispose()
    }
}

# Retry logika
$success = $false
$attempt = 1

while (-not $success -and $attempt -le $MaxRetries) {
    $success = Start-NodeServer -attemptNumber $attempt
    
    if (-not $success -and $attempt -lt $MaxRetries) {
        Write-Host "Cekam $RetryDelaySeconds sekundi pre sledeceg pokusaja..." -ForegroundColor DarkYellow
        Start-Sleep -Seconds $RetryDelaySeconds
    }
    
    $attempt++
}

# Kraj
if ($success) {
    Write-Host "`nServer uspesno pokrenut!" -ForegroundColor Green
} else {
    Write-Host "`nSvi pokusaji su neuspesni. Server nije pokrenut." -ForegroundColor Red
    exit 1
}

Write-Host "`nSkripta zavrsena." -ForegroundColor Gray

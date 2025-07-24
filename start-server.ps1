# PowerShell skripta za pokretanje Express backend servera
# Kompatibilna sa PowerShell 5+

param(
    [string]$ServerPath = "server.js",
    [string]$NodePath = "node"
)

Write-Host "Pokrecem Express backend server..." -ForegroundColor Cyan

# Proveri da li postoji server.js fajl
if (-not (Test-Path $ServerPath)) {
    Write-Host "Fajl $ServerPath nije pronadjen!" -ForegroundColor Red
    Write-Host "Trenutni direktorijum: $(Get-Location)" -ForegroundColor Gray
    exit 1
}

# Proveri da li je node dostupan
try {
    $null = Get-Command $NodePath -ErrorAction Stop
} catch {
    Write-Host "Node.js nije pronadjen! Proveri da li je instaliran i u PATH-u." -ForegroundColor Red
    exit 1
}

# Konfiguracija procesa
$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = $NodePath
$processInfo.Arguments = $ServerPath
$processInfo.UseShellExecute = $false
$processInfo.RedirectStandardOutput = $true
$processInfo.RedirectStandardError = $true
$processInfo.CreateNoWindow = $false
$processInfo.WorkingDirectory = Get-Location

# Kreiraj proces
$process = New-Object System.Diagnostics.Process
$process.StartInfo = $processInfo

# Funkcija za obradu linije izlaza
function Process-OutputLine {
    param([string]$line, [string]$source)
    
    if ([string]::IsNullOrWhiteSpace($line)) {
        return
    }
    
    # Ukloni beline sa početka i kraja
    $line = $line.Trim()
    
    # Proveri da li je greška
    if ($line -match "error|Error|ERROR|Greska|greska|EADDRINUSE|ECONNREFUSED|ENOTFOUND") {
        Write-Host $line -ForegroundColor Red
        return
    }
    
    # Proveri da li je server uspešno pokrenut
    if ($line -match "Server uspesno pokrenut na portu (\d+)") {
        $port = $matches[1]
        Write-Host "Server uspesno pokrenut na portu " -NoNewline -ForegroundColor Green
        Write-Host $port -ForegroundColor Green -BackgroundColor DarkGreen
        Write-Host "API dostupan na: http://localhost:$port" -ForegroundColor Cyan
        return
    }
    
    # Proveri da li je baza uspešno inicijalizovana
    if ($line -match "Baza podataka uspesno inicijalizovana") {
        Write-Host $line -ForegroundColor Green
        return
    }
    
    # Proveri da li je inicijalizacija baze u toku
    if ($line -match "Inicijalizujem bazu podataka") {
        Write-Host $line -ForegroundColor Yellow
        return
    }
    
    # Proveri da li je port zauzet
    if ($line -match "Port (\d+) je zauzet") {
        $port = $matches[1]
        Write-Host "Port $port je zauzet, pokusavam sledeci..." -ForegroundColor Yellow
        return
    }
    
    # Proveri da li pokušava port
    if ($line -match "Pokusavam da pokrenem server na portu (\d+)") {
        $port = $matches[1]
        Write-Host "Pokusavam port $port..." -ForegroundColor Blue
        return
    }
    
    # Proveri da li je tabela kreirana
    if ($line -match "Tabela .* uspesno kreirana") {
        Write-Host $line -ForegroundColor DarkGreen
        return
    }
    
    # Proveri da li su rute registrovane
    if ($line -match ".* rute registrovane") {
        Write-Host $line -ForegroundColor Green
        return
    }
    
    # Proveri da li je server pokrenut (opšta poruka)
    if ($line -match "Veloura API server pokrenut na portu (\d+)") {
        $port = $matches[1]
        Write-Host "Veloura API server pokrenut na portu " -NoNewline -ForegroundColor Green
        Write-Host $port -ForegroundColor Green -BackgroundColor DarkGreen
        return
    }
    
    # Proveri da li je API dostupan
    if ($line -match "API dostupan na:") {
        Write-Host $line -ForegroundColor Cyan
        return
    }
    
    # Proveri da li je auth endpoint
    if ($line -match "Auth endpoint:") {
        Write-Host $line -ForegroundColor Magenta
        return
    }
    
    # Proveri da li su registrovane auth rute
    if ($line -match "Registrovane auth rute:") {
        Write-Host $line -ForegroundColor DarkCyan
        return
    }
    
    # Proveri da li je proces zaustavljen
    if ($line -match "Svi portovi su zauzeti|Server se nece pokrenuti|Zaustavljam server") {
        Write-Host $line -ForegroundColor Red
        return
    }
    
    # Standardni izlaz
    Write-Host $line -ForegroundColor White
}

# Event handleri za stdout i stderr
$stdoutBuilder = New-Object System.Text.StringBuilder
$stderrBuilder = New-Object System.Text.StringBuilder

$process.OutputDataReceived += {
    param($sender, $e)
    if ($e.Data) {
        Process-OutputLine -line $e.Data -source "stdout"
    }
}

$process.ErrorDataReceived += {
    param($sender, $e)
    if ($e.Data) {
        Process-OutputLine -line $e.Data -source "stderr"
    }
}

try {
    # Pokreni proces
    $process.Start() | Out-Null
    
    # Započni asinhrono čitanje stdout i stderr
    $process.BeginOutputReadLine()
    $process.BeginErrorReadLine()
    
    Write-Host "Cekam izlaz od servera..." -ForegroundColor Gray
    
    # Čekaj da se proces završi
    $process.WaitForExit()
    
    # Proveri exit code
    if ($process.ExitCode -eq 0) {
        Write-Host "Server je zavrsio sa uspehom (Exit Code: $($process.ExitCode))" -ForegroundColor Green
    } else {
        Write-Host "Server je zavrsio sa greskom (Exit Code: $($process.ExitCode))" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Greska pri pokretanju servera: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Očisti resurse
    if ($process -and -not $process.HasExited) {
        $process.Kill()
    }
    $process.Dispose()
}

Write-Host "Skripta zavrsena." -ForegroundColor Gray 
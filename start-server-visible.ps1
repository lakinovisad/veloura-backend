param(
    [string]$ServerPath = "server.js",
    [string]$NodePath = "node"
)

Write-Host "Pokrećem Express backend server..." -ForegroundColor Cyan

if (-not (Test-Path $ServerPath)) {
    Write-Host "Fajl $ServerPath nije pronađen!" -ForegroundColor Red
    Write-Host "Trenutni direktorijum: $(Get-Location)" -ForegroundColor Gray
    exit 1
}

try {
    $null = Get-Command $NodePath -ErrorAction Stop
} catch {
    Write-Host "Node.js nije pronađen! Proveri da li je instaliran i u PATH-u." -ForegroundColor Red
    exit 1
}

$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = $NodePath
$processInfo.Arguments = $ServerPath
$processInfo.UseShellExecute = $false
$processInfo.RedirectStandardOutput = $true
$processInfo.RedirectStandardError = $true
$processInfo.CreateNoWindow = $false
$processInfo.WorkingDirectory = Get-Location

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $processInfo

function Write-OutputLine {
    param([string]$line, [string]$source)

    if ([string]::IsNullOrWhiteSpace($line)) { return }

    $line = $line.Trim()

    if ($line -match "error|Error|EADDRINUSE|ECONNREFUSED|ENOTFOUND") {
        Write-Host $line -ForegroundColor Red; return
    }
    if ($line -match "Server uspesno pokrenut na portu (\d+)") {
        $port = $matches[1]
        Write-Host "Server uspesno pokrenut na portu $port" -ForegroundColor Green
        Write-Host "API dostupan na: http://localhost:$port" -ForegroundColor Cyan
        return
    }
    Write-Host $line -ForegroundColor White
}

$process.OutputDataReceived += {
    param($src, $e)
    if ($e.Data) { Write-OutputLine -line $e.Data -source "stdout" }
}
$process.ErrorDataReceived += {
    param($src, $e)
    if ($e.Data) { Write-OutputLine -line $e.Data -source "stderr" }
}

try {
    $process.Start() | Out-Null
    $process.BeginOutputReadLine()
    $process.BeginErrorReadLine()
    Write-Host "Čekam izlaz od servera..." -ForegroundColor Gray
    $process.WaitForExit()

    if ($process.ExitCode -eq 0) {
        Write-Host "Server je uspešno završio (Exit Code: $($process.ExitCode))" -ForegroundColor Green
    } else {
        Write-Host "Server je završio sa greškom (Exit Code: $($process.ExitCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "Greška pri pokretanju servera: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    if ($process -and -not $process.HasExited) { $process.Kill() }
    $process.Dispose()
}

Write-Host "Skripta završena." -ForegroundColor Gray 
# check-env.ps1

$envFile = ".env"
$requiredVars = @("PORT", "DB_PATH", "NODE_ENV")
$missingVars = @()

Write-Host "`nProveravam konfiguraciju iz .env fajla..." -ForegroundColor Cyan

if (-Not (Test-Path $envFile)) {
    Write-Host "Fajl .env nije pronadjen u trenutnom direktorijumu!" -ForegroundColor Red
    exit 1
}

$content = Get-Content $envFile | Where-Object { $_ -and ($_ -notmatch "^#") }
$envVars = @{}

foreach ($line in $content) {
    if ($line -match "^\s*([^=]+)\s*=\s*(.*)\s*$") {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $envVars[$key] = $value
    }
}

Write-Host "`nPronadjene promenljive:"
foreach ($kvp in $envVars.GetEnumerator()) {
    Write-Host "`t$($kvp.Key) = $($kvp.Value)" -ForegroundColor Yellow
}

foreach ($var in $requiredVars) {
    if (-Not $envVars.ContainsKey($var)) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "`nNedostaju sledece obavezne promenljive:" -ForegroundColor Red
    $missingVars | ForEach-Object { Write-Host "`t$_" -ForegroundColor Red }
    exit 1
}

Write-Host "`nSve obavezne promenljive su prisutne." -ForegroundColor Green
exit 0 
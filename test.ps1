# PowerShell skripta za pokretanje testova
# Ova skripta se može koristiti u sync.ps1 pre push-a kao pre-commit provera

Write-Host "🧪 Pokrećem testove..." -ForegroundColor Cyan

# Proveri da li postoji package.json
if (Test-Path "package.json") {
    Write-Host "📦 Pronađen package.json - pokrećem npm test..." -ForegroundColor Blue
    npm test
} else {
    Write-Host "📄 Nema package.json - pokrećem node test.js..." -ForegroundColor Yellow
    if (Test-Path "test.js") {
        node test.js
    } else {
        Write-Host "❌ Nije pronađen ni package.json ni test.js!" -ForegroundColor Red
        Write-Host "📋 Kreiraj package.json sa test skriptom ili test.js fajl." -ForegroundColor Gray
        exit 1
    }
}

# Proveri exit code
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Testovi su prošli!" -ForegroundColor Green
    Write-Host "🚀 Možeš nastaviti sa deployment-om." -ForegroundColor Cyan
} else {
    Write-Host "❌ Testovi nisu prošli. Prekida se dalji proces." -ForegroundColor Red
    Write-Host "🔧 Popravi greške u testovima i pokušaj ponovo." -ForegroundColor Yellow
    exit 1
} 
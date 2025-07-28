# Veloura API Test Runner
# Pokrece sve testove sa lepim indikatorima

Write-Host "Pokrecem testove za Veloura API..." -ForegroundColor Cyan

# Proveri da li je Node.js instaliran
try {
    $nodeVersion = node --version
    Write-Host "Node.js verzija: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js nije instaliran ili nije dostupan u PATH-u" -ForegroundColor Red
    exit 1
}

# Proveri da li su zavisnosti instalirane
if (-not (Test-Path "node_modules")) {
    Write-Host "Instaliram zavisnosti..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Greska pri instalaciji zavisnosti" -ForegroundColor Red
        exit 1
    }
}

# Proveri da li su test zavisnosti instalirane
if (-not (Test-Path "node_modules/jest")) {
    Write-Host "Instaliram test zavisnosti..." -ForegroundColor Yellow
    npm install --save-dev jest supertest cross-env
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Greska pri instalaciji test zavisnosti" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Pokrecem testove..." -ForegroundColor Green
Write-Host ""

# Pokreni testove
npm test

# Proveri rezultat testova
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Svi testovi su prosli uspesno!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Neki testovi su pali!" -ForegroundColor Red
    Write-Host "Proverite izlaz iznad za detalje" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Opcije za testiranje:" -ForegroundColor Cyan
Write-Host "   npm test          - Pokreni sve testove" -ForegroundColor White
Write-Host "   npm run test:watch - Pokreni testove u watch modu" -ForegroundColor White
Write-Host "   npm run test:coverage - Pokreni testove sa coverage izvestajem" -ForegroundColor White 
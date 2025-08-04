chcp 65001 > $null
Write-Host "📦 Pokrećem eksport Swagger dokumentacije..." -ForegroundColor Cyan

# 1. Proveri da li server radi
Write-Host "🔍 Proveravam da li backend server radi na http://localhost:3002..."
$response = Invoke-WebRequest -Uri "http://localhost:3002/swagger.json" -UseBasicParsing -ErrorAction SilentlyContinue

if (-not $response -or $response.StatusCode -ne 200) {
    Write-Host "❌ Server nije aktivan na http://localhost:3002" -ForegroundColor Red
    Write-Host "👉 Pokreni server sa: npm start" -ForegroundColor Yellow
    exit 1
}

# 2. Sačuvaj swagger-output.json
Write-Host "💾 Čuvam fajl swagger-output.json..."
Invoke-WebRequest -Uri "http://localhost:3002/swagger.json" -OutFile "swagger-output.json"

# 3. Proveri da li postoji npx
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 'npx' nije pronađen. Instaliraj Node.js sa https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# 4. Generiši HTML dokumentaciju
Write-Host "🌐 Generišem api-docs.html pomoću @redocly/cli..."
npx @redocly/cli build-docs swagger-output.json --output api-docs.html

# 5. (Opciono) Eksport u PDF ako markdown-pdf postoji
if (Get-Command markdown-pdf -ErrorAction SilentlyContinue) {
    Write-Host "📝 Konvertujem u Markdown..."
    npx widdershins swagger-output.json -o api-docs.md
    Write-Host "📄 Generišem PDF dokumentaciju..."
    markdown-pdf api-docs.md -o api-docs.pdf
} else {
    Write-Host "⚠️ markdown-pdf nije pronađen — preskačem PDF eksport." -ForegroundColor Yellow
}

# 6. Otvori HTML dokumentaciju
Write-Host "🔗 Otvaram api-docs.html u web browseru..."
Start-Process "api-docs.html"

# 7. Gotovo!
Write-Host ""
Write-Host "🎉 Eksport uspešan! Dostupni fajlovi:" -ForegroundColor Green
Write-Host "📄 swagger-output.json"
Write-Host "🌐 api-docs.html"
Write-Host "📄 api-docs.pdf (ako je generisan)" 
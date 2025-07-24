# PowerShell skripta za automatski git push

Write-Host "🟡 Dodajem izmene..." -ForegroundColor Yellow
git add .

$commitMsg = Read-Host "✏️  Unesi commit poruku"

if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    Write-Host "❌ Commit poruka ne može biti prazna!" -ForegroundColor Red
    exit 1
}

Write-Host "🟢 Commitujem: '$commitMsg'" -ForegroundColor Green
git commit -m "$commitMsg"

Write-Host "🚀 Pushujem na origin/main..." -ForegroundColor Cyan
git push origin main

Write-Host "✅ Gotovo! Izmene su na GitHub-u." -ForegroundColor Green 
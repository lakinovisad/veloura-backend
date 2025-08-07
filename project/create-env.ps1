# Create environment file for frontend
Write-Host "🔧 Creating .env file for frontend..." -ForegroundColor Cyan

$envContent = @"
# Frontend Environment Configuration
VITE_API_URL=http://localhost:3002

# Add other environment variables as needed
# VITE_APP_TITLE=Veloura
# VITE_APP_VERSION=1.0.0
"@

$envPath = Join-Path $PSScriptRoot ".env"

if (Test-Path $envPath) {
    Write-Host "⚠️  .env file already exists. Skipping creation." -ForegroundColor Yellow
} else {
    $envContent | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "✅ .env file created successfully!" -ForegroundColor Green
    Write-Host "📍 Location: $envPath" -ForegroundColor Gray
}

Write-Host "`n📝 Environment variables configured:" -ForegroundColor Cyan
Write-Host "   VITE_API_URL=http://localhost:3002" -ForegroundColor White
Write-Host "`n💡 You can modify the .env file to change the API URL for different environments." -ForegroundColor Gray 
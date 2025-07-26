# restart-server-simple.ps1
# Restartuje Node.js server

Write-Host "`n===============================" -ForegroundColor Cyan
Write-Host "Akcija: RESTART SERVERA" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

powershell -ExecutionPolicy Bypass -File "./stop-server-simple.ps1"
Start-Sleep -Seconds 1
powershell -ExecutionPolicy Bypass -File "./start-server-simple.ps1"

Write-Host "`n✅ Server je restartovan!" -ForegroundColor Green 
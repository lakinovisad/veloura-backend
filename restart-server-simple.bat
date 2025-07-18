@echo off
echo.
echo ================================
echo 🔄  RESTARTUJEM Node.js server...
echo ================================

powershell -ExecutionPolicy Bypass -File "stop-server-simple.ps1"
timeout /t 1 >nul
powershell -ExecutionPolicy Bypass -File "start-server-simple.ps1"
timeout /t 2 >nul
start http://localhost:3001

echo.
echo ✅ Server restartovan.
pause 
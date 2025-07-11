@echo off
cls
echo ==========================================
echo    Pokretanje servera sa proverom .env
echo ==========================================

powershell -ExecutionPolicy Bypass -File "start-server-verified.ps1"

echo.
echo Skripta zavrsena. Pritisni bilo koji taster...
pause >nul 
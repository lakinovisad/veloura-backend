@echo off
echo Pokrecem restart-server.ps1 sa ExecutionPolicy Bypass...
echo ================================================
echo.

powershell.exe -ExecutionPolicy Bypass -NoProfile -File "restart-server.ps1"

echo.
echo ================================================
echo Skripta zavrsena. Pritisni bilo koji taster za izlaz...
pause 
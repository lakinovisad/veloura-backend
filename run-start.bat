@echo off
echo Pokrecem start-server-retry.ps1 sa ExecutionPolicy Bypass...
echo ================================================
echo.

powershell.exe -ExecutionPolicy Bypass -NoProfile -File "start-server-retry.ps1"

echo.
echo ================================================
echo Skripta zavrsena. Pritisni bilo koji taster za izlaz...
pause 
@echo off
echo Server Tools - Node.js Server Management
echo ================================================
echo.
echo Izaberi akciju:
echo 1. Start server
echo 2. Stop server  
echo 3. Restart server
echo.
set /p choice="Unesi broj (1-3): "

if "%choice%"=="1" (
    echo Pokrecem server...
    powershell.exe -ExecutionPolicy Bypass -NoProfile -File "server-tools.ps1" -action start
) else if "%choice%"=="2" (
    echo Zaustavljam server...
    powershell.exe -ExecutionPolicy Bypass -NoProfile -File "server-tools.ps1" -action stop
) else if "%choice%"=="3" (
    echo Restartujem server...
    powershell.exe -ExecutionPolicy Bypass -NoProfile -File "server-tools.ps1" -action restart
) else (
    echo Neispravan izbor!
)

echo.
echo ================================================
echo Skripta zavrsena. Pritisni bilo koji taster za izlaz...
pause 
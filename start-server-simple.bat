@echo off
powershell -ExecutionPolicy Bypass -File "start-server-simple.ps1"
timeout /t 2 >nul
start http://localhost:3001
pause 
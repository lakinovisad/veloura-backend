@echo off
powershell -ExecutionPolicy Bypass -File restart-server-verified.ps1
start http://localhost:3001
pause 
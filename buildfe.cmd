@echo off
cd /d "c:\Users\WinDows\Desktop\yalabena-main\front"
npx tsc --noEmit > "c:\Users\WinDows\Desktop\yalabena-main\tsc_frontend.log" 2>&1
echo EXIT_CODE=%ERRORLEVEL%

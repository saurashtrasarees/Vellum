@echo off
title Vellum Local Server - Port 8080
echo ========================================================
echo   VELLUM DIGITAL TEXTILE SHOWROOM
echo   Saurashtra Sarees ^& Keya Fashion
echo ========================================================
echo.
echo Starting local web server on port 8080...
echo.
echo Showroom URL : http://localhost:8080/
echo Super-Admin  : http://localhost:8080/admin.html
echo.
echo Press Ctrl+C in this window anytime to stop the server.
echo ========================================================
echo.
cd /d "%~dp0"
python -m http.server 8080
pause

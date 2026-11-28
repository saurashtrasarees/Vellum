@echo off
title Vellum — Saree Color Extractor (K-Means + HSV Masking)
echo ====================================================================
echo   VELLUM ATELIER - MANUAL SAREE COLOR EXTRACTOR
echo   Python K-Means Clustering + HSV Masking + Indian Textile Palette
echo ====================================================================
echo.
echo [1] Scan ALL Google Drive catalogs in data/catalogs.json
echo [2] Scan a LOCAL DISK FOLDER of saree photos (e.g. D:\Shoots\Vol1)
echo.
set /p CHOICE="Enter 1 or 2: "

if "%CHOICE%"=="2" (
    echo.
    set /p FOLDER="Paste or drag-drop the local folder path here: "
    setlocal enabledelayedexpansion
    set "FOLDER=!FOLDER:"=!"
    python "%~dp0extract_saree_colors_cv.py" --local-dir "!FOLDER!"
    echo.
    pause
    exit /b 0
)

echo.
echo Running K-Means + HSV Masking on all catalogs...
python "%~dp0extract_saree_colors_cv.py"
echo.
pause

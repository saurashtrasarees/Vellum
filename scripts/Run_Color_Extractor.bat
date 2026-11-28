@echo off
title Vellum — Saree Color Extractor (K-Means + HSV Masking)
echo ====================================================================
echo   VELLUM ATELIER - SAREE COLOR EXTRACTOR (K-MEANS + HSV MASKING)
echo ====================================================================
echo.
echo [1] Scan ALL 132 Catalogues ^& Auto-Update Google Sheet
echo [2] Scan a SINGLE Catalogue (by Code/Name) ^& Auto-Update Google Sheet
echo [3] Scan a LOCAL DISK FOLDER of saree photos (e.g. D:\Shoots\Vol1)
echo.
set /p CHOICE="Enter 1, 2, or 3: "

if "%CHOICE%"=="2" (
    echo.
    set /p CAT="Enter Catalog Code or Name (e.g. Aayesha-Vol-4): "
    python "%~dp0extract_saree_colors_cv.py" --catalog "%CAT%" --force
    echo.
    pause
    exit /b 0
)

if "%CHOICE%"=="3" (
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
echo Running K-Means + HSV Masking on all catalogues and updating Google Sheet...
python "%~dp0extract_saree_colors_cv.py"
echo.
pause

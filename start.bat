@echo off
title Portal Kas RT 10 Zamrud (Laravel & SQL)
echo ========================================================
echo   Portal Kas RT 10 Zamrud - Framework Laravel & SQL
echo ========================================================

where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] PHP terdeteksi di sistem.
    echo Menjalankan Laravel Artisan Server...
    start http://127.0.0.1:8000
    php artisan serve
) else (
    echo [INFO] PHP belum terpasang di PATH Windows.
    echo Menggunakan server lokal Node.js & berkas SQL langsung...
    start http://localhost:3000
    node server.js
)
pause

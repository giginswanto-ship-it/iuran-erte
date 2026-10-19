<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ApiSyncController;

Route::get('/', [DashboardController::class, 'index'])->name('home');
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/warga', [DashboardController::class, 'index'])->name('warga');
Route::get('/iuran', [DashboardController::class, 'index'])->name('iuran');
Route::get('/transaksi', [DashboardController::class, 'index'])->name('transaksi');
Route::get('/laporan', [DashboardController::class, 'index'])->name('laporan');
Route::get('/pengumuman', [DashboardController::class, 'index'])->name('pengumuman');
Route::get('/suarawarga', [DashboardController::class, 'index'])->name('suarawarga');
Route::get('/settings', [DashboardController::class, 'index'])->name('settings');

// Endpoint download berkas SQL kas-rt.sql
Route::get('/kas-rt.sql', [ApiSyncController::class, 'downloadSql'])->name('sql.download');
Route::get('/kas_rt.sql', [ApiSyncController::class, 'downloadSql']);

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiSyncController;
use App\Http\Controllers\WargaController;
use App\Http\Controllers\IuranController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\PengurusController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\SuaraWargaController;

// 1. Sinkronisasi Utama & Full Data (kompatibel 100% dengan frontend store.js)
Route::get('/data', [ApiSyncController::class, 'getData']);
Route::post('/sync', [ApiSyncController::class, 'sync']);
Route::get('/sql', [ApiSyncController::class, 'downloadSql']);

// 2. Resource API Warga (Dukungan Filter Blok J1-J10)
Route::get('/warga', [WargaController::class, 'index']);
Route::post('/warga', [WargaController::class, 'store']);
Route::put('/warga/{id}', [WargaController::class, 'update']);
Route::delete('/warga/{id}', [WargaController::class, 'destroy']);

// 3. Resource API Matriks Iuran & Pembayaran
Route::get('/iuran/matrix', [IuranController::class, 'getMatrix']);
Route::post('/iuran/pay', [IuranController::class, 'pay']);

// 4. Resource API Transaksi Kas (Pemasukan & Pengeluaran)
Route::get('/transaksi', [TransaksiController::class, 'index']);
Route::post('/transaksi', [TransaksiController::class, 'store']);
Route::put('/transaksi/{id}', [TransaksiController::class, 'update']);
Route::delete('/transaksi/{id}', [TransaksiController::class, 'destroy']);

// 5. Resource API Susunan Pengurus RT
Route::get('/pengurus', [PengurusController::class, 'index']);
Route::post('/pengurus', [PengurusController::class, 'store']);
Route::put('/pengurus/{id}', [PengurusController::class, 'update']);
Route::delete('/pengurus/{id}', [PengurusController::class, 'destroy']);

// 6. Resource API Warta / Pengumuman RT
Route::get('/pengumuman', [PengumumanController::class, 'index']);
Route::post('/pengumuman', [PengumumanController::class, 'store']);
Route::put('/pengumuman/{id}', [PengumumanController::class, 'update']);
Route::delete('/pengumuman/{id}', [PengumumanController::class, 'destroy']);

// 7. Resource API Suara Warga & Aspirasi
Route::get('/suara-warga', [SuaraWargaController::class, 'index']);
Route::post('/suara-warga', [SuaraWargaController::class, 'store']);
Route::patch('/suara-warga/{id}/status', [SuaraWargaController::class, 'updateStatus']);

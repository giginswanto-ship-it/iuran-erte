<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\Warga;
use App\Models\Transaksi;
use App\Models\Pengumuman;
use App\Models\SuaraWarga;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $settings = Setting::first();
        $totalWarga = Warga::count();
        $totalTetap = Warga::where('status', 'Tetap')->count();
        $totalKontrak = Warga::where('status', 'Kontrak')->count();

        // Hitung total saldo kas
        $totalPemasukan = Transaksi::where('jenis', 'pemasukan')->sum('nominal');
        $totalPengeluaran = Transaksi::where('jenis', 'pengeluaran')->sum('nominal');
        $saldoKas = $totalPemasukan - $totalPengeluaran;

        // Bulan berjalan
        $now = Carbon::now('Asia/Jakarta');
        $currentMonth = $now->month;
        $currentYear = $now->year;

        $pemasukanBulanIni = Transaksi::where('jenis', 'pemasukan')
            ->whereMonth('tanggal', $currentMonth)
            ->whereYear('tanggal', $currentYear)
            ->sum('nominal');

        $pengeluaranBulanIni = Transaksi::where('jenis', 'pengeluaran')
            ->whereMonth('tanggal', $currentMonth)
            ->whereYear('tanggal', $currentYear)
            ->sum('nominal');

        // Warga lunas bulan berjalan
        $wargaLunasBulanIni = Transaksi::where('jenis', 'pemasukan')
            ->where('bulan_iuran', $currentMonth)
            ->where('tahun_iuran', $currentYear)
            ->distinct('warga_id')
            ->count('warga_id');

        $wargaBelumLunas = max(0, $totalWarga - $wargaLunasBulanIni);
        $persenLunas = $totalWarga > 0 ? round(($wargaLunasBulanIni / $totalWarga) * 100) : 0;

        $transaksiTerbaru = Transaksi::with('warga')
            ->orderBy('tanggal', 'desc')
            ->orderBy('id', 'desc')
            ->limit(8)
            ->get();

        $pengumumanTerbaru = Pengumuman::orderBy('is_pinned', 'desc')
            ->orderBy('tanggal', 'desc')
            ->limit(5)
            ->get();

        return view('pages.index', compact(
            'settings',
            'totalWarga',
            'totalTetap',
            'totalKontrak',
            'saldoKas',
            'totalPemasukan',
            'totalPengeluaran',
            'pemasukanBulanIni',
            'pengeluaranBulanIni',
            'wargaLunasBulanIni',
            'wargaBelumLunas',
            'persenLunas',
            'transaksiTerbaru',
            'pengumumanTerbaru'
        ));
    }
}

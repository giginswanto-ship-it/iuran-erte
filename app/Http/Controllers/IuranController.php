<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Warga;
use App\Models\Transaksi;
use App\Models\Setting;
use App\Models\LogPerubahan;

class IuranController extends Controller
{
    /**
     * Dapatkan matriks status iuran 12 bulan (Jan - Des)
     */
    public function getMatrix(Request $request)
    {
        $year = $request->input('tahun', date('Y'));
        $blok = $request->input('blok', 'all');

        $query = Warga::query();
        if ($blok && $blok !== 'all') {
            $query->where('blok', 'LIKE', "{$blok}%");
        }
        $wargaList = $query->orderBy('blok', 'asc')->get();

        $transaksiIuran = Transaksi::where('jenis', 'pemasukan')
            ->where('tahun_iuran', $year)
            ->whereNotNull('bulan_iuran')
            ->get();

        // Bangun peta status: [warga_id][bulan] => transaksi
        $matrixMap = [];
        foreach ($transaksiIuran as $trx) {
            $matrixMap[$trx->warga_id][$trx->bulan_iuran] = $trx;
        }

        $result = $wargaList->map(function ($w) use ($matrixMap) {
            $months = [];
            for ($m = 1; $m <= 12; $m++) {
                $trx = $matrixMap[$w->id][$m] ?? null;
                $months[$m] = [
                    'lunas' => $trx !== null,
                    'transaksi_id' => $trx ? $trx->id : null,
                    'nominal' => $trx ? $trx->nominal : null,
                    'tanggal' => $trx ? $trx->tanggal->format('Y-m-d') : null,
                ];
            }
            return [
                'warga' => $w,
                'iuran' => $months
            ];
        });

        return response()->json([
            'success' => true,
            'tahun' => (int)$year,
            'blok' => $blok,
            'data' => $result
        ]);
    }

    /**
     * Catat pembayaran iuran (1 bulan atau multi-bulan)
     */
    public function pay(Request $request)
    {
        $validated = $request->validate([
            'warga_id' => 'required|exists:warga,id',
            'bulan' => 'required|array|min:1',
            'bulan.*' => 'integer|min:1|max:12',
            'tahun' => 'required|integer',
            'nominal_per_bulan' => 'required|integer|min:0',
            'metode' => 'nullable|string'
        ]);

        $warga = Warga::findOrFail($validated['warga_id']);
        $metode = $validated['metode'] ?? 'Tunai';
        $today = date('Y-m-d');
        $createdTransactions = [];

        foreach ($validated['bulan'] as $m) {
            // Cek apakah sudah pernah lunas
            $existing = Transaksi::where('warga_id', $warga->id)
                ->where('bulan_iuran', $m)
                ->where('tahun_iuran', $validated['tahun'])
                ->first();

            if ($existing) continue;

            $monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            $bulanStr = $monthNames[$m] ?? $m;

            $trx = Transaksi::create([
                'id' => 'trx_iuran_' . time() . '_' . $m . '_' . rand(10, 99),
                'tanggal' => $today,
                'jenis' => 'pemasukan',
                'kategori' => 'Iuran Warga',
                'uraian' => "Iuran Warga {$bulanStr} {$validated['tahun']} - {$warga->nama} ({$warga->blok})",
                'nominal' => $validated['nominal_per_bulan'],
                'warga_id' => $warga->id,
                'bulan_iuran' => $m,
                'tahun_iuran' => $validated['tahun'],
                'metode' => $metode
            ]);

            $createdTransactions[] = $trx;
        }

        LogPerubahan::create([
            'aksi' => 'BAYAR_IURAN',
            'keterangan' => "Pembayaran iuran {$warga->nama} ({$warga->blok}) sebanyak " . count($createdTransactions) . " bulan",
            'query_sql' => "-- Pembayaran iuran warga {$warga->id}"
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran iuran berhasil dicatat!',
            'count' => count($createdTransactions),
            'transaksi' => $createdTransactions
        ]);
    }
}

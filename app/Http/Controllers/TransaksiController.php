<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;
use App\Models\LogPerubahan;

class TransaksiController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaksi::with('warga');

        if ($request->filled('jenis') && $request->jenis !== 'all') {
            $query->where('jenis', $request->jenis);
        }

        if ($request->filled('kategori') && $request->kategori !== 'all') {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('uraian', 'LIKE', "%{$s}%")
                  ->orWhere('kategori', 'LIKE', "%{$s}%");
            });
        }

        $transaksi = $query->orderBy('tanggal', 'desc')->orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'total' => $transaksi->count(),
            'data' => $transaksi
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jenis' => 'required|in:pemasukan,pengeluaran',
            'kategori' => 'required|string|max:100',
            'uraian' => 'required|string',
            'nominal' => 'required|integer|min:1',
            'metode' => 'nullable|string'
        ]);

        $id = $request->input('id', 'trx_' . time() . '_' . rand(100, 999));
        $validated['id'] = $id;

        $trx = Transaksi::create($validated);

        LogPerubahan::create([
            'aksi' => 'INSERT_TRANSAKSI',
            'keterangan' => "Transaksi [{$trx->jenis}]: {$trx->uraian} (Rp " . number_format($trx->nominal, 0, ',', '.') . ")",
            'query_sql' => "INSERT INTO transaksi (id, tanggal, jenis, kategori, uraian, nominal) VALUES ('{$trx->id}', '{$trx->tanggal}', '{$trx->jenis}', '{$trx->kategori}', '{$trx->uraian}', {$trx->nominal});"
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dicatat!',
            'data' => $trx
        ]);
    }

    public function update(Request $request, $id)
    {
        $trx = Transaksi::findOrFail($id);

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:100',
            'uraian' => 'required|string',
            'nominal' => 'required|integer|min:1',
            'metode' => 'nullable|string'
        ]);

        $trx->update($validated);

        LogPerubahan::create([
            'aksi' => 'UPDATE_TRANSAKSI',
            'keterangan' => "Ubah transaksi ID: {$id}",
            'query_sql' => "UPDATE transaksi SET nominal={$trx->nominal}, uraian='{$trx->uraian}' WHERE id='{$id}';"
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil diperbarui!',
            'data' => $trx
        ]);
    }

    public function destroy($id)
    {
        $trx = Transaksi::findOrFail($id);
        $uraian = $trx->uraian;
        $trx->delete();

        LogPerubahan::create([
            'aksi' => 'DELETE_TRANSAKSI',
            'keterangan' => "Hapus transaksi ID: {$id} ({$uraian})",
            'query_sql' => "DELETE FROM transaksi WHERE id='{$id}';"
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus!'
        ]);
    }
}

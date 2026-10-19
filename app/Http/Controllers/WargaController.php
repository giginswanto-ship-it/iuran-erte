<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Warga;
use App\Models\LogPerubahan;

class WargaController extends Controller
{
    public function index(Request $request)
    {
        $query = Warga::query();

        // Filter Blok J1 sd J10
        if ($request->filled('blok') && $request->blok !== 'all') {
            $blok = $request->blok;
            $query->where('blok', 'LIKE', "{$blok}%");
        }

        // Search
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nama', 'LIKE', "%{$s}%")
                  ->orWhere('blok', 'LIKE', "%{$s}%")
                  ->orWhere('telp', 'LIKE', "%{$s}%");
            });
        }

        $warga = $query->orderBy('blok', 'asc')->get();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'total' => $warga->count(),
                'data' => $warga
            ]);
        }

        return response()->json($warga);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'blok' => 'required|string|max:50',
            'nama' => 'required|string|max:150',
            'telp' => 'nullable|string|max:50',
            'status' => 'required|string|in:Tetap,Kontrak',
            'nominal_iuran' => 'required|integer|min:0'
        ]);

        $id = $request->input('id', 'w_' . time() . '_' . rand(100, 999));
        $validated['id'] = $id;

        $warga = Warga::create($validated);

        // Audit Log
        LogPerubahan::create([
            'aksi' => 'INSERT_WARGA',
            'keterangan' => "Tambah data warga: {$warga->nama} ({$warga->blok})",
            'query_sql' => "INSERT INTO warga VALUES ('{$warga->id}', '{$warga->blok}', '{$warga->nama}', '{$warga->telp}', '{$warga->status}', {$warga->nominal_iuran});"
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data warga berhasil ditambahkan!',
            'data' => $warga
        ]);
    }

    public function update(Request $request, $id)
    {
        $warga = Warga::findOrFail($id);

        $validated = $request->validate([
            'blok' => 'required|string|max:50',
            'nama' => 'required|string|max:150',
            'telp' => 'nullable|string|max:50',
            'status' => 'required|string|in:Tetap,Kontrak',
            'nominal_iuran' => 'required|integer|min:0'
        ]);

        $warga->update($validated);

        LogPerubahan::create([
            'aksi' => 'UPDATE_WARGA',
            'keterangan' => "Perbarui data warga ID: {$id} ({$warga->nama})",
            'query_sql' => "UPDATE warga SET nama='{$warga->nama}', blok='{$warga->blok}' WHERE id='{$id}';"
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data warga berhasil diperbarui!',
            'data' => $warga
        ]);
    }

    public function destroy($id)
    {
        $warga = Warga::findOrFail($id);
        $nama = $warga->nama;
        $blok = $warga->blok;
        $warga->delete();

        LogPerubahan::create([
            'aksi' => 'DELETE_WARGA',
            'keterangan' => "Hapus data warga: {$nama} ({$blok})",
            'query_sql' => "DELETE FROM warga WHERE id='{$id}';"
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data warga berhasil dihapus!'
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SuaraWarga;

class SuaraWargaController extends Controller
{
    public function index(Request $request)
    {
        $query = SuaraWarga::query();

        if ($request->filled('kategori') && $request->kategori !== 'all') {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('judul', 'LIKE', "%{$s}%")
                  ->orWhere('isi', 'LIKE', "%{$s}%")
                  ->orWhere('pengirim', 'LIKE', "%{$s}%")
                  ->orWhere('blok', 'LIKE', "%{$s}%");
            });
        }

        $aspirasi = $query->orderBy('tanggal', 'desc')->get();

        return response()->json([
            'success' => true,
            'total' => $aspirasi->count(),
            'data' => $aspirasi
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'kategori' => 'required|string|max:100',
            'kategori_badge' => 'nullable|string|max:50',
            'pengirim' => 'required|string|max:150',
            'blok' => 'required|string|max:50',
            'is_anonim' => 'nullable|boolean',
            'tanggal' => 'required|date',
            'isi' => 'required|string'
        ]);

        $validated['id'] = $request->input('id', 'suara_' . time());
        $validated['status'] = 'Menunggu';
        $validated['dukungan'] = 0;

        $suara = SuaraWarga::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Aspirasi Anda berhasil dikirim ke Pengurus RT!',
            'data' => $suara
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $suara = SuaraWarga::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|string|in:Menunggu,Diproses,Selesai',
            'tanggapan_pesan' => 'nullable|string',
            'tanggapan_penjawab' => 'nullable|string'
        ]);

        $suara->status = $validated['status'];
        if (!empty($validated['tanggapan_pesan'])) {
            $suara->tanggapan_pesan = $validated['tanggapan_pesan'];
            $suara->tanggapan_penjawab = $validated['tanggapan_penjawab'] ?? 'Pengurus RT 10';
            $suara->tanggapan_tanggal = date('Y-m-d');
        }
        $suara->save();

        return response()->json([
            'success' => true,
            'message' => 'Status aspirasi berhasil diperbarui!',
            'data' => $suara
        ]);
    }
}

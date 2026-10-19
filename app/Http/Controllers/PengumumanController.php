<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pengumuman;

class PengumumanController extends Controller
{
    public function index()
    {
        $pengumuman = Pengumuman::orderBy('is_pinned', 'desc')
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'total' => $pengumuman->count(),
            'data' => $pengumuman
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'kategori' => 'required|string|max:100',
            'badge_color' => 'nullable|string|max:50',
            'is_pinned' => 'nullable|boolean',
            'tanggal' => 'required|date',
            'pengirim' => 'required|string|max:150',
            'isi' => 'required|string'
        ]);

        $validated['id'] = $request->input('id', 'pengumuman_' . time());
        $pengumuman = Pengumuman::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman baru berhasil diterbitkan!',
            'data' => $pengumuman
        ]);
    }

    public function update(Request $request, $id)
    {
        $pengumuman = Pengumuman::findOrFail($id);
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'kategori' => 'required|string|max:100',
            'badge_color' => 'nullable|string|max:50',
            'is_pinned' => 'nullable|boolean',
            'tanggal' => 'required|date',
            'pengirim' => 'required|string|max:150',
            'isi' => 'required|string'
        ]);

        $pengumuman->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil diperbarui!',
            'data' => $pengumuman
        ]);
    }

    public function destroy($id)
    {
        $pengumuman = Pengumuman::findOrFail($id);
        $pengumuman->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil dihapus!'
        ]);
    }
}

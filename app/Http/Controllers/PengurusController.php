<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pengurus;

class PengurusController extends Controller
{
    public function index()
    {
        $pengurus = Pengurus::all();
        return response()->json([
            'success' => true,
            'total' => $pengurus->count(),
            'data' => $pengurus
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jabatan' => 'required|string|max:100',
            'kategori' => 'required|string|max:50',
            'nama' => 'required|string|max:150',
            'blok' => 'nullable|string|max:50',
            'telp' => 'nullable|string|max:50',
            'badge' => 'nullable|string|max:50',
            'badge_color' => 'nullable|string|max:50',
            'avatar_bg' => 'nullable|string|max:50',
            'tugas' => 'nullable|string'
        ]);

        $validated['id'] = $request->input('id', 'pengurus_' . time());
        $pengurus = Pengurus::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Personalia pengurus berhasil ditambahkan!',
            'data' => $pengurus
        ]);
    }

    public function update(Request $request, $id)
    {
        $pengurus = Pengurus::findOrFail($id);
        $validated = $request->validate([
            'jabatan' => 'required|string|max:100',
            'kategori' => 'required|string|max:50',
            'nama' => 'required|string|max:150',
            'blok' => 'nullable|string|max:50',
            'telp' => 'nullable|string|max:50',
            'badge' => 'nullable|string|max:50',
            'badge_color' => 'nullable|string|max:50',
            'avatar_bg' => 'nullable|string|max:50',
            'tugas' => 'nullable|string'
        ]);

        $pengurus->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pengurus berhasil diperbarui!',
            'data' => $pengurus
        ]);
    }

    public function destroy($id)
    {
        $pengurus = Pengurus::findOrFail($id);
        $pengurus->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pengurus berhasil dihapus!'
        ]);
    }
}

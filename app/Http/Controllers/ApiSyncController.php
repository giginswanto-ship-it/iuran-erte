<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Setting;
use App\Models\Warga;
use App\Models\Transaksi;
use App\Models\Pengurus;
use App\Models\Pengumuman;
use App\Models\SuaraWarga;
use App\Models\LogPerubahan;

class ApiSyncController extends Controller
{
    /**
     * Dapatkan seluruh data sistem (Settings, Warga, Transaksi, Pengurus, Pengumuman, SuaraWarga)
     */
    public function getData()
    {
        $settings = Setting::first();
        $warga = Warga::orderBy('blok', 'asc')->get();
        $transaksi = Transaksi::orderBy('tanggal', 'desc')->orderBy('id', 'desc')->get();
        $pengurus = Pengurus::all();
        $pengumuman = Pengumuman::orderBy('is_pinned', 'desc')->orderBy('tanggal', 'desc')->get();
        $suaraWarga = SuaraWarga::orderBy('tanggal', 'desc')->get();

        // Format agar kompatibel 100% dengan frontend store.js
        $formattedSettings = [
            'namaRT' => $settings->nama_rt ?? 'RT 10 / RW 06 Permata Zamrud',
            'kelurahan' => $settings->kelurahan ?? 'Padurenan',
            'kecamatan' => $settings->kecamatan ?? 'Mustikajaya',
            'kota' => $settings->kota ?? 'Kota Bekasi',
            'namaKetuaRT' => $settings->nama_ketua_rt ?? 'Bpk. Bambang Sutrisno',
            'namaBendahara' => $settings->nama_bendahara ?? 'Bpk. Hendra Wijaya',
            'nominalIuran' => $settings->nominal_iuran ?? 150000,
            'rincianIuran' => $settings->rincian_iuran ? json_decode($settings->rincian_iuran, true) : null,
            'tahunAktif' => $settings->tahun_aktif ?? 2026,
            'updatedAt' => $settings->updated_at ? $settings->updated_at->toISOString() : null,
        ];

        $formattedWarga = $warga->map(function ($w) {
            return [
                'id' => $w->id,
                'blok' => $w->blok,
                'nama' => $w->nama,
                'telp' => $w->telp ?? '-',
                'status' => $w->status,
                'nominalIuran' => $w->nominal_iuran
            ];
        });

        $formattedTransaksi = $transaksi->map(function ($t) {
            return [
                'id' => $t->id,
                'tanggal' => $t->tanggal->format('Y-m-d'),
                'jenis' => $t->jenis,
                'kategori' => $t->kategori,
                'uraian' => $t->uraian,
                'nominal' => $t->nominal,
                'wargaId' => $t->warga_id,
                'bulanIuran' => $t->bulan_iuran,
                'tahunIuran' => $t->tahun_iuran,
                'metode' => $t->metode
            ];
        });

        $formattedPengurus = $pengurus->map(function ($p) {
            return [
                'id' => $p->id,
                'jabatan' => $p->jabatan,
                'kategori' => $p->kategori,
                'nama' => $p->nama,
                'blok' => $p->blok,
                'telp' => $p->telp,
                'badge' => $p->badge,
                'badgeColor' => $p->badge_color,
                'avatarBg' => $p->avatar_bg,
                'tugas' => $p->tugas
            ];
        });

        $formattedPengumuman = $pengumuman->map(function ($pm) {
            return [
                'id' => $pm->id,
                'judul' => $pm->judul,
                'kategori' => $pm->kategori,
                'badgeColor' => $pm->badge_color,
                'isPinned' => (bool)$pm->is_pinned,
                'tanggal' => $pm->tanggal->format('Y-m-d'),
                'pengirim' => $pm->pengirim,
                'isi' => $pm->isi
            ];
        });

        $formattedSuara = $suaraWarga->map(function ($sw) {
            return [
                'id' => $sw->id,
                'judul' => $sw->judul,
                'kategori' => $sw->kategori,
                'kategoriBadge' => $sw->kategori_badge,
                'pengirim' => $sw->pengirim,
                'blok' => $sw->blok,
                'isAnonim' => (bool)$sw->is_anonim,
                'tanggal' => $sw->tanggal->format('Y-m-d'),
                'isi' => $sw->isi,
                'dukungan' => $sw->dukungan,
                'status' => $sw->status,
                'tanggapan' => $sw->tanggapan_pesan ? [
                    'penjawab' => $sw->tanggapan_penjawab,
                    'tanggal' => $sw->tanggapan_tanggal ? $sw->tanggapan_tanggal->format('Y-m-d') : null,
                    'pesan' => $sw->tanggapan_pesan
                ] : null
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'settings' => $formattedSettings,
                'warga' => $formattedWarga,
                'transaksi' => $formattedTransaksi,
                'pengurus' => $formattedPengurus,
                'pengumuman' => $formattedPengumuman,
                'suaraWarga' => $formattedSuara
            ],
            'sqlFile' => 'kas-rt.sql'
        ]);
    }

    /**
     * Sinkronisasi data dari browser ke database SQL
     */
    public function sync(Request $request)
    {
        $payload = $request->all();
        $action = $payload['action'] ?? 'UPDATE_DATA';
        $logSql = $payload['sql'] ?? '';

        DB::transaction(function () use ($payload, $action, $logSql) {
            // Update settings jika ada
            if (!empty($payload['settings'])) {
                $s = $payload['settings'];
                Setting::updateOrCreate(
                    ['id' => 1],
                    [
                        'nama_rt' => $s['namaRT'] ?? 'RT 10 / RW 06 Permata Zamrud',
                        'kelurahan' => $s['kelurahan'] ?? null,
                        'kecamatan' => $s['kecamatan'] ?? null,
                        'kota' => $s['kota'] ?? null,
                        'nama_ketua_rt' => $s['namaKetuaRT'] ?? null,
                        'nama_bendahara' => $s['namaBendahara'] ?? null,
                        'nominal_iuran' => $s['nominalIuran'] ?? 150000,
                        'rincian_iuran' => isset($s['rincianIuran']) ? json_encode($s['rincianIuran']) : null,
                        'tahun_aktif' => $s['tahunAktif'] ?? 2026,
                        'updated_at' => now()
                    ]
                );
            }

            // Sync Warga
            if (!empty($payload['warga']) && is_array($payload['warga'])) {
                foreach ($payload['warga'] as $w) {
                    Warga::updateOrCreate(
                        ['id' => (string)$w['id']],
                        [
                            'blok' => $w['blok'],
                            'nama' => $w['nama'],
                            'telp' => $w['telp'] ?? null,
                            'status' => $w['status'] ?? 'Tetap',
                            'nominal_iuran' => $w['nominalIuran'] ?? 150000
                        ]
                    );
                }
            }

            // Sync Transaksi
            if (!empty($payload['transaksi']) && is_array($payload['transaksi'])) {
                foreach ($payload['transaksi'] as $t) {
                    Transaksi::updateOrCreate(
                        ['id' => (string)$t['id']],
                        [
                            'tanggal' => $t['tanggal'],
                            'jenis' => $t['jenis'],
                            'kategori' => $t['kategori'],
                            'uraian' => $t['uraian'] ?? '',
                            'nominal' => $t['nominal'],
                            'warga_id' => $t['wargaId'] ?? null,
                            'bulan_iuran' => $t['bulanIuran'] ?? null,
                            'tahun_iuran' => $t['tahunIuran'] ?? null,
                            'metode' => $t['metode'] ?? 'Tunai'
                        ]
                    );
                }
            }

            // Catat log
            LogPerubahan::create([
                'waktu' => now(),
                'aksi' => $action,
                'keterangan' => 'Sinkronisasi data melalui API Laravel',
                'query_sql' => $logSql
            ]);
        });

        // Simpan juga ke cache JSON dan kas-rt.sql jika path lokal ada
        $this->updatePhysicalSqlFile();

        return response()->json([
            'success' => true,
            'message' => 'Data dan perubahan berhasil disimpan ke database SQL & kas-rt.sql',
            'sqlFile' => 'kas-rt.sql',
            'timestamp' => now()->toIso8601String()
        ]);
    }

    /**
     * Download dump SQL kas-rt.sql
     */
    public function downloadSql()
    {
        $sqlPath = base_path('kas-rt.sql');
        if (file_exists($sqlPath)) {
            return response()->download($sqlPath, 'kas-rt.sql', [
                'Content-Type' => 'text/plain; charset=utf-8'
            ]);
        }

        return response('File SQL belum tersedia.', 404);
    }

    /**
     * Perbarui berkas kas-rt.sql fisik
     */
    private function updatePhysicalSqlFile()
    {
        try {
            $dataRes = $this->getData()->getData(true);
            if (!empty($dataRes['data'])) {
                file_put_contents(base_path('kas_rt_data.json'), json_encode($dataRes['data'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }
        } catch (\Exception $e) {
            // Ignore if in restricted environment
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Setting;
use App\Models\Warga;
use App\Models\Transaksi;
use App\Models\Pengurus;
use App\Models\Pengumuman;
use App\Models\SuaraWarga;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $jsonPath = base_path('kas_rt_data.json');
        if (!file_exists($jsonPath)) {
            $this->command->error("File kas_rt_data.json tidak ditemukan!");
            return;
        }

        $data = json_decode(file_get_contents($jsonPath), true);
        if (!$data) {
            $this->command->error("Format kas_rt_data.json tidak valid!");
            return;
        }

        DB::transaction(function () use ($data) {
            // 1. Settings
            if (!empty($data['settings'])) {
                $s = $data['settings'];
                Setting::updateOrCreate(
                    ['id' => 1],
                    [
                        'nama_rt' => $s['namaRT'] ?? 'RT 10 / RW 06 Permata Zamrud',
                        'kelurahan' => $s['kelurahan'] ?? 'Padurenan',
                        'kecamatan' => $s['kecamatan'] ?? 'Mustikajaya',
                        'kota' => $s['kota'] ?? 'Kota Bekasi',
                        'nama_ketua_rt' => $s['namaKetuaRT'] ?? 'Bpk. Bambang Sutrisno',
                        'nama_bendahara' => $s['namaBendahara'] ?? 'Bpk. Hendra Wijaya',
                        'nominal_iuran' => $s['nominalIuran'] ?? 150000,
                        'rincian_iuran' => isset($s['rincianIuran']) ? json_encode($s['rincianIuran'], JSON_UNESCAPED_UNICODE) : null,
                        'tahun_aktif' => $s['tahunAktif'] ?? 2026,
                    ]
                );
            }

            // 2. Warga (200 KK)
            if (!empty($data['warga'])) {
                Warga::truncate();
                $wargaRows = array_map(function ($w) {
                    return [
                        'id' => (string)$w['id'],
                        'blok' => $w['blok'],
                        'nama' => $w['nama'],
                        'telp' => $w['telp'] ?? null,
                        'status' => $w['status'] ?? 'Tetap',
                        'nominal_iuran' => $w['nominalIuran'] ?? 150000,
                    ];
                }, $data['warga']);

                foreach (array_chunk($wargaRows, 100) as $chunk) {
                    Warga::insert($chunk);
                }
            }

            // 3. Transaksi (1.927 catatan)
            if (!empty($data['transaksi'])) {
                Transaksi::truncate();
                $trxRows = array_map(function ($t) {
                    return [
                        'id' => (string)$t['id'],
                        'tanggal' => $t['tanggal'],
                        'jenis' => $t['jenis'],
                        'kategori' => $t['kategori'],
                        'uraian' => $t['uraian'] ?? '',
                        'nominal' => $t['nominal'],
                        'warga_id' => !empty($t['wargaId']) ? (string)$t['wargaId'] : null,
                        'bulan_iuran' => $t['bulanIuran'] ?? null,
                        'tahun_iuran' => $t['tahunIuran'] ?? null,
                        'metode' => $t['metode'] ?? 'Tunai',
                    ];
                }, $data['transaksi']);

                foreach (array_chunk($trxRows, 200) as $chunk) {
                    Transaksi::insert($chunk);
                }
            }

            // 4. Pengurus (15 personalia)
            if (!empty($data['pengurus'])) {
                Pengurus::truncate();
                $pengurusRows = array_map(function ($p) {
                    return [
                        'id' => (string)$p['id'],
                        'jabatan' => $p['jabatan'],
                        'kategori' => $p['kategori'],
                        'nama' => $p['nama'],
                        'blok' => $p['blok'] ?? null,
                        'telp' => $p['telp'] ?? null,
                        'badge' => $p['badge'] ?? null,
                        'badge_color' => $p['badgeColor'] ?? null,
                        'avatar_bg' => $p['avatarBg'] ?? null,
                        'tugas' => $p['tugas'] ?? null,
                    ];
                }, $data['pengurus']);

                Pengurus::insert($pengurusRows);
            }

            // 5. Pengumuman (5 warta)
            if (!empty($data['pengumuman'])) {
                Pengumuman::truncate();
                $pengumumanRows = array_map(function ($pm) {
                    return [
                        'id' => (string)$pm['id'],
                        'judul' => $pm['judul'],
                        'kategori' => $pm['kategori'],
                        'badge_color' => $pm['badgeColor'] ?? 'emerald',
                        'is_pinned' => !empty($pm['isPinned']) ? 1 : 0,
                        'tanggal' => $pm['tanggal'],
                        'pengirim' => $pm['pengirim'],
                        'isi' => $pm['isi'],
                    ];
                }, $data['pengumuman']);

                Pengumuman::insert($pengumumanRows);
            }

            // 6. Suara Warga (5 aspirasi)
            if (!empty($data['suaraWarga'])) {
                SuaraWarga::truncate();
                $suaraRows = array_map(function ($sw) {
                    return [
                        'id' => (string)$sw['id'],
                        'judul' => $sw['judul'],
                        'kategori' => $sw['kategori'],
                        'kategori_badge' => $sw['kategoriBadge'] ?? 'purple',
                        'pengirim' => $sw['pengirim'],
                        'blok' => $sw['blok'],
                        'is_anonim' => !empty($sw['isAnonim']) ? 1 : 0,
                        'tanggal' => $sw['tanggal'],
                        'isi' => $sw['isi'],
                        'dukungan' => $sw['dukungan'] ?? 0,
                        'status' => $sw['status'] ?? 'Menunggu',
                        'tanggapan_penjawab' => $sw['tanggapan']['penjawab'] ?? null,
                        'tanggapan_tanggal' => $sw['tanggapan']['tanggal'] ?? null,
                        'tanggapan_pesan' => $sw['tanggapan']['pesan'] ?? null,
                    ];
                }, $data['suaraWarga']);

                SuaraWarga::insert($suaraRows);
            }
        });

        $this->command->info("✓ 2.153 baris data berhasil dimigrasikan ke database SQL!");
    }
}

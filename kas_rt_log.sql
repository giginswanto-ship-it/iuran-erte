-- ========================================================
-- LOG PERUBAHAN DATA KAS RT (SQL AUDIT LOG)
-- Berkas: kas_rt_log.sql
-- Waktu Inisialisasi: 2026-10-18T23:25:37.752Z
-- ========================================================

-- [2026-10-18T23:25:37.752Z] INISIALISASI DATA AWAL
INSERT INTO log_perubahan (aksi, keterangan) VALUES ('INIT', 'Inisialisasi sistem kas RT dan pembuatan berkas kas_rt.sql');

-- [2026-10-18T23:36:14.001Z] AKSI: INJEKSI_DATA_DUMMY_RT10_RW10
-- Berhasil membuat 200 data warga (Blok J1 s/d J10 No. 1-20) dengan tarif iuran Rp 150.000
INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('2026-10-18T23:36:14.001Z', 'GENERATE_DUMMY_RT10_RW10', 'Inisialisasi 200 KK Blok J1-J10 dan 1900+ transaksi kas iuran 2026');

-- [2026-10-18T23:46:11.465Z] AKSI: UPDATE_SETTINGS
UPDATE settings SET nama_rt = 'RT 10 / RW 10', kelurahan = 'Cimuning', kecamatan = 'Kecamatan Mustikajaya', kota = 'Kota Bekasi', nama_ketua_rt = 'Ibu Yati', nama_bendahara = 'Bpk. Josua Hendro', nominal_iuran = 150000, rincian_iuran = 'Kebersihan & Sampah: Rp 75.000, Keamanan & Satpam: Rp 50.000, Kas RT: Rp 25.000', tahun_aktif = 2026, updated_at = CURRENT_TIMESTAMP WHERE id = 1;
INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('2026-10-18T23:46:11.465Z', 'UPDATE_SETTINGS', 'Sinkronisasi data ke kas_rt.sql');

-- [2026-10-18T23:48:42.177Z] AKSI: UPDATE_SETTINGS
UPDATE settings SET nama_rt = 'RT 10 / RW 10', kelurahan = 'Cimuning', kecamatan = 'Kecamatan Mustikajaya', kota = 'Kota Bekasi', nama_ketua_rt = 'Ibu Yati', nama_bendahara = 'Bpk. Josua Hendro', nominal_iuran = 150000, rincian_iuran = 'Kebersihan & Sampah: Rp 75.000, Keamanan & Satpam: Rp 50.000, Kas RT: Rp 25.000', tahun_aktif = 2026, updated_at = CURRENT_TIMESTAMP WHERE id = 1;
INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('2026-10-18T23:48:42.177Z', 'UPDATE_SETTINGS', 'Sinkronisasi data ke kas_rt.sql');

-- [2026-10-19T00:06:05.164Z] AKSI: UPDATE_SETTINGS
UPDATE settings SET nama_rt = 'RT 10 / RW 10', kelurahan = 'Cimuning', kecamatan = 'Kecamatan Mustikajaya', kota = 'Kota Bekasi', nama_ketua_rt = 'Ibu Yati', nama_bendahara = 'Bpk. Josua Hendro', nominal_iuran = 150000, rincian_iuran = 'Kebersihan & Sampah: Rp 75.000, Keamanan & Satpam: Rp 50.000, Kas RT: Rp 25.000', tahun_aktif = 2026, updated_at = CURRENT_TIMESTAMP WHERE id = 1;
INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('2026-10-19T00:06:05.164Z', 'UPDATE_SETTINGS', 'Sinkronisasi data ke kas_rt.sql');

-- [2026-10-19T00:29:05.871Z] AKSI: HAPUS_TRANSAKSI (Iuran Warga (Iuran Bulan 3/2026 - Blok J10 No. 12 (Bagus Hidayat)))
DELETE FROM transaksi WHERE id = 'tx-582';
INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('2026-10-19T00:29:05.871Z', 'HAPUS_TRANSAKSI (Iuran Warga (Iuran Bulan 3/2026 - Blok J10 No. 12 (Bagus Hidayat)))', 'Sinkronisasi data ke kas_rt.sql');

-- [2026-10-19T00:39:47.520Z] AKSI: UPDATE_SETTINGS
UPDATE settings SET nama_rt = 'RT 10 / RW 10', kelurahan = 'Cimuning', kecamatan = 'Kecamatan Mustikajaya', kota = 'Kota Bekasi', nama_ketua_rt = 'Ibu Yati', nama_bendahara = 'Bpk. Josua Hendro', nominal_iuran = 150000, rincian_iuran = 'Kebersihan & Sampah: Rp 75.000, Keamanan & Satpam: Rp 50.000, Kas RT: Rp 25.000', tahun_aktif = 2026, updated_at = CURRENT_TIMESTAMP WHERE id = 1;
INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('2026-10-19T00:39:47.520Z', 'UPDATE_SETTINGS', 'Sinkronisasi data ke kas_rt.sql');

-- [2026-10-19T00:40:32.052Z] AKSI: UPDATE_PENGURUS
INSERT INTO pengurus ...
INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('2026-10-19T00:40:32.052Z', 'UPDATE_PENGURUS', 'Sinkronisasi data ke kas_rt.sql');

-- [2026-10-19T00:41:15.650Z] AKSI: INIT_FULL_DATA
Full data restoration
INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('2026-10-19T00:41:15.650Z', 'INIT_FULL_DATA', 'Sinkronisasi data ke kas_rt.sql');

-- [2026-10-19T01:30:59.295Z] AKSI: HAPUS_TRANSAKSI (Iuran Warga (Iuran Bulan 1/2026 - Blok J1 No. 01 (Bambang Sutrisno (Ketua RT))))
DELETE FROM transaksi WHERE id = 'tx-2';
INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('2026-10-19T01:30:59.295Z', 'HAPUS_TRANSAKSI (Iuran Warga (Iuran Bulan 1/2026 - Blok J1 No. 01 (Bambang Sutrisno (Ketua RT))))', 'Sinkronisasi data ke kas_rt.sql');

-- [2026-10-19T01:31:10.735Z] AKSI: BAYAR_IURAN (Iuran Bulan Januari 2026 - Blok J1 No. 01 (Bambang Sutrisno (Ketua RT)))
INSERT INTO transaksi (id, tanggal, jenis, kategori, uraian, nominal, warga_id, bulan_iuran, tahun_iuran, metode) VALUES ('tx-1792373470225-737', '2026-10-19', 'iuran', 'Iuran Warga', 'Iuran Bulan Januari 2026 - Blok J1 No. 01 (Bambang Sutrisno (Ketua RT))', 150000, 'w-1', 1, 2026, 'Tunai / Cash');
INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('2026-10-19T01:31:10.735Z', 'BAYAR_IURAN (Iuran Bulan Januari 2026 - Blok J1 No. 01 (Bambang Sutrisno (Ketua RT)))', 'Sinkronisasi data ke kas_rt.sql');

-- [2026-10-19 01:39:35] AKSI: MIGRASI_TOTAL_DATA_LOKAL_KE_SQL
-- Memindahkan 100% data lokal (Settings, 200 KK Warga, 1927 Transaksi, 15 Pengurus, 5 Pengumuman, 5 Suara Warga) ke berkas kas_rt.sql
INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('2026-10-19 01:39:35', 'MIGRASI_TOTAL_DATA_LOKAL_KE_SQL', 'Migrasi lengkap semua entitas lokal ke berkas database kas_rt.sql');


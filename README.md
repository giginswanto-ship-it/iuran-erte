# 📋 Aplikasi Catatan Uang Kas RT (Iuran Warga & Pengeluaran)
### Berbasis Framework Laravel & Database SQL

Aplikasi web modern, rapi, dan mudah digunakan untuk mengelola keuangan Rukun Tetangga (RT), mencatat iuran bulanan seluruh warga, pembukuan pengeluaran rutin, serta mencetak laporan keuangan resmi dan bukti pembayaran WhatsApp. Kini dilengkapi dengan fondasi **Framework Laravel & Database SQL**.

---

## 🌟 Fitur Utama

1. **Dashboard Keuangan Realtime**
   - Ringkasan Saldo Kas RT terkini.
   - Total Pemasukan & Pengeluaran bulan berjalan.
   - Persentase & perbandingan jumlah warga yang sudah lunas vs belum lunas.
   - Grafik arus kas bulanan (Chart.js) interaktif.

2. **Matriks Iuran Warga (12 Bulan / Jan - Des)**
   - Tampilan grid praktis status iuran seluruh warga dalam satu layar.
   - Indikator warna: Hijau (Lunas) & Merah (Belum Lunas).
   - **Filter Blok J1 sd J10**: Memilih wilayah blok secara spesifik untuk kemudahan pemantauan.
   - **Bayar 1 Bulan Cepat**: Klik kotak bulan untuk langsung mencatat bayar.
   - **Bayar Multi-Bulan / Sekaligus**: Fitur bayar beberapa bulan sekaligus di muka atau pelunasan tunggakan.
   - **Generator Kwitansi & Pesan WhatsApp**: Otomatis membuat format teks tanda terima pembayaran yang rapi untuk dikirimkan ke WhatsApp warga.

3. **Pencatatan Pengeluaran & Pemasukan Non-Iuran**
   - Kategori pengeluaran: *Kebersihan & Sampah, Keamanan & Satpam, Perbaikan Fasum, Acara Warga/Agustusan, Santunan Sosial, Konsumsi Rapat, ATK, dll.*
   - Pemasukan non-iuran: *Saldo awal, Donasi warga, Sewa lapangan/fasilitas, dll.*
   - Fitur Edit & Hapus transaksi.

4. **Data Master Warga / KK (Blok J1 s/d J10)**
   - **Filter Pill & Dropdown Blok J1 - J10**: Pemilahan blok secara instan.
   - Form Tambah & Edit Warga dengan dropdown pilihan blok dan nomor rumah terpisah.
   - Manajemen daftar kepala keluarga (Blok/No Rumah, Nama, No WhatsApp, Status Rumah Tetap/Kontrak).
   - Kustomisasi nominal iuran per warga jika ada kategori khusus.
   - Tautan langsung chat WhatsApp warga.

5. **Laporan Keuangan & Buku Kas Umum**
   - **Buku Kas Umum**: Saldo kas berjalan (Running balance) otomatis setiap ada mutasi.
   - **Rekap Tunggakan**: Mengetahui siapa saja warga yang belum bayar beserta nominalnya.
   - **Format Cetak Laporan (Print / Simpan PDF)**: Lengkap dengan Kop Surat RT dan kolom tanda tangan Ketua RT & Bendahara.
   - **Export ke Excel (.xlsx)**: Mengunduh Buku Kas & Matriks Iuran langsung dalam format spreadsheet.
   - **Export ke SQL (.sql)**: Mengunduh seluruh skrip database SQL yang siap di-import ke SQLite, MySQL, PostgreSQL, MariaDB.

6. **Arsitektur Framework Laravel & Database SQL**
   - **Laravel 11 MVC**: Lengkap dengan Model Eloquent, Controller RESTful, Migrations, dan Seeders.
   - **Database SQL (MySQL / MariaDB / SQLite)**: 7 tabel terstruktur (`settings`, `warga`, `transaksi`, `pengurus`, `pengumuman`, `suara_warga`, `log_perubahan`).
   - **Seeder Otomatis**: Memindahkan 2.153 baris data riil langsung ke database SQL lewat perintah `php artisan db:seed`.
   - **Auto-Sync & Audit Log**: Riwayat transaksi dan perubahan data tersimpan kronologis di SQL.

---

## 🚀 Cara Menjalankan

### Opsi A (Menjalankan dengan Framework Laravel)
Pastikan PHP dan Composer telah terpasang di komputer/server Anda:
1. Konfigurasi database di berkas `.env` (misal MySQL di XAMPP / Laragon).
2. Jalankan perintah instalasi & migrasi database:
   ```bash
   composer install
   php artisan migrate --seed
   php artisan serve
   ```
3. Buka peramban di `http://127.0.0.1:8000`.

### Opsi B (Jalan Langsung via Shortcut start.bat)
Klik dua kali pada file `start.bat`. Sistem akan mendeteksi:
- Jika PHP terpasang: Otomatis menjalankan server Laravel Artisan (`http://127.0.0.1:8000`).
- Jika PHP belum aktif: Otomatis menjalankan server Node.js lokal dengan auto-sync berkas `kas-rt.sql` (`http://localhost:3000`).

### Opsi C (Langsung Tanpa Server)
Buka berkas `index.html` di peramban Anda (Chrome, Edge, Firefox). Data tersimpan di penyimpanan lokal browser.

---

## 📁 Struktur Proyek Laravel

```
ERTE10ZAMRUD/
├── app/
│   ├── Http/Controllers/   # Controller: Dashboard, Warga, Iuran, Transaksi, Pengumuman, dll
│   ├── Models/             # Model Eloquent: Setting, Warga, Transaksi, Pengurus, dll
│   └── Providers/          # Service Providers Laravel
├── bootstrap/              # Inisialisasi & konfigurasi framework Laravel
├── config/                 # Konfigurasi app, database (MySQL/SQLite), session, cors
├── database/
│   ├── migrations/         # 7 migrasi tabel SQL lengkap
│   └── seeders/            # Seeder 2.153 rekod data ke database SQL
├── public/                 # Direktori publik (index.php, .htaccess, css, js)
├── resources/
│   └── views/pages/        # Blade Template: index.blade.php
├── routes/                 # Rute web.php & api.php (RESTful API)
├── storage/                # Penyimpanan cache, sesi, dan log Laravel
├── composer.json           # Dependensi paket Laravel
├── .env / .env.example     # Konfigurasi basis data & environment
├── artisan                 # Command Line Interface Laravel
├── kas-rt.sql              # Berkas fisik database SQL utama (2.153 baris data)
├── kas_rt.sql              # Berkas fisik database SQL cadangan
├── kas_rt_log.sql          # Riwayat audit perubahan SQL
├── start.bat               # Peluncur otomatis
└── server.js               # Node.js server cadangan
```

---

## 💻 Pengembang & Dukungan Teknis

Portal ini dikembangkan dan didukung penuh oleh:
* **[dutaglobaltech.com](https://dutaglobaltech.com)** — Solusi TI, Pengembangan Perangkat Lunak, dan Cloud Systems.
* **[mysnaprint.dutaglobaltech.com](https://mysnaprint.dutaglobaltech.com)** — Layanan Percetakan Digital Cepat, Desain, dan Solusi Dokumen.

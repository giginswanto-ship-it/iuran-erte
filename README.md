# 📋 Aplikasi Catatan Uang Kas RT (Iuran Warga & Pengeluaran)

Aplikasi web modern, rapi, dan mudah digunakan untuk mengelola keuangan Rukun Tetangga (RT), mencatat iuran bulanan seluruh warga, pembukuan pengeluaran rutin, serta mencetak laporan keuangan resmi dan bukti pembayaran WhatsApp.

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
   - **Bayar 1 Bulan Cepat**: Klik kotak bulan untuk langsung mencatat bayar.
   - **Bayar Multi-Bulan / Sekaligus**: Fitur bayar beberapa bulan sekaligus di muka atau pelunasan tunggakan.
   - **Generator Kwitansi & Pesan WhatsApp**: Otomatis membuat format teks tanda terima pembayaran yang rapi untuk dikirimkan ke WhatsApp warga.

3. **Pencatatan Pengeluaran & Pemasukan Non-Iuran**
   - Kategori pengeluaran: *Kebersihan & Sampah, Keamanan & Satpam, Perbaikan Fasum, Acara Warga/Agustusan, Santunan Sosial, Konsumsi Rapat, ATK, dll.*
   - Pemasukan non-iuran: *Saldo awal, Donasi warga, Sewa lapangan/fasilitas, dll.*
   - Fitur Edit & Hapus transaksi.

4. **Data Master Warga / KK**
   - Manajemen daftar kepala keluarga (Blok/No Rumah, Nama, No WhatsApp, Status Rumah Tetap/Kontrak).
   - Kustomisasi nominal iuran per warga jika ada kategori khusus.
   - Tautan langsung chat WhatsApp warga.

5. **Laporan Keuangan & Buku Kas Umum**
   - **Buku Kas Umum**: Saldo kas berjalan (Running balance) otomatis setiap ada mutasi.
   - **Rekap Tunggakan**: Mengetahui siapa saja warga yang belum bayar beserta nominalnya.
   - **Format Cetak Laporan (Print / Simpan PDF)**: Lengkap dengan Kop Surat RT dan kolom tanda tangan Ketua RT & Bendahara.
   - **Export ke Excel (.xlsx)**: Mengunduh Buku Kas & Matriks Iuran langsung dalam format spreadsheet.
   - **Export ke SQL (.sql)**: Mengunduh seluruh skrip database SQL yang siap di-import ke SQLite, MySQL, PostgreSQL, MariaDB.

6. **Database SQL Otomatis & Keamanan Data (SQL File & LocalStorage)**
   - **Auto-Sync SQL (`kas-rt.sql` / `kas_rt.sql`)**: Setiap penambahan data warga, pengeluaran kas, maupun pembayaran iuran warga otomatis disimpan ke berkas fisik `kas-rt.sql` dan `kas_rt.sql`.
   - **Audit Log Perubahan (`kas_rt_log.sql`)**: Mencatat riwayat setiap perintah SQL (`INSERT`, `UPDATE`, `DELETE`) secara kronologis beserta timestamp.
   - **Import & Pulihkan SQL**: Mendukung unggah berkas `.sql` untuk pemulihan instan basis data.
   - **Cadangan Alternatif (JSON)**: Mendukung cadangan dan pemulihan format JSON.

---

## 🚀 Cara Menjalankan

Aplikasi ini dapat dijalankan dengan 2 cara praktis:

- **Cara 1 (Rekomendasi - Sinkronisasi SQL Otomatis)**:
  Klik dua kali pada file `start.bat` (atau ketik `node server.js` di terminal). Browser akan otomatis terbuka di `http://localhost:3000` dan seluruh perubahan data akan tersimpan langsung ke file `kas-rt.sql` & `kas_rt.sql`.
- **Cara 2 (Langsung Tanpa Server)**:
  Klik dua kali pada file `index.html` di peramban Anda (Chrome, Edge, Firefox). Data tersimpan di penyimpanan lokal browser dan dapat diunduh kapan saja dalam bentuk file `.sql`.

---

## 📁 Struktur File

```
ERTE10ZAMRUD/
├── index.html              # Antarmuka utama aplikasi
├── server.js               # Web server & auto-sync database SQL (Node.js)
├── start.bat               # Shortcut peluncur aplikasi sekali klik
├── kas-rt.sql              # Berkas fisik database SQL utama (DDL & DML data lengkap)
├── kas_rt.sql              # Berkas fisik database SQL (Kompatibilitas sinkron ganda)
├── kas_rt_log.sql          # Riwayat audit perubahan data (INSERT/UPDATE/DELETE)
├── README.md               # Panduan penggunaan
├── css/
│   └── custom.css          # Styling custom & format cetak print-ready
└── js/
    ├── app.js              # Inisialisasi utama & navigasi
    ├── store.js            # State management, rumus keuangan & SQL Sync
    ├── dashboard.js        # Ringkasan visual & chart arus kas
    ├── iuran.js            # Matriks 12 bulan & generator kwitansi WA
    ├── pengeluaran.js      # Form & tabel pengeluaran kas
    ├── warga.js            # Manajemen daftar warga / KK
    ├── pengumuman.js       # Portal Warta & Susunan Pengurus RT
    ├── suaraWarga.js       # Ruang aspirasi warga (maks. 100 kata)
    ├── laporan.js          # Generator buku kas, cetak PDF, export Excel
    └── dummyData.js        # Data contoh awal
```

---

## 💻 Pengembang & Dukungan Teknis

Portal ini dikembangkan dan didukung penuh oleh:
* **[dutaglobaltech.com](https://dutaglobaltech.com)** — Solusi TI, Pengembangan Perangkat Lunak, dan Cloud Systems.
* **[mysnaprint.dutaglobaltech.com](https://mysnaprint.dutaglobaltech.com)** — Layanan Percetakan Digital Cepat, Desain, dan Solusi Dokumen.



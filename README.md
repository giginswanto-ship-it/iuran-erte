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

6. **Pengaturan & Keamanan Data (Offline / LocalStorage)**
   - Mengubah nama RT, RW, Kelurahan, Kecamatan, Kota, Ketua RT & Bendahara.
   - Mengubah tarif standar iuran bulanan.
   - **Cadangan Data (Backup JSON)**: Unduh data kas RT ke file JSON.
   - **Pemulihan Data (Restore JSON)**: Unggah kembali file backup jika berganti perangkat / komputer.

---

## 🚀 Cara Menjalankan

Aplikasi ini dapat langsung digunakan **tanpa perlu instalasi software tambahan**:

1. Buka folder `UANG IURAN ERTE`.
2. Klik dua kali (double click) pada file `index.html` untuk membukanya di browser favorit Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, dll.).
3. Aplikasi langsung siap digunakan! Data yang Anda masukkan akan otomatis tersimpan di peramban (browser) Anda.

---

## 📁 Struktur File

```
UANG IURAN ERTE/
├── index.html              # Antarmuka utama aplikasi
├── README.md               # Panduan penggunaan
├── css/
│   └── custom.css          # Styling custom & format cetak print-ready
└── js/
    ├── app.js              # Inisialisasi utama & navigasi
    ├── store.js            # State management, rumus keuangan & backup/restore
    ├── dashboard.js        # Ringkasan visual & chart arus kas
    ├── iuran.js            # Matriks 12 bulan & generator kwitansi WA
    ├── pengeluaran.js      # Form & tabel pengeluaran kas
    ├── warga.js            # Manajemen daftar warga / KK
    ├── laporan.js          # Generator buku kas, cetak PDF, export Excel
    └── dummyData.js        # Data contoh awal
```

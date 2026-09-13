/**
 * Data Awal / Contoh Realistis untuk Kas RT
 */
const DEFAULT_SETTINGS = {
  namaRt: "RT 05 / RW 08",
  kelurahan: "Kelurahan Sukamaju",
  kecamatan: "Kecamatan Cilodong",
  kota: "Kota Depok",
  namaKetuaRt: "Bpk. Bambang Sutrisno",
  namaBendahara: "Bpk. Hendra Wijaya",
  nominalIuran: 50000, // Rp 50.000 / bulan
  rincianIuran: "Kebersihan/Sampah: Rp 25.000, Keamanan: Rp 15.000, Kas RT: Rp 10.000",
  tahunAktif: new Date().getFullYear()
};

const DEFAULT_WARGA = [
  { id: "w-1", blok: "A-01", nama: "Bambang Sutrisno (Ketua RT)", telp: "081234567801", status: "Tetap", nominalIuran: 50000 },
  { id: "w-2", blok: "A-02", nama: "Hendra Wijaya (Bendahara)", telp: "081234567802", status: "Tetap", nominalIuran: 50000 },
  { id: "w-3", blok: "A-03", nama: "Ahmad Dahlan", telp: "081234567803", status: "Tetap", nominalIuran: 50000 },
  { id: "w-4", blok: "A-04", nama: "Budi Santoso", telp: "081234567804", status: "Tetap", nominalIuran: 50000 },
  { id: "w-5", blok: "A-05", nama: "Cahyono Wibowo", telp: "081234567805", status: "Kontrak", nominalIuran: 50000 },
  { id: "w-6", blok: "B-01", nama: "Dedi Setiawan", telp: "081234567806", status: "Tetap", nominalIuran: 50000 },
  { id: "w-7", blok: "B-02", nama: "Eko Prasetyo", telp: "081234567807", status: "Tetap", nominalIuran: 50000 },
  { id: "w-8", blok: "B-03", nama: "Faisal Tanjung", telp: "081234567808", status: "Kontrak", nominalIuran: 50000 },
  { id: "w-9", blok: "B-04", nama: "Gunawan Hakim", telp: "081234567809", status: "Tetap", nominalIuran: 50000 },
  { id: "w-10", blok: "C-01", nama: "Herman Susilo", telp: "081234567810", status: "Tetap", nominalIuran: 50000 },
  { id: "w-11", blok: "C-02", nama: "Irfan Maulana", telp: "081234567811", status: "Tetap", nominalIuran: 50000 },
  { id: "w-12", blok: "C-03", nama: "Joko Supriyanto", telp: "081234567812", status: "Tetap", nominalIuran: 50000 }
];

const CATEGORIES_PENGELUARAN = [
  "Kebersihan & Sampah",
  "Keamanan & Satpam",
  "Perbaikan & Fasilitas Umum",
  "Kegiatan Sosial & Santunan",
  "Acara Warga / Agustusan / Hari Raya",
  "Konsumsi Rapat / Kerja Bakti",
  "ATK & Perlengkapan RT",
  "Lain-lain"
];

const CATEGORIES_PEMASUKAN_LAIN = [
  "Saldo Awal Kas",
  "Donasi / Sumbangan Warga",
  "Sewa Lapangan / Fasilitas RT",
  "Dana Bantuan Kelurahan / RW",
  "Lain-lain"
];

// Helper to generate sample transactions for the current year
function generateInitialTransactions() {
  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1 to 12
  
  const transactions = [];
  let idCounter = 1;

  // 1. Saldo Awal Kas
  transactions.push({
    id: `tx-${idCounter++}`,
    tanggal: `${year}-01-01`,
    jenis: "pemasukan",
    kategori: "Saldo Awal Kas",
    uraian: "Saldo kas sisa tahun sebelumnya",
    nominal: 2500000,
    wargaId: null,
    bulanIuran: null,
    tahunIuran: null
  });

  // 2. Iuran Warga for past months up to current month
  for (let m = 1; m <= currentMonth; m++) {
    const monthStr = String(m).padStart(2, '0');
    
    DEFAULT_WARGA.forEach((w, idx) => {
      // Simulate that some residents have paid and maybe 1 or 2 pending for current month
      const isPaid = (m < currentMonth) ? (idx !== 7 || m < currentMonth - 1) : (idx < 9);
      if (isPaid) {
        transactions.push({
          id: `tx-${idCounter++}`,
          tanggal: `${year}-${monthStr}-05`,
          jenis: "iuran",
          kategori: "Iuran Warga",
          uraian: `Iuran Bulan ${m}/${year} - ${w.blok} (${w.nama})`,
          nominal: w.nominalIuran || 50000,
          wargaId: w.id,
          bulanIuran: m,
          tahunIuran: year,
          metode: "Transfer / Cash"
        });
      }
    });

    // Monthly regular expenses
    // Kebersihan
    transactions.push({
      id: `tx-${idCounter++}`,
      tanggal: `${year}-${monthStr}-10`,
      jenis: "pengeluaran",
      kategori: "Kebersihan & Sampah",
      uraian: `Honor Petugas & Retribusi Sampah Bulan ${m}`,
      nominal: 300000,
      wargaId: null,
      bulanIuran: null,
      tahunIuran: null
    });

    // Keamanan
    transactions.push({
      id: `tx-${idCounter++}`,
      tanggal: `${year}-${monthStr}-15`,
      jenis: "pengeluaran",
      kategori: "Keamanan & Satpam",
      uraian: `Honor Petugas Ronda Malam Bulan ${m}`,
      nominal: 200000,
      wargaId: null,
      bulanIuran: null,
      tahunIuran: null
    });
  }

  // Some incidental expenses
  transactions.push({
    id: `tx-${idCounter++}`,
    tanggal: `${year}-02-18`,
    jenis: "pengeluaran",
    kategori: "Perbaikan & Fasilitas Umum",
    uraian: "Penggantian 3 titik lampu penerangan jalan utama RT",
    nominal: 175000,
    wargaId: null,
    bulanIuran: null,
    tahunIuran: null
  });

  transactions.push({
    id: `tx-${idCounter++}`,
    tanggal: `${year}-03-12`,
    jenis: "pengeluaran",
    kategori: "Kegiatan Sosial & Santunan",
    uraian: "Santunan tali kasih warga sakit (Bpk. Cahyono)",
    nominal: 250000,
    wargaId: null,
    bulanIuran: null,
    tahunIuran: null
  });

  transactions.push({
    id: `tx-${idCounter++}`,
    tanggal: `${year}-04-20`,
    jenis: "pemasukan",
    kategori: "Donasi / Sumbangan Warga",
    uraian: "Sumbangan sukarela warga untuk peremajaan pos ronda",
    nominal: 500000,
    wargaId: null,
    bulanIuran: null,
    tahunIuran: null
  });

  return transactions;
}

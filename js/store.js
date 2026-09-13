/**
 * Store & State Management with LocalStorage
 */

const STORAGE_KEYS = {
  SETTINGS: 'kas_rt_settings',
  WARGA: 'kas_rt_warga',
  TRANSAKSI: 'kas_rt_transaksi'
};

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const Store = {
  settings: {},
  warga: [],
  transaksi: [],
  listeners: [],

  init() {
    // Load Settings
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      try {
        this.settings = JSON.parse(savedSettings);
      } catch (e) {
        this.settings = { ...DEFAULT_SETTINGS };
      }
    } else {
      this.settings = { ...DEFAULT_SETTINGS };
      this.saveSettings();
    }

    // Load Warga
    const savedWarga = localStorage.getItem(STORAGE_KEYS.WARGA);
    if (savedWarga) {
      try {
        this.warga = JSON.parse(savedWarga);
      } catch (e) {
        this.warga = [...DEFAULT_WARGA];
      }
    } else {
      this.warga = [...DEFAULT_WARGA];
      this.saveWarga();
    }

    // Load Transaksi
    const savedTransaksi = localStorage.getItem(STORAGE_KEYS.TRANSAKSI);
    if (savedTransaksi) {
      try {
        this.transaksi = JSON.parse(savedTransaksi);
      } catch (e) {
        this.transaksi = generateInitialTransactions();
      }
    } else {
      this.transaksi = generateInitialTransactions();
      this.saveTransaksi();
    }
  },

  subscribe(listener) {
    this.listeners.push(listener);
  },

  notify() {
    this.listeners.forEach(fn => fn());
  },

  // --- SETTINGS ---
  saveSettings(newSettings) {
    if (newSettings) {
      this.settings = { ...this.settings, ...newSettings };
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    this.notify();
  },

  // --- WARGA CRUD ---
  saveWarga() {
    localStorage.setItem(STORAGE_KEYS.WARGA, JSON.stringify(this.warga));
    this.notify();
  },

  addWarga(wargaData) {
    const newWarga = {
      id: `w-${Date.now()}`,
      blok: wargaData.blok.trim(),
      nama: wargaData.nama.trim(),
      telp: wargaData.telp ? wargaData.telp.trim() : "-",
      status: wargaData.status || "Tetap",
      nominalIuran: Number(wargaData.nominalIuran) || this.settings.nominalIuran || 50000
    };
    this.warga.push(newWarga);
    // Sort warga by Blok naturally
    this.sortWarga();
    this.saveWarga();
    return newWarga;
  },

  updateWarga(id, wargaData) {
    const idx = this.warga.findIndex(w => w.id === id);
    if (idx !== -1) {
      this.warga[idx] = {
        ...this.warga[idx],
        blok: wargaData.blok.trim(),
        nama: wargaData.nama.trim(),
        telp: wargaData.telp ? wargaData.telp.trim() : "-",
        status: wargaData.status || "Tetap",
        nominalIuran: Number(wargaData.nominalIuran) || this.settings.nominalIuran || 50000
      };
      this.sortWarga();
      this.saveWarga();
      return this.warga[idx];
    }
    return null;
  },

  deleteWarga(id) {
    this.warga = this.warga.filter(w => w.id !== id);
    // Keep transactions or warn user
    this.saveWarga();
  },

  sortWarga() {
    this.warga.sort((a, b) => a.blok.localeCompare(b.blok, undefined, { numeric: true, sensitivity: 'base' }));
  },

  getWargaById(id) {
    return this.warga.find(w => w.id === id);
  },

  // --- TRANSAKSI CRUD ---
  saveTransaksi() {
    localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(this.transaksi));
    this.notify();
  },

  addTransaksi(txData) {
    const newTx = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tanggal: txData.tanggal || new Date().toISOString().split('T')[0],
      jenis: txData.jenis, // 'iuran', 'pemasukan', 'pengeluaran'
      kategori: txData.kategori,
      uraian: txData.uraian.trim(),
      nominal: Number(txData.nominal) || 0,
      wargaId: txData.wargaId || null,
      bulanIuran: txData.bulanIuran ? Number(txData.bulanIuran) : null,
      tahunIuran: txData.tahunIuran ? Number(txData.tahunIuran) : null,
      metode: txData.metode || "Tunai"
    };
    this.transaksi.push(newTx);
    this.saveTransaksi();
    return newTx;
  },

  updateTransaksi(id, txData) {
    const idx = this.transaksi.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.transaksi[idx] = {
        ...this.transaksi[idx],
        tanggal: txData.tanggal || this.transaksi[idx].tanggal,
        kategori: txData.kategori || this.transaksi[idx].kategori,
        uraian: txData.uraian.trim(),
        nominal: Number(txData.nominal) || 0,
        metode: txData.metode || this.transaksi[idx].metode
      };
      this.saveTransaksi();
      return this.transaksi[idx];
    }
    return null;
  },

  deleteTransaksi(id) {
    this.transaksi = this.transaksi.filter(t => t.id !== id);
    this.saveTransaksi();
  },

  // --- IURAN SPECIFIC LOGIC ---
  isIuranPaid(wargaId, month, year) {
    return this.transaksi.some(t => 
      t.jenis === 'iuran' && 
      t.wargaId === wargaId && 
      Number(t.bulanIuran) === Number(month) && 
      Number(t.tahunIuran) === Number(year)
    );
  },

  getIuranTx(wargaId, month, year) {
    return this.transaksi.find(t => 
      t.jenis === 'iuran' && 
      t.wargaId === wargaId && 
      Number(t.bulanIuran) === Number(month) && 
      Number(t.tahunIuran) === Number(year)
    );
  },

  payIuranSingle(wargaId, month, year, customNominal = null, tanggal = null, metode = "Tunai") {
    const warga = this.getWargaById(wargaId);
    if (!warga) return null;

    // Check if already paid
    const existing = this.getIuranTx(wargaId, month, year);
    if (existing) {
      return existing;
    }

    const nominal = customNominal !== null ? Number(customNominal) : (warga.nominalIuran || this.settings.nominalIuran || 50000);
    const txDate = tanggal || new Date().toISOString().split('T')[0];
    const monthName = MONTH_NAMES[month - 1];

    const tx = this.addTransaksi({
      tanggal: txDate,
      jenis: 'iuran',
      kategori: 'Iuran Warga',
      uraian: `Iuran Bulan ${monthName} ${year} - ${warga.blok} (${warga.nama})`,
      nominal: nominal,
      wargaId: warga.id,
      bulanIuran: Number(month),
      tahunIuran: Number(year),
      metode: metode
    });

    return tx;
  },

  cancelIuran(wargaId, month, year) {
    const tx = this.getIuranTx(wargaId, month, year);
    if (tx) {
      this.deleteTransaksi(tx.id);
      return true;
    }
    return false;
  },

  payIuranMultipleMonths(wargaId, monthsArray, year, tanggal = null, metode = "Tunai") {
    const warga = this.getWargaById(wargaId);
    if (!warga) return [];

    const createdTxs = [];
    monthsArray.forEach(m => {
      if (!this.isIuranPaid(wargaId, m, year)) {
        const tx = this.payIuranSingle(wargaId, m, year, warga.nominalIuran, tanggal, metode);
        if (tx) createdTxs.push(tx);
      }
    });

    return createdTxs;
  },

  // --- STATS & FINANCIAL CALCULATIONS ---
  calculateSummary() {
    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    let pemasukanBulanIni = 0;
    let pengeluaranBulanIni = 0;
    let iuranBulanIni = 0;

    this.transaksi.forEach(t => {
      const txDate = new Date(t.tanggal);
      const isThisMonth = (txDate.getMonth() + 1 === currentMonth) && (txDate.getFullYear() === currentYear);

      if (t.jenis === 'iuran' || t.jenis === 'pemasukan') {
        totalPemasukan += t.nominal;
        if (isThisMonth) {
          pemasukanBulanIni += t.nominal;
          if (t.jenis === 'iuran') {
            iuranBulanIni += t.nominal;
          }
        }
      } else if (t.jenis === 'pengeluaran') {
        totalPengeluaran += t.nominal;
        if (isThisMonth) {
          pengeluaranBulanIni += t.nominal;
        }
      }
    });

    const saldoKas = totalPemasukan - totalPengeluaran;

    // Hitung partisipasi iuran bulan ini
    const totalWarga = this.warga.length;
    let wargaSudahBayarBulanIni = 0;
    this.warga.forEach(w => {
      if (this.isIuranPaid(w.id, currentMonth, currentYear)) {
        wargaSudahBayarBulanIni++;
      }
    });
    const wargaBelumBayarBulanIni = totalWarga - wargaSudahBayarBulanIni;
    const persentaseLunas = totalWarga > 0 ? Math.round((wargaSudahBayarBulanIni / totalWarga) * 100) : 0;

    return {
      saldoKas,
      totalPemasukan,
      totalPengeluaran,
      pemasukanBulanIni,
      pengeluaranBulanIni,
      iuranBulanIni,
      totalWarga,
      wargaSudahBayarBulanIni,
      wargaBelumBayarBulanIni,
      persentaseLunas,
      currentMonth,
      currentYear
    };
  },

  // Dapatkan ringkasan kas per bulan untuk grafik (12 bulan tahun berjalan)
  getMonthlyChartData(year = new Date().getFullYear()) {
    const labels = [...MONTH_NAMES];
    const dataPemasukan = new Array(12).fill(0);
    const dataPengeluaran = new Array(12).fill(0);

    this.transaksi.forEach(t => {
      const txDate = new Date(t.tanggal);
      if (txDate.getFullYear() === Number(year)) {
        const monthIndex = txDate.getMonth();
        if (t.jenis === 'iuran' || t.jenis === 'pemasukan') {
          dataPemasukan[monthIndex] += t.nominal;
        } else if (t.jenis === 'pengeluaran') {
          dataPengeluaran[monthIndex] += t.nominal;
        }
      }
    });

    return { labels, dataPemasukan, dataPengeluaran };
  },

  // Dapatkan Rekap Arus Kas / Buku Kas Umum dengan Saldo Berjalan
  getBukuKas(filterMonth = null, filterYear = null) {
    // Sort all transactions by date ascending
    const sorted = [...this.transaksi].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

    let runningBalance = 0;
    const ledger = sorted.map(t => {
      const masuk = (t.jenis === 'iuran' || t.jenis === 'pemasukan') ? t.nominal : 0;
      const keluar = (t.jenis === 'pengeluaran') ? t.nominal : 0;
      runningBalance += (masuk - keluar);

      return {
        ...t,
        masuk,
        keluar,
        saldo: runningBalance
      };
    });

    if (filterMonth && filterYear) {
      return ledger.filter(t => {
        const d = new Date(t.tanggal);
        return (d.getMonth() + 1 === Number(filterMonth)) && (d.getFullYear() === Number(filterYear));
      });
    } else if (filterYear) {
      return ledger.filter(t => {
        const d = new Date(t.tanggal);
        return d.getFullYear() === Number(filterYear);
      });
    }

    return ledger;
  },

  // Rekap Tunggakan Warga
  getTunggakanWarga(upToMonth = new Date().getMonth() + 1, year = new Date().getFullYear()) {
    const rekap = [];

    this.warga.forEach(w => {
      const unpaidMonths = [];
      let totalTunggakan = 0;

      for (let m = 1; m <= upToMonth; m++) {
        if (!this.isIuranPaid(w.id, m, year)) {
          unpaidMonths.push(MONTH_NAMES[m - 1]);
          totalTunggakan += (w.nominalIuran || this.settings.nominalIuran || 50000);
        }
      }

      if (unpaidMonths.length > 0) {
        rekap.push({
          warga: w,
          bulanMenunggak: unpaidMonths,
          jumlahBulan: unpaidMonths.length,
          totalTunggakan
        });
      }
    });

    // Sort by largest unpaid count
    rekap.sort((a, b) => b.jumlahBulan - a.jumlahBulan);
    return rekap;
  },

  // --- BACKUP & RESTORE ---
  exportBackupJSON() {
    const backupData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      settings: this.settings,
      warga: this.warga,
      transaksi: this.transaksi
    };
    return JSON.stringify(backupData, null, 2);
  },

  importBackupJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings && data.warga && data.transaksi) {
        this.settings = data.settings;
        this.warga = data.warga;
        this.transaksi = data.transaksi;

        this.saveSettings();
        this.saveWarga();
        this.saveTransaksi();
        return { success: true, message: "Data berhasil dipulihkan!" };
      }
      return { success: false, message: "Format file cadangan tidak valid." };
    } catch (e) {
      return { success: false, message: "Gagal memproses file JSON: " + e.message };
    }
  },

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.WARGA);
    localStorage.removeItem(STORAGE_KEYS.TRANSAKSI);
    this.init();
    this.notify();
  }
};

// --- UTILITY FORMATTERS ---
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
}

function formatDateIndo(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function formatDateShort(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

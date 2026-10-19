/**
 * Store & State Management with LocalStorage & Automatic SQL File Synchronization
 */

const STORAGE_KEYS = {
  SETTINGS: 'kas_rt_settings',
  WARGA: 'kas_rt_warga',
  TRANSAKSI: 'kas_rt_transaksi',
  PENGUMUMAN: 'kas_rt_pengumuman',
  SUARA_WARGA: 'kas_rt_suara_warga',
  PENGURUS: 'kas_rt_pengurus'
};

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function escapeSql(val) {
  if (val === null || val === undefined || val === '') return 'NULL';
  if (typeof val === 'number') return isNaN(val) ? 'NULL' : String(val);
  if (typeof val === 'boolean') return val ? '1' : '0';
  return `'${String(val).replace(/'/g, "''")}'`;
}

const Store = {
  settings: {},
  warga: [],
  transaksi: [],
  pengumuman: [],
  suaraWarga: [],
  pengurus: [],
  listeners: [],
  syncTimeout: null,

  getApiUrl(endpoint) {
    const origin = window.location.protocol.startsWith('http') ? window.location.origin : 'http://localhost:3000';
    return `${origin}${endpoint}`;
  },

  init() {
    // 1. Load Settings dari LocalStorage terlebih dahulu (fast render)
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      try {
        this.settings = JSON.parse(savedSettings);
      } catch (e) {
        this.settings = { ...DEFAULT_SETTINGS };
      }
    } else {
      this.settings = { ...DEFAULT_SETTINGS };
      this.saveSettings(null, false);
    }

    // 2. Load Warga
    const savedWarga = localStorage.getItem(STORAGE_KEYS.WARGA);
    if (savedWarga) {
      try {
        this.warga = JSON.parse(savedWarga);
      } catch (e) {
        this.warga = [...DEFAULT_WARGA];
      }
    } else {
      this.warga = [...DEFAULT_WARGA];
      this.saveWarga(false);
    }

    // 3. Load Transaksi
    const savedTransaksi = localStorage.getItem(STORAGE_KEYS.TRANSAKSI);
    if (savedTransaksi) {
      try {
        this.transaksi = JSON.parse(savedTransaksi);
      } catch (e) {
        this.transaksi = generateInitialTransactions();
      }
    } else {
      this.transaksi = generateInitialTransactions();
      this.saveTransaksi(false);
    }

    // 4. Load Pengumuman
    const savedPengumuman = localStorage.getItem(STORAGE_KEYS.PENGUMUMAN);
    if (savedPengumuman) {
      try {
        this.pengumuman = JSON.parse(savedPengumuman);
      } catch (e) {
        this.pengumuman = typeof DEFAULT_PENGUMUMAN !== 'undefined' ? [...DEFAULT_PENGUMUMAN] : [];
      }
    } else {
      this.pengumuman = typeof DEFAULT_PENGUMUMAN !== 'undefined' ? [...DEFAULT_PENGUMUMAN] : [];
      this.savePengumuman(false);
    }

    // 5. Load Suara Warga
    const savedSuaraWarga = localStorage.getItem(STORAGE_KEYS.SUARA_WARGA);
    if (savedSuaraWarga) {
      try {
        this.suaraWarga = JSON.parse(savedSuaraWarga);
      } catch (e) {
        this.suaraWarga = typeof DEFAULT_SUARA_WARGA !== 'undefined' ? [...DEFAULT_SUARA_WARGA] : [];
      }
    } else {
      this.suaraWarga = typeof DEFAULT_SUARA_WARGA !== 'undefined' ? [...DEFAULT_SUARA_WARGA] : [];
      this.saveSuaraWarga(false);
    }

    // 6. Load Pengurus RT
    const savedPengurus = localStorage.getItem(STORAGE_KEYS.PENGURUS);
    if (savedPengurus) {
      try {
        this.pengurus = JSON.parse(savedPengurus);
      } catch (e) {
        this.pengurus = typeof DEFAULT_PENGURUS_RT10 !== 'undefined' ? [...DEFAULT_PENGURUS_RT10] : [];
      }
    } else {
      this.pengurus = typeof DEFAULT_PENGURUS_RT10 !== 'undefined' ? [...DEFAULT_PENGURUS_RT10] : [];
      this.savePengurus(false);
    }

    // 7. Sinkronisasi dengan file SQL di server lokal
    this.loadFromServer();
  },

  async loadFromServer() {
    try {
      const res = await fetch(this.getApiUrl('/api/data'));
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          if (json.data.settings && Object.keys(json.data.settings).length > 0) {
            this.settings = json.data.settings;
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
          }
          if (Array.isArray(json.data.warga) && json.data.warga.length > 0) {
            this.warga = json.data.warga;
            localStorage.setItem(STORAGE_KEYS.WARGA, JSON.stringify(this.warga));
          }
          if (Array.isArray(json.data.transaksi) && json.data.transaksi.length > 0) {
            this.transaksi = json.data.transaksi;
            localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(this.transaksi));
          }
          if (Array.isArray(json.data.pengurus) && json.data.pengurus.length > 0) {
            this.pengurus = json.data.pengurus;
            localStorage.setItem(STORAGE_KEYS.PENGURUS, JSON.stringify(this.pengurus));
          }
          if (Array.isArray(json.data.pengumuman) && json.data.pengumuman.length > 0) {
            this.pengumuman = json.data.pengumuman;
            localStorage.setItem(STORAGE_KEYS.PENGUMUMAN, JSON.stringify(this.pengumuman));
          }
          if (Array.isArray(json.data.suaraWarga) && json.data.suaraWarga.length > 0) {
            this.suaraWarga = json.data.suaraWarga;
            localStorage.setItem(STORAGE_KEYS.SUARA_WARGA, JSON.stringify(this.suaraWarga));
          }
          const timeStr = new Date().toLocaleTimeString('id-ID');
          this.updateSqlStatus('synced', `Tersimpan di kas-rt.sql (${timeStr})`);
          this.notify();
          return;
        }
      }
    } catch (e) {
      // Server offline / mode direct file
      this.updateSqlStatus('offline', 'Penyimpanan lokal aktif');
    }
  },

  subscribe(listener) {
    this.listeners.push(listener);
  },

  notify() {
    this.listeners.forEach(fn => fn());
  },

  // --- AUTOMATIC SQL SYNC ---
  syncToSQL(action = 'UPDATE_DATA', specificSql = '') {
    this.updateSqlStatus('saving', 'Menyimpan ke kas-rt.sql...');

    if (this.syncTimeout) clearTimeout(this.syncTimeout);
    this.syncTimeout = setTimeout(async () => {
      try {
        const res = await fetch(this.getApiUrl('/api/sync'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            settings: this.settings,
            warga: this.warga,
            transaksi: this.transaksi,
            pengumuman: this.pengumuman,
            suaraWarga: this.suaraWarga,
            pengurus: this.pengurus,
            action,
            logSql: specificSql
          })
        });

        if (res.ok) {
          const timeStr = new Date().toLocaleTimeString('id-ID');
          this.updateSqlStatus('synced', `Tersimpan di kas-rt.sql (${timeStr})`);
        } else {
          this.updateSqlStatus('offline', 'Penyimpanan lokal (Server offline)');
        }
      } catch (e) {
        this.updateSqlStatus('offline', 'Penyimpanan lokal (Server offline)');
      }
    }, 300);
  },

  updateSqlStatus(status, message) {
    const badge = document.getElementById('sql-sync-indicator');
    const text = document.getElementById('sql-sync-text');
    if (text) text.textContent = message;
    if (badge) {
      if (status === 'synced') {
        badge.className = 'hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl shadow-xs transition';
        badge.title = 'Semua data dan perubahan berhasil disimpan ke berkas kas-rt.sql';
      } else if (status === 'saving') {
        badge.className = 'hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium rounded-xl shadow-xs transition';
      } else {
        badge.className = 'hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-300 text-slate-600 text-xs font-medium rounded-xl shadow-xs transition';
        badge.title = 'Data tersimpan di browser. Jalankan server lokal untuk auto-sync ke kas-rt.sql';
      }
    }
  },

  // --- SETTINGS ---
  saveSettings(newSettings, notifySync = true) {
    if (newSettings) {
      this.settings = { ...this.settings, ...newSettings };
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));

    if (notifySync) {
      const sql = `UPDATE settings SET ` +
        `nama_rt = ${escapeSql(this.settings.namaRt)}, ` +
        `kelurahan = ${escapeSql(this.settings.kelurahan)}, ` +
        `kecamatan = ${escapeSql(this.settings.kecamatan)}, ` +
        `kota = ${escapeSql(this.settings.kota)}, ` +
        `nama_ketua_rt = ${escapeSql(this.settings.namaKetuaRt)}, ` +
        `nama_bendahara = ${escapeSql(this.settings.namaBendahara)}, ` +
        `nominal_iuran = ${Number(this.settings.nominalIuran) || 50000}, ` +
        `rincian_iuran = ${escapeSql(this.settings.rincianIuran)}, ` +
        `tahun_aktif = ${Number(this.settings.tahunAktif) || new Date().getFullYear()}, ` +
        `updated_at = CURRENT_TIMESTAMP WHERE id = 1;`;
      this.syncToSQL('UPDATE_SETTINGS', sql);
    }

    this.notify();
  },

  // --- WARGA CRUD ---
  saveWarga(notifySync = true, action = 'UPDATE_WARGA', specificSql = '') {
    localStorage.setItem(STORAGE_KEYS.WARGA, JSON.stringify(this.warga));
    if (notifySync) {
      this.syncToSQL(action, specificSql);
    }
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
    this.sortWarga();

    const sql = `INSERT INTO warga (id, blok, nama, telp, status, nominal_iuran) VALUES (` +
      `${escapeSql(newWarga.id)}, ` +
      `${escapeSql(newWarga.blok)}, ` +
      `${escapeSql(newWarga.nama)}, ` +
      `${escapeSql(newWarga.telp)}, ` +
      `${escapeSql(newWarga.status)}, ` +
      `${newWarga.nominalIuran});`;

    this.saveWarga(true, `TAMBAH_WARGA (${newWarga.blok} - ${newWarga.nama})`, sql);
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

      const w = this.warga[idx];
      const sql = `UPDATE warga SET ` +
        `blok = ${escapeSql(w.blok)}, ` +
        `nama = ${escapeSql(w.nama)}, ` +
        `telp = ${escapeSql(w.telp)}, ` +
        `status = ${escapeSql(w.status)}, ` +
        `nominal_iuran = ${w.nominalIuran} ` +
        `WHERE id = ${escapeSql(id)};`;

      this.saveWarga(true, `UPDATE_WARGA (${w.blok} - ${w.nama})`, sql);
      return this.warga[idx];
    }
    return null;
  },

  deleteWarga(id) {
    const w = this.getWargaById(id);
    const label = w ? `${w.blok} - ${w.nama}` : id;
    this.warga = this.warga.filter(w => w.id !== id);

    const sql = `DELETE FROM warga WHERE id = ${escapeSql(id)};`;
    this.saveWarga(true, `HAPUS_WARGA (${label})`, sql);
  },

  sortWarga() {
    this.warga.sort((a, b) => a.blok.localeCompare(b.blok, undefined, { numeric: true, sensitivity: 'base' }));
  },

  getWargaById(id) {
    return this.warga.find(w => w.id === id);
  },

  // --- TRANSAKSI CRUD ---
  saveTransaksi(notifySync = true, action = 'UPDATE_TRANSAKSI', specificSql = '') {
    localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(this.transaksi));
    if (notifySync) {
      this.syncToSQL(action, specificSql);
    }
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

    const sql = `INSERT INTO transaksi (id, tanggal, jenis, kategori, uraian, nominal, warga_id, bulan_iuran, tahun_iuran, metode) VALUES (` +
      `${escapeSql(newTx.id)}, ` +
      `${escapeSql(newTx.tanggal)}, ` +
      `${escapeSql(newTx.jenis)}, ` +
      `${escapeSql(newTx.kategori)}, ` +
      `${escapeSql(newTx.uraian)}, ` +
      `${newTx.nominal}, ` +
      `${escapeSql(newTx.wargaId)}, ` +
      `${newTx.bulanIuran ? Number(newTx.bulanIuran) : 'NULL'}, ` +
      `${newTx.tahunIuran ? Number(newTx.tahunIuran) : 'NULL'}, ` +
      `${escapeSql(newTx.metode)});`;

    const actionDesc = newTx.jenis === 'iuran' 
      ? `BAYAR_IURAN (${newTx.uraian})` 
      : `TAMBAH_${newTx.jenis.toUpperCase()} (${newTx.kategori} - ${formatRupiah(newTx.nominal)})`;

    this.saveTransaksi(true, actionDesc, sql);
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

      const t = this.transaksi[idx];
      const sql = `UPDATE transaksi SET ` +
        `tanggal = ${escapeSql(t.tanggal)}, ` +
        `kategori = ${escapeSql(t.kategori)}, ` +
        `uraian = ${escapeSql(t.uraian)}, ` +
        `nominal = ${t.nominal}, ` +
        `metode = ${escapeSql(t.metode)} ` +
        `WHERE id = ${escapeSql(id)};`;

      this.saveTransaksi(true, `UPDATE_TRANSAKSI (${t.kategori} - ${formatRupiah(t.nominal)})`, sql);
      return this.transaksi[idx];
    }
    return null;
  },

  deleteTransaksi(id) {
    const t = this.transaksi.find(tx => tx.id === id);
    const label = t ? `${t.kategori} (${t.uraian})` : id;
    this.transaksi = this.transaksi.filter(t => t.id !== id);

    const sql = `DELETE FROM transaksi WHERE id = ${escapeSql(id)};`;
    this.saveTransaksi(true, `HAPUS_TRANSAKSI (${label})`, sql);
  },

  // --- PENGUMUMAN CRUD ---
  savePengumuman(notifySync = true) {
    localStorage.setItem(STORAGE_KEYS.PENGUMUMAN, JSON.stringify(this.pengumuman));
    this.notify();
  },

  addPengumuman(item) {
    const newItem = {
      id: `ann-${Date.now()}`,
      judul: item.judul.trim(),
      kategori: item.kategori || 'Informasi Umum',
      badgeColor: item.badgeColor || 'emerald',
      isPinned: Boolean(item.isPinned),
      tanggal: item.tanggal || new Date().toISOString().split('T')[0],
      pengirim: item.pengirim ? item.pengirim.trim() : 'Pengurus RT 10',
      isi: item.isi ? item.isi.trim() : ''
    };
    this.pengumuman.unshift(newItem);
    this.savePengumuman(true);
    return newItem;
  },

  deletePengumuman(id) {
    this.pengumuman = this.pengumuman.filter(a => a.id !== id);
    this.savePengumuman(true);
  },

  // --- SUARA WARGA CRUD ---
  saveSuaraWarga(notifySync = true) {
    localStorage.setItem(STORAGE_KEYS.SUARA_WARGA, JSON.stringify(this.suaraWarga));
    this.notify();
  },

  addSuaraWarga(item) {
    this.suaraWarga.unshift(item);
    this.saveSuaraWarga(true);
    return item;
  },

  toggleLikeSuara(id, delta = 1) {
    const idx = this.suaraWarga.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.suaraWarga[idx].dukungan = Math.max(0, (this.suaraWarga[idx].dukungan || 0) + delta);
      this.saveSuaraWarga(false);
    }
  },

  addTanggapanSuara(id, tanggapanData) {
    const idx = this.suaraWarga.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.suaraWarga[idx].tanggapan = {
        penjawab: tanggapanData.penjawab || 'Pengurus RT 10',
        tanggal: tanggapanData.tanggal || new Date().toISOString().split('T')[0],
        pesan: tanggapanData.pesan
      };
      this.suaraWarga[idx].status = tanggapanData.status || 'Ditanggapi';
      this.saveSuaraWarga(true);
      return this.suaraWarga[idx];
    }
    return null;
  },

  deleteSuaraWarga(id) {
    this.suaraWarga = this.suaraWarga.filter(s => s.id !== id);
    this.saveSuaraWarga(true);
  },

  // --- SUSUNAN PENGURUS RT CRUD ---
  savePengurus(notifySync = true) {
    localStorage.setItem(STORAGE_KEYS.PENGURUS, JSON.stringify(this.pengurus));
    if (notifySync) {
      this.syncToSQL('UPDATE_PENGURUS', this.generatePengurusSql());
      this.notify();
    }
  },

  addPengurus(item) {
    if (!item.id) item.id = 'pengurus-' + Date.now();
    this.pengurus.push(item);
    this.savePengurus(true);
    return item;
  },

  updatePengurus(id, updatedFields) {
    const idx = this.pengurus.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.pengurus[idx] = { ...this.pengurus[idx], ...updatedFields };
      this.savePengurus(true);
      return this.pengurus[idx];
    }
    return null;
  },

  deletePengurus(id) {
    const idx = this.pengurus.findIndex(p => p.id === id);
    if (idx !== -1) {
      const deleted = this.pengurus.splice(idx, 1);
      this.savePengurus(true);
      return deleted[0];
    }
    return null;
  },

  generatePengurusSql() {
    if (!this.pengurus.length) return '';
    return this.pengurus.map(p =>
      `INSERT OR REPLACE INTO pengurus (id, jabatan, kategori, nama, blok, telp, badge, badge_color, avatar_bg, tugas) VALUES (${escapeSql(p.id)}, ${escapeSql(p.jabatan)}, ${escapeSql(p.kategori)}, ${escapeSql(p.nama)}, ${escapeSql(p.blok)}, ${escapeSql(p.telp)}, ${escapeSql(p.badge)}, ${escapeSql(p.badgeColor)}, ${escapeSql(p.avatarBg)}, ${escapeSql(p.tugas)});`
    ).join('\n');
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

    const existing = this.getIuranTx(wargaId, month, year);
    if (existing) {
      return existing;
    }

    const nominal = customNominal !== null ? Number(customNominal) : (warga.nominalIuran || this.settings.nominalIuran || 150000);
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
    const currentYear = Number(this.settings.tahunAktif) || now.getFullYear();

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

    // Hitung status warga lunas bulan ini
    let wargaLunasCount = 0;
    this.warga.forEach(w => {
      if (this.isIuranPaid(w.id, currentMonth, currentYear)) {
        wargaLunasCount++;
      }
    });

    const totalWarga = this.warga.length;
    const wargaBelumCount = totalWarga - wargaLunasCount;
    const persenLunas = totalWarga > 0 ? Math.round((wargaLunasCount / totalWarga) * 100) : 0;

    const rekapTunggakan = this.getRekapTunggakan(currentYear);
    const totalNominalTunggakan = rekapTunggakan.reduce((sum, r) => sum + r.totalTunggakan, 0);

    return {
      currentMonth,
      currentYear,
      saldoKas,
      totalPemasukan,
      totalPengeluaran,
      pemasukanBulanIni,
      pengeluaranBulanIni,
      iuranBulanIni,
      totalWarga,
      wargaLunasCount,
      wargaSudahBayarBulanIni: wargaLunasCount,
      wargaBelumCount,
      persenLunas,
      persentaseLunas: persenLunas,
      wargaTetapCount: this.warga.filter(w => (w.status || 'Tetap') === 'Tetap').length,
      wargaKontrakCount: this.warga.filter(w => w.status === 'Kontrak').length,
      targetIuranBulanan: totalWarga * (Number(this.settings.nominalIuran) || 150000),
      totalWargaMenunggak: rekapTunggakan.length,
      totalNominalTunggakan
    };
  },

  getMonthlyCashflow(year) {
    const months = Array.from({ length: 12 }, (_, i) => ({
      pemasukan: 0,
      pengeluaran: 0,
      saldo: 0
    }));

    this.transaksi.forEach(t => {
      const txDate = new Date(t.tanggal);
      if (txDate.getFullYear() === Number(year)) {
        const m = txDate.getMonth(); // 0-11
        if (t.jenis === 'iuran' || t.jenis === 'pemasukan') {
          months[m].pemasukan += t.nominal;
        } else if (t.jenis === 'pengeluaran') {
          months[m].pengeluaran += t.nominal;
        }
      }
    });

    return months;
  },

  getMonthlyChartData(year) {
    const cashflow = this.getMonthlyCashflow(year);
    let runningNet = 0;
    const dataNet = cashflow.map(c => c.pemasukan - c.pengeluaran);
    const dataSaldo = cashflow.map(c => {
      runningNet += (c.pemasukan - c.pengeluaran);
      return runningNet;
    });

    return {
      labels: MONTH_NAMES,
      dataPemasukan: cashflow.map(c => c.pemasukan),
      dataPengeluaran: cashflow.map(c => c.pengeluaran),
      dataNet,
      dataSaldo
    };
  },

  getExpenseCategoryBreakdown(year) {
    const categories = {};
    let totalExpense = 0;

    this.transaksi.forEach(t => {
      if (t.jenis === 'pengeluaran') {
        const txYear = new Date(t.tanggal).getFullYear();
        if (!year || txYear === Number(year)) {
          const cat = t.kategori || 'Lain-lain';
          categories[cat] = (categories[cat] || 0) + t.nominal;
          totalExpense += t.nominal;
        }
      }
    });

    const result = Object.keys(categories).map(name => ({
      name,
      amount: categories[name],
      percentage: totalExpense > 0 ? Math.round((categories[name] / totalExpense) * 100) : 0
    }));

    result.sort((a, b) => b.amount - a.amount);
    return { breakdown: result, totalExpense };
  },

  getBukuKas(bulan = null, tahun = null) {
    // Urutkan transaksi ascending tanggal
    const sorted = [...this.transaksi].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

    let runningBalance = 0;
    const records = [];

    sorted.forEach(t => {
      const txDate = new Date(t.tanggal);
      const txMonth = txDate.getMonth() + 1;
      const txYear = txDate.getFullYear();

      const masuk = (t.jenis === 'iuran' || t.jenis === 'pemasukan') ? t.nominal : 0;
      const keluar = (t.jenis === 'pengeluaran') ? t.nominal : 0;
      runningBalance = runningBalance + masuk - keluar;

      const matchBulan = !bulan || Number(bulan) === txMonth;
      const matchTahun = !tahun || Number(tahun) === txYear;

      if (matchBulan && matchTahun) {
        records.push({
          ...t,
          masuk,
          keluar,
          saldo: runningBalance,
          saldoBerjalan: runningBalance
        });
      }
    });

    return records;
  },

  getRekapTunggakan(year) {
    const currentYear = Number(this.settings.tahunAktif) || new Date().getFullYear();
    const currentMonth = (Number(year) === currentYear) ? (new Date().getMonth() + 1) : (Number(year) < currentYear ? 12 : 1);

    const rekap = [];

    this.warga.forEach(w => {
      const unpaidMonths = [];
      let totalTunggakan = 0;

      for (let m = 1; m <= currentMonth; m++) {
        if (!this.isIuranPaid(w.id, m, year)) {
          unpaidMonths.push(m);
          totalTunggakan += (w.nominalIuran || this.settings.nominalIuran || 150000);
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

    rekap.sort((a, b) => b.jumlahBulan - a.jumlahBulan);
    return rekap;
  },

  // --- SQL EXPORT & GENERATION ---
  generateSQLScript() {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    let sql = `-- ========================================================\n`;
    sql += `-- SISTEM KAS & IURAN WARGA RT\n`;
    sql += `-- Berkas Database SQL: kas_rt.sql\n`;
    sql += `-- Terakhir Diperbarui: ${now}\n`;
    sql += `-- Kompatibel dengan: SQLite, MySQL, MariaDB, PostgreSQL\n`;
    sql += `-- ========================================================\n\n`;
    sql += `PRAGMA foreign_keys = OFF;\n\n`;

    sql += `-- --------------------------------------------------------\n`;
    sql += `-- 1. STRUKTUR TABEL: settings (Pengaturan RT)\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS settings;\n`;
    sql += `CREATE TABLE settings (\n`;
    sql += `  id INTEGER PRIMARY KEY,\n`;
    sql += `  nama_rt VARCHAR(100) NOT NULL,\n`;
    sql += `  kelurahan VARCHAR(100),\n`;
    sql += `  kecamatan VARCHAR(100),\n`;
    sql += `  kota VARCHAR(100),\n`;
    sql += `  nama_ketua_rt VARCHAR(100),\n`;
    sql += `  nama_bendahara VARCHAR(100),\n`;
    sql += `  nominal_iuran INTEGER NOT NULL,\n`;
    sql += `  rincian_iuran TEXT,\n`;
    sql += `  tahun_aktif INTEGER NOT NULL,\n`;
    sql += `  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
    sql += `);\n\n`;

    sql += `-- --------------------------------------------------------\n`;
    sql += `-- 2. STRUKTUR TABEL: warga (Daftar Warga / KK)\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS warga;\n`;
    sql += `CREATE TABLE warga (\n`;
    sql += `  id VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  blok VARCHAR(50) NOT NULL,\n`;
    sql += `  nama VARCHAR(150) NOT NULL,\n`;
    sql += `  telp VARCHAR(50),\n`;
    sql += `  status VARCHAR(50) DEFAULT 'Tetap',\n`;
    sql += `  nominal_iuran INTEGER NOT NULL\n`;
    sql += `);\n\n`;

    sql += `-- --------------------------------------------------------\n`;
    sql += `-- 3. STRUKTUR TABEL: transaksi (Buku Kas & Iuran)\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS transaksi;\n`;
    sql += `CREATE TABLE transaksi (\n`;
    sql += `  id VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  tanggal DATE NOT NULL,\n`;
    sql += `  jenis VARCHAR(20) NOT NULL,\n`;
    sql += `  kategori VARCHAR(100) NOT NULL,\n`;
    sql += `  uraian TEXT NOT NULL,\n`;
    sql += `  nominal BIGINT NOT NULL,\n`;
    sql += `  warga_id VARCHAR(50),\n`;
    sql += `  bulan_iuran INTEGER,\n`;
    sql += `  tahun_iuran INTEGER,\n`;
    sql += `  metode VARCHAR(50) DEFAULT 'Tunai'\n`;
    sql += `);\n\n`;

    sql += `-- --------------------------------------------------------\n`;
    sql += `-- 4. STRUKTUR TABEL: log_perubahan (Riwayat Perubahan Data)\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `CREATE TABLE IF NOT EXISTS log_perubahan (\n`;
    sql += `  id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    sql += `  waktu TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  aksi VARCHAR(100),\n`;
    sql += `  keterangan TEXT,\n`;
    sql += `  query_sql TEXT\n`;
    sql += `);\n\n`;

    sql += `-- --------------------------------------------------------\n`;
    sql += `-- 5. STRUKTUR TABEL: pengurus (Susunan Pengurus RT)\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS pengurus;\n`;
    sql += `CREATE TABLE pengurus (\n`;
    sql += `  id VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  jabatan VARCHAR(100) NOT NULL,\n`;
    sql += `  kategori VARCHAR(50) NOT NULL,\n`;
    sql += `  nama VARCHAR(150) NOT NULL,\n`;
    sql += `  blok VARCHAR(50),\n`;
    sql += `  telp VARCHAR(50),\n`;
    sql += `  badge VARCHAR(50),\n`;
    sql += `  badge_color VARCHAR(50),\n`;
    sql += `  avatar_bg VARCHAR(50),\n`;
    sql += `  tugas TEXT\n`;
    sql += `);\n\n`;

    sql += `-- --------------------------------------------------------\n`;
    sql += `-- 6. STRUKTUR TABEL: pengumuman (Warta Resmi Pengurus RT)\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS pengumuman;\n`;
    sql += `CREATE TABLE pengumuman (\n`;
    sql += `  id VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  judul VARCHAR(255) NOT NULL,\n`;
    sql += `  kategori VARCHAR(100) NOT NULL,\n`;
    sql += `  badge_color VARCHAR(50) DEFAULT 'emerald',\n`;
    sql += `  is_pinned INTEGER DEFAULT 0,\n`;
    sql += `  tanggal DATE NOT NULL,\n`;
    sql += `  pengirim VARCHAR(150) NOT NULL,\n`;
    sql += `  isi TEXT NOT NULL\n`;
    sql += `);\n\n`;

    sql += `-- --------------------------------------------------------\n`;
    sql += `-- 7. STRUKTUR TABEL: suara_warga (Aspirasi Warga RT)\n`;
    sql += `-- --------------------------------------------------------\n`;
    sql += `DROP TABLE IF EXISTS suara_warga;\n`;
    sql += `CREATE TABLE suara_warga (\n`;
    sql += `  id VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  judul VARCHAR(255) NOT NULL,\n`;
    sql += `  kategori VARCHAR(100) NOT NULL,\n`;
    sql += `  kategori_badge VARCHAR(50) DEFAULT 'purple',\n`;
    sql += `  pengirim VARCHAR(150) NOT NULL,\n`;
    sql += `  blok VARCHAR(50) NOT NULL,\n`;
    sql += `  is_anonim INTEGER DEFAULT 0,\n`;
    sql += `  tanggal DATE NOT NULL,\n`;
    sql += `  isi TEXT NOT NULL,\n`;
    sql += `  dukungan INTEGER DEFAULT 0,\n`;
    sql += `  status VARCHAR(50) DEFAULT 'Menunggu',\n`;
    sql += `  tanggapan_penjawab VARCHAR(150),\n`;
    sql += `  tanggapan_tanggal DATE,\n`;
    sql += `  tanggapan_pesan TEXT\n`;
    sql += `);\n\n`;

    sql += `BEGIN TRANSACTION;\n\n`;

    // Settings
    sql += `INSERT INTO settings (id, nama_rt, kelurahan, kecamatan, kota, nama_ketua_rt, nama_bendahara, nominal_iuran, rincian_iuran, tahun_aktif, updated_at) VALUES (\n`;
    sql += `  1,\n`;
    sql += `  ${escapeSql(this.settings.namaRt || 'RT 10 / RW 10')},\n`;
    sql += `  ${escapeSql(this.settings.kelurahan || 'Kelurahan Sukamaju')},\n`;
    sql += `  ${escapeSql(this.settings.kecamatan || 'Kecamatan Cilodong')},\n`;
    sql += `  ${escapeSql(this.settings.kota || 'Kota Depok')},\n`;
    sql += `  ${escapeSql(this.settings.namaKetuaRt || 'Bpk. Bambang Sutrisno')},\n`;
    sql += `  ${escapeSql(this.settings.namaBendahara || 'Bpk. Hendra Wijaya')},\n`;
    sql += `  ${Number(this.settings.nominalIuran) || 150000},\n`;
    sql += `  ${escapeSql(this.settings.rincianIuran || '')},\n`;
    sql += `  ${Number(this.settings.tahunAktif) || 2026},\n`;
    sql += `  ${escapeSql(now)}\n`;
    sql += `);\n\n`;

    // Warga
    if (this.warga.length > 0) {
      sql += `INSERT INTO warga (id, blok, nama, telp, status, nominal_iuran) VALUES\n`;
      const wargaValues = this.warga.map((w, idx) => {
        const isLast = idx === this.warga.length - 1;
        return `  (${escapeSql(w.id)}, ${escapeSql(w.blok)}, ${escapeSql(w.nama)}, ${escapeSql(w.telp)}, ${escapeSql(w.status || 'Tetap')}, ${Number(w.nominalIuran) || 50000})${isLast ? ';' : ','}`;
      });
      sql += wargaValues.join('\n') + `\n\n`;
    }

    // Transaksi
    if (this.transaksi.length > 0) {
      sql += `INSERT INTO transaksi (id, tanggal, jenis, kategori, uraian, nominal, warga_id, bulan_iuran, tahun_iuran, metode) VALUES\n`;
      const txValues = this.transaksi.map((t, idx) => {
        const isLast = idx === this.transaksi.length - 1;
        return `  (${escapeSql(t.id)}, ${escapeSql(t.tanggal)}, ${escapeSql(t.jenis)}, ${escapeSql(t.kategori)}, ${escapeSql(t.uraian)}, ${Number(t.nominal) || 0}, ${escapeSql(t.wargaId)}, ${t.bulanIuran ? Number(t.bulanIuran) : 'NULL'}, ${t.tahunIuran ? Number(t.tahunIuran) : 'NULL'}, ${escapeSql(t.metode || 'Tunai')})${isLast ? ';' : ','}`;
      });
      sql += txValues.join('\n') + `\n\n`;
    }

    // Pengurus
    if (this.pengurus && this.pengurus.length > 0) {
      sql += `-- Data Susunan Pengurus RT (${this.pengurus.length} personalia)\n`;
      sql += `INSERT INTO pengurus (id, jabatan, kategori, nama, blok, telp, badge, badge_color, avatar_bg, tugas) VALUES\n`;
      const pValues = this.pengurus.map((p, idx) => {
        const isLast = idx === this.pengurus.length - 1;
        return `  (${escapeSql(p.id)}, ${escapeSql(p.jabatan)}, ${escapeSql(p.kategori)}, ${escapeSql(p.nama)}, ${escapeSql(p.blok)}, ${escapeSql(p.telp)}, ${escapeSql(p.badge)}, ${escapeSql(p.badgeColor)}, ${escapeSql(p.avatarBg)}, ${escapeSql(p.tugas)})${isLast ? ';' : ','}`;
      });
      sql += pValues.join('\n') + `\n\n`;
    }

    // Pengumuman
    if (this.pengumuman && this.pengumuman.length > 0) {
      sql += `-- Data Pengumuman Resmi (${this.pengumuman.length} warta)\n`;
      sql += `INSERT INTO pengumuman (id, judul, kategori, badge_color, is_pinned, tanggal, pengirim, isi) VALUES\n`;
      const aValues = this.pengumuman.map((a, idx) => {
        const isLast = idx === this.pengumuman.length - 1;
        return `  (${escapeSql(a.id)}, ${escapeSql(a.judul)}, ${escapeSql(a.kategori)}, ${escapeSql(a.badgeColor || 'emerald')}, ${a.isPinned ? 1 : 0}, ${escapeSql(a.tanggal)}, ${escapeSql(a.pengirim)}, ${escapeSql(a.isi)})${isLast ? ';' : ','}`;
      });
      sql += aValues.join('\n') + `\n\n`;
    }

    // Suara Warga
    if (this.suaraWarga && this.suaraWarga.length > 0) {
      sql += `-- Data Suara Warga (${this.suaraWarga.length} aspirasi)\n`;
      sql += `INSERT INTO suara_warga (id, judul, kategori, kategori_badge, pengirim, blok, is_anonim, tanggal, isi, dukungan, status, tanggapan_penjawab, tanggapan_tanggal, tanggapan_pesan) VALUES\n`;
      const sValues = this.suaraWarga.map((s, idx) => {
        const isLast = idx === this.suaraWarga.length - 1;
        const t = s.tanggapan || {};
        return `  (${escapeSql(s.id)}, ${escapeSql(s.judul)}, ${escapeSql(s.kategori)}, ${escapeSql(s.kategoriBadge || 'purple')}, ${escapeSql(s.pengirim)}, ${escapeSql(s.blok)}, ${s.isAnonim ? 1 : 0}, ${escapeSql(s.tanggal)}, ${escapeSql(s.isi)}, ${Number(s.dukungan) || 0}, ${escapeSql(s.status || 'Menunggu')}, ${escapeSql(t.penjawab || null)}, ${escapeSql(t.tanggal || null)}, ${escapeSql(t.pesan || null)})${isLast ? ';' : ','}`;
      });
      sql += sValues.join('\n') + `\n\n`;
    }

    sql += `COMMIT;\n`;
    sql += `PRAGMA foreign_keys = ON;\n`;

    return sql;
  },

  exportBackupSQL() {
    const sqlContent = this.generateSQLScript();
    const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kas-rt_${new Date().toISOString().split('T')[0]}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    if (typeof showToast === 'function') {
      showToast("Berkas database SQL (kas-rt.sql) berhasil diunduh!", "success");
    }
  },

  exportLogSQL() {
    window.open(this.getApiUrl('/api/sql-log'), '_blank');
  },

  // --- BACKUP & RESTORE JSON & SQL ---
  exportBackupJSON() {
    const backupData = {
      version: "2.0",
      exportDate: new Date().toISOString(),
      settings: this.settings,
      warga: this.warga,
      transaksi: this.transaksi,
      pengumuman: this.pengumuman,
      suaraWarga: this.suaraWarga,
      pengurus: this.pengurus
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
        if (Array.isArray(data.pengumuman)) this.pengumuman = data.pengumuman;
        if (Array.isArray(data.suaraWarga)) this.suaraWarga = data.suaraWarga;
        if (Array.isArray(data.pengurus)) this.pengurus = data.pengurus;

        this.saveSettings(null, false);
        this.saveWarga(false);
        this.saveTransaksi(false);
        this.savePengumuman(false);
        this.saveSuaraWarga(false);
        this.savePengurus(false);
        this.syncToSQL('RESTORE_JSON_BACKUP', `-- Pulihkan cadangan JSON`);
        return { success: true, message: "Data berhasil dipulihkan & disimpan ke kas-rt.sql!" };
      }
      return { success: false, message: "Format file cadangan tidak valid." };
    } catch (e) {
      return { success: false, message: "Gagal memproses file JSON: " + e.message };
    }
  },

  async importBackupSQL(sqlText) {
    try {
      const res = await fetch(this.getApiUrl('/api/import-sql'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: sqlText })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          if (json.data.settings) this.settings = json.data.settings;
          if (json.data.warga) this.warga = json.data.warga;
          if (json.data.transaksi) this.transaksi = json.data.transaksi;
          if (json.data.pengurus) this.pengurus = json.data.pengurus;

          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
          localStorage.setItem(STORAGE_KEYS.WARGA, JSON.stringify(this.warga));
          localStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(this.transaksi));
          if (this.pengurus) localStorage.setItem(STORAGE_KEYS.PENGURUS, JSON.stringify(this.pengurus));

          this.notify();
          return { success: true, message: "Berkas SQL berhasil dipulihkan & disinkronkan!" };
        }
      } else {
        const errJson = await res.json();
        return { success: false, message: errJson.message || "Gagal memproses berkas SQL" };
      }
    } catch (e) {
      return { success: false, message: "Server offline atau gagal memproses SQL: " + e.message };
    }
  },

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.WARGA);
    localStorage.removeItem(STORAGE_KEYS.TRANSAKSI);
    localStorage.removeItem(STORAGE_KEYS.PENGUMUMAN);
    localStorage.removeItem(STORAGE_KEYS.SUARA_WARGA);
    localStorage.removeItem(STORAGE_KEYS.PENGURUS);

    this.settings = { ...DEFAULT_SETTINGS };
    this.warga = [...DEFAULT_WARGA];
    this.transaksi = generateInitialTransactions();
    this.pengumuman = typeof DEFAULT_PENGUMUMAN !== 'undefined' ? [...DEFAULT_PENGUMUMAN] : [];
    this.suaraWarga = typeof DEFAULT_SUARA_WARGA !== 'undefined' ? [...DEFAULT_SUARA_WARGA] : [];
    this.pengurus = typeof DEFAULT_PENGURUS_RT10 !== 'undefined' ? [...DEFAULT_PENGURUS_RT10] : [];

    this.saveSettings(null, false);
    this.saveWarga(false);
    this.saveTransaksi(false);
    this.savePengumuman(false);
    this.saveSuaraWarga(false);
    this.savePengurus(false);
    this.syncToSQL('RESET_KE_DATA_AWAL', `-- Reset database ke data default awal`);
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

if (typeof window !== 'undefined') {
  window.Store = Store;
  window.escapeSql = escapeSql;
  window.formatRupiah = formatRupiah;
  window.formatDateIndo = formatDateIndo;
  window.formatDateShort = formatDateShort;
}

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;
const SQL_FILE = path.join(BASE_DIR, 'kas_rt.sql');
const SQL_LOG_FILE = path.join(BASE_DIR, 'kas_rt_log.sql');
const JSON_FILE = path.join(BASE_DIR, 'kas_rt_data.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.sql': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper: Escape SQL values
function escapeSql(val) {
  if (val === null || val === undefined || val === '') return 'NULL';
  if (typeof val === 'number') return isNaN(val) ? 'NULL' : String(val);
  if (typeof val === 'boolean') return val ? '1' : '0';
  return `'${String(val).replace(/'/g, "''")}'`;
}

// Generate Full SQL Script (DDL + DML)
function generateFullSQL(data) {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const settings = data.settings || {};
  const wargaList = data.warga || [];
  const transaksiList = data.transaksi || [];
  const pengurusList = data.pengurus || [];

  let sql = `-- ========================================================\n`;
  sql += `-- SISTEM KAS & IURAN WARGA RT\n`;
  sql += `-- Berkas Database SQL: kas_rt.sql\n`;
  sql += `-- Terakhir Diperbarui: ${now}\n`;
  sql += `-- Kompatibel dengan: SQLite, MySQL, MariaDB, PostgreSQL\n`;
  sql += `-- ========================================================\n\n`;

  sql += `PRAGMA foreign_keys = OFF;\n\n`;

  // 1. Table Settings
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

  // 2. Table Warga
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

  // 3. Table Transaksi
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

  // 4. Table Log Perubahan
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

  // 5. Table Pengurus RT
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

  // DML: INSERT DATA
  sql += `-- ========================================================\n`;
  sql += `-- MEMASUKKAN DATA KE DALAM DATABASE\n`;
  sql += `-- ========================================================\n`;
  sql += `BEGIN TRANSACTION;\n\n`;

  // Insert Settings
  sql += `-- Data Pengaturan RT\n`;
  sql += `INSERT INTO settings (id, nama_rt, kelurahan, kecamatan, kota, nama_ketua_rt, nama_bendahara, nominal_iuran, rincian_iuran, tahun_aktif, updated_at) VALUES (\n`;
  sql += `  1,\n`;
  sql += `  ${escapeSql(settings.namaRt || 'RT 10 / RW 10')},\n`;
  sql += `  ${escapeSql(settings.kelurahan || 'Kelurahan Sukamaju')},\n`;
  sql += `  ${escapeSql(settings.kecamatan || 'Kecamatan Cilodong')},\n`;
  sql += `  ${escapeSql(settings.kota || 'Kota Depok')},\n`;
  sql += `  ${escapeSql(settings.namaKetuaRt || 'Bpk. Bambang Sutrisno')},\n`;
  sql += `  ${escapeSql(settings.namaBendahara || 'Bpk. Hendra Wijaya')},\n`;
  sql += `  ${Number(settings.nominalIuran) || 150000},\n`;
  sql += `  ${escapeSql(settings.rincianIuran || '')},\n`;
  sql += `  ${Number(settings.tahunAktif) || new Date().getFullYear()},\n`;
  sql += `  ${escapeSql(now)}\n`;
  sql += `);\n\n`;

  // Insert Warga
  if (wargaList.length > 0) {
    sql += `-- Data Warga (${wargaList.length} KK)\n`;
    sql += `INSERT INTO warga (id, blok, nama, telp, status, nominal_iuran) VALUES\n`;
    const wargaValues = wargaList.map((w, idx) => {
      const isLast = idx === wargaList.length - 1;
      return `  (${escapeSql(w.id)}, ${escapeSql(w.blok)}, ${escapeSql(w.nama)}, ${escapeSql(w.telp)}, ${escapeSql(w.status || 'Tetap')}, ${Number(w.nominalIuran) || 150000})${isLast ? ';' : ','}`;
    });
    sql += wargaValues.join('\n') + `\n\n`;
  }

  // Insert Transaksi
  if (transaksiList.length > 0) {
    sql += `-- Data Transaksi Kas & Iuran (${transaksiList.length} catatan)\n`;
    sql += `INSERT INTO transaksi (id, tanggal, jenis, kategori, uraian, nominal, warga_id, bulan_iuran, tahun_iuran, metode) VALUES\n`;
    const txValues = transaksiList.map((t, idx) => {
      const isLast = idx === transaksiList.length - 1;
      return `  (${escapeSql(t.id)}, ${escapeSql(t.tanggal)}, ${escapeSql(t.jenis)}, ${escapeSql(t.kategori)}, ${escapeSql(t.uraian)}, ${Number(t.nominal) || 0}, ${escapeSql(t.wargaId)}, ${t.bulanIuran ? Number(t.bulanIuran) : 'NULL'}, ${t.tahunIuran ? Number(t.tahunIuran) : 'NULL'}, ${escapeSql(t.metode || 'Tunai')})${isLast ? ';' : ','}`;
    });
    sql += txValues.join('\n') + `\n\n`;
  }

  // Insert Pengurus
  if (pengurusList.length > 0) {
    sql += `-- Data Susunan Pengurus RT (${pengurusList.length} personalia)\n`;
    sql += `INSERT INTO pengurus (id, jabatan, kategori, nama, blok, telp, badge, badge_color, avatar_bg, tugas) VALUES\n`;
    const pValues = pengurusList.map((p, idx) => {
      const isLast = idx === pengurusList.length - 1;
      return `  (${escapeSql(p.id)}, ${escapeSql(p.jabatan)}, ${escapeSql(p.kategori)}, ${escapeSql(p.nama)}, ${escapeSql(p.blok)}, ${escapeSql(p.telp)}, ${escapeSql(p.badge)}, ${escapeSql(p.badgeColor)}, ${escapeSql(p.avatarBg)}, ${escapeSql(p.tugas)})${isLast ? ';' : ','}`;
    });
    sql += pValues.join('\n') + `\n\n`;
  }

  sql += `COMMIT;\n`;
  sql += `PRAGMA foreign_keys = ON;\n`;

  return sql;
}

// Initial Data Generator
function getInitialData() {
  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const settings = {
    namaRt: "RT 10 / RW 10",
    kelurahan: "Kelurahan Sukamaju",
    kecamatan: "Kecamatan Cilodong",
    kota: "Kota Depok",
    namaKetuaRt: "Bpk. Bambang Sutrisno",
    namaBendahara: "Bpk. Hendra Wijaya",
    nominalIuran: 150000,
    rincianIuran: "Kebersihan & Sampah: Rp 75.000, Keamanan: Rp 50.000, Kas RT: Rp 25.000",
    tahunAktif: year
  };

  const warga = [
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

  const transaksi = [];
  let idCounter = 1;

  transaksi.push({
    id: `tx-${idCounter++}`,
    tanggal: `${year}-01-01`,
    jenis: "pemasukan",
    kategori: "Saldo Awal Kas",
    uraian: "Saldo kas sisa tahun sebelumnya",
    nominal: 2500000,
    wargaId: null,
    bulanIuran: null,
    tahunIuran: null,
    metode: "Tunai"
  });

  for (let m = 1; m <= currentMonth; m++) {
    const monthStr = String(m).padStart(2, '0');
    warga.forEach((w, idx) => {
      const isPaid = (m < currentMonth) ? (idx !== 7 || m < currentMonth - 1) : (idx < 9);
      if (isPaid) {
        transaksi.push({
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

    transaksi.push({
      id: `tx-${idCounter++}`,
      tanggal: `${year}-${monthStr}-10`,
      jenis: "pengeluaran",
      kategori: "Kebersihan & Sampah",
      uraian: `Honor Petugas & Retribusi Sampah Bulan ${m}`,
      nominal: 300000,
      wargaId: null,
      bulanIuran: null,
      tahunIuran: null,
      metode: "Tunai"
    });

    transaksi.push({
      id: `tx-${idCounter++}`,
      tanggal: `${year}-${monthStr}-15`,
      jenis: "pengeluaran",
      kategori: "Keamanan & Satpam",
      uraian: `Honor Petugas Ronda Malam Bulan ${m}`,
      nominal: 200000,
      wargaId: null,
      bulanIuran: null,
      tahunIuran: null,
      metode: "Tunai"
    });
  }

  transaksi.push({
    id: `tx-${idCounter++}`,
    tanggal: `${year}-02-18`,
    jenis: "pengeluaran",
    kategori: "Perbaikan & Fasilitas Umum",
    uraian: "Penggantian 3 titik lampu penerangan jalan utama RT",
    nominal: 175000,
    wargaId: null,
    bulanIuran: null,
    tahunIuran: null,
    metode: "Tunai"
  });

  transaksi.push({
    id: `tx-${idCounter++}`,
    tanggal: `${year}-03-12`,
    jenis: "pengeluaran",
    kategori: "Kegiatan Sosial & Santunan",
    uraian: "Santunan tali kasih warga sakit (Bpk. Cahyono)",
    nominal: 250000,
    wargaId: null,
    bulanIuran: null,
    tahunIuran: null,
    metode: "Tunai"
  });

  transaksi.push({
    id: `tx-${idCounter++}`,
    tanggal: `${year}-04-20`,
    jenis: "pemasukan",
    kategori: "Donasi / Sumbangan Warga",
    uraian: "Sumbangan sukarela warga untuk peremajaan pos ronda",
    nominal: 500000,
    wargaId: null,
    bulanIuran: null,
    tahunIuran: null,
    metode: "Tunai"
  });

  return { settings, warga, transaksi };
}

// Ensure SQL Files Exist on Startup
function initializeStorage() {
  if (!fs.existsSync(JSON_FILE) && !fs.existsSync(SQL_FILE)) {
    const initData = getInitialData();
    const fullSql = generateFullSQL(initData);
    fs.writeFileSync(SQL_FILE, fullSql, 'utf-8');
    fs.writeFileSync(JSON_FILE, JSON.stringify(initData, null, 2), 'utf-8');
    
    const initLog = `-- ========================================================\n` +
      `-- LOG PERUBAHAN DATA KAS RT (SQL AUDIT LOG)\n` +
      `-- Berkas: kas_rt_log.sql\n` +
      `-- Waktu Inisialisasi: ${new Date().toISOString()}\n` +
      `-- ========================================================\n\n` +
      `-- [${new Date().toISOString()}] INISIALISASI DATA AWAL\n` +
      `INSERT INTO log_perubahan (aksi, keterangan) VALUES ('INIT', 'Inisialisasi sistem kas RT dan pembuatan berkas kas_rt.sql');\n\n`;
    fs.writeFileSync(SQL_LOG_FILE, initLog, 'utf-8');
    console.log(`[SQL Storage] Berhasil membuat berkas SQL awal: ${SQL_FILE}`);
  } else if (!fs.existsSync(SQL_FILE) && fs.existsSync(JSON_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
      const fullSql = generateFullSQL(data);
      fs.writeFileSync(SQL_FILE, fullSql, 'utf-8');
      console.log(`[SQL Storage] Berkas kas_rt.sql diperbarui dari cache JSON.`);
    } catch (e) {
      console.error('[SQL Storage Error]', e);
    }
  }
}

// Parse Raw SQL into Data Object
function parseSQLDump(sqlContent) {
  const result = {
    settings: {},
    warga: [],
    transaksi: [],
    pengurus: []
  };

  // Helper to parse values string: ('val1', 2, NULL, 'val\'3')
  function parseRow(rowStr) {
    const row = [];
    let cur = '';
    let inQuote = false;
    let quoteChar = '';

    for (let i = 0; i < rowStr.length; i++) {
      const c = rowStr[i];
      if (inQuote) {
        if (c === quoteChar) {
          if (rowStr[i + 1] === quoteChar) {
            cur += quoteChar;
            i++;
          } else {
            inQuote = false;
          }
        } else {
          cur += c;
        }
      } else {
        if (c === "'" || c === '"') {
          inQuote = true;
          quoteChar = c;
        } else if (c === ',') {
          row.push(cleanVal(cur));
          cur = '';
        } else {
          cur += c;
        }
      }
    }
    if (cur.trim().length > 0) {
      row.push(cleanVal(cur));
    }
    return row;
  }

  function cleanVal(v) {
    const t = v.trim();
    if (t.toUpperCase() === 'NULL') return null;
    if (!isNaN(t) && t !== '') return Number(t);
    return t;
  }

  // Extract settings
  const settingsMatch = sqlContent.match(/INSERT\s+INTO\s+settings\s*\([^)]*\)\s*VALUES\s*\(([^;]+)\);/i);
  if (settingsMatch) {
    const row = parseRow(settingsMatch[1]);
    if (row.length >= 10) {
      result.settings = {
        namaRt: row[1] || 'RT 10 / RW 10',
        kelurahan: row[2] || '',
        kecamatan: row[3] || '',
        kota: row[4] || '',
        namaKetuaRt: row[5] || '',
        namaBendahara: row[6] || '',
        nominalIuran: Number(row[7]) || 150000,
        rincianIuran: row[8] || '',
        tahunAktif: Number(row[9]) || new Date().getFullYear()
      };
    }
  }

  // Extract warga
  const wargaBlock = sqlContent.match(/INSERT\s+INTO\s+warga\s*\([^)]*\)\s*VALUES\s*([\s\S]+?);/i);
  if (wargaBlock) {
    const lines = wargaBlock[1].split(/\),\s*\(/);
    lines.forEach((line) => {
      const cleaned = line.replace(/^\s*\(/, '').replace(/\)\s*$/, '');
      const r = parseRow(cleaned);
      if (r.length >= 6) {
        result.warga.push({
          id: String(r[0]),
          blok: String(r[1]),
          nama: String(r[2]),
          telp: String(r[3] || '-'),
          status: String(r[4] || 'Tetap'),
          nominalIuran: Number(r[5]) || 50000
        });
      }
    });
  }

  // Extract transaksi
  const txBlock = sqlContent.match(/INSERT\s+INTO\s+transaksi\s*\([^)]*\)\s*VALUES\s*([\s\S]+?);/i);
  if (txBlock) {
    const lines = txBlock[1].split(/\),\s*\(/);
    lines.forEach((line) => {
      const cleaned = line.replace(/^\s*\(/, '').replace(/\)\s*$/, '');
      const r = parseRow(cleaned);
      if (r.length >= 10) {
        result.transaksi.push({
          id: String(r[0]),
          tanggal: String(r[1]),
          jenis: String(r[2]),
          kategori: String(r[3]),
          uraian: String(r[4]),
          nominal: Number(r[5]) || 0,
          wargaId: r[6] ? String(r[6]) : null,
          bulanIuran: r[7] ? Number(r[7]) : null,
          tahunIuran: r[8] ? Number(r[8]) : null,
          metode: String(r[9] || 'Tunai')
        });
      }
    });
  }

  // Extract pengurus
  const pengurusBlock = sqlContent.match(/INSERT\s+INTO\s+pengurus\s*\([^)]*\)\s*VALUES\s*([\s\S]+?);/i);
  if (pengurusBlock) {
    const lines = pengurusBlock[1].split(/\),\s*\(/);
    lines.forEach((line) => {
      const cleaned = line.replace(/^\s*\(/, '').replace(/\)\s*$/, '');
      const r = parseRow(cleaned);
      if (r.length >= 10) {
        result.pengurus.push({
          id: String(r[0]),
          jabatan: String(r[1]),
          kategori: String(r[2]),
          nama: String(r[3]),
          blok: String(r[4] || '-'),
          telp: String(r[5] || '-'),
          badge: String(r[6] || ''),
          badgeColor: String(r[7] || 'slate'),
          avatarBg: String(r[8] || 'bg-slate-600'),
          tugas: String(r[9] || '')
        });
      }
    });
  }

  return result;
}

// Initialize on boot
initializeStorage();

const server = http.createServer((req, res) => {
  // CORS Headers for cross-origin or local requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = parsedUrl.pathname;

  // ----------------------------------------------------------------
  // API ROUTE 1: GET /api/data
  // ----------------------------------------------------------------
  if (req.method === 'GET' && pathname === '/api/data') {
    let data = null;
    if (fs.existsSync(JSON_FILE)) {
      try {
        data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
      } catch (e) {}
    }
    if (!data && fs.existsSync(SQL_FILE)) {
      try {
        const sql = fs.readFileSync(SQL_FILE, 'utf-8');
        data = parseSQLDump(sql);
      } catch (e) {}
    }
    if (!data) {
      data = getInitialData();
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, data, sqlFile: 'kas_rt.sql' }));
    return;
  }

  // ----------------------------------------------------------------
  // API ROUTE 2: POST /api/sync (Menyimpan semua data & perubahan ke file SQL)
  // ----------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/sync') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { settings, warga, transaksi, pengurus, action, logSql } = payload;
        
        let existingPengurus = [];
        if (fs.existsSync(JSON_FILE)) {
          try {
            const cached = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
            if (Array.isArray(cached.pengurus)) existingPengurus = cached.pengurus;
          } catch (e) {}
        }
        const fullData = { 
          settings, 
          warga, 
          transaksi, 
          pengurus: (Array.isArray(pengurus) && pengurus.length > 0) ? pengurus : existingPengurus 
        };

        // 1. Write full SQL file
        const fullSql = generateFullSQL(fullData);
        fs.writeFileSync(SQL_FILE, fullSql, 'utf-8');

        // 2. Cache JSON file
        fs.writeFileSync(JSON_FILE, JSON.stringify(fullData, null, 2), 'utf-8');

        // 3. Append to SQL Log file
        const timestamp = new Date().toISOString();
        const actionDesc = action || 'UPDATE_DATA';
        let logEntry = `-- [${timestamp}] AKSI: ${actionDesc}\n`;
        if (logSql && logSql.trim()) {
          logEntry += `${logSql.trim()}\n`;
        }
        logEntry += `INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('${timestamp}', ${escapeSql(actionDesc)}, ${escapeSql('Sinkronisasi data ke kas_rt.sql')});\n\n`;

        fs.appendFileSync(SQL_LOG_FILE, logEntry, 'utf-8');

        console.log(`[SQL Sync] Perubahan berhasil disimpan ke ${SQL_FILE} [Aksi: ${actionDesc}]`);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          message: 'Data dan perubahan berhasil disimpan ke kas_rt.sql',
          sqlFile: 'kas_rt.sql',
          timestamp
        }));
      } catch (err) {
        console.error('[SQL Sync Error]', err);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
    return;
  }

  // ----------------------------------------------------------------
  // API ROUTE 3: GET /api/sql (Download / View kas_rt.sql)
  // ----------------------------------------------------------------
  if (req.method === 'GET' && (pathname === '/api/sql' || pathname === '/kas_rt.sql')) {
    if (fs.existsSync(SQL_FILE)) {
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'inline; filename="kas_rt.sql"'
      });
      fs.createReadStream(SQL_FILE).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Berkas kas_rt.sql belum tersedia.');
    }
    return;
  }

  // ----------------------------------------------------------------
  // API ROUTE 4: GET /api/sql-log (Download / View kas_rt_log.sql)
  // ----------------------------------------------------------------
  if (req.method === 'GET' && pathname === '/api/sql-log') {
    if (fs.existsSync(SQL_LOG_FILE)) {
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'inline; filename="kas_rt_log.sql"'
      });
      fs.createReadStream(SQL_LOG_FILE).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Berkas kas_rt_log.sql belum tersedia.');
    }
    return;
  }

  // ----------------------------------------------------------------
  // API ROUTE 5: POST /api/import-sql (Import data dari file SQL)
  // ----------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/api/import-sql') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const sqlText = payload.sql || '';
        const parsed = parseSQLDump(sqlText);

        if (!parsed.warga.length && !parsed.transaksi.length) {
          throw new Error('Tidak ditemukan data valid dalam berkas SQL yang diunggah.');
        }

        // Simpan
        fs.writeFileSync(SQL_FILE, sqlText, 'utf-8');
        fs.writeFileSync(JSON_FILE, JSON.stringify(parsed, null, 2), 'utf-8');

        const timestamp = new Date().toISOString();
        const logEntry = `-- [${timestamp}] AKSI: IMPORT_SQL_DUMP\n` +
          `INSERT INTO log_perubahan (waktu, aksi, keterangan) VALUES ('${timestamp}', 'IMPORT_SQL_DUMP', 'Pemulihan data dari file SQL eksternal');\n\n`;
        fs.appendFileSync(SQL_LOG_FILE, logEntry, 'utf-8');

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          message: 'Berkas SQL berhasil dipulihkan!',
          data: parsed
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
    return;
  }

  // ----------------------------------------------------------------
  // STATIC FILE HANDLER
  // ----------------------------------------------------------------
  let safePath = path.normalize(decodeURI(pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(BASE_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Sistem Kas RT & Sinkronisasi SQL Aktif`);
  console.log(`  Alamat Web : http://localhost:${PORT}`);
  console.log(`  File SQL   : ${SQL_FILE}`);
  console.log(`  File Log   : ${SQL_LOG_FILE}`);
  console.log(`=======================================================`);
});

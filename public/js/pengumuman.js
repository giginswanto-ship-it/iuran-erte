/**
 * Portal Pengumuman & Susunan Pengurus RT 10 / RW 10
 */

// Data Pengurus default didefinisikan di js/dummyData.js (DEFAULT_PENGURUS_RT10)


const DEFAULT_PENGUMUMAN = [
  {
    id: "ann-1",
    judul: "Penetapan & Mekanisme Pembayaran Iuran Bulanan Warga Tahun 2026 (Rp 150.000 / KK)",
    kategori: "Iuran & Keuangan",
    badgeColor: "emerald",
    isPinned: true,
    tanggal: "2026-01-10",
    pengirim: "Bpk. Bambang Sutrisno (Ketua RT 10)",
    isi: `Assalamu'alaikum Wr. Wb. dan Salam Sejahtera untuk seluruh Bapak/Ibu Warga RT 10 / RW 10 Kompleks Blok J1 s/d J10.

Berdasarkan Berita Acara Musyawarah Warga RT 10 / RW 10, bersama ini kami sampaikan penetapan dan alokasi Iuran Lingkungan Bulanan tahun 2026 sebesar Rp 150.000,- per KK dengan rincian:
1. Pos Pengangkutan Sampah & Kebersihan: Rp 75.000,- (jadwal angkut truk sampah DLHK 3x seminggu).
2. Pos Keamanan Lingkungan & Satpam 24 Jam: Rp 50.000,- (honor & operasional satpam, sistem portal malam).
3. Pos Kas Pemeliharaan Lingkungan: Rp 25.000,- (perawatan PJU, CCTV, taman bermain, dan balai warga).

Mekanisme Pembayaran:
- Pembayaran iuran dapat dilakukan mulai tanggal 1 s/d 10 setiap bulannya.
- Metode pembayaran: Setor Tunai langsung ke Bendahara (Bpk. Hendra Wijaya - Blok J1 No. 02), Transfer Bank, atau Scan QRIS Kas RT.
- Seluruh rekap pembayaran tercatat transparan dan dapat dicek setiap saat di aplikasi Kas RT ini.

Terima kasih atas partisipasi dan kepedulian seluruh warga dalam menjaga lingkungan RT 10 tetap aman, tertib, dan guyub.`
  },
  {
    id: "ann-2",
    judul: "Kerja Bakti Massal Pengerukan Saluran Drainase Menjelang Puncak Musim Penghujan",
    kategori: "Kerja Bakti & Lingkungan",
    badgeColor: "teal",
    isPinned: true,
    tanggal: "2026-10-18",
    pengirim: "Seksi Kebersihan - Bpk. Rudi Hermawan",
    isi: `Kepada Yth. Bapak-Bapak & Pemuda Warga RT 10 / RW 10 Kompleks Blok J.

Untuk mengantisipasi genangan air dan mencegah penyumbatan endapan sedimen got pada musim hujan, Pengurus RT mengundang seluruh warga untuk bergotong-royong pada:
📅 Hari / Tanggal : Minggu, 25 Oktober 2026
⏰ Waktu          : Pukul 07.00 WIB s/d 10.30 WIB
📍 Titik Kumpul   : Balai Warga RT 10 (Depan Taman Blok J)
🧹 Fokus Kegiatan :
1. Pengerukan lumpur dan sampah pada saluran drainase utama Blok J1 s/d J10.
2. Pemangkasan dahan pohon liar yang rimbun dan membahayakan kabel listrik / PJU.
3. Gerakan 3M Plus Pemberantasan Sarang Nyamuk (PSN) serentak di pekarangan rumah.

Disediakan sarapan pagi bersama (Nasi Uduk & Kopi Panas). Warga dihimbau membawa cangkul, sekop, atau sapu lidi masing-masing.`
  },
  {
    id: "ann-3",
    judul: "Pemberlakuan Jam Malam Portal & Wajib Lapor Tamu 1x24 Jam di Blok J",
    kategori: "Keamanan & Ketertiban",
    badgeColor: "rose",
    isPinned: false,
    tanggal: "2026-10-12",
    pengirim: "Seksi Keamanan - Bpk. Slamet Riyadi",
    isi: `Demi menjaga keamanan dan kenyamanan istirahat warga, disampaikan ketentuan ketertiban portal lingkungan:
1. Portal sayap Barat (akses tembus RW sebelah) akan ditutup setiap malam mulai pukul 22.00 WIB hingga 05.00 WIB pagi.
2. Seluruh akses keluar-masuk pada malam hari dialihkan melalui Gerbang Utama Pos Satpam 1 (Depan Blok J1).
3. Ojek Online / Kurir pengantaran barang/makanan di atas pukul 23.00 WIB wajib melapor dan menitipkan identitas di pos satpam.
4. Tamu atau kerabat yang menginap lebih dari 1x24 jam wajib dilaporkan ke Ketua RT atau Koordinator Blok setempat.
5. Nomor Hotline Keamanan Pos Satpam RT 10: 0812-8899-1001 (Aktif 24 Jam).`
  },
  {
    id: "ann-4",
    judul: "Pelayanan Posyandu Balita & Posbindu Kesehatan Lansia Pos Mawar RT 10",
    kategori: "Sosial & Kesehatan",
    badgeColor: "purple",
    isPinned: false,
    tanggal: "2026-10-06",
    pengirim: "Ibu Hj. Siti Rahmawati (Koordinator PKK/Sosial)",
    isi: `Pemberitahuan Pelayanan Kesehatan Rutin Bulanan Posyandu Mawar RT 10:
🗓 Hari / Tanggal : Sabtu, 24 Oktober 2026
⏰ Waktu          : 08.30 - 11.30 WIB
📍 Lokasi         : Gazebo Taman Blok J5

Layanan Kesehatan:
- Balita: Penimbangan berat badan, pengukuran tinggi badan, imunisasi rutin, vitamin A, dan pembagian PMT (Pemberian Makanan Tambahan) gizi seimbang.
- Lansia & Dewasa: Pemeriksaan tensi darah, penimbangan, serta cek kadar gula darah, kolesterol, dan asam urat gratis.

Bagi keluarga yang memiliki balita atau orang tua lanjut usia, dimohon kehadirannya dengan membawa Buku KIA / KMS masing-masing.`
  },
  {
    id: "ann-5",
    judul: "Turnamen Santai Bulutangkis Ganda Putra Antar-Blok Kompleks RT 10",
    kategori: "Olahraga & Kepemudaan",
    badgeColor: "cyan",
    isPinned: false,
    tanggal: "2026-10-01",
    pengirim: "Bpk. Fajar Ramadhan (Koordinator Pemuda)",
    isi: `Salam Olahraga dan Salam Guyub Rukun!
Untuk mempererat keakraban antar-warga Kompleks Blok J1 s/d J10, Karang Taruna & Seksi Olahraga mengadakan Pertandingan Persahabatan Bulutangkis Ganda Putra:
🏸 Jadwal : Setiap Sabtu Malam, Mulai Pukul 19.30 WIB
📍 Tempat : Lapangan Bulutangkis RT 10 (Samping Balai Warga)
👥 Peserta: Terbuka untuk seluruh bapak-bapak dan remaja pria warga RT 10.

Sistem pertandingan santai (ganda diacak), disediakan shuttlecock dan minuman segar. Pendaftaran gratis melalui Koordinator Blok masing-masing.`
  }
];

const PengumumanManager = {
  PENGURUS_PIN: '1234',
  activeSubTab: 'pengumuman', // 'pengumuman' | 'pengurus'
  activeCategory: 'all',
  searchQuery: '',
  activePengurusFilter: 'all',

  init() {
    this.setupEventListeners();
  },

  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-pengumuman');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderPengumumanList();
      });
    }

    // Modal Add Announcement Form
    const formAdd = document.getElementById('form-add-pengumuman');
    if (formAdd) {
      formAdd.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddAnnouncementSubmit();
      });
    }
  },

  switchSubTab(tab) {
    this.activeSubTab = tab;
    const btnTabPengumuman = document.getElementById('subtab-btn-pengumuman');
    const btnTabPengurus = document.getElementById('subtab-btn-pengurus');
    const viewPengumuman = document.getElementById('subtab-view-pengumuman');
    const viewPengurus = document.getElementById('subtab-view-pengurus');

    const subPengumuman = document.getElementById('subnav-pengumuman');
    const subPengurus = document.getElementById('subnav-pengurus');

    if (tab === 'pengumuman') {
      if (btnTabPengumuman) {
        btnTabPengumuman.className = 'px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-md shadow-amber-500/20 transition flex items-center gap-2';
      }
      if (btnTabPengurus) {
        btnTabPengurus.className = 'px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold transition flex items-center gap-2';
      }
      if (subPengumuman) {
        subPengumuman.className = 'w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm border border-amber-500 transition text-left';
      }
      if (subPengurus) {
        subPengurus.className = 'w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-900 hover:from-blue-100 hover:to-indigo-100 transition shadow-2xs text-left';
      }
      if (viewPengumuman) viewPengumuman.classList.remove('hidden');
      if (viewPengurus) viewPengurus.classList.add('hidden');
      this.renderPengumumanList();
    } else {
      if (btnTabPengurus) {
        btnTabPengurus.className = 'px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2';
      }
      if (btnTabPengumuman) {
        btnTabPengumuman.className = 'px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold transition flex items-center gap-2';
      }
      if (subPengurus) {
        subPengurus.className = 'w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm border border-blue-600 transition text-left';
      }
      if (subPengumuman) {
        subPengumuman.className = 'w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-900 hover:from-amber-100 hover:to-orange-100 transition shadow-2xs text-left';
      }
      if (viewPengurus) viewPengurus.classList.remove('hidden');
      if (viewPengumuman) viewPengumuman.classList.add('hidden');
      this.renderSusunanPengurus();
    }

    if (window.lucide) lucide.createIcons();
  },

  setCategoryFilter(cat) {
    this.activeCategory = cat;
    const buttons = document.querySelectorAll('.filter-pengumuman-btn');
    buttons.forEach(btn => {
      const target = btn.getAttribute('data-cat');
      if (target === cat) {
        btn.className = 'filter-pengumuman-btn px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white shadow-xs transition';
      } else {
        btn.className = 'filter-pengumuman-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition';
      }
    });

    this.renderPengumumanList();
  },

  setPengurusFilter(filter) {
    this.activePengurusFilter = filter;
    const buttons = document.querySelectorAll('.filter-pengurus-btn');
    buttons.forEach(btn => {
      const target = btn.getAttribute('data-filter');
      if (target === filter) {
        btn.className = 'filter-pengurus-btn px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-white shadow-xs transition';
      } else {
        btn.className = 'filter-pengurus-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition';
      }
    });

    this.renderSusunanPengurus();
  },

  render() {
    if (this.activeSubTab === 'pengumuman') {
      this.renderPengumumanList();
    } else {
      this.renderSusunanPengurus();
    }
  },

  getPengumumanData() {
    if (Store && Array.isArray(Store.pengumuman) && Store.pengumuman.length > 0) {
      return Store.pengumuman;
    }
    return DEFAULT_PENGUMUMAN;
  },

  renderPengumumanList() {
    const container = document.getElementById('pengumuman-card-list');
    if (!container) return;

    const data = this.getPengumumanData();
    let filtered = [...data];

    // Filter by Category
    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(item => item.kategori === this.activeCategory);
    }

    // Filter by Search
    if (this.searchQuery) {
      filtered = filtered.filter(item =>
        item.judul.toLowerCase().includes(this.searchQuery) ||
        item.isi.toLowerCase().includes(this.searchQuery) ||
        item.pengirim.toLowerCase().includes(this.searchQuery)
      );
    }

    // Sort: Pinned first, then newest date
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.tanggal) - new Date(a.tanggal);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div class="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <i data-lucide="megaphone-off" class="w-7 h-7"></i>
          </div>
          <h4 class="font-bold text-slate-700 text-base">Belum Ada Pengumuman</h4>
          <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Tidak ditemukan pengumuman pada kategori atau kata kunci yang dicari.</p>
          <button onclick="PengumumanManager.openAddModal()" class="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm inline-flex items-center gap-1.5">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Buat Pengumuman Baru</span>
          </button>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const badgeClasses = {
      'emerald': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'teal': 'bg-teal-50 text-teal-700 border-teal-200',
      'blue': 'bg-blue-50 text-blue-700 border-blue-200',
      'rose': 'bg-rose-50 text-rose-700 border-rose-200',
      'purple': 'bg-purple-50 text-purple-700 border-purple-200',
      'cyan': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'amber': 'bg-amber-50 text-amber-700 border-amber-200'
    };

    container.innerHTML = filtered.map(item => {
      const colorCls = badgeClasses[item.badgeColor] || badgeClasses['emerald'];
      const previewText = item.isi.replace(/\n+/g, ' ').slice(0, 150) + (item.isi.length > 150 ? '...' : '');

      return `
        <div class="bg-white rounded-2xl border ${item.isPinned ? 'border-emerald-300 ring-2 ring-emerald-100 shadow-md' : 'border-slate-200 shadow-xs'} p-5 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition">
          <div>
            <!-- Header Card: Category & Pinned Badge -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg border ${colorCls}">
                <span>${item.kategori}</span>
              </span>

              <div class="flex items-center gap-1.5">
                ${item.isPinned ? `
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-amber-500 text-white shadow-xs">
                    <i data-lucide="pin" class="w-3 h-3 fill-white"></i>
                    <span>PENTING</span>
                  </span>
                ` : ''}
                <span class="text-[11px] font-medium text-slate-400">${formatDateIndo(item.tanggal)}</span>
              </div>
            </div>

            <!-- Title -->
            <h3 class="font-extrabold text-slate-900 text-base leading-snug line-clamp-2 hover:text-emerald-700 cursor-pointer" onclick="PengumumanManager.openDetailModal('${item.id}')">
              ${item.judul}
            </h3>

            <!-- Sender info -->
            <p class="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-1.5">
              <i data-lucide="user" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>${item.pengirim}</span>
            </p>

            <!-- Snippet text -->
            <p class="text-xs text-slate-600 leading-relaxed mt-3 border-t border-slate-100 pt-3">
              ${previewText}
            </p>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button onclick="PengumumanManager.openDetailModal('${item.id}')" class="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
              <span>Baca Rincian</span>
              <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </button>

            <div class="flex items-center gap-1.5">
              <button onclick="PengumumanManager.shareToWhatsApp('${item.id}')" title="Kirim ke WhatsApp Warga" class="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition">
                <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="PengumumanManager.deleteAnnouncement('${item.id}')" title="Hapus Pengumuman" class="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  getPengurusData() {
    if (typeof Store !== 'undefined' && Array.isArray(Store.pengurus) && Store.pengurus.length > 0) {
      return Store.pengurus;
    }
    return typeof DEFAULT_PENGURUS_RT10 !== 'undefined' ? DEFAULT_PENGURUS_RT10 : [];
  },

  renderSusunanPengurus() {
    const container = document.getElementById('pengurus-grid-container');
    if (!container) return;

    const fullList = this.getPengurusData();
    const elCountAll = document.getElementById('pengurus-count-all');
    if (elCountAll) elCountAll.textContent = fullList.length;

    let list = [...fullList];
    if (this.activePengurusFilter !== 'all') {
      list = list.filter(p => p.kategori === this.activePengurusFilter);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
          <div class="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-2">
            <i data-lucide="users" class="w-6 h-6"></i>
          </div>
          <p class="font-bold text-slate-700 text-sm">Belum Ada Personalia</p>
          <p class="text-xs text-slate-400 mt-1">Tidak ada pengurus pada kategori ini.</p>
          <button onclick="PengumumanManager.openAddPengurusModal()" class="mt-3 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-1.5">
            <i data-lucide="user-plus" class="w-4 h-4"></i>
            <span>Tambah Personalia</span>
          </button>
        </div>
      `;
      this.renderBaganVisual();
      if (window.lucide) lucide.createIcons();
      return;
    }

    container.innerHTML = list.map(p => {
      const initial = p.nama.replace(/^(Bpk\.|Ibu|Ustadz|Mayor|\(Purn\)|Ir\.|Hj\.)\s*/g, '').trim().charAt(0) || 'P';
      const cleanWa = p.telp ? p.telp.replace(/[^0-9]/g, '') : '';
      const waUrl = cleanWa.startsWith('0') ? `https://wa.me/62${cleanWa.slice(1)}` : `https://wa.me/${cleanWa}`;
      const avatarBg = p.avatarBg || 'bg-blue-600';

      return `
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between">
          <div>
            <!-- Top Role & Badge -->
            <div class="flex items-start justify-between gap-2 mb-4">
              <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                ${p.badge || 'Pengurus RT'}
              </span>
              <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ${p.blok || '-'}
              </span>
            </div>

            <!-- Profile Info with Avatar -->
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 rounded-2xl ${avatarBg} text-white flex items-center justify-center font-extrabold text-lg shadow-sm shrink-0">
                ${initial}
              </div>
              <div class="overflow-hidden">
                <h4 class="font-extrabold text-slate-900 text-sm leading-tight truncate" title="${p.nama}">${p.nama}</h4>
                <p class="text-xs font-semibold text-blue-700 mt-0.5 truncate">${p.jabatan}</p>
              </div>
            </div>

            <!-- Job description -->
            <div class="p-3 bg-slate-50/80 rounded-xl text-[11px] text-slate-600 leading-relaxed border border-slate-100 mt-3">
              <span class="font-bold text-slate-700 block mb-0.5">Tugas & Tanggung Jawab:</span>
              ${p.tugas || '-'}
            </div>
          </div>

          <!-- Bottom Contact & Action Buttons (Edit, Hapus, WA) -->
          <div class="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-1.5">
              <a href="${waUrl}" target="_blank" class="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 border border-emerald-200 transition" title="Hubungi via WhatsApp">
                <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                <span>WA</span>
              </a>
              <div class="text-[11px] text-slate-500 font-medium flex items-center gap-1 truncate max-w-[100px] sm:max-w-[120px]" title="${p.telp}">
                <i data-lucide="phone" class="w-3 h-3 text-slate-400 shrink-0"></i>
                <span class="truncate">${p.telp || '-'}</span>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <button onclick="PengumumanManager.openEditPengurusModal('${p.id}')" class="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 border border-blue-200 transition" title="Edit Data Pengurus (PIN 1234)">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                <span>Edit</span>
              </button>
              <button onclick="PengumumanManager.openDeletePengurusModal('${p.id}')" class="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 border border-rose-200 transition" title="Hapus Data Pengurus (PIN 1234)">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    this.renderBaganVisual();
    if (window.lucide) lucide.createIcons();
  },

  renderBaganVisual() {
    const list = this.getPengurusData();
    const ketua = list.find(p => p.jabatan && p.jabatan.toLowerCase().includes('ketua') && !p.jabatan.toLowerCase().includes('wakil')) || list[0];
    const sekretaris = list.find(p => p.jabatan && p.jabatan.toLowerCase().includes('sekretaris')) || list[1];
    const bendahara = list.find(p => p.jabatan && p.jabatan.toLowerCase().includes('bendahara')) || list[2];

    if (ketua) {
      const elKetuaNama = document.getElementById('bagan-ketua-nama');
      const elKetuaSub = document.getElementById('bagan-ketua-sub');
      if (elKetuaNama) elKetuaNama.textContent = ketua.nama;
      if (elKetuaSub) elKetuaSub.textContent = `${ketua.blok} • Telp: ${ketua.telp}`;
    }

    if (sekretaris) {
      const elSekretarisNama = document.getElementById('bagan-sekretaris-nama');
      const elSekretarisSub = document.getElementById('bagan-sekretaris-sub');
      if (elSekretarisNama) elSekretarisNama.textContent = sekretaris.nama;
      if (elSekretarisSub) elSekretarisSub.textContent = sekretaris.blok;
    }

    if (bendahara) {
      const elBendaharaNama = document.getElementById('bagan-bendahara-nama');
      const elBendaharaSub = document.getElementById('bagan-bendahara-sub');
      if (elBendaharaNama) elBendaharaNama.textContent = bendahara.nama;
      if (elBendaharaSub) elBendaharaSub.textContent = bendahara.blok;
    }
  },

  openAddPengurusModal() {
    const modal = document.getElementById('modal-pengurus');
    if (!modal) return;

    document.getElementById('form-pengurus').reset();
    document.getElementById('pengurus-id').value = '';
    document.getElementById('modal-pengurus-title').textContent = 'Tambah Personalia Pengurus RT';
    document.getElementById('btn-save-pengurus-text').textContent = 'Simpan Pengurus';
    document.getElementById('pengurus-pin').value = '';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  },

  openEditPengurusModal(id) {
    const list = this.getPengurusData();
    const item = list.find(p => p.id === id);
    if (!item) return;

    const modal = document.getElementById('modal-pengurus');
    if (!modal) return;

    document.getElementById('pengurus-id').value = item.id;
    document.getElementById('pengurus-nama').value = item.nama;
    document.getElementById('pengurus-jabatan').value = item.jabatan;
    document.getElementById('pengurus-kategori').value = item.kategori || 'inti';
    document.getElementById('pengurus-blok').value = item.blok || '';
    document.getElementById('pengurus-telp').value = item.telp || '';
    document.getElementById('pengurus-badge').value = item.badge || '';
    document.getElementById('pengurus-theme-color').value = item.badgeColor || 'blue';
    document.getElementById('pengurus-tugas').value = item.tugas || '';
    document.getElementById('pengurus-pin').value = '';

    document.getElementById('modal-pengurus-title').textContent = 'Edit Personalia Pengurus RT';
    document.getElementById('btn-save-pengurus-text').textContent = 'Perbarui Pengurus';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  },

  handlePengurusSubmit() {
    const pin = document.getElementById('pengurus-pin').value.trim();
    if (pin !== this.PENGURUS_PIN) {
      if (typeof showToast === 'function') {
        showToast('PIN Pengurus salah! Gunakan PIN 1234 untuk menyimpan.', 'error');
      } else {
        alert('PIN Pengurus salah! Masukkan PIN 1234.');
      }
      const pinEl = document.getElementById('pengurus-pin');
      if (pinEl) {
        pinEl.focus();
        pinEl.classList.add('ring-2', 'ring-rose-500');
        setTimeout(() => pinEl.classList.remove('ring-2', 'ring-rose-500'), 1500);
      }
      return;
    }

    const id = document.getElementById('pengurus-id').value;
    const nama = document.getElementById('pengurus-nama').value.trim();
    const jabatan = document.getElementById('pengurus-jabatan').value.trim();
    const kategori = document.getElementById('pengurus-kategori').value;
    const blok = document.getElementById('pengurus-blok').value.trim();
    const telp = document.getElementById('pengurus-telp').value.trim();
    const badge = document.getElementById('pengurus-badge').value.trim();
    const badgeColor = document.getElementById('pengurus-theme-color').value;
    const avatarBg = `bg-${badgeColor}-600`;
    const tugas = document.getElementById('pengurus-tugas').value.trim();

    const pengurusObj = {
      jabatan,
      kategori,
      nama,
      blok,
      telp,
      badge,
      badgeColor,
      avatarBg,
      tugas
    };

    if (id) {
      Store.updatePengurus(id, pengurusObj);
      if (typeof showToast === 'function') {
        showToast('Data pengurus berhasil diperbarui & disimpan ke kas_rt.sql!', 'success');
      }
    } else {
      pengurusObj.id = 'pengurus-' + Date.now();
      Store.addPengurus(pengurusObj);
      if (typeof showToast === 'function') {
        showToast('Pengurus baru berhasil ditambahkan & disimpan ke kas_rt.sql!', 'success');
      }
    }

    this.closeModal('modal-pengurus');
    this.renderSusunanPengurus();
  },

  openDeletePengurusModal(id) {
    const list = this.getPengurusData();
    const item = list.find(p => p.id === id);
    if (!item) return;

    const modal = document.getElementById('modal-delete-pengurus');
    if (!modal) return;

    document.getElementById('delete-pengurus-id').value = item.id;
    document.getElementById('delete-pengurus-nama-label').textContent = item.nama;
    document.getElementById('delete-pengurus-jabatan-label').textContent = item.jabatan;
    document.getElementById('delete-pengurus-blok-label').textContent = `${item.blok} • ${item.telp}`;
    document.getElementById('delete-pengurus-pin').value = '';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  },

  handleDeletePengurusConfirm() {
    const pin = document.getElementById('delete-pengurus-pin').value.trim();
    if (pin !== this.PENGURUS_PIN) {
      if (typeof showToast === 'function') {
        showToast('PIN Keamanan salah! Pengurus tidak dihapus.', 'error');
      } else {
        alert('PIN Keamanan salah!');
      }
      const pinEl = document.getElementById('delete-pengurus-pin');
      if (pinEl) {
        pinEl.focus();
        pinEl.classList.add('ring-2', 'ring-rose-500');
        setTimeout(() => pinEl.classList.remove('ring-2', 'ring-rose-500'), 1500);
      }
      return;
    }

    const id = document.getElementById('delete-pengurus-id').value;
    Store.deletePengurus(id);
    if (typeof showToast === 'function') {
      showToast('Data pengurus berhasil dihapus & kas_rt.sql diperbarui!', 'success');
    }

    this.closeModal('modal-delete-pengurus');
    this.renderSusunanPengurus();
  },

  openDetailModal(id) {
    const data = this.getPengumumanData();
    const item = data.find(a => a.id === id);
    if (!item) return;

    const modal = document.getElementById('modal-detail-pengumuman');
    const content = document.getElementById('detail-pengumuman-content');
    const s = Store.settings || {};
    const namaRt = s.namaRt || "RT 10 / RW 10";
    const subLoc = `${s.kelurahan || 'Kelurahan Sukamaju'}, ${s.kecamatan || 'Kecamatan Cilodong'}, ${s.kota || 'Kota Depok'}`;

    content.innerHTML = `
      <div class="p-6 text-slate-800 space-y-4">
        <!-- Kop Surat Mini -->
        <div class="text-center border-b-2 border-slate-900 pb-3">
          <h2 class="text-lg font-extrabold text-slate-900 uppercase tracking-wide">PENGURUS ${namaRt}</h2>
          <p class="text-xs text-slate-500 font-medium">Kompleks Blok J1 s/d J10 • ${subLoc}</p>
          <div class="mt-2 text-xs font-bold uppercase tracking-wider text-emerald-700">Warta & Pengumuman Resmi Lingkungan</div>
        </div>

        <!-- Meta info -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-1 pb-2 border-b border-slate-100 text-xs">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              ${item.kategori}
            </span>
            ${item.isPinned ? '<span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-white">PINNED</span>' : ''}
          </div>
          <span class="text-slate-500 font-medium">${formatDateIndo(item.tanggal)}</span>
        </div>

        <!-- Headline -->
        <h3 class="text-xl font-extrabold text-slate-900 leading-tight">
          ${item.judul}
        </h3>

        <!-- Penulis -->
        <div class="p-3 bg-slate-50 rounded-xl flex items-center gap-2 text-xs text-slate-700">
          <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
          <span>Diterbitkan resmi oleh: <strong>${item.pengirim}</strong></span>
        </div>

        <!-- Isi Pengumuman -->
        <div class="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line py-2 border-y border-slate-100">
          ${item.isi}
        </div>

        <!-- Tanda Tangan / Penutup -->
        <div class="pt-4 flex justify-end text-right text-xs">
          <div>
            <p class="text-slate-500 mb-8">Hormat Kami,</p>
            <p class="font-bold underline text-slate-900">${item.pengirim}</p>
            <p class="text-[11px] text-slate-500">Pengurus ${namaRt}</p>
          </div>
        </div>

        <!-- Quick Share Bar -->
        <div class="pt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
          <button onclick="PengumumanManager.copyAnnouncementText('${item.id}')" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            <span>Salin Teks</span>
          </button>

          <button onclick="PengumumanManager.shareToWhatsApp('${item.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm">
            <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
            <span>Bagikan ke Grup WhatsApp ${namaRt}</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  },

  openAddModal() {
    const modal = document.getElementById('modal-add-pengumuman');
    if (!modal) return;

    // Reset Form
    document.getElementById('form-add-pengumuman').reset();
    document.getElementById('add-ann-tanggal').value = new Date().toISOString().split('T')[0];

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  },

  handleAddAnnouncementSubmit() {
    const judul = document.getElementById('add-ann-judul').value;
    const kategori = document.getElementById('add-ann-kategori').value;
    const pengirim = document.getElementById('add-ann-pengirim').value;
    const tanggal = document.getElementById('add-ann-tanggal').value;
    const isPinned = document.getElementById('add-ann-pinned').checked;
    const isi = document.getElementById('add-ann-isi').value;

    const badgeColorMap = {
      'Iuran & Keuangan': 'emerald',
      'Keamanan & Ketertiban': 'rose',
      'Kerja Bakti & Lingkungan': 'teal',
      'Sosial & Kesehatan': 'purple',
      'Olahraga & Kepemudaan': 'cyan',
      'Informasi Umum': 'blue'
    };

    const newItem = Store.addPengumuman({
      judul,
      kategori,
      pengirim,
      tanggal,
      isPinned,
      isi,
      badgeColor: badgeColorMap[kategori] || 'emerald'
    });

    this.closeModal('modal-add-pengumuman');
    showToast('Pengumuman baru berhasil dipublikasikan!', 'success');
    this.renderPengumumanList();
  },

  deleteAnnouncement(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return;
    Store.deletePengumuman(id);
    showToast('Pengumuman telah dihapus', 'info');
    this.renderPengumumanList();
  },

  shareToWhatsApp(id) {
    const data = this.getPengumumanData();
    const item = data.find(a => a.id === id);
    if (!item) return;

    const s = Store.settings || {};
    const namaRt = s.namaRt || "RT 10 / RW 10";

    const text = `📢 *PENGUMUMAN RESMI ${namaRt}*\n*Kompleks Blok J (J1 s/d J10)*\n\n📌 *${item.judul.toUpperCase()}*\n📅 Tanggal: ${formatDateIndo(item.tanggal)}\n🏷 Kategori: ${item.kategori}\n👤 Pengirim: ${item.pengirim}\n\n${item.isi}\n\n---\n_Pesan otomatis dari Portal Warga Kas ${namaRt}_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  },

  copyAnnouncementText(id) {
    const data = this.getPengumumanData();
    const item = data.find(a => a.id === id);
    if (!item) return;

    const s = Store.settings || {};
    const namaRt = s.namaRt || "RT 10 / RW 10";

    const text = `📢 PENGUMUMAN RESMI ${namaRt}\nKompleks Blok J (J1 s/d J10)\n\n${item.judul}\nTanggal: ${formatDateIndo(item.tanggal)}\nKategori: ${item.kategori}\nPengirim: ${item.pengirim}\n\n${item.isi}`;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Teks pengumuman berhasil disalin ke clipboard!', 'success');
    });
  }
};

if (typeof window !== 'undefined') {
  window.PengumumanManager = PengumumanManager;
}

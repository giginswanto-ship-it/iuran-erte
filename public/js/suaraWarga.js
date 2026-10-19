/**
 * Suara Warga Component
 * Tagline: "Setiap Pendapat Berharga, Setiap Aspirasi Bermakna"
 * Maksimal 100 kata per aspirasi
 */

const DEFAULT_SUARA_WARGA = [
  {
    id: "suara-1",
    judul: "Penerangan Lampu Jalan (PJU) Padam di Pertigaan Blok J3",
    kategori: "Keluhan Fasilitas",
    kategoriBadge: "rose",
    pengirim: "Warga Blok J3",
    blok: "Blok J3",
    isAnonim: false,
    tanggal: "2026-10-17",
    isi: "Lampu PJU di pertigaan antara Blok J3 No. 08 dan No. 10 sudah padam sejak dua hari lalu. Kondisi jalan cukup gelap saat malam hari dan rawan bagi pejalan kaki atau anak-anak yang pulang dari masjid. Mohon Seksi Sarpras dapat segera memeriksa bohlam atau kabel jalurnya. Terima kasih.",
    dukungan: 14,
    status: "Selesai",
    tanggapan: {
      penjawab: "Bpk. Ir. Dedi Supriyadi (Seksi Sarpras)",
      tanggal: "2026-10-18",
      pesan: "Terima kasih laporannya. Tim sarpras sudah mengganti bohlam LED 40W baru tadi sore. Saat ini lampu PJU di pertigaan Blok J3 sudah menyala terang kembali normal."
    }
  },
  {
    id: "suara-2",
    judul: "Ide Penyediaan Rak Pojok Baca Anak di Gazebo Taman Blok J5",
    kategori: "Ide & Inovasi",
    kategoriBadge: "amber",
    pengirim: "Ibu Ratna Dewi",
    blok: "Blok J5 No. 06",
    isAnonim: false,
    tanggal: "2026-10-14",
    isi: "Usul agar di Gazebo Taman Blok J5 dibuatkan lemari buku mini atau Pojok Baca Anak. Banyak anak-anak bermain di taman sore hari. Kami para ibu siap menyumbangkan buku cerita, komik edukasi, dan majalah anak yang masih layak baca agar anak-anak tidak kecanduan gadget.",
    dukungan: 28,
    status: "Ditindaklanjuti",
    tanggapan: {
      penjawab: "Bpk. Bambang Sutrisno (Ketua RT 10)",
      tanggal: "2026-10-15",
      pesan: "Ide yang sangat positif! Kami sudah koordinasikan dengan Seksi Sarpras untuk membuat rak gantung kayu tahan air di gazebo minggu depan. Warga yang ingin donasi buku bisa diserahkan ke Balai RT."
    }
  },
  {
    id: "suara-3",
    judul: "Kritik Ketertiban Parkir Mobil Tamu di Badan Jalan Utama Blok J6",
    kategori: "Kritik Konstruktif",
    kategoriBadge: "purple",
    pengirim: "Warga Kompleks",
    blok: "Blok J6",
    isAnonim: true,
    tanggal: "2026-10-10",
    isi: "Mohon ketegasan pengurus mengenai mobil tamu warga yang parkir di kedua sisi badan jalan Blok J6 saat akhir pekan. Jalur jadi sangat sempit sehingga mobil sampah dan ambulans kesulitan lewat. Sebaiknya tamu diarahkan parkir di lapangan serbaguna jika carport penuh.",
    dukungan: 19,
    status: "Ditindaklanjuti",
    tanggapan: {
      penjawab: "Bpk. Slamet Riyadi (Koordinator Keamanan)",
      tanggal: "2026-10-11",
      pesan: "Masukan diterima dengan baik. Regu satpam sudah diinstruksikan memasang kerucut pembatas jalan dan mengarahkan mobil tamu parkir di bahu lapangan bulutangkis Blok J8."
    }
  },
  {
    id: "suara-4",
    judul: "Kabar Bahagia: Kelahiran Putra Pertama Keluarga Bpk. Rizky Blok J2",
    kategori: "Berita Warga",
    kategoriBadge: "blue",
    pengirim: "Bpk. Agus Santoso (Sekretaris)",
    blok: "Blok J2 No. 14",
    isAnonim: false,
    tanggal: "2026-10-05",
    isi: "Alhamdulillah telah lahir dengan selamat putra pertama dari warga kita Bpk. Rizky & Ibu Sarah (Blok J2 No. 14) pada hari Minggu kemarin dengan berat 3.2 kg dalam kondisi sehat walafiat. Semoga menjadi anak yang sholeh dan membanggakan keluarga.",
    dukungan: 35,
    status: "Selesai",
    tanggapan: {
      penjawab: "Ibu Hj. Siti Rahmawati (Seksi Sosial)",
      tanggal: "2026-10-06",
      pesan: "Selamat kepada keluarga Bpk. Rizky. Tim perwakilan ibu-ibu PKK dan seksi sosial RT 10 telah menyerahkan bingkisan tali asih warga."
    }
  },
  {
    id: "suara-5",
    judul: "Usul Fasilitas Pembayaran Iuran Menggunakan Notifikasi WhatsApp",
    kategori: "Usulan Warga",
    kategoriBadge: "teal",
    pengirim: "Indra Pratama",
    blok: "Blok J8 No. 04",
    isAnonim: false,
    tanggal: "2026-09-28",
    isi: "Usul untuk sistem iuran, apakah memungkinkan ada broadcast pengingat atau kirim bukti bayar otomatis via WhatsApp setelah warga bayar? Supaya warga yang sibuk kerja tidak lupa jadwal bayar sebelum tanggal 10.",
    dukungan: 22,
    status: "Ditanggapi",
    tanggapan: {
      penjawab: "Bpk. Hendra Wijaya (Bendahara)",
      tanggal: "2026-09-29",
      pesan: "Terima kasih sarannya. Saat ini kwitansi digital sudah bisa langsung dibagikan ke WhatsApp warga lewat tombol 'Kirim WA' di tabel iuran. Fitur pengingat berkala sedang kami persiapkan."
    }
  }
];

const SuaraWargaManager = {
  activeCategory: 'all',
  activeStatus: 'all',
  searchQuery: '',

  init() {
    this.setupEventListeners();
  },

  setupEventListeners() {
    // Form submit
    const form = document.getElementById('form-kirim-suara');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    // Live word count handler
    const textarea = document.getElementById('suara-isi');
    if (textarea) {
      textarea.addEventListener('input', () => {
        this.handleWordCount(textarea);
      });
    }

    // Search input
    const searchInput = document.getElementById('search-suara');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderList();
      });
    }
  },

  countWords(text) {
    if (!text || !text.trim()) return 0;
    const tokens = text.trim().split(/\s+/);
    return tokens.filter(t => t.length > 0).length;
  },

  handleWordCount(textarea) {
    const text = textarea.value;
    const wordCount = this.countWords(text);
    const counterEl = document.getElementById('suara-word-count');
    const warningEl = document.getElementById('suara-word-warning');

    if (counterEl) {
      counterEl.textContent = `${wordCount} / 100 kata`;
      if (wordCount > 100) {
        counterEl.className = 'text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200';
        if (warningEl) {
          warningEl.classList.remove('hidden');
          warningEl.textContent = `Aspirasi melebihi batas (${wordCount} kata). Mohon ringkas maksimal 100 kata.`;
        }
      } else if (wordCount >= 85) {
        counterEl.className = 'text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200';
        if (warningEl) warningEl.classList.add('hidden');
      } else {
        counterEl.className = 'text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md';
        if (warningEl) warningEl.classList.add('hidden');
      }
    }
  },

  getData() {
    if (Store && Array.isArray(Store.suaraWarga) && Store.suaraWarga.length > 0) {
      return Store.suaraWarga;
    }
    return DEFAULT_SUARA_WARGA;
  },

  setCategoryFilter(cat) {
    this.activeCategory = cat;
    const buttons = document.querySelectorAll('.filter-suara-cat-btn');
    buttons.forEach(btn => {
      const target = btn.getAttribute('data-cat');
      if (target === cat) {
        btn.className = 'filter-suara-cat-btn px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-700 text-white shadow-xs transition';
      } else {
        btn.className = 'filter-suara-cat-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition';
      }
    });

    this.renderList();
  },

  setStatusFilter(status) {
    this.activeStatus = status;
    const buttons = document.querySelectorAll('.filter-suara-status-btn');
    buttons.forEach(btn => {
      const target = btn.getAttribute('data-status');
      if (target === status) {
        btn.className = 'filter-suara-status-btn px-3 py-1 text-xs font-bold rounded-lg bg-slate-800 text-white transition';
      } else {
        btn.className = 'filter-suara-status-btn px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition';
      }
    });

    this.renderList();
  },

  render() {
    this.renderStats();
    this.renderList();
  },

  renderStats() {
    const list = this.getData();
    const elTotal = document.getElementById('stat-suara-total');
    const elSelesai = document.getElementById('stat-suara-selesai');
    const elProses = document.getElementById('stat-suara-proses');
    const elDukungan = document.getElementById('stat-suara-dukungan');

    const total = list.length;
    const selesai = list.filter(s => s.status === 'Selesai' || s.status === 'Ditanggapi').length;
    const proses = list.filter(s => s.status === 'Ditindaklanjuti' || s.status === 'Menunggu').length;
    const totalDukungan = list.reduce((sum, s) => sum + (s.dukungan || 0), 0);

    if (elTotal) elTotal.textContent = total;
    if (elSelesai) elSelesai.textContent = selesai;
    if (elProses) elProses.textContent = proses;
    if (elDukungan) elDukungan.textContent = totalDukungan;
  },

  renderList() {
    const container = document.getElementById('suara-warga-card-list');
    if (!container) return;

    const rawList = this.getData();
    let filtered = [...rawList];

    // Filter Kategori
    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(item => item.kategori === this.activeCategory);
    }

    // Filter Status
    if (this.activeStatus !== 'all') {
      if (this.activeStatus === 'Selesai') {
        filtered = filtered.filter(item => item.status === 'Selesai' || item.status === 'Ditanggapi');
      } else {
        filtered = filtered.filter(item => item.status === this.activeStatus);
      }
    }

    // Filter Search
    if (this.searchQuery) {
      filtered = filtered.filter(item =>
        item.judul.toLowerCase().includes(this.searchQuery) ||
        item.isi.toLowerCase().includes(this.searchQuery) ||
        item.pengirim.toLowerCase().includes(this.searchQuery) ||
        item.blok.toLowerCase().includes(this.searchQuery)
      );
    }

    // Sort by date newest
    filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div class="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <i data-lucide="message-square-dashed" class="w-7 h-7"></i>
          </div>
          <h4 class="font-bold text-slate-800 text-base">Belum Ada Aspirasi</h4>
          <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Jadilah yang pertama menyampaikan ide, usul, atau keluhan untuk lingkungan RT 10 / RW 10.</p>
          <button onclick="document.getElementById('suara-form-card').scrollIntoView({ behavior: 'smooth' })" class="mt-4 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition shadow-sm inline-flex items-center gap-1.5">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
            <span>Tulis Aspirasi Sekarang</span>
          </button>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const badgeColors = {
      'Ide & Inovasi': 'bg-amber-50 text-amber-800 border-amber-200',
      'Keluhan Fasilitas': 'bg-rose-50 text-rose-800 border-rose-200',
      'Kritik Konstruktif': 'bg-purple-50 text-purple-800 border-purple-200',
      'Usulan Warga': 'bg-teal-50 text-teal-800 border-teal-200',
      'Berita Warga': 'bg-blue-50 text-blue-800 border-blue-200'
    };

    const statusBadge = {
      'Selesai': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Ditanggapi': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Ditindaklanjuti': 'bg-blue-50 text-blue-700 border-blue-200',
      'Menunggu': 'bg-slate-100 text-slate-600 border-slate-200'
    };

    container.innerHTML = filtered.map(item => {
      const catCls = badgeColors[item.kategori] || 'bg-slate-100 text-slate-700 border-slate-200';
      const statCls = statusBadge[item.status] || 'bg-slate-100 text-slate-600 border-slate-200';
      const wordCount = this.countWords(item.isi);
      const isLiked = this.isAspirasiLiked(item.id);

      return `
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-purple-300 hover:shadow-md transition flex flex-col justify-between">
          <div>
            <!-- Header Card: Category, Status & Tanggal -->
            <div class="flex items-start justify-between gap-2 mb-3">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg border ${catCls}">
                  ${item.kategori}
                </span>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-md border ${statCls}">
                  ${item.status === 'Selesai' || item.status === 'Ditanggapi' ? '✓ ' + item.status : '⏳ ' + item.status}
                </span>
              </div>
              <span class="text-[11px] font-medium text-slate-400 whitespace-nowrap">
                ${formatDateIndo(item.tanggal)}
              </span>
            </div>

            <!-- Title -->
            <h3 class="font-extrabold text-slate-900 text-base leading-snug mb-2">
              ${item.judul}
            </h3>

            <!-- Sender info badge -->
            <div class="flex items-center gap-2 mb-4 text-xs">
              <div class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                ${item.isAnonim ? '?' : item.pengirim.charAt(0)}
              </div>
              <span class="font-semibold text-slate-700">
                ${item.isAnonim ? 'Warga Anonim (' + item.blok + ')' : item.pengirim + ' (' + item.blok + ')'}
              </span>
            </div>

            <!-- Content (maks 100 kata) -->
            <div class="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed relative">
              <p class="whitespace-pre-line">${item.isi}</p>
              <div class="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>Panjang: <strong>${wordCount} kata</strong> (maks. 100 kata)</span>
                <span class="text-emerald-700 font-semibold">Tervalidasi Sesuai Batasan</span>
              </div>
            </div>

            <!-- Tanggapan Pengurus Box (Jika Ada) -->
            ${item.tanggapan ? `
              <div class="mt-3.5 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs">
                <div class="flex items-center justify-between mb-1 text-[11px] font-bold text-emerald-900">
                  <span class="flex items-center gap-1.5">
                    <i data-lucide="message-square-check" class="w-3.5 h-3.5 text-emerald-600"></i>
                    <span>Tanggapan Pengurus: ${item.tanggapan.penjawab}</span>
                  </span>
                  <span class="text-[10px] font-medium text-emerald-700">${formatDateIndo(item.tanggapan.tanggal)}</span>
                </div>
                <p class="text-emerald-800 leading-relaxed text-[11px]">${item.tanggapan.pesan}</p>
              </div>
            ` : `
              <div class="mt-3.5 p-2.5 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Belum ada tanggapan resmi dari pengurus RT.</span>
                <button onclick="SuaraWargaManager.openTanggapanModal('${item.id}')" class="text-purple-700 font-bold hover:underline text-[11px]">
                  Beri Tanggapan (Pengurus)
                </button>
              </div>
            `}
          </div>

          <!-- Bottom Footer Action -->
          <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <!-- Dukungan Button -->
            <button 
              onclick="SuaraWargaManager.toggleLike('${item.id}')" 
              class="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${isLiked ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold' : 'bg-slate-50 hover:bg-purple-50 text-slate-600 border-slate-200'}">
              <i data-lucide="thumbs-up" class="w-3.5 h-3.5 ${isLiked ? 'fill-purple-700 text-purple-700' : ''}"></i>
              <span>Dukung (${item.dukungan || 0})</span>
            </button>

            <!-- Actions: Tambah Tanggapan & WhatsApp Share & Hapus -->
            <div class="flex items-center gap-1.5">
              ${!item.tanggapan ? `
                <button onclick="SuaraWargaManager.openTanggapanModal('${item.id}')" title="Tanggapi sebagai Pengurus" class="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition">
                  <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                </button>
              ` : ''}

              <button onclick="SuaraWargaManager.shareToWhatsApp('${item.id}')" title="Kirim ke WhatsApp Pengurus/Warga" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
              </button>

              <button onclick="SuaraWargaManager.deleteAspirasi('${item.id}')" title="Hapus Aspirasi" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  handleSubmit() {
    const judul = document.getElementById('suara-judul').value.trim();
    const kategori = document.getElementById('suara-kategori').value;
    const pengirim = document.getElementById('suara-pengirim').value.trim();
    const blok = document.getElementById('suara-blok').value;
    const isAnonim = document.getElementById('suara-anonim').checked;
    const isi = document.getElementById('suara-isi').value.trim();

    // Check words
    const words = this.countWords(isi);
    if (words === 0) {
      showToast('Isi aspirasi tidak boleh kosong', 'warning');
      return;
    }

    if (words > 100) {
      showToast(`Pesan melebihi batas maksimal (${words}/100 kata). Mohon perpendek tulisan Anda.`, 'error');
      document.getElementById('suara-isi').focus();
      return;
    }

    const newItem = {
      id: `suara-${Date.now()}`,
      judul,
      kategori,
      pengirim: isAnonim ? 'Warga Anonim' : (pengirim || 'Warga Blok ' + blok),
      blok,
      isAnonim,
      tanggal: new Date().toISOString().split('T')[0],
      isi,
      dukungan: 1,
      status: 'Menunggu',
      tanggapan: null
    };

    Store.addSuaraWarga(newItem);

    // Reset Form
    document.getElementById('form-kirim-suara').reset();
    document.getElementById('suara-word-count').textContent = '0 / 100 kata';

    showToast('Aspirasi Anda berhasil dikirim! Terima kasih atas partisipasi aktifnya.', 'success');
    this.render();

    // Scroll to cards
    const cardList = document.getElementById('suara-warga-card-list');
    if (cardList) {
      cardList.scrollIntoView({ behavior: 'smooth' });
    }
  },

  isAspirasiLiked(id) {
    const liked = JSON.parse(localStorage.getItem('liked_suara_ids') || '[]');
    return liked.includes(id);
  },

  toggleLike(id) {
    let liked = JSON.parse(localStorage.getItem('liked_suara_ids') || '[]');
    const isAlreadyLiked = liked.includes(id);

    if (isAlreadyLiked) {
      liked = liked.filter(item => item !== id);
      Store.toggleLikeSuara(id, -1);
    } else {
      liked.push(id);
      Store.toggleLikeSuara(id, 1);
    }

    localStorage.setItem('liked_suara_ids', JSON.stringify(liked));
    this.renderList();
    this.renderStats();
  },

  openTanggapanModal(id) {
    const list = this.getData();
    const item = list.find(s => s.id === id);
    if (!item) return;

    const modal = document.getElementById('modal-tanggapan-suara');
    const titleEl = document.getElementById('tanggapan-modal-title');
    const inputId = document.getElementById('tanggapan-suara-id');

    if (modal && titleEl && inputId) {
      titleEl.textContent = `Beri Tanggapan: ${item.judul}`;
      inputId.value = id;

      const s = Store.settings || {};
      const defaultPenjawab = s.namaKetuaRt ? `${s.namaKetuaRt} (Ketua RT)` : 'Bpk. Bambang Sutrisno (Ketua RT)';
      document.getElementById('tanggapan-penjawab').value = defaultPenjawab;
      document.getElementById('tanggapan-pesan').value = '';

      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  },

  handleTanggapanSubmit() {
    const id = document.getElementById('tanggapan-suara-id').value;
    const penjawab = document.getElementById('tanggapan-penjawab').value.trim();
    const pesan = document.getElementById('tanggapan-pesan').value.trim();
    const status = document.getElementById('tanggapan-status').value;

    if (!pesan) {
      showToast('Isi tanggapan tidak boleh kosong', 'warning');
      return;
    }

    Store.addTanggapanSuara(id, {
      penjawab,
      pesan,
      status,
      tanggal: new Date().toISOString().split('T')[0]
    });

    this.closeModal('modal-tanggapan-suara');
    showToast('Tanggapan pengurus berhasil dipublikasikan!', 'success');
    this.render();
  },

  deleteAspirasi(id) {
    if (!confirm('Hapus aspirasi warga ini?')) return;
    Store.deleteSuaraWarga(id);
    showToast('Aspirasi telah dihapus', 'info');
    this.render();
  },

  shareToWhatsApp(id) {
    const list = this.getData();
    const item = list.find(s => s.id === id);
    if (!item) return;

    const s = Store.settings || {};
    const namaRt = s.namaRt || "RT 10 / RW 10";

    let text = `📢 *SUARA WARGA ${namaRt}*\n_"Setiap Pendapat Berharga, Setiap Aspirasi Bermakna"_\n\n📌 *${item.judul}*\n🏷 Kategori: ${item.kategori}\n👤 Pengirim: ${item.pengirim} (${item.blok})\n📅 Tanggal: ${formatDateIndo(item.tanggal)}\n\n"${item.isi}"\n\n`;

    if (item.tanggapan) {
      text += `✅ *Tanggapan Pengurus (${item.tanggapan.penjawab}):*\n"${item.tanggapan.pesan}"\n\n`;
    }

    text += `---\n_Diteruskan dari Portal Kas & Suara Warga ${namaRt}_`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
};

if (typeof window !== 'undefined') {
  window.SuaraWargaManager = SuaraWargaManager;
}

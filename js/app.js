/**
 * Main Application Orchestrator
 */

// Global Toast Notification Helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    warning: 'bg-amber-600 text-white',
    info: 'bg-slate-800 text-white'
  };

  const icons = {
    success: '<i data-lucide="check-circle" class="w-4 h-4"></i>',
    error: '<i data-lucide="alert-circle" class="w-4 h-4"></i>',
    warning: '<i data-lucide="alert-triangle" class="w-4 h-4"></i>',
    info: '<i data-lucide="info" class="w-4 h-4"></i>'
  };

  toast.className = `toast flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `
    ${icons[type] || icons.info}
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons({ root: toast });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(1rem)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

const MENU_THEMES = {
  dashboard: {
    active: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 font-bold',
    idle: 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-800 font-semibold',
    iconActive: 'bg-white/20 text-white',
    iconIdle: 'bg-emerald-100 text-emerald-700',
    tagActive: 'bg-white/20 text-white border-transparent',
    tagIdle: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  pengumuman: {
    active: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30 font-bold',
    idle: 'text-slate-700 hover:bg-amber-50/80 hover:text-amber-800 font-semibold',
    iconActive: 'bg-white/20 text-white',
    iconIdle: 'bg-amber-100 text-amber-700',
    tagActive: 'bg-white/20 text-white border-transparent',
    tagIdle: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  suarawarga: {
    active: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 font-bold',
    idle: 'text-slate-700 hover:bg-purple-50/80 hover:text-purple-800 font-semibold',
    iconActive: 'bg-white/20 text-white',
    iconIdle: 'bg-purple-100 text-purple-700',
    tagActive: 'bg-white/20 text-white border-transparent',
    tagIdle: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  iuran: {
    active: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/30 font-bold',
    idle: 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-800 font-semibold',
    iconActive: 'bg-white/20 text-white',
    iconIdle: 'bg-blue-100 text-blue-700',
    tagActive: 'bg-white/20 text-white border-transparent',
    tagIdle: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  transaksi: {
    active: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/30 font-bold',
    idle: 'text-slate-700 hover:bg-rose-50/80 hover:text-rose-800 font-semibold',
    iconActive: 'bg-white/20 text-white',
    iconIdle: 'bg-rose-100 text-rose-700',
    tagActive: 'bg-white/20 text-white border-transparent',
    tagIdle: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  warga: {
    active: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 font-bold',
    idle: 'text-slate-700 hover:bg-indigo-50/80 hover:text-indigo-800 font-semibold',
    iconActive: 'bg-white/20 text-white',
    iconIdle: 'bg-indigo-100 text-indigo-700',
    tagActive: 'bg-white/20 text-white border-transparent',
    tagIdle: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  laporan: {
    active: 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-md shadow-teal-600/30 font-bold',
    idle: 'text-slate-700 hover:bg-teal-50/80 hover:text-teal-800 font-semibold',
    iconActive: 'bg-white/20 text-white',
    iconIdle: 'bg-teal-100 text-teal-700',
    tagActive: 'bg-white/20 text-white border-transparent',
    tagIdle: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  settings: {
    active: 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-md shadow-slate-600/30 font-bold',
    idle: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold',
    iconActive: 'bg-white/20 text-white',
    iconIdle: 'bg-slate-100 text-slate-700',
    tagActive: 'bg-white/20 text-white border-transparent',
    tagIdle: 'bg-slate-100 text-slate-600 border-slate-200'
  }
};

const App = {
  currentTab: 'dashboard',

  init() {
    Store.init();

    // Subscribe modules to store changes
    Store.subscribe(() => {
      this.updateHeaderInfo();
      if (this.currentTab === 'dashboard') Dashboard.render();
      if (this.currentTab === 'iuran') IuranManager.renderMatrix();
      if (this.currentTab === 'transaksi') PengeluaranManager.renderTable();
      if (this.currentTab === 'warga') WargaManager.renderTable();
      if (this.currentTab === 'laporan') LaporanManager.render();
      if (this.currentTab === 'pengumuman') PengumumanManager.render();
      if (this.currentTab === 'suarawarga') SuaraWargaManager.render();
    });

    // Initialize sub-modules
    IuranManager.init();
    PengeluaranManager.init();
    WargaManager.init();
    LaporanManager.init();
    PengumumanManager.init();
    SuaraWargaManager.init();

    this.setupNavTabs();
    this.setupModalBackdrops();
    this.setupSettingsForm();
    this.setupBackupRestore();
    this.updateHeaderInfo();

    // Render Initial View
    this.switchTab('dashboard');

    if (window.lucide) {
      lucide.createIcons();
    }
  },

  updateHeaderInfo() {
    const s = Store.settings || {};
    const namaRt = s.namaRt || "RT 10 / RW 10";
    const kelurahan = s.kelurahan || "Kelurahan Sukamaju";
    const kecamatan = s.kecamatan || "Kecamatan Cilodong";
    const kota = s.kota || "Kota Depok";
    const subLocation = `${kelurahan}, ${kecamatan}, ${kota}`;
    const ketua = s.namaKetuaRt || "Bpk. Bambang Sutrisno";
    const bendahara = s.namaBendahara || "Bpk. Hendra Wijaya";
    const tahun = s.tahunAktif || new Date().getFullYear();
    const nominal = s.nominalIuran || 150000;
    const rincian = s.rincianIuran || "";
    const totalWarga = (Store.warga && Store.warga.length) ? `${Store.warga.length} KK` : "200 KK";

    // Set text on class targets
    document.querySelectorAll('.label-rt-name').forEach(el => el.textContent = namaRt);
    document.querySelectorAll('.label-rt-sub').forEach(el => el.textContent = subLocation);
    document.querySelectorAll('.label-kelurahan').forEach(el => el.textContent = kelurahan);
    document.querySelectorAll('.label-kecamatan').forEach(el => el.textContent = kecamatan);
    document.querySelectorAll('.label-kota').forEach(el => el.textContent = kota);
    document.querySelectorAll('.label-tahun-aktif').forEach(el => el.textContent = tahun);
    document.querySelectorAll('.label-ketua-rt').forEach(el => el.textContent = ketua);
    document.querySelectorAll('.label-bendahara').forEach(el => el.textContent = bendahara);
    document.querySelectorAll('.label-nominal-iuran').forEach(el => el.textContent = formatRupiah(nominal));
    document.querySelectorAll('.label-rincian-iuran').forEach(el => el.textContent = rincian);
    document.querySelectorAll('.label-total-warga').forEach(el => el.textContent = totalWarga);

    // Initial bendahara avatar
    const initialBendahara = bendahara.replace(/^(Bpk\.|Ibu|Ustadz)\s*/g, '').trim().charAt(0) || 'B';
    document.querySelectorAll('.label-bendahara-initial').forEach(el => el.textContent = initialBendahara);

    // Dynamic document title
    document.title = `Sistem Kas RT - ${namaRt}`;

    // Synchronize year selectors across modules if present
    const iuranYearSelect = document.getElementById('iuran-matrix-year');
    if (iuranYearSelect && Number(iuranYearSelect.value) !== Number(tahun)) {
      iuranYearSelect.value = tahun;
      if (typeof IuranManager !== 'undefined') IuranManager.currentYear = Number(tahun);
    }
    const laporanYearSelect = document.getElementById('laporan-filter-year');
    if (laporanYearSelect && Number(laporanYearSelect.value) !== Number(tahun)) {
      laporanYearSelect.value = tahun;
      if (typeof LaporanManager !== 'undefined') LaporanManager.filterYear = Number(tahun);
    }
  },

  openSqlPreviewModal() {
    const modalViewSql = document.getElementById('modal-view-sql');
    const sqlPreviewContent = document.getElementById('sql-preview-content');
    if (modalViewSql && sqlPreviewContent) {
      sqlPreviewContent.textContent = Store.generateSQLScript();
      modalViewSql.classList.remove('hidden');
      modalViewSql.classList.add('flex');
      if (window.lucide) lucide.createIcons();
    }
  },

  setupMobileDrawer() {
    const btnToggle = document.getElementById('btn-toggle-sidebar');
    const btnClose = document.getElementById('btn-close-sidebar');
    const btnBottomMenu = document.getElementById('btn-bottom-menu');
    const backdrop = document.getElementById('sidebar-backdrop');
    const sidebar = document.getElementById('sidebar');

    const openDrawer = () => {
      if (!sidebar) return;
      sidebar.classList.remove('-translate-x-full');
      if (backdrop) {
        backdrop.classList.add('active');
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');
      }
      if (btnToggle) {
        btnToggle.classList.add('is-active');
        btnToggle.setAttribute('aria-expanded', 'true');
      }
      document.body.classList.add('overflow-hidden');
    };

    const closeDrawer = () => {
      if (!sidebar) return;
      sidebar.classList.add('-translate-x-full');
      if (backdrop) {
        backdrop.classList.remove('active');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        backdrop.classList.remove('opacity-100');
      }
      if (btnToggle) {
        btnToggle.classList.remove('is-active');
        btnToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.classList.remove('overflow-hidden');
    };

    const toggleDrawer = () => {
      if (!sidebar) return;
      const isOpen = !sidebar.classList.contains('-translate-x-full');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    };

    if (btnToggle) btnToggle.addEventListener('click', toggleDrawer);
    if (btnClose) btnClose.addEventListener('click', closeDrawer);
    if (btnBottomMenu) btnBottomMenu.addEventListener('click', toggleDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar && !sidebar.classList.contains('-translate-x-full')) {
        closeDrawer();
      }
    });

    // Close on resize to desktop (>= 1024px)
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        closeDrawer();
      }
    });

    this.closeDrawer = closeDrawer;
    this.openDrawer = openDrawer;
  },

  setupModalBackdrops() {
    const modalIds = [
      'modal-quick-pay',
      'modal-batch-pay',
      'modal-receipt',
      'modal-add-expense',
      'modal-add-income',
      'modal-edit-transaksi',
      'modal-warga',
      'modal-print-report',
      'modal-view-sql',
      'modal-detail-pengumuman',
      'modal-add-pengumuman',
      'modal-tanggapan-suara',
      'modal-pengurus',
      'modal-delete-pengurus'
    ];

    modalIds.forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
          }
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modalIds.forEach(id => {
          const modal = document.getElementById(id);
          if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
          }
        });
      }
    });
  },

  setupNavTabs() {
    this.setupMobileDrawer();

    const navItems = document.querySelectorAll('[data-tab-target]');
    navItems.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = btn.getAttribute('data-tab-target');
        this.switchTab(target);
        if (this.closeDrawer) this.closeDrawer();
      });
    });

    // Subnav buttons click handling
    const subPengumuman = document.getElementById('subnav-pengumuman');
    const subPengurus = document.getElementById('subnav-pengurus');
    if (subPengumuman) {
      subPengumuman.addEventListener('click', () => {
        this.switchTab('pengumuman');
        if (typeof PengumumanManager !== 'undefined') {
          PengumumanManager.switchSubTab('pengumuman');
        }
        if (this.closeDrawer) this.closeDrawer();
      });
    }
    if (subPengurus) {
      subPengurus.addEventListener('click', () => {
        this.switchTab('pengumuman');
        if (typeof PengumumanManager !== 'undefined') {
          PengumumanManager.switchSubTab('pengurus');
        }
        if (this.closeDrawer) this.closeDrawer();
      });
    }
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update Nav Buttons State with Rich Unique Color Backgrounds
    const navItems = document.querySelectorAll('[data-tab-target]');
    navItems.forEach(btn => {
      const target = btn.getAttribute('data-tab-target');
      const theme = MENU_THEMES[target] || MENU_THEMES.dashboard;
      const iconBox = btn.querySelector('.nav-icon-box');
      const tag = btn.querySelector('.nav-tag');

      if (target === tabId) {
        btn.className = `nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition text-left group ${theme.active}`;
        if (iconBox) iconBox.className = `nav-icon-box w-8 h-8 rounded-xl flex items-center justify-center transition shadow-2xs ${theme.iconActive}`;
        if (tag) tag.className = `nav-tag px-2 py-0.5 text-[10px] font-bold rounded-lg border transition ${theme.tagActive}`;
      } else {
        btn.className = `nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition text-left group ${theme.idle}`;
        if (iconBox) iconBox.className = `nav-icon-box w-8 h-8 rounded-xl flex items-center justify-center transition shadow-2xs ${theme.iconIdle}`;
        if (tag) tag.className = `nav-tag px-2 py-0.5 text-[10px] font-bold rounded-lg border transition ${theme.tagIdle}`;
      }
    });

    // Update Mobile Bottom Nav Active Tab
    const mobileTabs = document.querySelectorAll('[data-mobile-tab]');
    mobileTabs.forEach(btn => {
      const target = btn.getAttribute('data-mobile-tab');
      if (target === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update subnav buttons active indicator
    if (tabId === 'pengumuman' && typeof PengumumanManager !== 'undefined') {
      const isPengurus = PengumumanManager.activeSubTab === 'pengurus';
      const subPengumuman = document.getElementById('subnav-pengumuman');
      const subPengurus = document.getElementById('subnav-pengurus');
      if (subPengumuman && subPengurus) {
        if (isPengurus) {
          subPengurus.className = 'w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm border border-blue-600 transition text-left';
          subPengumuman.className = 'w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-900 hover:from-amber-100 hover:to-orange-100 transition shadow-2xs text-left';
        } else {
          subPengumuman.className = 'w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm border border-amber-500 transition text-left';
          subPengurus.className = 'w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-900 hover:from-blue-100 hover:to-indigo-100 transition shadow-2xs text-left';
        }
      }
    }

    // Show / Hide Section Views
    const sections = document.querySelectorAll('.tab-section');
    sections.forEach(sec => {
      if (sec.id === `section-${tabId}`) {
        sec.classList.remove('hidden');
      } else {
        sec.classList.add('hidden');
      }
    });

    // Trigger tab specific render
    if (tabId === 'dashboard') {
      Dashboard.render();
    } else if (tabId === 'iuran') {
      IuranManager.renderMatrix();
    } else if (tabId === 'transaksi') {
      PengeluaranManager.renderTable();
    } else if (tabId === 'warga') {
      WargaManager.renderTable();
    } else if (tabId === 'laporan') {
      LaporanManager.render();
    } else if (tabId === 'pengumuman') {
      PengumumanManager.render();
    } else if (tabId === 'suarawarga') {
      SuaraWargaManager.render();
    } else if (tabId === 'settings') {
      this.populateSettingsForm();
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  },

  setupSettingsForm() {
    const form = document.getElementById('form-settings');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const namaRt = document.getElementById('setting-nama-rt').value;
        const kelurahan = document.getElementById('setting-kelurahan').value;
        const kecamatan = document.getElementById('setting-kecamatan').value;
        const kota = document.getElementById('setting-kota').value;
        const namaKetuaRt = document.getElementById('setting-ketua-rt').value;
        const namaBendahara = document.getElementById('setting-bendahara').value;
        const nominalIuran = Number(document.getElementById('setting-nominal-iuran').value);
        const rincianIuran = document.getElementById('setting-rincian-iuran').value;
        const tahunAktif = Number(document.getElementById('setting-tahun-aktif').value);

        Store.saveSettings({
          namaRt,
          kelurahan,
          kecamatan,
          kota,
          namaKetuaRt,
          namaBendahara,
          nominalIuran,
          rincianIuran,
          tahunAktif
        });

        showToast("Pengaturan RT berhasil disimpan!", "success");
      });
    }
  },

  populateSettingsForm() {
    const s = Store.settings;
    if (document.getElementById('setting-nama-rt')) document.getElementById('setting-nama-rt').value = s.namaRt || '';
    if (document.getElementById('setting-kelurahan')) document.getElementById('setting-kelurahan').value = s.kelurahan || '';
    if (document.getElementById('setting-kecamatan')) document.getElementById('setting-kecamatan').value = s.kecamatan || '';
    if (document.getElementById('setting-kota')) document.getElementById('setting-kota').value = s.kota || '';
    if (document.getElementById('setting-ketua-rt')) document.getElementById('setting-ketua-rt').value = s.namaKetuaRt || '';
    if (document.getElementById('setting-bendahara')) document.getElementById('setting-bendahara').value = s.namaBendahara || '';
    if (document.getElementById('setting-nominal-iuran')) document.getElementById('setting-nominal-iuran').value = s.nominalIuran || 150000;
    if (document.getElementById('setting-rincian-iuran')) document.getElementById('setting-rincian-iuran').value = s.rincianIuran || '';
    if (document.getElementById('setting-tahun-aktif')) document.getElementById('setting-tahun-aktif').value = s.tahunAktif || new Date().getFullYear();
  },

  setupBackupRestore() {
    // --- SQL DATABASE HANDLERS ---
    // 1. Download kas_rt.sql
    const btnDownloadSql = document.getElementById('btn-download-sql');
    if (btnDownloadSql) {
      btnDownloadSql.addEventListener('click', () => {
        Store.exportBackupSQL();
      });
    }

    // 2. View SQL Script Modal
    const btnViewSql = document.getElementById('btn-view-sql');
    const modalViewSql = document.getElementById('modal-view-sql');
    const sqlPreviewContent = document.getElementById('sql-preview-content');
    if (btnViewSql && modalViewSql && sqlPreviewContent) {
      btnViewSql.addEventListener('click', () => {
        sqlPreviewContent.textContent = Store.generateSQLScript();
        modalViewSql.classList.remove('hidden');
        modalViewSql.classList.add('flex');
        if (window.lucide) lucide.createIcons();
      });
    }

    // 3. Download SQL Change Log
    const btnDownloadSqlLog = document.getElementById('btn-download-sql-log');
    if (btnDownloadSqlLog) {
      btnDownloadSqlLog.addEventListener('click', () => {
        Store.exportLogSQL();
      });
    }

    // 4. Restore from .sql file
    const fileRestoreSql = document.getElementById('file-restore-sql');
    if (fileRestoreSql) {
      fileRestoreSql.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
          const content = event.target.result;
          const res = await Store.importBackupSQL(content);
          if (res.success) {
            showToast(res.message, "success");
            this.switchTab('dashboard');
          } else {
            showToast(res.message, "error");
          }
          fileRestoreSql.value = '';
        };
        reader.readAsText(file);
      });
    }

    // --- JSON BACKUP HANDLERS ---
    // Download Backup JSON
    const btnDownloadBackup = document.getElementById('btn-download-backup');
    if (btnDownloadBackup) {
      btnDownloadBackup.addEventListener('click', () => {
        const jsonStr = Store.exportBackupJSON();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const filename = `Backup_Kas_RT_${new Date().toISOString().split('T')[0]}.json`;
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Berkas cadangan data JSON berhasil diunduh!", "success");
      });
    }

    // Restore Backup JSON
    const fileInput = document.getElementById('file-restore-backup');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          const res = Store.importBackupJSON(content);
          if (res.success) {
            showToast(res.message, "success");
            this.switchTab('dashboard');
          } else {
            showToast(res.message, "error");
          }
          fileInput.value = '';
        };
        reader.readAsText(file);
      });
    }

    // Reset Sample Data
    const btnResetData = document.getElementById('btn-reset-sample-data');
    if (btnResetData) {
      btnResetData.addEventListener('click', () => {
        if (confirm("PERINGATAN: Semua data saat ini akan dihapus dan dikembalikan ke data contoh awal. Lanjutkan?")) {
          Store.resetToDefault();
          showToast("Data telah direset ke contoh awal!", "info");
          this.switchTab('dashboard');
        }
      });
    }
  }
};

// Initialize App on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

if (typeof window !== 'undefined') {
  window.App = App;
  window.showToast = showToast;
  window.MENU_THEMES = MENU_THEMES;
}

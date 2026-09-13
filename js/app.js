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
    });

    // Initialize sub-modules
    IuranManager.init();
    PengeluaranManager.init();
    WargaManager.init();
    LaporanManager.init();

    this.setupNavTabs();
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
    const s = Store.settings;
    const elRtName = document.querySelectorAll('.label-rt-name');
    const elRtSub = document.querySelectorAll('.label-rt-sub');

    elRtName.forEach(el => el.textContent = s.namaRt || "RT 05 / RW 08");
    elRtSub.forEach(el => el.textContent = `${s.kelurahan}, ${s.kecamatan}`);
  },

  setupNavTabs() {
    const navItems = document.querySelectorAll('[data-tab-target]');
    navItems.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = btn.getAttribute('data-tab-target');
        this.switchTab(target);

        // Close mobile sidebar if open
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
          sidebar.classList.add('-translate-x-full');
        }
      });
    });

    // Mobile menu toggle
    const btnToggle = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    if (btnToggle && sidebar) {
      btnToggle.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
      });
    }
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update Nav Buttons State
    const navItems = document.querySelectorAll('[data-tab-target]');
    navItems.forEach(btn => {
      const target = btn.getAttribute('data-tab-target');
      if (target === tabId) {
        btn.classList.add('bg-emerald-600', 'text-white', 'shadow-md');
        btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
      } else {
        btn.classList.remove('bg-emerald-600', 'text-white', 'shadow-md');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
      }
    });

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
    if (document.getElementById('setting-nominal-iuran')) document.getElementById('setting-nominal-iuran').value = s.nominalIuran || 50000;
    if (document.getElementById('setting-rincian-iuran')) document.getElementById('setting-rincian-iuran').value = s.rincianIuran || '';
    if (document.getElementById('setting-tahun-aktif')) document.getElementById('setting-tahun-aktif').value = s.tahunAktif || new Date().getFullYear();
  },

  setupBackupRestore() {
    // Download Backup
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
        showToast("Berkas cadangan data berhasil diunduh!", "success");
      });
    }

    // Restore Backup File Input
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

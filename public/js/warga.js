/**
 * Data Warga (Master Data) Component
 */

const WargaManager = {
  searchQuery: "",
  selectedBlok: "all",
  editingWargaId: null,

  init() {
    this.setupEventListeners();
  },

  setupEventListeners() {
    const searchInput = document.getElementById('search-warga-list');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderTable();
      });
    }

    const filterBlokSelect = document.getElementById('filter-warga-blok');
    if (filterBlokSelect) {
      filterBlokSelect.addEventListener('change', (e) => {
        this.setBlokFilter(e.target.value);
      });
    }

    const modalBlokSelect = document.getElementById('warga-select-blok');
    if (modalBlokSelect) {
      modalBlokSelect.addEventListener('change', (e) => {
        const customContainer = document.getElementById('warga-custom-blok-container');
        if (customContainer) {
          if (e.target.value === 'lainnya') {
            customContainer.classList.remove('hidden');
            const customInput = document.getElementById('warga-custom-blok');
            if (customInput) customInput.focus();
          } else {
            customContainer.classList.add('hidden');
          }
        }
      });
    }
  },

  setBlokFilter(blok) {
    this.selectedBlok = blok || 'all';

    // Update select dropdown
    const filterSelect = document.getElementById('filter-warga-blok');
    if (filterSelect && filterSelect.value !== this.selectedBlok) {
      filterSelect.value = this.selectedBlok;
    }

    // Update pill buttons
    const pillButtons = document.querySelectorAll('.filter-warga-blok-btn');
    pillButtons.forEach(btn => {
      const btnBlok = btn.getAttribute('data-blok');
      if (btnBlok === this.selectedBlok) {
        btn.className = 'filter-warga-blok-btn px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-xs transition whitespace-nowrap';
      } else {
        btn.className = 'filter-warga-blok-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition whitespace-nowrap';
      }
    });

    this.renderTable();
  },

  renderTable() {
    const tableBody = document.getElementById('warga-table-body');
    const elTotalKK = document.getElementById('warga-total-count');
    const elTetapCount = document.getElementById('warga-tetap-count');
    const elKontrakCount = document.getElementById('warga-kontrak-count');

    if (!tableBody) return;

    // Filter by Blok first
    let wargaInScope = Store.warga;
    if (this.selectedBlok && this.selectedBlok !== 'all') {
      const blokRegex = new RegExp(`\\b${this.selectedBlok.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
      wargaInScope = Store.warga.filter(w => blokRegex.test(w.blok || ''));
    }

    // Update stats based on selected scope
    const totalKK = wargaInScope.length;
    const tetapCount = wargaInScope.filter(w => w.status === 'Tetap').length;
    const kontrakCount = wargaInScope.filter(w => w.status === 'Kontrak').length;

    if (elTotalKK) elTotalKK.textContent = `${totalKK} KK`;
    if (elTetapCount) elTetapCount.textContent = `${tetapCount} KK`;
    if (elKontrakCount) elKontrakCount.textContent = `${kontrakCount} KK`;

    // Filter by search query
    let filtered = wargaInScope.filter(w =>
      (w.nama || '').toLowerCase().includes(this.searchQuery) ||
      (w.blok || '').toLowerCase().includes(this.searchQuery) ||
      (w.telp && w.telp.includes(this.searchQuery))
    );

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="py-12 text-center text-slate-400">
            <div class="flex flex-col items-center justify-center gap-2">
              <i data-lucide="info" class="w-6 h-6 text-slate-300"></i>
              <p>Tidak ada data warga yang sesuai${this.selectedBlok !== 'all' ? ` di ${this.selectedBlok}` : ''}.</p>
            </div>
          </td>
        </tr>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    tableBody.innerHTML = filtered.map((w, idx) => {
      const statusBadge = w.status === 'Tetap'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-amber-50 text-amber-700 border-amber-200';

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
          <td class="py-3 px-4 text-center text-xs text-slate-400 font-medium">${idx + 1}</td>
          <td class="py-3 px-4 whitespace-nowrap">
            <span class="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-bold text-xs">
              ${w.blok}
            </span>
          </td>
          <td class="py-3 px-4">
            <div class="font-bold text-sm text-slate-800">${w.nama}</div>
          </td>
          <td class="py-3 px-4 text-xs font-mono text-slate-600">
            ${w.telp && w.telp !== '-' ? `
              <a href="https://wa.me/${w.telp.replace(/^0/, '62')}" target="_blank" class="text-emerald-600 hover:underline inline-flex items-center gap-1 font-semibold">
                <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                ${w.telp}
              </a>
            ` : '-'}
          </td>
          <td class="py-3 px-4">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge}">
              ${w.status}
            </span>
          </td>
          <td class="py-3 px-4 text-sm font-semibold text-slate-700 text-right">
            ${formatRupiah(w.nominalIuran || Store.settings.nominalIuran || 150000)}
          </td>
          <td class="py-3 px-4 text-center whitespace-nowrap">
            <div class="flex items-center justify-center gap-1">
              <button 
                onclick="WargaManager.openEditModal('${w.id}')" 
                title="Edit Data Warga"
                class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button 
                onclick="WargaManager.deleteWarga('${w.id}')" 
                title="Hapus Data Warga"
                class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) {
      lucide.createIcons();
    }
  },

  openAddModal() {
    const modal = document.getElementById('modal-warga');
    if (!modal) return;

    this.editingWargaId = null;
    document.getElementById('modal-warga-title').textContent = "Tambah Data Warga";
    document.getElementById('form-warga').reset();

    // Default blok: if currently filtered by a specific blok, use it; else Blok J1
    const selectBlok = document.getElementById('warga-select-blok');
    if (selectBlok) {
      if (this.selectedBlok && this.selectedBlok.startsWith('Blok J')) {
        selectBlok.value = this.selectedBlok;
      } else {
        selectBlok.value = 'Blok J1';
      }
    }
    const customContainer = document.getElementById('warga-custom-blok-container');
    if (customContainer) customContainer.classList.add('hidden');

    document.getElementById('warga-no-rumah').value = '';
    document.getElementById('warga-nominal').value = Store.settings.nominalIuran || 150000;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  openEditModal(id) {
    const warga = Store.getWargaById(id);
    if (!warga) return;

    this.editingWargaId = id;
    const modal = document.getElementById('modal-warga');
    if (!modal) return;

    document.getElementById('modal-warga-title').textContent = "Edit Data Warga";
    
    // Parse blok and no rumah
    const rawBlok = (warga.blok || '').trim();
    const selectBlok = document.getElementById('warga-select-blok');
    const inputNoRumah = document.getElementById('warga-no-rumah');
    const customContainer = document.getElementById('warga-custom-blok-container');
    const customInput = document.getElementById('warga-custom-blok');

    // Check if matches "Blok J1" ... "Blok J10"
    const match = rawBlok.match(/^(Blok\s+J\d{1,2})\b\s*(.*)$/i);
    if (match) {
      const blokName = 'Blok J' + match[1].replace(/[^0-9]/g, '');
      if (selectBlok) selectBlok.value = blokName;
      if (inputNoRumah) inputNoRumah.value = match[2].trim();
      if (customContainer) customContainer.classList.add('hidden');
    } else {
      // Check if it contains "J1" through "J10"
      let found = false;
      for (let i = 1; i <= 10; i++) {
        const b = `Blok J${i}`;
        if (rawBlok.toLowerCase().includes(`j${i}`)) {
          if (selectBlok) selectBlok.value = b;
          if (inputNoRumah) inputNoRumah.value = rawBlok.replace(new RegExp(`Blok\\s*J${i}`, 'i'), '').trim();
          if (customContainer) customContainer.classList.add('hidden');
          found = true;
          break;
        }
      }
      if (!found) {
        if (selectBlok) selectBlok.value = 'lainnya';
        if (customContainer) customContainer.classList.remove('hidden');
        if (customInput) customInput.value = rawBlok;
        if (inputNoRumah) inputNoRumah.value = '';
      }
    }

    document.getElementById('warga-nama').value = warga.nama;
    document.getElementById('warga-telp').value = warga.telp || '';
    document.getElementById('warga-status').value = warga.status;
    document.getElementById('warga-nominal').value = warga.nominalIuran || Store.settings.nominalIuran || 150000;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  submitForm(e) {
    e.preventDefault();

    let blokPrefix = document.getElementById('warga-select-blok')?.value || 'Blok J1';
    if (blokPrefix === 'lainnya') {
      blokPrefix = document.getElementById('warga-custom-blok')?.value.trim() || '';
    }
    const noRumah = document.getElementById('warga-no-rumah')?.value.trim() || '';
    
    let blok = '';
    if (noRumah) {
      if (/^\d+$/.test(noRumah)) {
        blok = `${blokPrefix} No. ${noRumah.padStart(2, '0')}`;
      } else {
        blok = `${blokPrefix} ${noRumah}`.trim();
      }
    } else {
      blok = blokPrefix;
    }

    const nama = document.getElementById('warga-nama').value.trim();
    const telp = document.getElementById('warga-telp').value.trim();
    const status = document.getElementById('warga-status').value;
    const nominalIuran = Number(document.getElementById('warga-nominal').value);

    if (!blok || !nama) {
      showToast("Blok/No Rumah dan Nama Warga wajib diisi.", "warning");
      return;
    }

    if (this.editingWargaId) {
      Store.updateWarga(this.editingWargaId, { blok, nama, telp, status, nominalIuran });
      showToast("Data warga berhasil diperbarui!", "success");
    } else {
      Store.addWarga({ blok, nama, telp, status, nominalIuran });
      showToast("Warga baru berhasil ditambahkan!", "success");
    }

    this.closeModal();
    this.renderTable();
  },

  deleteWarga(id) {
    const warga = Store.getWargaById(id);
    if (!warga) return;

    if (confirm(`Apakah Anda yakin ingin menghapus data warga ${warga.nama} (${warga.blok})?`)) {
      Store.deleteWarga(id);
      showToast("Data warga berhasil dihapus.", "info");
      this.renderTable();
    }
  },

  closeModal() {
    const modal = document.getElementById('modal-warga');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }
};

if (typeof window !== 'undefined') {
  window.WargaManager = WargaManager;
}

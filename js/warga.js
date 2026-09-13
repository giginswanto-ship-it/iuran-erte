/**
 * Data Warga (Master Data) Component
 */

const WargaManager = {
  searchQuery: "",
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
  },

  renderTable() {
    const tableBody = document.getElementById('warga-table-body');
    const elTotalKK = document.getElementById('warga-total-count');
    const elTetapCount = document.getElementById('warga-tetap-count');
    const elKontrakCount = document.getElementById('warga-kontrak-count');

    if (!tableBody) return;

    let filtered = Store.warga.filter(w =>
      w.nama.toLowerCase().includes(this.searchQuery) ||
      w.blok.toLowerCase().includes(this.searchQuery) ||
      (w.telp && w.telp.includes(this.searchQuery))
    );

    // Update stats
    const totalKK = Store.warga.length;
    const tetapCount = Store.warga.filter(w => w.status === 'Tetap').length;
    const kontrakCount = Store.warga.filter(w => w.status === 'Kontrak').length;

    if (elTotalKK) elTotalKK.textContent = `${totalKK} KK`;
    if (elTetapCount) elTetapCount.textContent = `${tetapCount} KK`;
    if (elKontrakCount) elKontrakCount.textContent = `${kontrakCount} KK`;

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="py-12 text-center text-slate-400">
            Tidak ada data warga yang sesuai.
          </td>
        </tr>
      `;
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
              <a href="https://wa.me/${w.telp.replace(/^0/, '62')}" target="_blank" class="text-emerald-600 hover:underline inline-flex items-center gap-1">
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
            ${formatRupiah(w.nominalIuran || Store.settings.nominalIuran || 50000)}
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
    document.getElementById('warga-nominal').value = Store.settings.nominalIuran || 50000;

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
    document.getElementById('warga-blok').value = warga.blok;
    document.getElementById('warga-nama').value = warga.nama;
    document.getElementById('warga-telp').value = warga.telp || '';
    document.getElementById('warga-status').value = warga.status;
    document.getElementById('warga-nominal').value = warga.nominalIuran || Store.settings.nominalIuran || 50000;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  submitForm(e) {
    e.preventDefault();
    const blok = document.getElementById('warga-blok').value;
    const nama = document.getElementById('warga-nama').value;
    const telp = document.getElementById('warga-telp').value;
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

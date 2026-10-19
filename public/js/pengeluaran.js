/**
 * Pengeluaran & Pemasukan Lain Component
 */

const PengeluaranManager = {
  activeTab: 'pengeluaran', // 'pengeluaran' or 'pemasukan'
  searchQuery: '',
  selectedCategory: 'all',
  editingTxId: null,

  init() {
    this.populateCategoryOptions();
    this.setupEventListeners();
  },

  populateCategoryOptions() {
    // Populate select dropdowns for modals and filters
    const filterPengeluaran = document.getElementById('filter-category-pengeluaran');
    const selectAddExpenseCat = document.getElementById('add-expense-category');
    const selectAddIncomeCat = document.getElementById('add-income-category');

    if (filterPengeluaran) {
      filterPengeluaran.innerHTML = '<option value="all">Semua Kategori</option>' +
        CATEGORIES_PENGELUARAN.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    if (selectAddExpenseCat) {
      selectAddExpenseCat.innerHTML = CATEGORIES_PENGELUARAN.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    if (selectAddIncomeCat) {
      selectAddIncomeCat.innerHTML = CATEGORIES_PEMASUKAN_LAIN.map(c => `<option value="${c}">${c}</option>`).join('');
    }
  },

  setupEventListeners() {
    // Filter Category
    const filterPengeluaran = document.getElementById('filter-category-pengeluaran');
    if (filterPengeluaran) {
      filterPengeluaran.addEventListener('change', (e) => {
        this.selectedCategory = e.target.value;
        this.renderTable();
      });
    }

    // Search input
    const searchInput = document.getElementById('search-transaksi');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderTable();
      });
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    const btnExpense = document.getElementById('tab-btn-pengeluaran');
    const btnIncome = document.getElementById('tab-btn-pemasukan-lain');

    if (tab === 'pengeluaran') {
      if (btnExpense) {
        btnExpense.className = 'px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold shadow-md shadow-rose-600/20 transition flex items-center gap-1.5';
      }
      if (btnIncome) {
        btnIncome.className = 'px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold transition flex items-center gap-1.5';
      }
    } else {
      if (btnIncome) {
        btnIncome.className = 'px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5';
      }
      if (btnExpense) {
        btnExpense.className = 'px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold transition flex items-center gap-1.5';
      }
    }

    if (window.lucide) lucide.createIcons();
    this.renderTable();
  },

  renderTable() {
    const tableBody = document.getElementById('transaksi-table-body');
    const tableTitle = document.getElementById('transaksi-tab-title');
    if (!tableBody) return;

    if (tableTitle) {
      tableTitle.textContent = this.activeTab === 'pengeluaran' ? 'Daftar Pengeluaran Kas RT' : 'Daftar Pemasukan Non-Iuran';
    }

    // Filter transactions
    const targetType = this.activeTab === 'pengeluaran' ? 'pengeluaran' : 'pemasukan';
    let list = Store.transaksi.filter(t => t.jenis === targetType);

    if (this.selectedCategory !== 'all') {
      list = list.filter(t => t.kategori === this.selectedCategory);
    }

    if (this.searchQuery) {
      list = list.filter(t => 
        t.uraian.toLowerCase().includes(this.searchQuery) ||
        (t.kategori && t.kategori.toLowerCase().includes(this.searchQuery))
      );
    }

    // Sort descending by date
    list.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    if (list.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="py-12 text-center text-slate-400">
            Tidak ada transaksi ${this.activeTab === 'pengeluaran' ? 'pengeluaran' : 'pemasukan'} yang ditemukan.
          </td>
        </tr>
      `;
      return;
    }

    let totalNominal = 0;

    tableBody.innerHTML = list.map((t, idx) => {
      totalNominal += t.nominal;
      const isExpense = t.jenis === 'pengeluaran';
      const amountColor = isExpense ? 'text-rose-600' : 'text-emerald-600';
      const badgeBg = isExpense ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-blue-50 text-blue-700 border-blue-200';

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
          <td class="py-3 px-4 text-center text-xs text-slate-400 font-medium">${idx + 1}</td>
          <td class="py-3 px-4 text-xs font-semibold text-slate-600 whitespace-nowrap">${formatDateIndo(t.tanggal)}</td>
          <td class="py-3 px-4">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeBg}">
              ${t.kategori || 'Umum'}
            </span>
          </td>
          <td class="py-3 px-4 text-sm font-medium text-slate-800">${t.uraian}</td>
          <td class="py-3 px-4 text-sm font-bold text-right whitespace-nowrap ${amountColor}">
            ${isExpense ? '- ' : '+ '}${formatRupiah(t.nominal)}
          </td>
          <td class="py-3 px-4 text-center whitespace-nowrap">
            <div class="flex items-center justify-center gap-1">
              <button 
                onclick="PengeluaranManager.openEditModal('${t.id}')" 
                title="Edit Transaksi"
                class="p-1 text-slate-400 hover:text-indigo-600 rounded transition">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button 
                onclick="PengeluaranManager.deleteItem('${t.id}')" 
                title="Hapus Transaksi"
                class="p-1 text-slate-400 hover:text-rose-600 rounded transition">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Summary footer
    const footerTotal = document.getElementById('transaksi-total-footer');
    if (footerTotal) {
      footerTotal.textContent = `Total: ${formatRupiah(totalNominal)}`;
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  },

  // Open Add Expense Modal
  openAddExpenseModal() {
    const modal = document.getElementById('modal-add-expense');
    if (!modal) return;

    document.getElementById('form-add-expense').reset();
    document.getElementById('add-expense-tanggal').value = new Date().toISOString().split('T')[0];

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  submitAddExpense(e) {
    e.preventDefault();
    const tanggal = document.getElementById('add-expense-tanggal').value;
    const kategori = document.getElementById('add-expense-category').value;
    const uraian = document.getElementById('add-expense-uraian').value;
    const nominal = Number(document.getElementById('add-expense-nominal').value);

    if (!uraian || nominal <= 0) {
      showToast("Mohon isi rincian dan nominal dengan benar.", "warning");
      return;
    }

    Store.addTransaksi({
      tanggal,
      jenis: 'pengeluaran',
      kategori,
      uraian,
      nominal
    });

    this.closeModal('modal-add-expense');
    showToast("Pengeluaran berhasil dicatat!", "success");
    this.switchTab('pengeluaran');
  },

  // Open Add Income Modal
  openAddIncomeModal() {
    const modal = document.getElementById('modal-add-income');
    if (!modal) return;

    document.getElementById('form-add-income').reset();
    document.getElementById('add-income-tanggal').value = new Date().toISOString().split('T')[0];

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  submitAddIncome(e) {
    e.preventDefault();
    const tanggal = document.getElementById('add-income-tanggal').value;
    const kategori = document.getElementById('add-income-category').value;
    const uraian = document.getElementById('add-income-uraian').value;
    const nominal = Number(document.getElementById('add-income-nominal').value);

    if (!uraian || nominal <= 0) {
      showToast("Mohon isi uraian dan nominal dengan benar.", "warning");
      return;
    }

    Store.addTransaksi({
      tanggal,
      jenis: 'pemasukan',
      kategori,
      uraian,
      nominal
    });

    this.closeModal('modal-add-income');
    showToast("Pemasukan non-iuran berhasil dicatat!", "success");
    this.switchTab('pemasukan');
  },

  // Open Edit Modal
  openEditModal(id) {
    const tx = Store.transaksi.find(t => t.id === id);
    if (!tx) return;

    this.editingTxId = id;
    const modal = document.getElementById('modal-edit-transaksi');
    if (!modal) return;

    document.getElementById('edit-tx-id').value = tx.id;
    document.getElementById('edit-tx-tanggal').value = tx.tanggal;
    document.getElementById('edit-tx-uraian').value = tx.uraian;
    document.getElementById('edit-tx-nominal').value = tx.nominal;

    // Populate category dropdown based on type
    const catSelect = document.getElementById('edit-tx-kategori');
    const categories = tx.jenis === 'pengeluaran' ? CATEGORIES_PENGELUARAN : CATEGORIES_PEMASUKAN_LAIN;
    catSelect.innerHTML = categories.map(c => `<option value="${c}" ${c === tx.kategori ? 'selected' : ''}>${c}</option>`).join('');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  submitEdit(e) {
    e.preventDefault();
    if (!this.editingTxId) return;

    const tanggal = document.getElementById('edit-tx-tanggal').value;
    const kategori = document.getElementById('edit-tx-kategori').value;
    const uraian = document.getElementById('edit-tx-uraian').value;
    const nominal = Number(document.getElementById('edit-tx-nominal').value);

    Store.updateTransaksi(this.editingTxId, {
      tanggal,
      kategori,
      uraian,
      nominal
    });

    this.closeModal('modal-edit-transaksi');
    showToast("Transaksi berhasil diperbarui!", "success");
    this.renderTable();
  },

  deleteItem(id) {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      Store.deleteTransaksi(id);
      showToast("Transaksi berhasil dihapus.", "info");
      this.renderTable();
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }
};

if (typeof window !== 'undefined') {
  window.PengeluaranManager = PengeluaranManager;
}

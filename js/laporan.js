/**
 * Laporan Keuangan & Buku Kas Component
 */

const LaporanManager = {
  activeSubTab: 'bukukas', // 'bukukas' or 'tunggakan'
  filterMonth: 'all',
  filterYear: new Date().getFullYear(),

  init() {
    this.filterYear = Store.settings.tahunAktif || new Date().getFullYear();
    this.setupEventListeners();
  },

  setupEventListeners() {
    const monthSelect = document.getElementById('laporan-filter-month');
    const yearSelect = document.getElementById('laporan-filter-year');

    if (monthSelect) {
      monthSelect.addEventListener('change', (e) => {
        this.filterMonth = e.target.value;
        this.render();
      });
    }

    if (yearSelect) {
      yearSelect.value = this.filterYear;
      yearSelect.addEventListener('change', (e) => {
        this.filterYear = Number(e.target.value);
        this.render();
      });
    }
  },

  switchSubTab(tab) {
    this.activeSubTab = tab;
    const btnBukuKas = document.getElementById('subtab-btn-bukukas');
    const btnTunggakan = document.getElementById('subtab-btn-tunggakan');
    const viewBukuKas = document.getElementById('laporan-bukukas-view');
    const viewTunggakan = document.getElementById('laporan-tunggakan-view');

    if (tab === 'bukukas') {
      btnBukuKas.classList.add('bg-white', 'text-slate-800', 'shadow-sm');
      btnBukuKas.classList.remove('text-slate-500');
      btnTunggakan.classList.remove('bg-white', 'text-slate-800', 'shadow-sm');
      btnTunggakan.classList.add('text-slate-500');

      if (viewBukuKas) viewBukuKas.classList.remove('hidden');
      if (viewTunggakan) viewTunggakan.classList.add('hidden');
    } else {
      btnTunggakan.classList.add('bg-white', 'text-slate-800', 'shadow-sm');
      btnTunggakan.classList.remove('text-slate-500');
      btnBukuKas.classList.remove('bg-white', 'text-slate-800', 'shadow-sm');
      btnBukuKas.classList.add('text-slate-500');

      if (viewTunggakan) viewTunggakan.classList.remove('hidden');
      if (viewBukuKas) viewBukuKas.classList.add('hidden');
    }

    this.render();
  },

  render() {
    if (this.activeSubTab === 'bukukas') {
      this.renderBukuKas();
    } else {
      this.renderTunggakan();
    }
  },

  renderBukuKas() {
    const tableBody = document.getElementById('bukukas-table-body');
    if (!tableBody) return;

    const m = this.filterMonth === 'all' ? null : Number(this.filterMonth);
    const y = Number(this.filterYear);

    const ledger = Store.getBukuKas(m, y);

    let totalMasuk = 0;
    let totalKeluar = 0;

    if (ledger.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="py-12 text-center text-slate-400">
            Tidak ada transaksi pada periode yang dipilih.
          </td>
        </tr>
      `;
      this.updateBukuKasSummary(0, 0, 0);
      return;
    }

    tableBody.innerHTML = ledger.map((t, idx) => {
      totalMasuk += t.masuk;
      totalKeluar += t.keluar;

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
          <td class="py-3 px-3 text-center text-slate-400 font-medium">${idx + 1}</td>
          <td class="py-3 px-3 font-semibold text-slate-600 whitespace-nowrap">${formatDateShort(t.tanggal)}</td>
          <td class="py-3 px-3">
            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-medium ${t.jenis === 'pengeluaran' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}">
              ${t.kategori || t.jenis}
            </span>
          </td>
          <td class="py-3 px-3 text-slate-800 font-medium">${t.uraian}</td>
          <td class="py-3 px-3 text-right font-semibold text-emerald-600 whitespace-nowrap">
            ${t.masuk > 0 ? formatRupiah(t.masuk) : '-'}
          </td>
          <td class="py-3 px-3 text-right font-semibold text-rose-600 whitespace-nowrap">
            ${t.keluar > 0 ? formatRupiah(t.keluar) : '-'}
          </td>
          <td class="py-3 px-3 text-right font-bold text-slate-800 whitespace-nowrap bg-slate-50/60">
            ${formatRupiah(t.saldo)}
          </td>
        </tr>
      `;
    }).join('');

    const saldoAkhir = ledger.length > 0 ? ledger[ledger.length - 1].saldo : 0;
    this.updateBukuKasSummary(totalMasuk, totalKeluar, saldoAkhir);
  },

  updateBukuKasSummary(masuk, keluar, saldo) {
    const elMasuk = document.getElementById('bukukas-summary-masuk');
    const elKeluar = document.getElementById('bukukas-summary-keluar');
    const elSaldo = document.getElementById('bukukas-summary-saldo');

    if (elMasuk) elMasuk.textContent = formatRupiah(masuk);
    if (elKeluar) elKeluar.textContent = formatRupiah(keluar);
    if (elSaldo) elSaldo.textContent = formatRupiah(saldo);
  },

  renderTunggakan() {
    const tableBody = document.getElementById('tunggakan-table-body');
    if (!tableBody) return;

    const currentActualMonth = new Date().getMonth() + 1;
    const m = this.filterMonth === 'all' ? currentActualMonth : Number(this.filterMonth);
    const y = Number(this.filterYear);

    const tunggakanList = Store.getTunggakanWarga(m, y);

    let grandTotalTunggakan = 0;

    if (tunggakanList.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="py-12 text-center text-emerald-600 font-semibold">
            🎉 Luar biasa! Semua warga telah melunasi iuran sampai periode ini.
          </td>
        </tr>
      `;
      const elGrand = document.getElementById('tunggakan-grand-total');
      if (elGrand) elGrand.textContent = formatRupiah(0);
      return;
    }

    tableBody.innerHTML = tunggakanList.map((item, idx) => {
      grandTotalTunggakan += item.totalTunggakan;
      const w = item.warga;

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
          <td class="py-3 px-4 text-center text-xs text-slate-400">${idx + 1}</td>
          <td class="py-3 px-4 whitespace-nowrap">
            <span class="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-xs">
              ${w.blok}
            </span>
          </td>
          <td class="py-3 px-4 font-bold text-sm text-slate-800">${w.nama}</td>
          <td class="py-3 px-4 text-xs text-slate-600">
            ${item.bulanMenunggak.join(', ')}
            <span class="font-bold text-rose-600">(${item.jumlahBulan} Bulan)</span>
          </td>
          <td class="py-3 px-4 text-sm font-bold text-rose-600 text-right whitespace-nowrap">
            ${formatRupiah(item.totalTunggakan)}
          </td>
          <td class="py-3 px-4 text-center whitespace-nowrap">
            <button 
              onclick="IuranManager.openBatchPayModal('${w.id}', ${y})"
              class="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md font-semibold transition">
              Pelunasan
            </button>
          </td>
        </tr>
      `;
    }).join('');

    const elGrand = document.getElementById('tunggakan-grand-total');
    if (elGrand) elGrand.textContent = formatRupiah(grandTotalTunggakan);
  },

  // Export to Excel using SheetJS
  exportToExcel() {
    if (typeof XLSX === 'undefined') {
      showToast("Library SheetJS sedang dimuat, coba lagi.", "warning");
      return;
    }

    const m = this.filterMonth === 'all' ? null : Number(this.filterMonth);
    const y = Number(this.filterYear);
    const s = Store.settings;

    const ledger = Store.getBukuKas(m, y);
    const periodLabel = m ? `${MONTH_NAMES[m-1]} ${y}` : `Tahun ${y}`;

    // Prepare Sheet Data
    const sheetData = [
      [`LAPORAN KAS KEUANGAN ${s.namaRt}`],
      [`${s.kelurahan}, ${s.kecamatan}, ${s.kota}`],
      [`Periode: ${periodLabel}`],
      [],
      ["No", "Tanggal", "Kategori", "Uraian Transaksi", "Pemasukan (Rp)", "Pengeluaran (Rp)", "Saldo Kas (Rp)"]
    ];

    ledger.forEach((t, index) => {
      sheetData.push([
        index + 1,
        t.tanggal,
        t.kategori || t.jenis,
        t.uraian,
        t.masuk,
        t.keluar,
        t.saldo
      ]);
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // Auto width
    ws['!cols'] = [
      { wch: 5 },
      { wch: 12 },
      { wch: 20 },
      { wch: 40 },
      { wch: 16 },
      { wch: 16 },
      { wch: 18 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Buku Kas");

    // Also add Warga Iuran Matrix Sheet
    const matrixHeader = ["No", "Blok", "Nama Warga", "Status", ...MONTH_NAMES.map(mn => mn.slice(0, 3)), "Total Terbayar"];
    const matrixData = [
      [`MATRIKS IURAN WARGA TAHUN ${y}`],
      [`${s.namaRt}`],
      [],
      matrixHeader
    ];

    Store.warga.forEach((w, idx) => {
      let totalPaid = 0;
      const row = [idx + 1, w.blok, w.nama, w.status];
      for (let month = 1; month <= 12; month++) {
        const isPaid = Store.isIuranPaid(w.id, month, y);
        if (isPaid) {
          const tx = Store.getIuranTx(w.id, month, y);
          const amt = tx ? tx.nominal : (w.nominalIuran || 50000);
          totalPaid += amt;
          row.push("LUNAS");
        } else {
          row.push("BELUM");
        }
      }
      row.push(totalPaid);
      matrixData.push(row);
    });

    const wsMatrix = XLSX.utils.aoa_to_sheet(matrixData);
    XLSX.utils.book_append_sheet(wb, wsMatrix, "Matriks Iuran");

    const fileName = `Laporan_Kas_${s.namaRt.replace(/[^a-zA-Z0-9]/g, '_')}_${periodLabel.replace(/\s+/g, '_')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    showToast("Laporan Excel berhasil diunduh!", "success");
  },

  // Open Printable Report Modal
  openPrintModal() {
    const modal = document.getElementById('modal-print-report');
    if (!modal) return;

    const m = this.filterMonth === 'all' ? null : Number(this.filterMonth);
    const y = Number(this.filterYear);
    const s = Store.settings;

    const ledger = Store.getBukuKas(m, y);
    const periodLabel = m ? `Bulan ${MONTH_NAMES[m-1]} ${y}` : `Tahun ${y}`;

    let totalMasuk = 0;
    let totalKeluar = 0;

    const printContainer = document.getElementById('print-report-content');
    if (!printContainer) return;

    const rowsHtml = ledger.map((t, idx) => {
      totalMasuk += t.masuk;
      totalKeluar += t.keluar;

      return `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td style="text-align: center; white-space: nowrap;">${formatDateShort(t.tanggal)}</td>
          <td>${t.kategori || t.jenis}</td>
          <td>${t.uraian}</td>
          <td style="text-align: right;">${t.masuk > 0 ? formatRupiah(t.masuk) : '-'}</td>
          <td style="text-align: right;">${t.keluar > 0 ? formatRupiah(t.keluar) : '-'}</td>
          <td style="text-align: right; font-weight: bold;">${formatRupiah(t.saldo)}</td>
        </tr>
      `;
    }).join('');

    const saldoAkhir = ledger.length > 0 ? ledger[ledger.length - 1].saldo : 0;

    printContainer.innerHTML = `
      <div id="printable-area" class="p-4 bg-white text-slate-900">
        <!-- Kop Surat -->
        <div class="text-center border-b-2 border-black pb-4 mb-6">
          <h2 class="text-xl font-bold uppercase tracking-wider">RUKUN TETANGGA ${s.namaRt}</h2>
          <p class="text-sm font-medium">${s.kelurahan}, ${s.kecamatan}, ${s.kota}</p>
          <div class="mt-2 text-base font-bold underline">LAPORAN BUKU KAS KEUANGAN RT</div>
          <p class="text-xs text-slate-600">Periode: <strong>${periodLabel}</strong></p>
        </div>

        <!-- Tabel Laporan -->
        <table class="print-table w-full mb-6">
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 12%;">Tanggal</th>
              <th style="width: 18%;">Kategori</th>
              <th style="width: 35%;">Uraian</th>
              <th style="width: 10%;">Masuk</th>
              <th style="width: 10%;">Keluar</th>
              <th style="width: 10%;">Saldo</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="7" class="text-center py-4">Tidak ada transaksi pada periode ini.</td></tr>'}
          </tbody>
          <tfoot>
            <tr style="font-weight: bold; background-color: #f8fafc;">
              <td colspan="4" style="text-align: right;">TOTAL:</td>
              <td style="text-align: right; color: #047857;">${formatRupiah(totalMasuk)}</td>
              <td style="text-align: right; color: #b91c1c;">${formatRupiah(totalKeluar)}</td>
              <td style="text-align: right;">${formatRupiah(saldoAkhir)}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Summary Box -->
        <div class="grid grid-cols-3 gap-4 p-3 bg-slate-100 rounded-lg mb-8 border border-slate-300 text-xs">
          <div>Total Pemasukan: <strong class="text-emerald-700 block text-sm">${formatRupiah(totalMasuk)}</strong></div>
          <div>Total Pengeluaran: <strong class="text-rose-700 block text-sm">${formatRupiah(totalKeluar)}</strong></div>
          <div>Saldo Kas Akhir: <strong class="text-slate-900 block text-sm">${formatRupiah(saldoAkhir)}</strong></div>
        </div>

        <!-- Tanda Tangan -->
        <div class="flex justify-between items-end mt-12 px-8 text-center text-xs">
          <div>
            <p class="mb-1">Mengetahui,</p>
            <p class="font-medium text-slate-600 mb-16">Ketua ${s.namaRt}</p>
            <p class="font-bold underline text-sm">${s.namaKetuaRt}</p>
          </div>
          <div>
            <p class="mb-1">${s.kota.replace('Kota ', '').replace('Kabupaten ', '')}, ${formatDateIndo(new Date().toISOString().split('T')[0])}</p>
            <p class="font-medium text-slate-600 mb-16">Bendahara ${s.namaRt}</p>
            <p class="font-bold underline text-sm">${s.namaBendahara}</p>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  triggerPrint() {
    window.print();
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }
};

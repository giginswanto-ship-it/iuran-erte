/**
 * Iuran & Matriks Iuran Warga Component
 */

const IuranManager = {
  currentYear: new Date().getFullYear(),
  searchQuery: "",
  selectedWargaForPayment: null,

  init() {
    this.currentYear = Store.settings.tahunAktif || new Date().getFullYear();
    this.setupEventListeners();
  },

  setupEventListeners() {
    // Year selector
    const yearSelect = document.getElementById('iuran-matrix-year');
    if (yearSelect) {
      yearSelect.value = this.currentYear;
      yearSelect.addEventListener('change', (e) => {
        this.currentYear = Number(e.target.value);
        this.renderMatrix();
      });
    }

    // Search input
    const searchInput = document.getElementById('iuran-search-warga');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderMatrix();
      });
    }
  },

  renderMatrix() {
    const tableBody = document.getElementById('iuran-matrix-body');
    if (!tableBody) return;

    // Filter warga based on search query
    const filteredWarga = Store.warga.filter(w => 
      w.nama.toLowerCase().includes(this.searchQuery) ||
      w.blok.toLowerCase().includes(this.searchQuery)
    );

    if (filteredWarga.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="16" class="py-12 text-center text-slate-400">
            Tidak ada data warga yang cocok dengan pencarian.
          </td>
        </tr>
      `;
      return;
    }

    const currentActualMonth = new Date().getMonth() + 1;
    const currentActualYear = new Date().getFullYear();

    let totalIuranTerkumpulTahunIni = 0;
    let totalTargetTahunIni = 0;

    tableBody.innerHTML = filteredWarga.map((w, index) => {
      let paidCount = 0;
      let totalPaidAmount = 0;
      const nominal = w.nominalIuran || Store.settings.nominalIuran || 50000;

      const monthCells = Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
        const isPaid = Store.isIuranPaid(w.id, month, this.currentYear);
        const tx = isPaid ? Store.getIuranTx(w.id, month, this.currentYear) : null;

        if (isPaid) {
          paidCount++;
          totalPaidAmount += (tx ? tx.nominal : nominal);
          totalIuranTerkumpulTahunIni += (tx ? tx.nominal : nominal);

          return `
            <td class="p-1.5 text-center">
              <button 
                onclick="IuranManager.handleClickPaidCell('${w.id}', ${month}, ${this.currentYear})"
                title="Lunas (${MONTH_NAMES[month-1]} ${this.currentYear}) - Klik untuk lihat / cetak kwitansi"
                class="w-full py-1.5 px-1 rounded text-xs font-semibold matrix-cell-paid flex items-center justify-center gap-1 shadow-sm">
                <i data-lucide="check" class="w-3.5 h-3.5 stroke-[2.5]"></i>
                <span class="hidden sm:inline">Lunas</span>
              </button>
            </td>
          `;
        } else {
          // If this month is past or current
          const isPastOrCurrent = (this.currentYear < currentActualYear) || 
                                  (this.currentYear === currentActualYear && month <= currentActualMonth);

          const cellClass = isPastOrCurrent ? 'matrix-cell-unpaid' : 'bg-slate-50 text-slate-400 border border-slate-200';
          const labelText = isPastOrCurrent ? 'Belum' : '-';

          return `
            <td class="p-1.5 text-center">
              <button 
                onclick="IuranManager.openQuickPayModal('${w.id}', ${month}, ${this.currentYear})"
                title="Belum Bayar (${MONTH_NAMES[month-1]} ${this.currentYear}) - Klik untuk bayar"
                class="w-full py-1.5 px-1 rounded text-xs font-medium ${cellClass} flex items-center justify-center gap-1">
                <span>${labelText}</span>
              </button>
            </td>
          `;
        }
      }).join('');

      totalTargetTahunIni += (nominal * 12);
      const remainingUnpaidMonths = 12 - paidCount;

      return `
        <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
          <td class="py-3 px-3 text-center text-xs font-semibold text-slate-500">${index + 1}</td>
          <td class="py-3 px-3 whitespace-nowrap">
            <span class="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-xs">
              ${w.blok}
            </span>
          </td>
          <td class="py-3 px-3">
            <div class="font-semibold text-sm text-slate-800">${w.nama}</div>
            <div class="text-xs text-slate-400 flex items-center gap-1">
              <span>${w.status}</span>
              <span>•</span>
              <span>${formatRupiah(nominal)}/bln</span>
            </div>
          </td>
          ${monthCells}
          <td class="py-3 px-3 text-right font-bold text-xs text-emerald-700 whitespace-nowrap bg-emerald-50/40">
            ${formatRupiah(totalPaidAmount)}
            <div class="text-[10px] text-slate-400 font-normal">(${paidCount}/12 Bln)</div>
          </td>
          <td class="py-3 px-3 text-center whitespace-nowrap">
            <button 
              onclick="IuranManager.openBatchPayModal('${w.id}', ${this.currentYear})"
              class="px-2.5 py-1 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 rounded-md font-medium transition flex items-center gap-1">
              <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
              <span>Bayar</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Update footer summary
    const elSummaryTotal = document.getElementById('iuran-matrix-summary-total');
    if (elSummaryTotal) {
      elSummaryTotal.textContent = `${formatRupiah(totalIuranTerkumpulTahunIni)} dari target ${formatRupiah(totalTargetTahunIni)}`;
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  },

  // Open Quick Pay Modal for single month
  openQuickPayModal(wargaId, month, year) {
    const warga = Store.getWargaById(wargaId);
    if (!warga) return;

    this.selectedWargaForPayment = warga;
    const nominal = warga.nominalIuran || Store.settings.nominalIuran || 50000;

    const modal = document.getElementById('modal-quick-pay');
    if (!modal) return;

    document.getElementById('quick-pay-warga-id').value = warga.id;
    document.getElementById('quick-pay-month').value = month;
    document.getElementById('quick-pay-year').value = year;

    document.getElementById('quick-pay-warga-info').innerHTML = `
      <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
          ${warga.blok}
        </div>
        <div>
          <h4 class="font-bold text-slate-800 text-sm">${warga.nama}</h4>
          <p class="text-xs text-slate-500">Iuran Bulan: <strong>${MONTH_NAMES[month-1]} ${year}</strong></p>
        </div>
      </div>
    `;

    document.getElementById('quick-pay-nominal').value = nominal;
    document.getElementById('quick-pay-tanggal').value = new Date().toISOString().split('T')[0];
    document.getElementById('quick-pay-metode').value = "Transfer / QRIS";

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  submitQuickPay(e) {
    e.preventDefault();
    const wargaId = document.getElementById('quick-pay-warga-id').value;
    const month = Number(document.getElementById('quick-pay-month').value);
    const year = Number(document.getElementById('quick-pay-year').value);
    const nominal = Number(document.getElementById('quick-pay-nominal').value);
    const tanggal = document.getElementById('quick-pay-tanggal').value;
    const metode = document.getElementById('quick-pay-metode').value;

    const tx = Store.payIuranSingle(wargaId, month, year, nominal, tanggal, metode);

    this.closeModal('modal-quick-pay');
    showToast("Pembayaran iuran berhasil dicatat!", "success");

    // Re-render
    this.renderMatrix();

    // Offer to show receipt
    if (tx) {
      this.showReceiptModal(tx);
    }
  },

  // Click on an already paid cell
  handleClickPaidCell(wargaId, month, year) {
    const tx = Store.getIuranTx(wargaId, month, year);
    if (tx) {
      this.showReceiptModal(tx);
    }
  },

  // Open Multi-month / Batch Payment Modal
  openBatchPayModal(wargaId, year = this.currentYear) {
    const warga = Store.getWargaById(wargaId);
    if (!warga) return;

    this.selectedWargaForPayment = warga;
    const modal = document.getElementById('modal-batch-pay');
    if (!modal) return;

    document.getElementById('batch-pay-warga-id').value = warga.id;
    document.getElementById('batch-pay-year').value = year;

    document.getElementById('batch-pay-warga-info').innerHTML = `
      <div class="flex items-center gap-3 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
        <div class="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
          ${warga.blok}
        </div>
        <div>
          <h4 class="font-bold text-slate-800 text-sm">${warga.nama}</h4>
          <p class="text-xs text-slate-500">Tarif per Bulan: <strong>${formatRupiah(warga.nominalIuran)}</strong> (${warga.status})</p>
        </div>
      </div>
    `;

    // Render 12 months checkboxes
    const container = document.getElementById('batch-pay-months-container');
    container.innerHTML = Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
      const isPaid = Store.isIuranPaid(warga.id, month, year);
      const isChecked = !isPaid; // default check unpaid months
      const disabled = isPaid ? 'disabled' : '';
      const badgePaid = isPaid ? '<span class="text-[10px] text-emerald-600 font-bold ml-auto">Sudah Lunas</span>' : '';

      return `
        <label class="flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition ${isPaid ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed' : 'bg-white border-slate-200 hover:border-indigo-400'}">
          <input 
            type="checkbox" 
            name="batch-month" 
            value="${month}" 
            ${isChecked ? 'checked' : ''} 
            ${disabled}
            onchange="IuranManager.calculateBatchTotal()"
            class="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
          >
          <span class="font-semibold text-slate-700">${MONTH_NAMES[month-1]}</span>
          ${badgePaid}
        </label>
      `;
    }).join('');

    document.getElementById('batch-pay-tanggal').value = new Date().toISOString().split('T')[0];
    document.getElementById('batch-pay-metode').value = "Transfer / QRIS";

    this.calculateBatchTotal();

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  calculateBatchTotal() {
    if (!this.selectedWargaForPayment) return;
    const nominalPerMonth = this.selectedWargaForPayment.nominalIuran || Store.settings.nominalIuran || 50000;
    
    const checkboxes = document.querySelectorAll('input[name="batch-month"]:checked:not(:disabled)');
    const count = checkboxes.length;
    const total = count * nominalPerMonth;

    const elCount = document.getElementById('batch-pay-selected-count');
    const elTotal = document.getElementById('batch-pay-total-amount');

    if (elCount) elCount.textContent = `${count} Bulan`;
    if (elTotal) elTotal.textContent = formatRupiah(total);
  },

  submitBatchPay(e) {
    e.preventDefault();
    const wargaId = document.getElementById('batch-pay-warga-id').value;
    const year = Number(document.getElementById('batch-pay-year').value);
    const tanggal = document.getElementById('batch-pay-tanggal').value;
    const metode = document.getElementById('batch-pay-metode').value;

    const checkboxes = document.querySelectorAll('input[name="batch-month"]:checked:not(:disabled)');
    const selectedMonths = Array.from(checkboxes).map(cb => Number(cb.value));

    if (selectedMonths.length === 0) {
      showToast("Pilih minimal 1 bulan untuk dibayar.", "warning");
      return;
    }

    const createdTxs = Store.payIuranMultipleMonths(wargaId, selectedMonths, year, tanggal, metode);

    this.closeModal('modal-batch-pay');
    showToast(`Berhasil mencatat pembayaran untuk ${createdTxs.length} bulan!`, "success");

    this.renderMatrix();

    // Show combined receipt
    if (createdTxs.length > 0) {
      this.showBatchReceiptModal(this.selectedWargaForPayment, selectedMonths, year, createdTxs);
    }
  },

  // Receipt Modal (Single or Multi)
  showReceiptModal(tx) {
    const warga = Store.getWargaById(tx.wargaId);
    const modal = document.getElementById('modal-receipt');
    if (!modal) return;

    const monthName = tx.bulanIuran ? MONTH_NAMES[tx.bulanIuran - 1] : "-";
    const year = tx.tahunIuran || "-";

    const receiptData = {
      noKwitansi: `KWT-${tx.id.replace('tx-', '')}`,
      namaWarga: warga ? warga.nama : "Warga",
      blok: warga ? warga.blok : "-",
      telp: warga ? warga.telp : "-",
      periode: `${monthName} ${year}`,
      nominal: tx.nominal,
      tanggal: tx.tanggal,
      metode: tx.metode || "Tunai",
      txId: tx.id
    };

    // Render receipt view
    this.renderReceiptContent(receiptData);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  showBatchReceiptModal(warga, monthsArray, year, txList) {
    const modal = document.getElementById('modal-receipt');
    if (!modal) return;

    const monthNames = monthsArray.map(m => MONTH_NAMES[m-1]).join(', ');
    const totalNominal = txList.reduce((acc, t) => acc + t.nominal, 0);

    const receiptData = {
      noKwitansi: `KWT-${Date.now().toString().slice(-6)}`,
      namaWarga: warga.nama,
      blok: warga.blok,
      telp: warga.telp,
      periode: `${monthNames} (${year}) - [${monthsArray.length} Bulan]`,
      nominal: totalNominal,
      tanggal: txList[0].tanggal,
      metode: txList[0].metode || "Tunai",
      txId: null // multiple
    };

    this.renderReceiptContent(receiptData);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  renderReceiptContent(data) {
    const elContainer = document.getElementById('receipt-preview-content');
    if (!elContainer) return;

    const s = Store.settings;

    elContainer.innerHTML = `
      <div id="receipt-printable-card" class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto text-slate-800">
        <!-- Header -->
        <div class="text-center border-b pb-4 mb-4 border-dashed border-slate-300">
          <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg mb-1">
            RT
          </div>
          <h3 class="font-bold text-base text-slate-800 uppercase tracking-wide">KAS KEUANGAN ${s.namaRt}</h3>
          <p class="text-xs text-slate-500">${s.kelurahan}, ${s.kecamatan}, ${s.kota}</p>
          <div class="mt-2 inline-block px-3 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
            BUKTI PEMBAYARAN IURAN (LUNAS)
          </div>
        </div>

        <!-- Details -->
        <div class="space-y-2 text-xs">
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">No. Kwitansi:</span>
            <span class="font-mono font-bold">${data.noKwitansi}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">Tanggal Bayar:</span>
            <span class="font-semibold">${formatDateIndo(data.tanggal)}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">Nama Warga / KK:</span>
            <span class="font-bold text-slate-800">${data.namaWarga}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">No. Rumah / Blok:</span>
            <span class="font-bold text-slate-800">${data.blok}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">Untuk Iuran:</span>
            <span class="font-bold text-emerald-700 text-right">${data.periode}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">Metode Pembayaran:</span>
            <span class="font-medium">${data.metode}</span>
          </div>
          <div class="flex justify-between items-center py-2.5 my-1 bg-slate-50 px-3 rounded-xl border border-slate-200">
            <span class="font-bold text-slate-700 text-xs">TOTAL DIBAYAR:</span>
            <span class="font-extrabold text-emerald-700 text-base">${formatRupiah(data.nominal)}</span>
          </div>
        </div>

        <!-- Rincian Pos -->
        <div class="mt-3 p-2 bg-slate-50 rounded-lg text-[10px] text-slate-500 leading-tight">
          <strong>Alokasi Iuran:</strong> ${s.rincianIuran || 'Kebersihan, Keamanan, dan Kas RT'}
        </div>

        <!-- Footer Signatures -->
        <div class="mt-6 pt-3 border-t border-dashed border-slate-300 flex justify-between items-end text-center text-xs">
          <div>
            <p class="text-[10px] text-slate-400 mb-8">Warga / Pembayar</p>
            <p class="font-semibold text-slate-700 text-xs">(${data.namaWarga})</p>
          </div>
          <div>
            <p class="text-[10px] text-slate-400 mb-8">Bendahara RT</p>
            <p class="font-bold text-slate-800 text-xs">(${s.namaBendahara})</p>
          </div>
        </div>

        <!-- Developer & Support Credit -->
        <div class="mt-4 pt-2.5 border-t border-slate-100 text-center text-[9px] text-slate-400">
          Developed and support by : <strong class="text-slate-600">dutaglobaltech.com</strong> & <strong class="text-slate-600">mysnaprint.dutaglobaltech.com</strong>
        </div>
      </div>
    `;

    // Setup WhatsApp text format
    const waText = `*BUKTI PEMBAYARAN IURAN RT*\n` +
      `--------------------------------\n` +
      `*${s.namaRt} - ${s.kelurahan}*\n\n` +
      `No. Kwitansi: *${data.noKwitansi}*\n` +
      `Tanggal: ${formatDateIndo(data.tanggal)}\n` +
      `Warga: *${data.namaWarga}* (${data.blok})\n` +
      `Pembayaran: *Iuran ${data.periode}*\n` +
      `Metode: ${data.metode}\n` +
      `Jumlah: *${formatRupiah(data.nominal)}* (LUNAS)\n\n` +
      `_Terima kasih atas partisipasi dan kepedulian Bapak/Ibu demi kenyamanan lingkungan bersama._\n\n` +
      `Salam hangat,\n` +
      `*Pengurus ${s.namaRt}*\n` +
      `Bendahara: ${s.namaBendahara}\n\n` +
      `_Developed and support by : dutaglobaltech.com & mysnaprint.dutaglobaltech.com_`;

    // Store waText on modal for copy/send
    const btnCopyWa = document.getElementById('btn-copy-wa-receipt');
    if (btnCopyWa) {
      btnCopyWa.onclick = () => {
        navigator.clipboard.writeText(waText).then(() => {
          showToast("Format teks WhatsApp berhasil disalin ke clipboard!", "success");
        });
      };
    }

    const btnSendWa = document.getElementById('btn-send-wa-receipt');
    if (btnSendWa) {
      let telpClean = data.telp ? data.telp.replace(/[^0-9]/g, '') : '';
      if (telpClean.startsWith('0')) {
        telpClean = '62' + telpClean.slice(1);
      }
      
      btnSendWa.onclick = () => {
        const waUrl = telpClean.length > 5
          ? `https://wa.me/${telpClean}?text=${encodeURIComponent(waText)}`
          : `https://wa.me/?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank');
      };
    }

    // Cancel / Delete payment button (if single transaction)
    const btnDeletePayment = document.getElementById('btn-delete-receipt-payment');
    if (btnDeletePayment) {
      if (data.txId) {
        btnDeletePayment.classList.remove('hidden');
        btnDeletePayment.onclick = () => {
          if (confirm("Apakah Anda yakin ingin membatalkan transaksi iuran ini? Status iuran akan kembali menjadi Belum Bayar.")) {
            Store.deleteTransaksi(data.txId);
            this.closeModal('modal-receipt');
            showToast("Transaksi iuran berhasil dibatalkan.", "info");
            this.renderMatrix();
          }
        };
      } else {
        btnDeletePayment.classList.add('hidden');
      }
    }
  },

  printReceipt() {
    const card = document.getElementById('receipt-printable-card');
    if (!card) {
      window.print();
      return;
    }

    let printFrame = document.getElementById('print-receipt-iframe');
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      printFrame.id = 'print-receipt-iframe';
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      printFrame.style.zIndex = '-9999';
      document.body.appendChild(printFrame);
    }

    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Bukti Pembayaran Iuran</title>
        <style>
          @page {
            size: 100mm 150mm;
            margin: 8mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #111;
            background: #fff;
            margin: 0;
            padding: 10px;
            font-size: 8.5pt;
            line-height: 1.35;
          }
          .text-center { text-align: center; }
          .border-b { border-bottom: 1px solid #ddd; }
          .border-dashed { border-style: dashed; }
          .border-slate-300 { border-color: #cbd5e1; }
          .border-slate-100 { border-color: #f1f5f9; }
          .border-slate-200 { border-color: #e2e8f0; }
          .pb-4 { padding-bottom: 10px; }
          .mb-4 { margin-bottom: 10px; }
          .mb-1 { margin-bottom: 3px; }
          .mb-8 { margin-bottom: 30px; }
          .mt-2 { margin-top: 5px; }
          .mt-3 { margin-top: 8px; }
          .mt-6 { margin-top: 15px; }
          .pt-3 { padding-top: 8px; }
          .py-1 { padding-top: 3px; padding-bottom: 3px; }
          .py-2\\.5 { padding-top: 6px; padding-bottom: 6px; }
          .px-3 { padding-left: 8px; padding-right: 8px; }
          .p-2 { padding: 6px; }
          .font-bold { font-weight: bold; }
          .font-semibold { font-weight: 600; }
          .font-medium { font-weight: 500; }
          .font-extrabold { font-weight: 800; }
          .uppercase { text-transform: uppercase; }
          .tracking-wide { letter-spacing: 0.5px; }
          .text-base { font-size: 10.5pt; }
          .text-xs { font-size: 8pt; }
          .text-\\[10px\\] { font-size: 7.5pt; }
          .text-slate-800 { color: #1e293b; }
          .text-slate-700 { color: #334155; }
          .text-slate-500 { color: #64748b; }
          .text-slate-400 { color: #94a3b8; }
          .text-emerald-700 { color: #047857; }
          .bg-emerald-50 { background-color: #ecfdf5; }
          .bg-slate-50 { background-color: #f8fafc; }
          .rounded-full { border-radius: 9999px; }
          .rounded-xl { border-radius: 8px; }
          .rounded-lg { border-radius: 6px; }
          .border { border-width: 1px; }
          .border-emerald-200 { border-color: #a7f3d0; }
          .inline-block { display: inline-block; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .items-center { align-items: center; }
          .items-end { align-items: flex-end; }
          .space-y-2 > * + * { margin-top: 5px; }
          .leading-tight { line-height: 1.25; }
        </style>
      </head>
      <body>
        ${card.outerHTML}
      </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
    }, 250);
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
  window.IuranManager = IuranManager;
}

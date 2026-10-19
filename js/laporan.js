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
      if (btnBukuKas) {
        btnBukuKas.className = 'px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-bold shadow-md shadow-teal-600/20 transition flex items-center gap-1.5';
      }
      if (btnTunggakan) {
        btnTunggakan.className = 'px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold transition flex items-center gap-1.5';
      }

      if (viewBukuKas) viewBukuKas.classList.remove('hidden');
      if (viewTunggakan) viewTunggakan.classList.add('hidden');
    } else {
      if (btnTunggakan) {
        btnTunggakan.className = 'px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold shadow-md shadow-amber-600/20 transition flex items-center gap-1.5';
      }
      if (btnBukuKas) {
        btnBukuKas.className = 'px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold transition flex items-center gap-1.5';
      }

      if (viewTunggakan) viewTunggakan.classList.remove('hidden');
      if (viewBukuKas) viewBukuKas.classList.add('hidden');
    }

    if (window.lucide) lucide.createIcons();
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

    sheetData.push([]);
    sheetData.push(["", "Developed and support by : dutaglobaltech.com & mysnaprint.dutaglobaltech.com"]);

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
          const amt = tx ? tx.nominal : (w.nominalIuran || Store.settings.nominalIuran || 150000);
          totalPaid += amt;
          row.push("LUNAS");
        } else {
          row.push("BELUM");
        }
      }
      row.push(totalPaid);
      matrixData.push(row);
    });

    matrixData.push([]);
    matrixData.push(["", "Developed and support by : dutaglobaltech.com & mysnaprint.dutaglobaltech.com"]);

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
          <td style="text-align: center; width: 5%;">${idx + 1}</td>
          <td style="text-align: center; white-space: nowrap; width: 12%; font-weight: 500;">${formatDateShort(t.tanggal)}</td>
          <td style="width: 18%; font-weight: 600;">${t.kategori || t.jenis}</td>
          <td style="width: 35%;">${t.uraian}</td>
          <td style="text-align: right; width: 10%; color: #047857; font-weight: 600; white-space: nowrap;">${t.masuk > 0 ? formatRupiah(t.masuk) : '-'}</td>
          <td style="text-align: right; width: 10%; color: #b91c1c; font-weight: 600; white-space: nowrap;">${t.keluar > 0 ? formatRupiah(t.keluar) : '-'}</td>
          <td style="text-align: right; width: 10%; font-weight: 700; white-space: nowrap;">${formatRupiah(t.saldo || t.saldoBerjalan || 0)}</td>
        </tr>
      `;
    }).join('');

    const saldoAkhir = ledger.length > 0 ? (ledger[ledger.length - 1].saldo || ledger[ledger.length - 1].saldoBerjalan || 0) : 0;

    printContainer.innerHTML = `
      <div id="printable-area" class="p-4 sm:p-6 bg-white text-slate-900 font-sans">
        <!-- Kop Surat -->
        <div class="text-center border-b-2 border-slate-900 pb-4 mb-6">
          <h2 class="text-xl font-bold uppercase tracking-wider text-slate-900">RUKUN TETANGGA ${s.namaRt}</h2>
          <p class="text-sm font-medium text-slate-600">${s.kelurahan}, ${s.kecamatan}, ${s.kota}</p>
          <div class="mt-3 text-base font-bold underline tracking-wide text-slate-900">LAPORAN BUKU KAS KEUANGAN RT</div>
          <p class="text-xs text-slate-500 mt-1">Periode: <strong>${periodLabel}</strong></p>
        </div>

        <!-- Tabel Laporan -->
        <table class="print-table w-full mb-6">
          <thead>
            <tr>
              <th style="width: 5%; text-align: center;">No</th>
              <th style="width: 12%; text-align: center;">Tanggal</th>
              <th style="width: 18%; text-align: left;">Kategori</th>
              <th style="width: 35%; text-align: left;">Uraian Transaksi</th>
              <th style="width: 10%; text-align: right;">Masuk (Rp)</th>
              <th style="width: 10%; text-align: right;">Keluar (Rp)</th>
              <th style="width: 10%; text-align: right;">Saldo (Rp)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="7" class="text-center py-6 text-slate-400">Tidak ada transaksi pada periode ini.</td></tr>'}
          </tbody>
          <tfoot>
            <tr style="font-weight: bold; background-color: #f8fafc;">
              <td colspan="4" style="text-align: right; padding: 8px 10px;">TOTAL:</td>
              <td style="text-align: right; color: #047857; padding: 8px 10px;">${formatRupiah(totalMasuk)}</td>
              <td style="text-align: right; color: #b91c1c; padding: 8px 10px;">${formatRupiah(totalKeluar)}</td>
              <td style="text-align: right; padding: 8px 10px; font-weight: 800;">${formatRupiah(saldoAkhir)}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Ringkasan Box -->
        <div class="summary-box grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl mb-8 border border-slate-200 text-xs">
          <div>
            <span class="text-slate-500 block mb-0.5">Total Pemasukan</span>
            <strong class="text-emerald-700 text-sm font-bold">${formatRupiah(totalMasuk)}</strong>
          </div>
          <div>
            <span class="text-slate-500 block mb-0.5">Total Pengeluaran</span>
            <strong class="text-rose-700 text-sm font-bold">${formatRupiah(totalKeluar)}</strong>
          </div>
          <div>
            <span class="text-slate-500 block mb-0.5">Saldo Kas Akhir</span>
            <strong class="text-slate-900 text-sm font-bold">${formatRupiah(saldoAkhir)}</strong>
          </div>
        </div>

        <!-- Tanda Tangan -->
        <div class="ttd-section flex justify-between items-end mt-10 px-8 text-center text-xs">
          <div class="ttd-box">
            <p class="mb-1 text-slate-700">Mengetahui,</p>
            <p class="font-medium text-slate-500 mb-14">Ketua ${s.namaRt}</p>
            <p class="font-bold underline text-sm text-slate-900">${s.namaKetuaRt}</p>
          </div>
          <div class="ttd-box">
            <p class="mb-1 text-slate-700">${s.kota.replace('Kota ', '').replace('Kabupaten ', '')}, ${formatDateIndo(new Date().toISOString().split('T')[0])}</p>
            <p class="font-medium text-slate-500 mb-14">Bendahara ${s.namaRt}</p>
            <p class="font-bold underline text-sm text-slate-900">${s.namaBendahara}</p>
          </div>
        </div>

        <!-- Developer & Technical Support Credits -->
        <div class="mt-8 pt-3 border-t border-slate-300 text-center text-[8pt] text-slate-500">
          Sistem Informasi Kas & Iuran RT &bull; Developed and support by : <strong>dutaglobaltech.com</strong> & <strong>mysnaprint.dutaglobaltech.com</strong>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  triggerPrint() {
    const printContent = document.getElementById('printable-area');
    if (!printContent) {
      window.print();
      return;
    }

    // Gunakan iframe terisolasi untuk cetak/PDF agar 100% bebas dari bug pagination Chromium
    let printFrame = document.getElementById('print-report-iframe');
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      printFrame.id = 'print-report-iframe';
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
        <title>Laporan Buku Kas RT</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 10mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #111;
            background: #fff;
            margin: 0;
            padding: 0;
            font-size: 8.5pt;
            line-height: 1.35;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .text-center { text-align: center; }
          .border-b-2 { border-bottom: 2px solid #000; }
          .pb-4 { padding-bottom: 8px; }
          .mb-6 { margin-bottom: 12px; }
          .mb-8 { margin-bottom: 16px; }
          .text-xl { font-size: 13pt; margin: 0 0 2px 0; }
          .font-bold { font-weight: bold; }
          .uppercase { text-transform: uppercase; }
          .tracking-wider { letter-spacing: 0.5px; }
          .text-sm { font-size: 8.5pt; }
          .text-xs { font-size: 8pt; }
          .text-base { font-size: 10.5pt; }
          .underline { text-decoration: underline; }
          .mt-3 { margin-top: 5px; }
          .mt-1 { margin-top: 2px; }
          .mt-10 { margin-top: 20px; }
          .text-slate-600, .text-slate-500 { color: #333; }
          .w-full { width: 100%; }

          table.print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
            page-break-inside: auto;
          }
          table.print-table thead {
            display: table-header-group;
          }
          table.print-table tfoot {
            display: table-footer-group;
            page-break-inside: avoid;
          }
          table.print-table tr {
            page-break-inside: avoid;
            page-break-after: auto;
            height: auto;
          }
          table.print-table th, table.print-table td {
            border: 1px solid #111;
            padding: 5px 6px;
            font-size: 8pt;
            vertical-align: middle;
          }
          table.print-table th {
            background-color: #f1f5f9;
            font-weight: bold;
            text-align: center;
          }
          table.print-table tfoot tr {
            background-color: #f8fafc;
            font-weight: bold;
          }
          .summary-box {
            display: flex;
            justify-content: space-between;
            border: 1px solid #cbd5e1;
            background-color: #f8fafc;
            border-radius: 6px;
            padding: 8px 14px;
            margin-bottom: 18px;
            font-size: 8.5pt;
            page-break-inside: avoid;
          }
          .summary-box strong {
            display: block;
            font-size: 10pt;
            margin-top: 2px;
          }
          .ttd-section {
            display: flex;
            justify-content: space-between;
            margin-top: 25px;
            padding: 0 30px;
            text-align: center;
            font-size: 8.5pt;
            page-break-inside: avoid;
          }
          .ttd-box {
            width: 220px;
          }
          .mb-14 { margin-bottom: 45px; }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
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
  },

  generateWhatsAppReportText() {
    const s = Store.settings || {};
    const namaRt = s.namaRt || "RT 10 / RW 10";
    const subLoc = `${s.kelurahan || 'Kelurahan Sukamaju'}, ${s.kecamatan || 'Kecamatan Cilodong'}, ${s.kota || 'Kota Depok'}`;
    const m = this.filterMonth === 'all' ? null : Number(this.filterMonth);
    const y = Number(this.filterYear) || (s.tahunAktif || 2026);
    const periodLabel = m ? `Bulan ${MONTH_NAMES[m-1]} ${y}` : `Tahun ${y} (Januari - Desember)`;
    const tglSekarang = formatDateIndo(new Date().toISOString().split('T')[0]);

    if (this.activeSubTab === 'tunggakan') {
      const rekap = Store.getRekapTunggakan(y);
      const totalMenunggak = rekap.length;
      const totalNominal = rekap.reduce((sum, r) => sum + r.totalTunggakan, 0);

      let text = `📢 *REKAP TUNGGAKAN IURAN WARGA*\n`;
      text += `🏢 *${namaRt} - Kompleks Blok J (J1 s/d J10)*\n`;
      text += `📍 _${subLoc}_\n`;
      text += `-------------------------------------------\n`;
      text += `🗓 *Periode Evaluasi: Tahun ${y}*\n`;
      text += `📅 Terbit: ${tglSekarang}\n\n`;
      text += `⚠️ *Total Warga Menunggak:* ${totalMenunggak} KK\n`;
      text += `💰 *Total Nominal Tunggakan:* *${formatRupiah(totalNominal)}*\n\n`;

      text += `📋 *DAFTAR WARGA & BULAN MENUNGGAK:*\n`;
      if (rekap.length === 0) {
        text += `✅ *Alhamdulillah, seluruh 200 KK warga telah lunas iuran tahun ${y}! Kerukunan & gotong royong terjaga.* 🎉\n\n`;
      } else {
        rekap.slice(0, 20).forEach((r, idx) => {
          const bulanStr = r.bulanMenunggak.map(b => MONTH_NAMES[b-1].slice(0, 3)).join(', ');
          text += `${idx + 1}. *${r.warga.blok}* - ${r.warga.nama}\n`;
          text += `   ↳ ${r.jumlahBulan} bln (${bulanStr}) : *${formatRupiah(r.totalTunggakan)}*\n`;
        });
        if (rekap.length > 20) {
          text += `   _...dan ${rekap.length - 20} KK lainnya._\n`;
        }
        text += `\n`;
      }

      text += `-------------------------------------------\n`;
      text += `Bagi warga yang ingin konfirmasi atau pelunasan iuran dapat menghubungi Bendahara RT atau melalui Koordinator Blok masing-masing.\n\n`;
      text += `Hormat kami,\n`;
      text += `*Pengurus ${namaRt}*\n`;
      text += `Ketua RT: ${s.namaKetuaRt || 'Bpk. Bambang Sutrisno'}\n`;
      text += `Bendahara: ${s.namaBendahara || 'Bpk. Hendra Wijaya'}\n\n`;
      text += `_Developed and support by : dutaglobaltech.com & mysnaprint.dutaglobaltech.com_`;

      return text;
    }

    // Default: Buku Kas & Laporan Keuangan
    const ledger = Store.getBukuKas(m, y);
    let totalMasuk = 0;
    let totalKeluar = 0;
    let totalIuran = 0;
    let totalPemasukanLain = 0;
    const expenseCategories = {};

    ledger.forEach(t => {
      totalMasuk += t.masuk;
      totalKeluar += t.keluar;
      if (t.jenis === 'iuran') {
        totalIuran += t.masuk;
      } else if (t.jenis === 'pemasukan') {
        totalPemasukanLain += t.masuk;
      }

      if (t.jenis === 'pengeluaran') {
        const cat = t.kategori || 'Operasional Lain';
        expenseCategories[cat] = (expenseCategories[cat] || 0) + t.nominal;
      }
    });

    const saldoKas = totalMasuk - totalKeluar;
    const rekapTunggakan = Store.getRekapTunggakan(y);
    const totalKKMenunggak = rekapTunggakan.length;
    const totalNominalTunggakan = rekapTunggakan.reduce((sum, r) => sum + r.totalTunggakan, 0);

    const totalWarga = Store.warga ? Store.warga.length : 200;
    let lunasCount = 0;
    if (m) {
      Store.warga.forEach(w => {
        if (Store.isIuranPaid(w.id, m, y)) lunasCount++;
      });
    }

    const sortedCats = Object.entries(expenseCategories).sort((a, b) => b[1] - a[1]).slice(0, 4);

    let text = `📊 *LAPORAN KAS KEUANGAN ${namaRt}*\n`;
    text += `🏢 *Kompleks Blok J (J1 s/d J10)*\n`;
    text += `📍 _${subLoc}_\n`;
    text += `-------------------------------------------\n`;
    text += `🗓 *Periode: ${periodLabel}*\n`;
    text += `📅 Terbit: ${tglSekarang}\n\n`;

    text += `💰 *RINGKASAN ARUS KAS:*\n`;
    text += `▪ Total Pemasukan: *${formatRupiah(totalMasuk)}*\n`;
    if (totalIuran > 0) text += `   • Iuran Kas Warga: ${formatRupiah(totalIuran)}\n`;
    if (totalPemasukanLain > 0) text += `   • Non-Iuran / Donasi: ${formatRupiah(totalPemasukanLain)}\n`;
    text += `▪ Total Pengeluaran: *${formatRupiah(totalKeluar)}*\n`;
    text += `▪ *Saldo Kas Periode Ini: ${formatRupiah(saldoKas)}*\n\n`;

    if (sortedCats.length > 0) {
      text += `📌 *POS PENGELUARAN UTAMA:*\n`;
      sortedCats.forEach(([cat, amt]) => {
        text += `• ${cat}: ${formatRupiah(amt)}\n`;
      });
      text += `\n`;
    }

    text += `👥 *STATUS IURAN WARGA:*\n`;
    if (m) {
      const persen = totalWarga > 0 ? Math.round((lunasCount / totalWarga) * 100) : 0;
      text += `• Lunas ${periodLabel}: *${lunasCount} / ${totalWarga} KK (${persen}%)*\n`;
      text += `• Belum Bayar Bulan Ini: *${totalWarga - lunasCount} KK*\n`;
    }
    text += `• Total Menunggak (${y}): *${totalKKMenunggak} KK* (${formatRupiah(totalNominalTunggakan)})\n\n`;

    text += `-------------------------------------------\n`;
    text += `Seluruh rincian pembukuan dan mutasi kas dapat diperiksa secara terbuka & transparan melalui Portal Kas RT.\n\n`;
    text += `Salam hangat,\n`;
    text += `*Pengurus ${namaRt}*\n`;
    text += `Ketua RT: ${s.namaKetuaRt || 'Bpk. Bambang Sutrisno'}\n`;
    text += `Bendahara: ${s.namaBendahara || 'Bpk. Hendra Wijaya'}\n\n`;
    text += `_Developed and support by : dutaglobaltech.com & mysnaprint.dutaglobaltech.com_`;

    return text;
  },

  shareReportToWhatsApp() {
    const text = this.generateWhatsAppReportText();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  },

  copyReportWhatsAppText() {
    const text = this.generateWhatsAppReportText();
    navigator.clipboard.writeText(text).then(() => {
      showToast("Ringkasan laporan kas format WhatsApp berhasil disalin!", "success");
    }).catch(() => {
      showToast("Gagal menyalin ke clipboard.", "error");
    });
  }
};

if (typeof window !== 'undefined') {
  window.LaporanManager = LaporanManager;
}

/**
 * Dashboard Component - Redesigned, Clean, Accurate & Highly Visual
 */

let cashflowChart = null;
let currentChartMode = 'cashflow'; // 'cashflow' | 'net'

const Dashboard = {
  render() {
    const summary = Store.calculateSummary();
    const currentMonthName = MONTH_NAMES[summary.currentMonth - 1] || 'Bulan Ini';

    // 1. Update Primary Stat Cards
    const elSaldo = document.getElementById('stat-saldo-kas');
    const elPemasukan = document.getElementById('stat-pemasukan-bulan');
    const elPengeluaran = document.getElementById('stat-pengeluaran-bulan');
    const elIuranStatus = document.getElementById('stat-iuran-status');
    const elIuranPersen = document.getElementById('stat-iuran-persen');
    const elIuranProgress = document.getElementById('stat-iuran-progress');
    const elIuranUnpaid = document.getElementById('stat-iuran-unpaid');

    if (elSaldo) elSaldo.textContent = formatRupiah(summary.saldoKas);
    if (elPemasukan) elPemasukan.textContent = formatRupiah(summary.pemasukanBulanIni);
    if (elPengeluaran) elPengeluaran.textContent = formatRupiah(summary.pengeluaranBulanIni);

    if (elIuranStatus) {
      elIuranStatus.textContent = `${summary.wargaLunasCount} / ${summary.totalWarga} KK`;
    }
    if (elIuranPersen) {
      elIuranPersen.textContent = `${summary.persenLunas}%`;
    }
    if (elIuranProgress) {
      elIuranProgress.style.width = `${summary.persenLunas}%`;
    }
    if (elIuranUnpaid) {
      elIuranUnpaid.textContent = `${summary.wargaBelumCount} KK Belum Lunas`;
    }

    // 2. Update Secondary Metric Pills
    const elTotalWarga = document.getElementById('stat-mini-warga');
    const elTargetIuran = document.getElementById('stat-mini-target');
    const elTotalTunggakan = document.getElementById('stat-mini-tunggakan');
    const elTotalTunggakanNominal = document.getElementById('stat-mini-tunggakan-nominal');
    const elAllTimeIn = document.getElementById('stat-alltime-masuk');
    const elAllTimeOut = document.getElementById('stat-alltime-keluar');

    if (elTotalWarga) {
      elTotalWarga.textContent = `${summary.totalWarga} KK (${summary.wargaTetapCount} Tetap, ${summary.wargaKontrakCount} Kontrak)`;
    }
    if (elTargetIuran) {
      elTargetIuran.textContent = `${formatRupiah(summary.targetIuranBulanan)} / bln`;
    }
    if (elTotalTunggakan) {
      elTotalTunggakan.textContent = `${summary.totalWargaMenunggak} KK Menunggak`;
    }
    if (elTotalTunggakanNominal) {
      elTotalTunggakanNominal.textContent = `Total: ${formatRupiah(summary.totalNominalTunggakan)}`;
    }
    if (elAllTimeIn) elAllTimeIn.textContent = formatRupiah(summary.totalPemasukan);
    if (elAllTimeOut) elAllTimeOut.textContent = formatRupiah(summary.totalPengeluaran);

    // Update labels with month & year
    const elBulanLabel = document.querySelectorAll('.label-current-month');
    elBulanLabel.forEach(el => {
      el.textContent = `${currentMonthName} ${summary.currentYear}`;
    });

    const elRtName = document.querySelectorAll('.label-rt-name');
    elRtName.forEach(el => {
      el.textContent = Store.settings.namaRt || 'RT 10 / RW 10';
    });

    // 3. Render Expense Breakdown
    this.renderExpenseBreakdown(summary.currentYear);

    // 4. Render Recent Transactions
    this.renderRecentTransactions();

    // 5. Render Chart.js
    this.renderChart();

    // Re-initialize Lucide icons if available
    if (window.lucide) {
      lucide.createIcons();
    }
  },

  setChartMode(mode) {
    currentChartMode = mode;
    const btnCashflow = document.getElementById('btn-chart-cashflow');
    const btnNet = document.getElementById('btn-chart-net');

    if (btnCashflow && btnNet) {
      if (mode === 'cashflow') {
        btnCashflow.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white text-slate-800 shadow-sm border border-slate-200 transition';
        btnNet.className = 'px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 transition';
      } else {
        btnNet.className = 'px-3 py-1.5 text-xs font-bold rounded-xl bg-white text-slate-800 shadow-sm border border-slate-200 transition';
        btnCashflow.className = 'px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 transition';
      }
    }

    this.renderChart();
  },

  renderChart() {
    const canvas = document.getElementById('cashflowChart');
    if (!canvas || typeof canvas.getContext !== 'function') return;

    const currentYear = Store.settings.tahunAktif || new Date().getFullYear();
    const chartData = Store.getMonthlyChartData(currentYear);

    if (cashflowChart) {
      cashflowChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    const shortLabels = chartData.labels.map(l => l.substring(0, 3));

    let datasets = [];

    if (currentChartMode === 'cashflow') {
      datasets = [
        {
          label: 'Pemasukan Kas',
          data: chartData.dataPemasukan,
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1.5,
          borderRadius: 6,
          barPercentage: 0.6,
          categoryPercentage: 0.75
        },
        {
          label: 'Pengeluaran Kas',
          data: chartData.dataPengeluaran,
          backgroundColor: 'rgba(244, 63, 94, 0.85)',
          borderColor: 'rgb(244, 63, 94)',
          borderWidth: 1.5,
          borderRadius: 6,
          barPercentage: 0.6,
          categoryPercentage: 0.75
        }
      ];
    } else {
      datasets = [
        {
          type: 'line',
          label: 'Akumulasi Saldo Kas',
          data: chartData.dataSaldo,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.12)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#4f46e5'
        },
        {
          type: 'bar',
          label: 'Surplus / Defisit Bulanan',
          data: chartData.dataNet,
          backgroundColor: chartData.dataNet.map(v => v >= 0 ? 'rgba(16, 185, 129, 0.75)' : 'rgba(244, 63, 94, 0.75)'),
          borderRadius: 6,
          barPercentage: 0.5
        }
      ];
    }

    cashflowChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: shortLabels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                family: 'Plus Jakarta Sans',
                size: 11,
                weight: '600'
              },
              boxWidth: 12,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
            bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ${formatRupiah(context.raw)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { family: 'Plus Jakarta Sans', size: 11 }
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(226, 232, 240, 0.7)' },
            ticks: {
              font: { family: 'Plus Jakarta Sans', size: 10 },
              callback: function(value) {
                if (Math.abs(value) >= 1000000) return (value / 1000000) + ' Jt';
                if (Math.abs(value) >= 1000) return (value / 1000) + ' Rb';
                return value;
              }
            }
          }
        }
      }
    });
  },

  renderExpenseBreakdown(year) {
    const container = document.getElementById('dashboard-expense-categories');
    if (!container) return;

    const breakdownData = Store.getExpenseCategoryBreakdown(year);
    const topCategories = breakdownData.breakdown.slice(0, 5);

    if (topCategories.length === 0) {
      container.innerHTML = `<p class="text-xs text-slate-400 py-6 text-center">Belum ada pos pengeluaran tercatat.</p>`;
      return;
    }

    const colors = [
      { bar: 'bg-emerald-500', text: 'text-emerald-700' },
      { bar: 'bg-blue-500', text: 'text-blue-700' },
      { bar: 'bg-indigo-500', text: 'text-indigo-700' },
      { bar: 'bg-amber-500', text: 'text-amber-700' },
      { bar: 'bg-rose-500', text: 'text-rose-700' }
    ];

    container.innerHTML = topCategories.map((c, i) => {
      const theme = colors[i % colors.length];
      return `
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-700 truncate max-w-[170px]" title="${c.name}">${c.name}</span>
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900">${formatRupiah(c.amount)}</span>
              <span class="text-[10px] font-extrabold ${theme.text} bg-slate-100 px-1.5 py-0.5 rounded">${c.percentage}%</span>
            </div>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div class="${theme.bar} h-2 rounded-full transition-all duration-700" style="width: ${c.percentage}%"></div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderRecentTransactions() {
    const container = document.getElementById('dashboard-recent-transactions');
    if (!container) return;

    const recent = [...Store.transaksi]
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal) || b.id.localeCompare(a.id))
      .slice(0, 7);

    if (recent.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="5" class="py-10 text-center text-slate-400">Belum ada transaksi tercatat.</td>
        </tr>
      `;
      return;
    }

    container.innerHTML = recent.map(t => {
      const isIncome = t.jenis === 'iuran' || t.jenis === 'pemasukan';
      const badgeClass = t.jenis === 'iuran'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : t.jenis === 'pemasukan'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-rose-50 text-rose-700 border-rose-200';

      const typeLabel = t.jenis === 'iuran' ? 'Iuran Warga' : t.jenis === 'pemasukan' ? 'Pemasukan Lain' : 'Pengeluaran';
      const amountColor = isIncome ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold';
      const amountPrefix = isIncome ? '+ ' : '- ';

      let metodeBadge = '';
      if (t.metode) {
        metodeBadge = `<span class="inline-block px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md ml-1.5">${t.metode}</span>`;
      }

      return `
        <tr class="hover:bg-slate-50/80 transition border-b border-slate-100 text-xs">
          <td class="py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">${formatDateShort(t.tanggal)}</td>
          <td class="py-3 px-4 whitespace-nowrap">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}">
              ${typeLabel}
            </span>
          </td>
          <td class="py-3 px-4">
            <div class="font-semibold text-slate-800 text-xs leading-snug">${t.uraian}</div>
          </td>
          <td class="py-3 px-4 text-slate-500 whitespace-nowrap">
            <span>${t.kategori || '-'}</span>
            ${metodeBadge}
          </td>
          <td class="py-3 px-4 text-right whitespace-nowrap ${amountColor} font-mono text-xs">
            ${amountPrefix}${formatRupiah(t.nominal)}
          </td>
        </tr>
      `;
    }).join('');
  }
};

if (typeof window !== 'undefined') {
  window.Dashboard = Dashboard;
}

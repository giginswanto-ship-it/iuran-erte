/**
 * Dashboard Component
 */

let cashflowChart = null;

const Dashboard = {
  render() {
    const summary = Store.calculateSummary();
    const currentMonthName = MONTH_NAMES[summary.currentMonth - 1];

    // Update Top Summary Cards
    const elSaldo = document.getElementById('stat-saldo-kas');
    const elPemasukan = document.getElementById('stat-pemasukan-bulan');
    const elPengeluaran = document.getElementById('stat-pengeluaran-bulan');
    const elIuranStatus = document.getElementById('stat-iuran-status');
    const elIuranProgress = document.getElementById('stat-iuran-progress');
    const elBulanLabel = document.querySelectorAll('.label-current-month');

    if (elSaldo) elSaldo.textContent = formatRupiah(summary.saldoKas);
    if (elPemasukan) elPemasukan.textContent = formatRupiah(summary.pemasukanBulanIni);
    if (elPengeluaran) elPengeluaran.textContent = formatRupiah(summary.pengeluaranBulanIni);
    
    if (elIuranStatus) {
      elIuranStatus.textContent = `${summary.wargaSudahBayarBulanIni} / ${summary.totalWarga} KK (${summary.persentaseLunas}%)`;
    }
    if (elIuranProgress) {
      elIuranProgress.style.width = `${summary.persentaseLunas}%`;
    }

    elBulanLabel.forEach(el => {
      el.textContent = `${currentMonthName} ${summary.currentYear}`;
    });

    // Render Recent Transactions (Last 5)
    this.renderRecentTransactions();

    // Render / Update Chart
    this.renderChart();
  },

  renderRecentTransactions() {
    const container = document.getElementById('dashboard-recent-transactions');
    if (!container) return;

    // Get last 6 transactions sorted descending by date
    const recent = [...Store.transaksi]
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal) || b.id.localeCompare(a.id))
      .slice(0, 6);

    if (recent.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="5" class="py-8 text-center text-slate-400">Belum ada transaksi tercatat.</td>
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
      const amountColor = isIncome ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold';
      const amountPrefix = isIncome ? '+ ' : '- ';

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
          <td class="py-3 px-4 text-xs font-medium text-slate-500 whitespace-nowrap">${formatDateShort(t.tanggal)}</td>
          <td class="py-3 px-4">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${badgeClass}">
              ${typeLabel}
            </span>
          </td>
          <td class="py-3 px-4 text-sm font-medium text-slate-800 max-w-xs truncate">${t.uraian}</td>
          <td class="py-3 px-4 text-xs text-slate-500">${t.kategori || '-'}</td>
          <td class="py-3 px-4 text-sm text-right whitespace-nowrap ${amountColor}">
            ${amountPrefix}${formatRupiah(t.nominal)}
          </td>
        </tr>
      `;
    }).join('');
  },

  renderChart() {
    const canvas = document.getElementById('cashflowChart');
    if (!canvas) return;

    const currentYear = Store.settings.tahunAktif || new Date().getFullYear();
    const chartData = Store.getMonthlyChartData(currentYear);

    if (cashflowChart) {
      cashflowChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    cashflowChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels.map(l => l.substring(0, 3)), // Jan, Feb, Mar ...
        datasets: [
          {
            label: 'Pemasukan (Rp)',
            data: chartData.dataPemasukan,
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.8
          },
          {
            label: 'Pengeluaran (Rp)',
            data: chartData.dataPengeluaran,
            backgroundColor: 'rgba(244, 63, 94, 0.85)',
            borderColor: 'rgb(244, 63, 94)',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                family: 'Plus Jakarta Sans',
                size: 12
              },
              boxWidth: 12,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ${formatRupiah(context.raw)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                if (value >= 1000000) return (value / 1000000) + ' Jt';
                if (value >= 1000) return (value / 1000) + ' Rb';
                return value;
              }
            }
          }
        }
      }
    });
  }
};

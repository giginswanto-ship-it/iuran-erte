<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistem Kas & Iuran Warga RT</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#ecfdf5',
              100: '#d1fae5',
              500: '#10b981',
              600: '#059669',
              700: '#047857',
            }
          }
        }
      }
    }
  </script>

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- SheetJS for Excel Export -->
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

  <!-- Custom CSS -->
  <link rel="stylesheet" href="{{ asset('css/custom.css') }}">
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col">

  <!-- Toast Notification Container -->
  <div id="toast-container"></div>

  <!-- Backdrop for Mobile Sidebar Drawer -->
  <div id="sidebar-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 opacity-0 pointer-events-none transition-opacity duration-300 lg:hidden"></div>

  <div class="flex-1 flex overflow-hidden min-h-screen">
    
    <!-- SIDEBAR -->
    <aside id="sidebar" class="fixed inset-y-0 left-0 z-40 w-72 sm:w-80 lg:w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform -translate-x-full lg:translate-x-0 lg:static lg:inset-auto shadow-2xl lg:shadow-none">
      <!-- Logo RT & Mobile Close Button -->
      <div class="h-16 sm:h-20 flex items-center justify-between px-5 sm:px-6 border-b border-slate-100 bg-slate-50/50">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            <i data-lucide="wallet" class="w-5 h-5"></i>
          </div>
          <div class="min-w-0">
            <h1 class="font-bold text-slate-800 text-sm sm:text-base leading-tight label-rt-name truncate">RT 10 / RW 10</h1>
            <p class="text-[11px] sm:text-xs text-slate-500 label-rt-sub truncate">Kompleks Blok J1 - J10</p>
          </div>
        </div>

        <!-- Mobile Drawer Close Button -->
        <button id="btn-close-sidebar" class="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0" aria-label="Tutup Menu">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-3.5 py-4 space-y-2 overflow-y-auto">
        
        <!-- 1. Dashboard -->
        <button data-tab-target="dashboard" onclick="App.switchTab('dashboard')" class="nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition text-left group">
          <div class="flex items-center gap-3">
            <span class="nav-icon-box w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center transition shadow-2xs">
              <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
            </span>
            <span class="nav-label">Dashboard Kas</span>
          </div>
          <span class="nav-tag px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">Kas RT</span>
        </button>

        <!-- 2. Menu Portal Pengumuman & Sub-menu Susunan Pengurus RT 10 -->
        <div class="space-y-1.5 p-1 rounded-2xl bg-amber-50/40 border border-amber-200/50">
          <button data-tab-target="pengumuman" onclick="App.switchTab('pengumuman')" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-xs transition text-left group">
            <div class="flex items-center gap-3">
              <span class="nav-icon-box w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center transition shadow-2xs">
                <i data-lucide="megaphone" class="w-4 h-4"></i>
              </span>
              <span class="nav-label">Portal Pengumuman</span>
            </div>
            <span class="nav-tag px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-100 text-amber-800 border border-amber-200">Warta</span>
          </button>
          
          <!-- Sub-menus with distinct colored background pills -->
          <div class="pl-3 pr-1 py-0.5 space-y-1">
            <button id="subnav-pengumuman" onclick="App.switchTab('pengumuman'); PengumumanManager.switchSubTab('pengumuman');" class="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-900 hover:from-amber-100 hover:to-orange-100 transition shadow-2xs text-left group">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center text-[10px]">
                  <i data-lucide="bell" class="w-3 h-3"></i>
                </span>
                <span>Pengumuman Pengurus</span>
              </div>
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </button>

            <button id="subnav-pengurus" onclick="App.switchTab('pengumuman'); PengumumanManager.switchSubTab('pengurus');" class="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-900 hover:from-blue-100 hover:to-indigo-100 transition shadow-2xs text-left group">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-lg bg-blue-200 text-blue-800 flex items-center justify-center text-[10px]">
                  <i data-lucide="users-round" class="w-3 h-3"></i>
                </span>
                <span>Susunan Pengurus RT 10</span>
              </div>
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            </button>
          </div>
        </div>

        <!-- 3. Menu Suara Warga -->
        <button data-tab-target="suarawarga" onclick="App.switchTab('suarawarga')" class="nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition text-left group">
          <div class="flex items-center gap-3">
            <span class="nav-icon-box w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center transition shadow-2xs">
              <i data-lucide="message-square-quote" class="w-4 h-4"></i>
            </span>
            <span class="nav-label">Suara Warga</span>
          </div>
          <span class="nav-tag px-2 py-0.5 text-[10px] font-bold rounded-lg bg-purple-100 text-purple-800 border border-purple-200">Aspirasi</span>
        </button>

        <!-- 4. Matriks Iuran Warga -->
        <button data-tab-target="iuran" onclick="App.switchTab('iuran')" class="nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition text-left group">
          <div class="flex items-center gap-3">
            <span class="nav-icon-box w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center transition shadow-2xs">
              <i data-lucide="calendar-check" class="w-4 h-4"></i>
            </span>
            <span class="nav-label">Matriks Iuran Warga</span>
          </div>
          <span class="nav-tag px-2 py-0.5 text-[10px] font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200">200 KK</span>
        </button>

        <!-- 5. Pengeluaran & Pemasukan -->
        <button data-tab-target="transaksi" onclick="App.switchTab('transaksi')" class="nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition text-left group">
          <div class="flex items-center gap-3">
            <span class="nav-icon-box w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center transition shadow-2xs">
              <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
            </span>
            <span class="nav-label">Pengeluaran & Mutasi</span>
          </div>
          <span class="nav-tag px-2 py-0.5 text-[10px] font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200">Kas RT</span>
        </button>

        <!-- 6. Data Warga / KK -->
        <button data-tab-target="warga" onclick="App.switchTab('warga')" class="nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition text-left group">
          <div class="flex items-center gap-3">
            <span class="nav-icon-box w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center transition shadow-2xs">
              <i data-lucide="users" class="w-4 h-4"></i>
            </span>
            <span class="nav-label">Data Warga / KK</span>
          </div>
          <span class="nav-tag px-2 py-0.5 text-[10px] font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">Blok J</span>
        </button>

        <!-- 7. Laporan & Buku Kas -->
        <button data-tab-target="laporan" onclick="App.switchTab('laporan')" class="nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition text-left group">
          <div class="flex items-center gap-3">
            <span class="nav-icon-box w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center transition shadow-2xs">
              <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
            </span>
            <span class="nav-label">Laporan & Buku Kas</span>
          </div>
          <span class="nav-tag px-2 py-0.5 text-[10px] font-bold rounded-lg bg-teal-50 text-teal-700 border border-teal-200">Cetak</span>
        </button>

        <!-- 8. Pengaturan & Cadangan -->
        <button data-tab-target="settings" onclick="App.switchTab('settings')" class="nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition text-left group">
          <div class="flex items-center gap-3">
            <span class="nav-icon-box w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center transition shadow-2xs">
              <i data-lucide="settings" class="w-4 h-4"></i>
            </span>
            <span class="nav-label">Pengaturan & Cadangan</span>
          </div>
          <span class="nav-tag px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-100 text-slate-600 border border-slate-200">SQL</span>
        </button>
      </nav>

      <!-- User/Bendahara Badge & Developer Credits -->
      <div class="p-4 border-t border-slate-100 space-y-3">
        <div class="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs label-bendahara-initial">
            B
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-slate-800 truncate label-bendahara">Bpk. Hendra Wijaya</p>
            <p class="text-[11px] text-slate-500">Bendahara Kas <span class="label-rt-name">RT 10</span></p>
          </div>
        </div>

        <!-- Developer & Support Credits -->
        <div class="px-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 leading-tight">
          <p class="font-medium text-slate-500 flex items-center gap-1 mb-1">
            <i data-lucide="code-2" class="w-3 h-3 text-emerald-600"></i>
            <span>Developed & Support by:</span>
          </p>
          <div class="space-y-1">
            <a href="https://dutaglobaltech.com" target="_blank" rel="noopener noreferrer" class="block font-semibold text-slate-600 hover:text-emerald-700 hover:underline transition truncate" title="Kunjungi dutaglobaltech.com">
              🌐 dutaglobaltech.com
            </a>
            <a href="https://mysnaprint.dutaglobaltech.com" target="_blank" rel="noopener noreferrer" class="block font-semibold text-slate-600 hover:text-blue-700 hover:underline transition truncate" title="Kunjungi mysnaprint.dutaglobaltech.com">
              🖨️ mysnaprint.dutaglobaltech.com
            </a>
          </div>
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="flex-1 flex flex-col overflow-y-auto bg-slate-50/70 min-w-0">
      
      <!-- Top Header -->
      <header class="h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 sm:px-6 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <!-- Animated Hamburger Button -->
          <button id="btn-toggle-sidebar" class="hamburger-btn lg:hidden shrink-0" aria-label="Buka Menu Navigasi" aria-expanded="false">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>

          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse sm:hidden shrink-0"></span>
              <h2 class="font-extrabold text-sm sm:text-base md:text-lg text-slate-800 label-rt-name truncate">RT 10 / RW 10</h2>
            </div>
            <p class="text-[10px] sm:text-xs text-slate-500 truncate hidden sm:block">Iuran Bulanan Warga & Pengeluaran Kas RT</p>
          </div>
        </div>

        <!-- SQL Sync Status Badge (Click to Preview) -->
        <div id="sql-sync-indicator" onclick="App.openSqlPreviewModal()" class="cursor-pointer hover:bg-emerald-100/90 hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl shadow-xs transition" title="Klik untuk melihat pratinjau berkas kas-rt.sql secara langsung">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span id="sql-sync-text">Tersimpan di kas-rt.sql</span>
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button onclick="PengeluaranManager.openAddExpenseModal()" class="hidden md:flex px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs rounded-xl items-center gap-1.5 transition" title="Catat Pengeluaran Kas">
            <i data-lucide="minus-circle" class="w-4 h-4"></i>
            <span>Catat Pengeluaran</span>
          </button>

          <button onclick="PengeluaranManager.openAddIncomeModal()" class="hidden sm:flex px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs rounded-xl items-center gap-1.5 transition" title="Catat Pemasukan Non-Iuran">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span class="hidden md:inline">Pemasukan Lain</span>
          </button>

          <button onclick="App.switchTab('iuran')" class="px-3 sm:px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition">
            <i data-lucide="check-circle-2" class="w-4 h-4"></i>
            <span>Bayar Iuran</span>
          </button>
        </div>
      </header>

      <!-- SECTIONS CONTAINER -->
      <div class="p-3.5 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6 pb-24 lg:pb-10">

        <!-- ================= TAB 1: DASHBOARD ================= -->
        <section id="section-dashboard" class="tab-section space-y-6">
          
          <!-- Hero Banner & Welcome -->
          <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-300 border border-white/10 mb-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="label-rt-name font-bold">RT 10 / RW 10</span>
                  <span>•</span>
                  <span>Kompleks Blok J (J1 s/d J10)</span>
                </div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug">RT 10 Guyub Tanpa Ragu, Iuran Terbuka, Kerukunan Terjaga.</h2>
                <p class="text-xs sm:text-sm text-slate-300 mt-1">Monitoring iuran <span class="label-total-warga">200 KK</span> warga, arus kas operasional, dan transparansi pembukuan tahun <span class="label-tahun-aktif">2026</span></p>
              </div>

              <!-- Hero Quick Buttons -->
              <div class="flex flex-wrap items-center gap-2.5">
                <button onclick="App.switchTab('iuran')" class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5">
                  <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                  <span>Bayar Iuran</span>
                </button>
                <button onclick="PengeluaranManager.openAddExpenseModal()" class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-sm border border-white/10 transition flex items-center gap-1.5">
                  <i data-lucide="minus-circle" class="w-4 h-4 text-rose-400"></i>
                  <span>Catat Pengeluaran</span>
                </button>
                <button onclick="App.switchTab('laporan'); LaporanManager.openPrintModal();" class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-sm border border-white/10 transition flex items-center gap-1.5">
                  <i data-lucide="printer" class="w-4 h-4 text-indigo-300"></i>
                  <span>Cetak Laporan</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Ringkasan Kartu Utama / 4 Key Metrics -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <!-- 1. Saldo Kas RT -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 card-hover shadow-xs flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Saldo Kas RT</span>
                <span class="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <i data-lucide="wallet" class="w-5 h-5"></i>
                </span>
              </div>
              <div class="mt-4">
                <h3 id="stat-saldo-kas" class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Rp 0</h3>
                <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Masuk: <strong id="stat-alltime-masuk" class="text-emerald-700">Rp 0</strong></span>
                  <span>Keluar: <strong id="stat-alltime-keluar" class="text-rose-700">Rp 0</strong></span>
                </div>
              </div>
            </div>

            <!-- 2. Pemasukan Bulan Ini -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 card-hover shadow-xs flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Pemasukan (<span class="label-current-month">-</span>)</span>
                <span class="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <i data-lucide="trending-up" class="w-5 h-5"></i>
                </span>
              </div>
              <div class="mt-4">
                <h3 id="stat-pemasukan-bulan" class="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">Rp 0</h3>
                <p class="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i>
                  <span>Iuran warga & penerimaan kas</span>
                </p>
              </div>
            </div>

            <!-- 3. Pengeluaran Bulan Ini -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 card-hover shadow-xs flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Pengeluaran (<span class="label-current-month">-</span>)</span>
                <span class="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                  <i data-lucide="trending-down" class="w-5 h-5"></i>
                </span>
              </div>
              <div class="mt-4">
                <h3 id="stat-pengeluaran-bulan" class="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">Rp 0</h3>
                <p class="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <i data-lucide="shield" class="w-3.5 h-3.5 text-rose-500"></i>
                  <span>Satpam, sampah & fasilitas umum</span>
                </p>
              </div>
            </div>

            <!-- 4. Status Iuran Bulan Ini -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 card-hover shadow-xs flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Iuran (<span class="label-current-month">-</span>)</span>
                <span id="stat-iuran-persen" class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  0%
                </span>
              </div>
              <div class="mt-4">
                <div class="flex items-baseline justify-between">
                  <h3 id="stat-iuran-status" class="text-xl sm:text-2xl font-extrabold text-slate-900">0 / 0 KK</h3>
                  <span id="stat-iuran-unpaid" class="text-[11px] font-semibold text-rose-600">0 KK Belum Lunas</span>
                </div>
                <!-- Progress Bar -->
                <div class="w-full bg-slate-100 rounded-full h-2.5 mt-2.5 overflow-hidden">
                  <div id="stat-iuran-progress" class="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style="width: 0%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Metric Strip (4 Mini Highlights) -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <i data-lucide="home" class="w-4 h-4"></i>
              </div>
              <div class="min-w-0">
                <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Data Warga</span>
                <span id="stat-mini-warga" class="text-xs font-bold text-slate-800 truncate block">200 KK</span>
              </div>
            </div>

            <div class="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <i data-lucide="target" class="w-4 h-4"></i>
              </div>
              <div class="min-w-0">
                <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Target Iuran/Bulan</span>
                <span id="stat-mini-target" class="text-xs font-bold text-emerald-700 truncate block">Rp 30.000.000 / bln</span>
              </div>
            </div>

            <div onclick="App.switchTab('laporan'); LaporanManager.switchSubTab('tunggakan');" class="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3 cursor-pointer hover:border-rose-300 transition group">
              <div class="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <i data-lucide="alert-triangle" class="w-4 h-4"></i>
              </div>
              <div class="min-w-0">
                <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Rekap Tunggakan <span class="label-tahun-aktif">2026</span></span>
                <span id="stat-mini-tunggakan" class="text-xs font-bold text-rose-700 truncate block">0 KK Menunggak</span>
                <span id="stat-mini-tunggakan-nominal" class="text-[10px] text-slate-500 font-medium truncate block"></span>
              </div>
            </div>

            <div class="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <i data-lucide="shield-check" class="w-4 h-4"></i>
              </div>
              <div class="min-w-0">
                <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Biaya Rutin Lingkungan</span>
                <span class="text-xs font-bold text-indigo-900 truncate block">Rp 13.750.000 / bln</span>
              </div>
            </div>
          </div>

          <!-- Charts & Expense Breakdown Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Cash Flow Chart (2 cols) -->
            <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 class="font-bold text-slate-900 text-base">Arus Kas Bulanan Tahun <span class="label-tahun-aktif">2026</span></h3>
                  <p class="text-xs text-slate-400">Perbandingan riil pemasukan iuran vs pengeluaran rutin RT</p>
                </div>

                <!-- Mode Chart Switcher -->
                <div class="inline-flex p-1 bg-slate-100 rounded-xl gap-1 self-start sm:self-auto">
                  <button id="btn-chart-cashflow" onclick="Dashboard.setChartMode('cashflow')" class="px-3 py-1.5 text-xs font-bold rounded-xl bg-white text-slate-800 shadow-sm border border-slate-200 transition">
                    Masuk vs Keluar
                  </button>
                  <button id="btn-chart-net" onclick="Dashboard.setChartMode('net')" class="px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 transition">
                    Akumulasi Saldo
                  </button>
                </div>
              </div>

              <div class="h-64 sm:h-80 w-full relative">
                <canvas id="cashflowChart"></canvas>
              </div>
            </div>

            <!-- Pos Pengeluaran & Shortcut (1 col) -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <h3 class="font-bold text-slate-900 text-base">Alokasi Pos Pengeluaran</h3>
                  <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Tahun <span class="label-tahun-aktif">2026</span></span>
                </div>
                <p class="text-xs text-slate-400 mb-4">Porsi anggaran biaya operasional lingkungan RT</p>

                <!-- Category Breakdown Progress Bars -->
                <div id="dashboard-expense-categories" class="space-y-3.5">
                  <!-- Generated dynamically -->
                </div>
              </div>

              <!-- Quick Action Shortcuts -->
              <div class="pt-4 border-t border-slate-100 space-y-2">
                <button onclick="App.switchTab('iuran')" class="w-full p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between transition border border-slate-200/60">
                  <span class="flex items-center gap-2">
                    <i data-lucide="layout-grid" class="w-4 h-4 text-emerald-600"></i>
                    <span>Buka Matriks Iuran 200 KK</span>
                  </span>
                  <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>

                <button onclick="App.switchTab('warga')" class="w-full p-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 rounded-xl text-xs font-semibold flex items-center justify-between transition border border-slate-200/60">
                  <span class="flex items-center gap-2">
                    <i data-lucide="users" class="w-4 h-4 text-indigo-600"></i>
                    <span>Daftar Warga Blok J1 - J10</span>
                  </span>
                  <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
              </div>
            </div>

          </div>

          <!-- Recent Transactions Table -->
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 class="font-bold text-slate-900 text-base">Aktivitas Transaksi Terakhir</h3>
                <p class="text-xs text-slate-400">Catatan mutasi kas iuran warga dan pengeluaran terbaru</p>
              </div>
              <button onclick="App.switchTab('transaksi')" class="self-start sm:self-auto px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition flex items-center gap-1.5">
                <span>Buku Kas Lengkap</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead class="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th class="py-3 px-4">Tanggal</th>
                    <th class="py-3 px-4">Jenis</th>
                    <th class="py-3 px-4">Uraian Transaksi</th>
                    <th class="py-3 px-4">Kategori & Metode</th>
                    <th class="py-3 px-4 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody id="dashboard-recent-transactions" class="divide-y divide-slate-100">
                  <!-- Generated dynamically -->
                </tbody>
              </table>
            </div>
          </div>

        </section>

        <!-- ================= TAB: PORTAL PENGUMUMAN & SUSUNAN PENGURUS ================= -->
        <section id="section-pengumuman" class="tab-section hidden space-y-6">
          
          <!-- Hero Banner Portal Pengumuman -->
          <div class="bg-gradient-to-r from-slate-900 via-amber-950 to-orange-950 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div class="absolute -right-8 -bottom-8 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-amber-300 border border-white/10 mb-2">
                  <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span class="label-rt-name font-bold">RT 10 / RW 10</span>
                  <span>•</span>
                  <span>Informasi Resmi & Transparansi Lingkungan</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Portal Pengumuman & Pengurus RT 10</h2>
                <p class="text-xs sm:text-sm text-slate-300 mt-1">Pusat warta kegiatan warga, surat edaran resmi, dan profil susunan kepengurusan RT 10 / RW 10</p>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center gap-2.5">
                <button onclick="PengumumanManager.openAddModal()" class="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5">
                  <i data-lucide="plus-circle" class="w-4 h-4"></i>
                  <span>Buat Pengumuman Baru</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Subtab Navigation Bar -->
          <div class="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <!-- Subtab Buttons -->
            <div class="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button 
                id="subtab-btn-pengumuman" 
                onclick="PengumumanManager.switchSubTab('pengumuman')" 
                class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-md shadow-amber-500/20 transition flex items-center gap-2">
                <i data-lucide="bell" class="w-3.5 h-3.5 text-white"></i>
                <span>Pengumuman Dari Pengurus</span>
              </button>
              <button 
                id="subtab-btn-pengurus" 
                onclick="PengumumanManager.switchSubTab('pengurus')" 
                class="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 font-semibold transition flex items-center gap-2">
                <i data-lucide="users-round" class="w-3.5 h-3.5 text-blue-600"></i>
                <span>Susunan Pengurus RT 10 Rw 10</span>
              </button>
            </div>

            <!-- Context Info -->
            <div class="text-xs text-slate-500 flex items-center gap-2 px-2">
              <i data-lucide="info" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>Kompleks Blok J1 s/d J10 (200 KK)</span>
            </div>
          </div>

          <!-- SUBTAB 1 VIEW: PENGUMUMAN DARI PENGURUS -->
          <div id="subtab-view-pengumuman" class="space-y-5">
            <!-- Filter & Search Bar -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <!-- Category Filter Pills -->
              <div class="flex flex-wrap items-center gap-1.5">
                <button onclick="PengumumanManager.setCategoryFilter('all')" data-cat="all" class="filter-pengumuman-btn px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white shadow-xs transition">
                  Semua Warta
                </button>
                <button onclick="PengumumanManager.setCategoryFilter('Iuran & Keuangan')" data-cat="Iuran & Keuangan" class="filter-pengumuman-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                  Iuran & Keuangan
                </button>
                <button onclick="PengumumanManager.setCategoryFilter('Kerja Bakti & Lingkungan')" data-cat="Kerja Bakti & Lingkungan" class="filter-pengumuman-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                  Kerja Bakti & Lingkungan
                </button>
                <button onclick="PengumumanManager.setCategoryFilter('Keamanan & Ketertiban')" data-cat="Keamanan & Ketertiban" class="filter-pengumuman-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                  Keamanan
                </button>
                <button onclick="PengumumanManager.setCategoryFilter('Sosial & Kesehatan')" data-cat="Sosial & Kesehatan" class="filter-pengumuman-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                  Sosial / Posyandu
                </button>
                <button onclick="PengumumanManager.setCategoryFilter('Olahraga & Kepemudaan')" data-cat="Olahraga & Kepemudaan" class="filter-pengumuman-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                  Olahraga / Pemuda
                </button>
              </div>

              <!-- Search Bar -->
              <div class="relative min-w-[240px]">
                <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  id="search-pengumuman" 
                  placeholder="Cari kata kunci pengumuman..." 
                  class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
              </div>
            </div>

            <!-- Announcements Grid Container -->
            <div id="pengumuman-card-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <!-- Injected by JavaScript -->
            </div>
          </div>

          <!-- SUBTAB 2 VIEW: SUSUNAN PENGURUS RT 10 / RW 10 -->
          <div id="subtab-view-pengurus" class="hidden space-y-6">
            
            <!-- Struktur Banner & Info SK -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-2xl">
                  <i data-lucide="shield-check" class="w-7 h-7"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-extrabold text-slate-900 text-lg">Susunan Pengurus <span class="label-rt-name">RT 10 / RW 10</span></h3>
                    <span class="px-2.5 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">Masa Bakti 2024 – 2027</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-1">Kompleks Blok J (J1 s/d J10) • <span class="label-rt-sub">Kelurahan Sukamaju, Kecamatan Cilodong, Kota Depok</span></p>
                </div>
              </div>

              <!-- Filter Pengurus Pills & Add Button -->
              <div class="flex flex-wrap items-center gap-2">
                <button onclick="PengumumanManager.openAddPengurusModal()" class="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm transition flex items-center gap-1.5" title="Tambah Personalia Pengurus (PIN 1234)">
                  <i data-lucide="user-plus" class="w-4 h-4"></i>
                  <span>Tambah Pengurus</span>
                </button>
                <button onclick="PengumumanManager.setPengurusFilter('all')" data-filter="all" class="filter-pengurus-btn px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-white shadow-xs transition">
                  Semua (<span id="pengurus-count-all">15</span>)
                </button>
                <button onclick="PengumumanManager.setPengurusFilter('inti')" data-filter="inti" class="filter-pengurus-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                  Pengurus Inti
                </button>
                <button onclick="PengumumanManager.setPengurusFilter('seksi')" data-filter="seksi" class="filter-pengurus-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                  Koordinator Seksi
                </button>
                <button onclick="PengumumanManager.setPengurusFilter('blok')" data-filter="blok" class="filter-pengurus-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                  Koordinator Blok
                </button>
              </div>
            </div>

            <!-- Bagan Visual Hirarki Kepengurusan -->
            <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-md">
              <div class="text-center mb-6">
                <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest">Bagan Organisasi</span>
                <h4 class="text-lg font-extrabold text-white">Struktur Pimpinan <span class="label-rt-name">RT 10 / RW 10</span></h4>
              </div>

              <div class="flex flex-col items-center space-y-4">
                <!-- Level 1: Ketua RT -->
                <div class="w-full max-w-xs bg-white text-slate-800 p-4 rounded-2xl shadow-lg border-2 border-emerald-400 text-center">
                  <span class="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-600 text-white rounded-full uppercase">Ketua <span class="label-rt-name">RT 10</span></span>
                  <h4 id="bagan-ketua-nama" class="font-extrabold text-base text-slate-900 mt-1">Bpk. Bambang Sutrisno</h4>
                  <p id="bagan-ketua-sub" class="text-xs text-slate-500 font-medium">Blok J1 No. 01 • Telp: 0813-1987-6543</p>
                </div>

                <div class="w-0.5 h-6 bg-slate-500"></div>

                <!-- Level 2: Sekretaris & Bendahara -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                  <div class="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                    <span class="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 rounded-md">Sekretaris</span>
                    <h5 id="bagan-sekretaris-nama" class="font-bold text-sm text-white mt-1">Bpk. Agus Santoso</h5>
                    <p id="bagan-sekretaris-sub" class="text-xs text-slate-300">Blok J1 No. 03</p>
                  </div>
                  <div class="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
                    <span class="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded-md">Bendahara</span>
                    <h5 id="bagan-bendahara-nama" class="font-bold text-sm text-white mt-1">Bpk. Hendra Wijaya</h5>
                    <p id="bagan-bendahara-sub" class="text-xs text-slate-300">Blok J1 No. 02</p>
                  </div>
                </div>

                <div class="w-0.5 h-6 bg-slate-500"></div>

                <!-- Level 3: Seksi & Komang -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 w-full text-center text-xs">
                  <div class="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <i data-lucide="shield" class="w-4 h-4 mx-auto text-rose-400 mb-1"></i>
                    <strong class="block text-[11px] text-white">Seksi Keamanan</strong>
                    <span class="text-[10px] text-slate-400">Bpk. Slamet Riyadi</span>
                  </div>
                  <div class="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <i data-lucide="trash-2" class="w-4 h-4 mx-auto text-teal-400 mb-1"></i>
                    <strong class="block text-[11px] text-white">Seksi Kebersihan</strong>
                    <span class="text-[10px] text-slate-400">Bpk. Rudi Hermawan</span>
                  </div>
                  <div class="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <i data-lucide="wrench" class="w-4 h-4 mx-auto text-indigo-400 mb-1"></i>
                    <strong class="block text-[11px] text-white">Seksi Sarpras</strong>
                    <span class="text-[10px] text-slate-400">Bpk. Dedi Supriyadi</span>
                  </div>
                  <div class="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <i data-lucide="heart-handshake" class="w-4 h-4 mx-auto text-purple-400 mb-1"></i>
                    <strong class="block text-[11px] text-white">Sosial & PKK</strong>
                    <span class="text-[10px] text-slate-400">Ibu Siti Rahmawati</span>
                  </div>
                  <div class="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <i data-lucide="book-open" class="w-4 h-4 mx-auto text-emerald-400 mb-1"></i>
                    <strong class="block text-[11px] text-white">Kerohanian</strong>
                    <span class="text-[10px] text-slate-400">Ust. Ahmad Fauzi</span>
                  </div>
                  <div class="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <i data-lucide="trophy" class="w-4 h-4 mx-auto text-cyan-400 mb-1"></i>
                    <strong class="block text-[11px] text-white">Pemuda & Olahraga</strong>
                    <span class="text-[10px] text-slate-400">Bpk. Fajar Ramadhan</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile Cards Grid -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <i data-lucide="users" class="w-4 h-4 text-emerald-600"></i>
                  <span>Daftar Lengkap Personalia & Kontak Pengurus RT 10 / RW 10</span>
                </h4>
                <span class="text-xs text-slate-400">Klik tombol WhatsApp untuk komunikasi langsung</span>
              </div>

              <div id="pengurus-grid-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <!-- Injected by JavaScript -->
              </div>
            </div>

            <!-- Sekretariat & Jam Pelayanan Box -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="flex items-start gap-3">
                <div class="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
                  <i data-lucide="map-pin" class="w-5 h-5"></i>
                </div>
                <div>
                  <h5 class="font-bold text-slate-900 text-sm">Sekretariat <span class="label-rt-name">RT 10</span></h5>
                  <p class="text-xs text-slate-500 mt-1">Balai Warga <span class="label-rt-name">RT 10</span> (Depan Taman Bermain Kompleks Blok J), <span class="label-rt-sub">Kelurahan Sukamaju, Kecamatan Cilodong</span>.</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="p-3 rounded-2xl bg-blue-50 text-blue-700">
                  <i data-lucide="clock" class="w-5 h-5"></i>
                </div>
                <div>
                  <h5 class="font-bold text-slate-900 text-sm">Pelayanan Surat Pengantar</h5>
                  <p class="text-xs text-slate-500 mt-1">Senin – Sabtu: 18.30 – 21.00 WIB. Khusus keperluan mendesak dapat menghubungi Sekretaris RT terlebih dahulu.</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="p-3 rounded-2xl bg-rose-50 text-rose-700">
                  <i data-lucide="phone-call" class="w-5 h-5"></i>
                </div>
                <div>
                  <h5 class="font-bold text-slate-900 text-sm">Hotline Keamanan & Pos Satpam</h5>
                  <p class="text-xs text-slate-500 mt-1">Pos Satpam Utama Blok J: <strong>0812-8899-1001</strong> (Aktif 24 Jam Nonstop).</p>
                </div>
              </div>
            </div>

          </div>

        </section>

        <!-- ================= TAB: SUARA WARGA ================= -->
        <section id="section-suarawarga" class="tab-section hidden space-y-6">
          
          <!-- Hero Banner Suara Warga -->
          <div class="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div class="absolute -right-8 -bottom-8 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-purple-300 border border-white/10 mb-2">
                  <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                  <span class="label-rt-name font-bold">RT 10 / RW 10</span>
                  <span>•</span>
                  <span>Ruang Aspirasi & Demokrasi Lingkungan</span>
                </div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-snug">
                  "Setiap Pendapat Berharga, Setiap Aspirasi Bermakna"
                </h2>
                <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  Ruang terbuka dan transparan bagi <span class="label-total-warga">200 KK</span> warga Blok J (J1 s/d J10) untuk menyampaikan keluhan fasilitas, ide kreatif, usulan program, warta warga, maupun kritik membangun demi kemajuan bersama.
                </p>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center gap-2.5">
                <button onclick="document.getElementById('suara-form-card').scrollIntoView({ behavior: 'smooth' }); document.getElementById('suara-judul').focus();" class="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 whitespace-nowrap">
                  <i data-lucide="edit-3" class="w-4 h-4"></i>
                  <span>Tulis Aspirasi (Maks. 100 Kata)</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 4 Highlight Cards Aspirasi -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div class="p-3 bg-purple-50 text-purple-700 rounded-xl">
                <i data-lucide="message-square" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="text-xs text-slate-400 font-medium block">Total Aspirasi</span>
                <h4 id="stat-suara-total" class="text-xl font-extrabold text-slate-900">0</h4>
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div class="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                <i data-lucide="check-circle" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="text-xs text-slate-400 font-medium block">Telah Ditanggapi</span>
                <h4 id="stat-suara-selesai" class="text-xl font-extrabold text-emerald-700">0</h4>
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div class="p-3 bg-blue-50 text-blue-700 rounded-xl">
                <i data-lucide="clock" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="text-xs text-slate-400 font-medium block">Dalam Tindak Lanjut</span>
                <h4 id="stat-suara-proses" class="text-xl font-extrabold text-blue-700">0</h4>
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div class="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <i data-lucide="thumbs-up" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="text-xs text-slate-400 font-medium block">Total Dukungan</span>
                <h4 id="stat-suara-dukungan" class="text-xl font-extrabold text-amber-600">0</h4>
              </div>
            </div>
          </div>

          <!-- FORM PENYAMPAIAN SUARA WARGA -->
          <div id="suara-form-card" class="bg-white p-6 rounded-3xl border border-purple-200 shadow-sm relative overflow-hidden">
            <div class="absolute top-0 right-0 w-48 h-48 bg-purple-50/70 rounded-full blur-3xl pointer-events-none"></div>
            
            <div class="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 class="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <i data-lucide="send" class="w-5 h-5 text-purple-600"></i>
                  <span>Sampaikan Aspirasi, Keluhan, Ide, atau Kritik Anda</span>
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Pendapat Anda didengar oleh Pengurus RT 10 dan terbuka untuk kemaslahatan warga Kompleks Blok J.</p>
              </div>

              <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 text-xs font-bold">
                <i data-lucide="alert-circle" class="w-3.5 h-3.5 text-purple-700"></i>
                <span>Ketentuan: Maksimal 100 Kata</span>
              </div>
            </div>

            <form id="form-kirim-suara" class="space-y-4 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Kategori Aspirasi</label>
                  <select id="suara-kategori" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-semibold">
                    <option value="Keluhan Fasilitas">🛠 Keluhan Fasilitas (Lampu/Got/Jalan)</option>
                    <option value="Ide & Inovasi">💡 Ide & Inovasi Lingkungan</option>
                    <option value="Kritik Konstruktif">⚖️ Kritik Konstruktif Pengurus / Warga</option>
                    <option value="Usulan Warga">📢 Usulan Program Kerja RT</option>
                    <option value="Berita Warga">📰 Berita / Kabar Warga</option>
                  </select>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 mb-1">Blok Rumah Anda</label>
                  <select id="suara-blok" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-semibold">
                    <option value="Blok J1">Blok J1</option>
                    <option value="Blok J2">Blok J2</option>
                    <option value="Blok J3">Blok J3</option>
                    <option value="Blok J4">Blok J4</option>
                    <option value="Blok J5">Blok J5</option>
                    <option value="Blok J6">Blok J6</option>
                    <option value="Blok J7">Blok J7</option>
                    <option value="Blok J8">Blok J8</option>
                    <option value="Blok J9">Blok J9</option>
                    <option value="Blok J10">Blok J10</option>
                  </select>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 mb-1">Nama Lengkap Anda</label>
                  <input type="text" id="suara-pengirim" placeholder="Contoh: Bpk. Bambang / Ibu Ratna" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none">
                  <div class="mt-1 flex items-center gap-1.5">
                    <input type="checkbox" id="suara-anonim" class="rounded text-purple-600 focus:ring-purple-500 w-3.5 h-3.5">
                    <label for="suara-anonim" class="text-[11px] text-slate-500 cursor-pointer">Kirim sebagai Anonim (Nama disamarkan)</label>
                  </div>
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Pokok Permasalahan / Judul Aspirasi</label>
                <input type="text" id="suara-judul" required placeholder="Tuliskan pokok aspirasi secara ringkas, misal: Perbaikan PJU Padam di Pertigaan Blok J3" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold">
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block font-bold text-slate-700">Isi Aspirasi / Saran / Kritik</label>
                  <span id="suara-word-count" class="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    0 / 100 kata
                  </span>
                </div>
                <textarea 
                  id="suara-isi" 
                  required 
                  rows="4" 
                  placeholder="Tuliskan pendapat, keluhan, usulan, berita atau kritik Anda secara santun, jelas, dan konstruktif. Maksimal 100 kata..." 
                  class="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none leading-relaxed text-xs"
                ></textarea>
                <p id="suara-word-warning" class="hidden text-xs text-rose-600 font-bold mt-1"></p>
                <p class="text-[11px] text-slate-400 mt-1">
                  * Sistem otomatis menghitung jumlah kata. Aspirasi yang melebihi 100 kata perlu diringkas sebelum dapat dikirim.
                </p>
              </div>

              <div class="pt-2 flex justify-end">
                <button type="submit" class="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-2">
                  <i data-lucide="send" class="w-4 h-4"></i>
                  <span>Kirim Aspirasi Warga</span>
                </button>
              </div>
            </form>
          </div>

          <!-- FILTER & SEARCH BAR -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <!-- Category Pills -->
            <div class="flex flex-wrap items-center gap-1.5">
              <button onclick="SuaraWargaManager.setCategoryFilter('all')" data-cat="all" class="filter-suara-cat-btn px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-700 text-white shadow-xs transition">
                Semua Aspirasi
              </button>
              <button onclick="SuaraWargaManager.setCategoryFilter('Keluhan Fasilitas')" data-cat="Keluhan Fasilitas" class="filter-suara-cat-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                Keluhan Sarana
              </button>
              <button onclick="SuaraWargaManager.setCategoryFilter('Ide & Inovasi')" data-cat="Ide & Inovasi" class="filter-suara-cat-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                Ide & Inovasi
              </button>
              <button onclick="SuaraWargaManager.setCategoryFilter('Kritik Konstruktif')" data-cat="Kritik Konstruktif" class="filter-suara-cat-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                Kritik Membangun
              </button>
              <button onclick="SuaraWargaManager.setCategoryFilter('Usulan Warga')" data-cat="Usulan Warga" class="filter-suara-cat-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                Usulan Program
              </button>
              <button onclick="SuaraWargaManager.setCategoryFilter('Berita Warga')" data-cat="Berita Warga" class="filter-suara-cat-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                Berita Warga
              </button>
            </div>

            <!-- Status Pills & Search -->
            <div class="flex items-center gap-2">
              <div class="inline-flex p-1 bg-slate-100 rounded-xl text-xs">
                <button onclick="SuaraWargaManager.setStatusFilter('all')" data-status="all" class="filter-suara-status-btn px-3 py-1 rounded-lg bg-slate-800 text-white font-bold transition">
                  Semua
                </button>
                <button onclick="SuaraWargaManager.setStatusFilter('Selesai')" data-status="Selesai" class="filter-suara-status-btn px-3 py-1 rounded-lg text-slate-600 font-semibold hover:text-slate-900 transition">
                  Ditanggapi
                </button>
                <button onclick="SuaraWargaManager.setStatusFilter('Menunggu')" data-status="Menunggu" class="filter-suara-status-btn px-3 py-1 rounded-lg text-slate-600 font-semibold hover:text-slate-900 transition">
                  Menunggu
                </button>
              </div>

              <div class="relative min-w-[200px]">
                <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  id="search-suara" 
                  placeholder="Cari aspirasi..." 
                  class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
              </div>
            </div>
          </div>

          <!-- GRID DAFTAR ASPIRASI WARGA -->
          <div id="suara-warga-card-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Injected dynamically by JavaScript -->
          </div>

        </section>

        <!-- ================= TAB 2: MATRIKS IURAN WARGA ================= -->
        <section id="section-iuran" class="tab-section hidden space-y-6">
          
          <!-- Hero Banner Matriks Iuran -->
          <div class="bg-gradient-to-r from-slate-900 via-blue-950 to-cyan-950 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div class="absolute -right-8 -bottom-8 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-cyan-300 border border-white/10 mb-2">
                  <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span class="label-rt-name font-bold">RT 10 / RW 10</span>
                  <span>•</span>
                  <span>Monitoring Pembayaran Iuran 200 KK</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Matriks Iuran Bulanan Warga</h2>
                <p class="text-xs sm:text-sm text-slate-300 mt-1">Pemantauan transparansi iuran kas per rumah tangga dari Blok J1 hingga J10 (Tarif <span class="label-nominal-iuran">Rp 150.000</span> / bulan)</p>
              </div>

              <!-- Quick action buttons -->
              <div class="flex items-center gap-2.5">
                <button onclick="WargaManager.openAddModal()" class="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 whitespace-nowrap">
                  <i data-lucide="user-plus" class="w-4 h-4"></i>
                  <span>Tambah Warga Baru</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Controls Header -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 class="font-bold text-slate-800 text-base">Filter & Pencarian Matriks Iuran</h3>
              <p class="text-xs text-slate-500">Tabel status pembayaran iuran warga per bulan (Januari - Desember)</p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <!-- Search Warga -->
              <div class="relative min-w-[180px]">
                <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  id="iuran-search-warga" 
                  placeholder="Cari Blok / Nama warga..." 
                  class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>

              <!-- Filter Blok Selector -->
              <select id="iuran-filter-blok" class="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Semua Blok (J1 - J10)</option>
                <option value="Blok J1">Blok J1</option>
                <option value="Blok J2">Blok J2</option>
                <option value="Blok J3">Blok J3</option>
                <option value="Blok J4">Blok J4</option>
                <option value="Blok J5">Blok J5</option>
                <option value="Blok J6">Blok J6</option>
                <option value="Blok J7">Blok J7</option>
                <option value="Blok J8">Blok J8</option>
                <option value="Blok J9">Blok J9</option>
                <option value="Blok J10">Blok J10</option>
              </select>

              <!-- Year Selector -->
              <select id="iuran-matrix-year" class="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="2025">Tahun 2025</option>
                <option value="2026" selected>Tahun 2026</option>
                <option value="2027">Tahun 2027</option>
              </select>

              <!-- Add Warga Button Shortcut -->
              <button onclick="WargaManager.openAddModal()" class="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-1">
                <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
                <span>Tambah Warga</span>
              </button>
            </div>
          </div>

          <!-- Petunjuk Singkat & Swipe Hint -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-1.5 sm:hidden text-[11px] font-semibold text-blue-800 bg-blue-50/90 px-3 py-2 rounded-xl border border-blue-200/60">
              <i data-lucide="chevrons-left-right" class="w-4 h-4 text-blue-600 shrink-0"></i>
              <span>Geser tabel ke samping untuk melihat pembayaran Januari - Desember</span>
            </div>

            <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs bg-slate-100/70 p-3 rounded-xl border border-slate-200 text-slate-600">
              <span class="font-bold text-slate-700">Keterangan:</span>
              <div class="flex items-center gap-1.5">
                <span class="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300"></span>
                <span><strong>Lunas</strong> (Struk WA)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-300"></span>
                <span><strong>Belum</strong> (Catat)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-semibold text-[10px]">Bayar</span>
                <span>Multi-bulan</span>
              </div>
            </div>
          </div>

          <!-- Matrix Table -->
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="overflow-x-auto max-h-[600px] overflow-y-auto table-scroll-container">
              <table class="w-full text-left border-collapse min-w-[780px]">
                <thead class="bg-slate-100 sticky top-0 z-10 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-3 text-center w-10">No</th>
                    <th class="py-3 px-3 w-20">Blok</th>
                    <th class="py-3 px-3 min-w-[150px]">Nama Warga</th>
                    <th class="py-3 px-1.5 text-center w-14">Jan</th>
                    <th class="py-3 px-1.5 text-center w-14">Feb</th>
                    <th class="py-3 px-1.5 text-center w-14">Mar</th>
                    <th class="py-3 px-1.5 text-center w-14">Apr</th>
                    <th class="py-3 px-1.5 text-center w-14">Mei</th>
                    <th class="py-3 px-1.5 text-center w-14">Jun</th>
                    <th class="py-3 px-1.5 text-center w-14">Jul</th>
                    <th class="py-3 px-1.5 text-center w-14">Agu</th>
                    <th class="py-3 px-1.5 text-center w-14">Sep</th>
                    <th class="py-3 px-1.5 text-center w-14">Okt</th>
                    <th class="py-3 px-1.5 text-center w-14">Nov</th>
                    <th class="py-3 px-1.5 text-center w-14">Des</th>
                    <th class="py-3 px-3 text-right w-28">Total Bayar</th>
                    <th class="py-3 px-3 text-center w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody id="iuran-matrix-body" class="divide-y divide-slate-100">
                  <!-- Generated dynamically -->
                </tbody>
              </table>
            </div>

            <!-- Footer Stats -->
            <div class="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
              <div>
                Total Iuran Terkumpul: <strong id="iuran-matrix-summary-total" class="text-emerald-700 text-sm font-bold">Rp 0</strong>
              </div>
              <div class="text-[11px] text-slate-400">
                Pencatatan tersimpan otomatis di browser
              </div>
            </div>
          </div>

        </section>

        <!-- ================= TAB 3: TRANSAKSI (PENGELUARAN & PEMASUKAN LAIN) ================= -->
        <section id="section-transaksi" class="tab-section hidden space-y-6">
          
          <!-- Hero Banner Transaksi Kas -->
          <div class="bg-gradient-to-r from-slate-900 via-rose-950 to-red-950 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div class="absolute -right-8 -bottom-8 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-rose-300 border border-white/10 mb-2">
                  <span class="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                  <span class="label-rt-name font-bold">RT 10 / RW 10</span>
                  <span>•</span>
                  <span>Buku Mutasi Operasional & Kas Masuk</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Pengeluaran Kas & Pemasukan Non-Iuran</h2>
                <p class="text-xs sm:text-sm text-slate-300 mt-1">Pencatatan realisasi belanja lingkungan rutin (keamanan, kebersihan, sarpras) dan pendapatan kas lain</p>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center gap-2.5">
                <button onclick="PengeluaranManager.activeTab === 'pengeluaran' ? PengeluaranManager.openAddExpenseModal() : PengeluaranManager.openAddIncomeModal()" class="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 whitespace-nowrap">
                  <i data-lucide="plus-circle" class="w-4 h-4"></i>
                  <span>Tambah Transaksi Baru</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Tab Buttons & Filters -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <!-- Sub-tab switchers -->
            <div class="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button 
                id="tab-btn-pengeluaran" 
                onclick="PengeluaranManager.switchTab('pengeluaran')" 
                class="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold shadow-md shadow-rose-600/20 transition flex items-center gap-1.5">
                <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 text-white"></i>
                <span>Pengeluaran Kas RT</span>
              </button>
              <button 
                id="tab-btn-pemasukan-lain" 
                onclick="PengeluaranManager.switchTab('pemasukan')" 
                class="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold transition flex items-center gap-1.5">
                <i data-lucide="arrow-down-left" class="w-3.5 h-3.5 text-emerald-600"></i>
                <span>Pemasukan Non-Iuran</span>
              </button>
            </div>

            <!-- Action Controls -->
            <div class="flex flex-wrap items-center gap-3">
              <!-- Filter Category -->
              <select id="filter-category-pengeluaran" class="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium">
                <option value="all">Semua Kategori</option>
              </select>

              <!-- Search -->
              <div class="relative min-w-[180px]">
                <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  id="search-transaksi" 
                  placeholder="Cari transaksi..." 
                  class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
              </div>

              <!-- Button Add Expense / Income -->
              <button onclick="PengeluaranManager.activeTab === 'pengeluaran' ? PengeluaranManager.openAddExpenseModal() : PengeluaranManager.openAddIncomeModal()" class="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-sm transition flex items-center gap-1.5">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Input Cepat</span>
              </button>
            </div>
          </div>

          <!-- Transaction List Table -->
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 id="transaksi-tab-title" class="font-bold text-sm text-slate-800">Daftar Pengeluaran Kas RT</h4>
              <span id="transaksi-total-footer" class="font-bold text-sm text-slate-800">Total: Rp 0</span>
            </div>

            <div class="overflow-x-auto table-scroll-container">
              <table class="w-full text-left min-w-[620px]">
                <thead class="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th class="py-3 px-4 text-center w-12">No</th>
                    <th class="py-3 px-4 w-32">Tanggal</th>
                    <th class="py-3 px-4 w-48">Kategori</th>
                    <th class="py-3 px-4">Uraian & Keterangan</th>
                    <th class="py-3 px-4 text-right w-36">Nominal</th>
                    <th class="py-3 px-4 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody id="transaksi-table-body" class="divide-y divide-slate-100">
                  <!-- Generated dynamically -->
                </tbody>
              </table>
            </div>
          </div>

        </section>

        <!-- ================= TAB 4: DATA WARGA ================= -->
        <section id="section-warga" class="tab-section hidden space-y-6">
          
          <!-- Hero Banner Data Warga -->
          <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div class="absolute -right-8 -bottom-8 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-300 border border-white/10 mb-2">
                  <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  <span class="label-rt-name font-bold">RT 10 / RW 10</span>
                  <span>•</span>
                  <span>Data Pokok Kependudukan & Kepala Keluarga</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Database Warga Blok J1 s/d J10</h2>
                <p class="text-xs sm:text-sm text-slate-300 mt-1">Kelola data 200 Kepala Keluarga, status kepemilikan hunian tetap/kontrak, serta kontak WhatsApp warga</p>
              </div>

              <!-- Quick action buttons -->
              <div class="flex items-center gap-2.5">
                <button onclick="WargaManager.openAddModal()" class="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 whitespace-nowrap">
                  <i data-lucide="user-plus" class="w-4 h-4"></i>
                  <span>Tambah Kepala Keluarga</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <i data-lucide="users" class="w-5 h-5"></i>
              </div>
              <div>
                <p class="text-xs text-slate-400 font-medium">Total Kepala Keluarga</p>
                <h4 id="warga-total-count" class="text-xl font-extrabold text-slate-900">0 KK</h4>
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <i data-lucide="home" class="w-5 h-5"></i>
              </div>
              <div>
                <p class="text-xs text-slate-400 font-medium">Warga Tetap</p>
                <h4 id="warga-tetap-count" class="text-xl font-extrabold text-emerald-600">0 KK</h4>
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <i data-lucide="key" class="w-5 h-5"></i>
              </div>
              <div>
                <p class="text-xs text-slate-400 font-medium">Warga Kontrak / Sewa</p>
                <h4 id="warga-kontrak-count" class="text-xl font-extrabold text-amber-600">0 KK</h4>
              </div>
            </div>
          </div>

          <!-- Table Container -->
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 class="font-bold text-slate-800 text-base">Daftar Warga & Kepala Keluarga</h3>
                <p class="text-xs text-slate-400">Data warga pembayar iuran lingkungan RT</p>
              </div>

              <div class="flex items-center gap-3">
                <div class="relative min-w-[200px]">
                  <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input 
                    type="text" 
                    id="search-warga-list" 
                    placeholder="Cari blok/nama/wa..." 
                    class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                </div>
                <button onclick="WargaManager.openAddModal()" class="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition flex items-center gap-1.5">
                  <i data-lucide="user-plus" class="w-4 h-4"></i>
                  <span>Tambah Warga</span>
                </button>
              </div>
            </div>

            <!-- Pilihan Filter Blok J1 s/d J10 -->
            <div class="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
                <span class="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
                  <i data-lucide="map-pin" class="w-3.5 h-3.5 text-indigo-600"></i>
                  <span>Pilih Blok:</span>
                </span>
                <div class="flex items-center gap-1.5 shrink-0">
                  <button type="button" onclick="WargaManager.setBlokFilter('all')" data-blok="all" class="filter-warga-blok-btn px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-xs transition whitespace-nowrap">
                    Semua (J1 - J10)
                  </button>
                  <button type="button" onclick="WargaManager.setBlokFilter('Blok J1')" data-blok="Blok J1" class="filter-warga-blok-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition whitespace-nowrap">
                    Blok J1
                  </button>
                  <button type="button" onclick="WargaManager.setBlokFilter('Blok J2')" data-blok="Blok J2" class="filter-warga-blok-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition whitespace-nowrap">
                    Blok J2
                  </button>
                  <button type="button" onclick="WargaManager.setBlokFilter('Blok J3')" data-blok="Blok J3" class="filter-warga-blok-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition whitespace-nowrap">
                    Blok J3
                  </button>
                  <button type="button" onclick="WargaManager.setBlokFilter('Blok J4')" data-blok="Blok J4" class="filter-warga-blok-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition whitespace-nowrap">
                    Blok J4
                  </button>
                  <button type="button" onclick="WargaManager.setBlokFilter('Blok J5')" data-blok="Blok J5" class="filter-warga-blok-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition whitespace-nowrap">
                    Blok J5
                  </button>
                  <button type="button" onclick="WargaManager.setBlokFilter('Blok J6')" data-blok="Blok J6" class="filter-warga-blok-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition whitespace-nowrap">
                    Blok J6
                  </button>
                  <button type="button" onclick="WargaManager.setBlokFilter('Blok J7')" data-blok="Blok J7" class="filter-warga-blok-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition whitespace-nowrap">
                    Blok J7
                  </button>
                  <button type="button" onclick="WargaManager.setBlokFilter('Blok J8')" data-blok="Blok J8" class="filter-warga-blok-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition whitespace-nowrap">
                    Blok J8
                  </button>
                  <button type="button" onclick="WargaManager.setBlokFilter('Blok J9')" data-blok="Blok J9" class="filter-warga-blok-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition whitespace-nowrap">
                    Blok J9
                  </button>
                  <button type="button" onclick="WargaManager.setBlokFilter('Blok J10')" data-blok="Blok J10" class="filter-warga-blok-btn px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition whitespace-nowrap">
                    Blok J10
                  </button>
                </div>
              </div>

              <!-- Dropdown Selector Cepat -->
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Dropdown:</span>
                <select id="filter-warga-blok" onchange="WargaManager.setBlokFilter(this.value)" class="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="all">Semua Blok (J1 - J10)</option>
                  <option value="Blok J1">Blok J1</option>
                  <option value="Blok J2">Blok J2</option>
                  <option value="Blok J3">Blok J3</option>
                  <option value="Blok J4">Blok J4</option>
                  <option value="Blok J5">Blok J5</option>
                  <option value="Blok J6">Blok J6</option>
                  <option value="Blok J7">Blok J7</option>
                  <option value="Blok J8">Blok J8</option>
                  <option value="Blok J9">Blok J9</option>
                  <option value="Blok J10">Blok J10</option>
                </select>
              </div>
            </div>

            <div class="overflow-x-auto table-scroll-container">
              <table class="w-full text-left min-w-[650px]">
                <thead class="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th class="py-3 px-4 text-center w-12">No</th>
                    <th class="py-3 px-4 w-28">No. Rumah / Blok</th>
                    <th class="py-3 px-4">Nama Kepala Keluarga</th>
                    <th class="py-3 px-4">No. WhatsApp</th>
                    <th class="py-3 px-4 w-32">Status Rumah</th>
                    <th class="py-3 px-4 text-right w-36">Iuran / Bulan</th>
                    <th class="py-3 px-4 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody id="warga-table-body" class="divide-y divide-slate-100">
                  <!-- Generated dynamically -->
                </tbody>
              </table>
            </div>
          </div>

        </section>

        <!-- ================= TAB 5: LAPORAN & BUKU KAS ================= -->
        <section id="section-laporan" class="tab-section hidden space-y-6">
          
          <!-- Hero Banner Laporan & Audit -->
          <div class="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div class="absolute -right-8 -bottom-8 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-300 border border-white/10 mb-2">
                  <span class="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                  <span class="label-rt-name font-bold">RT 10 / RW 10</span>
                  <span>•</span>
                  <span>Akuntabilitas Publik & Rekapitulasi Kas</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Laporan Keuangan & Buku Kas RT</h2>
                <p class="text-xs sm:text-sm text-slate-300 mt-1">Audit mutasi kas debit/kredit berjalan, cetak laporan bulanan/tahunan, serta monitoring tunggakan iuran warga</p>
              </div>

              <!-- Quick action buttons -->
              <div class="flex flex-wrap items-center gap-2.5">
                <button onclick="LaporanManager.shareReportToWhatsApp()" class="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 whitespace-nowrap" title="Bagikan Ringkasan Laporan Kas ke WhatsApp Warga">
                  <i data-lucide="message-circle" class="w-4 h-4"></i>
                  <span>Share WhatsApp</span>
                </button>
                <button onclick="LaporanManager.openPrintModal()" class="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 whitespace-nowrap">
                  <i data-lucide="printer" class="w-4 h-4"></i>
                  <span>Cetak Laporan Resmi</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Filters & Action Bar -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <!-- Subtab switches -->
            <div class="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button 
                id="subtab-btn-bukukas" 
                onclick="LaporanManager.switchSubTab('bukukas')" 
                class="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-bold shadow-md shadow-teal-600/20 transition flex items-center gap-1.5">
                <i data-lucide="book-open" class="w-3.5 h-3.5 text-white"></i>
                <span>Buku Kas Umum</span>
              </button>
              <button 
                id="subtab-btn-tunggakan" 
                onclick="LaporanManager.switchSubTab('tunggakan')" 
                class="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold transition flex items-center gap-1.5">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-amber-600"></i>
                <span>Rekap Tunggakan Warga</span>
              </button>
            </div>

            <!-- Filters & Export -->
            <div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <!-- Filter Bulan -->
              <select id="laporan-filter-month" class="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="all">Semua Bulan (Setahun)</option>
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>

              <!-- Filter Tahun -->
              <select id="laporan-filter-year" class="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="2025">2025</option>
                <option value="2026" selected>2026</option>
                <option value="2027">2027</option>
              </select>

              <!-- Share WhatsApp Button -->
              <button onclick="LaporanManager.shareReportToWhatsApp()" class="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition flex items-center gap-1.5" title="Kirim Laporan Kas Periode Ini ke Grup WhatsApp RT">
                <i data-lucide="share-2" class="w-4 h-4"></i>
                <span>Share WA</span>
              </button>

              <!-- Salin WA Button -->
              <button onclick="LaporanManager.copyReportWhatsAppText()" class="px-3 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl transition flex items-center gap-1" title="Salin Ringkasan Laporan Format WhatsApp ke Clipboard">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                <span class="hidden sm:inline">Salin WA</span>
              </button>

              <!-- Export Excel -->
              <button onclick="LaporanManager.exportToExcel()" class="px-3.5 py-2 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition flex items-center gap-1.5" title="Unduh data dalam format Excel (.xlsx)">
                <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
                <span class="hidden sm:inline">Excel</span>
              </button>

              <!-- Export SQL -->
              <button onclick="Store.exportBackupSQL()" class="px-3.5 py-2 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl transition flex items-center gap-1.5" title="Unduh data dalam format script database SQL (.sql)">
                <i data-lucide="database" class="w-4 h-4"></i>
                <span class="hidden sm:inline">SQL</span>
              </button>

              <!-- Print Report -->
              <button onclick="LaporanManager.openPrintModal()" class="px-3.5 py-2 text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 rounded-xl shadow-sm transition flex items-center gap-1.5" title="Buka Pratinjau Cetak / PDF">
                <i data-lucide="printer" class="w-4 h-4"></i>
                <span>Cetak</span>
              </button>
            </div>
          </div>

          <!-- VIEW 1: Buku Kas Umum -->
          <div id="laporan-bukukas-view" class="space-y-4">
            <!-- Summary Bar -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                <span class="text-xs text-emerald-800 font-semibold">Total Pemasukan Periode Ini</span>
                <h4 id="bukukas-summary-masuk" class="text-xl font-extrabold text-emerald-700 mt-1">Rp 0</h4>
              </div>
              <div class="bg-rose-50 border border-rose-200 p-4 rounded-xl">
                <span class="text-xs text-rose-800 font-semibold">Total Pengeluaran Periode Ini</span>
                <h4 id="bukukas-summary-keluar" class="text-xl font-extrabold text-rose-700 mt-1">Rp 0</h4>
              </div>
              <div class="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <span class="text-xs text-blue-800 font-semibold">Saldo Kas Berjalan</span>
                <h4 id="bukukas-summary-saldo" class="text-xl font-extrabold text-blue-700 mt-1">Rp 0</h4>
              </div>
            </div>

            <!-- Ledger Table -->
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div class="overflow-x-auto table-scroll-container">
                <table class="w-full text-left min-w-[700px]">
                  <thead class="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th class="py-3 px-3 text-center w-12">No</th>
                      <th class="py-3 px-3 w-28">Tanggal</th>
                      <th class="py-3 px-3 w-36">Kategori</th>
                      <th class="py-3 px-3">Uraian Transaksi</th>
                      <th class="py-3 px-3 text-right w-32 text-emerald-700">Masuk (Rp)</th>
                      <th class="py-3 px-3 text-right w-32 text-rose-700">Keluar (Rp)</th>
                      <th class="py-3 px-3 text-right w-36 font-extrabold">Saldo Kas (Rp)</th>
                    </tr>
                  </thead>
                  <tbody id="bukukas-table-body" class="divide-y divide-slate-100">
                    <!-- Generated dynamically -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- VIEW 2: Rekap Tunggakan Warga -->
          <div id="laporan-tunggakan-view" class="hidden space-y-4">
            <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span class="text-xs text-amber-800 font-semibold">Total Estimasi Tunggakan Iuran</span>
                <h4 id="tunggakan-grand-total" class="text-xl font-extrabold text-amber-700 mt-1">Rp 0</h4>
              </div>
              <p class="text-xs text-amber-800 max-w-sm">Daftar warga yang belum melunasi iuran sampai dengan bulan yang dipilih.</p>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div class="overflow-x-auto table-scroll-container">
                <table class="w-full text-left min-w-[620px]">
                  <thead class="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th class="py-3 px-4 text-center w-12">No</th>
                      <th class="py-3 px-4 w-28">No. Rumah</th>
                      <th class="py-3 px-4">Nama Warga / KK</th>
                      <th class="py-3 px-4">Bulan Menunggak</th>
                      <th class="py-3 px-4 text-right w-36">Total Tunggakan</th>
                      <th class="py-3 px-4 text-center w-28">Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="tunggakan-table-body" class="divide-y divide-slate-100">
                    <!-- Generated dynamically -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </section>

        <!-- ================= TAB 6: PENGATURAN & BACKUP ================= -->
        <section id="section-settings" class="tab-section hidden space-y-6">
          
          <!-- Hero Banner Pengaturan & Database -->
          <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-950 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div class="absolute -right-8 -bottom-8 w-60 h-60 bg-slate-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-slate-300 border border-white/10 mb-2">
                  <span class="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
                  <span class="label-rt-name font-bold">RT 10 / RW 10</span>
                  <span>•</span>
                  <span>Konfigurasi Wilayah & Manajemen Data SQL</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Pengaturan & Cadangan Sistem RT</h2>
                <p class="text-xs sm:text-sm text-slate-300 mt-1">Sesuaikan identitas pengurus, tarif iuran baku, dan ekspor/impor berkas cadangan database SQL & JSON</p>
              </div>

              <!-- Quick action buttons -->
              <div class="flex items-center gap-2.5">
                <button onclick="Store.exportBackupSQL()" class="px-4 py-2.5 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 whitespace-nowrap border border-slate-600/50">
                  <i data-lucide="database" class="w-4 h-4 text-cyan-400"></i>
                  <span>Unduh File SQL</span>
                </button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Form Pengaturan RT (2 cols) -->
            <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 class="font-bold text-slate-800 text-lg mb-1">Identitas & Pengaturan RT</h3>
              <p class="text-xs text-slate-400 mb-6">Data ini akan muncul di kop surat laporan dan kwitansi resmi iuran.</p>

              <form id="form-settings" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Nama Rukun Tetangga (RT/RW)</label>
                    <input type="text" id="setting-nama-rt" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Kelurahan / Desa</label>
                    <input type="text" id="setting-kelurahan" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Kecamatan</label>
                    <input type="text" id="setting-kecamatan" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Kota / Kabupaten</label>
                    <input type="text" id="setting-kota" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Nama Ketua RT</label>
                    <input type="text" id="setting-ketua-rt" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Nama Bendahara RT</label>
                    <input type="text" id="setting-bendahara" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Tarif Iuran Standar (Rp/Bulan)</label>
                    <input type="number" id="setting-nominal-iuran" required min="0" step="1000" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Tahun Aktif Pembukuan</label>
                    <input type="number" id="setting-tahun-aktif" required min="2020" max="2035" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Rincian Pos Iuran (Muncul di Struk/Kwitansi)</label>
                  <input type="text" id="setting-rincian-iuran" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Kebersihan/Sampah, Keamanan, Kas RT">
                </div>

                <div class="pt-2">
                  <button type="submit" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
                    Simpan Pengaturan
                  </button>
                </div>
              </form>
            </div>

            <!-- Backup, Restore & Reset (1 col) -->
            <div class="space-y-6">
              <!-- Backup & Restore Database SQL (UTAMA) -->
              <div class="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <div class="flex items-center justify-between mb-1.5">
                  <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                    <i data-lucide="database" class="w-5 h-5 text-indigo-600"></i>
                    <span>Database SQL (kas-rt.sql)</span>
                  </h3>
                  <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold rounded-lg flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Auto-Sync</span>
                  </span>
                </div>
                <p class="text-xs text-slate-500 mb-4">Setiap penambahan, pengeditan, atau pembayaran iuran otomatis tersimpan ke file <code>kas-rt.sql</code> di folder aplikasi.</p>

                <div class="space-y-2.5">
                  <button id="btn-download-sql" class="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition">
                    <i data-lucide="download" class="w-4 h-4"></i>
                    <span>Unduh Berkas kas-rt.sql</span>
                  </button>

                  <div class="grid grid-cols-2 gap-2">
                    <button id="btn-view-sql" class="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition">
                      <i data-lucide="code" class="w-4 h-4"></i>
                      <span>Pratinjau SQL</span>
                    </button>
                    <button id="btn-download-sql-log" class="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition" title="Lihat riwayat perintah SQL">
                      <i data-lucide="history" class="w-4 h-4"></i>
                      <span>Log Riwayat SQL</span>
                    </button>
                  </div>

                  <div class="pt-3 border-t border-slate-100">
                    <label class="block text-xs font-bold text-slate-700 mb-1">Pulihkan / Import dari Berkas SQL (.sql):</label>
                    <input type="file" id="file-restore-sql" accept=".sql" class="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer">
                  </div>
                </div>
              </div>

              <!-- Backup & Restore JSON (Alternatif) -->
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 class="font-bold text-slate-700 text-sm mb-1">Cadangan Berkas JSON (Alternatif)</h3>
                <p class="text-xs text-slate-400 mb-3">Format cadangan alternatif jika ingin memindahkan data ke browser lain.</p>

                <div class="space-y-2.5">
                  <button id="btn-download-backup" class="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition">
                    <i data-lucide="download" class="w-4 h-4 text-slate-500"></i>
                    <span>Download Cadangan JSON</span>
                  </button>

                  <div class="pt-2 border-t border-slate-100">
                    <label class="block text-[11px] font-bold text-slate-600 mb-1">Pulihkan dari JSON:</label>
                    <input type="file" id="file-restore-backup" accept=".json" class="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer">
                  </div>
                </div>
              </div>

              <!-- Reset Data -->
              <div class="bg-rose-50/50 p-6 rounded-2xl border border-rose-200">
                <h3 class="font-bold text-rose-800 text-base mb-1">Reset ke Data Awal</h3>
                <p class="text-xs text-rose-600 mb-4">Menghapus data saat ini dan mengembalikannya ke contoh data default.</p>
                
                <button id="btn-reset-sample-data" class="w-full p-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-sm">
                  Reset Data Kas RT
                </button>
              </div>

              <!-- Informasi Pengembang & Layanan Teknis -->
              <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-sm">
                <div class="flex items-center gap-2.5 mb-2">
                  <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-white text-sm">Pengembang & Dukungan Sistem</h3>
                    <p class="text-[10px] text-slate-400">Teknologi & Layanan Cetak Digital</p>
                  </div>
                </div>
                <p class="text-xs text-slate-300 mb-3.5 leading-relaxed">
                  Portal Kas & Warta Warga RT ini dikembangkan dan didukung penuh oleh:
                </p>

                <div class="space-y-2">
                  <a href="https://dutaglobaltech.com" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition group" title="Kunjungi dutaglobaltech.com">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <i data-lucide="globe" class="w-3.5 h-3.5"></i>
                      </div>
                      <div class="min-w-0">
                        <span class="text-xs font-bold text-white group-hover:text-emerald-300 block truncate">dutaglobaltech.com</span>
                        <span class="text-[10px] text-slate-400 block truncate">IT Solutions, Cloud & Software Development</span>
                      </div>
                    </div>
                    <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 ml-2"></i>
                  </a>

                  <a href="https://mysnaprint.dutaglobaltech.com" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition group" title="Kunjungi mysnaprint.dutaglobaltech.com">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div class="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                      </div>
                      <div class="min-w-0">
                        <span class="text-xs font-bold text-white group-hover:text-blue-300 block truncate">mysnaprint.dutaglobaltech.com</span>
                        <span class="text-[10px] text-slate-400 block truncate">Solusi Cetak Digital & Pencetakan Cepat</span>
                      </div>
                    </div>
                    <i data-lucide="external-link" class="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 ml-2"></i>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </section>

        <!-- Global Portal Footer -->
        <footer class="mt-8 pt-6 pb-2 border-t border-slate-200/90 text-center text-xs text-slate-500">
          <div class="flex flex-col md:flex-row items-center justify-between gap-3 px-2">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="font-bold text-slate-700 label-rt-name">RT 10 / RW 10</span>
              <span class="text-slate-400 hidden sm:inline">•</span>
              <span class="label-rt-sub hidden sm:inline">Kelurahan Sukamaju, Kecamatan Cilodong, Kota Depok</span>
            </div>
            
            <div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs">
              <span class="text-slate-500 font-medium">Developed and support by:</span>
              <a href="https://dutaglobaltech.com" target="_blank" rel="noopener noreferrer" class="font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 transition">
                <span>dutaglobaltech.com</span>
              </a>
              <span class="text-slate-300">&bull;</span>
              <a href="https://mysnaprint.dutaglobaltech.com" target="_blank" rel="noopener noreferrer" class="font-bold text-blue-700 hover:text-blue-800 hover:underline inline-flex items-center gap-1 transition">
                <span>mysnaprint.dutaglobaltech.com</span>
              </a>
            </div>
          </div>
          <p class="text-[11px] text-slate-400 mt-2">© <span class="label-tahun-aktif">2026</span> Sistem Informasi Kas & Suara Warga RT. All rights reserved.</p>
        </footer>

      </div>
    </main>
  </div>

  <!-- MOBILE BOTTOM NAVIGATION BAR (Sticky Touch Bar for Phone Views) -->
  <nav id="mobile-bottom-nav" class="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 sm:px-4 py-1.5 flex lg:hidden items-center justify-around shadow-2xl" aria-label="Navigasi Cepat Mobile">
    <button onclick="App.switchTab('dashboard')" data-mobile-tab="dashboard" class="mobile-nav-item active" aria-label="Tab Dashboard">
      <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
      <span>Kas RT</span>
    </button>

    <button onclick="App.switchTab('pengumuman')" data-mobile-tab="pengumuman" class="mobile-nav-item" aria-label="Tab Warta">
      <i data-lucide="megaphone" class="w-4 h-4"></i>
      <span>Warta</span>
    </button>

    <button onclick="App.switchTab('iuran')" data-mobile-tab="iuran" class="mobile-nav-item" aria-label="Tab Matriks Iuran">
      <i data-lucide="calendar-check" class="w-4 h-4"></i>
      <span>Iuran</span>
    </button>

    <button onclick="App.switchTab('suarawarga')" data-mobile-tab="suarawarga" class="mobile-nav-item" aria-label="Tab Suara Warga">
      <i data-lucide="message-square-quote" class="w-4 h-4"></i>
      <span>Suara</span>
    </button>

    <button id="btn-bottom-menu" class="mobile-nav-item" aria-label="Buka Semua Menu">
      <i data-lucide="menu" class="w-4 h-4"></i>
      <span>Menu</span>
    </button>
  </nav>

  <!-- ================= MODALS ================= -->

  <!-- 1. Modal Quick Pay Single Month -->
  <div id="modal-quick-pay" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto flex flex-col max-h-[92vh]">
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-bold text-base text-slate-800">Catat Pembayaran Iuran</h3>
        <button onclick="IuranManager.closeModal('modal-quick-pay')" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <form onsubmit="IuranManager.submitQuickPay(event)" class="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
        <input type="hidden" id="quick-pay-warga-id">
        <input type="hidden" id="quick-pay-month">
        <input type="hidden" id="quick-pay-year">

        <div id="quick-pay-warga-info"></div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Tanggal Pembayaran</label>
          <input type="date" id="quick-pay-tanggal" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Nominal Iuran (Rp)</label>
          <input type="number" id="quick-pay-nominal" required min="0" step="1000" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-800">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Metode Pembayaran</label>
          <select id="quick-pay-metode" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
            <option value="Transfer / QRIS">Transfer Bank / QRIS</option>
            <option value="Tunai / Cash">Tunai / Cash</option>
            <option value="Titip Petugas">Titip Petugas Lingkungan</option>
          </select>
        </div>

        <div class="pt-3 flex gap-2">
          <button type="button" onclick="IuranManager.closeModal('modal-quick-pay')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition">
            Batal
          </button>
          <button type="submit" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
            Simpan Pembayaran
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 2. Modal Batch Pay Multiple Months -->
  <div id="modal-batch-pay" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto max-h-[92vh] flex flex-col">
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-bold text-base text-slate-800">Pembayaran Iuran Sekaligus (Multi-Bulan)</h3>
        <button onclick="IuranManager.closeModal('modal-batch-pay')" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <form onsubmit="IuranManager.submitBatchPay(event)" class="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
        <input type="hidden" id="batch-pay-warga-id">
        <input type="hidden" id="batch-pay-year">

        <div id="batch-pay-warga-info"></div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">Pilih Bulan yang Ingin Dibayar:</label>
          <div id="batch-pay-months-container" class="grid grid-cols-2 sm:grid-cols-3 gap-2"></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Tanggal Bayar</label>
            <input type="date" id="batch-pay-tanggal" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Metode</label>
            <select id="batch-pay-metode" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              <option value="Transfer / QRIS">Transfer Bank / QRIS</option>
              <option value="Tunai / Cash">Tunai / Cash</option>
            </select>
          </div>
        </div>

        <!-- Total Calculation Card -->
        <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
          <div>
            <span class="text-xs text-emerald-800">Total Periode Dipilih:</span>
            <h5 id="batch-pay-selected-count" class="font-bold text-emerald-900 text-sm">0 Bulan</h5>
          </div>
          <div class="text-right">
            <span class="text-xs text-emerald-800">Total Nominal:</span>
            <h4 id="batch-pay-total-amount" class="text-lg font-extrabold text-emerald-700">Rp 0</h4>
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button type="button" onclick="IuranManager.closeModal('modal-batch-pay')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition">
            Batal
          </button>
          <button type="submit" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
            Konfirmasi Pelunasan
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 3. Modal Receipt & WhatsApp Slip Preview -->
  <div id="modal-receipt" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto max-h-[95vh] flex flex-col">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 class="font-bold text-sm text-slate-800 flex items-center gap-2">
          <i data-lucide="receipt" class="w-4 h-4 text-emerald-600"></i>
          <span>Kwitansi / Bukti Pembayaran Iuran</span>
        </h3>
        <button onclick="IuranManager.closeModal('modal-receipt')" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-100/60">
        <div id="receipt-preview-content"></div>
      </div>

      <div class="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <button id="btn-delete-receipt-payment" class="order-2 sm:order-1 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition text-center">
          Batalkan Transaksi
        </button>

        <div class="order-1 sm:order-2 flex items-center gap-2 justify-end w-full sm:w-auto">
          <button id="btn-copy-wa-receipt" class="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            <span>Salin Teks WA</span>
          </button>
          
          <button id="btn-send-wa-receipt" class="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5">
            <i data-lucide="send" class="w-3.5 h-3.5"></i>
            <span>Kirim WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. Modal Add Expense -->
  <div id="modal-add-expense" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto flex flex-col max-h-[92vh]">
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-bold text-base text-slate-800 flex items-center gap-2">
          <span class="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><i data-lucide="minus-circle" class="w-4 h-4"></i></span>
          <span>Catat Pengeluaran RT</span>
        </h3>
        <button onclick="PengeluaranManager.closeModal('modal-add-expense')" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <form id="form-add-expense" onsubmit="PengeluaranManager.submitAddExpense(event)" class="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Tanggal Pengeluaran</label>
          <input type="date" id="add-expense-tanggal" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Kategori Pengeluaran</label>
          <select id="add-expense-category" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"></select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Uraian / Keterangan Pembelian / Biaya</label>
          <input type="text" id="add-expense-uraian" required placeholder="Contoh: Honor Petugas Sampah, Beli 3 Lampu PJU, dll." class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Nominal (Rp)</label>
          <input type="number" id="add-expense-nominal" required min="1000" step="1000" placeholder="0" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold text-rose-700">
        </div>

        <div class="pt-3 flex gap-2">
          <button type="button" onclick="PengeluaranManager.closeModal('modal-add-expense')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition">
            Batal
          </button>
          <button type="submit" class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
            Simpan Pengeluaran
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 5. Modal Add Other Income -->
  <div id="modal-add-income" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto max-h-[92vh] flex flex-col">
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-bold text-base text-slate-800 flex items-center gap-2">
          <span class="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><i data-lucide="plus-circle" class="w-4 h-4"></i></span>
          <span>Catat Pemasukan Non-Iuran</span>
        </h3>
        <button onclick="PengeluaranManager.closeModal('modal-add-income')" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <form id="form-add-income" onsubmit="PengeluaranManager.submitAddIncome(event)" class="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Tanggal Penerimaan</label>
          <input type="date" id="add-income-tanggal" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Kategori Pemasukan</label>
          <select id="add-income-category" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"></select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Uraian / Sumber Dana</label>
          <input type="text" id="add-income-uraian" required placeholder="Contoh: Donasi Bpk. X untuk Pos Kamling, Kas Sisa Tahun Lalu" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Nominal (Rp)</label>
          <input type="number" id="add-income-nominal" required min="1000" step="1000" placeholder="0" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-emerald-700">
        </div>

        <div class="pt-3 flex gap-2">
          <button type="button" onclick="PengeluaranManager.closeModal('modal-add-income')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition">
            Batal
          </button>
          <button type="submit" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
            Simpan Pemasukan
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 6. Modal Edit Transaction -->
  <div id="modal-edit-transaksi" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto max-h-[92vh] flex flex-col">
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-bold text-base text-slate-800">Edit Transaksi</h3>
        <button onclick="PengeluaranManager.closeModal('modal-edit-transaksi')" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <form onsubmit="PengeluaranManager.submitEdit(event)" class="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
        <input type="hidden" id="edit-tx-id">

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
          <input type="date" id="edit-tx-tanggal" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
          <select id="edit-tx-kategori" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"></select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Uraian Transaksi</label>
          <input type="text" id="edit-tx-uraian" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Nominal (Rp)</label>
          <input type="number" id="edit-tx-nominal" required min="1" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold">
        </div>

        <div class="pt-3 flex gap-2">
          <button type="button" onclick="PengeluaranManager.closeModal('modal-edit-transaksi')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition">
            Batal
          </button>
          <button type="submit" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
            Perbarui
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 7. Modal Add/Edit Warga -->
  <div id="modal-warga" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto max-h-[92vh] flex flex-col">
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 id="modal-warga-title" class="font-bold text-base text-slate-800">Tambah Data Warga</h3>
        <button onclick="WargaManager.closeModal()" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <form id="form-warga" onsubmit="WargaManager.submitForm(event)" class="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Pilihan Blok <span class="text-rose-500">*</span></label>
            <select id="warga-select-blok" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold bg-white text-slate-800">
              <option value="Blok J1">Blok J1</option>
              <option value="Blok J2">Blok J2</option>
              <option value="Blok J3">Blok J3</option>
              <option value="Blok J4">Blok J4</option>
              <option value="Blok J5">Blok J5</option>
              <option value="Blok J6">Blok J6</option>
              <option value="Blok J7">Blok J7</option>
              <option value="Blok J8">Blok J8</option>
              <option value="Blok J9">Blok J9</option>
              <option value="Blok J10">Blok J10</option>
              <option value="lainnya">-- Blok Lainnya / Kustom --</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">No. Rumah <span class="text-rose-500">*</span></label>
            <input type="text" id="warga-no-rumah" required placeholder="Contoh: No. 01 / No. 12" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800">
          </div>
        </div>

        <div id="warga-custom-blok-container" class="hidden">
          <label class="block text-xs font-bold text-slate-700 mb-1">Nama Blok Kustom</label>
          <input type="text" id="warga-custom-blok" placeholder="Ketik nama blok jika di luar J1-J10" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        </div>
        <input type="hidden" id="warga-blok">

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Nama Kepala Keluarga (KK)</label>
          <input type="text" id="warga-nama" required placeholder="Nama Lengkap" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
          <input type="text" id="warga-telp" placeholder="08xxxxxxxxxx" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Status Rumah</label>
            <select id="warga-status" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              <option value="Tetap">Tetap (Pemilik)</option>
              <option value="Kontrak">Kontrak / Sewa</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Iuran / Bulan (Rp)</label>
            <input type="number" id="warga-nominal" required min="0" step="1000" class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold">
          </div>
        </div>

        <div class="pt-3 flex gap-2">
          <button type="button" onclick="WargaManager.closeModal()" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition">
            Batal
          </button>
          <button type="submit" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
            Simpan Warga
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 8. Modal Print Report Preview -->
  <div id="modal-print-report" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto max-h-[95vh] flex flex-col">
      <div class="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
        <h3 class="font-bold text-sm text-slate-800 flex items-center gap-2">
          <i data-lucide="printer" class="w-4 h-4 text-emerald-600"></i>
          <span>Pratinjau Laporan Cetak (Print View)</span>
        </h3>
        <button onclick="LaporanManager.closeModal('modal-print-report')" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="p-3 sm:p-6 overflow-y-auto flex-1 bg-slate-100 table-scroll-container">
        <div id="print-report-content" class="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-slate-200 max-w-4xl mx-auto min-w-[320px]"></div>
      </div>

      <div class="p-3.5 sm:p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 no-print">
        <button onclick="LaporanManager.closeModal('modal-print-report')" class="order-3 sm:order-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition text-center">
          Tutup Pratinjau
        </button>

        <div class="flex flex-wrap items-center gap-2 order-1 sm:order-2">
          <button onclick="LaporanManager.shareReportToWhatsApp()" class="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5" title="Bagikan Laporan ke WhatsApp">
            <i data-lucide="share-2" class="w-4 h-4"></i>
            <span>Share WhatsApp</span>
          </button>

          <button onclick="LaporanManager.copyReportWhatsAppText()" class="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5" title="Salin Ringkasan Format WhatsApp">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            <span>Salin WA</span>
          </button>

          <button onclick="LaporanManager.triggerPrint()" class="flex-1 sm:flex-initial px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2">
            <i data-lucide="printer" class="w-4 h-4"></i>
            <span>Cetak (Print / PDF)</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Preview SQL -->
  <div id="modal-view-sql" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto max-h-[90vh] flex flex-col">
      <div class="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h3 class="font-bold text-sm text-slate-800 flex items-center gap-2">
          <i data-lucide="database" class="w-4 h-4 text-indigo-600"></i>
          <span>Pratinjau Berkas Database SQL (kas-rt.sql)</span>
        </h3>
        <button onclick="document.getElementById('modal-view-sql').classList.add('hidden'); document.getElementById('modal-view-sql').classList.remove('flex');" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <div class="p-4 overflow-y-auto flex-1 bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed table-scroll-container">
        <pre id="sql-preview-content" class="whitespace-pre-wrap select-all"></pre>
      </div>
      <div class="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <span class="text-xs text-slate-500 truncate">Berkas: <code class="bg-slate-100 px-2 py-0.5 rounded text-slate-700">kas-rt.sql</code></span>
        <div class="flex items-center gap-2">
          <button onclick="navigator.clipboard.writeText(document.getElementById('sql-preview-content').innerText); showToast('Script SQL berhasil disalin!', 'success');" class="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition text-center">
            Salin Script SQL
          </button>
          <button onclick="Store.exportBackupSQL()" class="flex-1 sm:flex-initial px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>Unduh .sql</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Detail Pengumuman -->
  <div id="modal-detail-pengumuman" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto max-h-[90vh] flex flex-col">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h4 class="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <i data-lucide="megaphone" class="w-4 h-4 text-emerald-600"></i>
          <span>Warta Resmi Pengurus <span class="label-rt-name">RT 10 / RW 10</span></span>
        </h4>
        <button onclick="PengumumanManager.closeModal('modal-detail-pengumuman')" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div id="detail-pengumuman-content" class="p-4 sm:p-6 overflow-y-auto flex-1">
        <!-- Injected dynamically -->
      </div>
    </div>
  </div>

  <!-- Modal Tambah Pengumuman Baru -->
  <div id="modal-add-pengumuman" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto max-h-[90vh] flex flex-col">
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 class="font-extrabold text-slate-900 text-base">Buat Warta & Pengumuman Baru</h3>
          <p class="text-xs text-slate-400">Publikasikan informasi resmi untuk 200 KK warga Blok J</p>
        </div>
        <button onclick="PengumumanManager.closeModal('modal-add-pengumuman')" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="form-add-pengumuman" class="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Judul Pengumuman</label>
          <input type="text" id="add-ann-judul" required placeholder="Contoh: Jadwal Kerja Bakti Kebersihan Lingkungan" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Kategori Warta</label>
            <select id="add-ann-kategori" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              <option value="Iuran & Keuangan">Iuran & Keuangan</option>
              <option value="Kerja Bakti & Lingkungan">Kerja Bakti & Lingkungan</option>
              <option value="Keamanan & Ketertiban">Keamanan & Ketertiban</option>
              <option value="Sosial & Kesehatan">Sosial & Kesehatan</option>
              <option value="Olahraga & Kepemudaan">Olahraga & Kepemudaan</option>
              <option value="Informasi Umum">Informasi Umum</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Tanggal Terbit</label>
            <input type="date" id="add-ann-tanggal" required class="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Diterbitkan Oleh (Pengirim)</label>
          <input type="text" id="add-ann-pengirim" required value="Pengurus RT 10 / RW 10" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Isi Pesan / Maklumat Pengumuman</label>
          <textarea id="add-ann-isi" required rows="5" placeholder="Tuliskan isi pengumuman secara rinci..." class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"></textarea>
        </div>

        <div class="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <input type="checkbox" id="add-ann-pinned" class="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4">
          <label for="add-ann-pinned" class="font-bold text-amber-900 cursor-pointer">Sematkan sebagai Pengumuman Penting (Pinned di Atas)</label>
        </div>

        <div class="pt-3 flex gap-2">
          <button type="button" onclick="PengumumanManager.closeModal('modal-add-pengumuman')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition">
            Batal
          </button>
          <button type="submit" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition">
            Publikasikan Warta
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Tanggapan Pengurus Suara Warga -->
  <div id="modal-tanggapan-suara" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto max-h-[90vh] flex flex-col">
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 class="font-extrabold text-slate-900 text-base" id="tanggapan-modal-title">Beri Tanggapan Resmi Pengurus</h3>
          <p class="text-xs text-slate-400">Respon transparan pengurus RT 10 atas aspirasi warga</p>
        </div>
        <button onclick="SuaraWargaManager.closeModal('modal-tanggapan-suara')" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form onsubmit="event.preventDefault(); SuaraWargaManager.handleTanggapanSubmit();" class="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
        <input type="hidden" id="tanggapan-suara-id">

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Status Tindak Lanjut</label>
            <select id="tanggapan-status" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold">
              <option value="Ditindaklanjuti">⏳ Sedang Ditindaklanjuti</option>
              <option value="Selesai">✓ Selesai Dilaksanakan</option>
              <option value="Ditanggapi">💬 Telah Ditanggapi / Dicatat</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Pejabat Penjawab</label>
            <input type="text" id="tanggapan-penjawab" required class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none">
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Isi Pesan Tanggapan / Solusi</label>
          <textarea id="tanggapan-pesan" required rows="4" placeholder="Jelaskan langkah solusi atau penjelasan pengurus secara jelas dan santun..." class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none leading-relaxed"></textarea>
        </div>

        <div class="pt-3 flex gap-2">
          <button type="button" onclick="SuaraWargaManager.closeModal('modal-tanggapan-suara')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition">
            Batal
          </button>
          <button type="submit" class="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-sm transition">
            Kirimkan Tanggapan
          </button>
        </div>
      </form>
    </div>
  <!-- Modal 13: Tambah / Edit Susunan Pengurus RT -->
  <div id="modal-pengurus" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto flex flex-col max-h-[92vh]">
      <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            <i data-lucide="user-check" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 id="modal-pengurus-title" class="font-extrabold text-sm sm:text-base text-slate-800">Tambah Personalia Pengurus RT</h3>
            <p class="text-[11px] text-slate-500">Susunan Pengurus RT 10 / RW 10 Blok J1–J10</p>
          </div>
        </div>
        <button type="button" onclick="PengumumanManager.closeModal('modal-pengurus')" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="form-pengurus" onsubmit="event.preventDefault(); PengumumanManager.handlePengurusSubmit();" class="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
        <input type="hidden" id="pengurus-id">

        <div>
          <label class="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar <span class="text-rose-500">*</span></label>
          <input type="text" id="pengurus-nama" required placeholder="Contoh: Bpk. Bambang Sutrisno" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Jabatan <span class="text-rose-500">*</span></label>
            <input type="text" id="pengurus-jabatan" required list="pengurus-jabatan-list" placeholder="Contoh: Ketua RT 10" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold">
            <datalist id="pengurus-jabatan-list">
              <option value="Ketua RT 10">
              <option value="Wakil Ketua RT 10">
              <option value="Sekretaris RT 10">
              <option value="Bendahara RT 10">
              <option value="Koordinator Keamanan & Ketertiban">
              <option value="Anggota Seksi Keamanan">
              <option value="Koordinator Kebersihan & Lingkungan Hidup">
              <option value="Anggota Seksi Kebersihan">
              <option value="Koordinator Sarana & Prasarana">
              <option value="Koordinator Sosial, Humas & PKK">
              <option value="Humas & Komunikasi Publik">
              <option value="Koordinator Kerohanian & PHBI">
              <option value="Koordinator Olahraga & Kepemudaan">
              <option value="Koordinator Wilayah Blok J1 - J3">
              <option value="Koordinator Wilayah Blok J4 - J7">
              <option value="Koordinator Wilayah Blok J8 - J10">
            </datalist>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Kategori Kepengurusan <span class="text-rose-500">*</span></label>
            <select id="pengurus-kategori" required class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold">
              <option value="inti">Pengurus Inti (Pimpinan)</option>
              <option value="seksi">Koordinator Seksi</option>
              <option value="blok">Koordinator Wilayah Blok</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Blok / Domisili Rumah <span class="text-rose-500">*</span></label>
            <input type="text" id="pengurus-blok" required placeholder="Contoh: Blok J1 No. 01" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">No. WhatsApp / HP <span class="text-rose-500">*</span></label>
            <input type="text" id="pengurus-telp" required placeholder="08xxxxxxxxxx" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Badge Singkat <span class="text-rose-500">*</span></label>
            <input type="text" id="pengurus-badge" required placeholder="Contoh: Pimpinan Utama" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Warna Aksen & Avatar</label>
            <select id="pengurus-theme-color" class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold">
              <option value="emerald">Hijau Emerald (Pimpinan / Utama)</option>
              <option value="blue">Biru Samudra (Administrasi)</option>
              <option value="amber">Kuning Amber (Keuangan)</option>
              <option value="rose">Merah Mawar (Keamanan)</option>
              <option value="teal">Hijau Teal (Kebersihan / Lingkungan)</option>
              <option value="indigo">Biru Indigo (Sarana Prasarana)</option>
              <option value="purple">Ungu Lavender (Sosial & Humas)</option>
              <option value="cyan">Biru Cyan (Pemuda & Olahraga)</option>
              <option value="slate">Abu-abu Slate (Koordinator Blok)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Tugas & Tanggung Jawab <span class="text-rose-500">*</span></label>
          <textarea id="pengurus-tugas" required rows="3" placeholder="Uraikan tugas, wewenang, dan tanggung jawab posisi ini..." class="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"></textarea>
        </div>

        <!-- KEAMANAN PIN 1234 -->
        <div class="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl">
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <i data-lucide="lock" class="w-4 h-4 text-amber-700"></i>
              <span>PIN Keamanan Pengurus (4 Digit)</span>
              <span class="text-rose-600">*</span>
            </label>
            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 border border-amber-300">PIN: 1234</span>
          </div>
          <input type="password" id="pengurus-pin" required maxlength="4" placeholder="Ketik PIN (1234)" class="w-full p-2.5 text-center text-sm font-extrabold tracking-widest rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white">
          <p class="text-[11px] text-amber-800 mt-1">Hanya pengurus resmi yang memiliki PIN <strong>1234</strong> yang dapat menyimpan atau memperbarui personalia RT.</p>
        </div>

        <div class="pt-2 flex gap-2">
          <button type="button" onclick="PengumumanManager.closeModal('modal-pengurus')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition">
            Batal
          </button>
          <button type="submit" class="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5">
            <i data-lucide="save" class="w-4 h-4"></i>
            <span id="btn-save-pengurus-text">Simpan Pengurus</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 14: Konfirmasi Hapus Susunan Pengurus RT dengan PIN -->
  <div id="modal-delete-pengurus" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 modal-dialog-responsive my-auto flex flex-col">
      <div class="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-sm">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-extrabold text-sm sm:text-base text-slate-900">Hapus Personalia Pengurus</h3>
            <p class="text-[11px] text-rose-700">Tindakan ini memerlukan verifikasi PIN</p>
          </div>
        </div>
        <button type="button" onclick="PengumumanManager.closeModal('modal-delete-pengurus')" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form onsubmit="event.preventDefault(); PengumumanManager.handleDeletePengurusConfirm();" class="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
        <input type="hidden" id="delete-pengurus-id">

        <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 leading-relaxed">
          <p>Apakah Anda yakin ingin menghapus data pengurus berikut dari susunan resmi RT 10 / RW 10?</p>
          <div class="mt-2.5 p-2.5 bg-white rounded-xl border border-slate-200">
            <p class="font-extrabold text-slate-900 text-sm" id="delete-pengurus-nama-label">-</p>
            <p class="text-xs font-semibold text-rose-600 mt-0.5" id="delete-pengurus-jabatan-label">-</p>
            <p class="text-[11px] text-slate-500 mt-0.5" id="delete-pengurus-blok-label">-</p>
          </div>
        </div>

        <!-- PIN KEAMANAN HAPUS -->
        <div class="p-3.5 bg-rose-50/80 border-2 border-rose-300 rounded-2xl">
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold text-rose-950 flex items-center gap-1.5">
              <i data-lucide="lock" class="w-4 h-4 text-rose-600"></i>
              <span>Masukkan PIN Keamanan untuk Menghapus</span>
              <span class="text-rose-600">*</span>
            </label>
            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-200 text-rose-900 border border-rose-300">PIN: 1234</span>
          </div>
          <input type="password" id="delete-pengurus-pin" required maxlength="4" placeholder="Ketik PIN (1234)" class="w-full p-2.5 text-center text-sm font-extrabold tracking-widest rounded-xl border border-rose-300 focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white">
          <p class="text-[11px] text-rose-700 mt-1">Ketik PIN <strong>1234</strong> untuk mengonfirmasi penghapusan secara permanen dari database SQL.</p>
        </div>

        <div class="pt-2 flex gap-2">
          <button type="button" onclick="PengumumanManager.closeModal('modal-delete-pengurus')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition">
            Batal
          </button>
          <button type="submit" class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
            <span>Hapus Permanen</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Application Scripts -->
  <script src="{{ asset('js/dummyData.js') }}"></script>
  <script src="{{ asset('js/store.js') }}"></script>
  <script src="{{ asset('js/dashboard.js') }}"></script>
  <script src="{{ asset('js/pengumuman.js') }}"></script>
  <script src="{{ asset('js/suaraWarga.js') }}"></script>
  <script src="{{ asset('js/iuran.js') }}"></script>
  <script src="{{ asset('js/pengeluaran.js') }}"></script>
  <script src="{{ asset('js/warga.js') }}"></script>
  <script src="{{ asset('js/laporan.js') }}"></script>
  <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>

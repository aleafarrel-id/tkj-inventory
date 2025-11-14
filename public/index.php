<?php
    require_once __DIR__ . '/../config/security_headers.php';

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");

    if (!isset($_SESSION['user_id'])) {
        header("Location: login/");
        exit();
    }
    
    $user_role = $_SESSION['role'] ?? 'user';
?>
<!DOCTYPE html>
<html lang="id"> <!-- Class 'dark' ditambahkan oleh JS untuk mode gelap -->
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventaris TKJ</title>
    <!-- Stylesheets -->
    <link rel="stylesheet" href="assets/css/main.css" type="text/css">
    <!-- Favicon & Icons -->
    <link rel="shortcut icon" href="assets/favicon/favicon.png" type="image/x-icon">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js" crossorigin="anonymous"></script>
</head>
<body data-role="<?php echo htmlspecialchars($user_role); ?>">
    <div id="loadingOverlay" class="loading-overlay">
        <div class="loading-spinner"></div>
    </div>

    <!-- Elemen notifikasi global -->
    <div id="notification" class="notification"></div>

    <!-- Header & Navigasi Utama -->
    <header class="header">
        <div class="header__container">
            <a href="#stock" class="header__logo">
                <i class='bx bxs-cube-alt'></i>
                <span>Inventaris <span class="logo-TKJ">TKJ</span></span>
            </a>

            <div class="header__nav-actions">
                <!-- Navigasi untuk Desktop -->
                <nav class="nav" id="desktopNav">
                    <ul class="nav__list">
                        <li class="nav__item"><a href="#stock" class="nav__link active">Stok</a></li>
                        <li class="nav__item"><a href="#borrow" class="nav__link">Peminjaman</a></li>
                        <li class="nav__item"><a href="#return" class="nav__link">Pengembalian</a></li>
                        <li class="nav__item"><a href="#history" class="nav__link">Riwayat</a></li>
                        <?php if ($user_role === 'admin'): ?>
                        <li class="nav__item nav-dropdown">
                            <a href="#" class="nav__link nav-dropdown__toggle" aria-haspopup="true" aria-expanded="false">
                                <span>Lainnya</span>
                                <i class='bx bx-chevron-down'></i>
                            </a>
                            <ul class="nav-dropdown__menu">
                                <li><a href="#statistics" class="nav__link">Statistik</a></li>
                                <li><a href="#accounts" class="nav__link">Akun</a></li>
                            </ul>
                        </li>
                        <?php endif; ?>
                    </ul>
                </nav>

                <!-- Dropdown Profil Pengguna (Desktop) -->
                <div class="profile-dropdown" id="userProfileDropdown" style="display: none;">
                    <button class="profile-dropdown__toggle" id="userProfileToggle" aria-haspopup="true" aria-expanded="false">
                        <i class='bx bxs-user-circle'></i>
                        <span id="usernameDisplay" class="profile-dropdown__username"></span>
                        <i class='bx bx-chevron-down profile-dropdown__arrow'></i>
                    </button>
                    <div class="profile-dropdown__menu" id="userProfileMenu" role="menu">
                        <!-- Tombol Ganti Tema untuk Desktop -->
                        <button class="profile-dropdown__item" id="desktopThemeToggle" role="menuitem">
                            <i class='bx bx-moon theme-toggle-icon'></i>
                            <span class="theme-toggle-text">Tema Gelap</span>
                        </button>
                        
                        <button class="profile-dropdown__item" id="accountBtn" role="menuitem">
                            <i class='bx bx-user'></i>
                            <span>Profil</span>
                        </button>

                        <?php if ($user_role === 'admin'): ?>
                        <button class="profile-dropdown__item" id="autoBackupBtn" role="menuitem">
							<i class='bx bx-refresh'></i>
							<span>Auto Backup</span>
						</button>
                        <?php endif; ?>

                        <button class="profile-dropdown__item" id="desktopAppBtn" role="menuitem" style="display: none;">
                            <i class='bx bx-desktop'></i>
                            <span>Desktop App</span>
                        </button>
                        <!-- Tombol Logout -->
                        <button class="profile-dropdown__item is-logout" id="dropdownLogoutBtn" role="menuitem">
                            <i class='bx bx-log-out'></i>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                <!-- Tombol menu untuk Mobile -->
                <button class="hamburger" id="hamburgerMenu" aria-label="Buka menu">
                    <i class='bx bx-menu'></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar__header">
            <div id="mobileUserProfileContainer"></div>
        </div>
        <nav class="sidebar__nav" id="sidebarNavContainer">
            <!-- Navigasi & toggle tema dimuat oleh JS -->
        </nav>
        <div class="sidebar__footer" id="sidebarFooterContainer">
            <!-- Tombol logout dimuat di sini oleh JS -->
        </div>
    </aside>
    <div class="overlay" id="overlay"></div>


    <!-- Konten Utama Aplikasi -->
    <main class="main-content">
        <!-- Halaman 1: Stok Barang -->
        <section id="stock" class="page active">
            <div class="page__header">
                <h2 class="page-title">Stok Barang</h2>
                <div class="page__actions">
                    <div class="search-bar">
                        <i class='bx bx-search'></i>
                        <input type="text" id="stockSearch" placeholder="Cari barang...">
                    </div>
                    <div class="filter-dropdown">
                        <button id="filterBtn" class="btn"><i class='bx bx-filter-alt'></i> Filter</button>
                        <ul id="filterOptions" class="filter-dropdown__menu">
                            <li data-filter="all">Semua</li>
                            <li data-filter="available">Tersedia</li>
                            <li data-filter="empty">Kosong</li>
                            <li data-filter="classifier" style="border-top: 1px solid var(--border-color); margin-top: 5px; padding-top: 10px;">Jenis</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="stockGrid" class="grid-container">
                <!-- Data stok barang dimuat oleh JS -->
            </div>
        </section>

        <!-- Halaman 2: Form Peminjaman -->
        <section id="borrow" class="page">
            <div class="page__header">
                <h2 class="page-title">Form Peminjaman</h2>
                <div id="liveClock" class="live-clock"></div>
                 <?php if ($user_role === 'admin'): ?>
                <div class="page__actions">
                    <button id="borrowSettingsBtn" class="btn btn-success action-btn" title="Pengaturan Peminjaman">
                        <i class='bx bxs-lock-open-alt' ></i>
                    </button>
                </div>
                <?php endif; ?>
            </div>
            <div class="form-container">
                <form id="borrowForm" class="form-card">
                    <div id="borrower-info-fields">
                        <div class="form-group">
                            <label for="borrowerName">Nama Peminjam</label>
                            <div style="position: relative;">
                                <input type="text" id="borrowerName" name="borrower_name" placeholder="Nama Lengkap" required autocomplete="off">
                                <div id="nameSuggestions" class="name-suggestions-container"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Kelas</label>
                            <!-- Diubah menjadi hybrid-dropdown untuk mendukung fitur tambah kelas -->
                            <div class="hybrid-dropdown" id="classDropdownContainer">
                                <input type="hidden" id="borrowerClassValue" name="borrower_class" required>
                                <button type="button" class="hybrid-dropdown__selected" aria-haspopup="listbox" aria-expanded="false">
                                    <span class="hybrid-dropdown__placeholder">Pilih Kelas</span>
                                    <div class="hybrid-dropdown__value"></div>
                                    <i class='bx bx-chevron-down hybrid-dropdown__arrow'></i>
                                </button>
                                <div class="hybrid-dropdown__options" role="listbox">
                                    <!-- Konten dinamis dari JS -->
                                </div>
                            </div>
                        </div>
                    </div>
                     <div class="form-group">
                        <label for="subject">Tujuan (Mapel)</label>
                        <input type="text" id="subject" name="subject" placeholder="Mapel atau Tujuan" required>
                    </div>
                    
                    <div id="borrowItemsContainer">
                        <!-- Baris item peminjaman akan ditambahkan oleh JavaScript di sini -->
                    </div>

                    <div class="form-group" id="borrow-form-actions">
                        <button type="button" id="addBorrowItemBtn" class="btn btn-secondary btn-block">
                            <i class='bx bx-plus'></i>
                            <span>Tambah Alat</span>
                        </button>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">Pinjam</button>
                </form>
            </div>
        </section>

        <!-- Halaman 3: Pengembalian Barang -->
        <section id="return" class="page">
            <div class="page__header">
                <h2 class="page-title">Peminjaman Aktif</h2>
                 <div class="page__actions">
                    <div class="search-bar">
                        <i class='bx bx-search'></i>
                        <input type="text" id="returnSearch" placeholder="Cari peminjaman...">
                    </div>
                </div>
            </div>
            <div id="returnGrid" class="list-container">
                <!-- Data peminjaman aktif dimuat oleh JS -->
            </div>
        </section>

        <!-- Halaman 4: Riwayat -->
        <section id="history" class="page">
             <div class="page__header">
                <h2 class="page-title">Riwayat Pengembalian</h2>
                <div class="page__actions">
                    <div class="search-bar">
                        <i class='bx bx-search'></i>
                        <input type="text" id="historySearch" placeholder="Cari riwayat...">
                    </div>
                    <?php if ($user_role === 'admin'): ?>
                    <div style="display: flex; gap: 1rem;">
                        <div class="action-dropdown">
                            <button id="exportActionsBtn" class="btn btn-success action-btn" title="Opsi Ekspor & Backup">
                                <i class='bx bx-transfer-alt'></i>
                            </button>
                            <div class="action-dropdown__menu">
                                <a href="#" id="exportCsvOnlyBtn"><i class='bx bxs-file-export'></i> Ekspor CSV</a>
                                <a href="#" id="importCsvBtn"><i class='bx bxs-file-import'></i> Impor CSV</a>
                                <a href="#" id="backupToDriveBtn"><i class='bx bxl-google-cloud'></i> Backup (Google Drive)</a>
                            </div>
                        </div>
                        <button id="flushHistoryBtn" class="btn btn-danger action-btn" title="Bersihkan Riwayat">
                            <i class='bx bxs-trash-alt'></i>
                        </button>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
            <div id="historyGrid" class="list-container">
                <!-- Data riwayat dimuat oleh JS -->
            </div>
            <div id="historyLoaderContainer" class="loader-container"></div>
        </section>

        <!-- Halaman 5: Statistik -->
        <?php if ($user_role === 'admin'): ?>
        <section id="statistics" class="page">
            <div class="page__header">
                <h2 class="page-title">Dasbor Statistik</h2>
                <div id="diskUsageIndicator" class="disk-usage-indicator" style="visibility: hidden;">
                    <i class='bx bxs-data'></i>
                    <div class="disk-bar-container">
                        <div class="disk-bar-labels">
                            <span class="disk-total-text"><span id="diskTotalText">-</span></span>
                        </div>
                        <div class="disk-bar">
                            <div class="disk-bar__used" style="width: 0%;"></div>
                            <div class="disk-bar__free" style="width: 100%;"></div>
                        </div>
                         <div class="disk-bar-labels">
                            <span class="disk-used-text">Used: <span id="diskUsedText">-</span></span>
                            <span class="disk-free-text">Free: <span id="diskFreeText">-</span></span>
                        </div>
                        <div class="disk-usage-tooltip">
                            Rincian Penyimpanan
                            <hr>
                            <span class="tooltip-label">Digunakan:</span> <span class="tooltip-value" id="diskUsedValue">-</span><br>
                            <span class="tooltip-label">Tersedia:</span> <span class="tooltip-value" id="diskFreeValue">-</span><br>
                        </div>
                    </div>
                </div>
            </div>
            <div class="stats-grid">
                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title">Sering Meminjam</h3>
                    </div>
                    <div class="chart-canvas-container" id="classBorrowalsChartContainer">
                        <canvas id="classBorrowalsChart"></canvas>
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title">Sedang Dipinjam</h3>
                        <div class="chart-filter-toggle" id="currentLoansFilter">
                            <button class="btn" data-value="name">Nama Alat</button>
                            <button class="btn active" data-value="classifier">Jenis Alat</button>
                        </div>
                    </div>
                     <div class="chart-canvas-container" id="currentLoansChartContainer">
                        <canvas id="currentLoansChart"></canvas>
                    </div>
                </div>

                <div class="chart-container full-width">
                    <div class="chart-header">
                        <h3 class="chart-title"><span class="chart-title-info">Top 10</span> Sering Dipinjam</h3>
                        <div class="chart-filter-toggle" id="loanHistoryFilter">
                            <button class="btn" data-value="name">Nama Alat</button>
                            <button class="btn active" data-value="classifier">Jenis Alat</button>
                        </div>
                    </div>
                    <div class="chart-canvas-container" id="loanHistoryChartContainer">
                        <canvas id="loanHistoryChart"></canvas>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Halaman 6: Manajemen Akun Pengguna -->
        <section id="accounts" class="page">
            <div class="page__header">
                <h2 class="page-title">Akun Pengguna</h2>
                <div class="page__actions">
                    <div class="search-bar">
                        <i class='bx bx-search'></i>
                        <input type="text" id="accountSearch" placeholder="Cari Akun...">
                    </div>
                    <div class="filter-dropdown">
                        <button id="accountFilterBtn" class="btn"><i class='bx bx-filter-alt'></i> Filter</button>
                        <ul id="accountFilterOptions" class="filter-dropdown__menu">
                            <!-- Opsi filter dimuat dinamis oleh JS -->
                        </ul>
                    </div>
                </div>
            </div>
            <div id="accountList" class="account-list-container">
                <!-- Data akun siswa dimuat oleh JS -->
            </div>
            <div id="accountLoaderContainer" class="loader-container"></div>
        </section>
        <?php endif; ?>
    </main>
    
    <!-- Tombol Aksi Mengambang (FAB) -->
    <div class="fab-container">
        <?php if ($user_role === 'admin'): ?>
        <!-- FAB untuk Halaman Stok -->
        <button id="fabDeleteSelectedBtn" class="fab" title="Hapus Barang Terpilih" style="background-color: var(--danger-color);">
            <i class='bx bxs-trash-alt'></i>
        </button>
        <button id="fabSelectAllItemsBtn" class="fab" title="Pilih Semua Alat yang Terlihat">
            <i class='bx bx-check-double'></i>
        </button>
        <div class="fab-multi-action-group" data-page="stock">
            <button id="fabExportStockBtn" class="fab fab-child" title="Ekspor Stok" style="background-color: var(--success-color);">
                <i class='bx bxs-file-export'></i>
            </button>
            <button id="fabImportStockBtn" class="fab fab-child" title="Impor Stok dari CSV" style="background-color: var(--success-color);">
                <i class='bx bxs-file-import'></i>
            </button>
            <button id="fabStockActionsToggle" class="fab fab-action" title="Impor/Ekspor Stok">
                <i class='bx bx-transfer-alt icon-open'></i>
                <i class='bx bx-x icon-close'></i>
            </button>
        </div>
        <button id="fabAddItemBtn" class="fab" title="Tambah Barang Baru">
            <i class='bx bx-plus'></i>
        </button>

        <!-- FAB untuk Halaman Akun -->
        <button id="fabDeleteSelectedAccountsBtn" class="fab" data-page="accounts" title="Hapus Akun Terpilih" style="background-color: var(--danger-color);">
            <i class='bx bxs-trash-alt'></i>
        </button>
        <button id="fabSelectAllAccountsBtn" class="fab" data-page="accounts" title="Pilih Semua Akun yang Terlihat">
            <i class='bx bx-check-double'></i>
        </button>
        <div class="fab-multi-action-group" data-page="accounts">
            <button id="fabExportAccountsBtn" class="fab fab-child" title="Ekspor Akun" style="background-color: var(--success-color);">
                <i class='bx bxs-file-export'></i>
            </button>
            <button id="fabImportAccountsBtn" class="fab fab-child" title="Impor Akun dari CSV" style="background-color: var(--success-color);">
                <i class='bx bxs-file-import'></i>
            </button>
            <button id="fabAccountActionsToggle" class="fab fab-action" title="Impor/Ekspor Akun">
                <i class='bx bx-transfer-alt icon-open'></i>
                <i class='bx bx-x icon-close'></i>
            </button>
        </div>
        <button id="fabAddAccountBtn" class="fab" data-page="accounts" title="Tambah Akun Baru">
            <i class='bx bx-plus'></i>
        </button>
        <?php endif; ?>

        <!-- FAB Umum -->
        <button id="fabClearFilterBtn" class="fab" title="Hapus Filter Stok" style="background-color: var(--danger-color); display: none;">
            <i class='bx bx-filter'></i>
        </button>
        <button id="fabBorrowSelectedBtn" class="fab" title="Pinjam Barang Terpilih" style="background-color: var(--success-color);">
            <i class='bx bx-right-arrow-alt'></i>
        </button>
        <button id="fabFilterDateBtn" class="fab" title="Filter Berdasarkan Tanggal">
            <i class='bx bx-calendar'></i>
        </button>
    </div>


    <!-- Modal Universal -->
    <div id="modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitle"></h2>
                <button class="close-modal-btn">&times;</button>
            </div>
            <div class="modal-body" id="modalBody">
                <!-- Konten modal dinamis dimuat oleh JS -->
            </div>
        </div>
    </div>

    <!-- Image Viewer Window -->
    <div id="imageViewer" class="image-viewer">
        <div class="image-viewer__header">
            <span class="image-viewer__title">Bukti Pengembalian</span>
            <div class="image-viewer__actions">
                <button class="image-viewer__action-btn close-btn" type="button" title="Tutup">
                    <i class='bx bx-x'></i>
                </button>
            </div>
        </div>
        <div class="image-viewer__body">
            <div class="image-viewer__loading">
                <div class="loading-spinner"></div>
            </div>
            <img id="viewerImage" src="" alt="Bukti Pengembalian">
        </div>
        <div class="image-viewer__resize-handle"></div>
    </div>
    
    <!-- Overlay Kunci Peminjaman -->
    <div id="lockOverlay" class="lock-overlay aurora-background">
        <div class="lock-overlay__content">
            <i class='bx bxs-time-five lock-overlay__icon'></i>
            <h2 id="lockOverlayTitle">Peminjaman Ditutup</h2>
            <p id="lockOverlayMessage">Peminjaman akan dibuka kembali dalam:</p>
            <div class="countdown" id="countdown">
                <div class="countdown__card glass-card-content">
                    <span id="countdown-days">00</span>
                    <small>Hari</small>
                </div>
                <div class="countdown__card glass-card-content">
                    <span id="countdown-hours">00</span>
                    <small>Jam</small>
                </div>
                <div class="countdown__card glass-card-content">
                    <span id="countdown-minutes">00</span>
                    <small>Menit</small>
                </div>
                <div class="countdown__card glass-card-content">
                    <span id="countdown-seconds">00</span>
                    <small>Detik</small>
                </div>
            </div>
            <p class="lock-overlay__info">Peminjaman mulai pukul <span id="borrowingHours">00:00 - 00:00</span> WIB</p>
            <a class="back-to-login_page" href="./login/"><i class='bx bx-arrow-back'></i> Kembali</a>
        </div>
    </div>

    <!-- Skrip Utama Aplikasi -->
    <script type="module" src="assets/js/app.js" defer></script>
</body>
</html>
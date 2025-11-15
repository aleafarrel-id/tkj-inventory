<?php
    @include_once __DIR__ . '/../../config/config.ini.php';
    $site_key = defined('RECAPTCHA_SITE_KEY') ? RECAPTCHA_SITE_KEY : '';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Inventaris TKJ</title>
    <!-- Stylesheets -->
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="../assets/css/style-dark.css">
    <!-- Stylesheet Components -->
    <link rel="stylesheet" href="../assets/css/components/buttons.css">
    <link rel="stylesheet" href="../assets/css/components/form.css">
    <link rel="stylesheet" href="../assets/css/components/header.css">
    <link rel="stylesheet" href="../assets/css/components/aurora.css">
    <!-- CSS Khusus Halaman Login -->
    <link rel="stylesheet" href="style.css">
    <!-- Favicon & Icons -->
    <link rel="shortcut icon" href="../assets/favicon/favicon.png" type="image/x-icon">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- QuaggaJS for Barcode Scanning -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js" crossorigin="anonymous"></script>
</head>
<body>
    <main class="login-page-container aurora-background">
        <div class="login-card">
            <div class="form-card glass-card-content">
                <div class="login-card-header">
                    <a href="#" class="header__logo" style="display: flex; align-items: center; justify-content: left; font-size: 1.2rem;">
                        <i class='bx bxs-cube-alt' style="font-size: 1.2rem;"></i>
                        <span>Inventaris <span class="logo-TKJ">TKJ</span></span>
                    </a>
                </div>

                <div style="text-align: center; margin-bottom: 1.2rem;">
                    <h2 style="font-size: 1.4rem; font-weight: 600;">Selamat Datang</h2>
                    <p style="color: var(--text-color-light);">Silakan login untuk melanjutkan</p>
                </div>

                <div id="errorMessage" class="notification error" style="display: none; position: relative; top: auto; right: auto; transform: none; margin-bottom: 1rem; transition: none; text-align: center;"></div>

                <form id="loginForm">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="Username (NIS)" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Password" required>
                    </div>

                    <!-- Placeholder untuk reCAPTCHA -->
                    <div class="form-group recaptcha-container">
                        <div id="recaptcha-widget-container" data-sitekey="<?php echo htmlspecialchars($site_key); ?>"></div>
                    </div>

                    <!-- Mengubah layout tombol menjadi 'horizontal' -->
                    <div class="login-actions horizontal">
                        <button type="submit" id="loginBtn" class="btn btn-primary">
                            <span class="btn-text">Login</span>
                            <div class="spinner" style="display: none;"></div>
                        </button>
                        <!-- Tombol barcode diubah menjadi tombol ikon kecil -->
                        <button type="button" id="loginBarcodeBtn" class="btn btn-secondary btn-icon" title="Login Barcode">
                            <i class='bx bx-barcode-reader'></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <!-- Barcode Scanner View -->
    <div id="barcode-scanner" style="display: none;">
        <div class="scanner-info">
            <i class='bx bx-scan'></i>
            Arahkan kamera ke barcode
        </div>
        <div id="interactive" class="viewport"></div>
        
        <!-- Camera Controls -->
        <div class="scanner-controls" id="camera-controls">
            <div class="control-label">
                <i class='bx bx-slider'></i>
                <span>Kontrol Zoom</span>
            </div>
            <div class="control-group zoom-control">
                <i class='bx bx-zoom-out'></i>
                <input type="range" id="zoom-slider" min="1" max="5" step="0.1" value="1">
                <i class='bx bx-zoom-in'></i>
                <span id="zoom-value">1.0x</span>
            </div>
        </div>
        
        <div class="scanner-bottom-actions">
            <button id="switchCameraBtn" class="btn" type="button" style="display: none;">
                <i class='bx bx-camera'></i>
                <span class="btn-text">Ganti Kamera</span>
                <span class="camera-count" id="cameraCount"></span>
            </button>
            <button id="cancelScanBtn" class="btn btn-danger">Batal</button>
        </div>
    </div>

    <!-- Password Modal -->
    <div id="password-modal" style="display: none;">
        <div class="modal-content form-card">
            <h2 style="font-size: 1.5rem; font-weight: 600; text-align: center; padding-bottom: 1rem;">Login Barcode</h2>
            <p style="text-align: center; color: var(--text-color-light);">NIS: <strong id="scanned-nis" style="color: var(--primary-color);"></strong></p>
            <form id="modalLoginForm" style="margin-top: 1.5rem;">
                <div id="modalErrorMessage" class="notification error" style="display: none; position: relative; top: auto; right: auto; transform: none; margin-bottom: 1rem; transition: none; text-align: center;"></div>
                <input type="hidden" id="modalUsername">
                <div class="form-group">
                    <label for="modalPassword">Password</label>
                    <input type="password" id="modalPassword" placeholder="Password Anda" required>
                </div>
                <div class="login-actions login-modal-actions horizontal">
                     <button type="button" id="cancelModalLoginBtn" class="btn btn-secondary">Batal</button>
                     <button type="submit" id="modalLoginBtn" class="btn btn-primary">
                        <span class="btn-text">Login</span>
                        <div class="spinner" style="display: none;"></div>
                     </button>
                </div>
            </form>
        </div>
    </div>

    <script src="../assets/js/scan.js" defer></script>
</body>
</html>
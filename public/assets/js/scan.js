window.addEventListener("load", function () {
    const currentYear = new Date().getFullYear();
    console.log(
        `%c© Developed by Alea Farrel - ${currentYear} Inventaris TKJ\n              All Rights Reserved.`,
        "background: #222; color: #bada55; font-size:12px; padding:4px; border-radius:4px;"
    );
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessageDiv = document.getElementById('errorMessage');
    let errorTimeout;

    const loginBarcodeBtn = document.getElementById('loginBarcodeBtn');
    const barcodeScanner = document.getElementById('barcode-scanner');
    const cancelScanBtn = document.getElementById('cancelScanBtn');
    const switchCameraBtn = document.getElementById('switchCameraBtn');
    const cameraCountEl = document.getElementById('cameraCount');
    const cameraControls = document.getElementById('camera-controls');
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.getElementById('zoom-value');
    const passwordModal = document.getElementById('password-modal');
    const modalLoginForm = document.getElementById('modalLoginForm');
    const modalLoginBtn = document.getElementById('modalLoginBtn');
    const cancelModalLoginBtn = document.getElementById('cancelModalLoginBtn');
    const scannedNisEl = document.getElementById('scanned-nis');
    const modalUsernameInput = document.getElementById('modalUsername');
    const modalPasswordInput = document.getElementById('modalPassword');
    const modalErrorMessageDiv = document.getElementById('modalErrorMessage');
    
    let isScanning = false;
    let availableCameras = [];
    let currentCameraIndex = 0;
    let currentStream = null;
    let zoomCapabilities = null;
    let currentZoom = 1;

    // Mulai enumerasi kamera setelah mendapatkan izin
    const enumerateCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            availableCameras = devices.filter(device => device.kind === 'videoinput' && device.deviceId);
            
            console.log(`Found ${availableCameras.length} cameras:`, availableCameras);
            
            // Tampilkan tombol ganti kamera jika ada lebih dari satu kamera
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (availableCameras.length > 1 || (isMobile && availableCameras.length === 0)) {
                switchCameraBtn.style.display = 'flex';
                if (availableCameras.length > 1) {
                    updateCameraCount();
                } else {
                    cameraCountEl.textContent = '1/2';
                }
            } else if (availableCameras.length === 1) {
                switchCameraBtn.style.display = 'none';
            }
            
            return true;
        } catch (error) {
            console.error('Error enumerating cameras:', error);
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                switchCameraBtn.style.display = 'flex';
                cameraCountEl.textContent = '1/2';
            }
            return false;
        }
    };

    const updateCameraCount = () => {
        if (availableCameras.length > 0) {
            cameraCountEl.textContent = `${currentCameraIndex + 1}/${availableCameras.length}`;
        }
    };

    // Setup zoom control
    const setupZoomControl = async () => {
        try {
            // Dapatkan stream video dari Quagga
            const videoElement = document.querySelector('#interactive video');
            
            if (!videoElement) {
                console.log('Video element not found');
                return;
            }
            
            if (videoElement && videoElement.srcObject) {
                currentStream = videoElement.srcObject;
                const videoTrack = currentStream.getVideoTracks()[0];
                
                if (!videoTrack) {
                    console.log('No video track found');
                    return;
                }
                
                if (videoTrack) {
                    const capabilities = videoTrack.getCapabilities();
                    console.log('Video track capabilities:', capabilities);
                    
                    if (capabilities.zoom) {
                        zoomCapabilities = capabilities.zoom;
                        
                        // Setup slider berdasarkan kemampuan zoom
                        zoomSlider.min = capabilities.zoom.min;
                        zoomSlider.max = capabilities.zoom.max;
                        zoomSlider.step = capabilities.zoom.step || 0.1;
                        zoomSlider.value = currentZoom;
                        
                        cameraControls.style.display = 'block';
                        setTimeout(() => {
                            cameraControls.classList.add('show');
                        }, 50);
                        
                        console.log('Zoom capabilities:', capabilities.zoom);
                        console.log('Zoom range:', capabilities.zoom.min, '-', capabilities.zoom.max);
                    } else {
                        console.log('Camera does not support zoom');
                        cameraControls.style.display = 'none';
                    }
                }
            }
        } catch (error) {
            console.error('Error setting up zoom:', error);
            cameraControls.style.display = 'none';
        }
    };

    // Terapkan zoom
    const applyZoom = async (zoomLevel) => {
        try {
            if (currentStream && zoomCapabilities) {
                const videoTrack = currentStream.getVideoTracks()[0];
                
                if (videoTrack) {
                    await videoTrack.applyConstraints({
                        advanced: [{ zoom: zoomLevel }]
                    });
                    
                    currentZoom = zoomLevel;
                    zoomValue.textContent = zoomLevel.toFixed(1) + 'x';
                    
                    console.log('Zoom applied:', zoomLevel);
                }
            }
        } catch (error) {
            console.error('Error applying zoom:', error);
        }
    };

    // Zoom slider event listener
    zoomSlider.addEventListener('input', (e) => {
        const zoomLevel = parseFloat(e.target.value);
        applyZoom(zoomLevel);
    });

    // Keyboard shortcuts untuk zoom (desktop)
    document.addEventListener('keydown', (e) => {
        if (!isScanning || !zoomCapabilities) return;
        
        if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            const newZoom = Math.min(currentZoom + 0.5, zoomCapabilities.max);
            zoomSlider.value = newZoom;
            applyZoom(newZoom);
        } else if (e.key === '-' || e.key === '_') {
            e.preventDefault();
            const newZoom = Math.max(currentZoom - 0.5, zoomCapabilities.min);
            zoomSlider.value = newZoom;
            applyZoom(newZoom);
        }
    });

    const getCameraConstraints = () => {
        if (availableCameras.length > 0 && availableCameras[currentCameraIndex] && availableCameras[currentCameraIndex].deviceId) {
            console.log('Using deviceId:', availableCameras[currentCameraIndex].deviceId);
            return {
                deviceId: { exact: availableCameras[currentCameraIndex].deviceId }
            };
        }
        
        const facingMode = currentCameraIndex % 2 === 0 ? "environment" : "user";
        console.log('Using facingMode:', facingMode);
        return {
            facingMode: facingMode
        };
    };

    const startScanner = async () => {
        if (isScanning) return;

        isScanning = true;
        switchCameraBtn.disabled = true;

        const cameraConstraints = getCameraConstraints();
        
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#interactive'),
                constraints: {
                    width: { min: 640, ideal: 1280 },
                    height: { min: 480, ideal: 720 },
                    ...cameraConstraints
                },
            },
            decoder: {
                readers: ["code_128_reader", "code_39_reader", "ean_reader", "ean_8_reader"]
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            }
        }, function(err) {
            if (err) {
                showMessage("Tidak dapat mengakses kamera.", errorMessageDiv);
                barcodeScanner.style.display = 'none';
                isScanning = false;
                switchCameraBtn.disabled = false;
                return;
            }
            
            console.log('Quagga initialized successfully');
            Quagga.start();
            switchCameraBtn.disabled = false;
            
            setTimeout(async () => {
                await enumerateCameras();
                setupZoomControl();
            }, 500);
            
            console.log(`Scanner started with camera ${currentCameraIndex + 1}`);
        });

        Quagga.onProcessed(function(result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
                }
            }
        });

        Quagga.onDetected(handleDetection);
    };
    
    const stopScanner = () => {
        if (!isScanning) return;
        isScanning = false;
        Quagga.offDetected(handleDetection);
        Quagga.offProcessed();
        Quagga.stop();
        barcodeScanner.style.display = 'none';
        cameraControls.classList.remove('show');
        setTimeout(() => {
            cameraControls.style.display = 'none';
        }, 300);
        switchCameraBtn.disabled = false;
        
        // Reset zoom state
        currentStream = null;
        zoomCapabilities = null;
        currentZoom = 1;
        zoomSlider.value = 1;
        zoomValue.textContent = '1.0x';
    };

    const restartScanner = async () => {
        if (!isScanning) return;
        
        console.log('Restarting scanner...');
        
        // Save current zoom level
        const savedZoom = currentZoom;
        
        // Stop current scanner
        Quagga.offDetected(handleDetection);
        Quagga.offProcessed();
        Quagga.stop();
        
        cameraControls.classList.remove('show');
        setTimeout(() => {
            cameraControls.style.display = 'none';
        }, 300);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        isScanning = false;
        await startScanner();
        
        // Coba terapkan kembali zoom setelah scanner dimulai ulang
        setTimeout(() => {
            if (zoomCapabilities && savedZoom > 1) {
                applyZoom(savedZoom);
            }
        }, 800);
    };

    const switchCamera = async () => {
        if (!isScanning) return;
        
        switchCameraBtn.disabled = true;
        
        if (availableCameras.length > 1) {
            currentCameraIndex = (currentCameraIndex + 1) % availableCameras.length;
            updateCameraCount();
            console.log(`Switching to camera ${currentCameraIndex + 1}/${availableCameras.length}`);
        } else {
            currentCameraIndex = currentCameraIndex === 0 ? 1 : 0;
            cameraCountEl.textContent = currentCameraIndex === 0 ? '1/2' : '2/2';
            console.log(`Toggling camera (fallback mode) - index: ${currentCameraIndex}`);
        }
        
        await restartScanner();
        
        switchCameraBtn.disabled = false;
    };

    const handleDetection = (data) => {
        const code = data.codeResult.code;
        if (code && isScanning) {
            console.log('Barcode detected:', code);
            stopScanner();
            
            setTimeout(() => {
                scannedNisEl.textContent = code;
                modalUsernameInput.value = code;
                passwordModal.style.display = 'flex';
                modalPasswordInput.focus();
            }, 100);
        }
    };

    const loadAndRenderRecaptcha = (theme) => {
        const widgetContainer = document.getElementById('recaptcha-widget-container');
        if (!widgetContainer) {
            console.log('recaptcha-widget-container not found');
            return;
        }

        const siteKey = widgetContainer.dataset.sitekey;
        if (!siteKey) {
            console.error('reCAPTCHA site key not found on data-sitekey attribute.');
            widgetContainer.innerHTML = '<p style="color:var(--danger-color); font-size: 0.8rem;">reCAPTCHA Gagal dimuat: Kunci situs tidak ditemukan.</p>';
            return;
        }

        window.onRecaptchaLoad = () => {
            try {
                if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
                    grecaptcha.render('recaptcha-widget-container', {
                        'sitekey': siteKey,
                        'theme': theme
                    });
                } else {
                     throw new Error('grecaptcha.render is not a function');
                }
            } catch (e) {
                console.error('Failed to render reCAPTCHA:', e);
                widgetContainer.innerHTML = '<p style="color:var(--danger-color); font-size: 0.8rem;">reCAPTCHA Gagal dirender.</p>';
            }
        };

        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    };

    const setupTheme = () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        document.documentElement.classList.toggle('dark', isDark);
        return isDark ? 'dark' : 'light';
    };
    
    // Panggil setupTheme DAN muat reCAPTCHA
    const appTheme = setupTheme();
    loadAndRenderRecaptcha(appTheme);


    const showLoading = (isLoading, button) => {
        button.disabled = isLoading;
        button.classList.toggle('btn-loading', isLoading);
        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.spinner');
        if (btnText) btnText.style.visibility = isLoading ? 'hidden' : 'visible';
        if (spinner) spinner.style.display = isLoading ? 'inline-block' : 'none';
    };
    
    const showMessage = (message, element) => {
        clearTimeout(errorTimeout);
        element.textContent = message;
        element.style.display = 'block';
        errorTimeout = setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    };

    const performLogin = async (username, password, button, errorElement, recaptchaToken = null) => {
        showLoading(true, button);
        errorElement.style.display = 'none';

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        if (recaptchaToken !== null) {
            formData.append('g-recaptcha-response', recaptchaToken);
        }

        try {
            const response = await fetch('../auth.php?action=login', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.status === 'success') {
                window.location.href = '../';
            } else {
                showMessage(result.message || 'Terjadi kesalahan.', errorElement);
            }
        } catch (error) {
            showMessage('Tidak dapat terhubung ke server.', errorElement);
        } finally {
            showLoading(false, button);
            // Hanya reset jika reCAPTCHA ada dan token telah dikirim
            if (recaptchaToken !== null && typeof grecaptcha !== 'undefined' && grecaptcha.reset) {
                grecaptcha.reset();
            }
        }
    };

    // Event Listeners
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (typeof grecaptcha === 'undefined' || !grecaptcha.getResponse) {
            showMessage("Verifikasi reCAPTCHA belum siap. Coba lagi.", errorMessageDiv);
            return;
        }

        const recaptchaResponse = grecaptcha.getResponse();

        if (!recaptchaResponse) {
            showMessage("Harap verifikasi reCAPTCHA.", errorMessageDiv);
            return;
        }

        await performLogin(
            loginForm.querySelector('#username').value,
            loginForm.querySelector('#password').value,
            loginBtn,
            errorMessageDiv,
            recaptchaResponse
        );
    });

    loginBarcodeBtn.addEventListener('click', () => {
        barcodeScanner.style.display = 'flex';
        currentCameraIndex = 0;
        availableCameras = []; // Reset list kamera
        startScanner();
    });
    
    cancelScanBtn.addEventListener('click', stopScanner);

    switchCameraBtn.addEventListener('click', switchCamera);

    modalLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await performLogin(
            modalUsernameInput.value,
            modalPasswordInput.value,
            modalLoginBtn,
            modalErrorMessageDiv,
            null
        );
    });
    
    cancelModalLoginBtn.addEventListener('click', () => {
        passwordModal.style.display = 'none';
        modalLoginForm.reset();
        modalErrorMessageDiv.style.display = 'none';
    });
});
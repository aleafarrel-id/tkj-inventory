var r={items:[],classifiers:[],classes:[],borrowals:[],history:[],accounts:[],itemToBorrow:null,itemsToBorrow:[],selectedItems:[],selectedAccounts:[],currentStockFilter:"all",currentClassifierFilter:null,selectedDate:null,historyPage:1,isLoadingMoreHistory:!1,hasMoreHistory:!0,accountPage:1,isLoadingMoreAccounts:!1,hasMoreAccounts:!0,session:{isLoggedIn:!1,username:null,role:null,login_username:null,kelas:null},borrowSettings:{startTime:"06:30",endTime:"17:00",isManuallyLocked:!1,isAppLocked:!1,lockReason:"open",isLoaded:!1}},L=null,k="api.php",rt="auth.php",Gt=e=>{L=e};var Kt=document.getElementById("loadingOverlay"),it=document.getElementById("notification"),Be=document.getElementById("modal"),uo=document.getElementById("modalTitle"),Vt=document.getElementById("modalBody"),m=e=>e==null?"":String(e).replace(/[&<>"]/g,function(t){return{"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[t]}),oe=()=>Kt.classList.add("is-visible"),Ie=()=>Kt.classList.remove("is-visible"),B=(e,t="success")=>{it.textContent=e,it.className=`notification ${t} show`,setTimeout(()=>it.classList.remove("show"),3e3)},_=(e,t)=>{uo.innerHTML=e,Vt.innerHTML=t,Be.classList.add("is-visible")},S=()=>{Be.classList.contains("is-visible")&&(Be.classList.add("is-closing"),setTimeout(()=>{Be.classList.remove("is-visible"),Be.classList.remove("is-closing"),Vt.innerHTML=""},300))},O=(e,t)=>`
    <div class="empty-state">
        <img src="assets/favicon/empty.png" alt="Data Kosong" class="empty-state__image">
        <h2 class="empty-state__title">${m(e)}</h2>
        <p class="empty-state__text">${m(t)}</p>
    </div>`,lt=(e,t,a)=>{let o=t.toLowerCase();return o?e.filter(s=>a.some(n=>s[n]&&String(s[n]).toLowerCase().includes(o))):e},C=e=>{if(!e)return"";let t=new Date(e);return t.setMinutes(t.getMinutes()-t.getTimezoneOffset()),t.toISOString().split("T")[0]};var ct=async()=>{try{let e=await fetch(`${rt}?action=get_session`);if(!e.ok)throw new Error("Redirecting to login...");let t=await e.json();if(t.status==="success"&&t.data)r.session={isLoggedIn:!0,username:t.data.username,role:t.data.role,login_username:t.data.login_username,kelas:t.data.kelas};else throw new Error("No active session.")}catch{window.location.href="login/"}},dt=async()=>{oe(),await fetch(`${rt}?action=logout`),window.location.href="login/"};function W(e,t,a,o,s,n){if(!e)return;let l=new Map;e.querySelectorAll(n).forEach(c=>{c.dataset[s]&&l.set(c.dataset[s],c)});let i=document.createDocumentFragment();t.forEach(c=>{let d=c[o].toString(),u=a(c),f=l.get(d),g=null;if(f){if(f.outerHTML!==u){let y=document.createElement("div");y.innerHTML=u,g=y.firstElementChild}else g=f;l.delete(d)}else{let y=document.createElement("div");y.innerHTML=u,g=y.firstElementChild}g&&i.appendChild(g)}),l.forEach(c=>c.remove()),e.querySelectorAll(n).forEach(c=>c.remove()),e.appendChild(i)}var Jt=(e,t="Bukti Pengembalian")=>{let a=document.getElementById("imageViewer"),o=document.getElementById("viewerImage"),s=a.querySelector(".image-viewer__title"),n=a.querySelector(".image-viewer__loading");if(!a||!o)return;s&&(s.textContent=t),o&&(o.classList.remove("loaded"),o.src=""),n&&(n.style.display="flex"),a.style.display="flex";let l=window.innerWidth<=840,i=l?window.innerWidth*.85:600,c=l?window.innerHeight*.7:500;l?(a.style.width=`${i}px`,a.style.height=`${c}px`):(a.style.width="600px",a.style.height="500px"),a.style.left=`${(window.innerWidth-i)/2}px`,a.style.top=`${(window.innerHeight-c)/2}px`,a.classList.remove("is-closing"),a.classList.add("is-visible");let d=new Image;d.onload=()=>{o&&(o.src=e,o.classList.add("loaded")),n&&(n.style.display="none")},d.onerror=()=>{n&&(n.innerHTML='<p style="color: var(--danger-color);">Gagal memuat gambar</p>')},d.src=e},mo=()=>{let e=document.getElementById("imageViewer");e&&(!e.classList.contains("is-visible")||e.classList.contains("is-closing")||(e.classList.add("is-closing"),e.classList.remove("is-dragging"),setTimeout(()=>{let t=document.getElementById("viewerImage");t&&(t.src="",t.classList.remove("loaded")),e.style.display="none",e.classList.remove("is-closing"),e.classList.remove("is-visible")},300)))},zt=()=>{let e=document.getElementById("imageViewer");if(!e)return;let t=e.querySelector(".image-viewer__header"),a=e.querySelector(".close-btn"),o=e.querySelector(".image-viewer__resize-handle"),s=!1,n=!1,l,i,c,d,u,f;a?.addEventListener("click",mo);let g=w=>{if(w.target.closest(".image-viewer__actions")||w.target.closest(".image-viewer__resize-handle"))return;s=!0;let h=w.type.includes("touch")?w.touches[0]:w;h&&(c=h.clientX-e.offsetLeft,d=h.clientY-e.offsetTop,e.style.cursor="grabbing",t&&(t.style.cursor="grabbing"),e.classList.add("is-dragging"))},y=w=>{if(!s)return;w.preventDefault();let h=w.type.includes("touch")?w.touches[0]:w;if(!h)return;l=h.clientX-c,i=h.clientY-d;let I=window.innerWidth-e.offsetWidth,M=window.innerHeight-e.offsetHeight;l=Math.max(0,Math.min(l,I)),i=Math.max(0,Math.min(i,M)),e.style.left=`${l}px`,e.style.top=`${i}px`},p=()=>{s=!1,e.style.cursor="",t&&(t.style.cursor="move"),e.classList.remove("is-dragging")};t?.addEventListener("mousedown",g),document.addEventListener("mousemove",y),document.addEventListener("mouseup",p),t?.addEventListener("touchstart",g,{passive:!1}),document.addEventListener("touchmove",y,{passive:!1}),document.addEventListener("touchend",p);let v=w=>{w.stopPropagation(),n=!0;let h=w.type.includes("touch")?w.touches[0]:w;h&&(c=h.clientX,d=h.clientY,u=e.offsetWidth,f=e.offsetHeight,e.classList.add("is-dragging"),w.type.includes("touch")&&w.preventDefault())},b=w=>{if(!n)return;w.type.includes("touch")&&w.preventDefault();let h=w.type.includes("touch")?w.touches[0]:w;if(!h)return;let I=h.clientX-c,M=h.clientY-d,H=u+I,F=f+M,Q=window.innerWidth<=840,de=Q?280:300,Pe=Q?200:250,Fe=window.innerWidth*.9,co=window.innerHeight*.9;H=Math.max(de,Math.min(H,Fe)),F=Math.max(Pe,Math.min(F,co)),e.style.width=`${H}px`,e.style.height=`${F}px`},x=()=>{n&&(n=!1,e.classList.remove("is-dragging"))};o&&(o.addEventListener("mousedown",v),document.addEventListener("mousemove",b),document.addEventListener("mouseup",x),o.addEventListener("touchstart",v,{passive:!1}),document.addEventListener("touchmove",b,{passive:!1}),document.addEventListener("touchend",x),document.addEventListener("touchcancel",x))};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",zt):zt();var ue=e=>{let t=document.getElementById("importProgressBar"),a=document.getElementById("importProgressText"),o=document.getElementById("importProgressLog"),s=document.getElementById("primaryCloseImportBtn"),n=document.getElementById("import-confirmation-view"),l=document.getElementById("import-progress-view");if(!l||!e)return;["running","complete","error"].includes(e.status)&&(n&&n.style.display!=="none"&&(n.style.display="none"),l&&l.style.display!=="block"&&(l.style.display="block"));let{processed:i=0,total:c=0}=e;if(c>0){let d=i/c*100;t&&(t.style.width=`${d}%`),a&&(a.textContent=`Memproses ${i} dari ${c} baris...`)}else a&&(a.textContent="Mempersiapkan...");if(e.log&&Array.isArray(e.log)&&o&&(o.innerHTML=e.log.map(d=>{let u="",f="\u2022";d.status==="success"?(u="text-success",f="\u2713"):d.status==="error"?(u="text-danger",f="\u2717"):d.status==="warning"&&(u="text-warning",f="!");let g=d.status==="info"?"":`${f} `;return`<div class="${u}">[${d.time}] ${g}${m(d.message)}</div>`}).join(""),o.scrollTop=o.scrollHeight),e.status==="complete"||e.status==="error"){if(e.status==="complete")a&&(a.textContent=`Impor selesai! ${e.success} berhasil, ${e.failed} gagal.`),t&&(t.style.width="100%"),s&&(s.textContent="Selesai");else{a&&(a.textContent="Impor Gagal!");let d=e.message||"Terjadi kesalahan.";o&&!o.innerHTML.includes(d)&&(o.innerHTML+=`<div class="text-danger">[${new Date().toLocaleTimeString("id-ID")}] \u2717 Error: ${m(d)}</div>`),s&&(s.textContent="Tutup")}s&&(s.style.display="inline-flex",s.onclick=async()=>{if(await Wt(),e.status==="complete"&&e.success>0){let d=["stock","accounts"].includes(e.import_type)?`#${e.import_type}`:"#history";localStorage.setItem("lastActivePage",d),window.location.reload()}else S()})}},se=(e="stock",t=null)=>{let a,o,s,n,l,i;e==="history"?(a="Impor Riwayat (CSV)",o="Unggah file CSV yang dihasilkan dari fitur <strong>Backup to Google Drive</strong> untuk memulihkan riwayat.",s="Pastikan barang di dalam file CSV sudah ada di stok barang.",n="<strong>Nama Peminjam, Kelas, ..., Link Bukti Google Drive</strong>",l="template_impor_riwayat.csv",i=`Nama Peminjam,Kelas,Mata Pelajaran,Nama Barang,Jenis Alat,Jumlah,Tanggal Pinjam,Tanggal Kembali,Link Bukti Google Drive
John Doe,XI-TKJ 1,Jaringan Dasar,Router Mikrotik,Router,1,2025-10-10 08:00:00,2025-10-10 16:00:00,https://drive.google.com/file/d/xxxxx/view?usp=sharing
,,,,Kabel LAN 5m,Kabel,2,,,https://drive.google.com/file/d/xxxxx/view?usp=sharing`):e==="accounts"?(a="Impor Akun (CSV)",o="Unggah file CSV untuk mengimpor data akun.",s="Pastikan tidak ada NIS yang sama dengan data yang sudah ada.",n="<strong>NIS, Password, Nama, Kelas</strong>",l="template_impor_akun.csv",i=`NIS,Password,Nama,Kelas
12345678,password123,John Doe,XI-TKJ 1
87654321,password456,Jane Smith,XII-TKJ 2`):(a="Impor Barang (CSV)",o="Unggah file CSV untuk menambahkan data barang.",s="Pastikan format file CSV benar.",n="<strong>Kode Barang, Nama Barang, Jenis Barang, Jumlah, Link Gambar</strong>",l="template_impor_barang.csv",i=`Kode Barang,Nama Barang,Jenis Barang,Jumlah,Link Gambar
INV-12345ABCD,Router Cisco,Router,10,https://example.com/router.jpg
,Kabel LAN 5m,Kabel,50,https://example.com/cable.jpg`),_(a,`
        <div id="importModalContainer">
            <div id="import-confirmation-view">
                <form id="importCsvForm">
                    <input type="hidden" name="import_type" value="${e}">
                     <div class="form-group">
                        <p>${o}</p>
                        <p style="margin: 1rem 0;">Pastikan format sesuai: ${n}.</p>
                        <a href="#" id="downloadCsvTemplate" style="font-size: 0.9rem; text-decoration: underline;">Unduh template CSV</a>
                        <p class="modal-warning-text" style="margin: 1rem 0; text-align: left;">${s}</p>
                    </div>
                    <div class="form-group">
                        <div class="image-uploader" id="csvUploader">
                            <input type="file" id="csvFile" name="csv_file" accept=".csv,text/csv" hidden required>
                            <div class="image-uploader__prompt"><i class='bx bxs-file-import'></i><p>Seret & lepas file, atau klik</p></div>
                            <div class="image-uploader__file-info"><i class='bx bxs-file-check'></i><span id="csvFileName"></span></div>
                        </div>
                        <small id="csv-file-error" class="text-danger" style="display:none; margin-top: 0.5rem;">File CSV wajib diunggah.</small>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                        <button type="submit" id="startImportBtn" class="btn btn-primary">Mulai Impor</button>
                    </div>
                </form>
            </div>
            <div id="import-progress-view" style="display: none;">
                <div class="progress-bar-container" style="margin: 1.5rem 0;">
                    <div class="progress-bar-text" id="importProgressText" style="margin-bottom: 0.5rem; color: var(--text-color-light); font-size: 0.9rem;">Memulai...</div>
                    <div class="progress-bar" style="background-color: var(--border-color); border-radius: 20px; overflow: hidden;">
                        <div id="importProgressBar" class="progress-bar__fill" style="width: 0%; height: 15px; background-color: var(--success-color); border-radius: 20px; transition: width 0.3s ease;"></div>
                    </div>
                </div>
                <div class="progress-log" id="importProgressLog" style="background-color: var(--secondary-color); border-radius: var(--border-radius); padding: 1rem; height: 180px; overflow-y: auto; font-size: 0.8rem; line-height: 1.5;"></div>
                 <div class="modal-footer">
                    <button type="button" id="primaryCloseImportBtn" class="btn btn-primary" style="display: none;">Selesai</button>
                </div>
            </div>
        </div>
    `);let c=document.getElementById("importCsvForm");if(c){let d=document.getElementById("csvUploader"),u=document.getElementById("csvFile"),f=d.querySelector(".image-uploader__prompt"),g=d.querySelector(".image-uploader__file-info"),y=document.getElementById("csvFileName"),p=document.getElementById("csv-file-error"),v=b=>{if(b&&(b.type==="text/csv"||b.name.toLowerCase().endsWith(".csv")||b.type==="application/vnd.ms-excel")){let x=new DataTransfer;x.items.add(b),u.files=x.files,y.textContent=b.name,f.style.display="none",g.style.display="flex",p.style.display="none"}else u.value="",f.style.display="flex",g.style.display="none",y.textContent="",b&&B("Harap pilih file dengan format .csv","error")};d.addEventListener("click",()=>u.click()),u.addEventListener("change",()=>v(u.files[0])),d.addEventListener("dragover",b=>{b.preventDefault(),d.classList.add("drag-over")}),d.addEventListener("dragleave",()=>d.classList.remove("drag-over")),d.addEventListener("drop",b=>{b.preventDefault(),d.classList.remove("drag-over"),v(b.dataTransfer.files[0])}),document.getElementById("downloadCsvTemplate").addEventListener("click",b=>{b.preventDefault();let x=new Blob([i],{type:"text/csv;charset=utf-8;"}),w=document.createElement("a");w.href=URL.createObjectURL(x),w.download=l,w.click(),URL.revokeObjectURL(w.href)}),c.addEventListener("submit",b=>{if(b.preventDefault(),!u.files[0]){p.style.display="block";return}b.target.querySelector('button[type="submit"]').disabled=!0,Qt(new FormData(c))})}t&&t.status!=="idle"&&(ue(t),t.status==="running"&&ut())};var mt=(e,t,a)=>{_(e,`
        <p class="modal-details">${t}</p> <!-- Pesan bisa berisi HTML -->
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="modalConfirmBtn" class="btn btn-danger">Ya</button>
        </div>
    `);let o=document.getElementById("modalConfirmBtn");o&&(o.onclick=()=>{S(),setTimeout(a,50)})};var je=()=>{let e=r.session.role==="admin",t=r.session.username||"",a=r.session.login_username||"",o=e?"Username":"Username (NIS)";_("<i class='bx bxs-user-cog'></i> Pengaturan Akun",`
        <form id="accountForm">
            <div class="form-group">
                <label for="accountName">Nama</label>
                <input type="text" id="accountName" name="nama" value="${m(t)}" ${e?"required":"readonly"}>
            </div>
            <div class="form-group">
                <label for="accountUsername">${o}</label>
                <input type="text" id="accountUsername" name="username" value="${m(a)}" ${e?"required":"readonly"}>
            </div>
            <div class="form-group">
                <label for="accountPassword">Password Baru</label>
                <input type="password" id="accountPassword" name="password" placeholder="Kosongkan jika tidak ingin ganti">
                <small class="form-text">Minimal 8 karakter untuk mengganti.</small>
            </div>
            <div class="form-group">
                <label for="confirmPassword">Konfirmasi Password Baru</label>
                <input type="password" id="confirmPassword" name="confirm_password" placeholder="Ketik ulang password baru">
                <small id="passwordMismatchError" class="text-danger" style="display:none; margin-top: 0.5rem;">Password tidak cocok.</small>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="submit" id="updateAccountBtn" class="btn btn-primary">Update</button>
            </div>
        </form>
    `);let s=document.getElementById("accountForm"),n=document.getElementById("accountPassword"),l=document.getElementById("confirmPassword"),i=document.getElementById("updateAccountBtn"),c=document.getElementById("passwordMismatchError"),d=()=>{n.value?n.value!==l.value?(c.style.display="block",i.disabled=!0):(c.style.display="none",i.disabled=!1):(l.value="",c.style.display="none",i.disabled=!1)};n.addEventListener("input",d),l.addEventListener("input",d),d(),s.addEventListener("submit",Yt)};var ft=()=>{let{startTime:e,endTime:t,isManuallyLocked:a}=r.borrowSettings,o,s,n;a?(o="Buka (Manual)",s="btn-success",n=!1):(o="Kunci (Manual)",s="btn-danger",n=!0),_("Pengaturan Aplikasi",`
        <form id="borrowSettingsForm">
            <p style="padding-bottom: 2rem;">Atur jadwal kapan aplikasi dapat diakses oleh siswa.</p>
            <div class="form-group">
                <label for="startTime">Buka Mulai Jam</label>
                <input type="time" id="startTime" name="start_time" value="${e}" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="endTime">Tutup Mulai Jam</label>
                <input type="time" id="endTime" name="end_time" value="${t}" class="form-control" required>
            </div>
            <div class="form-group">
                <button type="button" id="manualLockBtn" class="btn ${s} btn-block" style="margin: 0.2rem 0;">${o}</button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
            </div>
        </form>
    `),document.getElementById("borrowSettingsForm").addEventListener("submit",l=>{l.preventDefault();let i=new FormData(l.target),c=l.target.querySelector('button[type="submit"]');i.append("action","update_settings"),i.append("csrf_token",L),c.disabled=!0,pt(i).finally(()=>{c.disabled=!1})}),document.getElementById("manualLockBtn").addEventListener("click",l=>{let i=new FormData;i.append("is_locked",n?"1":"0"),i.append("action","update_settings"),i.append("csrf_token",L),l.target.textContent="Memproses...",l.target.disabled=!0,pt(i).finally(()=>{})})};function gt(e=null){let t=!e||e==="Windows",a=e==="Linux";_("Petunjuk Penggunaan",`
        <div class="modal-tabs">
            <button class="modal-tab ${t?"active":""}" data-target="windows-instructions">
                <i class='bx bxl-windows'></i> Windows
            </button>
            <button class="modal-tab ${a?"active":""}" data-target="linux-instructions">
                <i class='bx bxl-tux'></i> Linux
            </button>
        </div>

        <div class="modal-tab-content ${t?"active":""}" id="windows-instructions">
            <h4>Instalasi di Windows (.exe):</h4>
            <ol>
                <li>Setelah unduhan selesai, buka file <code>.exe</code> yang telah diunduh.</li>
                <li>Ikuti petunjuk instalasi yang muncul di layar.</li>
                <li>Jika muncul peringatan keamanan (seperti Windows SmartScreen), klik <b>More info</b> atau <b>Run anyway</b>. Aplikasi ini aman digunakan.</li>
                <li>Setelah instalasi selesai, Anda dapat menjalankan aplikasi dari Start Menu atau shortcut di Desktop.</li>
            </ol>
            <p class="modal-details" style="margin-top: 1.5rem; font-size: 0.9em;">Aplikasi ini dibuat untuk langsung dapat di-install pada perangkat</p>
        </div>

        <div class="modal-tab-content ${a?"active":""}" id="linux-instructions">
            <h4>Menjalankan di Linux (.AppImage):</h4>
            <p class="modal-details">File AppImage adalah format aplikasi portabel untuk Linux.</p>
            <ol>
                <li>Setelah unduhan selesai, buka Terminal di direktori tempat Anda menyimpan file <code>.AppImage</code>.</li>
                <li>Berikan izin eksekusi pada file tersebut dengan perintah:
                    <pre><code class="language-bash">sudo chmod +x inventaristkj-linux.AppImage</code></pre>
                </li>
                <li>Jalankan aplikasi. Ada beberapa cara:</li>
                <ul>
                    <li>Klik dua kali pada file <code>inventaristkj-linux.AppImage</code> di file manager Anda.</li>
                    <li>Atau, jalankan melalui Terminal dengan perintah (pastikan Anda tidak sebagai root):
                        <pre><code class="language-bash">./inventaristkj-linux.AppImage --no-sandbox</code></pre>
                         <small>Flag <code>--no-sandbox</code> mungkin diperlukan pada beberapa sistem.</small>
                    </li>
                </ul>
            </ol>
             <p class="modal-details" style="margin-top: 1rem; font-size: 0.9em;">Tidak perlu instalasi, file AppImage bisa langsung dijalankan.</p>
        </div>

        <div class="modal-footer" style="margin-top: 1rem;">
            <button type="button" class="btn btn-secondary" id="backToDownloadBtn">Kembali</button>
        </div>
    `);let o=document.getElementById("backToDownloadBtn");o&&o.addEventListener("click",()=>{S(),setTimeout(()=>{Ne()},300)});let s=document.getElementById("modalBody"),n=s.querySelectorAll(".modal-tab"),l=s.querySelectorAll(".modal-tab-content");if(n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(u=>u.classList.remove("active")),l.forEach(u=>u.classList.remove("active")),i.classList.add("active");let c=i.dataset.target,d=s.querySelector(`#${c}`);d&&d.classList.add("active")})}),typeof hljs>"u"){let i=document.createElement("script");i.src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js",i.onload=()=>{document.querySelectorAll("#linux-instructions pre code").forEach(d=>{hljs.highlightElement(d)})},document.body.appendChild(i);let c=document.createElement("link");c.rel="stylesheet",c.href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css",document.head.appendChild(c)}else document.querySelectorAll("#linux-instructions pre code").forEach(i=>{hljs.highlightElement(i)})}function Ne(){_("Aplikasi Desktop",`
        <p class="modal-details">
            Unduh aplikasi Inventaris TKJ untuk desktop.
        </p>
        <p class="modal-details" style="margin-bottom: 1.5rem;">
            Aplikasi akan tetap sama, hanya saja akan bisa di-install pada perangkat.
        </p>
        <div class="desktop-app-options">
            <div class="desktop-app-card">
                 <!-- Menggunakan Boxicons untuk konsistensi -->
                 <i class='bx bxl-windows desktop-app-icon windows'></i>
                 <h3 class="desktop-app-title">Windows</h3>
                 <p class="desktop-app-desc">Unduh <u>.exe</u> untuk Windows 10 & 11 (64-bit).</p>
                 <a href="https://tkjtools.skanesga.com/download/inventaristkj-win.exe" download class="btn btn-primary desktop-app-download-btn" data-os="Windows">
                     <i class='bx bxs-download'></i> Unduh
                 </a>
            </div>
            <div class="desktop-app-card">
                 <!-- Menggunakan Boxicons untuk konsistensi -->
                 <i class='bx bxl-tux desktop-app-icon linux'></i>
                 <h3 class="desktop-app-title">Linux</h3>
                 <p class="desktop-app-desc">Unduh .AppImage.</p>
                 <a href="https://tkjtools.skanesga.com/download/inventaristkj-linux.AppImage" download class="btn btn-primary desktop-app-download-btn" data-os="Linux">
                      <i class='bx bxs-download'></i> Unduh
                 </a>
            </div>
        </div>
        <div class="modal-footer" style="margin-top: 1rem; padding-top: 1.5rem;">
            <button type="button" class="btn btn-secondary close-modal-btn">Keluar</button>
            <button type="button" class="btn btn-primary" id="showInstructionsBtn"><i class='bx bx-info-circle'></i> Petunjuk</button>
        </div>
    `);let e=document.getElementById("showInstructionsBtn");e&&e.addEventListener("click",()=>{gt()}),document.querySelectorAll(".desktop-app-download-btn").forEach(t=>{t.addEventListener("click",a=>{let o=a.currentTarget.dataset.os;B(`Mengunduh aplikasi desktop untuk ${o}...`,"success"),setTimeout(()=>{gt(o)},500)})})}var Xt=e=>{if(!e)return;let t=e.querySelector('input[type="file"]'),a=e.querySelector(".image-uploader__preview"),o=n=>{let l=new FileReader;l.onload=()=>{a.src=l.result,e.classList.add("has-preview")},l.readAsDataURL(n)},s=n=>{if(n.length>0&&n[0].type.startsWith("image/")){let l=new DataTransfer;l.items.add(n[0]),t.files=l.files,o(n[0])}};e.addEventListener("click",()=>t.click()),t.addEventListener("change",()=>s(t.files)),e.addEventListener("dragover",n=>{n.preventDefault(),e.classList.add("drag-over")}),e.addEventListener("dragleave",()=>e.classList.remove("drag-over")),e.addEventListener("drop",n=>{n.preventDefault(),e.classList.remove("drag-over"),s(n.dataTransfer.files)})};var po=(e,t)=>{let a=`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(e)}&margin=10`,o=document.createElement("div");o.className="qr-modal-overlay",o.innerHTML=`
        <div class="qr-modal-content">
            <div class="qr-modal-header">
                ${m(t)}
            </div>
            <div class="qr-image-wrapper">
                <img src="${a}" alt="QR Code ${e}">
            </div>
            <div style="font-family: monospace; font-size: 0.9rem; color: var(--text-color-light); margin-top: -0.5rem;">
                ${m(e)}
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button type="button" class="btn btn-secondary btn-block close-qr-btn">Tutup</button>
                <button type="button" class="btn btn-primary btn-block download-qr-btn">
                    <i class='bx bxs-download'></i> Simpan
                </button>
            </div>
        </div>
    `,document.body.appendChild(o);let s=()=>o.remove();o.querySelector(".close-qr-btn").onclick=s,o.onclick=n=>{n.target===o&&s()},o.querySelector(".download-qr-btn").onclick=async n=>{let l=n.currentTarget,i=l.innerHTML;l.innerHTML='<div class="loading-spinner" style="width: 15px; height: 15px; border-width: 2px;"></div>',l.disabled=!0;try{let d=await(await fetch(a)).blob(),u=URL.createObjectURL(d),f=document.createElement("a");f.href=u,f.download=`QR_${t}.png`,document.body.appendChild(f),f.click(),document.body.removeChild(f),URL.revokeObjectURL(u),s()}catch(c){console.error("Gagal download QR:",c),alert("Gagal mengunduh gambar. Periksa koneksi internet."),l.innerHTML=i,l.disabled=!1}}},Re=(e=null)=>{let t=e!==null,a=t?r.items.find(p=>p.id==e):{};if(t&&!a)return;let o=t?`
        <div class="form-group">
            <label>Kode Barang (QR)</label>
            <div style="position: relative;">
                <input type="text" value="${m(a.item_code||"Belum ada kode")}" readonly style="background-color: var(--secondary-color); padding-right: 40px; color: var(--text-color-light); font-family: monospace; letter-spacing: 1px;">
                <i class='bx bx-qr qr-btn-trigger' 
                   data-code="${m(a.item_code)}" 
                   data-name="${m(a.name)}" 
                   title="Klik untuk lihat QR Code" 
                   style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--text-color-light); font-size: 1.4rem;"></i>
            </div>
            <small class="form-text">Klik ikon QR untuk melihat.</small>
        </div>
    `:"";if(_(t?"Edit Barang":"Barang Baru",`
        <form id="itemForm">
            <input type="hidden" name="id" value="${m(a.id||"")}">
            <input type="hidden" name="classifier" id="classifierValue" value="${m(a.classifier||"")}">
            <div class="form-group">
                <label for="itemName">Nama Barang</label>
                <input type="text" id="itemName" name="name" value="${m(a.name||"")}" required>
            </div>
            <div class="form-group">
                <label for="itemClassifierBtn">Jenis Alat</label>
                <div class="hybrid-dropdown">
                    <button type="button" class="hybrid-dropdown__selected" id="itemClassifierBtn">
                        <span class="hybrid-dropdown__placeholder">Pilih atau buat jenis baru...</span>
                        <div class="hybrid-dropdown__value"></div>
                        <i class='bx bx-chevron-down hybrid-dropdown__arrow'></i>
                    </button>
                    <div class="hybrid-dropdown__options">
                        <!-- Options are populated by JS -->
                    </div>
                </div>
            </div>
            ${o}
            <div class="form-group">
                <label for="itemQuantity">Jumlah Total</label>
                <input type="number" id="itemQuantity" name="total_quantity" min="1" value="${m(a.total_quantity||"")}" required>
            </div>
            <div class="form-group">
                <label for="itemImage">${t?"Ganti Gambar (Opsional)":"Gambar Barang"}</label>
                <div class="image-uploader">
                    <input type="file" id="itemImage" name="image" accept="image/*" hidden>
                    <div class="image-uploader__prompt"><i class="bx bx-upload"></i><p>Seret & lepas gambar, atau klik</p></div>
                    <img src="#" alt="Pratinjau" class="image-uploader__preview">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="submit" class="btn btn-primary">
                    <span class="btn__text">${t?"Update":"Simpan"}</span>
                    <div class="btn__progress"></div>
                </button>
            </div>
        </form>`),t){let p=document.querySelector(".qr-btn-trigger");p&&p.addEventListener("click",()=>{let v=p.dataset.code,b=p.dataset.name;v&&v!=="Belum ada kode"?po(v,b):alert("Kode barang belum tersedia.")})}let s=document.getElementById("itemForm"),n=s.querySelector(".hybrid-dropdown"),l=n.querySelector(".hybrid-dropdown__selected"),i=n.querySelector(".hybrid-dropdown__options"),c=n.querySelector(".hybrid-dropdown__placeholder"),d=n.querySelector(".hybrid-dropdown__value"),u=s.querySelector("#classifierValue"),f=()=>n.classList.remove("is-open"),g=p=>{u.value=p,p?(d.textContent=p,d.style.display="block",c.style.display="none"):(d.style.display="none",c.style.display="block"),f()},y=()=>{i.innerHTML="";let p=document.createElement("div");p.className="hybrid-dropdown__option hybrid-dropdown__option--create",p.innerHTML="<i class='bx bx-plus-circle'></i><span>Buat Jenis Baru</span>",p.onclick=v=>{v.stopPropagation(),i.innerHTML=`
                <div class="hybrid-dropdown__new-input-container">
                    <input type="text" placeholder="Contoh: Router, Switch..." class="hybrid-dropdown__new-input">
                    <button type="button" class="btn btn-primary hybrid-dropdown__save-btn"><i class='bx bx-check'></i></button>
                </div>`;let b=i.querySelector(".hybrid-dropdown__new-input"),x=i.querySelector(".hybrid-dropdown__save-btn");b.focus();let w=()=>{let h=b.value.trim();h&&g(h)};b.onkeydown=h=>{h.key==="Enter"&&w()},x.onclick=w},i.appendChild(p),r.classifiers.forEach(v=>{let b=document.createElement("div");b.className="hybrid-dropdown__option",b.textContent=v,b.onclick=()=>g(v),i.appendChild(b)})};l.onclick=()=>{n.classList.contains("is-open")||y(),n.classList.toggle("is-open")},a.classifier&&g(a.classifier),s.addEventListener("submit",Zt),Xt(s.querySelector(".image-uploader")),document.addEventListener("click",function(p){n.contains(p.target)||f()},!0)};var bt=e=>{let t=r.items.find(a=>a.id==e);t&&(_("Konfirmasi Hapus",`
        <p class="modal-details">Anda yakin ingin menghapus <strong>${m(t.name)}</strong>?</p>
        <div class="modal-footer"><button type="button" class="btn btn-secondary close-modal-btn">Batal</button><button type="button" id="confirmDeleteBtn" class="btn btn-danger">Ya, Hapus</button></div>`),document.getElementById("confirmDeleteBtn").onclick=()=>ea(e))};var yt=()=>{let e=r.selectedItems;if(e.length===0)return;let t=e.map(l=>r.items.find(i=>i.id==l)).filter(Boolean),a=t.filter(l=>l.current_quantity<l.total_quantity),o=t.map(l=>`<li>${m(l.name)}</li>`).join(""),s,n;a.length>0?(s=`
            <p class="modal-warning-text" style="text-align: left;"><strong>Tidak dapat menghapus.</strong></p>
            <p>Barang berikut sedang dalam status dipinjam:</p>
            <ul style="list-style-position: inside; margin: 1rem 0; background-color: var(--danger-color-light-bg); padding: 1rem; border-radius: var(--border-radius);">${a.map(i=>`<li><strong>${m(i.name)}</strong></li>`).join("")}</ul>
            <p class="modal-details">Kembalikan barang dahulu sebelum menghapusnya.</p>
        `,n='<button type="button" class="btn btn-secondary close-modal-btn">Tutup</button>'):(s=`
            <p class="modal-details">Anda akan menghapus <strong>${e.length} barang</strong> berikut secara permanen?</p>
            <ul style="list-style-position: inside; margin: 1rem 0;">${o}</ul>
            <p class="modal-warning-text" style="text-align: left;">Tindakan ini tidak dapat diurungkan.</p>
        `,n=`
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="confirmDeleteMultipleBtn" class="btn btn-danger">Ya, Hapus</button>
        `),_("Konfirmasi Hapus",`
        ${s}
        <div class="modal-footer">${n}</div>
    `),a.length===0&&(document.getElementById("confirmDeleteMultipleBtn").onclick=()=>ta(e))};var Le="all",aa,fo=e=>{let t=document.getElementById("accountFilterOptions");if(!t)return;let a=e.map(s=>`<li data-filter="${m(s)}">${m(s)}</li>`).join(""),o='<li class="filter-divider"></li><li data-filter="admin" class="filter-admin-option">Admin</li>';t.innerHTML='<li data-filter="all">Semua</li>'+a+o},Ue=async(e=!1)=>{if(r.isLoadingMoreAccounts)return;if(r.isLoadingMoreAccounts=!0,!e)r.accountPage=1,r.accounts=[];else{r.accountPage++;let a=document.getElementById("accountLoaderContainer");a&&(a.innerHTML='<div class="loading-spinner" style="width:30px;height:30px;border-width:3px;margin:1rem auto;"></div>')}let t=document.getElementById("accountSearch").value;try{let a=new URLSearchParams({action:"get_accounts",page:r.accountPage,search:t,filter:Le}),s=await(await fetch(`${k}?${a.toString()}`)).json();if(s.status==="success"&&s.data){let n=s.data.records||[];r.accounts=e?[...r.accounts,...n]:n,r.hasMoreAccounts=s.data.hasMore,s.data.classes_full&&(r.classes=s.data.classes_full),e||fo(s.data.classes||[]),vt(e)}else throw new Error(s.message||"Gagal memuat data akun.")}catch(a){B(`Gagal memuat data akun: ${a.message}`,"error"),r.hasMoreAccounts=!1,vt(e)}finally{r.isLoadingMoreAccounts=!1,ne()}},oa=e=>{let t=r.selectedAccounts.includes(e.id.toString()),a=e.role==="admin"?e.username||"-":e.nis||"-",o=e.kelas||"-";return`
    <div class="account-list-item ${t?"is-selected":""}" data-account-id="${m(e.id)}">
        <div class="account-item__selection-icon">
            <i class='bx bxs-check-circle'></i>
        </div>
        <div class="account-item__nis" data-label="ID Pengguna:">${m(a)}</div>
        <div class="account-item__name" data-label="Nama:">${m(e.nama)}</div>
        <div class="account-item__class" data-label="Kelas:">${m(o)}</div>
        <div class="account-item__actions">
            <button class="btn btn-secondary action-btn edit-account-btn" title="Edit Akun">
                <i class='bx bx-key'></i>
            </button>
            <button class="btn btn-danger action-btn delete-account-btn" title="Hapus Akun">
                <i class='bx bx-trash'></i>
            </button>
        </div>
    </div>
    `},vt=(e=!1)=>{let t=document.getElementById("accountList"),a=document.getElementById("accountLoaderContainer");if(!(!t||!a)){if(e){let s=r.accounts.slice(-Math.abs(r.accounts.length-(r.accountPage-1)*30)).map(oa).join("");t.insertAdjacentHTML("beforeend",s)}else{t.querySelector(".account-list-header")||(t.innerHTML=`
                <div class="account-list-header">
                    <div style="text-align: center;">ID Pengguna</div>
                    <div>Nama Pengguna</div>
                    <div>Kelas</div>
                    <div style="text-align: center;">Aksi</div>
                </div>
            `);let o=t.querySelector(".empty-state");if(r.accounts.length===0){if(!o){let s=O("Akun Tidak Ditemukan","Tidak ada akun yang cocok dengan filter atau pencarian.");t.insertAdjacentHTML("beforeend",s),o=t.querySelector(".empty-state")}o.style.display="flex"}else o&&(o.style.display="none");W(t,r.accounts,oa,"id","accountId",".account-list-item")}r.hasMoreAccounts?(a.innerHTML='<button id="loadMoreAccountsBtn" class="btn btn-primary">Selengkapnya</button>',document.getElementById("loadMoreAccountsBtn").onclick=()=>Ue(!0)):a.innerHTML='<p class="end-of-list">Semua data telah ditampilkan.</p>',go()}},go=()=>{document.querySelectorAll(".account-list-item").forEach(e=>{if(e._listenersAttached)return;e.addEventListener("click",o=>{if(o.target.closest(".action-btn"))return;let s=e.dataset.accountId;if(!s)return;e.classList.toggle("is-selected");let n=r.selectedAccounts.indexOf(s);n>-1?r.selectedAccounts.splice(n,1):r.selectedAccounts.push(s),ne()});let t=e.querySelector(".edit-account-btn");t&&t.addEventListener("click",()=>{let o=e.dataset.accountId,s=r.accounts.find(n=>n.id==o);s&&ht(s)});let a=e.querySelector(".delete-account-btn");a&&a.addEventListener("click",()=>{let o=e.dataset.accountId,s=r.accounts.find(n=>n.id==o);s&&wt(s)}),e._listenersAttached=!0})},bo=()=>{let e=document.getElementById("accountSearch"),t=document.getElementById("accountFilterBtn"),a=document.getElementById("accountFilterOptions");e?.addEventListener("input",()=>{clearTimeout(aa),aa=setTimeout(()=>{Ue(!1)},300)}),t?.addEventListener("click",()=>a.classList.toggle("show")),a?.addEventListener("click",o=>{if(o.target.tagName==="LI"&&!o.target.classList.contains("filter-divider")){Le=o.target.dataset.filter,t.innerHTML=`<i class='bx bx-filter-alt'></i> ${o.target.textContent}`;let s="filter-all";Le==="admin"?s="filter-admin":Le!=="all"&&(s="filter-available"),t.className=`btn ${s}`,a.classList.remove("show"),Ue(!1)}})},Oe=async e=>{e.preventDefault();let t=e.target,a=t.querySelector('button[type="submit"]'),o=new FormData(t),s=!!o.get("id");o.append("action",s?"edit_account":"add_account"),o.append("csrf_token",L),a.disabled=!0;try{let n=await fetch(k,{method:"POST",body:o});(await $(n)).status==="success"&&(S(),await me())}catch{B("Gagal memproses permintaan.","error")}finally{a&&(a.disabled=!1)}},sa=async e=>{let t=new FormData;t.append("action","delete_account"),t.append("id",e),t.append("csrf_token",L);try{let a=await fetch(k,{method:"POST",body:t});(await $(a)).status==="success"&&await me()}catch{B("Gagal menghapus akun.","error")}finally{S()}},na=async e=>{let t=new FormData;t.append("action","delete_multiple_accounts"),t.append("csrf_token",L),e.forEach(a=>t.append("ids[]",a));try{let a=await fetch(k,{method:"POST",body:t});(await $(a)).status==="success"&&(r.selectedAccounts=[],await me())}catch{B("Gagal menghapus beberapa akun.","error")}finally{S()}},ra=()=>{let e=r.accounts.map(a=>a.id.toString());if(e.length>0&&e.every(a=>r.selectedAccounts.includes(a)))r.selectedAccounts=r.selectedAccounts.filter(a=>!e.includes(a));else{let a=new Set([...r.selectedAccounts,...e]);r.selectedAccounts=Array.from(a)}vt(!1),ne()},me=async()=>{Le="all",r.selectedAccounts=[];let e=document.getElementById("accountFilterBtn");e&&(e.innerHTML="<i class='bx bx-filter-alt'></i> Semua",e.className="btn filter-all");let t=document.getElementById("accountSearch");t&&(t.value=""),await Ue(!1)};bo();window.addEventListener("classDataChanged",()=>{document.getElementById("accounts")?.classList.contains("active")&&me()});var pe=(e,t)=>{let a=t.querySelector(".nis-field"),o=t.querySelector(".kelas-field"),s=t.querySelector(".username-field"),n=a?.querySelector("input"),l=o?.querySelector('input[type="hidden"]'),i=s?.querySelector("input");e==="admin"?(a&&(a.style.display="none"),o&&(o.style.display="none"),s&&(s.style.display="block"),n&&(n.required=!1),l&&(l.required=!1),i&&(i.required=!0)):(a&&(a.style.display="block"),o&&(o.style.display="block"),s&&(s.style.display="none"),n&&(n.required=!0),l&&(l.required=!0),i&&(i.required=!1))};var kt=()=>{_("Tambah Akun Baru",`
        <form id="accountForm" novalidate>
            <div class="form-group">
                <label for="accountRoleBtn">Role</label>
                <div class="custom-dropdown">
                    <input type="hidden" id="accountRole" name="role" value="user" required>
                    <button type="button" class="custom-dropdown__selected" id="accountRoleBtn">
                        <span class="custom-dropdown__placeholder">Pilih Role</span>
                        <div class="custom-dropdown__value"></div>
                        <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                    </button>
                    <div class="custom-dropdown__options">
                        <div class="custom-dropdown__option" data-value="user" data-display="<span>User (Siswa)</span>"><span class="custom-dropdown__option-name">User (Siswa)</span></div>
                        <div class="custom-dropdown__option" data-value="admin" data-display="<span>Admin</span>"><span class="custom-dropdown__option-name">Admin</span></div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="accountName">Nama Lengkap</label>
                <input type="text" id="accountName" name="nama" required>
            </div>
             <div class="form-group username-field" style="display: none;">
                <label for="accountUsername">Username</label>
                <input type="text" id="accountUsername" name="username">
            </div>
            <div class="form-group nis-field">
                <label for="accountNis">NIS</label>
                <input type="text" id="accountNis" name="nis" required>
            </div>
            <div class="form-group kelas-field">
                <label for="accountClassBtn">Kelas</label>
                <div class="hybrid-dropdown" id="class-hybrid-dropdown">
                     <input type="hidden" id="accountClass" name="kelas" required>
                     <button type="button" class="hybrid-dropdown__selected" id="accountClassBtn">
                        <span class="hybrid-dropdown__placeholder">Pilih atau buat kelas...</span>
                        <div class="hybrid-dropdown__value"></div>
                        <i class='bx bx-chevron-down hybrid-dropdown__arrow'></i>
                    </button>
                    <div class="hybrid-dropdown__options">
                        <!-- Opsi kelas dinamis dimuat di sini -->
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="accountPassword">Password</label>
                <input type="password" id="accountPassword" name="password" required minlength="8">
                <small class="form-text">Minimal 8 karakter.</small>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
            </div>
        </form>
    `);let e=document.getElementById("accountForm");re(e,a=>{pe(a,e)}),Ee(document.getElementById("class-hybrid-dropdown"));let t=e.querySelector("#accountRole").value;pe(t,e),e.addEventListener("submit",Oe)};var ht=e=>{_("Edit Akun",`
        <form id="accountForm" novalidate>
            <input type="hidden" name="id" value="${m(e.id)}">
            <div class="form-group">
                <label for="accountRoleBtn">Role</label>
                <div class="custom-dropdown">
                    <input type="hidden" id="accountRole" name="role" value="${m(e.role)}" required>
                    <button type="button" class="custom-dropdown__selected" id="accountRoleBtn">
                        <span class="custom-dropdown__placeholder">Pilih Role</span>
                        <div class="custom-dropdown__value"></div>
                        <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                    </button>
                    <div class="custom-dropdown__options">
                        <div class="custom-dropdown__option" data-value="user" data-display="<span>User (Siswa)</span>"><span class="custom-dropdown__option-name">User (Siswa)</span></div>
                        <div class="custom-dropdown__option" data-value="admin" data-display="<span>Admin</span>"><span class="custom-dropdown__option-name">Admin</span></div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="accountName">Nama Lengkap</label>
                <input type="text" id="accountName" name="nama" value="${m(e.nama||"")}" required>
            </div>
            <div class="form-group username-field" style="display: none;">
                <label for="accountUsername">Username</label>
                <input type="text" id="accountUsername" name="username" value="${m(e.username||"")}">
            </div>
            <div class="form-group nis-field">
                <label for="accountNis">NIS</label>
                <input type="text" id="accountNis" name="nis" value="${m(e.nis||"")}">
            </div>
            <div class="form-group kelas-field">
                <label for="accountClassBtn">Kelas</label> 
                <div class="hybrid-dropdown" id="class-hybrid-dropdown">
                     <input type="hidden" id="accountClass" name="kelas" value="${m(e.kelas||"")}">
                     <button type="button" class="hybrid-dropdown__selected" id="accountClassBtn">
                        <span class="hybrid-dropdown__placeholder">Pilih atau buat kelas...</span>
                        <div class="hybrid-dropdown__value"></div>
                        <i class='bx bx-chevron-down hybrid-dropdown__arrow'></i>
                    </button>
                    <div class="hybrid-dropdown__options">
                        <!-- Opsi kelas dinamis dimuat di sini -->
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="accountPassword">Password Baru</label>
                <input type="password" id="accountPassword" name="password" minlength="8">
                <small class="form-text">Kosongkan jika tidak ingin mengubah password.</small>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="submit" class="btn btn-primary">Update</button>
            </div>
        </form>
    `);let t=document.getElementById("accountForm");re(t,a=>{pe(a,t)}),Ee(document.getElementById("class-hybrid-dropdown")),pe(e.role,t),t.addEventListener("submit",Oe)};var wt=e=>{_("Konfirmasi Hapus Akun",`
        <p class="modal-details">Anda yakin ingin menghapus akun:</p>
        <p><strong>${m(e.nama)} (${m(e.role==="admin"?e.username:e.nis)})</strong></p>
        <p class="modal-warning-text" style="text-align: left; margin-top: 1rem;">Tindakan ini tidak dapat diurungkan.</p>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="confirmDeleteAccountBtn" class="btn btn-danger">Ya, Hapus</button>
        </div>
    `),document.getElementById("confirmDeleteAccountBtn").onclick=()=>sa(e.id)};var _t=()=>{let e=r.selectedAccounts;e.length!==0&&(_("Konfirmasi Hapus Akun",`
        <p class="modal-details">Anda yakin ingin menghapus <strong>${e.length} akun</strong> yang dipilih secara permanen?</p>
        <p class="modal-warning-text" style="text-align: left; margin-top: 1rem;">Tindakan ini tidak dapat diurungkan.</p>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="confirmDeleteMultipleAccountsBtn" class="btn btn-danger">Ya, Hapus</button>
        </div>
    `),document.getElementById("confirmDeleteMultipleAccountsBtn").onclick=()=>na(e))};var ia=()=>/Mobi|Android|iPhone/i.test(navigator.userAgent),la=(e,t,a)=>{if(!("mediaDevices"in navigator&&"getUserMedia"in navigator.mediaDevices)){console.warn("Camera API not supported, falling back to gallery input."),t&&t.click();return}let o=document.createElement("div");o.className="camera-overlay",o.innerHTML=`
        <div class="camera-container">
            <video id="cameraFeed" autoplay playsinline style="transform: scaleX(-1);"></video>
            <canvas id="cameraCanvas" style="display:none;"></canvas>
            <div class="camera-controls">
                <div class="camera-select-wrapper">
                    <i class='bx bxs-camera-switch'></i>
                    <select id="cameraSelectList" class="camera-select-list" title="Ganti Kamera" style="display: none;">
                        <option value="">Memuat Kamera...</option>
                    </select>
                </div>
                <button type="button" class="camera-capture-btn" title="Ambil Gambar"></button>
                <button type="button" class="camera-cancel-btn" title="Batal"><i class='bx bx-x'></i></button>
            </div>
        </div>
    `,document.body.appendChild(o);let s=document.getElementById("cameraFeed"),n=document.getElementById("cameraCanvas"),l=o.querySelector(".camera-capture-btn"),i=o.querySelector(".camera-cancel-btn"),c=document.getElementById("cameraSelectList"),d=null,u=[],f=()=>{d&&d.getTracks().forEach(y=>y.stop()),document.body.contains(o)&&document.body.removeChild(o)},g=async y=>{d&&d.getTracks().forEach(v=>v.stop());let p={audio:!1,video:{facingMode:"user"}};y&&(p.video={deviceId:{exact:y}});try{if(d=await navigator.mediaDevices.getUserMedia(p),s.srcObject=d,u.length===0&&(await new Promise(b=>setTimeout(b,200)),u=(await navigator.mediaDevices.enumerateDevices()).filter(b=>b.kind==="videoinput"),u.length>=1)){let x=d.getVideoTracks()[0].getSettings().deviceId;c.innerHTML="",u.forEach((w,h)=>{let I=document.createElement("option");I.value=w.deviceId,I.text=w.label||`Kamera ${h+1}`,w.deviceId===x&&(I.selected=!0),c.appendChild(I)}),c.style.display="block"}}catch{B("Gagal mengakses kamera. Silakan gunakan unggah dari galeri.","error"),f(),t&&t.click()}};c.addEventListener("change",()=>{g(c.value)}),g(null),i.onclick=f,o.onclick=y=>{y.target===o&&f()},l.onclick=()=>{if(!d)return;n.width=s.videoWidth,n.height=s.videoHeight;let y=n.getContext("2d");y.translate(n.width,0),y.scale(-1,1),y.drawImage(s,0,0,n.width,n.height),n.toBlob(p=>{let v=`capture_${new Date().toISOString()}.jpg`,b=new File([p],v,{type:"image/jpeg",lastModified:Date.now()});t&&(t.value="");let x=new DataTransfer;x.items.add(b),e.files=x.files,a(b),f()},"image/jpeg",.9)}};var xt=e=>{let t=r.borrowals.filter(g=>g.transaction_id===e);if(t.length===0)return;let a=t[0],o=t.map(g=>`<li><strong>${m(g.quantity)}x</strong> ${m(g.item_name)}</li>`).join("");_("Pengembalian",`
        <form id="returnForm">
            <input type="hidden" name="transaction_id" value="${e}">
            <p>Konfirmasi pengembalian dari <strong>${m(a.borrower_name)}</strong> (${m(a.borrower_class)}):</p>
            <ul style="list-style-position: inside; margin: 1rem 0;">${o}</ul>
            <div class="form-group">
                <label for="returnProofGallery">Bukti Pengembalian</label>
                <input type="file" id="returnProofGallery" name="proof_image" accept="image/*" hidden>
                <input type="file" id="returnProofCamera" name="proof_image_camera" accept="image/*" capture="environment" hidden>
                
                <div class="image-uploader">
                    <div class="image-uploader__prompt"><i class='bx bx-upload'></i><p>Unggah dari galeri</p></div>
                    <img src="#" alt="Pratinjau" class="image-uploader__preview">
                </div>
                <button type="button" id="takePictureBtn" class="btn btn-secondary btn-block" style="margin-top: 1rem;"><i class='bx bxs-camera'></i> Ambil Foto</button>
                <small id="file-error" class="text-danger" style="display:none; margin-top: 0.5rem;">Bukti foto wajib diunggah.</small>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="submit" class="btn btn-primary">
                    <span class="btn__text">Konfirmasi</span>
                    <div class="btn__progress"></div>
                </button>
            </div>
        </form>`);let s=document.getElementById("returnForm"),n=document.getElementById("returnProofGallery"),l=document.getElementById("returnProofCamera"),i=s.querySelector(".image-uploader"),c=s.querySelector(".image-uploader__preview"),d=document.getElementById("takePictureBtn"),u=document.getElementById("file-error"),f=g=>{if(!g)return;let y=new FileReader;y.onload=()=>{c.src=y.result,i.classList.add("has-preview"),u.style.display="none"},y.readAsDataURL(g)};i.addEventListener("click",()=>n.click()),i.addEventListener("dragover",g=>{g.preventDefault(),i.classList.add("drag-over")}),i.addEventListener("dragleave",()=>i.classList.remove("drag-over")),i.addEventListener("drop",g=>{g.preventDefault(),i.classList.remove("drag-over"),g.dataTransfer.files.length>0&&(l.value="",n.files=g.dataTransfer.files,f(n.files[0]))}),ia()?d.addEventListener("click",()=>l.click()):d.addEventListener("click",()=>{la(l,n,f)}),n.addEventListener("change",()=>{n.files.length>0&&(l.value="",f(n.files[0]))}),l.addEventListener("change",()=>{l.files.length>0&&(n.value="",f(l.files[0]))}),s.addEventListener("submit",g=>{if(g.preventDefault(),n.files.length===0&&l.files.length===0){u.style.display="block";return}n.files.length>0?l.disabled=!0:n.disabled=!0,ca(g).finally(()=>{l.disabled=!1,n.disabled=!1})})};var St=e=>{let t=r.borrowals.filter(d=>d.transaction_id===e);if(t.length===0)return;let a=t[0],o=t.map(d=>`
        <li class="transaction-group__item" style="padding: 0.75rem 0;">
            <img src="${m(d.image_url||"https://placehold.co/50x50/8ab4f8/ffffff?text=?")}" alt="${m(d.item_name)}" class="transaction-group__item-img">
            <div class="transaction-group__item-details">
                <div class="transaction-group__item-name">${m(d.item_name)}</div>
                <div class="transaction-group__item-qty">Jumlah: ${m(d.quantity)} pcs</div>
            </div>
        </li>
    `).join("");_("Tambah Alat",`
        <div class="form-group">
            <label>Peminjam</label>
            <input type="text" value="${m(a.borrower_name)} (${m(a.borrower_class)})" readonly>
        </div>
        <div class="form-group">
            <label>Sudah Dipinjam</label>
            <ul class="transaction-group__items" style="max-height: 150px; overflow-y: auto; padding: 1rem; background-color: var(--secondary-color); border-radius: var(--border-radius);">${o}</ul>
        </div>
        
        <form id="addItemForm">
            <input type="hidden" name="transaction_id" value="${e}">
            <p style="font-weight: 500; margin-bottom: 1rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">Tambah Alat</p>
            
            <div id="newItemsContainer">
                <!-- Baris item baru akan ditambahkan di sini oleh JS -->
            </div>

            <div class="form-group" style="margin-top: 1.5rem; text-align: center;">
                <button type="button" id="addNewItemBtn" class="btn btn-secondary btn-block">
                    <i class='bx bx-plus'></i>
                    <span>Tambah Alat</span>
                </button>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="submit" class="btn btn-primary">
                    <span class="btn__text">Simpan</span>
                </button>
            </div>
        </form>
    `);let s=document.getElementById("newItemsContainer"),n=0,l=()=>{let d=Array.from(s.querySelectorAll('input[name="item_id"]')).map(g=>g.value).filter(Boolean),u=t.map(g=>g.item_id.toString()),f=[...d,...u];s.querySelectorAll(".custom-dropdown").forEach(g=>{let y=g.querySelector('input[name="item_id"]').value;g.querySelectorAll(".custom-dropdown__option").forEach(p=>{let v=f.includes(p.dataset.value)&&p.dataset.value!==y;p.setAttribute("aria-disabled",v)})})},i=()=>{let d=s.querySelectorAll(".borrow-item-row");if(d.forEach(u=>{let f=u.querySelector(".remove-last-item-btn");f&&f.remove()}),d.length>1){let u=d[d.length-1],f=document.createElement("button");f.type="button",f.className="btn btn-secondary remove-last-item-btn",f.title="Hapus alat terakhir",f.innerHTML="<i class='bx bx-chevron-up'></i>",f.onclick=()=>{u.remove(),l(),i()},u.appendChild(f)}},c=()=>{n++;let d=`new-item-row-${n}`,u=document.createElement("div");u.className="borrow-item-row",u.id=d;let g=r.items.filter(b=>b.current_quantity>0).map(b=>`
            <div class="custom-dropdown__option" data-value="${b.id}" data-max="${b.current_quantity}" data-display="<img src='${b.image_url||"https://placehold.co/40x40/8ab4f8/ffffff?text=?"}' alt='${b.name}'><span>${b.name}</span>">
                <img src="${b.image_url||"https://placehold.co/40x40/8ab4f8/ffffff?text=?"}" alt="${b.name}" class="custom-dropdown__option-img">
                <div class="custom-dropdown__option-info">
                    <span class="custom-dropdown__option-name">${b.name}</span>
                    <span class="custom-dropdown__option-qty">Sisa: ${b.current_quantity}</span>
                </div>
            </div>`).join("");u.innerHTML=`
            <div class="form-group borrow-item-row__item">
                <div class="custom-dropdown">
                    <input type="hidden" name="item_id" required>
                    <button type="button" class="custom-dropdown__selected">
                        <span class="custom-dropdown__placeholder">Pilih Alat</span>
                        <div class="custom-dropdown__value"></div>
                        <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                    </button>
                    <div class="custom-dropdown__options">${g}</div>
                </div>
            </div>
            <div class="form-group borrow-item-row__quantity">
                <input type="number" id="quantity-new-${n}" name="quantity" min="1" value="1" required>
                <small class="form-text max-quantity-hint"></small>
            </div>
        `;let y=u.querySelector(".custom-dropdown"),p=u.querySelector('input[type="number"]'),v=u.querySelector(".max-quantity-hint");y.querySelectorAll(".custom-dropdown__option").forEach(b=>{b.addEventListener("click",()=>{if(b.getAttribute("aria-disabled")==="true")return;let x=y.querySelector('input[type="hidden"]');x.value=b.dataset.value;let w=y.querySelector(".custom-dropdown__value");w.innerHTML=b.dataset.display,w.style.display="flex",y.querySelector(".custom-dropdown__placeholder").style.display="none",y.classList.remove("is-open"),p.max=b.dataset.max,parseInt(p.value)>parseInt(b.dataset.max)&&(p.value=1),v.textContent=`Maks: ${b.dataset.max}`,l()})}),s.appendChild(u),l(),i()};c(),document.getElementById("addNewItemBtn").addEventListener("click",c),document.getElementById("addItemForm").addEventListener("submit",da)};var Bt=e=>{let t=r.borrowals.find(y=>y.id==e);if(!t)return;let o=r.items.filter(y=>y.current_quantity>0||y.id==t.item_id).map(y=>{let p=y.id==t.item_id?y.current_quantity+t.quantity:y.current_quantity,v=m(y.image_url||"[https://placehold.co/40x40/8ab4f8/ffffff?text=](https://placehold.co/40x40/8ab4f8/ffffff?text=)?"),b=m(y.name);return`
        <div class="custom-dropdown__option" data-value="${m(y.id)}" data-max="${m(p)}" data-display="<img src='${v}' alt='${b}'><span>${b}</span>">
            <img src="${v}" alt="${b}" class="custom-dropdown__option-img">
            <div class="custom-dropdown__option-info">
                <span class="custom-dropdown__option-name">${b}</span>
                <span class="custom-dropdown__option-qty">Sisa: ${m(y.current_quantity)}</span>
            </div>
        </div>`}).join(""),s=r.items.find(y=>y.id==t.item_id),n=s?s.current_quantity+t.quantity:t.quantity,l=s?`<img src='${m(s.image_url||"https://placehold.co/40x40/8ab4f8/ffffff?text=?")}' alt='${m(s.name)}'><span>${m(s.name)}</span>`:"<span>Barang tidak ditemukan</span>";_("Ubah Peminjaman",`
        <form id="editBorrowalForm">
            <input type="hidden" name="borrowal_id" value="${t.id}">
            <p class="modal-warning-text" style="text-align: left;"><strong>PERINGATAN:</strong> Tindakan ini akan mengubah data peminjaman dan stok barang secara langsung.</p>
            <div class="form-group">
                <label>Nama Peminjam</label>
                <input type="text" value="${m(t.borrower_name)} (${m(t.borrower_class)})" readonly>
            </div>
             <div class="form-group">
                <label>Alat</label>
                <div class="custom-dropdown" id="editItemDropdown">
                    <input type="hidden" name="new_item_id" value="${t.item_id}" required>
                    <button type="button" class="custom-dropdown__selected">
                        <div class="custom-dropdown__value" style="display: flex;">${l}</div>
                        <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                    </button>
                    <div class="custom-dropdown__options">${o}</div>
                </div>
            </div>
            <div class="form-group">
                <label for="newQuantity">Jumlah</label>
                <input type="number" id="newQuantity" name="new_quantity" min="1" max="${m(n)}" value="${m(t.quantity)}" required>
                <small class="form-text max-quantity-hint">Maksimal pinjam: ${m(n)}</small>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="submit" class="btn btn-primary">Update</button>
            </div>
        </form>
    `);let i=document.getElementById("editItemDropdown"),c=i.querySelector(".custom-dropdown__options"),d=i.querySelector(".custom-dropdown__value"),u=i.querySelector('input[name="new_item_id"]'),f=document.getElementById("newQuantity"),g=document.querySelector(".max-quantity-hint");c.addEventListener("click",y=>{let p=y.target.closest(".custom-dropdown__option");if(!p)return;let v=parseInt(p.dataset.max);u.value=p.dataset.value,d.innerHTML=p.dataset.display,i.classList.remove("is-open"),f.max=v,(parseInt(f.value)>v||f.value<1)&&(f.value=v>0?1:0),g.textContent=`Maksimal pinjam: ${v}`}),document.getElementById("editBorrowalForm").addEventListener("submit",ua)};var It=e=>{let t=r.borrowals.find(a=>a.id==e);t&&(_("Konfirmasi Hapus",`
        <p class="modal-warning-text" style="text-align: left; margin-top: 1rem;"><strong>PERINGATAN:</strong> Stok barang akan dikembalikan. Tindakan ini tidak dapat diurungkan.</p>
        <p class="modal-details">Anda yakin ingin menghapus item peminjaman:</p>
        <p class="modal-details"><strong>${m(t.item_name)} (${m(t.quantity)} pcs)</strong> oleh <strong>${m(t.borrower_name)}</strong>?</p>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="confirmDeleteBorrowalBtn" class="btn btn-danger">Ya, Hapus</button>
        </div>`),document.getElementById("confirmDeleteBorrowalBtn").onclick=()=>ma(e))};var Lt=e=>{let t=r.borrowals.find(h=>h.id==e);if(!t)return;let a=r.items.find(h=>h.id==t.item_id),o=a?a.classifier:null,n=r.items.filter(h=>{let I=h.current_quantity>=1,M=h.id==t.item_id,H=o&&h.classifier===o;return I&&(M||H)}).map(h=>{let M=h.id==t.item_id?" (Barang Sama)":"";return`
        <div class="custom-dropdown__option" data-value="${h.id}" data-stock="${h.current_quantity}" data-display="<img src='${m(h.image_url||"assets/favicon/dummy.jpg")}' alt='${m(h.name)}'><span>${m(h.name)}</span>">
            <img src="${m(h.image_url||"assets/favicon/dummy.jpg")}" alt="${m(h.name)}" class="custom-dropdown__option-img">
            <div class="custom-dropdown__option-info">
                <span class="custom-dropdown__option-name">${m(h.name)} ${M}</span>
                <span class="custom-dropdown__option-qty">Sisa: ${m(h.current_quantity)}</span>
            </div>
        </div>
    `}).join(""),l=n.length>0?n:'<div style="padding:1rem;text-align:center;color:var(--text-color-light);">Tidak ada barang pengganti sejenis yang tersedia.</div>';_("Tukar Barang",`
        <form id="swapItemForm">
            <input type="hidden" name="borrowal_id" value="${t.id}">
            
            <div class="form-group">
                <label>Barang (Akan Ditukar)</label>
                <div class="form-static-item-display">
                    <img src="${m(t.image_url||"assets/favicon/dummy.jpg")}" alt="Item">
                    <span>${m(t.item_name)} (${t.quantity} pcs)</span>
                </div>
            </div>

            <div class="form-group">
                <label>Jumlah yang Ditukar</label>
                <input type="number" id="swapQuantity" name="swap_quantity" class="form-control" min="1" max="${t.quantity}" value="1" required>
                <small class="form-text text-muted">Maksimal: ${t.quantity} pcs</small>
            </div>

            <div class="form-group">
                <label>Kondisi Saat Ini</label>
                <div class="custom-dropdown" id="conditionDropdown">
                    <input type="hidden" id="swapCondition" name="condition" value="bad" required>
                    <button type="button" class="custom-dropdown__selected">
                        <span class="custom-dropdown__value" style="display: block;">Rusak & Tukar</span>
                        <span class="custom-dropdown__placeholder" style="display: none;">Pilih Kondisi</span>
                        <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                    </button>
                    <div class="custom-dropdown__options">
                        <div class="custom-dropdown__option" data-value="bad" data-display="Rusak & Tukar">
                            <span class="custom-dropdown__option-name">Rusak & Tukar</span>
                        </div>
                        <div class="custom-dropdown__option" data-value="good" data-display="Normal (Hanya Tukar)">
                            <span class="custom-dropdown__option-name">Normal (Hanya Tukar)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-group" id="remarkField" style="display: block;">
                <label for="swapRemark">Kendala / Kerusakan</label>
                <input type="text" id="swapRemark" name="remark" class="form-control" placeholder="Contoh: Tidak Bisa Menyala..." autocomplete="off" required>
            </div>

            <div class="form-group">
                <label>Pilih Barang Pengganti</label>
                <div class="custom-dropdown" id="swapItemDropdown">
                    <input type="hidden" name="new_item_id" required>
                    <button type="button" class="custom-dropdown__selected">
                        <span class="custom-dropdown__placeholder">Barang Pengganti</span>
                        <div class="custom-dropdown__value"></div>
                        <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                    </button>
                    <div class="custom-dropdown__options">
                        ${l}
                    </div>
                </div>
                <small class="form-text" id="replacementStockHint">Menampilkan barang yang sama atau sejenis.</small>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="submit" class="btn btn-primary">Tukar Barang</button>
            </div>
        </form>
    `);let i=document.getElementById("swapItemForm"),c=document.getElementById("swapQuantity"),d=document.getElementById("swapCondition"),u=document.getElementById("remarkField"),f=document.getElementById("swapRemark"),g=document.getElementById("replacementStockHint"),y=document.getElementById("conditionDropdown"),p=y.querySelector(".custom-dropdown__selected"),v=y.querySelector(".custom-dropdown__options");p.onclick=h=>{h.stopPropagation();let I=document.getElementById("swapItemDropdown");I&&I.classList.remove("is-open"),y.classList.toggle("is-open")},v.onclick=h=>{let I=h.target.closest(".custom-dropdown__option");if(!I)return;let M=I.dataset.value;d.value=M;let H=y.querySelector(".custom-dropdown__value");H.textContent=I.dataset.display,y.classList.remove("is-open"),M==="bad"?(u.style.display="block",f.required=!0,f.focus()):(u.style.display="none",f.required=!1,f.value="")};let b=document.getElementById("swapItemDropdown");if(n.length>0){let h=b.querySelector(".custom-dropdown__selected"),I=b.querySelector(".custom-dropdown__options"),M=b.querySelector('input[name="new_item_id"]'),H=b.querySelector(".custom-dropdown__placeholder"),F=b.querySelector(".custom-dropdown__value");h.onclick=Q=>{Q.stopPropagation(),y.classList.remove("is-open"),b.classList.toggle("is-open")},I.onclick=Q=>{let de=Q.target.closest(".custom-dropdown__option");if(!de)return;let Pe=parseInt(de.dataset.stock),Fe=parseInt(c.value);if(Pe<Fe){alert(`Stok barang pengganti tidak cukup (Sisa: ${Pe}, Diminta: ${Fe}). Silakan kurangi jumlah penukaran.`);return}M.value=de.dataset.value,F.innerHTML=de.dataset.display,F.style.display="flex",H.style.display="none",b.classList.remove("is-open"),h.style.borderColor=""}}else b.classList.add("is-disabled");let x=document.getElementById("modalBody"),w=h=>{h.target.closest(".custom-dropdown")||(y.classList.remove("is-open"),b.classList.remove("is-open"))};x.addEventListener("click",w),i.addEventListener("submit",h=>{if(h.preventDefault(),!i.querySelector('input[name="new_item_id"]').value){let M=b.querySelector(".custom-dropdown__selected");M.style.borderColor="var(--danger-color)",M.animate([{transform:"translateX(0)"},{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"translateX(0)"}],{duration:300});return}pa(h)})};var Et=e=>{let t=r.history.find(a=>a.id==e);t&&(_("Konfirmasi Hapus",`
        <p class="modal-details">Anda yakin ingin menghapus riwayat peminjaman:</p>
        <p class="modal-details"><strong>${m(t.item_name)}</strong> oleh <strong>${m(t.borrower_name)}</strong> <span style="font-weight: bold; color: var(--danger-color);">secara permanen?</span></p>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="confirmDeleteHistoryBtn" class="btn btn-danger">Ya, Hapus</button>
        </div>`),document.getElementById("confirmDeleteHistoryBtn").onclick=()=>fa(e))};var fe=async()=>{_("Bersihkan Riwayat",`
        <form id="flushHistoryForm">
            <p class="modal-warning-text" style="text-align: left;"><strong>PERINGATAN:</strong> Tindakan ini akan menghapus semua riwayat dan file bukti secara permanen.</p>
            <div class="captcha-container"><p>Masukkan teks pada gambar di bawah ini:</p><div id="captchaImageContainer"><p>Memuat...</p></div></div>
            <div class="form-group"><input type="text" id="captchaInput" name="captcha" placeholder="Masukkan captcha" autocomplete="off" required></div>
            <div class="modal-footer"><button type="button" class="btn btn-secondary close-modal-btn">Batal</button><button type="submit" class="btn btn-danger">Hapus Semua</button></div>
        </form>`);try{let t=await(await fetch(`${k}?action=get_captcha`)).json(),a=document.getElementById("captchaImageContainer");a.innerHTML=t.status==="success"?`<img src="${t.data.image}" alt="Captcha" style="cursor:pointer;">`:'<p class="text-danger">Gagal memuat captcha.</p>',t.status==="success"&&(a.firstElementChild.onclick=fe)}catch{document.getElementById("captchaImageContainer").innerHTML='<p class="text-danger">Gagal terhubung ke server.</p>'}document.getElementById("flushHistoryForm").addEventListener("submit",ga)};var Mt=()=>{if(r.classifiers.length===0){B("Tidak ada jenis barang yang tersedia untuk difilter.","error");return}let e=r.classifiers.map(a=>`
        <div class="form-check classifier-filter-item" style="margin-bottom: 0.75rem;">
            <input class="form-check-input classifier-filter-input" type="radio" name="classifierFilter" id="classifier-${m(a)}" value="${m(a)}" ${r.currentClassifierFilter===a?"checked":""}>
            <label class="form-check-label classifier-filter-label" for="classifier-${m(a)}">
                ${m(a)}
            </label>
        </div>
    `).join("");_("Filter Jenis Barang",`
        <form id="classifierFilterForm">
            <p class="modal-details" style="margin-bottom: 1rem;">Pilih salah satu jenis barang untuk ditampilkan:</p>
            <div class="classifier-filter-list" style="max-height: 300px; overflow-y: auto; padding-right: 1rem;">
                ${e}
            </div>
            <div class="modal-footer" style="margin-top: 1.5rem;">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="submit" class="btn btn-primary">Terapkan</button>
            </div>
        </form>
    `);let t=document.getElementById("classifierFilterForm");t.addEventListener("submit",a=>{a.preventDefault();let o=t.querySelector('input[name="classifierFilter"]:checked');o?(r.currentClassifierFilter=o.value,r.currentStockFilter="classifier",Y(),ie(),S()):B("Pilih salah satu jenis barang.","error")})};var Tt=()=>{let e=r.selectedDate?new Date(r.selectedDate):new Date,t=r.selectedDate?new Date(r.selectedDate):null,a=()=>{let o=e.getFullYear(),s=e.getMonth(),n=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],l=["Min","Sen","Sel","Rab","Kam","Jum","Sab"],i=n.map((p,v)=>`<option value="${v}" ${v===s?"selected":""}>${p}</option>`).join(""),c=new Date().getFullYear(),d="";for(let p=c-5;p<=c+5;p++)d+=`<option value="${p}" ${p===o?"selected":""}>${p}</option>`;let u=new Date(o,s,1).getDay(),f=new Date(o,s+1,0).getDate(),g=new Date,y="";for(let p=0;p<u;p++)y+='<div class="calendar-day is-empty"></div>';for(let p=1;p<=f;p++){let v=new Date(o,s,p),b="calendar-day";C(v)===C(g)&&(b+=" is-today"),t&&C(v)===C(t)&&(b+=" is-selected"),y+=`<div class="${b}" data-date="${v.toISOString()}">${p}</div>`}_("Filter Tanggal",`
            <div class="calendar-container">
                <div class="calendar-header">
                    <button class="calendar-header__nav" id="cal-prev"><i class='bx bx-chevron-left'></i></button>
                    <div class="calendar-header__title">
                        <select id="month-select" class="calendar-select">${i}</select>
                        <select id="year-select" class="calendar-select">${d}</select>
                    </div>
                    <button class="calendar-header__nav" id="cal-next"><i class='bx bx-chevron-right'></i></button>
                </div>
                <div class="calendar-grid">
                    ${l.map(p=>`<div class="calendar-weekday">${p}</div>`).join("")}
                    ${y}
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="button" class="btn btn-primary" id="applyDateFilterBtn">Terapkan</button>
            </div>
        `),document.getElementById("cal-prev").onclick=()=>{e.setMonth(s-1),a()},document.getElementById("cal-next").onclick=()=>{e.setMonth(s+1),a()},document.getElementById("month-select").onchange=p=>{e.setMonth(parseInt(p.target.value)),a()},document.getElementById("year-select").onchange=p=>{e.setFullYear(parseInt(p.target.value)),a()},document.querySelectorAll(".calendar-day:not(.is-empty)").forEach(p=>{p.onclick=()=>{t=new Date(p.dataset.date),a()}}),document.getElementById("applyDateFilterBtn").onclick=()=>{r.selectedDate=t,Me(),S();let p=document.querySelector(".page.active")?.id;p==="history"?j():p==="return"&&ge()}};a()};var $t=()=>{_("Konfirmasi Ekspor",`
        <p class="modal-details">Anda yakin ingin mengekspor seluruh riwayat peminjaman ke dalam file CSV?</p>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="confirmExportBtn" class="btn btn-success">Ya, Ekspor</button>
        </div>
    `),document.getElementById("confirmExportBtn").onclick=()=>{window.location.href=`${k}?action=export_history`,S()}};var N=e=>{let t=document.getElementById("exportProgressBar"),a=document.getElementById("exportProgressText"),o=document.getElementById("exportProgressLog"),s=document.getElementById("startExportBtn"),n=document.getElementById("primaryCloseExportBtn"),l=document.querySelector("#exportModalContainer .close-modal-btn"),i=document.getElementById("export-confirmation-view"),c=document.getElementById("export-progress-view");if(!c||!e)return;(e.status==="running"||e.status==="finalizing"||e.status==="complete"||e.status==="error")&&(i&&(i.style.display="none"),c&&(c.style.display="block"),s&&(s.style.display="none"),l&&(l.style.display="none"));let{processed:d=0,total:u=0}=e;if(e.export_type==="accounts"&&["running","finalizing"].includes(e.status))t.style.width="50%",a.textContent="Membuat file CSV...";else if(u>0){let g=d/u*100;t.style.width=`${g}%`,a.textContent=`Memproses ${d} dari ${u} gambar...`}else a.textContent="Mempersiapkan...";if(e.log&&Array.isArray(e.log)&&(o.innerHTML=e.log.map(g=>{let y=g.status==="success"?"text-success":g.status==="error"?"text-danger":"",p=g.status==="success"?"\u2713":g.status==="error"?"\u2717":"\u2022",v=g.status==="info"?"":`${p} `;return`<div class="${y}">[${g.time}] ${v}${m(g.message)}</div>`}).join(""),o.scrollTop=o.scrollHeight),e.status==="complete"||e.status==="error"){if(e.status==="complete")a.textContent="Proses ekspor selesai!",t.style.width="100%",e.csv_url&&!o.querySelector('a[href="'+e.csv_url+'"]')&&(o.innerHTML+=`<div><a href="${m(e.csv_url)}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Lihat File CSV di Google Drive</a></div>`),n.textContent="Selesai";else{a.textContent="Ekspor Gagal!";let g=e.message||"Terjadi kesalahan tidak diketahui.",y=`<div class="text-danger" style="margin-top: 1rem; font-weight: bold;">[${new Date().toLocaleTimeString("id-ID")}] \u2717 Error: ${m(g)}</div>`;o.innerHTML.includes(g)||(o.innerHTML+=y),n.textContent="Tutup"}o.scrollTop=o.scrollHeight,n.style.display="inline-flex",n.onclick=async()=>{await ba(),S()}}};var Ge=(e=null)=>{_("Ekspor Stok ke Google Drive",`
        <div id="exportModalContainer">
            <div id="export-confirmation-view">
                <p class="modal-details">Ini akan mengunggah semua gambar barang ke Google Drive dan membuat file CSV yang dapat digunakan untuk impor.</p>
                <p class="modal-warning-text" style="text-align: left;">Pastikan koneksi internet Anda stabil.</p>
            </div>
            <div id="export-progress-view" style="display: none;">
                <div class="progress-bar-container" style="margin: 1.5rem 0;">
                    <div class="progress-bar-text" id="exportProgressText" style="margin-bottom: 0.5rem; color: var(--text-color-light); font-size: 0.9rem;">Memulai...</div>
                    <div class="progress-bar" style="background-color: var(--border-color); border-radius: 20px; overflow: hidden;">
                        <div id="exportProgressBar" class="progress-bar__fill" style="width: 0%; height: 15px; background-color: var(--success-color); border-radius: 20px; transition: width 0.3s ease;"></div>
                    </div>
                </div>
                <div class="progress-log" id="exportProgressLog" style="background-color: var(--secondary-color); border-radius: var(--border-radius); padding: 1rem; height: 150px; overflow-y: auto; font-size: 0.8rem; line-height: 1.5;"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="button" id="startExportBtn" class="btn btn-primary">Mulai Ekspor</button>
                <button type="button" id="primaryCloseExportBtn" class="btn btn-primary" style="display: none;">Selesai</button>
            </div>
        </div>
    `),document.querySelector("#exportModalContainer .close-modal-btn").onclick=S,document.getElementById("startExportBtn").onclick=t=>{t.target.disabled=!0,ya()},e&&e.status!=="idle"&&(N(e),e.status==="running"&&be())};var Ke=(e=null)=>{_("Ekspor Akun ke Google Drive",`
        <div id="exportModalContainer">
            <div id="export-confirmation-view">
                <p class="modal-details">Ini akan membuat file CSV yang berisi data kredensial dari semua akun siswa.</p>
                <p>File CSV akan diunggah ke folder khusus di Google Drive.</p>
                <p class="modal-warning-text" style="text-align: left; margin-top: 1rem;">Password akan di-hash untuk alasan keamanan.</p>
            </div>
            <div id="export-progress-view" style="display: none;">
                <div class="progress-bar-container" style="margin: 1.5rem 0;">
                    <div class="progress-bar-text" id="exportProgressText" style="margin-bottom: 0.5rem; color: var(--text-color-light); font-size: 0.9rem;">Memulai...</div>
                    <div class="progress-bar" style="background-color: var(--border-color); border-radius: 20px; overflow: hidden;">
                        <div id="exportProgressBar" class="progress-bar__fill" style="width: 0%; height: 15px; background-color: var(--success-color); border-radius: 20px; transition: width 0.3s ease;"></div>
                    </div>
                </div>
                <div class="progress-log" id="exportProgressLog" style="background-color: var(--secondary-color); border-radius: var(--border-radius); padding: 1rem; height: 150px; overflow-y: auto; font-size: 0.8rem; line-height: 1.5;"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="button" id="startExportBtn" class="btn btn-primary">Mulai Ekspor</button>
                <button type="button" id="primaryCloseExportBtn" class="btn btn-primary" style="display: none;">Selesai</button>
            </div>
        </div>
    `),document.querySelector("#exportModalContainer .close-modal-btn").onclick=S,document.getElementById("startExportBtn").onclick=t=>{t.target.disabled=!0,va()},e&&e.status!=="idle"&&(N(e),(e.status==="running"||e.status==="finalizing")&&be())};var le=e=>{let t=document.getElementById("backupProgressBar"),a=document.getElementById("backupProgressText"),o=document.getElementById("backupProgressLog"),s=document.getElementById("startBackupBtn"),n=document.getElementById("primaryCloseBackupBtn"),l=document.querySelector("#backupModalContainer .close-modal-btn"),i=document.getElementById("backup-confirmation-view"),c=document.getElementById("backup-progress-view");if(!c||!e)return;(e.status==="running"||e.status==="finalizing"||e.status==="complete"||e.status==="error")&&(i&&(i.style.display="none"),c&&(c.style.display="block"),s&&(s.style.display="none"),l&&(l.style.display="none"));let{processed:d=0,total:u=0}=e;if(u>0){let f=d/u*100;t.style.width=`${f}%`,a.textContent=`Memproses ${d} dari ${u} file...`}else a.textContent="Mempersiapkan...";if(e.log&&Array.isArray(e.log)&&(o.innerHTML=e.log.map(f=>{let g=f.status==="success"?"text-success":f.status==="error"?"text-danger":"",y=f.status==="success"?"\u2713":f.status==="error"?"\u2717":"\u2022",p=f.status==="info"?"":`${y} `;return`<div class="${g}">[${f.time}] ${p}${m(f.message)}</div>`}).join(""),o.scrollTop=o.scrollHeight),e.status==="complete"||e.status==="error"){if(e.status==="complete")a.textContent="Proses backup selesai!",t.style.width="100%",e.csv_url&&!o.querySelector('a[href="'+e.csv_url+'"]')&&(o.innerHTML+=`<div><a href="${m(e.csv_url)}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Lihat File CSV di Google Drive</a></div>`),n.textContent="Selesai";else{a.textContent="Backup Gagal!";let f=e.message||"Terjadi kesalahan tidak diketahui.",g=`<div class="text-danger" style="margin-top: 1rem; font-weight: bold;">[${new Date().toLocaleTimeString("id-ID")}] \u2717 Error: ${m(f)}</div>`;o.innerHTML.includes(f)||(o.innerHTML+=g),n.textContent="Tutup"}o.scrollTop=o.scrollHeight,n.style.display="inline-flex",n.onclick=async()=>{await wa(),S()}}},Ve=(e=null)=>{_("Backup Riwayat ke Google Drive",`
        <div id="backupModalContainer">
            <div id="backup-confirmation-view">
                <p class="modal-details">Ini akan mengunggah semua file bukti riwayat ke Google Drive dan membuat file CSV.</p>
                <p>Proses ini mungkin memakan waktu lama dan tidak dapat dibatalkan setelah dimulai.</p>
                <p class="modal-warning-text" style="text-align: left; margin-top: 1rem;">Pastikan koneksi internet Anda stabil.</p>
            </div>
            <div id="backup-progress-view" style="display: none;">
                <div class="progress-bar-container" style="margin: 1.5rem 0;">
                    <div class="progress-bar-text" id="backupProgressText" style="margin-bottom: 0.5rem; color: var(--text-color-light); font-size: 0.9rem;">Memulai...</div>
                    <div class="progress-bar" style="background-color: var(--border-color); border-radius: 20px; overflow: hidden;">
                        <div id="backupProgressBar" class="progress-bar__fill" style="width: 0%; height: 15px; background-color: var(--primary-color); border-radius: 20px; transition: width 0.3s ease;"></div>
                    </div>
                </div>
                <div class="progress-log" id="backupProgressLog" style="background-color: var(--secondary-color); border-radius: var(--border-radius); padding: 1rem; height: 150px; overflow-y: auto; font-size: 0.8rem; line-height: 1.5;"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="button" id="startBackupBtn" class="btn btn-primary">Mulai Backup</button>
                <button type="button" id="primaryCloseBackupBtn" class="btn btn-primary" style="display: none;">Selesai</button>
            </div>
        </div>
    `),document.querySelector("#backupModalContainer .close-modal-btn").onclick=S;let t=document.getElementById("startBackupBtn");t.onclick=a=>{a.target.disabled=!0,ha()},e&&e.status!=="idle"&&(le(e),e.status==="running"&&At())};var ye=async(e,t,a)=>{try{let o=await fetch(`${k}?action=${e}&_=${new Date().getTime()}`);if(o.status===429){setTimeout(()=>ye(e,t,a),1e3);return}let s=await o.json();if(s.status==="error"&&!s.jobs){t({status:"error",message:s.message});return}if(t(s),s.status==="running"||s.status==="finalizing"){let n=s.status==="finalizing"||a==="import"?200:100;setTimeout(()=>ye(e,t,a),n)}}catch(o){E(o,`Gagal memproses antrian ${a}.`),t({status:"error",message:`Koneksi ke server ${a} terputus.`})}},ka=(e,t,a=2e3)=>{let o=null,s=!1,n=async()=>{if(!s)try{let l=await e();if(s)return;t(l),(l.status==="running"||l.status==="pending")&&(o=setTimeout(n,a))}catch(l){console.error("Polling status gagal:",l),s||(o=setTimeout(n,a*2))}};return{start:()=>{o||(s=!1,n())},stop:()=>{o&&(clearTimeout(o),o=null),s=!0}}};var P=null,Ct=e=>{let t=document.getElementById("autoBackupProgressBar"),a=document.getElementById("autoBackupProgressText"),o=document.getElementById("autoBackupProgressLog"),s=document.getElementById("primaryCloseAutoBackupBtn"),n=document.getElementById("autobackup-config-view"),l=document.getElementById("autobackup-progress-view");if(!(!l||!e))if((e.status==="running"||e.status==="complete"||e.status==="error"||e.status==="pending")&&(n&&n.classList.add("is-hidden"),l&&l.classList.remove("is-hidden")),e.log&&Array.isArray(e.log)&&o&&(o.innerHTML=e.log.map(i=>{let c=i.status==="success"?"text-success":i.status==="error"?"text-danger":"",d=i.status==="success"?"\u2713":i.status==="error"?"\u2717":"\u2022",u=i.status==="info"?"":`${d} `,f=i.message,g="";if(i.status==="success"&&f.startsWith("Backup Selesai! URL: ")){let y=f.substring(f.indexOf("URL: ")+5);g=`${m("Backup Selesai!")} <a href="${m(y)}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Lihat di Google Drive</a>`}else g=m(f);return`<div class="${c}">[${i.time}] ${u}${g}</div>`}).join(""),o.scrollTop=o.scrollHeight),e.status==="running"||e.status==="pending"){let i=e.log&&e.log.length>0?e.log[e.log.length-1].message:"Memulai...";a&&(a.textContent=i),t&&(t.style.width="50%")}else(e.status==="complete"||e.status==="error")&&(P&&(P.stop(),P=null),e.status==="complete"?(a&&(a.textContent="Auto-Backup Selesai!"),t&&(t.style.width="100%"),s&&(s.textContent="Selesai")):(a&&(a.textContent="Auto-Backup Gagal!"),s&&(s.textContent="Tutup")),s&&(s.style.display="inline-flex",s.onclick=async()=>{P&&(P.stop(),P=null),await Sa(),S()}))},Te=async(e=null)=>{if(P&&(P.stop(),P=null),e)_("Auto Backup",`
			<div id="autobackup-progress-view">
				<div class="progress-bar-container" style="margin: 1.5rem 0;">
					<div class="progress-bar-text" id="autoBackupProgressText" style="margin-bottom: 0.5rem; color: var(--text-color-light); font-size: 0.9rem;">...</div>                    
					<div class="progress-bar" style="background-color: var(--border-color); border-radius: 20px; overflow: hidden;">
						<div id="autoBackupProgressBar" class="progress-bar__fill" style="width: 0%; height: 15px; background-color: var(--primary-color); border-radius: 20px; transition: width 0.3s ease;"></div>
					</div>
				</div>
				<div class="progress-log" id="autoBackupProgressLog" style="background-color: var(--secondary-color); border-radius: var(--border-radius); padding: 1rem; height: 180px; overflow-y: auto; font-size: 0.8rem; line-height: 1.5;"></div>
			</div>
			<div class="modal-footer">
				<button type="button" id="primaryCloseAutoBackupBtn" class="btn btn-primary" style="display: none;">Selesai</button>
			</div>
		`),Ct(e),(e.status==="running"||e.status==="pending")&&(P=ka(ve,Ct,2e3),P.start());else{let a=(await _a()).data||{},o=a.autobackup_enabled=="1",s=a.autobackup_frequency||"daily",n=a.autobackup_day||"1";_("Auto Backup",`
			<form id="autoBackupConfigForm">
				<div id="autobackup-config-view">
                    
					<div class="form-group form-group--toggle">
						<label for="autobackup_enabled">Aktifkan Auto-Backup</label>
						<div class="toggle-switch">
							<input type="checkbox" id="autobackup_enabled" name="autobackup_enabled" value="1" ${o?"checked":""}>
							<label for="autobackup_enabled"></label>
						</div>
					</div>

					<div id="autobackup_scheduler_fields" class="${o?"":"is-hidden"}">
						
                        <!-- Dropdown Frekuensi (Kustom) -->
                        <div class="form-group">
							<label>Frekuensi</label>
                            <div class="custom-dropdown">
                                <input type="hidden" name="autobackup_frequency" value="${m(s)}">
                                <button type="button" class="custom-dropdown__selected">
                                    <span class="custom-dropdown__placeholder">Pilih Frekuensi</span>
                                    <div class="custom-dropdown__value"></div>
                                    <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                                </button>
                                <div class="custom-dropdown__options">
                                    <div class="custom-dropdown__option" data-value="daily" data-display="<span>Harian (Setiap Hari)</span>">
                                        <span class="custom-dropdown__option-name">Harian (Setiap Hari)</span>
                                    </div>
                                    <div class="custom-dropdown__option" data-value="weekly" data-display="<span>Mingguan</span>">
                                        <span class="custom-dropdown__option-name">Mingguan</span>
                                    </div>
                                    <div class="custom-dropdown__option" data-value="monthly" data-display="<span>Bulanan</span>">
                                        <span class="custom-dropdown__option-name">Bulanan</span>
                                    </div>
                                </div>
                            </div>
						</div>
						
                        <!-- Dropdown Hari (Mingguan) (Kustom) -->
                        <div class="form-group autobackup_day_weekly_field is-hidden">
							<label>Pilih Hari</label>
                            <div class="custom-dropdown">
                                <input type="hidden" name="autobackup_day_weekly" value="${m(n)}">
                                <button type="button" class="custom-dropdown__selected">
                                    <span class="custom-dropdown__placeholder">Pilih Hari</span>
                                    <div class="custom-dropdown__value"></div>
                                    <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                                </button>
                                <div class="custom-dropdown__options">
                                    <div class="custom-dropdown__option" data-value="1" data-display="<span>Senin</span>"><span class="custom-dropdown__option-name">Senin</span></div>
                                    <div class="custom-dropdown__option" data-value="2" data-display="<span>Selasa</span>"><span class="custom-dropdown__option-name">Selasa</span></div>
                                    <div class="custom-dropdown__option" data-value="3" data-display="<span>Rabu</span>"><span class="custom-dropdown__option-name">Rabu</span></div>
                                    <div class="custom-dropdown__option" data-value="4" data-display="<span>Kamis</span>"><span class="custom-dropdown__option-name">Kamis</span></div>
                                    <div class="custom-dropdown__option" data-value="5" data-display="<span>Jumat</span>"><span class="custom-dropdown__option-name">Jumat</span></div>
                                    <div class="custom-dropdown__option" data-value="6" data-display="<span>Sabtu</span>"><span class="custom-dropdown__option-name">Sabtu</span></div>
                                    <div class="custom-dropdown__option" data-value="7" data-display="<span>Minggu</span>"><span class="custom-dropdown__option-name">Minggu</span></div>
                                </div>
                            </div>
						</div>
						
                        <!-- Dropdown Tanggal (Bulanan) (Kustom) -->
                        <div class="form-group autobackup_day_monthly_field is-hidden">
							<label>Pilih Tanggal</label>
                            <div class="custom-dropdown">
                                <input type="hidden" name="autobackup_day_monthly" value="${m(n)}">
                                <button type="button" class="custom-dropdown__selected">
                                    <span class="custom-dropdown__placeholder">Pilih Tanggal</span>
                                    <div class="custom-dropdown__value"></div>
                                    <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                                </button>
                                <div class="custom-dropdown__options">
                                    ${[...Array(31).keys()].map(p=>`
                                        <div class="custom-dropdown__option" data-value="${p+1}" data-display="<span>Tanggal ${p+1}</span>">
                                            <span class="custom-dropdown__option-name">Tanggal ${p+1}</span>
                                        </div>
                                    `).join("")}
                                </div>
                            </div>
						</div>

						<div class="form-group">
							<label for="autobackup_time">Waktu Backup (WIB)</label>
							<input type="time" id="autobackup_time" name="autobackup_time" value="${a.autobackup_time||"03:00"}" class="form-group input">
							<small class="form-text">Gunakan format 24 jam.</small>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
					<button type="submit" class="btn btn-primary">Simpan</button>
				</div>
			</form>
		`);let l=document.getElementById("autoBackupConfigForm"),i=document.getElementById("autobackup_scheduler_fields"),c=document.getElementById("autobackup_enabled"),d=l.querySelector('input[name="autobackup_frequency"]'),u=l.querySelector(".autobackup_day_weekly_field"),f=l.querySelector(".autobackup_day_monthly_field"),g=p=>{u.classList.toggle("is-hidden",p!=="weekly"),f.classList.toggle("is-hidden",p!=="monthly")};c.addEventListener("change",()=>{i.classList.toggle("is-hidden",!c.checked)}),re(l,p=>{let v=l.querySelector('input[name="autobackup_frequency"]');v&&p===v.value&&g(p)});let y=d.closest(".custom-dropdown");y&&y.querySelector(".custom-dropdown__options").addEventListener("click",p=>{let v=p.target.closest(".custom-dropdown__option");v&&v.dataset.value&&g(v.dataset.value)}),g(d.value),l.addEventListener("submit",async p=>{p.preventDefault();let v=new FormData(l);c.checked||v.set("autobackup_enabled","0");let b=v.get("autobackup_frequency");b==="weekly"?v.set("autobackup_day",l.querySelector('input[name="autobackup_day_weekly"]').value):b==="monthly"?v.set("autobackup_day",l.querySelector('input[name="autobackup_day_monthly"]').value):v.set("autobackup_day","1"),v.delete("autobackup_day_weekly"),v.delete("autobackup_day_monthly"),(await xa(v)).status==="success"&&S()})}};var re=(e,t)=>{let a=e.querySelectorAll(".custom-dropdown");a.forEach(o=>{let s=o.querySelector(".custom-dropdown__selected"),n=o.querySelector(".custom-dropdown__options"),l=o.querySelector('input[type="hidden"]'),i=o.querySelector(".custom-dropdown__value"),c=o.querySelector(".custom-dropdown__placeholder"),d=u=>{if(!n)return;let f=n.querySelector(`.custom-dropdown__option[data-value="${u}"]`);u&&f?(i&&(i.innerHTML=f.dataset.display||`<span>${f.textContent.trim()}</span>`,i.style.display="flex"),c&&(c.style.display="none")):(i&&(i.style.display="none"),c&&(c.style.display="block"))};l&&d(l.value),s&&s.addEventListener("click",u=>{u.stopPropagation(),document.querySelectorAll(".custom-dropdown.is-open").forEach(f=>{f!==o&&f.classList.remove("is-open")}),o.classList.toggle("is-open")}),n&&n.addEventListener("click",u=>{let f=u.target.closest(".custom-dropdown__option");if(f){let g=f.dataset.value;l&&(l.value=g,d(g)),o.classList.remove("is-open"),l&&l.id==="accountRole"&&t&&t(g)}})}),document.addEventListener("click",function(o){e&&!e.contains(o.target)&&a.forEach(s=>s.classList.remove("is-open"))},{once:!0})},Ee=e=>{if(!e)return;let t=e.querySelector(".hybrid-dropdown__selected"),a=e.querySelector(".hybrid-dropdown__options"),o=e.querySelector(".hybrid-dropdown__placeholder"),s=e.querySelector(".hybrid-dropdown__value"),n=e.querySelector('input[type="hidden"]'),l=()=>e.classList.remove("is-open"),i=d=>{n&&(n.value=d),d?(s&&(s.textContent=d,s.style.display="block"),o&&(o.style.display="none")):(s&&(s.style.display="none"),o&&(o.style.display="block")),l()},c=()=>{if(!a)return;a.innerHTML="";let d=document.createElement("div");d.className="hybrid-dropdown__option hybrid-dropdown__option--create",d.innerHTML="<i class='bx bx-plus-circle'></i><span>Buat Kelas Baru</span>",d.onclick=u=>{u.stopPropagation(),a.innerHTML=`
                <div class="hybrid-dropdown__new-input-container">
                    <input type="text" placeholder="Contoh: X-RPL 1" class="hybrid-dropdown__new-input">
                    <button type="button" class="btn btn-primary hybrid-dropdown__save-btn"><i class='bx bx-check'></i></button>
                </div>`;let f=a.querySelector(".hybrid-dropdown__new-input"),g=a.querySelector(".hybrid-dropdown__save-btn");f&&f.focus();let y=async()=>{if(!f)return;let p=f.value.trim();if(p){let v=await ze(p);B(v.message,v.status),v.status==="success"&&(r.classes.push(v.data),r.classes.sort((b,x)=>b.name.localeCompare(x.name)),i(p),window.dispatchEvent(new Event("classDataChanged")))}};f&&(f.onkeydown=p=>{p.key==="Enter"&&(p.preventDefault(),y())}),g&&(g.onclick=p=>{p.stopPropagation(),y()})},a.appendChild(d),r.classes.forEach(u=>{let f=document.createElement("div");f.className="hybrid-dropdown__option",f.dataset.id=u.id,f.innerHTML=`
                <span class="option-name">${m(u.name)}</span>
                <div class="hybrid-dropdown__option-actions">
                    <button type="button" class="hybrid-dropdown__action-btn edit" title="Edit"><i class='bx bxs-pencil'></i></button>
                    <button type="button" class="hybrid-dropdown__action-btn delete" title="Hapus"><i class='bx bxs-trash'></i></button>
                </div>`,f.addEventListener("click",g=>{g.target.closest(".hybrid-dropdown__action-btn")||i(u.name)}),a.appendChild(f)})};a&&a.addEventListener("click",async d=>{let u=d.target.closest(".hybrid-dropdown__action-btn.edit"),f=d.target.closest(".hybrid-dropdown__action-btn.delete");if(u){d.stopPropagation();let g=u.closest(".hybrid-dropdown__option");if(!g)return;let y=g.dataset.id,p=g.querySelector(".option-name");if(!p)return;let v=p.textContent;g.innerHTML=`
                    <div class="hybrid-dropdown__new-input-container" style="width:100%">
                        <input type="text" class="hybrid-dropdown__new-input" value="${m(v)}">
                        <button type="button" class="btn btn-primary hybrid-dropdown__save-btn"><i class='bx bx-check'></i></button>
                    </div>`;let b=g.querySelector(".hybrid-dropdown__new-input-container");b&&b.addEventListener("click",I=>I.stopPropagation());let x=g.querySelector("input");x&&(x.focus(),x.select());let w=async()=>{if(!x)return;let I=x.value.trim();if(I&&I!==v){let M=await Ba(y,I);if(B(M.message,M.status),M.status==="success"){let H=r.classes.findIndex(F=>F.id==y);H>-1&&(r.classes[H].name=I),r.classes.sort((F,Q)=>F.name.localeCompare(Q.name)),n&&n.value===v&&i(I),window.dispatchEvent(new Event("classDataChanged"))}}c()};x&&(x.onblur=w,x.onkeydown=I=>{I.key==="Enter"&&(I.preventDefault(),I.target.blur())});let h=g.querySelector(".hybrid-dropdown__save-btn");h&&(h.onclick=I=>{I.stopPropagation(),x&&x.blur()})}if(f){d.stopPropagation();let g=f.closest(".hybrid-dropdown__option");if(!g)return;let y=g.dataset.id,p=g.querySelector(".option-name");if(!p)return;let v=p.textContent;mt("Konfirmasi Hapus Kelas",`Anda yakin ingin menghapus kelas <strong>${m(v)}</strong>?
                    <p class="modal-warning-text" style="text-align: left;">Tindakan ini juga akan menghapus referensi kelas ini dari semua pengguna, peminjaman aktif, dan riwayat.</p>`,async()=>{let b=await Ia(y);B(b.message,b.status),b.status==="success"&&(r.classes=r.classes.filter(x=>x.id!=y),c(),n&&n.value===v&&i(""),window.dispatchEvent(new Event("classDataChanged")))})}}),t&&(t.onclick=d=>{d.stopPropagation(),document.querySelectorAll(".hybrid-dropdown.is-open").forEach(u=>{u!==e&&u.classList.remove("is-open")}),e.classList.contains("is-open")||c(),e.classList.toggle("is-open")}),n&&n.value&&i(n.value),document.addEventListener("click",d=>{e.contains(d.target)||l()},!0)};var La=()=>{se("history")};var Ea=(e,t,a)=>new Promise((o,s)=>{let n=new XMLHttpRequest;n.open("POST",e,!0);let l=a.querySelector(".btn__progress");l&&(l.style.width="0%"),a.classList.add("btn--loading"),a.disabled=!0,n.upload.onprogress=c=>{if(c.lengthComputable&&l){let d=c.loaded/c.total*100;l.style.width=d+"%"}};let i=()=>{a.classList.remove("btn--loading"),a.disabled=!1,l&&setTimeout(()=>{l.style.width="0%"},500)};n.onload=()=>{i(),n.status>=200&&n.status<300?o(n.responseText):s({status:n.status,statusText:n.statusText,response:n.responseText})},n.onerror=()=>{i(),s({status:n.status,statusText:n.statusText})},n.send(t)}),E=(e,t)=>{throw e instanceof TypeError&&(e.message.includes("Failed to fetch")||e.message.includes("NetworkError"))?B("Koneksi gagal, periksa koneksi internet Anda.","error"):B(t||"Terjadi kesalahan yang tidak diketahui.","error"),e},$e=async()=>{try{let t=await(await fetch(`${k}?action=get_csrf_token`)).json();if(t.status==="success"&&t.data.token)Gt(t.data.token);else throw new Error("Gagal memuat token keamanan.")}catch(e){E(e,"Gagal memuat token keamanan."),r.session.isLoggedIn||(window.location.href="login.html")}},qt=async()=>{try{let e=await fetch(`${k}?action=get_settings`);if(!e.ok)throw new Error("Network response was not ok");let t=await e.json();if(t.status==="success"&&t.data)r.borrowSettings={startTime:t.data.borrow_start_time,endTime:t.data.borrow_end_time,isManuallyLocked:t.data.is_manually_locked,isAppLocked:t.data.is_app_locked,lockReason:t.data.lock_reason,isLoaded:!0};else throw new Error(t.message||"Gagal memuat pengaturan peminjaman.")}catch(e){E(e,"Gagal memuat pengaturan peminjaman.")}},G=async e=>{oe();try{let a=await(await fetch(`${k}?action=get_data&type=${e}`)).json();if(a.status==="success")e==="items"?(r.items=a.data.items,r.classifiers=a.data.classifiers,r.classes=a.data.classes):r[e]=a.data;else throw new Error(a.message)}catch(t){E(t,`Gagal memuat data ${e}.`)}finally{Ie()}},j=async(e=!1)=>{if(r.isLoadingMoreHistory)return;if(r.isLoadingMoreHistory=!0,!e)r.historyPage=1,r.history=[],oe();else{r.historyPage++;let o=document.getElementById("historyLoaderContainer");o&&(o.innerHTML='<div class="loading-spinner" style="width:30px;height:30px;border-width:3px;margin:1rem auto;"></div>')}let t=document.getElementById("historySearch").value,a=C(r.selectedDate);try{let o=new URLSearchParams({action:"get_data",type:"history",page:r.historyPage,search:t,filterDate:a}),n=await(await fetch(`${k}?${o.toString()}`)).json();if(n.status==="success"&&n.data)r.history=e?[...r.history,...n.data.records]:n.data.records,r.hasMoreHistory=n.data.hasMore;else throw new Error(n.message||"Gagal memuat riwayat.")}catch(o){E(o,"Gagal memuat riwayat."),r.hasMoreHistory=!1}finally{Ca(),r.isLoadingMoreHistory=!1,e||Ie()}},$=async e=>{let t=await e.json();return t.status==="error"&&t.message.includes("kedaluwarsa")&&await $e(),B(t.message,t.status),t},Zt=async e=>{e.preventDefault();let t=e.target,a=t.querySelector('button[type="submit"]'),o=new FormData(t);o.append("action",o.get("id")?"edit_item":"add_item"),o.append("csrf_token",L);let s=t.querySelector("#itemImage"),n=s&&s.files.length>0;try{let l;n?l=await Ea(k,o,a):(a.classList.add("btn--loading"),a.disabled=!0,l=await(await fetch(k,{method:"POST",body:o})).text(),a.classList.remove("btn--loading"),a.disabled=!1);let i=JSON.parse(l);i.status==="error"&&i.message.includes("kedaluwarsa")&&await $e(),B(i.message,i.status),i.status==="success"&&(S(),R("#stock"))}catch(l){!n&&a&&(a.classList.remove("btn--loading"),a.disabled=!1);let i="Gagal menyimpan data barang.",c=i;if(l.response)try{c=JSON.parse(l.response).message||i}catch{}E(l,c)}},ea=async e=>{let t=new FormData;t.append("action","delete_item"),t.append("id",e),t.append("csrf_token",L);try{let a=await fetch(k,{method:"POST",body:t});(await $(a)).status==="success"&&R("#stock")}catch(a){E(a,"Gagal menghapus barang.")}finally{S()}},ta=async e=>{let t=new FormData;t.append("action","delete_multiple_items"),t.append("csrf_token",L),e.forEach(a=>t.append("ids[]",a));try{let a=await fetch(k,{method:"POST",body:t});(await $(a)).status==="success"&&(r.selectedItems=[],await R("#stock"),X())}catch(a){E(a,"Gagal menghapus barang.")}finally{S()}},Ma=async e=>{e.preventDefault();let t=e.target,a=new FormData;a.append("borrower_name",t.querySelector("#borrowerName").value),a.append("borrower_class",t.querySelector("#borrowerClassValue").value),a.append("subject",t.querySelector("#subject").value),a.append("action","borrow_item"),a.append("csrf_token",L),r.session.role==="admin"&&t._selectedUserId&&a.append("borrower_user_id",t._selectedUserId),t.querySelectorAll(".borrow-item-row").forEach((s,n)=>{let l=s.querySelector('input[type="hidden"]').value,i=s.querySelector('input[type="number"]').value;l&&i&&(a.append(`items[${n}][id]`,l),a.append(`items[${n}][quantity]`,i))});try{let s=await fetch(k,{method:"POST",body:a});(await $(s)).status==="success"&&(t.reset(),t._selectedUserId=null,document.getElementById("borrowItemsContainer").innerHTML="",Je(),D("#return"))}catch(s){E(s,"Gagal memproses peminjaman.")}},da=async e=>{e.preventDefault();let t=e.target,a=new FormData;a.append("transaction_id",t.querySelector('input[name="transaction_id"]').value),a.append("action","add_to_borrowal"),a.append("csrf_token",L);let o=t.querySelectorAll(".borrow-item-row"),s=!1;if(o.forEach((n,l)=>{let i=n.querySelector('input[name="item_id"]').value,c=n.querySelector('input[type="number"]').value;i&&c&&(a.append(`items[${l}][id]`,i),a.append(`items[${l}][quantity]`,c),s=!0)}),!s){B("Silakan pilih setidaknya satu alat untuk ditambahkan.","error");return}try{let n=await fetch(k,{method:"POST",body:a});(await $(n)).status==="success"&&(S(),R("#return"))}catch(n){E(n,"Gagal menambah alat.")}},ca=async e=>{e.preventDefault();let t=e.target,a=t.querySelector('button[type="submit"]'),o=new FormData(t);o.append("action","return_item"),o.append("csrf_token",L);let s=t.querySelector("#returnProofGallery"),n=t.querySelector("#returnProofCamera");n&&n.files.length>0?o.set("proof_image",n.files[0],n.files[0].name):s&&s.files.length>0&&o.set("proof_image",s.files[0],s.files[0].name),o.delete("proof_image_camera");try{let l=await Ea(k,o,a),i=JSON.parse(l);i.status==="error"&&i.message.includes("kedaluwarsa")&&await $e(),B(i.message,i.status),i.status==="success"&&(S(),D("#history"))}catch(l){let i="Gagal mengunggah bukti pengembalian.",c=i;if(l.response)try{c=JSON.parse(l.response).message||i}catch{}E(l,c)}},ua=async e=>{e.preventDefault();let t=e.target,a=new FormData(t);a.append("action","edit_borrowal"),a.append("csrf_token",L);try{let o=await fetch(k,{method:"POST",body:a});if((await $(o)).status==="success"){S(),await Promise.all([G("borrowals"),G("items")]);let n=document.querySelector(".page.active");n&&n.id==="return"&&R("#return")}}catch(o){E(o,"Gagal memperbarui peminjaman.")}},ma=async e=>{let t=new FormData;t.append("action","delete_borrowal"),t.append("id",e),t.append("csrf_token",L);try{let a=await fetch(k,{method:"POST",body:t});(await $(a)).status==="success"&&R("#return")}catch(a){E(a,"Gagal menghapus item peminjaman.")}finally{S()}},pa=async e=>{e.preventDefault();let t=e.target,a=new FormData(t);a.append("action","swap_item"),a.append("csrf_token",L);try{let o=await fetch(k,{method:"POST",body:a});if((await $(o)).status==="success"){S(),await Promise.all([G("borrowals"),G("items")]);let n=document.querySelector(".page.active");n&&n.id==="return"&&R("#return")}}catch(o){E(o,"Gagal memproses penukaran barang.")}},fa=async e=>{let t=new FormData;t.append("action","delete_history_item"),t.append("id",e),t.append("csrf_token",L);try{let a=await fetch(k,{method:"POST",body:t});(await $(a)).status==="success"&&j()}catch(a){E(a,"Gagal menghapus riwayat.")}finally{S()}},ga=async e=>{e.preventDefault();let t=new FormData(e.target);t.append("action","flush_history"),t.append("csrf_token",L);try{let a=await fetch(k,{method:"POST",body:t}),o=await $(a);o.status==="success"?(S(),j()):fe().then(()=>{let s=document.getElementById("captchaInput");s&&s.insertAdjacentHTML("afterend",`<small class="text-danger" style="display:block; margin-top:5px;">${o.message}</small>`)})}catch(a){E(a,"Proses gagal.")}},Yt=async e=>{e.preventDefault();let t=e.target,a=new FormData(t);a.append("action","update_credentials"),a.append("csrf_token",L);try{let o=await fetch(k,{method:"POST",body:a}),s=await $(o);s.status==="success"&&(s.data&&s.data.new_nama&&(r.session.username=s.data.new_nama,r.session.login_username=s.data.new_login_username,document.getElementById("usernameDisplay").textContent=r.session.username,document.getElementById("mobileUsernameDisplay").textContent=r.session.username),S())}catch(o){E(o,"Gagal memperbarui akun.")}},pt=async e=>{try{let t=await fetch(k,{method:"POST",body:e});(await $(t)).status==="success"&&(await qt(),S())}catch(t){E(t,"Gagal memperbarui pengaturan.")}},Qt=async e=>{e.append("action","start_import_csv"),e.append("csrf_token",L),ue({status:"running",log:[{time:new Date().toLocaleTimeString("id-ID"),message:"Mengunggah file dan membuat antrian...",status:"info"}]});try{let a=await(await fetch(k,{method:"POST",body:e})).json();if(a.status==="success")await ut();else{B(a.message,"error");let o=document.getElementById("importCsvForm");o&&(o.reset(),o.querySelector(".image-uploader__prompt").style.display="flex",o.querySelector(".image-uploader__file-info").style.display="none",o.querySelector('button[type="submit"]').disabled=!1);let s=document.getElementById("import-confirmation-view"),n=document.getElementById("import-progress-view");s&&(s.style.display="block"),n&&(n.style.display="none")}}catch(t){E(t,"Gagal memulai impor."),ue({status:"error",message:"Gagal menghubungi server untuk memulai impor."})}},ut=async()=>{await ye("process_import_job",ue,"impor")},Ta=async()=>{try{let e=await fetch(`${k}?action=get_import_status`);if(!e.ok)throw new Error("Network response not OK");return await e.json()}catch(e){return console.error("Gagal mengambil status impor:",e),{status:"idle"}}},Wt=async()=>{let e=new FormData;e.append("action","clear_import_status"),e.append("csrf_token",L);try{await fetch(k,{method:"POST",body:e})}catch(t){console.error("Gagal membersihkan status impor:",t)}},At=async()=>{await ye("process_backup_job",le,"backup")},ha=async()=>{le({status:"running",total:0,processed:0,log:[{time:new Date().toLocaleTimeString("id-ID"),message:"Memulai dan membuat antrian...",status:"info"}]});let e=new FormData;e.append("action","backup_to_drive"),e.append("csrf_token",L);try{let a=await(await fetch(k,{method:"POST",body:e})).json();a.status==="success"?await At():le({status:"error",message:a.message})}catch(t){E(t,"Gagal memulai proses backup."),le({status:"error",message:"Gagal menghubungi server untuk memulai backup."})}},$a=async()=>{try{let e=await fetch(`${k}?action=get_backup_status`);if(!e.ok)throw new Error("Network response was not ok");return await e.json()}catch(e){return console.error("Gagal mengambil status backup:",e),{status:"error",error:"Gagal menghubungi server."}}},wa=async()=>{let e=new FormData;e.append("action","clear_backup_status"),e.append("csrf_token",L);try{return await(await fetch(k,{method:"POST",body:e})).json()}catch(t){E(t,"Gagal membersihkan status backup.")}},be=async()=>{await ye("process_export_job",N,"ekspor")},ya=async()=>{N({status:"running",total:0,processed:0,log:[{time:new Date().toLocaleTimeString("id-ID"),message:"Memulai dan membuat antrian...",status:"info"}]});let e=new FormData;e.append("action","start_export"),e.append("export_type","stock"),e.append("csrf_token",L);try{let a=await(await fetch(k,{method:"POST",body:e})).json();a.status==="success"?await be():(B(a.message,"error"),S())}catch(t){E(t,"Gagal memulai proses ekspor."),N({status:"error",message:"Gagal menghubungi server untuk memulai ekspor."})}},va=async()=>{N({status:"running",total:0,processed:0,log:[{time:new Date().toLocaleTimeString("id-ID"),message:"Memulai dan membuat antrian...",status:"info"}]});let e=new FormData;e.append("action","start_export"),e.append("export_type","accounts"),e.append("csrf_token",L);try{let a=await(await fetch(k,{method:"POST",body:e})).json();a.status==="success"?await be():(B(a.message,"error"),S())}catch(t){E(t,"Gagal memulai proses ekspor."),N({status:"error",message:"Gagal menghubungi server untuk memulai ekspor."})}},Aa=async()=>{try{let e=await fetch(`${k}?action=get_export_status`);if(!e.ok)throw new Error("Network response was not ok");return await e.json()}catch(e){return console.error("Gagal mengambil status ekspor:",e),{status:"error",error:"Gagal menghubungi server."}}},ba=async()=>{let e=new FormData;e.append("action","clear_export_status"),e.append("csrf_token",L);try{return await(await fetch(k,{method:"POST",body:e})).json()}catch(t){E(t,"Gagal membersihkan status ekspor.")}},ze=async e=>{let t=new FormData;t.append("action","add_class"),t.append("name",e),t.append("csrf_token",L);try{return await(await fetch(k,{method:"POST",body:t})).json()}catch{return{status:"error",message:"Gagal terhubung ke server."}}},Ba=async(e,t)=>{let a=new FormData;a.append("action","edit_class"),a.append("id",e),a.append("name",t),a.append("csrf_token",L);try{return await(await fetch(k,{method:"POST",body:a})).json()}catch{return{status:"error",message:"Gagal terhubung ke server."}}},Ia=async e=>{let t=new FormData;t.append("action","delete_class"),t.append("id",e),t.append("csrf_token",L);try{return await(await fetch(k,{method:"POST",body:t})).json()}catch{return{status:"error",message:"Gagal terhubung ke server."}}},_a=async()=>{try{return await(await fetch(`${k}?action=get_autobackup_config`)).json()}catch(e){return E(e,"Gagal mengambil konfigurasi auto-backup."),{status:"error",data:{}}}},xa=async e=>{e.append("action","save_autobackup_config"),e.append("csrf_token",L);try{let t=await fetch(k,{method:"POST",body:e});return await $(t)}catch(t){E(t,"Gagal menyimpan konfigurasi.")}},ve=async()=>{try{let e=await fetch(`${k}?action=get_autobackup_status`);if(!e.ok)throw new Error("Network response not OK");return await e.json()}catch(e){return console.error("Gagal mengambil status auto-backup:",e),{status:"idle"}}},Sa=async()=>{let e=new FormData;e.append("action","clear_autobackup_status"),e.append("csrf_token",L);try{await fetch(k,{method:"POST",body:e})}catch(t){console.error("Gagal membersihkan status auto-backup:",t)}};var Z=document.getElementById("stockGrid"),Qe=document.getElementById("returnGrid"),Ae=document.getElementById("historyGrid"),Da=document.getElementById("exportHistoryBtn"),qa=document.getElementById("flushHistoryBtn"),We=document.getElementById("historyLoaderContainer"),q=[],Ce=0,yo=e=>{if(!e)return"";let t=new Date(e);if(isNaN(t))return"";let a={weekday:"long",day:"numeric",month:"numeric",year:"numeric"};return new Intl.DateTimeFormat("id-ID",a).format(t)},Ha=e=>`
    <div class="date-separator">
        <span class="date-separator__badge">${m(yo(e))}</span>
    </div>`,vo=e=>{let t=r.session.role==="admin",a=!t&&r.borrowSettings.isAppLocked,o=e.current_quantity<=0,s=e.current_quantity<e.total_quantity,n=r.selectedItems.includes(e.id.toString()),l=o?"text-danger":"",i=e.image_url||`https://placehold.co/600x400/8ab4f8/ffffff?text=${encodeURIComponent(e.name)}`,c=t?`
        <div class="card__image-overlay-actions">
            <button class="card__action-btn edit" data-id="${e.id}" ${s?'disabled title="Tidak bisa edit barang yang dipinjam"':'title="Edit"'}><i class='bx bxs-pencil'></i></button>
            <button class="card__action-btn delete" data-id="${e.id}" ${s?'disabled title="Tidak bisa hapus barang yang dipinjam"':'title="Hapus"'}><i class='bx bxs-trash-alt'></i></button>
        </div>`:"",d=o?"":`
        <div class="card__borrow-action-container">
            <button class="card__action-btn borrow-shortcut" 
                    data-id="${e.id}" 
                    title="${a?"Peminjaman sedang ditutup":"Pinjam Barang Ini"}" 
                    ${a?"disabled":""}>
                <i class='bx bx-right-arrow-alt'></i>
            </button>
        </div>`,u=e.classifier?`<span class="card__classifier-chip">${m(e.classifier)}</span>`:"",f=o?'<div class="card__out-of-stock-badge">Kosong</div>':"";return`
    <div class="card ${o?"is-out-of-stock":""} ${n?"is-selected":""}" data-item-id="${e.id}">
        <div class="card__image-container">
            <!-- [MODIFIKASI] Hapus data-src dan class 'lazy', gunakan 'src' langsung dengan loading='lazy' -->
            <img src="${m(i)}" alt="${m(e.name)}" class="card__image" loading="lazy">
            ${f}
            ${u}
            ${c}
            <div class="card__bottom-actions">
                <div class="card__selection-icon">
                    <i class='bx bxs-check-circle'></i>
                </div>
                ${d}
            </div>
        </div>
        <div class="card__body">
            <h3 class="card__title" title="${m(e.name)}">${m(e.name)}</h3>
            <div class="card__info">
                <span>Tersedia: <strong class="${l}">${m(e.current_quantity)}</strong></span>
                <span class="card__quantity-chip">Total: ${m(e.total_quantity)}</span>
            </div>
        </div>
    </div>`},ie=()=>{let e=document.getElementById("stockSearch").value.toLowerCase(),t=r.items;if(r.currentStockFilter==="classifier"&&r.currentClassifierFilter&&(t=t.filter(o=>o.classifier===r.currentClassifierFilter)),r.currentStockFilter==="available"?t=t.filter(o=>o.current_quantity>0):r.currentStockFilter==="empty"&&(t=t.filter(o=>o.current_quantity<=0)),e&&(t=lt(t,e,["name","classifier"])),!Z)return;let a=Z.querySelector(".empty-state");if(a&&a.remove(),W(Z,t,vo,"id","itemId",".card"),t.length===0&&!Z.querySelector(".empty-state")){let o=r.items.length>0?"Barang tidak ditemukan.":"Belum ada barang di inventaris.";Z.insertAdjacentHTML("beforeend",O("Stok tidak ditemukan",o))}qe()},Pa=()=>{if(Z){if(Z.innerHTML="",r.items.length===0){Z.innerHTML=O("Stok Kosong","Belum ada barang di inventaris.");return}ie()}},ho=(e,t,a,o)=>{let s=e;if(r.selectedDate){let l=C(r.selectedDate);s=s.filter(i=>o.some(c=>C(i[c])===l))}let n=t.value;return lt(s,n,a)},wo=e=>{let t=r.session.role==="admin",a=e.items.map(s=>{let n=s.image_url||"https://placehold.co/50x50/8ab4f8/ffffff?text=?",l='<span class="status-badge normal">Normal</span>',i=t?`
            <div class="list-item__actions" style="margin-left: auto; display: flex; gap: 0.5rem;">
                <button class="btn btn-primary action-btn swap-btn" data-id="${s.id}" title="Tukar Barang (Rusak)">
                    <i class='bx bx-sync'></i>
                </button>
                <button class="btn btn-success action-btn edit-borrowal-btn" data-id="${s.id}" title="Ubah Peminjaman">
                    <i class='bx bx-pencil'></i>
                </button>
                <button class="btn btn-danger action-btn delete-borrowal-btn" data-id="${s.id}" title="Hapus Item Peminjaman">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        `:`
            <div class="list-item__actions" style="margin-left: auto; display: flex; gap: 0.5rem;">
                <button class="btn btn-primary action-btn swap-btn" data-id="${s.id}" title="Laporkan Rusak & Tukar">
                    <i class='bx bx-sync'></i>
                </button>
            </div>
        `;return`
            <li class="transaction-group__item">
                <img src="${m(n)}" alt="${m(s.item_name)}" class="transaction-group__item-img">
                <div class="transaction-group__item-details">
                    <div class="transaction-group__item-name">${m(s.item_name)}</div>
                    <div class="transaction-group__item-qty">Jumlah: ${m(s.quantity)} pcs</div>
                    ${l}
                </div>
                ${i}
            </li>`}).join(""),o=`
        <div class="transaction-group__header-actions">
            <button class="btn btn-success add-item-btn" data-id="${e.transaction_id}">
                Tambah
            </button>
            <button class="btn btn-primary return-btn" data-id="${e.transaction_id}">
                Kembalikan
            </button>
        </div>
    `;return`
        <div class="transaction-group">
            <div class="transaction-group__header">
                <div class="transaction-group__borrower-info">
                    <strong>${m(e.borrower_name)}</strong>
                    <span class="class">${m(e.borrower_class)}</span>
                    <span class="subject">Tujuan (Mapel): ${m(e.subject)||"-"}</span>
                     <small style="display: block; margin-top: 5px;">${new Date(e.borrow_date).toLocaleString("id-ID")}</small>
                </div>
                ${o}
            </div>
            <ul class="transaction-group__items">${a}</ul>
        </div>`},ko=e=>{let t=Ha(e.date),a=e.transactions.map(wo).join("");return`
    <div class="date-group" data-return-item-id="${m(e.id)}">
        ${t}
        ${a}
    </div>
    `},ge=()=>{if(!Qe)return;let e=document.getElementById("returnSearch"),t=ho(r.borrowals,e,["borrower_name","borrower_class","item_name","subject"],["borrow_date"]),a=Qe.querySelector(".empty-state");if(a&&a.remove(),t.length===0){Qe.innerHTML=O("Tidak Ada Peminjaman","Tidak ada data yang cocok dengan filter.");return}let o=t.reduce((i,c)=>{let d=c.transaction_id||`single-${c.id}`;return i[d]||(i[d]={items:[],borrower_name:c.borrower_name,borrower_class:c.borrower_class,subject:c.subject,borrow_date:c.borrow_date,transaction_id:c.transaction_id}),i[d].items.push(c),i},{}),s=Object.values(o).sort((i,c)=>new Date(c.borrow_date)-new Date(i.borrow_date)),n=[],l=null;s.forEach(i=>{let c=C(i.borrow_date);c!==l?(n.push({type:"date-group",id:`date-group-${c}`,date:i.borrow_date,transactions:[i]}),l=c):n[n.length-1].transactions.push(i)}),W(Qe,n,ko,"id","returnItemId",".date-group")};document.addEventListener("click",e=>{let t=e.target.closest(".swap-btn");t&&Lt(t.dataset.id)});var _o=(e,t)=>{let a=e.items.map(s=>{let n=s.image_url||"https://placehold.co/50x50/8ab4f8/ffffff?text=?",l=t?`
            <div class="list-item__actions" style="margin-left: auto;">
                <button class="btn btn-danger action-btn delete-history-btn" data-id="${s.id}" title="Hapus Riwayat Ini">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
            `:"",i="",c="";return s.is_swap==1?(s.item_condition==="bad"?(i='<span class="status-badge bad">Rusak & Ditukar</span>',s.condition_remark&&(c+=`<div class="list-item__remark">Kendala: ${m(s.condition_remark)}</div>`)):i='<span class="status-badge swapped-normal">Normal & Ditukar</span>',s.swap_new_item_name&&(c+=`<div class="list-item__remark" style="background-color: rgba(26, 115, 232, 0.1); border-color: var(--primary-color); color: var(--primary-color-dark); margin-top: 4px;">
                    Ditukar dengan: <strong>${m(s.swap_new_item_name)}</strong>
                </div>`)):i='<span class="status-badge normal">Normal</span>',`
            <li class="transaction-group__item" style="flex-wrap: wrap;">
                 <div style="display:flex; align-items:center; gap:1rem; width:100%;">
                     <img src="${m(n)}" alt="${m(s.item_name)}" class="transaction-group__item-img">
                     <div class="transaction-group__item-details">
                        <div class="transaction-group__item-name">${m(s.item_name)}</div>
                        <div class="transaction-group__item-qty">Jumlah: ${m(s.quantity)} pcs</div>
                        ${i}
                    </div>
                    ${l}
                </div>
                ${c}
            </li>`}).join(""),o="";return e.proof_image_url?o=`
            <button type="button" class="btn btn-primary see-proof-btn view-proof-btn" style="padding: .8rem 1rem;" data-proof-url="${m(e.proof_image_url)}" title="Lihat Bukti Pengembalian">
                <i class='bx bx-link-external'></i> Lihat Bukti
            </button>`:o=`
            <button type="button" class="btn btn-primary see-proof-btn" style="padding: .8rem 1rem; cursor: default; opacity: 1; background-color: var(--primary-color) !important;" disabled>
                <i class='bx bx-sync'></i> Penukaran
            </button>`,`
        <div class="transaction-group">
            <div class="transaction-group__header">
                <div class="transaction-group__borrower-info">
                    <strong>${m(e.borrower_name)}</strong>
                    <span class="class">${m(e.borrower_class)}</span>
                    <span class="subject">Tujuan (Mapel) : ${m(e.subject)||"-"}</span>
                    <small class="date-history-detail" style="display: block; margin-top: 10px;">
                        <span class="date-history-info">Pinjam : ${new Date(e.borrow_date).toLocaleString("id-ID")}</span> <br>
                        <span class="date-history-info">Kembali :  ${new Date(e.return_date).toLocaleString("id-ID")}</span>
                    </small>
                </div>
                ${o}
            </div>
            <ul class="transaction-group__items">${a}</ul>
        </div>`},xo=(e,t)=>{let a=Ha(e.date),o=e.transactions.map(s=>_o(s,t)).join("");return`
    <div class="date-group" data-history-item-id="${m(e.id)}">
        ${a}
        ${o}
    </div>
    `},Ca=()=>{if(!Ae||!We)return;let e=r.session.role==="admin",t=r.history.length>0;Da&&(Da.disabled=!t),qa&&(qa.disabled=!t);let a=Ae.querySelector(".empty-state");if(a&&a.remove(),!t){Ae.innerHTML=O("Riwayat Kosong","Tidak ada riwayat yang cocok dengan filter."),We.innerHTML="";return}let o=r.history.reduce((i,c)=>{let d=c.transaction_id||`single-history-${c.id}`;return i[d]||(i[d]={items:[],borrower_name:c.borrower_name,borrower_class:c.borrower_class,subject:c.subject,return_date:c.return_date,borrow_date:c.borrow_date,proof_image_url:c.proof_image_url,transaction_id:c.transaction_id}),i[d].items.push(c),i},{}),s=null,n=[];Object.values(o).sort((i,c)=>new Date(c.return_date)-new Date(i.return_date)).forEach(i=>{let c=C(i.return_date);c!==s?(n.push({type:"date-group",id:`date-group-${c}`,date:i.return_date,transactions:[i]}),s=c):n[n.length-1].transactions.push(i)}),W(Ae,n,i=>xo(i,e),"id","historyItemId",".date-group"),Ae.querySelectorAll(".view-proof-btn").forEach(i=>{i._listenerAttached||(i.addEventListener("click",c=>{c.preventDefault();let d=i.dataset.proofUrl;d&&Jt(d,"Bukti Pengembalian")}),i._listenerAttached=!0)}),r.hasMoreHistory?(We.innerHTML='<button id="loadMoreHistoryBtn" class="btn btn-primary">Selengkapnya</button>',document.getElementById("loadMoreHistoryBtn").onclick=()=>j(!0)):We.innerHTML='<p class="end-of-list">Semua data telah ditampilkan.</p>'},So=e=>{let{rowId:t,selectedItemId:a,quantity:o,max:s}=e,n=q.map(p=>p.selectedItemId).filter(Boolean),i=r.items.filter(p=>p.current_quantity>0||p.id==a).map(p=>{let v=p.current_quantity;if(p.id==a){let I=r.items.find(M=>M.id==a);I&&(v=I.current_quantity)}let b=n.includes(p.id.toString())&&p.id!=a,x=m(p.image_url)||"https://placehold.co/40x40/8ab4f8/ffffff?text=?",w=m(p.name),h=m(p.current_quantity);return`
        <div class="custom-dropdown__option" 
             data-value="${p.id}" 
             data-max="${v}" 
             data-display="<img src='${x}' alt='${w}'><span>${w}</span>"
             aria-disabled="${b}">
            <img src="${x}" alt="${w}" class="custom-dropdown__option-img">
            <div class="custom-dropdown__option-info">
                <span class="custom-dropdown__option-name">${w}</span>
                <span class="custom-dropdown__option-qty">Sisa: ${h}</span>
            </div>
        </div>`}).join(""),c=a?r.items.find(p=>p.id==a):null,d=c?`<img src='${m(c.image_url)||"https://placehold.co/40x40/8ab4f8/ffffff?text=?"}' alt='${m(c.name)}'><span>${m(c.name)}</span>`:'<span class="custom-dropdown__placeholder">Pilih Alat</span>',u=c?'style="display: flex;"':"",f=c?'style="display: none;"':"",g=s||1,y=s?`Maks: ${s}`:"";return`
    <div class="borrow-item-row" id="${t}" data-row-id="${t}">
        <div class="form-group borrow-item-row__item">
            <label>Alat</label>
            <div class="custom-dropdown">
                <input type="hidden" name="item_id" value="${a||""}" required>
                <button type="button" class="custom-dropdown__selected">
                    <span class="custom-dropdown__placeholder" ${f}>Pilih Alat</span>
                    <div class="custom-dropdown__value" ${u}>${d}</div>
                    <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                </button>
                <div class="custom-dropdown__options">${i}</div>
            </div>
        </div>
        <div class="form-group borrow-item-row__quantity">
            <label for="quantity-${t}">Jumlah</label>
            <input type="number" id="quantity-${t}" name="quantity" min="1" max="${g}" value="${o}" required>
            <small class="form-text max-quantity-hint">${y}</small>
        </div>
    </div>`},Bo=()=>{let e=document.getElementById("borrowItemsContainer");e&&e.querySelectorAll(".borrow-item-row").forEach(t=>{if(t._listenersAttached)return;let a=t.querySelector(".custom-dropdown"),o=a.querySelector(".custom-dropdown__options"),s=t.querySelector('input[name="quantity"]'),n=t.dataset.rowId,l=q.find(i=>i.rowId===n);l&&(a.querySelector(".custom-dropdown__selected").onclick=i=>{i.stopPropagation(),document.querySelectorAll(".custom-dropdown.is-open, .hybrid-dropdown.is-open").forEach(c=>{c!==a&&c.classList.remove("is-open")}),a.classList.toggle("is-open")},o.onclick=i=>{let c=i.target.closest(".custom-dropdown__option");if(!c||c.getAttribute("aria-disabled")==="true")return;let d=c.dataset.value,u=parseInt(c.dataset.max);l.selectedItemId=d,l.max=u,(l.quantity>u||l.quantity<1)&&(l.quantity=1),De()},s.onchange=i=>{let c=parseInt(i.target.value);(isNaN(c)||c<1)&&(c=1),l.max&&c>l.max&&(c=l.max),l.quantity=c,i.target.value=c},s.oninput=i=>{i.target.value=i.target.value.replace(/[^0-9]/g,"")},t._listenersAttached=!0)})},Io=()=>{let e=document.getElementById("borrowItemsContainer");if(!e)return;let t=e.querySelectorAll(".borrow-item-row"),a=e.querySelector(".remove-last-item-btn");if(a&&a.remove(),t.length>1){let o=t[t.length-1],s=document.createElement("button");s.type="button",s.className="btn btn-secondary remove-last-item-btn",s.title="Hapus alat terakhir",s.innerHTML="<i class='bx bx-chevron-up'></i>",s.onclick=()=>{q.pop(),De()},o.appendChild(s)}},De=()=>{let e=document.getElementById("borrowItemsContainer");e&&(W(e,q,So,"rowId","rowId",".borrow-item-row"),Bo(),Io())},Je=()=>{let e=document.getElementById("borrowItemsContainer"),t=document.getElementById("borrowerName"),a=document.getElementById("borrowerClassValue"),o=document.getElementById("classDropdownContainer"),s=document.getElementById("nameSuggestions"),n=document.getElementById("borrowForm");if(n&&(n._selectedUserId=null),!e)return;if(q=[],Ce=0,r.session.role==="user"){if(t&&(t.value=r.session.username),a){a.value=r.session.kelas;let c=o.querySelector(".hybrid-dropdown__value, .custom-dropdown__value"),d=o.querySelector(".hybrid-dropdown__placeholder, .custom-dropdown__placeholder");c&&(c.innerHTML=`<span>${m(r.session.kelas)}</span>`,c.style.display="flex"),d&&(d.style.display="none")}}else{t&&(t.value=""),a&&(a.value="");let c=o.querySelector(".hybrid-dropdown__value, .custom-dropdown__value"),d=o.querySelector(".hybrid-dropdown__placeholder, .custom-dropdown__placeholder");c&&(c.style.display="none"),d&&(d.style.display="block")}r.session.role==="admin"&&Eo(o,a);let l=[...r.itemsToBorrow];if(r.itemsToBorrow=[],l.length>0)l.forEach(c=>{let d=r.items.find(u=>u.id==c);d&&q.push({rowId:`row-${Ce++}`,selectedItemId:c,quantity:1,max:d.current_quantity})});else if(r.itemToBorrow){let c=r.items.find(d=>d.id==r.itemToBorrow);c&&q.push({rowId:`row-${Ce++}`,selectedItemId:r.itemToBorrow,quantity:1,max:c.current_quantity}),r.itemToBorrow=null}else q.push({rowId:`row-${Ce++}`,selectedItemId:null,quantity:1,max:1});let i=document.getElementById("addBorrowItemBtn");if(i.onclick=()=>{q.push({rowId:`row-${Ce++}`,selectedItemId:null,quantity:1,max:1}),De()},De(),r.session.role==="admin"&&t&&s){let c;t.addEventListener("input",()=>{n&&(n._selectedUserId=null),clearTimeout(c);let d=t.value.trim();if(d.length<2){s.style.display="none";return}c=setTimeout(async()=>{try{let f=await(await fetch(`${k}?action=search_user&query=${encodeURIComponent(d)}`)).json();f.status==="success"&&f.data.length>0?(s.innerHTML=f.data.map(g=>`
                            <div class="suggestion-item" data-nama="${m(g.nama)}" data-kelas="${m(g.kelas)}" data-userid="${m(g.id)}">
                                <span class="name">${m(g.nama)}</span>
                                <span class="class">${m(g.kelas)}</span>
                            </div>
                        `).join(""),s.style.display="block"):s.style.display="none"}catch(u){console.error("Failed to fetch name suggestions:",u),s.style.display="none"}},300)}),s.addEventListener("click",d=>{let u=d.target.closest(".suggestion-item");if(u&&n){let f=u.dataset.userid,g=u.dataset.nama,y=u.dataset.kelas;n._selectedUserId=f,t&&(t.value=g);let p=o.querySelector("#borrowerClassValue"),v=o.querySelector(".hybrid-dropdown__value"),b=o.querySelector(".hybrid-dropdown__placeholder");p&&(p.value=y),v&&(v.textContent=y,v.style.display="block"),b&&(b.style.display="none"),s.style.display="none"}}),t.addEventListener("blur",()=>{setTimeout(()=>{s&&(s.style.display="none")},200)})}},Fa=()=>{let e=document.getElementById("filterBtn"),t=document.getElementById("filterOptions"),a=document.getElementById("stockSearch"),o;a?.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(()=>{ie()},200)}),e?.addEventListener("click",s=>{s.stopPropagation(),t.classList.toggle("show")}),t?.addEventListener("click",s=>{if(s.target.tagName==="LI"){let n=s.target.dataset.filter;n==="classifier"?(Mt(),t.classList.remove("show")):(r.currentStockFilter=n,r.currentClassifierFilter=null,Y(),t.classList.remove("show"),ie())}})};function Lo(e){return`
        <div class="hybrid-dropdown__option" data-id="${e.id}" data-value="${m(e.name)}">
            <span class="option-name">${m(e.name)}</span>
        </div>`}function Eo(e,t){if(!e||!t)return;let a=e.querySelector(".hybrid-dropdown__selected"),o=e.querySelector(".hybrid-dropdown__options"),s=e.querySelector(".hybrid-dropdown__placeholder"),n=e.querySelector(".hybrid-dropdown__value"),l=()=>e.classList.remove("is-open"),i=d=>{t.value=d,d?(n.textContent=d,n.style.display="block",s&&(s.style.display="none")):(n.textContent="",n.style.display="none",s&&(s.style.display="block")),l()},c=()=>{let d=o.querySelector(".hybrid-dropdown__new-input-container");d&&d.remove();let u=o.querySelector(".hybrid-dropdown__option--create");u?u.style.display="flex":(u=document.createElement("div"),u.className="hybrid-dropdown__option hybrid-dropdown__option--create",u.innerHTML="<i class='bx bx-plus-circle'></i><span>Buat Kelas Baru</span>",u.onclick=f=>{f.stopPropagation(),o.innerHTML=`
                    <div class="hybrid-dropdown__new-input-container">
                        <input type="text" placeholder="Contoh: XII-TKJ 3" class="hybrid-dropdown__new-input">
                        <button type="button" class="btn btn-primary hybrid-dropdown__save-btn"><i class='bx bx-check'></i></button>
                    </div>`;let g=o.querySelector(".hybrid-dropdown__new-input"),y=o.querySelector(".hybrid-dropdown__save-btn");g.focus();let p=async()=>{let v=g.value.trim();if(v){y.disabled=!0;let b=await ze(v);B(b.message,b.status),b.status==="success"?(r.classes.some(x=>x.id===b.data.id)||(r.classes.push(b.data),r.classes.sort((x,w)=>x.name.localeCompare(w.name,"en",{numeric:!0}))),i(v)):(y.disabled=!1,c())}else c()};g.onkeydown=v=>{v.key==="Enter"&&(v.preventDefault(),p())},y.onclick=v=>{v.stopPropagation(),p()}},o.appendChild(u)),W(o,r.classes,Lo,"id","id",".hybrid-dropdown__option[data-id]"),o.querySelectorAll(".hybrid-dropdown__option[data-id]").forEach(f=>{f.onclick=()=>i(f.dataset.value)})};a.onclick=d=>{d.stopPropagation(),document.querySelectorAll(".hybrid-dropdown.is-open, .custom-dropdown.is-open").forEach(u=>{u!==e&&u.classList.remove("is-open")}),c(),e.classList.toggle("is-open")},i(t.value)}var ja=e=>{if(q.some(n=>n.selectedItemId==e))return!1;let a=r.items.find(n=>n.id==e);if(!a)return!1;let o=q.length-1,s=q[o];return s&&!s.selectedItemId?q[o]={...s,selectedItemId:e,quantity:1,max:a.current_quantity}:q.push({rowId:`row-${Date.now()}`,selectedItemId:e,quantity:1,max:a.current_quantity}),De(),!0};var T=null,A=[],V=0,Ht=!1,te=!1,Pt=1,Ra=null,he=document.getElementById("qrScannerOverlay"),K=document.getElementById("qrZoomSlider"),Ye=document.getElementById("qrZoomValue"),ee=document.getElementById("qrScannerControls"),U=document.getElementById("qrSwitchCameraBtn"),Na=document.getElementById("qrCancelBtn"),Xe=document.getElementById("qrCameraCount"),Dt=async()=>{he&&(he.style.display="flex",Pt=1,K&&(K.value=1),Ye&&(Ye.textContent="1.0x"),ee&&ee.classList.remove("show"),await Mo(),Oa())},Ua=()=>{A.length>0&&Xe&&(Xe.textContent=`${V+1}/${A.length}`)},Mo=async()=>{try{if(A=await Html5Qrcode.getCameras(),A&&A.length>0){let t=A.findIndex(a=>{let o=a.label.toLowerCase();return o.includes("back")||o.includes("belakang")||o.includes("rear")||o.includes("environment")});t!==-1&&(V=t)}let e=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);A&&A.length>1||e&&A.length===0?(U.style.display="flex",A.length>1?Ua():Xe&&(Xe.textContent="1/2")):U.style.display="none"}catch(e){console.error("Error getting cameras",e)}},Oa=async()=>{if(!(Ht||te)){te=!0;try{if(T){try{T.isScanning&&await T.stop(),await T.clear()}catch(a){console.warn("Cleanup warning:",a)}T=null}await new Promise(a=>setTimeout(a,200)),T=new Html5Qrcode("qr-reader");let e={fps:10,qrbox:(a,o)=>{let s=Math.min(a,o);return{width:Math.floor(s*.7),height:Math.floor(s*.7)}}},t;A.length>0?(V>=A.length&&(V=0),t=A[V].id):t={facingMode:"environment"},U&&(U.disabled=!0),await T.start(t,e,Ao,Co),Ht=!0,U&&(U.disabled=!1),To()}catch(e){console.error("Scanner Start Error:",e);let t="Gagal mengakses kamera.";e.name==="NotAllowedError"?t="Izin kamera ditolak.":e.name==="NotFoundError"?t="Kamera tidak ditemukan.":e.name==="NotReadableError"&&(t="Kamera sedang digunakan diproses lain."),B(t,"error"),await Ze()}finally{te=!1}}},To=()=>{setTimeout(()=>{try{if(!T)return;let t=document.querySelector("#qr-reader video");if(!t||!t.srcObject)return;let a=t.srcObject.getVideoTracks()[0];if(!a)return;let o=a.getCapabilities();o.zoom?(Ra=o.zoom,K&&(K.min=o.zoom.min,K.max=o.zoom.max,K.step=o.zoom.step||.1,K.value=Pt),ee&&ee.classList.add("show")):ee&&ee.classList.remove("show"),o.focusMode&&o.focusMode.includes("continuous")&&a.applyConstraints({advanced:[{focusMode:"continuous"}]}).catch(s=>console.warn("Focus mode apply failed",s))}catch(e){console.warn("Error setting up capabilities",e)}},800)},$o=async e=>{let t=document.querySelector("#qr-reader video");if(!t||!t.srcObject)return;let a=t.srcObject.getVideoTracks()[0];if(a&&Ra)try{await a.applyConstraints({advanced:[{zoom:e}]}),Pt=e,Ye&&(Ye.textContent=e.toFixed(1)+"x")}catch(o){console.error("Zoom failed",o)}},Ze=async()=>{if(!te){te=!0;try{if(T)try{T.getState&&T.getState()>=2&&await T.stop(),await T.clear()}catch(e){console.warn("Scanner stop/clear error:",e)}}catch(e){console.error("Close Scanner Error:",e)}finally{T=null,Ht=!1,te=!1,he&&(he.style.display="none"),ee&&ee.classList.remove("show");let e=document.querySelector("#qr-reader video");e&&e.srcObject&&(e.srcObject.getTracks().forEach(a=>a.stop()),e.srcObject=null)}}},Ao=async e=>{if(te)return;if(T)try{T.pause(!0)}catch{}let t=r.items.find(o=>o.item_code===e);if(!t){B("Barang tidak ditemukan","error"),setTimeout(()=>{if(T)try{T.resume()}catch{}},2e3);return}if(t.current_quantity<=0){B(`Stok ${t.name} habis!`,"error"),setTimeout(()=>{if(T)try{T.resume()}catch{}},2e3);return}await Ze();let a=document.querySelector(".page.active");(!a||a.id!=="borrow")&&await D("#borrow"),setTimeout(()=>{if(ja(t.id)){B(`${t.name} telah ditambahkan`,"success");let s=document.getElementById("borrowItemsContainer");if(s){let n=s.querySelectorAll(".borrow-item-row"),l=n[n.length-1];l&&l.scrollIntoView({behavior:"smooth",block:"center"})}}else B("Barang sudah ada di daftar peminjaman.","error")},300)},Co=()=>{};K&&K.addEventListener("input",e=>$o(parseFloat(e.target.value)));U&&U.addEventListener("click",async()=>{te||(U.disabled=!0,A.length>0?V=(V+1)%A.length:V=V===0?1:0,Ua(),await Ze(),he&&(he.style.display="flex"),await Oa(),U.disabled=!1)});Na&&Na.addEventListener("click",Ze);var we=document.getElementById("fabAddItemBtn"),z=document.querySelector('.fab-multi-action-group[data-page="stock"]'),Ga=document.getElementById("fabStockActionsToggle"),ae=document.getElementById("fabFilterDateBtn"),J=document.getElementById("filterBtn"),et=document.getElementById("fabBorrowSelectedBtn"),ke=document.getElementById("fabDeleteSelectedBtn"),_e=document.getElementById("fabSelectAllItemsBtn"),tt=document.getElementById("fabScanQrBtn"),Do=document.getElementById("usernameDisplay"),qo=document.getElementById("userProfileDropdown"),Ho=document.getElementById("mobileUserProfileContainer"),Ka=document.getElementById("sidebarNavContainer"),Po=document.getElementById("sidebarFooterContainer"),Fo=document.getElementById("sidebar"),jo=document.getElementById("overlay"),No=document.querySelectorAll(".page"),He=document.getElementById("lockOverlay"),at,ot=document.getElementById("fabAddAccountBtn"),ce=document.querySelector('.fab-multi-action-group[data-page="accounts"]'),Va=document.getElementById("fabAccountActionsToggle"),st=document.getElementById("fabDeleteSelectedAccountsBtn"),nt=document.getElementById("fabSelectAllAccountsBtn"),za=()=>{let e=r.session.role==="admin";r.session.isLoggedIn&&(Do.textContent=r.session.username,qo.style.display="block"),Ro(e)},Ft=e=>{let t=e?"bxs-sun":"bx-moon",a=e?"bx-moon":"bxs-sun",o=e?"Mode Cerah":"Mode Gelap";document.querySelectorAll(".theme-toggle-icon").forEach(s=>{s.classList.remove(a),s.classList.add(t)}),document.querySelectorAll(".theme-toggle-text").forEach(s=>{s.textContent=o})},jt=()=>{let e=document.documentElement.classList.toggle("dark");localStorage.setItem("theme",e?"dark":"light"),Ft(e)},Ja=()=>{let e=window.matchMedia("(prefers-color-scheme: dark)").matches,t=localStorage.getItem("theme"),a=t==="dark"||!t&&e;document.documentElement.classList.toggle("dark",a),Ft(a)},xe=()=>{Fo.classList.toggle("is-open"),jo.classList.toggle("is-visible")},Ro=e=>{let t=`
        <button class="profile-dropdown__item" id="mobileAccountBtn" role="menuitem">
            <i class='bx bx-user'></i>
            <span>Profil</span>
        </button>
    `;e&&(t+=`
            <button class="profile-dropdown__item" id="mobileAutoBackupBtn" role="menuitem">
                <i class='bx bx-sync'></i>
                <span>Auto Backup</span>
            </button>
        `),Ho.innerHTML=`
        <div class="profile-dropdown" id="mobileProfileDropdown">
            <button class="profile-dropdown__toggle" id="mobileUserProfileToggle" aria-haspopup="true" aria-expanded="false">
                <i class='bx bxs-user-circle'></i>
                <span id="mobileUsernameDisplay" class="profile-dropdown__username">${m(r.session.username)}</span>
                <i class='bx bx-chevron-down profile-dropdown__arrow'></i>
            </button>
            <div class="profile-dropdown__menu" id="mobileUserProfileMenu" role="menu">
                ${t}
            </div>
        </div>`;let o=document.querySelector("#desktopNav .nav__list").cloneNode(!0);if(e){let n=o.querySelector(".nav-dropdown");if(n){let i=Array.from(n.querySelectorAll(".nav-dropdown__menu .nav__link")).map(c=>{let d=document.createElement("li");d.className="nav__item";let u=c.cloneNode(!0);return d.appendChild(u),d});n.replaceWith(...i)}}else{let n=o.querySelector(".nav-dropdown");n&&n.remove()}o.querySelectorAll(".nav__link:not(.theme-toggle)").forEach(n=>{n.querySelector("span")||(n.innerHTML=`<span>${n.textContent.trim()}</span>`)});let s=o.querySelector("li:last-child");if(s){let n=document.createElement("li");n.className="nav__item",n.innerHTML=`
            <a href="#" class="nav__link theme-toggle" aria-label="Ganti Tema">
                <i class='bx bx-moon theme-toggle-icon'></i>
                <span class="theme-toggle-text">Mode Gelap</span>
            </a>`,s.insertAdjacentElement("afterend",n)}Ka.innerHTML="",Ka.appendChild(o),Po.innerHTML=`
         <button class="btn btn-danger btn-block" id="sidebarLogoutBtn">
            <i class='bx bx-log-out'></i>
            <span>Logout</span>
         </button>`,Ft(document.documentElement.classList.contains("dark"))},Y=()=>{if(!J)return;let e="Semua",t="filter-all";J.style.backgroundColor="",J.style.color="",r.currentStockFilter==="available"?(e="Tersedia",t="filter-available"):r.currentStockFilter==="empty"?(e="Kosong",t="filter-empty"):r.currentStockFilter==="classifier"&&r.currentClassifierFilter&&(e=`${m(r.currentClassifierFilter)}`,J.classList.remove("filter-available","filter-empty","filter-all"),J.style.backgroundColor="var(--card-bg-color)",J.style.color="var(--text-primary-color)",t=""),t?J.className=`btn ${t}`:r.currentStockFilter==="classifier"&&(J.className="btn"),J.innerHTML=`<i class='bx bx-filter-alt'></i> ${e}`},qe=()=>{let e=document.getElementById("fabClearFilterBtn");if(!e)return;let t=document.getElementById("stock")?.classList.contains("active"),a=r.currentStockFilter!=="all"&&t;e.classList.toggle("is-visible",a),a?e.style.display="":e.style.display="none"},ne=()=>{if(!(r.session.role==="admin")){ot&&ot.classList.remove("is-visible"),ce&&ce.classList.remove("is-visible"),st&&st.classList.remove("is-visible"),nt&&nt.classList.remove("is-visible");return}let t=document.getElementById("accounts"),a=t&&t.classList.contains("active"),o=r.selectedAccounts.length>0;ce&&ce.classList.contains("is-open")&&(ce.classList.remove("is-open"),Va&&Va.classList.remove("is-open"));let s=a&&!o;ot&&ot.classList.toggle("is-visible",s),ce&&ce.classList.toggle("is-visible",s),st&&st.classList.toggle("is-visible",a&&o),nt&&nt.classList.toggle("is-visible",a&&o)},X=()=>{let e=r.selectedItems.length>0,t=document.getElementById("stock").classList.contains("active"),a=r.session.role==="admin";if(z&&z.classList.contains("is-open")&&(z.classList.remove("is-open"),Ga&&Ga.classList.remove("is-open")),!t){et&&et.classList.remove("is-visible"),ke&&ke.classList.remove("is-visible"),_e&&_e.classList.remove("is-visible"),we&&we.classList.remove("is-visible"),z&&z.classList.remove("is-visible");return}if(et&&et.classList.toggle("is-visible",e),a){ke&&ke.classList.toggle("is-visible",e),_e&&_e.classList.toggle("is-visible",e);let o=t&&!e;we&&we.classList.toggle("is-visible",o),z&&z.classList.toggle("is-visible",o)}else ke&&ke.classList.remove("is-visible"),_e&&_e.classList.remove("is-visible"),we&&we.classList.remove("is-visible"),z&&z.classList.remove("is-visible")},D=async e=>{e=e||"#stock",(e==="#statistics"||e==="#accounts")&&r.session.role!=="admin"&&(e="#stock"),No.forEach(s=>s.classList.toggle("active",s.id===e.substring(1))),document.querySelectorAll("#desktopNav .nav__link, #sidebarNavContainer .nav__link, .nav-dropdown__toggle").forEach(s=>s.classList.remove("active"));let t=document.querySelector(`#desktopNav .nav__link[href="${e}"]`);if(t){t.classList.add("active");let s=t.closest(".nav-dropdown");s&&s.querySelector(".nav-dropdown__toggle").classList.add("active")}let a=document.querySelector(`#sidebarNavContainer .nav__link[href="${e}"]`);a&&a.classList.add("active");let o=e==="#return"||e==="#history";if(ae&&ae.classList.toggle("is-visible",o),e!=="#stock"&&r.selectedItems.length>0&&(r.selectedItems=[]),e!=="#accounts"&&r.selectedAccounts.length>0&&(r.selectedAccounts=[]),!o&&r.selectedDate&&(r.selectedDate=null),tt){let s=e==="#stock"||e==="#borrow",n=r.selectedItems.length>0,l=s&&!n;tt.style.display="",tt.classList.toggle("is-visible",l)}tt?.addEventListener("click",()=>{Dt()}),X(),ne(),Me(),qe(),e==="#stock"&&Y(),localStorage.setItem("lastActivePage",e),await R(e)},Me=()=>{if(!ae)return;let e=ae.querySelector("i");r.selectedDate?(ae.style.backgroundColor="var(--danger-color)",ae.title=`Hapus Filter: ${C(r.selectedDate)}`,e.classList.remove("bx-calendar"),e.classList.add("bx-x")):(ae.style.backgroundColor="",ae.title="Filter Berdasarkan Tanggal",e.classList.remove("bx-x"),e.classList.add("bx-calendar"))},Nt=()=>{at&&clearInterval(at);let{isLoaded:e,isAppLocked:t,lockReason:a,startTime:o,endTime:s}=r.borrowSettings;if(!He||!e||r.session.role==="admin"){He&&He.classList.remove("is-visible");return}let n=document.getElementById("borrowForm"),l=n?n.querySelectorAll("input, button, .custom-dropdown__selected, .hybrid-dropdown__selected"):[],i=document.querySelectorAll(".return-btn"),c=document.getElementById("countdown"),d=u=>{l.forEach(f=>{f.disabled=u,(f.classList.contains("custom-dropdown__selected")||f.classList.contains("hybrid-dropdown__selected"))&&f.closest(".custom-dropdown, .hybrid-dropdown")?.classList.toggle("is-disabled",u)}),i.forEach(f=>{f.disabled=u})};if(t)if(He.classList.add("is-visible"),d(!0),a==="manual")document.getElementById("lockOverlayTitle").textContent="Sistem Dikunci",document.getElementById("lockOverlayMessage").textContent="Aplikasi dikunci oleh admin. Silakan coba lagi nanti.",c.style.display="none";else{document.getElementById("lockOverlayTitle").textContent="Aplikasi Ditutup",document.getElementById("lockOverlayMessage").textContent="Aplikasi dapat diakses kembali dalam:",c.style.display="flex";let u=new Date,[f,g]=o.split(":").map(Number),y=new Date;y.setHours(f,g,0,0);let p;u<y?p=y:p=new Date(y.getTime()+1440*60*1e3);let v=()=>{let b=p.getTime()-new Date().getTime();if(b<0){clearInterval(at),window.location.reload();return}let x=Math.floor(b/(1e3*60*60*24)),w=Math.floor(b%(1e3*60*60*24)/(1e3*60*60)),h=Math.floor(b%(1e3*60*60)/(1e3*60)),I=Math.floor(b%(1e3*60)/1e3);document.getElementById("countdown-days").textContent=String(x).padStart(2,"0"),document.getElementById("countdown-hours").textContent=String(w).padStart(2,"0"),document.getElementById("countdown-minutes").textContent=String(h).padStart(2,"0"),document.getElementById("countdown-seconds").textContent=String(I).padStart(2,"0")};v(),at=setInterval(v,1e3)}else He.classList.remove("is-visible"),d(!1);document.getElementById("borrowingHours").textContent=`${o} - ${s}`};var Qa=null,Wa=null,Ya=null,Xa=!1,Za=()=>window.innerWidth<=840,Rt=async(e,t="name")=>{try{let o=await(await fetch(`${k}?action=get_statistics&type=${e}&groupBy=${t}`)).json();if(o.status==="success")return o.data;throw new Error(o.message)}catch(a){return B(`Gagal memuat data untuk ${e}: ${a.message}`,"error"),[]}},Uo=()=>{let e=document.getElementById("chartjs-tooltip");return e||(e=document.createElement("div"),e.id="chartjs-tooltip",e.style.opacity=0,e.style.pointerEvents="none",e.style.position="absolute",e.style.transition="opacity 0.2s ease, transform 0.2s ease",document.body.appendChild(e)),e},eo=e=>{let{chart:t,tooltip:a}=e,o=Uo();if(a.opacity===0){o.style.opacity=0;return}if(a.body){let c=a.dataPoints[0].dataIndex,d=t.config.type,f=t.options.plugins.tooltip.externalContext.data[c],g=f.image_url,y=m(f.label),p=f.count,v=d==="bar"?`Jumlah Dipinjam: ${p}`:`Frekuensi: ${p} kali`,b="";if(g){let x=`https://placehold.co/120x100/8ab4f8/ffffff?text=${encodeURIComponent(y)}`;b+=`<img src="${m(g)}" alt="${y}" class="chartjs-tooltip-image" onerror="this.onerror=null;this.src='${x}';">`}b+=`<span class="chartjs-tooltip-label">${y}</span>`,b+=`<span class="chartjs-tooltip-value">${v}</span>`,o.innerHTML=b}let s=t.canvas.getBoundingClientRect(),n=s.left+window.scrollX+a.caretX,l=s.top+window.scrollY+a.caretY,i=o.offsetWidth;n+i/2>window.innerWidth-10&&(n=window.innerWidth-i/2-10),n-i/2<10&&(n=i/2+10),o.style.opacity=1,o.style.left=`${n}px`,o.style.top=`${l}px`,o.style.transform="translate(-50%, calc(-100% - 10px))"},Oo=async()=>{let e=document.getElementById("diskUsageIndicator");if(e)try{let a=await(await fetch(`${k}?action=get_disk_usage`)).json();if(a.status==="success"&&a.data){let{used_percentage:o,formatted_used:s,formatted_free:n,formatted_total:l}=a.data;e.querySelector(".disk-bar__used").style.width=`${o}%`,e.querySelector(".disk-bar__free").style.width=`${100-o}%`,e.querySelector("#diskUsedValue").textContent=s,e.querySelector("#diskFreeValue").textContent=n,e.querySelector("#diskTotalText").textContent=l,e.querySelector("#diskUsedText").textContent=s,e.querySelector("#diskFreeText").textContent=n,e.style.visibility="visible"}else e.style.display="none"}catch(t){console.error("Gagal mengambil data penggunaan disk:",t),e.style.display="none"}},to=e=>{let t=[],a=["#4285F4","#DB4437","#F4B400","#0F9D58","#AB47BC","#00ACC1","#FF7043","#9E9D24","#5C6BC0","#26A69A","#FFCA28","#66BB6A"];for(let o=0;o<e;o++)t.push(a[o%a.length]);return t},Go=()=>{let e=document.documentElement.classList.contains("dark"),t=e?"rgba(232, 234, 237, 0.8)":"#5f6368",a=e?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.1)";Chart.defaults.font.family="'Inter', sans-serif",Chart.defaults.color=t,Chart.defaults.plugins.legend.position="bottom",Chart.defaults.scale.grid.color=a,Chart.defaults.scale.ticks.color=t,Chart.defaults.maintainAspectRatio=!1,Chart.defaults.responsive=!0},Ut=(e,t,a,o)=>{let s=document.getElementById(t);if(!s)return null;if(!(o.data.labels&&o.data.labels.length>0))return e&&e.destroy(),s.innerHTML=O("Data Kosong","Belum ada data untuk ditampilkan."),null;let l=s.querySelector("canvas");if(l||(s.innerHTML=`<canvas id="${a}"></canvas>`,l=document.getElementById(a),e=null),e)return e.data=o.data,e.options=o.options,e.update(),e;{let i=l.getContext("2d");return new Chart(i,o)}},Ko=async()=>{let e=await Rt("class_borrowals"),t={type:"pie",data:{labels:e.map(a=>a.label),datasets:[{label:"Jumlah Peminjaman",data:e.map(a=>a.count),backgroundColor:to(e.length),borderColor:document.documentElement.classList.contains("dark")?"#282a2d":"#FFFFFF",borderWidth:2,hoverOffset:4}]},options:{plugins:{title:{display:!1}}}};Qa=Ut(Qa,"classBorrowalsChartContainer","classBorrowalsChart",t)},ao=async(e="name")=>{let t=await Rt("current_loans",e),a={type:"bar",data:{labels:t.map(o=>o.label),datasets:[{label:"Jumlah Dipinjam",data:t.map(o=>o.count),backgroundColor:to(1)[0],borderRadius:5}]},options:{scales:{y:{beginAtZero:!0,ticks:{precision:0}},x:{display:!Za()||e==="classifier",ticks:{display:e==="classifier"},title:{display:e==="name",text:"Hover / klik pada diagram untuk detail",font:{size:11,style:"italic"},padding:{top:5}}}},plugins:{title:{display:!1},legend:{display:!1},tooltip:{enabled:!1,position:"nearest",external:eo,externalContext:{data:t}}},onHover:(o,s)=>{o.native.target.style.cursor=s[0]?"pointer":"default"}}};e==="classifier"&&(a.options.plugins.tooltip.enabled=!0,a.options.plugins.tooltip.external=void 0,a.options.plugins.tooltip.externalContext=void 0),Wa=Ut(Wa,"currentLoansChartContainer","currentLoansChart",a)},oo=async(e="name")=>{let t=await Rt("loan_history",e),a={type:"line",data:{labels:t.map(o=>o.label),datasets:[{label:"Frekuensi Peminjaman",data:t.map(o=>o.count),fill:!0,backgroundColor:"rgba(37, 211, 102, 0.1)",borderColor:"rgba(37, 211, 102, 1)",tension:.1,pointRadius:4}]},options:{scales:{y:{beginAtZero:!0,ticks:{precision:0}},x:{display:!Za()||e==="classifier",ticks:{display:e==="classifier"},title:{display:e==="name",text:"Hover / klik pada diagram untuk detail",font:{size:11,style:"italic"},padding:{top:5}}}},plugins:{title:{display:!1},legend:{display:!1},tooltip:{enabled:!1,position:"nearest",external:eo,externalContext:{data:t}}},interaction:{intersect:!1,mode:"index"},onHover:(o,s)=>{o.native.target.style.cursor=s[0]?"pointer":"default"}}};e==="classifier"&&(a.options.plugins.tooltip.enabled=!0,a.options.plugins.tooltip.external=void 0,a.options.plugins.tooltip.externalContext=void 0),Ya=Ut(Ya,"loanHistoryChartContainer","loanHistoryChart",a)},so=()=>{Go(),Ko();let e=document.querySelector("#currentLoansFilter .btn.active")?.dataset.value||"classifier",t=document.querySelector("#loanHistoryFilter .btn.active")?.dataset.value||"classifier";ao(e),oo(t)},Vo=()=>{if(Xa)return;let e=(a,o)=>{document.getElementById(a)?.addEventListener("click",s=>{if(s.target.tagName==="BUTTON"&&!s.target.classList.contains("active")){let n=s.target.dataset.value;s.currentTarget.querySelector(".btn.active").classList.remove("active"),s.target.classList.add("active"),o(n)}})};e("currentLoansFilter",ao),e("loanHistoryFilter",oo),new MutationObserver(a=>{a[0].attributeName==="class"&&setTimeout(so,50)}).observe(document.documentElement,{attributes:!0}),Xa=!0},no=async()=>{so(),Vo(),Oo()};var zo=document.getElementById("returnSearch"),Jo=document.getElementById("historySearch"),Qo=document.getElementById("hamburgerMenu"),Wo=document.getElementById("overlay"),Yo=document.getElementById("desktopThemeToggle"),ro=document.getElementById("userProfileToggle"),Xo=document.getElementById("userProfileMenu"),Zo=document.getElementById("dropdownLogoutBtn"),es=document.getElementById("accountBtn"),ts=document.getElementById("autoBackupBtn"),Ot=document.getElementById("desktopAppBtn"),as=document.getElementById("fabFilterDateBtn"),os=document.getElementById("fabBorrowSelectedBtn"),ss=document.getElementById("fabDeleteSelectedBtn"),ns=document.getElementById("fabImportStockBtn"),rs=document.getElementById("fabExportStockBtn"),is=document.getElementById("fabDeleteSelectedAccountsBtn"),ls=document.getElementById("fabSelectAllAccountsBtn"),cs=document.getElementById("fabSelectAllItemsBtn"),io=document.getElementById("modal"),ds=document.getElementById("borrowForm"),us=document.getElementById("stockGrid"),Se=!navigator.onLine,R=async e=>{switch(e.substring(1)){case"stock":await G("items"),Pa();break;case"borrow":await G("items"),Je();break;case"return":await Promise.all([G("borrowals"),G("items")]),ge();break;case"history":j();break;case"statistics":r.session.role==="admin"?await no():await D("#stock");break;case"accounts":r.session.role==="admin"?await me():await D("#stock");break}},ms=async()=>{navigator.onLine||(B("Koneksi terputus. Anda mungkin melihat status yang kedaluwarsa.","error"),Se=!0);try{await qt(),Nt(),Se&&(Se=!1)}catch(e){Se=!0,console.error("Gagal memuat pengaturan awal.",e)}},lo=()=>{let e=new EventSource(`${k}?action=get_lock_stream`);e.addEventListener("lock_update",t=>{let a=JSON.parse(t.data);r.borrowSettings={...r.borrowSettings,isManuallyLocked:a.is_manually_locked,isAppLocked:a.is_app_locked,lockReason:a.lock_reason,startTime:a.borrow_start_time,endTime:a.borrow_end_time,isLoaded:!0},Nt(),Se&&(Se=!1)}),e.addEventListener("error",t=>{if(t.data)try{let a=JSON.parse(t.data);if(a.message&&a.message.includes("Sesi tidak valid")){e.close(),B("Sesi Anda telah berakhir, silakan login kembali.","error"),setTimeout(()=>{window.location.href="login/"},2e3);return}}catch{}e.close(),setTimeout(lo,2e3)})},ps=()=>{let e=document.getElementById("liveClock");if(!e)return;let t=()=>{let a=new Date,s=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"][a.getDay()],n=String(a.getDate()).padStart(2,"0"),l=String(a.getMonth()+1).padStart(2,"0"),i=a.getFullYear(),c=String(a.getHours()).padStart(2,"0"),d=String(a.getMinutes()).padStart(2,"0"),u=String(a.getSeconds()).padStart(2,"0");e.textContent=`${s}, ${n}/${l}/${i} - ${c}:${d}:${u}`};t(),setInterval(t,1e3)},fs=()=>{let e=document.querySelectorAll('#stockGrid .card:not([style*="display: none"])'),a=Array.from(e).map(s=>s.dataset.itemId).filter(s=>{let n=r.items.find(l=>l.id.toString()===s);return n&&n.current_quantity>0});if(a.length>0&&a.every(s=>r.selectedItems.includes(s)))r.selectedItems=r.selectedItems.filter(s=>!a.includes(s));else{let s=new Set([...r.selectedItems,...a]);r.selectedItems=Array.from(s)}e.forEach(s=>{let n=s.dataset.itemId;if(a.includes(n)){let l=r.selectedItems.includes(n);s.classList.toggle("is-selected",l)}}),X()},gs=()=>{window.addEventListener("pageshow",a=>{a.persisted&&ct()}),Qo?.addEventListener("click",xe),Wo?.addEventListener("click",xe),Yo?.addEventListener("click",jt),document.body.addEventListener("click",async a=>{let o=a.target.closest("#nameSuggestions .suggestion-item");if(o){a.stopPropagation();let u=o.closest("form");if(!u)return;let f=u.querySelector("#borrowerName"),g=u.querySelector("#classDropdownContainer");if(!f||!g)return;let y=o.dataset.nama,p=o.dataset.kelas;f.value=y;let v=g.querySelector("#borrowerClassValue"),b=g.querySelector(".hybrid-dropdown__value"),x=g.querySelector(".hybrid-dropdown__placeholder");v&&(v.value=p),b&&(b.textContent=p,b.style.display="block"),x&&(x.style.display="none");let w=u.querySelector("#nameSuggestions");w&&(w.style.display="none");return}a.target.closest(".profile-dropdown")||(document.querySelectorAll(".profile-dropdown__menu.is-open").forEach(u=>u.classList.remove("is-open")),document.querySelectorAll('.profile-dropdown__toggle[aria-expanded="true"]').forEach(u=>u.setAttribute("aria-expanded","false"))),a.target.closest(".nav-dropdown")||document.querySelectorAll(".nav-dropdown.is-open").forEach(u=>{u.classList.remove("is-open"),u.querySelector(".nav-dropdown__toggle").setAttribute("aria-expanded","false")}),a.target.closest(".filter-dropdown")||document.querySelectorAll(".filter-dropdown__menu.show").forEach(u=>u.classList.remove("show")),a.target.closest(".custom-dropdown")||document.querySelectorAll(".custom-dropdown.is-open").forEach(u=>u.classList.remove("is-open")),a.target.closest(".hybrid-dropdown")||document.querySelectorAll(".hybrid-dropdown.is-open").forEach(u=>u.classList.remove("is-open")),a.target.closest(".action-dropdown")||document.querySelectorAll(".action-dropdown.is-open").forEach(u=>u.classList.remove("is-open"));let s=a.target.closest(".fab-multi-action-group");document.querySelectorAll(".fab-multi-action-group.is-open").forEach(u=>{u!==s&&(u.classList.remove("is-open"),u.querySelector(".fab-action").classList.remove("is-open"))}),document.getElementById("stock").classList.contains("active")&&r.selectedItems.length>0&&!a.target.closest(".card")&&!a.target.closest(".fab-container")&&(r.selectedItems=[],document.querySelectorAll("#stockGrid .card.is-selected").forEach(u=>u.classList.remove("is-selected")),X());let l=document.getElementById("accounts");l&&l.classList.contains("active")&&r.selectedAccounts.length>0&&!a.target.closest(".account-list-item")&&!a.target.closest(".fab-container")&&(r.selectedAccounts=[],document.querySelectorAll("#accountList .account-list-item.is-selected").forEach(u=>u.classList.remove("is-selected")),ne());let c=a.target.closest(".sidebar__nav .nav__link:not(.theme-toggle)");c&&(a.preventDefault(),D(c.getAttribute("href")),xe());let d=a.target.closest("#mobileUserProfileToggle");if(d){let f=document.getElementById("mobileUserProfileMenu").classList.toggle("is-open");d.setAttribute("aria-expanded",f)}if(a.target.closest("#mobileAccountBtn")&&(xe(),je()),a.target.closest("#mobileAutoBackupBtn")){xe();let u=await ve();Te(u.status!=="idle"?u:null)}a.target.closest("#sidebarLogoutBtn")&&dt(),a.target.closest(".sidebar__nav .theme-toggle")&&(a.preventDefault(),jt())}),document.querySelector(".header").addEventListener("click",a=>{let o=a.target.closest(".nav__item:not(.nav-dropdown) > .nav__link, .header__logo");o&&(a.preventDefault(),D(o.getAttribute("href")));let s=a.target.closest(".nav-dropdown__toggle");if(s){a.preventDefault();let i=s.closest(".nav-dropdown").classList.toggle("is-open");s.setAttribute("aria-expanded",i)}let n=a.target.closest(".nav-dropdown__menu .nav__link");if(n){a.preventDefault(),D(n.getAttribute("href"));let l=n.closest(".nav-dropdown");l.classList.remove("is-open"),l.querySelector(".nav-dropdown__toggle").setAttribute("aria-expanded","false")}}),document.addEventListener("click",a=>{let o=a.target.closest(".card__action-btn, .return-btn, .add-item-btn, .close-modal-btn, #fabAddItemBtn, .custom-dropdown__selected, .delete-history-btn, #borrowSettingsBtn, .edit-borrowal-btn, .delete-borrowal-btn, #exportActionsBtn, #exportCsvOnlyBtn, #backupToDriveBtn, #flushHistoryBtn, #importCsvBtn, #fabAddAccountBtn, #fabImportAccountsBtn, #fabExportAccountsBtn");if(o){if(o.matches(".edit:not(:disabled)")&&Re(o.dataset.id),o.matches(".delete:not(:disabled)")&&bt(o.dataset.id),o.matches(".borrow-shortcut")){let s=o.dataset.id;r.itemToBorrow=s,D("#borrow")}o.matches(".return-btn")&&xt(o.dataset.id),o.matches(".add-item-btn")&&St(o.dataset.id),o.matches(".edit-borrowal-btn")&&Bt(o.dataset.id),o.matches(".delete-borrowal-btn")&&It(o.dataset.id),o.matches("#fabAddItemBtn")&&Re(),o.matches("#fabAddAccountBtn")&&kt(),o.matches("#fabImportAccountsBtn")&&(a.preventDefault(),se("accounts")),o.matches("#fabExportAccountsBtn")&&(a.preventDefault(),Ke()),o.matches(".close-modal-btn")&&S(),o.matches(".custom-dropdown__selected")&&o.closest(".custom-dropdown").classList.toggle("is-open"),o.matches(".delete-history-btn")&&Et(o.dataset.id),o.matches("#borrowSettingsBtn")&&ft(),o.matches("#exportActionsBtn")&&o.closest(".action-dropdown").classList.toggle("is-open"),o.matches("#exportCsvOnlyBtn")&&(a.preventDefault(),r.history.length>0?$t():B("Tidak ada riwayat untuk diekspor.","error")),o.matches("#importCsvBtn")&&(a.preventDefault(),La()),o.matches("#backupToDriveBtn")&&(a.preventDefault(),r.history.length===0?B("Tidak ada riwayat untuk di-backup.","error"):Ve()),o.matches("#flushHistoryBtn:not(:disabled)")&&fe()}}),ro?.addEventListener("click",()=>{let a=Xo.classList.toggle("is-open");ro.setAttribute("aria-expanded",a)}),Zo?.addEventListener("click",dt),es?.addEventListener("click",je),ts?.addEventListener("click",async()=>{let a=await ve();Te(a.status!=="idle"?a:null)}),Ot?.addEventListener("click",Ne),as.addEventListener("click",()=>{let a=document.querySelector(".page.active")?.id;a!=="history"&&a!=="return"||(r.selectedDate?(r.selectedDate=null,Me(),a==="history"?j():a==="return"&&ge()):Tt())}),os?.addEventListener("click",()=>{r.selectedItems.length>0&&(r.itemsToBorrow=[...r.selectedItems],r.selectedItems=[],X(),D("#borrow"))}),ss?.addEventListener("click",()=>{r.selectedItems.length>0&&r.session.role==="admin"&&yt()}),is?.addEventListener("click",()=>{r.selectedAccounts.length>0&&r.session.role==="admin"&&_t()}),ls?.addEventListener("click",()=>{r.session.role==="admin"&&ra()}),cs?.addEventListener("click",()=>{r.session.role==="admin"&&fs()}),document.querySelectorAll(".fab-action").forEach(a=>{a.addEventListener("click",o=>{o.stopPropagation(),o.currentTarget.closest(".fab-multi-action-group").classList.toggle("is-open"),o.currentTarget.classList.toggle("is-open")})}),ns?.addEventListener("click",()=>se("stock")),rs?.addEventListener("click",()=>Ge()),io.addEventListener("click",a=>{a.target===io&&S()}),us?.addEventListener("click",a=>{if(a.target.closest(".card__action-btn, .card__borrow-action-container, .card__image-overlay-actions"))return;let o=a.target.closest(".card");if(o){let s=o.dataset.itemId;if(!s)return;let n=r.items.find(i=>i.id==s);if(n&&n.current_quantity<=0){B("Barang ini sedang kosong dan tidak bisa dipilih.","error");return}o.classList.toggle("is-selected");let l=r.selectedItems.indexOf(s);l>-1?r.selectedItems.splice(l,1):r.selectedItems.push(s),X()}}),document.getElementById("fabClearFilterBtn")?.addEventListener("click",()=>{r.currentStockFilter="all",r.currentClassifierFilter=null,Y(),ie()}),Fa(),zo?.addEventListener("input",ge);let t;Jo?.addEventListener("input",()=>{clearTimeout(t),t=setTimeout(()=>j(),300)}),ds?.addEventListener("submit",Ma)},bs=()=>{!/Mobi|Android/i.test(navigator.userAgent)&&Ot&&(Ot.style.display="flex")};window.addEventListener("load",function(){let e=new Date().getFullYear();console.log(`%c\xA9 Developed by Alea Farrel - ${e} Inventaris TKJ
              All Rights Reserved.`,"background: #222; color: #bada55; font-size:12px; padding:4px; border-radius:4px;")});var ys=async()=>{if(oe(),await ct(),await Promise.all([$e()]),r.session.role==="admin"){let[o,s,n,l]=await Promise.all([$a(),Aa(),Ta(),ve()]);o.status!=="idle"&&Ve(o),s.status!=="idle"&&(s.export_type==="accounts"?Ke(s):Ge(s)),n.status!=="idle"&&se(n.import_type||"stock",n),l.status!=="idle"&&Te(l)}let e=localStorage.getItem("lastActivePage")||"#stock";r.session.role!=="admin"&&(e==="#statistics"||e==="#accounts")&&(e="#stock");let t=document.getElementById("filterBtn");t&&(t.className="btn filter-all",t.innerHTML="<i class='bx bx-filter-alt'></i> Semua",r.currentStockFilter="all",r.currentClassifierFilter=null);let a=document.getElementById("accountFilterBtn");a&&(a.className="btn filter-all",a.innerHTML="<i class='bx bx-filter-alt'></i> Semua"),Ja(),gs(),za(),ps(),Y(),qe(),bs(),await ms(),await D(e),Ie(),lo()};ys();export{R as loadPageData};

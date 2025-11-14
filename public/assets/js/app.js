(()=>{var i={items:[],classifiers:[],classes:[],borrowals:[],history:[],accounts:[],itemToBorrow:null,itemsToBorrow:[],selectedItems:[],selectedAccounts:[],currentStockFilter:"all",currentClassifierFilter:null,selectedDate:null,historyPage:1,isLoadingMoreHistory:!1,hasMoreHistory:!0,accountPage:1,isLoadingMoreAccounts:!1,hasMoreAccounts:!0,session:{isLoggedIn:!1,username:null,role:null,login_username:null,kelas:null},borrowSettings:{startTime:"06:30",endTime:"17:00",isManuallyLocked:!1,isAppLocked:!1,lockReason:"open",isLoaded:!1}},S=null,h="api.php",Ge="auth.php",Bt=e=>{S=e};var St=document.getElementById("loadingOverlay"),Oe=document.getElementById("notification"),pe=document.getElementById("modal"),Ro=document.getElementById("modalTitle"),Lt=document.getElementById("modalBody"),m=e=>e==null?"":String(e).replace(/[&<>"]/g,function(t){return{"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[t]}),K=()=>St.classList.add("is-visible"),me=()=>St.classList.remove("is-visible"),B=(e,t="success")=>{Oe.textContent=e,Oe.className=`notification ${t} show`,setTimeout(()=>Oe.classList.remove("show"),3e3)},w=(e,t)=>{Ro.innerHTML=e,Lt.innerHTML=t,pe.classList.add("is-visible")},k=()=>{pe.classList.contains("is-visible")&&(pe.classList.add("is-closing"),setTimeout(()=>{pe.classList.remove("is-visible"),pe.classList.remove("is-closing"),Lt.innerHTML=""},300))},q=(e,t)=>`
    <div class="empty-state">
        <img src="assets/favicon/empty.png" alt="Data Kosong" class="empty-state__image">
        <h2 class="empty-state__title">${m(e)}</h2>
        <p class="empty-state__text">${m(t)}</p>
    </div>`,Ue=(e,t,o)=>{let a=t.toLowerCase();return a?e.filter(s=>o.some(n=>s[n]&&String(s[n]).toLowerCase().includes(a))):e},A=e=>{if(!e)return"";let t=new Date(e);return t.setMinutes(t.getMinutes()-t.getTimezoneOffset()),t.toISOString().split("T")[0]};var Re=async()=>{try{let e=await fetch(`${Ge}?action=get_session`);if(!e.ok)throw new Error("Redirecting to login...");let t=await e.json();if(t.status==="success"&&t.data)i.session={isLoggedIn:!0,username:t.data.username,role:t.data.role,login_username:t.data.login_username,kelas:t.data.kelas};else throw new Error("No active session.")}catch{window.location.href="login/"}},Ke=async()=>{K(),await fetch(`${Ge}?action=logout`),window.location.href="login/"};var ee=document.getElementById("fabAddItemBtn"),H=document.querySelector('.fab-multi-action-group[data-page="stock"]'),It=document.getElementById("fabStockActionsToggle"),N=document.getElementById("fabFilterDateBtn"),P=document.getElementById("filterBtn"),xe=document.getElementById("fabBorrowSelectedBtn"),te=document.getElementById("fabDeleteSelectedBtn"),oe=document.getElementById("fabSelectAllItemsBtn"),Ko=document.getElementById("usernameDisplay"),Vo=document.getElementById("userProfileDropdown"),Jo=document.getElementById("mobileUserProfileContainer"),Et=document.getElementById("sidebarNavContainer"),zo=document.getElementById("sidebarFooterContainer"),Wo=document.getElementById("sidebar"),Yo=document.getElementById("overlay"),Xo=document.querySelectorAll(".page"),fe=document.getElementById("lockOverlay"),Be,Se=document.getElementById("fabAddAccountBtn"),V=document.querySelector('.fab-multi-action-group[data-page="accounts"]'),Mt=document.getElementById("fabAccountActionsToggle"),Le=document.getElementById("fabDeleteSelectedAccountsBtn"),Ie=document.getElementById("fabSelectAllAccountsBtn"),At=()=>{let e=i.session.role==="admin";i.session.isLoggedIn&&(Ko.textContent=i.session.username,Vo.style.display="block"),Qo(e)},Ve=e=>{let t=e?"bxs-sun":"bx-moon",o=e?"bx-moon":"bxs-sun",a=e?"Mode Cerah":"Mode Gelap";document.querySelectorAll(".theme-toggle-icon").forEach(s=>{s.classList.remove(o),s.classList.add(t)}),document.querySelectorAll(".theme-toggle-text").forEach(s=>{s.textContent=a})},Je=()=>{let e=document.documentElement.classList.toggle("dark");localStorage.setItem("theme",e?"dark":"light"),Ve(e)},Tt=()=>{let e=window.matchMedia("(prefers-color-scheme: dark)").matches,t=localStorage.getItem("theme"),o=t==="dark"||!t&&e;document.documentElement.classList.toggle("dark",o),Ve(o)},ae=()=>{Wo.classList.toggle("is-open"),Yo.classList.toggle("is-visible")},Qo=e=>{let t=`
        <button class="profile-dropdown__item" id="mobileAccountBtn" role="menuitem">
            <i class='bx bx-user'></i>
            <span>Profil</span>
        </button>
    `;e&&(t+=`
            <button class="profile-dropdown__item" id="mobileAutoBackupBtn" role="menuitem">
                <i class='bx bx-sync'></i>
                <span>Auto Backup</span>
            </button>
        `),Jo.innerHTML=`
        <div class="profile-dropdown" id="mobileProfileDropdown">
            <button class="profile-dropdown__toggle" id="mobileUserProfileToggle" aria-haspopup="true" aria-expanded="false">
                <i class='bx bxs-user-circle'></i>
                <span id="mobileUsernameDisplay" class="profile-dropdown__username">${m(i.session.username)}</span>
                <i class='bx bx-chevron-down profile-dropdown__arrow'></i>
            </button>
            <div class="profile-dropdown__menu" id="mobileUserProfileMenu" role="menu">
                ${t}
            </div>
        </div>`;let a=document.querySelector("#desktopNav .nav__list").cloneNode(!0);if(e){let n=a.querySelector(".nav-dropdown");if(n){let l=Array.from(n.querySelectorAll(".nav-dropdown__menu .nav__link")).map(p=>{let c=document.createElement("li");c.className="nav__item";let d=p.cloneNode(!0);return c.appendChild(d),c});n.replaceWith(...l)}}else{let n=a.querySelector(".nav-dropdown");n&&n.remove()}a.querySelectorAll(".nav__link:not(.theme-toggle)").forEach(n=>{n.querySelector("span")||(n.innerHTML=`<span>${n.textContent.trim()}</span>`)});let s=a.querySelector("li:last-child");if(s){let n=document.createElement("li");n.className="nav__item",n.innerHTML=`
            <a href="#" class="nav__link theme-toggle" aria-label="Ganti Tema">
                <i class='bx bx-moon theme-toggle-icon'></i>
                <span class="theme-toggle-text">Mode Gelap</span>
            </a>`,s.insertAdjacentElement("afterend",n)}Et.innerHTML="",Et.appendChild(a),zo.innerHTML=`
         <button class="btn btn-danger btn-block" id="sidebarLogoutBtn">
            <i class='bx bx-log-out'></i>
            <span>Logout</span>
         </button>`,Ve(document.documentElement.classList.contains("dark"))},G=()=>{if(!P)return;let e="Semua",t="filter-all";P.style.backgroundColor="",P.style.color="",i.currentStockFilter==="available"?(e="Tersedia",t="filter-available"):i.currentStockFilter==="empty"?(e="Kosong",t="filter-empty"):i.currentStockFilter==="classifier"&&i.currentClassifierFilter&&(e=`${m(i.currentClassifierFilter)}`,P.classList.remove("filter-available","filter-empty","filter-all"),P.style.backgroundColor="var(--card-bg-color)",P.style.color="var(--text-primary-color)",t=""),t?P.className=`btn ${t}`:i.currentStockFilter==="classifier"&&(P.className="btn"),P.innerHTML=`<i class='bx bx-filter-alt'></i> ${e}`},ge=()=>{let e=document.getElementById("fabClearFilterBtn");if(!e)return;let t=document.getElementById("stock")?.classList.contains("active"),o=i.currentStockFilter!=="all"&&t;e.classList.toggle("is-visible",o),o?e.style.display="":e.style.display="none"},J=()=>{if(!(i.session.role==="admin")){Se&&Se.classList.remove("is-visible"),V&&V.classList.remove("is-visible"),Le&&Le.classList.remove("is-visible"),Ie&&Ie.classList.remove("is-visible");return}let t=document.getElementById("accounts"),o=t&&t.classList.contains("active"),a=i.selectedAccounts.length>0;V&&V.classList.contains("is-open")&&(V.classList.remove("is-open"),Mt&&Mt.classList.remove("is-open"));let s=o&&!a;Se&&Se.classList.toggle("is-visible",s),V&&V.classList.toggle("is-visible",s),Le&&Le.classList.toggle("is-visible",o&&a),Ie&&Ie.classList.toggle("is-visible",o&&a)},O=()=>{let e=i.selectedItems.length>0,t=document.getElementById("stock").classList.contains("active"),o=i.session.role==="admin";if(H&&H.classList.contains("is-open")&&(H.classList.remove("is-open"),It&&It.classList.remove("is-open")),!t){xe&&xe.classList.remove("is-visible"),te&&te.classList.remove("is-visible"),oe&&oe.classList.remove("is-visible"),ee&&ee.classList.remove("is-visible"),H&&H.classList.remove("is-visible");return}if(xe&&xe.classList.toggle("is-visible",e),o){te&&te.classList.toggle("is-visible",e),oe&&oe.classList.toggle("is-visible",e);let a=t&&!e;ee&&ee.classList.toggle("is-visible",a),H&&H.classList.toggle("is-visible",a)}else te&&te.classList.remove("is-visible"),oe&&oe.classList.remove("is-visible"),ee&&ee.classList.remove("is-visible"),H&&H.classList.remove("is-visible")},T=async e=>{e=e||"#stock",(e==="#statistics"||e==="#accounts")&&i.session.role!=="admin"&&(e="#stock"),Xo.forEach(s=>s.classList.toggle("active",s.id===e.substring(1))),document.querySelectorAll("#desktopNav .nav__link, #sidebarNavContainer .nav__link, .nav-dropdown__toggle").forEach(s=>s.classList.remove("active"));let t=document.querySelector(`#desktopNav .nav__link[href="${e}"]`);if(t){t.classList.add("active");let s=t.closest(".nav-dropdown");s&&s.querySelector(".nav-dropdown__toggle").classList.add("active")}let o=document.querySelector(`#sidebarNavContainer .nav__link[href="${e}"]`);o&&o.classList.add("active");let a=e==="#return"||e==="#history";N&&N.classList.toggle("is-visible",a),e!=="#stock"&&i.selectedItems.length>0&&(i.selectedItems=[]),e!=="#accounts"&&i.selectedAccounts.length>0&&(i.selectedAccounts=[]),!a&&i.selectedDate&&(i.selectedDate=null),O(),J(),be(),ge(),e==="#stock"&&G(),localStorage.setItem("lastActivePage",e),await F(e)},be=()=>{if(!N)return;let e=N.querySelector("i");i.selectedDate?(N.style.backgroundColor="var(--danger-color)",N.title=`Hapus Filter: ${A(i.selectedDate)}`,e.classList.remove("bx-calendar"),e.classList.add("bx-x")):(N.style.backgroundColor="",N.title="Filter Berdasarkan Tanggal",e.classList.remove("bx-x"),e.classList.add("bx-calendar"))},ze=()=>{Be&&clearInterval(Be);let{isLoaded:e,isAppLocked:t,lockReason:o,startTime:a,endTime:s}=i.borrowSettings;if(!fe||!e||i.session.role==="admin"){fe&&fe.classList.remove("is-visible");return}let n=document.getElementById("borrowForm"),r=n?n.querySelectorAll("input, button, .custom-dropdown__selected, .hybrid-dropdown__selected"):[],l=document.querySelectorAll(".return-btn"),p=document.getElementById("countdown"),c=d=>{r.forEach(u=>{u.disabled=d,(u.classList.contains("custom-dropdown__selected")||u.classList.contains("hybrid-dropdown__selected"))&&u.closest(".custom-dropdown, .hybrid-dropdown")?.classList.toggle("is-disabled",d)}),l.forEach(u=>{u.disabled=d})};if(t)if(fe.classList.add("is-visible"),c(!0),o==="manual")document.getElementById("lockOverlayTitle").textContent="Sistem Dikunci",document.getElementById("lockOverlayMessage").textContent="Aplikasi dikunci oleh admin. Silakan coba lagi nanti.",p.style.display="none";else{document.getElementById("lockOverlayTitle").textContent="Aplikasi Ditutup",document.getElementById("lockOverlayMessage").textContent="Aplikasi dapat diakses kembali dalam:",p.style.display="flex";let d=new Date,[u,f]=a.split(":").map(Number),b=new Date;b.setHours(u,f,0,0);let g;d<b?g=b:g=new Date(b.getTime()+1440*60*1e3);let v=()=>{let y=g.getTime()-new Date().getTime();if(y<0){clearInterval(Be),window.location.reload();return}let x=Math.floor(y/(1e3*60*60*24)),_=Math.floor(y%(1e3*60*60*24)/(1e3*60*60)),E=Math.floor(y%(1e3*60*60)/(1e3*60)),I=Math.floor(y%(1e3*60)/1e3);document.getElementById("countdown-days").textContent=String(x).padStart(2,"0"),document.getElementById("countdown-hours").textContent=String(_).padStart(2,"0"),document.getElementById("countdown-minutes").textContent=String(E).padStart(2,"0"),document.getElementById("countdown-seconds").textContent=String(I).padStart(2,"0")};v(),Be=setInterval(v,1e3)}else fe.classList.remove("is-visible"),c(!1);document.getElementById("borrowingHours").textContent=`${a} - ${s}`};var Ct=(e,t="Bukti Pengembalian")=>{let o=document.getElementById("imageViewer"),a=document.getElementById("viewerImage"),s=o.querySelector(".image-viewer__title"),n=o.querySelector(".image-viewer__loading");if(!o||!a)return;s&&(s.textContent=t),a&&(a.classList.remove("loaded"),a.src=""),n&&(n.style.display="flex"),o.style.display="flex";let r=window.innerWidth<=840,l=r?window.innerWidth*.85:600,p=r?window.innerHeight*.7:500;r?(o.style.width=`${l}px`,o.style.height=`${p}px`):(o.style.width="600px",o.style.height="500px"),o.style.left=`${(window.innerWidth-l)/2}px`,o.style.top=`${(window.innerHeight-p)/2}px`,o.classList.remove("is-closing"),o.classList.add("is-visible");let c=new Image;c.onload=()=>{a&&(a.src=e,a.classList.add("loaded")),n&&(n.style.display="none")},c.onerror=()=>{n&&(n.innerHTML='<p style="color: var(--danger-color);">Gagal memuat gambar</p>')},c.src=e},Zo=()=>{let e=document.getElementById("imageViewer");e&&(!e.classList.contains("is-visible")||e.classList.contains("is-closing")||(e.classList.add("is-closing"),e.classList.remove("is-dragging"),setTimeout(()=>{let t=document.getElementById("viewerImage");t&&(t.src="",t.classList.remove("loaded")),e.style.display="none",e.classList.remove("is-closing"),e.classList.remove("is-visible")},300)))},Dt=()=>{let e=document.getElementById("imageViewer");if(!e)return;let t=e.querySelector(".image-viewer__header"),o=e.querySelector(".close-btn"),a=e.querySelector(".image-viewer__resize-handle"),s=!1,n=!1,r,l,p,c,d,u;o?.addEventListener("click",Zo);let f=_=>{if(_.target.closest(".image-viewer__actions")||_.target.closest(".image-viewer__resize-handle"))return;s=!0;let E=_.type.includes("touch")?_.touches[0]:_;E&&(p=E.clientX-e.offsetLeft,c=E.clientY-e.offsetTop,e.style.cursor="grabbing",t&&(t.style.cursor="grabbing"),e.classList.add("is-dragging"))},b=_=>{if(!s)return;_.preventDefault();let E=_.type.includes("touch")?_.touches[0]:_;if(!E)return;r=E.clientX-p,l=E.clientY-c;let I=window.innerWidth-e.offsetWidth,U=window.innerHeight-e.offsetHeight;r=Math.max(0,Math.min(r,I)),l=Math.max(0,Math.min(l,U)),e.style.left=`${r}px`,e.style.top=`${l}px`},g=()=>{s=!1,e.style.cursor="",t&&(t.style.cursor="move"),e.classList.remove("is-dragging")};t?.addEventListener("mousedown",f),document.addEventListener("mousemove",b),document.addEventListener("mouseup",g),t?.addEventListener("touchstart",f,{passive:!1}),document.addEventListener("touchmove",b,{passive:!1}),document.addEventListener("touchend",g);let v=_=>{_.stopPropagation(),n=!0;let E=_.type.includes("touch")?_.touches[0]:_;E&&(p=E.clientX,c=E.clientY,d=e.offsetWidth,u=e.offsetHeight,e.classList.add("is-dragging"),_.type.includes("touch")&&_.preventDefault())},y=_=>{if(!n)return;_.type.includes("touch")&&_.preventDefault();let E=_.type.includes("touch")?_.touches[0]:_;if(!E)return;let I=E.clientX-p,U=E.clientY-c,Z=d+I,R=u+U,ke=window.innerWidth<=840,No=ke?280:300,Go=ke?200:250,Oo=window.innerWidth*.9,Uo=window.innerHeight*.9;Z=Math.max(No,Math.min(Z,Oo)),R=Math.max(Go,Math.min(R,Uo)),e.style.width=`${Z}px`,e.style.height=`${R}px`},x=()=>{n&&(n=!1,e.classList.remove("is-dragging"))};a&&(a.addEventListener("mousedown",v),document.addEventListener("mousemove",y),document.addEventListener("mouseup",x),a.addEventListener("touchstart",v,{passive:!1}),document.addEventListener("touchmove",y,{passive:!1}),document.addEventListener("touchend",x),document.addEventListener("touchcancel",x))};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Dt):Dt();var se=e=>{let t=document.getElementById("importProgressBar"),o=document.getElementById("importProgressText"),a=document.getElementById("importProgressLog"),s=document.getElementById("primaryCloseImportBtn"),n=document.getElementById("import-confirmation-view"),r=document.getElementById("import-progress-view");if(!r||!e)return;["running","complete","error"].includes(e.status)&&(n&&n.style.display!=="none"&&(n.style.display="none"),r&&r.style.display!=="block"&&(r.style.display="block"));let{processed:l=0,total:p=0}=e;if(p>0){let c=l/p*100;t&&(t.style.width=`${c}%`),o&&(o.textContent=`Memproses ${l} dari ${p} baris...`)}else o&&(o.textContent="Mempersiapkan...");if(e.log&&Array.isArray(e.log)&&a&&(a.innerHTML=e.log.map(c=>{let d="",u="\u2022";c.status==="success"?(d="text-success",u="\u2713"):c.status==="error"?(d="text-danger",u="\u2717"):c.status==="warning"&&(d="text-warning",u="!");let f=c.status==="info"?"":`${u} `;return`<div class="${d}">[${c.time}] ${f}${m(c.message)}</div>`}).join(""),a.scrollTop=a.scrollHeight),e.status==="complete"||e.status==="error"){if(e.status==="complete")o&&(o.textContent=`Impor selesai! ${e.success} berhasil, ${e.failed} gagal.`),t&&(t.style.width="100%"),s&&(s.textContent="Selesai");else{o&&(o.textContent="Impor Gagal!");let c=e.message||"Terjadi kesalahan.";a&&!a.innerHTML.includes(c)&&(a.innerHTML+=`<div class="text-danger">[${new Date().toLocaleTimeString("id-ID")}] \u2717 Error: ${m(c)}</div>`),s&&(s.textContent="Tutup")}s&&(s.style.display="inline-flex",s.onclick=async()=>{if(await qt(),e.status==="complete"&&e.success>0){let c=["stock","accounts"].includes(e.import_type)?`#${e.import_type}`:"#history";localStorage.setItem("lastActivePage",c),window.location.reload()}else k()})}},z=(e="stock",t=null)=>{let o,a,s,n,r,l;e==="history"?(o="Impor Riwayat (CSV)",a="Unggah file CSV yang dihasilkan dari fitur <strong>Backup to Google Drive</strong> untuk memulihkan riwayat.",s="Pastikan barang di dalam file CSV sudah ada di stok barang.",n="<strong>Nama Peminjam, Kelas, ..., Link Bukti Google Drive</strong>",r="template_impor_riwayat.csv",l=`Nama Peminjam,Kelas,Mata Pelajaran,Nama Barang,Jenis Alat,Jumlah,Tanggal Pinjam,Tanggal Kembali,Link Bukti Google Drive
John Doe,XI-TKJ 1,Jaringan Dasar,Router Mikrotik,Router,1,2025-10-10 08:00:00,2025-10-10 16:00:00,https://drive.google.com/file/d/xxxxx/view?usp=sharing
,,,,Kabel LAN 5m,Kabel,2,,,https://drive.google.com/file/d/xxxxx/view?usp=sharing`):e==="accounts"?(o="Impor Akun (CSV)",a="Unggah file CSV untuk mengimpor data akun.",s="Pastikan tidak ada NIS yang sama dengan data yang sudah ada.",n="<strong>NIS, Password, Nama, Kelas</strong>",r="template_impor_akun.csv",l=`NIS,Password,Nama,Kelas
12345678,password123,John Doe,XI-TKJ 1
87654321,password456,Jane Smith,XII-TKJ 2`):(o="Impor Barang (CSV)",a="Unggah file CSV untuk menambahkan data barang.",s="Pastikan format file CSV benar.",n="<strong>Nama Barang, Jenis Barang, Jumlah, Link Gambar</strong>",r="template_impor_barang.csv",l=`Nama Barang,Jenis Barang,Jumlah,Link Gambar
Router Cisco,Router,10,https://example.com/router.jpg
Kabel LAN 5m,Kabel,50,https://example.com/cable.jpg`),w(o,`
        <div id="importModalContainer">
            <div id="import-confirmation-view">
                <form id="importCsvForm">
                    <input type="hidden" name="import_type" value="${e}">
                     <div class="form-group">
                        <p>${a}</p>
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
    `);let p=document.getElementById("importCsvForm");if(p){let c=document.getElementById("csvUploader"),d=document.getElementById("csvFile"),u=c.querySelector(".image-uploader__prompt"),f=c.querySelector(".image-uploader__file-info"),b=document.getElementById("csvFileName"),g=document.getElementById("csv-file-error"),v=y=>{if(y&&(y.type==="text/csv"||y.name.toLowerCase().endsWith(".csv"))){let x=new DataTransfer;x.items.add(y),d.files=x.files,b.textContent=y.name,u.style.display="none",f.style.display="flex",g.style.display="none"}else d.value="",u.style.display="flex",f.style.display="none",b.textContent="",y&&B("Harap pilih file dengan format .csv","error")};c.addEventListener("click",()=>d.click()),d.addEventListener("change",()=>v(d.files[0])),c.addEventListener("dragover",y=>{y.preventDefault(),c.classList.add("drag-over")}),c.addEventListener("dragleave",()=>c.classList.remove("drag-over")),c.addEventListener("drop",y=>{y.preventDefault(),c.classList.remove("drag-over"),v(y.dataTransfer.files[0])}),document.getElementById("downloadCsvTemplate").addEventListener("click",y=>{y.preventDefault();let x=new Blob([l],{type:"text/csv;charset=utf-8;"}),_=document.createElement("a");_.href=URL.createObjectURL(x),_.download=r,_.click(),URL.revokeObjectURL(_.href)}),p.addEventListener("submit",y=>{if(y.preventDefault(),!d.files[0]){g.style.display="block";return}y.target.querySelector('button[type="submit"]').disabled=!0,$t(new FormData(p))})}t&&t.status!=="idle"&&(se(t),t.status==="running"&&We())};var Ye=(e,t,o)=>{w(e,`
        <p class="modal-details">${t}</p> <!-- Pesan bisa berisi HTML -->
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="modalConfirmBtn" class="btn btn-danger">Ya</button>
        </div>
    `);let a=document.getElementById("modalConfirmBtn");a&&(a.onclick=()=>{k(),setTimeout(o,50)})};var Ee=()=>{let e=i.session.role==="admin",t=i.session.username||"",o=i.session.login_username||"",a=e?"Username":"Username (NIS)";w("<i class='bx bxs-user-cog'></i> Pengaturan Akun",`
        <form id="accountForm">
            <div class="form-group">
                <label for="accountName">Nama</label>
                <input type="text" id="accountName" name="nama" value="${m(t)}" ${e?"required":"readonly"}>
            </div>
            <div class="form-group">
                <label for="accountUsername">${a}</label>
                <input type="text" id="accountUsername" name="username" value="${m(o)}" ${e?"required":"readonly"}>
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
    `);let s=document.getElementById("accountForm"),n=document.getElementById("accountPassword"),r=document.getElementById("confirmPassword"),l=document.getElementById("updateAccountBtn"),p=document.getElementById("passwordMismatchError"),c=()=>{n.value?n.value!==r.value?(p.style.display="block",l.disabled=!0):(p.style.display="none",l.disabled=!1):(r.value="",p.style.display="none",l.disabled=!1)};n.addEventListener("input",c),r.addEventListener("input",c),c(),s.addEventListener("submit",Ht)};var Qe=()=>{let{startTime:e,endTime:t,isManuallyLocked:o}=i.borrowSettings,a,s,n;o?(a="Buka (Manual)",s="btn-success",n=!1):(a="Kunci (Manual)",s="btn-danger",n=!0),w("Pengaturan Aplikasi",`
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
                <button type="button" id="manualLockBtn" class="btn ${s} btn-block" style="margin: 0.2rem 0;">${a}</button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
            </div>
        </form>
    `),document.getElementById("borrowSettingsForm").addEventListener("submit",r=>{r.preventDefault();let l=new FormData(r.target),p=r.target.querySelector('button[type="submit"]');l.append("action","update_settings"),l.append("csrf_token",S),p.disabled=!0,Xe(l).finally(()=>{p.disabled=!1})}),document.getElementById("manualLockBtn").addEventListener("click",r=>{let l=new FormData;l.append("is_locked",n?"1":"0"),l.append("action","update_settings"),l.append("csrf_token",S),r.target.textContent="Memproses...",r.target.disabled=!0,Xe(l).finally(()=>{})})};function Ze(e=null){let t=!e||e==="Windows",o=e==="Linux";w("Petunjuk Penggunaan",`
        <div class="modal-tabs">
            <button class="modal-tab ${t?"active":""}" data-target="windows-instructions">
                <i class='bx bxl-windows'></i> Windows
            </button>
            <button class="modal-tab ${o?"active":""}" data-target="linux-instructions">
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

        <div class="modal-tab-content ${o?"active":""}" id="linux-instructions">
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
    `);let a=document.getElementById("backToDownloadBtn");a&&a.addEventListener("click",()=>{k(),setTimeout(()=>{Me()},300)});let s=document.getElementById("modalBody"),n=s.querySelectorAll(".modal-tab"),r=s.querySelectorAll(".modal-tab-content");if(n.forEach(l=>{l.addEventListener("click",()=>{n.forEach(d=>d.classList.remove("active")),r.forEach(d=>d.classList.remove("active")),l.classList.add("active");let p=l.dataset.target,c=s.querySelector(`#${p}`);c&&c.classList.add("active")})}),typeof hljs>"u"){let l=document.createElement("script");l.src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js",l.onload=()=>{document.querySelectorAll("#linux-instructions pre code").forEach(c=>{hljs.highlightElement(c)})},document.body.appendChild(l);let p=document.createElement("link");p.rel="stylesheet",p.href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css",document.head.appendChild(p)}else document.querySelectorAll("#linux-instructions pre code").forEach(l=>{hljs.highlightElement(l)})}function Me(){w("Aplikasi Desktop",`
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
    `);let e=document.getElementById("showInstructionsBtn");e&&e.addEventListener("click",()=>{Ze()}),document.querySelectorAll(".desktop-app-download-btn").forEach(t=>{t.addEventListener("click",o=>{let a=o.currentTarget.dataset.os;B(`Mengunduh aplikasi desktop untuk ${a}...`,"success"),setTimeout(()=>{Ze(a)},500)})})}var Pt=e=>{if(!e)return;let t=e.querySelector('input[type="file"]'),o=e.querySelector(".image-uploader__preview"),a=n=>{let r=new FileReader;r.onload=()=>{o.src=r.result,e.classList.add("has-preview")},r.readAsDataURL(n)},s=n=>{if(n.length>0&&n[0].type.startsWith("image/")){let r=new DataTransfer;r.items.add(n[0]),t.files=r.files,a(n[0])}};e.addEventListener("click",()=>t.click()),t.addEventListener("change",()=>s(t.files)),e.addEventListener("dragover",n=>{n.preventDefault(),e.classList.add("drag-over")}),e.addEventListener("dragleave",()=>e.classList.remove("drag-over")),e.addEventListener("drop",n=>{n.preventDefault(),e.classList.remove("drag-over"),s(n.dataTransfer.files)})};var Ae=(e=null)=>{let t=e!==null,o=t?i.items.find(b=>b.id==e):{};if(t&&!o)return;w(t?"Edit Barang":"Barang Baru",`
        <form id="itemForm">
            <input type="hidden" name="id" value="${m(o.id||"")}">
            <input type="hidden" name="classifier" id="classifierValue" value="${m(o.classifier||"")}">
            <div class="form-group">
                <label for="itemName">Nama Barang</label>
                <input type="text" id="itemName" name="name" value="${m(o.name||"")}" required>
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
            <div class="form-group">
                <label for="itemQuantity">Jumlah Total</label>
                <input type="number" id="itemQuantity" name="total_quantity" min="1" value="${m(o.total_quantity||"")}" required>
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
        </form>`);let a=document.getElementById("itemForm"),s=a.querySelector(".hybrid-dropdown"),n=s.querySelector(".hybrid-dropdown__selected"),r=s.querySelector(".hybrid-dropdown__options"),l=s.querySelector(".hybrid-dropdown__placeholder"),p=s.querySelector(".hybrid-dropdown__value"),c=a.querySelector("#classifierValue"),d=()=>s.classList.remove("is-open"),u=b=>{c.value=b,b?(p.textContent=b,p.style.display="block",l.style.display="none"):(p.style.display="none",l.style.display="block"),d()},f=()=>{r.innerHTML="";let b=document.createElement("div");b.className="hybrid-dropdown__option hybrid-dropdown__option--create",b.innerHTML="<i class='bx bx-plus-circle'></i><span>Buat Jenis Baru</span>",b.onclick=g=>{g.stopPropagation(),r.innerHTML=`
                <div class="hybrid-dropdown__new-input-container">
                    <input type="text" placeholder="Contoh: Router, Switch..." class="hybrid-dropdown__new-input">
                    <button type="button" class="btn btn-primary hybrid-dropdown__save-btn"><i class='bx bx-check'></i></button>
                </div>`;let v=r.querySelector(".hybrid-dropdown__new-input"),y=r.querySelector(".hybrid-dropdown__save-btn");v.focus();let x=()=>{let _=v.value.trim();_&&u(_)};v.onkeydown=_=>{_.key==="Enter"&&x()},y.onclick=x},r.appendChild(b),i.classifiers.forEach(g=>{let v=document.createElement("div");v.className="hybrid-dropdown__option",v.textContent=g,v.onclick=()=>u(g),r.appendChild(v)})};n.onclick=()=>{s.classList.contains("is-open")||f(),s.classList.toggle("is-open")},o.classifier&&u(o.classifier),a.addEventListener("submit",Ft),Pt(a.querySelector(".image-uploader")),document.addEventListener("click",function(b){s.contains(b.target)||d()},!0)};var et=e=>{let t=i.items.find(o=>o.id==e);t&&(w("Konfirmasi Hapus",`
        <p class="modal-details">Anda yakin ingin menghapus <strong>${m(t.name)}</strong>?</p>
        <div class="modal-footer"><button type="button" class="btn btn-secondary close-modal-btn">Batal</button><button type="button" id="confirmDeleteBtn" class="btn btn-danger">Ya, Hapus</button></div>`),document.getElementById("confirmDeleteBtn").onclick=()=>jt(e))};var tt=()=>{let e=i.selectedItems;if(e.length===0)return;let t=e.map(r=>i.items.find(l=>l.id==r)).filter(Boolean),o=t.filter(r=>r.current_quantity<r.total_quantity),a=t.map(r=>`<li>${m(r.name)}</li>`).join(""),s,n;o.length>0?(s=`
            <p class="modal-warning-text" style="text-align: left;"><strong>Tidak dapat menghapus.</strong></p>
            <p>Barang berikut sedang dalam status dipinjam:</p>
            <ul style="list-style-position: inside; margin: 1rem 0; background-color: var(--danger-color-light-bg); padding: 1rem; border-radius: var(--border-radius);">${o.map(l=>`<li><strong>${m(l.name)}</strong></li>`).join("")}</ul>
            <p class="modal-details">Kembalikan barang dahulu sebelum menghapusnya.</p>
        `,n='<button type="button" class="btn btn-secondary close-modal-btn">Tutup</button>'):(s=`
            <p class="modal-details">Anda akan menghapus <strong>${e.length} barang</strong> berikut secara permanen?</p>
            <ul style="list-style-position: inside; margin: 1rem 0;">${a}</ul>
            <p class="modal-warning-text" style="text-align: left;">Tindakan ini tidak dapat diurungkan.</p>
        `,n=`
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="confirmDeleteMultipleBtn" class="btn btn-danger">Ya, Hapus</button>
        `),w("Konfirmasi Hapus",`
        ${s}
        <div class="modal-footer">${n}</div>
    `),o.length===0&&(document.getElementById("confirmDeleteMultipleBtn").onclick=()=>Nt(e))};var ye="all",Gt,ea=e=>{let t=document.getElementById("accountFilterOptions");if(!t)return;let o=e.map(s=>`<li data-filter="${m(s)}">${m(s)}</li>`).join(""),a='<li class="filter-divider"></li><li data-filter="admin" class="filter-admin-option">Admin</li>';t.innerHTML='<li data-filter="all">Semua</li>'+o+a},Te=async(e=!1)=>{if(i.isLoadingMoreAccounts)return;if(i.isLoadingMoreAccounts=!0,!e)i.accountPage=1,i.accounts=[];else{i.accountPage++;let o=document.getElementById("accountLoaderContainer");o&&(o.innerHTML='<div class="loading-spinner" style="width:30px;height:30px;border-width:3px;margin:1rem auto;"></div>')}let t=document.getElementById("accountSearch").value;try{let o=new URLSearchParams({action:"get_accounts",page:i.accountPage,search:t,filter:ye}),s=await(await fetch(`${h}?${o.toString()}`)).json();if(s.status==="success"&&s.data){let n=s.data.records||[];i.accounts=e?[...i.accounts,...n]:n,i.hasMoreAccounts=s.data.hasMore,s.data.classes_full&&(i.classes=s.data.classes_full),e||ea(s.data.classes||[]),Ot(e)}else throw new Error(s.message||"Gagal memuat data akun.")}catch(o){B(`Gagal memuat data akun: ${o.message}`,"error"),i.hasMoreAccounts=!1,Ot(e)}finally{i.isLoadingMoreAccounts=!1,J()}},Ot=(e=!1)=>{let t=document.getElementById("accountList"),o=document.getElementById("accountLoaderContainer");if(!t||!o)return;if(e||(t.innerHTML=`
            <div class="account-list-header">
                <div style="text-align: center;">ID Pengguna</div>
                <div>Nama Pengguna</div>
                <div>Kelas</div>
                <div style="text-align: center;">Aksi</div>
            </div>
        `),i.accounts.length===0&&!e){let n="Tidak ada akun yang cocok dengan filter atau pencarian.";t.innerHTML=q("Akun Tidak Ditemukan",n),o.innerHTML="";return}let s=(e?i.accounts.slice(-(i.accounts.length-(i.accountPage-1)*30)):i.accounts).map(n=>{let r=i.selectedAccounts.includes(n.id.toString()),l=n.role==="admin"?n.username||"-":n.nis||"-",p=n.kelas||"-";return`
        <div class="account-list-item ${r?"is-selected":""}" data-account-id="${m(n.id)}">
            <div class="account-item__selection-icon">
                <i class='bx bxs-check-circle'></i>
            </div>
            <div class="account-item__nis" data-label="ID Pengguna:">${m(l)}</div>
            <div class="account-item__name" data-label="Nama:">${m(n.nama)}</div>
            <div class="account-item__class" data-label="Kelas:">${m(p)}</div>
            <div class="account-item__actions">
                <button class="btn btn-secondary action-btn edit-account-btn" title="Edit Akun">
                    <i class='bx bx-key'></i>
                </button>
                <button class="btn btn-danger action-btn delete-account-btn" title="Hapus Akun">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        </div>
    `}).join("");t.insertAdjacentHTML("beforeend",s),i.hasMoreAccounts?(o.innerHTML='<button id="loadMoreAccountsBtn" class="btn btn-primary">Selengkapnya</button>',document.getElementById("loadMoreAccountsBtn").onclick=()=>Te(!0)):o.innerHTML='<p class="end-of-list">Semua data telah ditampilkan.</p>',ta()},ta=()=>{document.querySelectorAll(".account-list-item:not(.listener-attached)").forEach(e=>{e.classList.add("listener-attached"),e.addEventListener("click",a=>{if(a.target.closest(".action-btn"))return;let s=e.dataset.accountId;if(!s)return;e.classList.toggle("is-selected");let n=i.selectedAccounts.indexOf(s);n>-1?i.selectedAccounts.splice(n,1):i.selectedAccounts.push(s),J()});let t=e.querySelector(".edit-account-btn");t&&t.addEventListener("click",()=>{let a=e.dataset.accountId,s=i.accounts.find(n=>n.id==a);s&&ot(s)});let o=e.querySelector(".delete-account-btn");o&&o.addEventListener("click",()=>{let a=e.dataset.accountId,s=i.accounts.find(n=>n.id==a);s&&at(s)})})},oa=()=>{let e=document.getElementById("accountSearch"),t=document.getElementById("accountFilterBtn"),o=document.getElementById("accountFilterOptions");e?.addEventListener("input",()=>{clearTimeout(Gt),Gt=setTimeout(()=>{Te(!1)},300)}),t?.addEventListener("click",()=>o.classList.toggle("show")),o?.addEventListener("click",a=>{if(a.target.tagName==="LI"&&!a.target.classList.contains("filter-divider")){ye=a.target.dataset.filter,t.innerHTML=`<i class='bx bx-filter-alt'></i> ${a.target.textContent}`;let s="filter-all";ye==="admin"?s="filter-admin":ye!=="all"&&(s="filter-available"),t.className=`btn ${s}`,o.classList.remove("show"),Te(!1)}})},De=async e=>{e.preventDefault();let t=e.target,o=t.querySelector('button[type="submit"]'),a=new FormData(t),s=!!a.get("id");a.append("action",s?"edit_account":"add_account"),a.append("csrf_token",S),o.disabled=!0;try{let n=await fetch(h,{method:"POST",body:a});(await M(n)).status==="success"&&(k(),await ve())}catch{B("Gagal memproses permintaan.","error")}finally{o&&(o.disabled=!1)}},Ut=async e=>{let t=new FormData;t.append("action","delete_account"),t.append("id",e),t.append("csrf_token",S);try{let o=await fetch(h,{method:"POST",body:t});(await M(o)).status==="success"&&await ve()}catch{B("Gagal menghapus akun.","error")}finally{k()}},Rt=async e=>{let t=new FormData;t.append("action","delete_multiple_accounts"),t.append("csrf_token",S),e.forEach(o=>t.append("ids[]",o));try{let o=await fetch(h,{method:"POST",body:t});(await M(o)).status==="success"&&(i.selectedAccounts=[],await ve())}catch{B("Gagal menghapus beberapa akun.","error")}finally{k()}},Kt=()=>{let e=i.accounts.map(a=>a.id.toString());if(e.length>0&&e.every(a=>i.selectedAccounts.includes(a)))i.selectedAccounts=i.selectedAccounts.filter(a=>!e.includes(a));else{let a=new Set([...i.selectedAccounts,...e]);i.selectedAccounts=Array.from(a)}let o=document.getElementById("accountList");o&&(o.querySelectorAll(".account-list-item").forEach(a=>{let s=a.dataset.accountId,n=i.selectedAccounts.includes(s);a.classList.toggle("is-selected",n)}),J())},ve=async()=>{ye="all",i.selectedAccounts=[];let e=document.getElementById("accountFilterBtn");e&&(e.innerHTML="<i class='bx bx-filter-alt'></i> Semua",e.className="btn filter-all");let t=document.getElementById("accountSearch");t&&(t.value=""),await Te(!1)};oa();var ne=(e,t)=>{let o=t.querySelector(".nis-field"),a=t.querySelector(".kelas-field"),s=t.querySelector(".username-field"),n=o?.querySelector("input"),r=a?.querySelector('input[type="hidden"]'),l=s?.querySelector("input");e==="admin"?(o&&(o.style.display="none"),a&&(a.style.display="none"),s&&(s.style.display="block"),n&&(n.required=!1),r&&(r.required=!1),l&&(l.required=!0)):(o&&(o.style.display="block"),a&&(a.style.display="block"),s&&(s.style.display="none"),n&&(n.required=!0),r&&(r.required=!0),l&&(l.required=!1))};var st=()=>{w("Tambah Akun Baru",`
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
    `);let e=document.getElementById("accountForm");W(e,o=>{ne(o,e)}),he(document.getElementById("class-hybrid-dropdown"));let t=e.querySelector("#accountRole").value;ne(t,e),e.addEventListener("submit",De)};var ot=e=>{w("Edit Akun",`
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
    `);let t=document.getElementById("accountForm");W(t,o=>{ne(o,t)}),he(document.getElementById("class-hybrid-dropdown")),ne(e.role,t),t.addEventListener("submit",De)};var at=e=>{w("Konfirmasi Hapus Akun",`
        <p class="modal-details">Anda yakin ingin menghapus akun:</p>
        <p><strong>${m(e.nama)} (${m(e.role==="admin"?e.username:e.nis)})</strong></p>
        <p class="modal-warning-text" style="text-align: left; margin-top: 1rem;">Tindakan ini tidak dapat diurungkan.</p>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="confirmDeleteAccountBtn" class="btn btn-danger">Ya, Hapus</button>
        </div>
    `),document.getElementById("confirmDeleteAccountBtn").onclick=()=>Ut(e.id)};var nt=()=>{let e=i.selectedAccounts;e.length!==0&&(w("Konfirmasi Hapus Akun",`
        <p class="modal-details">Anda yakin ingin menghapus <strong>${e.length} akun</strong> yang dipilih secara permanen?</p>
        <p class="modal-warning-text" style="text-align: left; margin-top: 1rem;">Tindakan ini tidak dapat diurungkan.</p>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="confirmDeleteMultipleAccountsBtn" class="btn btn-danger">Ya, Hapus</button>
        </div>
    `),document.getElementById("confirmDeleteMultipleAccountsBtn").onclick=()=>Rt(e))};var Vt=()=>/Mobi|Android|iPhone/i.test(navigator.userAgent),Jt=(e,t,o)=>{if(!("mediaDevices"in navigator&&"getUserMedia"in navigator.mediaDevices)){console.warn("Camera API not supported, falling back to gallery input."),t&&t.click();return}let a=document.createElement("div");a.className="camera-overlay",a.innerHTML=`
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
    `,document.body.appendChild(a);let s=document.getElementById("cameraFeed"),n=document.getElementById("cameraCanvas"),r=a.querySelector(".camera-capture-btn"),l=a.querySelector(".camera-cancel-btn"),p=document.getElementById("cameraSelectList"),c=null,d=[],u=()=>{c&&c.getTracks().forEach(b=>b.stop()),document.body.contains(a)&&document.body.removeChild(a)},f=async b=>{c&&c.getTracks().forEach(v=>v.stop());let g={audio:!1,video:{facingMode:"user"}};b&&(g.video={deviceId:{exact:b}});try{if(c=await navigator.mediaDevices.getUserMedia(g),s.srcObject=c,d.length===0&&(await new Promise(y=>setTimeout(y,200)),d=(await navigator.mediaDevices.enumerateDevices()).filter(y=>y.kind==="videoinput"),d.length>=1)){let x=c.getVideoTracks()[0].getSettings().deviceId;p.innerHTML="",d.forEach((_,E)=>{let I=document.createElement("option");I.value=_.deviceId,I.text=_.label||`Kamera ${E+1}`,_.deviceId===x&&(I.selected=!0),p.appendChild(I)}),p.style.display="block"}}catch{B("Gagal mengakses kamera. Silakan gunakan unggah dari galeri.","error"),u(),t&&t.click()}};p.addEventListener("change",()=>{f(p.value)}),f(null),l.onclick=u,a.onclick=b=>{b.target===a&&u()},r.onclick=()=>{if(!c)return;n.width=s.videoWidth,n.height=s.videoHeight;let b=n.getContext("2d");b.translate(n.width,0),b.scale(-1,1),b.drawImage(s,0,0,n.width,n.height),n.toBlob(g=>{let v=`capture_${new Date().toISOString()}.jpg`,y=new File([g],v,{type:"image/jpeg",lastModified:Date.now()});t&&(t.value="");let x=new DataTransfer;x.items.add(y),e.files=x.files,o(y),u()},"image/jpeg",.9)}};var rt=e=>{let t=i.borrowals.filter(f=>f.transaction_id===e);if(t.length===0)return;let o=t[0],a=t.map(f=>`<li><strong>${m(f.quantity)}x</strong> ${m(f.item_name)}</li>`).join("");w("Pengembalian",`
        <form id="returnForm">
            <input type="hidden" name="transaction_id" value="${e}">
            <p>Konfirmasi pengembalian dari <strong>${m(o.borrower_name)}</strong> (${m(o.borrower_class)}):</p>
            <ul style="list-style-position: inside; margin: 1rem 0;">${a}</ul>
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
        </form>`);let s=document.getElementById("returnForm"),n=document.getElementById("returnProofGallery"),r=document.getElementById("returnProofCamera"),l=s.querySelector(".image-uploader"),p=s.querySelector(".image-uploader__preview"),c=document.getElementById("takePictureBtn"),d=document.getElementById("file-error"),u=f=>{if(!f)return;let b=new FileReader;b.onload=()=>{p.src=b.result,l.classList.add("has-preview"),d.style.display="none"},b.readAsDataURL(f)};l.addEventListener("click",()=>n.click()),l.addEventListener("dragover",f=>{f.preventDefault(),l.classList.add("drag-over")}),l.addEventListener("dragleave",()=>l.classList.remove("drag-over")),l.addEventListener("drop",f=>{f.preventDefault(),l.classList.remove("drag-over"),f.dataTransfer.files.length>0&&(r.value="",n.files=f.dataTransfer.files,u(n.files[0]))}),Vt()?c.addEventListener("click",()=>r.click()):c.addEventListener("click",()=>{Jt(r,n,u)}),n.addEventListener("change",()=>{n.files.length>0&&(r.value="",u(n.files[0]))}),r.addEventListener("change",()=>{r.files.length>0&&(n.value="",u(r.files[0]))}),s.addEventListener("submit",f=>{if(f.preventDefault(),n.files.length===0&&r.files.length===0){d.style.display="block";return}n.files.length>0?r.disabled=!0:n.disabled=!0,zt(f).finally(()=>{r.disabled=!1,n.disabled=!1})})};var it=e=>{let t=i.borrowals.filter(c=>c.transaction_id===e);if(t.length===0)return;let o=t[0],a=t.map(c=>`
        <li class="transaction-group__item" style="padding: 0.75rem 0;">
            <img src="${m(c.image_url||"https://placehold.co/50x50/8ab4f8/ffffff?text=?")}" alt="${m(c.item_name)}" class="transaction-group__item-img">
            <div class="transaction-group__item-details">
                <div class="transaction-group__item-name">${m(c.item_name)}</div>
                <div class="transaction-group__item-qty">Jumlah: ${m(c.quantity)} pcs</div>
            </div>
        </li>
    `).join("");w("Tambah Alat",`
        <div class="form-group">
            <label>Peminjam</label>
            <input type="text" value="${m(o.borrower_name)} (${m(o.borrower_class)})" readonly>
        </div>
        <div class="form-group">
            <label>Sudah Dipinjam</label>
            <ul class="transaction-group__items" style="max-height: 150px; overflow-y: auto; padding: 1rem; background-color: var(--secondary-color); border-radius: var(--border-radius);">${a}</ul>
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
    `);let s=document.getElementById("newItemsContainer"),n=0,r=()=>{let c=Array.from(s.querySelectorAll('input[name="item_id"]')).map(f=>f.value).filter(Boolean),d=t.map(f=>f.item_id.toString()),u=[...c,...d];s.querySelectorAll(".custom-dropdown").forEach(f=>{let b=f.querySelector('input[name="item_id"]').value;f.querySelectorAll(".custom-dropdown__option").forEach(g=>{let v=u.includes(g.dataset.value)&&g.dataset.value!==b;g.setAttribute("aria-disabled",v)})})},l=()=>{let c=s.querySelectorAll(".borrow-item-row");if(c.forEach(d=>{let u=d.querySelector(".remove-last-item-btn");u&&u.remove()}),c.length>1){let d=c[c.length-1],u=document.createElement("button");u.type="button",u.className="btn btn-secondary remove-last-item-btn",u.title="Hapus alat terakhir",u.innerHTML="<i class='bx bx-chevron-up'></i>",u.onclick=()=>{d.remove(),r(),l()},d.appendChild(u)}},p=()=>{n++;let c=`new-item-row-${n}`,d=document.createElement("div");d.className="borrow-item-row",d.id=c;let f=i.items.filter(y=>y.current_quantity>0).map(y=>`
            <div class="custom-dropdown__option" data-value="${y.id}" data-max="${y.current_quantity}" data-display="<img src='${y.image_url||"https://placehold.co/40x40/8ab4f8/ffffff?text=?"}' alt='${y.name}'><span>${y.name}</span>">
                <img src="${y.image_url||"https://placehold.co/40x40/8ab4f8/ffffff?text=?"}" alt="${y.name}" class="custom-dropdown__option-img">
                <div class="custom-dropdown__option-info">
                    <span class="custom-dropdown__option-name">${y.name}</span>
                    <span class="custom-dropdown__option-qty">Sisa: ${y.current_quantity}</span>
                </div>
            </div>`).join("");d.innerHTML=`
            <div class="form-group borrow-item-row__item">
                <div class="custom-dropdown">
                    <input type="hidden" name="item_id" required>
                    <button type="button" class="custom-dropdown__selected">
                        <span class="custom-dropdown__placeholder">Pilih Alat</span>
                        <div class="custom-dropdown__value"></div>
                        <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                    </button>
                    <div class="custom-dropdown__options">${f}</div>
                </div>
            </div>
            <div class="form-group borrow-item-row__quantity">
                <input type="number" id="quantity-new-${n}" name="quantity" min="1" value="1" required>
                <small class="form-text max-quantity-hint"></small>
            </div>
        `;let b=d.querySelector(".custom-dropdown"),g=d.querySelector('input[type="number"]'),v=d.querySelector(".max-quantity-hint");b.querySelectorAll(".custom-dropdown__option").forEach(y=>{y.addEventListener("click",()=>{if(y.getAttribute("aria-disabled")==="true")return;let x=b.querySelector('input[type="hidden"]');x.value=y.dataset.value;let _=b.querySelector(".custom-dropdown__value");_.innerHTML=y.dataset.display,_.style.display="flex",b.querySelector(".custom-dropdown__placeholder").style.display="none",b.classList.remove("is-open"),g.max=y.dataset.max,parseInt(g.value)>parseInt(y.dataset.max)&&(g.value=1),v.textContent=`Maks: ${y.dataset.max}`,r()})}),s.appendChild(d),r(),l()};p(),document.getElementById("addNewItemBtn").addEventListener("click",p),document.getElementById("addItemForm").addEventListener("submit",Wt)};var lt=e=>{let t=i.borrowals.find(b=>b.id==e);if(!t)return;let a=i.items.filter(b=>b.current_quantity>0||b.id==t.item_id).map(b=>{let g=b.id==t.item_id?b.current_quantity+t.quantity:b.current_quantity,v=m(b.image_url||"[https://placehold.co/40x40/8ab4f8/ffffff?text=](https://placehold.co/40x40/8ab4f8/ffffff?text=)?"),y=m(b.name);return`
        <div class="custom-dropdown__option" data-value="${m(b.id)}" data-max="${m(g)}" data-display="<img src='${v}' alt='${y}'><span>${y}</span>">
            <img src="${v}" alt="${y}" class="custom-dropdown__option-img">
            <div class="custom-dropdown__option-info">
                <span class="custom-dropdown__option-name">${y}</span>
                <span class="custom-dropdown__option-qty">Sisa: ${m(b.current_quantity)}</span>
            </div>
        </div>`}).join(""),s=i.items.find(b=>b.id==t.item_id),n=s?s.current_quantity+t.quantity:t.quantity,r=s?`<img src='${m(s.image_url||"https://placehold.co/40x40/8ab4f8/ffffff?text=?")}' alt='${m(s.name)}'><span>${m(s.name)}</span>`:"<span>Barang tidak ditemukan</span>";w("Ubah Peminjaman",`
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
                        <div class="custom-dropdown__value" style="display: flex;">${r}</div>
                        <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                    </button>
                    <div class="custom-dropdown__options">${a}</div>
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
    `);let l=document.getElementById("editItemDropdown"),p=l.querySelector(".custom-dropdown__options"),c=l.querySelector(".custom-dropdown__value"),d=l.querySelector('input[name="new_item_id"]'),u=document.getElementById("newQuantity"),f=document.querySelector(".max-quantity-hint");p.addEventListener("click",b=>{let g=b.target.closest(".custom-dropdown__option");if(!g)return;let v=parseInt(g.dataset.max);d.value=g.dataset.value,c.innerHTML=g.dataset.display,l.classList.remove("is-open"),u.max=v,(parseInt(u.value)>v||u.value<1)&&(u.value=v>0?1:0),f.textContent=`Maksimal pinjam: ${v}`}),document.getElementById("editBorrowalForm").addEventListener("submit",Yt)};var ct=e=>{let t=i.borrowals.find(o=>o.id==e);t&&(w("Konfirmasi Hapus",`
        <p class="modal-warning-text" style="text-align: left; margin-top: 1rem;"><strong>PERINGATAN:</strong> Stok barang akan dikembalikan. Tindakan ini tidak dapat diurungkan.</p>
        <p class="modal-details">Anda yakin ingin menghapus item peminjaman:</p>
        <p class="modal-details"><strong>${m(t.item_name)} (${m(t.quantity)} pcs)</strong> oleh <strong>${m(t.borrower_name)}</strong>?</p>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="confirmDeleteBorrowalBtn" class="btn btn-danger">Ya, Hapus</button>
        </div>`),document.getElementById("confirmDeleteBorrowalBtn").onclick=()=>Xt(e))};var dt=e=>{let t=i.history.find(o=>o.id==e);t&&(w("Konfirmasi Hapus",`
        <p class="modal-details">Anda yakin ingin menghapus riwayat peminjaman:</p>
        <p class="modal-details"><strong>${m(t.item_name)}</strong> oleh <strong>${m(t.borrower_name)}</strong> <span style="font-weight: bold; color: var(--danger-color);">secara permanen?</span></p>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="confirmDeleteHistoryBtn" class="btn btn-danger">Ya, Hapus</button>
        </div>`),document.getElementById("confirmDeleteHistoryBtn").onclick=()=>Qt(e))};var re=async()=>{w("Bersihkan Riwayat",`
        <form id="flushHistoryForm">
            <p class="modal-warning-text" style="text-align: left;"><strong>PERINGATAN:</strong> Tindakan ini akan menghapus semua riwayat dan file bukti secara permanen.</p>
            <div class="captcha-container"><p>Masukkan teks pada gambar di bawah ini:</p><div id="captchaImageContainer"><p>Memuat...</p></div></div>
            <div class="form-group"><input type="text" id="captchaInput" name="captcha" placeholder="Masukkan captcha" autocomplete="off" required></div>
            <div class="modal-footer"><button type="button" class="btn btn-secondary close-modal-btn">Batal</button><button type="submit" class="btn btn-danger">Hapus Semua</button></div>
        </form>`);try{let t=await(await fetch(`${h}?action=get_captcha`)).json(),o=document.getElementById("captchaImageContainer");o.innerHTML=t.status==="success"?`<img src="${t.data.image}" alt="Captcha" style="cursor:pointer;">`:'<p class="text-danger">Gagal memuat captcha.</p>',t.status==="success"&&(o.firstElementChild.onclick=re)}catch{document.getElementById("captchaImageContainer").innerHTML='<p class="text-danger">Gagal terhubung ke server.</p>'}document.getElementById("flushHistoryForm").addEventListener("submit",Zt)};var ut=()=>{if(i.classifiers.length===0){B("Tidak ada jenis barang yang tersedia untuk difilter.","error");return}let e=i.classifiers.map(o=>`
        <div class="form-check classifier-filter-item" style="margin-bottom: 0.75rem;">
            <input class="form-check-input classifier-filter-input" type="radio" name="classifierFilter" id="classifier-${m(o)}" value="${m(o)}" ${i.currentClassifierFilter===o?"checked":""}>
            <label class="form-check-label classifier-filter-label" for="classifier-${m(o)}">
                ${m(o)}
            </label>
        </div>
    `).join("");w("Filter Jenis Barang",`
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
    `);let t=document.getElementById("classifierFilterForm");t.addEventListener("submit",o=>{o.preventDefault();let a=t.querySelector('input[name="classifierFilter"]:checked');a?(i.currentClassifierFilter=a.value,i.currentStockFilter="classifier",G(),Y(),k()):B("Pilih salah satu jenis barang.","error")})};var pt=()=>{let e=i.selectedDate?new Date(i.selectedDate):new Date,t=i.selectedDate?new Date(i.selectedDate):null,o=()=>{let a=e.getFullYear(),s=e.getMonth(),n=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],r=["Min","Sen","Sel","Rab","Kam","Jum","Sab"],l=n.map((g,v)=>`<option value="${v}" ${v===s?"selected":""}>${g}</option>`).join(""),p=new Date().getFullYear(),c="";for(let g=p-5;g<=p+5;g++)c+=`<option value="${g}" ${g===a?"selected":""}>${g}</option>`;let d=new Date(a,s,1).getDay(),u=new Date(a,s+1,0).getDate(),f=new Date,b="";for(let g=0;g<d;g++)b+='<div class="calendar-day is-empty"></div>';for(let g=1;g<=u;g++){let v=new Date(a,s,g),y="calendar-day";A(v)===A(f)&&(y+=" is-today"),t&&A(v)===A(t)&&(y+=" is-selected"),b+=`<div class="${y}" data-date="${v.toISOString()}">${g}</div>`}w("Filter Tanggal",`
            <div class="calendar-container">
                <div class="calendar-header">
                    <button class="calendar-header__nav" id="cal-prev"><i class='bx bx-chevron-left'></i></button>
                    <div class="calendar-header__title">
                        <select id="month-select" class="calendar-select">${l}</select>
                        <select id="year-select" class="calendar-select">${c}</select>
                    </div>
                    <button class="calendar-header__nav" id="cal-next"><i class='bx bx-chevron-right'></i></button>
                </div>
                <div class="calendar-grid">
                    ${r.map(g=>`<div class="calendar-weekday">${g}</div>`).join("")}
                    ${b}
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
                <button type="button" class="btn btn-primary" id="applyDateFilterBtn">Terapkan</button>
            </div>
        `),document.getElementById("cal-prev").onclick=()=>{e.setMonth(s-1),o()},document.getElementById("cal-next").onclick=()=>{e.setMonth(s+1),o()},document.getElementById("month-select").onchange=g=>{e.setMonth(parseInt(g.target.value)),o()},document.getElementById("year-select").onchange=g=>{e.setFullYear(parseInt(g.target.value)),o()},document.querySelectorAll(".calendar-day:not(.is-empty)").forEach(g=>{g.onclick=()=>{t=new Date(g.dataset.date),o()}}),document.getElementById("applyDateFilterBtn").onclick=()=>{i.selectedDate=t,be(),k();let g=document.querySelector(".page.active")?.id;g==="history"?C():g==="return"&&ie()}};o()};var mt=()=>{w("Konfirmasi Ekspor",`
        <p class="modal-details">Anda yakin ingin mengekspor seluruh riwayat peminjaman ke dalam file CSV?</p>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
            <button type="button" id="confirmExportBtn" class="btn btn-success">Ya, Ekspor</button>
        </div>
    `),document.getElementById("confirmExportBtn").onclick=()=>{window.location.href=`${h}?action=export_history`,k()}};var $=e=>{let t=document.getElementById("exportProgressBar"),o=document.getElementById("exportProgressText"),a=document.getElementById("exportProgressLog"),s=document.getElementById("startExportBtn"),n=document.getElementById("primaryCloseExportBtn"),r=document.querySelector("#exportModalContainer .close-modal-btn"),l=document.getElementById("export-confirmation-view"),p=document.getElementById("export-progress-view");if(!p||!e)return;(e.status==="running"||e.status==="finalizing"||e.status==="complete"||e.status==="error")&&(l&&(l.style.display="none"),p&&(p.style.display="block"),s&&(s.style.display="none"),r&&(r.style.display="none"));let{processed:c=0,total:d=0}=e;if(e.export_type==="accounts"&&["running","finalizing"].includes(e.status))t.style.width="50%",o.textContent="Membuat file CSV...";else if(d>0){let f=c/d*100;t.style.width=`${f}%`,o.textContent=`Memproses ${c} dari ${d} gambar...`}else o.textContent="Mempersiapkan...";if(e.log&&Array.isArray(e.log)&&(a.innerHTML=e.log.map(f=>{let b=f.status==="success"?"text-success":f.status==="error"?"text-danger":"",g=f.status==="success"?"\u2713":f.status==="error"?"\u2717":"\u2022",v=f.status==="info"?"":`${g} `;return`<div class="${b}">[${f.time}] ${v}${m(f.message)}</div>`}).join(""),a.scrollTop=a.scrollHeight),e.status==="complete"||e.status==="error"){if(e.status==="complete")o.textContent="Proses ekspor selesai!",t.style.width="100%",e.csv_url&&!a.querySelector('a[href="'+e.csv_url+'"]')&&(a.innerHTML+=`<div><a href="${m(e.csv_url)}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Lihat File CSV di Google Drive</a></div>`),n.textContent="Selesai";else{o.textContent="Ekspor Gagal!";let f=e.message||"Terjadi kesalahan tidak diketahui.",b=`<div class="text-danger" style="margin-top: 1rem; font-weight: bold;">[${new Date().toLocaleTimeString("id-ID")}] \u2717 Error: ${m(f)}</div>`;a.innerHTML.includes(f)||(a.innerHTML+=b),n.textContent="Tutup"}a.scrollTop=a.scrollHeight,n.style.display="inline-flex",n.onclick=async()=>{await eo(),k()}}};var Ce=(e=null)=>{w("Ekspor Stok ke Google Drive",`
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
    `),document.querySelector("#exportModalContainer .close-modal-btn").onclick=k,document.getElementById("startExportBtn").onclick=t=>{t.target.disabled=!0,to()},e&&e.status!=="idle"&&($(e),e.status==="running"&&le())};var $e=(e=null)=>{w("Ekspor Akun ke Google Drive",`
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
    `),document.querySelector("#exportModalContainer .close-modal-btn").onclick=k,document.getElementById("startExportBtn").onclick=t=>{t.target.disabled=!0,oo()},e&&e.status!=="idle"&&($(e),(e.status==="running"||e.status==="finalizing")&&le())};var X=e=>{let t=document.getElementById("backupProgressBar"),o=document.getElementById("backupProgressText"),a=document.getElementById("backupProgressLog"),s=document.getElementById("startBackupBtn"),n=document.getElementById("primaryCloseBackupBtn"),r=document.querySelector("#backupModalContainer .close-modal-btn"),l=document.getElementById("backup-confirmation-view"),p=document.getElementById("backup-progress-view");if(!p||!e)return;(e.status==="running"||e.status==="finalizing"||e.status==="complete"||e.status==="error")&&(l&&(l.style.display="none"),p&&(p.style.display="block"),s&&(s.style.display="none"),r&&(r.style.display="none"));let{processed:c=0,total:d=0}=e;if(d>0){let u=c/d*100;t.style.width=`${u}%`,o.textContent=`Memproses ${c} dari ${d} file...`}else o.textContent="Mempersiapkan...";if(e.log&&Array.isArray(e.log)&&(a.innerHTML=e.log.map(u=>{let f=u.status==="success"?"text-success":u.status==="error"?"text-danger":"",b=u.status==="success"?"\u2713":u.status==="error"?"\u2717":"\u2022",g=u.status==="info"?"":`${b} `;return`<div class="${f}">[${u.time}] ${g}${m(u.message)}</div>`}).join(""),a.scrollTop=a.scrollHeight),e.status==="complete"||e.status==="error"){if(e.status==="complete")o.textContent="Proses backup selesai!",t.style.width="100%",e.csv_url&&!a.querySelector('a[href="'+e.csv_url+'"]')&&(a.innerHTML+=`<div><a href="${m(e.csv_url)}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Lihat File CSV di Google Drive</a></div>`),n.textContent="Selesai";else{o.textContent="Backup Gagal!";let u=e.message||"Terjadi kesalahan tidak diketahui.",f=`<div class="text-danger" style="margin-top: 1rem; font-weight: bold;">[${new Date().toLocaleTimeString("id-ID")}] \u2717 Error: ${m(u)}</div>`;a.innerHTML.includes(u)||(a.innerHTML+=f),n.textContent="Tutup"}a.scrollTop=a.scrollHeight,n.style.display="inline-flex",n.onclick=async()=>{await so(),k()}}},qe=(e=null)=>{w("Backup Riwayat ke Google Drive",`
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
    `),document.querySelector("#backupModalContainer .close-modal-btn").onclick=k;let t=document.getElementById("startBackupBtn");t.onclick=o=>{o.target.disabled=!0,ao()},e&&e.status!=="idle"&&(X(e),e.status==="running"&&ft())};var ce=async(e,t,o)=>{try{let a=await fetch(`${h}?action=${e}&_=${new Date().getTime()}`);if(a.status===429){setTimeout(()=>ce(e,t,o),1e3);return}let s=await a.json();if(s.status==="error"&&!s.jobs){t({status:"error",message:s.message});return}if(t(s),s.status==="running"||s.status==="finalizing"){let n=s.status==="finalizing"||o==="import"?200:100;setTimeout(()=>ce(e,t,o),n)}}catch(a){L(a,`Gagal memproses antrian ${o}.`),t({status:"error",message:`Koneksi ke server ${o} terputus.`})}},no=(e,t,o=2e3)=>{let a=null,s=!1,n=async()=>{if(!s)try{let r=await e();if(s)return;t(r),(r.status==="running"||r.status==="pending")&&(a=setTimeout(n,o))}catch(r){console.error("Polling status gagal:",r),s||(a=setTimeout(n,o*2))}};return{start:()=>{a||(s=!1,n())},stop:()=>{a&&(clearTimeout(a),a=null),s=!0}}};var D=null,gt=e=>{let t=document.getElementById("autoBackupProgressBar"),o=document.getElementById("autoBackupProgressText"),a=document.getElementById("autoBackupProgressLog"),s=document.getElementById("primaryCloseAutoBackupBtn"),n=document.getElementById("autobackup-config-view"),r=document.getElementById("autobackup-progress-view");if(!(!r||!e))if((e.status==="running"||e.status==="complete"||e.status==="error"||e.status==="pending")&&(n&&n.classList.add("is-hidden"),r&&r.classList.remove("is-hidden")),e.log&&Array.isArray(e.log)&&a&&(a.innerHTML=e.log.map(l=>{let p=l.status==="success"?"text-success":l.status==="error"?"text-danger":"",c=l.status==="success"?"\u2713":l.status==="error"?"\u2717":"\u2022",d=l.status==="info"?"":`${c} `,u=l.message,f="";if(l.status==="success"&&u.startsWith("Backup Selesai! URL: ")){let b=u.substring(u.indexOf("URL: ")+5);f=`${m("Backup Selesai!")} <a href="${m(b)}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Lihat di Google Drive</a>`}else f=m(u);return`<div class="${p}">[${l.time}] ${d}${f}</div>`}).join(""),a.scrollTop=a.scrollHeight),e.status==="running"||e.status==="pending"){let l=e.log&&e.log.length>0?e.log[e.log.length-1].message:"Memulai...";o&&(o.textContent=l),t&&(t.style.width="50%")}else(e.status==="complete"||e.status==="error")&&(D&&(D.stop(),D=null),e.status==="complete"?(o&&(o.textContent="Auto-Backup Selesai!"),t&&(t.style.width="100%"),s&&(s.textContent="Selesai")):(o&&(o.textContent="Auto-Backup Gagal!"),s&&(s.textContent="Tutup")),s&&(s.style.display="inline-flex",s.onclick=async()=>{D&&(D.stop(),D=null),await lo(),k()}))},we=async(e=null)=>{if(D&&(D.stop(),D=null),e)w("Auto Backup",`
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
		`),gt(e),(e.status==="running"||e.status==="pending")&&(D=no(de,gt,2e3),D.start());else{let o=(await ro()).data||{},a=o.autobackup_enabled=="1",s=o.autobackup_frequency||"daily",n=o.autobackup_day||"1";w("Auto Backup",`
			<form id="autoBackupConfigForm">
				<div id="autobackup-config-view">
                    
					<div class="form-group form-group--toggle">
						<label for="autobackup_enabled">Aktifkan Auto-Backup</label>
						<div class="toggle-switch">
							<input type="checkbox" id="autobackup_enabled" name="autobackup_enabled" value="1" ${a?"checked":""}>
							<label for="autobackup_enabled"></label>
						</div>
					</div>

					<div id="autobackup_scheduler_fields" class="${a?"":"is-hidden"}">
						
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
                                    ${[...Array(31).keys()].map(g=>`
                                        <div class="custom-dropdown__option" data-value="${g+1}" data-display="<span>Tanggal ${g+1}</span>">
                                            <span class="custom-dropdown__option-name">Tanggal ${g+1}</span>
                                        </div>
                                    `).join("")}
                                </div>
                            </div>
						</div>

						<div class="form-group">
							<label for="autobackup_time">Waktu Backup (WIB)</label>
							<input type="time" id="autobackup_time" name="autobackup_time" value="${o.autobackup_time||"03:00"}" class="form-group input">
							<small class="form-text">Gunakan format 24 jam.</small>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary close-modal-btn">Batal</button>
					<button type="submit" class="btn btn-primary">Simpan</button>
				</div>
			</form>
		`);let r=document.getElementById("autoBackupConfigForm"),l=document.getElementById("autobackup_scheduler_fields"),p=document.getElementById("autobackup_enabled"),c=r.querySelector('input[name="autobackup_frequency"]'),d=r.querySelector(".autobackup_day_weekly_field"),u=r.querySelector(".autobackup_day_monthly_field"),f=g=>{d.classList.toggle("is-hidden",g!=="weekly"),u.classList.toggle("is-hidden",g!=="monthly")};p.addEventListener("change",()=>{l.classList.toggle("is-hidden",!p.checked)}),W(r,g=>{let v=r.querySelector('input[name="autobackup_frequency"]');v&&g===v.value&&f(g)});let b=c.closest(".custom-dropdown");b&&b.querySelector(".custom-dropdown__options").addEventListener("click",g=>{let v=g.target.closest(".custom-dropdown__option");v&&v.dataset.value&&f(v.dataset.value)}),f(c.value),r.addEventListener("submit",async g=>{g.preventDefault();let v=new FormData(r);p.checked||v.set("autobackup_enabled","0");let y=v.get("autobackup_frequency");y==="weekly"?v.set("autobackup_day",r.querySelector('input[name="autobackup_day_weekly"]').value):y==="monthly"?v.set("autobackup_day",r.querySelector('input[name="autobackup_day_monthly"]').value):v.set("autobackup_day","1"),v.delete("autobackup_day_weekly"),v.delete("autobackup_day_monthly"),(await io(v)).status==="success"&&k()})}};var W=(e,t)=>{let o=e.querySelectorAll(".custom-dropdown");o.forEach(a=>{let s=a.querySelector(".custom-dropdown__selected"),n=a.querySelector(".custom-dropdown__options"),r=a.querySelector('input[type="hidden"]'),l=a.querySelector(".custom-dropdown__value"),p=a.querySelector(".custom-dropdown__placeholder"),c=d=>{if(!n)return;let u=n.querySelector(`.custom-dropdown__option[data-value="${d}"]`);d&&u?(l&&(l.innerHTML=u.dataset.display||`<span>${u.textContent.trim()}</span>`,l.style.display="flex"),p&&(p.style.display="none")):(l&&(l.style.display="none"),p&&(p.style.display="block"))};r&&c(r.value),s&&s.addEventListener("click",d=>{d.stopPropagation(),document.querySelectorAll(".custom-dropdown.is-open").forEach(u=>{u!==a&&u.classList.remove("is-open")}),a.classList.toggle("is-open")}),n&&n.addEventListener("click",d=>{let u=d.target.closest(".custom-dropdown__option");if(u){let f=u.dataset.value;r&&(r.value=f,c(f)),a.classList.remove("is-open"),r&&r.id==="accountRole"&&t&&t(f)}})}),document.addEventListener("click",function(a){e&&!e.contains(a.target)&&o.forEach(s=>s.classList.remove("is-open"))},{once:!0})},he=e=>{if(!e)return;let t=e.querySelector(".hybrid-dropdown__selected"),o=e.querySelector(".hybrid-dropdown__options"),a=e.querySelector(".hybrid-dropdown__placeholder"),s=e.querySelector(".hybrid-dropdown__value"),n=e.querySelector('input[type="hidden"]'),r=()=>e.classList.remove("is-open"),l=c=>{n&&(n.value=c),c?(s&&(s.textContent=c,s.style.display="block"),a&&(a.style.display="none")):(s&&(s.style.display="none"),a&&(a.style.display="block")),r()},p=()=>{if(!o)return;o.innerHTML="";let c=document.createElement("div");c.className="hybrid-dropdown__option hybrid-dropdown__option--create",c.innerHTML="<i class='bx bx-plus-circle'></i><span>Buat Kelas Baru</span>",c.onclick=d=>{d.stopPropagation(),o.innerHTML=`
                <div class="hybrid-dropdown__new-input-container">
                    <input type="text" placeholder="Contoh: X-RPL 1" class="hybrid-dropdown__new-input">
                    <button type="button" class="btn btn-primary hybrid-dropdown__save-btn"><i class='bx bx-check'></i></button>
                </div>`;let u=o.querySelector(".hybrid-dropdown__new-input"),f=o.querySelector(".hybrid-dropdown__save-btn");u&&u.focus();let b=async()=>{if(!u)return;let g=u.value.trim();if(g){let v=await He(g);B(v.message,v.status),v.status==="success"&&(i.classes.push(v.data),i.classes.sort((y,x)=>y.name.localeCompare(x.name)),l(g))}};u&&(u.onkeydown=g=>{g.key==="Enter"&&(g.preventDefault(),b())}),f&&(f.onclick=g=>{g.stopPropagation(),b()})},o.appendChild(c),i.classes.forEach(d=>{let u=document.createElement("div");u.className="hybrid-dropdown__option",u.dataset.id=d.id,u.innerHTML=`
                <span class="option-name">${m(d.name)}</span>
                <div class="hybrid-dropdown__option-actions">
                    <button type="button" class="hybrid-dropdown__action-btn edit" title="Edit"><i class='bx bxs-pencil'></i></button>
                    <button type="button" class="hybrid-dropdown__action-btn delete" title="Hapus"><i class='bx bxs-trash'></i></button>
                </div>`,u.addEventListener("click",f=>{f.target.closest(".hybrid-dropdown__action-btn")||l(d.name)}),o.appendChild(u)})};o&&o.addEventListener("click",async c=>{let d=c.target.closest(".hybrid-dropdown__action-btn.edit"),u=c.target.closest(".hybrid-dropdown__action-btn.delete");if(d){c.stopPropagation();let f=d.closest(".hybrid-dropdown__option");if(!f)return;let b=f.dataset.id,g=f.querySelector(".option-name");if(!g)return;let v=g.textContent;f.innerHTML=`
                    <div class="hybrid-dropdown__new-input-container" style="width:100%">
                        <input type="text" class="hybrid-dropdown__new-input" value="${m(v)}">
                        <button type="button" class="btn btn-primary hybrid-dropdown__save-btn"><i class='bx bx-check'></i></button>
                    </div>`;let y=f.querySelector(".hybrid-dropdown__new-input-container");y&&y.addEventListener("click",I=>I.stopPropagation());let x=f.querySelector("input");x&&(x.focus(),x.select());let _=async()=>{if(!x)return;let I=x.value.trim();if(I&&I!==v){let U=await co(b,I);if(B(U.message,U.status),U.status==="success"){let Z=i.classes.findIndex(R=>R.id==b);Z>-1&&(i.classes[Z].name=I),i.classes.sort((R,ke)=>R.name.localeCompare(ke.name)),n&&n.value===v&&l(I)}}p()};x&&(x.onblur=_,x.onkeydown=I=>{I.key==="Enter"&&(I.preventDefault(),I.target.blur())});let E=f.querySelector(".hybrid-dropdown__save-btn");E&&(E.onclick=I=>{I.stopPropagation(),x&&x.blur()})}if(u){c.stopPropagation();let f=u.closest(".hybrid-dropdown__option");if(!f)return;let b=f.dataset.id,g=f.querySelector(".option-name");if(!g)return;let v=g.textContent;Ye("Konfirmasi Hapus Kelas",`Anda yakin ingin menghapus kelas <strong>${m(v)}</strong>?
                    <p class="modal-warning-text" style="text-align: left;">Tindakan ini juga akan menghapus referensi kelas ini dari semua pengguna, peminjaman aktif, dan riwayat.</p>`,async()=>{let y=await uo(b);B(y.message,y.status),y.status==="success"&&(i.classes=i.classes.filter(x=>x.id!=b),p(),n&&n.value===v&&l(""))})}}),t&&(t.onclick=c=>{c.stopPropagation(),document.querySelectorAll(".hybrid-dropdown.is-open").forEach(d=>{d!==e&&d.classList.remove("is-open")}),e.classList.contains("is-open")||p(),e.classList.toggle("is-open")}),n&&n.value&&l(n.value),document.addEventListener("click",c=>{e.contains(c.target)||r()},!0)};var po=()=>{z("history")};var mo=(e,t,o)=>new Promise((a,s)=>{let n=new XMLHttpRequest;n.open("POST",e,!0);let r=o.querySelector(".btn__progress");r&&(r.style.width="0%"),o.classList.add("btn--loading"),o.disabled=!0,n.upload.onprogress=p=>{if(p.lengthComputable&&r){let c=p.loaded/p.total*100;r.style.width=c+"%"}};let l=()=>{o.classList.remove("btn--loading"),o.disabled=!1,r&&setTimeout(()=>{r.style.width="0%"},500)};n.onload=()=>{l(),n.status>=200&&n.status<300?a(n.responseText):s({status:n.status,statusText:n.statusText,response:n.responseText})},n.onerror=()=>{l(),s({status:n.status,statusText:n.statusText})},n.send(t)}),L=(e,t)=>{throw e instanceof TypeError&&(e.message.includes("Failed to fetch")||e.message.includes("NetworkError"))?B("Koneksi gagal, periksa koneksi internet Anda.","error"):B(t||"Terjadi kesalahan yang tidak diketahui.","error"),e},_e=async()=>{try{let t=await(await fetch(`${h}?action=get_csrf_token`)).json();if(t.status==="success"&&t.data.token)Bt(t.data.token);else throw new Error("Gagal memuat token keamanan.")}catch(e){L(e,"Gagal memuat token keamanan."),i.session.isLoggedIn||(window.location.href="login.html")}},bt=async()=>{try{let e=await fetch(`${h}?action=get_settings`);if(!e.ok)throw new Error("Network response was not ok");let t=await e.json();if(t.status==="success"&&t.data)i.borrowSettings={startTime:t.data.borrow_start_time,endTime:t.data.borrow_end_time,isManuallyLocked:t.data.is_manually_locked,isAppLocked:t.data.is_app_locked,lockReason:t.data.lock_reason,isLoaded:!0};else throw new Error(t.message||"Gagal memuat pengaturan peminjaman.")}catch(e){L(e,"Gagal memuat pengaturan peminjaman.")}},Q=async e=>{K();try{let o=await(await fetch(`${h}?action=get_data&type=${e}`)).json();if(o.status==="success")e==="items"?(i.items=o.data.items,i.classifiers=o.data.classifiers,i.classes=o.data.classes):i[e]=o.data;else throw new Error(o.message)}catch(t){L(t,`Gagal memuat data ${e}.`)}finally{me()}},C=async(e=!1)=>{if(i.isLoadingMoreHistory)return;if(i.isLoadingMoreHistory=!0,!e)i.historyPage=1,i.history=[],K();else{i.historyPage++;let a=document.getElementById("historyLoaderContainer");a&&(a.innerHTML='<div class="loading-spinner" style="width:30px;height:30px;border-width:3px;margin:1rem auto;"></div>')}let t=document.getElementById("historySearch").value,o=A(i.selectedDate);try{let a=new URLSearchParams({action:"get_data",type:"history",page:i.historyPage,search:t,filterDate:o}),n=await(await fetch(`${h}?${a.toString()}`)).json();if(n.status==="success"&&n.data)i.history=e?[...i.history,...n.data.records]:n.data.records,i.hasMoreHistory=n.data.hasMore;else throw new Error(n.message||"Gagal memuat riwayat.")}catch(a){L(a,"Gagal memuat riwayat."),i.hasMoreHistory=!1}finally{vo(),i.isLoadingMoreHistory=!1,e||me()}},M=async e=>{let t=await e.json();return t.status==="error"&&t.message.includes("kedaluwarsa")&&await _e(),B(t.message,t.status),t},Ft=async e=>{e.preventDefault();let t=e.target,o=t.querySelector('button[type="submit"]'),a=new FormData(t);a.append("action",a.get("id")?"edit_item":"add_item"),a.append("csrf_token",S);let s=t.querySelector("#itemImage"),n=s&&s.files.length>0;try{let r;n?r=await mo(h,a,o):(o.classList.add("btn--loading"),o.disabled=!0,r=await(await fetch(h,{method:"POST",body:a})).text(),o.classList.remove("btn--loading"),o.disabled=!1);let l=JSON.parse(r);l.status==="error"&&l.message.includes("kedaluwarsa")&&await _e(),B(l.message,l.status),l.status==="success"&&(k(),F("#stock"))}catch(r){!n&&o&&(o.classList.remove("btn--loading"),o.disabled=!1);let l="Gagal menyimpan data barang.",p=l;if(r.response)try{p=JSON.parse(r.response).message||l}catch{}L(r,p)}},jt=async e=>{let t=new FormData;t.append("action","delete_item"),t.append("id",e),t.append("csrf_token",S);try{let o=await fetch(h,{method:"POST",body:t});(await M(o)).status==="success"&&F("#stock")}catch(o){L(o,"Gagal menghapus barang.")}finally{k()}},Nt=async e=>{let t=new FormData;t.append("action","delete_multiple_items"),t.append("csrf_token",S),e.forEach(o=>t.append("ids[]",o));try{let o=await fetch(h,{method:"POST",body:t});(await M(o)).status==="success"&&(i.selectedItems=[],await F("#stock"),O())}catch(o){L(o,"Gagal menghapus barang.")}finally{k()}},fo=async e=>{e.preventDefault();let t=e.target,o=new FormData;o.append("borrower_name",t.querySelector("#borrowerName").value),o.append("borrower_class",t.querySelector("#borrowerClassValue").value),o.append("subject",t.querySelector("#subject").value),o.append("action","borrow_item"),o.append("csrf_token",S),i.session.role==="admin"&&t._selectedUserId&&o.append("borrower_user_id",t._selectedUserId),t.querySelectorAll(".borrow-item-row").forEach((s,n)=>{let r=s.querySelector('input[type="hidden"]').value,l=s.querySelector('input[type="number"]').value;r&&l&&(o.append(`items[${n}][id]`,r),o.append(`items[${n}][quantity]`,l))});try{let s=await fetch(h,{method:"POST",body:o});(await M(s)).status==="success"&&(t.reset(),t._selectedUserId=null,document.getElementById("borrowItemsContainer").innerHTML="",Pe(),T("#return"))}catch(s){L(s,"Gagal memproses peminjaman.")}},Wt=async e=>{e.preventDefault();let t=e.target,o=new FormData;o.append("transaction_id",t.querySelector('input[name="transaction_id"]').value),o.append("action","add_to_borrowal"),o.append("csrf_token",S);let a=t.querySelectorAll(".borrow-item-row"),s=!1;if(a.forEach((n,r)=>{let l=n.querySelector('input[name="item_id"]').value,p=n.querySelector('input[type="number"]').value;l&&p&&(o.append(`items[${r}][id]`,l),o.append(`items[${r}][quantity]`,p),s=!0)}),!s){B("Silakan pilih setidaknya satu alat untuk ditambahkan.","error");return}try{let n=await fetch(h,{method:"POST",body:o});(await M(n)).status==="success"&&(k(),F("#return"))}catch(n){L(n,"Gagal menambah alat.")}},zt=async e=>{e.preventDefault();let t=e.target,o=t.querySelector('button[type="submit"]'),a=new FormData(t);a.append("action","return_item"),a.append("csrf_token",S);let s=t.querySelector("#returnProofGallery"),n=t.querySelector("#returnProofCamera");n&&n.files.length>0?a.set("proof_image",n.files[0],n.files[0].name):s&&s.files.length>0&&a.set("proof_image",s.files[0],s.files[0].name),a.delete("proof_image_camera");try{let r=await mo(h,a,o),l=JSON.parse(r);l.status==="error"&&l.message.includes("kedaluwarsa")&&await _e(),B(l.message,l.status),l.status==="success"&&(k(),T("#history"))}catch(r){let l="Gagal mengunggah bukti pengembalian.",p=l;if(r.response)try{p=JSON.parse(r.response).message||l}catch{}L(r,p)}},Yt=async e=>{e.preventDefault();let t=e.target,o=new FormData(t);o.append("action","edit_borrowal"),o.append("csrf_token",S);try{let a=await fetch(h,{method:"POST",body:o});if((await M(a)).status==="success"){k(),await Promise.all([Q("borrowals"),Q("items")]);let n=document.querySelector(".page.active");n&&n.id==="return"&&F("#return")}}catch(a){L(a,"Gagal memperbarui peminjaman.")}},Xt=async e=>{let t=new FormData;t.append("action","delete_borrowal"),t.append("id",e),t.append("csrf_token",S);try{let o=await fetch(h,{method:"POST",body:t});(await M(o)).status==="success"&&F("#return")}catch(o){L(o,"Gagal menghapus item peminjaman.")}finally{k()}},Qt=async e=>{let t=new FormData;t.append("action","delete_history_item"),t.append("id",e),t.append("csrf_token",S);try{let o=await fetch(h,{method:"POST",body:t});(await M(o)).status==="success"&&C()}catch(o){L(o,"Gagal menghapus riwayat.")}finally{k()}},Zt=async e=>{e.preventDefault();let t=new FormData(e.target);t.append("action","flush_history"),t.append("csrf_token",S);try{let o=await fetch(h,{method:"POST",body:t}),a=await M(o);a.status==="success"?(k(),C()):re().then(()=>{let s=document.getElementById("captchaInput");s&&s.insertAdjacentHTML("afterend",`<small class="text-danger" style="display:block; margin-top:5px;">${a.message}</small>`)})}catch(o){L(o,"Proses gagal.")}},Ht=async e=>{e.preventDefault();let t=e.target,o=new FormData(t);o.append("action","update_credentials"),o.append("csrf_token",S);try{let a=await fetch(h,{method:"POST",body:o}),s=await M(a);s.status==="success"&&(s.data&&s.data.new_nama&&(i.session.username=s.data.new_nama,i.session.login_username=s.data.new_login_username,document.getElementById("usernameDisplay").textContent=i.session.username,document.getElementById("mobileUsernameDisplay").textContent=i.session.username),k())}catch(a){L(a,"Gagal memperbarui akun.")}},Xe=async e=>{try{let t=await fetch(h,{method:"POST",body:e});(await M(t)).status==="success"&&(await bt(),k())}catch(t){L(t,"Gagal memperbarui pengaturan.")}},$t=async e=>{e.append("action","start_import_csv"),e.append("csrf_token",S),se({status:"running",log:[{time:new Date().toLocaleTimeString("id-ID"),message:"Mengunggah file dan membuat antrian...",status:"info"}]});try{let o=await(await fetch(h,{method:"POST",body:e})).json();if(o.status==="success")await We();else{B(o.message,"error");let a=document.getElementById("importCsvForm");a&&(a.reset(),a.querySelector(".image-uploader__prompt").style.display="flex",a.querySelector(".image-uploader__file-info").style.display="none",a.querySelector('button[type="submit"]').disabled=!1);let s=document.getElementById("import-confirmation-view"),n=document.getElementById("import-progress-view");s&&(s.style.display="block"),n&&(n.style.display="none")}}catch(t){L(t,"Gagal memulai impor."),se({status:"error",message:"Gagal menghubungi server untuk memulai impor."})}},We=async()=>{await ce("process_import_job",se,"impor")},go=async()=>{try{let e=await fetch(`${h}?action=get_import_status`);if(!e.ok)throw new Error("Network response not OK");return await e.json()}catch(e){return console.error("Gagal mengambil status impor:",e),{status:"idle"}}},qt=async()=>{let e=new FormData;e.append("action","clear_import_status"),e.append("csrf_token",S);try{await fetch(h,{method:"POST",body:e})}catch(t){console.error("Gagal membersihkan status impor:",t)}},ft=async()=>{await ce("process_backup_job",X,"backup")},ao=async()=>{X({status:"running",total:0,processed:0,log:[{time:new Date().toLocaleTimeString("id-ID"),message:"Memulai dan membuat antrian...",status:"info"}]});let e=new FormData;e.append("action","backup_to_drive"),e.append("csrf_token",S);try{let o=await(await fetch(h,{method:"POST",body:e})).json();o.status==="success"?await ft():X({status:"error",message:o.message})}catch(t){L(t,"Gagal memulai proses backup."),X({status:"error",message:"Gagal menghubungi server untuk memulai backup."})}},bo=async()=>{try{let e=await fetch(`${h}?action=get_backup_status`);if(!e.ok)throw new Error("Network response was not ok");return await e.json()}catch(e){return console.error("Gagal mengambil status backup:",e),{status:"error",error:"Gagal menghubungi server."}}},so=async()=>{let e=new FormData;e.append("action","clear_backup_status"),e.append("csrf_token",S);try{return await(await fetch(h,{method:"POST",body:e})).json()}catch(t){L(t,"Gagal membersihkan status backup.")}},le=async()=>{await ce("process_export_job",$,"ekspor")},to=async()=>{$({status:"running",total:0,processed:0,log:[{time:new Date().toLocaleTimeString("id-ID"),message:"Memulai dan membuat antrian...",status:"info"}]});let e=new FormData;e.append("action","start_export"),e.append("export_type","stock"),e.append("csrf_token",S);try{let o=await(await fetch(h,{method:"POST",body:e})).json();o.status==="success"?await le():(B(o.message,"error"),k())}catch(t){L(t,"Gagal memulai proses ekspor."),$({status:"error",message:"Gagal menghubungi server untuk memulai ekspor."})}},oo=async()=>{$({status:"running",total:0,processed:0,log:[{time:new Date().toLocaleTimeString("id-ID"),message:"Memulai dan membuat antrian...",status:"info"}]});let e=new FormData;e.append("action","start_export"),e.append("export_type","accounts"),e.append("csrf_token",S);try{let o=await(await fetch(h,{method:"POST",body:e})).json();o.status==="success"?await le():(B(o.message,"error"),k())}catch(t){L(t,"Gagal memulai proses ekspor."),$({status:"error",message:"Gagal menghubungi server untuk memulai ekspor."})}},yo=async()=>{try{let e=await fetch(`${h}?action=get_export_status`);if(!e.ok)throw new Error("Network response was not ok");return await e.json()}catch(e){return console.error("Gagal mengambil status ekspor:",e),{status:"error",error:"Gagal menghubungi server."}}},eo=async()=>{let e=new FormData;e.append("action","clear_export_status"),e.append("csrf_token",S);try{return await(await fetch(h,{method:"POST",body:e})).json()}catch(t){L(t,"Gagal membersihkan status ekspor.")}},He=async e=>{let t=new FormData;t.append("action","add_class"),t.append("name",e),t.append("csrf_token",S);try{return await(await fetch(h,{method:"POST",body:t})).json()}catch{return{status:"error",message:"Gagal terhubung ke server."}}},co=async(e,t)=>{let o=new FormData;o.append("action","edit_class"),o.append("id",e),o.append("name",t),o.append("csrf_token",S);try{return await(await fetch(h,{method:"POST",body:o})).json()}catch{return{status:"error",message:"Gagal terhubung ke server."}}},uo=async e=>{let t=new FormData;t.append("action","delete_class"),t.append("id",e),t.append("csrf_token",S);try{return await(await fetch(h,{method:"POST",body:t})).json()}catch{return{status:"error",message:"Gagal terhubung ke server."}}},ro=async()=>{try{return await(await fetch(`${h}?action=get_autobackup_config`)).json()}catch(e){return L(e,"Gagal mengambil konfigurasi auto-backup."),{status:"error",data:{}}}},io=async e=>{e.append("action","save_autobackup_config"),e.append("csrf_token",S);try{let t=await fetch(h,{method:"POST",body:e});return await M(t)}catch(t){L(t,"Gagal menyimpan konfigurasi.")}},de=async()=>{try{let e=await fetch(`${h}?action=get_autobackup_status`);if(!e.ok)throw new Error("Network response not OK");return await e.json()}catch(e){return console.error("Gagal mengambil status auto-backup:",e),{status:"idle"}}},lo=async()=>{let e=new FormData;e.append("action","clear_autobackup_status"),e.append("csrf_token",S);try{await fetch(h,{method:"POST",body:e})}catch(t){console.error("Gagal membersihkan status auto-backup:",t)}};var j=document.getElementById("stockGrid"),yt=document.getElementById("returnGrid"),Fe=document.getElementById("historyGrid"),ho=document.getElementById("exportHistoryBtn"),wo=document.getElementById("flushHistoryBtn"),je=document.getElementById("historyLoaderContainer"),aa=e=>{if(!e)return"";let t=new Date(e);if(isNaN(t))return"";let o={weekday:"long",day:"numeric",month:"numeric",year:"numeric"};return new Intl.DateTimeFormat("id-ID",o).format(t)},xo=e=>`
    <div class="date-separator">
        <span class="date-separator__badge">${m(aa(e))}</span>
    </div>`,sa=new IntersectionObserver((e,t)=>{e.forEach(o=>{if(o.isIntersecting){let a=o.target;a.src=a.dataset.src,a.onload=()=>{a.classList.add("loaded")},a.onerror=()=>{a.src="https://placehold.co/600x400/8ab4f8/ffffff?text=Error",a.classList.add("loaded")},a.classList.remove("lazy"),t.unobserve(a)}})}),_o=(e=document)=>{"IntersectionObserver"in window?e.querySelectorAll("img.lazy").forEach(o=>{sa.observe(o)}):e.querySelectorAll("img.lazy").forEach(o=>{o.src=o.dataset.src,o.classList.remove("lazy"),o.classList.add("loaded")})},ko=e=>{let t=i.session.role==="admin",o=!t&&i.borrowSettings.isAppLocked,a=e.current_quantity<=0,s=e.current_quantity<e.total_quantity,n=i.selectedItems.includes(e.id.toString()),r=a?"text-danger":"",l=e.image_url||`https://placehold.co/600x400/8ab4f8/ffffff?text=${encodeURIComponent(e.name)}`,p=t?`
        <div class="card__image-overlay-actions">
            <button class="card__action-btn edit" data-id="${e.id}" ${s?'disabled title="Tidak bisa edit barang yang dipinjam"':'title="Edit"'}><i class='bx bxs-pencil'></i></button>
            <button class="card__action-btn delete" data-id="${e.id}" ${s?'disabled title="Tidak bisa hapus barang yang dipinjam"':'title="Hapus"'}><i class='bx bxs-trash-alt'></i></button>
        </div>`:"",c=a?"":`
        <div class="card__borrow-action-container">
            <button class="card__action-btn borrow-shortcut" 
                    data-id="${e.id}" 
                    title="${o?"Peminjaman sedang ditutup":"Pinjam Barang Ini"}" 
                    ${o?"disabled":""}>
                <i class='bx bx-right-arrow-alt'></i>
            </button>
        </div>`,d=e.classifier?`<span class="card__classifier-chip">${m(e.classifier)}</span>`:"",u=a?'<div class="card__out-of-stock-badge">Kosong</div>':"";return`
    <div class="card ${a?"is-out-of-stock":""} ${n?"is-selected":""}" data-item-id="${e.id}">
        <div class="card__image-container">
            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="${m(l)}" alt="${m(e.name)}" class="card__image lazy" loading="lazy">
            ${u}
            ${d}
            ${p}
            <div class="card__bottom-actions">
                <div class="card__selection-icon">
                    <i class='bx bxs-check-circle'></i>
                </div>
                ${c}
            </div>
        </div>
        <div class="card__body">
            <h3 class="card__title" title="${m(e.name)}">${m(e.name)}</h3>
            <div class="card__info">
                <span>Tersedia: <strong class="${r}">${m(e.current_quantity)}</strong></span>
                <span class="card__quantity-chip">Total: ${m(e.total_quantity)}</span>
            </div>
        </div>
    </div>`},na=()=>{let e=document.querySelectorAll(".card-placeholder");if("IntersectionObserver"in window){let t=new IntersectionObserver((o,a)=>{o.forEach(s=>{if(s.isIntersecting){let n=s.target;try{let r=JSON.parse(n.dataset.itemData),l=ko(r),p=document.createElement("div");p.innerHTML=l;let c=p.firstElementChild;n.replaceWith(c),_o(c)}catch(r){console.error("Gagal mem-parsing data item untuk lazy loading:",r),n.remove()}a.unobserve(n)}})},{rootMargin:"0px 0px 250px 0px"});e.forEach(o=>{t.observe(o)})}else e.forEach(t=>{try{let o=JSON.parse(t.dataset.itemData),a=ko(o),s=document.createElement("div");s.innerHTML=a;let n=s.firstElementChild;t.replaceWith(n),_o(n)}catch(o){console.error("Gagal mem-parsing data item:",o),t.remove()}})},Y=()=>{let e=document.getElementById("stockSearch").value.toLowerCase(),t=i.items;i.currentStockFilter==="classifier"&&i.currentClassifierFilter&&(t=t.filter(n=>n.classifier===i.currentClassifierFilter)),i.currentStockFilter==="available"?t=t.filter(n=>n.current_quantity>0):i.currentStockFilter==="empty"&&(t=t.filter(n=>n.current_quantity<=0)),e&&(t=Ue(t,e,["name","classifier"]));let o=new Set(t.map(n=>n.id.toString())),a=0;if(!j||j.children.length===0)return;for(let n of j.children){if(n.classList.contains("empty-state"))continue;let r=null;if(n.classList.contains("card-placeholder"))try{r=JSON.parse(n.dataset.itemData).id.toString()}catch{n.style.display="none";continue}else n.classList.contains("card")&&(r=n.dataset.itemId);r&&o.has(r)?(n.style.display="",a++):n.style.display="none"}let s=j.querySelector(".empty-state");if(a===0)if(s)s.style.display="flex";else{let n=i.items.length>0?"Barang tidak ditemukan.":"Belum ada barang di inventaris.";j.insertAdjacentHTML("beforeend",q("Stok tidak ditemukan",n))}else s&&(s.style.display="none");ge()},Bo=()=>{if(!j)return;if(j.innerHTML="",i.items.length===0){j.innerHTML=q("Stok Kosong","Belum ada barang di inventaris.");return}let e=i.items.map(t=>`<div class="card-placeholder" data-item-data='${m(JSON.stringify(t))}'></div>`).join("");j.innerHTML=e,na(),Y()},ra=(e,t,o,a)=>{let s=e;if(i.selectedDate){let r=A(i.selectedDate);s=s.filter(l=>a.some(p=>A(l[p])===r))}let n=t.value;return Ue(s,n,o)},ie=()=>{if(!yt)return;let e=document.getElementById("returnSearch"),t=ra(i.borrowals,e,["borrower_name","borrower_class","item_name","subject"],["borrow_date"]);if(t.length===0){yt.innerHTML=q("Tidak Ada Peminjaman","Tidak ada data yang cocok dengan filter.");return}let o=t.reduce((r,l)=>{let p=l.transaction_id||`single-${l.id}`;return r[p]||(r[p]={items:[],borrower_name:l.borrower_name,borrower_class:l.borrower_class,subject:l.subject,borrow_date:l.borrow_date,transaction_id:l.transaction_id}),r[p].items.push(l),r},{}),a=Object.values(o).sort((r,l)=>new Date(l.borrow_date)-new Date(r.borrow_date)),s="",n=null;a.forEach((r,l)=>{let p=A(r.borrow_date);p!==n&&(n!==null&&(s+="</div>"),s+='<div class="date-group">',s+=xo(r.borrow_date),n=p);let c=i.session.role==="admin",d=r.items.map(f=>{let b=f.image_url||"https://placehold.co/50x50/8ab4f8/ffffff?text=?",g=c?`
                <div class="list-item__actions" style="margin-left: auto; display: flex; gap: 0.5rem;">
                    <button class="btn btn-success action-btn edit-borrowal-btn" data-id="${f.id}" title="Ubah Peminjaman">
                        <i class='bx bx-pencil'></i>
                    </button>
                    <button class="btn btn-danger action-btn delete-borrowal-btn" data-id="${f.id}" title="Hapus Item Peminjaman">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            `:"";return`
                <li class="transaction-group__item">
                    <img src="${m(b)}" alt="${m(f.item_name)}" class="transaction-group__item-img">
                    <div class="transaction-group__item-details">
                        <div class="transaction-group__item-name">${m(f.item_name)}</div>
                        <div class="transaction-group__item-qty">Jumlah: ${m(f.quantity)} pcs</div>
                    </div>
                    ${g}
                </li>`}).join(""),u=`
            <div class="transaction-group__header-actions">
                <button class="btn btn-success add-item-btn" data-id="${r.transaction_id}">
                    Tambah
                </button>
                <button class="btn btn-primary return-btn" data-id="${r.transaction_id}">
                    Kembalikan
                </button>
            </div>
        `;s+=`
            <div class="transaction-group">
                <div class="transaction-group__header">
                    <div class="transaction-group__borrower-info">
                        <strong>${m(r.borrower_name)}</strong>
                        <span class="class">${m(r.borrower_class)}</span>
                        <span class="subject">Tujuan (Mapel): ${m(r.subject)||"-"}</span>
                         <small style="display: block; margin-top: 5px;">${new Date(r.borrow_date).toLocaleString("id-ID")}</small>
                    </div>
                    ${u}
                </div>
                <ul class="transaction-group__items">${d}</ul>
            </div>`,l===a.length-1&&(s+="</div>")}),yt.innerHTML=s},vo=()=>{if(!Fe||!je)return;let e=i.session.role==="admin",t=i.history.length>0;if(ho&&(ho.disabled=!t),wo&&(wo.disabled=!t),!t){Fe.innerHTML=q("Riwayat Kosong","Tidak ada riwayat yang cocok dengan filter."),je.innerHTML="";return}let o=i.history.reduce((r,l)=>{let p=l.transaction_id||`single-history-${l.id}`;return r[p]||(r[p]={items:[],borrower_name:l.borrower_name,borrower_class:l.borrower_class,subject:l.subject,return_date:l.return_date,borrow_date:l.borrow_date,proof_image_url:l.proof_image_url,transaction_id:l.transaction_id}),r[p].items.push(l),r},{}),a=null,s="",n=Object.values(o).sort((r,l)=>new Date(l.return_date)-new Date(r.return_date));n.forEach((r,l)=>{let p=A(r.return_date);p!==a&&(a!==null&&(s+="</div>"),s+='<div class="date-group">',s+=xo(r.return_date),a=p);let c=r.items.map(d=>{let u=d.image_url||"https://placehold.co/50x50/8ab4f8/ffffff?text=?",f=e?`
                <div class="list-item__actions" style="margin-left: auto;">
                    <button class="btn btn-danger action-btn delete-history-btn" data-id="${d.id}" title="Hapus Riwayat Ini">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
                `:"";return`
                <li class="transaction-group__item">
                     <img src="${m(u)}" alt="${m(d.item_name)}" class="transaction-group__item-img">
                     <div class="transaction-group__item-details">
                        <div class="transaction-group__item-name">${m(d.item_name)}</div>
                        <div class="transaction-group__item-qty">Jumlah: ${m(d.quantity)} pcs</div>
                    </div>
                    ${f}
                </li>`}).join("");s+=`
            <div class="transaction-group">
                <div class="transaction-group__header">
                    <div class="transaction-group__borrower-info">
                        <strong>${m(r.borrower_name)}</strong>
                        <span class="class">${m(r.borrower_class)}</span>
                        <span class="subject">Tujuan (Mapel) : ${m(r.subject)||"-"}</span>
                        <small class="date-history-detail" style="display: block; margin-top: 10px;">
                            <span class="date-history-info">Pinjam : ${new Date(r.borrow_date).toLocaleString("id-ID")}</span> <br>
                            <span class="date-history-info">Kembali :  ${new Date(r.return_date).toLocaleString("id-ID")}</span>
                        </small>
                    </div>
                    <button type="button" class="btn btn-primary see-proof-btn view-proof-btn" style="padding: .8rem 1rem;" data-proof-url="${m(r.proof_image_url)}" title="Lihat Bukti Pengembalian">
                        <i class='bx bx-link-external'></i> Lihat Bukti
                    </button>
                </div>
                <ul class="transaction-group__items">${c}</ul>
            </div>`,l===n.length-1&&(s+="</div>")}),Fe.innerHTML=s,Fe.querySelectorAll(".view-proof-btn").forEach(r=>{r.addEventListener("click",l=>{l.preventDefault();let p=r.dataset.proofUrl;p&&Ct(p,"Bukti Pengembalian")})}),i.hasMoreHistory?(je.innerHTML='<button id="loadMoreHistoryBtn" class="btn btn-primary">Selengkapnya</button>',document.getElementById("loadMoreHistoryBtn").onclick=()=>C(!0)):je.innerHTML='<p class="end-of-list">Semua data telah ditampilkan.</p>'},Ne=0,vt=()=>{Ne++;let e=`item-row-${Ne}`,t=document.createElement("div");t.className="borrow-item-row",t.id=e;let a=i.items.filter(u=>u.current_quantity>0).map(u=>`
        <div class="custom-dropdown__option" data-value="${u.id}" data-max="${u.current_quantity}" data-display="<img src='${m(u.image_url)||"https://placehold.co/40x40/8ab4f8/ffffff?text=?"}' alt='${m(u.name)}'><span>${m(u.name)}</span>">
            <img src="${m(u.image_url)||"https://placehold.co/40x40/8ab4f8/ffffff?text=?"}" alt="${m(u.name)}" class="custom-dropdown__option-img">
            <div class="custom-dropdown__option-info">
                <span class="custom-dropdown__option-name">${m(u.name)}</span>
                <span class="custom-dropdown__option-qty">Sisa: ${m(u.current_quantity)}</span>
            </div>
        </div>`).join("");t.innerHTML=`
        <div class="form-group borrow-item-row__item">
            <label>Alat</label>
            <div class="custom-dropdown">
                <input type="hidden" name="item_id" required>
                <button type="button" class="custom-dropdown__selected">
                    <span class="custom-dropdown__placeholder">Pilih Alat</span>
                    <div class="custom-dropdown__value"></div>
                    <i class='bx bx-chevron-down custom-dropdown__arrow'></i>
                </button>
                <div class="custom-dropdown__options">${a}</div>
            </div>
        </div>
        <div class="form-group borrow-item-row__quantity">
            <label for="quantity-${Ne}">Jumlah</label>
            <input type="number" id="quantity-${Ne}" name="quantity" min="1" value="1" required>
            <small class="form-text max-quantity-hint"></small>
        </div>`;let s=t.querySelector(".custom-dropdown"),n=s.querySelector(".custom-dropdown__options"),r=s.querySelector(".custom-dropdown__value"),l=s.querySelector(".custom-dropdown__placeholder"),p=s.querySelector('input[type="hidden"]'),c=t.querySelector('input[type="number"]'),d=t.querySelector(".max-quantity-hint");return n.addEventListener("click",u=>{let f=u.target.closest(".custom-dropdown__option");!f||f.getAttribute("aria-disabled")==="true"||(p.value=f.dataset.value,r.innerHTML=f.dataset.display,r.style.display="flex",l.style.display="none",s.classList.remove("is-open"),f.dataset.max&&(c.max=f.dataset.max,(parseInt(c.value)>parseInt(f.dataset.max)||!c.value)&&(c.value=1),d.textContent=`Maks: ${f.dataset.max}`),ht())}),document.getElementById("borrowItemsContainer").appendChild(t),ht(),t},ht=()=>{let e=Array.from(document.querySelectorAll('#borrowItemsContainer input[name="item_id"]')).map(t=>t.value).filter(Boolean);document.querySelectorAll("#borrowItemsContainer .custom-dropdown").forEach(t=>{let o=t.querySelector('input[name="item_id"]').value;t.querySelectorAll(".custom-dropdown__option").forEach(a=>{let s=e.includes(a.dataset.value)&&a.dataset.value!==o;a.setAttribute("aria-disabled",s)})})},wt=()=>{let e=document.getElementById("borrowItemsContainer"),t=e.querySelectorAll(".borrow-item-row"),o=e.querySelector(".remove-last-item-btn");if(o&&o.remove(),t.length>1){let a=t[t.length-1],s=document.createElement("button");s.type="button",s.className="btn btn-secondary remove-last-item-btn",s.title="Hapus alat terakhir",s.innerHTML="<i class='bx bx-chevron-up'></i>",s.onclick=()=>{a.remove(),ht(),wt()},a.appendChild(s)}},Pe=()=>{let e=document.getElementById("borrowItemsContainer"),t=document.getElementById("borrowerName"),o=document.getElementById("borrowerClassValue"),a=document.getElementById("classDropdownContainer"),s=document.getElementById("nameSuggestions"),n=document.getElementById("borrowForm");if(n&&(n._selectedUserId=null),!e)return;if(e.innerHTML="",i.session.role==="user"){if(t&&(t.value=i.session.username),o){o.value=i.session.kelas;let p=a.querySelector(".hybrid-dropdown__value, .custom-dropdown__value"),c=a.querySelector(".hybrid-dropdown__placeholder, .custom-dropdown__placeholder");p&&(p.innerHTML=`<span>${m(i.session.kelas)}</span>`,p.style.display="flex"),c&&(c.style.display="none")}}else{t&&(t.value=""),o&&(o.value="");let p=a.querySelector(".hybrid-dropdown__value, .custom-dropdown__value"),c=a.querySelector(".hybrid-dropdown__placeholder, .custom-dropdown__placeholder");p&&(p.style.display="none"),c&&(c.style.display="block")}i.session.role==="admin"&&ia(a,o);let r=[...i.itemsToBorrow];if(i.itemsToBorrow=[],r.length>0)r.forEach(p=>{let d=vt().querySelector(`.custom-dropdown__option[data-value='${p}']`);d&&d.click()});else{let p=vt();if(i.itemToBorrow){let c=p.querySelector(`.custom-dropdown__option[data-value='${i.itemToBorrow}']`);c&&c.click(),i.itemToBorrow=null}}let l=document.getElementById("addBorrowItemBtn");if(l.onclick=()=>{vt(),wt()},wt(),i.session.role==="admin"&&t&&s){let p;t.addEventListener("input",()=>{n&&(n._selectedUserId=null),clearTimeout(p);let c=t.value.trim();if(c.length<2){s.style.display="none";return}p=setTimeout(async()=>{try{let u=await(await fetch(`${h}?action=search_user&query=${encodeURIComponent(c)}`)).json();u.status==="success"&&u.data.length>0?(s.innerHTML=u.data.map(f=>`
                            <div class="suggestion-item" data-nama="${m(f.nama)}" data-kelas="${m(f.kelas)}" data-userid="${m(f.id)}">
                                <span class="name">${m(f.nama)}</span>
                                <span class="class">${m(f.kelas)}</span>
                            </div>
                        `).join(""),s.style.display="block"):s.style.display="none"}catch(d){console.error("Failed to fetch name suggestions:",d),s.style.display="none"}},300)}),s.addEventListener("click",c=>{let d=c.target.closest(".suggestion-item");if(d&&n){let u=d.dataset.userid,f=d.dataset.nama,b=d.dataset.kelas;n._selectedUserId=u,t&&(t.value=f);let g=a.querySelector("#borrowerClassValue"),v=a.querySelector(".hybrid-dropdown__value"),y=a.querySelector(".hybrid-dropdown__placeholder");g&&(g.value=b),v&&(v.textContent=b,v.style.display="block"),y&&(y.style.display="none"),s.style.display="none"}}),t.addEventListener("blur",()=>{setTimeout(()=>{s&&(s.style.display="none")},200)})}},So=()=>{let e=document.getElementById("filterBtn"),t=document.getElementById("filterOptions"),o=document.getElementById("stockSearch"),a;o?.addEventListener("input",()=>{clearTimeout(a),a=setTimeout(()=>{Y()},200)}),e?.addEventListener("click",s=>{s.stopPropagation(),t.classList.toggle("show")}),t?.addEventListener("click",s=>{if(s.target.tagName==="LI"){let n=s.target.dataset.filter;n==="classifier"?(ut(),t.classList.remove("show")):(i.currentStockFilter=n,i.currentClassifierFilter=null,G(),t.classList.remove("show"),Y())}})};function ia(e,t){if(!e||!t)return;let o=e.querySelector(".hybrid-dropdown__selected"),a=e.querySelector(".hybrid-dropdown__options"),s=e.querySelector(".hybrid-dropdown__placeholder"),n=e.querySelector(".hybrid-dropdown__value"),r=()=>e.classList.remove("is-open"),l=c=>{t.value=c,c?(n.textContent=m(c),n.style.display="block",s&&(s.style.display="none")):(n.textContent="",n.style.display="none",s&&(s.style.display="block")),r()},p=()=>{a.innerHTML="";let c=document.createElement("div");c.className="hybrid-dropdown__option hybrid-dropdown__option--create",c.innerHTML="<i class='bx bx-plus-circle'></i><span>Buat Kelas Baru</span>",c.onclick=d=>{d.stopPropagation(),a.innerHTML=`
                <div class="hybrid-dropdown__new-input-container">
                    <input type="text" placeholder="Contoh: XII-TKJ 3" class="hybrid-dropdown__new-input">
                    <button type="button" class="btn btn-primary hybrid-dropdown__save-btn"><i class='bx bx-check'></i></button>
                </div>`;let u=a.querySelector(".hybrid-dropdown__new-input"),f=a.querySelector(".hybrid-dropdown__save-btn");u.focus();let b=async()=>{let g=u.value.trim();if(g){f.disabled=!0;let v=await He(g);B(v.message,v.status),v.status==="success"?(i.classes.some(y=>y.id===v.data.id)||(i.classes.push(v.data),i.classes.sort((y,x)=>y.name.localeCompare(x.name,"en",{numeric:!0}))),l(g)):(f.disabled=!1,p())}};u.onkeydown=g=>{g.key==="Enter"&&(g.preventDefault(),b())},f.onclick=g=>{g.stopPropagation(),b()}},a.appendChild(c),i.classes.forEach(d=>{let u=document.createElement("div");u.className="hybrid-dropdown__option",u.innerHTML=`<span class="option-name">${m(d.name)}</span>`,u.onclick=()=>l(d.name),a.appendChild(u)})};o.onclick=c=>{c.stopPropagation(),document.querySelectorAll(".hybrid-dropdown.is-open, .custom-dropdown.is-open").forEach(d=>{d!==e&&d.classList.remove("is-open")}),e.classList.contains("is-open")||p(),e.classList.toggle("is-open")},l(t.value)}var Lo=null,Io=null,Eo=null,Mo=!1,Ao=()=>window.innerWidth<=840,_t=async(e,t="name")=>{try{let a=await(await fetch(`${h}?action=get_statistics&type=${e}&groupBy=${t}`)).json();if(a.status==="success")return a.data;throw new Error(a.message)}catch(o){return B(`Gagal memuat data untuk ${e}: ${o.message}`,"error"),[]}},la=()=>{let e=document.getElementById("chartjs-tooltip");return e||(e=document.createElement("div"),e.id="chartjs-tooltip",e.style.opacity=0,e.style.pointerEvents="none",e.style.position="absolute",e.style.transition="opacity 0.2s ease, transform 0.2s ease",document.body.appendChild(e)),e},To=e=>{let{chart:t,tooltip:o}=e,a=la();if(o.opacity===0){a.style.opacity=0;return}if(o.body){let p=o.dataPoints[0].dataIndex,c=t.config.type,u=t.options.plugins.tooltip.externalContext.data[p],f=u.image_url,b=m(u.label),g=u.count,v=c==="bar"?`Jumlah Dipinjam: ${g}`:`Frekuensi: ${g} kali`,y="";if(f){let x=`https://placehold.co/120x100/8ab4f8/ffffff?text=${encodeURIComponent(b)}`;y+=`<img src="${m(f)}" alt="${b}" class="chartjs-tooltip-image" onerror="this.onerror=null;this.src='${x}';">`}y+=`<span class="chartjs-tooltip-label">${b}</span>`,y+=`<span class="chartjs-tooltip-value">${v}</span>`,a.innerHTML=y}let s=t.canvas.getBoundingClientRect(),n=s.left+window.scrollX+o.caretX,r=s.top+window.scrollY+o.caretY,l=a.offsetWidth;n+l/2>window.innerWidth-10&&(n=window.innerWidth-l/2-10),n-l/2<10&&(n=l/2+10),a.style.opacity=1,a.style.left=`${n}px`,a.style.top=`${r}px`,a.style.transform="translate(-50%, calc(-100% - 10px))"},ca=async()=>{let e=document.getElementById("diskUsageIndicator");if(e)try{let o=await(await fetch(`${h}?action=get_disk_usage`)).json();if(o.status==="success"&&o.data){let{used_percentage:a,formatted_used:s,formatted_free:n,formatted_total:r}=o.data;e.querySelector(".disk-bar__used").style.width=`${a}%`,e.querySelector(".disk-bar__free").style.width=`${100-a}%`,e.querySelector("#diskUsedValue").textContent=s,e.querySelector("#diskFreeValue").textContent=n,e.querySelector("#diskTotalText").textContent=r,e.querySelector("#diskUsedText").textContent=s,e.querySelector("#diskFreeText").textContent=n,e.style.visibility="visible"}else e.style.display="none"}catch(t){console.error("Gagal mengambil data penggunaan disk:",t),e.style.display="none"}},Do=e=>{let t=[],o=["#4285F4","#DB4437","#F4B400","#0F9D58","#AB47BC","#00ACC1","#FF7043","#9E9D24","#5C6BC0","#26A69A","#FFCA28","#66BB6A"];for(let a=0;a<e;a++)t.push(o[a%o.length]);return t},da=()=>{let e=document.documentElement.classList.contains("dark"),t=e?"rgba(232, 234, 237, 0.8)":"#5f6368",o=e?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.1)";Chart.defaults.font.family="'Inter', sans-serif",Chart.defaults.color=t,Chart.defaults.plugins.legend.position="bottom",Chart.defaults.scale.grid.color=o,Chart.defaults.scale.ticks.color=t,Chart.defaults.maintainAspectRatio=!1,Chart.defaults.responsive=!0},kt=(e,t,o,a)=>{let s=document.getElementById(t);if(!s)return null;if(!(a.data.labels&&a.data.labels.length>0))return e&&e.destroy(),s.innerHTML=q("Data Kosong","Belum ada data untuk ditampilkan."),null;let r=s.querySelector("canvas");if(r||(s.innerHTML=`<canvas id="${o}"></canvas>`,r=document.getElementById(o),e=null),e)return e.data=a.data,e.options=a.options,e.update(),e;{let l=r.getContext("2d");return new Chart(l,a)}},ua=async()=>{let e=await _t("class_borrowals"),t={type:"pie",data:{labels:e.map(o=>o.label),datasets:[{label:"Jumlah Peminjaman",data:e.map(o=>o.count),backgroundColor:Do(e.length),borderColor:document.documentElement.classList.contains("dark")?"#282a2d":"#FFFFFF",borderWidth:2,hoverOffset:4}]},options:{plugins:{title:{display:!1}}}};Lo=kt(Lo,"classBorrowalsChartContainer","classBorrowalsChart",t)},Co=async(e="name")=>{let t=await _t("current_loans",e),o={type:"bar",data:{labels:t.map(a=>a.label),datasets:[{label:"Jumlah Dipinjam",data:t.map(a=>a.count),backgroundColor:Do(1)[0],borderRadius:5}]},options:{scales:{y:{beginAtZero:!0,ticks:{precision:0}},x:{display:!Ao()||e==="classifier"}},plugins:{title:{display:!1},legend:{display:!1},tooltip:{enabled:!1,position:"nearest",external:To,externalContext:{data:t}}},onHover:(a,s)=>{a.native.target.style.cursor=s[0]?"pointer":"default"}}};e==="classifier"&&(o.options.plugins.tooltip.enabled=!0,o.options.plugins.tooltip.external=void 0,o.options.plugins.tooltip.externalContext=void 0),Io=kt(Io,"currentLoansChartContainer","currentLoansChart",o)},$o=async(e="name")=>{let t=await _t("loan_history",e),o={type:"line",data:{labels:t.map(a=>a.label),datasets:[{label:"Frekuensi Peminjaman",data:t.map(a=>a.count),fill:!0,backgroundColor:"rgba(37, 211, 102, 0.1)",borderColor:"rgba(37, 211, 102, 1)",tension:.1,pointRadius:4}]},options:{scales:{y:{beginAtZero:!0,ticks:{precision:0}},x:{display:!Ao()||e==="classifier"}},plugins:{title:{display:!1},legend:{display:!1},tooltip:{enabled:!1,position:"nearest",external:To,externalContext:{data:t}}},interaction:{intersect:!1,mode:"index"},onHover:(a,s)=>{a.native.target.style.cursor=s[0]?"pointer":"default"}}};e==="classifier"&&(o.options.plugins.tooltip.enabled=!0,o.options.plugins.tooltip.external=void 0,o.options.plugins.tooltip.externalContext=void 0),Eo=kt(Eo,"loanHistoryChartContainer","loanHistoryChart",o)},qo=()=>{da(),ua();let e=document.querySelector("#currentLoansFilter .btn.active")?.dataset.value||"classifier",t=document.querySelector("#loanHistoryFilter .btn.active")?.dataset.value||"classifier";Co(e),$o(t)},pa=()=>{if(Mo)return;let e=(o,a)=>{document.getElementById(o)?.addEventListener("click",s=>{if(s.target.tagName==="BUTTON"&&!s.target.classList.contains("active")){let n=s.target.dataset.value;s.currentTarget.querySelector(".btn.active").classList.remove("active"),s.target.classList.add("active"),a(n)}})};e("currentLoansFilter",Co),e("loanHistoryFilter",$o),new MutationObserver(o=>{o[0].attributeName==="class"&&setTimeout(qo,50)}).observe(document.documentElement,{attributes:!0}),Mo=!0},Ho=async()=>{qo(),pa(),ca()};var ma=document.getElementById("returnSearch"),fa=document.getElementById("historySearch"),ga=document.getElementById("hamburgerMenu"),ba=document.getElementById("overlay"),ya=document.getElementById("desktopThemeToggle"),Po=document.getElementById("userProfileToggle"),va=document.getElementById("userProfileMenu"),ha=document.getElementById("dropdownLogoutBtn"),wa=document.getElementById("accountBtn"),_a=document.getElementById("autoBackupBtn"),xt=document.getElementById("desktopAppBtn"),ka=document.getElementById("fabFilterDateBtn"),xa=document.getElementById("fabBorrowSelectedBtn"),Ba=document.getElementById("fabDeleteSelectedBtn"),Sa=document.getElementById("fabImportStockBtn"),La=document.getElementById("fabExportStockBtn"),Ia=document.getElementById("fabDeleteSelectedAccountsBtn"),Ea=document.getElementById("fabSelectAllAccountsBtn"),Ma=document.getElementById("fabSelectAllItemsBtn"),Fo=document.getElementById("modal"),Aa=document.getElementById("borrowForm"),Ta=document.getElementById("stockGrid"),ue=!navigator.onLine,F=async e=>{switch(e.substring(1)){case"stock":await Q("items"),Bo();break;case"borrow":await Q("items"),Pe();break;case"return":await Promise.all([Q("borrowals"),Q("items")]),ie();break;case"history":C();break;case"statistics":i.session.role==="admin"?await Ho():await T("#stock");break;case"accounts":i.session.role==="admin"?await ve():await T("#stock");break}},Da=async()=>{navigator.onLine||(B("Koneksi terputus. Anda mungkin melihat status yang kedaluwarsa.","error"),ue=!0);try{await bt(),ze(),ue&&(ue=!1)}catch(e){ue=!0,console.error("Gagal memuat pengaturan awal.",e)}},jo=()=>{let e=new EventSource(`${h}?action=get_lock_stream`);e.addEventListener("lock_update",t=>{let o=JSON.parse(t.data);i.borrowSettings={...i.borrowSettings,isManuallyLocked:o.is_manually_locked,isAppLocked:o.is_app_locked,lockReason:o.lock_reason,startTime:o.borrow_start_time,endTime:o.borrow_end_time,isLoaded:!0},ze(),ue&&(ue=!1)}),e.addEventListener("error",t=>{if(t.data)try{let o=JSON.parse(t.data);if(o.message&&o.message.includes("Sesi tidak valid")){e.close(),B("Sesi Anda telah berakhir, silakan login kembali.","error"),setTimeout(()=>{window.location.href="login/"},2e3);return}}catch{}e.close(),setTimeout(jo,2e3)})},Ca=()=>{let e=document.getElementById("liveClock");if(!e)return;let t=()=>{let o=new Date,s=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"][o.getDay()],n=String(o.getDate()).padStart(2,"0"),r=String(o.getMonth()+1).padStart(2,"0"),l=o.getFullYear(),p=String(o.getHours()).padStart(2,"0"),c=String(o.getMinutes()).padStart(2,"0"),d=String(o.getSeconds()).padStart(2,"0");e.textContent=`${s}, ${n}/${r}/${l} - ${p}:${c}:${d}`};t(),setInterval(t,1e3)},$a=()=>{let e=document.querySelectorAll('#stockGrid .card:not([style*="display: none"])'),o=Array.from(e).map(s=>s.dataset.itemId).filter(s=>{let n=i.items.find(r=>r.id.toString()===s);return n&&n.current_quantity>0});if(o.length>0&&o.every(s=>i.selectedItems.includes(s)))i.selectedItems=i.selectedItems.filter(s=>!o.includes(s));else{let s=new Set([...i.selectedItems,...o]);i.selectedItems=Array.from(s)}e.forEach(s=>{let n=s.dataset.itemId;if(o.includes(n)){let r=i.selectedItems.includes(n);s.classList.toggle("is-selected",r)}}),O()},qa=()=>{window.addEventListener("pageshow",o=>{o.persisted&&Re()}),ga?.addEventListener("click",ae),ba?.addEventListener("click",ae),ya?.addEventListener("click",Je),document.body.addEventListener("click",async o=>{let a=o.target.closest("#nameSuggestions .suggestion-item");if(a){o.stopPropagation();let d=a.closest("form");if(!d)return;let u=d.querySelector("#borrowerName"),f=d.querySelector("#classDropdownContainer");if(!u||!f)return;let b=a.dataset.nama,g=a.dataset.kelas;u.value=b;let v=f.querySelector("#borrowerClassValue"),y=f.querySelector(".hybrid-dropdown__value"),x=f.querySelector(".hybrid-dropdown__placeholder");v&&(v.value=g),y&&(y.textContent=g,y.style.display="block"),x&&(x.style.display="none");let _=d.querySelector("#nameSuggestions");_&&(_.style.display="none");return}o.target.closest(".profile-dropdown")||(document.querySelectorAll(".profile-dropdown__menu.is-open").forEach(d=>d.classList.remove("is-open")),document.querySelectorAll('.profile-dropdown__toggle[aria-expanded="true"]').forEach(d=>d.setAttribute("aria-expanded","false"))),o.target.closest(".nav-dropdown")||document.querySelectorAll(".nav-dropdown.is-open").forEach(d=>{d.classList.remove("is-open"),d.querySelector(".nav-dropdown__toggle").setAttribute("aria-expanded","false")}),o.target.closest(".filter-dropdown")||document.querySelectorAll(".filter-dropdown__menu.show").forEach(d=>d.classList.remove("show")),o.target.closest(".custom-dropdown")||document.querySelectorAll(".custom-dropdown.is-open").forEach(d=>d.classList.remove("is-open")),o.target.closest(".hybrid-dropdown")||document.querySelectorAll(".hybrid-dropdown.is-open").forEach(d=>d.classList.remove("is-open")),o.target.closest(".action-dropdown")||document.querySelectorAll(".action-dropdown.is-open").forEach(d=>d.classList.remove("is-open"));let s=o.target.closest(".fab-multi-action-group");document.querySelectorAll(".fab-multi-action-group.is-open").forEach(d=>{d!==s&&(d.classList.remove("is-open"),d.querySelector(".fab-action").classList.remove("is-open"))}),document.getElementById("stock").classList.contains("active")&&i.selectedItems.length>0&&!o.target.closest(".card")&&!o.target.closest(".fab-container")&&(i.selectedItems=[],document.querySelectorAll("#stockGrid .card.is-selected").forEach(d=>d.classList.remove("is-selected")),O());let r=document.getElementById("accounts");r&&r.classList.contains("active")&&i.selectedAccounts.length>0&&!o.target.closest(".account-list-item")&&!o.target.closest(".fab-container")&&(i.selectedAccounts=[],document.querySelectorAll("#accountList .account-list-item.is-selected").forEach(d=>d.classList.remove("is-selected")),J());let p=o.target.closest(".sidebar__nav .nav__link:not(.theme-toggle)");p&&(o.preventDefault(),T(p.getAttribute("href")),ae());let c=o.target.closest("#mobileUserProfileToggle");if(c){let u=document.getElementById("mobileUserProfileMenu").classList.toggle("is-open");c.setAttribute("aria-expanded",u)}if(o.target.closest("#mobileAccountBtn")&&(ae(),Ee()),o.target.closest("#mobileAutoBackupBtn")){ae();let d=await de();we(d.status!=="idle"?d:null)}o.target.closest("#sidebarLogoutBtn")&&Ke(),o.target.closest(".sidebar__nav .theme-toggle")&&(o.preventDefault(),Je())}),document.querySelector(".header").addEventListener("click",o=>{let a=o.target.closest(".nav__item:not(.nav-dropdown) > .nav__link, .header__logo");a&&(o.preventDefault(),T(a.getAttribute("href")));let s=o.target.closest(".nav-dropdown__toggle");if(s){o.preventDefault();let l=s.closest(".nav-dropdown").classList.toggle("is-open");s.setAttribute("aria-expanded",l)}let n=o.target.closest(".nav-dropdown__menu .nav__link");if(n){o.preventDefault(),T(n.getAttribute("href"));let r=n.closest(".nav-dropdown");r.classList.remove("is-open"),r.querySelector(".nav-dropdown__toggle").setAttribute("aria-expanded","false")}}),document.addEventListener("click",o=>{let a=o.target.closest(".card__action-btn, .return-btn, .add-item-btn, .close-modal-btn, #fabAddItemBtn, .custom-dropdown__selected, .delete-history-btn, #borrowSettingsBtn, .edit-borrowal-btn, .delete-borrowal-btn, #exportActionsBtn, #exportCsvOnlyBtn, #backupToDriveBtn, #flushHistoryBtn, #importCsvBtn, #fabAddAccountBtn, #fabImportAccountsBtn, #fabExportAccountsBtn");if(a){if(a.matches(".edit:not(:disabled)")&&Ae(a.dataset.id),a.matches(".delete:not(:disabled)")&&et(a.dataset.id),a.matches(".borrow-shortcut")){let s=a.dataset.id;i.itemToBorrow=s,T("#borrow")}a.matches(".return-btn")&&rt(a.dataset.id),a.matches(".add-item-btn")&&it(a.dataset.id),a.matches(".edit-borrowal-btn")&&lt(a.dataset.id),a.matches(".delete-borrowal-btn")&&ct(a.dataset.id),a.matches("#fabAddItemBtn")&&Ae(),a.matches("#fabAddAccountBtn")&&st(),a.matches("#fabImportAccountsBtn")&&(o.preventDefault(),z("accounts")),a.matches("#fabExportAccountsBtn")&&(o.preventDefault(),$e()),a.matches(".close-modal-btn")&&k(),a.matches(".custom-dropdown__selected")&&a.closest(".custom-dropdown").classList.toggle("is-open"),a.matches(".delete-history-btn")&&dt(a.dataset.id),a.matches("#borrowSettingsBtn")&&Qe(),a.matches("#exportActionsBtn")&&a.closest(".action-dropdown").classList.toggle("is-open"),a.matches("#exportCsvOnlyBtn")&&(o.preventDefault(),i.history.length>0?mt():B("Tidak ada riwayat untuk diekspor.","error")),a.matches("#importCsvBtn")&&(o.preventDefault(),po()),a.matches("#backupToDriveBtn")&&(o.preventDefault(),i.history.length===0?B("Tidak ada riwayat untuk di-backup.","error"):qe()),a.matches("#flushHistoryBtn:not(:disabled)")&&re()}}),Po?.addEventListener("click",()=>{let o=va.classList.toggle("is-open");Po.setAttribute("aria-expanded",o)}),ha?.addEventListener("click",Ke),wa?.addEventListener("click",Ee),_a?.addEventListener("click",async()=>{let o=await de();we(o.status!=="idle"?o:null)}),xt?.addEventListener("click",Me),ka.addEventListener("click",()=>{let o=document.querySelector(".page.active")?.id;o!=="history"&&o!=="return"||(i.selectedDate?(i.selectedDate=null,be(),o==="history"?C():o==="return"&&ie()):pt())}),xa?.addEventListener("click",()=>{i.selectedItems.length>0&&(i.itemsToBorrow=[...i.selectedItems],i.selectedItems=[],O(),T("#borrow"))}),Ba?.addEventListener("click",()=>{i.selectedItems.length>0&&i.session.role==="admin"&&tt()}),Ia?.addEventListener("click",()=>{i.selectedAccounts.length>0&&i.session.role==="admin"&&nt()}),Ea?.addEventListener("click",()=>{i.session.role==="admin"&&Kt()}),Ma?.addEventListener("click",()=>{i.session.role==="admin"&&$a()}),document.querySelectorAll(".fab-action").forEach(o=>{o.addEventListener("click",a=>{a.stopPropagation(),a.currentTarget.closest(".fab-multi-action-group").classList.toggle("is-open"),a.currentTarget.classList.toggle("is-open")})}),Sa?.addEventListener("click",()=>z("stock")),La?.addEventListener("click",()=>Ce()),Fo.addEventListener("click",o=>{o.target===Fo&&k()}),Ta?.addEventListener("click",o=>{if(o.target.closest(".card__action-btn, .card__borrow-action-container, .card__image-overlay-actions"))return;let a=o.target.closest(".card");if(a){let s=a.dataset.itemId;if(!s)return;let n=i.items.find(l=>l.id==s);if(n&&n.current_quantity<=0){B("Barang ini sedang kosong dan tidak bisa dipilih.","error");return}a.classList.toggle("is-selected");let r=i.selectedItems.indexOf(s);r>-1?i.selectedItems.splice(r,1):i.selectedItems.push(s),O()}}),document.getElementById("fabClearFilterBtn")?.addEventListener("click",()=>{i.currentStockFilter="all",i.currentClassifierFilter=null,G(),Y()}),So(),ma?.addEventListener("input",ie);let t;fa?.addEventListener("input",()=>{clearTimeout(t),t=setTimeout(()=>C(),300)}),Aa?.addEventListener("submit",fo)},Ha=()=>{!/Mobi|Android/i.test(navigator.userAgent)&&xt&&(xt.style.display="flex")};window.addEventListener("load",function(){let e=new Date().getFullYear();console.log(`%c\xA9 Developed by Alea Farrel - ${e} Inventaris TKJ
              All Rights Reserved.`,"background: #222; color: #bada55; font-size:12px; padding:4px; border-radius:4px;")});var Pa=async()=>{if(K(),await Re(),await Promise.all([_e()]),i.session.role==="admin"){let[a,s,n,r]=await Promise.all([bo(),yo(),go(),de()]);a.status!=="idle"&&qe(a),s.status!=="idle"&&(s.export_type==="accounts"?$e(s):Ce(s)),n.status!=="idle"&&z(n.import_type||"stock",n),r.status!=="idle"&&we(r)}let e=localStorage.getItem("lastActivePage")||"#stock";i.session.role!=="admin"&&(e==="#statistics"||e==="#accounts")&&(e="#stock");let t=document.getElementById("filterBtn");t&&(t.className="btn filter-all",t.innerHTML="<i class='bx bx-filter-alt'></i> Semua",i.currentStockFilter="all",i.currentClassifierFilter=null);let o=document.getElementById("accountFilterBtn");o&&(o.className="btn filter-all",o.innerHTML="<i class='bx bx-filter-alt'></i> Semua"),Tt(),qa(),At(),Ca(),G(),ge(),Ha(),await Da(),await T(e),me(),jo()};Pa();})();

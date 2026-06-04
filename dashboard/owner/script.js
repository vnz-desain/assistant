/**
 * MEA ASSISTANT V2 — OWNER DASHBOARD V2 SCRIPT
 * ─────────────────────────────────────────────────────────
 * Deps: ../../assets/theme/config.js
 */

"use strict";

/* ── Session guard ──────────────────────────────────────── */
function getSession() {
  try { return JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY)); }
  catch { return null; }
}

const session = getSession();
if (!session || !session.role) {
  window.location.replace(CONFIG.PATHS.LOGIN);
}
if (session.role !== CONFIG.ROLES.OWNER) {
  window.location.replace(CONFIG.PATHS.DASHBOARD[session.role] || CONFIG.PATHS.DASHBOARD.member);
}

/* ── State ──────────────────────────────────────────────── */
let allUsers     = [];
let activeFilter = "all";
let searchQuery  = "";

/* ── DOM refs ───────────────────────────────────────────── */
const tableLoading = document.getElementById("tableLoading");
const userTable    = document.getElementById("userTable");
const tableBody    = document.getElementById("userTableBody");
const tableEmpty   = document.getElementById("tableEmpty");
const dashAlert    = document.getElementById("dashAlert");

/* ── Set username in sidebar ─────────────────────────────── */
document.getElementById("sidebarUsername").textContent = (session && session.username) ? session.username : "—";
document.querySelectorAll(".nav-parent").forEach(btn => {

  btn.addEventListener("click", () => {

    const group = btn.closest(".nav-group");

    group.classList.toggle("open");

  });

});

/* ══════════════════════════════════════════════════════════
   SIDEBAR NAVIGATION
══════════════════════════════════════════════════════════ */
const sidebar        = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const hamburgerBtn   = document.getElementById("hamburgerBtn");
const topbarPageLabel= document.getElementById("topbarPageLabel");

const PAGE_LABELS = {
  account : "Accounts",
  gmail : "Gmail",
  drive : "Drive",
  oauth : "OAuth Manager",
  logs : "Logs",
  models  : "Models",
  apikeys : "API Keys",
  usage   : "Usage",
  overview  : "Overview",
  users     : "Users",
  account   : "Account Center", /* <--- Tambahkan baris ini */
  email     : "Email Center",
  drive     : "Drive Center",
  ai        : "AI Center",
  analytics : "Analytics",
  settings  : "Settings"
};


function toggleSidebar() {
  const isOpen = sidebar.classList.toggle("open");
  sidebarOverlay.classList.toggle("visible");
  document.body.style.overflow = isOpen ? "hidden" : "";
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("visible");
  document.body.style.overflow = "";
}

// Tombol hamburger sekarang bisa buka dan tutup
hamburgerBtn.addEventListener("click", toggleSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);

/* ── Page switching ─────────────────────────────────────── */
let currentPage = "overview";

function switchPage(pageId) {
  // Deactivate old page
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  // Activate new page
  const page = document.getElementById("page-" + pageId);
  if (page) page.classList.add("active");

  const navBtn = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (navBtn) navBtn.classList.add("active");

  // Update mobile topbar label
  topbarPageLabel.textContent = PAGE_LABELS[pageId] || pageId;

  currentPage = pageId;

  // Load data if switching to users page and not yet loaded
  if (pageId === "users" && allUsers.length === 0) {
    fetchUsers();
  }

  // Close sidebar on mobile after navigation
  closeSidebar();
}

// Menu utama
document.querySelectorAll(".nav-item[data-page]").forEach(btn => {
  btn.addEventListener("click", function () {
    switchPage(this.dataset.page);
  });
});

// Submenu
document.querySelectorAll(".nav-sub-item").forEach(btn => {
  btn.addEventListener("click", function () {
    switchPage(this.dataset.page);
  });
});

/* ── Logout ─────────────────────────────────────────────── */
document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem(CONFIG.SESSION_KEY);
  window.location.replace(CONFIG.PATHS.LOGIN);
});

/* ══════════════════════════════════════════════════════════
   OVERVIEW — CLOCK + DATE
══════════════════════════════════════════════════════════ */
const HARI_ID = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function updateClock() {
  const now  = new Date();
  const wib  = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));

  const hari   = HARI_ID[wib.getDay()];
  const tgl    = wib.getDate();
  const bln    = BULAN_ID[wib.getMonth()];
  const thn    = wib.getFullYear();

  const hh  = String(wib.getHours()).padStart(2, "0");
  const mm  = String(wib.getMinutes()).padStart(2, "0");
  const ss  = String(wib.getSeconds()).padStart(2, "0");

  const greetingEl = document.getElementById("greetingText");
  const dateEl     = document.getElementById("dateDisplay");
  const timeEl     = document.getElementById("timeDisplay");

  if (greetingEl) greetingEl.textContent = "Halo, " + (session.username || "—");
  if (dateEl)     dateEl.textContent     = `${hari}, ${tgl} ${bln} ${thn}`;
  if (timeEl)     timeEl.textContent     = `${hh}:${mm}:${ss} WIB`;
}

updateClock();
setInterval(updateClock, 1000);

/* ── Overview stats (placeholder until backend) ────────── */
document.getElementById("ovStatAccounts").textContent = "—";
document.getElementById("ovStatInbox").textContent    = "—";
document.getElementById("ovStatDrive").textContent    = "—";
document.getElementById("ovStatAI").textContent       = "—";
document.getElementById("ovStatUsers").textContent    = "—";

/* ══════════════════════════════════════════════════════════
   ALERT HELPER
══════════════════════════════════════════════════════════ */
function showAlert(msg, type = "error") {
  dashAlert.textContent = msg;
  dashAlert.className   = "dash-alert" + (type === "success" ? " success" : "");
  dashAlert.hidden      = false;
  setTimeout(() => { dashAlert.hidden = true; }, 4000);
}

/* ══════════════════════════════════════════════════════════
   API CALLER
══════════════════════════════════════════════════════════ */
async function apiFetch(payload) {
  const formData = new URLSearchParams();
  Object.keys(payload).forEach(key => formData.append(key, payload[key]));
  formData.append("sessionUserId", session.userId);

  const res = await fetch(CONFIG.API_URL, {
    method : "POST",
    body   : formData
  });
  return await res.json();
}

/* ══════════════════════════════════════════════════════════
   FETCH USERS
══════════════════════════════════════════════════════════ */
async function fetchUsers() {
  tableLoading.hidden        = false;
  tableLoading.style.display = "";
  userTable.hidden           = true;
  tableEmpty.hidden          = true;

  try {
    const data = await apiFetch({ action: "getUsers" });
    console.log(data);
    if (!data.success) throw new Error(data.message);

    allUsers = data.users || [];

    tableLoading.hidden        = true;
    tableLoading.style.display = "none";

    updateStats();
    renderTable();

    // Sync overview user count
    document.getElementById("ovStatUsers").textContent =
      allUsers.filter(u => u.Status === "approved").length;

  } catch (err) {
    console.error(err);
    showAlert("Gagal memuat data: " + err.message);
    tableLoading.hidden        = true;
    tableLoading.style.display = "none";
  }
}

/* ── Stats ──────────────────────────────────────────────── */
function updateStats() {
  document.getElementById("statTotal").textContent    = allUsers.length;
  document.getElementById("statPending").textContent  = allUsers.filter(u => u.Status === "pending").length;
  document.getElementById("statApproved").textContent = allUsers.filter(u => u.Status === "approved").length;
  document.getElementById("statOwner").textContent    = allUsers.filter(u => u.Role === "owner").length;
}

/* ── Render table ───────────────────────────────────────── */
function renderTable() {
  tableLoading.hidden        = true;
  tableLoading.style.display = "none";

  let filtered = allUsers;

  if (activeFilter !== "all") {
    filtered = filtered.filter(u => u.Status.toLowerCase() === activeFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(u =>
      (u.FullName || "").toLowerCase().includes(q) ||
      (u.Username  || "").toLowerCase().includes(q) ||
      (u.Email     || "").toLowerCase().includes(q)
    );
  }

  if (!filtered.length) {
    userTable.hidden  = true;
    tableEmpty.hidden = false;
    return;
  }

  tableEmpty.hidden        = true;
  userTable.hidden         = false;
  tableBody.innerHTML      = filtered.map(buildRow).join("");
  attachRowListeners();
}

function buildRow(u) {
  const role   = (u.Role   || "member").toLowerCase();
  const status = (u.Status || "pending").toLowerCase();
  const date   = u.CreatedAt
    ? new Date(u.CreatedAt).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" })
    : "—";

  const isSelf     = u.ID === session.userId;
  const canApprove = status === "pending" || status === "rejected";
  const canReject  = status === "approved" || status === "pending";

  return `
<tr data-id="${u.ID}">
  <td class="td-user">
    <div class="td-name">${esc(u.FullName || "—")}</div>
    <div class="td-username">@${esc(u.Username || "—")}</div>
  </td>
  <td class="td-email">${esc(u.Email || "—")}</td>
  <td><span class="role-badge ${role}">${role.toUpperCase()}</span></td>
  <td>
    <span class="status-badge ${status}">
      <span class="status-dot"></span>
      ${status.toUpperCase()}
    </span>
  </td>
  <td class="td-date">${date}</td>
  <td>
    <div class="td-actions">
      ${canApprove && !isSelf ? `<button class="btn-action approve" data-action="approve" data-id="${u.ID}">APPROVE</button>` : ""}
      ${canReject  && !isSelf ? `<button class="btn-action reject"  data-action="reject"  data-id="${u.ID}">REJECT</button>`  : ""}
      ${isSelf ? `<span style="font-family:var(--f-mono);font-size:0.46rem;color:var(--clr-grey)">KAMU</span>` : ""}
    </div>
  </td>
</tr>`;
}

function esc(str) {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

/* ── Row listeners ──────────────────────────────────────── */
function attachRowListeners() {
  tableBody.querySelectorAll(".btn-action").forEach(btn => {
    btn.addEventListener("click", handleAction);
  });
}

async function handleAction(e) {
  const btn    = e.currentTarget;
  const action = btn.dataset.action;
  const userId = btn.dataset.id;

  if (action === "role") {
    openRoleModal(userId, btn.dataset.name, btn.dataset.role);
    return;
  }

  if (!confirm(`Yakin ingin ${action === "approve" ? "menyetujui" : "menolak"} user ini?`)) return;

  btn.disabled = true;
  try {
    const data = await apiFetch({
      action   : action === "approve" ? "approveUser" : "rejectUser",
      targetId : userId,
    });
    if (!data.success) throw new Error(data.message);
    showAlert(action === "approve" ? "User berhasil disetujui." : "User berhasil ditolak.", "success");
    await fetchUsers();
  } catch (err) {
    showAlert("Gagal: " + err.message);
    btn.disabled = false;
  }
}

/* ── Filter tabs ────────────────────────────────────────── */
document.getElementById("filterTabs").addEventListener("click", function (e) {
  const tab = e.target.closest(".filter-tab");
  if (!tab) return;
  document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  activeFilter = tab.dataset.filter;
  renderTable();
});

/* ── Search ─────────────────────────────────────────────── */
document.getElementById("searchInput").addEventListener("input", function () {
  searchQuery = this.value.trim();
  renderTable();
});

/* ── Refresh button ─────────────────────────────────────── */
document.getElementById("refreshBtn").addEventListener("click", fetchUsers);

/* ── AI Center sub-tabs (placeholder) ──────────────────── */
document.querySelectorAll(".ai-tab").forEach(tab => {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".ai-tab").forEach(t => t.classList.remove("active"));
    this.classList.add("active");
  });
});

/* ── Email Center sub-tabs (placeholder) ───────────────── */
document.querySelectorAll(".ph-sidebar-item").forEach(item => {
  item.addEventListener("click", function () {
    const parent = this.closest(".placeholder-sidebar");
    if (!parent) return;
    parent.querySelectorAll(".ph-sidebar-item").forEach(i => i.classList.remove("active"));
    this.classList.add("active");
  });
});

/* ── Initial page load ──────────────────────────────────── */
switchPage("overview");


/* ══════════════════════════════════════════════════════════
   INTEGRASI ACCOUNT CENTER (MEA) - AMAN DARI KONFLIK
══════════════════════════════════════════════════════════ */
const MEA_DB = {
  async getAccounts() {
    return [
      { id:1, email:'admin@gmail.com',   label:'UTAMA',   tagClass:'tag-utama',  status:'active',   twofa:true,  recovery:true,  lastLogin: 2,   lastSync: 0.08, category:'Utama',   archived:false },
      { id:2, email:'bisnis@gmail.com',  label:'BISNIS',  tagClass:'tag-bisnis', status:'active',   twofa:true,  recovery:true,  lastLogin: 1,   lastSync: 0.2,  category:'Bisnis',  archived:false },
      { id:3, email:'testing@gmail.com', label:'TESTING', tagClass:'tag-testing',status:'warning',  twofa:false, recovery:false, lastLogin: 380, lastSync:9999,  category:'Testing', archived:false },
    ];
  },
  async saveAccount(acc) { return acc; },
  async archiveAccount(id) { },
  async getTgToken() { return localStorage.getItem('mea_tg_token') || ''; },
  async saveTgToken(token) {
    localStorage.setItem('mea_tg_token', token);
    return true;
  }
};

const MEA_TG = {
  async notify(message) {
    const token = await MEA_DB.getTgToken();
    const chatId = localStorage.getItem('mea_tg_chat_id');
    if (!token || !chatId) return;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
    });
  }
};

let meaAccounts = [];
let meaFiltered = [];
let meaSelected = null;
let meaViewMode = 'card';
let meaTgConnected = false;

function meaStatusDot(st) { return st==='active' ? 'dot-green' : (st==='warning' ? 'dot-amber' : (st==='inactive' ? 'dot-red' : 'dot-gray')); }
function meaComputeStatus(a) { return a.archived ? 'archived' : (a.lastLogin > 360 ? 'warning' : (a.status==='inactive' ? 'inactive' : 'active')); }

function meaRenderStats() {
  const t = document.getElementById('stat-total');
  const a = document.getElementById('stat-active');
  const w = document.getElementById('stat-warn');
  const r = document.getElementById('stat-arch');
  if(t) t.textContent = meaAccounts.length;
  if(a) a.textContent = meaAccounts.filter(acc=>meaComputeStatus(acc)==='active').length;
  if(w) w.textContent = meaAccounts.filter(acc=>meaComputeStatus(acc)==='warning').length;
  if(r) r.textContent = meaAccounts.filter(acc=>meaComputeStatus(acc)==='archived').length;
}

function meaRenderCards() {
  const el = document.getElementById('view-card');
  if(!el) return;
  if (!meaFiltered.length) return el.innerHTML = '<div class="mea-empty"><i data-lucide="inbox"></i><br>Tidak ada akun</div>';
  el.innerHTML = meaFiltered.map(a => {
    const st = meaComputeStatus(a);
    const isWarn = st === 'warning';
    const isSel  = meaSelected && meaSelected.id === a.id;
    return `<div class="mea-acc-card${isSel?' selected':''}${isWarn?' warn-card':''}" onclick="meaSelectAccount(${a.id})">
      <span class="mea-status-dot ${meaStatusDot(st)}"></span>
      <span class="mea-card-email">${a.email}</span>
      <span class="mea-acc-tag ${a.tagClass}">${a.label}</span>
    </div>`;
  }).join('');
  if (window.lucide) lucide.createIcons();
}

function meaRenderTable() {
  const tbody = document.getElementById('table-body');
  if(!tbody) return;
  if (!meaFiltered.length) return tbody.innerHTML = `<tr><td colspan="4" class="mea-empty">Tidak ada akun</td></tr>`;
  tbody.innerHTML = meaFiltered.map(a => {
    const st = meaComputeStatus(a);
    const isSel = meaSelected && meaSelected.id === a.id;
    return `<tr class="${isSel?'selected':''}" onclick="meaSelectAccount(${a.id})">
      <td><span class="mea-status-dot ${meaStatusDot(st)}"></span></td>
      <td class="mono">${a.email}</td>
      <td><span class="mea-acc-tag ${a.tagClass}">${a.label}</span></td>
      <td></td>
    </tr>`;
  }).join('');
  if (window.lucide) lucide.createIcons();
}

function meaSelectAccount(id) {
  meaSelected = meaAccounts.find(a=>a.id===id) || null;
  const layout = document.getElementById('account-layout');
  const detail = document.getElementById('detail-panel');
  if (meaSelected && layout && detail) {
    layout.classList.add('detail-open');
    detail.classList.add('open');
    document.getElementById('d-avatar').textContent = meaSelected.email.slice(0,2).toUpperCase();
    document.getElementById('d-email').textContent = meaSelected.email;
    const st = meaComputeStatus(meaSelected);
    if(st === 'warning') {
      document.getElementById('d-warn').style.style.display='flex';
      document.getElementById('d-warn-msg').textContent=`Akun tidak terdeteksi login ${Math.round(meaSelected.lastLogin)} hari.`;
    } else {
      document.getElementById('d-warn').style.display='none';
    }
  } else { meaCloseDetail(); }
  meaRenderAll();
}

function meaCloseDetail() {
  meaSelected = null;
  const layout = document.getElementById('account-layout');
  const detail = document.getElementById('detail-panel');
  if(layout) layout.classList.remove('detail-open');
  if(detail) detail.classList.remove('open');
  meaRenderAll();
}

function setView(mode) {
  meaViewMode = mode;
  const vc = document.getElementById('view-card');
  const vt = document.getElementById('view-table');
  const bc = document.getElementById('btn-card');
  const bt = document.getElementById('btn-table');
  if(vc) vc.style.display = mode==='card' ? '' : 'none';
  if(vt) vt.style.display = mode==='table' ? '' : 'none';
  if(bc) bc.classList.toggle('active', mode==='card');
  if(bt) bt.classList.toggle('active', mode==='table');
  meaRenderAll();
}

function meaRenderAll() { meaRenderCards(); meaRenderTable(); }

/* ─── BOT TELEGRAM REAL TIME INTEGRATION ─── */
function openTgModal() { 
  const m = document.getElementById('tg-modal');
  if(m) m.classList.add('open'); 
  MEA_DB.getTgToken().then(t=>{ if(t && document.getElementById('tg-token-input')) document.getElementById('tg-token-input').value=t; });
}
function closeTgModal() { 
  const m = document.getElementById('tg-modal');
  if(m) m.classList.remove('open'); 
}

async function saveTgToken() {
  const tokenInput = document.getElementById('tg-token-input');
  const statusEl = document.getElementById('tg-token-status');
  const btn = document.getElementById('tg-save-btn');
  if(!tokenInput || !statusEl || !btn) return;
  
  const token = tokenInput.value.trim();
  if (!token) return;
  btn.textContent = 'Mencari Chat ID...';
  
  try {
    let res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    let data = await res.json();
    if (data.ok && data.result.length > 0) {
      let chatId = data.result[data.result.length - 1].message.chat.id;
      localStorage.setItem('mea_tg_chat_id', chatId);
      await MEA_DB.saveTgToken(token);
      meaTgConnected = true;
      statusEl.textContent = `✓ Bot terhubung (ID: ${chatId})`;
      statusEl.style.color = '#22c55e';
      
      const text = document.getElementById('tg-status-text');
      const actionBtn  = document.getElementById('tg-action-btn');
      if(actionBtn) {
        actionBtn.textContent = 'Tersambung';
        actionBtn.style.background='rgba(34,197,94,.15)';
        actionBtn.style.borderColor='rgba(34,197,94,.3)';
        actionBtn.style.color='#22c55e';
      }
      if(text) text.textContent = 'Bot aktif — notifikasi peringatan akan dikirim otomatis.';
      
      MEA_TG.notify("✅ <b>Sukses!</b>\nBot Telegram MEA berhasil dihubungkan ke dashboard Anda.");
      setTimeout(closeTgModal, 1500);
    } else {
      statusEl.textContent = '❌ Chat ID tidak ditemukan. Kirim 1 pesan apa saja ke bot Telegram Anda terlebih dahulu, lalu klik Simpan kembali.';
      statusEl.style.color = '#e03535';
    }
  } catch(e) {
    statusEl.textContent = '❌ Token salah atau koneksi bermasalah.';
    statusEl.style.color = '#e03535';
  }
  btn.textContent = 'Simpan';
}

async function initAccountCenter() {
  meaAccounts = await MEA_DB.getAccounts();
  meaFiltered = meaAccounts.filter(a=>!a.archived);
  meaRenderStats();
  setView('card');
  const localToken = await MEA_DB.getTgToken();
  const localChat = localStorage.getItem('mea_tg_chat_id');
  if (localToken && localChat) {
    meaTgConnected = true;
    const ab = document.getElementById('tg-action-btn');
    const st = document.getElementById('tg-status-text');
    if(ab) ab.textContent = 'Tersambung';
    if(st) st.textContent = 'Bot aktif — notifikasi akan dikirim saat ada peringatan akun';
  }
  if (window.lucide) lucide.createIcons();
}

// Interseptor halaman: JALANKAN SEWAKTU DI-SWITCH KE HALAMAN ACCOUNT CENTER
const originalSwitchPage = window.switchPage;
window.switchPage = function(pageId) {
  if (originalSwitchPage) originalSwitchPage(pageId);
  if (pageId === "account") {
    initAccountCenter();
  }
};

// Pasang event luar modal
const tgM = document.getElementById('tg-modal');
if(tgM) {
  tgM.addEventListener('click', function(e){
    if(e.target===this) closeTgModal();
  });
      }
  

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
   INTEGRASI ACCOUNT CENTER (MEA)
══════════════════════════════════════════════════════════ */
const DB = {
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

const TG = {
  async notify(message) {
    const token = await DB.getTgToken();
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
let tgConnected = false;

// Helpers & Render logic
function statusDot(st) { return st==='active' ? 'dot-green' : (st==='warning' ? 'dot-amber' : (st==='inactive' ? 'dot-red' : 'dot-gray')); }
function computeStatus(a) { return a.archived ? 'archived' : (a.lastLogin > 360 ? 'warning' : (a.status==='inactive' ? 'inactive' : 'active')); }
function fmtDays(d) { return d===9999?'Gagal':(d<1/24?'Baru saja':(d<1?Math.round(d*24)+' jam lalu':(d<30?Math.round(d)+' hari lalu':Math.round(d/30)+' bln lalu'))); }

function renderStats() {
  document.getElementById('stat-total').textContent = meaAccounts.length;
  document.getElementById('stat-active').textContent = meaAccounts.filter(a=>computeStatus(a)==='active').length;
  document.getElementById('stat-warn').textContent = meaAccounts.filter(a=>computeStatus(a)==='warning').length;
  document.getElementById('stat-arch').textContent = meaAccounts.filter(a=>computeStatus(a)==='archived').length;
}

function renderCards() {
  const el = document.getElementById('view-card');
  if (!meaFiltered.length) return el.innerHTML = '<div class="mea-empty"><i data-lucide="inbox"></i><br>Tidak ada akun</div>';
  el.innerHTML = meaFiltered.map(a => {
    const st = computeStatus(a);
    const isWarn = st === 'warning';
    const isSel  = meaSelected && meaSelected.id === a.id;
    return `<div class="mea-acc-card${isSel?' selected':''}${isWarn?' warn-card':''}" onclick="selectAccount(${a.id})">
      <span class="mea-status-dot ${statusDot(st)}"></span>
      <span class="mea-card-email">${a.email}</span>
      <span class="mea-acc-tag ${a.tagClass}">${a.label}</span>
    </div>`;
  }).join('');
  if (window.lucide) lucide.createIcons();
}

function renderTable() {
  const tbody = document.getElementById('table-body');
  if (!meaFiltered.length) return tbody.innerHTML = `<tr><td colspan="4" class="mea-empty">Tidak ada akun</td></tr>`;
  tbody.innerHTML = meaFiltered.map(a => {
    const st = computeStatus(a);
    const isSel = meaSelected && meaSelected.id === a.id;
    return `<tr class="${isSel?'selected':''}" onclick="selectAccount(${a.id})">
      <td><span class="mea-status-dot ${statusDot(st)}"></span></td>
      <td class="mono">${a.email}</td>
      <td><span class="mea-acc-tag ${a.tagClass}">${a.label}</span></td>
      <td></td>
    </tr>`;
  }).join('');
  if (window.lucide) lucide.createIcons();
}

function selectAccount(id) {
  meaSelected = meaAccounts.find(a=>a.id===id) || null;
  const layout = document.getElementById('account-layout');
  const detail = document.getElementById('detail-panel');
  if (meaSelected) {
    layout.classList.add('detail-open');
    detail.classList.add('open');
    document.getElementById('d-avatar').textContent = meaSelected.email.slice(0,2).toUpperCase();
    document.getElementById('d-email').textContent = meaSelected.email;
    const st = computeStatus(meaSelected);
    if(st === 'warning') {
      document.getElementById('d-warn').style.display='flex';
      document.getElementById('d-warn-msg').textContent=`Akun tidak terdeteksi login ${Math.round(meaSelected.lastLogin)} hari.`;
    } else document.getElementById('d-warn').style.display='none';
  } else { closeDetail(); }
  renderAll();
}

function closeDetail() {
  meaSelected = null;
  document.getElementById('account-layout').classList.remove('detail-open');
  document.getElementById('detail-panel').classList.remove('open');
  renderAll();
}

function setView(mode) {
  meaViewMode = mode;
  document.getElementById('view-card').style.display = mode==='card' ? '' : 'none';
  document.getElementById('view-table').style.display = mode==='table' ? '' : 'none';
  document.getElementById('btn-card').classList.toggle('active', mode==='card');
  document.getElementById('btn-table').classList.toggle('active', mode==='table');
  renderAll();
}

function renderAll() { renderCards(); renderTable(); }

/* ─── Telegram Bot Logic (Penerapan Real) ─── */
function openTgModal() { 
  document.getElementById('tg-modal').classList.add('open'); 
  DB.getTgToken().then(t=>{ if(t) document.getElementById('tg-token-input').value=t; });
}
function closeTgModal() { document.getElementById('tg-modal').classList.remove('open'); }

async function saveTgToken() {
  const token = document.getElementById('tg-token-input').value.trim();
  const statusEl = document.getElementById('tg-token-status');
  const btn = document.getElementById('tg-save-btn');
  if (!token) return;
  
  btn.textContent = 'Mencari Chat ID...';
  
  // Mencoba mencari Chat ID dari pesan terakhir bot via getUpdates
  try {
    let res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    let data = await res.json();
    if (data.ok && data.result.length > 0) {
      let chatId = data.result[data.result.length - 1].message.chat.id;
      localStorage.setItem('mea_tg_chat_id', chatId);
      await DB.saveTgToken(token);
      tgConnected = true;
      statusEl.textContent = `✓ Bot terhubung (ID: ${chatId})`;
      statusEl.style.color = '#22c55e';
      
      const text = document.getElementById('tg-status-text');
      const actionBtn  = document.getElementById('tg-action-btn');
      actionBtn.textContent = 'Tersambung';
      actionBtn.style.background='rgba(34,197,94,.15)';
      actionBtn.style.borderColor='rgba(34,197,94,.3)';
      actionBtn.style.color='#22c55e';
      text.textContent = 'Bot aktif — notifikasi peringatan akan dikirim otomatis.';
      
      TG.notify("✅ <b>Sukses!</b>\nBot Telegram MEA berhasil dihubungkan ke dashboard Anda.");
      setTimeout(closeTgModal, 1500);
    } else {
      statusEl.textContent = '❌ Chat ID tidak ditemukan. Kirim 1 pesan ke bot Anda sekarang lalu klik Simpan lagi.';
      statusEl.style.color = '#e03535';
    }
  } catch(e) {
    statusEl.textContent = '❌ Token tidak valid / Error jaringan.';
    statusEl.style.color = '#e03535';
  }
  btn.textContent = 'Simpan';
}

async function initAccountCenter() {
  meaAccounts = await DB.getAccounts();
  meaFiltered = meaAccounts.filter(a=>!a.archived);
  renderStats();
  setView('card');
  if (await DB.getTgToken() && localStorage.getItem('mea_tg_chat_id')) {
    tgConnected = true;
    document.getElementById('tg-action-btn').textContent = 'Tersambung';
    document.getElementById('tg-status-text').textContent = 'Bot aktif — notifikasi akan dikirim saat ada peringatan';
  }
  if (window.lucide) lucide.createIcons();
}

// Inisialisasi saat window dimuat
window.addEventListener('DOMContentLoaded', initAccountCenter);

// Tutup modal jika klik luar
document.getElementById('tg-modal').addEventListener('click', function(e){
  if(e.target===this) closeTgModal();
});

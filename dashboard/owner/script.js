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

document.querySelectorAll(".nav-item[data-page]").forEach(btn => {
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

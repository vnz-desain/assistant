/**
 * MEA ASSISTANT V2 — MEMBER DASHBOARD SCRIPT
 */
"use strict";

function getSession() {
  try { return JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY)); }
  catch { return null; }
}

const session = getSession();
if (!session || !session.role) {
  window.location.replace(CONFIG.PATHS.LOGIN);
} else if (session.role !== CONFIG.ROLES.MEMBER) {
  window.location.replace(CONFIG.PATHS.DASHBOARD[session.role] || CONFIG.PATHS.DASHBOARD.member);
}

document.getElementById("topbarName").textContent  = session.username || "—";
document.getElementById("welcomeName").textContent = session.fullName || session.username || "—";

document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem(CONFIG.SESSION_KEY);
  window.location.replace(CONFIG.PATHS.LOGIN);
});

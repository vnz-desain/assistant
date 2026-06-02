/**
 * MEA ASSISTANT V2 — GLOBAL CONFIG
 * ─────────────────────────────────────────────────────────
 * Semua halaman membaca CONFIG ini.
 * Ganti API_URL dengan URL Google Apps Script Web App kamu.
 * JANGAN hardcode URL di file lain.
 */

const CONFIG = {
  APP_NAME     : "MEA Assistant",
  VERSION      : "2.1.0",

  // ── GANTI dengan URL Apps Script Web App setelah deploy ──
  API_URL      : "GANTI_DENGAN_URL_APPS_SCRIPT",

  // Roles
  ROLES: {
    OWNER  : "owner",
    ADMIN  : "admin",
    MEMBER : "member",
  },

  // Default untuk user baru
  DEFAULT_ROLE   : "member",
  DEFAULT_STATUS : "pending",

  // Session key (localStorage)
  SESSION_KEY : "mea_session",

  // Redirect paths (relative dari root project)
  PATHS: {
    LOGIN     : "/login/",
    REGISTER  : "/register/",
    DASHBOARD : {
      owner  : "/dashboard/owner/",
      admin  : "/dashboard/admin/",
      member : "/dashboard/member/",
    },
  },
};

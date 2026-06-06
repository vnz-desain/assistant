/**
 * MEA ASSISTANT V2 — CORE CONFIG & INITIALIZER
 * Menangani masalah dependensi dengan event-based loading
 */

(function() {
  window.CONFIG = {
    SESSION_KEY: "mea_user_session",
    PATHS: {
      LOGIN: "/login/",
      DASHBOARD: {
        owner: "/dashboard/owner/",
        admin: "/dashboard/admin/",
        member: "/dashboard/member/"
      }
    }
  };

  // Tandai bahwa konfigurasi telah siap
  window.dispatchEvent(new CustomEvent('mea:config-ready'));
  console.log("Config loaded & dispatched.");
})();

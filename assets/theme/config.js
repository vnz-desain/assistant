/**
 * ============================================================
 * MEA ASSISTANT V2 — GLOBAL CONFIGURATION
 * ============================================================
 * Mengelola state global, metadata platform, dan endpoint backend.
 * Pastikan API_URL diisi setelah deployment Google Apps Script.
 */

const CONFIG = {
  APP_NAME: "MEA Assistant",
  VERSION: "2.1.0",
  
  // Masukkan URL Web App Google Apps Script Anda di bawah ini setelah deployment
  API_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  
  ROLES: {
    OWNER: "owner",
    ADMIN: "admin",
    MEMBER: "member"
  },
  
  STATUS: {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected"
  },
  
  SESSION_KEY: "mea_session_v2"
};

// Bekukan objek agar tidak dapat dimodifikasi secara runtime oleh script lain
Object.freeze(CONFIG);
  

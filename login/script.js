/**
 * MEA ASSISTANT V2 — LOGIN SCRIPT
 * ─────────────────────────────────────────────────────────
 * Deps: ../assets/theme/config.js (loaded before this file)
 */

"use strict";

/* ── Utils ─────────────────────────────────────────────── */

/**
 * SHA-256 hash (Web Crypto API — no external lib needed)
 * @param {string} str
 * @returns {Promise<string>} hex string
 */
async function sha256(str) {
  const buf  = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Show or hide the alert box */
function showAlert(msg, type = "error") {
  const box = document.getElementById("alertBox");
  box.textContent = msg;
  box.className   = "auth-alert" + (type !== "error" ? " " + type : "");
  box.hidden      = false;
}
function hideAlert() {
  document.getElementById("alertBox").hidden = true;
}

/** Set field error message */
function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
  const input = document.getElementById(id.replace("Err", ""));
  if (input) input.classList.toggle("error", !!msg);
}
function clearErrors() {
  ["identifierErr","passwordErr"].forEach(id => setError(id, ""));
}

/** Toggle loading state on submit button */
function setLoading(on) {
  const btn = document.getElementById("loginBtn");
  btn.classList.toggle("loading", on);
  btn.disabled = on;
}

/* ── Session helpers ────────────────────────────────────── */

function saveSession(data) {
  const session = {
    userId    : data.userId,
    username  : data.username,
    fullName  : data.fullName,
    role      : data.role,
    loginTime : new Date().toISOString(),
  };
  localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(session));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));
  } catch {
    return null;
  }
}

function redirectByRole(role) {
  const paths = CONFIG.PATHS.DASHBOARD;
  const dest  = paths[role] || paths.member;
  window.location.replace(dest);
}

/* ── Guard: already logged in → redirect ───────────────── */
(function checkExistingSession() {
  const s = getSession();
  if (s && s.role) {
    redirectByRole(s.role);
  }
})();

/* ── Password toggle ────────────────────────────────────── */
document.getElementById("togglePw").addEventListener("click", function () {
  const pw = document.getElementById("password");
  const isHidden = pw.type === "password";
  pw.type = isHidden ? "text" : "password";

  // Swap icon
  document.getElementById("eyeIcon").innerHTML = isHidden
    ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
});

/* ── Validate ───────────────────────────────────────────── */
function validate() {
  let ok = true;
  const identifier = document.getElementById("identifier").value.trim();
  const password   = document.getElementById("password").value;

  clearErrors();
  hideAlert();

  if (!identifier) {
    setError("identifierErr", "Username atau email wajib diisi.");
    ok = false;
  }
  if (!password) {
    setError("passwordErr", "Password wajib diisi.");
    ok = false;
  }
  return ok;
}

/* ── Submit ─────────────────────────────────────────────── */
async function handleLogin() {
if (!validate()) return;

const identifier = document.getElementById("identifier").value.trim();
const password   = document.getElementById("password").value;

setLoading(true);

try {
async function handleLogin() {
  if (!validate()) return;

  const identifier = document.getElementById("identifier").value.trim();
  const password   = document.getElementById("password").value;

  setLoading(true);

  try {

    const { data: userData, error: userError } = await MEASupabase
      .from("users")
      .select("*")
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .single();

    if (userError || !userData) {
      showAlert("Akun tidak ditemukan.");
      setLoading(false);
      return;
    }

    const { data, error } = await MEASupabase.auth.signInWithPassword({
      email: userData.email,
      password: password
    });

    if (error) {
      showAlert("Password salah.");
      setLoading(false);
      return;
    }

    if (!data.user.email_confirmed_at) {
      showAlert("Silakan verifikasi email terlebih dahulu.");
      await MEASupabase.auth.signOut();
      setLoading(false);
      return;
    }

    saveSession({
      userId: userData.id,
      username: userData.username,
      fullName: userData.full_name,
      role: userData.role
    });

    redirectByRole(userData.role);

  } catch (err) {
    console.error(err);
    showAlert("Gagal login.");
    setLoading(false);
  }
}

if (!data.success) {
  if (data.code === "PENDING") {
    showAlert("Akun masih menunggu persetujuan administrator.", "warning");
  } else if (data.code === "REJECTED") {
    showAlert("Akun kamu telah ditolak. Hubungi administrator.", "error");
  } else {
    showAlert(data.message || "Username/email atau password salah.");
  }

  setLoading(false);
  return;
}

saveSession(data.user);
redirectByRole(data.user.role);

} catch (err) {
console.error("Login error:", err);
showAlert("Gagal terhubung ke server. Coba lagi.");
setLoading(false);
}
}
/* ── Event listeners ────────────────────────────────────── */
document.getElementById("loginBtn").addEventListener("click", handleLogin);

// Allow Enter key
document.getElementById("loginForm").addEventListener("keydown", function (e) {
  if (e.key === "Enter") handleLogin();
});

/**
 * MEA ASSISTANT V2 — LOGIN SCRIPT (Supabase 100%)
 * ─────────────────────────────────────────────────────────
 * Deps (load order di HTML):
 *   1. supabase CDN
 *   2. /assets/js/supabase-client.js
 *   3. /assets/theme/config.js
 *   4. script.js  ← file ini
 *
 * Hapus semua referensi CONFIG.API_URL dari halaman login.
 * ─────────────────────────────────────────────────────────
 */

"use strict";

/* ══════════════════════════════════════════════════════════
   UI HELPERS
   ══════════════════════════════════════════════════════════ */

function showAlert(msg, type = "error") {
  const box = document.getElementById("alertBox");
  box.textContent = msg;
  box.className   = "auth-alert" + (type !== "error" ? " " + type : "");
  box.hidden      = false;
}
function hideAlert() {
  const box = document.getElementById("alertBox");
  if (box) box.hidden = true;
}

function setError(id, msg) {
  const el    = document.getElementById(id);
  const input = document.getElementById(id.replace("Err", ""));
  if (el)    el.textContent = msg;
  if (input) input.classList.toggle("error", !!msg);
}
function clearErrors() {
  ["identifierErr", "passwordErr"].forEach(id => setError(id, ""));
}

function setLoading(on) {
  const btn = document.getElementById("loginBtn");
  if (!btn) return;
  btn.classList.toggle("loading", on);
  btn.disabled = on;
}

/* ══════════════════════════════════════════════════════════
   SESSION HELPERS
   ══════════════════════════════════════════════════════════ */

/**
 * Simpan data profil tambahan ke localStorage.
 * Session utama dikelola Supabase (cookie/localStorage internal).
 */
function saveProfileCache(userData) {
  const profile = {
    userId   : userData.id,
    username : userData.username,
    fullName : userData.full_name,
    role     : userData.role,
    status   : userData.status,
  };
  localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(profile));
}

function getProfileCache() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));
  } catch {
    return null;
  }
}

function clearProfileCache() {
  localStorage.removeItem(CONFIG.SESSION_KEY);
}

function redirectByRole(role) {
  const paths = CONFIG.PATHS.DASHBOARD;
  const dest  = paths[role] || paths.member;
  window.location.replace(dest);
}

/* ══════════════════════════════════════════════════════════
   GUARD: SUDAH LOGIN → REDIRECT
   ══════════════════════════════════════════════════════════ */

(async function checkExistingSession() {
  const client = MEASupabase.getClient();
  if (!client) return;

  const { data: { session } } = await client.auth.getSession();
  if (!session) {
    // Bersihkan cache lama jika session Supabase sudah habis
    clearProfileCache();
    return;
  }

  // Session masih valid → ambil profil dan redirect
  const cache = getProfileCache();
  if (cache && cache.role) {
    redirectByRole(cache.role);
    return;
  }

  // Cache tidak ada → fetch dari DB
  const { data: userData } = await MEASupabase
    .from("users")
    .select("id, username, full_name, role, status")
    .eq("auth_id", session.user.id)
    .single();

  if (userData && userData.status === "active") {
    saveProfileCache(userData);
    redirectByRole(userData.role);
  }
})();

/* ══════════════════════════════════════════════════════════
   PASSWORD TOGGLE
   ══════════════════════════════════════════════════════════ */

const togglePwBtn = document.getElementById("togglePw");
if (togglePwBtn) {
  togglePwBtn.addEventListener("click", function () {
    const pw       = document.getElementById("password");
    const isHidden = pw.type === "password";
    pw.type        = isHidden ? "text" : "password";

    const eyeIcon = document.getElementById("eyeIcon");
    if (eyeIcon) {
      eyeIcon.innerHTML = isHidden
        ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
           <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
           <line x1="1" y1="1" x2="23" y2="23"/>`
        : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
           <circle cx="12" cy="12" r="3"/>`;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   VALIDASI
   ══════════════════════════════════════════════════════════ */

function validate() {
  clearErrors();
  hideAlert();
  let ok = true;

  const identifier = document.getElementById("identifier").value.trim();
  const password   = document.getElementById("password").value;

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

/* ══════════════════════════════════════════════════════════
   CORE: HANDLE LOGIN
   ══════════════════════════════════════════════════════════ */

async function handleLogin() {
  if (!validate()) return;

  const identifier = document.getElementById("identifier").value.trim();
  const password   = document.getElementById("password").value;

  setLoading(true);

  try {
    /* ── Step 1: Cari user di public.users (support username/email) ── */
    const isEmail    = identifier.includes("@");
    const filterCol  = isEmail ? "email" : "username";

    const { data: userData, error: userError } = await MEASupabase
      .from("users")
      .select("id, auth_id, email, username, full_name, role, status, email_verified")
      .eq(filterCol, identifier)
      .single();

    if (userError || !userData) {
      showAlert("Akun tidak ditemukan.");
      setLoading(false);
      return;
    }

    /* ── Step 2: Cek status akun ─────────────────────────────────── */
    if (userData.status === "pending") {
      showAlert("Akun kamu masih menunggu persetujuan administrator.", "warning");
      setLoading(false);
      return;
    }

    if (userData.status === "rejected") {
      showAlert("Akun kamu telah ditolak. Hubungi administrator.", "error");
      setLoading(false);
      return;
    }

    if (userData.status !== "active") {
      showAlert("Akun tidak aktif. Hubungi administrator.");
      setLoading(false);
      return;
    }

    /* ── Step 3: Supabase Auth sign-in ───────────────────────────── */
    const { data: authData, error: authError } = await MEASupabase
      .auth.signInWithPassword({
        email    : userData.email,
        password : password,
      });

    if (authError) {
      // Supabase mengembalikan generic error untuk password salah
      showAlert("Password salah.");
      setLoading(false);
      return;
    }

    /* ── Step 4: Cek email verified (via Supabase auth.users) ─────── */
    if (!authData.user.email_confirmed_at) {
      showAlert(
        "Email belum diverifikasi. Cek inbox/spam untuk link verifikasi.",
        "warning"
      );
      // Sign out agar tidak ada session yang tersimpan
      await MEASupabase.auth.signOut();
      setLoading(false);
      return;
    }

    /* ── Step 5: Update last_login ───────────────────────────────── */
    await MEASupabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("auth_id", authData.user.id);

    /* ── Step 6: Simpan profil cache & redirect ──────────────────── */
    saveProfileCache(userData);
    redirectByRole(userData.role);

  } catch (err) {
    console.error("[Login] Unexpected error:", err);
    showAlert("Gagal terhubung ke server. Coba lagi.");
    setLoading(false);
  }
}


/* ══════════════════════════════════════════════════════════
   EVENT LISTENERS
   ══════════════════════════════════════════════════════════ */

document.getElementById("loginBtn")
  .addEventListener("click", handleLogin);

document.getElementById("loginForm")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") handleLogin();
  });

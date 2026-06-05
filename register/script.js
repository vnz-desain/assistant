/**
 * MEA ASSISTANT V2 — REGISTER SCRIPT (Supabase 100%)
 * ─────────────────────────────────────────────────────────
 * Deps (load order di HTML):
 *   1. supabase CDN
 *   2. /assets/js/supabase-client.js
 *   3. /assets/theme/config.js
 *   4. script.js  ← file ini
 *
 * NOTE: insert ke public.users dilakukan oleh SQL trigger
 * (lihat schema-users.sql) sehingga script ini TIDAK perlu
 * melakukan insert manual. Jika trigger belum dipasang,
 * ada fallback insert di bawah (dikomentari, bisa diaktifkan).
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

const FIELDS = ["fullName", "username", "email", "password", "confirmPassword"];

function setError(field, msg) {
  const err   = document.getElementById(field + "Err");
  const input = document.getElementById(field);
  if (err)   err.textContent = msg;
  if (input) input.classList.toggle("error", !!msg);
}
function clearErrors() {
  FIELDS.forEach(f => setError(f, ""));
}

function setLoading(on) {
  const btn = document.getElementById("registerBtn");
  if (!btn) return;
  btn.classList.toggle("loading", on);
  btn.disabled = on;
}

/* ══════════════════════════════════════════════════════════
   PASSWORD TOGGLE
   ══════════════════════════════════════════════════════════ */

function makeToggle(btnId, inputId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener("click", function () {
    const pw = document.getElementById(inputId);
    if (pw) pw.type = pw.type === "password" ? "text" : "password";
  });
}
makeToggle("togglePw",      "password");
makeToggle("toggleConfirm", "confirmPassword");

/* ══════════════════════════════════════════════════════════
   PASSWORD STRENGTH
   ══════════════════════════════════════════════════════════ */

const pwInput = document.getElementById("password");
if (pwInput) {
  pwInput.addEventListener("input", function () {
    const val   = this.value;
    const bar   = document.getElementById("pwStrength");
    const fill  = document.getElementById("pwFill");
    const label = document.getElementById("pwLabel");

    if (!val || !bar) return (bar && (bar.hidden = true));
    bar.hidden = false;

    let strength = 0;
    if (val.length >= 8)           strength++;
    if (/[A-Z]/.test(val))         strength++;
    if (/[0-9]/.test(val))         strength++;
    if (/[^A-Za-z0-9]/.test(val))  strength++;

    const cls = strength <= 1 ? "weak" : strength <= 3 ? "medium" : "strong";
    if (fill)  fill.className   = "pw-strength-fill "  + cls;
    if (label) {
      label.className   = "pw-strength-label " + cls;
      label.textContent = cls === "weak" ? "LEMAH" : cls === "medium" ? "SEDANG" : "KUAT";
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

  const fullName = document.getElementById("fullName").value.trim();
  const username = document.getElementById("username").value.trim();
  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm  = document.getElementById("confirmPassword").value;

  if (!fullName) {
    setError("fullName", "Nama lengkap wajib diisi.");
    ok = false;
  }

  if (!username) {
    setError("username", "Username wajib diisi.");
    ok = false;
  } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
    setError("username", "Hanya huruf, angka, underscore. Min 3 karakter.");
    ok = false;
  }

  if (!email) {
    setError("email", "Email wajib diisi.");
    ok = false;
  } else if (!/^[^\s@]+@(gmail\.com|yahoo\.com)$/i.test(email)) {
    setError("email", "Hanya Gmail atau Yahoo yang diperbolehkan.");
    ok = false;
  }

  if (!password) {
    setError("password", "Password wajib diisi.");
    ok = false;
  } else if (password.length < 8) {
    setError("password", "Password minimal 8 karakter.");
    ok = false;
  }

  if (!confirm) {
    setError("confirmPassword", "Konfirmasi password wajib diisi.");
    ok = false;
  } else if (password && confirm !== password) {
    setError("confirmPassword", "Password tidak cocok.");
    ok = false;
  }

  return ok;
}

/* ══════════════════════════════════════════════════════════
   APPROVE MODE HELPER
   ══════════════════════════════════════════════════════════ */

/**
 * Ambil mode approve dari tabel app_settings.
 * Jika tabel / row belum ada → default AUTO (langsung active).
 * Owner mengubah ini melalui dashboard.
 *
 * Tabel: public.app_settings
 *   key   TEXT PRIMARY KEY
 *   value TEXT
 *
 *   row: { key: 'approve_mode', value: 'auto' | 'manual' }
 */
async function getApproveMode() {
  try {
    const { data } = await MEASupabase
      .from("app_settings")
      .select("value")
      .eq("key", "approve_mode")
      .single();
    return data?.value === "manual" ? "manual" : "auto";
  } catch {
    return "auto"; // default fallback
  }
}

/* ══════════════════════════════════════════════════════════
   CORE: HANDLE REGISTER
   ══════════════════════════════════════════════════════════ */

async function handleRegister() {
  if (!validate()) return;

  const fullName = document.getElementById("fullName").value.trim();
  const username = document.getElementById("username").value.trim();
  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  setLoading(true);

  try {
    /* ── Step 1: Cek username belum dipakai ──────────────────────── */
    const { data: existingUser } = await MEASupabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();

    if (existingUser) {
      setError("username", "Username sudah digunakan.");
      setLoading(false);
      return;
    }

    /* ── Step 2: Ambil approve mode ──────────────────────────────── */
    const approveMode  = await getApproveMode();
    const initialStatus = approveMode === "manual" ? "pending" : "active";

    /* ── Step 3: Daftar ke Supabase Auth ─────────────────────────── */
    const { data: authData, error: authError } = await MEASupabase
      .auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "https://assistant.evanalmunawar.my.id/auth/callback/",
          // Data ini diteruskan ke trigger SQL via raw_user_meta_data
          data: {
            full_name : fullName,
            username  : username,
            status    : initialStatus,
          },
        },
      });

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("email", "Email sudah terdaftar.");
      } else {
        showAlert("Gagal mendaftar: " + authError.message);
      }
      setLoading(false);
      return;
    }

    /*
     * ── Step 4: Insert ke public.users ────────────────────────────
     *
     * OPSI A (DIREKOMENDASIKAN): Biarkan SQL trigger yang insert.
     *   Trigger membaca raw_user_meta_data yang sudah dikirim di Step 3.
     *   Tidak perlu kode di sini. (Lihat schema-users.sql)
     *
     * OPSI B (FALLBACK): Jika trigger belum dipasang, aktifkan blok di bawah.
     *   Pastikan anon key memiliki izin INSERT ke public.users,
     *   atau gunakan service-role key di server (jangan di client!).
     */

    // ── OPSI B — aktifkan jika trigger belum ada ──────────────────
    // const { error: insertError } = await MEASupabase
    //   .from("users")
    //   .insert({
    //     auth_id        : authData.user.id,
    //     full_name      : fullName,
    //     username       : username,
    //     email          : email,
    //     role           : CONFIG.DEFAULT_ROLE,   // "member"
    //     status         : initialStatus,
    //     email_verified : false,
    //   });
    //
    // if (insertError) {
    //   console.error("[Register] Insert public.users gagal:", insertError);
    //   // Lanjutkan tetap — user sudah ada di auth.users
    //   // Admin dapat fix manual di Supabase dashboard
    // }
    // ─────────────────────────────────────────────────────────────

    /* ── Step 5: Tampilkan success state ─────────────────────────── */
    const registerForm  = document.getElementById("registerForm");
    const authSwitch    = document.querySelector(".auth-switch");
    const successState  = document.getElementById("successState");
    const authTitle     = document.querySelector(".auth-title");

    if (registerForm) registerForm.hidden = true;
    if (authSwitch)   authSwitch.hidden   = true;
    if (successState) successState.hidden = false;
    if (authTitle)    authTitle.textContent = "CEK EMAIL ANDA";

    showAlert(
      approveMode === "manual"
        ? "Pendaftaran berhasil! Cek email untuk verifikasi, lalu tunggu persetujuan administrator."
        : "Link verifikasi dikirim ke email. Silakan cek inbox atau folder spam.",
      "success"
    );

  } catch (err) {
    console.error("[Register] Unexpected error:", err);
    showAlert("Gagal terhubung ke server. Coba lagi.");
    setLoading(false);
  }
}

/* ══════════════════════════════════════════════════════════
   EVENT LISTENERS
   ══════════════════════════════════════════════════════════ */

document.getElementById("registerBtn")
  .addEventListener("click", handleRegister);

document.getElementById("registerForm")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") handleRegister();
  });

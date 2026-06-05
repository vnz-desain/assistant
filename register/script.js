/**
 * MEA ASSISTANT V2 — REGISTER SCRIPT
 * ─────────────────────────────────────────────────────────
 * Deps: ../assets/theme/config.js
 */

"use strict";

/* ── SHA-256 ────────────────────────────────────────────── */
async function sha256(str) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ── Alert helpers ──────────────────────────────────────── */
function showAlert(msg, type = "error") {
  const box = document.getElementById("alertBox");
  box.textContent = msg;
  box.className   = "auth-alert" + (type !== "error" ? " " + type : "");
  box.hidden      = false;
}
function hideAlert() {
  document.getElementById("alertBox").hidden = true;
}

/* ── Field error helpers ────────────────────────────────── */
const FIELDS = ["fullName","username","email","password","confirmPassword"];

function setError(field, msg) {
  const err   = document.getElementById(field + "Err");
  const input = document.getElementById(field);
  if (err) err.textContent = msg;
  if (input) input.classList.toggle("error", !!msg);
}
function clearErrors() {
  FIELDS.forEach(f => setError(f, ""));
}

/* ── Loading state ──────────────────────────────────────── */
function setLoading(on) {
  const btn = document.getElementById("registerBtn");
  btn.classList.toggle("loading", on);
  btn.disabled = on;
}

/* ── Password toggle ─────────────────────────────────────── */
function makeToggle(btnId, inputId) {
  document.getElementById(btnId).addEventListener("click", function() {
    const pw = document.getElementById(inputId);
    pw.type = pw.type === "password" ? "text" : "password";
  });
}
makeToggle("togglePw", "password");
makeToggle("toggleConfirm", "confirmPassword");

/* ── Password strength ──────────────────────────────────── */
document.getElementById("password").addEventListener("input", function() {
  const val = this.value;
  const bar = document.getElementById("pwStrength");
  const fill = document.getElementById("pwFill");
  const label = document.getElementById("pwLabel");

  if (!val) { bar.hidden = true; return; }
  bar.hidden = false;

  let strength = 0;
  if (val.length >= 8)            strength++;
  if (/[A-Z]/.test(val))          strength++;
  if (/[0-9]/.test(val))          strength++;
  if (/[^A-Za-z0-9]/.test(val))   strength++;

  const map = ["", "weak","medium","medium","strong"];
  const levels = ["","LEMAH","SEDANG","SEDANG","KUAT"];
  const cls = strength <= 1 ? "weak" : strength <= 3 ? "medium" : "strong";

  fill.className  = "pw-strength-fill " + cls;
  label.className = "pw-strength-label " + cls;
  label.textContent = cls === "weak" ? "LEMAH" : cls === "medium" ? "SEDANG" : "KUAT";
});

/* ── Validate ───────────────────────────────────────────── */
function validate() {
  clearErrors();
  hideAlert();
  let ok = true;

  const fullName  = document.getElementById("fullName").value.trim();
  const username  = document.getElementById("username").value.trim();
  const email     = document.getElementById("email").value.trim();
  const password  = document.getElementById("password").value;
  const confirm   = document.getElementById("confirmPassword").value;

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
  } else if (
  !/^[^\s@]+@(gmail\.com|yahoo\.com)$/i.test(email)
) {
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

/* ── Submit ─────────────────────────────────────────────── */
async function handleRegister() {
  if (!validate()) return;

  const fullName = document.getElementById("fullName").value.trim();
  const username = document.getElementById("username").value.trim();
  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  setLoading(true);

  try {

  const { data, error } = await MEASupabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username: username
      }
    }
  });

  if (error) {
    throw error;
  }

    await MEASupabase
  .from('users')
  .insert({
    auth_id: data.user.id,
    full_name: fullName,
    username: username,
    email: email,
    role: 'member',
    status: 'active',
    email_verified: false
  });

    // Success — show success state
    document.getElementById("registerForm").hidden = true;
    document.querySelector(".auth-switch").hidden  = true;
    document.getElementById("successState").hidden = false;
    document.querySelector(".auth-title").textContent = "CEK EMAIL ANDA";
    showAlert(
  "Link verifikasi telah dikirim ke email Anda. Silakan cek inbox atau spam.",
  "success"
);

  } catch (err) {
    console.error("Register error:", err);
    showAlert("Gagal terhubung ke server. Coba lagi.");
    setLoading(false);
  }
}

/* ── Events ─────────────────────────────────────────────── */
document.getElementById("registerBtn").addEventListener("click", handleRegister);
document.getElementById("registerForm").addEventListener("keydown", function(e) {
  if (e.key === "Enter") handleRegister();
});

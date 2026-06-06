/**
 * MEA ASSISTANT V2 — EMAIL VERIFICATION CALLBACK
 * ─────────────────────────────────────────────────────────
 * URL: https://assistant.evanalmunawar.my.id/auth/callback/
 */

"use strict";

/* ── UI helpers ─────────────────────────────────────────── */

function setUI(state, title, desc, actions = "") {
  const icon    = document.getElementById("icon");
  const titleEl = document.getElementById("title");
  const descEl  = document.getElementById("desc");
  const actEl   = document.getElementById("actions");

  icon.className  = "icon " + state;
  icon.innerHTML  = {
    loading : `<div class="spinner"></div>`,
    success : `✓`,
    error   : `✗`,
    pending : `⏳`,
  }[state] || "";

  titleEl.textContent = title;
  descEl.textContent  = desc;
  actEl.innerHTML     = actions;
}

/* ── Main ───────────────────────────────────────────────── */

(async function handleCallback() {
  const client = MEASupabase;
  if (!client) {
    setUI("error", "Koneksi gagal", "Tidak bisa terhubung ke server.");
    return;
  }

  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const type   = params.get("type");

  const { data: { session }, error: sessionError } = await client.auth.getSession();

  if (sessionError || !session) {
    setUI(
      "error",
      "Link tidak valid",
      "Link verifikasi sudah kedaluwarsa atau tidak valid.",
      `<a class="btn btn-primary" href="${CONFIG.PATHS.LOGIN}">Ke Login</a>`
    );
    return;
  }

  if (type === "recovery") {
    window.location.replace("/auth/reset-password/");
    return;
  }

  await client
    .from("users")
    .update({ email_verified: true })
    .eq("auth_id", session.user.id);

  const { data: userData, error: userError } = await client
    .from("users")
    .select("id, username, full_name, role, status")
    .eq("auth_id", session.user.id)
    .single();

  if (userError || !userData) {
    setUI(
      "success",
      "Email terverifikasi!",
      "Silakan login untuk melanjutkan.",
      `<a class="btn btn-primary" href="${CONFIG.PATHS.LOGIN}">Ke Halaman Login</a>`
    );
    return;
  }

  /* ── Cek status akun ───────────────────────────────────── */
  if (userData.status === "pending") {
    await client.auth.signOut();
    setUI(
      "pending",
      "Email terverifikasi!",
      "Akun kamu sedang menunggu persetujuan administrator.",
      `<a class="btn btn-secondary" href="${CONFIG.PATHS.LOGIN}">Kembali ke Login</a>`
    );
    return;
  }

  if (userData.status === "active") {
    localStorage.setItem(
      CONFIG.SESSION_KEY,
      JSON.stringify({
        userId   : userData.id,
        username : userData.username,
        fullName : userData.full_name,
        role     : userData.role,
        status   : userData.status,
      })
    );

    setUI("success", "Berhasil!", "Mengalihkan ke dashboard...");

    // Redirect berdasarkan role
    const paths = {
      owner: '/dashboard/owner/',
      admin: '/dashboard/admin/',
      member: '/dashboard/member/'
    };
    
    setTimeout(() => {
      window.location.replace(paths[userData.role] || paths.member);
    }, 1500);
    return;
  }

  await client.auth.signOut();
  setUI("error", "Akun tidak aktif", "Silakan hubungi administrator.");
})();

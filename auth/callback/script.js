/**
 * MEA ASSISTANT V2 — EMAIL VERIFICATION CALLBACK
 * ─────────────────────────────────────────────────────────
 * URL: https://assistant.evanalmunawar.my.id/auth/callback/
 *
 * Supabase mengarahkan user ke halaman ini setelah klik link
 * verifikasi email. URL berisi fragment token:
 *   #access_token=...&type=signup   (email verification)
 *   #access_token=...&type=recovery (password reset)
 *
 * Halaman ini:
 *   1. Membaca token dari URL hash
 *   2. Menukar token → session via Supabase
 *   3. Update public.users.email_verified = true
 *   4. Cek status akun (active / pending)
 *   5. Redirect sesuai kondisi
 * ─────────────────────────────────────────────────────────
 */

"use strict";

/* ── UI helpers ─────────────────────────────────────────── */

function setUI(state, title, desc, actions = "") {
  const icon    = document.getElementById("icon");
  const titleEl = document.getElementById("title");
  const descEl  = document.getElementById("desc");
  const actEl   = document.getElementById("actions");

  // state: "loading" | "success" | "error" | "pending"
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

  /* ── 1. Baca hash dari URL (Supabase kirim di fragment #) ────── */
  console.log("HASH:", hash);
console.log("TYPE:", params.get("type"));
console.log("URL:", window.location.href);
  const type   = params.get("type");

  /*
   * Supabase JS v2 secara otomatis memproses token dari URL hash
   * saat halaman load — cukup panggil getSession() setelah itu.
   */
  console.log("Checking session...");
  const { data: { session }, error: sessionError } =
    await client.auth.getSession();
  console.log("Session:", session);
console.log("Session Error:", sessionError);

  if (sessionError || !session) {
    setUI(
      "error",
      "Link tidak valid",
      "Link verifikasi sudah kedaluwarsa atau tidak valid. Silakan daftar ulang atau minta link baru.",
      `<a class="btn btn-primary" href="${CONFIG.PATHS.LOGIN}">Ke Login</a>
       <br>
       <a class="btn btn-secondary" href="${CONFIG.PATHS.REGISTER}">Daftar Ulang</a>`
    );
    return;
  }

  /* ── 2. Jika tipe recovery (reset password) → redirect ke halaman reset ── */
  if (type === "recovery") {
    window.location.replace("/auth/reset-password/");
    return;
  }

  /* ── 3. Update email_verified di public.users ────────────────── */
  const { error: updateError } = await MEASupabase
    .from("users")
    .update({ email_verified: true })
    .eq("auth_id", session.user.id);

  if (updateError) {
    console.warn("[Callback] Gagal update email_verified:", updateError);
    // Tidak fatal — lanjut cek status
  }

  /* ── 4. Ambil data user dari public.users ────────────────────── */
  const { data: userData, error: userError } = await MEASupabase
    .from("users")
    .select("id, username, full_name, role, status")
    .eq("auth_id", session.user.id)
    .single();

  if (userError || !userData) {
    // Row belum ada (trigger belum jalan / delayed)
    // Tampilkan sukses dan minta user login manual
    setUI(
      "success",
      "Email terverifikasi!",
      "Email kamu berhasil diverifikasi. Silakan login untuk melanjutkan.",
      `<a class="btn btn-primary" href="${CONFIG.PATHS.LOGIN}">Ke Halaman Login</a>`
    );
    return;
  }

  /* ── 5. Cek status akun ──────────────────────────────────────── */
  if (userData.status === "pending") {
    // Manual approve mode — user harus tunggu owner
    await client.auth.signOut(); // sign out, jangan biarkan session aktif
    setUI(
      "pending",
      "Email terverifikasi!",
      "Akun kamu sedang menunggu persetujuan administrator. Kamu akan mendapat notifikasi saat akun diaktifkan.",
      `<a class="btn btn-secondary" href="${CONFIG.PATHS.LOGIN}">Kembali ke Login</a>`
    );
    return;
  }

  if (userData.status === "active") {
    // Auto approve mode atau sudah di-approve — langsung masuk
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

    setUI(
      "success",
      "Email terverifikasi!",
      "Akun kamu aktif. Mengalihkan ke dashboard...",
    );

    // Delay sedikit agar user sempat baca
    setTimeout(() => {
      const paths = CONFIG.PATHS.DASHBOARD;
      window.location.replace(paths[userData.role] || paths.member);
    }, 1800);
    return;
  }

  // Status lain (misal "rejected")
  await client.auth.signOut();
  setUI(
    "error",
    "Akun tidak aktif",
    "Akun kamu tidak dapat diaktifkan. Silakan hubungi administrator.",
    `<a class="btn btn-secondary" href="${CONFIG.PATHS.LOGIN}">Kembali ke Login</a>`
  );

})();

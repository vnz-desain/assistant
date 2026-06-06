/**
 * MEA ASSISTANT V2 — AUTH GUARD
 * ─────────────────────────────────────────────────────────
 * Include di setiap halaman dashboard SEBELUM script halaman:
 *
 *   <script src="/assets/js/auth-guard.js"></script>
 *   <script src="./script.js"></script>
 *
 * Guard akan:
 *   1. Cek session Supabase aktif
 *   2. Cek status akun = active
 *   3. Cek role sesuai halaman
 *   4. Redirect ke login jika gagal
 *   5. Expose window.MEAUser untuk dipakai script halaman
 * ─────────────────────────────────────────────────────────
 */

"use strict";

(async function authGuard() {
  const client = MEASupabase.getClient();
  if (!client) {
    window.location.replace(CONFIG.PATHS.LOGIN);
    return;
  }

  /* ── Cek Supabase session ───────────────────────────── */
  const { data: { session } } = await client.auth.getSession();
  if (!session) {
    localStorage.removeItem(CONFIG.SESSION_KEY);
    window.location.replace(CONFIG.PATHS.LOGIN);
    return;
  }

  /* ── Ambil profil user dari DB ──────────────────────── */
  const { data: userData, error } = await MEASupabase
    .from("users")
    .select("id, username, full_name, role, status, email_verified")
    .eq("auth_id", session.user.id)
    .single();

  if (error || !userData) {
    await client.auth.signOut();
    localStorage.removeItem(CONFIG.SESSION_KEY);
    window.location.replace(CONFIG.PATHS.LOGIN);
    return;
  }

  /* ── Cek status akun ────────────────────────────────── */
  if (userData.status !== "active") {
    await client.auth.signOut();
    localStorage.removeItem(CONFIG.SESSION_KEY);
    // Redirect ke login dengan pesan
    window.location.replace(
      CONFIG.PATHS.LOGIN + "?reason=" + encodeURIComponent(userData.status)
    );
    return;
  }

  /* ── Cek role vs path ───────────────────────────────── */
  const path         = window.location.pathname;
  const expectedRole = Object.entries(CONFIG.PATHS.DASHBOARD)
    .find(([, p]) => path.startsWith(p))?.[0];
  const CONFIG = {
  // ...
  PATHS: {
    DASHBOARD: {
      owner: '/dashboard/owner/',
      admin: '/dashboard/admin/',
      member: '/dashboard/member/'
    }
  }
};
    

  if (expectedRole && userData.role !== expectedRole) {
    // User mengakses dashboard yang bukan haknya → redirect ke dashboard benar
    const correctPath = CONFIG.PATHS.DASHBOARD[userData.role]
      || CONFIG.PATHS.DASHBOARD.member;
    window.location.replace(correctPath);
    return;
  }

  /* ── Update cache & expose global ──────────────────── */
  const profile = {
    userId   : userData.id,
    username : userData.username,
    fullName : userData.full_name,
    role     : userData.role,
    status   : userData.status,
  };
  localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(profile));

  /** Global yang bisa dipakai script dashboard:
   *  window.MEAUser.role, .username, .fullName, dll.
   */
  window.MEAUser = profile;

  /* ── Logout helper (pakai di tombol logout dashboard) ── */
  window.MEALogout = async function () {
    await client.auth.signOut();
    localStorage.removeItem(CONFIG.SESSION_KEY);
    window.location.replace(CONFIG.PATHS.LOGIN);
  };

})();

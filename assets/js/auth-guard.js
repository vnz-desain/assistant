/**
 * MEA ASSISTANT V2 — AUTH GUARD (PRODUCTION READY)
 * ─────────────────────────────────────────────────────────
 * Include di setiap halaman dashboard SEBELUM script halaman:
 *
 * <script src="/assets/js/config.js" defer></script>
 * <script src="/assets/js/supabase-client.js" defer></script>
 * <script src="/assets/js/auth-guard.js" defer></script>
 * ─────────────────────────────────────────────────────────
 */

"use strict";

(async function authGuard() {
  // 1. Helper untuk memastikan CONFIG global sudah tersedia
  const waitForConfig = () => {
    return new Promise((resolve) => {
      if (typeof window.CONFIG !== 'undefined') return resolve();
      window.addEventListener('mea:config-ready', resolve);
    });
  };

  await waitForConfig();

  // 2. Inisialisasi Client
  const client = typeof MEASupabase !== 'undefined' ? MEASupabase : null;
  if (!client) {
    console.error("MEASupabase client tidak ditemukan.");
    window.location.replace(window.CONFIG.PATHS.LOGIN);
    return;
  }

  // 3. Cek Supabase session aktif
  const { data: { session }, error: sessionError } = await client.auth.getSession();
  if (sessionError || !session) {
    localStorage.removeItem(window.CONFIG.SESSION_KEY);
    window.location.replace(window.CONFIG.PATHS.LOGIN);
    return;
  }

  // 4. Ambil profil user dari DB
  const { data: userData, error: dbError } = await client
    .from("users")
    .select("id, username, full_name, role, status, email_verified")
    .eq("auth_id", session.user.id)
    .single();

  if (dbError || !userData) {
    await client.auth.signOut();
    localStorage.removeItem(window.CONFIG.SESSION_KEY);
    window.location.replace(window.CONFIG.PATHS.LOGIN);
    return;
  }

  // 5. Cek status akun aktif
  if (userData.status !== "active") {
    await client.auth.signOut();
    localStorage.removeItem(window.CONFIG.SESSION_KEY);
    window.location.replace(
      window.CONFIG.PATHS.LOGIN + "?reason=" + encodeURIComponent(userData.status)
    );
    return;
  }

  // 6. Cek role vs path (Akses Control)
  const path = window.location.pathname;
  const expectedRole = Object.entries(window.CONFIG.PATHS.DASHBOARD)
    .find(([, p]) => path.startsWith(p))?.[0];

  if (expectedRole && userData.role !== expectedRole) {
    const correctPath = window.CONFIG.PATHS.DASHBOARD[userData.role] 
                     || window.CONFIG.PATHS.DASHBOARD.member;
    window.location.replace(correctPath);
    return;
  }

  // 7. Update cache & expose global
  const profile = {
    userId: userData.id,
    username: userData.username,
    fullName: userData.full_name,
    role: userData.role,
    status: userData.status,
  };
  
  localStorage.setItem(window.CONFIG.SESSION_KEY, JSON.stringify(profile));
  window.MEAUser = profile;

  // 8. Logout helper (bisa dipanggil dari console atau tombol logout)
  window.MEALogout = async function () {
    await client.auth.signOut();
    localStorage.removeItem(window.CONFIG.SESSION_KEY);
    window.location.replace(window.CONFIG.PATHS.LOGIN);
  };

  console.log("Auth Guard: User verified -", userData.role);
})();
    

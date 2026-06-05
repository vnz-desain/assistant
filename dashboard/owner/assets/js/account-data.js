/**
 * account-data.js
 * ─────────────────────────────────────────────────────────
 * Shared Data Layer untuk MEA Assistant V2 Account Center.
 * Mengambil dan menyimpan state untuk Gmail, Drive, OAuth, dan Logs.
 * * Dependensi: 
 * - @supabase/supabase-js (CDN)
 * - supabase-client.js (MEASupabase)
 * ─────────────────────────────────────────────────────────
 */

(function (global) {
  'use strict';

  global.AccountData = {
    // State
    gmailAccounts: [],
    driveAccounts: [],
    oauthServices: [],
    logs: [],
    
    // Flag status
    isLoading: false,
    lastUpdated: null,

    /**
     * Mengambil seluruh data Account Center secara paralel dari Supabase.
     * Menangani error pada setiap tabel secara aman untuk memastikan data yang lain tetap dimuat.
     */
    async load() {
      if (this.isLoading) return; // Mencegah duplikasi pengambilan data secara bersamaan
      this.isLoading = true;

      if (!global.MEASupabase) {
        console.error('[AccountData] Client MEASupabase tidak ditemukan. Pastikan supabase-client.js dimuat terlebih dahulu.');
        this.isLoading = false;
        return;
      }

      try {
        // Eksekusi kueri secara paralel untuk performa yang optimal
        const [gmailRes, driveRes, oauthRes, logsRes] = await Promise.all([
          global.MEASupabase.from('gmail_accounts').select('*').order('created_at', { ascending: false }),
          global.MEASupabase.from('drive_accounts').select('*').order('created_at', { ascending: false }),
          global.MEASupabase.from('oauth_services').select('*').order('created_at', { ascending: false }),
          global.MEASupabase.from('system_logs').select('*').order('created_at', { ascending: false })
        ]);

        // Menangkap dan mencatat error pada masing-masing tabel dengan aman
        if (gmailRes.error) console.error('[AccountData] Error memuat gmail_accounts:', gmailRes.error);
        if (driveRes.error) console.error('[AccountData] Error memuat drive_accounts:', driveRes.error);
        if (oauthRes.error) console.error('[AccountData] Error memuat oauth_services:', oauthRes.error);
        if (logsRes.error) console.error('[AccountData] Error memuat system_logs:', logsRes.error);

        // Menyimpan data yang diambil (atau fallback ke array kosong jika terjadi kegagalan)
        this.gmailAccounts = gmailRes.data || [];
        this.driveAccounts = driveRes.data || [];
        this.oauthServices = oauthRes.data || [];
        this.logs = logsRes.data || [];

        this.lastUpdated = new Date();

      } catch (err) {
        console.error('[AccountData] Terjadi error tak terduga saat memuat data paralel:', err);
      } finally {
        this.isLoading = false;

        // Mengirimkan event global untuk memberitahu modul UI bahwa data sudah siap
        document.dispatchEvent(
          new CustomEvent('mea:account-data-ready', {
            detail: { timestamp: this.lastUpdated }
          })
        );
      }
    },

    /**
     * Alias untuk memuat ulang/me-refresh data secara manual.
     */
    async refresh() {
      await this.load();
    }
  };

})(window);
                      

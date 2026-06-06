/**
 * supabase-client.js
 * ─────────────────────────────────────────────────────────
 * Shared Supabase client for MEA Assistant V2.
 * Import / include this file ONCE per page before any
 * module that needs database access.
 *
 * Usage (any page):
 *   const { data, error } = await MEASupabase.from('users').select('*');
 * ─────────────────────────────────────────────────────────
 */

(function (global) {
  'use strict';

  // ── Configuration ────────────────────────────────────────
  // Replace these two values with your actual Supabase project credentials.
  // Do NOT commit real keys to public repos — use environment injection
  // or a build-time secret manager for production.
  const SUPABASE_URL  = 'https://xztlfssdzdtusxvnphne.supabase.co';
  const SUPABASE_ANON = 'sb_publishable_Yd4ZIKHVT86qulfKasA8mA_V4Wsrio_';
  // ─────────────────────────────────────────────────────────

  let _client = null;

  /**
   * Returns the Supabase client, creating it on first call.
   * Depends on the Supabase JS v2 CDN being loaded before this script:
   *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
   */
  function getClient() {
    if (_client) return _client;

    if (!global.supabase) {
      console.error('[MEASupabase] Supabase JS library not found. '
        + 'Add the CDN <script> tag before supabase-client.js.');
      return null;
    }

    _client = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    return _client;
  }

  // Expose a thin proxy so call-sites can write:
  //   MEASupabase.from(...)   instead of   MEASupabase.client().from(...)
    const handler = {
    get(_, prop) {
      if (prop === 'getClient') return getClient;

      const client = getClient();
      if (!client) return () => Promise.resolve({ data: null, error: new Error('No client') });
      const value = client[prop];
      return typeof value === 'function' ? value.bind(client) : value;
    },
  };

  global.MEASupabase = new Proxy({}, handler);

  /**
   * MEASupabase.onReady(fn)
   * Calls fn(client) once the Supabase client is initialised.
   * Safe to call before the CDN finishes loading — polls up to 3 s.
   */
  global.MEASupabase.onReady = function (fn) {
    const client = getClient();
    if (client) { fn(client); return; }
    let attempts = 0;
    const iv = setInterval(function () {
      const c = getClient();
      if (c) { clearInterval(iv); fn(c); }
      if (++attempts > 30) clearInterval(iv); // give up after 3 s
    }, 100);
  };

})(window);

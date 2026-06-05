/**
 * dashboard-stats.js
 * ─────────────────────────────────────────────────────────
 * Phase 1 — Live Dashboard Statistics
 *
 * Fetches row counts from four Supabase tables and feeds
 * the existing data-count counter animation in script.js.
 *
 * Tables used:
 *   users            → "Users" stat card
 *   gmail_accounts   → folded into "Accounts" total
 *   drive_accounts   → folded into "Accounts" total
 *   oauth_services   → folded into "Accounts" total
 *
 * The module dispatches a custom event 'mea:stats-ready'
 * on document so script.js can start the animation only
 * after real values are set.
 * ─────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // ── Table → stat-card mapping ─────────────────────────
  // Each entry describes one Supabase count query.
  // `cardIndex` maps to the nth .stat-value[data-count] in the DOM
  // (0 = Users, 1 = Accounts, 2 = AI Requests, 3 = System Health).
  // cardIndex -1 means the value is accumulated before writing.
  const QUERIES = [
    { table: 'users',          cardIndex: 0 },  // Users card
    { table: 'gmail_accounts', cardIndex: 1 },  // \
    { table: 'drive_accounts', cardIndex: 1 },  //  > summed → Accounts card
    { table: 'oauth_services', cardIndex: 1 },  // /
  ];

  // ── Helpers ───────────────────────────────────────────

  /**
   * Fetch exact row count for a table using Supabase's
   * count: 'exact' option (no data rows transferred).
   * Returns { count: Number|null, error }
   */
  async function fetchCount(table) {
    const { count, error } = await MEASupabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.warn(`[DashboardStats] Could not count "${table}":`, error.message);
      return { count: null, error };
    }
    return { count, error: null };
  }

  // ── Main ──────────────────────────────────────────────

  async function loadStats() {
    // Accumulator: cardIndex → running total
    const totals  = {};   // { 0: 1284, 1: 347, … }
    const missing = {};   // tracks which cards had at least one query fail

    const results = await Promise.allSettled(
      QUERIES.map(q => fetchCount(q.table).then(r => ({ ...r, cardIndex: q.cardIndex })))
    );

    results.forEach(result => {
      if (result.status !== 'fulfilled') return;
      const { count, error, cardIndex } = result.value;
      if (error || count === null) {
        missing[cardIndex] = true;
        return;
      }
      totals[cardIndex] = (totals[cardIndex] ?? 0) + count;
    });

    // Write live values into data-count attributes so the
    // animation picks them up (or re-runs with updated targets).
    const cards = document.querySelectorAll('.stat-value[data-count]');

    Object.entries(totals).forEach(([idx, value]) => {
      const el = cards[Number(idx)];
      if (!el) return;
      el.dataset.count = value;   // animation reads this
    });

    // Notify script.js (or anyone) that counts are ready
    document.dispatchEvent(new CustomEvent('mea:stats-ready', {
      detail: { totals, missing },
    }));
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadStats);
  } else {
    loadStats();
  }

})();

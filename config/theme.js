/**
 * ============================================================
 * MEA ASSISTANT — THEME CONFIGURATION
 * ============================================================
 * File   : config/theme.js
 * Purpose: Single source of truth untuk semua asset path,
 *          warna fallback, dan konfigurasi visual.
 *
 * Cara pakai:
 *   - Ganti path gambar di sini tanpa menyentuh HTML/CSS lain.
 *   - Semua key diakses oleh js/script.js saat runtime.
 * ============================================================
 */

const THEME = {

  /* ----------------------------------------------------------
   * ASSET PATHS
   * Semua path relatif terhadap root project (index.html).
   * Ganti value di sini untuk mengganti asset tanpa edit HTML.
   * ---------------------------------------------------------- */
  assets: {
    heroBg      : "images/hero-bg.webp",   // Background utama hero
    heroBgAlt   : "images/hero-bg-2.webp", // Background alternatif / fallback gambar kedua
    logo        : "images/logo.webp",       // Logo brand (opsional, belum dipakai di V2)
  },

  /* ----------------------------------------------------------
   * FALLBACK GRADIENT
   * Dipakai otomatis jika semua gambar hero gagal dimuat.
   * Format: CSS gradient string yang valid.
   * ---------------------------------------------------------- */
  fallbackGradient: `
    radial-gradient(circle at top left,    rgba(196,30,58,0.25), transparent 40%),
    radial-gradient(circle at bottom right, rgba(196,30,58,0.15), transparent 45%),
    linear-gradient(160deg, #0a0305 0%, #050505 50%, #080208 100%)
  `,

  /* ----------------------------------------------------------
   * OVERLAY (diterapkan di atas gambar background)
   * Nilai ini di-inject ke .hero-bg::after via JS jika perlu,
   * atau cukup dikontrol dari CSS (nilai sudah match di sini).
   * ---------------------------------------------------------- */
  overlay: {
    topLeft     : "rgba(196,30,58,0.18)",
    bottomRight : "rgba(196,30,58,0.12)",
    baseDark    : "rgba(5,5,5,0.92)",
  },

  /* ----------------------------------------------------------
   * INTERSECTION OBSERVER — Scroll Animation
   * ---------------------------------------------------------- */
  animation: {
    threshold   : 0.15,   // Persentase elemen terlihat sebelum animasi trigger
    duration    : 700,    // Durasi animasi dalam ms
    translateY  : 40,     // Jarak slide-up dalam px
  },

  /* ----------------------------------------------------------
   * SELECTORS — Elemen yang di-observe untuk animasi scroll
   * ---------------------------------------------------------- */
  animatedSelectors: ".card, .status-card, .cta",

};

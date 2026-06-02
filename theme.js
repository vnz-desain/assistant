/**
 * ============================================================
 * MEA ASSISTANT — THEME CONFIG
 * ============================================================
 * Semua konten, path, dan link dikelola dari sini.
 * Tidak ada hardcode di HTML / CSS / JS.
 *
 * Cara maintenance:
 *   - Ganti nav links → edit NAV.links
 *   - Ganti gambar background → edit ASSETS.heroBg
 *   - Tambah platform card → push ke PLATFORM.cards
 * ============================================================
 */

/**
 * ============================================================
 * MEA ASSISTANT — THEME CONFIG (Fixed Path Version)
 * ============================================================
 */

const SITE = {

  /* ── Brand ─────────────────────────────── */
  name    : "MEA",
  tagline : "MEA ECOSYSTEM PLATFORM",
  version : "V2",

  /* ── Hero section ──────────────────────── */
  hero: {
    heading   : "MEA",
    subheading: "ASSISTANT",
    desc      : "Business Assistant. AI Trading. AI Developer.\nBuilt for the MEA Ecosystem.",
    // ── PERBAIKAN: Diubah dari "login.html" menjadi "login/" ──
    ctaPrimary: { label: "ACCESS PLATFORM", href: "login/" },
    ctaSecond : { label: "EXPLORE",          href: "#platform" },
  },

  /* ── Navigation ────────────────────────── */
  nav: {
    logo : "MEA",
    items: [
      {
        type : "link",
        label: "Platform",
        href : "#platform",
      }
    ],
  },

  /* ── Platform Modules ──────────────────── */
  platform: {
    cards: [
      {
        icon : "🤖",
        title: "AI Business",
        desc : "Automation, finance analysis, and strategic operations.",
        badge: "COMING SOON",
        badgeClass: "",
      },
      {
        icon : "📈",
        title: "AI Trading",
        desc : "Trading analysis, risk management, and market insights.",
        badge: "IN DEVELOPMENT",
        badgeClass: "",
      },
      {
        icon : "💻",
        title: "AI Developer",
        desc : "Specialized AI for building and maintaining the MEA ecosystem.",
        badge: "OWNER ONLY",
        badgeClass: "owner",
      },
    ],
  },

  /* ── Status bar ────────────────────────── */
  status: [
    { label: "VERSION", value: "V2"               },
    { label: "PLATFORM", value: "ACTIVE"          },
    { label: "ACCESS",   value: "REGISTER REQUIRED" },
  ],

  /* ── CTA section ───────────────────────── */
  cta: {
    heading : "READY TO ENTER\nMEA ASSISTANT?",
    sub     : "Create an account to access the MEA platform.",
    buttons : [
      // ── PERBAIKAN: Diubah dari "login.html" dan "register.html" menjadi "login/" dan "register/" ──
      { label: "LOGIN",    href: "login/",    primary: true  },
      { label: "REGISTER", href: "register/", primary: false },
    ],
  },

  /* ── Footer ────────────────────────────── */
  footer: {
    name: "MEA ASSISTANT",
    sub : "Part of the MEA Ecosystem",
  },

  /* ── Assets ────────────────────────────── */
  assets: {
    heroBg   : "images/hero-bg.webp",
    heroBgAlt: "images/hero-bg-2.webp",
  },
};


  /* ── Scroll animation ──────────────────── */
  animation: {
    threshold  : 0.12,
    duration   : 650,
    translateY : 36,
    selectors  : ".card, .status-card, .cta-inner",
  },

};

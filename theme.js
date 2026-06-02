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
    ctaPrimary: { label: "ACCESS PLATFORM", href: "/login" },
    ctaSecond : { label: "EXPLORE",          href: "#platform" },
  },

  /* ── Navigation ────────────────────────── */
  nav: {
    logo : "MEA",
    items: [
      // type: "link"     → direct anchor/page link
      // type: "dropdown" → shows children as dropdown
      // type: "action"   → styled differently (e.g. login/register group)
      {
        type : "link",
        label: "Platform",
        href : "#platform",
      },
      {
        type : "link",
        label: "Status",
        href : "#status",
      },
      {
        type    : "dropdown",
        label   : "Account",
        children: [
          { label: "Login",    href: "/login"    },
          { label: "Register", href: "/register" },
        ],
      },
      {
        type  : "link",
        label : "Portfolio ↗",
        href  : "https://evanalmunawar.my.id",
        extern: true,
      },
    ],
  },

  /* ── Platform cards ────────────────────── */
  platform: {
    heading : "Choose Your Assistant",
    sublabel: "PLATFORM MODULES",
    cards   : [
      {
        icon : "🏢",
        title: "Business Assistant",
        desc : "Business planning, strategy, and operational support.",
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
      { label: "LOGIN",    href: "/login",    primary: true  },
      { label: "REGISTER", href: "/register", primary: false },
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

  /* ── Scroll animation ──────────────────── */
  animation: {
    threshold  : 0.12,
    duration   : 650,
    translateY : 36,
    selectors  : ".card, .status-card, .cta-inner",
  },

};

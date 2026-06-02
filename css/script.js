/**
 * ============================================================
 * MEA ASSISTANT V2 — MAIN SCRIPT
 * ============================================================
 * File   : js/script.js
 * Purpose: Semua logika JavaScript untuk MEA Assistant V2.
 *
 * Modul:
 *   1. BACKGROUND LOADER  — load hero image + fallback system
 *   2. SCROLL ANIMATIONS  — IntersectionObserver untuk reveal
 *
 * Dependensi:
 *   - config/theme.js harus dimuat SEBELUM file ini
 *     (urutan <script> di index.html sudah benar)
 * ============================================================
 */


/* ============================================================
   GUARD: pastikan THEME config tersedia
   ============================================================ */
if (typeof THEME === "undefined") {
  console.error("[MEA] config/theme.js tidak ditemukan. Script dihentikan.");
  throw new Error("THEME config missing");
}


/* ============================================================
   1. BACKGROUND LOADER
   ============================================================

   Cara kerja:
     a) Cari elemen .hero-bg-img di DOM.
     b) Set src dari THEME.assets.heroBg (bukan hardcode di HTML).
     c) Jika berhasil → tambah class .is-loaded → fade-in via CSS.
     d) Jika gagal    → coba THEME.assets.heroBgAlt (gambar kedua).
     e) Jika keduanya gagal → aktifkan fallback gradient.
        Fallback gradient sudah selalu ada di .hero-bg-fallback,
        sehingga background TIDAK PERNAH kosong/putih.
   ============================================================ */

(function initBackgroundLoader() {

  const imgEl      = document.querySelector(".hero-bg-img");
  const bgWrapper  = document.querySelector(".hero-bg");

  /* Safety check: elemen wajib ada */
  if (!imgEl || !bgWrapper) {
    console.warn("[MEA Background] Elemen .hero-bg atau .hero-bg-img tidak ditemukan.");
    return;
  }

  /**
   * Aktifkan fallback gradient sepenuhnya.
   * Gambar disembunyikan, wrapper mendapat class .bg-fallback-active
   * untuk keperluan debugging atau styling tambahan.
   */
  function activateFallback() {
    imgEl.style.display = "none";
    bgWrapper.classList.add("bg-fallback-active");
    console.info("[MEA Background] Fallback gradient aktif — gambar tidak tersedia.");
  }

  /**
   * Coba muat gambar dengan src tertentu.
   * @param {string} src        - Path gambar yang akan dimuat
   * @param {Function} onSuccess - Callback jika berhasil
   * @param {Function} onFail    - Callback jika gagal
   */
  function tryLoadImage(src, onSuccess, onFail) {
    /* Gunakan Image() object untuk pre-load tanpa mengganggu DOM */
    const probe = new Image();

    probe.onload = function () {
      onSuccess(src);
    };

    probe.onerror = function () {
      console.warn("[MEA Background] Gagal memuat:", src);
      onFail();
    };

    /* Mulai loading */
    probe.src = src;
  }

  /* Mulai dengan gambar utama dari THEME config */
  tryLoadImage(

    THEME.assets.heroBg,

    /* SUCCESS: gambar utama berhasil */
    function (src) {
      imgEl.src = src;
      /* Tunggu hingga image element selesai decode sebelum fade-in */
      imgEl.decode()
        .then(function () {
          imgEl.classList.add("is-loaded");
        })
        .catch(function () {
          /* decode() gagal tapi gambar sudah ada — tetap tampilkan */
          imgEl.classList.add("is-loaded");
        });
    },

    /* FAIL: coba gambar alternatif */
    function () {
      tryLoadImage(

        THEME.assets.heroBgAlt,

        /* SUCCESS: gambar alternatif berhasil */
        function (src) {
          imgEl.src = src;
          imgEl.decode()
            .then(function ()  { imgEl.classList.add("is-loaded"); })
            .catch(function () { imgEl.classList.add("is-loaded"); });
          console.info("[MEA Background] Menggunakan gambar alternatif:", src);
        },

        /* FAIL: kedua gambar gagal → gradient fallback */
        function () {
          activateFallback();
        }

      );
    }

  );

})();


/* ============================================================
   2. SCROLL ANIMATIONS
   ============================================================

   Elemen yang masuk ke viewport akan mendapat animasi
   slide-up + fade-in menggunakan Web Animations API.
   Semua konfigurasi (selector, durasi, threshold) diambil
   dari THEME config — tidak ada hardcode di sini.
   ============================================================ */

(function initScrollAnimations() {

  /* Ambil konfigurasi dari THEME */
  const { threshold, duration, translateY } = THEME.animation;
  const selectors = THEME.animatedSelectors;

  /* Pilih semua elemen target */
  const elements = document.querySelectorAll(selectors);

  if (!elements.length) {
    console.info("[MEA Animations] Tidak ada elemen animasi ditemukan.");
    return;
  }

  /**
   * Callback IntersectionObserver.
   * Dipanggil setiap kali visibility elemen berubah.
   */
  function onIntersect(entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      /* Jalankan animasi slide-up */
      entry.target.animate(
        [
          { opacity: 0, transform: `translateY(${translateY}px)` },
          { opacity: 1, transform: "translateY(0)" }
        ],
        {
          duration : duration,
          fill     : "forwards",
          easing   : "ease-out",
        }
      );

      /* Unobserve setelah animasi berjalan — performa lebih efisien */
      observer.unobserve(entry.target);
    });
  }

  /* Buat observer */
  const observer = new IntersectionObserver(onIntersect, { threshold });

  /* Observe semua elemen */
  elements.forEach(function (el) {
    observer.observe(el);
  });

})();

/* ============================================
   MEA ASSISTANT — AUTH.JS
   Session check, owner gate
   ============================================ */

(function () {
  'use strict';

  const OWNER_KEY  = 'mea_owner_token';
  const LOGIN_PAGE = '/dashboard/owner/login.html';

  function checkAuth() {
    const token = sessionStorage.getItem(OWNER_KEY) || localStorage.getItem(OWNER_KEY);
    if (!token) {
      // Uncomment to enforce auth redirect:
      // window.location.href = LOGIN_PAGE;
    }
    return token;
  }

  function getOwnerData() {
    const raw = localStorage.getItem('mea_owner_data');
    if (!raw) return getDefaultOwner();
    try { return JSON.parse(raw); } catch { return getDefaultOwner(); }
  }

  function getDefaultOwner() {
    return {
      name: 'M. EVAN ALMUNAWAR',
      initials: 'MEA',
      role: 'SYSTEM OWNER',
      status: 'active',
      lastLogin: new Date().toISOString(),
    };
  }

  // Expose
  window.MEAAuth = { checkAuth, getOwnerData };

  document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Inject owner name where .owner-name class exists
    const owner = getOwnerData();
    document.querySelectorAll('.owner-name').forEach(el => {
      el.textContent = owner.name;
    });
    document.querySelectorAll('.owner-initials').forEach(el => {
      el.textContent = owner.initials;
    });
    document.querySelectorAll('.owner-role').forEach(el => {
      el.textContent = owner.role;
    });
  });
})();

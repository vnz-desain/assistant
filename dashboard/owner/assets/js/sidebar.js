/* ============================================
   MEA ASSISTANT — SIDEBAR.JS
   Desktop sidebar expand/collapse + mobile nav
   ============================================ */

(function () {
  'use strict';

  /* ---- State ---- */
  const STORAGE_KEY = 'mea_sidebar_expanded';
  let isExpanded = localStorage.getItem(STORAGE_KEY) !== 'false';

  /* ---- Elements ---- */
  const sidebar   = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  const mainContent = document.querySelector('.main-content');

  /* ---- Init ---- */
  function init() {
    if (!sidebar) return;
    applyState(isExpanded, false);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggle);
    }

    // Collapsible nav groups
    document.querySelectorAll('.nav-item[data-group]').forEach(item => {
      item.addEventListener('click', () => toggleGroup(item));
    });

    // Restore open groups
    document.querySelectorAll('[data-group]').forEach(item => {
      const key = `mea_group_${item.dataset.group}`;
      if (localStorage.getItem(key) === 'open') {
        openGroup(item, false);
      }
    });

    // Active link highlight
    highlightActive();
  }

  function toggle() {
    isExpanded = !isExpanded;
    localStorage.setItem(STORAGE_KEY, isExpanded);
    applyState(isExpanded, true);
  }

  function applyState(expanded, animate) {
    if (expanded) {
      sidebar.classList.add('expanded');
    } else {
      sidebar.classList.remove('expanded');
    }

    // Rotate toggle icon
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('svg');
      if (icon) {
        icon.style.transition = animate ? 'transform 260ms cubic-bezier(0.4,0,0.2,1)' : 'none';
        icon.style.transform = expanded ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }
  }

  /* ---- Collapsible Groups ---- */
  function toggleGroup(item) {
    const groupKey = item.dataset.group;
    const children = document.getElementById(`group-${groupKey}`);
    if (!children) return;

    const isOpen = item.classList.contains('open');
    if (isOpen) {
      closeGroup(item);
    } else {
      openGroup(item, true);
    }
  }

  function openGroup(item, save) {
    const groupKey = item.dataset.group;
    const children = document.getElementById(`group-${groupKey}`);
    if (!children) return;

    item.classList.add('open');
    children.classList.add('open');
    if (save) localStorage.setItem(`mea_group_${groupKey}`, 'open');
  }

  function closeGroup(item) {
    const groupKey = item.dataset.group;
    const children = document.getElementById(`group-${groupKey}`);
    if (!children) return;

    item.classList.remove('open');
    children.classList.remove('open');
    localStorage.setItem(`mea_group_${groupKey}`, 'closed');
  }

  /* ---- Active State ---- */
  function highlightActive() {
    const currentPath = window.location.pathname;

    // Desktop sidebar
    document.querySelectorAll('.nav-item[data-href], .nav-child[data-href]').forEach(el => {
      const href = el.dataset.href;
      if (href && currentPath.endsWith(href)) {
        el.classList.add('active');

        // If child, also open parent
        const parent = el.closest('.nav-children');
        if (parent) {
          const groupId = parent.id.replace('group-', '');
          const parentItem = document.querySelector(`[data-group="${groupId}"]`);
          if (parentItem) openGroup(parentItem, false);
        }
      }
    });

    // Mobile nav
    document.querySelectorAll('.mobile-nav-item[data-href]').forEach(el => {
      if (currentPath.endsWith(el.dataset.href)) {
        el.classList.add('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();

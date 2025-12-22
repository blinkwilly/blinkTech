// pinterest.js
// Lightweight integration for Pinterest board embedding on the Graphics tab.
// Uses Pinterest official widget script for optimized, arranged images.
(function () {
  'use strict';

  const PINTEREST_WIDGET_SRC = 'https://assets.pinterest.com/js/pinit.js';
  const storeKey = 'pinterestBoardUrl';

  function loadPinterestSDK() {
    return new Promise((resolve) => {
      if (window.PinUtils && typeof window.PinUtils.build === 'function') {
        resolve();
        return;
      }
      const existing = document.querySelector(`script[src="${PINTEREST_WIDGET_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }
      const s = document.createElement('script');
      s.async = true;
      s.defer = true;
      s.src = PINTEREST_WIDGET_SRC;
      s.onload = () => resolve();
      document.body.appendChild(s);
    });
  }

  function setMessage(msg, isError) {
    const el = document.getElementById('pinterest-config-message');
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle('text-danger', !!isError);
  }

  function getBoardUrl() {
    try {
      return localStorage.getItem(storeKey) || '';
    } catch (_) {
      return '';
    }
  }

  function setBoardUrl(url) {
    try {
      if (url) localStorage.setItem(storeKey, url);
      else localStorage.removeItem(storeKey);
    } catch (_) { }
  }

  function sanitizeBoardUrl(url) {
    try {
      const u = new URL(url);
      if (u.hostname.indexOf('pinterest.') === -1) return null;
      // force trailing slash for widget stability
      if (!u.pathname.endsWith('/')) u.pathname += '/';
      return u.origin + u.pathname;
    } catch (e) {
      return null;
    }
  }

  function createBoardEmbed(boardUrl) {
    const container = document.getElementById('pinterest-board-container');
    if (!container) return;
    container.innerHTML = '';

    // Responsive layout: adapt data-pin-board-width based on container width
    const width = Math.max(320, Math.min(1200, container.clientWidth || 900));
    const height = Math.round(width * 0.75);

    const a = document.createElement('a');
    a.setAttribute('data-pin-do', 'embedBoard');
    a.setAttribute('data-pin-board-width', String(width));
    a.setAttribute('data-pin-scale-height', String(Math.max(240, Math.min(420, Math.round(height / 3)))));
    a.setAttribute('data-pin-scale-width', '120');
    a.href = boardUrl;
    a.textContent = 'Pinterest Board';

    // skeleton placeholder while widget builds
    const sk = document.createElement('div');
    sk.className = 'card p-3';
    sk.innerHTML = '<div class="placeholder-glow"><div class="placeholder col-12" style="height: 220px;"></div></div>';

    container.appendChild(sk);
    container.appendChild(a);

    loadPinterestSDK().then(() => {
      // build/refresh widget
      if (window.PinUtils && typeof window.PinUtils.build === 'function') {
        window.PinUtils.build();
        // remove skeleton after a short delay
        setTimeout(() => sk.remove(), 1000);
      } else {
        setMessage('Pinterest widget failed to initialize.', true);
      }
    });
  }

  function reflowOnResize() {
    let tid;
    window.addEventListener('resize', () => {
      clearTimeout(tid);
      tid = setTimeout(() => {
        const url = getBoardUrl();
        if (url) createBoardEmbed(url);
      }, 250);
    });
  }

  function init() {
    const input = document.getElementById('pinterest-board-input');
    const save = document.getElementById('pinterest-board-save');
    const clear = document.getElementById('pinterest-board-clear');

    const stored = getBoardUrl();
    if (stored) {
      if (input) input.value = stored;
      createBoardEmbed(stored);
      setMessage('Loaded Pinterest board.', false);
    }

    // Always try to build any pin embeds present on the page
    loadPinterestSDK().then(() => {
      if (window.PinUtils && typeof window.PinUtils.build === 'function') window.PinUtils.build();
    });

    save?.addEventListener('click', () => {
      const raw = (input?.value || '').trim();
      if (!raw) {
        setMessage('Please paste a public Pinterest board URL.', true);
        return;
      }
      const url = sanitizeBoardUrl(raw);
      if (!url) {
        setMessage('Invalid Pinterest board URL. It should look like https://www.pinterest.com/<user>/<board>/', true);
        return;
      }
      setBoardUrl(url);
      createBoardEmbed(url);
      setMessage('Board saved. Rendering...', false);
    });

    clear?.addEventListener('click', () => {
      if (input) input.value = '';
      setBoardUrl('');
      const container = document.getElementById('pinterest-board-container');
      if (container) container.innerHTML = '';
      setMessage('Pinterest board cleared.', false);
    });

    reflowOnResize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

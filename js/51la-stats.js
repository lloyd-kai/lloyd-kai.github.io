(function () {
  function toNumber(value) {
    if (value === null || value === undefined) return null;
    var num = Number(String(value).replace(/,/g, ''));
    return Number.isFinite(num) ? num : null;
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (!el) return;
    if (value === null || value === undefined) return;
    el.textContent = String(value);
  }

  function findUvPvInObject(obj, depth) {
    if (!obj || typeof obj !== 'object' || depth > 2) return null;

    var uvKeys = ['uv', 'site_uv', 'visitor', 'visitors', 'uniqueVisitors'];
    var pvKeys = ['pv', 'site_pv', 'pageview', 'pageviews', 'visits'];

    var uv = null;
    var pv = null;

    for (var i = 0; i < uvKeys.length; i++) {
      if (obj[uvKeys[i]] !== undefined) {
        uv = toNumber(obj[uvKeys[i]]);
        if (uv !== null) break;
      }
    }

    for (var j = 0; j < pvKeys.length; j++) {
      if (obj[pvKeys[j]] !== undefined) {
        pv = toNumber(obj[pvKeys[j]]);
        if (pv !== null) break;
      }
    }

    if (uv !== null || pv !== null) return { uv: uv, pv: pv };

    var keys = Object.keys(obj);
    for (var k = 0; k < keys.length; k++) {
      var child = obj[keys[k]];
      if (child && typeof child === 'object') {
        var nested = findUvPvInObject(child, depth + 1);
        if (nested && (nested.uv !== null || nested.pv !== null)) return nested;
      }
    }

    return null;
  }

  function tryUpdateFromWindow() {
    var candidates = [];

    if (window.LA) candidates.push(window.LA);
    if (window.__51LA__) candidates.push(window.__51LA__);
    if (window.__la__) candidates.push(window.__la__);
    if (window.__LA__) candidates.push(window.__LA__);

    for (var i = 0; i < candidates.length; i++) {
      var found = findUvPvInObject(candidates[i], 0);
      if (found) {
        if (found.uv !== null) setText('la_value_site_uv', found.uv.toLocaleString());
        if (found.pv !== null) setText('la_value_site_pv', found.pv.toLocaleString());
        if (found.uv !== null || found.pv !== null) return true;
      }
    }

    return false;
  }

  function markPending() {
    var uvEl = document.getElementById('la_value_site_uv');
    var pvEl = document.getElementById('la_value_site_pv');
    if (uvEl && uvEl.textContent.trim() === '--') uvEl.textContent = '统计中';
    if (pvEl && pvEl.textContent.trim() === '--') pvEl.textContent = '统计中';
  }

  function init51LaStats() {
    markPending();

    if (tryUpdateFromWindow()) return;

    var retries = 20;
    var timer = setInterval(function () {
      var ok = tryUpdateFromWindow();
      retries -= 1;
      if (ok || retries <= 0) {
        clearInterval(timer);
        if (!ok) {
          setText('la_value_site_uv', '--');
          setText('la_value_site_pv', '--');
        }
      }
    }, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init51LaStats);
  } else {
    init51LaStats();
  }

  document.addEventListener('pjax:complete', init51LaStats);
})();

// ==UserScript==
// @name         Amazon: Deselect all
// @namespace    http://tampermonkey.net/
// @description  Uncheck first (non-gift) checkbox of each active item in the "Active Items" list, waiting for enable/disable cycles and showing progress.
// @author       luckylucy
// @include      https://*.amazon.*/gp/cart/view.html
// @include      https://*.amazon.*/*/gp/cart/view.html
// @match        https://www.amazon.de/-/en/gp/cart/view.html
// @match        https://www.amazon.com/gp/cart/view.html
// @match        https://www.amazon.co.uk/gp/cart/view.html
// @match        https://www.amazon.ca/gp/cart/view.html
// @match        https://www.amazon.co.jp/gp/cart/view.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.de
// @updateURL    https://raw.githubusercontent.com/luckydonald/userscripts/refs/heads/mane/Amazon%20Deselect%20All/amazon-deselect-all.user.js
// @downloadURL  https://raw.githubusercontent.com/luckydonald/userscripts/refs/heads/mane/Amazon%20Deselect%20All/amazon-deselect-all.user.js
// @updateURL    https://raw.githubusercontent.com/luckydonald/userscripts/mane/Amazon%20Deselect%20All/amazon-deselect-all.user.js
// @downloadURL  https://raw.githubusercontent.com/luckydonald/userscripts/mane/Amazon%20Deselect%20All/amazon-deselect-all.user.js
// @homepageURL  https://github.com/luckydonald/userscripts/tree/mane/Amazon%20Deselect%20All
// @supportURL   https://github.com/luckydonald/userscripts/issues/new?title=%5BAmazon%3A%20Deselect%20all%5D%20
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // creates UI: start button after <a id="select-all"> and a body-owned progress bar
  function createUI() {
    const selectAllAnchor = document.querySelector('a#select-all');
    if (!selectAllAnchor) return null;

    const container = document.createElement('div');
    container.id = 'deselect-all-first-checkbox-ui';
    container.style.display = 'inline-block';
    container.style.marginLeft = '8px';
    container.style.verticalAlign = 'middle';

    const btn = document.createElement('button');
    btn.textContent = 'Deselect all (first checkbox)';
    btn.id = 'deselect-all-first-checkbox-btn';
    btn.style.padding = '6px 10px';
    btn.style.cursor = 'pointer';
    btn.style.border = '1px solid #888';
    btn.style.borderRadius = '4px';
    btn.style.background = '#fff';

    const progressWrap = document.createElement('div');
    progressWrap.id = 'deselect-progress-wrap';
    progressWrap.style.width = '360px';
    progressWrap.style.maxWidth = '80vw';
    progressWrap.style.boxSizing = 'border-box';
    progressWrap.style.padding = '8px';
    progressWrap.style.background = '#fff';
    progressWrap.style.border = '1px solid #d5d9d9';
    progressWrap.style.borderRadius = '6px';
    progressWrap.style.boxShadow = '0 2px 8px rgba(15, 17, 17, 0.15)';
    progressWrap.style.zIndex = '2147483647';
    progressWrap.style.display = 'none';

    const barBg = document.createElement('div');
    barBg.style.width = '100%';
    barBg.style.height = '12px';
    barBg.style.background = '#eee';
    barBg.style.border = '1px solid #ccc';
    barBg.style.borderRadius = '6px';
    barBg.style.overflow = 'hidden';

    const bar = document.createElement('div');
    bar.id = 'deselect-progress-bar';
    bar.style.width = '0%';
    bar.style.height = '100%';
    bar.style.background = '#4caf50';
    bar.style.transition = 'width 200ms linear';

    const status = document.createElement('div');
    status.id = 'deselect-progress-status';
    status.style.fontSize = '12px';
    status.style.marginTop = '6px';
    status.style.color = '#333';

    barBg.appendChild(bar);
    progressWrap.appendChild(barBg);
    progressWrap.appendChild(status);

    container.appendChild(btn);

    selectAllAnchor.parentNode.insertBefore(container, selectAllAnchor.nextSibling);
    document.body.appendChild(progressWrap);
    positionProgress(progressWrap, container);
    window.addEventListener('scroll', () => positionProgress(progressWrap, container), { passive: true });
    window.addEventListener('resize', () => positionProgress(progressWrap, container), { passive: true });
    return { btn, bar, status };
  }

  function positionProgress(progressWrap, anchorEl) {
    if (!progressWrap || progressWrap.style.display === 'none') return;

    if (!anchorEl || !anchorEl.isConnected) {
      progressWrap.style.position = 'fixed';
      progressWrap.style.top = '12px';
      progressWrap.style.right = '12px';
      progressWrap.style.left = 'auto';
      progressWrap.style.marginTop = '0';
      return;
    }

    const rect = anchorEl.getBoundingClientRect();
    const shouldFloat = rect.bottom < 0 || window.scrollY > anchorEl.offsetTop + anchorEl.offsetHeight + 20;
    if (shouldFloat) {
      progressWrap.style.position = 'fixed';
      progressWrap.style.top = '12px';
      progressWrap.style.right = '12px';
      progressWrap.style.left = 'auto';
      progressWrap.style.marginTop = '0';
      return;
    }

    progressWrap.style.position = 'absolute';
    progressWrap.style.top = `${window.scrollY + rect.bottom + 6}px`;
    progressWrap.style.left = `${Math.min(window.scrollX + rect.left, window.scrollX + window.innerWidth - progressWrap.offsetWidth - 12)}px`;
    progressWrap.style.right = 'auto';
    progressWrap.style.marginTop = '0';
  }

  // main logic converted from earlier snippet
  async function runDeselectUIUpdate() {
    const list = document.querySelector('ul[data-name="Active Items"].sc-list-body');
    if (!list) {
      console.error('List not found');
      alert('Active Items list not found on page.');
      return;
    }

    const items = Array.from(list.querySelectorAll('div[data-asin]'));
    const activeItems = items.filter(it => {
      const itemType = it.getAttribute('data-itemtype') || '';
      const outOfStock = it.getAttribute('data-outofstock');
      return itemType === 'active' && outOfStock !== '1';
    });

    const targetEntries = activeItems.map(it => {
      const labelCheckboxes = Array.from(it.querySelectorAll('label input[type="checkbox"]'));
      let chosen = null;
      for (const inp of labelCheckboxes) {
        const lab = inp.closest('label');
        const labText = lab ? lab.innerText.toLowerCase() : '';
        if (labText.includes('gift')) continue;
        chosen = inp;
        break;
      }
      if (!chosen && labelCheckboxes.length) chosen = labelCheckboxes[0];
      const titleEl = it.querySelector('h3 span') || it.querySelector('[data-a-size="medium_plus"]') || it.querySelector('img[alt]');
      const name = titleEl ? (titleEl.innerText || titleEl.alt || 'Unnamed item') : 'Unnamed item';
      return { root: it, checkbox: chosen, name: name.trim() };
    }).filter(e => e.checkbox);

    const toUncheck = targetEntries.filter(e => e.checkbox.checked);
    const total = toUncheck.length;
    const uiBar = document.getElementById('deselect-progress-bar');
    const uiStatus = document.getElementById('deselect-progress-status');

    if (total === 0) {
      console.log('No active checkboxes to uncheck.');
      if (uiBar) { uiBar.style.width = '100%'; }
      if (uiStatus) { uiStatus.textContent = 'No active checkboxes to uncheck.'; }
      return;
    }

    async function logProgressWarn(index, startTs, currentName, isReal) {
      const done = index;
      const remaining = total - done;
      const elapsed = (Date.now() - startTs) / 1000;
      const avg = elapsed / (done || 1);
      const etaSec = Math.round(avg * remaining);
      const mm = Math.floor(etaSec / 60);
      const ss = etaSec % 60;
      console.warn(`Progress: ${done}/${total} — ETA: ${mm}m ${ss}s — Current: ${currentName}`);
      if (uiBar) uiBar.style.width = `${Math.round((done / total) * 100)}%`;
      if (uiStatus) uiStatus.textContent = `Progress: ${done}/${total} — ETA: ${mm}m ${ss}s — Current: ${currentName}`;
    }

    const start = Date.now();
    for (let i = 0; i < toUncheck.length; i++) {
      const entry = toUncheck[i];
      const chk = entry.checkbox;
      const lab = chk.closest('label');
      if (lab) lab.style.background = 'hotpink';

      // wait until enabled
      await waitFor(() => !chk.disabled, 10000).catch(() => {});

      if (chk.checked && !chk.disabled) {
        await scrollToCheckbox(chk);
        chk.focus();
        chk.click();
        // run progress log twice, once asynchronously ~500ms after click to come after Amazon's log stuff
        await logProgressWarn(i, start, entry.name, true);
        (async () => { await delay(500); await logProgressWarn(i, start, entry.name, false); })();
      } else {
        // if nothing to do, still log immediately with warn
        console.warn(`Progress: ${i}/${total} — ETA: calculating — Current: ${entry.name}`);
        if (uiStatus) uiStatus.textContent = `Progress: ${i}/${total} — ETA: calculating — Current: ${entry.name}`;
      }

      // wait for disabled->enabled cycle if it occurs
      await waitFor(() => chk.disabled === true, 5000).catch(() => { });
      await waitFor(() => chk.disabled === false, 15000).catch(() => { });

      await delay(300);
      if (chk.checked) {
        try {
          chk.checked = false;
          chk.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) { /* ignore */ }
      }
    }

    // final log and UI update
    console.warn(`Progress: ${total}/${total} — ETA: 0m 0s — Current: Done`);
    if (uiBar) uiBar.style.width = '100%';
    if (uiStatus) uiStatus.textContent = `Progress: ${total}/${total} — Done`;
  }

  function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

  async function scrollToCheckbox(chk) {
    chk.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    await delay(250);
  }

  function waitFor(predicate, timeout = 10000, interval = 100) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      (function poll() {
        try {
          if (predicate()) return resolve(true);
        } catch (e) { }
        if (Date.now() - start >= timeout) return reject(new Error('timeout'));
        setTimeout(poll, interval);
      })();
    });
  }

  // attach UI and event
  const ui = createUI();
  if (ui && ui.btn) {
    ui.btn.addEventListener('click', async function () {
      ui.btn.disabled = true;
      ui.btn.textContent = 'Running...';
      const progressWrap = document.getElementById('deselect-progress-wrap');
      if (progressWrap) {
        progressWrap.style.display = 'block';
        positionProgress(progressWrap, document.getElementById('deselect-all-first-checkbox-ui'));
      }
      if (document.getElementById('deselect-progress-bar')) {
        document.getElementById('deselect-progress-bar').style.width = '0%';
      }
      if (document.getElementById('deselect-progress-status')) {
        document.getElementById('deselect-progress-status').textContent = 'Starting...';
      }
      try {
        await runDeselectUIUpdate();
      } catch (e) {
        console.error('Error during deselect:', e);
        if (document.getElementById('deselect-progress-status')) {
          document.getElementById('deselect-progress-status').textContent = 'Error: see console.';
        }
      } finally {
        ui.btn.disabled = false;
        ui.btn.textContent = 'Deselect all (first checkbox)';
      }
    }, { once: false });
  }
})();

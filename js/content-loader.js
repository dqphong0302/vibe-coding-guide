(() => {
  'use strict';

  const FEATURE_SCRIPTS = [
    'js/app.js?v=47'
  ];

  const loadedModules = new Set();
  const loadingPromises = new Map();

  async function fetchModuleMarkup(moduleId) {
    if (location.protocol === 'file:') {
      const markup = window.PAGE_MODULES?.[moduleId];
      if (!markup) throw new Error(`${moduleId}: missing from offline bundle`);
      return markup;
    }
    const response = await fetch(`partials/pages/${moduleId}.html`);
    if (!response.ok) throw new Error(`${moduleId}: HTTP ${response.status}`);
    return await response.text();
  }

  async function loadPageModule(moduleId) {
    if (loadedModules.has(moduleId)) return true;
    if (loadingPromises.has(moduleId)) return loadingPromises.get(moduleId);

    const promise = (async () => {
      const placeholder = document.querySelector(`[data-page-module="${moduleId}"]`);
      if (!placeholder) return true; // Already loaded or removed

      try {
        const markup = await fetchModuleMarkup(moduleId);
        const template = document.createElement('template');
        template.innerHTML = markup.trim();
        const page = template.content.firstElementChild;
        if (!page?.classList.contains('ebook-page')) {
          throw new Error(`${moduleId}: invalid page module`);
        }
        placeholder.replaceWith(page);
        loadedModules.add(moduleId);

        // Re-dispatch content-ready event for dynamically loaded pages
        window.dispatchEvent(new CustomEvent('page-module-loaded', { detail: { moduleId, element: page } }));
        return true;
      } catch (err) {
        console.error(`Error loading page module ${moduleId}:`, err);
        if (placeholder?.isConnected) {
          placeholder.outerHTML = `
            <article class="ebook-page module-load-error" id="${moduleId}">
              <p>Không thể tải nội dung ${moduleId}. Vui lòng thử lại.</p>
            </article>`;
        }
        return false;
      } finally {
        loadingPromises.delete(moduleId);
      }
    })();

    loadingPromises.set(moduleId, promise);
    return promise;
  }

  window.ensurePageLoaded = loadPageModule;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Không thể tải ${src}`));
      document.body.appendChild(script);
    });
  }

  async function bootstrap() {
    if (location.protocol === 'file:') {
      await loadScript('js/page-content.js?v=2');
    }

    // Determine initial target page from hash or default to 'home'
    const initialHash = (location.hash || '#home').replace(/^#/, '');
    const initialPlaceholder = document.querySelector(`[data-page-module="${initialHash}"]`);
    const initialId = initialPlaceholder ? initialHash : 'home';

    // 1. Prioritize loading active page immediately
    await loadPageModule(initialId);

    // 2. Load core feature scripts (app.js)
    for (const src of FEATURE_SCRIPTS) {
      await loadScript(src);
    }

    // 3. Progressive idle preloading for remaining pages in background
    const idlePreload = () => {
      const remainingPlaceholders = [...document.querySelectorAll('[data-page-module]')];
      remainingPlaceholders.forEach((el, index) => {
        const id = el.dataset.pageModule;
        // Stagger prefetch during browser idle periods
        setTimeout(() => {
          if (!loadedModules.has(id)) {
            loadPageModule(id);
          }
        }, 150 * (index + 1));
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(idlePreload, { timeout: 1200 });
    } else {
      setTimeout(idlePreload, 600);
    }
  }

  window.siteContentReady = bootstrap().catch((error) => {
    console.error('Website bootstrap failed:', error);
  });
})();

(() => {
  'use strict';

  const FEATURE_SCRIPTS = [
    'js/app.js?v=48'
  ];

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

  async function loadPageModule(placeholder) {
    const moduleId = placeholder.dataset.pageModule;
    const markup = await fetchModuleMarkup(moduleId);
    const template = document.createElement('template');
    template.innerHTML = markup.trim();
    const page = template.content.firstElementChild;
    if (!page?.classList.contains('ebook-page')) {
      throw new Error(`${moduleId}: invalid page module`);
    }
    placeholder.replaceWith(page);
  }

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

    // 1. Load all 17 page module structures
    const placeholders = [...document.querySelectorAll('[data-page-module]')];
    const results = await Promise.allSettled(placeholders.map(loadPageModule));

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') return;
      const placeholder = placeholders[index];
      if (!placeholder.isConnected) return;
      placeholder.outerHTML = `
        <article class="ebook-page module-load-error" id="${placeholder.dataset.pageModule}">
          <p>Không thể tải nội dung này. Vui lòng tải lại trang.</p>
        </article>`;
      console.error(result.reason);
    });

    // 2. Initialize application logic (app.js isolates each chapter as individual slide)
    for (const src of FEATURE_SCRIPTS) {
      await loadScript(src);
    }
  }

  window.siteContentReady = bootstrap().catch((error) => {
    console.error('Website bootstrap failed:', error);
  });
})();

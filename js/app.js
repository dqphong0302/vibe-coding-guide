(function () {
  'use strict';

  const STORAGE_KEY = 'aiagent-ebook-progress-v3';
  const VIEWED_KEY = 'aiagent-ebook-viewed-v3';

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const chapterVideos = {
    'chapter-1': 'z4aoLLaV4-4',
    'chapter-2': 'jSyH0HxKQPY',
    'chapter-4': 'jxHzdaNMUlI',
    'chapter-5': 'PqxPSzeoVQU',
    'chapter-6': 'XSpYx8IEk6c',
    'chapter-8': 'bJosdenauog',
    'chapter-10': '4t0zD9gveo0',
    'chapter-12': 'U00nmT_jWYs'
  };

  function initVideoPlayers() {
    const isFileProtocol = location.protocol === 'file:';

    Object.entries(chapterVideos).forEach(([chapterId, videoId]) => {
      const chapter = document.getElementById(chapterId);
      const box = chapter?.querySelector('.video-guideline-box');
      const banner = box?.querySelector('.video-card-banner');
      if (!box || !banner) return;

      // Always update external watch links
      box.querySelectorAll('.video-guideline-link').forEach((link) => {
        link.href = `https://www.youtube.com/watch?v=${videoId}`;
      });

      if (isFileProtocol) {
        // In local file:// mode, Google/YouTube security blocks iframe embeds with Error 150 (origin: null).
        // Render a high-fidelity interactive preview card with real thumbnail & direct launch button.
        banner.style.backgroundImage = `linear-gradient(rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.88)), url('https://img.youtube.com/vi/${videoId}/hqdefault.jpg')`;
        banner.style.backgroundSize = 'cover';
        banner.style.backgroundPosition = 'center';

        let notice = banner.querySelector('.video-file-notice');
        if (!notice) {
          notice = document.createElement('div');
          notice.className = 'video-file-notice';
          notice.innerHTML = `<span style="font-size: 11px; color: #94a3b8; background: rgba(0,0,0,0.6); padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">💡 Chế độ mở File cục bộ (file://) — Bấm nút dưới để mở xem video</span>`;
          banner.appendChild(notice);
        }

        const playBtn = banner.querySelector('.video-play-btn');
        if (playBtn) {
          playBtn.href = `https://www.youtube.com/watch?v=${videoId}`;
          playBtn.target = '_blank';
          playBtn.rel = 'noopener';
        }
      } else {
        // In http: or https: mode (Live Server / Vercel / GitHub Pages), embed live YouTube iframe
        const player = document.createElement('div');
        player.className = 'video-player-wrap';
        player.innerHTML = `<iframe
          src="https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1"
          title="Video YouTube của ${chapterId}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>`;
        banner.replaceWith(player);
      }
    });
  }

  // Define the ordered list of Ebook pages / chapters
  const slideOrder = [
    'home',
    'chapter-1',
    'chapter-2',
    'chapter-3',
    'chapter-4',
    'chapter-5',
    'chapter-6',
    'chapter-7',
    'chapter-8',
    'chapter-9',
    'chapter-10',
    'chapter-11',
    'chapter-12',
    'appendix-a',
    'appendix-c',
    'medical-course',
    'admin-guide'
  ];

  const slideLabels = {
    'home': 'Trang bìa & Mục lục Ebook',
    'chapter-1': 'Chương 01: Bản chất Vibe Coding',
    'chapter-2': 'Chương 02: Kiến trúc Web App',
    'chapter-3': 'Chương 03: Chuẩn bị Workspace',
    'chapter-4': 'Chương 04: Google Antigravity',
    'chapter-5': 'Chương 05: OpenAI Codex',
    'chapter-6': 'Chương 06: Claude Desktop & MCP',
    'chapter-7': 'Chương 07: So sánh & Phối hợp',
    'chapter-8': 'Chương 08: Thiết kế UI/UX & Google Stitch',
    'chapter-9': 'Chương 09: Dữ liệu & Bảo mật',
    'chapter-10': 'Chương 10: Đặc tả Spec-Driven',
    'chapter-11': 'Chương 11: Kiểm thử & Sửa lỗi',
    'chapter-12': 'Chương 12: Go-Live & Xuất bản',
    'appendix-a': 'Phụ lục A: Thư viện Prompt',
    'appendix-c': 'Phụ lục C: Bộ Starter Kit',
    'medical-course': 'Chuyên đề: Vibe Coding Y khoa',
    'admin-guide': 'Chuyên đề: Số hóa quy trình 8 cổng'
  };

  // Collect all slides in the main content area
  const allSlides = $$('#main > article.ebook-page');
  const orderIndex = new Map(slideOrder.map((id, index) => [id, index]));
  const slides = allSlides.sort((a, b) => (orderIndex.get(a.id) ?? 999) - (orderIndex.get(b.id) ?? 999));

  // Storage helpers
  function readCompleted() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return new Set(Array.isArray(stored) ? stored.map(String) : []);
    } catch {
      return new Set();
    }
  }

  function readViewed() {
    try {
      const stored = JSON.parse(localStorage.getItem(VIEWED_KEY) || '[]');
      const validIds = new Set(slides.map((s) => s.id));
      return new Set(Array.isArray(stored) ? stored.filter((id) => validIds.has(id)) : []);
    } catch {
      return new Set();
    }
  }

  let completedChapters = readCompleted();
  let viewedSlides = readViewed();
  let activeSlideIndex = 0;

  function persistState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedChapters]));
      localStorage.setItem(VIEWED_KEY, JSON.stringify([...viewedSlides]));
      return true;
    } catch {
      return false;
    }
  }

  // Toast notification helper
  function toast(message) {
    let element = $('#toast');
    if (!element) {
      element = document.createElement('div');
      element.id = 'toast';
      element.className = 'toast';
      document.body.appendChild(element);
    }
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => element.classList.remove('show'), 2400);
  }

  function getSlideLabel(slide) {
    if (!slide) return 'Nội dung Ebook';
    if (slideLabels[slide.id]) return slideLabels[slide.id];
    const h2 = slide.querySelector('h2')?.textContent.trim();
    if (h2) return h2;
    return 'Chương Ebook';
  }

  function slideContaining(target) {
    return slides.findIndex((slide) => slide === target || slide.contains(target));
  }

  function updateProgressMetrics() {
    const totalChapters = 12;
    const completedCount = completedChapters.size;
    const percent = Math.round((completedCount / totalChapters) * 100);

    const progressLabel = $('#progress-label');
    if (progressLabel) progressLabel.textContent = `${completedCount}/${totalChapters} chương`;

    const progressBar = $('#progress-bar');
    if (progressBar) progressBar.style.width = `${percent}%`;

    const progressMsg = $('#progress-message');
    if (progressMsg) {
      if (completedCount === 0) {
        progressMsg.textContent = 'Dùng phím ← / → hoặc thanh điều hướng để chuyển chương.';
      } else if (completedCount < totalChapters) {
        progressMsg.textContent = `Đã đọc xong ${percent}% Ebook. Lịch sử lưu tự động.`;
      } else {
        progressMsg.textContent = '🎉 Xuất sắc! Bạn đã hoàn thành trọn bộ 12 Chương.';
      }
    }

    // Sidebar checkmarks
    $$('.sidebar nav a[data-chapter]').forEach((link) => {
      const chNum = link.dataset.chapter;
      const isDone = completedChapters.has(String(chNum));
      link.classList.toggle('done', isDone);
    });

    // Chapter completion buttons
    $$('[data-complete-chapter]').forEach((button) => {
      const chNum = String(button.dataset.completeChapter);
      const isDone = completedChapters.has(chNum);
      button.classList.toggle('completed', isDone);
      button.textContent = isDone ? '✓ Đã đọc xong chương' : 'Đánh dấu đã đọc chương này';
    });

    persistState();
  }

  // Show a specific slide / page by index (Natural Window Scroll)
  function showSlide(index, options = {}) {
    const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
    activeSlideIndex = safeIndex;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === safeIndex;
      slide.hidden = !active;
      slide.classList.toggle('is-active-slide', active);
    });

    // Scroll window naturally to top on page switch
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const activeSlide = slides[safeIndex];
    if (activeSlide?.id) {
      viewedSlides.add(activeSlide.id);
    }

    const currentNum = String(safeIndex + 1).padStart(2, '0');
    const totalNum = String(slides.length).padStart(2, '0');

    // Update Top Sticky Reader Bar
    const topTitle = $('#reader-current-title');
    if (topTitle) topTitle.textContent = getSlideLabel(activeSlide);

    const topPageNum = $('#top-page-num');
    if (topPageNum) topPageNum.textContent = `${currentNum} / ${totalNum}`;

    const topBtnPrev = $('#top-btn-prev');
    if (topBtnPrev) topBtnPrev.disabled = safeIndex === 0;

    const topBtnNext = $('#top-btn-next');
    if (topBtnNext) topBtnNext.disabled = safeIndex === slides.length - 1;

    // Update top reading line indicator
    const readingBar = $('#reading');
    if (readingBar) {
      readingBar.style.width = `${((safeIndex + 1) / slides.length) * 100}%`;
    }

    // Highlight active link in sidebar
    $$('.sidebar nav a, .side-tools a').forEach((link) => {
      const href = link.getAttribute('href');
      const isActive = href === `#${activeSlide?.id}`;
      link.classList.toggle('active', isActive);
      link.classList.toggle('current', isActive);
    });

    if (options.updateHash !== false && activeSlide?.id) {
      history.replaceState(null, '', `#${activeSlide.id}`);
    }

    updateProgressMetrics();
  }

  function showSlideForTarget(target, options = {}) {
    if (!target) return;
    const index = slideContaining(target);
    if (index < 0) return;
    showSlide(index, { updateHash: options.updateHash });
  }

  function activateHashSlide() {
    const target = location.hash ? document.querySelector(location.hash) : $('#home');
    showSlideForTarget(target || $('#home'), { updateHash: false });
  }

  // Lightbox Modal Setup
  function initLightbox() {
    const lightbox = $('#image-lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const lightboxCap = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    function openLightbox(src, captionText) {
      if (!lightboxImg) return;
      lightboxImg.src = src;
      if (lightboxCap) lightboxCap.innerHTML = captionText || '';
      lightbox.classList.add('active');
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxClose) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });

    $$('.figure-img-wrap, .zoom-btn').forEach((elem) => {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        const card = elem.closest('.figure-showcase') || elem.closest('figure');
        const img = card ? card.querySelector('img') : elem.querySelector('img');
        const cap = card ? (card.querySelector('.figure-caption')?.innerHTML || img?.alt) : '';
        if (img && img.src) openLightbox(img.src, cap);
      });
    });
  }

  // Copy buttons
  function initCopyButtons() {
    $$('[data-copy]').forEach((button) => {
      button.addEventListener('click', async () => {
        const targetId = button.dataset.copy;
        const targetElem = document.getElementById(targetId);
        if (!targetElem) return;
        const text = targetElem.innerText || targetElem.textContent;
        try {
          await navigator.clipboard.writeText(text.trim());
          toast('✓ Đã sao chép vào bộ nhớ đệm!');
          const origText = button.textContent;
          button.textContent = '✓ Đã chép';
          setTimeout(() => { button.textContent = origText; }, 2000);
        } catch {
          toast('Không thể sao chép — hãy chọn văn bản thủ công.');
        }
      });
    });
  }

  // Chapter completion toggle
  function initCompletionButtons() {
    $$('[data-complete-chapter]').forEach((button) => {
      button.addEventListener('click', () => {
        const chNum = String(button.dataset.completeChapter);
        if (completedChapters.has(chNum)) {
          completedChapters.delete(chNum);
          toast(`Đã bỏ đánh dấu Chương ${chNum}.`);
        } else {
          completedChapters.add(chNum);
          toast(`✓ Đã hoàn thành Chương ${chNum}!`);
          if (activeSlideIndex < slides.length - 1) {
            setTimeout(() => showSlide(activeSlideIndex + 1), 600);
          }
        }
        updateProgressMetrics();
      });
    });
  }

  // Mobile sidebar controls
  function initSidebar() {
    const sidebar = $('#sidebar');
    const backdrop = $('#backdrop');
    const menuBtn = $('#menu');
    const closeBtn = $('#close');

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    }

    function openSidebar() {
      if (sidebar) sidebar.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    }

    if (menuBtn) menuBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (backdrop) backdrop.addEventListener('click', closeSidebar);

    $$('.sidebar a').forEach((link) => {
      link.addEventListener('click', closeSidebar);
    });
  }

  // Keyboard navigation (Arrow keys flip chapters)
  function initKeyNavigation() {
    window.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(event.target.tagName) || event.target.isContentEditable) return;
      if (['ArrowRight', 'PageDown'].includes(event.key)) {
        event.preventDefault();
        showSlide(activeSlideIndex + 1);
      } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        showSlide(activeSlideIndex - 1);
      }
    });
  }

  // Touch swipe navigation for mobile Ebook reading
  function initSwipeNavigation() {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > 75 && Math.abs(diffY) < 50) {
        if (diffX < 0) {
          showSlide(activeSlideIndex + 1);
        } else {
          showSlide(activeSlideIndex - 1);
        }
      }
    }, { passive: true });
  }

  // Reset Progress
  function initReset() {
    const resetBtn = $('#reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn đặt lại toàn bộ tiến độ đọc Ebook?')) {
          completedChapters.clear();
          viewedSlides.clear();
          persistState();
          updateProgressMetrics();
          showSlide(0, { updateHash: false });
          toast('Đã đặt lại tiến độ đọc về 0%.');
        }
      });
    }
  }

  // Link click handlers
  function initLinkHandlers() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        showSlideForTarget(target);
      }
    });
  }

  // Interactive Labs Management
  function initInteractiveLabs() {
    // 1. Prompt Builder Lab
    const pbPresets = {
      'new-app': {
        goal: 'Xây dựng ứng dụng web Quản lý đề nghị cấp giấy xác nhận sinh viên chạy trên trình duyệt.',
        context: 'Đọc kỹ SPEC.md, AGENTS.md, cấu trúc thư mục hiện tại và file mock data DU_LIEU_MAU.json.',
        constraints: 'Chỉ dùng HTML5/CSS/Vanilla JS thuần; dữ liệu lưu localStorage; responsive mobile mượt mà; tuyệt đối không đưa PII lên prompt.',
        doneWhen: 'Giao diện hiển thị đầy đủ form nộp hồ sơ, kiểm tra dữ liệu hợp lệ, lưu vào bảng và mở preview trên trình duyệt không lỗi console.'
      },
      'bugfix': {
        goal: 'Khắc phục lỗi form không hiển thị thông báo đỏ khi người dùng nhập thiếu ngày sinh.',
        context: 'Xem lại mã nguồn tại file js/app.js (hàm validateForm), file index.html và bảng test case trong UAT_HANH_CHINH.md.',
        constraints: 'Chỉ sửa đúng hàm kiểm tra dữ liệu (Minimal Fix); không thay đổi cấu trúc HTML hoặc các class CSS đang hoạt động ổn định.',
        doneWhen: 'Nhập thiếu ngày sinh bấm Gửi thì hiện thông báo lỗi rõ ràng; nhập đủ dữ liệu thì gửi thành công và không phát sinh lỗi regression.'
      },
      'spec': {
        goal: 'Bóc tách tài liệu yêu cầu nghiệp vụ thành file SPEC.md hoàn chỉnh theo chuẩn 10 phần và tiêu chí Given-When-Then.',
        context: 'Đọc file QUY_TRINH_HANH_CHINH.md, MA_TRAN_QUYEN.csv và các biểu mẫu đính kèm trong thư mục starter/.',
        constraints: 'Không viết code ở lượt này; mọi yêu cầu phải có mã định danh (AC-01..AC-10); chỗ nào chưa rõ nghiệp vụ phải đặt câu hỏi để tôi trả lời.',
        doneWhen: 'File SPEC.md được tạo ở thư mục gốc với đầy đủ 10 phần, ma trận trạng thái và bảng câu hỏi xác nhận trước khi lập trình.'
      },
      'security': {
        goal: 'Rà soát toàn bộ dự án để thiết lập ma trận phân quyền vai trò (RBAC) và phòng chống lộ lọt dữ liệu.',
        context: 'Đọc MA_TRAN_QUYEN.csv, file cấu hình biến môi trường và toàn bộ các endpoint xử lý dữ liệu.',
        constraints: 'Tuân thủ nguyên tắc Quyền tối thiểu (Least Privilege); đảm bảo không lưu trữ API Key hoặc mật khẩu ở mã nguồn phía client.',
        doneWhen: 'Kiểm thử quyền âm (negative testing) đạt 100%: người dùng chưa đăng nhập hoặc sai vai trò không thể truy cập tài nguyên bảo mật.'
      },
      'mcp': {
        goal: 'Thiết kế cấu hình MCP Server kết nối CSDL SQLite/PostgreSQL nội bộ với AI Agent.',
        context: 'Đọc sơ đồ kiến trúc tại docs/mcp_architecture.md và file cấu hình claude_desktop_config.json.',
        constraints: 'Chỉ cấp quyền đọc (Read-only) với bảng nhạy cảm; giới hạn truy vấn tối đa 100 bản ghi mỗi lượt gọi.',
        doneWhen: 'Agent gọi công cụ qua MCP trả về đúng dữ liệu có cấu trúc JSON và không gây treo kết nối.'
      }
    };

    const toolSelect = $('#pb-tool-select');
    const goalInput = $('#pb-goal-input');
    const contextInput = $('#pb-context-input');
    const constraintsInput = $('#pb-constraints-input');
    const doneWhenInput = $('#pb-donewhen-input');
    const outputBox = $('#pb-output-box');
    const copyBtn = $('#pb-copy-prompt-btn');
    const presetBtns = $$('.btn-prompt-preset');

    function updatePromptOutput() {
      if (!outputBox) return;
      const tool = toolSelect ? toolSelect.value : 'antigravity';
      const goal = goalInput ? goalInput.value.trim() : '';
      const context = contextInput ? contextInput.value.trim() : '';
      const constraints = constraintsInput ? constraintsInput.value.trim() : '';
      const doneWhen = doneWhenInput ? doneWhenInput.value.trim() : '';

      let toolDirective = '';
      if (tool === 'antigravity') {
        toolDirective = '> 🌌 CHỈ THỊ CHO GOOGLE ANTIGRAVITY:\n> Hãy lập kế hoạch Implementation Plan, liệt kê các file cần tạo/sửa trước khi thực hiện. Sử dụng Browser Subagent để kiểm thử nghiệm thu sau khi hoàn tất.';
      } else if (tool === 'codex') {
        toolDirective = '> ⚡ CHỈ THỊ CHO OPENAI CODEX:\n> Đọc quy tắc AGENTS.md, chỉ sửa đổi mã nguồn trong phạm vi Sandbox, tạo Session riêng cho tác vụ này và trình bày visual diff rõ ràng.';
      } else {
        toolDirective = '> 🟣 CHỈ THỊ CHO CLAUDE DESKTOP / CLAUDE CODE:\n> Tuân thủ giao thức MCP, tuân thủ nguyên tắc Minimal Diff và báo cáo tóm tắt các thay đổi sau khi hoàn thành.';
      }

      const fullPrompt = `${toolDirective}

## 1. MỤC TIÊU CỐT LÕI (GOAL)
${goal || '[Chưa nhập mục tiêu]'}

## 2. NGỮ CẢNH CẦN ĐỌC (CONTEXT)
${context || '[Chưa nhập ngữ cảnh]'}

## 3. RÀNG BUỘC KỸ THUẬT & AN TOÀN (CONSTRAINTS)
${constraints || '[Chưa nhập ràng buộc]'}

## 4. TIÊU CHÍ HOÀN THÀNH ĐỂ NGHIỆM THU (DONE-WHEN)
${doneWhen || '[Chưa nhập tiêu chí hoàn thành]'}`;

      outputBox.textContent = fullPrompt;
    }

    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        presetBtns.forEach((b) => {
          b.style.background = '#f8fafc';
          b.style.color = '#334155';
          b.classList.remove('active');
        });
        btn.style.background = '#0f172a';
        btn.style.color = '#ffffff';
        btn.classList.add('active');

        const presetKey = btn.dataset.preset;
        const data = pbPresets[presetKey];
        if (data) {
          if (goalInput) goalInput.value = data.goal;
          if (contextInput) contextInput.value = data.context;
          if (constraintsInput) constraintsInput.value = data.constraints;
          if (doneWhenInput) doneWhenInput.value = data.doneWhen;
          updatePromptOutput();
        }
      });
    });

    [toolSelect, goalInput, contextInput, constraintsInput, doneWhenInput].forEach((el) => {
      if (el) {
        el.addEventListener('input', updatePromptOutput);
        el.addEventListener('change', updatePromptOutput);
      }
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!outputBox) return;
        navigator.clipboard.writeText(outputBox.textContent).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = '✓ Đã sao chép vào Clipboard!';
          copyBtn.style.background = '#10b981';
          toast('Đã sao chép Prompt hoàn chỉnh vào bộ nhớ tạm!');
          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#2563eb';
          }, 2500);
        });
      });
    }

    updatePromptOutput();

    // 2. Token & Quota Simulator Lab
    const simTurnsSlider = $('#sim-turns-slider');
    const simContextSlider = $('#sim-context-slider');
    const simModelSelect = $('#sim-model-select');
    const simTurnsVal = $('#sim-turns-val');
    const simContextVal = $('#sim-context-val');
    const simTotalTokens = $('#sim-total-tokens');
    const sim5hPercent = $('#sim-5h-percent');
    const sim5hBar = $('#sim-5h-bar');
    const simAdviceText = $('#sim-advice-text');

    function updateQuotaSimulator() {
      if (!simTurnsSlider || !simContextSlider) return;
      const turns = parseInt(simTurnsSlider.value, 10);
      const contextKb = parseInt(simContextSlider.value, 10);
      const model = simModelSelect ? simModelSelect.value : 'balanced';

      if (simTurnsVal) simTurnsVal.textContent = `${turns} lượt trao đổi`;
      const contextTokens = contextKb * 250;
      if (simContextVal) simContextVal.textContent = `${contextKb} KB (~${contextTokens.toLocaleString()} tokens)`;

      // Simulation math:
      // In conversational sessions, each turn sends: prompt (150t) + attached files (contextTokens) + full conversation history
      const avgPromptTokens = 150;
      const avgResponseTokens = 450;
      let totalAccumulatedInput = 0;
      for (let i = 1; i <= turns; i++) {
        const historyTokens = (i - 1) * (avgPromptTokens + avgResponseTokens);
        totalAccumulatedInput += (avgPromptTokens + contextTokens + historyTokens);
      }
      const totalAccumulatedOutput = turns * avgResponseTokens;
      const totalTokens = totalAccumulatedInput + totalAccumulatedOutput;

      if (simTotalTokens) {
        simTotalTokens.textContent = `~${Math.round(totalTokens).toLocaleString()} Tokens`;
      }

      // Quota multiper:
      let modelMultiplier = 1.0;
      let limitUnits = 100;
      if (model === 'flash') {
        modelMultiplier = 0.35;
        limitUnits = 150;
      } else if (model === 'heavy') {
        modelMultiplier = 3.2;
        limitUnits = 40;
      }

      const consumedUnits = (turns * (1 + (contextKb / 30) + (turns / 12))) * modelMultiplier;
      let percentUsed = Math.min(100, Math.round((consumedUnits / limitUnits) * 100));

      if (sim5hPercent) sim5hPercent.textContent = `${percentUsed}%`;
      if (sim5hBar) {
        sim5hBar.style.width = `${percentUsed}%`;
        if (percentUsed > 80) {
          sim5hBar.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
          if (sim5hPercent) sim5hPercent.style.color = '#ef4444';
        } else if (percentUsed > 50) {
          sim5hBar.style.background = 'linear-gradient(90deg, #10b981, #f59e0b)';
          if (sim5hPercent) sim5hPercent.style.color = '#f59e0b';
        } else {
          sim5hBar.style.background = '#10b981';
          if (sim5hPercent) sim5hPercent.style.color = '#10b981';
        }
      }

      if (simAdviceText) {
        if (percentUsed >= 85) {
          simAdviceText.innerHTML = '🚨 <strong>CẢNH BÁO HẠN NGẠCH:</strong> Phiên hội thoại đã quá dài và tiêu tốn nhiều token! AI rất dễ bị "lú lẫn" do ngữ cảnh quá tải. Hãy <strong>tạo Session mới ngay</strong> và chỉ đính kèm các file cần thiết.';
        } else if (turns >= 20) {
          simAdviceText.innerHTML = '⚠️ <strong>LƯU Ý NGỮ CẢNH:</strong> Số lượt trao đổi đã chạm ngưỡng 20. Nên tổng hợp lại kết quả vào file Markdown (ví dụ <code>TIEN_DO.md</code>) rồi mở phiên mới để giữ tốc độ phản hồi nhanh.';
        } else if (contextKb >= 100) {
          simAdviceText.innerHTML = '💡 <strong>MẸO TIẾT KIỆM TOKEN:</strong> Bạn đang đính kèm file khá lớn. Hãy chia nhỏ file hoặc chỉ yêu cầu Agent đọc đúng các đoạn hàm mục tiêu thay vì gửi toàn bộ codebase.';
        } else {
          simAdviceText.innerHTML = '✅ <strong>TRẠNG THÁI HOÀN HẢO:</strong> Phiên hội thoại gọn gàng, bộ nhớ ngữ cảnh tối ưu, chi phí token thấp và AI phản hồi nhanh với độ chính xác cao nhất.';
        }
      }
    }

    if (simTurnsSlider && simContextSlider) {
      [simTurnsSlider, simContextSlider, simModelSelect].forEach((el) => {
        if (el) {
          el.addEventListener('input', updateQuotaSimulator);
          el.addEventListener('change', updateQuotaSimulator);
        }
      });
      updateQuotaSimulator();
    }

    // 3. Decision Matrix Lab
    const decisionCards = $$('.decision-card');
    decisionCards.forEach((card) => {
      card.addEventListener('click', () => {
        decisionCards.forEach((c) => {
          c.style.border = '1px solid #e2e8f0';
          c.style.background = '#f8fafc';
          c.classList.remove('active');
          const title = c.querySelector('b');
          if (title) title.style.color = '#0f172a';
        });
        card.style.border = '2px solid #2563eb';
        card.style.background = '#eff6ff';
        card.classList.add('active');
        const activeTitle = card.querySelector('b');
        if (activeTitle) activeTitle.style.color = '#1d4ed8';
        toast(`Đã chọn phương án: ${activeTitle ? activeTitle.textContent : ''}`);
      });
    });
  }

  // Admin Guide 8-Gates interactive progress
  function initAdminGuide() {
    const adminGuide = $('#admin-guide');
    if (!adminGuide) return;

    let doneGates = new Set();
    try {
      doneGates = new Set(JSON.parse(localStorage.getItem('admin-guide-progress') || '[]'));
    } catch { }

    function updateGates() {
      const btns = $$('#admin-guide [data-complete]');
      btns.forEach((b) => {
        const id = b.dataset.complete;
        const yes = doneGates.has(id);
        b.classList.toggle('done', yes);
        b.textContent = yes ? '✓ Đã qua cổng' : (id === '8' ? 'Hoàn thành guideline' : 'Đánh dấu qua cổng');
      });

      const count = doneGates.size;
      const label = $('#progress-label');
      const bar = $('#progress-bar');
      const msg = $('#progress-message');

      if (label) label.textContent = `${count}/8 cổng`;
      if (bar) bar.style.width = `${(count / 8) * 100}%`;
      if (msg) {
        msg.textContent = count === 8
          ? 'Đã hoàn thành checklist 8 cổng. Hãy lưu bằng chứng và xin duyệt thí điểm!'
          : (count ? `Tiếp tục cổng ${Math.min(count + 1, 8)}; không bỏ qua artifact và người duyệt.` : 'Bắt đầu bằng một quy trình nhỏ, ổn định và có chủ sở hữu.');
      }
      localStorage.setItem('admin-guide-progress', JSON.stringify([...doneGates]));
    }

    $$('#admin-guide [data-complete]').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.dataset.complete;
        if (doneGates.has(id)) {
          doneGates.delete(id);
          toast(`Đã bỏ đánh dấu Cổng ${id}`);
        } else {
          doneGates.add(id);
          toast(`✓ Đã ghi nhận vượt Cổng ${id}`);
        }
        updateGates();
      });
    });

    updateGates();
  }

  // Initialization
  initVideoPlayers();
  initSidebar();
  initLightbox();
  initCopyButtons();
  initCompletionButtons();
  initKeyNavigation();
  initSwipeNavigation();
  initLinkHandlers();
  initReset();
  initInteractiveLabs();
  initAdminGuide();

  window.addEventListener('hashchange', activateHashSlide);

  // Initial load
  activateHashSlide();
  updateProgressMetrics();

})();



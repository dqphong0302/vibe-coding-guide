(function () {
  const STORAGE_KEY = 'vibe-data-lab-v1';
  const VALID_PRIORITIES = new Set(['cao', 'trung-binh', 'thap']);
  const FALLBACK_TASKS = [
    { id: 1, title: 'Chốt bản đặc tả yêu cầu phiên bản 1 (YEU_CAU.md)', completed: true, createdAt: '2026-08-18T08:30:00.000Z', priority: 'cao', category: 'Kế hoạch' },
    { id: 2, title: 'Thiết lập thư mục làm việc và tệp quy tắc AGENTS.md', completed: true, createdAt: '2026-08-18T09:15:00.000Z', priority: 'cao', category: 'Chuẩn bị' },
    { id: 3, title: 'Kiểm tra giao diện hiển thị trên điện thoại di động', completed: false, createdAt: '2026-08-18T10:00:00.000Z', priority: 'trung-binh', category: 'Kiểm thử' },
    { id: 4, title: 'Thực hiện 8 ca kiểm thử chức năng theo CHECKLIST.md', completed: false, createdAt: '2026-08-18T10:45:00.000Z', priority: 'cao', category: 'Kiểm thử' },
    { id: 5, title: 'Xuất bản ứng dụng lên mạng bằng Netlify Drop / GitHub Pages', completed: false, createdAt: '2026-08-18T11:20:00.000Z', priority: 'trung-binh', category: 'Triển khai' },
    { id: 6, title: 'Lập danh sách tính năng nâng cấp cho phiên bản v2', completed: false, createdAt: '2026-08-18T11:35:00.000Z', priority: 'thap', category: 'Nâng cấp' }
  ];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const elements = {
    form: $('#data-task-form'), title: $('#data-task-title'), category: $('#data-task-category'), priority: $('#data-task-priority'),
    list: $('#data-task-list'), empty: $('#data-empty'), total: $('#data-total'), pending: $('#data-pending'), done: $('#data-done'),
    source: $('#data-source'), status: $('#data-lab-status'), importInput: $('#data-import')
  };
  if (!elements.form) return;

  let tasks = [];
  let activeFilter = 'all';

  function normalizeTask(value, index) {
    if (!value || typeof value !== 'object') return null;
    const title = String(value.title || '').trim().slice(0, 160);
    if (!title) return null;
    const priority = VALID_PRIORITIES.has(value.priority) ? value.priority : 'trung-binh';
    const category = String(value.category || 'Khác').trim().slice(0, 40) || 'Khác';
    const createdAt = Number.isNaN(Date.parse(value.createdAt)) ? new Date().toISOString() : value.createdAt;
    return { id: String(value.id ?? `import-${Date.now()}-${index}`), title, completed: value.completed === true, createdAt, priority, category };
  }

  function normalizeList(value) {
    if (!Array.isArray(value)) throw new Error('Tệp JSON phải là một mảng công việc.');
    const clean = value.slice(0, 200).map(normalizeTask).filter(Boolean);
    if (!clean.length) throw new Error('Không tìm thấy công việc hợp lệ trong tệp.');
    return clean;
  }

  function save(message) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      if (message) elements.status.textContent = message;
      return true;
    } catch {
      elements.status.textContent = 'Trình duyệt đang chặn localStorage; thay đổi chỉ giữ trong phiên này.';
      return false;
    }
  }

  function readStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? normalizeList(JSON.parse(raw)) : null;
    } catch {
      elements.status.textContent = 'Dữ liệu đã lưu bị lỗi; lab đã khôi phục bộ mẫu an toàn.';
      return null;
    }
  }

  function priorityLabel(priority) {
    return priority === 'cao' ? 'Cao' : priority === 'thap' ? 'Thấp' : 'Trung bình';
  }

  function render() {
    const visible = tasks.filter((task) => activeFilter === 'all' || (activeFilter === 'done' ? task.completed : !task.completed));
    elements.list.replaceChildren();
    visible.forEach((task, visibleIndex) => {
      const item = document.createElement('li');
      item.className = `data-task${task.completed ? ' is-done' : ''}`;
      item.dataset.id = task.id;
      const controlId = `${visibleIndex}-${String(task.id).replace(/[^a-zA-Z0-9_-]/g, '-')}`;

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.id = `data-task-toggle-${controlId}`;
      toggle.className = 'data-task-toggle';
      toggle.dataset.action = 'toggle';
      toggle.setAttribute('aria-label', task.completed ? `Đánh dấu chưa xong: ${task.title}` : `Đánh dấu hoàn thành: ${task.title}`);
      toggle.textContent = task.completed ? '✓' : '';

      const content = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = task.title;
      const meta = document.createElement('span');
      meta.textContent = `${task.category} · Ưu tiên ${priorityLabel(task.priority)}`;
      content.append(title, meta);

      const badge = document.createElement('small');
      badge.className = `priority-${task.priority}`;
      badge.textContent = priorityLabel(task.priority);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.id = `data-task-remove-${controlId}`;
      remove.className = 'data-task-remove';
      remove.dataset.action = 'remove';
      remove.setAttribute('aria-label', `Xóa công việc: ${task.title}`);
      remove.textContent = '×';
      item.append(toggle, content, badge, remove);
      elements.list.append(item);
    });

    const done = tasks.filter((task) => task.completed).length;
    elements.total.textContent = tasks.length;
    elements.done.textContent = done;
    elements.pending.textContent = tasks.length - done;
    elements.empty.hidden = visible.length > 0;
    $$('[data-data-filter]').forEach((button) => button.classList.toggle('active', button.dataset.dataFilter === activeFilter));
  }

  async function loadInitialData() {
    const stored = readStored();
    if (stored) {
      tasks = stored;
      elements.source.textContent = `Đã đọc ${tasks.length} bản ghi từ localStorage.`;
      render();
      return;
    }

    if (location.protocol === 'http:' || location.protocol === 'https:') {
      try {
        const response = await fetch('starter/DU_LIEU_MAU.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Không tải được JSON');
        tasks = normalizeList(await response.json());
        elements.source.textContent = `Đã nạp ${tasks.length} bản ghi từ DU_LIEU_MAU.json.`;
      } catch {
        tasks = normalizeList(FALLBACK_TASKS);
        elements.source.textContent = 'Đang dùng bản dữ liệu mẫu dự phòng.';
      }
    } else {
      tasks = normalizeList(FALLBACK_TASKS);
      elements.source.textContent = 'Đang dùng dữ liệu mẫu tích hợp vì trang được mở trực tiếp từ máy.';
    }
    save();
    render();
  }

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = elements.title.value.trim();
    if (!title) return;
    tasks.unshift({
      id: globalThis.crypto?.randomUUID?.() || `task-${Date.now()}`,
      title: title.slice(0, 160), completed: false, createdAt: new Date().toISOString(),
      category: elements.category.value, priority: elements.priority.value
    });
    elements.form.reset();
    activeFilter = 'all';
    save('Đã thêm và lưu công việc. Hãy tải lại trang để kiểm tra.');
    render();
  });

  elements.list.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    const item = event.target.closest('.data-task');
    if (!button || !item) return;
    const index = tasks.findIndex((task) => task.id === item.dataset.id);
    if (index < 0) return;
    if (button.dataset.action === 'toggle') {
      tasks[index].completed = !tasks[index].completed;
      save(tasks[index].completed ? 'Đã hoàn thành và lưu công việc.' : 'Đã chuyển về trạng thái đang làm.');
    } else if (button.dataset.action === 'remove') {
      tasks.splice(index, 1);
      save('Đã xóa công việc khỏi localStorage.');
    }
    render();
  });

  $$('[data-data-filter]').forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.dataFilter;
    render();
  }));

  $('#data-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `so-cong-viec-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    elements.status.textContent = `Đã xuất ${tasks.length} công việc. Giữ tệp để thử khôi phục.`;
  });

  elements.importInput.addEventListener('change', async () => {
    const file = elements.importInput.files?.[0];
    if (!file) return;
    try {
      tasks = normalizeList(JSON.parse(await file.text()));
      activeFilter = 'all';
      save(`Đã nhập và lưu ${tasks.length} công việc từ ${file.name}.`);
      render();
    } catch (error) {
      elements.status.textContent = `Không nhập được: ${error.message}`;
    } finally {
      elements.importInput.value = '';
    }
  });

  $('#data-reset').addEventListener('click', () => {
    if (!confirm('Khôi phục 6 công việc mẫu và thay thế dữ liệu lab hiện tại?')) return;
    tasks = normalizeList(FALLBACK_TASKS);
    activeFilter = 'all';
    save('Đã khôi phục 6 công việc mẫu.');
    elements.source.textContent = 'Bộ dữ liệu mẫu đã được khôi phục.';
    render();
  });

  loadInitialData();
})();

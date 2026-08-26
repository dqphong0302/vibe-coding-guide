/**
 * Live Markdown Sandbox Logic
 * Simple client-side markdown parser and template loader
 */

(function () {
  const sampleMarkdown = {
    'yeu-cau': `# TongHopBaoCao (YEU_CAU.md)

## 1. Mục Tiêu
Xây dựng công cụ web tổng hợp báo cáo số liệu nội bộ cho nhân viên văn phòng.

## 2. Người Dùng Mục Tiêu
- Nhân viên hành chính và quản lý đơn vị.
- Yêu cầu: Giao diện trực quan, tiếng Việt, nút to rõ, không cần cài đặt phức tạp.

## 3. Dữ Liệu Đầu Vào
- Bảng số liệu mẫu gồm 15 dòng dữ liệu giả lập (Tên hồ sơ, Ngày nhận, Người phụ trách, Trạng thái).

## 4. Danh Sách Chức Năng
- [x] Hiển thị tổng số hồ sơ đã tiếp nhận.
- [x] Thống kê số lượng hồ sơ **Đã xử lý** và **Còn chờ**.
- [x] Biểu đồ cột phân loại theo trạng thái.
- [x] Nút xuất báo cáo định dạng file bảng tính (CSV/Excel).

## 5. Tiêu Chí Hoàn Thành (Done When)
- **Hoàn thành khi:** Người mới có thể mở trang web, tải dữ liệu mẫu, xem biểu đồ và bấm nút xuất báo cáo thành công.`,

    'agents-md': `# Quy Tắc Dự Án (AGENTS.md)

## Tech Stack
- Frontend: HTML5, Modern Vanilla CSS (Dark mode), JavaScript ES6.
- Lưu trữ: \`localStorage\` trên trình duyệt, không cần backend server.

## Quy Ước Lập Trình
1. **Kiến trúc:** Tách biệt rõ ràng \`index.html\`, \`style.css\`, \`app.js\`.
2. **Nguyên tắc an toàn:** Tuyệt đối không hardcode API key, mật khẩu hoặc dữ liệu thật của đơn vị.
3. **Quy trình:**
   - Trước khi sửa mã, hãy tạo \`implementation_plan.md\` để duyệt.
   - Mỗi lần chỉ sửa một chức năng cụ thể và kiểm tra bằng chứng (preview/test).`,

    'cheatsheet': `# Bảng Tra Cứu Markdown Nhanh

# Tiêu đề cấp 1 (Tên dự án)
## Tiêu đề cấp 2 (Mục tiêu, Chức năng)
### Tiêu đề cấp 3 (Chi tiết nhỏ)

- Gạch đầu dòng thứ nhất
- Gạch đầu dòng thứ hai
  - Thụt lề cấp nhỏ hơn

1. Bước một: Mở phần mềm
2. Bước hai: Chọn Model
3. Bước ba: Nhập Prompt

**Chữ in đậm để nhấn mạnh**
*Chữ in nghiêng để chú thích*
\`inline code\` cho tên biến hoặc lệnh
[Liên kết tài liệu](https://antigravity.google)

> Đây là một khối trích dẫn hoặc lưu ý quan trọng.`
  };

  function parseMarkdown(md) {
    if (!md) return '';
    let html = md
      // Escape raw HTML entities
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headers
      // Keep the page outline valid: preview headings start at h3.
      .replace(/^### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^## (.*$)/gim, '<h4>$1</h4>')
      .replace(/^# (.*$)/gim, '<h3>$1</h3>')
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote style="border-left: 3px solid var(--ag-cyan); padding-left: 0.8rem; margin: 0.8rem 0; color: #94A3B8; font-style: italic;">$1</blockquote>')
      // Bold & Italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:#FFF;">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Inline Code
      .replace(/\`(.*?)\`/gim, '<code>$1</code>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // Unordered lists
      .replace(/^\- \[x\] (.*$)/gim, '<li style="list-style:none;">✅ $1</li>')
      .replace(/^\- \[ \] (.*$)/gim, '<li style="list-style:none;">⬜ $1</li>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      // Ordered lists
      .replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n\n/gim, '<br><br>');

    // Wrap consecutive li items
    html = html.replace(/(<li>[\s\S]*?<\/li>)/gim, '<ul>$1</ul>');
    return html;
  }

  function initMarkdownDemo() {
    const editor = document.getElementById('md-editor-input');
    const preview = document.getElementById('md-preview-output');
    const sampleBtns = document.querySelectorAll('[data-md-sample]');
    const btnCopy = document.getElementById('btn-copy-md');

    if (!editor || !preview) return;

    function render() {
      preview.innerHTML = parseMarkdown(editor.value);
    }

    function loadSample(key) {
      if (sampleMarkdown[key]) {
        editor.value = sampleMarkdown[key];
        render();
      }
    }

    sampleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sampleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-md-sample');
        loadSample(key);
      });
    });

    editor.addEventListener('input', render);

    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(editor.value).then(() => {
          const orig = btnCopy.textContent;
          btnCopy.textContent = '✓ Đã sao chép';
          setTimeout(() => {
            btnCopy.textContent = orig;
          }, 2000);
        });
      });
    }

    // Initial render
    loadSample('yeu-cau');
  }

  window.addEventListener('DOMContentLoaded', initMarkdownDemo);
})();

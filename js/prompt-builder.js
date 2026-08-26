/**
 * Agentic Prompt Generator Logic
 * Builds standardized 4-part agent prompts with presets & instant copy
 */

(function () {
  const templates = {
    'new-app': {
      goal: 'Xây dựng ứng dụng web [Tên Ứng Dụng] phục vụ [Đối Tượng Người Dùng] giúp giải quyết bài toán [Vấn Đề Chính].',
      context: 'Đọc kỹ README.md, file YEU_CAU.md, cấu trúc thư mục hiện tại và các mock data trong folder /data.',
      constraints: 'Không dùng framework nặng; chỉ dùng HTML5/CSS/Vanilla JS thuần; giữ giao diện responsive; tuân thủ an toàn dữ liệu, không đưa thông tin nhạy cảm lên prompt.',
      doneWhen: 'Trang web hiển thị mượt mà trên trình duyệt, dữ liệu mẫu tải đầy đủ, các thao tác lọc/thêm/xuất dữ liệu hoạt động chính xác và không có lỗi console.'
    },
    'bugfix': {
      goal: 'Khắc phục lỗi [Tên Lỗi] khi người dùng thực hiện thao tác [Hành Động Cụ Thể].',
      context: 'Xem lại file log đính kèm, mã nguồn tại [Đường dẫn file] và cấu hình hiện tại.',
      constraints: 'Chỉ sửa đúng phạm vi module bị lỗi, không làm thay đổi các API public hoặc logic của các module khác; giữ nguyên coding style hiện có.',
      doneWhen: 'Tái hiện lại bài test gây lỗi và xác nhận đã pass 100%, không phát sinh regression test lỗi mới.'
    },
    'refactor': {
      goal: 'Tái cấu trúc (Refactor) module [Tên Module] nhằm nâng cao hiệu năng và tính module hóa.',
      context: 'Đọc toàn bộ file liên quan trong thư mục src/[module], đối chiếu tài liệu kỹ thuật trong docs/.',
      constraints: 'Giữ nguyên 100% kết quả đầu ra của các function/API hiện tại; viết kèm unit test cho từng function sau khi tách.',
      doneWhen: 'Bộ test tự động chạy thành công, mã nguồn sạch sẽ, không có hàm lặp lại và có tài liệu cập nhật.'
    },
    'beginner-vn': {
      goal: 'Tên Project: TongHopBaoCao. Tôi muốn một công cụ nhận bảng số liệu giả, hiển thị tổng số hồ sơ, số đã xử lý, số còn chờ, biểu đồ và nút xuất báo cáo.',
      context: 'Đọc file YEU_CAU.md nếu có. Sử dụng dữ liệu giả từ 10–20 dòng.',
      constraints: 'Giao diện tiếng Việt, chữ lớn, dễ nhìn cho nhân viên văn phòng. Hãy hỏi tôi tối đa 5 câu trước khi bắt đầu.',
      doneWhen: 'Mở Preview lên trình duyệt cho tôi xem bản mẫu đầu tiên để tôi kiểm tra và góp ý.'
    }
  };

  function initPromptBuilder() {
    const tabBtns = document.querySelectorAll('[data-prompt-preset]');
    const goalInput = document.getElementById('prompt-goal');
    const contextInput = document.getElementById('prompt-context');
    const constraintsInput = document.getElementById('prompt-constraints');
    const doneWhenInput = document.getElementById('prompt-done');
    const outputEl = document.getElementById('prompt-output-text');
    const btnGenerate = document.getElementById('btn-generate-prompt');
    const btnCopy = document.getElementById('btn-copy-prompt');

    if (!goalInput || !outputEl) return;

    function loadTemplate(key) {
      const t = templates[key];
      if (!t) return;
      goalInput.value = t.goal;
      contextInput.value = t.context;
      constraintsInput.value = t.constraints;
      doneWhenInput.value = t.doneWhen;
      updateOutput();
    }

    function updateOutput() {
      const g = goalInput.value.trim() || '[Mục tiêu]';
      const c = contextInput.value.trim() || '[Ngữ cảnh cần đọc]';
      const r = constraintsInput.value.trim() || '[Ràng buộc]';
      const d = doneWhenInput.value.trim() || '[Tiêu chí hoàn thành]';

      const promptText = `## MỤC TIÊU (GOAL)\n${g}\n\n## NGỮ CẢNH (CONTEXT)\n${c}\n\n## RÀNG BUỘC (CONSTRAINTS)\n${r}\n\n## TIÊU CHÍ HOÀN THÀNH (DONE WHEN)\n${d}\n\n> Lưu ý: Trước khi thực hiện thay đổi mã nguồn, hãy trình bày kế hoạch (Implementation Plan) ngắn gọn và chờ tôi xác nhận.`;
      
      outputEl.textContent = promptText;
    }

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-prompt-preset');
        loadTemplate(key);
      });
    });

    [goalInput, contextInput, constraintsInput, doneWhenInput].forEach(el => {
      el.addEventListener('input', updateOutput);
    });

    if (btnGenerate) {
      btnGenerate.addEventListener('click', () => {
        updateOutput();
        outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }

    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        const text = outputEl.textContent;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btnCopy.textContent;
          btnCopy.textContent = '✓ Đã sao chép!';
          setTimeout(() => {
            btnCopy.textContent = orig;
          }, 2000);
        });
      });
    }

    // Load initial preset
    loadTemplate('new-app');
  }

  window.addEventListener('DOMContentLoaded', initPromptBuilder);
})();

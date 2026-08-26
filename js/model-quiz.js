/**
 * Model Advisor Quiz Logic
 * Recommends optimal models & reasoning settings across Antigravity, Codex, and Claude Desktop
 */

(function () {
  const quizState = {
    taskType: 'feature',
    budgetPref: 'balanced',
    experience: 'beginner'
  };

  const recommendations = {
    'bugfix': {
      title: 'Tác vụ: Sửa lỗi nhỏ / Đổi giao diện / Hỏi nhanh',
      desc: 'Nhiệm vụ phạm vi hẹp, đã rõ mục tiêu. Ưu tiên tốc độ cao, không cần suy luận sâu.',
      ag: { model: 'Model nhanh đang được đề xuất', reasoning: 'Low / None', note: 'Phù hợp thay chữ, sửa CSS và tác vụ phạm vi hẹp' },
      codex: { model: 'Model nhanh đang được đề xuất', reasoning: 'Low', note: 'Xử lý nhanh, phù hợp lặp lại nhiều lần' },
      claude: { model: 'Model nhanh hoặc mặc định', reasoning: 'Standard', note: 'Ưu tiên tốc độ cho thay đổi nhỏ' }
    },
    'feature': {
      title: 'Tác vụ: Xây dựng tính năng / Trang web thông thường',
      desc: 'Tạo component mới, viết logic tính toán, kết nối API, tạo báo cáo số liệu.',
      ag: { model: 'Model cân bằng đang được đề xuất', reasoning: 'Medium', note: 'Điểm bắt đầu phù hợp cho xây dựng tính năng hằng ngày' },
      codex: { model: 'Model cân bằng đang được đề xuất', reasoning: 'Medium', note: 'Phù hợp dự án thông thường và kiểm thử' },
      claude: { model: 'Model mặc định cho coding', reasoning: 'Medium', note: 'Phù hợp viết mã và tự kiểm tra' }
    },
    'refactor': {
      title: 'Tác vụ: Refactor hệ thống / Thiết kế kiến trúc / Bài toán khó',
      desc: 'Sửa đổi nhiều module liên kết, thiết kế DB schema phức tạp, giải thuật tối ưu hiệu năng cao.',
      ag: { model: 'Model suy luận sâu đang có', reasoning: 'High / Extended', note: 'Dùng khi cần lập kế hoạch đa bước hoặc phân tích khó' },
      codex: { model: 'Model suy luận sâu đang có', reasoning: 'High / Max', note: 'Dùng khi lỗi phức tạp cần phân tích nguyên nhân' },
      claude: { model: 'Model mạnh với Thinking', reasoning: 'High', note: 'Dùng cho kiến trúc hoặc thay đổi nhiều module' }
    },
    'budget': {
      title: 'Ưu tiên: Tiết kiệm tối đa Quota & Chi phí',
      desc: 'Phù hợp tài khoản Free/Plus hoặc đang trong giai đoạn cuối chu kỳ 5h / tuần.',
      ag: { model: 'Model nhanh/mặc định', reasoning: 'Low', note: 'Giảm phạm vi prompt và kiểm tra Usage thường xuyên' },
      codex: { model: 'Model nhanh đang có', reasoning: 'Low', note: 'Tách công việc thành lát cắt nhỏ để tiết kiệm hạn mức' },
      claude: { model: 'Model nhanh/mặc định', reasoning: 'Standard', note: 'Tạo phiên mới khi context đã quá dài' }
    }
  };

  function initQuiz() {
    const taskCards = document.querySelectorAll('[data-quiz-task]');
    if (!taskCards.length) return;

    taskCards.forEach(card => {
      card.addEventListener('click', () => {
        taskCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const task = card.getAttribute('data-quiz-task');
        quizState.taskType = task;
        renderResult(task);
      });
    });

    // Render default selection
    renderResult(quizState.taskType);
  }

  function renderResult(taskKey) {
    const resultBox = document.getElementById('quiz-result');
    if (!resultBox) return;

    const data = recommendations[taskKey] || recommendations['feature'];
    
    document.getElementById('result-task-title').textContent = data.title;
    document.getElementById('result-task-desc').textContent = data.desc;

    // Antigravity
    document.getElementById('rec-ag-model').textContent = data.ag.model;
    document.getElementById('rec-ag-reasoning').textContent = `Reasoning: ${data.ag.reasoning}`;
    document.getElementById('rec-ag-note').textContent = data.ag.note;

    // Codex
    document.getElementById('rec-codex-model').textContent = data.codex.model;
    document.getElementById('rec-codex-reasoning').textContent = `Reasoning: ${data.codex.reasoning}`;
    document.getElementById('rec-codex-note').textContent = data.codex.note;

    // Claude
    document.getElementById('rec-claude-model').textContent = data.claude.model;
    document.getElementById('rec-claude-reasoning').textContent = `Reasoning: ${data.claude.reasoning}`;
    document.getElementById('rec-claude-note').textContent = data.claude.note;

    resultBox.classList.add('active');
  }

  window.addEventListener('DOMContentLoaded', initQuiz);
})();

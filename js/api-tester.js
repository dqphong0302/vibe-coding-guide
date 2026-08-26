/**
 * Safe AI API simulator for beginners.
 * This module never sends network requests and never accepts API keys.
 */
(function () {
  function initApiSimulator() {
    const promptInput = document.getElementById('tester-prompt');
    const presetPills = document.querySelectorAll('.tester-preset-pill');
    const sendBtn = document.getElementById('tester-send-btn');
    const statusBadge = document.getElementById('tester-status-badge');
    const timeBadge = document.getElementById('tester-time-badge');
    const tokensBadge = document.getElementById('tester-tokens-badge');
    const outputText = document.getElementById('tester-output-text');
    const jsonOutput = document.getElementById('tester-json-output');
    const curlOutput = document.getElementById('tester-curl-output');
    const tabBtns = document.querySelectorAll('.tester-tab-btn');
    const tabPanes = document.querySelectorAll('.tester-tab-pane');

    if (!sendBtn || !promptInput) return;

    const presets = {
      poem: 'Hãy làm một bài thơ 4 câu về sự kỳ diệu của AI và Vibe Coding.',
      explain: 'Hãy giải thích AI Agent là gì cho một học sinh lớp 5, kèm một ví dụ cụ thể.',
      code: 'Viết mã HTML + CSS tạo một nút có hiệu ứng phát sáng khi di chuột.'
    };

    const mockResponses = {
      poem: 'Vibe coding thảnh thơi từng bước đi,\nAI viết mã, ta duyệt gì cũng minh.\nÝ tưởng rõ ràng thành trang web nhỏ,\nKiểm tra xong rồi mới thật an tâm!',
      explain: 'AI Agent giống một trợ lý có thể đọc tài liệu, lập kế hoạch và dùng công cụ để hoàn thành việc. Bạn vẫn là người đặt mục tiêu, duyệt quyền và kiểm tra kết quả.',
      code: '<button class="neon-btn">BẤM VÀO ĐÂY</button>\n\n<style>\n.neon-btn { padding: 12px 28px; border: 2px solid #38bdf8; }\n.neon-btn:hover { box-shadow: 0 0 20px #38bdf8; }\n</style>',
      default: 'Đây là phản hồi mô phỏng. Trong ứng dụng thật, server sẽ nhận prompt, gọi nhà cung cấp AI bằng khóa lưu trong biến môi trường rồi trả JSON về trình duyệt.'
    };

    function selectedPreset() {
      return document.querySelector('.tester-preset-pill.active')?.dataset.preset || 'custom';
    }

    function updateRequestPreview() {
      if (!curlOutput) return;
      const safePrompt = (promptInput.value || 'Xin chào!').replace(/"/g, '\\"');
      curlOutput.textContent = [
        '# Ví dụ minh họa — không chạy trực tiếp trên website tĩnh',
        '# API key phải được giữ ở backend bằng biến môi trường.',
        '',
        'curl https://your-backend.example/api/ai',
        "  -H 'Content-Type: application/json'",
        '  -X POST',
        `  -d '{"prompt":"${safePrompt}"}'`
      ].join('\n');
    }

    presetPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        presetPills.forEach((item) => item.classList.remove('active'));
        pill.classList.add('active');
        promptInput.value = presets[pill.dataset.preset] || '';
        updateRequestPreview();
      });
    });

    promptInput.addEventListener('input', updateRequestPreview);

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((item) => item.classList.remove('active'));
        tabPanes.forEach((pane) => pane.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tester-pane-${btn.dataset.testerTab}`)?.classList.add('active');
      });
    });

    sendBtn.addEventListener('click', () => {
      const prompt = promptInput.value.trim();
      if (!prompt) {
        window.alert('Vui lòng nhập một yêu cầu để chạy mô phỏng.');
        return;
      }

      sendBtn.disabled = true;
      sendBtn.textContent = '⏳ Đang mô phỏng...';
      statusBadge.textContent = 'SIMULATING...';
      statusBadge.className = 'tester-badge connecting';
      outputText.textContent = 'Đang tạo phản hồi mô phỏng cục bộ...';

      window.setTimeout(() => {
        const preset = selectedPreset();
        const reply = mockResponses[preset] || mockResponses.default;
        const promptTokens = Math.max(1, Math.round(prompt.length / 3));
        const responseTokens = Math.max(1, Math.round(reply.length / 3));
        const duration = 480;
        const payload = {
          simulated: true,
          request: { method: 'POST', prompt },
          response: { text: reply },
          usageEstimate: {
            promptTokens,
            responseTokens,
            totalTokens: promptTokens + responseTokens
          },
          securityNote: 'Không có API key và không có yêu cầu mạng nào được gửi.'
        };

        statusBadge.textContent = '200 OK (Mô phỏng)';
        statusBadge.className = 'tester-badge success';
        timeBadge.textContent = `⚡ ${duration} ms (giả lập)`;
        tokensBadge.textContent = `📊 ~${payload.usageEstimate.totalTokens} tokens`;
        outputText.textContent = reply;
        jsonOutput.textContent = JSON.stringify(payload, null, 2);
        sendBtn.disabled = false;
        sendBtn.textContent = '▶ Chạy mô phỏng HTTP POST';
      }, 480);
    });

    updateRequestPreview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApiSimulator);
  } else {
    initApiSimulator();
  }
})();

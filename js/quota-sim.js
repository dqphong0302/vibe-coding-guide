/**
 * Token & Quota Simulator Logic
 * Interactive mathematical model showing token accumulation and rolling window quota consumption
 */

(function () {
  const modelSpecs = {
    'flash': { name: 'Nhóm nhanh / tiết kiệm', inputCostPer1k: 1, baseMultiplier: 1.0, limitCapacity5h: 150 },
    'balanced': { name: 'Nhóm cân bằng / mặc định', inputCostPer1k: 2.5, baseMultiplier: 2.2, limitCapacity5h: 80 },
    'heavy': { name: 'Nhóm suy luận sâu', inputCostPer1k: 8.0, baseMultiplier: 7.5, limitCapacity5h: 25 }
  };

  function initQuotaSim() {
    const messagesSlider = document.getElementById('slider-messages');
    const contextSlider = document.getElementById('slider-context');
    const modelSelect = document.getElementById('select-sim-model');

    const valMessages = document.getElementById('val-messages');
    const valContext = document.getElementById('val-context');

    const bar5hFill = document.getElementById('bar-5h-fill');
    const val5hPercent = document.getElementById('val-5h-percent');
    const text5hRemain = document.getElementById('text-5h-remain');

    const barWeeklyFill = document.getElementById('bar-weekly-fill');
    const valWeeklyPercent = document.getElementById('val-weekly-percent');
    const textWeeklyRemain = document.getElementById('text-weekly-remain');

    const tokensTotalText = document.getElementById('sim-tokens-total');
    const insightText = document.getElementById('sim-insight-text');

    if (!messagesSlider || !contextSlider) return;

    function calculate() {
      const msgs = parseInt(messagesSlider.value, 10);
      const filesKb = parseInt(contextSlider.value, 10);
      const modelKey = modelSelect.value;
      const spec = modelSpecs[modelKey] || modelSpecs['balanced'];

      valMessages.textContent = `${msgs} lượt trao đổi`;
      valContext.textContent = `${filesKb} KB (~${Math.round(filesKb * 250)} tokens file)`;

      // Token estimation:
      // In a conversational session of N turns, input context compounds:
      // Turn i brings prompt + prior conversation history + attached files.
      const avgPromptTokens = 150;
      const fileTokens = filesKb * 250;
      const avgResponseTokens = 400;

      // Cumulative input tokens for N turns with growing history:
      let cumulativeInputTokens = 0;
      for (let i = 1; i <= msgs; i++) {
        const historyTokens = (i - 1) * (avgPromptTokens + avgResponseTokens);
        cumulativeInputTokens += (avgPromptTokens + fileTokens + historyTokens);
      }
      const cumulativeOutputTokens = msgs * avgResponseTokens;
      const totalTokens = cumulativeInputTokens + cumulativeOutputTokens;

      // Effective consumption units against 5h limit
      const consumedUnits = (msgs * (1 + (filesKb / 40) + (msgs / 15))) * spec.baseMultiplier;
      const capacity5h = spec.limitCapacity5h;

      let pctUsed5h = Math.min(100, Math.round((consumedUnits / capacity5h) * 100));
      let pctRemain5h = Math.max(0, 100 - pctUsed5h);

      // Weekly limit usage (assuming average 5 sessions per week)
      let pctUsedWeekly = Math.min(100, Math.round(pctUsed5h * 0.45 + (msgs * 1.2)));
      let pctRemainWeekly = Math.max(0, 100 - pctUsedWeekly);

      // Update 5H meter
      val5hPercent.textContent = `${pctRemain5h}%`;
      bar5hFill.style.width = `${pctRemain5h}%`;
      text5hRemain.textContent = `Còn lại ${pctRemain5h}% (giả lập)`;

      if (pctRemain5h > 50) {
        bar5hFill.style.backgroundColor = 'var(--green)';
        val5hPercent.style.color = 'var(--green)';
      } else if (pctRemain5h > 20) {
        bar5hFill.style.backgroundColor = 'var(--orange)';
        val5hPercent.style.color = 'var(--orange)';
      } else {
        bar5hFill.style.backgroundColor = '#b91c1c';
        val5hPercent.style.color = '#b91c1c';
      }

      // Update Weekly meter
      valWeeklyPercent.textContent = `${pctRemainWeekly}%`;
      barWeeklyFill.style.width = `${pctRemainWeekly}%`;
      textWeeklyRemain.textContent = `Hạn mức tuần còn ${pctRemainWeekly}% (giả lập)`;

      if (pctRemainWeekly > 50) {
        barWeeklyFill.style.backgroundColor = 'var(--blue)';
        valWeeklyPercent.style.color = 'var(--blue)';
      } else if (pctRemainWeekly > 20) {
        barWeeklyFill.style.backgroundColor = 'var(--orange)';
        valWeeklyPercent.style.color = 'var(--orange)';
      } else {
        barWeeklyFill.style.backgroundColor = '#b91c1c';
        valWeeklyPercent.style.color = '#b91c1c';
      }

      // Token format
      tokensTotalText.textContent = `Ước tính tiêu thụ: ~${totalTokens.toLocaleString('vi-VN')} Tokens`;

      // Insight generation
      if (msgs > 25) {
        insightText.textContent = `⚠️ Phiên này đã kéo dài (${msgs} lượt). Mỗi lượt bấm Gửi đang phải kéo theo toàn bộ lịch sử ${msgs} lượt trước. Lời khuyên: Hãy yêu cầu AI tóm tắt bàn giao rồi tạo Chat/Session MỚI để reset Context Window!`;
      } else if (filesKb > 100) {
        insightText.textContent = `💡 Dung lượng tài liệu đính kèm khá lớn (${filesKb} KB). AI phải đọc lại toàn bộ tệp này ở mỗi lượt gửi. Hãy chỉ đính kèm các đoạn mã hoặc dữ liệu mẫu thật sự cần thiết.`;
      } else if (modelKey === 'heavy') {
        insightText.textContent = `🧠 Bạn đang chọn chế độ Deep Thinking / Heavy Model. Quota 5 giờ sẽ giảm nhanh gấp 5-8 lần so với model mặc định. Chỉ nên dùng khi đang giải quyết vấn đề kiến trúc phức tạp!`;
      } else {
        insightText.textContent = `✅ Mức tiêu thụ tối ưu! Với cấu hình này, bạn có thể thực hiện liên tục nhiều tác vụ lập trình mà không lo chạm ngưỡng giới hạn 5 giờ.`;
      }
    }

    messagesSlider.addEventListener('input', calculate);
    contextSlider.addEventListener('input', calculate);
    modelSelect.addEventListener('change', calculate);

    calculate();
  }

  window.addEventListener('DOMContentLoaded', initQuotaSim);
})();

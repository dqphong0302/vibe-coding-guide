# Quy Tắc Dự Án Dành Cho AI Agent (AGENTS.md)

> Tệp này là kim chỉ nam bắt buộc cho tất cả Coding Agent (Antigravity, OpenAI Codex, Claude Code, Cursor).  
> Mọi hành động chỉnh sửa mã nguồn hoặc thực thi lệnh đều phải tuân thủ nghiêm ngặt các điều khoản dưới đây.

---

## 1. Nguyên Tắc Làm Việc Cốt Lõi (Core Protocol)
1. **Đọc trước khi làm:** Luôn đọc toàn bộ tệp `YEU_CAU.md`, `CHECKLIST.md` và cấu trúc thư mục trước khi thực hiện bất kỳ thay đổi nào.
2. **Kế hoạch trước khi code (Plan-first):** Trước khi tạo mới hoặc sửa đổi tệp, hãy trình bày một bản kế hoạch thực thi (Implementation Plan) ngắn gọn (tối đa 5–6 bước) và chờ người dùng phê duyệt (`Proceed` / `Approve`).
3. **Phạm vi tối thiểu (Minimal Diff):** Mỗi lần chỉ sửa đúng phạm vi chức năng được giao. Không tự ý tái cấu trúc toàn bộ dự án hoặc thay đổi các phần đang hoạt động tốt.
4. **Không tự thêm tính năng ngoài phạm vi:** Tuyệt đối không thêm các chức năng ngoài bản đặc tả `YEU_CAU.md` (ví dụ: login, cloud sync, backend AI).

---

## 2. Ràng Buộc Công Nghệ & Kiến Trúc (Tech Constraints)
- **Công nghệ cho phép:** Chỉ sử dụng HTML5 thuần, CSS3 thuần (Vanilla CSS) và JavaScript ES6+ tiêu chuẩn.
- **Cấm cài đặt thư viện ngoài:** Không chạy `npm install` hay nhúng CDN các thư viện UI (Bootstrap, Tailwind, React, jQuery) trừ khi người dùng yêu cầu rõ ràng.
- **Cấu trúc tệp tiêu chuẩn:**
  ```
  so-cong-viec/
  ├── index.html        # Khung HTML ngữ nghĩa, tải CSS và JS
  ├── css/
  │   └── style.css     # Định kiểu giao diện, biến màu, responsive
  ├── js/
  │   └── app.js        # Logic xử lý sự kiện, render, localStorage
  ├── AGENTS.md         # Quy tắc vận hành cho AI Agent
  ├── YEU_CAU.md        # Bản đặc tả yêu cầu chức năng
  └── CHECKLIST.md      # Bộ ca kiểm thử nghiệm thu
  ```

---

## 3. An Toàn Dữ Liệu & Bảo Mật (Security Guardrails)
- **Chỉ dùng dữ liệu giả lập:** Tuyệt đối không đưa thông tin cá nhân thật (CCCD, họ tên thật, số điện thoại, mật khẩu) vào mã nguồn hoặc dữ liệu mẫu.
- **Không hardcode secret:** Không lưu trữ API key, token hay mật khẩu trong mã nguồn phía client.
- **Xử lý dữ liệu an toàn:** Sử dụng `textContent` hoặc mã hóa HTML để ngăn chặn lỗ hổng XSS khi hiển thị nội dung do người dùng nhập.

---

## 4. Quy Trình Kiểm Thử & Nghiệm Thu (Verification Protocol)
- **Tự kiểm tra sau mỗi thay đổi:** Sau khi viết xong mã, Agent phải:
  1. Mở ứng dụng qua trình duyệt/Preview.
  2. Thực hiện tuần tự các ca thử nghiệm trong `CHECKLIST.md`.
  3. Mở Developer Console (`F12`) để đảm bảo không có lỗi JavaScript hoặc cảnh báo tài nguyên.
  4. Kiểm tra giao diện trên điện thoại di động (Mobile) và máy tính (Desktop).
- **Báo cáo kết quả rõ ràng:** Khi báo cáo hoàn thành, nêu rõ:
  - Danh sách các tệp đã tạo/sửa đổi.
  - Kết quả từng ca kiểm thử (Đạt / Chưa đạt).
  - Hướng dẫn người dùng cách mở và kiểm tra trực tiếp.

# Đặc Tả Yêu Cầu Dự Án: Sổ Công Việc Cá Nhân (viec-hom-nay)

> Phiên bản: 1.0.0 · Trạng thái: APPROVED · Ngày cập nhật: 18/08/2026  
> Loại ứng dụng: Single Page Application (SPA) · Chạy cục bộ (Local-first)

---

## 1. Người Dùng & Bài Toán Cần Giải Quyết
- **Đối tượng người dùng:** Người đi làm, học sinh, sinh viên cần một công cụ gọn nhẹ để ghi nhớ và theo dõi các đầu việc trong ngày ngay trên trình duyệt mà không cần tạo tài khoản hay kết nối mạng.
- **Vấn đề thực tế:** Các ứng dụng quản lý công việc hiện nay thường quá cồng kềnh, bắt buộc đăng nhập, tải chậm hoặc có nguy cơ rò rỉ thông tin cá nhân lên đám mây.
- **Giải pháp:** Một trang web đơn giản, khởi động ngay lập tức, lưu trữ an toàn trong trình duyệt (`localStorage`), hiển thị đẹp trên cả điện thoại lẫn máy tính.

---

## 2. Danh Sách Chức Năng Phiên Bản 1 (v1)

### 2.1. Quản lý công việc
1. **Thêm công việc mới:**
   - Ô nhập tiêu đề bắt buộc (từ 1 đến 150 ký tự).
   - Nhấn phím `Enter` hoặc bấm nút `+ Thêm công việc` để lưu.
   - Tự động cắt khoảng trắng thừa ở đầu/cuối chuỗi.
   - Nếu ô nhập rỗng hoặc chỉ có khoảng trắng: hiển thị thông báo lỗi cạnh ô nhập và không tạo việc mới.
2. **Đánh dấu hoàn thành / Đang làm:**
   - Nhấp vào hộp kiểm (checkbox) hoặc nút bấm để chuyển đổi qua lại giữa trạng thái `Đang làm` (active) và `Đã xong` (completed).
   - Khi hoàn thành: tiêu đề gạch ngang nhẹ, số đếm thống kê tự động cập nhật ngay lập tức.
3. **Lọc danh sách công việc:**
   - Ba tab lọc rõ ràng: **Tất cả**, **Đang làm**, **Đã xong**.
   - Bộ đếm số lượng hiển thị trên từng tab (ví dụ: *Tất cả (5)*, *Đang làm (3)*, *Đã xong (2)*).
4. **Xóa công việc:**
   - Nút xóa cho từng công việc kèm hộp thoại xác nhận ("Bạn có chắc chắn muốn xóa công việc này?").
   - Sau khi xóa, cập nhật lại danh sách và bộ đếm.
5. **Lưu trữ dữ liệu cục bộ (Persistence):**
   - Mọi thay đổi (thêm, sửa trạng thái, xóa) được lưu ngay vào `localStorage` với khóa `so-cong-viec-data`.
   - Khi tải lại trang (`F5` / `Ctrl+R`) hoặc đóng mở lại trình duyệt, toàn bộ dữ liệu vẫn được bảo toàn.
   - Nếu dữ liệu trong `localStorage` bị lỗi cú pháp JSON: tự động khôi phục về danh sách mẫu an toàn mà không làm sập trang.

---

## 3. Yêu Cầu Giao Diện & Trải Nghiệm (UI/UX)
- **Ngôn ngữ:** 100% Tiếng Việt có dấu chuẩn Unicode (UTF-8).
- **Responsive:**
  - Tối ưu hoàn hảo cho màn hình điện thoại di động (không có thanh cuộn ngang, nút bấm không bị cắt).
  - Hiển thị cân đối trên màn hình tablet và desktop.
- **Trải nghiệm thân thiện & Dễ tương tác:**
  - Tương phản màu chữ rõ nét, dễ đọc.
  - Vùng chạm cảm ứng của nút bấm rộng rãi, dễ thao tác ngón tay.
  - Hỗ trợ đầy đủ phím `Tab` để duyệt qua các nút, có đường viền `focus-visible` rõ ràng.
  - Sử dụng đúng thẻ ngữ nghĩa HTML5: `<header>`, `<main>`, `<h1>`, `<form>`, `<input>`, `<button>`, `<ul>`, `<li>`.
- **Trạng thái giao diện:**
  - **Trạng thái rỗng (Empty state):** Khi chưa có việc nào, hiển thị hình vẽ/biểu tượng thân thiện kèm thông điệp: *"Chưa có công việc nào. Hãy thêm việc đầu tiên để bắt đầu ngày mới!"*.
  - **Trạng thái thông báo (Toast/Alert):** Báo lỗi nhập liệu hoặc xác nhận xóa rõ ràng.

---

## 4. Những Điều Tuyệt Đối KHÔNG Làm Trong Phiên Bản 1 (Out of Scope)
- ❌ KHÔNG tạo hệ thống đăng nhập, mật khẩu hay xác thực người dùng.
- ❌ KHÔNG kết nối cơ sở dữ liệu bên ngoài (Firebase, Supabase, MySQL, MongoDB).
- ❌ KHÔNG hardcode bất kỳ API key, token hay thông tin nhạy cảm nào vào mã nguồn.
- ❌ KHÔNG tích hợp AI tự động tạo việc hay gửi email/SMS ra ngoài.
- ❌ KHÔNG cài đặt các thư viện nặng nề (React, Vue, Tailwind, jQuery, Bootstrap) — Chỉ dùng **HTML5, CSS3, Vanilla JS**.

---

## 5. Tiêu Chí Hoàn Thành (Definition of Done)
- [ ] Mở tệp `index.html` trực tiếp trên trình duyệt hoạt động mượt mà, không yêu cầu cài đặt máy chủ.
- [ ] Vượt qua 100% các bài kiểm thử trong tệp `CHECKLIST.md`.
- [ ] Bảng điều khiển nhà phát triển (Console `F12`) sạch 100%, không có bất kỳ lỗi đỏ nào (`0 errors`).
- [ ] Giao diện co giãn mượt mà trên điện thoại di động, không bị tràn màn hình.

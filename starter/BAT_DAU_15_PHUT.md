# Checklist bắt đầu với AI Coding Agent trong 15 phút

> Dành cho người chưa từng lập trình. Chỉ chọn một công cụ: Codex, Antigravity hoặc Claude Code. Không cần cài cả ba.

## 1. Chuẩn bị

- [ ] Tôi đã đăng nhập và mở được màn hình tạo Project/Workspace.
- [ ] Tôi không sử dụng tài khoản hoặc máy tính dùng chung nếu dự án có dữ liệu nội bộ.
- [ ] Tôi sẽ chỉ dùng dữ liệu giả lập trong bài học.

## 2. Tạo thư mục dự án riêng

### macOS

1. Mở Finder và chọn Desktop.
2. Chọn **File → New Folder**.
3. Đặt tên thư mục: `so-cong-viec`.

### Windows

1. Mở File Explorer và chọn Desktop.
2. Chọn **New → Folder**.
3. Đặt tên thư mục: `so-cong-viec`.

Không chọn cả Desktop, Documents, Downloads, thư mục người dùng hoặc ổ đĩa làm workspace.

## 3. Mở workspace an toàn

1. Trong Coding Agent, chọn **Open Folder / Add Folder / New Project**.
2. Chọn đúng thư mục `so-cong-viec`.
3. Chọn quyền chỉ đọc và sửa trong workspace khi công cụ cho phép lựa chọn.
4. Không cấp quyền toàn ổ đĩa nếu bài học không yêu cầu.

## 4. Prompt kiểm tra đầu tiên

```text
Hãy xác nhận thư mục làm việc hiện tại, liệt kê các tệp đang có và giải thích ngắn gọn bạn được phép làm gì. Chưa tạo hoặc sửa bất kỳ tệp nào.
```

Đạt khi Agent xác nhận đúng thư mục `so-cong-viec` và không nhắc tới tệp ở Documents, Downloads hoặc thư mục khác.

## 5. Hiểu yêu cầu cấp quyền

- **Read:** đọc nội dung tệp.
- **Write / Edit:** tạo hoặc sửa tệp.
- **Run:** chạy một lệnh trên máy.
- **Diff / Changes:** xem chính xác dòng nào được thêm, sửa hoặc xóa.
- **Stop:** dừng tác vụ khi Agent đi sai hướng.
- **Revert:** hoàn tác thay đổi đã thực hiện.

Trước khi bấm **Allow / Approve / Proceed**, tự hỏi:

- [ ] Hành động có đúng mục tiêu đang giao không?
- [ ] Hành động có nằm trong thư mục dự án không?
- [ ] Không chứa dữ liệu thật, mật khẩu, cookie, token hoặc API key?
- [ ] Tôi hiểu tệp nào sẽ bị sửa và có thể hoàn tác?

## 6. Tạo đúng tệp Markdown

Tệp Markdown là tệp văn bản có đuôi `.md`, ví dụ `YEU_CAU.md` và `AGENTS.md`.

- Nếu dùng TextEdit trên macOS, chọn **Format → Make Plain Text** trước khi lưu.
- Nếu dùng Notepad trên Windows, ở **Save as type** chọn **All files**, rồi lưu đúng tên `YEU_CAU.md`.
- Nếu xuất hiện `YEU_CAU.md.txt`, hãy bật hiển thị phần mở rộng tệp và đổi lại tên.

## 7. Khi gặp lỗi

1. Bấm **Stop** nếu Agent vẫn đang chạy sai.
2. Ghi lại thao tác vừa làm, kết quả mong đợi và kết quả thực tế.
3. Sao chép dòng lỗi đỏ đầu tiên trong Console nếu có.
4. Yêu cầu Agent chẩn đoán trước, chưa sửa ngay.
5. Chỉ duyệt bản sửa nhỏ nhất và chạy lại bài kiểm thử cũ.

## Hoàn thành

- [ ] Tôi đã chọn đúng một Coding Agent.
- [ ] Tôi đã mở riêng thư mục `so-cong-viec`.
- [ ] Agent chỉ nhìn thấy tệp trong workspace.
- [ ] Tôi biết cách dùng Stop, Diff và Approve an toàn.
- [ ] Tôi đã sẵn sàng bắt đầu Bài 1.

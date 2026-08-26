# Lộ trình Vibe Coding 4 buổi: từ quy trình đến bàn giao

Tài liệu thực hành này được tổng hợp từ folder `WORKSHOP - VIBE CODING 8-2026`. Mục tiêu là giúp một nhóm không chuyên CNTT biến một quy trình nhỏ thành prototype có thể trình diễn, kiểm thử và bàn giao. Chỉ dùng dữ liệu giả lập hoặc đã ẩn danh.

## Nguyên tắc xuyên suốt

1. Bắt đầu từ quy trình thật, không bắt đầu từ công nghệ.
2. Làm một luồng nhỏ chạy từ đầu đến cuối trước khi thêm tính năng.
3. Mỗi prompt phải có mục tiêu, bối cảnh, ràng buộc và bằng chứng hoàn thành.
4. AI lập kế hoạch trước; con người duyệt phạm vi, diff, quyền và kết quả test.
5. Kiểm thử cả ca bình thường, thiếu dữ liệu, dữ liệu sai, sai quyền và ngoại lệ.
6. AI chỉ hỗ trợ; không tự phê duyệt, tự gửi hay ra quyết định có hậu quả quan trọng.
7. Demo thử nghiệm không đồng nghĩa hệ thống đủ điều kiện vận hành chính thức.

## Buổi 1 — Từ quy trình công việc đến đặc tả

### Sản phẩm đầu ra

- Phiếu mô tả vấn đề và phạm vi v1.
- Sơ đồ luồng có điểm bắt đầu, kết thúc, vai trò và nhánh ngoại lệ.
- Danh sách trạng thái và điều kiện chuyển.
- Từ điển dữ liệu: trường, kiểu, bắt buộc, validation, quyền xem.
- Ba tình huống bình thường và ba ngoại lệ.

### Cổng chất lượng

- [ ] Quy trình có chủ sở hữu nghiệp vụ.
- [ ] Ranh giới bắt đầu–kết thúc rõ.
- [ ] Mỗi trạng thái có một người chịu trách nhiệm.
- [ ] Có nhánh bổ sung, từ chối, hủy hoặc quá hạn khi phù hợp.
- [ ] Dữ liệu mẫu là giả lập/ẩn danh.
- [ ] Danh sách "không làm ở v1" đã được chốt.

## Buổi 2 — Google Stitch → Antigravity/Coding Agent → web app

### Phân công công cụ

| Google Stitch | Coding Agent |
|---|---|
| Tạo phương án bố cục | Tổ chức thư mục và tách module |
| Duy trì ngôn ngữ thị giác | Lưu/đọc dữ liệu và trạng thái |
| Tinh chỉnh desktop/mobile | Validation, logic nghiệp vụ và phân quyền |
| Xuất giao diện/code tĩnh | Chạy server, sửa lỗi và kiểm thử luồng thật |

Giao diện là lời hứa. Web app chỉ "chạy được" khi nó nhận dữ liệu, chặn sai, lưu đúng, chuyển trạng thái đúng quyền và có bằng chứng test.

### Prompt chuyển giao

```text
Hãy đọc template giao diện và đặc tả quy trình. Phân loại phần nào
mới là UI mô phỏng; phần nào cần state, logic, validation và kiểm tra quyền.
Lập kế hoạch theo lát cắt: tạo → lưu → danh sách → chi tiết → chuyển trạng thái.
Giữ ngôn ngữ thiết kế, dùng dữ liệu giả lập, nêu file và test. Chờ tôi duyệt.
```

## Buổi 3 — Tự động hóa, dữ liệu và AI có kiểm soát

### Mẫu quy tắc tự động hóa

```text
Khi [sự kiện], nếu [điều kiện], thì [hành động].
Nếu không đạt, chuyển cho [người chịu trách nhiệm], hạn [thời gian],
thông báo [nội dung tối thiểu] và ghi [dấu vết].
```

Mỗi quy tắc cần ví dụ đúng, sai và giá trị biên trước khi nhờ agent viết code.

### Hợp đồng chức năng AI

```text
Chức năng: [một tác vụ hẹp].
Đầu vào được phép: [dữ liệu tối thiểu, đã làm sạch].
Đầu ra: [cấu trúc, độ dài, phần thiếu, nguồn nếu có].
Không được làm: tự duyệt, tự gửi, suy đoán dữ liệu không có.
Kiểm soát: người xử lý xem, sửa và xác nhận trước khi lưu/gửi.
Fallback: hiển thị nội dung gốc và chuyển người xử lý khi AI lỗi.
```

### Sáu test AI bắt buộc

- [ ] Đầu vào hợp lệ: trả đúng cấu trúc.
- [ ] Thiếu dữ liệu: yêu cầu bổ sung, không tự suy đoán.
- [ ] Ngoài phạm vi: từ chối và chuyển người duyệt.
- [ ] Chỉ dẫn gây nhiễu: giữ đúng phạm vi và quy tắc hệ thống.
- [ ] Tự tin nhưng sai: nêu giới hạn, không bịa thêm.
- [ ] AI/mạng lỗi: hiện nội dung gốc và fallback hoạt động.

## Buổi 4 — Kiểm thử, bảo mật, dashboard và chuyển giao

### Bảng test tối thiểu

| ID | Tiền điều kiện | Dữ liệu | Bước thực hiện | Kết quả mong đợi | Thực tế + bằng chứng | Mức độ |
|---|---|---|---|---|---|---|
| TC-01 | Vai trò người gửi | Đủ trường | Tạo hồ sơ | Sinh mã, lưu, có log | | |
| TC-02 | Vai trò người gửi | Thiếu trường | Bấm Lưu | Chặn, báo đúng trường | | |
| TC-03 | Vai trò không có quyền | Hồ sơ khác | Gọi URL/API | Từ chối, không đổi dữ liệu | | |
| TC-04 | AI sẵn sàng | Ngoài phạm vi | Yêu cầu quyết định | Từ chối + chuyển người duyệt | | |
| TC-05 | Có backup | Bản sao ngày X | Restore môi trường test | Đủ dữ liệu, đúng checksum/số bản ghi | | |

Xếp mức độ: **Critical** = sai/mất dữ liệu hoặc sai quyền; **High** = chặn luồng chính; **Medium** = có cách làm vòng; **Low** = chính tả/màu sắc.

### Dashboard

Viết 3–5 câu hỏi quản lý trước khi chọn biểu đồ:

- Còn bao nhiêu việc và đang ở trạng thái nào?
- Việc nào quá hạn và ai cần hành động?
- Khâu nào có thời gian chờ/xử lý dài?
- Loại yêu cầu nào đang tăng?

Ghi rõ dashboard dùng dữ liệu minh họa khi chưa có dữ liệu thật.

### Gói bàn giao

- [ ] Mã nguồn, phiên bản, cấu hình và lệnh chạy.
- [ ] Chủ hệ thống, chủ dữ liệu, người hỗ trợ và kênh báo lỗi.
- [ ] Ma trận quyền và quy trình cấp/thu hồi quyền.
- [ ] Kết quả test, lỗi còn lại, workaround và rủi ro.
- [ ] Log, cảnh báo, backup, kết quả restore thử và rollback.
- [ ] Hướng dẫn người dùng/quản trị cho ba tác vụ thường gặp.

### Kịch bản demo 10 phút

1. Vấn đề — 1 phút.
2. Quy trình và vai trò — 1 phút.
3. Luồng chính bằng dữ liệu ổn định — 3 phút.
4. AI có người duyệt và một ca test xấu — 2 phút.
5. Dashboard, bằng chứng test và bàn giao — 2 phút.
6. Tác động đo được và bước tiếp theo — 1 phút.

## Definition of Done

Sản phẩm chỉ sẵn sàng trình diễn/thí điểm khi:

- [ ] Luồng chính chạy được từ đầu đến cuối bằng dữ liệu giả lập.
- [ ] Trạng thái, validation và quyền được kiểm tra ở logic, không chỉ ở UI.
- [ ] Test có ca xấu, kết quả thực tế và ảnh/log.
- [ ] Chức năng AI có giới hạn, người duyệt và fallback.
- [ ] Dashboard trả lời câu hỏi có thể hành động.
- [ ] Backup đã restore thử; log không chứa bí mật.
- [ ] Có chủ sở hữu, hướng dẫn, hỗ trợ và rollback.
- [ ] Nhóm nói rõ đây là prototype/thí điểm, không phải hệ thống chính thức.

# Bảng Kiểm Thử Nghiệm Thu (CHECKLIST.md)

> Sử dụng bảng kiểm thử này để tự kiểm tra hoặc yêu cầu AI Agent xác minh trước khi coi một bài học hoặc tính năng là hoàn thành.

---

## 1. Bảng 8 Ca Kiểm Thử Bắt Buộc (Mandatory Test Matrix)

| STT | Tên ca kiểm thử | Thao tác thực hiện | Kết quả mong đợi | Tự kiểm |
|---|---|---|---|:---:|
| **TC-01** | Trạng thái rỗng ban đầu | Mở `index.html` lần đầu khi chưa có dữ liệu nào trong máy | Hiển thị thông điệp và hình vẽ thân thiện: *"Chưa có công việc nào"*. Không có thông báo lỗi. | [ ] |
| **TC-02** | Bắt lỗi ô nhập rỗng | Để trống ô nhập (hoặc chỉ gõ dấu cách) và bấm nút `+ Thêm việc` hoặc gõ `Enter` | Xuất hiện thông báo lỗi màu đỏ cạnh ô nhập: *"Vui lòng nhập tên công việc!"*. Không tạo mục mới trong danh sách. | [ ] |
| **TC-03** | Thêm nhiều công việc | Lần lượt thêm 3 việc: `"Chốt yêu cầu v1"`, `"Kiểm tra mobile"`, `"Đưa app online"` | Danh sách hiển thị đủ 3 mục theo đúng thứ tự. Bộ đếm hiển thị: *Tất cả (3), Đang làm (3), Đã xong (0)*. Ô nhập tự động xóa trắng và focus lại. | [ ] |
| **TC-04** | Đánh dấu hoàn thành | Nhấp vào checkbox của việc thứ 1 (`"Chốt yêu cầu v1"`) | Việc thứ 1 chuyển sang trạng thái gạch ngang chữ. Bộ đếm cập nhật tức thì: *Đang làm (2), Đã xong (1)*. Nhấp lại lần nữa thì hoàn tác về đang làm. | [ ] |
| **TC-05** | Bộ lọc danh sách | Nhấp vào tab **Đang làm**, sau đó nhấp vào tab **Đã xong** | - Tab **Đang làm**: Chỉ hiện 2 việc chưa hoàn thành, ẩn việc đã xong.<br>- Tab **Đã xong**: Chỉ hiện 1 việc đã hoàn thành.<br>- Tab **Tất cả**: Hiện toàn bộ 3 việc. | [ ] |
| **TC-06** | Lưu trữ khi tải lại | Nhấn phím `F5` hoặc tải lại trang trình duyệt | Toàn bộ 3 công việc, trạng thái checkbox và bộ đếm vẫn giữ nguyên 100%, không bị mất hay reset về 0. | [ ] |
| **TC-07** | Xác nhận xóa an toàn | Bấm nút `Xóa` ở một công việc. Khi hộp thoại hỏi hiện ra, bấm `Hủy` (Cancel) | Công việc KHÔNG bị xóa. Thử bấm `Xóa` lần 2 và chọn `Đồng ý` (OK) thì công việc bị xóa vĩnh viễn và bộ đếm giảm đi 1. | [ ] |
| **TC-08** | Hiển thị trên điện thoại di động | Nhấn `F12` → bật chế độ Device Toolbar → chọn màn hình điện thoại di động | Giao diện hiển thị vừa vặn chiều ngang (không có thanh cuộn ngang). Nút bấm dễ chạm, chữ rõ ràng dễ đọc. | [ ] |

---

## 2. Kiểm Thử Kỹ Thuật Bổ Sung (Technical Health Check)
- [ ] **Console sạch:** Mở tab Console (`F12`), không có bất kỳ dòng chữ đỏ nào (`Uncaught TypeError`, `404 Not Found`).
- [ ] **Khả năng điều khiển bằng bàn phím:** Dùng phím `Tab` duyệt được từ ô nhập → nút thêm → các tab lọc → checkbox → nút xóa.
- [ ] **Xử lý chuỗi đặc biệt (XSS Test):** Thử nhập tiêu đề `<script>alert('xss')</script>` hoặc `<b>Test HTML</b>` → Ứng dụng phải hiển thị dưới dạng văn bản an toàn, không được thực thi mã độc.

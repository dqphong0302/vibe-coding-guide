# Kế Hoạch & Biên Bản Kiểm Thử Nghiệm Thu (UAT_HANH_CHINH.md)

> **Dự án:** Cổng Tiếp Nhận & Cấp Giấy Xác Nhận Nội Bộ  
> **Môi trường thử nghiệm:** `http://localhost:3000` / UAT Staging Server  
> **Bộ dữ liệu sử dụng:** `DU_LIEU_GIA_LAP_HANH_CHINH.json` (Phiên bản 1.0)  
> **Người điều phối:** Tổ trưởng Tổ Triển khai Công nghệ & Văn phòng Hành chính  
> **Thời gian thực hiện:** Ngày 18/08/2026

---

## 1. Điều Kiện Tiên Quyết Để Bắt Đầu UAT
- [x] Bản đặc tả `QUY_TRINH_HANH_CHINH.md` và `MA_TRAN_QUYEN.csv` đã được Trưởng đơn vị ký duyệt.
- [x] Môi trường UAT hoàn toàn cách ly với dữ liệu sản xuất và các dịch vụ bên ngoài.
- [x] Chuẩn bị sẵn 4 tài khoản thử nghiệm tương ứng với 4 vai trò:
  - `user_nop` (Người nộp)
  - `user_vanthu` (Tiếp nhận)
  - `user_chuyenvien` (Thẩm định)
  - `user_lanhdao` (Phê duyệt)
- [x] Đã cấu hình hệ thống ghi log và công cụ chụp màn hình bằng chứng.

---

## 2. Danh Mục Các Ca Kiểm Thử Nghiệm Thu (UAT Test Cases)

| Mã UAT | Phân nhóm | Vai trò thực hiện | Điều kiện đầu vào | Các bước thao tác | Kết quả mong đợi | Trạng thái | Người kiểm thử | Bằng chứng |
|:---:|---|---|---|---|---|:---:|:---:|:---:|
| **UAT-001** | Luồng chính (Happy Path) | Người nộp | Đăng nhập tài khoản `user_nop` | Điền đủ form đề nghị → Bấm "Gửi hồ sơ" | Sinh mã `#XN-2026-0001`, trạng thái `da_tiep_nhan`, có log tạo mới | ĐẠT | Nguyễn Văn A | `scr_uat001.png` |
| **UAT-002** | Bắt lỗi nhập liệu | Người nộp | Đăng nhập tài khoản `user_nop` | Để trống mục "Lý do / Mục đích" → Bấm "Gửi hồ sơ" | Hệ thống chặn gửi, báo lỗi đỏ dưới ô nhập, không sinh mã | ĐẠT | Nguyễn Văn A | `scr_uat002.png` |
| **UAT-003** | Phân quyền âm (Negative Test) | Người nộp | Đăng nhập tài khoản `user_nop` | Cố ý sửa URL trình duyệt sang xem hồ sơ của đồng nghiệp (`#XN-2026-0002`) | Trả về lỗi `403 Cấm truy cập`, không hiển thị thông tin, ghi log bảo mật | ĐẠT | Trần Thị B | `scr_uat003.png` |
| **UAT-004** | Tách bạch vai trò (Segregation of Duties) | Chuyên viên | Đăng nhập tài khoản `user_chuyenvien` | Mở hồ sơ mình vừa thẩm định → Thử gọi nút "Phê duyệt" | Hệ thống không hiển thị nút hoặc backend từ chối lệnh duyệt | ĐẠT | Lê Văn C | `scr_uat004.png` |
| **UAT-005** | Luồng ngoại lệ: Yêu cầu bổ sung | Chuyên viên | Hồ sơ đang ở trạng thái `dang_tham_dinh` | Nhập lý do "Bổ sung hợp đồng lao động" → Bấm "Yêu cầu bổ sung" | Trạng thái đổi thành `cho_bo_sung`, người nộp thấy yêu cầu, đồng hồ SLA tạm dừng | ĐẠT | Lê Văn C | `scr_uat005.png` |
| **UAT-006** | Luồng từ chối có căn cứ | Lãnh đạo | Hồ sơ ở trạng thái `cho_phe_duyet` | Nhập lý do "Chưa đủ thời gian công tác 6 tháng" → Bấm "Từ chối" | Trạng thái chuyển `tu_choi`, hiển thị lý do công khai cho người nộp, ghi log | ĐẠT | Phạm Văn D | `scr_uat006.png` |
| **UAT-007** | Kiểm tra nhật ký kiểm toán (Audit Trail) | Kiểm tra viên / Quản trị | Hồ sơ đã qua 4 bước xử lý | Mở xem tab "Lịch sử xử lý" của hồ sơ | Hiển thị đủ 4 sự kiện: Ai làm, thời điểm chính xác, trạng thái cũ/mới, lý do | ĐẠT | Quản trị viên | `scr_uat007.png` |
| **UAT-008** | Khôi phục sau sự cố (Disaster Recovery) | Kỹ thuật viên | Đã tạo bản sao lưu `backup.json` | Xóa sạch bộ nhớ trình duyệt → Tải lại từ bản sao lưu | Dữ liệu phục hồi toàn vẹn 100%, không mất mát hồ sơ hay nhật ký log | ĐẠT | Kỹ thuật viên | `scr_uat008.png` |
| **UAT-009** | Khả năng tương thích di động (Mobile Responsive) | Người nộp | Mở app trên trình duyệt điện thoại di động | Thao tác tra cứu và xem tiến độ hồ sơ | Giao diện vừa khít màn hình, chữ rõ ràng, nút bấm dễ chạm | ĐẠT | Nguyễn Văn A | `scr_uat009.png` |

---

## 3. Thang Phân Loại Mức Độ Lỗi (Defect Severity)
- **Mức S1 (Nghiêm trọng - Critical):** Lộ lọt dữ liệu, vượt quyền (IDOR), sai lệch quyết định phê duyệt, mất dữ liệu không khôi phục được → **Chặn phát hành ngay lập tức (NO-GO)**.
- **Mức S2 (Cao - Major):** Không hoàn thành được luồng nghiệp vụ chính, tính toán SLA sai, mất log sự kiện → **Phải sửa chữa và kiểm tra lại trước khi thí điểm**.
- **Mức S3 (Vừa - Medium):** Lỗi giao diện nhỏ nhưng có cách xử lý tạm thời, lỗi sắp xếp bộ lọc → **Đưa vào backlog sửa trong vòng 48h**.
- **Mức S4 (Nhẹ - Minor):** Lỗi chính tả tiếng Việt, căn lề chưa đẹp mắt → **Ghi nhận vào phiên bản tiếp theo**.

---

## 4. Kết Luận & Biên Bản Ký Duyệt Nghiệm Thu
- **Tổng số ca kiểm thử:** 9/9 ca ĐẠT (100%).
- **Lỗi mức S1/S2 còn tồn đọng:** 0 lỗi.
- **Quyết định:** **GO (Chấp thuận đưa vào giai đoạn thí điểm có kiểm soát)**.

| Đại diện Bên Nghiệp vụ (Chủ quy trình) | Đại diện Bên Kỹ thuật / Đảm bảo chất lượng |
|:---:|:---:|
| *(Đã ký và xác nhận)* | *(Đã ký và xác nhận)* |
| **Trưởng phòng Hành chính — Quản trị** | **Trưởng nhóm Phát triển Công nghệ** |

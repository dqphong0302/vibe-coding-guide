# Tài Liệu Bàn Giao & Vận Hành Hệ Thống (HANDOFF_HANH_CHINH.md)

> **Hệ thống:** Cổng Đề Nghị & Cấp Giấy Xác Nhận Nội Bộ (v1.0.0)  
> **Trạng thái:** PILOT (Thí điểm nội bộ phòng ban)  
> **Ngày bàn giao:** 18/08/2026

---

## 1. Cơ Cấu Tổ Chức & Trách Nhiệm Chủ Sở Hữu (Ownership Matrix)
- **Chủ sở hữu nghiệp vụ (Business Owner):** Trưởng phòng Hành chính — Quản trị (Chịu trách nhiệm về quy trình, biểu mẫu và quy định phê duyệt).
- **Chủ sở hữu hệ thống (System Owner):** Tổ Công nghệ Thông tin đơn vị (Chịu trách nhiệm về hạ tầng, mã nguồn và máy chủ lưu trữ).
- **Chủ sở hữu dữ liệu (Data Owner):** Bộ phận Văn thư — Lưu trữ (Chịu trách nhiệm về tính toàn vẹn và phân loại dữ liệu).
- **Đầu mối An toàn thông tin (Security Lead):** Chuyên viên phụ trách An toàn mạng đơn vị.
- **Kênh hỗ trợ kỹ thuật người dùng:**
  - *Hỗ trợ Cấp 1 (Helpdesk):* Văn thư tiếp nhận — Hướng dẫn điền đơn và tra cứu mã hồ sơ.
  - *Hỗ trợ Cấp 2 (Kỹ thuật ứng dụng):* Đội ngũ phát triển — Xử lý lỗi chức năng và khôi phục dữ liệu.

---

## 2. Thông Tin Môi Trường Triển Khai

| Thông số | Môi trường UAT / Thử nghiệm | Môi trường Thí điểm (Pilot) |
|---|---|---|
| **Đường dẫn truy cập (URL)** | `https://uat-hoso.noibo.local` | `https://hoso.noibo.local` |
| **Giao thức bảo mật** | HTTPS nội bộ (TLS 1.3) | HTTPS nội bộ (TLS 1.3) |
| **Nguồn dữ liệu** | `DU_LIEU_GIA_LAP_HANH_CHINH.json` | CSDL mã hóa tại chỗ (Local Encrypted Storage) |
| **Phiên bản mã nguồn** | Git Tag `v1.0.0-uat` | Git Tag `v1.0.0-release` |

> ⚠️ **Lưu ý bảo mật:** Tuyệt đối không lưu trữ mật khẩu hay khóa bảo mật (secrets) trong tệp tài liệu này. Tất cả khóa quản trị được quản lý tại kho lưu trữ bảo mật (Secret Store) nội bộ của cơ quan.

---

## 3. Quy Trình Triển Khai (Deployment) & Hoàn Tác Sự Cố (Rollback)

### 3.1. Quy trình triển khai bản mới
1. Đảm bảo toàn bộ các ca kiểm thử trong `UAT_HANH_CHINH.md` đã đạt 100%.
2. Thực hiện sao lưu bản ghi dữ liệu hiện hành trước khi cập nhật mã nguồn.
3. Đẩy tệp mã nguồn mới vào thư mục máy chủ web.
4. Chạy bộ bài kiểm tra nhanh (Smoke Test) xác nhận luồng tiếp nhận và duyệt hoạt động bình thường.

### 3.2. Quy trình hoàn tác khẩn cấp (Rollback Runbook)
- **Điều kiện kích hoạt rollback:**
  - Phát hiện lỗi lộ lọt dữ liệu hoặc lỗi phân quyền chéo hồ sơ (Mức S1).
  - Tỷ lệ lỗi hệ thống vượt quá 5% tổng số lượt truy cập trong vòng 15 phút.
- **Người có thẩm quyền ra lệnh:** Trưởng nhóm Công nghệ hoặc Chủ sở hữu nghiệp vụ.
- **Các bước thực hiện:**
  1. Chuyển hướng trang web sang trang bảo trì: *"Hệ thống đang bảo trì định kỳ"*.
  2. Khôi phục mã nguồn về Git Tag ổn định gần nhất (`git checkout v0.9.5-stable`).
  3. Khôi phục dữ liệu từ bản sao lưu gần nhất.
  4. Xác nhận trạng thái hoạt động và mở lại hệ thống cho người dùng.

---

## 4. Kế Hoạch Sao Lưu & Khôi Phục Dữ Liệu (Backup & Disaster Recovery)
- **Tần suất sao lưu:**
  - Sao lưu tự động (Snapshot) hằng ngày vào lúc 23:00.
  - Sao lưu đầy đủ (Full Backup) vào cuối mỗi tuần.
- **Thời gian lưu trữ bản sao lưu:** 90 ngày.
- **Kiểm tra khôi phục định kỳ:** Thực hiện diễn tập khôi phục dữ liệu thử nghiệm 01 lần / quý để đảm bảo tệp sao lưu không bị lỗi hỏng.

---

## 5. Giám Sát Vận Hành & Ngưỡng Cảnh Báo (Monitoring & Alerts)

| Tín hiệu giám sát | Ngưỡng bình thường | Ngưỡng cảnh báo nguy hiểm | Hành động xử lý |
|---|---|---|---|
| **Lỗi phân quyền (403 Forbidden)** | 0 lần / giờ | ≥ 3 lần trong 10 phút | Kiểm tra ngay nhật ký IP, nghi vấn tấn công dò quét |
| **Hồ sơ quá hạn SLA** | < 5% tổng hồ sơ | ≥ 10% tổng hồ sơ | Gửi email nhắc nhở lãnh đạo/chuyên viên phụ trách |
| **Thời gian tải trang** | < 1.5 giây | > 4.0 giây | Tối ưu hóa lại tài nguyên hình ảnh và script |

---

## 6. Kế Hoạch 5 Bước Tiếp Theo Sau Giai Đoạn Thí Điểm
1. Thu thập phản hồi từ 50 cán bộ nhân viên tham gia thí điểm trong tuần đầu tiên.
2. Tinh chỉnh giao diện và bổ sung bộ lọc nâng cao theo phòng ban.
3. Chuẩn bị hồ sơ đánh giá an toàn thông tin cấp độ 2 theo quy định.
4. Xây dựng tài liệu hướng dẫn sử dụng dạng video ngắn 2 phút cho cán bộ mới.
5. Lập kế hoạch kết nối hệ thống thông báo nội bộ qua Zalo ZNS / Email cơ quan cho phiên bản v2.

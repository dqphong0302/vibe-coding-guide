# Đặc Tả Quy Trình Hành Chính: Cấp Giấy Xác Nhận Nội Bộ

> **Trạng thái:** APPROVED (Đã phê duyệt thí điểm)  
> **Chủ quy trình:** Trưởng phòng Hành chính — Quản trị  
> **Phiên bản:** 1.0.0 — Ngày ban hành: 18/08/2026  
> **Căn cứ pháp lý & nội bộ:** Nghị định 45/2020/NĐ-CP & Nghị định 310/2026/NĐ-CP (sửa đổi, bổ sung hiệu lực 05/08/2026); Quy chế văn thư lưu trữ nội bộ số 12/QC-HC.  
> **Mục đích:** Số hóa quy trình đề nghị và cấp giấy xác nhận công tác / thu nhập cho cán bộ, nhân viên đơn vị.  
> **Lưu ý an toàn:** Dữ liệu trong prototype hoàn toàn là DỮ LIỆU GIẢ LẬP.

---

## 1. Vấn Đề Thực Trạng & Mục Tiêu Cải Tiến
- **Hiện trạng (AS-IS):** Cán bộ nhân viên phải in đơn giấy, ký tay, nộp trực tiếp tại bàn văn thư hoặc gửi email đính kèm file Word/PDF rời rạc.
  - *Nhược điểm:* Không biết hồ sơ đang ở bàn ai xử lý; văn thư dễ thất lạc email; thời gian chờ trung bình kéo dài 3–5 ngày; không có nhật ký lưu lý do khi từ chối hoặc yêu cầu bổ sung.
- **Mục tiêu cải tiến (TO-BE):** Tạo một cổng số hóa nội bộ có kiểm soát trạng thái, tự động sinh mã hồ sơ duy nhất, quản lý thời hạn xử lý (SLA), ghi nhật ký bất biến (Audit Log) và phân quyền chặt chẽ theo vai trò.
  - *Chỉ số đo lường:* Giảm thời gian xử lý từ 72 giờ xuống dưới 24 giờ; tỷ lệ hồ sơ xử lý đúng hạn đạt ≥ 95%; tỷ lệ sai sót quyền hạn = 0%.

---

## 2. Phạm Vi Triển Khai (Scope Boundary)

### 2.1. Thực hiện trong Phiên bản 1 (In Scope)
- Tiếp nhận hồ sơ trực tuyến với mã định danh tự động dạng `#XN-YYYY-NNNN`.
- Luồng duyệt 4 bước: Người nộp → Tiếp nhận/Kiểm tra → Thẩm định → Phê duyệt.
- Quản lý trạng thái và cảnh báo hạn xử lý (SLA) theo giờ làm việc.
- Nhật ký kiểm toán (Audit Trail) ghi nhận mọi hành động: Ai làm gì, lúc nào, thay đổi trạng thái từ đâu sang đâu, kèm lý do.
- Bộ dữ liệu mẫu gồm 8–30 hồ sơ giả lập để kiểm thử nghiệm thu.

### 2.2. Tuyệt đối KHÔNG làm trong Phiên bản 1 (Out of Scope)
- ❌ KHÔNG tích hợp chứng thư số hoặc chữ ký số thật (chỉ giả lập bước ký phê duyệt).
- ❌ KHÔNG kết nối vào cơ sở dữ liệu nhân sự / tiền lương thật của cơ quan.
- ❌ KHÔNG gửi SMS Brandname hay Email thật ra bên ngoài (chỉ hiển thị thông báo trong giao diện).
- ❌ KHÔNG cho phép AI tự động ra quyết định phê duyệt thay cho lãnh đạo có thẩm quyền.

---

## 3. Danh Mục Vai Trò & Ma Trận Phân Quyền (RBAC)

| Mã vai trò | Tên vai trò | Trách nhiệm chính | Hành động cho phép | Điều cấm tuyệt đối |
|:---:|---|---|---|---|
| **R1** | **Người nộp** (Cán bộ/Nhân viên) | Soạn thảo, nộp hồ sơ và bổ sung thông tin khi được yêu cầu | Tạo mới (Nháp), Nộp hồ sơ, Xem tiến độ hồ sơ của mình, Bổ sung tệp | Không được xem hồ sơ của nhân viên khác; không được sửa khi đã nộp |
| **R2** | **Cán bộ Tiếp nhận** (Văn thư) | Kiểm tra tính đầy đủ của thành phần hồ sơ | Tiếp nhận, Yêu cầu bổ sung, Phân công cho Chuyên viên thụ lý | Không được tự ý phê duyệt kết quả cuối cùng |
| **R3** | **Chuyên viên Thẩm định** | Thẩm tra nội dung, đối chiếu dữ liệu công tác/thu nhập | Thẩm định hồ sơ, Ghi chú ý kiến thẩm định, Chuyển trình lãnh đạo | Không được tự phê duyệt hồ sơ do chính mình thẩm định |
| **R4** | **Lãnh đạo Phê duyệt** | Ra quyết định phê duyệt hoặc từ chối cấp giấy | Phê duyệt cấp giấy, Từ chối (bắt buộc nhập lý do), Xem toàn bộ báo cáo | Không được xóa hoặc sửa đổi nhật ký kiểm toán (Audit Log) |

---

## 4. Bảng Quy Trình Hiện Trạng (AS-IS Mapping)

| Bước | Tác nhân | Hoạt động & Đầu vào | Quy tắc nghiệp vụ | Đầu ra | Thời gian xử lý | Thời gian chờ | Rủi ro / Điểm nghẽn |
|:---:|---|---|---|---|:---:|:---:|---|
| A01 | Người nộp | Điền đơn xin xác nhận (mẫu giấy/file Word) | Phải ghi rõ mục đích (vay vốn, xin visa, thủ tục hành chính) | Phiếu đề nghị | 15 phút | 2–4 giờ | Mẫu đơn cũ, thiếu thông tin bắt buộc |
| A02 | Văn thư | Nhận đơn giấy hoặc kiểm tra hộp thư email | Kiểm tra đủ chữ ký trưởng bộ phận | Phiếu hẹn viết tay | 10 phút | 4–8 giờ | Thất lạc email, quên chuyển giao hồ sơ |
| A03 | Chuyên viên | Tra cứu sổ nhân sự, tính thu nhập 3 tháng | Đối chiếu bảng lương và quyết định tuyển dụng | Dự thảo giấy xác nhận | 30 phút | 8–24 giờ | Hồ sơ nằm chờ trên bàn làm việc |
| A04 | Lãnh đạo | Ký duyệt bản in giấy | Chỉ ký khi có chữ ký nháy của chuyên viên | Giấy xác nhận đã ký | 5 phút | 12–48 giờ | Lãnh đạo đi công tác gây tắc nghẽn luồng |
| A05 | Văn thư | Đóng dấu đỏ, vào sổ công văn đi, trả kết quả | Thu hồi phiếu hẹn, ghi sổ theo dõi | Kết quả đến tay người nộp | 10 phút | 2–4 giờ | Không thông báo kịp thời cho người nộp |

---

## 5. Mô Hình Trạng Thái Chuẩn Hóa (TO-BE State Machine)

```
[Nháp] ──(Nộp)──> [Đã tiếp nhận] ──(Phân công)──> [Đang thẩm định] ──(Trình duyệt)──> [Chờ phê duyệt] ──(Duyệt)──> [Hoàn tất]
                        │                                │                                    │
                  (Thiếu tệp)                      (Cần giải trình)                      (Không đủ ĐK)
                        ↓                                ↓                                    ↓
                 [Chờ bổ sung] ◄─────────────────────────┘                             [Từ chối]
                        │
                  (Nộp bổ sung)
                        └───────────────────────> [Đang thẩm định]
```

| Tên trạng thái | Người chịu trách nhiệm | Hành động hợp lệ | Điều kiện kích hoạt | SLA quy định |
|---|---|---|---|:---:|
| **Nháp** (`nhap`) | Người nộp | Sửa, Lưu, Nộp, Xóa nháp | Người dùng mở form mới | Không tính |
| **Đã tiếp nhận** (`da_tiep_nhan`) | Cán bộ Tiếp nhận | Tiếp nhận, Yêu cầu bổ sung, Phân công | Hồ sơ gửi thành công | **4 giờ làm việc** |
| **Đang thẩm định** (`dang_tham_dinh`) | Chuyên viên | Ghi ý kiến, Yêu cầu bổ sung, Trình duyệt | Đã phân công cho chuyên viên | **8 giờ làm việc** |
| **Chờ bổ sung** (`cho_bo_sung`) | Người nộp | Tải lên tệp bổ sung, Gửi lại | Chuyên viên/Tiếp nhận gửi lý do | Tạm dừng đồng hồ SLA |
| **Chờ phê duyệt** (`cho_phe_duyet`) | Lãnh đạo | Phê duyệt, Trả lại thẩm định, Từ chối | Có kết luận thẩm định hợp lệ | **4 giờ làm việc** |
| **Hoàn tất** (`hoan_tat`) | Hệ thống / Người nộp | Xem kết quả, Tải bản xác nhận điện tử | Lãnh đạo bấm Phê duyệt | Đóng hồ sơ |
| **Từ chối** (`tu_choi`) | Hệ thống / Người nộp | Xem lý do từ chối | Lãnh đạo bấm Từ chối kèm lý do | Đóng hồ sơ |

---

## 6. Từ Điển Dữ Liệu Hồ Sơ (Data Dictionary)

| Tên trường | Kiểu dữ liệu | Bắt buộc | Quy tắc kiểm tra (Validation) | Phân loại dữ liệu |
|---|---|:---:|---|---|
| `ma_ho_so` | Chuỗi (String) | Có | Định dạng `#XN-YYYY-NNNN`, duy nhất, sinh tự động | Nội bộ |
| `nguoi_nop_id` | Chuỗi (String) | Có | Mã nhân viên hợp lệ (ví dụ: `NV-GIA-01`) | Nội bộ |
| `ho_ten_nguoi_nop`| Chuỗi (String) | Có | Từ 2 đến 100 ký tự, không chứa ký tự đặc biệt | Nhạy cảm |
| `phong_ban` | Lựa chọn (Enum) | Có | Thuộc danh mục phòng ban nội bộ | Nội bộ |
| `loai_xac_nhan` | Lựa chọn (Enum) | Có | `CONG_TAC` \| `THU_NHAP` \| `CONG_TAC_VA_THU_NHAP` | Nội bộ |
| `muc_dich` | Chuỗi (String) | Có | Tối thiểu 10 ký tự, giải thích rõ lý do xin cấp | Nội bộ |
| `ngay_tao` | Thời gian (ISO) | Có | Thời gian hệ thống ghi nhận | Nội bộ |
| `trang_thai` | Lựa chọn (Enum) | Có | Thuộc 7 trạng thái trong mô hình TO-BE | Nội bộ |
| `sla_deadline` | Thời gian (ISO) | Có | Tự động cộng giờ làm việc theo quy định | Nội bộ |
| `audit_logs` | Mảng (Array) | Có | Danh sách các sự kiện lịch sử bất biến | Nội bộ |

---

## 7. Quy Chuẩn Nhật Ký Kiểm Toán (Audit Logging Standard)
Mỗi hành động tác động lên hồ sơ PHẢI tự động ghi một bản ghi log với cấu trúc:
```json
{
  "log_id": "LOG-884920",
  "ma_ho_so": "HS-GIA-0004",
  "thoi_diem": "2026-08-18T10:15:30.000Z",
  "nguoi_thuc_hien_id": "NV-GIA-03",
  "vai_tro": "ChuyenVien",
  "hanh_dong": "YEU_CAU_BO_SUNG",
  "trang_thai_cu": "dang_tham_dinh",
  "trang_thai_moi": "cho_bo_sung",
  "ly_do": "Bảng sao kê thu nhập tháng 7/2026 bị mờ chữ ký ngân hàng.",
  "ip_gia_lap": "192.168.1.45"
}
```

---

## 8. Tiêu Chí Nghiệm Thu (Acceptance Criteria - Given/When/Then)

### AC-01: Tiếp nhận hồ sơ hợp lệ
- **Given:** Người nộp đăng nhập với vai trò R1 và đã điền đầy đủ các trường bắt buộc trên phiếu đề nghị.
- **When:** Người nộp bấm nút "Gửi hồ sơ".
- **Then:** Hệ thống sinh mã hồ sơ mới duy nhất `#XN-2026-xxxx`, chuyển trạng thái sang `da_tiep_nhan`, thiết lập hạn SLA 4 giờ và ghi nhận 1 sự kiện Audit Log.

### AC-02: Ngăn chặn truy cập chéo hồ sơ (Negative Test)
- **Given:** Người nộp A (mã `NV-GIA-01`) đăng nhập vào hệ thống.
- **When:** Người nộp A cố ý thay đổi URL hoặc gọi API để xem hồ sơ của Người nộp B (`NV-GIA-02`).
- **Then:** Hệ thống từ chối hiển thị, trả về mã lỗi `403 Forbidden` và ghi nhật ký cảnh báo vi phạm quyền.

### AC-03: Bắt buộc nhập lý do khi từ chối hồ sơ
- **Given:** Lãnh đạo R4 đang xem hồ sơ ở trạng thái `cho_phe_duyet`.
- **When:** Lãnh đạo bấm nút "Từ chối" nhưng để trống ô nhập lý do.
- **Then:** Hệ thống không cho phép lưu, hiển thị cảnh báo đỏ yêu cầu nhập rõ căn cứ và lý do từ chối.

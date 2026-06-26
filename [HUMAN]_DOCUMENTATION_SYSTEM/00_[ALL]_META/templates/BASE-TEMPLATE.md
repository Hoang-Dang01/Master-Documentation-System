---
id: BASE-TEMPLATE
name: Base Metadata Template
owner: ALL
status: APPROVED
version: 1.0
created_at: 2026-06-26
updated_at: 2026-06-26
links:
  depends_on: []
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
---

# Base Metadata Template

Đây là biểu mẫu nền tảng (Base Template) quy định cấu trúc siêu dữ liệu bắt buộc cho **tất cả** các tệp tin tài liệu trong hệ thống MDS. Tất cả các tài liệu chuyên biệt (Specialized Templates) bắt buộc phải kế thừa (extend) cấu trúc này.

---

## 1. Giải Thích Các Trường Metadata Chung

*   **`id`**: Mã định danh duy nhất toàn cầu của thực thể (ví dụ: `REQ-ATT-001`, `API-USER-002`).
*   **`name`**: Tên hiển thị ngắn gọn của thực thể (ví dụ: `Attendance Engine`).
*   **`owner`**: Vai trò chịu trách nhiệm chính về mặt nội dung (`PM`, `BA`, `SA`, `ARC`, `DBA`, `BE`, `FE`, `QA`, `DEVOPS`, `SEC`, `SRE`, `OPS`, `AI`).
*   **`status`**: Trạng thái vòng đời của tài liệu (`DRAFT`, `REVIEW`, `APPROVED`, `IN_PROGRESS`, `DEPRECATED`, `ARCHIVED`, `BLOCKED`, `NOT_APPLICABLE`).
*   **`version`**: Phiên bản tài liệu (`X.Y`).
*   **`created_at`**: Ngày khởi tạo tài liệu (`YYYY-MM-DD`).
*   **`updated_at`**: Ngày cập nhật tài liệu gần nhất (`YYYY-MM-DD`).

---

## 2. Giải Thích Mạng Lưới Liên Kết Động (Links Graph)

Mục `links` định nghĩa mối quan hệ chéo giữa thực thể này và các phần tử khác trong hệ thống:
*   **`depends_on`**: Danh sách các ID thực thể mà thực thể này phụ thuộc trực tiếp để hoạt động.
*   **`implements`**: Danh sách các ID thiết kế kỹ thuật (như API, Table) hiện thực hóa yêu cầu này.
*   **`tested_by`**: Danh sách các ID kịch bản kiểm thử (Test Case) dùng để xác thực thực thể này.
*   **`broken_by`**: Danh sách các ID lỗi (Bug) hoặc Sự cố (Incident) đang gây ảnh hưởng/làm hỏng thực thể này.
*   **`impacts_cost`**: Danh sách các ID chi phí (Financial/Infra Cost) bị tác động bởi thực thể này.

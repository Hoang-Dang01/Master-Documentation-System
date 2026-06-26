# MDS v7.0 - Master Template Index

> **MDS — Master Documentation System**
> *Documentation-driven System Engineering Framework & AI-Native Engineering OS*

Tài liệu này là chỉ mục tổng hợp (Master Index) dẫn tới tất cả các biểu mẫu tài liệu chuẩn hóa trong hệ thống MDS. Tất cả các tài liệu nghiệp vụ và kỹ thuật trong dự án bắt buộc phải kế thừa (extend) cấu trúc siêu dữ liệu và nội dung từ các biểu mẫu này.

---

## 1. Biểu Mẫu Nền Tảng (Base Template)

Mọi tài liệu trong hệ thống bắt buộc phải chứa phần Metadata Header (YAML) chung định nghĩa các thuộc tính quản trị (`id`, `owner`, `status`, `version`, v.v.) và mạng lưới liên kết chéo (`links`).
*   👉 **[BASE-TEMPLATE.md]([HUMAN]_DOCUMENTATION_SYSTEM/00_[ALL]_META/templates/BASE-TEMPLATE.md)**: Khung metadata nền tảng bắt buộc.

---

## 2. 7 Biểu Mẫu Chuyên Biệt (Specialized Templates)

Dưới đây là danh sách các biểu mẫu chuyên biệt được thiết kế cho từng loại thực thể trong hệ thống. Nhấp vào liên kết tương đối dưới đây để sao chép trực tiếp biểu mẫu:

### 1. Phân Vùng Nghiệp Vụ & Thiết Kế (Human Layer)
*   👉 **[REQ-SRS-TEMPLATE.md]([HUMAN]_DOCUMENTATION_SYSTEM/00_[ALL]_META/templates/REQ-SRS-TEMPLATE.md)**: Đặc tả yêu cầu phần mềm chi tiết (SRS, luồng Happy Path, Business Rules, Edge Cases).
*   👉 **[API-BE-TEMPLATE.md]([HUMAN]_DOCUMENTATION_SYSTEM/00_[ALL]_META/templates/API-BE-TEMPLATE.md)**: Hợp đồng API Backend (Method, Path, Request/Response Specs).
*   👉 **[DB-DDL-TEMPLATE.md]([HUMAN]_DOCUMENTATION_SYSTEM/00_[ALL]_META/templates/DB-DDL-TEMPLATE.md)**: Đặc tả thiết kế bảng cơ sở dữ liệu (Database Schema, Indexes, Foreign Keys).
*   👉 **[QA-TC-TEMPLATE.md]([HUMAN]_DOCUMENTATION_SYSTEM/00_[ALL]_META/templates/QA-TC-TEMPLATE.md)**: Kịch bản kiểm thử (Pre-conditions, Test Steps, Expected Results).

### 2. Phân Vùng Vận Hành & Hạ Tầng (Ops & Finance)
*   👉 **[INC-OPS-TEMPLATE.md]([HUMAN]_DOCUMENTATION_SYSTEM/00_[ALL]_META/templates/INC-OPS-TEMPLATE.md)**: Báo cáo sự cố vận hành và phân tích nguyên nhân gốc rễ (Root Cause Analysis - RCA).
*   👉 **[FIN-COST-TEMPLATE.md]([HUMAN]_DOCUMENTATION_SYSTEM/00_[ALL]_META/templates/FIN-COST-TEMPLATE.md)**: Dự toán và phân tích chi phí tài chính hạ tầng máy chủ (CAPEX/OPEX, Vendor, Cloud Cost).

### 3. Phân Vùng Quyết Định Kiến Trúc (Architecture Decision)
*   👉 **[ADR-TEMPLATE.md]([HUMAN]_DOCUMENTATION_SYSTEM/00_[ALL]_META/templates/ADR-TEMPLATE.md)**: Nhật ký ghi nhận quyết định kiến trúc quan trọng sử dụng cây lập luận (Reasoning Tree).

---
*Lưu ý: Để tìm hiểu cách phân loại các thực thể tri thức hợp lệ trong hệ thống, vui lòng đọc file [ENTITY_SCHEMA.md](ENTITY_SCHEMA.md) tại thư mục gốc.*

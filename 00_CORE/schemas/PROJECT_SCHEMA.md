# MDS vNext — Lược Đồ Ngữ Cảnh Dự Án (Project Schema)

Tài liệu này định nghĩa cấu trúc hồ sơ dữ liệu (Project Context Model) bắt buộc đối với một dự án chạy trên hệ điều hành kỹ nghệ MDS vNext.

## Cấu Trúc Hồ Sơ Dự Án (Project Profiles)

Mọi dự án hoạt động phải định nghĩa đầy đủ 3 cấu phần cốt lõi sau tại `30_PROJECTS/ACTIVE/`:

1.  **Project Brief (`PROJECT_BRIEF.md`)**:
    *   Tên dự án và mục tiêu chiến lược.
    *   Bảng ma trận RACI phân bổ nhân sự (Human & AI Agents).
    *   Phạm vi nghiệp vụ (In-scope) và các phần chưa thực hiện (Out-of-scope).
2.  **Business Context (`BUSINESS_CONTEXT.md`)**:
    *   Bối cảnh thị trường và chân dung khách hàng mục tiêu.
    *   Chỉ số đo lường hiệu quả (Key Metrics / KPIs).
    *   Phân tích bài toán ROI.
3.  **Constraints (`CONSTRAINTS.md`)**:
    *   *Ràng buộc Công nghệ*: Yêu cầu về Tech stack (ví dụ: Node.js, Postgres).
    *   *Ràng buộc Vận hành*: Ngân sách hạ tầng, SLA cam kết với khách hàng.
    *   *Ràng buộc Bảo mật*: Quy chuẩn GDPR, mã hóa dữ liệu.
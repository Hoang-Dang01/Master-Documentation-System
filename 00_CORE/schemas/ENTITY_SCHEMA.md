# MDS vNext — Lược Đồ Định Nghĩa Thực Thể (Entity Schema)

Tài liệu này định nghĩa phân loại các thực thể tri thức (Canonical Entities) trong đồ thị tri thức MDS vNext.

## Phân Nhóm Thực Thể (5 Cấu Phần Lõi)

```text
                               ┌── Yêu cầu nghiệp vụ (REQ)
         ┌── Nghiệp Vụ ────────┼── Quy tắc nghiệp vụ (BR)
         │                     └── Bối cảnh dự án (CTX)
         │
         │                     ┌── Điểm cuối API Contract (API)
         │                     ├── Cơ sở dữ liệu Schema (DB)
         ┌── Kỹ Thuật ─────────┼── Quyết định Kiến trúc (ADR)
         │                     └── Dịch vụ / Microservice (SRV)
         │
MDS ─────│                     ┌── Nhiệm vụ phát triển (TSK)
Entities │                     ├── Kịch bản kiểm thử (QA-TC)
         ├── Triển Khai ───────┼── Báo cáo lỗi (BUG)
         │                     └── Kế hoạch phát hành (REL)
         │
         │                     ┌── Sự cố vận hành (INC)
         │                     ├── Hướng dẫn vận hành (RUN)
         └── Vận Hành ─────────┴── Chi phí tài chính (FIN)
```

## Đặc Tả Các Thực Thể

1.  **Nghiệp Vụ**:
    *   `REQ` (Requirement Specification): Chi tiết chức năng. Ví dụ ID: `REQ-AUTH-001`.
    *   `BR` (Business Rule): Ràng buộc nghiệp vụ cứng. Ví dụ ID: `BR-AUTH-002`.
2.  **Kỹ Thuật**:
    *   `API` (API Contract): Tham số đầu vào/đầu ra và mã lỗi. Ví dụ ID: `API-AUTH-001`.
    *   `DB` (Database Schema): Thiết kế các bảng cơ sở dữ liệu. Ví dụ ID: `DB-AUTH-001`.
    *   `ADR` (Architecture Decision): Nhật ký quyết định thiết kế. Ví dụ ID: `ADR-DB-001`.
3.  **Triển Khai & Kiểm Thử**:
    *   `QA-TC` (Test Case): Kịch bản các bước kiểm thử. Ví dụ ID: `TC-AUTH-044`.
    *   `BUG` (Bug Report): Báo cáo lỗi kỹ thuật. Ví dụ ID: `BUG-2026-001`.
4.  **Vận Hành**:
    *   `INC` (Incident Report): Ghi nhận lỗi nóng và RCA. Ví dụ ID: `INC-PROD-002`.
    *   `FIN` (Financial Cost): Dự toán chi phí. Ví dụ ID: `FIN-INFRA-001`.
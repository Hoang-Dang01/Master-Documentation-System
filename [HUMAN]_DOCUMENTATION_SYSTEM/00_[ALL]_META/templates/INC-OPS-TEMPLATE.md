---
id: INC-[ENV]-[NUM]
name: [Tên Sự Cố]
owner: OPS
status: DRAFT
version: 1.0
created_at: [YYYY-MM-DD]
updated_at: [YYYY-MM-DD]
links:
  depends_on:
    - [API-ID]
    - [DB-ID]
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
---

# Incident & RCA Report: [Tên Sự Cố]

*Kế thừa từ: [BASE-TEMPLATE](BASE-TEMPLATE.md)*

## 1. Mô Tả Sự Cố & Tác Động (Incident Description & Impact)
- **Thời gian xảy ra**: [YYYY-MM-DD HH:MM:SS]
- **Môi trường**: [Staging | Production]
- **Mức độ ảnh hưởng**: [P1 (Khẩn cấp) | P2 (Cao) | P3 (Trung bình) | P4 (Thấp)]
- **Mô tả**: [Mô tả chi tiết hiện tượng sự cố xảy ra và phạm vi người dùng bị tác động]

## 2. Phân Tích Nguyên Nhân Gốc Rễ (Root Cause Analysis - RCA)
[Phân tích chuyên sâu tại sao lỗi xảy ra, sử dụng kỹ thuật 5 Whys hoặc phân tích log/trace]

## 3. Kế Hoạch Khắc Phục (Action Items)
- **Giải pháp tạm thời (Workaround)**: [Cách thức xử lý nóng để khôi phục dịch vụ]
- **Giải pháp triệt để (Permanent Fix)**: [Các hành động code, cấu hình cần sửa để tránh tái diễn]

## 4. AI Agent Usage
- **Write**: Được ghi nhận bởi **SRE/Ops Agent**.
- **Read**: Được đọc bởi **SA/Architect Agents** để thiết kế lại hệ thống chống lỗi lan truyền.

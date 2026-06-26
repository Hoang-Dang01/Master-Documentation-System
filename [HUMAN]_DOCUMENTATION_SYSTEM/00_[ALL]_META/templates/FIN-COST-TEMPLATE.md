---
id: FIN-[TYPE]-[NUM]
name: [Tên Thành Phần Chi Phí]
owner: PM
status: DRAFT
version: 1.0
created_at: [YYYY-MM-DD]
updated_at: [YYYY-MM-DD]
links:
  depends_on:
    - [DB-ID | AST-ID]
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
---

# Financial Cost Entity: [Tên Khoản Chi Phí]

*Kế thừa từ: [BASE-TEMPLATE](BASE-TEMPLATE.md)*

## 1. Phân Loại Tài Chính (Financial Category)
- **Phân loại**: [CAPEX (Chi phí đầu tư cố định) | OPEX (Chi phí vận hành định kỳ)]
- **Nhóm chi phí**: [Hạ tầng Cloud | Bản quyền Phần mềm | Nhân sự | Thiết bị ngoại vi]

## 2. Chi Tiết Dự Toán (Financial Estimation)
- **Đơn vị cung cấp (Vendor)**: [Ví dụ: Amazon Web Services, Cloudflare, OpenAI]
- **Chu kỳ thanh toán**: [Một lần | Hàng tháng | Hàng năm]
- **Số tiền dự toán**: [Số tiền bằng USD/VND]
- **Mục tiêu phân bổ**: [Khoản chi này phục vụ trực tiếp cho phân hệ/thiết bị nào trong hệ thống]

## 3. AI Agent Usage
- **Write**: Được khai báo bởi **PM Agent** hoặc **DevOps Agent**.
- **Read**: Được sử dụng bởi **PM Agent** để tính toán tổng chi phí sở hữu (TCO) và phân tích ROI cho Ban giám đốc.

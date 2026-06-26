---
id: QA-TC-[NUM]
name: [Tên Kịch Bản Kiểm Thử]
owner: QA
status: DRAFT
version: 1.0
created_at: [YYYY-MM-DD]
updated_at: [YYYY-MM-DD]
links:
  depends_on:
    - [REQ-ID]
    - [API-ID]
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
---

# Test Case: [Tên Kịch Bản Kiểm Thử]

*Kế thừa từ: [BASE-TEMPLATE](BASE-TEMPLATE.md)*

## 1. Tiền Điều Kiện (Pre-conditions)
[Các điều kiện môi trường hoặc trạng thái dữ liệu bắt buộc phải có trước khi thực hiện test]

## 2. Các Bước Thực Hiện (Test Steps)
1.  [Bước 1]
2.  [Bước 2]
3.  [Bước 3]

## 3. Kết Quả Mong Đợi (Expected Result)
[Trạng thái phần mềm, dữ liệu database hoặc API response mong đợi sau khi thực hiện xong các bước]

## 4. AI Agent Usage
- **Write**: Được thiết kế bởi **QA Agent**.
- **Read**: Được sử dụng bởi **QA Agent** để chạy các bài test tự động (Selenium/Cypress/Playwright) và **Backend/Frontend Agent** để tự kiểm tra chất lượng code (self-test).

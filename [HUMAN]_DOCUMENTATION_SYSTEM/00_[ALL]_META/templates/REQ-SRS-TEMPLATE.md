---
id: REQ-[MODULE]-[NUM]
name: [Tên Yêu Cầu]
owner: SA
status: DRAFT
version: 1.0
created_at: [YYYY-MM-DD]
updated_at: [YYYY-MM-DD]
links:
  depends_on:
    - BASE-TEMPLATE
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
priority: [LOW | MEDIUM | HIGH | CRITICAL]
---

# Software Requirement Specification: [Tên Yêu Cầu]

*Kế thừa từ: [BASE-TEMPLATE](BASE-TEMPLATE.md)*

## 1. Tóm Tắt Nghiệp Vụ (Summary)
[Mô tả ngắn gọn về mục đích, đối tượng sử dụng và giá trị của yêu cầu nghiệp vụ này]

## 2. Luồng Nghiệp Vụ Chính (Happy Path)
[Chi tiết các bước thực hiện tuần tự khi người dùng thao tác thành công]

## 3. Quy Tắc Nghiệp Vụ & Logic Ràng Buộc (Business Rules)
[Các điều kiện, công thức tính toán hoặc ràng buộc logic cứng buộc hệ thống phải tuân theo]

## 4. Các Trường Hợp Biên & Luồng Ngoại Lệ (Edge Cases & Exceptions)
- **Ngoại lệ 1**: [Tên ngoại lệ] -> [Cách thức xử lý hệ thống]
- **Trường hợp biên 2**: [Tên trường hợp biên] -> [Cách thức xử lý hệ thống]

## 5. AI Agent Usage
- **Write**: Được soạn thảo và cập nhật bởi **SA Agent**.
- **Read**: Được sử dụng bởi **Backend Agent** (sinh code/DB), **Frontend Agent** (dựng UI/flow) và **QA Agent** (viết kịch bản kiểm thử).

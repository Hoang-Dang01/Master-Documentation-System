---
id: DB-[MODULE]-[NUM]
name: [Tên Bảng Dữ Liệu]
owner: DBA
status: DRAFT
version: 1.0
created_at: [YYYY-MM-DD]
updated_at: [YYYY-MM-DD]
links:
  depends_on:
    - [REQ-ID]
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
---

# Database Table Schema: [Tên Bảng]

*Kế thừa từ: [BASE-TEMPLATE](BASE-TEMPLATE.md)*

## 1. Cấu Trúc Bảng Dữ Liệu (Table Definition)
- **Hệ quản trị CSDL**: [PostgreSQL | MySQL | MongoDB]
- **Tên bảng vật lý**: `[table_name]`

| Tên Cột (Column) | Kiểu Dữ Liệu (Type) | Ràng Buộc (Constraints) | Mô Tả (Description) |
| :--- | :--- | :--- | :--- |
| `id` | `UUID / INT` | `PRIMARY KEY` | Mã khóa chính duy nhất |

## 2. Chỉ Mục & Khóa Ngoại (Indexes & Foreign Keys)
- **Khóa ngoại (Foreign Keys)**: `[column_name]` liên kết sang bảng `[target_table]([target_column])`.
- **Chỉ mục (Indexes)**: Danh sách các chỉ mục phục vụ truy vấn tải cao.

## 3. AI Agent Usage
- **Write**: Được thiết kế bởi **DBA Agent** hoặc **Backend Agent**.
- **Read**: Được nạp vào **Backend Agent** để viết các câu lệnh di chuyển dữ liệu (Migrations/DDL) và ORM code.

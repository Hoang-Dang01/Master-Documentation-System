---
id: API-[MODULE]-[NUM]
name: [Tên API Endpoint]
owner: BE
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

# API Contract: [METHOD] [PATH]

*Kế thừa từ: [BASE-TEMPLATE](BASE-TEMPLATE.md)*

## 1. Thông Tin Chung (General Info)
- **Phương thức (Method)**: [GET | POST | PUT | DELETE | PATCH]
- **Đường dẫn (Path)**: `/api/v1/[resource-path]`
- **Xác thực (Authentication)**: [Yes (Bearer JWT) | No]

## 2. Dữ Liệu Yêu Cầu (Request Specs)
### Headers:
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

### Body / Query Parameters:
```json
{
  "[field_name]": "[data_type]"
}
```

## 3. Dữ Liệu Phản Hồi (Response Specs)
### Thành công (200 OK / 201 Created):
```json
{
  "success": true,
  "data": {}
}
```
### Thất bại (400 Bad Request / 401 Unauthorized / 500 Server Error):
```json
{
  "success": false,
  "error": {
    "code": "[MÃ_LỖI]",
    "message": "[Thông điệp lỗi chi tiết]"
  }
}
```

## 4. AI Agent Usage
- **Write**: Được soạn thảo và cập nhật bởi **Backend Agent**.
- **Read**: Được sử dụng bởi **Frontend Agent** (gọi API) và **QA Agent** (viết kịch bản kiểm thử API).

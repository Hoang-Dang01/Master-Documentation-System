# MDS vNext — Quy Tắc Liên Kết Đồ Thị (Relationship Rules)

Đồ thị liên kết vết (Traceability Graph) giúp phân tích tác động thay đổi nhanh chóng.

## Ma Trận Quan Hệ Cho Phép (Allowed Edges)

| Từ Thực Thể (From) | Quan Hệ (Edge) | Đến Thực Thể (To) | Chi Tiết Nghiệp Vụ |
| :--- | :--- | :--- | :--- |
| **`REQ`** (Yêu cầu) | `depends_on` | `REQ` | Phụ thuộc yêu cầu nghiệp vụ khác |
| **`REQ`** (Yêu cầu) | `implements` | `API`, `DB` | Yêu cầu được hiện thực hóa qua API, DB |
| **`REQ`** (Yêu cầu) | `tested_by` | `QA-TC` | Yêu cầu được kiểm chứng bởi Test Case |
| **`API`** (API Contract) | `depends_on` | `REQ`, `API` | API phụ thuộc yêu cầu hoặc API khác |
| **`DB`** (DB Schema) | `depends_on` | `REQ`, `DB` | DB Table phụ thuộc yêu cầu hoặc Table khác |
| **`QA-TC`** (Test Case) | `depends_on` | `REQ`, `API`, `DB` | Kịch bản kiểm thử cho các thành phần trên |
| **`BUG`** (Bug Report) | `broken_by` | `QA-TC`, `REQ`, `API`, `DB` | Lỗi làm hỏng hoạt động của thành phần tương ứng |
| **`FIN`** (Financial Cost)| `impacts_cost` | `DB`, `AST` | Chi phí phát sinh từ database hoặc tài sản hạ tầng |
| **`ADR`** (Decisions) | `depends_on` | `REQ`, `ADR` | Quyết định kỹ thuật dựa trên yêu cầu/quyết định khác |

*Lưu ý: Hướng liên kết phải luôn đi từ Thực thể bậc cao xuống Thực thể bậc thấp (Ví dụ: `REQ` -> `implements` -> `API`). Nghiêm cấm liên kết ngược để tránh tạo vòng lặp đồ thị.*
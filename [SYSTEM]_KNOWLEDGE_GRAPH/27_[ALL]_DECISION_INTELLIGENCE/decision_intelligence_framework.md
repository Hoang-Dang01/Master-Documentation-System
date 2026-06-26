# Decision Intelligence Framework

Khung quy chuẩn phân tích quyết định đa chiều trong dự án. Mọi quyết định kỹ thuật lớn (ADR) hoặc thay đổi nghiệp vụ quan trọng bắt buộc phải tuân theo cấu trúc cây lập luận (Reasoning Tree):

```text
[Problem Statement] (Vấn đề cần giải quyết)
       │
       ├─► [Option A] ──► [Trade-offs & Risks]
       ├─► [Option B] ──► [Trade-offs & Risks]
       └─► [Option C] ──► [Trade-offs & Risks]
               │
               ▼
       [Final Decision] (Lựa chọn cuối cùng & Lý do)
```

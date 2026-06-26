---
id: DB-DDL-TEMPLATE
name: Database DDL Schema Template

artifact_type: AST
domain: META

owner: ALL
status: APPROVED
version: 2.0.0

tags:
  - system
  - template
  - database
  - ddl
  - schema

created_at: 2026-06-26
updated_at: 2026-06-26

last_updated_by: Human-Chief-Architect
change_summary: v2 — applied TGE model, dual-layer pattern, extended metadata fields, added migration/index/lifecycle sections

links:
  depends_on:
    - BASE-TEMPLATE
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
  references:
    - DB_GUIDE
  supersedes: []
---

# Database DDL Schema Template

> **Guide**: [DB_GUIDE.md](../guides/DB_GUIDE.md) — field definitions, column conventions, index strategy, lifecycle rules.
> **Example**: [DB-EXAMPLE.md](../examples/DB-EXAMPLE.md) — gold standard reference.

---

## Blueprint (Copy-Paste Below This Line)

```yaml
---
id: DB-[DOMAIN]-[NUM]
name: [Tên Bảng Dữ Liệu]

artifact_type: DB
domain: [DOMAIN_NAME]

owner: [DBA|BE]

status: [DRAFT|REVIEW|APPROVED|DEPRECATED|ARCHIVED]

version: 1.0.0

tags:
  - [tag1]
  - [tag2]

created_at: [YYYY-MM-DD]
updated_at: [YYYY-MM-DD]

last_updated_by: [Actor]
change_summary: [Short summary of this version]

links:
  depends_on:
    - [REQ-ID]
  implements: []
  tested_by:
    - [TC-ID]
  broken_by: []
  impacts_cost: []
  references: []
  supersedes: []
---
```

# Database Schema: [Tên Bảng]

> Extends: [BASE-TEMPLATE](BASE-TEMPLATE.md) | See [DB_GUIDE.md](../guides/DB_GUIDE.md)

---

## 1. Table Definition

- **DBMS**: [PostgreSQL | MySQL | MongoDB]
- **Physical Table Name**: `[table_name]`
- **Description**: [Mô tả ngắn gọn mục đích bảng này]

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Khóa chính duy nhất |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Thời điểm tạo record |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Thời điểm cập nhật cuối |
| `deleted_at` | `TIMESTAMPTZ` | `NULLABLE` | Soft delete timestamp |

---

## 2. Indexes & Foreign Keys

### Foreign Keys
| Column | References | On Delete |
| :--- | :--- | :--- |
| `[fk_column]` | `[target_table]([target_column])` | `[CASCADE\|RESTRICT\|SET NULL]` |

### Indexes
| Index Name | Columns | Type | Purpose |
| :--- | :--- | :--- | :--- |
| `idx_[table]_[col]` | `[column]` | `BTREE` | [Mô tả tại sao cần index này] |

---

## 3. Migration Notes

- **Migration File**: `[YYYYMMDD_HHMMSS]_create_[table_name].sql`
- **Rollback Strategy**: [DROP TABLE | Reverse migration script]
- **Seed Data Required**: [Yes / No — mô tả nếu Yes]

---

## 4. Data Lifecycle & Retention

- **Soft Delete**: [Yes — via `deleted_at` | No]
- **Retention Policy**: [Xóa sau N ngày | Lưu vĩnh viễn | Archive sau N tháng]
- **PII Fields**: [Liệt kê cột chứa PII nếu có, ví dụ: `email`, `phone`]

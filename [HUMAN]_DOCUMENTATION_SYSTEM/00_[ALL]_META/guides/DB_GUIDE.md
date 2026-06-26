# DB_GUIDE — Database Schema Reference

> **Artifact Type**: Guide
> **Applies to**: All DB artifacts
> **Template**: [DB-DDL-TEMPLATE.md](../templates/DB-DDL-TEMPLATE.md)
> **Example**: [DB-EXAMPLE.md](../examples/DB-EXAMPLE.md)
> **Version**: 1.0.0

---

## 1. Mục đích (Purpose)

`DB-DDL` artifact mô tả cấu trúc vật lý của một **database table** trong hệ thống.

Đây là nguồn truth duy nhất cho:
- DBA / Backend Agent khi viết migration scripts
- Backend Agent khi viết ORM models
- QA Agent khi thiết kế test data
- Frontend Agent khi cần hiểu data shape

**Rule**: Mỗi bảng = 1 file DB-DDL riêng biệt.

---

## 2. Khi Nào Tạo DB Artifact

Tạo `DB-DDL` khi:

| Tình huống | Ví dụ |
|---|---|
| Thiết kế bảng mới | New feature cần persist data |
| Thay đổi schema lớn | Thêm/xóa column, đổi type |
| Breaking migration | Rename column, change NOT NULL |
| Review security | Kiểm tra PII fields, audit columns |

**Không cần** tạo DB artifact cho:
- View / Materialized View nhỏ không quan trọng
- Temp tables trong stored procedures
- Migration fix typo không ảnh hưởng schema

---

## 3. Field Reference

### 3.1 Metadata (Base Fields)

Xem [BASE_GUIDE.md](BASE_GUIDE.md) cho giải thích đầy đủ các base fields.

Fields riêng của DB artifact:

| Field | Valid Values | Note |
|---|---|---|
| `artifact_type` | `DB` (fixed) | Luôn là `DB` cho tất cả DB artifacts |
| `owner` | `DBA`, `BE` | DBA cho production schema, BE cho service-owned tables |

---

## 4. Table Definition — Column Conventions

### 4.1 Standard Audit Columns (Bắt buộc)

Mọi bảng đều phải có:

| Column | Type | Constraints | Lý do |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Globally unique, không lộ sequence |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Audit — khi nào tạo |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Audit — khi nào sửa cuối |
| `deleted_at` | `TIMESTAMPTZ` | `NULLABLE` | Soft delete support |

> **Why UUID over INT/BIGINT?**
> INT sequential ID lộ business volume (attacker biết có bao nhiêu user). UUID an toàn hơn và support distributed systems.

> **Why TIMESTAMPTZ over TIMESTAMP?**
> TIMESTAMP không chứa timezone — nguy hiểm khi deploy multi-region. TIMESTAMPTZ luôn store UTC.

---

### 4.2 Column Type Conventions

| Use Case | Recommended Type | Avoid |
|---|---|---|
| Primary key | `UUID` | `INT`, `SERIAL` |
| Short text (≤255) | `VARCHAR(255)` | `TEXT` nếu có max length |
| Long text | `TEXT` | `VARCHAR(10000)` |
| Boolean | `BOOLEAN` | `TINYINT(1)`, `CHAR(1)` |
| Money / Price | `NUMERIC(19,4)` | `FLOAT`, `DOUBLE` |
| Timestamp | `TIMESTAMPTZ` | `TIMESTAMP`, `DATETIME` |
| JSON payload | `JSONB` (PostgreSQL) | `JSON`, `TEXT` |
| Enum values | `VARCHAR` + CHECK constraint | DB-level ENUM type |
| Foreign key | Same type as referenced PK (`UUID`) | Mismatched types |

---

### 4.3 Nullable Convention

| Rule | Detail |
|---|---|
| Default = NOT NULL | Luôn khai báo `NOT NULL` trừ khi có lý do rõ ràng |
| Nullable = optional relationship | Dùng `NULLABLE` cho FK khi relationship là optional |
| Soft delete = `deleted_at NULLABLE` | NULL = alive, NOT NULL = deleted |

---

## 5. Indexes & Foreign Keys

### 5.1 Khi nào cần Index?

| Pattern | Index cần thêm |
|---|---|
| Query theo FK column | `idx_[table]_[fk_col]` |
| Query theo status/type thường xuyên | Partial index: `WHERE status = 'ACTIVE'` |
| Unique business constraint | `UNIQUE INDEX` |
| Full-text search | `GIN index` (PostgreSQL) |
| Sort by created_at | `idx_[table]_created_at DESC` |

> **Rule**: Không add index vô tội vạ. Mỗi index = 1 lý do cụ thể (ghi vào cột Purpose).

### 5.2 Foreign Key — On Delete Strategy

| Strategy | Dùng khi |
|---|---|
| `CASCADE` | Child records không có nghĩa nếu parent bị xóa |
| `RESTRICT` | Không cho xóa parent nếu còn child (bảo vệ dữ liệu) |
| `SET NULL` | Child vẫn tồn tại nhưng FK = NULL (optional relationship) |

---

## 6. Migration Notes

### 6.1 Migration Naming Convention

```
[YYYYMMDD_HHMMSS]_[action]_[table_name].sql
```

Ví dụ:
```
20260626_143000_create_sessions.sql
20260701_090000_add_column_sessions_host_id.sql
20260710_120000_drop_index_sessions_status.sql
```

### 6.2 Migration Safety Rules

| Rule | Detail |
|---|---|
| Luôn có rollback | Mọi migration phải có DOWN script |
| Không drop column ngay | Deprecate first → xóa sau 2 sprint |
| Không rename column trực tiếp | Thêm column mới → migrate data → drop column cũ |
| Test on staging first | Không apply thẳng lên production |

---

## 7. Data Lifecycle & Retention

### 7.1 Soft Delete Pattern

```sql
-- Query records alive
SELECT * FROM sessions WHERE deleted_at IS NULL;

-- Soft delete
UPDATE sessions SET deleted_at = NOW() WHERE id = '[uuid]';

-- Hard delete (chỉ khi retention expired)
DELETE FROM sessions WHERE deleted_at < NOW() - INTERVAL '90 days';
```

### 7.2 PII Fields

Bất kỳ column nào chứa thông tin cá nhân phải được khai báo trong section `Data Lifecycle`:

| PII Type | Ví dụ columns | Treatment |
|---|---|---|
| Direct identifier | `email`, `phone`, `national_id` | Encrypt at rest |
| Quasi-identifier | `full_name`, `date_of_birth` | Mask in logs |
| Behavioral data | `ip_address`, `device_id` | Anonymize after retention |

---

## 8. AI Agent Usage

| Role | Action |
|---|---|
| **DBA Agent / BE Agent (Write)** | Tạo DB artifact từ template. Fill column list đầy đủ trước khi viết migration. |
| **BE Agent (Read)** | Load DB artifact để generate ORM model và migration script. Validate column types trước khi code. |
| **QA Agent (Read)** | Dùng Table Definition để generate test fixtures và seed data. |
| **SA Agent (Read)** | Cross-reference với REQ artifact để verify đủ columns hỗ trợ business rules. |

---

## 9. Good vs Bad Examples

### ❌ Bad — Thiếu audit columns, type không chuẩn

```yaml
| user_id | INT | PRIMARY KEY | |
| name    | VARCHAR | |  |
| active  | TINYINT | | |
| ts      | TIMESTAMP | | |
```

**Vấn đề**: INT PK (lộ volume), VARCHAR không có length, TINYINT thay vì BOOLEAN, TIMESTAMP không có timezone.

---

### ✅ Good — Chuẩn mực

```yaml
| id         | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid() | |
| user_name  | VARCHAR(100) | NOT NULL                               | |
| is_active  | BOOLEAN      | NOT NULL, DEFAULT TRUE                 | |
| created_at | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                | |
| deleted_at | TIMESTAMPTZ  | NULLABLE                               | Soft delete |
```

# DB-EXAMPLE — Gold Standard Database Schema Reference

> **Type**: Example (Level 3 — TGE Model)
> **Template**: [DB-DDL-TEMPLATE.md](../templates/DB-DDL-TEMPLATE.md)
> **Guide**: [DB_GUIDE.md](../guides/DB_GUIDE.md)
> **Version**: 1.0.0

---

## About This File

Đây là **Gold Standard Example** cho DB-DDL artifacts trong MDS.

Scenario: Bảng `sessions` — lưu trữ phiên học/meeting của hệ thống.

---

## Part 1 — ✅ Good Example

### Metadata

```yaml
---
id: DB-MEETING-001
name: Meeting Sessions Table

artifact_type: DB
domain: MEETING

owner: BE
status: APPROVED
version: 1.1.0

tags:
  - meeting
  - session
  - realtime

created_at: 2026-06-01
updated_at: 2026-06-26

last_updated_by: Backend-Agent
change_summary: Added host_id FK and session_type column

links:
  depends_on:
    - REQ-MEETING-001
    - REQ-MEETING-002

  implements:
    - MOD-MEETING-001

  tested_by:
    - TC-MEETING-005
    - TC-MEETING-006

  broken_by: []

  impacts_cost:
    - FIN-INFRA-001

  references:
    - DEC-INFRA-001

  supersedes:
    - DB-MEETING-000
---
```

### Table Definition

- **DBMS**: PostgreSQL 15
- **Physical Table Name**: `sessions`
- **Description**: Lưu trữ toàn bộ thông tin phiên meeting — từ lúc tạo đến lúc kết thúc.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Khóa chính duy nhất |
| `title` | `VARCHAR(255)` | `NOT NULL` | Tên phiên meeting |
| `host_id` | `UUID` | `NOT NULL, FK → users(id)` | ID người tổ chức |
| `session_type` | `VARCHAR(50)` | `NOT NULL, CHECK (session_type IN ('LIVE','RECORDED','HYBRID'))` | Loại phiên |
| `status` | `VARCHAR(20)` | `NOT NULL, DEFAULT 'SCHEDULED'` | Trạng thái: SCHEDULED / LIVE / ENDED / CANCELLED |
| `max_participants` | `INT` | `NOT NULL, DEFAULT 100` | Giới hạn người tham gia |
| `started_at` | `TIMESTAMPTZ` | `NULLABLE` | Thời điểm bắt đầu thực tế |
| `ended_at` | `TIMESTAMPTZ` | `NULLABLE` | Thời điểm kết thúc thực tế |
| `metadata` | `JSONB` | `NULLABLE` | Dữ liệu mở rộng (recording URL, config...) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Audit — thời điểm tạo |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Audit — cập nhật cuối |
| `deleted_at` | `TIMESTAMPTZ` | `NULLABLE` | Soft delete timestamp |

### Indexes & Foreign Keys

**Foreign Keys**

| Column | References | On Delete |
| :--- | :--- | :--- |
| `host_id` | `users(id)` | `RESTRICT` |

**Indexes**

| Index Name | Columns | Type | Purpose |
| :--- | :--- | :--- | :--- |
| `idx_sessions_host_id` | `host_id` | `BTREE` | Query sessions by host |
| `idx_sessions_status` | `status` | `BTREE` | Filter active sessions |
| `idx_sessions_created_at` | `created_at DESC` | `BTREE` | Sort by newest |
| `idx_sessions_alive` | `id WHERE deleted_at IS NULL` | `PARTIAL` | Exclude soft-deleted in most queries |

### Migration Notes

- **Migration File**: `20260601_090000_create_sessions.sql`
- **Rollback Strategy**: `DROP TABLE sessions CASCADE;`
- **Seed Data Required**: Yes — 3 sample sessions for development env

### Data Lifecycle & Retention

- **Soft Delete**: Yes — via `deleted_at`
- **Retention Policy**: Archive sau 12 tháng kể từ `ended_at`. Hard delete sau 36 tháng.
- **PII Fields**: Không có PII trực tiếp — `host_id` là FK reference, không lưu PII inline.

---

## Part 2 — Why This Is Good

| Quyết định | Lý do |
|---|---|
| `UUID` cho PK | Không lộ business volume, support distributed |
| `TIMESTAMPTZ` cho tất cả timestamps | Multi-timezone safe, luôn lưu UTC |
| `VARCHAR(50)` + `CHECK` cho `session_type` | Validate enum ở DB level, không dùng DB ENUM type (khó migrate) |
| `JSONB` cho `metadata` | Flexible extension point, PostgreSQL index support |
| `RESTRICT` cho `host_id` FK | Không cho xóa user nếu còn session |
| Partial index `WHERE deleted_at IS NULL` | Query performance — phần lớn queries không cần deleted records |
| Soft delete qua `deleted_at` | Recovery possible, audit trail intact |
| Cả 3 audit columns (`created_at`, `updated_at`, `deleted_at`) | Full lifecycle visibility |

---

## Part 3 — ❌ Bad Example

```sql
CREATE TABLE session (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR,
  host INT,
  type ENUM('live', 'recorded'),
  active TINYINT(1),
  created TIMESTAMP,
  data TEXT
);
```

### Phân tích lỗi

| Vấn đề | Chi tiết | Fix |
|---|---|---|
| `INT AUTO_INCREMENT` PK | Lộ volume (attacker thấy session #12345 = có 12345 sessions) | `UUID DEFAULT gen_random_uuid()` |
| `VARCHAR` không có length | Sẽ bị DB default (255 hoặc 65535 tùy DB) | Khai báo rõ `VARCHAR(255)` |
| `host INT` | FK type sai nếu users.id là UUID | `host_id UUID` |
| `ENUM` type | Cực kỳ khó migrate sau (cần `ALTER TABLE`) | `VARCHAR(50) + CHECK constraint` |
| `TINYINT(1)` | MySQL-ism, không portable | `BOOLEAN` |
| `TIMESTAMP` | Không timezone — nguy hiểm multi-region | `TIMESTAMPTZ` |
| `TEXT` cho JSON | Không index được, không validate structure | `JSONB` |
| Thiếu `updated_at`, `deleted_at` | Không có audit trail, không có soft delete | Thêm standard audit columns |
| Tên bảng singular `session` | Convention inconsistency | Plural `sessions` |

---

## Part 4 — Common Mistakes

### Mistake 1 — Không có index cho FK column

```sql
-- ❌ Wrong: host_id là FK nhưng không có index
ALTER TABLE sessions ADD CONSTRAINT fk_host FOREIGN KEY (host_id) REFERENCES users(id);
-- Không có CREATE INDEX idx_sessions_host_id
```

**Vấn đề**: Mỗi JOIN query theo host_id sẽ full table scan.

```sql
-- ✅ Correct
CREATE INDEX idx_sessions_host_id ON sessions(host_id);
```

---

### Mistake 2 — Hard delete thay vì soft delete

```sql
-- ❌ Wrong
DELETE FROM sessions WHERE id = '[uuid]';
```

**Vấn đề**: Mất audit trail. Không recovery được.

```sql
-- ✅ Correct
UPDATE sessions SET deleted_at = NOW() WHERE id = '[uuid]';
```

---

### Mistake 3 — Store PII inline thay vì FK

```sql
-- ❌ Wrong
host_email VARCHAR(255),  -- lưu email trực tiếp
host_name  VARCHAR(100),  -- lưu tên trực tiếp
```

**Vấn đề**: PII bị duplicate, khó GDPR compliance.

```sql
-- ✅ Correct
host_id UUID NOT NULL REFERENCES users(id),  -- chỉ link, không copy PII
```

---

### Mistake 4 — Thiếu `updated_at` trigger

```sql
-- ❌ Wrong: khai báo updated_at nhưng không auto-update
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- Không có trigger → updated_at luôn = created_at
```

```sql
-- ✅ Correct: thêm trigger (PostgreSQL)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sessions_updated_at
BEFORE UPDATE ON sessions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

### Mistake 5 — Version không bump khi thêm column

```
# DB-MEETING-001 v1.0.0 — original schema
# Thêm column host_id
# Lưu lại: v1.0.0  ← ❌ không bump
```

**Rule**: Thêm column = MINOR bump (`1.0.0` → `1.1.0`). Breaking change = MAJOR bump.

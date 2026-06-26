# BASE_GUIDE — Canonical Metadata Reference

> **Artifact Type**: Guide
> **Applies to**: All MDS artifacts
> **Template**: [BASE-TEMPLATE.md](../templates/BASE-TEMPLATE.md)
> **Version**: 1.0.0

---

## 1. Mục đích (Purpose)

`BASE-TEMPLATE` là **DNA của toàn bộ MDS**. Mọi specialized template (REQ, ADR, API, DB, QA...) đều kế thừa cấu trúc metadata này.

Nếu BASE sai → toàn bộ downstream bị lệch theo.

Guide này giải thích:
- Ý nghĩa từng trường metadata
- Các giá trị hợp lệ (valid values)
- Semantics của Links Graph
- Lifecycle của một artifact
- Audit trail

---

## 2. Giải Thích Các Trường Metadata (Field Reference)

### 2.1 Identity Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✅ | Mã định danh duy nhất toàn cầu (globally unique). Format: `[TYPE]-[DOMAIN]-[NUM]`. Ví dụ: `REQ-AUTH-001`, `API-USER-002`. |
| `name` | `string` | ✅ | Tên hiển thị ngắn gọn, dễ đọc. Ví dụ: `User Login Flow`. |

**Rule**: `id` phải unique trong toàn bộ MDS. Linter (`detect_drift.js`) sẽ phát hiện duplicate ID và block commit.

---

### 2.2 Classification Fields

| Field | Type | Required | Valid Values |
|---|---|---|---|
| `artifact_type` | `enum` | ✅ | Xem bảng Artifact Types bên dưới |
| `domain` | `string` | ✅ | Domain nghiệp vụ. Ví dụ: `AUTH`, `MEETING`, `BILLING`, `ATTENDANCE`. |
| `tags` | `list[string]` | ⬜ | Free-form tags phục vụ search và filtering. |

#### Artifact Types

| Type | Ý nghĩa |
|---|---|
| `REQ` | Software Requirement Specification |
| `ADR` | Architectural Decision Record |
| `API` | API Specification |
| `DB` | Database Schema (DDL) |
| `TC` | Test Case |
| `BUG` | Bug Report |
| `INC` | Incident Report |
| `FIN` | Financial / Cost artifact |
| `AST` | System Asset (generic) |
| `GUIDE` | Reference Guide / Manual |
| `TPL` | Template file |
| `EXM` | Example / Gold Standard |
| `REG` | Registry / Catalog |
| `POL` | Policy / Governance rule |
| `LOG` | Session Log / Changelog |

**Why `artifact_type`?**
AI agent không thể chỉ parse filename để biết file là loại gì — đặc biệt khi file bị move hoặc rename. Field này đảm bảo classification luôn ở trong file.

**Why `domain`?**
Phục vụ impact analysis:
- "Tất cả artifact thuộc domain AUTH bị ảnh hưởng bởi security incident này?"
- Linter và search tools dùng field này để group artifacts.

---

### 2.3 Ownership & Lifecycle Fields

| Field | Type | Required | Valid Values |
|---|---|---|---|
| `owner` | `enum` | ✅ | `ALL`, `PM`, `BA`, `SA`, `ARC`, `DBA`, `BE`, `FE`, `QA`, `DEVOPS`, `SRE`, `OPS` |
| `status` | `enum` | ✅ | Xem Lifecycle Diagram bên dưới |

> **Why no `AI` in owner?**
> `owner` = accountable actor. Khi có sự cố production, AI không chịu trách nhiệm — human chịu. Nếu muốn track AI involvement, dùng `last_updated_by: AI-Backend-Agent` thay vì `owner: AI`.

#### Lifecycle States

```
DRAFT → REVIEW → APPROVED → IN_PROGRESS → DEPRECATED → ARCHIVED
                                         ↘ BLOCKED
                                         ↘ NOT_APPLICABLE
```

| Status | Ý nghĩa |
|---|---|
| `DRAFT` | Đang soạn thảo, chưa review |
| `REVIEW` | Đang chờ review / phê duyệt |
| `APPROVED` | Đã được chấp thuận, có thể implement |
| `IN_PROGRESS` | Đang được implement |
| `BLOCKED` | Bị block bởi dependency chưa giải quyết |
| `DEPRECATED` | Đã lỗi thời, không dùng nữa nhưng còn lưu |
| `ARCHIVED` | Đã đóng hoàn toàn, chỉ đọc |
| `NOT_APPLICABLE` | Không áp dụng cho context này |

---

### 2.4 Versioning

| Field | Type | Required | Format |
|---|---|---|---|
| `version` | `string` | ✅ | SemVer: `MAJOR.MINOR.PATCH` |

**SemVer Convention trong MDS:**

| Thay đổi | Bump |
|---|---|
| Thêm/xóa field lớn, breaking change | `MAJOR` |
| Thêm section, mở rộng nội dung | `MINOR` |
| Fix lỗi nhỏ, typo, clarification | `PATCH` |

Ví dụ: `1.0.0` → `1.1.0` (thêm section) → `1.1.1` (fix typo) → `2.0.0` (restructure lớn).

---

### 2.5 Timestamps

| Field | Type | Required | Format |
|---|---|---|---|
| `created_at` | `date` | ✅ | `YYYY-MM-DD` |
| `updated_at` | `date` | ✅ | `YYYY-MM-DD` — phải update mỗi lần có thay đổi |

---

### 2.6 Audit Trail

| Field | Type | Required | Description |
|---|---|---|---|
| `last_updated_by` | `string` | ✅ | Actor thực hiện thay đổi cuối. Human role hoặc AI agent name. Ví dụ: `Human-Chief-Architect`, `AI-Backend-Agent`. |
| `change_summary` | `string` | ✅ | Tóm tắt ngắn gọn thay đổi của version hiện tại. Ví dụ: `Added observability section`. |

---

### 2.7 Review Gate

| Field | Type | Required | Description |
|---|---|---|---|
| `review_required_by` | `list[enum]` | ⬜ | Danh sách roles phải review artifact này trước khi approve. |

**Valid values**: `PM`, `BA`, `SA`, `ARC`, `DBA`, `BE`, `FE`, `QA`, `DEVOPS`, `SRE`, `OPS`

**Why this matters (solo engineer context)**:
Khi ông đang context-switch giữa nhiều roles (BA → BE → QA), field này nhắc nhở:
> "File này cần tui đọc lại bằng góc nhìn ARC trước khi APPROVE."

AI agent cũng dùng field này để know khi nào cần human review trước khi thực thi.

**Ví dụ per artifact type**:

| Artifact | review_required_by |
|---|---|
| ADR | `ARC`, `DEVOPS` |
| API | `BE`, `FE`, `QA` |
| REQ | `BA`, `SA` |
| DB | `DBA`, `BE` |
| TC | `QA`, `BE` |

**Why audit trail in metadata?**
Git log cho biết *ai commit*, nhưng không cho biết *ai là owner logic* của thay đổi đó (có thể human copy-paste từ AI output). `last_updated_by` capture điều này.

---

## 3. Mạng Lưới Liên Kết Động (Links Graph)

Mục `links` định nghĩa **graph quan hệ** giữa các artifacts trong MDS. Đây là cơ sở cho impact analysis và traceability.

### 3.1 Hard Links (Dependency)

| Field | Hướng | Ý nghĩa |
|---|---|---|
| `depends_on` | Outbound | Artifact này cần artifact kia mới hoạt động được |
| `implements` | Outbound | Artifact này hiện thực hóa yêu cầu/thiết kế từ artifact kia |
| `tested_by` | Inbound reference | Artifact này được validate bởi test case nào |
| `broken_by` | Inbound reference | Bug/Incident nào đang làm hỏng artifact này |
| `impacts_cost` | Outbound | Artifact này ảnh hưởng đến cost item nào |

### 3.2 Soft Links (Traceability)

| Field | Hướng | Ý nghĩa |
|---|---|---|
| `references` | Outbound (soft) | Artifact này đề cập / liên quan đến artifact kia — không phải dependency cứng |
| `supersedes` | Outbound | Artifact này thay thế (version cũ hơn của) artifact kia |

**Ví dụ `supersedes`:**
```yaml
# API-AUTH-002_LOGIN_v2.0.0.md
supersedes:
  - API-AUTH-001  # version 1.x đã deprecated
```

**Ví dụ `references`:**
```yaml
# ADR-INFRA-001_CHOOSE_DATABASE.md
references:
  - REQ-AUTH-001  # ADR này được ra vì requirement này
  - REQ-MEETING-003
```

---

## 4. AI Agent Usage

| Role | Action |
|---|---|
| **Any AI Agent (Write)** | Phải fill đầy đủ tất cả required fields. Không được để placeholder `[...]` trong file đã APPROVED. |
| **Any AI Agent (Read)** | Đọc `artifact_type` và `domain` để routing đúng context. Đọc `links` để build dependency graph trước khi thực hiện thay đổi. |
| **Linter (`detect_drift.js`)** | Validate `id` uniqueness, `version` format (SemVer), `status` valid values, orphan links. |

---

## 5. Good vs Bad Examples

### ❌ Bad — Placeholder còn sót, version sai

```yaml
---
id: [GLOBAL-UNIQUE-ID]
version: 1.0
status: APPROVED
last_updated_by: [Actor]
---
```

**Vấn đề**: `id` và `last_updated_by` còn placeholder. `version` không phải SemVer. Linter sẽ block.

---

### ✅ Good — Đầy đủ, chuẩn

```yaml
---
id: REQ-AUTH-001
name: User Login Flow
artifact_type: REQ
domain: AUTH
owner: SA
status: APPROVED
version: 1.2.0
tags:
  - auth
  - login
  - security
created_at: 2026-06-01
updated_at: 2026-06-26
last_updated_by: Human-Chief-Architect
change_summary: Added brute-force lockout rule
links:
  depends_on: []
  implements: []
  tested_by:
    - QA-TC-001
  broken_by: []
  impacts_cost: []
  references: []
  supersedes: []
---
```

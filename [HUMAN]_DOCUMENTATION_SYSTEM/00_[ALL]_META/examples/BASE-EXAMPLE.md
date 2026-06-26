# BASE-EXAMPLE — Gold Standard Metadata Reference

> **Type**: Example (Level 3 — TGE Model)
> **Template**: [BASE-TEMPLATE.md](../templates/BASE-TEMPLATE.md)
> **Guide**: [BASE_GUIDE.md](../guides/BASE_GUIDE.md)
> **Version**: 1.0.0

---

## About This File

Đây là **Gold Standard Example** cho BASE metadata trong MDS.

Mục đích:
- Human onboarding — đọc một lần, hiểu pattern ngay
- AI few-shot learning — AI dùng file này làm reference khi sinh artifact mới
- Validation reference — so sánh với linter output khi có lỗi

---

## Part 1 — ✅ Good Example

Một artifact đã fill hoàn chỉnh, đúng chuẩn.

```yaml
---
id: API-MEETING-001
name: Join Meeting Session

artifact_type: API
domain: MEETING

owner: BE
status: APPROVED
version: 1.2.0

tags:
  - meeting
  - realtime
  - livekit

created_at: 2026-06-01
updated_at: 2026-07-02

last_updated_by: Backend-Agent
change_summary: Added idempotency support for retry-safe join flow

links:
  depends_on:
    - REQ-MEETING-003
    - DB-SESSION-001

  implements:
    - MOD-MEETING-001

  tested_by:
    - TC-MEETING-011

  broken_by: []

  impacts_cost:
    - FIN-INFRA-002

  references:
    - DEC-MEDIA-001

  supersedes:
    - API-MEETING-000
---
```

---

## Part 2 — Why This Is Good

Annotation từng quyết định trong example trên.

| Field | Value | Lý do tốt |
|---|---|---|
| `id` | `API-MEETING-001` | Đúng format `[TYPE]-[DOMAIN]-[NUM]`. Unique, parseable. |
| `artifact_type` | `API` | Enum hợp lệ. AI routing rõ ràng — không cần parse filename. |
| `domain` | `MEETING` | Ngắn, uppercase, nghiệp vụ rõ. Hỗ trợ impact analysis theo domain. |
| `version` | `1.2.0` | Đúng SemVer `MAJOR.MINOR.PATCH`. Có MINOR bump = đã thêm section. |
| `tags` | `meeting`, `realtime`, `livekit` | Ngắn, lowercase, single-word/hyphen. Searchable. |
| `last_updated_by` | `Backend-Agent` | Audit trail rõ ràng — biết AI nào hay human nào sửa. |
| `change_summary` | Mô tả cụ thể thay đổi | Không viết chung chung `"update"` hay `"fix"`. |
| `depends_on` | List ID hợp lệ | Link bằng ID (`REQ-MEETING-003`), không phải filename hay URL. |
| `supersedes` | `API-MEETING-000` | Traceability rõ — version cũ đã deprecated, version mới kế thừa. |
| `broken_by` | `[]` | Empty = artifact đang healthy. Không bỏ field. |

---

## Part 3 — ❌ Bad Example

Đây là ví dụ **SAI**. Linter sẽ block, AI sẽ generate sai nếu học từ pattern này.

```yaml
---
id: meeting-api
name: join meeting

artifact_type: backend
domain: meeting service

owner: backend
status: active
version: final

tags:
  - api for meeting service to join classroom session
  - realtime video

created_at: 26/06/2026
updated_at: today

last_updated_by: me
change_summary: update

links:
  depends_on:
    - requirement about meeting
    - session table
---
```

### Phân tích lỗi

| Field | Giá trị sai | Vấn đề | Fix |
|---|---|---|---|
| `id` | `meeting-api` | Không đúng format `[TYPE]-[DOMAIN]-[NUM]`. Không unique. | `API-MEETING-001` |
| `artifact_type` | `backend` | Không phải enum hợp lệ. | `API` |
| `domain` | `meeting service` | Có space, lowercase. | `MEETING` |
| `owner` | `backend` | Không phải enum hợp lệ. | `BE` |
| `status` | `active` | Không phải enum hợp lệ. | `APPROVED` |
| `version` | `final` | Không phải SemVer. Linter block. | `1.0.0` |
| `tags` | Tag dài dòng | Tag quá verbose, không searchable. | `meeting`, `realtime` |
| `created_at` | `26/06/2026` | Sai format. Phải `YYYY-MM-DD`. | `2026-06-26` |
| `updated_at` | `today` | Không phải date. | `2026-06-26` |
| `last_updated_by` | `me` | Không identify được actor. | `Human-Chief-Architect` |
| `change_summary` | `update` | Quá chung chung. Vô nghĩa. | `Initial API design` |
| `depends_on` | Free text | Link phải là ID, không phải mô tả. | `REQ-MEETING-003` |

---

## Part 4 — Common Mistakes

### Mistake 1 — Link bằng text thay vì ID

```yaml
# ❌ Wrong
depends_on:
  - requirement about meeting
  - the session table in database
```

```yaml
# ✅ Correct
depends_on:
  - REQ-MEETING-003
  - DB-SESSION-001
```

**Lý do**: Linter validate orphan links bằng ID. Text link không resolve được.

---

### Mistake 2 — Tags quá dài hoặc quá vague

```yaml
# ❌ Wrong
tags:
  - this is an api for the meeting service
  - stuff
  - misc
```

```yaml
# ✅ Correct
tags:
  - meeting
  - realtime
  - livekit
  - websocket
```

**Rule**: Tag = 1 từ hoặc hyphenated. Lowercase. Meaningful.

---

### Mistake 3 — Để placeholder trong file APPROVED

```yaml
# ❌ Wrong — file status APPROVED nhưng vẫn còn placeholder
status: APPROVED
last_updated_by: [Actor]
change_summary: [Short summary]
```

**Rule**: File `status: APPROVED` = zero placeholder. Linter sẽ warn nếu detect `[...]` pattern trong APPROVED file.

---

### Mistake 4 — Bỏ qua `broken_by` và `impacts_cost`

```yaml
# ❌ Wrong — bỏ field
links:
  depends_on:
    - REQ-AUTH-001
```

```yaml
# ✅ Correct — giữ tất cả fields, empty nếu không có giá trị
links:
  depends_on:
    - REQ-AUTH-001
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
  references: []
  supersedes: []
```

**Lý do**: Bỏ field khiến linter không thể validate và AI downstream không biết field đó tồn tại.

---

### Mistake 5 — version không bump khi có thay đổi

```yaml
# File cũ: version: 1.0.0
# File sau khi edit: version: 1.0.0  ← ❌ quên bump
```

**Rule**: Mỗi lần `updated_at` thay đổi → `version` phải bump. Ít nhất là PATCH (`1.0.0` → `1.0.1`).

---

## TGE Model — Canonical Rule 5 v3

```
Level 1 — Template    → "Structure is what?"
Level 2 — Guide       → "Each field means what?"
Level 3 — Example     → "A real artifact looks like what?"
```

BASE Triad:
- [BASE-TEMPLATE.md](../templates/BASE-TEMPLATE.md) ✅
- [BASE_GUIDE.md](../guides/BASE_GUIDE.md) ✅
- [BASE-EXAMPLE.md](../examples/BASE-EXAMPLE.md) ✅ ← you are here

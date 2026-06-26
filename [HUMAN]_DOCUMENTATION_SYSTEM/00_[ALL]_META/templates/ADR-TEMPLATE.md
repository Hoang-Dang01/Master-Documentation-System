# ADR-TEMPLATE.md — Architectural Decision Record Template

## 1. Purpose (Mục đích của tài liệu)

**ADR (Architectural Decision Record)** là tài liệu dùng để ghi lại **các quyết định kiến trúc quan trọng** trong hệ thống.

ADR không chỉ ghi lại:

> “Chúng ta chọn cái gì?”

mà quan trọng hơn là ghi lại:

* Tại sao chọn?
* Đã cân nhắc những phương án nào?
* Trade-off là gì?
* Điều kiện nào khiến quyết định này không còn đúng?

---

## 2. Why ADR Matters (Vì sao ADR quan trọng?)

Trong các hệ thống lớn, sau một thời gian team thường gặp vấn đề:

* Không nhớ vì sao ngày xưa chọn công nghệ này
* Không rõ ai đã approve quyết định
* Không biết assumption ban đầu là gì
* Không biết khi nào nên re-evaluate

Điều này dẫn tới:

* architecture drift
* inconsistent decisions
* repeated debates
* technical debt

ADR tồn tại để giải quyết các vấn đề đó.

---

## 3. ADR trong MDS đóng vai trò gì?

Trong MDS, ADR là một **Knowledge Artifact cấp cao**, thuộc nhóm:

* Architecture Intelligence
* Decision Intelligence
* System Governance

ADR giúp:

### Human

Hiểu reasoning đằng sau kiến trúc.

### AI Agents

Hiểu system philosophy để tránh sinh code đi lệch định hướng.

Ví dụ:

Nếu ADR ghi:

> Chọn LiveKit thay vì Jitsi vì cần full infra control

thì Backend Agent / DevOps Agent sẽ hiểu:

* ưu tiên self-hosted
* tránh managed dependency
* chấp nhận infra complexity

---

## 4. Khi nào phải tạo ADR?

Bắt buộc tạo ADR khi có quyết định liên quan đến:

## Technology Selection

Ví dụ:

* PostgreSQL vs MongoDB
* LiveKit vs Jitsi
* Redis vs RabbitMQ

---

## Architecture

Ví dụ:

* Monolith vs Microservices
* Event-driven vs Request-response
* Polling vs WebSocket

---

## Security

Ví dụ:

* JWT strategy
* RBAC model
* encryption strategy

---

## Database Design

Ví dụ:

* normalize vs denormalize
* partition strategy
* indexing strategy

---

## Infrastructure

Ví dụ:

* Kubernetes vs Docker Compose
* cloud vs on-prem
* CDN strategy

---

## 5. Metadata Fields

Mọi ADR phải có YAML metadata chuẩn.

## Core Metadata

### id

ID unique toàn cục.

Ví dụ:

```yaml
id: DEC-MEDIA-001
```

---

### name

Tên quyết định.

Ví dụ:

```yaml
name: Choose LiveKit over Jitsi
```

---

### owner

Người chịu trách nhiệm chính.

Thông thường:

```yaml
owner: ARC
```

---

### status

Trạng thái lifecycle.

Allowed values:

* DRAFT
* REVIEW
* APPROVED
* DEPRECATED
* ARCHIVED

---

### version

Semantic version.

Ví dụ:

```yaml
version: 1.0.0
```

Format:

```text
MAJOR.MINOR.PATCH
```

* Major -> breaking change
* Minor -> thêm reasoning/sections
* Patch -> sửa nhỏ

---

### decision_type

Loại quyết định.

Allowed:

* TECHNOLOGY
* ARCHITECTURE
* SECURITY
* INFRASTRUCTURE
* DATABASE
* BUSINESS_RULE

---

### impact_scope

Phạm vi ảnh hưởng.

Allowed:

* LOW
* MEDIUM
* HIGH
* CRITICAL

---

### approval_by

Ai duyệt.

Ví dụ:

```yaml
approval_by:
  - Human-Chief-Architect
```

---

### created_at / updated_at

Format:

```yaml
2026-06-26
```

---

## 6. Knowledge Graph Links

ADR phải support traceability.

```yaml
links:
  depends_on: []
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
```

Ý nghĩa:

---

### depends_on

ADR phụ thuộc vào artifact nào?

Ví dụ:

* requirement
* system constraints

---

### implements

ADR ảnh hưởng implementation nào?

Ví dụ:

* API
* services
* infrastructure

---

### tested_by

ADR được validate bởi test nào?

Ví dụ:

* load tests
* benchmark

---

### broken_by

Incident nào làm decision invalid?

Ví dụ:

* scaling failures
* security incidents

---

### impacts_cost

Ảnh hưởng chi phí nào?

Ví dụ:

* infra cost
* licensing

---

## 7. ADR Template Structure

## Standard Sections

ADR chuẩn phải gồm 9 sections.

---

## Section 1 — Problem Statement

Trả lời:

> Vấn đề gì đang cần quyết định?

Mô tả:

* business problem
* technical problem
* constraints

---

## Section 2 — Context & Constraints

Mô tả bối cảnh:

* current architecture
* limitations
* deadlines
* budget
* compliance requirements

---

## Section 3 — Assumptions

Liệt kê assumptions.

Ví dụ:

* concurrent users < 10,000
* team knows WebRTC
* budget allows dedicated infra

Assumptions rất quan trọng.

Nếu assumption sai -> decision có thể sai.

---

## Section 4 — Options Analysis

Phân tích các phương án.

Mỗi option nên có:

* description
* pros
* cons
* tradeoffs

Khuyến nghị thêm bảng scoring:

| Criteria        | Score |
| --------------- | ----- |
| Cost            | 1–10  |
| Complexity      | 1–10  |
| Scalability     | 1–10  |
| Maintainability | 1–10  |

Điều này giúp AI reasoning tốt hơn.

---

## Section 5 — Final Decision

Trả lời:

> Chúng ta chọn phương án nào?

Viết rõ:

* selected option
* rationale
* decision logic

---

## Section 6 — Decision Consequences

Rất quan trọng.

Phân tích hậu quả của quyết định.

### Positive Consequences

Ví dụ:

* scalability tốt hơn
* latency thấp hơn

### Negative Consequences

Ví dụ:

* ops complexity tăng
* infra cost cao hơn

Mọi decision đều có trade-off.

---

## Section 7 — Rejected Alternatives

Liệt kê:

* phương án bị loại
* lý do loại

Điều này giúp tránh future debates lặp lại.

---

## Section 8 — Future Revisit Conditions

Khi nào cần xem lại ADR?

Ví dụ:

* monthly infra cost > 5000 USD
* active users > 10000
* latency > 300ms
* packet loss > 15%

Nên viết measurable.

Không viết mơ hồ kiểu:

> “khi cần”

---

## Section 9 — AI Agent Usage

Xác định AI nào:

* write
* read
* enforce

---

## 8. Full Template

```md
---
id: DEC-[DOMAIN]-[NUM]
name: [Decision Name]
owner: ARC
status: DRAFT
version: 1.0.0
decision_type: ARCHITECTURE
impact_scope: HIGH
approval_by:
  - Human-Chief-Architect
created_at: [YYYY-MM-DD]
updated_at: [YYYY-MM-DD]
links:
  depends_on: []
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
---

# Architectural Decision Record: [Decision Name]

## 1. Problem Statement
[Mô tả vấn đề cần giải quyết]

---

## 2. Context & Constraints
[Mô tả context hệ thống và constraints]

---

## 3. Assumptions
- [Assumption 1]
- [Assumption 2]

---

## 4. Options Analysis

### Option A: [Name]

#### Pros
- [Advantage]

#### Cons
- [Trade-off]

| Criteria | Score |
|---|---|
| Cost | |
| Complexity | |
| Scalability | |
| Maintainability | |

---

### Option B: [Name]

#### Pros
- [Advantage]

#### Cons
- [Trade-off]

| Criteria | Score |
|---|---|
| Cost | |
| Complexity | |
| Scalability | |
| Maintainability | |

---

## 5. Final Decision
[Decision and reasoning]

---

## 6. Decision Consequences

### Positive
- [Positive consequence]

### Negative
- [Negative consequence]

---

## 7. Rejected Alternatives
- [Alternative + why rejected]

---

## 8. Future Revisit Conditions
- [Condition 1]
- [Condition 2]

---

## 9. AI Agent Usage
### Write
Architect Agent + Human

### Read
All Engineering Agents

### Validation
Consistency Engine
```

---

## 9. MDS Notes

ADR là một trong các file quan trọng nhất của MDS vì nó lưu giữ:

> reasoning behind architecture

Nếu:

* Requirements mô tả “cần gì”
* API mô tả “giao tiếp thế nào”
* Database mô tả “lưu gì”

Thì ADR mô tả:

> “Vì sao hệ thống lại được thiết kế như vậy?”

Đây là thứ cực kỳ giá trị cho:

* architecture governance
* onboarding
* AI context
* future debugging

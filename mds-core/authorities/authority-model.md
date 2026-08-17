---

ownership: mds
status: canonical
source: internal
safe_to_modify: approval-gated
classification: approval_authority
update_strategy: change only through the applicable human approval gate
---

# Human Approval Authority Model

## 1. Mục đích

Tài liệu này định nghĩa mô hình canonical cho **Human Approval Authority** trong MDS.

Approval Authority đại diện cho quyền được governance công nhận để một con người đưa ra quyết định có hiệu lực tại một approval gate xác định.

Authority tồn tại để trả lời:

```text
Ai được quyền quyết định?
        ↓
Quyết định loại gì?
        ↓
Trong phạm vi nào?
        ↓
Tại gate nào?
        ↓
Quyết định đó tạo ra hiệu lực gì?
```

Tài liệu này định nghĩa semantics và invariants của authority.

Nó không định nghĩa:

* professional responsibility;
* External Actor;
* AI role;
* implementation authority;
* artifact lifecycle cụ thể;
* workflow cụ thể;
* project-specific authority holder;
* database schema.

Các concern đó thuộc canonical boundary tương ứng.

---

# 2. Định nghĩa

Một **Human Approval Authority** là:

> Quyền quyết định chính thức được governance của MDS gán cho một con người để chấp nhận, từ chối hoặc đưa ra một quyết định có hiệu lực trong một scope và tại một gate xác định.

Authority không phải chức danh.

Authority không phải role.

Authority không phải ownership.

Authority không phải khả năng AI.

Authority là:

```text
GOVERNED DECISION RIGHT
```

---

# 3. Professional Responsibility và Approval Authority

MDS phải phân biệt rõ:

```text
Professional Responsibility
≠
Approval Authority
```

Professional Responsibility trả lời:

> Ai chịu trách nhiệm phân tích, thiết kế, kiểm tra hoặc tạo professional output?

Approval Authority trả lời:

> Ai được quyền làm cho một quyết định trở thành authoritative?

Ví dụ khái niệm:

```text
Architecture Responsibility
        ↓
phân tích
đề xuất
đánh giá trade-off
        ↓
Architecture Proposal
        ↓
Approval Gate
        ↓
Architecture Authority
        ↓
Decision
```

Một người có thể đồng thời giữ Professional Responsibility và Approval Authority.

Nhưng việc giữ một classification không tự động cấp classification còn lại.

---

# 4. External Actor và Approval Authority

MDS cũng phải phân biệt:

```text
External Actor
≠
Approval Authority
```

Một Customer / Stakeholder có thể đồng thời giữ một authority nếu governance gán quyền đó.

Nhưng việc là stakeholder không tự động tạo approval rights.

```text
Actor Instance
│
├── actor relationship
│
└── authority assignment
```

Actor semantics thuộc `../actors/`.

Authority semantics thuộc `authorities/`.

---

# 5. Authority Type và Authority Assignment

MDS phải phân biệt hai khái niệm.

## 5.1. Authority Type

Authority Type là loại quyền quyết định được định nghĩa ở cấp MDS Core.

Ví dụ conceptual:

```text
Product Authority
Business Authority
Architecture Authority
Release Authority
```

Danh sách Authority Type canonical được quản lý bởi `authority-registry.yaml`.

---

## 5.2. Authority Assignment

Authority Assignment là việc một Authority Type được gán cho một human holder trong một project hoặc context cụ thể.

Ví dụ conceptual:

```text
Authority Type
Architecture Authority
        │
        │ assigned to
        ▼
Human Holder
        │
        ├── scope
        ├── project
        ├── valid period
        └── applicable gates
```

Authority Assignment là project/governance data.

Nó không phải canonical knowledge của `mds-core/authorities/`.

Nguyên tắc:

```text
MDS Core
→ định nghĩa loại quyền

Project Governance
→ quyết định ai đang giữ quyền đó
```

---

# 6. Human Authority Holder

Authority Holder phải là một human identity có thể truy vết.

MDS không được gán Human Approval Authority cho:

* AI model;
* AI agent;
* prompt;
* system capability;
* workflow engine;
* Codex;
* CI/CD;
* automated validator.

Các hệ thống trên có thể cung cấp:

```text
analysis
recommendation
validation
evidence
```

nhưng không được trở thành human authority.

```text
AI / Automation
      ↓
recommendation / evidence
      ↓
HUMAN GATE
      ↓
Human Authority Holder
      ↓
decision
```

---

# 7. Authority Scope

Mọi authority phải có scope.

Scope xác định:

> Authority này được quyền quyết định những gì?

Không tồn tại authority mặc định có quyền quyết định mọi concern trong project.

Ví dụ conceptual:

```text
Authority A

Scope:
Product decisions
```

không tự động có quyền:

```text
Architecture approval
Release approval
Security approval
Business-rule approval
```

Authority outside scope phải được coi là không hợp lệ.

---

# 8. Approval Gate

Authority chỉ có hiệu lực tại một **explicit governed gate** phù hợp.

Gate là điểm trong workflow nơi một proposal, artifact hoặc decision candidate cần human decision trước khi được phép tiến tới authoritative state tiếp theo.

```text
Proposal
   ↓
Review
   ↓
──────────────
Approval Gate
──────────────
   ↓
Human Authority
   ↓
Decision
```

Gate phải xác định tối thiểu:

* concern đang được quyết định;
* input cần review;
* authority type phù hợp;
* decision rights được phép;
* effect của decision;
* evidence cần ghi nhận.

Gate semantics cụ thể thuộc workflow hoặc governance standard tương ứng.

---

# 9. Decision Rights

Approval Authority không chỉ có quyền `APPROVE`.

Tùy gate, một Authority có thể có các decision rights như:

```text
APPROVE
REJECT
RETURN_FOR_CLARIFICATION
DEFER
SUPERSEDE
```

Không phải gate nào cũng hỗ trợ tất cả decision type.

Workflow hoặc standard tương ứng phải xác định decision nào hợp lệ.

Authority không được tạo decision type ngoài contract của gate.

---

# 10. Approval

`APPROVE` nghĩa là:

> Human Authority xác nhận proposal đáp ứng các điều kiện của gate và cho phép governance transition tương ứng xảy ra.

Approval không có nghĩa:

* artifact đúng mãi mãi;
* implementation đã hoàn thành;
* mọi downstream artifact tự động đúng;
* release tự động được phép;
* mọi conflict đã biến mất.

Approval chỉ có hiệu lực trong scope của gate đó.

---

# 11. Rejection

`REJECT` nghĩa là proposal hiện tại không được phép tiến qua gate.

Rejection phải giữ:

* decision;
* authority holder;
* timestamp;
* reason hoặc rationale khi policy yêu cầu;
* object/version bị reject.

Rejection không được xóa proposal hoặc provenance của proposal.

---

# 12. Return for Clarification

`RETURN_FOR_CLARIFICATION` nghĩa là:

> Authority chưa thể đưa ra authoritative decision vì input chưa đủ rõ, còn mâu thuẫn hoặc thiếu evidence.

Đây không phải rejection.

```text
Proposal
   ↓
Gate
   ↓
RETURN_FOR_CLARIFICATION
   ↓
Professional Responsibility
   ↓
Clarified Proposal
   ↓
Gate again
```

MDS phải giữ lineage giữa các vòng review.

---

# 13. Defer

`DEFER` nghĩa là decision chưa được đưa ra ở thời điểm hiện tại.

Defer có thể đi kèm:

* điều kiện cần thỏa;
* dependency;
* thời điểm xem xét lại;
* missing information;
* external event.

Deferred proposal không được coi là Approved hoặc Rejected.

---

# 14. Supersede

Trong những gate cho phép, Authority có thể xác nhận rằng một authoritative decision mới thay thế một decision trước đó.

Supersede phải giữ:

```text
Old Decision
      ↓
historical lineage
      ↓
New Decision
```

Không được overwrite lịch sử.

Chi tiết lifecycle thuộc Artifact Truth Standard.

---

# 15. Authority và Project Truth

Approval Authority có thể tham gia vào việc chuyển một proposal sang authoritative state.

Nhưng authority không tự định nghĩa Project Truth.

```text
Authority
→ đưa ra governed decision

Artifact Truth Standard
→ định nghĩa decision đó ảnh hưởng lifecycle/truth thế nào

MDS
→ enforce + record
```

Canonical lifecycle semantics thuộc:

```text
../standards/artifact_truth.md
```

`authorities/` không được copy hoặc tạo lifecycle cạnh tranh.

---

# 16. Authority và Evidence

Mỗi authority decision phải có khả năng audit.

MDS phải có khả năng xác định:

```text
Ai quyết định?

Authority nào được sử dụng?

Gate nào?

Đối tượng nào?

Version nào?

Decision là gì?

Khi nào?

Dựa trên input/evidence nào?

Rationale là gì nếu policy yêu cầu?
```

Authority decision là governance evidence.

Nó không được tồn tại chỉ dưới dạng:

```text
status: APPROVED
```

mà không thể truy ngược decision provenance.

---

# 17. Authority không được suy ra từ chức danh

MDS không được dùng logic:

```text
Tên chức danh
      ↓
tự động có Authority
```

Ví dụ:

```text
Architect
≠
Architecture Authority

Product Manager
≠
Product Authority

Business Analyst
≠
Business Authority
```

Một người có thể giữ cả hai, nhưng authority phải được gán rõ ràng.

Nguyên tắc:

> Responsibility assignment và Authority assignment là hai quyết định governance riêng biệt.

---

# 18. Một người có thể giữ nhiều Authority

Một Human Holder có thể được gán nhiều Authority Type nếu governance cho phép.

Ví dụ conceptual:

```text
Human A
│
├── Product Authority
└── Business Authority
```

Nhưng mỗi decision vẫn phải xác định authority nào đang được sử dụng.

Không được sử dụng một authority như quyền thay thế cho authority khác.

---

# 19. Nhiều người có thể giữ cùng một Authority Type

Một Authority Type có thể được gán cho nhiều holder nếu governance của project cho phép.

Ví dụ:

```text
Business Authority
├── Human A
└── Human B
```

Nhưng việc đó không tự quyết định:

* một người approve là đủ;
* cần unanimous approval;
* majority approval;
* sequential approval.

Quorum và multi-approval policy thuộc gate/workflow policy.

Authority Model chỉ cho phép nhiều assignment.

---

# 20. Delegation

Authority delegation không được mặc định tồn tại.

Nếu governance cho phép delegation, delegation phải được biểu diễn rõ:

```text
Original Authority Holder
        ↓
Delegation Record
        ↓
Delegate
```

Delegation phải xác định tối thiểu:

* authority type;
* scope;
* thời gian hiệu lực;
* project/context;
* delegator;
* delegate;
* trạng thái;
* provenance.

Không được suy luận delegation từ việc:

> “Người A nhờ người B duyệt giúp.”

Delegation chỉ có hiệu lực nếu governance cho phép và có evidence hợp lệ.

---

# 21. Authority Expiration và Revocation

Authority Assignment có thể:

```text
ACTIVE
EXPIRED
REVOKED
SUSPENDED
```

tùy governance model.

Một decision chỉ hợp lệ nếu Authority Assignment có hiệu lực tại thời điểm decision được đưa ra.

Việc một authority đã từng tồn tại không có nghĩa nó có hiệu lực mãi mãi.

---

# 22. Self-Approval

MDS không mặc định cấm hoặc cho phép self-approval.

Ví dụ:

```text
Professional Output Author
        =
Authority Holder
```

có thể hợp lệ trong project nhỏ nhưng không phù hợp trong một số governance model khác.

Do đó:

> Self-approval phải được quyết định bởi policy của gate hoặc authority type, không được suy luận toàn cục.

Nếu gate cấm self-approval, MDS phải enforce separation of duties.

---

# 23. Separation of Duties

Một gate có thể yêu cầu người tạo professional output và người approve phải khác nhau.

```text
Author
  │
  ▼
Proposal
  │
  ▼
Independent Authority
```

Policy này có thể được dùng cho:

* high-risk decision;
* security-sensitive change;
* release;
* architecture decision;
* regulatory requirement.

Authority Model hỗ trợ khái niệm này nhưng không bắt buộc mọi gate phải dùng nó.

---

# 24. Conflict giữa Authorities

Có thể xảy ra trường hợp nhiều authority đưa ra decision không tương thích.

Ví dụ conceptual:

```text
Authority A
→ APPROVE

Authority B
→ REJECT
```

MDS không được tự chọn một decision.

Conflict phải được xử lý theo governance policy xác định:

* precedence;
* escalation;
* joint approval;
* higher authority;
* re-review.

Nếu chưa có policy phù hợp:

```text
AUTHORITY CONFLICT
status: unresolved
```

phải được giữ nguyên.

AI không được tự giải quyết authority conflict.

---

# 25. Authority và AI

AI có thể hỗ trợ Human Authority bằng cách:

* tóm tắt proposal;
* kiểm tra completeness;
* kiểm tra policy;
* phát hiện conflict;
* so sánh version;
* trình bày impact;
* tổng hợp evidence;
* đề xuất decision;
* cảnh báo risk.

AI không được:

* tự gán authority cho chính nó;
* impersonate Human Authority;
* tự vượt approval gate;
* tự approve proposal;
* tự tạo delegation;
* tự thay đổi Authority Assignment;
* tự giải quyết authority conflict;
* dùng confidence score thay cho human decision.

Nguyên tắc:

```text
AI recommends
Human decides
MDS records and enforces
```

---

# 26. Authority và Implementation Plane

Approval Authority không tự động tạo implementation rights.

```text
Approval Authority
≠
Implementation Authority
```

Việc một người có quyền approve một technical decision không có nghĩa MDS cho phép họ hoặc AI trực tiếp sửa managed-project source code.

Implementation boundary thuộc:

```text
../implementation-plane/
```

---

# 27. Authority và Runtime

Release hoặc operational decisions có thể dựa trên runtime evidence.

Nhưng Runtime Environment không phải authority.

```text
Runtime Evidence
      ↓
Human Review
      ↓
Authority Decision
```

Telemetry, test result hoặc production status không tự approve một decision.

---

# 28. Authority Type không phải Gate Type

MDS phải phân biệt:

```text
Authority Type
≠
Approval Gate
```

Authority Type định nghĩa:

> loại quyền nào đang tồn tại.

Gate định nghĩa:

> quyền đó được sử dụng tại điểm kiểm soát nào.

Một Authority Type có thể được sử dụng ở nhiều gate nếu governance cho phép.

Một gate cũng có thể yêu cầu nhiều authority nếu policy yêu cầu.

---

# 29. Authority Assignment không phải Identity

MDS không nên nhúng authority trực tiếp vào identity theo kiểu:

```text
Human A = APPROVER
```

Thay vào đó:

```text
Human Identity
      │
      ▼
Authority Assignment
      │
      ├── authority type
      ├── scope
      ├── project/context
      ├── validity
      └── provenance
```

Như vậy authority có thể thay đổi mà không thay đổi identity.

---

# 30. Các nguyên tắc bất biến

### AUTHORITY-INV-001

Approval Authority và Professional Responsibility là các classification độc lập.

### AUTHORITY-INV-002

Approval Authority và External Actor là các classification độc lập.

### AUTHORITY-INV-003

Human Approval Authority chỉ được gán cho human holder có thể truy vết.

### AUTHORITY-INV-004

AI, agent, workflow engine và system capability không được giữ Human Approval Authority.

### AUTHORITY-INV-005

Mọi Authority phải có scope.

### AUTHORITY-INV-006

Mọi authority decision phải xảy ra tại một governed gate phù hợp.

### AUTHORITY-INV-007

Authority outside its assigned scope không tạo decision hợp lệ.

### AUTHORITY-INV-008

Professional title không tự động cấp Approval Authority.

### AUTHORITY-INV-009

Authority Type thuộc MDS Core; Authority Assignment thuộc project/governance data.

### AUTHORITY-INV-010

Mọi authority decision phải có provenance và có khả năng audit.

### AUTHORITY-INV-011

Approval không tự động xác nhận implementation, verification hoặc release ngoài scope của gate.

### AUTHORITY-INV-012

Delegation chỉ có hiệu lực khi governance cho phép và delegation được ghi nhận rõ ràng.

### AUTHORITY-INV-013

Expired, revoked hoặc suspended Authority Assignment không được sử dụng để tạo decision mới.

### AUTHORITY-INV-014

Authority conflict không được AI tự giải quyết.

### AUTHORITY-INV-015

Self-approval và separation of duties phải được quyết định bởi gate/policy, không được suy luận toàn cục.

### AUTHORITY-INV-016

Authority decision không được xóa hoặc overwrite lịch sử decision trước đó.

---

# 31. Quan hệ với các vùng khác của MDS Core

```text
authorities/
    │
    ├── professional responsibility ──► roles/
    │
    ├── external actor identity ──────► actors/
    │
    ├── approval lifecycle ───────────► standards/
    │
    ├── authority data structure ─────► schemas/
    │
    ├── gate/workflow behaviour ──────► workflows/
    │
    ├── implementation boundary ──────► implementation-plane/
    │
    ├── runtime evidence ─────────────► runtime/
    │
    └── AI assistance instructions ───► prompts/
```

`authorities/` chỉ sở hữu:

* authority semantics;
* authority classification;
* authority scope semantics;
* authority assignment semantics;
* human decision-right semantics.

Nó không được sao chép canonical rules của các boundary khác.

---

# 32. Canonical Authority Types

Tài liệu này không đăng ký Authority Type cụ thể.

Danh sách Authority Type được MDS công nhận phải được quản lý bởi:

```text
authority-registry.yaml
```

Sự xuất hiện của một authority name trong:

* example;
* guide;
* prompt;
* workflow;
* source document;

không làm authority đó trở thành canonical.

---

# 33. Nguyên tắc mở rộng

Không tạo Authority Type mới chỉ vì tồn tại một Professional Role tương ứng.

Ví dụ:

```text
Database Role
```

không tự động yêu cầu:

```text
Database Authority
```

Authority Type mới chỉ nên được tạo khi:

1. tồn tại một decision domain riêng biệt;
2. domain đó có explicit human gate;
3. quyền quyết định cần được phân biệt với authority hiện có;
4. sự phân biệt có ảnh hưởng governance thực tế;
5. thay đổi được approve qua governed workflow.

Nguyên tắc:

> **Authority model hóa quyền quyết định thực sự, không mô phỏng org chart.**

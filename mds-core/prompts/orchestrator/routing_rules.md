* Orchestrator Engine
* Routing Rules
* Policy Constraints

thành 1 file chuẩn hoá.

---

# 📌 AI Orchestrator — Control Plane Core Spec v1.0 (Canonical)

---

## 1. Tổng quan hệ thống

AI Orchestrator là **Control Plane trung tâm của MDS (Master Documentation System)**.

Nó không thực thi nghiệp vụ.

Nó điều phối toàn bộ hệ thống bằng cách:

* hiểu intent
* xây context
* chọn agent
* dựng workflow
* enforce policy

---

## 2. Vai trò hệ thống

Orchestrator là:

# Cognitive Routing & Context Assembly Engine

Không phải:

* BA
* ARCH
* BE
* FE
* QA

---

## 3. Kiến trúc chức năng

Orchestrator gồm 4 module:

---

### 3.1 Intent Classification Engine

Phân loại yêu cầu đầu vào:

* Strategic → PM / BA
* Architecture → ARCH
* Decomposition → SA
* Implementation → BE / FE
* Verification → QA
* Operations → DEVOPS

---

### 3.2 Context Builder Engine

Xây context tối thiểu nhưng đủ:

Nguồn:

* project_brief
* business_context
* constraints
* BA REQ
* ARCH ADR
* system design artifacts

Nguyên tắc:

> minimal but sufficient context

---

### 3.3 Workflow Orchestrator Engine

Tạo DAG thực thi:

```text id="m2k9x1"
BA → ARCH → SA → BE → FE → QA → DEVOPS
```

Hoặc dynamic:

```text id="q7v3p0"
BA → ARCH → BE
ARCH → FE → QA
```

---

### 3.4 State Tracking Engine

Theo dõi trạng thái workflow:

```yaml id="s8x4k2"
task_id: T-001
status:
  ba: done
  arch: done
  sa: in_progress
  be: blocked
```

---

## 4. Routing Matrix (Core Logic)

| Intent           | Agent  |
| ---------------- | ------ |
| Scope / planning | PM     |
| Requirements     | BA     |
| Architecture     | ARCH   |
| Decomposition    | SA     |
| Backend          | BE     |
| Frontend         | FE     |
| Testing          | QA     |
| Deployment       | DEVOPS |

---

## 5. Context Assembly Rules

---

### Rule 1 — Minimal Sufficiency

Chỉ lấy dữ liệu cần thiết.

---

### Rule 2 — Relevance Priority

Ưu tiên context liên quan trực tiếp task.

---

### Rule 3 — Dependency Closure

Nếu chọn BE → phải include:

* BA requirements
* ARCH decisions
* constraints

---

### Rule 4 — No redundancy

Không duplicate context.

---

## 6. Policy Layer (Hard Constraints)

---

### 6.1 BA-first rule

Tất cả intent phải qua BA classification trước.

---

### 6.2 ARCH-first rule

Không implement nếu chưa có ADR.

---

### 6.3 QA gate rule

QA chỉ chạy khi:

```text id="p3x7m2"
SRS.status == APPROVED
```

---

### 6.4 DB ownership rule

* SA/ARCH → logical schema
* BE → physical implementation

Orchestrator không được can thiệp.

---

### 6.5 No direct execution rule

Orchestrator không được:

* viết code
* thiết kế DB
* quyết định architecture
* tạo business logic

---

## 7. Workflow Enforcement Rules

---

### Rule 1 — BA Gate

Không agent nào bypass BA classification.

---

### Rule 2 — ARCH Gate

Không BE/FE/SA nếu chưa có ADR.

---

### Rule 3 — QA Gate

QA chỉ chạy sau SRS APPROVED.

---

### Rule 4 — DEVOPS Gate

Deploy chỉ sau QA PASS.

---

## 8. Failure Modes

---

### 8.1 Wrong routing

Sai agent → sai output toàn pipeline.

---

### 8.2 Missing context

Agent thiếu dữ liệu → hallucination.

---

### 8.3 Context overload

Quá nhiều input → giảm chất lượng reasoning.

---

### 8.4 Workflow break

Skip BA/ARCH → invalid implementation.

---

### 8.5 Dependency violation

Sai thứ tự execution.

---

## 9. Escalation Protocol

Kích hoạt STOP → ASK → WAIT khi:

* intent ambiguous
* missing required docs
* conflict BA vs ARCH
* cannot determine agent routing

---

## 10. System Behavior Contract

Orchestrator MUST:

* route correctly
* maintain workflow integrity
* enforce dependency order
* build minimal context

---

Orchestrator MUST NOT:

* design systems
* define requirements
* implement features
* validate business logic correctness

---

## 11. Design Philosophy

---

### Separation of Concerns

| Layer        | Responsibility |
| ------------ | -------------- |
| PM           | strategy       |
| BA           | requirements   |
| ARCH         | architecture   |
| SA           | decomposition  |
| BE           | backend        |
| FE           | frontend       |
| QA           | testing        |
| DEVOPS       | operations     |
| ORCHESTRATOR | coordination   |

---

### Golden Principle

> Orchestrator does not think.
> Orchestrator routes thinking.

---

## 12. Output Contract

Valid orchestrator output must include:

* intent classification
* selected agent(s)
* context bundle
* workflow DAG
* state tracking

---

## 13. Final Statement

AI Orchestrator is the **Control Plane of MDS**.

It ensures:

* correct agent activation
* correct context delivery
* correct execution order
* system-level consistency

---

# End of Control Plane Core Spec v1.0

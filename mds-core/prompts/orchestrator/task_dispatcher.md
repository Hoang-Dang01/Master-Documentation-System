Ok — cái này là bước **tách control plane thành execution layer chi tiết hơn**.

Tui viết cho ông bản chuẩn luôn theo MDS style:

---

# 📌 AI Orchestrator — Task Dispatcher Spec v1.0

---

## 1. Tổng quan

Task Dispatcher là **execution routing layer** của AI Orchestrator trong MDS.

Nếu Orchestrator Core:

> quyết định “ai nên làm gì”

thì Task Dispatcher:

> biến quyết định đó thành task execution units cụ thể

---

## 2. Vai trò hệ thống

Task Dispatcher là:

# Execution Routing Engine

Nó nằm giữa:

```text id="m1q8x3"
Orchestrator Core
↓
Task Dispatcher
↓
Agent Execution Layer
```

---

## 3. Trách nhiệm cốt lõi

---

## 3.1 Task Decomposition

Chia một request lớn thành các task nhỏ có thể thực thi.

Ví dụ:

```text id="a9k2p0"
Feature: Add payment system
```

→ tasks:

* BA: define payment requirements
* ARCH: define payment architecture
* BE: implement payment API
* QA: test payment flow

---

## 3.2 Task Structuring

Mỗi task phải có:

```yaml id="t7x0m9"
task_id: T-001
type: backend_implementation
priority: high
agent: be_agent
dependencies:
  - T-000
context_required:
  - BA-REQ-01
  - ARCH-ADR-03
```

---

## 3.3 Agent Assignment

Gán task cho đúng agent:

| Task Type     | Agent  |
| ------------- | ------ |
| requirement   | BA     |
| architecture  | ARCH   |
| decomposition | SA     |
| backend       | BE     |
| frontend      | FE     |
| testing       | QA     |
| deployment    | DEVOPS |

---

## 3.4 Dependency Resolution

Xác định thứ tự execution:

```text id="d3p9x1"
T-001 → T-002 → T-003
```

Nếu dependency fail:

* block downstream tasks
* escalate to Orchestrator Core

---

## 3.5 Context Packaging

Mỗi task phải có context riêng:

```yaml id="c8m1q7"
task_id: T-003

context:
  requirements:
    - BA-REQ-010
  architecture:
    - ARCH-ADR-004
  constraints:
    - latency < 200ms
```

---

## 4. Task Model

---

## 4.1 Task Structure

```yaml id="k5p0v2"
task_id: string
type: string
agent: string
priority: low | medium | high | critical
status: pending | running | blocked | done
dependencies: list
context_required: list
output_contract: string
```

---

## 4.2 Task States

| State   | Meaning        |
| ------- | -------------- |
| pending | chưa chạy      |
| running | đang chạy      |
| blocked | chờ dependency |
| done    | hoàn thành     |
| failed  | lỗi            |

---

## 5. Execution Flow

---

### Step 1 — Receive Plan from Orchestrator Core

Input:

```text id="o7m2x9"
workflow DAG
intent classification
selected agents
```

---

### Step 2 — Decompose into tasks

Chia nhỏ theo function-level units.

---

### Step 3 — Assign agents

Map tasks → agents.

---

### Step 4 — Resolve dependencies

Build execution order.

---

### Step 5 — Dispatch tasks

Gửi task tới agent execution layer.

---

## 6. Dispatch Rules

---

### Rule 1 — No orphan task

Không task nào được tồn tại không agent.

---

### Rule 2 — No execution without context

Task phải có:

* BA context
* ARCH context (nếu cần)

---

### Rule 3 — Dependency-first execution

Task chỉ chạy khi:

```text id="z8m4x1"
all dependencies == done
```

---

### Rule 4 — Single responsibility task

Một task = một mục tiêu rõ ràng.

---

## 7. Failure Modes

---

## 7.1 Task misassignment

Sai agent → sai output.

---

## 7.2 Missing dependency resolution

Chạy sai thứ tự → system failure.

---

## 7.3 Context mismatch

Task không đủ info → agent hallucination.

---

## 7.4 Task explosion

Quá nhiều task nhỏ → overhead orchestration.

---

## 7.5 Deadlock dependency

Task A chờ B, B chờ A.

---

## 8. Escalation Protocol

Kích hoạt STOP → ASK → REBUILD khi:

* dependency cycle detected
* task cannot be assigned
* context incomplete
* execution conflict

---

## 9. Output Contract

Task Dispatcher phải output:

```yaml id="r3m0k8"
tasks:
  - task_id: T-001
    agent: be_agent
    status: pending
    dependencies: []
    context: {...}

  - task_id: T-002
    agent: qa_agent
    status: blocked
    dependencies: [T-001]
```

---

## 10. Design Principle

---

### 10.1 Orchestrator vs Dispatcher

| Layer        | Responsibility   |
| ------------ | ---------------- |
| Orchestrator | decide workflow  |
| Dispatcher   | break into tasks |
| Agents       | execute tasks    |

---

## 11. Golden Rule

> Orchestrator thinks in workflows
> Dispatcher thinks in tasks
> Agents think in execution

---

## 12. System Boundary

Task Dispatcher MUST NOT:

* design architecture
* define requirements
* choose system design
* execute business logic

---

## 13. Final Statement

Task Dispatcher is the **execution decomposition layer** of MDS.

It ensures:

* workflow → tasks
* tasks → agents
* dependencies → execution order
* context → correct delivery

---

# End of Task Dispatcher Spec v1.0 🚀

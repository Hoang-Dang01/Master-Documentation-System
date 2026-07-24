# Đặc tả MDS Core — Lược đồ Vòng Đời Dự Án (workflow_schema)

> **Vai trò:** Canonical Workflow & Lifecycle Schema (Lược đồ Vòng Đời Chuẩn tắc)
> **Sứ mệnh:** Định nghĩa vòng đời 10 giai đoạn phát triển phần mềm chuẩn tắc, các điểm kiểm soát chất lượng bắt buộc (Quality Gates), tài liệu đầu vào/đầu ra (Inputs/Outputs), phân định trách nhiệm vai trò (RACI), cơ chế chuyển giai đoạn và rollback, cùng cấu hình chế độ vận hành (Workflow Mode) cho toàn bộ hành trình từ ý tưởng đến vận hành ổn định.

---

## 1. Bản đồ Vòng Đời Tổng thể (Lifecycle Overview Map)

Toàn bộ vòng đời dự án trên MDS được chia thành 10 giai đoạn. Mỗi giai đoạn có một cổng chất lượng (Quality Gate) bắt buộc phải vượt qua trước khi chuyển tiếp. Tùy theo `workflow_mode`, các giai đoạn có thể chạy tuần tự cứng hoặc có phạm vi overlap.

```text
  [Phase 00]     [Phase 01]     [Phase 02]     [Phase 03]     [Phase 04]
   Intake    ──►  Discovery ──►  Analysis  ──►   Design   ──►  Exec Planning
  (Tiếp nhận)   (Khai Phá)    (Phân Tích)    (Thiết Kế)   (Lập KH Thực Thi)
       │              │              │              │              │
    Gate 00        Gate 01        Gate 02        Gate 03        Gate 04

  [Phase 05]     [Phase 06]     [Phase 07]     [Phase 08]     [Phase 09]
Implementation ► Testing    ──►  Deployment ──►  Operations ──►  Evolution
  (Xây Dựng)   (Kiểm Thử)    (Triển Khai)    (Vận Hành)    (Tiến Hóa)
       │              │              │              │              │
    Gate 05        Gate 06        Gate 07        Gate 08        Gate 09

  Rollback paths:  05 ──► 04   |   06 ──► 05   |   07 ──► 06   |   09 ──► 02/03
```

---

## 2. Cấu Hình Chế Độ Vận Hành (Workflow Mode Configuration)

MDS hỗ trợ 3 chế độ vận hành, được khai báo trong `project_brief.md`:

```yaml
workflow_mode: strict_waterfall | hybrid_agile | fast_iteration
```

| Mode | Mô tả | Phù hợp |
| :--- | :--- | :--- |
| **`strict_waterfall`** | Gate cứng 100%. Không phase nào được bắt đầu khi gate trước chưa pass. | Banking, Medical, Regulated Systems |
| **`hybrid_agile`** | Cho phép overlap có kiểm soát (ví dụ: FE prototype trước khi API freeze, spike research song song design). Gate vẫn required nhưng có thể provisional. | Startup, Product Companies |
| **`fast_iteration`** | Compress cycle: Discovery + Analysis + Design có thể chạy song song với con người chủ trì. Phù hợp MVP/PoC. Gate chỉ enforce ở Phase 01 và 05+. | Solo, AI-driven, PoC |

> **Mặc định**: `strict_waterfall` nếu `workflow_mode` không được khai báo.

---

## 3. Đặc tả Chi Tiết Từng Giai Đoạn (Phase Specifications)

### Phase 00 — Intake (Tiếp Nhận)

| Trường | Chi tiết |
| :--- | :--- |
| **Thư mục** | `mds-core/guides/lifecycle/00_intake/` |
| **Actor chính** | PM, BA |
| **Mục tiêu** | Ghi nhận yêu cầu thô từ khách hàng, đánh giá khả thi sơ bộ (feasibility), phân loại và quyết định Go / No-Go cho dự án. |
| **Inputs** | Email/chat thô từ khách hàng, cuộc họp kick-off, RFP (Request for Proposal). |
| **Outputs** | `intake_brief.md` (tóm tắt yêu cầu thô), `FSB-XXX.md` (Feasibility Study — đánh giá khả thi về budget, timeline, kỹ thuật). |
| **Quality Gate 00** | PM xác nhận Go/No-Go dựa trên Feasibility Study. Nếu No-Go: dự án kết thúc tại đây và ghi lý do vào `FSB`. |
| **State Machine** | `allowed_next: [01]` · `rollback_to: []` (gate đầu tiên, không rollback) |

---

### Phase 01 — Discovery (Khai Phá)

| Trường | Chi tiết |
| :--- | :--- |
| **Thư mục** | `mds-core/guides/lifecycle/01_discovery/` |
| **Actor chính** | PM, BA, Human |
| **Mục tiêu** | Làm rõ Customer Intent, biên bản họp và xây dựng bộ ba hồ sơ ngữ cảnh nền tảng. |
| **Inputs** | `intake_brief.md`, `FSB-XXX.md`, biên bản họp, phỏng vấn stakeholders. |
| **Outputs** | `project_brief.md` (CTX), `business_context.md` (CTX), `constraints.md` (CTX). |
| **Quality Gate 01** | Con người phê duyệt (`APPROVED`) đủ bộ ba tài liệu CTX. **Không một luồng phát triển nào được kích hoạt khi chưa qua Gate này.** |
| **State Machine** | `allowed_next: [02]` · `rollback_to: [00]` (nếu phát hiện thiếu thông tin trọng yếu) |

---

### Phase 02 — Analysis (Phân Tích Nghiệp Vụ)

| Trường | Chi tiết |
| :--- | :--- |
| **Thư mục** | `mds-core/guides/lifecycle/02_analysis/` |
| **Actor chính** | BA, SA |
| **Mục tiêu** | Đặc tả đầy đủ Business Flows, Business Rules, yêu cầu chức năng và **phi chức năng (NFR)** và đánh giá rủi ro ban đầu. |
| **Inputs** | Bộ ba CTX đã `APPROVED`. |
| **Outputs** | `REQ-XXX.md` (Yêu cầu nghiệp vụ), `BR-XXX.md` (Business Rules), `NFR-XXX.md` (Non-Functional Requirements), `RSK-XXX.md` (Risk Register), Use Case / User Stories. |
| **Quality Gate 02** | BA phê duyệt toàn bộ `REQ` và `BR`. SA xác nhận `NFR` đủ rõ để thiết kế. Risk Register có ít nhất 1 lần review. |
| **State Machine** | `allowed_next: [03]` · `rollback_to: [01]` (nếu CTX cần điều chỉnh sau khi phân tích sâu) |

---

### Phase 03 — Design (Thiết Kế Kỹ Thuật)

| Trường | Chi tiết |
| :--- | :--- |
| **Thư mục** | `mds-core/guides/lifecycle/03_design/` |
| **Actor chính** | ARCH, SA, BE, FE |
| **Mục tiêu** | Thiết kế kiến trúc tổng thể, cơ sở dữ liệu (DDL), Hợp đồng API, các quyết định ADR, giao diện UI và ghi nhận các quyết định nhỏ vào Decision Log. |
| **Inputs** | `REQ-XXX.md`, `BR-XXX.md`, `NFR-XXX.md`, `RSK-XXX.md`, `constraints.md`. |
| **Outputs** | `ADR-XXX.md` (Quyết định kiến trúc), `DB-XXX.md` (Database Schema/DDL), `API-XXX.md` (API Contracts), `UI-SPEC-XXX.md` (UI Wireframes/Specs), `DEC-XXX.md` (Decision Log — các quyết định kỹ thuật nhỏ không cần ADR). |
| **Quality Gate 03** | Con người phê duyệt `ADR`. SA phê duyệt `DB` Schema và `API` Contract. `NFR` được map rõ vào kiến trúc. **Cấm triển khai code khi chưa có `APPROVED` trên Gate này.** |
| **State Machine** | `allowed_next: [04]` · `rollback_to: [02]` (nếu phát hiện yêu cầu mâu thuẫn hoặc không khả thi kỹ thuật) |

---

### Phase 04 — Execution Planning (Lập Kế Hoạch Thực Thi)

| Trường | Chi tiết |
| :--- | :--- |
| **Thư mục** | `mds-core/guides/lifecycle/04_execution_planning/` |
| **Actor chính** | PM |
| **Mục tiêu** | Phân rã công việc thành các Task (`TSK`) cụ thể, ước tính thời gian, phân công Actor và lập Sprint Backlog sẵn sàng để thực thi. Đây là **execution planning** (lập kế hoạch thực thi), không phải strategic planning (đã làm từ Phase 01). |
| **Inputs** | `API-XXX.md`, `DB-XXX.md`, `REQ-XXX.md`, `RSK-XXX.md` đã `APPROVED`. |
| **Outputs** | `TSK-XXX.md` (Sprint Tasks với Actor được gán), `milestone_plan.md` (Lộ trình cột mốc). |
| **Quality Gate 04** | PM phê duyệt Sprint Backlog. Mỗi `TSK` có: Actor, effort estimate, linked `REQ`/`API`, và định nghĩa Done (Definition of Done). |
| **State Machine** | `allowed_next: [05]` · `rollback_to: [03]` (nếu phát hiện gap trong thiết kế khi phân rã task) |

> **Lưu ý**: Trong `hybrid_agile` mode, PM có thể bắt đầu draft execution plan từ Phase 02/03 song song mà không cần chờ Gate 03. Tuy nhiên Sprint Backlog chỉ được `APPROVED` sau khi Gate 03 pass.

---

### Phase 05 — Implementation (Xây Dựng)

| Trường | Chi tiết |
| :--- | :--- |
| **Thư mục** | `mds-core/guides/lifecycle/05_implementation/` |
| **Actor chính** | BE Agent, FE Agent |
| **Mục tiêu** | Backend và Frontend Agent song song sinh code từ `API` Contract và `DB` Schema đã được phê duyệt. Mỗi commit code **phải** liên kết tới `TSK` tương ứng để đảm bảo truy vết. |
| **Inputs** | `API-XXX.md` (`APPROVED`), `DB-XXX.md` (`APPROVED`), `TSK-XXX.md`. |
| **Outputs** | Source code (PR/MR) với commit message format `[TSK-XXX] description`, migration scripts, unit tests. |
| **Quality Gate 05** | Code review đạt. Build CI thành công (0 lỗi biên dịch, unit test pass). Không có critical/blocking lint error. Mọi PR đều có `linked_tsk` trong commit/PR description. |
| **State Machine** | `allowed_next: [06]` · `rollback_to: [04]` (nếu phát hiện TSK không đủ rõ hoặc thiếu contract) |

> **⚠️ Quy tắc cứng**: BE/FE Agent **cấm** tự ý thay đổi API payload hoặc cấu trúc DB khi code nếu chưa cập nhật và duyệt lại tài liệu `API`/`DB` tương ứng.

---

### Phase 06 — Testing (Kiểm Thử)

| Trường | Chi tiết |
| :--- | :--- |
| **Thư mục** | `mds-core/guides/lifecycle/06_testing/` |
| **Actor chính** | QA Agent |
| **Mục tiêu** | Viết và thực thi các kịch bản kiểm thử để phát hiện lỗi, đảm bảo tính năng đúng với `REQ` và `NFR`. |
| **Inputs** | `REQ-XXX.md`, `NFR-XXX.md`, `API-XXX.md`, build artifact từ Phase 05. |
| **Outputs** | `TC-XXX.md` (Test Cases), `BUG-YYYY-XXX.md` (Bug Reports), Test Execution Report. |
| **Quality Gate 06** | 100% Critical Test Cases pass. Không còn Bug ở mức `CRITICAL` hoặc `BLOCKING`. Bug ở mức `MAJOR` đã có kế hoạch xử lý rõ ràng. NFR tests (load test, security scan) pass threshold. |
| **State Machine** | `allowed_next: [07]` · `rollback_to: [05]` (BUG phát hiện → giao BE/FE fix → retest) |

---

### Phase 07 — Deployment (Triển Khai)

| Trường | Chi tiết |
| :--- | :--- |
| **Thư mục** | `mds-core/guides/lifecycle/07_deployment/` |
| **Actor chính** | DevOps Agent, PM |
| **Mục tiêu** | Deploy code lên môi trường Production, cấu hình hạ tầng giám sát (Monitoring), Alert Rules và SLOs. |
| **Inputs** | Build artifact đã pass Gate 06, `REL-XXX.md` (Release Plan), `RUN-XXX.md` (Deployment Runbook). |
| **Outputs** | Hệ thống chạy trên Production, `REL-XXX.md` trạng thái `RELEASED`, Dashboard giám sát active. |
| **Quality Gate 07** | Health check / Smoke test pass. Monitoring Checklist hoàn tất 100%. Không có alert P0 nào trong 30 phút đầu sau deploy. |
| **State Machine** | `allowed_next: [08]` · `rollback_to: [06]` (nếu smoke test fail → rollback ngay + tạo `INC` + phân tích `BUG`) |

---

### Phase 08 — Operations (Vận Hành)

| Trường | Chi tiết |
| :--- | :--- |
| **Thư mục** | `mds-core/guides/lifecycle/08_operations/` |
| **Actor chính** | DevOps Agent |
| **Mục tiêu** | Giám sát hệ thống liên tục, xử lý sự cố (`INC`), theo dõi SLOs và tối ưu chi phí hạ tầng (`FIN`). |
| **Inputs** | Hệ thống Production, Alert Rules, SLO Dashboard. |
| **Outputs** | `INC-XXX.md` (Incident Reports + RCA), `RUN-XXX.md` (Runbooks cập nhật), `FIN-INFRA-XXX.md` (Báo cáo chi phí), `RSK-XXX.md` (Risk Register cập nhật dựa trên INC thực tế). |
| **Quality Gate 08** | Uptime ≥ SLA cam kết (ví dụ: 99.9%). Không có Unresolved P0/P1 Incident. Chi phí hạ tầng trong ngưỡng `FIN` đã duyệt. |
| **State Machine** | `allowed_next: [09]` · `rollback_to: [07]` (nếu phát hiện lỗi hệ thống nghiêm trọng cần re-deploy) |

---

### Phase 09 — Evolution (Tiến Hóa)

| Trường | Chi tiết |
| :--- | :--- |
| **Thư mục** | `mds-core/guides/lifecycle/09_evolution/` |
| **Actor chính** | PM, BA, ARCH |
| **Mục tiêu** | Tiếp nhận phản hồi người dùng và vận hành, phân tích để lên kế hoạch cho phiên bản tiếp theo. Vòng lặp mới bắt đầu từ Phase 02 hoặc Phase 03 tùy mức độ thay đổi. |
| **Inputs** | `INC-XXX.md`, User Feedback, Telemetry Data, `FIN-INFRA-XXX.md`, `RSK-XXX.md`. |
| **Outputs** | Feature Backlog (tính năng mới), `ADR` cập nhật (nếu thay đổi kiến trúc), `RSK` cập nhật, kick-off Phase 02 hoặc 03. |
| **Quality Gate 09** | PM và Human Architect phê duyệt Roadmap phiên bản kế tiếp. Quyết định hướng đi tiếp theo:<br>• **Quay lại Phase 02 (Analysis)** nếu phiên bản mới có thay đổi/thêm mới về mặt yêu cầu nghiệp vụ (`REQ`), quy tắc (`BR`) hoặc bối cảnh (`CTX`).<br>• **Quay lại Phase 03 (Design)** nếu phiên bản mới chỉ cải tiến kỹ thuật, tối ưu hóa kiến trúc (`ADR`), cơ sở dữ liệu (`DB`) hoặc `API` mà không thay đổi nghiệp vụ gốc. |
| **State Machine** | `allowed_next: [02, 03]` · `rollback_to: []` (phase cuối của vòng lặp) |

---

## 4. Phase State Machine — Bản Đồ Chuyển Trạng Thái (Phase Transition Graph)

Workflow trong MDS không chỉ là pipeline một chiều. Mỗi phase có tập hợp các đường chuyển tiếp hợp lệ:

```text
00 ──► 01 ──► 02 ──► 03 ──► 04 ──► 05 ──► 06 ──► 07 ──► 08 ──► 09
       │       │       │       │       │       │       │       │
       │       │       │       │       ▼       ▼       ▼       │
       │       └──►[rollback]  │      04      05      06       │
       │               │       │                               │
       └───────────────┘       └─────────────────────────► 02/03
                  (re-discover)              (next version loop)
```

| Phase | `allowed_next` | `rollback_to` | Điều kiện Rollback |
| :--- | :--- | :--- | :--- |
| **00** | `[01]` | `[]` | — |
| **01** | `[02]` | `[00]` | Phát hiện thiếu thông tin trọng yếu |
| **02** | `[03]` | `[01]` | CTX cần điều chỉnh sau khi phân tích sâu |
| **03** | `[04]` | `[02]` | Yêu cầu mâu thuẫn / không khả thi kỹ thuật |
| **04** | `[05]` | `[03]` | Gap trong thiết kế phát hiện khi phân rã task |
| **05** | `[06]` | `[04]` | Contract không đủ rõ / thiếu TSK |
| **06** | `[07]` | `[05]` | BUG phát hiện → Dev fix → Retest |
| **07** | `[08]` | `[06]` | Smoke test fail → Rollback deploy |
| **08** | `[09]` | `[07]` | Lỗi hệ thống nghiêm trọng cần re-deploy |
| **09** | `[02, 03]` | `[]` | — (vòng lặp evolution) |

> **Nguyên tắc**: Rollback chỉ được thực hiện khi Gate của phase hiện tại fail hoặc phát hiện blocker cứng. Mọi quyết định rollback phải được Con người xác nhận và ghi vào `DEC` hoặc `INC`.

---

## 5. Ma Trận Trách Nhiệm Theo Giai Đoạn (Phase RACI Matrix)

Bổ sung 2 vai trò AI-native: **ORCH** (Orchestrator Agent) và **KC** (Knowledge Curator).

| Phase | PM | BA | SA | ARCH | BE | FE | QA | DEVOPS | ORCH | KC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **00 — Intake** | **A/R** | R | I | I | - | - | - | - | I | I |
| **01 — Discovery** | **A** | **R** | C | C | I | I | I | I | **R** | **R** |
| **02 — Analysis** | I | **A/R** | **R** | C | I | I | I | I | R | **R** |
| **03 — Design** | I | C | **A** | **R** | R | R | I | I | R | **R** |
| **04 — Exec Planning** | **A/R** | C | C | C | I | I | I | I | **R** | I |
| **05 — Implementation** | I | I | **A** | C | **R** | **R** | I | I | **R** | R |
| **06 — Testing** | I | C | **A** | I | R | R | **A/R** | I | R | I |
| **07 — Deployment** | **A** | I | I | C | I | I | C | **R** | R | I |
| **08 — Operations** | I | I | I | C | R | R | I | **A/R** | R | I |
| **09 — Evolution** | **A** | R | C | **R** | I | I | C | C | **R** | **R** |

*Chú thích: **A** = Accountable · **R** = Responsible · **C** = Consulted · **I** = Informed · **-** = Không tham gia*

---

## 6. Vai Trò AI-Native Mở Rộng (AI-Native Role Extensions)

MDS vNext bổ sung 2 vai trò AI-native không có trong SDLC truyền thống:

### 6.1 ORCH — Orchestrator Agent

| Trường | Chi tiết |
| :--- | :--- |
| **Actor** | AI Agent (không có human counterpart) |
| **Nhiệm vụ cốt lõi** | Context packing, agent routing, task dispatch, memory compression giữa các phase. |
| **Khác với ARCH** | ARCH quyết định **what to build**. ORCH quyết định **how to coordinate AI agents**. |
| **Outputs** | Context bundles cho từng agent, routing decisions, agent call logs. |
| **ID Role** | `orchestrator_agent` |

**Trách nhiệm chi tiết:**
- Thu thập đúng bộ tài liệu cần thiết và pack vào context window phù hợp cho từng agent trước khi dispatch.
- Quyết định agent nào được gọi theo thứ tự nào dựa trên dependency graph của task.
- Nén và lưu trữ memory giữa các session làm việc dài.
- Phát hiện và báo cáo khi agent output lệch với contract đã khai báo.

---

### 6.2 KC — Knowledge Curator

| Trường | Chi tiết |
| :--- | :--- |
| **Actor** | AI Agent + Human review định kỳ |
| **Nhiệm vụ cốt lõi** | Ontology management, glossary, semantic consistency, artifact linking & drift detection. |
| **Khác với BA** | BA đặc tả **yêu cầu nghiệp vụ**. KC đảm bảo **tính nhất quán ngữ nghĩa** của toàn bộ knowledge graph. |
| **Outputs** | `glossary.md` (từ điển thuật ngữ dự án), `artifact_map.md` (bản đồ liên kết artifact), Drift Alert reports. |
| **ID Role** | `knowledge_curator` |

**Trách nhiệm chi tiết:**
- Duy trì glossary thuật ngữ thống nhất — cùng một khái niệm không được gọi bằng 2 tên khác nhau trong 2 tài liệu.
- Chạy semantic consistency check: phát hiện khi `REQ` mô tả một thứ nhưng `API` hiện thực hóa thứ khác.
- Map và validate tất cả liên kết (`linked_req`, `linked_api`, `linked_db`) giữa các artifact.
- Cảnh báo khi phát hiện orphan entities (thực thể không có liên kết đến bất kỳ entity nào khác).

---

## 7. Phân Loại Artifact Đầy Đủ (Extended Artifact Taxonomy)

Bổ sung 4 artifact mới vào taxonomy chuẩn tắc:

```text
                               ┌── CTX   (Project Context)
         ┌── Lớp Nghiệp Vụ ────┼── REQ   (Requirement)
         │                     ├── BR    (Business Rule)
         │                     └── NFR   (Non-Functional Requirement)  ← NEW
         │
         │                     ┌── ADR   (Architecture Decision)
         │                     ├── API   (API Contract)
         │                     ├── DB    (Database Schema)
         │                     ├── SRV   (Service/Component)
         │                     └── DEC   (Decision Log)               ← NEW
MDS      │
Entities ├── Lớp Triển Khai ───┼── TSK   (Task)
         │                     ├── TC    (Test Case)
         │                     ├── BUG   (Bug Report)
         │                     └── REL   (Release)
         │
         │                     ┌── INC   (Incident Report)
         │                     ├── RUN   (Runbook)
         │                     └── RSK   (Risk Register)              ← NEW
         │
         └── Lớp Khởi Động ──── FSB   (Feasibility Study)             ← NEW
```

### Đặc tả 4 Artifact Mới

*   **`NFR` (Non-Functional Requirement)**:
    *   *Nội dung*: Đặc tả các yêu cầu phi chức năng: latency, throughput, availability, scalability, security, compliance. **Tách biệt** khỏi `REQ` để Architect có thể map trực tiếp vào thiết kế kiến trúc.
    *   *ID Định dạng*: `SA-NFR-[NUMBER]` (Ví dụ: `SA-NFR-001`).
    *   *Owner*: SA (tạo), ARCH (validate và map vào kiến trúc).

*   **`FSB` (Feasibility Study)**:
    *   *Nội dung*: Đánh giá khả thi dự án theo 3 chiều — Kỹ thuật (Technical), Tài chính (Financial), Thời gian (Schedule). Kết luận Go/No-Go kèm điều kiện.
    *   *ID Định dạng*: `PM-FSB-[NUMBER]` (Ví dụ: `PM-FSB-001`).
    *   *Owner*: PM (khởi tạo), BA + ARCH (tư vấn đánh giá).

*   **`RSK` (Risk Register)**:
    *   *Nội dung*: Đăng ký và theo dõi các rủi ro của dự án trong suốt vòng đời. Mỗi risk có: mô tả, xác suất (probability), mức độ ảnh hưởng (impact), kế hoạch giảm thiểu (mitigation).
    *   *ID Định dạng*: `PM-RSK-[NUMBER]` (Ví dụ: `PM-RSK-001`).
    *   *Owner*: PM (duy trì), ARCH + DEVOPS (đóng góp risk kỹ thuật/vận hành).

*   **`DEC` (Decision Log)**:
    *   *Nội dung*: Ghi nhật ký các quyết định kỹ thuật nhỏ không đủ trọng yếu để tạo `ADR` chính thức. Ví dụ: chọn thư viện, naming convention, cấu hình môi trường. Giúp tránh mất context giữa các session AI.
    *   *ID Định dạng*: `ARCH-DEC-[NUMBER]` (Ví dụ: `ARCH-DEC-007`).
    *   *Owner*: ARCH hoặc BE/FE Agent (tạo khi ra quyết định), KC (audit và link).

---

## 8. Hợp Đồng Siêu Dữ Liệu (Mandatory Metadata Contracts)

Mọi tài liệu được tạo ra trong từng Phase bắt buộc phải chứa YAML Frontmatter chuẩn tắc.

### 8.1 Metadata Chuẩn Tắc Chung (Common Metadata)

```yaml
---
id: [ROLE]-[TYPE]-[PROJECT]-[COMPONENT]-[NUMBER]    # Ví dụ: BA-REQ-EDU-AUTH-001, ARCH-ADR-MDS-INFRA-003
title: Tiêu đề tự nhiên dành cho người đọc, không thêm mã kỹ thuật
project: [project-id]                       # Lowercase kebab-case trong workspace/projects/index.yaml
phase: 0X                                  # Số thứ tự Phase (00 → 09)

# Layer 1 — Lifecycle State (độ trưởng thành nội dung)
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED

# Layer 2 — Execution State (trạng thái vận hành thực tế)
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
blocked_reason: ""                         # Điền khi execution_state = BLOCKED

version: X.Y.Z
owner: [role]_agent                        # Ví dụ: ba_agent, arch_agent
created_by: [role]_agent
created_at: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_synchronized: YYYY-MM-DD
tags: []                                   # Nhãn tìm kiếm / phân loại
---
```

### 8.2 Metadata Mở Rộng Theo Loại Thực Thể

#### Cho `REQ` và `BR`
```yaml
---
# (Kèm Common Metadata)
priority: CRITICAL | HIGH | MEDIUM | LOW
linked_ctx: CTX-[PROJECT_CODE]-BRIEF
acceptance_criteria: []
---
```

#### Cho `NFR` (Non-Functional Requirement)
```yaml
---
# (Kèm Common Metadata)
category: performance | security | availability | scalability | compliance | usability
metric: ""              # Ví dụ: "P99 latency < 200ms", "Uptime ≥ 99.9%"
measurement_method: ""  # Ví dụ: "Load test với k6, 1000 concurrent users"
linked_adr: []          # ADR kiến trúc hiện thực hóa NFR này
threshold_pass: ""      # Ngưỡng pass Gate
---
```

#### Cho `FSB` (Feasibility Study)
```yaml
---
# (Kèm Common Metadata)
verdict: GO | NO_GO | CONDITIONAL_GO
technical_feasibility: HIGH | MEDIUM | LOW
financial_feasibility: HIGH | MEDIUM | LOW
schedule_feasibility: HIGH | MEDIUM | LOW
conditions: []          # Điều kiện cho CONDITIONAL_GO
estimated_budget: ""
estimated_timeline: ""
---
```

#### Cho `RSK` (Risk Register)
```yaml
---
# (Kèm Common Metadata)
risks:
  - id: RSK-001
    description: ""
    probability: HIGH | MEDIUM | LOW
    impact: HIGH | MEDIUM | LOW
    risk_score: ""       # probability × impact (tự động tính)
    mitigation: ""
    owner: ""
    status: OPEN | MITIGATED | CLOSED
    last_reviewed: YYYY-MM-DD
---
```

#### Cho `DEC` (Decision Log)
```yaml
---
# (Kèm Common Metadata)
decision: ""             # Quyết định đã chọn
context: ""              # Bối cảnh dẫn đến quyết định
alternatives_considered: []
rationale: ""            # Lý do chọn quyết định này
consequences: ""         # Hệ quả / trade-off
linked_adr: ""           # Nếu decision này sau này được nâng cấp thành ADR
---
```

#### Cho `API` Contract
```yaml
---
# (Kèm Common Metadata)
method: GET | POST | PUT | PATCH | DELETE
endpoint: /api/v1/resource
linked_req: [BA-REQ-XXX]
linked_nfr: [SA-NFR-XXX]   # NFR về latency/security áp dụng cho API này
linked_db: [SA-DB-XXX]
http_status_codes: [200, 201, 400, 401, 404, 500]
---
```

#### Cho `TSK` (Task)
```yaml
---
# (Kèm Common Metadata)
linked_req: [BA-REQ-XXX]   # REQ mà task này hiện thực hóa
linked_api: [SA-API-XXX]   # API contract task này implement
linked_db: [SA-DB-XXX]
assignee: [be_agent | fe_agent]
effort_estimate: ""         # Ví dụ: "4h", "2d"
definition_of_done: []
sprint: ""
---
```

#### Cho `BUG` Report
```yaml
---
# (Kèm Common Metadata)
severity: CRITICAL | BLOCKING | MAJOR | MINOR
linked_tc: [QA-TC-XXX]
linked_req: [BA-REQ-XXX]
linked_tsk: [T-XXX]        # Task sinh ra code chứa bug
assignee: [be_agent | fe_agent]
resolved_at: YYYY-MM-DD
---
```

#### Cho `REL` (Release)
```yaml
---
# (Kèm Common Metadata)
release_version: X.Y.Z
release_date: YYYY-MM-DD
environment: staging | production
linked_bugs_fixed: []
linked_reqs_delivered: []
linked_nfrs_validated: []   # NFR đã validate trong release này
---
```

#### Cho `UI-SPEC` (UI Wireframe / Spec)
```yaml
---
# (Kèm Common Metadata)
linked_req: [BA-REQ-XXX]
platform: web | mobile | desktop | cross-platform
components: []          # Các components UI chính cần thiết kế
figma_url: ""           # Liên kết thiết kế nếu có
---
```

#### Cho `RUN` (Runbook)
```yaml
---
# (Kèm Common Metadata)
type: deployment | recovery | backup | maintenance
steps: []               # Danh sách các bước thủ công
rollback_steps: []      # Các bước rollback nếu có sự cố
linked_srv: []          # Các service liên quan
---
```

#### Cho `INC` (Incident Report)
```yaml
---
# (Kèm Common Metadata)
severity: P0 | P1 | P2 | P3
impact_duration: ""     # Ví dụ: "45m"
root_cause: ""          # Phân tích nguyên nhân gốc rễ (RCA)
resolution: ""          # Giải pháp khắc phục
linked_bug: [BUG-YYYY-XXX] # Nếu incident được convert thành BUG để sửa code
preventive_actions: []  # Biện pháp phòng ngừa
---
```

---

## 9. Chuỗi Truy Vết Toàn Diện (End-to-End Traceability Chain)

### 9.1 Forward Traceability (Yêu cầu → Code → Test)

```text
CTX (project_brief + business_context + constraints)
 │
 ▼
REQ ◄── NFR (non-functional bounds)
 │
 ▼
ADR (kiến trúc) ◄── RSK (risk-driven decisions)
 │
 ▼
API / DB Schema ◄── DEC (small decisions)
 │
 ▼
TSK (task phân rã từ API/DB)
 │
 ▼
CODE (commit: "[TSK-XXX] description")
 │
 ▼
TC (test case verify REQ + NFR + API)
 │
 ▼
BUG (nếu TC fail)
 │
 ▼
INC (nếu lên Production)
```

### 9.2 Backward Traceability (Truy ngược nguồn gốc)

```text
INC / BUG
 ──► TC        (test case nào phát hiện?)
 ──► CODE      (commit nào gây ra?)
 ──► TSK       (task nào sinh code đó?)
 ──► API / DB  (contract nào bị vi phạm?)
 ──► REQ / NFR (yêu cầu nào không được đáp ứng?)
 ──► CTX       (context dự án gốc)
```

> **Câu hỏi hệ thống phải trả lời được**: *"Commit này implement requirement nào?"* và *"Requirement này đã được test bởi TC nào và hiện có bug nào liên quan?"*

### 9.3 Orphan Entity Rule

Một thực thể bị coi là **orphan** nếu không có liên kết đến bất kỳ entity nào ở lớp trên. Knowledge Curator (KC) có trách nhiệm phát hiện và cảnh báo orphan entities. Orphan entities không được phép ở trạng thái `APPROVED`.

---

## 10. Quy Tắc Chuyển Giai Đoạn & Cưỡng Chế (Transition & Governance Rules)

*   **Rule 1 — Cổng Chặn Theo Workflow Mode**:
    - `strict_waterfall`: Gate cứng 100%. Không phase nào được bắt đầu khi gate trước chưa pass.
    - `hybrid_agile`: Cho phép overlap có kiểm soát (draft artifacts song song), nhưng không được dùng artifact chưa `APPROVED` để ra quyết định binding.
    - `fast_iteration`: Compress cycle cho phép; Gate bắt buộc chỉ tại Phase 01 và Phase 05+.

*   **Rule 2 — Cổng Khởi Động Dự Án (Project Inception Gate)**:
    Mọi luồng phát triển (BA, ARCH, BE, FE, QA, DEVOPS) bị cấm hoạt động nếu bộ ba CTX chưa đạt `APPROVED` bởi Con người (Quality Gate 01). Áp dụng cho **tất cả** workflow modes.

*   **Rule 3 — Contract-First Development**:
    BE Agent và FE Agent chỉ được phép viết code khi `API` Contract và `DB` Schema đã `APPROVED` (Gate 03). Cấm thay đổi API payload hoặc DB schema trong code mà không cập nhật và duyệt lại tài liệu.

*   **Rule 4 — Constraint Drift Alert**:
    Mọi thay đổi `constraints.md` là **Major Change**. Hệ thống phải: (1) quét đối soát toàn bộ `ADR`, `NFR`, `API` để phát hiện vi phạm, (2) dừng pipeline tự động, (3) gửi cảnh báo đỏ đến Con người.

*   **Rule 5 — QA Independence**:
    QA Agent có quyền tối cao định nghĩa `TC` dựa trên `REQ`, `NFR`, `API`. BE và FE Agents không có quyền sửa đổi tài liệu `TC`.

*   **Rule 6 — Rollback Gate**:
    Khi Quality Gate fail, agent phải dừng ngay, tạo `INC` hoặc `BUG` mô tả lý do fail, và đưa quyết định rollback lên Con người. Rollback chỉ thực hiện sau khi Con người confirm. Mọi rollback ghi vào `DEC`.

*   **Rule 7 — Commit Traceability**:
    Mọi commit code phải có format `[TSK-XXX] short description`. PR/MR phải khai báo `linked_tsk` và `linked_req`. CI pipeline từ chối PR không tuân thủ format này.

*   **Rule 8 — Orphan Entity Blocked**:
    Không thực thể nào được chuyển sang trạng thái `APPROVED` nếu KC xác nhận nó là orphan (không có liên kết tới entity lớp trên). Knowledge Curator chạy audit orphan sau mỗi Gate.

*   **Rule 9 — NFR Must Be Architecturally Mapped**:
    Không `API` hoặc `DB` Schema nào được `APPROVED` nếu các `NFR` áp dụng cho chúng chưa được map vào ít nhất một `ADR` hoặc design decision tương ứng.

---

## 11. Trạng Thái Tài Liệu (Document State Reference)

> ⚠️ **Authority**: Đặc tả đầy đủ và chính thức của Document State Machine nằm tại [`DOCUMENT_STANDARDS.md — RULE 3`](../standards/DOCUMENT_STANDARDS.md).
> Section này chỉ là tóm tắt để tham chiếu nhanh trong ngữ cảnh workflow.

### Tóm tắt Hybrid Layered State Model

MDS sử dụng **2 lớp trạng thái độc lập** trên mỗi artifact:

```yaml
# Ví dụ: Task đã approved nhưng đang bị blocked
lifecycle_state: APPROVED       # Nội dung tài liệu đã được phê duyệt
execution_state: BLOCKED        # Nhưng việc thực thi đang bị chặn
blocked_reason: "Waiting for ARCH-ADR-INFRA-003"
```

**Layer 1 — `lifecycle_state`** (Độ trưởng thành nội dung):

| State | Ý nghĩa |
| :--- | :--- |
| `DRAFT` | Đang soạn thảo, chưa có hiệu lực |
| `REVIEW` | Đang chờ phê duyệt, cấm chỉnh sửa |
| `APPROVED` | Có hiệu lực pháp lý trong MDS |
| `DEPRECATED` | Lỗi thời, bị thay thế bởi version mới |
| `ARCHIVED` | Lưu trữ lịch sử, không dùng ra quyết định |

**Layer 2 — `execution_state`** (Trạng thái vận hành thực tế):

| State | Ý nghĩa |
| :--- | :--- |
| `NOT_STARTED` | Chưa bắt đầu xử lý |
| `IN_PROGRESS` | Đang thực hiện |
| `BLOCKED` | Bị chặn bởi dependency / chờ quyết định |
| `COMPLETED` | Đã hoàn tất xử lý |
| `NOT_APPLICABLE` | Không áp dụng (thường cho CTX, FSB) |

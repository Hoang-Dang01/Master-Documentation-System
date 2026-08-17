# MDS — Master Documentation System

> **A local-first Technical Project Brain and Engineering Control Plane for software projects.**

MDS là ứng dụng desktop **local-first** giúp biến ý tưởng, tài liệu, yêu cầu khách hàng, thay đổi kỹ thuật và bằng chứng implementation thành một hệ thống **Project Truth có cấu trúc, version, traceability và human approval**.

MDS không phải IDE.
MDS không phải coding agent.
MDS không tự sửa source code của dự án mà nó quản lý.

MDS đứng ở lớp phía trên implementation:

```text
Customer / Documents / Requirements / Repository / Tests
                         │
                         ▼
┌───────────────────────────────────────────────────────┐
│                       MDS                             │
│                                                       │
│ Capture → Structure → Analyze → Approve → Trace       │
│                                     → Present         │
│                                                       │
│         Governed Project Truth + Context              │
└──────────────────────────┬────────────────────────────┘
                           │
                           │ bounded handoff
                           ▼
┌───────────────────────────────────────────────────────┐
│                Implementation Plane                   │
│                                                       │
│ Developer / Codex / Claude Code / IDE / CI/CD         │
└──────────────────────────┬────────────────────────────┘
                           │
                           │ read-only evidence
                           └──────────────────► MDS
```

---

## Why MDS?

Một dự án phần mềm càng lớn thì knowledge của dự án càng dễ bị phân tán:

```text
Customer messages
Requirements
Meeting notes
Markdown
Database design
API contracts
Architecture decisions
Git commits
Code changes
Test results
Bug reports
AI conversations
```

Sau một thời gian, rất khó trả lời chắc chắn những câu hỏi như:

* Requirement nào hiện đang có hiệu lực?
* Quyết định này đến từ đâu?
* Tại sao hệ thống được thiết kế như vậy?
* Requirement vừa thay đổi sẽ ảnh hưởng đến API, DB hay test nào?
* Tài liệu nào đã cũ?
* Code hiện tại có đang lệch khỏi specification không?
* AI coding agent cần được cung cấp context nào?
* Phiên bản trước của quyết định này là gì?
* Ai đã approve thay đổi?
* Nếu rollback một quyết định thì những phần nào bị ảnh hưởng?

MDS được xây dựng để giữ những câu trả lời đó trong một hệ thống có thể kiểm chứng.

---

# Core idea

MDS quản lý **Project Truth**.

```text
Raw Information
      │
      ▼
Structured Artifacts
      │
      ▼
Human Review
      │
      ▼
Approved Project Truth
      │
      ├── Traceability
      ├── Impact Analysis
      ├── Knowledge Graph
      ├── Version History
      ├── Drift Detection
      ├── Verification Evidence
      └── Context Package
```

MDS không coi mọi thông tin nó đọc được là sự thật.

Một artifact có thể là:

```text
DRAFT
REVIEW
APPROVED
DEPRECATED
ARCHIVED
```

và đồng thời có validity riêng:

```text
CURRENT
NEEDS_REVIEW
STALE
CONFLICTED
```

Ví dụ:

```text
APPROVED + CURRENT
```

có thể được sử dụng làm authoritative Project Truth.

Trong khi:

```text
DRAFT
STALE
CONFLICTED
```

không được âm thầm đưa cho developer hoặc AI như một instruction chính thức.

---

# Product principles

## Local-first

MDS chạy trực tiếp trên máy người dùng.

Không yêu cầu:

* MDS cloud account
* central MDS server
* cloud database bắt buộc

Project workspace thuộc quyền kiểm soát của người dùng.

---

## User-owned data

Runtime project data được lưu ngoài source repository của MDS.

Mặc định:

```text
%USERPROFILE%\Documents\MDS-Workspace
```

Có thể override trong development:

```powershell
$env:MDS_DATA_DIR = "D:\MDS-Workspace"
```

Điều này giúp việc update, clone hoặc build lại MDS không làm mất project workspace.

---

## Human authority

AI có thể:

* đọc
* phân tích
* phát hiện vấn đề
* đề xuất
* tạo DRAFT
* hỗ trợ impact analysis

Nhưng AI không được tự biến một đề xuất thành Project Truth.

```text
AI Proposal
     ↓
   DRAFT
     ↓
Human Review
     ↓
 APPROVED
```

Các quyết định quan trọng phải đi qua explicit approval gate.

---

## Traceability first

MDS cố gắng trả lời được:

```text
Thông tin này đến từ đâu?
        │
        ▼
Artifact nào được tạo từ nó?
        │
        ▼
Artifact nào phụ thuộc vào artifact đó?
        │
        ▼
Nếu thay đổi thì cái gì bị ảnh hưởng?
```

Các relationship và lineage tạo nền tảng cho:

* Knowledge Graph
* Impact Analysis
* Drift Detection
* Change Propagation
* Context Generation
* Rollback Knowledge

---

## One Truth, multiple views

MDS không tạo một bộ tài liệu riêng cho mỗi role.

Thay vào đó:

```text
                 Project Truth
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
   Owner View     Manager View   Developer View
       │              │              │
       └──────────────┼──────────────┘
                      ▼
                  QA / AI View
```

Các view chỉ thay đổi cách trình bày.

Chúng không được tự định nghĩa một version sự thật khác.

---

# MDS does NOT write managed-project code

Đây là product boundary quan trọng nhất.

MDS có thể đọc evidence từ implementation như:

* repository paths
* commits
* diffs
* build results
* test results
* coverage
* verification evidence

để xác định:

* implementation có đúng specification không;
* artifact nào có thể đã stale;
* thay đổi nào cần review;
* context nào cần giao cho coding agent.

Nhưng MDS không:

* sửa source code của managed project;
* viết implementation thay developer;
* commit code;
* merge pull request;
* deploy managed project;
* thay thế Git;
* thay thế IDE;
* thay thế Codex hoặc Claude Code.

Implementation thuộc về:

```text
Developer
Codex
Claude Code
IDE
CI/CD
other coding systems
```

MDS là **control plane**, không phải implementation engine.

---

# Main value chain

MDS được định nghĩa bằng sáu capability chính.

| Capability    | Responsibility                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------- |
| **Capture**   | Thu nhận input, tài liệu, requirement, change request và implementation evidence với provenance |
| **Structure** | Chuyển knowledge thành artifact theo canonical schema và standard                               |
| **Analyze**   | Phát hiện ambiguity, conflict, dependency, impact, drift và missing information                 |
| **Approve**   | Đưa quyết định authoritative qua human approval gate                                            |
| **Trace**     | Quản lý relationship, lineage, history và impact propagation                                    |
| **Present**   | Hiển thị cùng Project Truth cho các audience khác nhau                                          |

Một feature chỉ thuộc MDS nếu nó cải thiện đáng kể ít nhất một trong sáu capability này.

---

# Primary workflow

Vertical workflow quan trọng đầu tiên của MDS là **Customer Change Analysis**.

```text
Customer change
      │
      ▼
Preserve source
      │
      ▼
Requirement DRAFT
      │
      ▼
Human review
      │
      ▼
Approved Requirement
      │
      ▼
New version / lineage
      │
      ▼
Knowledge Graph traversal
      │
      ▼
Impact Analysis
      │
      ▼
Affected artifacts
      │
      ▼
Validity updates
      │
      ▼
Current Project Truth
      │
      ▼
Context Package
      │
      ▼
Implementation Plane
```

Sau khi developer hoặc coding agent implementation:

```text
Implementation Evidence
        │
        ▼
Commit / Diff / Tests
        │
        ▼
       MDS
        │
        ▼
Verification / Drift Analysis
```

Tạo thành một feedback loop giữa **intent** và **implementation evidence**.

---

# Artifact model

MDS quản lý technical knowledge dưới dạng structured artifact.

Ví dụ:

```text
Requirement
Business Rule
Architecture Decision
API Specification
Database Specification
UI Specification
Test Case
Decision
Issue
Evidence
Release information
```

Artifact được lưu dưới dạng Markdown + structured metadata.

Ví dụ:

```yaml
---
id: BA-REQ-PROJECT-001
version: 1.0.0
lifecycle_state: APPROVED
validity: CURRENT
lineage_id: req-project-001
source_refs:
  - customer-request-001
links:
  - type: depends_on
    target: ARCH-ADR-PROJECT-001
---
```

Markdown và structured runtime artifacts giữ vai trò authoritative input.

SQLite và Knowledge Graph là **derived state có thể rebuild**, không phải nguồn sự thật độc lập.

---

# Knowledge Graph

Knowledge Graph cho phép MDS biểu diễn relationship giữa các artifact.

Ví dụ:

```text
Requirement
     │
     ├── implements ──► API
     │                    │
     │                    └── depends_on ──► Database
     │
     └── verified_by ──► Test Case
```

Khi một upstream artifact thay đổi:

```text
Requirement v1
      │
      ▼
Requirement v2 APPROVED
      │
      ▼
Graph traversal
      │
      ├── API → NEEDS_REVIEW
      ├── DB  → potentially affected
      └── TC  → verification may be stale
```

Graph không tự quyết định sự thật.

Nó là projection giúp MDS trace và analyze Project Truth.

---

# Current implementation

MDS hiện đang được phát triển dưới dạng desktop application:

```text
Electron
React
TypeScript
Node.js
```

Vertical slice ingestion hiện đã hỗ trợ:

```text
DOCX
Markdown
TXT
   │
   ▼
Preserve source
   │
   ▼
SHA-256 checksum
   │
   ▼
Normalize content
   │
   ▼
Requirement DRAFT
   │
   ▼
Desktop application
```

Các thành phần nền tảng hiện có bao gồm:

* Electron main process
* preload typed bridge
* React renderer
* local project workspace
* document ingestion
* source preservation
* SHA-256 provenance
* artifact metadata
* canonical standards
* artifact schemas
* artifact templates
* role contracts
* agent prompts
* versioned workflow definitions
* deterministic validation
* deterministic impact foundation
* Knowledge Graph foundation
* build/typecheck/document validation
* ingestion tests

MDS vẫn đang trong **active development**.

Một số capability vẫn đang được hoàn thiện, bao gồm:

* complete requirement review UI
* approval persistence/UI
* full artifact version lineage
* Current Project Truth projection
* complete Knowledge Graph workflow
* graph-based impact propagation
* SQLite runtime index
* AI provider adapters
* workspace/provider settings UI
* implementation evidence adapters
* drift detection
* production packaging

Không nên hiểu các capability trong roadmap là đã hoàn thành chỉ vì structure hoặc contract của chúng đã tồn tại trong repository.

---

# Repository architecture

```text
Master-Documentation-System/
│
├── apps/
│   └── desktop/
│       └── Electron + React desktop application
│
├── packages/
│   ├── core/
│   ├── application/
│   ├── workflow-engine/
│   └── infrastructure/
│
├── mds-core/
│   ├── standards/
│   ├── schemas/
│   ├── templates/
│   ├── roles/
│   ├── prompts/
│   ├── guides/
│   └── glossary/
│
├── skills/
│   ├── mds/
│   └── vendor/
│
├── workflows/
│   └── versioned workflow definitions
│
├── workspace/
│   └── development seeds / fixtures
│
├── scripts/
│
├── tests/
│
├── docs/
│
├── package.json
└── README.md
```

### `apps/desktop`

Desktop application:

```text
Electron Main
     ↓
Preload Bridge
     ↓
React Renderer
```

Renderer không được truy cập filesystem trực tiếp.

---

### `packages/core`

Runtime contracts và domain invariants.

Hướng tới quản lý:

* entities
* validation
* approval
* audit
* lifecycle
* validity
* lineage

---

### `packages/application`

Các use case mà MDS thực hiện cho người dùng.

Ví dụ:

* ingestion
* requirement processing
* impact analysis
* project operations

---

### `packages/workflow-engine`

Runtime dành cho versioned workflows.

Workflow policy không được hard-code trong UI.

---

### `packages/infrastructure`

Adapter boundary cho:

* filesystem
* persistence
* repository evidence
* AI providers
* external integration

---

### `mds-core`

Knowledge & Governance Core.

Chứa:

```text
Standards
Schemas
Templates
Role Contracts
Prompts
Lifecycle Guides
Glossary
```

Đây là nơi định nghĩa cách Project Truth phải được cấu trúc và quản trị.

---

### `skills`

```text
skills/mds/
```

chứa capability do MDS sở hữu.

```text
skills/vendor/
```

chứa third-party/vendor skills.

Vendor content không được chỉnh sửa để tạo ra một canonical rule cạnh tranh với `mds-core`.

---

### `workspace`

`workspace/` trong repository chỉ dành cho:

* development
* fixtures
* seed projects
* tests

Không phải vị trí canonical dành cho dữ liệu project thật của người dùng.

---

# Source of Truth

MDS áp dụng nguyên tắc:

> **One concern → one canonical source.**

Ví dụ:

| Concern                  | Canonical source                       |
| ------------------------ | -------------------------------------- |
| Artifact standards       | `mds-core/standards/`                  |
| Artifact Truth / lineage | `mds-core/standards/artifact_truth.md` |
| Artifact schemas         | `mds-core/schemas/`                    |
| Templates                | `mds-core/templates/`                  |
| Roles                    | `mds-core/roles/`                      |
| Agent prompts            | `mds-core/prompts/`                    |
| Workflow definitions     | `workflows/definitions/`               |
| Runtime use cases        | `packages/application/`                |
| Architecture             | `docs/ARCHITECTURE.md`                 |
| Product boundary         | `docs/foundation/product-boundary.md`  |
| Canonical registry       | `docs/CANONICAL_SOURCES.md`            |

Nếu hai nơi định nghĩa cùng một rule nhưng khác nhau, canonical source thắng.

Không giải quyết documentation drift bằng cách copy thêm rule sang vị trí thứ ba.

---

# Running MDS

## Requirements

* Node.js
* npm
* Windows development environment hiện là môi trường chính được sử dụng cho project

Clone repository:

```bash
git clone https://github.com/Hoang-Dang01/Master-Documentation-System.git
cd Master-Documentation-System
```

Install dependencies:

```powershell
npm.cmd install
```

Run desktop application:

```powershell
npm.cmd run dev
```

---

# Workspace

Mặc định:

```text
%USERPROFILE%\Documents\MDS-Workspace
```

Override:

```powershell
$env:MDS_DATA_DIR = "D:\MDS-Workspace"
npm.cmd run dev
```

Runtime project data nằm dưới:

```text
MDS_DATA_DIR/
└── projects/
    ├── index.yaml
    ├── active/
    │   └── <project-id>/
    └── archived/
```

Không lưu:

* customer production data
* API keys
* secrets

trực tiếp trong repository `workspace/`.

---

# Build & verification

Build:

```powershell
npm.cmd run build
```

Smoke test:

```powershell
npm.cmd run smoke
```

Run production build:

```powershell
npm.cmd start
```

Repository còn có các script validation và testing phục vụ kiểm tra:

* TypeScript
* documents
* repository structure
* ingestion behavior

Xem `package.json` để biết danh sách command hiện tại.

---

# Roadmap

Roadmap hiện tại được tổ chức theo hướng phát triển capability thay vì biến MDS thành coding agent.

### 0.1 — Work faster

* Project workspace
* document import
* structured requirement extraction
* human review
* impact analysis
* design draft

### 0.2 — Prepare work for implementation

* implementation plan
* task decomposition
* acceptance criteria
* verification plan
* bounded context packages

### 0.3 — Observe implementation

* read-only repository adapters
* Git diff evidence
* execution evidence
* completion verification

### 0.4 — Synchronize Project Truth

* documentation drift
* API / database change detection
* artifact versioning
* release readiness
* engineering status views

### 1.0 — Engineering Control Plane

* mature Project Truth engine
* workflow system
* multiple projects
* local knowledge search
* human approval center
* reusable workflows
* evidence-backed reporting

Principle:

> **Complete one vertical workflow before expanding horizontally.**

---

# Important documents

Nếu mới đọc project, nên bắt đầu theo thứ tự:

1. [`README.md`](README.md)
2. [`docs/SYSTEM_OVERVIEW.md`](docs/SYSTEM_OVERVIEW.md)
3. [`docs/foundation/product-boundary.md`](docs/foundation/product-boundary.md)
4. [`docs/foundation/architecture-decision.md`](docs/foundation/architecture-decision.md)
5. [`docs/CANONICAL_SOURCES.md`](docs/CANONICAL_SOURCES.md)
6. [`mds-core/standards/artifact_truth.md`](mds-core/standards/artifact_truth.md)
7. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
8. [`docs/ROADMAP.md`](docs/ROADMAP.md)
9. [`docs/STRUCTURE.md`](docs/STRUCTURE.md)

---

# Development philosophy

MDS ưu tiên:

```text
Deterministic rules
        before
AI inference
```

```text
Evidence
   before
assumption
```

```text
Human approval
      before
authority
```

```text
Traceability
     before
automation
```

```text
Project Truth
     before
agent convenience
```

Mục tiêu cuối cùng không phải tạo thêm một AI biết viết code.

Mục tiêu là tạo ra một hệ thống biết:

> **Dự án đang thực sự yêu cầu điều gì, tại sao nó như vậy, điều gì đang có hiệu lực, điều gì đã thay đổi, thay đổi đó ảnh hưởng đến đâu và context nào an toàn để con người hoặc AI tiếp tục implementation.**

---

## Project status

**Status:** Active Development

MDS đang được xây dựng theo từng vertical slice nhỏ, có thể kiểm chứng.

Canonical product boundary hiện tại:

> **MDS = Technical Project Brain + Engineering Control Plane**

Implementation vẫn thuộc:

> **Developer + IDE + Coding Agent + Git + CI/CD**

---

**Master Documentation System**

*Build the truth before building from it.*

---
ownership: mds
status: canonical
source: internal
safe_to_modify: true
---

# Tổng quan hệ thống MDS

## 1. MDS là gì?

MDS — Master Documentation System — là ứng dụng desktop local-first hỗ trợ
chuyển tài liệu, ý tưởng và yêu cầu thay đổi thành các artifact kỹ nghệ có cấu
trúc, có truy vết và có bước duyệt của con người.

Luồng giá trị chính:

```text
Tài liệu hoặc ý tưởng đầu vào
        ↓
Requirement DRAFT có nguồn tham chiếu
        ↓
Con người chỉnh sửa và phê duyệt
        ↓
Phân tích tác động
        ↓
Thiết kế DRAFT
        ↓
Kế hoạch, task và context cho coding agent
```

MDS không nhằm thay con người tự quyết định requirement, kiến trúc hoặc phạm
vi dự án. Automation xử lý những bước deterministic; AI chỉ tạo đề xuất hoặc
bản nháp; các quyết định quan trọng phải đi qua approval gate.

## 2. Nguyên tắc sản phẩm

### Local-first

MDS chạy trên máy người dùng. Source code, ứng dụng và dữ liệu có thể hoạt động
mà không cần server trung tâm, tài khoản MDS hoặc cloud database bắt buộc.

### User-owned data

Dữ liệu runtime nằm ngoài source repository. Người dùng có thể cập nhật, xóa
hoặc clone lại ứng dụng mà không làm mất workspace.

### Provider-neutral

Kiến trúc hướng tới việc người dùng tự chọn OpenAI, Anthropic, Gemini, Ollama
hoặc endpoint tương thích OpenAI. Adapter AI chưa phải phần hoàn thiện ở phiên
bản hiện tại.

### Human approval

Mọi output sinh tự động phải bắt đầu ở trạng thái `DRAFT`. Requirement, impact
report, thiết kế và thay đổi chỉ trở thành nguồn chính thức sau khi được người
có thẩm quyền phê duyệt. AI và automation không được tự chuyển artifact sang
`APPROVED`.

Lifecycle canonical hiện tại gồm `DRAFT`, `REVIEW`, `APPROVED`, `DEPRECATED`
và `ARCHIVED`. Các trạng thái như `REJECTED` hoặc `SUPERSEDED` chỉ được thêm
sau khi schema, validator và migration rule được cập nhật đồng bộ.

### Traceability

Artifact phải biết nó được tạo từ nguồn nào, liên quan đến requirement nào và
đang ở lifecycle state nào.

## 3. Trạng thái hiện tại

Vertical slice đầu tiên đã chạy được:

```text
DOCX / Markdown / TXT
        ↓
Bảo toàn file nguồn + SHA-256
        ↓
Trích xuất và chuẩn hóa nội dung
        ↓
Sinh Requirement DRAFT
        ↓
Hiển thị và mở artifact từ desktop app
```

Requirement DRAFT trong vertical slice hiện tại được tạo bằng logic
deterministic first-pass: nội dung được tách theo dòng/câu, lọc theo độ dài và
đưa vào template requirement. AI chưa tham gia runtime và không có mock AI
đứng sau kết quả này.

Đã có:

- Electron shell, preload bridge và React renderer.
- Import DOCX bằng Mammoth; Markdown và TXT được đọc trực tiếp.
- Bảo toàn source, checksum và quan hệ source → requirement.
- Tên artifact human-first và metadata dành cho hệ thống.
- Data root bên ngoài repository qua `MDS_DATA_DIR`.
- Standard, schema, template, role contract, prompt và glossary.
- Workflow definition có version cho Customer Change Analysis.
- Skill do MDS sở hữu và skill vendor có registry.
- Build, typecheck, document validation, structure validation và ingestion test.

Chưa hoàn thiện:

- Màn hình chỉnh sửa và approve/reject requirement.
- Approval history/audit trail dạng file-based đã có; UI và persistence SQLite
  vẫn chưa có.
- Deterministic impact report đã có; impact analysis có AI hỗ trợ vẫn chưa có.
- Workflow state machine có persistence/resume tối thiểu; YAML executor đầy đủ,
  retry policy và orchestration các step thật vẫn chưa có.
- AI provider adapter.
- SQLite runtime.
- Settings UI để chọn workspace và cấu hình provider.
- Production input hardening đầy đủ (MIME/signature nâng cao, archive bomb).
- Installer và portable executable.

### Definition of Done cho vertical slice import

Vertical slice import chỉ được coi là hoàn thành khi toàn bộ checklist này đạt:

- [x] Import DOCX, Markdown và TXT thành công.
- [x] File nguồn được sao chép nguyên byte sang project `sources/`.
- [x] SHA-256 được tính và lưu trong normalized source artifact.
- [x] Requirement DRAFT có `source_artifact` và quan hệ truy vết về nguồn.
- [x] Đóng/mở lại app vẫn liệt kê được artifact từ filesystem.
- [x] Runtime import ghi vào `MDS_DATA_DIR`, không ghi vào source repository.
- [x] Import lại cùng một file được phát hiện bằng checksum và yêu cầu người
  dùng quyết định thay vì âm thầm tạo bản sao.
- [x] Artifact runtime có metadata sai bị validator từ chối trước khi đi tiếp.
- [x] Build, typecheck, document validation và ingestion integration test pass.

Hai mục chưa đạt là điều kiện còn thiếu của import slice, không được xem là
feature đã hoàn thành.

## 4. Kiến trúc logic

MDS được nhìn qua sáu vùng trách nhiệm:

```text
┌──────────────────────────────────────────────────────────────┐
│ Desktop application                                         │
│ apps/desktop — Electron main, preload bridge, React UI       │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│ Application use cases                                       │
│ packages/application — import, requirement, impact, design   │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│ Runtime kernel                                               │
│ packages/core — domain, validation, approval, audit          │
└──────────────────────────────────────────────────────────────┘

Workflow definitions                  Workflow execution
workflows/definitions                 packages/workflow-engine

Knowledge and governance              Agent capabilities
mds-core                              skills/mds + skills/vendor

Provider and storage adapters
packages/infrastructure
```

Đây là dependency direction mục tiêu. Hiện tại code chạy thật tập trung ở
`packages/application/ingestion`; phần lớn `packages/core`,
`packages/workflow-engine` và `packages/infrastructure` vẫn là boundary/scaffold,
không được mô tả như runtime hoàn chỉnh.

## 5. Luồng runtime hiện tại

```text
React renderer
    ↓ gọi API có kiểu
Electron preload
    ↓ IPC allowlist
Electron main process
    ↓
Document ingestion application
    ├── đọc DOCX / MD / TXT
    ├── tính checksum
    ├── ghi source
    ├── ghi normalized artifact
    └── ghi Requirement DRAFT
            ↓
MDS_DATA_DIR/projects/active/<project-id>/
```

Renderer không đọc filesystem trực tiếp. Electron main sở hữu dialog, path,
filesystem và IPC. Preload chỉ expose API nhỏ cần thiết cho UI.

## 6. Runtime core và knowledge core

MDS có hai khái niệm dễ bị gọi chung là “core”:

| Khái niệm | Vị trí | Trách nhiệm |
|---|---|---|
| Runtime kernel | `packages/core/` | Entity, invariant, approval, validation và audit contract chạy bằng code |
| Application use cases | `packages/application/` | Những việc MDS thực hiện cho người dùng |
| Workflow runtime | `packages/workflow-engine/` | Điều phối nhiều use case theo workflow |
| Knowledge core | `mds-core/` | Standard, schema, template, guide, prompt, role và glossary |
| Agent capability | `skills/mds/` | Cách agent tìm rule, chọn template và thực hiện công việc |

`mds-core` chỉ chứa nội dung tĩnh, có version và được người/AI đọc. Nó không
chứa project runtime, AI response, log, API key, user setting hoặc database.

Skill không được tạo một business rule cạnh tranh với `mds-core` hoặc runtime
kernel. Skill phải tham chiếu canonical source.

## 7. Khái niệm domain trung tâm

Các khái niệm MDS hướng tới:

```text
Project
├── SourceDocument
├── Artifact
├── Requirement
├── Decision
└── WorkflowRun

SourceDocument
└── có thể được chia thành DocumentChunk

Requirement
├── derived_from → SourceDocument / DocumentChunk
├── impacts → Artifact
└── được quyết định bởi → Approval

Design
├── addresses → Requirement
├── supersedes → Design cũ
└── creates → Task
```

Trong vertical slice hiện tại, chỉ `SourceDocument`, artifact metadata và
Requirement DRAFT đã được thể hiện bằng file. Domain model TypeScript hoàn
chỉnh cho các entity trên vẫn là công việc tiếp theo.

## 8. Source of truth

| Loại thông tin | Nguồn chuẩn |
|---|---|
| Entity và invariant chạy bằng code | `packages/core/domain/` |
| Approval contract | `packages/core/approval/` |
| Validation chạy bằng code | `packages/core/validation/` |
| Use case | `packages/application/` |
| Workflow definition | `workflows/definitions/` |
| Workflow execution | `packages/workflow-engine/` |
| Chuẩn tài liệu | `mds-core/standards/` |
| Artifact template | `mds-core/templates/` |
| Role contract | `mds-core/roles/` |
| Prompt agent | `mds-core/prompts/` |
| Skill do MDS sở hữu | `skills/mds/` |
| Skill bên ngoài | `skills/vendor/` |
| Runtime project data | `MDS_DATA_DIR/projects/` |
| Development seed | `workspace/projects/` |

Chi tiết và quy tắc giải quyết xung đột nằm tại
[`CANONICAL_SOURCES.md`](CANONICAL_SOURCES.md).

## 9. Cây source repository

```text
Master-Documentation-System/
├── apps/                   # Ứng dụng phân phối tới người dùng
├── packages/               # Runtime code và boundary theo trách nhiệm
├── mds-core/               # Knowledge, governance và artifact contract
├── skills/                 # Skill MDS và vendor
├── workflows/              # Workflow definition có version
├── workspace/              # Seed/fixture development, không phải runtime data
├── scripts/                # Build, validation, generation và migration
├── tests/                  # Fixture, integration và end-to-end test
├── docs/                   # Kiến trúc, vận hành và migration
├── package.json
└── README.md
```

Cây vật lý đầy đủ được sinh tự động tại
[`STRUCTURE.generated.md`](STRUCTURE.generated.md). Boundary và trách nhiệm
được giải thích tại [`STRUCTURE.md`](STRUCTURE.md).

## 10. Cây dữ liệu người dùng

```text
MDS_DATA_DIR/
├── projects/
│   ├── index.yaml
│   ├── active/
│   │   └── <project-id>/
│   │       ├── project_brief.md
│   │       ├── business_context.md
│   │       ├── constraints.md
│   │       ├── status.md
│   │       ├── decisions/
│   │       ├── sources/
│   │       ├── imports/
│   │       ├── requirements/
│   │       ├── analysis/
│   │       ├── design/
│   │       ├── testing/
│   │       └── operations/
│   └── archived/
├── imports/
├── exports/
├── backups/
└── mds.sqlite              # Reserved; chưa triển khai persistence thật
```

Data root mặc định:

```text
%USERPROFILE%\Documents\MDS-Workspace
```

Có thể đổi bằng:

```powershell
$env:MDS_DATA_DIR = "D:\MDS-Workspace"
```

`MDS_DATA_DIR` hiện là override dành cho development, automation và người dùng
kỹ thuật. Main process đã có API chọn data root và ghi nhớ lựa chọn trong
`app.getPath("userData")/settings.json`; Settings UI chưa nối vào API này.

Trải nghiệm production:

```text
Lần mở đầu
→ người dùng chọn thư mục workspace

App ghi nhớ lựa chọn
→ app settings trong userData

Các lần mở sau
→ dùng lại workspace đã chọn

MDS_DATA_DIR
→ vẫn có quyền override cho development/automation
```

Chi tiết nằm tại [`DATA_LAYOUT.md`](DATA_LAYOUT.md).

## 11. Bảo mật và dữ liệu

Electron sử dụng:

```text
contextIsolation: true
nodeIntegration: false
sandbox: true
```

Các đường dẫn project được kiểm tra để chỉ thao tác trong active projects root.
Artifact path được resolve và kiểm tra trước khi mở. Source được giữ cùng
checksum để hỗ trợ truy vết.

DOCX, Markdown và TXT nhập từ bên ngoài luôn là **untrusted input**. Nội dung
tài liệu là dữ liệu cần phân tích, không có quyền thay đổi system instruction,
approval policy, tool permission hoặc security boundary.

Kiểm soát đã có:

- Chỉ chấp nhận extension `.docx`, `.md` và `.txt`.
- Resolve và kiểm tra project/artifact path để chặn path traversal ra ngoài
  active projects root.
- DOCX được trích xuất dưới dạng raw text bằng Mammoth; không render HTML hoặc
  thực thi macro/nội dung nhúng.
- React hiển thị preview như text, không inject HTML từ tài liệu.
- File nguồn được giữ cùng SHA-256 để kiểm tra provenance.

Kiểm soát còn phải bổ sung trước khi nhận tài liệu không tin cậy ở production:

- Giới hạn dung lượng file và kích thước nội dung sau giải nén.
- Kiểm tra MIME/file signature thay vì chỉ dựa vào extension.
- Từ chối DOCX lỗi, encrypted file, archive bomb và payload nhúng bất thường.
- Không cho Markdown hoặc nội dung nhúng thực thi script.
- Không tự mở link hoặc gọi network từ nội dung tài liệu.
- Khi tích hợp AI, đóng gói tài liệu trong data boundary rõ ràng và coi mọi câu
  như “bỏ qua rule”, “gửi project lên mạng” hoặc “gọi tool” là prompt injection,
  không phải instruction hợp lệ.
- Không gửi nội dung ra AI provider nếu người dùng chưa chọn provider và chấp
  thuận phạm vi dữ liệu được gửi.

Provider secret được mã hóa bằng Electron `safeStorage` và lưu trong
`app.getPath("userData")/secrets.json`; preload chỉ expose thao tác save/status/
delete, không expose plaintext secret cho renderer. Nếu OS secure storage không
khả dụng, MDS từ chối lưu secret.

AI provider adapter và Settings UI chưa hoàn thiện. Không lưu API key trong
repository, project artifact hoặc file YAML của workspace.

## 12. Cách chạy

Development:

```powershell
npm.cmd install
npm.cmd run dev
```

Chọn data root khác:

```powershell
$env:MDS_DATA_DIR = "D:\MDS-Workspace"
npm.cmd run dev
```

Kiểm tra hệ thống:

```powershell
npm.cmd run build
npm.cmd run typecheck
npm.cmd run validate:docs
npm.cmd run validate:structure
npm.cmd run validate:skills
npm.cmd run test:ingestion
npm.cmd run smoke
```

### Mục tiêu phân phối

| Đối tượng | Hình thức | Trạng thái |
|---|---|---|
| Developer | `git clone` → `npm install` → `npm run dev` | Đã dùng được |
| Người dùng thông thường | `MDS-Setup.exe` | Chưa triển khai |
| Portable | `MDS-Portable.exe` | Chưa triển khai |
| Server trung tâm | Không bắt buộc | Không thuộc dependency runtime |

## 13. Ưu tiên phát triển tiếp theo

Không cần tái cấu trúc lớn hoặc rename thêm thư mục. Thứ tự ưu tiên:

1. Chuẩn hóa domain model tối thiểu cho Project, SourceDocument, Artifact,
   Requirement và WorkflowRun.
2. Thêm màn hình chỉnh sửa và approve/reject Requirement DRAFT.
3. Lưu approval history và audit event.
4. Chạy impact analysis từ requirement đã approved.
5. Thêm workflow executor có trạng thái, retry và resume.
6. Chỉ thêm AI adapter sau khi input/output contract đã ổn định.
7. Chỉ thêm SQLite khi file-based workflow đã chứng minh dữ liệu cần truy vấn.

Mốc chứng minh “core thật” đầu tiên:

```text
Import DOCX
→ ParsedDocument
→ Requirement DRAFT
→ Human approval
→ Persisted artifact
→ Impact report
```

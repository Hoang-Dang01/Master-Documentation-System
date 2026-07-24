# Đặc tả MDS Control Plane — Quy trình Thực thi Toàn diện (execution_pipeline)

> **Vai trò:** AI-Native Engineering Operating System (AI-EOS Pipeline Spec)
> **Sứ mệnh:** Định nghĩa quy trình khép kín từ đầu đến cuối (End-to-End Execution Pipeline) kết nối 5 chặng cốt lõi: *Orchestration ➔ Dispatching ➔ Prompting ➔ Execution ➔ Validation* để vận hành bộ máy lập trình AI tự động và kháng đổ vỡ.

---

## 1. Bản đồ tổng quan quy trình (Pipeline Map)

Hệ điều hành MDS vận hành luồng phân phối tri thức và thực thi mã nguồn qua 5 giai đoạn chính theo sơ đồ DAG sau:

```text
[Yêu cầu thô từ con người]
            ↓
  [Giai đoạn 1: Orchestration] (Intent & Context Assembly)
            ↓
  [Giai đoạn 2: Dispatching]   (Task Decomposition & Dependency Mapping)
            ↓
  [Giai đoạn 3: Prompting]     (Instruction & Constraint Injection)
            ↓
  [Giai đoạn 4: Execution]     (Agent Coding & Local Verification)
            ↓
  [Giai đoạn 5: Validation]    (Automated Trace Validation & Quality Gate)
            ↓
[Hạ tầng Production (Deploy)]
```

---

## 2. Chi tiết 5 Giai đoạn thực thi (Pipeline Stages)

### Giai đoạn 1 — Điều phối (Orchestration)
*   **Tác nhân**: `routing_rules.md` & `context_builder.md` (Orchestrator Core).
*   **Hành động**: 
    1. Tiếp nhận đầu vào từ con người.
    2. Phân loại ý định (Intent Classification) thành Strategic, Architecture, Decomposition, Implementation, Verification hoặc Operations.
    3. Trích xuất bối cảnh tối giản nhưng đầy đủ (Context Assembly) từ `project_brief`, `business_context`, `constraints` và các yêu cầu/quyết định hiện có.
*   **Đầu ra**: Gói bối cảnh chuẩn hóa (**Context Bundle**).

### Giai đoạn 2 — Phân phối (Dispatching)
*   **Tác nhân**: `task_dispatcher.md` (Task Dispatcher).
*   **Hành động**:
    1. Tiếp nhận Context Bundle và Workflow DAG.
    2. Phân rã yêu cầu lớn thành các tác vụ đơn mục tiêu (**Task Execution Units**).
    3. Phân bổ các tác vụ cho đúng Agent chuyên biệt (PM, BA, ARCH, SA, BE, FE, QA, DEVOPS).
    4. Xây dựng sơ đồ phụ thuộc giữa các tác vụ (Dependency Mapping). Tác vụ hạ nguồn sẽ ở trạng thái `BLOCKED` cho đến khi tác vụ thượng nguồn chuyển sang `DONE`.
*   **Đầu ra**: Danh sách tác vụ có cấu trúc (**Structured Task List**).

### Giai đoạn 3 — Hợp đồng Chỉ thị (Prompting)
*   **Tác nhân**: `coding_prompt.md` (Coding Prompt Builder).
*   **Hành động**:
    1. Ingest dữ liệu của từng tác vụ riêng biệt.
    2. Lắp ráp Hợp đồng Chỉ thị Lập trình (Execution Instruction Contract).
    3. Tiêm (Inject) các ràng buộc kỹ thuật (Constraints), thiết lập chế độ kiểm duyệt (`strict` / `debug` / `exploratory`).
    4. Enforce thứ tự ưu tiên bối cảnh: `ARCH (ADR) > BA (REQ) > SA (SPEC) > Code`.
*   **Đầu ra**: Hợp đồng thực thi chỉ thị lập trình (**Execution Contract**).

### Giai đoạn 4 — Thực thi (Execution)
*   **Tác nhân**: Các Worker Agents (`be_agent`, `fe_agent`, `qa_agent`, `devops_agent`).
*   **Hành động**:
    1. Tiếp nhận Hợp đồng chỉ thị lập trình.
    2. Thực thi viết mã nguồn, cấu hình hạ tầng hoặc viết test case cục bộ.
    3. Tiến hành tự đánh giá chất lượng sản phẩm bằng **Self-Evaluation Rubric** của riêng Agent đó.
    4. Thực thi test nội bộ (Unit/Integration Tests) và xuất bản metadata đầu ra.
*   **Đầu ra**: Mã nguồn hoàn thiện (**Code Artifacts**) và Hợp đồng Siêu dữ liệu đầu ra (**Output Metadata Contract**).

### Giai đoạn 5 — Đối soát đối chứng (Validation)
*   **Tác nhân**: Động cơ Đối soát tự động (Trace Validation Engine - ví dụ: `detect_drift.js`).
*   **Hành động**:
    1. Quét toàn bộ mã nguồn và tệp tin siêu dữ liệu được sinh ra trên Git.
    2. Đối soát tính truy vết: Kiểm tra 100% dòng code và file cấu hình có được liên kết ngược (trả về đúng mã ID của `BA-REQ` và `ARCH-ADR`) hay không.
    3. Kiểm tra tính nhất quán, phát hiện sự lệch pha tri thức (**Drift Detection**).
    4. Chạy bộ kiểm thử tự động (Automation Test Suite) của QA làm cổng kiểm soát chất lượng cuối cùng.
*   **Đầu ra**: Báo cáo đối soát thành công (**Success Validation Report**) hoặc kích hoạt cảnh báo khẩn cấp lên con người nếu phát hiện Drift.

---

## 3. Quy chế quản trị đường ống (Pipeline Policies)

*   **Không bypass chặng (No Stage Bypass)**: Tuyệt đối không cho phép bất kỳ Agent nào nhảy cóc từ Giai đoạn 1 sang Giai đoạn 4. Mọi dòng code sinh ra phải có Task ID và Coding Prompt làm căn cứ pháp lý.
*   **GitOps Enforcement**: Mọi thay đổi về code, hạ tầng hay kế hoạch của PM/BA đều phải đi qua Git Pull Request, chạy qua Giai đoạn 5 (Validation) trước khi được merge vào nhánh chính.
*   **Luật Drift-Break**: Nếu Giai đoạn 5 phát hiện lỗi lệch pha tri thức (Drift) hoặc có sửa đổi thủ công trái phép ngoài quy trình trên Production/Git, đường ống lập tức bị khóa chặn (Locked) và kích hoạt Escalation Protocol lên con người.

---

## 4. Ý nghĩa hệ thống (MDS Philosophy)

Quy trình thực thi toàn diện này biến MDS từ một **hệ thống tài liệu tĩnh (static documentation)** thành một **Hệ điều hành vận hành kỹ nghệ AI tự động (AI-Native Engineering OS)**. Nó thiết lập kỷ luật tối thượng đảm bảo sản phẩm phần mềm chạy thực tế luôn đồng bộ 100% với tư duy chiến lược và nghiệp vụ đã duyệt.

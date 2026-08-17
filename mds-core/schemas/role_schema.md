# Đặc tả MDS Core — Lược đồ Vai trò Nhân sự (role_schema)

> **Migration notice — transitional detail:** The canonical professional role
> taxonomy and responsibility boundaries are now
> [`../roles/role-model.md`](../roles/role-model.md) and
> [`../roles/role-registry.yaml`](../roles/role-registry.yaml). When this
> legacy schema conflicts with the MDS control-plane boundary, role contract,
> or prohibition on managed-project source/test mutation, the newer canonical
> sources win. This file is preserved for staged migration; it must not be used
> to authorize autonomous implementation, Git/PR actions, deployment, or
> approval.

> **Vai trò:** Canonical Role Schema (Lược đồ Vai trò Nhân sự)
> **Sứ mệnh:** Định nghĩa phân định vai trò, trách nhiệm (RACI Matrix) và cơ chế cộng tác giữa Con người (Human) và AI Agents nhằm tối ưu hóa hiệu suất và đảm bảo an toàn vận hành trong toàn bộ vòng đời phát triển dự án.

---

## 1. Bản đồ Phối hợp Nhân sự (Collaboration Role Mapping)

Hệ thống phân định vai trò trong MDS vNext bao gồm cả Con người và AI Agent tương tác song song, bổ sung các vai trò AI-native tối ưu hóa vận hành đồ thị tri thức:

```text
                  ┌── PM (Project Manager) ────── [Human Architect]
                  ├── BA (Business Analyst) ───── [Human + BA Agent]
                  ├── SA (System Analyst) ─────── [Human]
                  ├── ARCH (Solution Arch) ────── [Human + Strategic AI]
                  │
MDS Roles ────────┼── BE (BE Developer) ───────── [BE Agent]
                  ├── FE (FE Developer) ───────── [FE Agent]
                  ├── QA (QA Engineer) ────────── [QA Agent]
                  ├── DEVOPS (DevOps/SRE) ─────── [DevOps Agent]
                  │
                  │   /* AI-Native Roles */
                  ├── ORCH (Orchestrator) ─────── [Orchestrator Agent]
                  └── KC (Knowledge Curator) ──── [Knowledge Curator Agent]
```

---

## 2. Các Vai Trò Thực Tế & Nhiệm Vụ Cốt Lõi

1.  **PM (Project Manager)**:
    *   *Actor*: Con người (Human) chịu trách nhiệm chính.
    *   *Nhiệm vụ*: Lập kế hoạch lộ trình, theo dõi tiến độ, quản lý ngân sách và Feasibility Study (`FSB`).
2.  **BA (Business Analyst)**:
    *   *Actor*: Con người + BA Agent.
    *   *Nhiệm vụ*: Khảo sát nghiệp vụ, thu thập Customer Intent, đặc tả Business Rules (`BR`) và Yêu cầu nghiệp vụ (`REQ`).
3.  **SA (System Analyst)**:
    *   *Actor*: Con người.
    *   *Nhiệm vụ*: Thiết kế phân hệ logic, luồng dữ liệu, viết tài liệu SRS chi tiết và đặc tả yêu cầu phi chức năng (`NFR`).
4.  **ARCH (Solution Architect)**:
    *   *Actor*: Con người + Strategic AI.
    *   *Nhiệm vụ*: Đưa ra quyết định công nghệ (`ADR`), thiết kế kiến trúc bảo mật, NFRs và ghi nhận quyết định nhỏ (`DEC`).
5.  **BE (BE Developer/DBA)**:
    *   *Actor*: BE Agent.
    *   *Nhiệm vụ*: Viết APIs contract, thiết kế DB Schema (`DB`) và lập trình logic nghiệp vụ backend.
6.  **FE (FE Developer)**:
    *   *Actor*: FE Agent.
    *   *Nhiệm vụ*: Phát triển giao diện, thiết kế UI Spec (`UI`) và tích hợp API backend.
7.  **QA (Quality Assurance)**:
    *   *Actor*: QA Agent.
    *   *Nhiệm vụ*: Viết Test Cases (`TC`), chạy tự động hóa kiểm thử và phát hiện lỗi (`BUG`).
8.  **DEVOPS (DevOps / SRE)**:
    *   *Actor*: DevOps Agent.
    *   *Nhiệm vụ*: Setup môi trường, cấu hình Docker/K8s, CI/CD, theo dõi SLOs, xử lý sự cố (`INC`) và viết Runbook (`RUN`).
9.  **ORCH (Orchestrator Agent)**:
    *   *Actor*: AI Agent chuyên trách (AI-native).
    *   *Nhiệm vụ*: Context packing, agent routing, task dispatch và nén memory giữa các phase phát triển.
10. **KC (Knowledge Curator)**:
    *   *Actor*: AI Agent + Human review định kỳ.
    *   *Nhiệm vụ*: Quản lý ontology, duy trì glossary dự án, kiểm tra tính nhất quán ngữ nghĩa và phát hiện trôi dạt dữ liệu (Drift Detection).

---

## 3. Ma Trận Phân Định Trách Nhiệm (RACI Matrix)

Ma trận RACI xác định mức độ tham gia của từng vai trò đối với các thực thể tri thức (Entities):
- **R (Responsible)**: Chủ thể trực tiếp thực hiện, tạo dựng thực thể.
- **A (Accountable)**: Chủ thể chịu trách nhiệm cao nhất, có quyền phê duyệt/quyết định cuối cùng (Duy nhất 1 vai trò giữ quyền A trên mỗi thực thể).
- **C (Consulted)**: Chủ thể được tham vấn, đóng góp ý kiến.
- **I (Informed)**: Chủ thể được nhận thông tin sau khi thực thể hoàn tất.

| Lớp Thực Thể | Thực Thể (Entity ID) | PM | BA | SA | ARCH | BE | FE | QA | DEVOPS | ORCH | KC | Điều kiện phê duyệt |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Khởi Động**| `FSB` (Feasibility Study) | **A/R** | C | I | C | - | - | - | - | I | I | Con người phê duyệt |
| **Bối Cảnh** | `project_brief.md` (CTX) | **A/R** | C | C | C | I | I | I | I | I | I | Con người phê duyệt |
| | `business_context.md` (CTX) | C | **A/R** | I | I | I | I | I | I | I | I | Con người phê duyệt |
| | `constraints.md` (CTX) | I | I | C | **A/R** | I | I | I | I | I | I | Con người phê duyệt |
| **Nghiệp Vụ**| `REQ` (Requirement) | I | **A/R** | C | C | I | I | I | I | R | **R** | BA phê duyệt |
| | `BR` (Business Rule) | I | **A/R** | C | C | I | I | I | I | I | **R** | BA phê duyệt |
| | `NFR` (Non-Functional Req) | I | I | **A/R** | C | I | I | I | I | I | **R** | SA phê duyệt |
| **Kỹ Thuật** | `ADR` (Arch Decision) | I | I | C | **A/R** | I | I | I | I | I | **R** | Con người phê duyệt |
| | `API` (API Contract) | I | I | **A** | C | **R** | **R** | I | I | R | **R** | SA phê duyệt |
| | `DB` (Database Schema) | I | I | **A** | C | **R** | I | I | I | R | **R** | SA phê duyệt |
| | `SRV` (Service Component) | I | I | C | **A/R** | I | I | I | I | I | I | ARCH phê duyệt |
| | `UI` (UI Spec/Wireframe) | I | I | C | I | I | **A/R** | I | I | I | I | FE phê duyệt |
| | `DEC` (Decision Log) | I | I | I | **A/R** | R | R | I | I | I | **R** | ARCH phê duyệt |
| **Triển Khai**| `TSK` (Task) | **A** | C | C | C | **R** | **R** | **R** | **R** | **R** | I | PM khởi tạo & kiểm soát |
| | `TC` (Test Case) | I | C | I | I | I | I | **A/R** | I | I | I | QA phê duyệt |
| | `BUG` (Bug Report) | I | I | I | I | **R** | **R** | **A/R** | I | I | I | QA phát hiện, Dev sửa |
| | `REL` (Release Plan) | **A/R** | I | I | C | I | I | C | **R** | I | I | Con người duyệt release |
| **Vận Hành** | `INC` (Incident Report) | I | I | I | C | **R** | **R** | I | **A/R** | I | I | DevOps chủ trì xử lý |
| | `RUN` (Runbook) | I | I | I | C | I | I | I | **A/R** | I | I | DevOps biên soạn |
| | `FIN` (Financial Cost) | **A** | I | I | C | I | I | I | **R** | I | I | PM duyệt ngân sách |
| | `RSK` (Risk Register) | **A/R** | C | I | C | I | I | I | C | I | **R** | PM phê duyệt |

---

## 4. Quy Tắc Cộng Tác & Chốt Chặn Chất Lượng (Collaboration Rules)

*   **Rule 1 — Chốt chặn Con người (Human-in-the-Loop)**: Mọi thực thể quyết định định hướng dự án, khả thi và rủi ro (`FSB`, `project_brief.md`, `constraints.md`, `ADR`) bắt buộc phải được phê duyệt bởi Con người. AI Agents tuyệt đối không được tự động chuyển trạng thái phê duyệt của các thực thể này lên `APPROVED`.
*   **Rule 2 — Quy chuẩn Hợp đồng trước khi Triển khai (Contract-First)**:
    1. BE Agent và FE Agent chỉ được phép viết code khi `API` Contract và `DB` Schema liên quan đã ở trạng thái `APPROVED` bởi SA.
    2. Cấm tự ý sửa đổi code làm thay đổi API payload mà không cập nhật và duyệt lại file thiết kế `API` tương ứng.
*   **Rule 3 — Độc lập Kiểm thử (QA Independence)**: QA Agent có quyền tối cao định nghĩa kịch bản `TC` dựa trên `REQ`, `NFR` và `API`. BE và FE Agents không có quyền sửa đổi file kịch bản của QA.
*   **Rule 4 — Giám sát Ngữ nghĩa & Drift Detection (Knowledge Curator Guardrails)**:
    Knowledge Curator Agent (KC) chạy kiểm tra tự động sau mỗi lần thay đổi tài liệu:
    1. Phát hiện orphan entities (thực thể không có liên kết tới lớp trên) và block không cho duyệt `APPROVED`.
    2. Gửi cảnh báo drift nếu phát hiện các thay đổi trong API hoặc DB phá vỡ ràng buộc của `NFR` hoặc `constraints.md`.
*   **Rule 5 — Phối hợp Context qua Orchestrator (ORCH Guardrails)**:
    Mọi luồng giao tiếp và gán task cho các agent (BE, FE, QA) đều phải thông qua ORCH Agent để:
    1. Lọc và nén tài liệu, tránh gửi thừa context dẫn đến hallucinate.
    2. Tự động kiểm tra định dạng commit message và link PR với Task trước khi chuyển sang QC.

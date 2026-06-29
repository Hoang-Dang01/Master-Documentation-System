# MDS vNext — Lược Đồ Vai Trò Nhân Sự (Role Schema)

Quy chuẩn phân định vai trò (RACI Matrix) giữa Con người (Human Architect) và AI Workers trong quá trình cộng tác kỹ nghệ.

## Các Vai Trò Thực Tế & Nhiệm Vụ Cốt Lõi

1.  **PM (Project Manager)**:
    *   *Actor*: Con người (Human) chịu trách nhiệm chính.
    *   *Nhiệm vụ*: Lập kế hoạch lộ trình, theo dõi tiến độ, quản lý ngân sách và ROI.
2.  **BA (Business Analyst)**:
    *   *Actor*: Con người + BA Agent.
    *   *Nhiệm vụ*: Khảo sát nghiệp vụ, thu thập Customer Intent và viết Business Rules.
3.  **SA (System Analyst)**:
    *   *Actor*: Con người.
    *   *Nhiệm vụ*: Thiết kế phân hệ logic, luồng dữ liệu, viết tài liệu SRS chi tiết.
4.  **ARCH (Solution Architect)**:
    *   *Actor*: Con người + Strategic AI.
    *   *Nhiệm vụ*: Đưa ra quyết định công nghệ (ADR), thiết kế kiến trúc bảo mật và NFRs.
5.  **BE (BE Developer/DBA)**:
    *   *Actor*: BE Agent.
    *   *Nhiệm vụ*: Viết APIs contract, thiết kế DB Schema (DDL) và lập trình logic nghiệp vụ backend.
6.  **FE (FE Developer)**:
    *   *Actor*: FE Agent.
    *   *Nhiệm vụ*: Phát triển giao diện, thiết kế UI/UX flows và tích hợp API backend.
7.  **QA (Quality Assurance)**:
    *   *Actor*: QA Agent.
    *   *Nhiệm vụ*: Viết Test Cases, chạy tự động hóa kiểm thử và phát hiện lỗi.
8.  **DEVOPS (DevOps / SRE)**:
    *   *Actor*: DevOps Agent.
    *   *Nhiệm vụ*: Setup môi trường, cấu hình Docker/K8s, CI/CD, theo dõi SLOs và xử lý sự cố.
---
id: DEVOPS-DEP-[PROJECT]-[COMPONENT]-[NUMBER]
# For mds-core/global deployments: CORE-DEVOPS-DEP-[NAME]-V[VERSION]
title: "DEP: [Tên Đặc Tả Triển Khai]"
phase: "07"                          # Phase 07: Deployment & Operations

# Layer 1 — Lifecycle State (Độ chín muồi của tài liệu - Documentation Maturity)
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED

# Layer 2 — Execution State (Trạng thái vận hành thực tế của công việc viết tài liệu)
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
blocked_reason: ""               # Must be non-empty iff execution_state = BLOCKED

# Criticality & Priority
document_priority: CRITICAL | HIGH | MEDIUM | LOW

# Inheritance Contract
schema_version: MDS-DEVOPS-DEP-1.0
inherits_from: CORE-BASE-TEMPLATE-GUIDE-V1.1

# Deployment Metadata
environment: DEV | SIT | UAT | PROD
deployment_strategy: ROLLING | BLUE_GREEN | CANARY | SHADOW | FEATURE_FLAG | AB_TESTING
rollback_strategy: AUTOMATIC | SEMI_AUTOMATIC | MANUAL
deployment_owner: "devops_agent | ops_agent"
automation_supported: true | false
deployment_target: DOCKER | KUBERNETES | ECS | AKS | GKE | VM | BARE_METAL
cloud_provider: AWS | GCP | AZURE | ALIBABA | PRIVATE_CLOUD | ON_PREMISE
container_runtime: DOCKER | CONTAINERD | NONE
orchestrator: KUBERNETES | NOMAD | DOCKER_SWARM | NONE
artifact_repository: NEXUS | ARTIFACTORY | GITHUB_PACKAGES | NONE
registry: ECR | GCR | GITHUB_REGISTRY | PRIV_REGISTRY

# Approval Chain
reviewed_by: ""                  # Ghi nhận role review (ví dụ: arch_agent)
approved_by: ""                  # Ghi nhận role approve (ví dụ: product_owner)
approved_at: YYYY-MM-DD          # Ngày phê duyệt chính thức

version: X.Y.Z
owner: devops_agent                  # Allowed: devops_agent | ops_agent
created_by: devops_agent             # Allowed: devops_agent | ops_agent
created_at: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_synchronized: YYYY-MM-DD
tags: [devops, deployment, runner]

# Mối quan hệ liên kết đồ thị tri thức (Outbound Links)
links:
  - type: implements             # Hiện thực hóa yêu cầu nghiệp vụ/hạ tầng từ REQ
    target: BA-REQ-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: adheres_to             # Tuân thủ quyết định kiến trúc / thiết kế bảo mật
    target: ARCH-ADR-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Phụ thuộc vào service nào cần triển khai
    target: BE-SRV-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Phụ thuộc vào database schema tương ứng
    target: BE-DB-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Phụ thuộc vào tài liệu hạ tầng (ví dụ: terraform)
    target: DEVOPS-INFRA-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Phụ thuộc vào tài liệu cấu hình môi trường
    target: DEVOPS-CFG-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Phụ thuộc vào tài liệu giám sát vận hành
    target: DEVOPS-MON-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: tested_by              # Được xác thực bởi Deployment/Rollout Test Case nào
    target: QA-TC-[PROJECT]-[COMPONENT]-[NUMBER]
---

> **Status**: CANONICAL_TEMPLATE
> **Version**: DEP_TEMPLATE_V1.0
> **Compatibility**: MDS >= 1.0
>
> **MDS DevOps Deployment Traceability**:
> ```text
> ARCH-ADR
>   │ adheres_to
>   ▼
> BE-SRV ── deployed_by ──► DEVOPS-DEP
>                              │
>           ┌──────────────────┼──────────────────┐
>           ▼                  ▼                  ▼
>         BE-DB          DEVOPS-INFRA        DEVOPS-CFG
>           │
>           ▼
>         QA-TC
>           │
>           ▼
>       DEVOPS-MON
> ```

# Deployment Specification: [Tên Hệ Thống / Phân Hệ]

## 0. Tổng Quan Triển Khai (Deployment Overview)

*   **Hệ thống mục tiêu (Target System)**: [Ví dụ: Phân hệ hóa đơn EduMeet - Billing Module]
*   **Môi trường triển khai (Environment)**: DEV | SIT | UAT | PROD
*   **Nền tảng hạ tầng (Target Platform)**: AWS EKS | GCP GKE | Azure AKS | On-Premise VM
*   **Phương thức quản lý (Management)**: GitOps (ArgoCD) | Helm Charts | Docker Compose | Terraform
*   **Vai trò chịu trách nhiệm (Deployment Owner)**: devops_agent | ops_agent

---

## 1. Sơ Đồ Kiến Trúc Triển Khai (Deployment Architecture)

Mô tả mô hình vận hành và phân phối các container/runtimes vật lý bằng sơ đồ Mermaid.js:

```mermaid
graph TD
    %% Khai báo CI/CD & Registry
    Git["GitHub Repo"] -->|Trigger Pipeline| Runner["GitHub Runner"]
    Runner -->|Build & Push Image| Registry[("Amazon ECR / Private Registry")]
    
    %% Khai báo Kubernetes cluster
    subgraph Target Kubernetes Cluster
        Argo["ArgoCD Controller"] -->|Pull Config & Apply| K8sAPI["K8s API Server"]
        Registry -->|Pull Images| Pods["Billing App Pods (Replica x3)"]
        
        subgraph Pod Network
            Ingress["AWS ALB Ingress Controller"] -->|HTTPS Inbound| Pods
            Pods -->|Read/Write Database| DB[(PostgreSQL Aurora)]
            Pods -->|Read/Write Cache| Redis[("Redis ElastiCache")]
        </div>
    end
```

---

## 2. Đặc Tả Artifact Triển Khai (Deployment Artifacts)

Quản lý danh sách các sản phẩm (Artifacts) được sinh ra hoặc sử dụng trong quá trình triển khai:

| Tên Artifact | Kiểu Định Dạng | Sinh Ra Bởi (Produced By) | Sử Dụng Bởi (Used By) | Kho Lưu Trữ (Repository) | Phiên Bản Mẫu (Example Version) |
| :--- | :---: | :--- | :--- | :--- | :---: |
| `billing-service-image` | Docker Image | GitHub Action Runner | Kubernetes Nodes / Kubelet | Amazon ECR | `sha256-a9f3b1...` / `v1.2.0` |
| `billing-chart` | Helm Chart | CI Pipeline Chart Releaser | ArgoCD / Kubernetes Cluster | ChartMuseum / Github Packages | `1.2.0` |
| `db-migration-script` | SQL Script | Prisma/Flyway Migration Job | Kubernetes Init Container | Git Repo / S3 Bucket | `v1_20260706_add_invoice_tables` |
| `infra-terraform-plan` | TF State File | Terraform CI Pipeline | Terraform Cloud / AWS S3 | S3 State Bucket | `plan_id_4492` |

---

## 3. Điều Kiện Tiên Quyết (Prerequisites)

Khai báo các công cụ CLI, quyền hạn truy cập, thiết lập mạng và trạng thái hạ tầng bắt buộc:

### 3.1 Phiên bản công cụ dòng lệnh (CLI Tools)
*   `kubectl` version `>= 1.25`
*   `helm` version `>= 3.10.0`
*   `aws-cli` version `>= 2.7.0` (được cấu hình đúng credentials)

### 3.2 Quyền hạn hạ tầng (Permissions & Access)
*   Quyền `ClusterAdmin` hoặc quyền ghi đối với K8s namespace `billing`.
*   Quyền `AmazonECRReadOnlyAccess` cho Kubernetes Node IAM Role để kéo Docker image.
*   Quyền đọc Secrets trong AWS Secrets Manager (`GetSecretValue`).

---

## 4. Ma Trận Môi Trường (Environment Matrix)

Bảng cấu hình các thông số đặc thù cho từng môi trường triển khai:

| Môi Trường (Env) | Địa Chỉ Truy Cập (URL) | Kubernetes Namespace | Cluster / Context Name | Số Lượng Instance (Replicas) | Tự Động Co Giãn (Autoscaling) | Cổng Ingress Controller | Chứng Chỉ TLS (Cert Manager) |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| **DEV** | `https://dev-billing.edumeet.com` | `billing-dev` | `eks-dev-cluster` | `1` | None | AWS ALB Ingress (External) | Self-signed Let's Encrypt |
| **SIT** | `https://sit-billing.edumeet.com` | `billing-sit` | `eks-staging-cluster`| `2` | HPA: CPU > 80% (Min 2, Max 4) | AWS ALB Ingress (External) | Let's Encrypt Production |
| **UAT** | `https://uat-billing.edumeet.com` | `billing-uat` | `eks-staging-cluster`| `2` | HPA: CPU > 75% (Min 2, Max 6) | AWS ALB Ingress (Internal) | Let's Encrypt Production |
| **PROD** | `https://billing.edumeet.com` | `billing-prod` | `eks-prod-cluster` | `3` | HPA: CPU > 70% (Min 3, Max 10)| AWS ALB Ingress (External) | Wildcard Sectigo SSL |

---

## 5. Chiến Lược Triển Khai (Deployment Strategy)

Quy định hành vi cập nhật phiên bản, định cấu hình lưu lượng và quản lý downtime:

*   **Chiến lược áp dụng (Strategy)**: CANONICAL_ROLLING | BLUE_GREEN | CANARY | SHADOW | FEATURE_FLAG | AB_TESTING
    *(Mặc định cho môi trường PROD: `CANARY` kết hợp `ROLLING`).*
*   **Tham số Canary (Canary Rollout Parameters)**:
    - **Bước 1**: Triển khai `10%` lượng Traffic sang phiên bản mới (Canary Pods), duy trì kiểm tra logs trong 15 phút.
    - **Bước 2**: Tăng dần lên `30%`, `50%`, `100%` traffic nếu không phát hiện cảnh báo lỗi 5xx.
*   **Thời gian gián đoạn mục tiêu (Downtime SLA)**: `0 seconds` (Zero Downtime Deployment).
*   **Cơ chế định tuyến lưu lượng (Traffic Routing)**: Sử dụng AWS Ingress ALBs kết hợp với Target Groups weighted traffic routing.

---

## 6. Luồng Pipeline Triển Khai (Deployment Pipeline)

Quy trình tự động hóa đi qua 4 pha chính để đưa mã nguồn lên môi trường Production:

```mermaid
flowchart LR
    subgraph Phase_CI [1. CI (Build/Test)]
        Commit["Git Commit"] --> Build["Code Build"]
        Build --> Unit["Unit/Integration Test"]
    end

    subgraph Phase_Artifact [2. Artifact Package]
        Unit --> ImageBuild["Docker Image Build"]
        ImageBuild --> Sign["Sign Image (Cosign)"]
        Sign --> Push["Push to ECR"]
    end

    subgraph Phase_CD [3. CD (Deploy)]
        Push --> GitOps["ArgoCD Sync Trigger"]
        GitOps --> K8sDeploy["kubectl rollout / Helm upgrade"]
    end

    subgraph Phase_Verify [4. Verification]
        K8sDeploy --> Postflight["Post-flight Checks"]
        Postflight --> Smoke["Automated Smoke Test"]
    end
```

### 6.1 Đặc tả chi tiết các bước
1.  **Pha CI**: Runner chạy trên môi trường sandbox, thực thi kiểm thử và bảo mật code (SAST/Snyk).
2.  **Pha Artifact**: Đóng gói image, chạy quét lỗ hổng bảo mật (Trivy), ký mã nguồn và đẩy file Helm Chart lên Registry.
3.  **Pha CD**: ArgoCD phát hiện thay đổi trên GitOps repo và tự động kích hoạt quá trình rollout trong cụm K8s.
4.  **Pha Verification**: Chạy kiểm tra pod liveness/readiness, thực hiện chạy di cư database (Migrate DB) và chạy kịch bản smoke tests.

---

## 7. Cấu Hình & Quản Lý Bí Mật (Configuration & Secrets)

Quy định cơ chế quản lý biến môi trường, bảo vệ thông tin mật và kiểm tra trôi dạt cấu hình (Config Drift):

### 7.1 Mật mã & Biến cấu hình (Secrets & Config Map)
*   **Secrets Storage**: Sử dụng AWS Secrets Manager và đồng bộ trực tiếp vào Pod thông qua **External Secrets Operator (ESO)** của Kubernetes.
*   **Configuration Drift Control**: ArgoCD chạy kiểm tra tự động mỗi 10 phút. Nếu phát hiện cấu hình thực tế trong cluster bị thay đổi thủ công (drift) so với GitOps Repository, ArgoCD sẽ tự động ghi đè (Auto-Sync & Self-Heal) để khôi phục cấu hình canonical.
*   **Config Checksum / Versioning**: File Deployment chứa thuộc tính Annotation `config-checksum: "${SHA256_HASH_OF_CONFIG_MAP}"` để bắt buộc Kubernetes phải restart lại toàn bộ Pods khi có sự thay đổi biến cấu hình.

---

## 8. Kịch Bản Khôi Phục & Rollback (Rollback Strategy)

Quy trình tự động hoặc thủ công hoàn trả hệ thống về trạng thái ổn định gần nhất khi triển khai thất bại:

### 8.1 Ngưỡng kích hoạt Rollback tự động (Automatic Rollback Triggers)
Hệ thống giám sát APM tự động kích hoạt lệnh rollback khi phát hiện:
*   Tỷ lệ phản hồi lỗi HTTP 5xx vượt quá **`5%`** trong vòng 3 phút liên tục.
*   Container bị rơi vào trạng thái `CrashLoopBackOff` và không thể vượt qua Readiness probe trong 5 phút.
*   Độ trễ trung bình của API (p99 latency) tăng đột biến vượt quá **`2000ms`** kể từ khi deploy.

### 8.2 Kịch bản các bước rollback (Rollback Execution Steps)
*   **Rollback SLA**: Hoàn tất khôi phục hệ thống về phiên bản cũ dưới **300 seconds (5 minutes)**.
*   **Cú pháp Rollback khẩn cấp**:
```bash
# Đối với deploy qua Helm
helm rollback billing-service [REVISION_NUMBER] -n billing-prod

# Đối với deploy qua Kubectl Deployment gốc
kubectl rollout undo deployment/billing-service -n billing-prod
```
*   **Kịch bản Bù trừ dữ liệu (Data Rollback/Compensation)**:
    - Nếu Database schema đã bị migrate lên phiên bản mới nhưng code bị rollback: Bắt buộc chạy script migration down tương ứng (Flyway/Prisma Down) hoặc chuyển sang dùng cơ chế tương thích ngược (Expand and Contract pattern).

---

## 9. Thẩm Định Triển Khai (Verification - Pre/Post Flight)

Quy trình kiểm thử an toàn trước, trong và sau khi triển khai:

| Lớp Kiểm Tra (Verification Layer) | Thời Điểm (When) | Tên Phép Kiểm (Verification Task) | Phương Thức / Cú Pháp Thực Hiện | Kỳ Vọng Đạt Được (Expected State) |
| :--- | :---: | :--- | :--- | :--- |
| **Infrastructure** | Pre-deployment | Kiểm tra dung lượng tài nguyên cụ thể của Node | `kubectl describe nodes` | Đủ CPU/RAM rảnh để deploy Pod mới. |
| **Infrastructure** | Post-deployment| Kiểm tra trạng thái Pods vật lý | `kubectl get pods -n billing-prod` | Trạng thái Pod là `Running` và `Ready`. |
| **Application** | Post-deployment| Kiểm tra kết nối cơ sở dữ liệu | `kubectl logs deployment/billing-service` | Logs ghi nhận: `Database Connection Established`. |
| **Application** | Post-deployment| Kiểm tra Liveness & Readiness endpoints | `curl -f http://[POD_IP]:3000/health/readiness` | Phản hồi HTTP Status `200 OK`. |
| **Business** | Post-deployment| Thực hiện giao dịch thử nghiệm | `curl -f -X POST http://[POD_IP]:3000/api/v1/payments/test` | Trả về `success: true` và ghi nhận transaction ID. |

---

## 10. Kịch Bản Kiểm Thử Khói (Smoke Tests)

Kịch bản kiểm tra nhanh sau triển khai để xác định dịch vụ cốt lõi có sẵn sàng phục vụ người dùng hay không:

*   **SMOKE-001 (Automated Check Liveness)**: Chạy script curl tự động kiểm tra Liveness endpoint của app.
*   **SMOKE-002 (Automated DB Query Ping)**: Gọi API nội bộ kiểm tra khả năng đọc/ghi ví của Database.
*   **SMOKE-003 (Manual Webhook Verification)**: [Dành cho vận hành thủ công] Giả lập một HTTP webhook event từ Stripe gửi về endpoint để đảm bảo luồng routing hoạt động đúng.
*   **SMOKE-004 (Automated Cache Hit)**: Thực hiện gọi API đọc cấu hình ví, kiểm tra xem dữ liệu có được ghi nhận đúng vào Redis cache hay không.

---

## 11. Giám Sát & Cảnh Báo SRE (Monitoring & Alerts)

Thiết lập đo lường và theo dõi các chỉ số sức khỏe của service trên môi trường Production:

### 11.1 Các Chỉ số SRE (SLI, SLO & Error Budget)
*   **Service Level Indicator (SLI)**: Tỷ lệ các API request thành công (HTTP status không phải 5xx) trên tổng số requests.
*   **Service Level Objective (SLO)**: Đạt tối thiểu **`99.9%`** request thành công trong chu kỳ trượt 30 ngày.
*   **Error Budget**: Cho phép tối đa **`0.1%`** request lỗi trong 30 ngày. Nếu vượt quá, đóng băng toàn bộ tính năng mới để tập trung sửa lỗi (Error Budget Exhausted policy).

### 11.2 Thông tin Vận Hành Cứu Hộ
*   **Dashboard URL**: `https://grafana.edumeet.com/d/billing-dashboard`
*   **Runbook Link**: `https://wiki.edumeet.com/ops/runbooks/billing-deployment-incident`
*   **Alert Owner / Escalation**: Slack channel `#ops-billing-alerts` / DevOps Lead Phone: `+84-123456789`.

---

## 12. Khối Cấu Hình Triển Khai Máy Đọc (Machine-Readable Deployment Contract)

Khối cấu hình YAML giúp các AI Agents tự động sinh file pipeline (GitHub Actions/GitLab CI yaml), thiết lập Helm values và tự động sinh cấu hình giám sát:

```yaml
deployment_contract:
  schema_version: MDS-DEVOPS-DEP-1.0
  id: DEVOPS-DEP-[PROJECT]-[COMPONENT]-[NUMBER]
  metadata:
    environment: prod
    cloud_provider: aws
    deployment_target: kubernetes
  artifacts:
    - name: billing-service-image
      type: docker_image
      registry: 123456789.dkr.ecr.ap-southeast-1.amazonaws.com
    - name: billing-chart
      type: helm_chart
      repository: chartmuseum.edumeet.com
  environment_matrix:
    replicas: 3
    autoscaling:
      enabled: true
      min_pods: 3
      max_pods: 10
      cpu_threshold: 70
    ingress:
      controller: aws-alb
      tls:
        enabled: true
        cert_manager_cluster_issuer: letsencrypt-prod
  strategy:
    type: canary
    parameters:
      canary_steps: [10, 30, 50, 100]
      step_duration_minutes: 15
      rollback_sla_seconds: 300
  configuration:
    secrets_provider: aws_secrets_manager
    config_drift:
      auto_sync: true
      self_heal: true
    annotations:
      trigger_restart_on_config_change: true
  observability:
    dashboard_url: https://grafana.edumeet.com/d/billing-dashboard
    runbook_url: https://wiki.edumeet.com/ops/runbooks/billing-deployment-incident
    slo:
      availability_percent: 99.9
      latency_p95_ms: 150
  alerts:
    channel: "#ops-billing-alerts"
    triggers:
      error_rate_5xx_percent: 5
      duration_seconds: 180
```

---

## 13. Bảng Tự Kiểm Tra Chất Lượng Triển Khai (DevOps DEP Quality Checklist)

- [ ] ID thực thể đúng chuẩn `DEVOPS-DEP-[PROJECT]-[COMPONENT]-[NUMBER]` hoặc `CORE-DEVOPS-DEP-[NAME]-V[VERSION]`.
- [ ] Khai báo đầy đủ thuộc tính hạ tầng ở Frontmatter (`deployment_target`, `cloud_provider`, `orchestrator`, `registry`).
- [ ] Link `depends_on` trỏ chính xác về Backend Service (`BE-SRV`) và Database Schema (`BE-DB`) liên quan.
- [ ] Graph Traceability đầy đủ: `ARCH-ADR → BE-SRV → DEVOPS-DEP → BE-DB / DEVOPS-INFRA / DEVOPS-CFG → QA-TC → DEVOPS-MON`.
- [ ] Đặc tả đầy đủ danh sách Deployment Artifacts ở Mục 2 kèm phiên bản mẫu rõ ràng.
- [ ] Khai báo đầy đủ các thông số ma trận môi trường ở Mục 4 bao gồm: Replicas, HPA, Ingress, và TLS.
- [ ] Lựa chọn rõ ràng Deployment Strategy ở Mục 5 và thiết lập các tham số chuyển tiếp traffic (Canary steps/weights).
- [ ] Phân chia luồng Deployment Pipeline (Mục 6) thành 4 pha trực quan: CI ➔ Artifact ➔ CD ➔ Verification.
- [ ] Cơ chế Config Drift Control được làm rõ ở Mục 7 và không chứa bất kỳ Hardcoded Secrets nào trong repo.
- [ ] Khai báo cụ thể Rollback Triggers (Mục 8.1), Rollback Steps (Mục 8.2) và Rollback SLA dưới 5 phút.
- [ ] Phép kiểm Verification (Mục 9) được phân tầng đầy đủ 3 lớp: Infrastructure, Application, và Business.
- [ ] Phân định rõ ràng các kịch bản Smoke Tests (Mục 10) là tự động (Automated) hay thủ công (Manual).
- [ ] Thiết lập đầy đủ chỉ số SRE (SLI/SLO/Error Budget) ở Mục 11 cùng link Runbook, Dashboard và số điện thoại Escalation.
- [ ] Artifact checksum, image signatures, SBOM generation, và vulnerability scanning được cấu hình đầy đủ ở pipeline CD.
- [ ] Khối YAML `deployment_contract` máy đọc được biên dịch hợp lệ không chứa Tab và đúng cấu trúc.
- [ ] **Controlled Tech Leakage Check**: Cho phép rò rỉ tên Kubernetes objects (namespaces, deployment names, annotations, Helm keys) nhưng cấm tuyệt đối rò rỉ thông tin hạ tầng vật lý cụ thể (AWS account IDs, Kubernetes control plane URLs, Access/Secret Keys, production passwords).
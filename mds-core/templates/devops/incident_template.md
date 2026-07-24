---
id: DEVOPS-INC-[PROJECT]-[COMPONENT]-[NUMBER]
# For mds-core/global incidents: CORE-DEVOPS-INC-[NAME]-V[VERSION]
title: "[Tên Sự Cố Vận Hành]"
project: "[project-id]"
phase: "08"                          # Phase 08: Operations & Maintenance

# Layer 1 — Lifecycle State (Độ chín muồi của tài liệu - Documentation Maturity)
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED

# Layer 2 — Execution State (Trạng thái vận hành thực tế của công việc viết tài liệu)
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
blocked_reason: ""               # Must be non-empty iff execution_state = BLOCKED

# Criticality & Priority
document_priority: CRITICAL | HIGH | MEDIUM | LOW

# Inheritance Contract
schema_version: MDS-DEVOPS-INC-1.0
inherits_from: CORE-BASE-TEMPLATE-GUIDE-V1.1

# Incident Metadata
severity_level: P0 | P1 | P2 | P3
incident_status: INVESTIGATING | MITIGATED | RESOLVED
incident_type: AVAILABILITY | PERFORMANCE | SECURITY | DATA_LOSS | CONFIGURATION | DEPLOYMENT | INFRASTRUCTURE | THIRD_PARTY
incident_date: YYYY-MM-DD
mttd_minutes: [Time from occurrence to detection, e.g. 15]
mttm_minutes: [Time from detection to mitigation, e.g. 20]
mttr_minutes: [Time from detection to full resolution, e.g. 120]
sla_breached: true | false

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
tags: [devops, incident, rca, postmortem]

# Mối quan hệ liên kết đồ thị tri thức (Outbound Links)
links:
  - type: depends_on             # Dịch vụ bị lỗi/ảnh hưởng trực tiếp
    target: BE-SRV-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Runbook đã áp dụng để cứu hộ
    target: DEVOPS-RUN-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Tài liệu giám sát phát hiện sự cố
    target: DEVOPS-MON-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: tested_by              # Được xác thực lại bởi Test Case nào sau khi fix
    target: QA-TC-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Trỏ đến code task / fix task tương ứng
    target: PM-TSK-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Bản deploy chứa bản vá lỗi (nếu có)
    target: DEVOPS-DEP-[PROJECT]-[COMPONENT]-[NUMBER]
---

> **Status**: CANONICAL_TEMPLATE
> **Version**: INC_TEMPLATE_V1.0
> **Compatibility**: MDS >= 1.0
>
> **MDS DevOps Incident Traceability**:
> ```text
> ARCH-ADR
>       │
>       ▼
> BE-SRV
>       │
>       ▼
> DEVOPS-INC
>       │
>  ┌────┼───────────────┐
>  ▼    ▼               ▼
> DEVOPS-RUN      DEVOPS-MON      QA-TC
>       │               │
>       └──────┬────────┘
>              ▼
>          PM-TSK
>              │
>              ▼
>         DEVOPS-DEP
> ```

# Incident & RCA Report: [Tên Sự Cố]

## 0. Tổng Quan Sự Cố (Incident Overview)

*   **Tên sự cố**: `billing-service wallet deduction failure`
*   **Môi trường (Environment)**: Production (PROD)
*   **Mức độ nghiêm trọng (Severity)**: P0 (Core payment block) | P1 | P2 | P3
*   **Loại sự cố (Incident Type)**: AVAILABILITY | PERFORMANCE | SECURITY | DATA_LOSS | CONFIGURATION | DEPLOYMENT | INFRASTRUCTURE | THIRD_PARTY
*   **Người chịu trách nhiệm xử lý (Incident Commander)**: devops_agent
*   **Ngày xảy ra sự cố (Incident Date)**: YYYY-MM-DD
*   **Thời gian phát hiện (Detection Time)**: HH:MM:SS UTC+7
*   **Thời gian khôi phục tạm thời (Mitigation Time)**: HH:MM:SS UTC+7
*   **Thời gian xử lý triệt để (Resolution Time)**: HH:MM:SS UTC+7
*   **Mô tả tóm tắt**: [Mô tả ngắn gọn sự cố, ví dụ: Học viên không thể thực hiện trừ tiền ví khi đăng ký khóa học, hệ thống liên tục trả về lỗi timeout từ Database].

---

## 1. Đánh Giá Tác Động (Impact Assessment)

Bảng thống kê phạm vi và mức độ ảnh hưởng thực tế đối với người dùng và doanh nghiệp:

| Chỉ số tác động (Scope) | Giá trị thực tế (Actual Value) | Ghi chú chi tiết (Detail) |
| :--- | :--- | :--- |
| **Số lượng người dùng bị ảnh hưởng (Users affected)** | `1,250` học viên | Học viên nhấn nút thanh toán bị treo hoặc báo lỗi lỗi 500. |
| **Dịch vụ bị ảnh hưởng (Services affected)** | `billing-service`, `gateway-service` | Toàn bộ API thanh toán ví của billing-service bị gián đoạn. |
| **Thời gian gián đoạn (Downtime)** | `45 minutes` | Hệ thống không thể xử lý thanh toán từ 10:15 đến 11:00. |
| **Tác động doanh thu (Revenue impact)** | `~12,500,000 VND` | Mất mát cơ hội doanh thu từ các giao dịch thanh toán bị hủy. |
| **Mất mát dữ liệu (Data loss)** | `None` | Không có dữ liệu giao dịch bị mất, các transaction bị rollback thành công. |
| **Tác động bảo mật (Security impact)** | `None` | Không phát hiện rò rỉ dữ liệu hoặc xâm nhập trái phép. |

---

## 2. Dòng Thời Gian Chi Tiết (Timeline & Chronology)

Ghi nhận trình tự thời gian diễn tiến của sự cố, thời gian tương đối (Elapsed Time) và các hành động xử lý:

| Thời Gian (Time) | Thời Gian Tương Đối (Elapsed) | Sự Kiện / Hành Động Xử Lý (Event / Action) | Ghi Chú / Bằng Chứng (Evidence) |
| :--- | :--- | :--- | :--- |
| **10:15:00** | `T+0` | Sự cố phát sinh. Database Aurora Postgres bị khóa ghi trên bảng ví do tranh chấp. | Metric `DBConnectionLockTime` tăng đột biến. |
| **10:20:00** | `T+5m` | AlertManager nổ cảnh báo tỷ lệ lỗi 5xx trên billing-service vượt 5%. | Cảnh báo Slack gửi tới kênh `#ops-billing-alerts`. (MTTD = 5m) |
| **10:25:00** | `T+10m` | Kỹ sư trực ca (On-call) tiếp nhận và bắt đầu điều tra logs. | Ghi nhận trace-id lỗi `LOCK_ACQUISITION_TIMEOUT`. |
| **10:35:00** | `T+20m` | Phát hiện Lock do query đối soát chạy ngầm chiếm dụng table lock. | Chạy query `pg_stat_activity` tìm lock owner. |
| **10:45:00** | `T+30m` | Thực hiện kill transaction gây khóa bảng bằng tay để giải phóng ví. | Chạy lệnh `pg_terminate_backend(pid)`. (MTTM = 25m) |
| **11:00:00** | `T+45m` | Database hồi phục hoàn toàn, chạy deploy hotfix tắt tính năng lock đối soát giờ cao điểm. | Deploy thành công bản vá `DEVOPS-DEP-002`. (MTTR = 45m) |

*   **Tóm tắt các chỉ số SRE**:
    - **MTTD (Mean Time to Detect)**: `5 minutes`
    - **MTTM (Mean Time to Mitigate)**: `25 minutes`
    - **MTTR (Mean Time to Resolve)**: `45 minutes`

---

## 3. Phân Tích Nguyên Nhân Gốc Rễ (5 Whys Root Cause Analysis)

Phương pháp phân tích truy vấn 5 lần "Tại sao" để tìm ra lỗi hệ thống hoặc lỗ hổng quy trình:

1.  **Tại sao** học viên không thể thanh toán trừ tiền ví?
    - *Vì hệ thống billing-service bị timeout khi cố gắng ghi đè database.*
2.  **Tại sao** database bị timeout khi ghi đè?
    - *Vì bảng `tbl_billing_accounts` bị khóa ghi (Pessimistic Lock) bởi một tiến trình khác.*
3.  **Tại sao** tiến trình khác khóa bảng ví?
    - *Vì tiến trình đối soát ví chạy ngầm (audit cron job) khởi chạy lúc 10:15 đang chạy câu lệnh SELECT FOR UPDATE trên toàn bộ bảng.*
4.  **Tại sao** audit cron job lại chạy SELECT FOR UPDATE trên toàn bộ bảng ví vào giờ cao điểm?
    - *Vì cron schedule được đặt cố định chạy mỗi 60 phút mà không có logic giới hạn phân trang (batching) và không tránh giờ tải cao.*
5.  **Tại sao** cấu hình cron job thiếu phân trang và không tránh giờ tải cao lại được merge lên production?
    - **Nguyên nhân gốc rễ (Root Cause)**: *Quy trình Review thiết kế cấu hình (DevOps-CFG) và kiểm thử tải (Performance Test) cho các tác vụ nền chạy ngầm chưa được quy chuẩn hóa trong checklist duyệt release.*

*   **Phân loại nguyên nhân chính (RCA Class)**: CODE | CONFIG | INFRA | DATABASE | HUMAN | PROCESS | DOCUMENTATION | MONITORING | THIRD_PARTY

---

## 4. Các Yếu Tố Ảnh Hưởng & Kích Hoạt (Contributing Factors & Trigger)

*   **Trigger (Tác nhân kích hoạt)**: Tiến trình audit cron job tự động kích hoạt vào lúc 10:15 khi lượng học viên truy cập thanh toán khóa học đang đạt đỉnh.
*   **Primary Cause (Nguyên nhân chính)**: Sử dụng câu lệnh khóa độc quyền (Exclusive Row Lock) trên diện rộng mà không giải phóng bộ nhớ nhanh, gây nghẽn Connection Pool DB.
*   **Contributing Factors (Yếu tố ảnh hưởng)**:
    - Thiếu cơ chế timeout cho câu lệnh lock DB ở phía application (chờ vô hạn).
    - Cảnh báo (Alert threshold) về Database Lock Wait Time quá cao mới nổ (đặt ngưỡng 10s, cần hạ xuống 3s).

---

## 5. Kế Hoạch Khắc Phục & Phòng Ngừa (Action Items)

Danh sách các tác vụ bắt buộc thực thi để sửa lỗi và ngăn ngừa sự cố lặp lại:

| ID Tác Vụ | Loại Hành Động (Action Type) | Mô Tả Tác Vụ Chi Tiết (Action Description) | Mức Ưu Tiên | Người Nhận (Owner) | Hạn Hoàn Thành | Trạng Thái | Linked Task ID |
| :--- | :---: | :--- | :---: | :--- | :---: | :---: | :--- |
| `ACT-001` | **Mitigation** | Giải phóng DB lock bằng cách kill backend PID thủ công trên cụm DB. | HIGH | devops_agent | Ngay lập tức | `DONE` | `PM-TSK-BILL-101` |
| `ACT-002` | **Permanent Fix** | Sửa mã nguồn cron job đối soát ví sang cơ chế phân trang (batch size = 100) và không dùng lock. | HIGH | dev_agent | YYYY-MM-DD | `DONE` | `PM-TSK-BILL-102` |
| `ACT-003` | **Preventive** | Thêm test case kiểm thử tải DB Lock chéo giữa API và Cron Job. | MEDIUM | qa_agent | YYYY-MM-DD | `VERIFIED`| `PM-TSK-BILL-103` |
| `ACT-004` | **Preventive** | Hạ cấu hình cảnh báo DB Lock Wait Time trên Prometheus từ 10s xuống 3s. | MEDIUM | devops_agent | YYYY-MM-DD | `OPEN` | `PM-TSK-BILL-104` |

---

## 6. Bài Học Kinh Nghiệm (Lessons Learned)

*   **Những điểm đã làm tốt (What worked)**:
    - Đội ngũ trực ca on-call phản ứng rất nhanh (5 phút kể từ khi nổ alert).
    - Hệ thống rollback deployment tự động hoạt động đúng thiết kế khi deploy hotfix.
*   **Những điểm làm chưa tốt (What failed)**:
    - Không có runbook hướng dẫn cụ thể về việc kill query lock DB, dẫn đến mất 10 phút để tra cứu lệnh.
    - Thiếu dashboard giám sát chi tiết về các locked queries trên Grafana.
*   **Điều gây bất ngờ (What surprised us)**:
    - Số lượng connection bị chiếm dụng bởi locked query tăng tuyến tính quá nhanh làm tê liệt liveness probe của ứng dụng.

---

## 7. Cập Nhật Tài Liệu Vận Hành (Documentation Updates)

Đăng ký cập nhật tài liệu để lưu giữ tri thức sau sự cố:

| Loại Tài Liệu | File / Đường Dẫn Tài Liệu | Trạng Thái Cập Nhật | Ghi Chú Nội Dung |
| :--- | :--- | :---: | :--- |
| **Runbook** | `DEVOPS-RUN-[PROJECT]-DB-TROUBLESHOOT` | `UPDATED` | Bổ sung phần xử lý và kill locked queries khẩn cấp. |
| **Alert Rules** | `DEVOPS-MON-[PROJECT]-ALERTS-CONFIG` | `UPDATED` | Bổ sung alert `DBLockWaitTimeTooHigh` (ngưỡng 3s). |
| **Playbook** | `DEVOPS-RUN-[PROJECT]-BILLING-POSTMORTEM`| `CREATED` | Tạo mới playbook phản ứng nhanh khi có timeout thanh toán. |

---

## 8. Đánh Giá Hổng Giám Sát (Observability Gaps)

*   **Lỗ hổng Alert (Alert Gaps)**: Cảnh báo Lock DB chỉ được cấu hình gửi về email chung, không cấu hình bắn về Slack/PagerDuty gây trễ thời gian phát hiện.
*   **Lỗ hổng Telemetry (Missing Telemetry)**:
    - **Missing Logs**: Nhật ký database không ghi nhận chi tiết query nào đang giữ lock ở thời điểm nghẽn.
    - **Missing Metrics**: Chưa thu thập metric đếm số lượng transaction bị Blocked ở tầng database.
    - **Missing Traces**: Trace ID không được forward thành công qua database driver, gây khó khăn cho việc truy tìm API nguồn gây lock.

---

## 9. Khối Cấu Hình Sự Cố Máy Đọc (Machine-Readable Incident Contract)

Khối YAML mô tả cấu trúc sự cố, các mốc thời gian SRE và các hành động khắc phục giúp AI agent tự động phân tích và cập nhật Dashboard:

```yaml
incident_contract:
  schema_version: MDS-DEVOPS-INC-1.0
  id: DEVOPS-INC-[PROJECT]-[COMPONENT]-[NUMBER]
  metadata:
    severity: P0
    status: resolved
    type: database
    incident_date: "2026-07-06"
  metrics:
    mttd_minutes: 5
    mttm_minutes: 25
    mttr_minutes: 45
    sla_breached: false
  impact:
    users_affected: 1250
    downtime_minutes: 45
    revenue_loss_estimated: 12500000
    data_loss: false
  root_cause:
    category: database
    primary_cause: "Pessimistic write lock blocking database connection pool"
    5_whys:
      - "Timeout on write transactions"
      - "Table locked by background audit cron job using SELECT FOR UPDATE"
      - "Audit job ran query without pagination on massive table"
      - "Cron schedule set to run hourly during peak production hours"
      - "Review checklist for background tasks configuration was missing in release pipeline"
  contributing_factors:
    - "No lock timeout in database driver"
    - "DB Lock Wait Time alert threshold set too high (10s)"
  lessons:
    what_worked:
      - "Fast on-call engineer detection within 5m"
    what_failed:
      - "Lack of diagnostic runbooks for DB locks"
    what_surprised_us:
      - "Liveness probe failed because DB connection pool was exhausted"
  runbook_updates:
    - target: DEVOPS-RUN-[PROJECT]-DB-TROUBLESHOOT
      status: updated
    - target: DEVOPS-MON-[PROJECT]-ALERTS-CONFIG
      status: updated
  action_items:
    - id: ACT-001
      type: mitigation
      status: done
      linked_task: PM-TSK-BILL-101
    - id: ACT-002
      type: permanent_fix
      status: done
      linked_task: PM-TSK-BILL-102
    - id: ACT-003
      type: preventive
      status: verified
      linked_task: PM-TSK-BILL-103
```

---

## 10. Bảng Tự Kiểm Tra Chất Lượng Sự Cố (DevOps INC Quality Checklist)

- [ ] ID thực thể đúng chuẩn `DEVOPS-INC-[PROJECT]-[COMPONENT]-[NUMBER]` hoặc `CORE-DEVOPS-INC-[NAME]-V[VERSION]`.
- [ ] Khai báo đầy đủ các thuộc tính SRE incident metadata đặc thù ở Frontmatter (`severity_level`, `incident_type`, `mttd_minutes`, `mttr_minutes`).
- [ ] Link `depends_on` trỏ chính xác về dịch vụ bị lỗi (`BE-SRV`), tài liệu giám sát (`DEVOPS-MON`), và task sửa lỗi (`PM-TSK`) liên quan.
- [ ] Graph Traceability đầy đủ: `ARCH-ADR → BE-SRV → DEVOPS-INC → DEVOPS-RUN / DEVOPS-MON / QA-TC → PM-TSK → DEVOPS-DEP`.
- [ ] Đánh giá đầy đủ tác động (Section 1: Impact Assessment) gồm 6 chỉ số bắt buộc: Users affected, Services, Downtime, Revenue, Data loss, và Security impact.
- [ ] Trình bày dòng thời gian chi tiết có kèm cột `Elapsed Time` (Section 2) để đo lường MTTD, MTTM, và MTTR.
- [ ] Áp dụng triệt để phương pháp 5 Whys (Section 3) để tìm ra nguyên nhân gốc rễ và phân loại đúng danh mục lỗi.
- [ ] Phân biệt rõ ràng tác nhân kích hoạt (Trigger) với nguyên nhân chính (Primary Cause) ở Section 4.
- [ ] Bảng kế hoạch khắc phục (Action Items - Section 5) phân chia đủ 3 loại: Mitigation, Permanent Fix, và Preventive Action có kèm trạng thái kiểm duyệt (`OPEN`, `DONE`, `VERIFIED`).
- [ ] Ghi nhận đầy đủ bài học kinh nghiệm blameless post-mortem ở Section 6: What worked, What failed, và What surprised us.
- [ ] Đăng ký cập nhật đầy đủ tài liệu vận hành (Runbook/Alert Rules/Playbook) ở Section 7.
- [ ] Xác định rõ các lỗ hổng giám sát telemetry (Logs, Metrics, Traces) ở Section 8.
- [ ] Khối YAML `incident_contract` máy đọc được biên dịch hợp lệ không chứa Tab và đúng cấu trúc.
- [ ] **SRE Incident Closure Checklist (Kiểm tra trạng thái đóng sự cố)**:
  - [ ] Timeline complete (Dòng thời gian đầy đủ, rõ ràng)
  - [ ] Root cause confirmed (Xác minh nguyên nhân gốc rễ bằng 5 Whys)
  - [ ] Contributing factors documented (Ghi nhận các yếu tố ảnh hưởng & trigger)
  - [ ] Lessons learned recorded (Bài học kinh nghiệm postmortem đã ghi nhận)
  - [ ] Runbook updated (Cập nhật tài liệu hướng dẫn vận hành)
  - [ ] Dashboard updated (Cập nhật hệ thống dashboard giám sát)
  - [ ] Alert updated (Cập nhật ngưỡng cảnh báo alert)
  - [ ] PM tasks created (Tạo task PM-TSK tương ứng để fix vĩnh viễn)
  - [ ] QA verification completed (Được QA xác nhận hoàn tất kiểm thử)
  - [ ] Metrics collected (Thu thập đủ các chỉ số mttd, mttm, mttr)
  - [ ] MTTR calculated (Tính toán xong thời gian xử lý trung bình)
  - [ ] Incident officially closed (Sự cố chính thức được đóng lại trên hệ thống)
- [ ] **Controlled Tech Leakage Check**: Cho phép rò rỉ tên database tables, SQL query structures, error codes, và Prometheus metric names nhưng cấm tuyệt đối rò rỉ thông tin hạ tầng vật lý nhạy cảm (Production Database passwords, IAM Access Keys, Server IP addresses, API connection credentials).
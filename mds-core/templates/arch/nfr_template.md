---
id: SA-NFR-[PROJECT]-[COMPONENT]-[NUMBER]
# COMPONENT conventions: SYS (System-wide) | AUTH | MEDIA | DATA | BILL | API | CACHE | STORAGE | INFRA | OBS | ...
title: "[Tên Yêu Cầu Phi Chức Năng]"
project: "[project-id]"
phase: "02"

# Layer 1 — Lifecycle State (độ trưởng thành nội dung)
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED

# Layer 2 — Execution State (trạng thái vận hành thực tế)
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
blocked_reason: ""               # Điền chi tiết nếu execution_state = BLOCKED

# Criticality & Measurement Ownership
priority: CRITICAL | HIGH | MEDIUM | LOW
measurement_owner: qa_agent | devops_agent

version: X.Y.Z
owner: sa_agent
created_by: sa_agent
created_at: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_synchronized: YYYY-MM-DD
tags: [nfr, performance, security, availability]

# Mối quan hệ liên kết đồ thị tri thức (Outbound Links)
links:
  - type: adheres_to             # Tuân thủ ràng buộc cứng từ constraints.md (NFR Seeds)
    target: ARCH-CTX-[PROJECT]-CONSTRAINTS
  - type: depends_on             # NFR áp dụng cho yêu cầu nghiệp vụ nào
    target: BA-REQ-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: validated_by           # Được kiểm chứng và đo lường bởi Test Case nào
    target: QA-TC-[PROJECT]-[COMPONENT]-[NUMBER]
---

# Non-Functional Requirements Specification: [Tên Yêu Cầu Phi Chức Năng]

## 0. Tóm Tắt Chỉ Số NFR (NFR Target Metrics)

*   **Phân loại NFR**: Performance | Availability | Scalability | Reliability | Security | Observability | Maintainability | Compliance | Usability
*   **Độ ưu tiên (Priority)**: CRITICAL | HIGH | MEDIUM | LOW (Khớp với `priority`)
*   **Chỉ số cam kết chính (SLA)**: [Ví dụ: p95 Latency < 200ms dưới tải 500 RPS]
*   **Môi trường đo lường**: Staging | UAT | Production
*   **Chủ sở hữu**: sa_agent

---

## 1. Cam kết hiệu năng hệ thống (Latency & Throughput SLA)

Đặc tả chi tiết các chỉ số đo lường tải và thời gian phản hồi:

### 1.1 Chỉ số tải tiêu chuẩn
*   **Tải bình thường (Baseline Load)**: [Ví dụ: 100 RPS, 2000 active users]
*   **Tải đỉnh (Peak Load)**: [Ví dụ: 500 RPS, 10000 active users]
*   **Tải giới hạn (Stress Load)**: [Ví dụ: 1000 RPS]

### 1.2 Cam kết thời gian phản hồi (Latency SLA)
*   **Thời gian phản hồi trung bình (Average Latency)**: < [Ví dụ: 100ms]
*   **Phần trăm 95 (p95 Latency)**: < [Ví dụ: 200ms]
*   **Phần trăm 99 (p99 Latency)**: < [Ví dụ: 500ms]
*   **Tỷ lệ lỗi cho phép (Error Rate)**: < [Ví dụ: 0.1% dưới peak load]

---

## 2. Khả năng mở rộng & Kháng lỗi (Scalability & High Availability)

### 2.1 Khả năng tự động co giãn (Auto-scaling Rules)
*   **Ngưỡng scale-out (Tăng tài nguyên)**: CPU > [Ví dụ: 70%] hoặc Memory > [Ví dụ: 80%] duy trì liên tục trong [Ví dụ: 3 phút].
*   **Ngưỡng scale-in (Giảm tài nguyên)**: CPU < [Ví dụ: 30%] trong [Ví dụ: 10 phút].
*   **Giới hạn số Pod/Instance**: Tối thiểu [Ví dụ: 2 Pods], Tối đa [Ví dụ: 10 Pods] để tối ưu chi phí.

### 2.2 SRE Availability Framework (SLA / SLO / Error Budget)
*   **Availability SLA (Cam kết khách hàng)**: [Ví dụ: 99.9% uptime (tối đa 43.8 phút downtime/tháng)].
*   **Availability SLO (Mục tiêu nội bộ)**: [Ví dụ: 99.95% uptime (tối đa 21.9 phút downtime/tháng)].
*   **Error Budget (Ngân sách lỗi cho phép)**: [Ví dụ: 21.9 phút/tháng]. Nếu tiêu hết Error Budget, dừng deploy tính năng mới, tập trung fix bug.
*   **Cơ chế dự phòng (Redundancy)**: [Active-Active deploy chéo Multi-AZ trên AWS, cơ chế N+1 cho services].

---

## 3. Khả năng phục hồi sau thảm họa (RTO & RPO Standards)

Các chỉ số giới hạn phục hồi khi xảy ra thảm họa hạ tầng (Disaster Recovery):

*   **RTO (Recovery Time Objective)**: < [Ví dụ: 4 giờ] để khôi phục dịch vụ hoạt động bình thường.
*   **RPO (Recovery Point Objective)**: < [Ví dụ: 24 giờ] lượng dữ liệu tối đa chấp nhận mất mát.
*   **Chiến lược Sao lưu (Backup Policy)**:
    - Backup DB tự động: Daily (Hàng ngày) lưu trữ giữ lại trong [Ví dụ: 30 ngày].
    - Backup Point-in-Time Recovery (PITR) cho PostgreSQL: Hỗ trợ rollback đến từng giây trong vòng [Ví dụ: 7 ngày].

---

## 4. Bảo mật, Quan sát & Vận hành (Security, Observability & Operability)

### 4.1 Bảo mật & Tuân thủ (Security)
*   **Mã hóa dữ liệu**:
    - Dữ liệu truyền đi (Data in Transit): Bắt buộc HTTPS TLS 1.3.
    - Dữ liệu lưu trữ (Data at Rest): Mã hóa AES-256 đối với Database và S3 buckets.
*   **Phòng chống tấn công**: Rate Limiting tối đa [Ví dụ: 60 requests/phút] trên mỗi IP.

### 4.2 Giám sát Hệ thống (Observability)
*   **Độ mịn Metrics (Granularity)**: Thu thập metrics hệ thống/services tối thiểu tần suất [Ví dụ: 1 phút].
*   **Lưu trữ Logs (Log Retention)**: Logs tập trung lưu trữ tối thiểu [Ví dụ: 30 ngày].
*   **Truy vết liên tục (Distributed Tracing)**: OpenTelemetry context propagation bắt buộc đi qua toàn bộ API Gateway và Microservices.

### 4.3 Khả năng Vận hành (Operability & Maintainability)
*   **MTTR (Mean Time to Repair)**: Thời gian trung bình để sửa chữa lỗi < [Ví dụ: 30 phút].
*   **Deployment & Rollback SLA**: Thời gian tự động rollback khi deploy lỗi < [Ví dụ: 5 phút] (Green/Blue or Canary).

---

## 5. Kế Hoạch Xác Thực Phi Chức Năng (NFR Validation Plan)

Mô tả phương pháp kiểm thử để nghiệm thu NFR:

### 5.1 Kịch bản kiểm thử cho Human
*   **Công cụ kiểm thử**: k6 / JMeter / Locust.
*   **Kịch bản kiểm thử (Test Scenario)**:
    - *Load Test*: Duy trì 500 RPS trong 30 phút để xác thực cam kết hiệu năng ở Mục 1.
    - *Stress Test*: Tăng tải từ 100 đến 1500 RPS để tìm điểm nghẽn hệ thống (breaking point).
*   **Target Test Case ID**: `QA-TC-[PROJECT]-[COMPONENT]-[NUMBER]`

### 5.2 Machine-Readable Validation Plan (YAML)
```yaml
validation_plan:
  tools:
    - k6
  scenarios:
    - type: load_test
      target_rps: 500
      duration: 30m
    - type: stress_test
      target_rps: 1500
      duration: 10m
  target_tc:
    - QA-TC-[PROJECT]-[COMPONENT]-[NUMBER]
```

---

## 6. Bảng Tự Kiểm Tra Chất Lượng NFR (NFR Quality Checklist)

- [ ] Chỉ số NFR đã định lượng cụ thể bằng số đo cụ thể, không ghi chung chung dạng "hệ thống chạy nhanh".
- [ ] Xác định rõ RTO và RPO cụ thể phục vụ cho mục tiêu Disaster Recovery.
- [ ] Định nghĩa đầy đủ SRE Availability Framework (SLA, SLO, Error Budget) ở Section 2.2.
- [ ] Đặc tả rõ ràng các yêu cầu Observability (Metrics, Logs, Tracing) và Operability (MTTR).
- [ ] Đã khai báo YAML Machine-Readable Validation Plan ở Mục 5.2.
- [ ] Đã liên kết link `adheres_to` trỏ về `constraints.md` và `depends_on` trỏ về `REQ` nghiệp vụ tương ứng.
- [ ] Đã liên kết link `validated_by` trỏ về Test Case `TC` xác thực (Khớp với `links` metadata).
- [ ] Không có liên kết nào bị Orphan hoặc Broken Reference.
- [ ] **Anti-Pattern Check**: Không có metric mơ hồ (ví dụ: "fast", "scalable", "secure") mà không đi kèm số đo định lượng.
- [ ] **Anti-Pattern Check**: Mọi metric đều đo lường được (measurable) bằng công cụ cụ thể.
- [ ] **Anti-Pattern Check**: NFR không mâu thuẫn trực tiếp với các ràng buộc về chi phí tài chính (ví dụ: Latency < 5ms nhưng ngân sách hạ tầng < $50/tháng).
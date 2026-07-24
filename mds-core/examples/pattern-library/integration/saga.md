# Saga Integration Pattern

Mẫu Saga điều phối giao dịch phân tán (Distributed Transactions) chéo microservices thông qua chuỗi các giao dịch cục bộ độc lập và các giao dịch bù trừ (Compensating Transactions) khi có lỗi xảy ra.

## Phân loại Saga
- **Choreography-based Saga**: Các service tự lắng nghe event và kích hoạt bước tiếp theo mà không cần điều phối trung tâm.
- **Orchestration-based Saga**: Sử dụng service trung tâm (Saga Orchestrator) để gửi lệnh thực thi và nhận phản hồi từ các service.
# Domain Architecture Patterns Reference

## 1. Modular Monolith
* **Description:** Logical separation of business domain modules inside a single deployment container.
* **Best For:** Small to mid-sized teams looking to avoid microservice network latency and DevOps complexity while maintaining strict domain separation.
* **Communication:** Direct in-memory method calls across module boundaries or event publishing on an internal thread bus (e.g. Node.js EventEmiter).

## 2. Microservices
* **Description:** Independent deployment containers communicating over network boundaries.
* **Best For:** Large teams with high-scale, polyglot technology requirements and independent scaling needs.
* **Communication:** Sync: REST/gRPC; Async: Kafka/RabbitMQ.

## 3. CQRS (Command Query Responsibility Segregation)
* **Description:** Separating write operations (Commands) from read operations (Queries) into different models or databases.
* **Best For:** Systems with massive read/write imbalances (e.g. reporting dashboards, live class catalogs).

## 4. Saga Pattern
* **Description:** Orchestrating distributed transactions across multiple microservices using a sequence of local transactions and compensating actions.
* **Best For:** Multi-step transactions (e.g. order processing, payment validation) in microservice architectures.

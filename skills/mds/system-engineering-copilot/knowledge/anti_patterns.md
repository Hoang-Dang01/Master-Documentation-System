# Software Architecture Anti-Patterns

## 1. Synchronous Service Chaining (Distributed Monolith)
* **Description:** Service A calls Service B, which calls Service C synchronously over HTTP to complete a single user request.
* **Problem:** Latency aggregates, cascading failures occur, and availability drops to the product of all service availabilities.
* **Mitigation:** Use asynchronous event patterns or consolidate modules if coupling is too high.

## 2. Database Sharing Across Services (Shared DB)
* **Description:** Microservices reading/writing to the same database tables.
* **Problem:** Direct schema coupling; modifying a table breaks multiple independent service deployments.
* **Mitigation:** Database-per-service pattern. Expose data only via API endpoints or events.

## 3. Realtime Messaging Without Backplane scaling
* **Description:** Deploying multiple WebSocket servers without a shared Redis/NATS backplane.
* **Problem:** Users connected to Server A cannot send messages to users connected to Server B.
* **Mitigation:** Always use NATS or Redis pub/sub adapters to bridge socket message dispatching.

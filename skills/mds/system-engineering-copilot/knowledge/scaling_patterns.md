# Scaling and High Availability Patterns

## 1. Data Caching
* **Pattern:** Cache-Aside.
* **Mechanism:** Application checks Redis first. If a cache miss occurs, query PostgreSQL, populate Redis with TTL, and return.
* **Cache Eviction Strategy:** LRU (Least Recently Used) with tight time-to-live settings (e.g. 5 mins for volatile listings).

## 2. Queueing & Async Processing
* **Pattern:** Message Broker buffering.
* **Mechanism:** Push expensive write operations (e.g., mail dispatch, media encoding, report generation) to BullMQ/RabbitMQ. Let worker processes consume asynchronously.
* **Benefit:** Decouples API server response time from background job duration.

## 3. Realtime Media Layer (LiveKit/WebSockets)
* **Pattern:** Distributed mesh topology / Selective Forwarding Unit (SFU).
* **Mechanism:** Deploy LiveKit SFUs close to users. Scale websocket control channels using Redis adapter pub/sub configurations to share session details across node clusters.

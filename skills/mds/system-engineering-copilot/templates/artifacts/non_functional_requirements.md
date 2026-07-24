# Non-Functional Requirements Specification (NFRS)

## 1. Performance & Latency
- All API write requests must complete in under **500ms** at p95.
- Real-time signaling updates must route to client app in under **100ms**.

## 2. Scalability & Availability
- Active system concurrency target: **[X]** concurrent connections.
- Target uptime SLA: **99.9%** availability (max 43.8 minutes downtime/month).

## 3. Security & Compliance
- Data in transit: forced TLS 1.3 protocol.
- Data at rest: AES-256 block encryption.
- Passwords must be hashed using Argon2id algorithm.

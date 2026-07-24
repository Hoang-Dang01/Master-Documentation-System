# Security Patterns and Compliance Guidelines

## 1. Authentication & Session Management
* Use **Argon2id** for password hashing (standard configuration: m=65536, t=3, p=4).
* Issue stateless **JWT tokens** with short lifespans (15 mins) and persist encrypted refresh tokens in HttpOnly, Secure, SameSite cookies.

## 2. API Rate Limiting
* Implement sliding window counter rate limiting on gateway layer.
* Set specific limits:
  - Auth paths: max 5 requests / min per IP.
  - Core API paths: max 100 requests / min per IP.

## 3. Data Protection
* Enforce HTTPS (TLS 1.3) in transit.
* Apply AES-256-GCM encryption for stored user PII data fields.

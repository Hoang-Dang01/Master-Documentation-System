# LMS Case Study: EduMeet Realtime Platform

This case study shows how the System Engineering Copilot (AI-EOS) processes a raw requirement intake, computes confidence, selects execution paths, models databases, designs high-level architectures, and validates results.

---

## 1. Raw Input Intake (Phase 0)
* **User Input:** "I want to build an LMS named EduMeet. It needs live classes, student enrollment, courses, and chat. We are using NestJS, PostgreSQL, Redis, and LiveKit. It must support high traffic."

* **Intake Extraction:**
  - **Project Name:** EduMeet
  - **Goal:** Realtime LMS for live classes and interactive chats.
  - **Actors:** Student, Instructor, System Administrator.
  - **Constraints:** NestJS, PostgreSQL, Redis, LiveKit.
  - **Complexity Tier:** Enterprise (due to realtime video, concurrency, and caching requirements).

---

## 2. Confidence Evaluation & State Setup
- **Mandatory Fields:** `business_goal` (present), `actors` (present), `scope` (present).
- **Confidence Score:** 1.0 (Sufficient to generate).
- **State Initialization:**
  - Written to `state/project_context.yaml`:
    ```yaml
    project_name: EduMeet
    architecture: modular_monolith
    database: PostgreSQL
    cache: Redis
    realtime: LiveKit
    ```

---

## 3. Solution Architecture C4 Diagram (Phase 3)
```mermaid
flowchart TB
    subgraph Client Apps
        Web[Web Application]
        Mobile[Mobile Application]
    end
    subgraph Gateway Layer
        Proxy[Nginx Proxy / Gateway]
    end
    subgraph App Cluster
        Svc[NestJS App Server]
    end
    subgraph Storage Layer
        Db[(PostgreSQL DB)]
        Cache[(Redis Cache)]
    end
    subgraph Realtime Layer
        SFU[LiveKit Media SFU]
    end

    Web -->|HTTPS| Proxy
    Mobile -->|HTTPS| Proxy
    Proxy -->|HTTP| Svc
    Svc -->|SQL| Db
    Svc -->|Pub/Sub & Cache| Cache
    Web -->|WebRTC| SFU
    Mobile -->|WebRTC| SFU
    Svc -->|Token Signing| SFU

    style Web fill:#dbeafe,stroke:#3b82f6,stroke-width:2px;
    style Mobile fill:#dbeafe,stroke:#3b82f6,stroke-width:2px;
    style Proxy fill:#d1fae5,stroke:#10b981,stroke-width:2px;
    style Svc fill:#d1fae5,stroke:#10b981,stroke-width:2px;
    style Db fill:#ddd6fe,stroke:#8b5cf6,stroke-width:2px;
    style Cache fill:#ddd6fe,stroke:#8b5cf6,stroke-width:2px;
    style SFU fill:#ffedd5,stroke:#f59e0b,stroke-width:2px;
```

---

## 4. Entity Relationship Diagram (Phase 2)
```mermaid
erDiagram
    USER ||--o{ ENROLLMENT : registers
    USER {
        int id PK
        string email UK
        string password
        string role
    }
    COURSE ||--o{ ENROLLMENT : contains
    COURSE ||--o{ SESSION : schedules
    COURSE {
        int id PK
        string title
        string description
        int instructor_id FK
    }
    ENROLLMENT {
        int id PK
        int student_id FK
        int course_id FK
        timestamp enrolled_at
    }
    SESSION {
        int id PK
        string topic
        timestamp start_time
        string livekit_room_sid
        int course_id FK
    }
```

---

## 5. QA Architecture - Chaos Test Spec (Phase 6)
- **Failure Scenario:** Redis Cache disconnects during high-concurrency websocket room signaling.
- **Verification Strategy:**
  1. Trigger cache failure.
  2. Verify that NestJS App gracefully falls back to local memory queueing or returns rate-limiting responses instead of server crashes.
  3. Validate automatic reconnection mechanics of Redis client configurations.

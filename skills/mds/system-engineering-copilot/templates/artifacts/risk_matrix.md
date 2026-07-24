# Risk Management Matrix

## 1. System Risks & Threat Log
| ID | Risk Description | Category (SEC/SCL/OPS) | Likelihood (1-5) | Impact (1-5) | Score (L*I) | Mitigation Plan |
|---|---|---|---|---|---|---|
| R-01 | DB Connection pool exhaustion | SCL | 3 | 4 | 12 | Implement read replicas, caching, and connection pooling limit parameters. |

## 2. Risk Levels Reference
- **Score 1-5:** Low (Acceptable, minor monitoring needed).
- **Score 6-12:** Medium (Must document and configure safety mitigations).
- **Score 13-25:** High (Critical, blocking release until resolved).

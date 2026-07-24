# SRE Incident Runbook

## Incident: [Title of Incident]

### 1. Alert Rules Trigger
- **Metric:** `[SLI Name]`
- **Condition:** `[e.g. error rate > 5% for 2 consecutive minutes]`
- **Severity:** P0 - Critical / P1 - Major

### 2. Diagnosis Run
* Check active memory consumption metrics: **[CMD]**
* Query active database connection parameters: **[CMD]**
* Filter logs for error signatures: **[CMD]**

### 3. Mitigation Checklist
- [ ] Recycle backend container instances.
- [ ] Scale database connection pool parameters.
- [ ] Redirect traffic routes to failover region if system outage is global.

### 4. Recovery Verification
* Monitor target response latency metrics.
* Check database query latency metrics.

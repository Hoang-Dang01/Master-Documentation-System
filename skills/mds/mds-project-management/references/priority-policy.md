# MDS priority policy

## Two separate decisions

Do not collapse scope commitment and execution order into one score:

1. **Commitment:** MoSCoW classifies what the release promises.
2. **Order:** RICE, ICE, value/effort, cost of delay, risk, and dependencies
   determine what should happen first.

## Framework selection

| Situation | Preferred method | Minimum evidence |
|---|---|---|
| Release scope negotiation | MoSCoW | Approved objective and constraints |
| Early project with weak metrics | Value/effort or ICE | Named assumptions and confidence |
| Measurable user impact | RICE | Reach, impact, confidence, effort |
| Fixed deadline or expiring opportunity | Cost of delay | Deadline and impact of lateness |
| High technical uncertainty | Risk-first | Risk probability, impact, mitigation |
| Hard task dependencies | Dependency order | Valid acyclic task graph |

## Required priority record

For every ranked item record:

```yaml
id: BA-REQ-MDS-COMP-001
commitment: MUST | SHOULD | COULD | WONT
framework: RICE
inputs:
  reach: 0
  impact: 0
  confidence: 0.0
  effort: 0
score: 0
assumptions: []
source_refs: []
decision: PROPOSED
human_override:
  applied: false
  reason: null
```

## Guardrails

- Never fabricate numeric evidence.
- Show unknown inputs explicitly.
- Do not compare scores produced by different formulas as if they share a scale.
- Apply dependency constraints after value scoring.
- Record a human override instead of silently changing the score.
- Re-score when scope, capacity, evidence, or constraints materially change.

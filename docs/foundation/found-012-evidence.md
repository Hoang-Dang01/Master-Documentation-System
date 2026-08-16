# FOUND-012 — Desktop review, truth and impact evidence

Date: 2026-08-16

## Delivered vertical slice

The desktop overview now exposes a bounded review workbench alongside the
existing document and graph surfaces:

- review queue for `REVIEW` requirements with open, approve, reject and impact
  actions;
- immutable-version reminder after selection and explicit rejection/approval
  feedback;
- Current Project Truth rail showing `AUTHORITATIVE`, `WARNING` and `EXCLUDED`
  counts from artifact lifecycle metadata;
- impact panel showing affected artifact IDs returned by the typed application
  operation and marking them as `NEEDS_REVIEW` proposals;
- context authority notice stating that the package is bounded read-only
  evidence and does not authorize source, test, Git, PR or deployment mutation.

The renderer only invokes typed `window.mds` operations. Truth, validity,
lineage and impact policy remain in the application layer and Electron main
process. Existing Electron security defaults remain unchanged:
`contextIsolation=true`, `nodeIntegration=false`, `sandbox=true`.

## Fresh verification

```text
npm.cmd run typecheck  PASS
npm.cmd run build      PASS
npm.cmd run smoke      PASS (bridge=true, root=true, graph=true, graphView=true)
```

The smoke harness validates the renderer boot and graph bridge on the current
worktree. Browser-specific Playwright/agent-browser interaction automation was
not available in this environment; full click-through evidence remains a
follow-up QA hardening item.

## Boundary and residual risk

Approval and rejection are human-triggered and preserve lineage. The workbench
does not auto-approve AI output or mutate managed-project source/test files.
Draft editing continues through the existing artifact-open flow (the system
editor); an in-app rich editor is intentionally deferred beyond this foundation
slice.

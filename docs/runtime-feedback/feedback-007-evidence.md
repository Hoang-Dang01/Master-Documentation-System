# FEEDBACK-007 — Desktop evidence review evidence

Evidence date: 2026-08-17 (Asia/Bangkok)

## Delivered behavior

- Typed Electron IPC/preload operation lists immutable evidence bundles for the
  selected runtime project.
- Desktop overview includes an evidence ledger and inspector with bundle,
  producer, repository/commit, context package, manifest hash, linked artifact
  versions and declared result evidence.
- Status seals distinguish passing evidence, warnings and blockers while
  explicitly stating that pass evidence does not approve a release.
- The renderer does not calculate evidence trust or finding policy; application
  DTOs and persisted validated manifests remain the source.
- Existing Electron security defaults remain unchanged: context isolation on,
  Node integration off and renderer sandbox on.

## Fresh verification

```text
npm.cmd run typecheck PASS
npm.cmd run build     PASS
npm.cmd run smoke     PASS
```

Electron smoke output:

```text
bridge=true, root=true, workbench=true, evidenceView=true, graph=true,
graphView=true
```

## Frontend audit

- Evidence rows are native buttons with visible `:focus-visible` treatment.
- Inspector uses `aria-live`; empty state explains the next action.
- Layout collapses to one column below 960px and adds no motion.
- Copy retains the read-only boundary and avoids presenting evidence as release
  authority.

Interactive automation availability:

- `agent-browser`: unavailable in the current environment.
- Python Playwright: unavailable because no Python executable is installed.
- Electron's current smoke harness is therefore the fresh renderer assertion;
  deep click-through remains residual QA hardening.

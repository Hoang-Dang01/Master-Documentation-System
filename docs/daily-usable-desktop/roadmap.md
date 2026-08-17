---
id: PM-REL-MDS-DESKTOP-001
title: Daily-Usable Desktop roadmap
project: mds
lifecycle_state: DRAFT
execution_state: NOT_APPLICABLE
version: 0.1.0
owner: PM
created_at: 2026-08-17
source_refs:
  - BA-REQ-MDS-DESKTOP-001@0.1.0
  - ARCH-ADR-MDS-DESKTOP-001@0.1.0
---

# Daily-Usable Desktop roadmap

Status: DEFERRED — local source execution is the current delivery mode. Resume
this roadmap only when installer distribution becomes a real need.

## Outcome

Move MDS from repository-only execution to a locally installable Windows app
whose first-run data and existing project artifacts remain safe.

## Priority decision

- Commitment framework: MoSCoW.
- Execution order: risk-first, then hard dependencies.
- `MUST`: packaged resource resolution, native dependency packaging, isolated
  unpacked smoke, first-run/relaunch preservation, NSIS artifact and DoD.
- `SHOULD`: clear packaged empty/seed state and package-content audit.
- `COULD`: custom icon and portable executable after an approved brand asset.
- `WON'T`: signing, auto-update, telemetry, external publication, macOS/Linux,
  cloud sync and managed-project mutation.

The native module and packaged-resource seam comes first because failure there
invalidates every installer-level result. The unpacked executable is proven
before creating or manually installing an NSIS artifact.

## Releases

| Release | Outcome | Scope/REQ links | Exit evidence | Approval |
|---|---|---|---|---|
| DU0 — Contract gate | Approved daily-use scope and packaging contract | BA-REQ-MDS-DESKTOP-001 | Approved requirement, ADR and executable DAG | DRAFT |
| DU1 — Packaged runtime | Unpacked Windows app launches with correct resources and isolated data | BA-REQ-MDS-DESKTOP-001 | Package audit and packaged smoke | DRAFT |
| DU2 — Installer candidate | NSIS installer artifact plus relaunch/data-preservation evidence | BA-REQ-MDS-DESKTOP-001 | SHA-256, size, DoD and residual risks | DRAFT |

## Dependency map

```text
scope + requirement approval
  -> packaging/resource ADR approval
  -> executable backlog approval
  -> packaged-resource and native-module slice
  -> isolated first-launch + relaunch slice
  -> installer artifact + content audit
  -> fresh Definition of Done
  -> human local release decision
```

## Capacity and assumptions

- Effort estimate: 23 relative points across 7 vertical tasks.
- Target: Windows x64 on the current machine.
- Runtime data remains outside the install directory.
- Existing runtime APIs and approved control-plane boundary remain unchanged.
- Confidence: medium until the first unpacked executable completes smoke.

## Decisions required

- [x] Requirement/scope approval — human project authority, 2026-08-17.
- [x] Packaging ADR Option A approval — human architect, 2026-08-17.
- [x] Executable backlog approval — human PM/project authority, 2026-08-17.
- [ ] Local installer milestone release — human release authority after DoD.
- [ ] External publication/deployment — explicitly out of the current approval.

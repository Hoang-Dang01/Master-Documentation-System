---
id: BA-REQ-MDS-DESKTOP-001
title: Installable daily-use Windows desktop
project: mds
lifecycle_state: APPROVED
validity_state: CURRENT
version: 0.1.0
owner: ba_agent
created_at: 2026-08-17
approved_at: 2026-08-17
approved_by: human-project-authority
approval_reason: User approved the complete Daily-Usable Desktop planning pack.
source_refs:
  - BA-REQ-MDS-FOUND-001@1.0.0
  - BA-REQ-MDS-FEEDBACK-001@0.1.0
  - PM-REL-MDS-FEEDBACK-001@0.1.0
links:
  - type: depends_on
    target: BA-REQ-MDS-FEEDBACK-001
---

# Installable daily-use Windows desktop

## Outcome

A Windows user can install MDS, launch it without Node.js or a repository
checkout, obtain a safe first-run workspace, reopen the application with the
same data, and uninstall the application without deleting project data.

## Functional requirements

1. MDS SHALL produce a Windows installer artifact and an unpacked application
   suitable for smoke verification.
2. The packaged application SHALL resolve renderer, preload, native modules,
   document standards and development seed resources from packaged resources,
   not from a source-repository-relative path.
3. First launch SHALL create the runtime tree below the resolved
   `MDS_DATA_DIR` and SHALL preserve an existing workspace without overwrite.
4. If a bundled seed is present, first launch SHALL copy it only when the target
   project is absent. If a seed is unavailable, MDS SHALL create a valid empty
   workspace and explain that state without crashing.
5. Subsequent launches SHALL reuse the chosen or default data root.
6. The installed application SHALL retain the approved sandbox, context
   isolation, read-only managed-project boundary and human approval gates.
7. A packaged smoke SHALL verify launch, typed preload access, first-run data
   creation, core workbench rendering and clean shutdown from an isolated test
   workspace.
8. Installer/uninstaller behavior SHALL keep runtime project data outside the
   application installation directory and SHALL NOT delete user project data.

## Prohibitions

This milestone SHALL NOT:

- publish an installer externally or deploy to production without a separate
  human release decision;
- introduce auto-update, telemetry, cloud sync or code signing;
- weaken Electron sandbox or expose generic filesystem/Node access;
- write managed-project source/test files or perform Git/PR/deployment writes;
- overwrite an existing runtime project or approved artifact.

## Acceptance criteria

- A clean Windows packaging command produces an unpacked app and installer.
- The unpacked/installed app launches with Node.js and repository paths absent
  from its runtime assumptions.
- An isolated first launch creates `projects/index.yaml`, required runtime
  directories and either the bundled sample project or a valid empty state.
- A second launch reports the same data root and leaves an existing sentinel
  file and project artifact byte-for-byte unchanged.
- Renderer, evidence ledger, knowledge graph and typed bridge smoke checks pass
  from the packaged application.
- The application exits cleanly and the smoke leaves no process running.
- Package contents contain required runtime assets and native dependencies but
  exclude repository-only documentation, tests, backups and secrets.
- Fresh build, typecheck, integration, packaged smoke, installer artifact hash,
  package-content audit and residual risks are recorded before release review.

## Out of scope

- Authenticode signing and SmartScreen reputation.
- Public download hosting, update feeds and automatic upgrades.
- macOS/Linux packages.
- Full visual regression or exhaustive click-through automation.
- AI provider integration and external Implementation Plane adapters.

## Assumptions and confidence

- Target platform is Windows x64, matching the current user environment.
- Existing verified runtime behavior remains compatible with packaged resource
  resolution.
- Confidence is high for first-run data behavior and medium for native-module
  packaging until an unpacked executable is built and smoked.

## Approval gate

Human project authority approved `BA-REQ-MDS-DESKTOP-001@0.1.0` on
2026-08-17. Installer publication and deployment remain separate release
decisions.

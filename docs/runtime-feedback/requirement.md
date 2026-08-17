---
id: BA-REQ-MDS-FEEDBACK-001
title: Read-only implementation evidence feedback
project: mds
lifecycle_state: APPROVED
validity_state: CURRENT
version: 0.1.0
owner: ba_agent
created_at: 2026-08-17
approved_at: 2026-08-17
approved_by: human-project-authority
approval_reason: Scope and requirement accepted in conversation.
source_refs:
  - BA-REQ-MDS-FOUND-001@1.0.0
  - BA-REQ-MDS-TRUTH-001@1.0.0
  - ARCH-ADR-MDS-FOUND-001@1.0.0
  - PM-REL-MDS-FOUND-001@0.1.0
links:
  - type: depends_on
    target: BA-REQ-MDS-FOUND-001
  - type: depends_on
    target: BA-REQ-MDS-TRUTH-001
---

# Read-only implementation evidence feedback

## Outcome

MDS can ingest bounded read-only evidence from an external Implementation
Plane, link it to approved truth and context-package items, and create
human-reviewable verification findings without changing managed-project source,
tests, Git state, pull requests, deployments, or approved artifacts.

## Functional requirements

1. MDS SHALL import an explicit evidence bundle containing source identity,
   commit/build identity, producer, timestamp, file hashes and test/build result
   references.
2. MDS SHALL validate evidence paths, checksums, required identity and bundle
   size before accepting the bundle.
3. MDS SHALL correlate accepted evidence with artifact IDs, version IDs and the
   context package that authorized the external work.
4. MDS SHALL produce findings as `DRAFT` with retained source references and a
   deterministic severity/reason classification.
5. MDS SHALL present missing, stale, mismatched and passing evidence separately.
6. A human SHALL decide whether a finding is accepted, rejected or requires
   another implementation/review cycle.
7. MDS SHALL refresh Current Project Truth only through governed application
   operations; evidence alone SHALL NOT auto-promote an artifact to `CURRENT`.

## Prohibitions

MDS SHALL NOT:

- write managed-project source or test files;
- run Git write commands, create/merge pull requests, deploy, or approve a
  release;
- treat an Implementation Plane status message as evidence;
- trust evidence lacking current commit/build identity and source references;
- auto-approve a finding or replace an approved artifact.

## Acceptance criteria

- One external evidence fixture is imported and correlated to an approved
  context package without modifying the managed project.
- Tampered, path-escaping, stale and identity-mismatched bundles fail closed.
- A missing-test or changed-contract case creates an evidence-backed `DRAFT`
  finding and a human review queue entry.
- A passing bundle remains evidence; it does not independently authorize release
  or mutate truth state.
- Desktop UI displays evidence identity, linked artifact/version, finding
  status, source references and the read-only authority notice.
- Fresh typecheck, build, integration, security, desktop smoke and source-hash
  evidence are recorded before completion.

## Out of scope

- Codex/Claude autonomous execution adapters.
- Git diff collection directly from a managed repository.
- Running managed-project tests or builds from MDS.
- Cloud synchronization, deployment, installer publication or release approval.
- AI-generated verification decisions.

## Assumptions and confidence

- The external Implementation Plane can export a bounded JSON evidence bundle.
- Artifact and context package IDs are stable inputs.
- Confidence is high for the product boundary and medium for exact bundle fields
  until a sample external producer is approved.

## Approval gate

Requirement version `BA-REQ-MDS-FEEDBACK-001@0.1.0` was approved by the human
project authority on 2026-08-17. Implementation remains blocked by the detailed
architecture contract and executable backlog approval gates.

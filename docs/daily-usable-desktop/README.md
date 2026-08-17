---
ownership: mds
status: transitional
source: daily-usable-desktop-deferred-plan
safe_to_modify: approval-gated
canonical_target: docs/foundation/product-boundary.md and docs/ARCHITECTURE.md
---

# Daily-Usable Desktop planning pack

This directory records the deferred packaging and first-run milestone for a
future Windows application distribution. MDS is currently operated locally
from the repository through Electron.

Review order:

1. `requirement.md` — proposed user outcome, boundary and acceptance criteria.
2. `packaging-adr.md` — proposed Windows packaging and resource-resolution
   contract.
3. `roadmap.md` — risk-first outcome sequence.
4. `delivery-board.json` — proposed executable vertical-slice backlog.

The requirement, Option A architecture and executable backlog were approved on
2026-08-17, but delivery has been intentionally deferred by the project
authority. Packaging configuration, installer artifacts and related build
dependencies were removed from the active local-development path. Installer
publication and deployment remain unapproved.

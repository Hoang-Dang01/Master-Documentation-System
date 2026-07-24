---
ownership: upstream
status: vendor
source: multiple-upstreams
safe_to_modify: false
update_strategy: replace-from-upstream
---

# Vendor skills

## mattpocock-skills

- Upstream: `https://github.com/mattpocock/skills.git`
- Imported branch: `main`
- Imported commit: `ed37663cc5fbef691ddfecd080dff42f7e7e350d`
- Import date: `2026-07-24`
- Local nested Git metadata: removed so MDS remains a single repository
- Recoverable metadata backup: `../../../.backups/mattpocock-skills-git-metadata-20260724.zip`

The imported working tree was clean before integration.

## deanpeters-product-manager

- Upstream: `https://github.com/deanpeters/Product-Manager-Skills`
- Imported branch: `main`
- Import date: `2026-07-24`
- Selected skills: `roadmap-planning`, `prioritization-advisor`,
  `epic-breakdown-advisor`
- Direct dependencies: `workshop-facilitation`, `user-story-splitting`,
  `user-story`, `epic-hypothesis`
- License: CC BY-NC-SA 4.0; see `deanpeters-product-manager/LICENSE.md`

## obra-superpowers

- Upstream: `https://github.com/obra/superpowers`
- Imported branch: `main`
- Import date: `2026-07-24`
- Selected skills: `writing-plans`, `executing-plans`,
  `subagent-driven-development`, `dispatching-parallel-agents`,
  `verification-before-completion`
- Direct dependencies: `using-superpowers`, `using-git-worktrees`,
  `finishing-a-development-branch`, `requesting-code-review`
- License: MIT; see `obra-superpowers/LICENSE`

These folders are attributed upstream material. MDS-specific project management
policy lives in `../mds/mds-project-management/`.

## Exposure policy

`registry.yaml` is the allowlist used by MDS routing. The full upstream tree is
preserved for attribution and updates, but unlisted Matt Pocock skills are not
part of the active MDS skill surface. Deprecated, in-progress, personal, and
miscellaneous roots are ignored by default.

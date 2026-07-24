---
ownership: mds
status: transitional
source: imported-and-adapted
safe_to_modify: limited
canonical_target: mds-core/templates
---

# Copilot-local templates

`mds-core/templates/` is the canonical source for artifact structure,
mandatory metadata, lifecycle, and naming rules.

This directory may contain only output-specific rendering aids or diagrams
needed by the System Engineering Copilot. A local file must not redefine a
canonical requirement, test-plan, architecture, or project template.

When both locations appear relevant:

1. read `mds-core/templates/` first;
2. treat this directory as a renderer/example layer;
3. record any intentional specialization in the local file;
4. remove duplicated policy instead of synchronizing two independent copies.

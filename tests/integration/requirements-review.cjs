const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const {
  DuplicateSourceError,
  importDocument,
  listProjectArtifacts,
} = require("../../packages/application/ingestion/dist/index.js");
const {
  createImpactReport,
  reviewRequirement,
} = require("../../packages/application/requirements/dist/index.js");

async function main() {
  const temporaryRoot = await fs.mkdtemp(
    path.join(os.tmpdir(), "mds-requirements-review-"),
  );
  const activeProjectsRoot = path.join(temporaryRoot, "active");
  const projectPath = path.join(activeProjectsRoot, "edumeet");
  const sourcePath = path.join(temporaryRoot, "customer-change.md");

  try {
    await fs.mkdir(path.join(projectPath, "design", "backend"), {
      recursive: true,
    });
    await fs.writeFile(
      path.join(projectPath, "design", "backend", "notification-api.md"),
      `---
id: BE-API-EDU-NOTIFY-001
title: API thông báo trạng thái phiếu
project: edumeet
lifecycle_state: DRAFT
version: 0.1.0
owner: be_agent
---

# API thông báo trạng thái phiếu

Dịch vụ trả về thông báo khi trạng thái phiếu thay đổi.
`,
      "utf8",
    );
    await fs.writeFile(
      sourcePath,
      "Khách hàng cần nhận thông báo khi trạng thái phiếu thay đổi.\n",
      "utf8",
    );

    const imported = await importDocument(
      sourcePath,
      projectPath,
      activeProjectsRoot,
    );

    await assert.rejects(
      () => importDocument(sourcePath, projectPath, activeProjectsRoot),
      (error) => error instanceof DuplicateSourceError,
    );

    const invalidDocxPath = path.join(temporaryRoot, "invalid.docx");
    await fs.writeFile(invalidDocxPath, "not a zip document", "utf8");
    await assert.rejects(
      () =>
        importDocument(
          invalidDocxPath,
          projectPath,
          activeProjectsRoot,
        ),
      /chữ ký ZIP hợp lệ/,
    );

    const approval = await reviewRequirement(
      projectPath,
      activeProjectsRoot,
      imported.requirementRelativePath,
      "APPROVED",
      "human",
      "Đã xác nhận phạm vi và tiêu chí chấp nhận.",
    );
    assert.equal(approval.lifecycleState, "APPROVED");

    const impact = await createImpactReport(
      projectPath,
      activeProjectsRoot,
      imported.requirementRelativePath,
    );
    assert.match(impact.relativePath, /^analysis\//);
    assert.ok(impact.matchedArtifacts.includes("design/backend/notification-api.md"));
    const secondImpact = await createImpactReport(
      projectPath,
      activeProjectsRoot,
      imported.requirementRelativePath,
    );
    assert.notEqual(secondImpact.relativePath, impact.relativePath);
    assert.notEqual(secondImpact.artifactId, impact.artifactId);

    const events = await fs.readFile(
      path.join(projectPath, "audit", "events.jsonl"),
      "utf8",
    );
    assert.equal(events.trim().split(/\r?\n/).length, 3);

    await fs.writeFile(
      path.join(projectPath, "bad-artifact.md"),
      `---
title: Missing identity
project: edumeet
lifecycle_state: DRAFT
version: 0.1.0
owner: system
---
`,
      "utf8",
    );
    await assert.rejects(
      () => listProjectArtifacts(projectPath, activeProjectsRoot),
      /Artifact metadata không hợp lệ/,
    );

    console.log(
      "[REQUIREMENTS] Duplicate detection, approval, audit, and deterministic impact report passed.",
    );
  } finally {
    const resolvedTemporaryRoot = path.resolve(temporaryRoot);
    const resolvedOsTemp = path.resolve(os.tmpdir());
    if (
      resolvedTemporaryRoot.startsWith(`${resolvedOsTemp}${path.sep}`) &&
      path.basename(resolvedTemporaryRoot).startsWith("mds-requirements-review-")
    ) {
      await fs.rm(resolvedTemporaryRoot, { recursive: true, force: true });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

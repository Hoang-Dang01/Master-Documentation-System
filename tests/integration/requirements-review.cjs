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
  loadRequirementLineage,
  readRequirementVersion,
  registerRequirementCandidate,
  decideRequirementVersion,
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
    assert.equal(approval.lineageId, imported.requirementLineageId);
    assert.equal(approval.versionId, imported.requirementVersionId);
    assert.equal(approval.approvedHeadVersionId, imported.requirementVersionId);
    assert.match(approval.relativePath, /^artifacts\/lineages\//);

    const originalDraft = await fs.readFile(
      path.join(projectPath, imported.requirementRelativePath),
      "utf8",
    );
    assert.match(originalDraft, /lifecycle_state: DRAFT/);
    const approvedVersion = await readRequirementVersion(
      projectPath,
      activeProjectsRoot,
      imported.requirementLineageId,
    );
    assert.equal(approvedVersion.result.lifecycleState, "APPROVED");

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

    const successorContent = approvedVersion.content
      .replace("version: 0.1.0", "version: 0.2.0")
      .replace("lifecycle_state: DRAFT", "lifecycle_state: DRAFT")
      .replace("## CÃ¢u há»i cáº§n lÃ m rÃµ", "## TiÃªu chÃ­ Ä‘Ã£ lÃ m rÃµ");
    const successor = await registerRequirementCandidate({
      projectPath,
      activeProjectsRoot,
      lineageId: imported.requirementLineageId,
      version: "0.2.0",
      content: successorContent,
      projectId: "edumeet",
      supersedes: imported.requirementVersionId,
    });
    const beforeSuccessorApproval = await loadRequirementLineage(
      projectPath,
      activeProjectsRoot,
      imported.requirementLineageId,
    );
    await decideRequirementVersion({
      projectPath,
      activeProjectsRoot,
      lineageId: imported.requirementLineageId,
      candidateVersionId: successor.versionId,
      decision: "APPROVED",
      actor: "human",
      reason: "Approved clarified successor.",
      transitionId: "requirements-successor-approval",
      expectedRevision: beforeSuccessorApproval.revision,
    });
    const afterSuccessorApproval = await loadRequirementLineage(
      projectPath,
      activeProjectsRoot,
      imported.requirementLineageId,
    );
    assert.equal(afterSuccessorApproval.approvedHeadVersionId, successor.versionId);
    assert.equal(
      afterSuccessorApproval.versions[imported.requirementVersionId].effectiveLifecycleState,
      "DEPRECATED",
    );
    const successorImpact = await createImpactReport(
      projectPath,
      activeProjectsRoot,
      imported.requirementRelativePath,
    );
    assert.ok(successorImpact.matchedArtifacts.includes("design/backend/notification-api.md"));

    const events = await fs.readFile(
      path.join(projectPath, "audit", "events.jsonl"),
      "utf8",
    );
    assert.equal(events.trim().split(/\r?\n/).length, 5);

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

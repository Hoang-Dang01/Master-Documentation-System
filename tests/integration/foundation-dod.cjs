const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "../..");
const standardsPath = path.join(repositoryRoot, "mds-core/standards/document_standards.md");
const { importDocument } = require("../../packages/application/ingestion/dist/index.js");
const {
  buildGraphIndex,
  buildImplementationContext,
  createGraphImpactProposal,
  loadRequirementLineage,
  projectCurrentTruth,
  readRequirementVersion,
  reviewRequirement,
} = require("../../packages/application/requirements/dist/index.js");

async function sha256(filePath) {
  return crypto.createHash("sha256").update(await fs.readFile(filePath)).digest("hex");
}

async function main() {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "mds-foundation-dod-"));
  const activeProjectsRoot = path.join(temporaryRoot, "active");
  const projectPath = path.join(activeProjectsRoot, "proof");
  const managedSourcePath = path.join(projectPath, "managed-project", "src", "notification.ts");
  const sourceChangePath = path.join(temporaryRoot, "customer-change.md");

  try {
    await fs.mkdir(path.dirname(managedSourcePath), { recursive: true });
    await fs.mkdir(path.join(projectPath, "design"), { recursive: true });
    await fs.writeFile(managedSourcePath, "export const notification = 'unchanged';\n", "utf8");
    const managedSourceBefore = await sha256(managedSourcePath);

    await fs.writeFile(sourceChangePath, "Customer requires notification delivery status and retry evidence.\n", "utf8");
    const imported = await importDocument(sourceChangePath, projectPath, activeProjectsRoot);
    assert.match(imported.requirementRelativePath, /^requirements\//);

    const approval = await reviewRequirement(
      projectPath,
      activeProjectsRoot,
      imported.requirementRelativePath,
      "APPROVED",
      "human-release-authority",
      "Foundation proving-slice approval evidence.",
    );
    assert.equal(approval.lifecycleState, "APPROVED");
    assert.equal(approval.approvedHeadVersionId, approval.versionId);
    const lineage = await loadRequirementLineage(projectPath, activeProjectsRoot, approval.lineageId);
    assert.equal(lineage.approvedHeadVersionId, approval.versionId);

    const approved = await readRequirementVersion(projectPath, activeProjectsRoot, approval.lineageId);
    const approvedPath = path.join(projectPath, approved.result.relativePath);
    const approvedContent = await fs.readFile(approvedPath, "utf8");
    await fs.writeFile(approvedPath, approvedContent.replace("##", "##"), "utf8");
    assert.equal(await sha256(approvedPath), lineage.versions[approval.versionId].contentSha256);

    await fs.writeFile(path.join(projectPath, "design", "notification-api.md"), `---
id: BE-API-PRF-NOTIFY-001
lineage_id: BE-API-PRF-NOTIFY-001
artifact_type: API
title: Notification delivery API
project: proof
lifecycle_state: APPROVED
validity_state: CURRENT
version: 1.0.0
owner: be_agent
implements: ${approval.artifactId}
source_refs: [${approval.versionId}]
---

# Notification delivery API
`, "utf8");
    await fs.writeFile(path.join(projectPath, "design", "notification-tests.md"), `---
id: QA-TST-PRF-NOTIFY-001
lineage_id: QA-TST-PRF-NOTIFY-001
artifact_type: TEST
title: Notification delivery tests
project: proof
lifecycle_state: APPROVED
validity_state: CURRENT
version: 1.0.0
owner: qa_agent
verifies: BE-API-PRF-NOTIFY-001
source_refs: [BE-API-PRF-NOTIFY-001@1.0.0]
---

# Notification delivery tests
`, "utf8");

    const graph = await buildGraphIndex({
      projectPath,
      activeProjectsRoot,
      documentStandardsPath: standardsPath,
      completedAt: "2026-08-16T12:00:00.000Z",
    });
    const impact = createGraphImpactProposal(graph, approval.artifactId, "0.1.0");
    assert.deepEqual(impact.affectedArtifacts.map((item) => item.artifactId), [
      "BE-API-PRF-NOTIFY-001",
      "QA-TST-PRF-NOTIFY-001",
    ]);
    assert.equal(impact.proposals.length, 2);
    assert(impact.paths.every((impactPath) => impactPath.slice(1).every((step) => step.evidence.length > 0)));

    const approvedHeadVersionIds = new Set([
      approval.versionId,
      "BE-API-PRF-NOTIFY-001@1.0.0",
      "QA-TST-PRF-NOTIFY-001@1.0.0",
    ]);
    const truth = projectCurrentTruth(graph, {
      approvedHeadVersionIds,
      validityProposals: impact.proposals,
      generatedAt: "2026-08-16T12:01:00.000Z",
    });
    assert(truth.warnings.some((item) => item.artifactId === "BE-API-PRF-NOTIFY-001"));
    assert(truth.warnings.find((item) => item.artifactId === "BE-API-PRF-NOTIFY-001").warnings.length > 0);

    const context = buildImplementationContext(truth, new Map([["BE-API-PRF-NOTIFY-001", "Approved API evidence"]]));
    assert(context.instructions.every((item) => item.instructionsEligible));
    assert.equal(context.instructions.some((item) => item.artifactId === "BE-API-PRF-NOTIFY-001"), false);
    assert.equal(context.warnings.find((item) => item.artifactId === "BE-API-PRF-NOTIFY-001").instructionsEligible, false);
    assert.match(context.authorityNotice, /does not authorize source, test, Git, PR, or deployment mutation/);
    assert.equal(await sha256(managedSourcePath), managedSourceBefore);

    console.log(JSON.stringify({
      sourceChange: imported.sourceRelativePath,
      approvedHead: lineage.approvedHeadVersionId,
      impactReportId: impact.reportId,
      affectedArtifacts: impact.affectedArtifacts.map((item) => item.artifactId),
      truth: {
        authoritative: truth.authoritative.map((item) => item.artifactId),
        warnings: truth.warnings.map((item) => item.artifactId),
        excludedCount: truth.excluded.length,
      },
      contextInstructions: context.instructions.map((item) => item.versionId),
      managedProjectSourceSha256: managedSourceBefore,
      managedProjectSourceUnchanged: true,
    }, null, 2));
    console.log("[FOUNDATION-DOD] Source change -> approval -> lineage -> graph impact -> truth -> context passed; managed-project source unchanged.");
  } finally {
    const resolved = path.resolve(temporaryRoot);
    const temp = path.resolve(os.tmpdir());
    if (resolved.startsWith(`${temp}${path.sep}`) && path.basename(resolved).startsWith("mds-foundation-dod-")) {
      await fs.rm(resolved, { recursive: true, force: true });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

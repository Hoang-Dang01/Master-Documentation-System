const assert = require("node:assert/strict");
const { buildImplementationContext, projectCurrentTruth } = require("../../packages/application/requirements/dist/index.js");

function node(id, lifecycle, validity, version = "1.0.0") {
  return {
    id, projectId: "truth", artifactType: "REQ", title: id, lifecycleState: lifecycle,
    sourcePath: `${id}.md`, contentHash: "a".repeat(64),
    metadata: { id, title: id, version, lineage_id: id, validity_state: validity, source_refs: [`source/${id}.md`] },
  };
}

const graph = {
  projectId: "truth", runId: "run-truth-001", scannedFiles: 5, indexedNodes: 5, indexedEdges: 0,
  completedAt: "2026-08-16T00:00:00.000Z", edges: [], issues: [],
  nodes: [
    node("BA-REQ-TRU-CORE-001", "APPROVED", "CURRENT"),
    node("BA-REQ-TRU-CORE-002", "APPROVED", "NEEDS_REVIEW"),
    node("BA-REQ-TRU-CORE-003", "DRAFT", "CURRENT"),
    node("BA-REQ-TRU-CORE-004", "APPROVED", "STALE"),
    node("BA-REQ-TRU-CORE-005", "APPROVED", "CONFLICTED"),
  ],
};
const truth = projectCurrentTruth(graph, { generatedAt: "2026-08-16T00:01:00.000Z" });
assert.deepEqual(truth.authoritative.map((item) => item.artifactId), ["BA-REQ-TRU-CORE-001"]);
assert.deepEqual(truth.warnings.map((item) => item.artifactId), ["BA-REQ-TRU-CORE-002"]);
assert.deepEqual(truth.conflicts.map((item) => item.artifactId), ["BA-REQ-TRU-CORE-005"]);
assert.equal(truth.excluded.length, 3);
assert.ok(truth.authoritative[0].versionId.endsWith("@1.0.0"));

const context = buildImplementationContext(truth, new Map([["BA-REQ-TRU-CORE-001", "approved instructions"]]));
assert.equal(context.instructions.length, 1);
assert.equal(context.instructions[0].instructionsEligible, true);
assert.equal(context.instructions[0].content, "approved instructions");
assert.equal(context.warnings[0].instructionsEligible, false);
assert.match(context.authorityNotice, /does not authorize source/);
assert.equal(context.excludedCount, 3);

const impactedTruth = projectCurrentTruth(graph, {
  generatedAt: "2026-08-16T00:02:00.000Z",
  validityProposals: [{
    artifactId: "BA-REQ-TRU-CORE-001", version: "1.0.0", from: "CURRENT", to: "NEEDS_REVIEW",
    reason: "Evidence-backed change path", sourceReferences: ["source.md:links:4"], path: [],
  }],
});
assert.equal(impactedTruth.authoritative.some((item) => item.artifactId === "BA-REQ-TRU-CORE-001"), false);
assert.equal(impactedTruth.warnings.some((item) => item.artifactId === "BA-REQ-TRU-CORE-001"), true);
const impactedContext = buildImplementationContext(impactedTruth, new Map([["BA-REQ-TRU-CORE-001", "must not become instructions"]]));
assert.equal(impactedContext.instructions.some((item) => item.artifactId === "BA-REQ-TRU-CORE-001"), false);
assert.equal(impactedContext.warnings.find((item) => item.artifactId === "BA-REQ-TRU-CORE-001").instructionsEligible, false);
console.log("[TRUTH] Deterministic authoritative/warning/excluded projection and safe context authority labels passed.");

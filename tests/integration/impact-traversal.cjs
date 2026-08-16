const assert = require("node:assert/strict");
const { traverseImpact } = require("../../packages/application/requirements/dist/index.js");

function node(id, type, validity = "CURRENT") {
  return {
    id,
    projectId: "synthetic",
    artifactType: type,
    title: id,
    lifecycleState: "APPROVED",
    sourcePath: `${id}.md`,
    contentHash: "a".repeat(64),
    metadata: { id, title: id, version: "1.0.0", validity_state: validity },
  };
}

function edge(sourceId, targetId, relationshipType, lineStart) {
  return {
    id: `${sourceId}-${relationshipType}-${targetId}`,
    projectId: "synthetic",
    sourceId,
    targetId,
    relationshipType,
    direction: "outbound",
    status: "confirmed",
    origin: "parsed",
    evidence: [{
      artifactPath: `${sourceId}.md`,
      fieldPath: "links[].target",
      rawValue: targetId,
      lineStart,
      lineEnd: lineStart,
      origin: "frontmatter",
    }],
  };
}

const graph = {
  projectId: "synthetic",
  runId: "run-001",
  scannedFiles: 4,
  indexedNodes: 4,
  indexedEdges: 3,
  completedAt: "2026-08-16T00:00:00.000Z",
  nodes: [
    node("BA-REQ-SYN-CORE-001", "REQ"),
    node("BE-API-SYN-CORE-001", "API"),
    node("BE-DB-SYN-CORE-001", "DB"),
    node("QA-TC-SYN-CORE-001", "TC", "NEEDS_REVIEW"),
  ],
  edges: [
    edge("BE-API-SYN-CORE-001", "BA-REQ-SYN-CORE-001", "implements", 10),
    edge("BE-DB-SYN-CORE-001", "BE-API-SYN-CORE-001", "implements", 11),
    edge("QA-TC-SYN-CORE-001", "BA-REQ-SYN-CORE-001", "verifies", 12),
  ],
  issues: [],
};

const result = traverseImpact(graph, "BA-REQ-SYN-CORE-001", { sourceVersion: "1.1.0" });
assert.equal(result.sourceVersion, "1.1.0");
assert.equal(result.paths.length, 3);
assert.deepEqual(
  result.affectedArtifacts.map((artifact) => artifact.artifactId),
  ["BE-API-SYN-CORE-001", "BE-DB-SYN-CORE-001", "QA-TC-SYN-CORE-001"],
);
assert.deepEqual(
  result.proposals.map((proposal) => proposal.artifactId),
  ["BE-API-SYN-CORE-001", "BE-DB-SYN-CORE-001"],
);
assert.ok(result.proposals.every((proposal) => proposal.from === "CURRENT" && proposal.to === "NEEDS_REVIEW"));
assert.ok(result.proposals.every((proposal) => proposal.path.length >= 2));
assert.ok(result.proposals.every((proposal) => proposal.path.at(-1).evidence.length > 0));
assert.ok(result.proposals.some((proposal) => proposal.path.map((step) => step.artifactId).includes("BE-DB-SYN-CORE-001")));
assert.match(result.proposals[0].sourceReferences.join("\n"), /BE-API-SYN-CORE-001\.md/);
console.log("[IMPACT] Governed reverse-lineage traversal, complete evidence paths, NEEDS_REVIEW-only proposals, and unrelated validity preservation passed.");

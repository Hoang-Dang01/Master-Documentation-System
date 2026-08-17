const assert = require("node:assert/strict");
const { correlateEvidence } = require("../../packages/application/requirements/dist/index.js");

const version = "BE-API-PRF-NOTIFY-001@1.0.0";
const warningVersion = "QA-TST-PRF-NOTIFY-001@1.0.0";
const context = {
  packageId: "proof-run-context", projectId: "proof", generatedAt: "2026-08-17T00:00:00Z",
  authorityNotice: "read-only", sourceRunId: "run", excludedCount: 0,
  instructions: [{ artifactId: "BE-API-PRF-NOTIFY-001", versionId: version, title: "API", sourcePath: "api.md", validityState: "CURRENT", authority: "AUTHORITATIVE", sourceReferences: [], warnings: [], instructionsEligible: true }],
  warnings: [{ artifactId: "QA-TST-PRF-NOTIFY-001", versionId: warningVersion, title: "Tests", sourcePath: "test.md", validityState: "NEEDS_REVIEW", authority: "WARNING", sourceReferences: [], warnings: [], instructionsEligible: false }],
};
const manifest = {
  schema_version: "1.0.0", bundle_id: "IMP-EVD-PROOF-01J5CORRELATE01", project_id: "proof",
  producer: { type: "ci", id: "ci-1" }, produced_at: "2026-08-17T01:00:00Z",
  source_identity: { repository: "proof-repo", commit: "a".repeat(40) }, context_package_id: context.packageId,
  artifact_version_ids: [version], files: [], results: [{ kind: "test", status: "PASSED", command_label: "tests", evidence_file: "results.txt" }],
};
const authority = { projectId: "proof", expectedRepository: "proof-repo", expectedCommit: "a".repeat(40), context };
const matched = correlateEvidence(manifest, authority);
assert.equal(matched.trust, "TRUSTED"); assert.deepEqual(matched.reasons, ["MATCHED"]); assert.deepEqual(matched.matchedVersionIds, [version]);
const stale = correlateEvidence({ ...manifest, source_identity: { ...manifest.source_identity, commit: "b".repeat(40) } }, authority);
assert.equal(stale.trust, "UNTRUSTED"); assert(stale.reasons.includes("COMMIT_MISMATCH"));
const missing = correlateEvidence({ ...manifest, artifact_version_ids: ["BE-API-PRF-OTHER-999@1.0.0"] }, authority);
assert(missing.reasons.includes("ARTIFACT_VERSION_MISSING"));
const nonAuthoritative = correlateEvidence({ ...manifest, artifact_version_ids: [warningVersion] }, authority);
assert(nonAuthoritative.reasons.includes("ARTIFACT_VERSION_NON_AUTHORITATIVE"));
const wrongContext = correlateEvidence({ ...manifest, context_package_id: "unknown" }, authority);
assert(wrongContext.reasons.includes("CONTEXT_NOT_FOUND"));
assert(matched.sourceReferences.some((item) => item.includes(version)));
console.log("[EVIDENCE-CORRELATION] exact context/commit/version trusted; stale, missing and warning authority fail closed.");

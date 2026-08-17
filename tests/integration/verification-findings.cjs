const assert = require("node:assert/strict");
const { projectVerificationFindings } = require("../../packages/application/requirements/dist/index.js");
const base = { bundleId: "IMP-EVD-PROOF-01J5FINDINGS001", projectId: "proof", contextPackageId: "context-1", producer: { type: "ci", id: "ci" }, sourceIdentity: { repository: "repo", commit: "a".repeat(40) }, matchedVersionIds: ["BE-API-PRF-NOTIFY-001@1.0.0"], missingVersionIds: [], nonAuthoritativeVersionIds: [], sourceReferences: ["bundle.json"], trust: "TRUSTED", reasons: ["MATCHED"] };
const results = projectVerificationFindings({ ...base, resultDeclarations: [
  { kind: "test", status: "PASSED", command_label: "tests", evidence_file: "tests.txt" },
  { kind: "build", status: "FAILED", command_label: "build", evidence_file: "build.txt" },
  { kind: "static-analysis", status: "NOT_RUN", command_label: "lint", evidence_file: "lint.txt" },
] });
assert.deepEqual(results.map((item) => item.classification), ["PASS_EVIDENCE", "FAILED_CHECK", "MISSING_EVIDENCE"]);
assert(results.every((item) => item.lifecycleState === "DRAFT"));
assert(results.every((item) => item.contextPackageId === "context-1" && item.sourceReferences.includes("bundle.json")));
const stale = projectVerificationFindings({ ...base, trust: "UNTRUSTED", reasons: ["COMMIT_MISMATCH"], resultDeclarations: [] });
assert.equal(stale[0].classification, "STALE_IDENTITY"); assert.equal(stale[0].severity, "BLOCKER");
const mismatch = projectVerificationFindings({ ...base, trust: "UNTRUSTED", reasons: ["ARTIFACT_VERSION_MISSING"], resultDeclarations: [] });
assert.equal(mismatch[0].classification, "MISMATCH");
const empty = projectVerificationFindings({ ...base, resultDeclarations: [] });
assert.equal(empty[0].classification, "MISSING_EVIDENCE");
assert.deepEqual(base.matchedVersionIds, ["BE-API-PRF-NOTIFY-001@1.0.0"]);
console.log("[VERIFICATION-FINDINGS] deterministic DRAFT pass/fail/missing/stale/mismatch findings passed.");

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const {
  correlateEvidence,
  importEvidenceBundle,
  projectVerificationFindings,
} = require("../../packages/application/requirements/dist/index.js");
const {
  FilesystemEvidenceBundleRepository,
  listFilesystemEvidenceBundles,
} = require("../../packages/infrastructure/persistence/dist/index.js");

const sha = (value) => crypto.createHash("sha256").update(value).digest("hex");

async function main() {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "mds-runtime-feedback-dod-"));
  const activeProjectsRoot = path.join(temporaryRoot, "active");
  const projectPath = path.join(activeProjectsRoot, "proof");
  const submissionPath = path.join(temporaryRoot, "implementation-evidence");
  const managedSourcePath = path.join(projectPath, "managed-project", "src", "notification.ts");
  try {
    await fs.mkdir(path.dirname(managedSourcePath), { recursive: true });
    await fs.mkdir(submissionPath, { recursive: true });
    await fs.writeFile(managedSourcePath, "export const implementation = 'external';\n", "utf8");
    const managedBefore = sha(await fs.readFile(managedSourcePath));

    const artifactVersionId = "BE-API-PRF-NOTIFY-001@1.0.0";
    const contextPackage = {
      packageId: "proof-runtime-context", projectId: "proof", generatedAt: "2026-08-17T08:00:00Z",
      authorityNotice: "MDS context is bounded read-only evidence. It does not authorize source, test, Git, PR, or deployment mutation.",
      sourceRunId: "run-feedback-dod", excludedCount: 0, warnings: [],
      instructions: [{ artifactId: "BE-API-PRF-NOTIFY-001", version: "1.0.0", versionId: artifactVersionId, title: "Notification API", sourcePath: "design/api.md", lifecycleState: "APPROVED", validityState: "CURRENT", authority: "AUTHORITATIVE", sourceReferences: ["design/api.md"], warnings: [], instructionsEligible: true }],
    };
    const resultBytes = Buffer.from("build passed\n18 tests passed\n");
    await fs.writeFile(path.join(submissionPath, "verification.txt"), resultBytes);
    const manifest = {
      schema_version: "1.0.0", bundle_id: "IMP-EVD-PROOF-01J5FEEDBACKDOD", project_id: "proof",
      producer: { type: "ci", id: "external-implementation-plane" }, produced_at: "2026-08-17T08:05:00Z",
      source_identity: { repository: "proof-managed-repository", commit: "c".repeat(40) },
      context_package_id: contextPackage.packageId, artifact_version_ids: [artifactVersionId],
      results: [
        { kind: "build", status: "PASSED", command_label: "production build", evidence_file: "verification.txt" },
        { kind: "test", status: "PASSED", command_label: "integration tests", evidence_file: "verification.txt" },
      ],
      files: [{ path: "verification.txt", sha256: sha(resultBytes), size: resultBytes.length }],
      signature: { algorithm: "none" },
    };
    const manifestPath = path.join(submissionPath, "manifest.json");
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    const repository = new FilesystemEvidenceBundleRepository();
    const imported = await importEvidenceBundle({
      projectPath, activeProjectsRoot,
      submission: { manifestPath, filesRoot: submissionPath }, repository,
    });
    const bundles = await listFilesystemEvidenceBundles(projectPath);
    assert.equal(bundles.length, 1); assert.equal(bundles[0].bundleId, manifest.bundle_id);
    const correlation = correlateEvidence(manifest, {
      projectId: "proof", expectedRepository: "proof-managed-repository",
      expectedCommit: "c".repeat(40), context: contextPackage,
    });
    assert.equal(correlation.trust, "TRUSTED");
    const findings = projectVerificationFindings(correlation);
    assert.deepEqual(findings.map((finding) => finding.classification), ["PASS_EVIDENCE", "PASS_EVIDENCE"]);
    assert(findings.every((finding) => finding.lifecycleState === "DRAFT" && finding.severity === "INFO"));
    assert.equal(await importEvidenceBundle({ projectPath, activeProjectsRoot, submission: { manifestPath, filesRoot: submissionPath }, repository }).then((value) => value.replay), true);
    assert.equal(sha(await fs.readFile(managedSourcePath)), managedBefore);
    console.log(JSON.stringify({
      bundleId: imported.bundleId, manifestSha256: imported.submittedManifestSha256,
      contextPackageId: correlation.contextPackageId, artifactVersionIds: correlation.matchedVersionIds,
      trust: correlation.trust, findings: findings.map(({ findingId, classification, lifecycleState }) => ({ findingId, classification, lifecycleState })),
      desktopListCount: bundles.length, managedProjectSourceSha256: managedBefore,
      managedProjectSourceUnchanged: true, releaseApproved: false,
    }, null, 2));
    console.log("[RUNTIME-FEEDBACK-DOD] intake -> immutable storage -> correlation -> DRAFT findings -> desktop list passed; managed source unchanged.");
  } finally {
    const resolved = path.resolve(temporaryRoot), allowed = path.resolve(os.tmpdir());
    if (resolved.startsWith(`${allowed}${path.sep}`) && path.basename(resolved).startsWith("mds-runtime-feedback-dod-")) await fs.rm(resolved, { recursive: true, force: true });
  }
}
main().catch((error) => { console.error(error); process.exit(1); });

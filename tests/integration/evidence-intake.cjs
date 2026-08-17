const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { importEvidenceBundle } = require("../../packages/application/requirements/dist/index.js");
const { FilesystemEvidenceBundleRepository } = require("../../packages/infrastructure/persistence/dist/index.js");

const sha = (value) => crypto.createHash("sha256").update(value).digest("hex");

async function main() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "mds-evidence-intake-"));
  const activeRoot = path.join(tempRoot, "active");
  const project = path.join(activeRoot, "proof");
  const submission = path.join(tempRoot, "submission");
  const managed = path.join(project, "managed-project", "src", "app.ts");
  try {
    await fs.mkdir(path.dirname(managed), { recursive: true });
    await fs.mkdir(submission, { recursive: true });
    await fs.writeFile(managed, "export const untouched = true;\n");
    const managedBefore = sha(await fs.readFile(managed));
    const evidenceBytes = Buffer.from("12 tests passed\n");
    await fs.writeFile(path.join(submission, "test-output.txt"), evidenceBytes);
    const manifest = {
      schema_version: "1.0.0", bundle_id: "IMP-EVD-PROOF-01J5EVIDENCE01", project_id: "proof",
      producer: { type: "ci", id: "local-fixture" }, produced_at: "2026-08-17T06:00:00.000Z",
      source_identity: { repository: "proof-repository", commit: "a".repeat(40) },
      context_package_id: "proof-run-context", artifact_version_ids: ["BE-API-PRF-NOTIFY-001@1.0.0"],
      results: [{ kind: "test", status: "PASSED", command_label: "unit test suite", evidence_file: "test-output.txt" }],
      files: [{ path: "test-output.txt", sha256: sha(evidenceBytes), size: evidenceBytes.length }],
      signature: { algorithm: "none" },
    };
    const manifestPath = path.join(submission, "manifest.json");
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    const repository = new FilesystemEvidenceBundleRepository();
    const input = { projectPath: project, activeProjectsRoot: activeRoot, submission: { manifestPath, filesRoot: submission }, repository };
    const first = await importEvidenceBundle(input);
    assert.equal(first.replay, false);
    assert.equal(first.fileCount, 1);
    assert.match(first.relativePath, /^evidence\/bundles\//);
    assert.equal(await fs.readFile(path.join(project, first.relativePath, "files", sha(evidenceBytes)), "utf8"), evidenceBytes.toString());
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(project, first.relativePath, "submitted-manifest.json"), "utf8")), manifest);
    const second = await importEvidenceBundle(input);
    assert.equal(second.replay, true);
    assert.equal(second.submittedManifestSha256, first.submittedManifestSha256);
    assert.equal(sha(await fs.readFile(managed)), managedBefore);
    console.log(`[EVIDENCE-INTAKE] immutable bundle=${first.bundleId}, replay=true, managed-source-unchanged=true`);
  } finally {
    const resolved = path.resolve(tempRoot), allowed = path.resolve(os.tmpdir());
    if (resolved.startsWith(`${allowed}${path.sep}`) && path.basename(resolved).startsWith("mds-evidence-intake-")) await fs.rm(resolved, { recursive: true, force: true });
  }
}
main().catch((error) => { console.error(error); process.exit(1); });

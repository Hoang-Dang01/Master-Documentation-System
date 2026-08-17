const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { validateEvidenceManifest } = require("../../packages/core/domain/dist/index.js");
const { importEvidenceBundle } = require("../../packages/application/requirements/dist/index.js");
const { FilesystemEvidenceBundleRepository } = require("../../packages/infrastructure/persistence/dist/index.js");
const sha = (value) => crypto.createHash("sha256").update(value).digest("hex");

function base(overrides = {}) {
  return { schema_version: "1.0.0", bundle_id: "IMP-EVD-PROOF-01J5SECURITY001", project_id: "proof",
    producer: { type: "developer", id: "fixture" }, produced_at: "2026-08-17T06:00:00Z",
    source_identity: { repository: "repo", commit: "b".repeat(40) }, context_package_id: "context-1",
    artifact_version_ids: ["BE-API-PRF-NOTIFY-001@1.0.0"],
    results: [{ kind: "test", status: "FAILED", command_label: "tests", evidence_file: "result.txt" }],
    files: [{ path: "result.txt", sha256: sha("failed"), size: 6 }], ...overrides };
}
const reject = (manifest, pattern) => assert.throws(() => validateEvidenceManifest(manifest, "proof"), pattern);

async function main() {
  reject(base({ project_id: "other" }), /identity mismatch/);
  reject(base({ bundle_id: "bad" }), /bundle_id/);
  for (const unsafe of ["../escape", "/absolute", "C:\\evil", "CON", "a/../b", "trailing. "]) reject(base({ files: [{ path: unsafe, sha256: sha("failed"), size: 6 }] }), /path|segment|relative/);
  reject(base({ files: [{ path: "result.txt", sha256: "BAD", size: 6 }] }), /SHA-256/);
  reject(base({ files: Array.from({ length: 101 }, (_, index) => ({ path: `f${index}.txt`, sha256: sha(String(index)), size: 1 })) }), /count/);
  reject(base({ files: [{ path: "result.txt", sha256: sha("failed"), size: 25 * 1024 * 1024 + 1 }] }), /size/);
  reject(base({ results: [{ kind: "unknown", status: "FAILED", command_label: "x", evidence_file: "result.txt" }] }), /enum/);

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "mds-evidence-security-"));
  const activeRoot = path.join(tempRoot, "active"), project = path.join(activeRoot, "proof"), submission = path.join(tempRoot, "submission");
  try {
    await fs.mkdir(project, { recursive: true }); await fs.mkdir(submission, { recursive: true });
    await fs.writeFile(path.join(submission, "result.txt"), "tampered");
    const manifestPath = path.join(submission, "manifest.json");
    await fs.writeFile(manifestPath, JSON.stringify(base()));
    const repository = new FilesystemEvidenceBundleRepository();
    const input = { projectPath: project, activeProjectsRoot: activeRoot, submission: { manifestPath, filesRoot: submission }, repository };
    await assert.rejects(() => importEvidenceBundle(input), /size mismatch|checksum mismatch/);
    await assert.rejects(() => fs.access(path.join(project, "evidence", "bundles", base().bundle_id)));
    await fs.writeFile(path.join(submission, "result.txt"), "failed");
    await importEvidenceBundle(input);
    const changed = base({ producer: { type: "developer", id: "different" } });
    await fs.writeFile(manifestPath, JSON.stringify(changed));
    await assert.rejects(() => importEvidenceBundle(input), /collision/);
    console.log("[EVIDENCE-SECURITY] traversal, bounds, tamper, project identity and bundle collision fail closed.");
  } finally {
    const resolved = path.resolve(tempRoot), allowed = path.resolve(os.tmpdir());
    if (resolved.startsWith(`${allowed}${path.sep}`) && path.basename(resolved).startsWith("mds-evidence-security-")) await fs.rm(resolved, { recursive: true, force: true });
  }
}
main().catch((error) => { console.error(error); process.exit(1); });

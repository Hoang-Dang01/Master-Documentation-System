import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  EvidenceBundleRepository,
  EvidenceImportResult,
  EvidenceBundleSummary,
  ValidatedEvidenceImport,
} from "@mds/requirements";

export async function listFilesystemEvidenceBundles(projectPath: string): Promise<EvidenceBundleSummary[]> {
  const root = path.join(projectPath, "evidence", "bundles");
  let entries: import("node:fs").Dirent[];
  try { entries = await fs.readdir(root, { withFileTypes: true }); } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const summaries: EvidenceBundleSummary[] = [];
  for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const directory = path.join(root, entry.name);
    const stored = JSON.parse(await fs.readFile(path.join(directory, "manifest.json"), "utf8")) as Record<string, unknown>;
    const producer = stored.producer as { type?: string; id?: string } | undefined;
    const source = stored.source_identity as { repository?: string; commit?: string } | undefined;
    summaries.push({
      bundleId: String(stored.bundle_id ?? entry.name), projectId: String(stored.project_id ?? path.basename(projectPath)),
      acceptedAt: String(stored.accepted_at ?? ""), contextPackageId: String(stored.context_package_id ?? ""),
      producerType: String(producer?.type ?? "unknown"), producerId: String(producer?.id ?? "unknown"),
      repository: String(source?.repository ?? ""), commit: String(source?.commit ?? ""),
      artifactVersionIds: Array.isArray(stored.artifact_version_ids) ? stored.artifact_version_ids.map(String) : [],
      results: Array.isArray(stored.results) ? stored.results as EvidenceBundleSummary["results"] : [],
      submittedManifestSha256: String(stored.submitted_manifest_sha256 ?? ""),
      relativePath: path.relative(projectPath, directory).replaceAll("\\", "/"),
    });
  }
  return summaries.sort((a, b) => b.acceptedAt.localeCompare(a.acceptedAt));
}

async function readExistingResult(directory: string, input: ValidatedEvidenceImport): Promise<EvidenceImportResult> {
  const stored = JSON.parse(await fs.readFile(path.join(directory, "manifest.json"), "utf8")) as {
    submitted_manifest_sha256?: string;
  };
  if (stored.submitted_manifest_sha256 !== input.submittedManifestSha256) throw new Error("Evidence bundle ID collision with different manifest bytes");
  return {
    bundleId: input.manifest.bundle_id,
    relativePath: path.relative(input.projectPath, directory).replaceAll("\\", "/"),
    submittedManifestSha256: input.submittedManifestSha256,
    fileCount: input.files.length,
    totalBytes: input.files.reduce((sum, item) => sum + item.size, 0),
    replay: true,
  };
}

export class FilesystemEvidenceBundleRepository implements EvidenceBundleRepository {
  async importBundle(input: ValidatedEvidenceImport): Promise<EvidenceImportResult> {
    const evidenceRoot = path.join(input.projectPath, "evidence");
    const bundlesRoot = path.join(evidenceRoot, "bundles");
    const stagingRoot = path.join(evidenceRoot, "staging");
    const destination = path.join(bundlesRoot, input.manifest.bundle_id);
    await Promise.all([fs.mkdir(bundlesRoot, { recursive: true }), fs.mkdir(stagingRoot, { recursive: true })]);
    try { await fs.access(destination); return readExistingResult(destination, input); } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    const staging = path.join(stagingRoot, `${input.manifest.bundle_id}.${process.pid}.${randomBytes(6).toString("hex")}`);
    await fs.mkdir(path.join(staging, "files"), { recursive: true });
    try {
      await fs.writeFile(path.join(staging, "submitted-manifest.json"), input.submittedManifestBytes, { flag: "wx" });
      const normalized = {
        ...input.manifest,
        submitted_manifest_sha256: input.submittedManifestSha256,
        accepted_at: new Date().toISOString(),
      };
      await fs.writeFile(path.join(staging, "manifest.json"), `${JSON.stringify(normalized, null, 2)}\n`, { flag: "wx" });
      const written = new Set<string>();
      for (const file of input.files) {
        if (written.has(file.sha256)) continue;
        await fs.writeFile(path.join(staging, "files", file.sha256), file.bytes, { flag: "wx" });
        written.add(file.sha256);
      }
      await fs.writeFile(path.join(staging, "audit.jsonl"), `${JSON.stringify({ type: "EVIDENCE_BUNDLE_ACCEPTED", bundleId: input.manifest.bundle_id, manifestSha256: input.submittedManifestSha256 })}\n`, { flag: "wx" });
      try { await fs.rename(staging, destination); } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "EEXIST" || (error as NodeJS.ErrnoException).code === "ENOTEMPTY") return readExistingResult(destination, input);
        throw error;
      }
      return {
        bundleId: input.manifest.bundle_id,
        relativePath: path.relative(input.projectPath, destination).replaceAll("\\", "/"),
        submittedManifestSha256: input.submittedManifestSha256,
        fileCount: input.files.length,
        totalBytes: input.files.reduce((sum, item) => sum + item.size, 0),
        replay: false,
      };
    } catch (error) {
      const resolved = path.resolve(staging);
      const allowed = path.resolve(stagingRoot);
      if (resolved.startsWith(`${allowed}${path.sep}`)) await fs.rm(resolved, { recursive: true, force: true }).catch(() => undefined);
      throw error;
    }
  }
}

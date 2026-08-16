import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  assertArtifactLineageManifest,
  assertLineageId,
  buildLineageDecision,
  createLineageManifest,
  sha256,
  versionId,
  type ApprovalDecision,
  type ArtifactLineageManifest,
  type LineageTransition,
} from "@mds/domain";

const MANIFEST_FILE = "lineage.json";

type StoredLineageManifest = {
  schema_version: "1.0.0";
  lineage_id: string;
  artifact_type: string;
  project_id: string;
  revision: number;
  approved_head_version_id: string | null;
  versions: Record<string, {
    version_id: string;
    version: string;
    relative_path: string;
    content_sha256: string;
    effective_lifecycle_state: "DRAFT" | "REVIEW" | "APPROVED" | "DEPRECATED";
    validity_state: "CURRENT" | "NEEDS_REVIEW" | "STALE" | "CONFLICTED";
    supersedes: string | null;
    registered_at: string;
    sealed_at?: string;
  }>;
  transitions: Array<{
    transition_id: string;
    decision: "APPROVED" | "REJECTED";
    actor: string;
    reason: string;
    decided_at: string;
    expected_revision: number;
    from_head: string | null;
    candidate_version_id: string;
    candidate_sha256: string;
  }>;
};

export type RequirementLineageResult = {
  lineageId: string;
  versionId: string;
  version: string;
  relativePath: string;
  manifestRelativePath: string;
  lifecycleState: "DRAFT" | "REVIEW" | "APPROVED" | "DEPRECATED";
  approvedHeadVersionId: string | null;
  revision: number;
  approvalId?: string;
  replay?: boolean;
};

function safeProjectPath(projectPath: string, activeProjectsRoot: string): string {
  const project = path.resolve(projectPath);
  const root = path.resolve(activeProjectsRoot);
  if (project !== root && !project.startsWith(`${root}${path.sep}`)) {
    throw new Error("Project is outside MDS_DATA_DIR/projects/active.");
  }
  return project;
}

function lineageDirectory(projectPath: string, lineageId: string): string {
  assertLineageId(lineageId);
  return path.join(projectPath, "artifacts", "lineages", lineageId);
}

function manifestPath(projectPath: string, lineageId: string): string {
  return path.join(lineageDirectory(projectPath, lineageId), MANIFEST_FILE);
}

function toStored(manifest: ArtifactLineageManifest): StoredLineageManifest {
  return {
    schema_version: manifest.schemaVersion,
    lineage_id: manifest.lineageId,
    artifact_type: manifest.artifactType,
    project_id: manifest.projectId,
    revision: manifest.revision,
    approved_head_version_id: manifest.approvedHeadVersionId,
    versions: Object.fromEntries(
      Object.entries(manifest.versions).map(([key, value]) => [key, {
        version_id: value.versionId,
        version: value.version,
        relative_path: value.relativePath,
        content_sha256: value.contentSha256,
        effective_lifecycle_state: value.effectiveLifecycleState,
        validity_state: value.validityState,
        supersedes: value.supersedes,
        registered_at: value.registeredAt,
        ...(value.sealedAt ? { sealed_at: value.sealedAt } : {}),
      }]),
    ),
    transitions: manifest.transitions.map((value) => ({
      transition_id: value.transitionId,
      decision: value.decision,
      actor: value.actor,
      reason: value.reason,
      decided_at: value.decidedAt,
      expected_revision: value.expectedRevision,
      from_head: value.fromHead,
      candidate_version_id: value.candidateVersionId,
      candidate_sha256: value.candidateSha256,
    })),
  };
}

function fromStored(value: StoredLineageManifest): ArtifactLineageManifest {
  const manifest: ArtifactLineageManifest = {
    schemaVersion: value.schema_version,
    lineageId: value.lineage_id,
    artifactType: value.artifact_type,
    projectId: value.project_id,
    revision: value.revision,
    approvedHeadVersionId: value.approved_head_version_id,
    versions: Object.fromEntries(
      Object.entries(value.versions).map(([key, record]) => [key, {
        versionId: record.version_id,
        version: record.version,
        relativePath: record.relative_path,
        contentSha256: record.content_sha256,
        effectiveLifecycleState: record.effective_lifecycle_state,
        validityState: record.validity_state,
        supersedes: record.supersedes,
        registeredAt: record.registered_at,
        sealedAt: record.sealed_at,
      }]),
    ),
    transitions: value.transitions.map((record) => ({
      transitionId: record.transition_id,
      decision: record.decision,
      actor: record.actor,
      reason: record.reason,
      decidedAt: record.decided_at,
      expectedRevision: record.expected_revision,
      fromHead: record.from_head,
      candidateVersionId: record.candidate_version_id,
      candidateSha256: record.candidate_sha256,
    })),
  };
  assertArtifactLineageManifest(manifest);
  return manifest;
}

async function writeAtomic(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  const handle = await fs.open(temporaryPath, "wx");
  try {
    await handle.writeFile(content, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
  try {
    await fs.rename(temporaryPath, filePath);
  } catch (error) {
    if (process.platform !== "win32" || (error as NodeJS.ErrnoException).code !== "EEXIST") {
      await fs.unlink(temporaryPath).catch(() => undefined);
      throw error;
    }
    const backupPath = `${filePath}.${randomUUID()}.bak`;
    let hadPrior = false;
    try {
      await fs.rename(filePath, backupPath);
      hadPrior = true;
    } catch (backupError) {
      if ((backupError as NodeJS.ErrnoException).code !== "ENOENT") {
        await fs.unlink(temporaryPath).catch(() => undefined);
        throw backupError;
      }
    }
    try {
      await fs.rename(temporaryPath, filePath);
      if (hadPrior) await fs.unlink(backupPath).catch(() => undefined);
    } catch (replacementError) {
      if (hadPrior) await fs.rename(backupPath, filePath).catch(() => undefined);
      await fs.unlink(temporaryPath).catch(() => undefined);
      throw replacementError;
    }
  }
}

async function writeExclusive(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const handle = await fs.open(filePath, "wx");
  try {
    await handle.writeFile(content, "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function loadManifestFile(filePath: string): Promise<ArtifactLineageManifest> {
  return fromStored(JSON.parse(await fs.readFile(filePath, "utf8")) as StoredLineageManifest);
}

async function verifyVersionContent(
  directory: string,
  manifest: ArtifactLineageManifest,
  targetVersionId: string,
): Promise<string> {
  const record = manifest.versions[targetVersionId];
  if (!record) throw new Error("Lineage version is missing");
  const filePath = path.resolve(directory, record.relativePath);
  if (!filePath.startsWith(`${path.resolve(directory)}${path.sep}`)) {
    throw new Error("Lineage version path escapes its directory");
  }
  const content = await fs.readFile(filePath, "utf8");
  if (sha256(content) !== record.contentSha256) {
    throw new Error(`CONFLICTED: content hash mismatch for ${targetVersionId}`);
  }
  return content;
}

async function appendAuditOnce(
  projectPath: string,
  lineageId: string,
  transition: LineageTransition,
): Promise<void> {
  const auditDirectory = path.join(projectPath, "audit");
  const auditPath = path.join(auditDirectory, "events.jsonl");
  await fs.mkdir(auditDirectory, { recursive: true });
  let current = "";
  try { current = await fs.readFile(auditPath, "utf8"); } catch { /* new audit */ }
  const exists = current
    .split(/\r?\n/)
    .filter(Boolean)
    .some((line) => {
      try {
        const value = JSON.parse(line) as { id?: string };
        return value.id === transition.transitionId;
      } catch { return false; }
    });
  if (exists) return;
  const event = {
    id: transition.transitionId,
    type: transition.decision === "APPROVED"
      ? "REQUIREMENT_APPROVED"
      : "REQUIREMENT_REJECTED",
    project: path.basename(projectPath),
    artifactId: lineageId,
    actor: transition.actor,
    occurredAt: transition.decidedAt,
    data: {
      reason: transition.reason,
      versionId: transition.candidateVersionId,
      candidateSha256: transition.candidateSha256,
      fromHead: transition.fromHead,
    },
  };
  await fs.appendFile(auditPath, `${JSON.stringify(event)}\n`, "utf8");
}

async function withLineageLock<T>(
  directory: string,
  operation: () => Promise<T>,
): Promise<T> {
  await fs.mkdir(directory, { recursive: true });
  const lockPath = path.join(directory, ".transition.lock");
  let handle;
  try {
    handle = await fs.open(lockPath, "wx");
    await handle.writeFile(JSON.stringify({ pid: process.pid, acquiredAt: new Date().toISOString() }));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw new Error("Lineage transition is already in progress");
    }
    throw error;
  }
  try {
    return await operation();
  } finally {
    await handle.close();
    await fs.unlink(lockPath).catch(() => undefined);
  }
}

export async function registerRequirementCandidate(input: {
  projectPath: string;
  activeProjectsRoot: string;
  lineageId: string;
  version: string;
  content: string;
  projectId: string;
  supersedes?: string | null;
  registeredAt?: string;
}): Promise<RequirementLineageResult> {
  const project = safeProjectPath(input.projectPath, input.activeProjectsRoot);
  const directory = lineageDirectory(project, input.lineageId);
  const id = versionId(input.lineageId, input.version);
  const relativeVersionPath = `versions/${input.version}.md`;
  const versionPath = path.join(directory, "versions", `${input.version}.md`);
  const hash = sha256(input.content);

  return withLineageLock(directory, async () => {
    let manifest: ArtifactLineageManifest;
    try {
      manifest = await loadManifestFile(manifestPath(project, input.lineageId));
      if (manifest.versions[id]) {
        await verifyVersionContent(directory, manifest, id);
        if (manifest.versions[id].contentSha256 !== hash) {
          throw new Error("Version identity already exists with different content");
        }
        const record = manifest.versions[id];
        return {
          lineageId: manifest.lineageId,
          versionId: id,
          version: record.version,
          relativePath: path.relative(project, versionPath).replaceAll("\\", "/"),
          manifestRelativePath: path.relative(project, manifestPath(project, input.lineageId)).replaceAll("\\", "/"),
          lifecycleState: record.effectiveLifecycleState,
          approvedHeadVersionId: manifest.approvedHeadVersionId,
          revision: manifest.revision,
          replay: true,
        };
      }
      const predecessor = input.supersedes ?? manifest.approvedHeadVersionId;
      if (predecessor !== manifest.approvedHeadVersionId || (predecessor && !manifest.versions[predecessor])) {
        throw new Error("Candidate must supersede the current approved head");
      }
      await writeExclusive(versionPath, input.content);
      manifest = {
        ...manifest,
        revision: manifest.revision + 1,
        versions: {
          ...manifest.versions,
          [id]: {
            versionId: id,
            version: input.version,
            relativePath: relativeVersionPath,
            contentSha256: hash,
            effectiveLifecycleState: "DRAFT",
            validityState: "CURRENT",
            supersedes: predecessor,
            registeredAt: input.registeredAt ?? new Date().toISOString(),
          },
        },
      };
      assertArtifactLineageManifest(manifest);
      await writeAtomic(manifestPath(project, input.lineageId), `${JSON.stringify(toStored(manifest), null, 2)}\n`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      await writeExclusive(versionPath, input.content);
      manifest = createLineageManifest({
        lineageId: input.lineageId,
        artifactType: "REQ",
        projectId: input.projectId,
        version: input.version,
        relativePath: relativeVersionPath,
        contentSha256: hash,
        registeredAt: input.registeredAt ?? new Date().toISOString(),
        supersedes: input.supersedes,
      });
      await writeAtomic(manifestPath(project, input.lineageId), `${JSON.stringify(toStored(manifest), null, 2)}\n`);
    }
    const record = manifest.versions[id];
    return {
      lineageId: manifest.lineageId,
      versionId: id,
      version: record.version,
      relativePath: path.relative(project, versionPath).replaceAll("\\", "/"),
      manifestRelativePath: path.relative(project, manifestPath(project, input.lineageId)).replaceAll("\\", "/"),
      lifecycleState: record.effectiveLifecycleState,
      approvedHeadVersionId: manifest.approvedHeadVersionId,
      revision: manifest.revision,
    };
  });
}

export async function registerRequirementCandidateFromFile(input: {
  projectPath: string;
  activeProjectsRoot: string;
  lineageId: string;
  version: string;
  sourceRelativePath: string;
  projectId: string;
  supersedes?: string | null;
}): Promise<RequirementLineageResult> {
  const project = safeProjectPath(input.projectPath, input.activeProjectsRoot);
  const sourcePath = path.resolve(project, input.sourceRelativePath);
  if (!sourcePath.startsWith(`${project}${path.sep}`) || !sourcePath.endsWith(".md")) {
    throw new Error("Requirement source path escapes the active project");
  }
  return registerRequirementCandidate({
    projectPath: project,
    activeProjectsRoot: input.activeProjectsRoot,
    lineageId: input.lineageId,
    version: input.version,
    content: await fs.readFile(sourcePath, "utf8"),
    projectId: input.projectId,
    supersedes: input.supersedes,
  });
}

export async function loadRequirementLineage(
  projectPath: string,
  activeProjectsRoot: string,
  lineageId: string,
): Promise<ArtifactLineageManifest> {
  const project = safeProjectPath(projectPath, activeProjectsRoot);
  const manifest = await loadManifestFile(manifestPath(project, lineageId));
  const directory = lineageDirectory(project, lineageId);
  for (const id of Object.keys(manifest.versions)) {
    await verifyVersionContent(directory, manifest, id);
  }
  return manifest;
}

export async function readRequirementVersion(
  projectPath: string,
  activeProjectsRoot: string,
  lineageId: string,
  targetVersionId?: string,
): Promise<{ content: string; result: RequirementLineageResult }> {
  const project = safeProjectPath(projectPath, activeProjectsRoot);
  const manifest = await loadManifestFile(manifestPath(project, lineageId));
  const id = targetVersionId ?? manifest.approvedHeadVersionId;
  if (!id) throw new Error("Lineage has no approved head");
  const content = await verifyVersionContent(lineageDirectory(project, lineageId), manifest, id);
  const record = manifest.versions[id];
  return {
    content,
    result: {
      lineageId,
      versionId: id,
      version: record.version,
      relativePath: path.join("artifacts", "lineages", lineageId, record.relativePath).replaceAll("\\", "/"),
      manifestRelativePath: path.relative(project, manifestPath(project, lineageId)).replaceAll("\\", "/"),
      lifecycleState: record.effectiveLifecycleState,
      approvedHeadVersionId: manifest.approvedHeadVersionId,
      revision: manifest.revision,
    },
  };
}

export async function decideRequirementVersion(input: {
  projectPath: string;
  activeProjectsRoot: string;
  lineageId: string;
  candidateVersionId: string;
  decision: ApprovalDecision;
  actor: string;
  reason: string;
  transitionId: string;
  expectedRevision: number;
  decidedAt?: string;
}): Promise<RequirementLineageResult> {
  const project = safeProjectPath(input.projectPath, input.activeProjectsRoot);
  const directory = lineageDirectory(project, input.lineageId);
  return withLineageLock(directory, async () => {
    const current = await loadManifestFile(manifestPath(project, input.lineageId));
    await verifyVersionContent(directory, current, input.candidateVersionId);

    const prior = current.transitions.find((item) => item.transitionId === input.transitionId);
    if (prior) {
      const matching =
        prior.decision === input.decision &&
        prior.actor === input.actor.trim() &&
        prior.reason === input.reason.trim() &&
        prior.candidateVersionId === input.candidateVersionId;
      if (!matching) throw new Error("Idempotency key was reused with different decision input");
      await appendAuditOnce(project, input.lineageId, prior);
      const record = current.versions[input.candidateVersionId];
      return {
        lineageId: input.lineageId,
        versionId: record.versionId,
        version: record.version,
        relativePath: path.join("artifacts", "lineages", input.lineageId, record.relativePath).replaceAll("\\", "/"),
        manifestRelativePath: path.relative(project, manifestPath(project, input.lineageId)).replaceAll("\\", "/"),
        lifecycleState: record.effectiveLifecycleState,
        approvedHeadVersionId: current.approvedHeadVersionId,
        revision: current.revision,
        approvalId: prior.transitionId,
        replay: true,
      };
    }

    const decidedAt = input.decidedAt ?? new Date().toISOString();
    const built = buildLineageDecision(current, {
      transitionId: input.transitionId,
      decision: input.decision,
      actor: input.actor,
      reason: input.reason,
      decidedAt,
      expectedRevision: input.expectedRevision,
      candidateVersionId: input.candidateVersionId,
    });
    const stagingDirectory = path.join(directory, "staging");
    const stagingPath = path.join(stagingDirectory, `${input.transitionId}.json`);
    await fs.mkdir(stagingDirectory, { recursive: true });
    await writeAtomic(stagingPath, `${JSON.stringify({ state: "PREPARED", transition: built.transition }, null, 2)}\n`);
    await writeAtomic(manifestPath(project, input.lineageId), `${JSON.stringify(toStored(built.manifest), null, 2)}\n`);
    await appendAuditOnce(project, input.lineageId, built.transition);
    await fs.unlink(stagingPath).catch(() => undefined);

    const record = built.manifest.versions[input.candidateVersionId];
    return {
      lineageId: input.lineageId,
      versionId: record.versionId,
      version: record.version,
      relativePath: path.join("artifacts", "lineages", input.lineageId, record.relativePath).replaceAll("\\", "/"),
      manifestRelativePath: path.relative(project, manifestPath(project, input.lineageId)).replaceAll("\\", "/"),
      lifecycleState: record.effectiveLifecycleState,
      approvedHeadVersionId: built.manifest.approvedHeadVersionId,
      revision: built.manifest.revision,
      approvalId: built.transition.transitionId,
      replay: false,
    };
  });
}

export async function recoverRequirementLineage(
  projectPath: string,
  activeProjectsRoot: string,
  lineageId: string,
): Promise<{ recoveredTransitions: string[]; uncommittedTransitions: string[] }> {
  const project = safeProjectPath(projectPath, activeProjectsRoot);
  const directory = lineageDirectory(project, lineageId);
  return withLineageLock(directory, async () => {
    const manifest = await loadManifestFile(manifestPath(project, lineageId));
    const stagingDirectory = path.join(directory, "staging");
    let names: string[] = [];
    try { names = await fs.readdir(stagingDirectory); } catch { return { recoveredTransitions: [], uncommittedTransitions: [] }; }
    const recoveredTransitions: string[] = [];
    const uncommittedTransitions: string[] = [];
    for (const name of names.filter((item) => item.endsWith(".json"))) {
      const value = JSON.parse(await fs.readFile(path.join(stagingDirectory, name), "utf8")) as {
        transition?: LineageTransition;
      };
      const transition = value.transition;
      if (!transition) continue;
      const committed = manifest.transitions.find((item) => item.transitionId === transition.transitionId);
      if (committed) {
        await appendAuditOnce(project, lineageId, committed);
        await fs.unlink(path.join(stagingDirectory, name));
        recoveredTransitions.push(transition.transitionId);
      } else {
        uncommittedTransitions.push(transition.transitionId);
      }
    }
    return { recoveredTransitions, uncommittedTransitions };
  });
}

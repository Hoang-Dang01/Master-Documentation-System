const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const {
  decideRequirementVersion,
  loadRequirementLineage,
  readRequirementVersion,
  recoverRequirementLineage,
  registerRequirementCandidate,
} = require("../../packages/application/requirements/dist/index.js");

function requirement(lineageId, version, title) {
  return `---
id: ${lineageId}
lineage_id: ${lineageId}
title: ${title}
project: edumeet
lifecycle_state: DRAFT
validity_state: CURRENT
version: ${version}
owner: ba_agent
---

# ${title}
`;
}

async function main() {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "mds-lineage-"));
  const activeProjectsRoot = path.join(temporaryRoot, "active");
  const projectPath = path.join(activeProjectsRoot, "edumeet");
  const lineageId = "BA-REQ-EDU-AUTH-001";
  try {
    await fs.mkdir(projectPath, { recursive: true });
    const firstContent = requirement(lineageId, "1.0.0", "Authentication requirement");
    const first = await registerRequirementCandidate({
      projectPath, activeProjectsRoot, lineageId, version: "1.0.0",
      content: firstContent, projectId: "edumeet",
    });
    assert.equal(first.revision, 0);
    const approvedFirst = await decideRequirementVersion({
      projectPath, activeProjectsRoot, lineageId,
      candidateVersionId: first.versionId, decision: "APPROVED",
      actor: "human-project-authority", reason: "Initial requirement approved",
      transitionId: "approval-first", expectedRevision: 0,
      decidedAt: "2026-08-16T06:00:00.000Z",
    });
    assert.equal(approvedFirst.approvedHeadVersionId, first.versionId);
    assert.equal(approvedFirst.lifecycleState, "APPROVED");

    const firstVersionPath = path.join(projectPath, approvedFirst.relativePath);
    const immutableBytes = await fs.readFile(firstVersionPath, "utf8");
    const second = await registerRequirementCandidate({
      projectPath, activeProjectsRoot, lineageId, version: "1.1.0",
      content: requirement(lineageId, "1.1.0", "Authentication with MFA"),
      projectId: "edumeet", supersedes: first.versionId,
    });
    const beforeSuccessor = await loadRequirementLineage(projectPath, activeProjectsRoot, lineageId);
    assert.equal(beforeSuccessor.approvedHeadVersionId, first.versionId);

    const rejected = await decideRequirementVersion({
      projectPath, activeProjectsRoot, lineageId,
      candidateVersionId: second.versionId, decision: "REJECTED",
      actor: "human-project-authority", reason: "Needs clearer criteria",
      transitionId: "reject-second", expectedRevision: beforeSuccessor.revision,
      decidedAt: "2026-08-16T06:05:00.000Z",
    });
    assert.equal(rejected.approvedHeadVersionId, first.versionId);
    assert.equal(rejected.lifecycleState, "DRAFT");

    const afterRejection = await loadRequirementLineage(projectPath, activeProjectsRoot, lineageId);
    const approvedSecond = await decideRequirementVersion({
      projectPath, activeProjectsRoot, lineageId,
      candidateVersionId: second.versionId, decision: "APPROVED",
      actor: "human-project-authority", reason: "Criteria clarified",
      transitionId: "approval-second", expectedRevision: afterRejection.revision,
      decidedAt: "2026-08-16T06:10:00.000Z",
    });
    assert.equal(approvedSecond.approvedHeadVersionId, second.versionId);
    const manifest = await loadRequirementLineage(projectPath, activeProjectsRoot, lineageId);
    assert.equal(manifest.versions[first.versionId].effectiveLifecycleState, "DEPRECATED");
    assert.equal(manifest.versions[second.versionId].effectiveLifecycleState, "APPROVED");
    assert.equal(await fs.readFile(firstVersionPath, "utf8"), immutableBytes);

    const replay = await decideRequirementVersion({
      projectPath, activeProjectsRoot, lineageId,
      candidateVersionId: second.versionId, decision: "APPROVED",
      actor: "human-project-authority", reason: "Criteria clarified",
      transitionId: "approval-second", expectedRevision: 1,
      decidedAt: "2026-08-16T06:10:00.000Z",
    });
    assert.equal(replay.replay, true);
    await assert.rejects(() => decideRequirementVersion({
      projectPath, activeProjectsRoot, lineageId,
      candidateVersionId: second.versionId, decision: "REJECTED",
      actor: "human-project-authority", reason: "Different input",
      transitionId: "approval-second", expectedRevision: manifest.revision,
    }), /Idempotency key/);

    const approved = await readRequirementVersion(projectPath, activeProjectsRoot, lineageId);
    assert.equal(approved.result.versionId, second.versionId);
    assert.match(approved.content, /Authentication with MFA/);

    await fs.appendFile(path.join(projectPath, second.relativePath), "tampered\n", "utf8");
    await assert.rejects(
      () => readRequirementVersion(projectPath, activeProjectsRoot, lineageId),
      /CONFLICTED: content hash mismatch/,
    );

    await assert.rejects(() => registerRequirementCandidate({
      projectPath: path.join(temporaryRoot, "outside"), activeProjectsRoot,
      lineageId, version: "2.0.0", content: "x", projectId: "edumeet",
    }), /outside MDS_DATA_DIR/);
    await assert.rejects(() => registerRequirementCandidate({
      projectPath, activeProjectsRoot, lineageId: "..\\escape", version: "2.0.0",
      content: "x", projectId: "edumeet",
    }), /lineage_id/);

    const recovery = await recoverRequirementLineage(projectPath, activeProjectsRoot, lineageId);
    assert.deepEqual(recovery, { recoveredTransitions: [], uncommittedTransitions: [] });

    const events = (await fs.readFile(path.join(projectPath, "audit", "events.jsonl"), "utf8"))
      .trim().split(/\r?\n/).map(JSON.parse);
    assert.equal(events.filter((event) => event.id === "approval-second").length, 1);
    assert.equal(events.find((event) => event.id === "approval-second").data.versionId, second.versionId);
    console.log("[LINEAGE] Immutable versions, single approved head, evidence, idempotency, tamper and path checks passed.");
  } finally {
    await fs.rm(temporaryRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

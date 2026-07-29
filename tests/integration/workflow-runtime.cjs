const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const {
  advanceWorkflow,
  loadWorkflow,
  startWorkflow,
} = require("../../packages/workflow-engine/dist/index.js");

async function main() {
  const temporaryRoot = await fs.mkdtemp(
    path.join(os.tmpdir(), "mds-workflow-runtime-"),
  );
  const activeProjectsRoot = path.join(temporaryRoot, "active");
  const projectPath = path.join(activeProjectsRoot, "edumeet");

  try {
    await fs.mkdir(projectPath, { recursive: true });
    const started = await startWorkflow({
      projectPath,
      activeProjectsRoot,
      project: "edumeet",
      workflowId: "customer-change-analysis",
      stepIds: ["parse-documents", "extract-requirements", "review-requirements"],
    });
    assert.equal(started.status, "RUNNING");
    assert.equal(started.currentStepId, "parse-documents");
    assert.equal(started.steps["parse-documents"], "RUNNING");

    const extracted = await advanceWorkflow(
      projectPath,
      activeProjectsRoot,
      started.id,
      "COMPLETED",
    );
    assert.equal(extracted.currentStepId, "extract-requirements");

    const waiting = await advanceWorkflow(
      projectPath,
      activeProjectsRoot,
      started.id,
      "WAITING_APPROVAL",
    );
    assert.equal(waiting.status, "WAITING_APPROVAL");

    const resumed = await advanceWorkflow(
      projectPath,
      activeProjectsRoot,
      started.id,
      "COMPLETED",
    );
    assert.equal(resumed.status, "RUNNING");
    assert.equal(resumed.currentStepId, "review-requirements");

    const persisted = await loadWorkflow(
      projectPath,
      activeProjectsRoot,
      started.id,
    );
    assert.equal(persisted.currentStepId, "review-requirements");
    assert.match(
      await fs.readFile(
        path.join(projectPath, ".mds", "workflows", `${started.id}.json`),
        "utf8",
      ),
      /review-requirements/,
    );

    console.log(
      "[WORKFLOW] Persisted start, wait-for-approval, resume, and load passed.",
    );
  } finally {
    const resolvedTemporaryRoot = path.resolve(temporaryRoot);
    const resolvedOsTemp = path.resolve(os.tmpdir());
    if (
      resolvedTemporaryRoot.startsWith(`${resolvedOsTemp}${path.sep}`) &&
      path.basename(resolvedTemporaryRoot).startsWith("mds-workflow-runtime-")
    ) {
      await fs.rm(resolvedTemporaryRoot, { recursive: true, force: true });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

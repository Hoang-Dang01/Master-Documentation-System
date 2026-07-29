import { promises as fs } from "node:fs";
import path from "node:path";
import type { AuditEvent, WorkflowRun, WorkflowStepState } from "@mds/domain";

export type WorkflowOutcome = "COMPLETED" | "WAITING_APPROVAL" | "FAILED";

export type StartWorkflowInput = {
  projectPath: string;
  activeProjectsRoot: string;
  project: string;
  workflowId: string;
  stepIds: string[];
};

function assertProjectPath(projectPath: string, activeProjectsRoot: string): string {
  const project = path.resolve(projectPath);
  const root = path.resolve(activeProjectsRoot);
  if (project !== root && !project.startsWith(`${root}${path.sep}`)) {
    throw new Error("Workflow project nằm ngoài active projects root.");
  }
  return project;
}

function workflowDirectory(projectPath: string): string {
  return path.join(projectPath, ".mds", "workflows");
}

function workflowPath(projectPath: string, runId: string): string {
  if (!/^[a-z0-9-]+$/.test(runId)) {
    throw new Error("Workflow run id không hợp lệ.");
  }
  return path.join(workflowDirectory(projectPath), `${runId}.json`);
}

async function saveRun(filePath: string, run: WorkflowRun): Promise<void> {
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(run, null, 2)}\n`, "utf8");
  await fs.rename(temporaryPath, filePath);
}

async function appendAudit(projectPath: string, event: AuditEvent): Promise<void> {
  const directory = path.join(projectPath, "audit");
  await fs.mkdir(directory, { recursive: true });
  await fs.appendFile(
    path.join(directory, "events.jsonl"),
    `${JSON.stringify(event)}\n`,
    "utf8",
  );
}

function event(
  project: string,
  type: AuditEvent["type"],
  runId: string,
): AuditEvent {
  return {
    id: `${type.toLowerCase()}-${Date.now()}`,
    type,
    project,
    workflowRunId: runId,
    actor: "system",
    occurredAt: new Date().toISOString(),
    data: {},
  };
}

export async function startWorkflow(input: StartWorkflowInput): Promise<WorkflowRun> {
  const projectPath = assertProjectPath(
    input.projectPath,
    input.activeProjectsRoot,
  );
  if (!input.workflowId.trim() || input.stepIds.length === 0) {
    throw new Error("Workflow cần id và ít nhất một step.");
  }
  const now = new Date().toISOString();
  const runId = `${input.workflowId.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
  const steps = Object.fromEntries(
    input.stepIds.map((stepId) => [stepId, "PENDING" as WorkflowStepState]),
  );
  steps[input.stepIds[0]] = "RUNNING";
  const run: WorkflowRun = {
    id: runId,
    workflowId: input.workflowId,
    project: input.project,
    status: "RUNNING",
    currentStepId: input.stepIds[0],
    steps,
    startedAt: now,
    updatedAt: now,
  };
  await fs.mkdir(workflowDirectory(projectPath), { recursive: true });
  await saveRun(workflowPath(projectPath, runId), run);
  await appendAudit(projectPath, event(input.project, "WORKFLOW_STARTED", runId));
  return run;
}

export async function loadWorkflow(
  projectPath: string,
  activeProjectsRoot: string,
  runId: string,
): Promise<WorkflowRun> {
  const safeProject = assertProjectPath(projectPath, activeProjectsRoot);
  const content = await fs.readFile(workflowPath(safeProject, runId), "utf8");
  return JSON.parse(content) as WorkflowRun;
}

export async function advanceWorkflow(
  projectPath: string,
  activeProjectsRoot: string,
  runId: string,
  outcome: WorkflowOutcome,
  error?: string,
): Promise<WorkflowRun> {
  const safeProject = assertProjectPath(projectPath, activeProjectsRoot);
  const run = await loadWorkflow(safeProject, activeProjectsRoot, runId);
  if (run.status === "COMPLETED" || run.status === "FAILED") {
    throw new Error(`Workflow đã kết thúc với trạng thái ${run.status}.`);
  }

  const stepIds = Object.keys(run.steps);
  const currentIndex = stepIds.indexOf(run.currentStepId);
  if (currentIndex < 0) throw new Error("Workflow current step không tồn tại.");
  const now = new Date().toISOString();

  if (outcome === "FAILED") {
    run.steps[run.currentStepId] = "FAILED";
    run.status = "FAILED";
    run.error = error || "Workflow step failed.";
  } else if (outcome === "WAITING_APPROVAL") {
    run.steps[run.currentStepId] = "WAITING_APPROVAL";
    run.status = "WAITING_APPROVAL";
  } else {
    run.steps[run.currentStepId] = "COMPLETED";
    const nextStep = stepIds[currentIndex + 1];
    if (!nextStep) {
      run.currentStepId = "";
      run.status = "COMPLETED";
    } else {
      run.currentStepId = nextStep;
      run.steps[nextStep] = "RUNNING";
      run.status = "RUNNING";
    }
  }

  run.updatedAt = now;
  await saveRun(workflowPath(safeProject, runId), run);
  const auditType: AuditEvent["type"] =
    run.status === "FAILED"
      ? "WORKFLOW_FAILED"
      : run.status === "COMPLETED"
        ? "WORKFLOW_COMPLETED"
        : "WORKFLOW_RESUMED";
  await appendAudit(safeProject, event(run.project, auditType, run.id));
  return run;
}

#!/usr/bin/env node

import { findCycles, indexTasks, loadBoard } from "./board-utils.mjs";

const lifecycleStates = new Set([
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "DEPRECATED",
  "ARCHIVED",
]);
const executionStates = new Set([
  "NOT_STARTED",
  "IN_PROGRESS",
  "BLOCKED",
  "COMPLETED",
  "NOT_APPLICABLE",
]);
const taskIdPattern = /^[A-Z]+-TSK-[A-Z0-9]{3,5}-[A-Z0-9]{3,10}-\d{3}$/;

function main() {
  let board;
  let resolvedPath;

  try {
    ({ board, resolvedPath } = loadBoard(process.argv[2]));
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
    process.exitCode = 2;
    return;
  }

  const errors = [];
  const warnings = [];
  const { byId, duplicates } = indexTasks(board.tasks);

  for (const duplicate of duplicates) {
    errors.push(`Duplicate task ID: ${duplicate}`);
  }

  board.tasks.forEach((task, index) => {
    const label = task?.id || `tasks[${index}]`;

    if (!task || typeof task !== "object" || Array.isArray(task)) {
      errors.push(`tasks[${index}] must be an object.`);
      return;
    }

    if (typeof task.id !== "string" || !taskIdPattern.test(task.id)) {
      errors.push(`${label}: invalid MDS task ID.`);
    }
    if (typeof task.title !== "string" || task.title.trim() === "") {
      errors.push(`${label}: title is required.`);
    }
    if (!lifecycleStates.has(task.lifecycle_state)) {
      errors.push(`${label}: invalid lifecycle_state.`);
    }
    if (!executionStates.has(task.execution_state)) {
      errors.push(`${label}: invalid execution_state.`);
    }
    if (!Array.isArray(task.blocked_by)) {
      errors.push(`${label}: blocked_by must be an array.`);
    } else {
      for (const blockerId of task.blocked_by) {
        if (blockerId === task.id) {
          errors.push(`${label}: a task cannot block itself.`);
        } else if (!byId.has(blockerId)) {
          errors.push(`${label}: missing blocker ${blockerId}.`);
        }
      }
    }
    if (
      !Array.isArray(task.linked_requirements) ||
      task.linked_requirements.length === 0
    ) {
      errors.push(`${label}: at least one linked requirement is required.`);
    }
    if (
      !Array.isArray(task.acceptance_criteria) ||
      task.acceptance_criteria.length === 0
    ) {
      errors.push(`${label}: at least one acceptance criterion is required.`);
    }
    if (typeof task.owner_role !== "string" || task.owner_role.trim() === "") {
      errors.push(`${label}: owner_role is required.`);
    }
    if (
      task.execution_state === "COMPLETED" &&
      Array.isArray(task.blocked_by)
    ) {
      const unfinished = task.blocked_by.filter(
        (id) => byId.get(id)?.execution_state !== "COMPLETED",
      );
      if (unfinished.length > 0) {
        errors.push(
          `${label}: completed while blockers are unfinished: ${unfinished.join(", ")}.`,
        );
      }
    }
    if (
      task.execution_state === "BLOCKED" &&
      Array.isArray(task.blocked_by) &&
      task.blocked_by.length === 0
    ) {
      warnings.push(
        `${label}: BLOCKED without a task dependency; record the external blocker.`,
      );
    }
  });

  for (const cycle of findCycles(board.tasks)) {
    errors.push(`Dependency cycle: ${cycle.join(" -> ")}`);
  }

  for (const warning of warnings) {
    console.warn(`[WARN] ${warning}`);
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`[ERROR] ${error}`);
    }
    console.error(
      `[FAIL] ${errors.length} error(s), ${warnings.length} warning(s) in ${resolvedPath}`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `[OK] ${board.tasks.length} task(s), ${warnings.length} warning(s) in ${resolvedPath}`,
  );
}

main();

#!/usr/bin/env node

import { findCycles, indexTasks, loadBoard } from "./board-utils.mjs";

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

  const { byId, duplicates } = indexTasks(board.tasks);
  const cycles = findCycles(board.tasks);

  if (duplicates.length > 0 || cycles.length > 0) {
    for (const duplicate of duplicates) {
      console.error(`[ERROR] Duplicate task ID: ${duplicate}`);
    }
    for (const cycle of cycles) {
      console.error(`[ERROR] Dependency cycle: ${cycle.join(" -> ")}`);
    }
    process.exitCode = 1;
    return;
  }

  const ready = [];
  const blocked = [];
  const inProgress = [];

  for (const task of board.tasks) {
    const blockers = Array.isArray(task.blocked_by) ? task.blocked_by : [];
    const unfinished = blockers.filter(
      (id) => byId.get(id)?.execution_state !== "COMPLETED",
    );

    if (task.execution_state === "IN_PROGRESS") {
      inProgress.push(task.id);
    }

    if (
      task.execution_state === "NOT_STARTED" &&
      unfinished.length === 0
    ) {
      ready.push(task.id);
    }

    if (
      task.execution_state !== "COMPLETED" &&
      (task.execution_state === "BLOCKED" || unfinished.length > 0)
    ) {
      blocked.push({
        id: task.id,
        unfinished_blockers: unfinished,
        external_blocker:
          task.execution_state === "BLOCKED" && unfinished.length === 0,
      });
    }
  }

  console.log(
    JSON.stringify(
      {
        board: resolvedPath,
        ready_frontier: ready,
        in_progress: inProgress,
        blocked,
        cycle_count: 0,
      },
      null,
      2,
    ),
  );
}

main();

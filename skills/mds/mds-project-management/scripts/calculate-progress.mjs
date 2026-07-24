#!/usr/bin/env node

import { loadBoard, taskEffort } from "./board-utils.mjs";

function percentage(part, whole) {
  return whole === 0 ? 0 : Math.round((part / whole) * 10000) / 100;
}

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

  const counts = {
    NOT_STARTED: 0,
    IN_PROGRESS: 0,
    BLOCKED: 0,
    COMPLETED: 0,
    NOT_APPLICABLE: 0,
    UNKNOWN: 0,
  };
  let totalEffort = 0;
  let completedEffort = 0;

  for (const task of board.tasks) {
    const effort = taskEffort(task);
    totalEffort += effort;

    if (Object.hasOwn(counts, task.execution_state)) {
      counts[task.execution_state] += 1;
    } else {
      counts.UNKNOWN += 1;
    }

    if (task.execution_state === "COMPLETED") {
      completedEffort += effort;
    }
  }

  const tasksById = new Map(board.tasks.map((task) => [task.id, task]));
  const milestones = Array.isArray(board.milestones)
    ? board.milestones.map((milestone) => {
        const taskIds = Array.isArray(milestone.task_ids)
          ? milestone.task_ids
          : [];
        const tasks = taskIds.map((id) => tasksById.get(id)).filter(Boolean);
        const effort = tasks.reduce((sum, task) => sum + taskEffort(task), 0);
        const done = tasks
          .filter((task) => task.execution_state === "COMPLETED")
          .reduce((sum, task) => sum + taskEffort(task), 0);

        return {
          id: milestone.id,
          name: milestone.name,
          task_count: tasks.length,
          weighted_progress_percent: percentage(done, effort),
          missing_task_ids: taskIds.filter((id) => !tasksById.has(id)),
        };
      })
    : [];

  console.log(
    JSON.stringify(
      {
        board: resolvedPath,
        task_count: board.tasks.length,
        state_counts: counts,
        count_progress_percent: percentage(
          counts.COMPLETED,
          board.tasks.length,
        ),
        weighted_progress_percent: percentage(
          completedEffort,
          totalEffort,
        ),
        total_effort: totalEffort,
        completed_effort: completedEffort,
        milestones,
      },
      null,
      2,
    ),
  );
}

main();

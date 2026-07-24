import fs from "node:fs";
import path from "node:path";

export function loadBoard(filePath) {
  if (!filePath) {
    throw new Error("Missing delivery-board.json path.");
  }

  const resolvedPath = path.resolve(filePath);
  let source;

  try {
    source = fs.readFileSync(resolvedPath, "utf8");
  } catch (error) {
    throw new Error(`Cannot read ${resolvedPath}: ${error.message}`);
  }

  let board;
  try {
    board = JSON.parse(source);
  } catch (error) {
    throw new Error(`Invalid JSON in ${resolvedPath}: ${error.message}`);
  }

  if (!Array.isArray(board.tasks)) {
    throw new Error("Board must contain a tasks array.");
  }

  return { board, resolvedPath };
}

export function indexTasks(tasks) {
  const byId = new Map();
  const duplicates = [];

  for (const task of tasks) {
    if (task && typeof task.id === "string") {
      if (byId.has(task.id)) {
        duplicates.push(task.id);
      } else {
        byId.set(task.id, task);
      }
    }
  }

  return { byId, duplicates };
}

export function findCycles(tasks) {
  const { byId } = indexTasks(tasks);
  const visiting = new Set();
  const visited = new Set();
  const stack = [];
  const cycles = [];
  const signatures = new Set();

  function visit(taskId) {
    if (visiting.has(taskId)) {
      const start = stack.indexOf(taskId);
      const cycle = [...stack.slice(start), taskId];
      const signature = [...new Set(cycle)].sort().join("|");
      if (!signatures.has(signature)) {
        signatures.add(signature);
        cycles.push(cycle);
      }
      return;
    }

    if (visited.has(taskId) || !byId.has(taskId)) {
      return;
    }

    visiting.add(taskId);
    stack.push(taskId);

    const blockers = byId.get(taskId).blocked_by;
    if (Array.isArray(blockers)) {
      for (const blockerId of blockers) {
        visit(blockerId);
      }
    }

    stack.pop();
    visiting.delete(taskId);
    visited.add(taskId);
  }

  for (const taskId of byId.keys()) {
    visit(taskId);
  }

  return cycles;
}

export function taskEffort(task) {
  return Number.isFinite(task.effort) && task.effort > 0 ? task.effort : 1;
}

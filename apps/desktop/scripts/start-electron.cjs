const path = require("node:path");
const { spawn } = require("node:child_process");
const electronPath = require("electron");

const desktopRoot = path.resolve(__dirname, "..");
const environment = { ...process.env };

delete environment.ELECTRON_RUN_AS_NODE;

const electron = spawn(electronPath, [desktopRoot], {
  cwd: desktopRoot,
  env: environment,
  stdio: "inherit",
  windowsHide: false
});

electron.on("error", (error) => {
  console.error("[MDS] Không thể khởi động Electron:", error);
  process.exitCode = 1;
});

electron.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

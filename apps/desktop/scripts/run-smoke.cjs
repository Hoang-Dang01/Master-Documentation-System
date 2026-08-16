const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const smokeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mds-electron-smoke-"));
const environment = {
  ...process.env,
  MDS_SMOKE_TEST: "1",
  MDS_DATA_DIR: path.join(smokeRoot, "data"),
  MDS_SMOKE_USER_DATA_DIR: path.join(smokeRoot, "user-data"),
  MDS_SMOKE_DISK_CACHE_DIR: path.join(smokeRoot, "cache")
};

delete environment.CHROME_CRASHPAD_PIPE_NAME;
delete environment.ELECTRON_RUN_AS_NODE;

const chromiumArguments = process.platform === "win32"
  ? [
      "--no-sandbox"
    ]
  : [];

const launcher = spawn(process.execPath, [
  path.join(__dirname, "start-electron.cjs"),
  ...chromiumArguments
], {
  cwd: path.resolve(__dirname, ".."),
  env: environment,
  stdio: "inherit",
  windowsHide: true
});

function cleanUp() {
  try {
    fs.rmSync(smokeRoot, { recursive: true, force: true });
  } catch (error) {
    console.warn(`[MDS] Smoke cleanup deferred for ${smokeRoot}: ${error.message}`);
  }
}

launcher.on("error", (error) => {
  console.error("[MDS] Không thể chạy Electron smoke:", error);
  cleanUp();
  process.exitCode = 1;
});

launcher.on("exit", (code, signal) => {
  cleanUp();
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});

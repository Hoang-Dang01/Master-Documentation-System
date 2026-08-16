const path = require("node:path");
const { spawn } = require("node:child_process");
const electronPath = require("electron");

const desktopRoot = path.resolve(__dirname, "..");
const environment = { ...process.env };
const forwardedArguments = process.argv.slice(2);
const isSmokeTest = environment.MDS_SMOKE_TEST === "1";
const isolatedUserDataPath = environment.MDS_SMOKE_USER_DATA_DIR;
const isolatedDiskCachePath = environment.MDS_SMOKE_DISK_CACHE_DIR;

delete environment.ELECTRON_RUN_AS_NODE;

const chromiumArguments = [];
if (isSmokeTest && isolatedUserDataPath) {
  chromiumArguments.push(`--user-data-dir=${isolatedUserDataPath}`);
}
if (isSmokeTest && isolatedDiskCachePath) {
  chromiumArguments.push(`--disk-cache-dir=${isolatedDiskCachePath}`);
}

const electron = spawn(
  electronPath,
  [...chromiumArguments, ...forwardedArguments, desktopRoot],
  {
  cwd: desktopRoot,
  env: environment,
  stdio: "inherit",
  windowsHide: false
  }
);

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

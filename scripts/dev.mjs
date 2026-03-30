import { spawn } from "node:child_process";
import path from "node:path";

const projectRoot = process.cwd();
const nextBin = path.join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);

const child = spawn(process.execPath, [nextBin, "dev", "--turbopack"], {
  cwd: projectRoot,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

for (const event of ["SIGINT", "SIGTERM"]) {
  process.on(event, () => {
    child.kill(event);
  });
}

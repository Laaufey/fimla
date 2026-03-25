import { spawn } from "node:child_process";
import { mkdir, lstat, symlink } from "node:fs/promises";
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
const vendorChunksDir = path.join(projectRoot, ".next", "server", "vendor-chunks");
const chunkDir = path.join(projectRoot, ".next", "server", "chunks");
const linkPath = path.join(chunkDir, "vendor-chunks");

async function ensureVendorChunkLink() {
  try {
    await lstat(vendorChunksDir);
  } catch {
    return;
  }

  await mkdir(chunkDir, { recursive: true });

  try {
    const stat = await lstat(linkPath);
    if (stat.isSymbolicLink() || stat.isDirectory()) {
      return;
    }
  } catch {
    // Create the link if it does not exist.
  }

  try {
    await symlink("../vendor-chunks", linkPath);
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

const child = spawn(process.execPath, [nextBin, "dev"], {
  cwd: projectRoot,
  stdio: "inherit",
});

const timer = setInterval(() => {
  ensureVendorChunkLink().catch((error) => {
    clearInterval(timer);
    console.error("Failed to prepare Next.js dev workaround:", error);
    child.kill("SIGTERM");
  });
}, 250);

child.on("exit", (code, signal) => {
  clearInterval(timer);
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

for (const event of ["SIGINT", "SIGTERM"]) {
  process.on(event, () => {
    clearInterval(timer);
    child.kill(event);
  });
}

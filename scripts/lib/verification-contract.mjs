import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ignoredDirs = new Set([".git", "_archive", "node_modules"]);

async function findPackageJsons(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const packageJsons = [];

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      packageJsons.push(...(await findPackageJsons(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name === "package.json") {
      packageJsons.push(fullPath);
    }
  }

  return packageJsons;
}

export async function checkVerificationContract(repoRoot) {
  const packageJsons = await findPackageJsons(repoRoot);
  const failures = [];

  for (const packagePath of packageJsons) {
    const pkg = JSON.parse(await readFile(packagePath, "utf8"));
    if (!pkg.scripts?.verify) {
      failures.push(path.relative(repoRoot, path.dirname(packagePath)));
    }
  }

  failures.sort();

  return {
    ok: failures.length === 0,
    moduleCount: packageJsons.length,
    failures
  };
}

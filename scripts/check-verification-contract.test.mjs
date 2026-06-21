import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { checkVerificationContract } from "./lib/verification-contract.mjs";

async function writePackage(rootDir, modulePath, scripts) {
  const dir = path.join(rootDir, modulePath);
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, "package.json"),
    JSON.stringify({ type: "module", scripts }, null, 2)
  );
}

test("requires verify script for non-archived runnable modules", async () => {
  const repoRoot = await mkdtemp(path.join(os.tmpdir(), "verify-contract-"));
  await writePackage(repoRoot, "project-vibe-lab/web-app", { test: "node --test" });
  await writePackage(repoRoot, "_archive/old-demo", { test: "node --test" });

  const result = await checkVerificationContract(repoRoot);

  assert.deepEqual(result.failures, ["project-vibe-lab/web-app"]);
});

test("passes when all mainline modules expose verify", async () => {
  const repoRoot = await mkdtemp(path.join(os.tmpdir(), "verify-contract-ok-"));
  await writePackage(repoRoot, "project-vibe-lab/web-app", {
    test: "node --test",
    verify: "npm test && node ../../scripts/verify-static-page.mjs"
  });

  const result = await checkVerificationContract(repoRoot);

  assert.equal(result.ok, true);
  assert.equal(result.moduleCount, 1);
});

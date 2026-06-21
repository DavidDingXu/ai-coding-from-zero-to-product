import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { verifyStaticPage } from "./lib/static-page-verifier.mjs";

test("serves a static page and verifies expected text", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "static-page-ok-"));
  await writeFile(path.join(rootDir, "index.html"), "<h1>产品页面</h1><button>提交</button>");

  const result = await verifyStaticPage({
    rootDir,
    routePath: "/",
    expectedTexts: ["产品页面", "提交"]
  });

  assert.equal(result.ok, true);
  assert.equal(result.status, 200);
  assert.equal(result.matchedTexts.length, 2);
});

test("fails when expected text is missing", async () => {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "static-page-missing-"));
  await writeFile(path.join(rootDir, "popup.html"), "<h1>插件弹窗</h1>");

  await assert.rejects(
    () =>
      verifyStaticPage({
        rootDir,
        routePath: "/popup.html",
        expectedTexts: ["不存在的按钮"]
      }),
    /页面缺少预期文本/
  );
});

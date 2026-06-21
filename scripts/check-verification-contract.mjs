import { fileURLToPath } from "node:url";
import path from "node:path";

import { checkVerificationContract } from "./lib/verification-contract.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const result = await checkVerificationContract(repoRoot);

if (!result.ok) {
  console.error("这些主线模块缺少 npm run verify：");
  for (const failure of result.failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verification contract ok: ${result.moduleCount} modules have npm run verify`);

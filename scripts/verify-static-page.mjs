import { fileURLToPath } from "node:url";
import path from "node:path";

import { verifyStaticPage } from "./lib/static-page-verifier.mjs";

function readArgs(argv) {
  const args = {
    root: ".",
    path: "/",
    text: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--root") {
      args.root = argv[++index];
      continue;
    }
    if (item === "--path") {
      args.path = argv[++index];
      continue;
    }
    if (item === "--text") {
      args.text.push(argv[++index]);
    }
  }

  return args;
}

const args = readArgs(process.argv.slice(2));
const rootDir = path.resolve(process.cwd(), args.root);

try {
  const result = await verifyStaticPage({
    rootDir,
    routePath: args.path,
    expectedTexts: args.text
  });
  console.log(
    JSON.stringify(
      {
        ok: true,
        url: result.url,
        matchedTexts: result.matchedTexts
      },
      null,
      2
    )
  );
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

export const scriptPath = fileURLToPath(import.meta.url);

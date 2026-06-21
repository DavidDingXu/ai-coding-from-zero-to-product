import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"]
]);

function resolveStaticPath(rootDir, requestPath) {
  const cleanPath = decodeURIComponent(requestPath.split("?")[0]);
  const relativePath = cleanPath === "/" ? "index.html" : cleanPath.replace(/^\/+/, "");
  const resolvedPath = path.resolve(rootDir, relativePath);
  const resolvedRoot = path.resolve(rootDir);

  if (!resolvedPath.startsWith(`${resolvedRoot}${path.sep}`) && resolvedPath !== resolvedRoot) {
    throw new Error("请求路径超出静态目录。");
  }

  return resolvedPath;
}

async function createStaticServer(rootDir) {
  const server = http.createServer(async (req, res) => {
    try {
      const filePath = resolveStaticPath(rootDir, req.url || "/");
      const fileStat = await stat(filePath);

      if (!fileStat.isFile()) {
        res.writeHead(404);
        res.end("not found");
        return;
      }

      res.writeHead(200, {
        "content-type": contentTypes.get(path.extname(filePath)) || "application/octet-stream"
      });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404);
      res.end("not found");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return server;
}

export async function verifyStaticPage({ rootDir, routePath = "/", expectedTexts = [] }) {
  const server = await createStaticServer(rootDir);
  const address = server.address();
  const url = `http://127.0.0.1:${address.port}${routePath}`;

  try {
    const response = await fetch(url);
    const body = await response.text();
    const missingTexts = expectedTexts.filter((text) => !body.includes(text));

    if (missingTexts.length > 0) {
      throw new Error(`页面缺少预期文本：${missingTexts.join(", ")}`);
    }

    if (!response.ok) {
      throw new Error(`页面请求失败：HTTP ${response.status}`);
    }

    return {
      ok: true,
      status: response.status,
      url,
      matchedTexts: expectedTexts
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

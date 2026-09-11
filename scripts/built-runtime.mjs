import "./sites-env.mjs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { Miniflare, Log, LogLevel, convertV4MiniflareOptions } from "miniflare";

export async function createBuiltRuntime() {
  const configPath = path.resolve("dist/server/wrangler.json");
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const base = path.dirname(configPath);
  const entry = path.resolve(base, config.main);
  const modules = (await readdir(base, { recursive: true }))
    .filter((file) => /\.(?:m?js)$/.test(file))
    .map((file) => path.resolve(base, file))
    .filter((file) => file !== entry);
  return new Miniflare(
    convertV4MiniflareOptions({
      name: config.name,
      modules: [entry, ...modules].map((file) => ({
        type: "ESModule",
        path: file,
      })),
      compatibilityDate: config.compatibility_date,
      compatibilityFlags: config.compatibility_flags,
      bindings: config.vars,
      assets: {
        binding: config.assets.binding,
        directory: path.resolve(base, config.assets.directory),
        routerConfig: {
          has_user_worker: true,
          invoke_user_worker_ahead_of_assets: true,
        },
      },
      cf: false,
      port: 0,
      log: new Log(LogLevel.ERROR),
    }),
  );
}

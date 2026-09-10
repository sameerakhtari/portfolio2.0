import "./sites-env.mjs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { Miniflare, Log, LogLevel } from "miniflare";
import { projects } from "../data/projects.ts";
import { labNotes } from "../data/notes.ts";

const configPath = path.resolve("dist/server/wrangler.json");
const config = JSON.parse(await readFile(configPath, "utf8"));
const base = path.dirname(configPath);
const entry = path.resolve(base, config.main);
const modules = (await readdir(base, { recursive: true }))
  .filter((file) => /\.(?:m?js)$/.test(file))
  .map((file) => path.resolve(base, file))
  .filter((file) => file !== entry);
const runtime = new Miniflare({
  name: config.name,
  modules: [entry, ...modules].map((file) => ({
    type: "ESModule",
    path: file,
  })),
  compatibilityDate: config.compatibility_date,
  compatibilityFlags: config.compatibility_flags,
  bindings: config.vars,
  assets: {
    directory: path.resolve(base, config.assets.directory),
    routerConfig: { has_user_worker: true },
  },
  cf: false,
  port: 0,
  log: new Log(LogLevel.ERROR),
});

const siteSource = await readFile(path.resolve("data/site.ts"), "utf8");
const originMatch = siteSource.match(/origin:\s*"([^"]+)"/);
assert.ok(originMatch, "data/site.ts must define site.origin");
const origin = originMatch[1];

const routes = [
  "/",
  "/projects",
  "/lab",
  "/notes",
  "/about",
  "/contact",
  ...projects.map((p) => `/projects/${p.slug}`),
  ...labNotes.map((n) => `/notes/${n.slug}`),
];
const assets = new Set(["/favicon.svg", "/og.png", "/images/muet.webp"]);
try {
  for (const route of routes) {
    const response = await runtime.dispatchFetch(`${origin}${route}`);
    assert.equal(response.status, 200, `${route} should load directly`);
    const html = await response.text();
    assert.match(html, /<h1[ >]/, `${route} needs a server-rendered heading`);
    assert.match(html, /<title>[^<]+<\/title>/, `${route} needs a title`);
    assert.ok(
      html.includes(`href="${origin}${route === "/" ? "" : route}"`) ||
        html.includes(`href="${origin}${route}"`),
      `${route} canonical URL`,
    );
    assert.match(html, /name="description" content="[^"]+"/);
    assert.ok(
      !html.includes("Internal Server Error"),
      `${route} server failure`,
    );
    for (const match of html.matchAll(
      /(?:src|href)="(\/(?:assets|_next\/static)\/[^"?]+)[^"]*"/g,
    ))
      assets.add(match[1]);
    console.log(`PASS ${route}`);
  }
  for (const route of [
    "/projects/missing-project",
    "/notes/missing-note",
    "/missing-page",
    "/dev/pigment",
    "/dev/review",
  ]) {
    const response = await runtime.dispatchFetch(`${origin}${route}`);
    assert.equal(response.status, 404, `${route} should be a real 404`);
    await response.arrayBuffer();
    console.log(`PASS ${route} → 404`);
  }
  const sitemapResponse = await runtime.dispatchFetch(`${origin}/sitemap.xml`);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, routes.length);
  assert.ok(!sitemap.includes("/dev/"));
  const robotsResponse = await runtime.dispatchFetch(`${origin}/robots.txt`);
  assert.equal(robotsResponse.status, 200);
  assert.match(await robotsResponse.text(), /Disallow: \/dev\//);
  for (const asset of assets) {
    const response = await runtime.dispatchFetch(`${origin}${asset}`);
    assert.equal(response.status, 200, `${asset} must resolve`);
    assert.ok((await response.arrayBuffer()).byteLength > 0);
  }
  console.log(`PASS sitemap, robots and ${assets.size} referenced assets`);
  console.log(
    `Production verification complete: ${routes.length} pages, 5 not-found checks.`,
  );
} finally {
  await runtime.dispose();
}

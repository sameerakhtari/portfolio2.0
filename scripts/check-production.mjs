import "./sites-env.mjs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { request as httpRequest } from "node:http";
import { createBuiltRuntime } from "./built-runtime.mjs";
import { projects } from "../data/projects.ts";
import { labNotes } from "../data/notes.ts";

const runtime = await createBuiltRuntime();

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
    assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    const csp = response.headers.get("Content-Security-Policy");
    assert.ok(csp && !csp.includes("unsafe-eval"));
    const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
    assert.ok(nonce, "HTML must have a per-response nonce");
    for (const script of html.matchAll(/<script\b[^>]*>/g)) {
      assert.ok(
        script[0].includes(`nonce="${nonce}"`),
        "Every script must agree with the response CSP",
      );
    }
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
    "/dev/%70igment",
    "/.env",
    "/.git/HEAD",
    "/_next/image",
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
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent: Googlebot/i);
  assert.match(robots, /User-Agent: Bingbot/i);
  assert.match(robots, /User-Agent: \*\s+Disallow: \/(?:\s|$)/i);
  assert.match(robots, /Disallow: \/dev\//i);
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  assert.equal(robotsResponse.headers.get("Cache-Control"), "no-store");
  for (const method of ["POST", "PUT", "DELETE"]) {
    const response = await runtime.dispatchFetch(origin, { method });
    assert.equal(response.status, 405, `${method} should be unavailable`);
    await response.arrayBuffer();
  }
  const runtimeUrl = await runtime.ready;
  const traceStatus = await new Promise((resolve, reject) => {
    const request = httpRequest(runtimeUrl, { method: "TRACE" }, (response) => {
      response.resume();
      response.on("end", () => resolve(response.statusCode));
    });
    request.on("error", reject);
    request.end();
  });
  assert.equal(traceStatus, 405);
  const head = await runtime.dispatchFetch(origin, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  const options = await runtime.dispatchFetch(origin, {
    method: "OPTIONS",
    headers: { Origin: "https://elsewhere.example" },
  });
  assert.equal(options.status, 204);
  assert.equal(options.headers.get("Access-Control-Allow-Origin"), null);
  const redirect = await runtime.dispatchFetch(
    origin.replace("https:", "http:") + "/projects",
    {
      redirect: "manual",
      headers: {
        "X-Forwarded-Proto": "https",
        "X-Forwarded-Host": "elsewhere.example",
      },
    },
  );
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get("Location"), origin + "/projects");
  const forged = await runtime.dispatchFetch(origin, {
    headers: {
      "Content-Security-Policy": "script-src 'unsafe-eval'",
      "X-Forwarded-Host": "elsewhere.example",
    },
  });
  const forgedHtml = await forged.text();
  assert.ok(
    !forged.headers.get("Content-Security-Policy").includes("unsafe-eval"),
  );
  assert.ok(!forgedHtml.includes("elsewhere.example"));
  for (const asset of assets) {
    const response = await runtime.dispatchFetch(`${origin}${asset}`);
    assert.equal(response.status, 200, `${asset} must resolve`);
    assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
    assert.ok((await response.arrayBuffer()).byteLength > 0);
  }
  console.log(`PASS sitemap, robots and ${assets.size} referenced assets`);
  console.log(
    `Production verification complete: ${routes.length} pages, security headers, methods, and unavailable-route checks.`,
  );
} finally {
  await runtime.dispose();
}

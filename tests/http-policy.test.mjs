import test from "node:test";
import assert from "node:assert/strict";
import {
  contentSecurityPolicy,
  responseHeaders,
  routeGate,
} from "../lib/http-policy.ts";

const origin = "https://portfolio.sameerakhtari.com";
test("HTTPS redirect uses a fixed origin even with forged forwarding headers", () => {
  const result = routeGate(
    new Request(origin.replace("https:", "http:") + "/projects?q=test", {
      headers: {
        "X-Forwarded-Proto": "https",
        "X-Forwarded-Host": "elsewhere.example",
      },
    }),
    origin,
  );
  assert.equal(result.status, 308);
  assert.equal(result.headers.get("Location"), origin + "/projects?q=test");
  assert.equal(routeGate(new Request("http://localhost:4173/"), origin), null);
});

test("read-only site accepts its navigation methods and rejects unused entrypoints", () => {
  for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
    assert.equal(
      routeGate(new Request(origin, { method }), origin).status,
      405,
    );
  }
  for (const path of [
    "/dev/pigment",
    "/dev/review",
    "/dev/%70igment",
    "/.git/HEAD",
    "/.env",
    "/_next/image",
  ]) {
    assert.equal(routeGate(new Request(origin + path), origin).status, 404);
  }
  const options = routeGate(
    new Request(origin, {
      method: "OPTIONS",
      headers: { Origin: "https://elsewhere.example" },
    }),
    origin,
  );
  assert.equal(options.status, 204);
  assert.equal(options.headers.get("Access-Control-Allow-Origin"), null);
  assert.equal(routeGate(new Request(origin + "/projects"), origin), null);
});

test("nonce policy preserves routing variation and prevents stale HTML", () => {
  const csp = contentSecurityPolicy("test-nonce");
  assert.ok(csp.includes("'nonce-test-nonce'"));
  assert.ok(!csp.includes("unsafe-eval"));
  const headers = responseHeaders(
    new Headers({ "Content-Type": "text/html", Vary: "RSC", ETag: "old" }),
    csp,
    "/",
  );
  assert.equal(headers.get("Vary"), "RSC");
  assert.equal(headers.get("Cache-Control"), "no-store");
  assert.equal(headers.get("ETag"), null);
  assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(headers.get("Strict-Transport-Security"), "max-age=31536000");
  const asset = responseHeaders(
    new Headers({
      "Content-Type": "text/javascript",
      "Cache-Control": "public, max-age=31536000, immutable",
    }),
    csp,
    "/assets/app.js",
  );
  assert.equal(
    asset.get("Cache-Control"),
    "public, max-age=31536000, immutable",
  );
});

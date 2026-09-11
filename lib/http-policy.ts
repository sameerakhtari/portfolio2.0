export function contentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'self'",
    "form-action 'none'",
  ].join("; ");
}

/** Only the request URL and fixed site origin determine HTTPS enforcement. */
export function routeGate(
  request: Request,
  siteOrigin: string,
): Response | null {
  const url = new URL(request.url);
  const canonical = new URL(siteOrigin);
  if (url.hostname === canonical.hostname && url.protocol !== "https:") {
    canonical.pathname = url.pathname;
    canonical.search = url.search;
    return new Response(null, {
      status: 308,
      headers: { Location: canonical.href },
    });
  }
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return new Response(null, {
      status: 405,
      headers: { Allow: "GET, HEAD, OPTIONS" },
    });
  }
  let path: string;
  try {
    path = decodeURIComponent(url.pathname);
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (
    /^\/(?:dev(?:\/|$)|\.(?:git|env|agent)(?:[./]|$)|_next\/image(?:\/|$))/.test(
      path,
    )
  ) {
    return new Response(request.method === "HEAD" ? null : "Not found", {
      status: 404,
    });
  }
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { Allow: "GET, HEAD, OPTIONS" },
    });
  }
  return null;
}

export function responseHeaders(original: Headers, csp: string, path: string) {
  const headers = new Headers(original);
  headers.set("Content-Security-Policy", csp);
  headers.set("Strict-Transport-Security", "max-age=31536000");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  const type = headers.get("Content-Type") ?? "";
  if (
    /text\/(?:html|x-component)/i.test(type) ||
    path === "/robots.txt" ||
    path === "/sitemap.xml"
  ) {
    headers.set("Cache-Control", "no-store");
    headers.delete("ETag");
  }
  return headers;
}

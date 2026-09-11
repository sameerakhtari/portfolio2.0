import handler from "vinext/server/fetch-handler";
import { site } from "../data/site";
import {
  contentSecurityPolicy,
  responseHeaders,
  routeGate,
} from "../lib/http-policy";

const worker = {
  async fetch(
    request: Request,
    env: Record<string, unknown> & { ASSETS?: Fetcher },
    ctx: ExecutionContext,
  ) {
    // The development server retains its own HMR and diagnostic routes.
    if (import.meta.env.DEV) return handler.fetch(request, env, ctx);

    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(24))),
    );
    const csp = contentSecurityPolicy(nonce);
    let response = routeGate(request, site.origin);
    if (!response) {
      const headers = new Headers(request.headers);
      // Vinext reads this trusted per-response policy when rendering inline scripts.
      headers.set("Content-Security-Policy", csp);
      headers.delete("Content-Security-Policy-Report-Only");
      try {
        // With run_worker_first, explicitly delegate files to the asset binding.
        const asset = await env.ASSETS?.fetch(request);
        response =
          asset && asset.status !== 404
            ? asset
            : await handler.fetch(new Request(request, { headers }), env, ctx);
      } catch (error) {
        console.error(
          "Portfolio request failed",
          error instanceof Error ? error.name : "UnknownError",
        );
        response = new Response("Unable to load this page.", {
          status: 500,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    }
    response ??= new Response("Unable to load this page.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
    const headers = responseHeaders(
      response.headers,
      csp,
      new URL(request.url).pathname,
    );
    const secured = new Response(
      request.method === "HEAD" ? null : response.body,
      {
        status: response.status,
        statusText: response.statusText,
        headers,
      },
    );
    if (
      request.method !== "HEAD" &&
      headers.get("Content-Type")?.includes("text/html")
    ) {
      // Also covers author-supplied JSON-LD and streamed error documents.
      return new HTMLRewriter()
        .on("script", {
          element(element) {
            element.setAttribute("nonce", nonce);
          },
        })
        .transform(secured);
    }
    return secured;
  },
};

export default worker;

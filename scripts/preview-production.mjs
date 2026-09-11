import { createBuiltRuntime } from "./built-runtime.mjs";

/** Serve the actual build, including its response policy, for local browser QA. */
export function productionReview() {
  return {
    name: "portfolio-production-review",
    async configureServer(server) {
      const runtime = await createBuiltRuntime();
      await runtime.ready;
      server.httpServer?.once("close", () => void runtime.dispose());
      server.middlewares.use(async (request, response) => {
        try {
          const headers = new Headers();
          for (const [name, value] of Object.entries(request.headers)) {
            if (value !== undefined) headers.set(name, String(value));
          }
          headers.set("Accept-Encoding", "identity");
          // Fixed local origin prevents proxy headers from changing the destination.
          const result = await runtime.dispatchFetch(
            `http://portfolio.local${request.url ?? "/"}`,
            { method: request.method, headers },
          );
          response.writeHead(result.status, Object.fromEntries(result.headers));
          response.end(Buffer.from(await result.arrayBuffer()));
        } catch (error) {
          server.config.logger.error(String(error));
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.end("Build review failed. Check the local server log.");
        }
      });
    },
  };
}

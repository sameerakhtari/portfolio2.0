import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { labNotes } from "@/data/notes";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/projects",
    "/lab",
    "/notes",
    "/about",
    "/contact",
    ...projects.map((p) => `/projects/${p.slug}`),
    ...labNotes.map((n) => `/notes/${n.slug}`),
  ].map((path) => ({
    url: site.origin + path,
    changeFrequency: path ? "monthly" : "weekly",
    priority: path ? 0.7 : 1,
  }));
}

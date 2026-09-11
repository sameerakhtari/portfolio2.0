import type { MetadataRoute } from "next";
import { site } from "@/data/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: ["Googlebot", "Bingbot"], allow: "/", disallow: "/dev/" },
      { userAgent: "*", disallow: "/" },
    ],
    sitemap: `${site.origin}/sitemap.xml`,
  };
}

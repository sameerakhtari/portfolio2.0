import type { Metadata } from "next";
import { site } from "@/data/site";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: new URL(path, site.origin).href,
      type: "website",
      images: [
        {
          url: site.socialImage,
          width: 1200,
          height: 630,
          alt: "Sameer Akhtari — Software, systems and networks",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [site.socialImage],
    },
  };
}

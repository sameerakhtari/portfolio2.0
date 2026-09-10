import type { Metadata } from "next";
import "./globals.css";
import "@fontsource-variable/space-grotesk";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import { MotionProvider } from "@/components/experience/MotionProvider";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: { default: site.title, template: "%s — Sameer Akhtari" },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    url: site.origin,
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
    title: site.title,
    description: site.description,
    images: [site.socialImage],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

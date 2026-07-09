import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const routeConfig = [
  { path: "", priority: 1 },
  { path: "/pricing", priority: 0.9 },
  { path: "/contact", priority: 0.8 },
  { path: "/design-system", priority: 0.6 },
  { path: "/sitemap", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routeConfig.flatMap(({ path, priority }) => {
    const enUrl = `${baseUrl}${path}`;
    const frPath = path === "" ? "/fr" : `/fr${path}`;
    const frUrl = `${baseUrl}${frPath}`;

    return [
      {
        url: enUrl,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority,
        alternates: {
          languages: { en: enUrl, fr: frUrl },
        },
      },
      {
        url: frUrl,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority,
        alternates: {
          languages: { en: enUrl, fr: frUrl },
        },
      },
    ];
  });
}

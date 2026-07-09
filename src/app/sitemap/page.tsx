import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { Heading, Text, Card, CardContent, Badge } from "@/components/ui";
import { publicPages } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Sitemap — MEL Radio",
  description: "All pages on MEL Radio.",
};

export default function SitemapPage() {
  const pages = publicPages;

  return (
    <PageShell maxWidth="sm" className="py-10">
      <Heading as="h1" size="lg" gradient className="mb-3">Sitemap</Heading>
      <Text variant="secondary" className="mb-8">
        All public pages on MEL Radio.
      </Text>

      <div className="space-y-3">
        {pages.map((page) => (
          <Card key={page.href} variant="default">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div>
                <Link href={page.href} className="text-text-primary font-medium hover:text-brand-accent transition-colors">
                  {page.label}
                </Link>
                <Text variant="caption" className="mt-0.5">{page.description}</Text>
              </div>
              <Badge variant={page.locale === "fr" ? "accent" : "default"}>
                {page.locale === "fr" ? "FR" : "EN"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

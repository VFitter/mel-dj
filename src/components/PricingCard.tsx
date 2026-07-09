import Link from "next/link";
import { Card, Badge, Button, Text } from "@/components/ui";
import { localePath, type Locale } from "@/lib/i18n";

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  frequency: string;
  duration: string;
  featured?: boolean;
  locale?: Locale;
}

const copy = {
  en: {
    mostPopular: "Most Popular",
    perSpot: "/spot",
    plays: "Plays",
    adDuration: "ad duration",
    targeted: "Targeted audience",
    book: "Book This Slot",
  },
  fr: {
    mostPopular: "Le plus populaire",
    perSpot: "/spot",
    plays: "Diffusion",
    adDuration: "durée de la pub",
    targeted: "Audience ciblée",
    book: "Réserver cet emplacement",
  },
} as const;

export default function PricingCard({
  name,
  description,
  price,
  frequency,
  duration,
  featured,
  locale = "en",
}: PricingCardProps) {
  const t = copy[locale];

  return (
    <Card variant={featured ? "featured" : "default"} className="p-6 flex flex-col h-full">
      {featured && (
        <Badge variant="primary" className="self-start mb-3">
          {t.mostPopular}
        </Badge>
      )}
      <h3 className="text-lg font-bold text-text-primary">{name}</h3>
      <Text variant="secondary" className="mt-1 flex-1">{description}</Text>
      <div className="mt-4 mb-4">
        <span className="text-3xl font-bold text-text-primary">${price.toFixed(2)}</span>
        <span className="text-text-muted text-sm ml-1">{t.perSpot}</span>
      </div>
      <ul className="space-y-2 text-sm text-text-secondary mb-6">
        <li className="flex items-center gap-2">
          <span className="text-brand-accent">·</span> {t.plays} {frequency}
        </li>
        <li className="flex items-center gap-2">
          <span className="text-brand-accent">·</span> {duration} {t.adDuration}
        </li>
        <li className="flex items-center gap-2">
          <span className="text-brand-accent">·</span> {t.targeted}
        </li>
      </ul>
      <Link href={localePath("/contact", locale)} className="block w-full text-center">
        <Button variant={featured ? "primary" : "secondary"} className="w-full">
          {t.book}
        </Button>
      </Link>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PricingCard from "@/components/PricingCard";
import PageShell from "@/components/layout/PageShell";
import { Heading, Text, Button, Card, CardContent } from "@/components/ui";
import { localePath, type Locale } from "@/lib/i18n";

interface Tier {
  id: number;
  name: string;
  description: string;
  priceCents: number;
  slotFrequency: number;
  durationSeconds: number;
}

const copy = {
  en: {
    back: "Back to player",
    title: "Advertise on MEL Radio",
    subtitle: "Reach our listeners with audio ad spots placed between tracks. Choose the frequency that fits your budget.",
    whyTitle: "Why Advertise With Us?",
    engagedTitle: "Engaged Audience",
    engagedBody: "Listeners actively tune in — your ad reaches them during focused listening sessions.",
    pricingTitle: "Simple Pricing",
    pricingBody: "No minimum spend. Pay per spot. Start with a single ad slot.",
    analyticsTitle: "Real Analytics",
    analyticsBody: "Track exactly how many times your ad plays. Transparent reporting.",
    cta: "Get Started — Contact Us",
    frequencyImmediate: "immediately after current track",
    frequencyEvery: (n: number) => `every ${n} tracks`,
    duration: (s: number) => `${s}s`,
  },
  fr: {
    back: "Retour au lecteur",
    title: "Faites de la publicité sur MEL Radio",
    subtitle: "Touchez nos auditeurs avec des spots audio placés entre les pistes. Choisissez la fréquence qui correspond à votre budget.",
    whyTitle: "Pourquoi faire de la publicité avec nous ?",
    engagedTitle: "Audience engagée",
    engagedBody: "Les auditeurs s'accordent activement — votre publicité les atteint pendant des sessions d'écoute concentrées.",
    pricingTitle: "Tarification simple",
    pricingBody: "Pas de dépense minimum. Payez par spot. Commencez avec un seul emplacement publicitaire.",
    analyticsTitle: "Analytiques réelles",
    analyticsBody: "Suivez exactement combien de fois votre publicité est diffusée. Rapports transparents.",
    cta: "Commencer — Contactez-nous",
    frequencyImmediate: "immédiatement après la piste en cours",
    frequencyEvery: (n: number) => `toutes les ${n} pistes`,
    duration: (s: number) => `${s}s`,
  },
} as const;

const tierCopy: Record<
  Locale,
  Record<string, { name: string; description: string }>
> = {
  en: {},
  fr: {
    "Standard Slot": {
      name: "Emplacement standard",
      description: "Votre publicité est diffusée après chaque 5 pistes.",
    },
    "Premium Slot": {
      name: "Emplacement premium",
      description: "Votre publicité est diffusée après chaque 3 pistes.",
    },
    "Featured Slot": {
      name: "Emplacement vedette",
      description: "Votre publicité est diffusée immédiatement après la piste en cours.",
    },
  },
};

function localizeTier(tier: Tier, locale: Locale): Pick<Tier, "name" | "description"> {
  const localized = tierCopy[locale][tier.name];
  return localized ?? { name: tier.name, description: tier.description };
}

interface PricingContentProps {
  locale?: Locale;
}

export default function PricingContent({ locale = "en" }: PricingContentProps) {
  const t = copy[locale];
  const [tiers, setTiers] = useState<Tier[]>([]);

  useEffect(() => {
    fetch("/api/ads/tiers")
      .then((r) => r.json())
      .then(setTiers);
  }, []);

  return (
    <PageShell maxWidth="xl" locale={locale} className="py-6 sm:py-10">
      <Link
        href={localePath("/", locale)}
        className="inline-flex items-center gap-1 text-text-muted hover:text-text-secondary text-sm mb-6 sm:mb-8 transition-colors touch-target min-h-10"
      >
        <ArrowLeft className="h-4 w-4" /> {t.back}
      </Link>

      <div className="text-center mb-8 sm:mb-12 animate-fade-in px-1">
        <Heading as="h1" size="xl" gradient className="mb-3 line-clamp-3">
          {t.title}
        </Heading>
        <Text variant="secondary" className="max-w-xl mx-auto text-sm sm:text-base">
          {t.subtitle}
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {tiers.map((tier, i) => {
          const localized = localizeTier(tier, locale);
          return (
          <PricingCard
            key={tier.id}
            locale={locale}
            name={localized.name}
            description={localized.description}
            price={tier.priceCents / 100}
            frequency={tier.slotFrequency === 1 ? t.frequencyImmediate : t.frequencyEvery(tier.slotFrequency)}
            duration={t.duration(tier.durationSeconds)}
            featured={i === 1}
          />
          );
        })}
      </div>

      <Card variant="glass" className="mt-8 sm:mt-12 max-w-2xl mx-auto">
        <CardContent className="text-center p-5 sm:p-8">
          <Heading as="h2" size="sm" className="mb-2">{t.whyTitle}</Heading>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6 text-left">
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-1">{t.engagedTitle}</h3>
              <Text variant="caption">{t.engagedBody}</Text>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-1">{t.pricingTitle}</h3>
              <Text variant="caption">{t.pricingBody}</Text>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-1">{t.analyticsTitle}</h3>
              <Text variant="caption">{t.analyticsBody}</Text>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <Link href={localePath("/contact", locale)}>
          <Button size="lg">{t.cta}</Button>
        </Link>
      </div>
    </PageShell>
  );
}

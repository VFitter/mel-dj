import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import ContactQuickActions from "@/components/ContactQuickActions";
import PageShell from "@/components/layout/PageShell";
import { Heading, Text, Card, CardContent } from "@/components/ui";
import { localePath, type Locale } from "@/lib/i18n";

const copy = {
  en: {
    back: "Back to player",
    title: "Get in Touch",
    subtitle: "Interested in advertising? Have a question? Reach out and we'll get back to you.",
    formTitle: "Contact Form",
    formBody: "Fill out the form below and we'll reach out within 24 hours.",
  },
  fr: {
    back: "Retour au lecteur",
    title: "Contactez-nous",
    subtitle: "Intéressé par la publicité ? Une question ? Écrivez-nous et nous vous répondrons.",
    formTitle: "Formulaire de contact",
    formBody: "Remplissez le formulaire ci-dessous et nous vous répondrons sous 24 heures.",
  },
} as const;

interface ContactContentProps {
  locale?: Locale;
}

export default function ContactContent({ locale = "en" }: ContactContentProps) {
  const t = copy[locale];

  return (
    <PageShell maxWidth="sm" locale={locale} className="py-6 sm:py-10">
      <Link
        href={localePath("/", locale)}
        className="inline-flex items-center gap-1 text-text-muted hover:text-text-secondary text-sm mb-6 sm:mb-8 transition-colors touch-target min-h-10"
      >
        <ArrowLeft className="h-4 w-4" /> {t.back}
      </Link>

      <Heading as="h1" size="lg" className="mb-3 animate-fade-in line-clamp-2">{t.title}</Heading>
      <Text variant="secondary" className="mb-8 sm:mb-10 text-sm sm:text-base">
        {t.subtitle}
      </Text>

      <ContactQuickActions locale={locale} />

      <Card variant="default" className="mb-8 sm:mb-10">
        <CardContent className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6">
          <MessageSquare className="h-5 w-5 text-brand-accent flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-text-primary font-medium">{t.formTitle}</h2>
            <Text variant="secondary" className="mt-1">
              {t.formBody}
            </Text>
          </div>
        </CardContent>
      </Card>

      <ContactForm locale={locale} />
    </PageShell>
  );
}

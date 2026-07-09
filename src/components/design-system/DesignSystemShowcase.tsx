import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Select,
  FormField,
  Heading,
  Text,
  Alert,
  Skeleton,
  Spinner,
  IconButton,
} from "@/components/ui";
import PageShell from "@/components/layout/PageShell";
import { cn } from "@/lib/cn";
import { navItems } from "@/lib/i18n";
import { Heart, Play, SkipForward } from "lucide-react";

interface DesignSystemShowcaseProps {
  locale?: "en" | "fr";
}

const copy = {
  en: {
    title: "Design System",
    subtitle: "MEL Radio's visual language — Spotify-inspired green & black with rich gradients for a premium dark radio experience.",
    colors: "Color Palette",
    typography: "Typography",
    buttons: "Buttons",
    cards: "Cards",
    forms: "Form Elements",
    feedback: "Feedback",
    badges: "Badges",
    sampleH1: "Continuous Music",
    sampleH2: "Built for listeners",
    sampleBody: "Non-stop YouTube music radio with queue management and advertising slots.",
    primary: "Primary",
    secondary: "Secondary",
    ghost: "Ghost",
    danger: "Danger",
    accent: "Accent",
    loading: "Loading",
    default: "Default",
    elevated: "Elevated",
    glass: "Glass",
    featured: "Featured",
    cardTitle: "Now Playing",
    cardBody: "Track metadata and queue position display in a raised surface container.",
    cardAction: "View Queue",
    nameLabel: "Display Name",
    namePlaceholder: "DJ Mel",
    subjectLabel: "Subject",
    messageLabel: "Message",
    messagePlaceholder: "Tell us what you need...",
    infoAlert: "Ad slots are available between tracks.",
    successAlert: "Message sent successfully.",
    warningAlert: "Queue is running low on tracks.",
    errorAlert: "Failed to load track metadata.",
    gradients: "Gradients",
  },
  fr: {
    title: "Système de Design",
    subtitle: "Le langage visuel de MEL Radio — vert et noir inspiré de Spotify, avec de riches dégradés pour une expérience radio sombre premium.",
    colors: "Palette de Couleurs",
    typography: "Typographie",
    buttons: "Boutons",
    cards: "Cartes",
    forms: "Éléments de Formulaire",
    feedback: "Retour Utilisateur",
    badges: "Badges",
    sampleH1: "Musique Continue",
    sampleH2: "Conçu pour les auditeurs",
    sampleBody: "Radio musicale YouTube non-stop avec gestion de file d'attente et emplacements publicitaires.",
    primary: "Principal",
    secondary: "Secondaire",
    ghost: "Fantôme",
    danger: "Danger",
    accent: "Accent",
    loading: "Chargement",
    default: "Par défaut",
    elevated: "Élevé",
    glass: "Verre",
    featured: "En vedette",
    cardTitle: "En Cours",
    cardBody: "Métadonnées de piste et position dans la file affichées dans un conteneur surélevé.",
    cardAction: "Voir la File",
    nameLabel: "Nom d'affichage",
    namePlaceholder: "DJ Mel",
    subjectLabel: "Sujet",
    messageLabel: "Message",
    messagePlaceholder: "Dites-nous ce dont vous avez besoin...",
    infoAlert: "Des emplacements publicitaires sont disponibles entre les pistes.",
    successAlert: "Message envoyé avec succès.",
    warningAlert: "La file d'attente manque de pistes.",
    errorAlert: "Échec du chargement des métadonnées.",
    gradients: "Dégradés",
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <Heading as="h2" size="md" className="border-b border-border pb-2">
        {title}
      </Heading>
      {children}
    </section>
  );
}

export default function DesignSystemShowcase({ locale = "en" }: DesignSystemShowcaseProps) {
  const t = copy[locale];
  const frNav = navItems[locale];

  return (
    <PageShell locale={locale} nav={frNav} maxWidth="lg" className="py-10 space-y-16 animate-fade-in">
      <div className="text-center space-y-3">
        <Heading as="h1" size="xl" gradient>
          {t.title}
        </Heading>
        <Text variant="secondary" className="max-w-2xl mx-auto">
          {t.subtitle}
        </Text>
      </div>

      <Section title={t.colors}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { name: "Primary", class: "bg-brand-primary" },
            { name: "Accent", class: "bg-brand-accent" },
            { name: "Neon", class: "bg-brand-neon" },
            { name: "Success", class: "bg-success" },
            { name: "Warning", class: "bg-warning" },
            { name: "Error", class: "bg-error" },
            { name: "Base", class: "bg-surface-base border border-border" },
            { name: "Raised", class: "bg-surface-raised" },
            { name: "Overlay", class: "bg-surface-overlay" },
          ].map((swatch) => (
            <div key={swatch.name} className="space-y-2">
              <div className={cn("h-14 rounded-lg", swatch.class)} />
              <Text variant="caption">{swatch.name}</Text>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t.gradients}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card variant="elevated" className="overflow-hidden">
            <div className="h-24 bg-gradient-brand" />
            <CardContent className="space-y-2">
              <Text variant="caption">bg-gradient-brand</Text>
              <Heading as="h3" size="sm" gradient>Brand text gradient</Heading>
            </CardContent>
          </Card>
          <Card variant="elevated" className="overflow-hidden">
            <div className="h-24 bg-gradient-neon" />
            <CardContent className="space-y-2">
              <Text variant="caption">bg-gradient-neon</Text>
              <Heading as="h3" size="sm" className="text-gradient-hero">Hero text gradient</Heading>
            </CardContent>
          </Card>
          <Card variant="glass" className="overflow-hidden sm:col-span-2">
            <div className="h-28 bg-gradient-hero" />
            <CardContent>
              <Text variant="caption">bg-gradient-hero — layered radial + linear for page heroes</Text>
              <Text className="text-gradient-subtle mt-2 text-lg font-semibold">Subtle text gradient for supporting headlines</Text>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title={t.typography}>
        <div className="space-y-4">
          <Heading as="h1" size="xl" gradient>{t.sampleH1}</Heading>
          <Heading as="h2" size="lg">{t.sampleH2}</Heading>
          <Heading as="h3" size="md">Section Title</Heading>
          <Text>{t.sampleBody}</Text>
          <Text variant="secondary">Secondary text for descriptions and metadata.</Text>
          <Text variant="muted">Muted text for timestamps and hints.</Text>
        </div>
      </Section>

      <Section title={t.buttons}>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">{t.primary}</Button>
          <Button variant="secondary">{t.secondary}</Button>
          <Button variant="ghost">{t.ghost}</Button>
          <Button variant="danger">{t.danger}</Button>
          <Button variant="accent">{t.accent}</Button>
          <Button variant="primary" loading>{t.loading}</Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <IconButton label="Play"><Play className="h-5 w-5" /></IconButton>
          <IconButton label="Skip forward"><SkipForward className="h-5 w-5" /></IconButton>
          <IconButton label="Like"><Heart className="h-5 w-5" /></IconButton>
        </div>
      </Section>

      <Section title={t.badges}>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Live</Badge>
          <Badge variant="warning">Ad</Badge>
          <Badge variant="error">Offline</Badge>
        </div>
      </Section>

      <Section title={t.cards}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["default", "elevated", "glass", "featured"] as const).map((variant) => (
            <Card key={variant} variant={variant}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Heading as="h3" size="sm">{t.cardTitle}</Heading>
                  <Badge variant={variant === "featured" ? "primary" : "default"}>
                    {t[variant]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Text variant="secondary">{t.cardBody}</Text>
              </CardContent>
              <CardFooter>
                <Button variant={variant === "featured" ? "primary" : "secondary"} size="sm">
                  {t.cardAction}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t.forms}>
        <Card variant="glass" className="max-w-md">
          <CardContent className="space-y-4">
            <FormField label={t.nameLabel} htmlFor="ds-name">
              <Input id="ds-name" placeholder={t.namePlaceholder} />
            </FormField>
            <FormField label={t.subjectLabel} htmlFor="ds-subject">
              <Select id="ds-subject">
                <option>Advertising inquiry</option>
                <option>General question</option>
              </Select>
            </FormField>
            <FormField label={t.messageLabel} htmlFor="ds-message">
              <Textarea id="ds-message" placeholder={t.messagePlaceholder} rows={3} />
            </FormField>
            <Button className="w-full">{locale === "fr" ? "Envoyer" : "Submit"}</Button>
          </CardContent>
        </Card>
      </Section>

      <Section title={t.feedback}>
        <div className="space-y-3 max-w-lg">
          <Alert variant="info">{t.infoAlert}</Alert>
          <Alert variant="success" title={locale === "fr" ? "Succès" : "Success"}>{t.successAlert}</Alert>
          <Alert variant="warning">{t.warningAlert}</Alert>
          <Alert variant="error">{t.errorAlert}</Alert>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <Spinner />
          <div className="flex-1 space-y-2 max-w-xs">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

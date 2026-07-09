"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button, Card, CardContent, FormField, Input, Select, Textarea, Heading, Text } from "@/components/ui";
import type { Locale } from "@/lib/i18n";

const copy = {
  en: {
    defaultSubject: "Advertising inquiry",
    subjects: ["Advertising inquiry", "Partnership opportunity", "General question", "Report an issue"],
    name: "Name",
    namePlaceholder: "Your name",
    subject: "Subject",
    message: "Message",
    messagePlaceholder: "Tell us about your advertising needs...",
    errorGeneric: "Something went wrong. Please try again.",
    errorNetwork: "Network error. Please try again.",
    sentTitle: "Message sent!",
    sentBody: "Thanks for reaching out — we'll get back to you within 24 hours.",
    sending: "Sending...",
    send: "Send Message",
  },
  fr: {
    defaultSubject: "Demande publicitaire",
    subjects: ["Demande publicitaire", "Opportunité de partenariat", "Question générale", "Signaler un problème"],
    name: "Nom",
    namePlaceholder: "Votre nom",
    subject: "Sujet",
    message: "Message",
    messagePlaceholder: "Parlez-nous de vos besoins publicitaires...",
    errorGeneric: "Une erreur s'est produite. Veuillez réessayer.",
    errorNetwork: "Erreur réseau. Veuillez réessayer.",
    sentTitle: "Message envoyé !",
    sentBody: "Merci de nous avoir contactés — nous vous répondrons sous 24 heures.",
    sending: "Envoi en cours...",
    send: "Envoyer le message",
  },
} as const;

interface ContactFormProps {
  locale?: Locale;
}

export default function ContactForm({ locale = "en" }: ContactFormProps) {
  const t = copy[locale];
  const [name, setName] = useState("");
  const [subject, setSubject] = useState<string>(t.defaultSubject);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t.errorGeneric);
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError(t.errorNetwork);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <Card variant="glass" className="text-center p-8 animate-fade-in">
        <CardContent>
          <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-4" />
          <Heading as="h2" size="sm" className="mb-1">{t.sentTitle}</Heading>
          <Text variant="secondary">{t.sentBody}</Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label={t.name} htmlFor="name" required>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t.namePlaceholder}
              error={!!error}
            />
          </FormField>
          <FormField label={t.subject} htmlFor="subject">
            <Select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
              {t.subjects.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </Select>
          </FormField>
          <FormField label={t.message} htmlFor="message" required>
            <Textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder={t.messagePlaceholder}
            />
          </FormField>
          {error && <Text variant="secondary" className="text-error text-sm">{error}</Text>}
          <Button type="submit" loading={status === "sending"} className="w-full sm:w-auto">
            {status === "sending" ? t.sending : t.send}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

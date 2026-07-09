import type { Metadata } from "next";
import ContactContent from "@/components/pages/ContactContent";

export const metadata: Metadata = {
  title: "Contact — MEL Radio",
  description: "Contactez l'équipe MEL Radio pour la publicité ou toute question.",
};

export default function FrenchContactPage() {
  return <ContactContent locale="fr" />;
}

import type { Metadata } from "next";
import HomeContent from "@/components/pages/HomeContent";

export const metadata: Metadata = {
  title: "Accueil — MEL Radio",
  description: "Écoutez MEL Radio en direct — musique continue avec gestion de file d'attente.",
};

export default function FrenchHomePage() {
  return <HomeContent locale="fr" />;
}

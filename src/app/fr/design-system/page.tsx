import type { Metadata } from "next";
import DesignSystemShowcase from "@/components/design-system/DesignSystemShowcase";

export const metadata: Metadata = {
  title: "Système de Design — MEL Radio",
  description: "Système de design MEL Radio — jetons, composants et motifs visuels.",
};

export default function FrenchDesignSystemPage() {
  return <DesignSystemShowcase locale="fr" />;
}

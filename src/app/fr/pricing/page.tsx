import type { Metadata } from "next";
import PricingContent from "@/components/pages/PricingContent";

export const metadata: Metadata = {
  title: "Publicité — MEL Radio",
  description: "Forfaits et tarifs publicitaires pour diffuser sur MEL Radio.",
};

export default function FrenchPricingPage() {
  return <PricingContent locale="fr" />;
}

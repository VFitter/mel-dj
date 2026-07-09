import type { Metadata } from "next";
import DesignSystemShowcase from "@/components/design-system/DesignSystemShowcase";

export const metadata: Metadata = {
  title: "Design System — MEL Radio",
  description: "MEL Radio design system — tokens, components, and visual patterns.",
};

export default function DesignSystemPage() {
  return <DesignSystemShowcase locale="en" />;
}

import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import MelLogo from "@/components/brand/MelLogo";
import { Heading, Text } from "@/components/ui";

export const metadata: Metadata = {
  title: "Offline — MEL Radio",
  description: "You are offline. Reconnect to resume listening.",
};

export default function OfflinePage() {
  return (
    <PageShell maxWidth="sm" className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#121212] border border-border">
        <MelLogo size={40} glow={false} />
      </div>
      <Heading as="h1" size="lg" className="mb-3">
        You&apos;re offline
      </Heading>
      <Text variant="secondary" className="mb-8">
        MEL Radio needs a connection to stream music. Check your network and try again.
      </Text>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-medium text-text-inverse shadow-glow transition-colors hover:bg-brand-primary-hover"
      >
        Back to MEL Radio
      </Link>
    </PageShell>
  );
}

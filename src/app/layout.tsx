import type { Metadata, Viewport } from "next";
import { Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { RadioProvider } from "@/context/RadioContext";
import GlobalPlayer from "@/components/GlobalPlayer";
import VisitorTracker from "@/components/VisitorTracker";
import PwaRegistrar from "@/components/PwaRegistrar";
import { PWA_DESCRIPTION, PWA_NAME, PWA_SHORT_NAME, PWA_THEME_COLOR } from "@/lib/pwa";

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "MEL Radio — Continuous Music Player",
  description: PWA_DESCRIPTION,
  applicationName: PWA_SHORT_NAME,
  appleWebApp: {
    capable: true,
    title: PWA_NAME,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: PWA_THEME_COLOR,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${pressStart.variable} h-full`}
    >
      <body className="min-h-full bg-surface-base text-text-primary font-sans">
        <RadioProvider>
          {children}
          <GlobalPlayer />
          <VisitorTracker />
          <PwaRegistrar />
        </RadioProvider>
      </body>
    </html>
  );
}

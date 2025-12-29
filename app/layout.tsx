import "./globals.css";
import type { Metadata } from "next";
import { titillium, josefin } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumisalon.fi"),
  title: "Lumi Salon - Professional Hair Salon in Oulu",
  description:
    "Professional hair styling and beauty services in Oulu, Finland. Ammattimaiset hiustenmuotoilu- ja kauneuspalvelut Oulussa.",
  keywords: [
    "hair salon",
    "beauty salon",
    "Oulu",
    "hairdresser",
    "hair styling",
    "beauty services",
    "kampaamo",
    "kauneussalonki",
    "hiustenmuotoilu",
    "kauneuspalvelut",
  ],
  authors: [{ name: "Lumi Salon" }],
  formatDetection: { email: false, address: false, telephone: false },
  icons: { icon: "/favicon.ico" },
  robots: { index: true, follow: true },

  openGraph: {
    type: "website",
    locale: "fi_FI",
    alternateLocale: ["en_US"],
    url: "https://lumi-salon.vercel.app/fi",
    siteName: "Lumi Salon",
    title: "Lumi Salon - Professional Hair Salon in Oulu",
    description:
      "Professional hair styling and beauty services in Oulu, Finland. Expert cuts, coloring, treatments, and more.",
    images: [
      {
        url: "/images/hero-desktop.webp",
        width: 1200,
        height: 630,
        alt: "Lumi Salon - Modern hair salon in Oulu",
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="fi"
      suppressHydrationWarning
      className={`${titillium.variable} ${josefin.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link
          rel="preload"
          href="/images/hero-mobile.webp"
          as="image"
          type="image/webp"
          media="(max-width: 1023px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/images/hero-desktop.webp"
          as="image"
          type="image/webp"
          media="(min-width: 1024px)"
          fetchPriority="high"
        />
      </head>
      <body className="antialiased preload">{children}</body>
    </html>
  );
}

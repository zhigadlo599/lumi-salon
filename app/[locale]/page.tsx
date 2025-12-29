import { Metadata } from "next";
import en from "../../messages/en.json";
import fi from "../../messages/fi.json";
import dynamic from "next/dynamic";
import { Messages } from "@/lib/header";

type Params = {
  params: { locale?: string };
};

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof value === "object" && value !== null && "then" in value;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolvedParams = isPromise(params) ? await params : params;
  const locale = resolvedParams.locale || "fi";
  const t = locale === "fi" ? fi : en;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumisalon.fi"),
    title: `${t["hero.title"]} | Lumi Salon`,
    description: t["hero.subtitle"],
    openGraph: {
      title: `${t["hero.title"]} | Lumi Salon`,
      description: t["hero.subtitle"],
      url: `https://lumisalon.fi/${locale}`,
      siteName: "Lumi Salon",
      locale: locale,
      type: "website",
    },
  };
}

const HomeClient = dynamic(() => import("./HomeClient"), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen center">
      <p className="sr-only">Loading Lumi Salon website...</p>
    </div>
  ),
});

export default async function Page({ params }: Params) {
  const resolvedParams = isPromise(params) ? await params : params;
  const locale = resolvedParams?.locale || "fi";
  const messages: Messages =
    locale === "fi" ? (fi as Messages) : (en as Messages);
  return <HomeClient messages={messages} />;
}

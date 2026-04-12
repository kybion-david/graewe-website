import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  return {
    title: {
      default: messages.meta.title,
      template: `%s | GRAEWE GmbH`,
    },
    description: messages.meta.description,
    metadataBase: new URL("https://www.graewe.com"),
    icons: {
      icon: "/images/logo/favicon-32x32.png",
      apple: "/images/logo/apple-touch-icon.png",
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      locale,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GRAEWE GmbH",
    url: "https://www.graewe.com",
    logo: "https://www.graewe.com/images/logo/graewe-logo.jpg",
    description: "Planung, Entwicklung, Fertigung und Montage von Extrusionsmaschinen",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Max Planck-Straße 1-3",
      addressLocality: "Neuenburg am Rhein",
      postalCode: "79395",
      addressCountry: "DE",
    },
    telephone: "+49-7631-7944-0",
    email: "info@graewe.com",
  };

  return (
    <html lang={locale} className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-white text-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-accent focus:text-dark focus:px-4 focus:py-2 focus:font-bold focus:text-sm"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

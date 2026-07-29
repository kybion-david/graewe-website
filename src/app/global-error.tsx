"use client";

import { useEffect, useMemo } from "react";
import { locales, type Locale } from "@/i18n/routing";
import de from "@/messages/de.json";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import ru from "@/messages/ru.json";
import es from "@/messages/es.json";

const catalogs: Record<Locale, typeof de> = { de, en, fr, ru, es };

function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && (locales as readonly string[]).includes(segment)) {
    return segment as Locale;
  }
  return "de";
}

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const locale = useMemo(() => {
    if (typeof window === "undefined") return "de" as Locale;
    return localeFromPathname(window.location.pathname);
  }, []);

  const t = catalogs[locale].error;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={locale}>
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          background: "#f5f5f5",
          color: "#1a1a1a",
        }}
      >
        <main
          role="alert"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#6b6b6b",
                marginBottom: "0.75rem",
              }}
            >
              {t.code}
            </p>
            <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.75rem" }}>
              {t.title}
            </h1>
            <p style={{ color: "#6b6b6b", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
              {t.description}
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={() => unstable_retry()}
                style={{
                  background: "#ffd600",
                  color: "#1a1a1a",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  padding: "0.75rem 1.25rem",
                }}
              >
                {t.retry}
              </button>
              <a
                href={`/${locale}`}
                style={{
                  display: "inline-block",
                  border: "2px solid #1a1a1a",
                  color: "#1a1a1a",
                  fontWeight: 600,
                  textDecoration: "none",
                  padding: "0.75rem 1.25rem",
                }}
              >
                {t.backHome}
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

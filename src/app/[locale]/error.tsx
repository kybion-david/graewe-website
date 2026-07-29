"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export default function LocaleError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex min-h-[60vh] items-center justify-center px-4 py-16"
      role="alert"
    >
      <div className="max-w-md text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          {t("code")}
        </p>
        <h1 className="mb-3 text-3xl font-bold text-dark">{t("title")}</h1>
        <p className="mb-8 text-text-muted">{t("description")}</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button type="button" variant="primary" onClick={() => unstable_retry()}>
            {t("retry")}
          </Button>
          <Link
            href="/"
            className="inline-block border-2 border-dark px-6 py-3 text-sm font-bold text-dark transition-colors hover:bg-dark hover:text-white"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

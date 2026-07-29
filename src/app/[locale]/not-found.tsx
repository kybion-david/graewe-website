import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          404
        </p>
        <h1 className="mb-3 text-3xl font-bold text-dark">{t("title")}</h1>
        <p className="mb-8 text-text-muted">{t("description")}</p>
        <Link
          href="/"
          className="inline-block bg-accent px-5 py-3 font-semibold text-dark transition-colors hover:bg-accent-light"
        >
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
}

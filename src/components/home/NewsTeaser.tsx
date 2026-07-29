import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getLatestNews, type NewsItem } from "@/lib/news";
import { HomeVideo } from "@/components/home/HomeVideo";

export async function NewsTeaser() {
  const t = await getTranslations();
  const newsT = await getTranslations("news");
  const items = getLatestNews(newsT.raw("items") as NewsItem[]);

  return (
    <section className="bg-grey-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <HomeVideo />

          {/* Latest news */}
          <div className="bg-white rounded-lg p-6 shadow-sm min-h-[200px] flex flex-col">
            <h2 className="text-lg font-bold text-dark mb-4">
              {t("home.newsTitle")}
            </h2>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-grow py-4">
                <p className="text-text-muted text-sm text-center">
                  {t("home.noNews")}
                </p>
              </div>
            ) : (
              <ul className="space-y-4 list-none p-0 m-0 flex-grow">
                {items.map((item) => (
                  <li key={item.slug} className="border-b border-grey-200 last:border-0 pb-4 last:pb-0">
                    <Link
                      href={`/aktuelles/${item.slug}`}
                      className="group block"
                    >
                      <h3 className="text-sm font-semibold text-dark group-hover:text-accent-dark transition-colors leading-snug mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                        {item.excerpt}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href="/aktuelles"
              className="mt-5 text-sm font-semibold text-dark hover:text-accent-dark transition-colors inline-flex items-center gap-1 self-start"
            >
              {t("nav.news")}
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Produktrechner CTA */}
          <Link href="/produktrechner" className="group block">
            <div className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
              <div className="bg-accent text-dark font-bold px-5 py-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  {t("footer.productCalculator")}
                </span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
              <div className="bg-white p-3">
                <Image
                  src="/images/company/produktrechner.jpg"
                  alt="Produktrechner"
                  width={400}
                  height={240}
                  className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity rounded"
                />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

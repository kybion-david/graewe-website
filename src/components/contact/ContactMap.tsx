import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CONTACT_LOCATION, CONTACT_MAP_LINKS } from "@/lib/contactLocation";

export async function ContactMap() {
  const t = await getTranslations("contact");

  return (
    <figure className="mt-6">
      <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-accent rounded-full" />
        {t("mapTitle")}
      </h3>
      <a
        href={CONTACT_MAP_LINKS.openStreetMap}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-xl border border-grey-200 bg-grey-100 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={t("openOsm")}
      >
        <Image
          src={CONTACT_LOCATION.mapImageSrc}
          alt={t("mapAlt")}
          width={CONTACT_LOCATION.mapImageWidth}
          height={CONTACT_LOCATION.mapImageHeight}
          className="h-auto w-full object-cover transition-opacity duration-300 group-hover:opacity-95"
          sizes="(max-width: 1024px) 100vw, 28rem"
        />
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-dark/70 px-4 py-2.5 text-sm font-semibold text-white opacity-100 transition-colors group-hover:bg-dark/80 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
          {t("openOsm")}
        </span>
      </a>
      <figcaption className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-text-muted">{t("mapAttribution")}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <a
            href={CONTACT_MAP_LINKS.openStreetMap}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-dark underline decoration-accent underline-offset-2 hover:text-accent-dark transition-colors"
          >
            {t("openOsm")}
          </a>
          <a
            href={CONTACT_MAP_LINKS.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-dark underline decoration-accent underline-offset-2 hover:text-accent-dark transition-colors"
          >
            {t("openGoogle")}
          </a>
        </div>
      </figcaption>
    </figure>
  );
}

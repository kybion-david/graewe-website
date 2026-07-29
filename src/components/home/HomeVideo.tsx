"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const VIMEO_ID = "987078686";
const VIMEO_EMBED_SRC = `https://player.vimeo.com/video/${VIMEO_ID}?badge=0&autopause=0&autoplay=1&dnt=1&player_id=0&app_id=58479`;
const VIMEO_WATCH_URL = `https://vimeo.com/${VIMEO_ID}`;
const THUMBNAIL_SRC = "/images/home/coilers-video.jpg";

export function HomeVideo() {
  const t = useTranslations("home");
  const [playing, setPlaying] = useState(false);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <div className="relative w-full aspect-video bg-dark">
        {playing ? (
          <iframe
            src={VIMEO_EMBED_SRC}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title={t("videoTitle")}
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={t("videoPlayAria")}
          >
            <Image
              src={THUMBNAIL_SRC}
              alt=""
              width={1280}
              height={720}
              className="absolute inset-0 h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <span
              className="absolute inset-0 bg-dark/25 transition-colors group-hover:bg-dark/40"
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-dark shadow-lg transition-transform group-hover:scale-105">
                <svg
                  className="ml-0.5 h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5.14v13.72L19 12 8 5.14z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-grey-400 mb-1">
          {t("videoLabel")}
        </p>
        <p className="text-sm font-semibold text-dark">{t("videoTitle")}</p>
        {!playing && (
          <a
            href={VIMEO_WATCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-semibold text-text-muted underline underline-offset-2 transition-colors hover:text-dark"
          >
            {t("videoOpenExternal")}
          </a>
        )}
      </div>
    </div>
  );
}

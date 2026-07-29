"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const slides = [
  { key: "slide1", image: "/images/hero/slide-1.png" },
  { key: "slide2", image: "/images/hero/slide-2.png" },
  { key: "slide3", image: "/images/hero/slide-3.png" },
  { key: "slide4", image: "/images/hero/slide-4.png" },
  { key: "slide5", image: "/images/hero/slide-5.png" },
] as const;

const SLIDE_DURATION = 6000;
const TRANSITION_MS = 700;
/** Tailwind `sm` breakpoint — keep in sync with layout classes below. */
const SM_MIN_WIDTH = 640;

const HERO_SIZES = `(max-width: ${SM_MIN_WIDTH - 1}px) 100vw, 56vw`;

export function HeroCarousel() {
  const t = useTranslations("hero");
  const [current, setCurrent] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const currentRef = useRef(current);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const goNext = useCallback(() => {
    setOutgoing(currentRef.current);
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const goPrev = useCallback(() => {
    setOutgoing(currentRef.current);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  const goTo = useCallback((idx: number) => {
    if (idx === currentRef.current) return;
    setOutgoing(currentRef.current);
    setCurrent(idx);
    setProgress(0);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [goNext]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / (SLIDE_DURATION / 50), 100));
    }, 50);
    return () => clearInterval(interval);
  }, [current]);

  // Drop the outgoing slide after the crossfade so inactive images unmount.
  useEffect(() => {
    if (outgoing === null) return;
    const timeout = setTimeout(() => setOutgoing(null), TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [outgoing, current]);

  const mountedIndexes =
    outgoing === null || outgoing === current
      ? [current]
      : [outgoing, current];

  return (
    <section className="bg-gradient-to-b from-white to-grey-100 relative overflow-hidden">
      <h1 className="sr-only">{t("h1")}</h1>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col py-8 sm:min-h-[520px] sm:flex-row sm:items-center sm:py-0 lg:min-h-[560px]">
          {/* Text column */}
          <div className="relative z-10 order-1 max-w-[440px] shrink-0 sm:py-16">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="text-accent font-bold text-sm tabular-nums">
                {String(current + 1).padStart(2, "0")}
              </span>
              <span className="text-grey-300 text-sm">/</span>
              <span className="text-grey-400 text-sm tabular-nums">
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            <div className="relative mb-6 min-h-[80px] sm:mb-0 sm:min-h-[140px]">
              {slides.map((slide, index) => (
                <div
                  key={slide.key}
                  className={`transition-all duration-700 ease-out ${
                    index === current
                      ? "opacity-100 translate-y-0 relative"
                      : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                  }`}
                  aria-hidden={index !== current}
                >
                  <p className="text-dark-muted text-sm sm:text-base lg:text-lg leading-relaxed mb-2 sm:mb-3">
                    {t(`${slide.key}.title`)}
                  </p>
                  <h2 className="text-xl sm:text-2xl lg:text-[2rem] font-bold text-dark leading-tight">
                    {t(`${slide.key}.subtitle`)}
                  </h2>
                </div>
              ))}
            </div>

            {/* Controls — desktop/tablet (under text) */}
            <div className="mt-10 hidden items-center gap-6 sm:flex">
              <SlideArrows onPrev={goPrev} onNext={goNext} size="desktop" />
              <SlideDots
                current={current}
                progress={progress}
                onGoTo={goTo}
                size="desktop"
              />
            </div>
          </div>

          {/* Single image plane — one preload, responsive sizes */}
          <div className="relative order-2 mb-6 aspect-[4/3] w-full sm:absolute sm:right-[-5%] sm:top-0 sm:bottom-0 sm:mb-0 sm:aspect-auto sm:w-[58%] lg:w-[56%]">
            {mountedIndexes.map((index) => {
              const slide = slides[index];
              const isCurrent = index === current;
              return (
                <div
                  key={slide.key}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                    isCurrent
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-[0.97] pointer-events-none sm:scale-[0.97]"
                  }`}
                  aria-hidden={!isCurrent}
                >
                  <Image
                    src={slide.image}
                    alt={`GRAEWE - ${t(`${slide.key}.title`)}`}
                    width={800}
                    height={530}
                    sizes={HERO_SIZES}
                    className="h-auto w-full max-h-full object-contain sm:drop-shadow-2xl"
                    priority={index === 0}
                  />
                </div>
              );
            })}
          </div>

          {/* Controls — mobile (below image) */}
          <div className="order-3 flex items-center justify-between sm:hidden">
            <SlideArrows onPrev={goPrev} onNext={goNext} size="mobile" />
            <SlideDots
              current={current}
              progress={progress}
              onGoTo={goTo}
              size="mobile"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideArrows({
  onPrev,
  onNext,
  size,
}: {
  onPrev: () => void;
  onNext: () => void;
  size: "desktop" | "mobile";
}) {
  const buttonClass =
    size === "desktop"
      ? "w-10 h-10 bg-dark text-white flex items-center justify-center hover:bg-accent hover:text-dark transition-all duration-200"
      : "w-9 h-9 bg-dark text-white flex items-center justify-center hover:bg-accent hover:text-dark transition-all duration-200";

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onPrev}
        className={buttonClass}
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onNext}
        className={buttonClass}
        aria-label="Next slide"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

function SlideDots({
  current,
  progress,
  onGoTo,
  size,
}: {
  current: number;
  progress: number;
  onGoTo: (idx: number) => void;
  size: "desktop" | "mobile";
}) {
  const barClass =
    size === "desktop"
      ? "relative h-1 w-8 bg-grey-300 overflow-hidden rounded-full"
      : "relative h-1 w-6 bg-grey-300 overflow-hidden rounded-full";

  return (
    <div className="flex gap-2">
      {slides.map((_, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onGoTo(idx)}
          className={barClass}
          aria-label={`Go to slide ${idx + 1}`}
        >
          <div
            className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-100"
            style={{
              width: idx === current ? `${progress}%` : idx < current ? "100%" : "0%",
            }}
          />
        </button>
      ))}
    </div>
  );
}

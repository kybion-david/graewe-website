"use client";

import { useState, useEffect, useCallback } from "react";
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

export function HeroCarousel() {
  const t = useTranslations("hero");
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  const goTo = useCallback((idx: number) => {
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

  return (
    <section className="bg-gradient-to-b from-white to-grey-100 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop / Tablet layout */}
        <div className="relative min-h-[520px] lg:min-h-[560px] hidden sm:flex items-center">
          {/* Text column */}
          <div className="relative z-10 max-w-[440px] py-16 shrink-0">
            {/* Slide counter */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-accent font-bold text-sm tabular-nums">
                {String(current + 1).padStart(2, "0")}
              </span>
              <span className="text-grey-300 text-sm">/</span>
              <span className="text-grey-400 text-sm tabular-nums">
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            {/* Text with crossfade */}
            <div className="relative min-h-[140px]">
              {slides.map((slide, index) => (
                <div
                  key={slide.key}
                  className={`transition-all duration-700 ease-out ${
                    index === current
                      ? "opacity-100 translate-y-0 relative"
                      : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <p className="text-dark-muted text-base lg:text-lg leading-relaxed mb-3">
                    {t(`${slide.key}.title`)}
                  </p>
                  <h2 className="text-2xl lg:text-[2rem] font-bold text-dark leading-tight">
                    {t(`${slide.key}.subtitle`)}
                  </h2>
                </div>
              ))}
            </div>

            {/* Progress dots + arrows */}
            <div className="flex items-center gap-6 mt-10">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={goPrev}
                  className="w-10 h-10 bg-dark text-white flex items-center justify-center hover:bg-accent hover:text-dark transition-all duration-200"
                  aria-label="Previous slide"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="w-10 h-10 bg-dark text-white flex items-center justify-center hover:bg-accent hover:text-dark transition-all duration-200"
                  aria-label="Next slide"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Progress indicators */}
              <div className="flex gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className="relative h-1 w-8 bg-grey-300 overflow-hidden rounded-full"
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
            </div>
          </div>

          {/* Image area */}
          <div className="absolute right-[-5%] top-0 bottom-0 w-[58%] lg:w-[56%]">
            {slides.map((slide, index) => (
              <div
                key={slide.key}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                  index === current
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-[0.97] pointer-events-none"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={`GRAEWE - ${t(`${slide.key}.title`)}`}
                  width={800}
                  height={530}
                  className="w-full h-auto max-h-full object-contain drop-shadow-2xl"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="sm:hidden py-8">
          {/* Slide counter */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent font-bold text-sm tabular-nums">
              {String(current + 1).padStart(2, "0")}
            </span>
            <span className="text-grey-300 text-sm">/</span>
            <span className="text-grey-400 text-sm tabular-nums">
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Text */}
          <div className="relative min-h-[80px] mb-6">
            {slides.map((slide, index) => (
              <div
                key={slide.key}
                className={`transition-all duration-700 ${
                  index === current
                    ? "opacity-100 relative"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                <p className="text-dark-muted text-sm leading-relaxed mb-2">
                  {t(`${slide.key}.title`)}
                </p>
                <h2 className="text-xl font-bold text-dark leading-tight">
                  {t(`${slide.key}.subtitle`)}
                </h2>
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="relative w-full aspect-[4/3] mb-6">
            {slides.map((slide, index) => (
              <div
                key={slide.key}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                  index === current ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={`GRAEWE - ${t(`${slide.key}.title`)}`}
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goPrev}
                className="w-9 h-9 bg-dark text-white flex items-center justify-center hover:bg-accent hover:text-dark transition-all duration-200"
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goNext}
                className="w-9 h-9 bg-dark text-white flex items-center justify-center hover:bg-accent hover:text-dark transition-all duration-200"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className="relative h-1 w-6 bg-grey-300 overflow-hidden rounded-full"
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
          </div>
        </div>
      </div>
    </section>
  );
}

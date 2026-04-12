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

export function HeroCarousel() {
  const t = useTranslations("hero");
  const [current, setCurrent] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <section className="bg-white relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop / Tablet layout */}
        <div className="relative min-h-[500px] lg:min-h-[520px] hidden sm:flex items-center">
          {/* Text + arrows column — arrows pinned at fixed bottom */}
          <div className="relative z-10 max-w-[420px] py-16 shrink-0 min-h-[320px]">
            {/* Text area — natural flow with crossfade */}
            <div className="relative min-h-[120px]">
              {slides.map((slide, index) => (
                <div
                  key={slide.key}
                  className={`transition-opacity duration-700 ${
                    index === current
                      ? "opacity-100 relative"
                      : "opacity-0 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <p className="text-dark/70 text-base lg:text-lg leading-relaxed mb-3">
                    {t(`${slide.key}.title`)}
                  </p>
                  <h2 className="text-xl lg:text-[1.7rem] font-bold text-dark leading-tight">
                    {t(`${slide.key}.subtitle`)}
                  </h2>
                </div>
              ))}
            </div>

            {/* Arrows pinned to bottom of this column — never shifts */}
            <div className="group flex absolute bottom-16 left-0 z-20">
              <button
                type="button"
                onClick={goPrev}
                className="w-9 h-9 bg-accent hover:bg-dark text-dark hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer group-hover:-translate-x-1"
                aria-label="Previous slide"
              >
                <span className="text-lg leading-none">&larr;</span>
              </button>
              <button
                type="button"
                onClick={goNext}
                className="w-9 h-9 bg-accent hover:bg-dark text-dark hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer group-hover:translate-x-1"
                aria-label="Next slide"
              >
                <span className="text-lg leading-none">&rarr;</span>
              </button>
            </div>
          </div>

          <div className="absolute right-[-5%] top-0 bottom-0 w-[60%] lg:w-[58%]">
            {slides.map((slide, index) => (
              <div
                key={slide.key}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
                  index === current ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={`GRAEWE - ${t(`${slide.key}.title`)}`}
                  width={800}
                  height={530}
                  className="w-full h-auto max-h-full object-contain"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="sm:hidden py-8">
          <div className="relative min-h-[100px] mb-14">
            {slides.map((slide, index) => (
              <div
                key={slide.key}
                className={`transition-opacity duration-700 ${
                  index === current
                    ? "opacity-100 relative"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
              >
                <p className="text-dark/70 text-sm leading-relaxed mb-2">
                  {t(`${slide.key}.title`)}
                </p>
                <h2 className="text-lg font-bold text-dark leading-tight">
                  {t(`${slide.key}.subtitle`)}
                </h2>
              </div>
            ))}

            {/* Arrows pinned to bottom of text area */}
            <div className="group flex absolute bottom-0 left-0 z-20">
              <button
                type="button"
                onClick={goPrev}
                className="w-8 h-8 bg-accent hover:bg-dark text-dark hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer group-hover:-translate-x-1"
                aria-label="Previous slide"
              >
                <span className="text-base leading-none">&larr;</span>
              </button>
              <button
                type="button"
                onClick={goNext}
                className="w-8 h-8 bg-accent hover:bg-dark text-dark hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer group-hover:translate-x-1"
                aria-label="Next slide"
              >
                <span className="text-base leading-none">&rarr;</span>
              </button>
            </div>
          </div>

          <div className="relative w-full aspect-[4/3] mb-4">
            {slides.map((slide, index) => (
              <div
                key={slide.key}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
                  index === current ? "opacity-100" : "opacity-0 pointer-events-none"
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
        </div>
      </div>
    </section>
  );
}

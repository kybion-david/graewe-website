"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ProductDetail } from "@/lib/productContent";

interface ProductDetailContentProps {
  detail: ProductDetail;
  images: string[];
  contactLabel: string;
}

export function ProductDetailContent({
  detail,
  images,
  contactLabel,
}: ProductDetailContentProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">{detail.title}</h1>
      <div className="w-12 h-1 bg-accent mb-8" />

      <div className="space-y-6">
        {detail.sections.map((section, idx) => (
          <div key={idx}>
            {section.heading && (
              <h3 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                {section.heading}
              </h3>
            )}
            {section.content && (
              <p className="text-text leading-relaxed mb-3 pl-3">{section.content}</p>
            )}
            {section.items && (
              <ul className="space-y-2 pl-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-text">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {detail.cta && (
          <p className="mt-4">
            <Link
              href={detail.cta.link}
              className="inline-flex items-center gap-2 text-accent-dark hover:text-dark font-semibold transition-colors"
            >
              {detail.cta.text}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </p>
        )}
      </div>

      {images.length > 0 && (
        <div className="mt-10">
          <p className="text-xs font-bold text-grey-400 uppercase tracking-widest mb-4">
            Galerie
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-grey-100 cursor-pointer"
              >
                <Image
                  src={src}
                  alt={`${detail.title} ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors duration-300 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {selectedImage > 0 && (
            <button
              className="absolute left-4 text-white/80 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(selectedImage - 1); }}
              aria-label="Previous image"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {selectedImage < images.length - 1 && (
            <button
              className="absolute right-4 text-white/80 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(selectedImage + 1); }}
              aria-label="Next image"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div className="relative max-w-4xl max-h-[80vh] w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedImage]}
              alt={`${detail.title} ${selectedImage + 1}`}
              width={1200}
              height={800}
              className="w-full h-auto object-contain max-h-[80vh]"
            />
            <p className="text-white/60 text-sm text-center mt-3">
              {selectedImage + 1} / {images.length}
            </p>
          </div>
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-grey-200">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 bg-accent text-dark font-bold px-6 py-3 hover:bg-accent-dark transition-colors"
        >
          {contactLabel}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

"use client";

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
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-6">{detail.title}</h1>

      <div className="space-y-6">
        {detail.sections.map((section, idx) => (
          <div key={idx}>
            {section.heading && (
              <h3 className="text-lg font-semibold text-dark mb-2">
                {section.heading}
              </h3>
            )}
            {section.content && (
              <p className="text-text leading-relaxed mb-2">{section.content}</p>
            )}
            {section.items && (
              <ul className="list-disc list-inside space-y-1 text-text ml-2">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {detail.cta && (
          <p className="mt-4">
            <Link
              href={detail.cta.link}
              className="text-accent hover:underline font-medium"
            >
              {detail.cta.text}
            </Link>
          </p>
        )}
      </div>

      {images.length > 0 && (
        <div className="mt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((src, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/3] rounded-lg overflow-hidden bg-grey-100"
              >
                <Image
                  src={src}
                  alt={`${detail.title} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/team"
          className="inline-block bg-accent text-dark font-medium px-6 py-2 rounded hover:bg-accent-light transition-colors"
        >
          {contactLabel}
        </Link>
      </div>
    </div>
  );
}

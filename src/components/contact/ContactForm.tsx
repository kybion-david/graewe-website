"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

interface ContactFormData {
  name: string;
  firstName: string;
  email: string;
  phone: string;
  message: string;
}

export function ContactForm() {
  const t = useTranslations("contact");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputBase =
    "w-full px-4 py-3 border bg-white rounded-lg outline-none transition-all duration-200 text-dark placeholder:text-grey-400";
  const inputNormal = `${inputBase} border-grey-300 focus:ring-2 focus:ring-accent/30 focus:border-accent`;
  const inputError = `${inputBase} border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5">
            {t("name")} <span className="text-accent-dark">*</span>
          </label>
          <input
            {...register("name", { required: true })}
            className={errors.name ? inputError : inputNormal}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5">
            {t("firstName")} <span className="text-accent-dark">*</span>
          </label>
          <input
            {...register("firstName", { required: true })}
            className={errors.firstName ? inputError : inputNormal}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-dark mb-1.5">
          {t("email")} <span className="text-accent-dark">*</span>
        </label>
        <input
          type="email"
          {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
          className={errors.email ? inputError : inputNormal}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-dark mb-1.5">
          {t("phone")}
        </label>
        <input
          type="tel"
          {...register("phone")}
          className={inputNormal}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-dark mb-1.5">
          {t("message")} <span className="text-accent-dark">*</span>
        </label>
        <textarea
          rows={5}
          {...register("message", { required: true })}
          className={`${errors.message ? inputError : inputNormal} resize-y`}
        />
      </div>

      <p className="text-xs text-text-muted">
        <span className="text-accent-dark">*</span> {t("requiredField")}
      </p>

      {submitStatus === "success" && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t("successMessage")}
        </div>
      )}
      {submitStatus === "error" && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {t("errorMessage")}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-dark font-bold hover:bg-accent-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      >
        {isSubmitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t("submit")}
          </>
        ) : (
          <>
            {t("submit")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}

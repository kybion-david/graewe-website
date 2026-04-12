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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            {t("name")} *
          </label>
          <input
            {...register("name", { required: true })}
            className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-all ${
              errors.name ? "border-red-400 focus:ring-red-200" : "border-grey-300 focus:ring-accent/30 focus:border-accent"
            } focus:ring-2`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            {t("firstName")} *
          </label>
          <input
            {...register("firstName", { required: true })}
            className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-all ${
              errors.firstName ? "border-red-400 focus:ring-red-200" : "border-grey-300 focus:ring-accent/30 focus:border-accent"
            } focus:ring-2`}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted mb-1">
          {t("email")} *
        </label>
        <input
          type="email"
          {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
          className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-all ${
            errors.email ? "border-red-400 focus:ring-red-200" : "border-grey-300 focus:ring-accent/30 focus:border-accent"
          } focus:ring-2`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted mb-1">
          {t("phone")}
        </label>
        <input
          type="tel"
          {...register("phone")}
          className="w-full px-3 py-2.5 border border-grey-300 rounded-lg focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-muted mb-1">
          {t("message")} *
        </label>
        <textarea
          rows={5}
          {...register("message", { required: true })}
          className={`w-full px-3 py-2.5 border rounded-lg outline-none transition-all resize-y ${
            errors.message ? "border-red-400 focus:ring-red-200" : "border-grey-300 focus:ring-accent/30 focus:border-accent"
          } focus:ring-2`}
        />
      </div>

      <p className="text-xs text-text-muted">* {t("requiredField")}</p>

      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
          {t("successMessage")}
        </div>
      )}
      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
          {t("errorMessage")}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-8 py-3 bg-accent text-dark font-bold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "..." : t("submit")}
      </button>
    </form>
  );
}

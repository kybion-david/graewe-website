"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CONTACT_EMAIL_INVALID,
  CONTACT_FIELD_REQUIRED,
  contactFormSchema,
  type ContactFormData,
} from "@/lib/contactSchema";
import { CONTACT_HONEYPOT_FIELD } from "@/lib/contactSpam";
import { TurnstileWidget } from "./TurnstileWidget";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

function RequiredMark() {
  return (
    <span className="text-accent-dark" aria-hidden="true">
      *
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm text-red-700" role="alert">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      {message}
    </p>
  );
}

export function ContactForm() {
  const t = useTranslations("contact");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorCode, setErrorCode] = useState<
    "generic" | "captcha" | "rate_limited" | "email_unavailable"
  >("generic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [captchaClientError, setCaptchaClientError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      firstName: "",
      email: "",
      phone: "",
      message: "",
      website: "",
    },
  });

  function fieldErrorText(code: string | undefined): string | undefined {
    if (!code) return undefined;
    if (code === CONTACT_EMAIL_INVALID) return t("emailInvalid");
    if (code === CONTACT_FIELD_REQUIRED) return t("fieldRequired");
    return t("fieldRequired");
  }

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setCaptchaClientError(false);
    setErrorCode("generic");

    if (turnstileSiteKey && !turnstileToken) {
      setCaptchaClientError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          firstName: data.firstName,
          email: data.email,
          phone: data.phone,
          message: data.message,
          [CONTACT_HONEYPOT_FIELD]: data.website,
          turnstileToken: turnstileToken ?? undefined,
        }),
      });

      if (res.ok) {
        setSubmitStatus("success");
        reset({
          name: "",
          firstName: "",
          email: "",
          phone: "",
          message: "",
          website: "",
        });
        setTurnstileToken(null);
        setTurnstileResetKey((k) => k + 1);
        return;
      }

      const payload = (await res.json().catch(() => null)) as
        | { code?: string }
        | null;
      if (payload?.code === "captcha_failed") {
        setErrorCode("captcha");
      } else if (res.status === 429 || payload?.code === "rate_limited") {
        setErrorCode("rate_limited");
      } else if (payload?.code === "email_unavailable") {
        setErrorCode("email_unavailable");
      } else {
        setErrorCode("generic");
      }
      setSubmitStatus("error");
    } catch {
      setErrorCode("generic");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputBase =
    "w-full px-4 py-3 border bg-white rounded-lg outline-none transition-all duration-200 text-dark placeholder:text-grey-400";
  const inputNormal = `${inputBase} border-grey-300 focus:ring-2 focus:ring-accent/30 focus:border-accent`;
  const inputError = `${inputBase} border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400`;

  const errorMessage =
    errorCode === "captcha"
      ? t("captchaError")
      : errorCode === "rate_limited"
        ? t("rateLimitError")
        : errorCode === "email_unavailable"
          ? t("emailUnavailable")
          : t("errorMessage");

  const nameError = fieldErrorText(errors.name?.message);
  const firstNameError = fieldErrorText(errors.firstName?.message);
  const emailError = fieldErrorText(errors.email?.message);
  const messageError = fieldErrorText(errors.message?.message);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-5" noValidate>
      {/* Honeypot — hidden from users, filled by many bots */}
      <div
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="contact-website">{CONTACT_HONEYPOT_FIELD}</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold text-dark mb-1.5">
            {t("name")} <RequiredMark />
          </label>
          <input
            id="contact-name"
            aria-required="true"
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "contact-name-error" : undefined}
            autoComplete="family-name"
            {...register("name")}
            className={nameError ? inputError : inputNormal}
          />
          <FieldError id="contact-name-error" message={nameError} />
        </div>
        <div>
          <label htmlFor="contact-firstName" className="block text-sm font-semibold text-dark mb-1.5">
            {t("firstName")} <RequiredMark />
          </label>
          <input
            id="contact-firstName"
            aria-required="true"
            aria-invalid={firstNameError ? true : undefined}
            aria-describedby={firstNameError ? "contact-firstName-error" : undefined}
            autoComplete="given-name"
            {...register("firstName")}
            className={firstNameError ? inputError : inputNormal}
          />
          <FieldError id="contact-firstName-error" message={firstNameError} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-semibold text-dark mb-1.5">
          {t("email")} <RequiredMark />
        </label>
        <input
          id="contact-email"
          type="email"
          aria-required="true"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "contact-email-error" : undefined}
          autoComplete="email"
          {...register("email")}
          className={emailError ? inputError : inputNormal}
        />
        <FieldError id="contact-email-error" message={emailError} />
      </div>

      <div>
        <label htmlFor="contact-phone" className="block text-sm font-semibold text-dark mb-1.5">
          {t("phone")}
        </label>
        <input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          {...register("phone")}
          className={inputNormal}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-dark mb-1.5">
          {t("message")} <RequiredMark />
        </label>
        <textarea
          id="contact-message"
          rows={5}
          aria-required="true"
          aria-invalid={messageError ? true : undefined}
          aria-describedby={messageError ? "contact-message-error" : undefined}
          {...register("message")}
          className={`${messageError ? inputError : inputNormal} resize-y`}
        />
        <FieldError id="contact-message-error" message={messageError} />
      </div>

      {turnstileSiteKey ? (
        <div>
          <p className="block text-sm font-semibold text-dark mb-1.5">
            {t("captchaLabel")} <RequiredMark />
          </p>
          <TurnstileWidget
            key={turnstileResetKey}
            siteKey={turnstileSiteKey}
            onToken={setTurnstileToken}
          />
          {captchaClientError && (
            <p className="mt-2 text-sm text-red-700" role="alert">
              {t("captchaRequired")}
            </p>
          )}
        </div>
      ) : null}

      <p className="text-xs text-text-muted">
        <span className="text-accent-dark" aria-hidden="true">
          *
        </span>{" "}
        {t("requiredField")}
      </p>

      {submitStatus === "success" && (
        <div
          role="status"
          className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t("successMessage")}
        </div>
      )}
      {submitStatus === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-dark font-bold hover:bg-accent-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      >
        {isSubmitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t("submit")}
          </>
        ) : (
          <>
            {t("submit")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}

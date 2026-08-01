import type { Locale } from "@/i18n/routing";

export type ErrorCopy = {
  code: string;
  title: string;
  description: string;
  retry: string;
  backHome: string;
};

/**
 * Copy for `global-error.tsx`, inlined rather than read from
 * `src/messages/*.json` on purpose.
 *
 * `global-error.tsx` replaces the root layout, so it sits outside
 * `NextIntlClientProvider` and cannot use `useTranslations`. Importing the
 * catalogs instead pulled all five (248 KB raw / 75 KB gzip) into a client
 * chunk that loaded on *every* page — to render these five strings.
 *
 * `tests/unit/globalErrorCopy.test.ts` deep-compares this map against `error`
 * in each locale file, so the JSON stays the source of truth and drift fails CI.
 */
export const globalErrorCopy: Record<Locale, ErrorCopy> = {
  de: {
    code: "Fehler",
    title: "Etwas ist schiefgelaufen",
    description:
      "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kehren Sie zur Startseite zurück.",
    retry: "Erneut versuchen",
    backHome: "Zur Startseite",
  },
  en: {
    code: "Error",
    title: "Something went wrong",
    description:
      "An unexpected error occurred. Please try again or return to the home page.",
    retry: "Try again",
    backHome: "Back to home",
  },
  fr: {
    code: "Erreur",
    title: "Une erreur s’est produite",
    description:
      "Une erreur inattendue s’est produite. Veuillez réessayer ou retourner à l’accueil.",
    retry: "Réessayer",
    backHome: "Retour à l’accueil",
  },
  ru: {
    code: "Ошибка",
    title: "Что-то пошло не так",
    description:
      "Произошла непредвиденная ошибка. Попробуйте ещё раз или вернитесь на главную страницу.",
    retry: "Попробовать снова",
    backHome: "На главную",
  },
  es: {
    code: "Error",
    title: "Algo salió mal",
    description:
      "Se produjo un error inesperado. Inténtelo de nuevo o vuelva a la página de inicio.",
    retry: "Intentar de nuevo",
    backHome: "Volver al inicio",
  },
};

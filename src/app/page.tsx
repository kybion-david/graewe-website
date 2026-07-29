import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * Fallback when the request proxy does not run. Prefer the proxy path
 * (`src/proxy.ts` / next-intl), which already issues 307 → `/de`.
 * `redirect()` emits a real HTTP 307 — never a meta-refresh stub.
 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}

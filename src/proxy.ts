import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { resolveLegacyRedirect } from "./lib/legacyRedirects";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const target = resolveLegacyRedirect(pathname, searchParams);

  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  return intlMiddleware(request);
}

export const config = {
  // Allow `.html` legacy URLs through so cutover redirects can run.
  // Still skip API, Next internals, and common static asset extensions.
  matcher: [
    "/((?!api|_next|_vercel|\\.swa|images|downloads|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|ico|webp|avif|woff2?|ttf|map|xml|txt|pdf)$).*)",
  ],
};

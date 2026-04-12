import { routing } from "@/i18n/routing";

export default function RootPage() {
  const target = `./${routing.defaultLocale}/`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <p>
        Redirecting to <a href={target}>{target}</a>…
      </p>
    </>
  );
}

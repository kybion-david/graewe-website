import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("imprint") };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <div className="max-w-4xl mx-auto py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
        {t("imprint")}
      </h1>
      <div className="w-16 h-1 bg-accent mb-10" />
      <div className="space-y-8 text-text leading-relaxed">
        <section className="bg-grey-100 rounded-xl p-6">
          <h2 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded-full" />
            Anschrift
          </h2>
          <p>
            GRAEWE GmbH
            <br />
            Maschinenbau
            <br />
            Max-Planck-Straße 1+2
            <br />
            D-79395 Neuenburg
          </p>
          <p className="mt-3">
            Tel.: +49 (0) 7631 79 44-0
            <br />
            Fax: +49 (0) 7631 79 44-22
            <br />
            info@graewe.com
          </p>
        </section>

        <section className="bg-grey-100 rounded-xl p-6">
          <h2 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded-full" />
            Geschäftsführung
          </h2>
          <p>
            Dipl.-Ing.(Univ.) Michael Graewe
            <br />
            Dipl.-Ing.(FH) Dipl.-Exportwirt (EA) Stefan Graewe
          </p>
          <p className="mt-3">
            Commercial Registry: HRB Freiburg 300198
            <br />
            UST-ID-Nr.: DE 142475242
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            Urheberrechtshinweise
          </h2>
          <p>
            Sämtliche Texte, Bilder, Grafiken sowie das Layout dieser Seiten
            sind urheberrechtlich geschützt. Jede Vervielfältigung, Verbreitung,
            Speicherung, Übermittlung, Sendung und Wieder- bzw. Weitergabe der
            Inhalte ist ohne schriftliche Genehmigung der GRAEWE GmbH
            ausdrücklich untersagt. Eine unerlaubte Verwendung, Reproduktion oder
            Weitergabe einzelner Inhalte oder kompletter Seiten können sowohl
            straf- als auch zivilrechtlich verfolgt werden.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            Datenschutzbestimmungen
          </h2>
          <p>
            Der Schutz Ihrer Privatsphäre und Ihrer personenbezogenen Daten ist
            uns ein wichtiges Anliegen. Daher betreiben wir unsere
            Internetaktivitäten ausschließlich unter Berücksichtigung der
            jeweils anzuwendenden Datenschutzgesetze.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            Datensicherheit
          </h2>
          <p>
            Wir treffen gewissenhaft Vorkehrungen, um Ihre Daten vor Verlust,
            Manipulation und unberechtigtem Zugriff zu schützen. Die
            Vorkehrungen entsprechen dem technologischen Entwicklungsstand.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            Eingesetzte Technologien
          </h2>
          <p>
            In Teilen dieser Website werden eventuell im Internet weit
            verbreitete Technologien wie JavaScript benutzt, um Ihnen die
            gewünschten Informationen für Sie bequemer vermitteln zu können. In
            keinem Fall werden diese Technologien von uns dazu benutzt, um
            persönliche Daten auszuspähen oder Daten auf Ihrem Rechner zu
            manipulieren.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">Protokolle</h2>
          <p>
            Wir protokollieren die Zugriffe auf unseren HTTP-Server wie
            allgemein üblich. Unsere Protokolle beinhalten jeweils Datum und
            Zeit, die Bezeichnung (URL) der von Ihnen angeforderten Seite und
            die Bezeichnung (IP-Nummer) des Rechners, von dem aus die Seite
            abgerufen wird. Diese Daten sind nicht personenbezogen und dienen
            der rechtlichen Absicherung (z.B. gegen Hacker-Angriffe) und zur
            Optimierung unserer Webpräsenz durch die statistische Auswertung
            der Daten (z.B. Zugriffsfehler, durchschnittliche Verweilzeit,
            verwendete Internet-Browser und Betriebssysteme).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">Cookies</h2>
          <p>
            Cookies sind Informationen, die automatisch nach strengen Regeln und
            mit für Sie überprüfbaren Inhalten auf Ihrem Rechner abgelegt
            werden. Wir verwenden Cookies ausschließlich, um Ihnen in unserer
            Website mehr Bequemlichkeit bieten zu können. Eine Zuordnung von
            Cookies zu personenbezogenen Profilen findet nicht statt.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            Haftungsausschluss
          </h2>
          <p>
            Diese Website wird kontinuierlich weiter entwickelt. Obwohl bei der
            Zusammenstellung der auf unseren Webseiten enthaltenen Informationen
            größte Sorgfalt angewandt wird, kann GRAEWE GmbH für die Aktualität,
            Richtigkeit oder Vollständigkeit keine Gewähr übernehmen. Dies gilt
            auch für alle Verbindungen (&quot;Links&quot;), auf die diese
            Website direkt oder indirekt verweist. Die GRAEWE GmbH ist für den
            Inhalt einer Seite, die mit einem solchen Link erreicht wird, nicht
            verantwortlich. Für den Inhalt der verlinkten Seiten sind
            ausschließlich deren Betreiber verantwortlich. In keinem Fall kann
            die GRAEWE GmbH etwaige Schäden irgendwelcher Art verantwortlich
            gemacht werden, die durch die Benutzung oder im Zusammenhang mit der
            Benutzung der hier bereitgestellten Informationen entstehen, seien
            es direkte oder indirekte Schäden bzw. Folgeschäden, die z.B. aus
            dem Verlust von Daten entstehen. Wir behalten uns Änderungen der
            Informationen auf unserem Server ohne vorherige Ankündigung vor. Alle
            Angebote sind freibleibend und unverbindlich.
          </p>
        </section>
      </div>
    </div>
  );
}

import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("privacy") };
}

export default async function DatenschutzPage({
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
        Datenschutzerklärung
      </h1>
      <div className="w-16 h-1 bg-accent mb-10" />
      <div className="space-y-8 text-text leading-relaxed">
        <p>
          Der Schutz Ihrer personenbezogenen Daten bei der Erhebung,
          Verarbeitung und Nutzung anlässlich Ihres Besuchs auf unserer Homepage
          ist uns ein wichtiges Anliegen. Ihre Daten werden im Rahmen der
          gesetzlichen Vorschriften geschützt. Personenbezogene Daten werden auf
          dieser Webseite nur im technisch notwendigen Umfang erhoben.
        </p>
        <p>
          Nachfolgend finden Sie Informationen, welche Daten während Ihres
          Besuchs auf der Homepage erfasst und wie diese genutzt werden:
        </p>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            1. Erhebung und Verarbeitung von Daten
          </h2>
          <p>
            Jeder Zugriff auf unsere Homepage und jeder Abruf einer auf der
            Homepage hinterlegten Datei werden protokolliert. Die Speicherung
            dient internen systembezogenen Zwecken. Protokolliert werden: Name
            der abgerufenen Datei, Datum und Uhrzeit des Abrufs, übertragene
            Datenmenge, Meldung über erfolgreichen Abruf, Webbrowser und
            anfragende Domain. Zusätzlich werden die IP Adressen der
            anfragenden Rechner protokolliert.
          </p>
          <p className="mt-3">
            Bei Online-Bestellungen über unsere Webseite sowie bei
            Kontaktaufnahme erheben wir mit dem Kundendaten- bzw.
            Kontakt-Formular verschiedene personenbezogene Daten von Ihnen, die
            Sie durch das Absenden Ihrer Bestellung zusammen mit den übrigen
            Daten der Bestellung an uns übermitteln. Diese von Ihnen angegebenen
            Daten werden dabei in verschlüsselter Form (SSL-Verschlüsselungstechnologie)
            an uns übertragen, so dass ein Ausspähen dieser Daten durch Dritte
            ausgeschlossen ist.
          </p>
          <p className="mt-3">
            Mit der Übermittlung Ihrer personenbezogenen Daten an uns erklären
            Sie sich mit der Erhebung, Verarbeitung und Nutzung Ihrer Daten
            entsprechend der vorliegenden Datenschutzerklärung einverstanden.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            2. Nutzung und Weitergabe personenbezogener Daten
          </h2>
          <p>
            Soweit Sie uns personenbezogene Daten zur Verfügung gestellt haben,
            verwenden wir diese nur zur Abwicklung Ihrer Buchung/Bestellung, zur
            Beantwortung Ihrer Anfragen, zur Abwicklung mit Ihnen geschlossener
            Verträge und für die technische Administration.
          </p>
          <p className="mt-3">
            Ihre personenbezogenen Daten werden an Dritte nur weitergegeben oder
            sonst übermittelt, wenn dies zum Zwecke der Vertragsabwicklung –
            insbesondere Weitergabe von Bestelldaten an Lieferanten –
            erforderlich ist, dies zu Abrechnungszwecken erforderlich ist, wir
            gesetzlich dazu verpflichtet sind oder Sie zuvor eingewilligt haben.
            Sie haben das Recht, eine erteilte Einwilligung mit Wirkung für die
            Zukunft jederzeit zu widerrufen.
          </p>
          <p className="mt-3">
            Die Löschung der gespeicherten personenbezogenen Daten erfolgt, wenn
            Sie Ihre Einwilligung zur Speicherung widerrufen, wenn ihre Kenntnis
            zur Erfüllung des mit der Speicherung verfolgten Zwecks nicht mehr
            erforderlich ist oder wenn ihre Speicherung aus sonstigen
            gesetzlichen Gründen unzulässig ist.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">3. Cookies</h2>
          <p>
            Die Internetseiten verwenden an mehreren Stellen so genannte
            Cookies. Sie dienen dazu, unser Angebot nutzerfreundlicher,
            effektiver und sicherer zu machen. Cookies sind kleine Textdateien,
            die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert.
            Die meisten der von uns verwendeten Cookies sind so genannte
            &quot;Session-Cookies&quot;. Sie werden nach Ende Ihres Besuchs
            automatisch gelöscht. Cookies richten auf Ihrem Rechner keinen
            Schaden an und enthalten keine Viren.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            4. Links zu anderen Webseiten
          </h2>
          <p>
            Für Links zu anderen Webseiten übernehmen wir für deren Inhalte
            keine Haftung.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            5. Elektronischer Newsletter
          </h2>
          <p>
            Wenn Sie unseren elektronischen Newsletter bestellen wollen,
            benötigen wir aus rechtlichen Gründen die Angabe Ihrer
            E-Mail-Adresse sowie die Bestätigung, dass Sie der Inhaber der
            angegebenen Email-Adresse sind und mit dem Empfang des
            elektronischen Newsletters einverstanden sind. Die Daten werden nur
            zu dem Zweck erhoben, Ihnen den Newsletter zuschicken zu können und
            unsere diesbezügliche Berechtigung zu dokumentieren. Eine Weitergabe
            der Daten an Dritte erfolgt nicht. Die Bestellung des Newsletters
            und Ihre Einwilligung zur Speicherung der E-Mail-Adresse können Sie
            jederzeit widerrufen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            6. Auskunftsrecht
          </h2>
          <p>
            Auf schriftliche Anfrage werden wir Sie gern über die zu Ihrer
            Person gespeicherten Daten informieren.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-dark mb-3">
            Sicherheitshinweis
          </h2>
          <p>
            Wir sind bemüht, Ihre personenbezogenen Daten durch Ergreifung
            aller technischen und organisatorischen Möglichkeiten so zu
            speichern, dass sie für Dritte nicht zugänglich sind. Bei der
            Kommunikation per E-Mail kann die vollständige Datensicherheit von
            uns nicht gewährleistet werden, so dass wir Ihnen bei vertraulichen
            Informationen den Postweg empfehlen.
          </p>
        </section>
      </div>
    </div>
  );
}

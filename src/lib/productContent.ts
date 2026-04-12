import type { ProductCategory } from "./products";

export interface ProductSection {
  heading?: string;
  content?: string;
  items?: string[];
}

export interface ProductDetail {
  title: string;
  sections: ProductSection[];
  cta?: { text: string; link: string };
}

type ProductContentMap = Record<string, Record<string, Record<string, ProductDetail>>>;

const content: ProductContentMap = {
  de: {
    rohrextrusion: {
      extruder: {
        title: "Rohrextrusion Extruder",
        sections: [
          {
            content:
              "Fa. Graewe stellt selber keine Extruder und Extrusionswerkzeuge her, wir arbeiten jedoch mit zahlreichen namhaften Extruderherstellern eng zusammen, und können Ihnen somit auch komplette Fertigungsanlagen liefern. Über unser Tochterunternehmen next haben wir auch ständig perfekt überholte gebrauchte und neuwertige Extruder vorrätig.",
          },
        ],
        cta: { text: "Fragen Sie im Bedarfsfall einfach.", link: "/team" },
      },
      "kalibrier-und-kuehlbaeder": {
        title: "Kalibrier- und Kühlbäder (Vakuumtanks und Wasserbäder)",
        sections: [
          {
            content:
              "dienen zum Kalibrieren und Kühlen von Rohren aus thermoplastischen Kunststoffen mittels Sprühkühlung. Die Sprühkühlung verhindert das Ausbilden einer Wasser-Grenzschicht und besitzt damit eine wesentlich größere Kühleffizienz als die Tauchkühlung. Außerdem können keine Auftriebskräfte das Rohr deformieren. Alle Tanks können dennoch mit Tauchkühlung arbeiten.",
          },
          {
            content:
              "Als Kalibrierwerkzeuge sind Kalibrierhülsen oder Scheibenkalibrierungen erhältlich; zur Rohrunterstützung können Rollen, Kalibrierscheiben oder Kalibrierhalbschalen verwendet werden.",
          },
          {
            heading: "Extras:",
            items: [
              "Ein- oder Zweikammerausführung",
              "Antikorrosionsbeschichteter Stahl oder",
              "Rostfreier Stahl",
              "Höhenverstellung, Seitenverstellung",
              "Vielfältiges Zubehör erhältlich",
              "Sonderlängen problemlos möglich",
              "Von außen zentral einstellbare Stützrollen",
              "Große Auswahl unterschiedlicher Kalibrierwerkzeuge",
              "Verstellbare Kalibrierhülsen",
              "Deckel aus Aluminium oder Spezialglas",
            ],
          },
          {
            heading: "Klare Vorteile auf einen Blick:",
            items: [
              "Wassertemperatur über thermostatisch gesteuerte Frischwasserzufuhr geregelt. Daher niedriger Wasserverbrauch",
              "Niveauregulierung für gleich bleibenden Wasserstand",
              "Getrennte Vakuum- und Kühlkreisläufe",
              "Gute Kühleffektivität durch groß dimensionierte Pumpen und Leitungen",
              "Vollkegeldüsen für optimale Kühlleistung",
              "Durchflussmengenregler mit Schwimmeranzeige",
              "Gute Zugänglichkeit durch einfache Wegschwenkmöglichkeit",
              "Einfacher Filterwechsel durch Bypass System auch während der Produktion",
              "Längsverstellung auf Schienenbahn zur Stabilitätserhöhung",
              "Geräusch- und vibrationsarm durch Einsatz von Schwingungsdämpfern",
            ],
          },
        ],
      },
      abzuege: {
        title: "Rohrextrusion Abzüge",
        sections: [
          {
            heading: "Bandabzüge",
            content:
              "Bandabzüge werden zum kontinuierlichen Abziehen von Rohren und Profilen verwendet. Sie zeichnen sich durch einen besonders guten Gleichlauf, auch bei hohen Produktionsgeschwindigkeiten, aus. Der Antrieb der Bänder erfolgt über einen oder mehrere Servoantriebe. Die Bandträger können mechanisch oder pneumatisch in der Höhe verstellt werden. Die Bänder können mit einer Vielzahl verschiedener Beschichtungen geliefert werden.",
          },
          {
            heading: "Raupenabzüge",
            content:
              "Zweiraupenabzüge können je nach Stollenart für Rohre oder Profile eingesetzt werden. Mehrfachraupenabzüge werden zum Abziehen von Rohren verwendet. Die Verstellung der unteren Raupenträger geschieht mechanisch oder elektrisch. Die oberen Raupenträger sind pendelnd aufgehängt und werden pneumatisch zugestellt.",
          },
          {
            heading: "Extras",
            items: [
              "Präzisionsabzüge mit wartungsfreien AC-Servoantrieben",
              "Druckausgleichssteuerung für empfindliche Schläuche + Profile",
              "Periodische Wandverdickung für Rohre aus PVC",
              "Fernbedienung",
              "Abzugsbänder mit geschliffener V-Rille",
              "Poly-V-Bänder",
              "Elektronisches Längenmeßgerät",
              "Synchronisierung mit Prozeßrechner",
              "Angebaute Schneideinrichtungen",
              "Anfahrseilwinden",
            ],
          },
          {
            heading: "Klare Vorteile auf einen Blick",
            items: [
              "Robuste Bauweise",
              "Einfache Bedienung",
              "Leicht austauschbare Bänder",
              "Gute Zugänglichkeit",
              "Sicherheitsschutzschalter",
              "Leichtgängige Führungen",
              "Wartungsarme Antriebstechnik",
              "Digitale Geschwindigkeitsanzeigen",
              "Gleichlaufgenauigkeit +/- 0,01%",
              "Langlebige Direktantriebe (Einzelantriebe)",
              "Große Kontaktlängen",
              "Gute Übertragung der Abzugskräfte",
              "Schnellwechselsysteme für Abzugsstollen",
              "Gebaut nach den gängigen UVV und CE Normen",
            ],
          },
        ],
      },
      trenneinrichtungen: {
        title: "Rohrextrusion Trenneinrichtungen",
        sections: [
          {
            heading: "Trennsägen",
            content:
              "Pneumatisch betätigte Unterflursägen zum Trennen von Rohren und Profilen aus thermoplastischen Kunststoffen. Leichte Bedienbarkeit der Säge beim Anfahren der Extrusionslinie durch die Wegschwenkmöglichkeit der oberen Doppelklammerung. Durchmesserspezifische bzw. der Profilform angepasste Klemmbacken garantieren einen rechtwinkligen Schnitt.",
          },
          {
            heading: "Trenn- und Anfasmaschinen",
            content:
              "Maschinen zum Trennen und Anfasen von Kunststoffrohren durch rotierende Schneidwerkzeuge. Diese Schneideinrichtungen zeichnen sich durch geräuscharme und staubfreie Trennvorgänge aus. Durch eine spezielle Rohrzentralklammerung mit Schnellverstellung können sehr kurze Rüstzeiten erreicht werden.",
          },
          {
            heading: "Zusatzausrüstung",
            items: [
              "Spanloses Trennen mittels Schneidrolle",
              "Schlittenantrieb durch Servomotor für höchste Schnittgenauigkeit",
              "Diskontinuierlicher Vorschub zur Spanunterbrechung",
              "Innenanfasen",
              "Off-Line Magazinmaschine zur Konfektionierung von Kurzlängen",
              "Fliehkraftbetätigte Maschinen zum Trennen dünnwandiger Rohre",
            ],
          },
          {
            heading: "Präzisionstrennsägen",
            content:
              "Bei hohen Extrusionsgeschwindigkeiten, kurzen Schnittlängen und engen Schnittlängentoleranzen finden GRAEWE Präzisionstrennsägen ihren Einsatz. Hierbei wird der Sägeschlitten dem Extrudat über Servoantrieb weg- und geschwindigkeitssynchron nachgeführt. Extrem große Schnittwiederholgenauigkeiten können erreicht werden.",
          },
          {
            heading: "Cutter",
            content:
              "Pneumatisch oder hydraulisch betätigte Trennmesser zum spanlosen Trennen von Rohren oder Profilen.",
          },
          {
            heading: "Servocutter",
            content:
              "Fliegender, spanloser und gratfreier Schnitt über direkt auf Motorwelle angebrachter, rotierender Klinge.",
          },
          {
            heading: "Klare Vorteile auf einen Blick:",
            items: [
              "Hervorragende Schnittgenauigkeiten",
              "Geringer Energieverbrauch",
              "Geringes Geräuschniveau durch Einsatz spezieller Trennwerkzeuge und Kapselung der Maschinen",
              "Einfacher Werkzeugwechsel",
            ],
          },
          {
            heading: "Trennsägen und Planetensägen",
            items: [
              "Sauberer, präziser Schnitt",
              "Langlebige Sägeblätter",
              "Hocheffiziente Späneabsaugung",
            ],
          },
          {
            heading: "Trenn- und Fasmaschinen, Servocutter",
            items: [
              "Span- und gratfreier Schnitt",
              "Kurze Rüstzeiten durch Zentralklammerung",
              "Verschleißfreies System",
              "Hohe Schnittfrequenz",
            ],
          },
        ],
      },
      "vollautomatische-wickler": {
        title: "Rohrextrusion Wickler (vollautomatisch)",
        sections: [
          {
            heading: "Anwendungsbereiche",
            content:
              "Vollautomatische Doppelwickler finden Ihre Anwendung in Hochleistungsextrusionsanlagen mit hohen Extrusionsgeschwindigkeiten. Vollautomatische Einstellenwickler dagegen werden bei niedrigen bis mittleren Geschwindigkeitsbereichen oder in Umwickelanlagen eingesetzt. Durch die kompakte Bauweise unserer Wickler haben diese nur einen geringen Raumbedarf und sind somit leicht in jede Produktionslinie einzureihen. Gegenüber halbautomatischen Wicklern wird in der Regel eine Steigerung der Produktivität von über 50% erreicht.",
          },
          {
            heading: "Standardlösungen",
            content:
              "Es steht Ihnen ein umfangreiches Programm von Maschinen für die unterschiedlichsten Anwendungen zur Verfügung:",
            items: [
              "Automatische Wickler zum Umreifen der Ringbunde mit Bändern",
              "Automatische Wickler zum Einwickeln der Ringbunde in Folie",
              "Kombinationswickler Folie/Binden",
              "Wickler zum radialen Einwickeln der Bunde in Folie",
              "Automatische Wickler zum Verpacken der Ringbunde direkt in Kartonschachteln",
            ],
          },
          {
            heading: "Speziallösungen",
            content:
              "Spezielle Lösungen wurden z.B. entwickelt für: Tropferbewässerungsrohre, Gartenschläuche, medizinische Schläuche, Wellrohre, Aluminium-Verbundrohre und Profile.",
          },
          {
            heading: "Extras",
            items: [
              "Etikettiersysteme",
              "Vorrichtungen zum Abstapeln der Bunde auf Paletten",
              "Zentralverstellung des Kerndurchmessers und der Bundbreite",
              "Speichersysteme",
              "Ultraschalltänzer",
              "Längenmessgeräte",
            ],
          },
          {
            heading: "Klare Vorteile auf einen Blick:",
            items: [
              "Wartungsfreie Servomotoren",
              "Haspelarme in Durchmesser und Breite stufenlos verstellbar",
              "Exakte Verlegung über Kugelgewindespindel und Servomotor",
              "Automatische Übergabe des Produktes von einer Wickelstelle zur anderen ohne Zeitverlust (Doppelwickler)",
              "Automatisches Trennen des Extrudates",
              "Automatisches Abbinden des gewickelten Bundes, wahlweise 2/3/4/6 Abbindungen",
              "Lagenweises Abbinden möglich (Einstellenwickler)",
              "Automatisches Ausstoßen des fertigen Bundes",
              "Zentrale Bedienung durch Bedientableau mit LED Display und Menüführung",
              "Ausgabe von Hilfetexten und Fehlermeldungen im Klartext",
            ],
          },
        ],
      },
      "halbautomatische-wickler": {
        title: "Rohrextrusion Wickler",
        sections: [
          {
            content:
              "Ausgelegt für das präzise Aufwickeln von Kunststoffrohren, -schläuchen und -profilen. Die Haspelarme sind im Durchmesser und in der Breite entsprechend dem gewünschten Bundquerschnitt stufenlos verstellbar. Zum leichten Abnehmen des Bundes werden die vorderen Stege pneumatisch heruntergeklappt und gleichzeitig fällt der Kern ein. Der Antrieb erfolgt über einen Drehstrommotor, der wahlweise über eine Tänzersteuerung oder über Zugkraft geregelt werden kann. Die Verlegung ist mit der Drehzahl des Wickelantriebes synchronisiert und kann stufenlos verstellt werden.",
          },
          {
            heading: "Optionen",
            items: [
              "Sonderabmessungen der Haspelarme",
              "Rohrendenandrückvorrichtung",
              "Längenmessgeräte",
              "Ultraschalltänzer",
              "Speichertänzer",
              "Fahrrollen",
              "Präzisionsverlegung über Kugelgewindespindel und Servomotor",
              "Verstärkte Wickelantriebe",
              "Bedientableau mit Menüführung und Produktdatenverwaltung",
              "Integrierte Schneidvorrichtung",
            ],
          },
          {
            heading: "Klare Vorteile auf einen Blick:",
            items: [
              "Stabile Konstruktion",
              "Wartungsarme, langlebige Komponenten",
              "Kompakte Abmessungen",
              "Gleichmäßiges Wickelbild durch Einsatz neuester Antriebstechnologie",
              "Schutzabdeckungen",
              "Eine Vielzahl von Sonderausrüstungen ermöglichen es, diese Wickler an diverse Kundenanforderungen anzupassen.",
            ],
          },
        ],
      },
      muffenmaschinen: {
        title: "Rohrextrusion Muffenmaschinen",
        sections: [
          {
            content:
              "Dienen zur Herstellung von Rohrverbindungen. Es stehen verschiedene Typen für die unterschiedlichsten Anwendungen zur Verfügung",
          },
          {
            heading: "Muffensysteme:",
            items: [
              "Klebemuffen für Abwasserrohre",
              "Steckmuffen für Abwasserrohre mit Blasdorn",
              "Steckmuffen für Abwasserrohre mit Hartgummiringdorn",
              "Steckmuffen für Druckrohre mit Spreizdorn",
            ],
          },
          {
            content:
              "Reibschweißmaschinen zum Anbringen von Muffen im Reibschweißverfahren Muffenspritzgießmaschinen zum direkten Anspritzen von Muffen",
          },
          {
            heading: "Extras:",
            items: [
              "Vollautomatische und halbautomatische Maschinen",
              "Speicherprogrammierbare Steuerung mit Bedienpanel und Rezepturverwaltung",
            ],
          },
          {
            heading: "Klare Vorteile auf einen Blick:",
            items: [
              "Hohe Ausstoßleistung",
              "Einfache und sichere Bedienung",
              "Schneller Werkzeugwechsel",
              "Leichte Wartung und Instandhaltung",
              "Effektives Kühlsystem",
              "Optimierte Infrarotheizung",
            ],
          },
        ],
      },
      sondermaschinen: {
        title: "Rohrextrusion Sondermaschinen",
        sections: [
          {
            content:
              "Seit unserem Bestehen haben wir in Zusammenarbeit mit unseren Kunden eine Vielzahl von individuell angepassten Spezialmaschinen gefertigt.",
          },
          {
            content:
              "Fordern Sie uns, vielleicht ist Ihre Sondermaschine für uns bereits ein Standard.",
          },
          {
            heading: "Beispiele:",
            items: [
              "Kipprinnen, Ablegeinrichtungen, Rollenbahnen",
              "Rohrschlitzmaschinen",
              "Rohrendenbearbeitungsmaschinen",
              "Rohrwickler - Sondermaschinen Gewindeschneidmaschinen",
              "Rohrwender",
              "Palettier-, und Verpackungsmaschinen",
              "Mehrstrang-Extrusionsanlagen",
            ],
          },
        ],
      },
    },
    profilextrusion: {
      extruder: {
        title: "Profilextrusion Extruder",
        sections: [
          {
            content:
              "Fa. Graewe stellt selber keine Extruder und Extrusionswerkzeuge her, wir arbeiten jedoch mit zahlreichen namhaften Extruderherstellern eng zusammen, und können Ihnen somit auch komplette Fertigungsanlagen liefern. Über unser Tochterunternehmen next haben wir auch ständig perfekt überholte gebrauchte und neuwertige Extruder vorrätig.",
          },
        ],
        cta: { text: "Fragen Sie im Bedarfsfall einfach an.", link: "/team" },
      },
      kalibriertische: {
        title: "Profilextrusion Kalibriertische",
        sections: [
          {
            content:
              "Dienen zum Kalibrieren und Kühlen von Profilen aus Thermoplastischen Kunststoffen.",
          },
          {
            heading: "Extras:",
            items: [
              "Stabiles Untergestell mit Blechabdeckungen",
              "Rahmen aus galvanisch verzinktem Stahl oder rostfreiem Edelstahl",
              "Wasserauffangwanne aus Edelstahl",
              "Feinfühlige, spielarme Höhen-, Seiten- und Längsverstellung",
              "Vielfältiges Zubehör erhältlich",
              "Sämtliche Teile im Kontakt mit Wasser aus korrosionsfreien Materialien",
            ],
          },
          {
            heading: "Klare Vorteile auf einen Blick",
            items: [
              "Modulare Bauweise, Sonderlängen problemlos möglich",
              "Große Aufspannflächen",
              "Zahlreiche Wasser- und Vakuumanschlüsse",
              "Getrennte, feinfühlig einstellbare Vakuum- und Kühlkreisläufe",
              "Durchflussmengenregler mit Schwimmeranzeige",
              "Gute Zugänglichkeit zu den Pumpen",
              "Längsverstellung auf Schienenbahn zur Stabilitätserhöhung",
              "Geräusch- und vibrationsarm durch Einsatz von Schwingungsdämpfern",
            ],
          },
        ],
      },
      abzuege: {
        title: "Profilextrusion Abzüge",
        sections: [
          {
            heading: "Bandabzüge",
            content:
              "Bandabzüge werden zum kontinuierlichen Abziehen von Profilen verwendet. Sie zeichnen sich durch einen besonders guten Gleichlauf auch bei hohen Produktionsgeschwindigkeiten aus. Der Antrieb der Bänder erfolgt über einen oder mehrere Servoantriebe. Die Bandträger können mechanisch oder pneumatisch in der Höhe verstellt werden. Die Bänder können mit einer Vielzahl verschiedener Beschichtungen geliefert werden.",
          },
          {
            heading: "Raupenabzüge",
            content:
              "Zweiraupenabzüge können je nach Stollenart für unterschiedlichste Profile eingesetzt werden. Die Verstellung der unteren Raupenträger geschieht mechanisch oder elektrisch. Die oberen Raupenträger sind pendelnd aufgehängt und werden pneumatisch zugestellt.",
          },
          {
            heading: "Extras",
            items: [
              "Präzisionsabzüge mit wartungsfreien AC-Servoantrieben",
              "Druckausgleichssteuerung für empfindliche Profile",
              "Fernbedienung",
              "Abzugsbänder mit geschliffener Profilform",
              "Poly-V-Bänder",
              "Abzugsstollen in verschiedenen Breiten lieferbar",
              "Elektronisches Längenmessgerät",
              "Synchronisierung mit Prozessrechner",
              "Angebaute Schneideinrichtungen",
            ],
          },
          {
            heading: "Klare Vorteile auf einen Blick:",
            items: [
              "Robuste Bauweise",
              "Einfache Bedienung",
              "Leicht austauschbare Bänder",
              "Gute Zugänglichkeit",
              "Sicherheitsschutzschalter",
              "Leichtgängige Führungen",
              "Wartungsarme Antriebstechnik",
              "Digitale Geschwindigkeitsanzeigen",
              "Gleichlaufgenauigkeit +/- 0,01%",
              "Langlebige Direktantriebe (Einzelantriebe)",
              "Große Kontaktlängen",
              "Gute Übertragung der Abzugskräfte",
              "Schnellwechselsysteme für Abzugsstollen",
              "Gebaut nach den gängigen UVV und CE Normen",
            ],
          },
        ],
      },
      trenneinrichtungen: {
        title: "Profilextrusion Trenneinrichtungen",
        sections: [
          {
            heading: "Trennsägen",
            content:
              "Pneumatisch betätigte Unterflursägen zum Trennen von Profilen aus thermoplastischen Kunststoffen. Leichte Bedienbarkeit der Säge beim Anfahren der Extrusionslinie durch die Wegschwenkmöglichkeit der oberen Doppelklammerung. Die der Profilform angepassten Klemmbacken garantieren einen rechtwinkligen Schnitt.",
          },
          {
            heading: "Zusatzausrüstung",
            items: [
              "Schlittenantrieb durch Servomotor für höchste Schnittgenauigkeit",
              "Diskontinuierlicher Vorschub zur Spanunterbrechung",
              "Profilführungen",
              "Längenmessgeräte",
            ],
          },
          {
            heading: "Präzisionstrennsägen",
            content:
              "Bei hohen Extrusionsgeschwindigkeiten, kurzen Schnittlängen und engen Schnittlängentoleranzen finden GRAEWE Präzisionstrennsägen ihren Einsatz. Hierbei wird der Sägeschlitten dem Extrudat über Servoantrieb weg- und geschwindigkeitssynchron nachgeführt. Extrem große Schnittwiederholgenauigkeiten können erreicht werden.",
          },
          {
            heading: "Cutter",
            content:
              "Pneumatisch oder hydraulisch betätigte Trennmesser zum spanlosen Trennen von Profilen. Auch Kombinationen von Sägeschnitt und spanlosem Schnitt sind möglich.",
          },
          {
            heading: "Servocutter",
            content:
              "Fliegender, spanloser und gratfreier Schnitt über direkt auf Motorwelle angebrachter, rotierender Klinge.",
          },
          {
            heading: "Klare Vorteile auf einen Blick:",
            items: [
              "Hervorragende Schnittgenauigkeiten",
              "Geringer Energieverbrauch",
              "Geringes Geräuschniveau durch Einsatz spezieller Trennwerkzeuge und Kapselung der Maschinen",
              "Einfacher Werkzeugwechsel",
            ],
          },
          {
            heading: "Servocutter",
            items: [
              "Span- und gratfreier Schnitt",
              "Kurze Rüstzeiten durch Zentralklammerung",
              "Verschleißfreies System",
              "Hohe Schnittfrequenz",
            ],
          },
        ],
      },
      wickler: {
        title: "Profilextrusion Wickler",
        sections: [
          {
            content:
              "Entweder mit horizontaler oder vertikaler Wickelachse (Tellerwickler) oder als Spulen oder Trommelwickler ausgeführt, erlauben diese Maschinen ein zugspannungsfreies Wickeln unterschiedlichster Profile.",
          },
          {
            heading: "Optionen",
            items: [
              "Sonderabmessungen der Haspelarme",
              "Längenmessgerät",
              "Ultraschalltänzer",
              "Speichertänzer",
              "Klebebandabroller",
              "Fahrrollen",
              "Präzisionsverlegung über Kugelgewindespindel und Servomotor",
              "Bedientableau mit Menüführung und Produktdatenverwaltung",
              "Integrierte Schneidvorrichtung",
            ],
          },
          {
            heading: "Klare Vorteile auf einen Blick:",
            items: [
              "Stabile Konstruktion",
              "Wartungsarme, langlebige Komponenten",
              "Kompakte Abmessungen",
              "Gleichmäßiges Wickelbild durch Einsatz neuester Antriebstechnologie",
              "Schutzabdeckungen",
            ],
          },
          {
            content:
              "Eine Vielzahl von Sonderausrüstungen ermöglicht es, diese Wickler an die unterschiedlichsten Kundenanforderungen anzupassen.",
          },
        ],
      },
      sondermaschinen: {
        title: "Profilextrusion Sondermaschinen",
        sections: [
          {
            content:
              "Seit unserem Bestehen haben wir in Zusammenarbeit mit unseren Kunden eine Vielzahl von individuell angepassten Spezialmaschinen gefertigt.",
          },
          {
            content:
              "Fordern Sie uns, vielleicht ist Ihre Sondermaschine für uns bereits ein Standard.",
          },
          {
            heading: "Beispiele:",
            items: ["Guillotinen", "Stanzen", "Bohreinheiten", "Abwurftische"],
          },
          { content: "Und vieles mehr..." },
        ],
      },
    },
    plattenextrusion: {
      extruder: {
        title: "Plattenextrusion Extruder",
        sections: [
          {
            content:
              "Fa. Graewe stellt selber keine Extruder und Extrusionswerkzeuge her, wir arbeiten jedoch mit zahlreichen namhaften Extruderherstellern eng zusammen, und können Ihnen somit auch komplette Fertigungsanlagen liefern. Über unser Tochterunternehmen next haben wir auch ständig perfekt überholte gebrauchte und neuwertige Extruder vorrätig.",
          },
        ],
        cta: { text: "Fragen Sie im Bedarfsfall einfach an.", link: "/team" },
      },
      "laengstrenn-einrichtungen": {
        title: "Plattenextrusion Längstrenneinrichtungen",
        sections: [
          {
            heading: "Längstrennsägen für 2,3 oder 4 Nutzen",
            items: [
              "Drehzahlregelbare Antriebe",
              "Hydraulisch geregelter Vorschub",
              "Effektive Staubabsaugung",
              "Mitfahrende Absaughauben",
            ],
          },
          {
            heading: "Längstrennfräsen",
            items: [
              "zum Trennen von Platten großer Stärke mit Hochgeschwindigkeits-Fingerfräsern",
              "Hervorragende Schnittqualität",
              "Kein Verkleben der Späne mehr",
              "Effektive Späneabsaugung",
            ],
          },
          {
            heading: "Längstrennmesser für Plattendicken bis 15 mm (Klingenschnitt)",
            items: [
              "Schnelle Formatumstellung",
              "Während der Produktion auswechselbar",
              "Angetriebene Rollenmesser für spanlosen Schnitt",
              "Vielfältig verstellbare Schnittgeometrie",
            ],
          },
        ],
      },
      "quertrenn-einrichtungen": {
        title: "Plattenextrusion Quertrenneinrichtungen",
        sections: [
          {
            heading: "Schlagscheren feststehend oder mitfahrend",
            items: [
              "Mit integrierten Förderbändern",
              "Spanlose Schnitte",
              "Hohe Taktfrequenz",
            ],
          },
          {
            content:
              "Schwenkende Schlagscheren um Trapezförmige Platten zu produzieren",
          },
          {
            heading: "Kombinationen aus Schlagschere mit angebauter Quertrennsäge",
            items: ["Größtmögliche Flexibilität"],
          },
          {
            heading: "Quertrennsägen für Plattenbreiten bis 3000 mm und 40 mm Stärke",
            items: [
              "Drehzahlregelbare Antriebe zum Einstellen der optimalen Schnittgeschwindigkeit",
              "Exakte Verstellung der Schnittwinkligkeit",
              "Effektive Staubabsaugung",
              "Produktschonende Klemmbalken",
              "Exakte Schnittlängentoleranz +/- 0,5mm",
              "Produktparameter speicherbar",
              "Ineinandergreifende Rollenfinger unterstützen das Produkt auf der ganzen Länge",
              "Alternativ Rollenketten oder angetriebene Teleskopförderbänder zur Unterstützung",
              "Probeschnittlängen",
              "Sägeblatt mit Intensivkühlung durch Luft oder Kühlflüssigkeit",
              "Schutzgitter",
            ],
          },
          {
            heading: "Quertrennfräsen für Plattenstärken bis 60 mm",
            items: [
              "Zum Trennen von Platten großer Stärke mit Hochgeschwindigkeits-Fingerfräsern",
              "Hervorragende Schnittqualität",
              "Kein Verkleben der Späne mehr",
              "Effektive Späneabsaugung",
            ],
          },
        ],
      },
      plattenstapler: {
        title: "Plattenextrusion Plattenstapler",
        sections: [
          { content: "Automatische Saugplattenstapler" },
          {
            heading: "Zum genauen Abstapeln von Kunststoffplatten",
            items: [
              "Einfach oder mehrfach stapeln",
              "Schonender Plattentransport",
              "Pulkbildung oder Mittelschnitt",
              "Seitliche Ausrichtung, Längsausrichtsysteme",
              "Kantengenaues Stapeln",
              "Kurze Taktzeiten",
              "Präzise und schnell",
              "Seitlich oder in Extrusionsrichtung",
              "Wahlweise mit Z-Achse zum Stapeln auf Paletten oder direkt auf Scherenhubtische",
            ],
          },
          {
            content: "Fördersysteme für automatischen Palettenwechsel.",
          },
        ],
      },
      sondermaschinen: {
        title: "Plattenextrusion Sondermaschinen",
        sections: [
          {
            content:
              "Seit unserem Bestehen haben wir in Zusammenarbeit mit unseren Kunden eine Vielzahl von individuell angepassten Spezialmaschinen für die Plattenextrusion gefertigt.",
          },
          {
            content:
              "Fordern Sie uns, vielleicht ist Ihre Sondermaschine für uns bereits ein Standard.",
          },
          {
            heading: "Beispiele:",
            items: [
              "Ablegeinrichtungen",
              "Rollenbahnen",
              "Staubogentische",
              "Palettenförderer",
            ],
          },
        ],
      },
    },
  },
  en: {
    rohrextrusion: {
      extruder: {
        title: "Pipe Extrusion Extruder",
        sections: [
          {
            content:
              "Graewe does not manufacture extruders and extrusion tools itself, but we work closely with numerous renowned extruder manufacturers, and can therefore also supply you with complete production lines. Through our subsidiary next, we also constantly have perfectly overhauled used and as-new extruders in stock.",
          },
        ],
        cta: { text: "Simply ask us if needed.", link: "/team" },
      },
      "kalibrier-und-kuehlbaeder": {
        title: "Calibration & Cooling Baths (Vacuum Tanks and Water Baths)",
        sections: [
          {
            content:
              "Used for calibrating and cooling pipes made of thermoplastic materials by means of spray cooling. Spray cooling prevents the formation of a water boundary layer and thus has a significantly greater cooling efficiency than immersion cooling. In addition, no buoyancy forces can deform the pipe. All tanks can nevertheless work with immersion cooling.",
          },
          {
            content:
              "Calibration sleeves or disc calibrations are available as calibration tools; rollers, calibration discs or calibration half-shells can be used for pipe support.",
          },
          {
            heading: "Extras:",
            items: [
              "Single or double chamber design",
              "Anti-corrosion coated steel or",
              "Stainless steel",
              "Height adjustment, lateral adjustment",
              "Diverse accessories available",
              "Special lengths easily possible",
              "Externally centrally adjustable support rollers",
              "Wide selection of different calibration tools",
              "Adjustable calibration sleeves",
              "Covers made of aluminum or special glass",
            ],
          },
          {
            heading: "Clear advantages at a glance:",
            items: [
              "Water temperature regulated via thermostatically controlled fresh water supply. Therefore low water consumption",
              "Level regulation for constant water level",
              "Separate vacuum and cooling circuits",
              "Good cooling effectiveness through large-sized pumps and pipes",
              "Full cone nozzles for optimal cooling performance",
              "Flow rate controller with float indicator",
              "Good accessibility through simple swing-away possibility",
              "Easy filter change through bypass system even during production",
              "Longitudinal adjustment on rail track for increased stability",
              "Low noise and vibration through use of vibration dampers",
            ],
          },
        ],
      },
      abzuege: {
        title: "Pipe Extrusion Haul-offs",
        sections: [
          {
            heading: "Belt haul-offs",
            content:
              "Belt haul-offs are used for the continuous pulling of pipes and profiles. They are characterized by particularly good synchronization, even at high production speeds. The belts are driven by one or more servo drives. The belt carriers can be adjusted mechanically or pneumatically in height. The belts can be supplied with a variety of different coatings.",
          },
          {
            heading: "Caterpillar haul-offs",
            content:
              "Two-caterpillar haul-offs can be used for pipes or profiles depending on the cleat type. Multi-caterpillar haul-offs are used for pulling pipes. The lower caterpillar carriers are adjusted mechanically or electrically. The upper caterpillar carriers are pendulum-mounted and are pneumatically fed.",
          },
          {
            heading: "Extras",
            items: [
              "Precision haul-offs with maintenance-free AC servo drives",
              "Pressure equalization control for sensitive tubes + profiles",
              "Periodic wall thickening for PVC pipes",
              "Remote control",
              "Haul-off belts with ground V-groove",
              "Poly-V belts",
              "Electronic length measuring device",
              "Synchronization with process computer",
              "Attached cutting devices",
              "Start-up cable winches",
            ],
          },
          {
            heading: "Clear advantages at a glance",
            items: [
              "Robust construction",
              "Easy operation",
              "Easily exchangeable belts",
              "Good accessibility",
              "Safety protection switches",
              "Smooth-running guides",
              "Low-maintenance drive technology",
              "Digital speed displays",
              "Synchronization accuracy +/- 0.01%",
              "Long-lasting direct drives (individual drives)",
              "Large contact lengths",
              "Good transmission of haul-off forces",
              "Quick-change systems for haul-off cleats",
              "Built according to current UVV and CE standards",
            ],
          },
        ],
      },
      trenneinrichtungen: {
        title: "Pipe Extrusion Cutting Devices",
        sections: [
          {
            heading: "Cut-off saws",
            content:
              "Pneumatically operated underfloor saws for cutting pipes and profiles made of thermoplastic materials. Easy operability of the saw when starting the extrusion line through the swing-away option of the upper double clamp. Diameter-specific or profile-adapted clamping jaws guarantee a right-angled cut.",
          },
          {
            heading: "Cutting and chamfering machines",
            content:
              "Machines for cutting and chamfering plastic pipes using rotating cutting tools. These cutting devices are characterized by low-noise and dust-free cutting processes. Very short setup times can be achieved through a special pipe central clamping with quick adjustment.",
          },
          {
            heading: "Additional equipment",
            items: [
              "Chipless cutting using cutting roller",
              "Carriage drive by servo motor for highest cutting accuracy",
              "Discontinuous feed for chip interruption",
              "Internal chamfering",
              "Off-line magazine machine for short-length processing",
              "Centrifugally operated machines for cutting thin-walled pipes",
            ],
          },
          {
            heading: "Precision cut-off saws",
            content:
              "GRAEWE precision cut-off saws are used at high extrusion speeds, short cutting lengths, and tight cutting length tolerances. The saw carriage is tracked path- and speed-synchronously to the extrudate via servo drive. Extremely high cutting repeatability can be achieved.",
          },
          { heading: "Cutter", content: "Pneumatically or hydraulically operated cutting knives for chipless cutting of pipes or profiles." },
          { heading: "Servo cutter", content: "Flying, chipless and burr-free cut via rotating blade mounted directly on the motor shaft." },
          {
            heading: "Clear advantages at a glance:",
            items: [
              "Outstanding cutting accuracies",
              "Low energy consumption",
              "Low noise level through use of special cutting tools and machine encapsulation",
              "Easy tool change",
            ],
          },
          {
            heading: "Cut-off saws and planetary saws",
            items: ["Clean, precise cut", "Long-lasting saw blades", "Highly efficient chip extraction"],
          },
          {
            heading: "Cutting and chamfering machines, servo cutter",
            items: ["Chipless and burr-free cut", "Short setup times through central clamping", "Wear-free system", "High cutting frequency"],
          },
        ],
      },
      "vollautomatische-wickler": {
        title: "Pipe Extrusion Winders (fully automatic)",
        sections: [
          {
            heading: "Application areas",
            content:
              "Fully automatic double winders find their application in high-performance extrusion lines with high extrusion speeds. Fully automatic single-station winders are used at low to medium speed ranges or in rewinding systems. Due to the compact design of our winders, they require only a small footprint and can easily be integrated into any production line. Compared to semi-automatic winders, a productivity increase of over 50% is typically achieved.",
          },
          {
            heading: "Standard solutions",
            content: "A comprehensive range of machines for the most diverse applications is available:",
            items: [
              "Automatic winders for strapping ring coils with bands",
              "Automatic winders for wrapping ring coils in film",
              "Combination winders film/strapping",
              "Winders for radially wrapping coils in film",
              "Automatic winders for packaging ring coils directly in cardboard boxes",
            ],
          },
          {
            heading: "Special solutions",
            content:
              "Special solutions have been developed for: drip irrigation pipes, garden hoses, medical tubes, corrugated pipes, aluminum composite pipes and profiles.",
          },
          {
            heading: "Extras",
            items: [
              "Labeling systems",
              "Devices for stacking coils on pallets",
              "Central adjustment of core diameter and coil width",
              "Storage systems",
              "Ultrasonic dancers",
              "Length measuring devices",
            ],
          },
          {
            heading: "Clear advantages at a glance:",
            items: [
              "Maintenance-free servo motors",
              "Reel arms infinitely adjustable in diameter and width",
              "Precise laying via ball screw spindle and servo motor",
              "Automatic transfer of product from one winding station to another without time loss (double winder)",
              "Automatic cutting of the extrudate",
              "Automatic strapping of the wound coil, optionally 2/3/4/6 strappings",
              "Layer-by-layer strapping possible (single-station winder)",
              "Automatic ejection of the finished coil",
              "Central operation via control panel with LED display and menu guidance",
              "Output of help texts and error messages in plain text",
            ],
          },
        ],
      },
      "halbautomatische-wickler": {
        title: "Pipe Extrusion Winders",
        sections: [
          {
            content:
              "Designed for the precise winding of plastic pipes, tubes and profiles. The reel arms are infinitely adjustable in diameter and width according to the desired coil cross-section. For easy removal of the coil, the front bars are pneumatically folded down and simultaneously the core collapses. The drive is via a three-phase motor, which can optionally be controlled via a dancer control or via tensile force. The laying is synchronized with the speed of the winding drive and can be infinitely adjusted.",
          },
          {
            heading: "Options",
            items: [
              "Special dimensions of the reel arms",
              "Pipe end pressing device",
              "Length measuring devices",
              "Ultrasonic dancers",
              "Storage dancers",
              "Travel wheels",
              "Precision laying via ball screw spindle and servo motor",
              "Reinforced winding drives",
              "Control panel with menu guidance and product data management",
              "Integrated cutting device",
            ],
          },
          {
            heading: "Clear advantages at a glance:",
            items: [
              "Stable construction",
              "Low-maintenance, long-lasting components",
              "Compact dimensions",
              "Even winding pattern through use of latest drive technology",
              "Protective covers",
              "A wide range of special equipment enables these winders to be adapted to various customer requirements.",
            ],
          },
        ],
      },
      muffenmaschinen: {
        title: "Pipe Extrusion Socket Machines",
        sections: [
          { content: "Used for the production of pipe connections. Various types are available for the most diverse applications." },
          {
            heading: "Socket systems:",
            items: [
              "Glue sockets for sewage pipes",
              "Push-fit sockets for sewage pipes with blow mandrel",
              "Push-fit sockets for sewage pipes with hard rubber ring mandrel",
              "Push-fit sockets for pressure pipes with expanding mandrel",
            ],
          },
          { content: "Friction welding machines for attaching sockets using the friction welding process. Socket injection molding machines for directly molding sockets." },
          {
            heading: "Extras:",
            items: [
              "Fully automatic and semi-automatic machines",
              "Programmable logic controller with operating panel and recipe management",
            ],
          },
          {
            heading: "Clear advantages at a glance:",
            items: [
              "High output performance",
              "Simple and safe operation",
              "Quick tool change",
              "Easy maintenance and servicing",
              "Effective cooling system",
              "Optimized infrared heating",
            ],
          },
        ],
      },
      sondermaschinen: {
        title: "Pipe Extrusion Special Machines",
        sections: [
          { content: "Since our founding, we have manufactured a wide variety of individually adapted special machines in collaboration with our customers." },
          { content: "Challenge us — perhaps your special machine is already standard for us." },
          {
            heading: "Examples:",
            items: [
              "Tipping troughs, depositing devices, roller conveyors",
              "Pipe slitting machines",
              "Pipe end processing machines",
              "Pipe winders - special machines, thread cutting machines",
              "Pipe turners",
              "Palletizing and packaging machines",
              "Multi-strand extrusion lines",
            ],
          },
        ],
      },
    },
    profilextrusion: {
      extruder: {
        title: "Profile Extrusion Extruder",
        sections: [
          {
            content:
              "Graewe does not manufacture extruders and extrusion tools itself, but we work closely with numerous renowned extruder manufacturers, and can therefore also supply you with complete production lines. Through our subsidiary next, we also constantly have perfectly overhauled used and as-new extruders in stock.",
          },
        ],
        cta: { text: "Simply ask us if needed.", link: "/team" },
      },
      kalibriertische: {
        title: "Profile Extrusion Calibration Tables",
        sections: [
          { content: "Used for calibrating and cooling profiles made of thermoplastic materials." },
          {
            heading: "Extras:",
            items: [
              "Stable subframe with sheet metal covers",
              "Frame made of galvanically zinc-plated steel or stainless steel",
              "Stainless steel water collecting tray",
              "Sensitive, low-backlash height, lateral and longitudinal adjustment",
              "Diverse accessories available",
              "All parts in contact with water made of corrosion-free materials",
            ],
          },
          {
            heading: "Clear advantages at a glance",
            items: [
              "Modular construction, special lengths easily possible",
              "Large clamping surfaces",
              "Numerous water and vacuum connections",
              "Separate, sensitively adjustable vacuum and cooling circuits",
              "Flow rate controller with float indicator",
              "Good accessibility to the pumps",
              "Longitudinal adjustment on rail track for increased stability",
              "Low noise and vibration through use of vibration dampers",
            ],
          },
        ],
      },
      abzuege: {
        title: "Profile Extrusion Haul-offs",
        sections: [
          {
            heading: "Belt haul-offs",
            content:
              "Belt haul-offs are used for the continuous pulling of profiles. They are characterized by particularly good synchronization even at high production speeds. The belts are driven by one or more servo drives. The belt carriers can be adjusted mechanically or pneumatically in height. The belts can be supplied with a variety of different coatings.",
          },
          {
            heading: "Caterpillar haul-offs",
            content:
              "Two-caterpillar haul-offs can be used for the most diverse profiles depending on the cleat type. The lower caterpillar carriers are adjusted mechanically or electrically. The upper caterpillar carriers are pendulum-mounted and are pneumatically fed.",
          },
          {
            heading: "Extras",
            items: [
              "Precision haul-offs with maintenance-free AC servo drives",
              "Pressure equalization control for sensitive profiles",
              "Remote control",
              "Haul-off belts with ground profile shape",
              "Poly-V belts",
              "Haul-off cleats available in various widths",
              "Electronic length measuring device",
              "Synchronization with process computer",
              "Attached cutting devices",
            ],
          },
          {
            heading: "Clear advantages at a glance:",
            items: [
              "Robust construction",
              "Easy operation",
              "Easily exchangeable belts",
              "Good accessibility",
              "Safety protection switches",
              "Smooth-running guides",
              "Low-maintenance drive technology",
              "Digital speed displays",
              "Synchronization accuracy +/- 0.01%",
              "Long-lasting direct drives (individual drives)",
              "Large contact lengths",
              "Good transmission of haul-off forces",
              "Quick-change systems for haul-off cleats",
              "Built according to current UVV and CE standards",
            ],
          },
        ],
      },
      trenneinrichtungen: {
        title: "Profile Extrusion Cutting Devices",
        sections: [
          {
            heading: "Cut-off saws",
            content:
              "Pneumatically operated underfloor saws for cutting profiles made of thermoplastic materials. Easy operability of the saw when starting the extrusion line through the swing-away option of the upper double clamp. Profile-adapted clamping jaws guarantee a right-angled cut.",
          },
          {
            heading: "Additional equipment",
            items: [
              "Carriage drive by servo motor for highest cutting accuracy",
              "Discontinuous feed for chip interruption",
              "Profile guides",
              "Length measuring devices",
            ],
          },
          {
            heading: "Precision cut-off saws",
            content:
              "GRAEWE precision cut-off saws are used at high extrusion speeds, short cutting lengths, and tight cutting length tolerances. The saw carriage is tracked path- and speed-synchronously to the extrudate via servo drive. Extremely high cutting repeatability can be achieved.",
          },
          { heading: "Cutter", content: "Pneumatically or hydraulically operated cutting knives for chipless cutting of profiles. Combinations of saw cut and chipless cut are also possible." },
          { heading: "Servo cutter", content: "Flying, chipless and burr-free cut via rotating blade mounted directly on the motor shaft." },
          {
            heading: "Clear advantages at a glance:",
            items: ["Outstanding cutting accuracies", "Low energy consumption", "Low noise level through use of special cutting tools and machine encapsulation", "Easy tool change"],
          },
          {
            heading: "Servo cutter",
            items: ["Chipless and burr-free cut", "Short setup times through central clamping", "Wear-free system", "High cutting frequency"],
          },
        ],
      },
      wickler: {
        title: "Profile Extrusion Winders",
        sections: [
          {
            content:
              "Either with horizontal or vertical winding axis (plate winder) or as spool or drum winders, these machines allow tension-free winding of the most diverse profiles.",
          },
          {
            heading: "Options",
            items: [
              "Special dimensions of the reel arms",
              "Length measuring device",
              "Ultrasonic dancers",
              "Storage dancers",
              "Adhesive tape dispensers",
              "Travel wheels",
              "Precision laying via ball screw spindle and servo motor",
              "Control panel with menu guidance and product data management",
              "Integrated cutting device",
            ],
          },
          {
            heading: "Clear advantages at a glance:",
            items: [
              "Stable construction",
              "Low-maintenance, long-lasting components",
              "Compact dimensions",
              "Even winding pattern through use of latest drive technology",
              "Protective covers",
            ],
          },
          { content: "A wide range of special equipment enables these winders to be adapted to the most diverse customer requirements." },
        ],
      },
      sondermaschinen: {
        title: "Profile Extrusion Special Machines",
        sections: [
          { content: "Since our founding, we have manufactured a wide variety of individually adapted special machines in collaboration with our customers." },
          { content: "Challenge us — perhaps your special machine is already standard for us." },
          { heading: "Examples:", items: ["Guillotines", "Punches", "Drilling units", "Drop tables"] },
          { content: "And much more..." },
        ],
      },
    },
    plattenextrusion: {
      extruder: {
        title: "Sheet Extrusion Extruder",
        sections: [
          {
            content:
              "Graewe does not manufacture extruders and extrusion tools itself, but we work closely with numerous renowned extruder manufacturers, and can therefore also supply you with complete production lines. Through our subsidiary next, we also constantly have perfectly overhauled used and as-new extruders in stock.",
          },
        ],
        cta: { text: "Simply ask us if needed.", link: "/team" },
      },
      "laengstrenn-einrichtungen": {
        title: "Sheet Extrusion Longitudinal Cutting",
        sections: [
          {
            heading: "Longitudinal cutting saws for 2, 3 or 4 cuts",
            items: ["Speed-controlled drives", "Hydraulically controlled feed", "Effective dust extraction", "Traveling extraction hoods"],
          },
          {
            heading: "Longitudinal cutting mills",
            items: [
              "For cutting sheets of great thickness with high-speed finger cutters",
              "Outstanding cut quality",
              "No more sticking of chips",
              "Effective chip extraction",
            ],
          },
          {
            heading: "Longitudinal cutting knives for sheet thicknesses up to 15 mm (blade cutting)",
            items: [
              "Quick format changeover",
              "Exchangeable during production",
              "Driven rotary knives for chipless cutting",
              "Versatilely adjustable cutting geometry",
            ],
          },
        ],
      },
      "quertrenn-einrichtungen": {
        title: "Sheet Extrusion Cross-Cutting",
        sections: [
          {
            heading: "Shear cutters, stationary or traveling",
            items: ["With integrated conveyor belts", "Chipless cuts", "High cycle frequency"],
          },
          { content: "Swiveling shear cutters to produce trapezoidal sheets" },
          { heading: "Combinations of shear cutter with attached cross-cut saw", items: ["Maximum flexibility"] },
          {
            heading: "Cross-cut saws for sheet widths up to 3000 mm and 40 mm thickness",
            items: [
              "Speed-controlled drives for setting the optimal cutting speed",
              "Precise adjustment of cut squareness",
              "Effective dust extraction",
              "Product-friendly clamping bars",
              "Precise cutting length tolerance +/- 0.5mm",
              "Product parameters storable",
              "Interlocking roller fingers support the product along the entire length",
              "Alternatively roller chains or driven telescopic conveyor belts for support",
              "Trial cutting lengths",
              "Saw blade with intensive cooling by air or coolant",
              "Protective guards",
            ],
          },
          {
            heading: "Cross-cutting mills for sheet thicknesses up to 60 mm",
            items: [
              "For cutting sheets of great thickness with high-speed finger cutters",
              "Outstanding cut quality",
              "No more sticking of chips",
              "Effective chip extraction",
            ],
          },
        ],
      },
      plattenstapler: {
        title: "Sheet Extrusion Sheet Stackers",
        sections: [
          { content: "Automatic suction sheet stackers" },
          {
            heading: "For precise stacking of plastic sheets",
            items: [
              "Single or multiple stacking",
              "Gentle sheet transport",
              "Bulk formation or center cut",
              "Lateral alignment, longitudinal alignment systems",
              "Edge-precise stacking",
              "Short cycle times",
              "Precise and fast",
              "Laterally or in extrusion direction",
              "Optionally with Z-axis for stacking on pallets or directly on scissor lift tables",
            ],
          },
          { content: "Conveyor systems for automatic pallet change." },
        ],
      },
      sondermaschinen: {
        title: "Sheet Extrusion Special Machines",
        sections: [
          { content: "Since our founding, we have manufactured a wide variety of individually adapted special machines for sheet extrusion in collaboration with our customers." },
          { content: "Challenge us — perhaps your special machine is already standard for us." },
          { heading: "Examples:", items: ["Depositing devices", "Roller conveyors", "Dust arc tables", "Pallet conveyors"] },
        ],
      },
    },
  },
};

export function getProductDetail(
  locale: string,
  category: ProductCategory,
  slug: string,
): ProductDetail | undefined {
  const lang = locale in content ? locale : "de";
  return content[lang]?.[category]?.[slug];
}

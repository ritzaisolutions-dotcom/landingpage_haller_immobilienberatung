export const LAST_UPDATED = "18. Juni 2026";

export const HALLER_MAIN_DATENSCHUTZ_URL =
  "https://haller-immobilien.de/datenschutzerklaerung/";

export const VERANTWORTLICHER = {
  firma: "Haller Immobilienberatung GmbH",
  adresse: "Kirchberg 42",
  plzOrt: "56626 Andernach",
  telefon: "02632 9458-0",
  email: "info@haller-immobilien.de",
  website: "https://haller-immobilien.de",
};

export type DatenschutzSection = {
  id: string;
  title: string;
  paragraphs: string[];
  listItems?: string[];
  paragraphsAfter?: string[];
};

export const DATENSCHUTZ_PORTAL_SECTIONS: DatenschutzSection[] = [
  {
    id: "geltungsbereich",
    title: "Geltungsbereich",
    paragraphs: [
      "Diese Datenschutzerklärung gilt ausschließlich für das Online-Selbstauskunft-Portal der Haller Immobilienberatung GmbH (nachfolgend auch „Portal“), über das Miet- und Kaufinteressenten im Rahmen einer bestehenden Anfrage ihre Selbstauskunft digital ausfüllen können.",
      "Erfasst sind insbesondere die personalisierte Selbstauskunft-Seite unter der Route /auskunft (Zugang über einen individuellen Link mit Token-Parameter), die Server-Aktion zur Übermittlung der Angaben sowie die vorliegende Datenschutzseite unter /datenschutz. Die Legacy-Route /upload leitet auf /auskunft weiter.",
      "Nicht Gegenstand dieser Erklärung sind die allgemeine Unternehmenswebsite unter haller-immobilien.de (einschließlich Kontaktformulare, Immobilienangebote und Marketing-Inhalte) sowie die separate Demo-Marketingseite unter /. Für diese Bereiche gelten die jeweiligen Datenschutzhinweise der Hauptwebsite.",
      "Sofern Sie das Portal im Demo-Modus nutzen (z. B. /auskunft?t=demo-lp2-token-haller-2026), werden keine echten personenbezogenen Daten an eine Produktiv-Datenbank übermittelt. Details hierzu finden Sie in Abschnitt 22.",
    ],
  },
  {
    id: "verantwortlicher",
    title: "Verantwortlicher",
    paragraphs: [
      "Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO für die im Portal stattfindende Verarbeitung personenbezogener Daten ist:",
    ],
    listItems: [
      `${VERANTWORTLICHER.firma}`,
      `${VERANTWORTLICHER.adresse}`,
      `${VERANTWORTLICHER.plzOrt}`,
      `Telefon: ${VERANTWORTLICHER.telefon}`,
      `E-Mail: ${VERANTWORTLICHER.email}`,
      `Website: ${VERANTWORTLICHER.website}`,
    ],
  },
  {
    id: "datenschutzbeauftragter",
    title: "Datenschutzbeauftragter",
    paragraphs: [
      "Der Haller Immobilienberatung GmbH ist derzeit kein Datenschutzbeauftragter bestellt. Sollte sich dies ändern, werden die Kontaktdaten hier ergänzt.",
      "Bei datenschutzrechtlichen Anfragen zum Bewerbungsportal wenden Sie sich bitte direkt an den Verantwortlichen unter den in Abschnitt 2 genannten Kontaktdaten.",
    ],
  },
  {
    id: "ueberblick",
    title: "Überblick der Verarbeitungsvorgänge",
    paragraphs: [
      "Im Zusammenhang mit dem Bewerbungsportal finden insbesondere folgende Verarbeitungsvorgänge statt:",
    ],
    listItems: [
      "Erfassung und Speicherung Ihrer Anfrage aus ImmoScout24 (Workflow WF1 über n8n) in der Datenbank",
      "Bereitstellung einer personalisierten Portal-Seite mit Ihrem Vornamen und Bezug zum Inserat",
      "Ausfüllen der digitalen Selbstauskunft über das mehrstufige Formular unter /auskunft",
      "Speicherung Ihrer Selbstauskunft-Angaben in der Datenbank",
      "Automatisierte Auswertung der Angaben mittels KI (Workflow WF2, Mistral API über n8n), sofern aktiviert",
      "Weiterverarbeitung im Besichtigungs- und Terminprozess (Workflows WF3–WF5, sofern Ihre Anfrage fortgeführt wird)",
      "Automatische Löschung nach Ablauf der Speicherfrist (Workflow WF7)",
      "Technische Protokollierung bei Hosting und Server-Aktionen",
    ],
  },
  {
    id: "herkunft",
    title: "Herkunft der Daten",
    paragraphs: [
      "Ihre Stammdaten (Name, E-Mail-Adresse, Telefonnummer, Bezug zum Inserat, Inhalt Ihrer ursprünglichen Nachricht) stammen aus Ihrer Anfrage über ImmoScout24. Diese Daten werden über einen automatisierten Workflow (n8n, WF1) in unserer Datenbank erfasst, bevor Ihnen der persönliche Portal-Link zugesandt wird.",
      "Zusätzlich verarbeiten wir die Daten, die Sie im Selbstauskunft-Formular selbst eingeben: aktualisierte Kontaktdaten, aktuelle Anschrift, Angaben zu Beruf, Einkommen, Haushalt und weiteren für die Miet- oder Kaufentscheidung relevanten Informationen — ausschließlich auf Selbstauskunft, ohne Upload von Unterlagen.",
      "Metadaten zu Ihren Einwilligungen (Zeitpunkt der Bestätigung per Checkbox, Speicherung der Felder dsgvo_accepted und angaben_wahrheitsgemaess) werden beim Absenden des Formulars gespeichert.",
      "Technische Verbindungsdaten (z. B. IP-Adresse, Browsertyp) entstehen automatisch beim Aufruf des Portals und der API-Schnittstellen.",
    ],
  },
  {
    id: "kategorien",
    title: "Kategorien personenbezogener Daten",
    paragraphs: ["Im Portal werden insbesondere folgende Kategorien personenbezogener Daten verarbeitet:"],
    listItems: [
      "Stammdaten: Name, E-Mail-Adresse, Telefonnummer, aktuelle Anschrift",
      "Anfragebezogene Daten: ImmoScout24-Inserat-ID (inserat_id), Kontakt-ID bei ImmoScout24 (is24_contact_id), Text Ihrer ursprünglichen Nachricht (nachricht_text), Status der Bearbeitung",
      "Selbstauskunft: Beschäftigungsstatus, Arbeitgeber, Nettoeinkommen, Haushaltsgröße, Haustiere, Einzugstermin, Angaben zu Insolvenz- und Räumungstiteln sowie freie Textfelder",
      "Bei Kaufobjekten: Kaufbudget, Eigenkapital, Finanzierung, Kaufzeitraum und Kaufgrund",
      "Ergebnis der automatisierten Auswertung: Bewertungsscore (mistral_score), Begründung und Risiken, sofern WF4 aktiv ist",
      "Einwilligungsdaten: Datenschutz-Checkbox (dsgvo_accepted, dsgvo_accepted_at) und Wahrheitsbestätigung (angaben_wahrheitsgemaess, angaben_wahrheitsgemaess_at)",
      "Zugangsdaten: individueller LP2-Token in der URL, Zeitpunkt der Selbstauskunft-Anforderung",
      "Technische Daten: IP-Adresse, User-Agent, Zeitstempel der Server-Anfragen",
    ],
  },
  {
    id: "besondere-kategorien",
    title: "Besondere Kategorien personenbezogener Daten (Art. 9 DSGVO)",
    paragraphs: [
      "Ihre Angaben zur wirtschaftlichen Lage (z. B. Nettoeinkommen, Insolvenzverfahren) können Rückschlüsse auf Ihre Bonität zulassen. Die Verarbeitung erfolgt auf Grundlage des vorvertraglichen Verhältnisses bzw. Ihrer Einwilligung zur Datenverarbeitung und Wahrheitsbestätigung beim Absenden des Formulars.",
      "Es werden keine SCHUFA-Auskünfte, Gehaltsnachweise oder andere Dokumente im Portal hochgeladen.",
    ],
  },
  {
    id: "zwecke",
    title: "Zwecke der Verarbeitung",
    paragraphs: ["Ihre Daten werden zu folgenden Zwecken verarbeitet:"],
    listItems: [
      "Bearbeitung und Qualifizierung Ihrer Mietanfrage zu einem konkreten Mietobjekt",
      "Prüfung der vollständigen Selbstauskunft-Angaben im Rahmen der Miet- oder Kaufentscheidung",
      "Unterstützung der Mitarbeitenden der Haller Immobilienberatung GmbH bei der Vorauswahl geeigneter Mietinteressenten",
      "Organisation von Besichtigungsterminen und weiterer Kommunikation im Bewerbungsprozess (sofern Ihre Anfrage fortgeführt wird)",
      "Nachweis Ihrer datenschutzrechtlichen Einwilligung",
      "Gewährleistung der technischen Sicherheit und Stabilität des Portals",
      "In der Demo-Umgebung: Veranschaulichung des späteren Prozessablaufs ohne Speicherung echter Daten",
    ],
  },
  {
    id: "rechtsgrundlagen",
    title: "Rechtsgrundlagen",
    paragraphs: [
      "Die Verarbeitung erfolgt auf folgenden Rechtsgrundlagen der Datenschutz-Grundverordnung (DSGVO):",
      "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung): Verarbeitung Ihrer Selbstauskunft-Angaben, Speicherung Ihrer Datenschutz- und Wahrheitsbestätigung per Checkbox.",
      "Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung): Bearbeitung Ihrer Mietanfrage und Kommunikation im Rahmen des Bewerbungsverfahrens, soweit dies auf Ihre Anfrage hin erforderlich ist.",
      "Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse): Technische Bereitstellung des Portals, Protokollierung zu Sicherheitszwecken und Missbrauchsprävention — beschränkt auf das jeweils technisch Erforderliche.",
    ],
  },
  {
    id: "zugangslink",
    title: "Personalisierter Zugangslink",
    paragraphs: [
      "Der Zugang zum Portal erfolgt über einen personalisierten Link der Form /auskunft?t={lp2_token}. Die Legacy-Route /upload leitet dorthin weiter.",
      "Der Link ist ab Ausstellung der Selbstauskunft-Anforderung maximal 7 Tage gültig. Nach Ablauf dieser Frist ist der Zugang gesperrt. Sie können dann einen neuen Link anfordern, indem Sie sich an die Haller Immobilienberatung GmbH wenden.",
      "Es ist kein separates Passwort erforderlich. Der Link selbst fungiert als Zugangsberechtigung. Geben Sie den Link daher nicht an Dritte weiter. Jede Person mit Kenntnis des Links kann bis zum Ablauf der Gültigkeit auf Ihre personalisierte Portal-Seite zugreifen und ggf. die Selbstauskunft in Ihrem Namen ausfüllen.",
      "Beim Öffnen des Links werden Ihre bereits gespeicherten Stammdaten (Name, Nachrichtentext, Inserat-Bezug) angezeigt, um Sie persönlich anzusprechen und den Kontext Ihrer Anfrage herzustellen.",
    ],
  },
  {
    id: "selbstauskunft-formular",
    title: "Digitale Selbstauskunft",
    paragraphs: [
      "Im Portal füllen Sie ein mehrstufiges Formular aus. Es werden keine PDF-Dateien, SCHUFA-Auskünfte oder Gehaltsnachweise hochgeladen.",
      "Ihre Angaben werden in der Datenbank (Tabelle selbstauskuenfte) gespeichert und mit Ihrem Lead-Datensatz verknüpft. Vor dem Absenden bestätigen Sie getrennt die Datenschutzerklärung und die Richtigkeit Ihrer Angaben per Checkbox.",
      "Eine erneute Einreichung nach erfolgreichem Absenden ist technisch nicht möglich.",
    ],
  },
  {
    id: "automatisierung",
    title: "Automatisierte Verarbeitung und KI-Einsatz",
    paragraphs: [
      "Nach Einreichung Ihrer Selbstauskunft kann ein automatisierter Workflow (n8n, WF2) gestartet werden. Dabei werden Ihre Formularangaben zur Unterstützung der Vorauswahl an die Mistral API (Mistral AI) übermittelt. Ziel ist eine strukturierte Auswertung der Selbstauskunft — es werden keine Dokumente hochgeladen.",
      "Das Ergebnis wird als Bewertungsscore (mistral_score), Begründung und Risikohinweise in der Datenbank gespeichert.",
      "Es findet keine vollautomatische Ablehnung oder Zusage ohne menschliche Prüfung statt. Die Ergebnisse der KI-Prüfung dienen ausschließlich als Entscheidungshilfe für die Mitarbeitenden der Haller Immobilienberatung GmbH. Die endgültige Bewertung Ihrer Mieteignung erfolgt durch Menschen.",
      "Sie haben das Recht, nicht ausschließlich einer automatisierten Entscheidung unterworfen zu werden, die Ihnen gegenüber rechtliche Wirkung entfaltet oder Sie in ähnlicher Weise erheblich beeinträchtigt (Art. 22 DSGVO). Da keine automatische Ablehnung erfolgt, greift diese Vorschrift im gegenwärtigen Prozess nicht unmittelbar; Ihr Recht auf menschliche Prüfung bleibt unberührt.",
    ],
  },
  {
    id: "speicherdauer",
    title: "Speicherdauer und Löschung",
    paragraphs: [
      "Ihre Selbstauskunft-Angaben und die zugehörigen Kontaktdaten werden ausschließlich zur Bearbeitung Ihrer Miet- oder Kaufanfrage verwendet und spätestens 90 Tage nach Einreichung automatisch gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
      "Der personalisierte Zugangslink verliert nach 72 Stunden seine Gültigkeit (siehe Abschnitt 10). Bereits eingereichte Daten bleiben bis zum Ablauf der 90-Tage-Frist gespeichert.",
      "Die automatische Löschung wird über den Workflow WF7 (n8n) durchgeführt. Nach Löschung sind Ihre Daten in der Produktiv-Datenbank nicht mehr abrufbar.",
      "Server-Logdateien beim Hosting-Anbieter (Vercel) werden gemäß den Vorgaben des Anbieters für einen begrenzten Zeitraum aufbewahrt und anschließend gelöscht oder anonymisiert.",
    ],
  },
  {
    id: "empfaenger",
    title: "Empfänger und Auftragsverarbeiter",
    paragraphs: [
      "Eine Weitergabe Ihrer Daten zu Werbe- oder Marketingzwecken an Dritte erfolgt nicht. Zugriff auf Ihre Daten haben berechtigte Mitarbeitende der Haller Immobilienberatung GmbH im Rahmen der Bearbeitung Ihrer Mietanfrage.",
      "Zur technischen Bereitstellung und Verarbeitung setzen wir folgende Auftragsverarbeiter gemäß Art. 28 DSGVO ein. Diese verarbeiten Daten ausschließlich nach unserer Weisung und unter angemessenen Schutzmaßnahmen:",
    ],
    listItems: [
      "Supabase Inc., 970 Toa Payoh North #07-04, Singapore 318992 — Datenbank; Rechenzentrum: EU (Frankfurt, Deutschland). Zweck: Speicherung von Lead-Daten und Selbstauskunft-Angaben.",
      "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA — Hosting der Next.js-Anwendung und Ausführung der Server-Aktionen. Zweck: Bereitstellung des Portals im Internet.",
      "Mistral AI, 15 rue des Halles, 75001 Paris, Frankreich — KI-gestützte Auswertung der Selbstauskunft-Angaben im Rahmen von Workflow WF2. Zweck: Automatisierte Entscheidungshilfe.",
      "n8n GmbH / selbst gehostete n8n-Instanz — Workflow-Orchestrierung (WF1–WF7). Zweck: Automatisierung der Datenflüsse zwischen ImmoScout24, Datenbank, Mistral API und E-Mail-Benachrichtigungen. Der konkrete Hosting-Standort der n8n-Instanz ist vom Verantwortlichen zu dokumentieren; bei EU-Hosting erfolgt die Verarbeitung innerhalb der Europäischen Union.",
    ],
  },
  {
    id: "drittland",
    title: "Drittlandübermittlung",
    paragraphs: [
      "Supabase und Mistral AI verarbeiten Daten überwiegend in der Europäischen Union (Frankfurt bzw. Frankreich).",
      "Beim Hosting über Vercel kann eine Verarbeitung in den USA nicht ausgeschlossen werden. Sofern eine Übermittlung in ein Drittland erfolgt, stützen wir uns auf geeignete Garantien gemäß Art. 46 DSGVO, insbesondere die von der Europäischen Kommission genehmigten Standardvertragsklauseln (SCC). Kopien der Garantien oder weitergehende Informationen können auf Anfrage beim Verantwortlichen angefordert werden.",
      "Informationen zu den Datenschutzpraktiken der eingesetzten Anbieter finden Sie in deren jeweiligen Datenschutzerklärungen auf den Websites der Anbieter.",
    ],
  },
  {
    id: "protokolldaten",
    title: "Technische Protokolldaten",
    paragraphs: [
      "Beim Aufruf des Portals und bei Server-Aktionen (z. B. Einreichung der Selbstauskunft) werden automatisch technische Daten verarbeitet, darunter IP-Adresse, Datum und Uhrzeit der Anfrage, angeforderte URL, HTTP-Statuscode, übertragene Datenmenge und Browsertyp (User-Agent).",
      "Diese Daten werden benötigt, um das Portal bereitzustellen, die Kommunikation zu ermöglichen, die Systemsicherheit zu gewährleisten und Missbrauch zu erkennen.",
      "Das Bewerbungsportal setzt keine Tracking-Cookies und verwendet kein Google Analytics, kein Facebook Pixel oder vergleichbare Analyse-Tools. Es werden keine Marketing-Profile erstellt.",
      "Sitzungsbezogene technische Cookies oder vergleichbare Speichermechanismen des Hosting-Anbieters können für den Betrieb der Anwendung erforderlich sein. Diese dienen ausschließlich der technischen Bereitstellung und nicht der Nutzerprofilierung.",
    ],
  },
  {
    id: "pflicht-bereitstellung",
    title: "Pflicht zur Bereitstellung von Daten",
    paragraphs: [
      "Die Nutzung des Portals zur Selbstauskunft ist freiwillig. Sie sind jedoch nicht verpflichtet, das Portal zu nutzen.",
      "Ohne Ihre Einwilligung (Datenschutz- und Wahrheitsbestätigung per Checkbox) und ohne vollständige Angaben im Formular kann Ihre Anfrage über dieses Portal nicht weiter bearbeitet werden. Eine Bearbeitung auf anderem Wege (z. B. persönliche Übergabe oder E-Mail) kann nach Absprache mit der Haller Immobilienberatung GmbH möglich sein.",
      "Die Angabe von E-Mail-Adresse und Telefonnummer im Formular ist für die Einreichung technisch erforderlich, damit wir Sie im weiteren Bewerbungsprozess kontaktieren können.",
    ],
  },
  {
    id: "widerruf",
    title: "Widerruf der Einwilligung",
    paragraphs: [
      "Sie können Ihre erteilte Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen. Senden Sie dazu eine E-Mail an info@haller-immobilien.de unter Angabe Ihres Namens und des betroffenen Mietobjekts.",
      "Im Falle eines Widerrufs werden wir die Verarbeitung einstellen und Ihre Daten löschen, soweit keine andere Rechtsgrundlage für die weitere Verarbeitung besteht und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
      "Ein Widerruf kann dazu führen, dass wir Ihre Anfrage nicht weiter bearbeiten können, wenn uns die Selbstauskunft-Angaben und die Einwilligung zur Verarbeitung dann nicht mehr zur Verfügung stehen.",
      "Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt vom Widerruf unberührt.",
    ],
  },
  {
    id: "betroffenenrechte",
    title: "Ihre Rechte als betroffene Person",
    paragraphs: [
      "Sie haben gegenüber dem Verantwortlichen folgende Rechte. Zur Ausübung wenden Sie sich bitte an info@haller-immobilien.de:",
      "Wir werden Ihre Anfrage unverzüglich, spätestens innerhalb eines Monats nach Eingang, bearbeiten. Diese Frist kann um weitere zwei Monate verlängert werden, wenn dies erforderlich ist; Sie werden über eine Verlängerung informiert.",
    ],
    listItems: [
      "Recht auf Auskunft (Art. 15 DSGVO) — Sie können Auskunft über die von uns verarbeiteten personenbezogenen Daten verlangen.",
      "Recht auf Berichtigung (Art. 16 DSGVO) — Sie können die Berichtigung unrichtiger Daten verlangen.",
      "Recht auf Löschung (Art. 17 DSGVO) — Sie können die Löschung Ihrer Daten verlangen, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
      "Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)",
      "Recht auf Datenübertragbarkeit (Art. 20 DSGVO) — für Daten, die Sie uns bereitgestellt haben und die auf Einwilligung oder Vertrag beruhen.",
      "Recht auf Widerspruch (Art. 21 DSGVO) — gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.",
      "Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO) — siehe Abschnitt 20.",
    ],
  },
  {
    id: "beschwerderecht",
    title: "Beschwerderecht bei der Aufsichtsbehörde",
    paragraphs: [
      "Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde zu, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt.",
      "Zuständige Aufsichtsbehörde für die Haller Immobilienberatung GmbH mit Sitz in Andernach ist:",
    ],
    listItems: [
      "Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz",
      "Postfach 30 40",
      "55020 Mainz",
      "Telefon: 06131 208-2449",
      "E-Mail: poststelle@lda.rlp.de",
      "Website: https://www.lda.rlp.de",
    ],
  },
  {
    id: "datensicherheit",
    title: "Datensicherheit (technische und organisatorische Maßnahmen)",
    paragraphs: [
      "Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten gegen Verlust, Manipulation und unbefugten Zugriff zu schützen:",
    ],
    listItems: [
      "Verschlüsselte Datenübertragung per TLS (HTTPS) zwischen Ihrem Browser und dem Server",
      "Speicherung der Selbstauskunft-Angaben in einer geschützten Datenbank",
      "Row Level Security (RLS) in der Datenbank — direkter Client-Zugriff auf die Datenbank ist nicht vorgesehen",
      "Serverseitiger Zugriff auf die Datenbank ausschließlich über einen geschützten Service-Role-Schlüssel (nicht im Browser exponiert)",
      "Zeitlich begrenzter Zugang über personalisierten Token-Link (7 Tage)",
      "Validierung der Formulareingaben vor dem Absenden",
      "Keine Weitergabe von Zugangsdaten oder API-Schlüsseln an Endnutzer",
    ],
  },
  {
    id: "aenderungen",
    title: "Änderungen dieser Datenschutzerklärung und rechtlicher Hinweis",
    paragraphs: [
      `Stand dieser Datenschutzerklärung: ${LAST_UPDATED}.`,
      "Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn sich die technische Umsetzung des Portals, eingesetzte Dienstleister oder die Rechtslage ändern. Die jeweils aktuelle Fassung ist unter /datenschutz abrufbar.",
      "Für die allgemeine Datenverarbeitung auf der Unternehmenswebsite haller-immobilien.de gelten die dort veröffentlichten Datenschutzhinweise.",
      "Diese Datenschutzerklärung ist ein Entwurf zur internen Prüfung und Freigabe durch die Haller Immobilienberatung GmbH. Sie ersetzt keine individuelle Rechtsberatung.",
    ],
  },
];

export const DEMO_HINWEIS = {
  title: "Hinweis zur Demo-Version",
  text: "In der öffentlichen Demo-Ansicht (z. B. /auskunft?t=demo-lp2-token-haller-2026) werden Testdaten verwendet. Die vorliegende Datenschutzerklärung beschreibt den Produktivbetrieb des Portals.",
};

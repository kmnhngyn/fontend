import { LEGAL_CONFIG } from './config'

export function Datenschutz() {
  const { name, address, email, lastUpdated, hostingProvider, siteName } = LEGAL_CONFIG

  return (
    <article className="flex-1 px-6 md:px-12 py-12 max-w-3xl mx-auto w-full">
      <h1
        className="font-bold mb-2"
        style={{
          fontFamily: '"Thold-Regular", ui-sans-serif, system-ui, sans-serif',
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          lineHeight: 1,
        }}
      >
        Datenschutz
      </h1>
      <p className="text-xs text-neutral-500 mb-10">Stand: {lastUpdated}</p>

      <div className="space-y-8 text-sm text-neutral-300 leading-relaxed">
        <Section title="1. Verantwortlicher">
          <address className="not-italic">
            {name}<br />
            {address.street}<br />
            {address.zip} {address.city}<br />
            {address.country}<br />
            E-Mail: <a href={`mailto:${email}`} className="hover:underline">{email}</a>
          </address>
        </Section>

        <Section title="2. Allgemeines">
          <p>
            {siteName} ist ein clientseitiges Werkzeug zum Testen von Schriftdateien (OTF/TTF).
            Hochgeladene Schriftdateien werden ausschließlich im Browser des Nutzers verarbeitet -
            sie werden weder an unseren Server noch an Dritte übertragen oder dauerhaft gespeichert.
            Die Anwendung speichert keine Cookies, betreibt kein Tracking und nutzt keine
            Webanalyse-Tools.
          </p>
        </Section>

        <Section title="3. Datenverarbeitung beim Aufruf der Website">
          <p>
            Beim Aufruf dieser Seite erhebt unser Hosting-Anbieter ({hostingProvider.name},{' '}
            {hostingProvider.address}) automatisch Informationen, die Ihr Browser übermittelt, in
            sogenannten Server-Logfiles:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-neutral-400">
            <li>IP-Adresse des anfragenden Geräts</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Name und URL der abgerufenen Datei</li>
            <li>Übertragene Datenmenge</li>
            <li>Browsertyp, Browserversion und Betriebssystem</li>
            <li>Referrer-URL</li>
            <li>HTTP-Statuscode</li>
          </ul>
          <p className="mt-3">
            Die Erhebung dieser Daten ist technisch erforderlich, um die Website auszuliefern
            und deren Funktionsfähigkeit und Sicherheit zu gewährleisten. Rechtsgrundlage ist daher
            Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am stabilen und sicheren Betrieb
            des Online-Angebots). Der Hosting-Anbieter handelt dabei als Auftragsverarbeiter
            im Sinne von Art. 28 DSGVO; mit ihm besteht ein entsprechender Vertrag zur
            Auftragsverarbeitung. Eine Zusammenführung dieser Daten mit anderen Datenquellen
            findet nicht statt. Weitere Informationen zur Datenverarbeitung durch den
            Hosting-Anbieter finden Sie in dessen Datenschutzerklärung:{' '}
            <a
              href={hostingProvider.privacyUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:underline break-all"
            >
              {hostingProvider.privacyUrl}
            </a>
          </p>
          <p className="mt-3">
            Da {hostingProvider.name} Server auch außerhalb der Europäischen Union (insbesondere in
            den USA) betreibt, kann es zu einer Übermittlung in Drittländer kommen.
            {hostingProvider.name} verwendet hierfür Standardvertragsklauseln gemäß Art. 46
            DSGVO.
          </p>
        </Section>

        <Section title="4. Hochgeladene Schriftdateien">
          <p>
            Schriftdateien, die Sie über Drag-and-Drop oder den Datei-Auswahldialog laden, werden
            ausschließlich lokal in Ihrem Browser verarbeitet (über die FontFace Web API sowie die
            Open-Source-Bibliothek opentype.js). Es erfolgt zu keinem Zeitpunkt eine Übertragung
            dieser Daten an unsere Server oder an Dritte. Die Daten verbleiben im Arbeitsspeicher
            Ihres Browsers und werden mit dem Schließen des Browsertabs verworfen.
          </p>
        </Section>

        <Section title="5. Cookies und Tracking">
          <p>
            Diese Website verwendet keine Cookies, keine Webanalyse-Tools, kein Re-Targeting und
            keine sonstigen Tracking-Mechanismen.
          </p>
        </Section>

        <Section title="6. Ihre Rechte">
          <p>
            Auch wenn diese Anwendung selbst keine personenbezogenen Daten in einer Datenbank
            hält oder verarbeitet, stehen Ihnen grundsätzlich gegenüber dem Verantwortlichen
            gemäß DSGVO, soweit die gesetzlichen Voraussetzungen vorliegen, folgende Rechte zu:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-neutral-400">
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          </ul>
          <p className="mt-3">
            In der Praxis beziehen sich diese Rechte für dieses Angebot ausschließlich auf die in
            Abschnitt 3 genannten Server-Logfiles, die der Hosting-Anbieter im Auftrag und nur für
            kurze Zeit aufbewahrt. Dies ist notwendig für das Bereitstellen dieser Website.
            Eine eindeutige Zuordnung zu Ihrer Person ist uns ohne weitere
            Angaben (z. B. Zeitpunkt des Zugriffs, IP-Adresse) in der Regel nicht
            möglich. Bei Anfragen leiten wir diese - soweit erforderlich - an den
            Auftragsverarbeiter weiter.
          </p>
          <p className="mt-3">
            Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die
            Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
          </p>
        </Section>

        <Section title="7. Kontakt">
          <p>
            Bei Fragen erreichen Sie uns unter:{' '}
            <a href={`mailto:${email}`} className="hover:underline">{email}</a>
          </p>
        </Section>
      </div>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">{title}</h2>
      {children}
    </section>
  )
}

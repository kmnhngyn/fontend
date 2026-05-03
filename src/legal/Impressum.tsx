import { LEGAL_CONFIG } from './config'

export function Impressum() {
  const { name, address, email } = LEGAL_CONFIG

  return (
    <article className="flex-1 px-6 md:px-12 py-12 max-w-3xl mx-auto w-full">
      <h1
        className="font-bold mb-10"
        style={{
          fontFamily: '"Thold-Regular", ui-sans-serif, system-ui, sans-serif',
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          lineHeight: 1,
        }}
      >
        Impressum
      </h1>

      <div className="space-y-8 text-sm text-neutral-300 leading-relaxed">
        <Section title="Angaben gemäß § 5 DDG">
          <address className="not-italic">
            {name}<br />
            {address.street}<br />
            {address.zip} {address.city}<br />
            {address.country}
          </address>
        </Section>

        <Section title="Kontakt">
          <p>
            E-Mail:{' '}
            <a href={`mailto:${email}`} className="text-[#d4ff00] hover:underline">{email}</a>
          </p>
        </Section>

        <Section title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
          <p>{name}, Anschrift wie oben.</p>
        </Section>

        <Section title="Haftung für Inhalte">
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          </p>
        </Section>

        <Section title="Haftung für Links">
          <p>
            Unser Angebot enthält gegebenenfalls Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
            keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
            Anbieter oder Betreiber der Seiten verantwortlich. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>
        </Section>

        <Section title="Urheberrecht">
          <p>
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Seite unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
            Zustimmung des jeweiligen Autors bzw. Erstellers.
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

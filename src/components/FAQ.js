import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = React.memo(() => {
  const [openItems, setOpenItems] = useState(new Set());

  const faqItems = useMemo(() => [
    {
      question: "Hvordan fungerer Barnearbeid?",
      answer: "Barnearbeid er en plattform som kobler unge som ønsker jobbmuligheter med voksne som trenger hjelp i hverdagen. Unge kan tilby tjenester som barnepass, hagearbeid, rengjøring og mer, mens voksne kan finne pålitelig hjelp i sitt nærmiljø."
    },
    {
      question: "Hvem kan bruke plattformen?",
      answer: "Plattformen er åpen for unge mellom 13-18 år som ønsker å tilby tjenester, og voksne som trenger hjelp. Alle brukere må verifiseres før de kan bruke plattformen."
    },
    {
      question: "Hvordan sikrer dere sikkerheten?",
      answer: "Vi har strenge verifikasjonsprosesser for alle brukere. Unge må ha samtykke fra foresatte, og alle jobber utføres i det lokale nærmiljøet. Vi har også et ratingsystem og mulighet for å rapportere problemer."
    },
    {
      question: "Hvordan fungerer betalingen?",
      answer: "Alle jobber er forhåndsbetalt gjennom plattformen. Dette sikrer at unge får betalt for arbeidet sitt, og at voksne vet at jobben blir utført."
    },
    {
      question: "Hva slags tjenester kan tilbys?",
      answer: "Vanlige tjenester inkluderer barnepass, hagearbeid, rengjøring, dyrepass, undervisning, teknisk hjelp og mer. Alt som er lovlig og trygt for unge å utføre."
    },
    {
      question: "Hvordan fungerer ratingsystemet?",
      answer: "Etter hver fullført jobb kan både tilbyder og kunde gi hverandre en rating og kommentar. Dette hjelper andre brukere å velge pålitelige partnere."
    }
  ], []);

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16">Ofte stilte spørsmål</h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                {openItems.has(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openItems.has(index) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

FAQ.displayName = 'FAQ';

export default FAQ; 
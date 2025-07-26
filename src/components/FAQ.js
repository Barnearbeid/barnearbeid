import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const faqItems = [
    {
      question: "Hvordan fungerer plattformen?",
      answer: "Barnearbeid kobler unge som vil tjene penger og få arbeidserfaring med travle voksne og eldre som ønsker hjelp i hverdagen. Du kan enkelt opprette en profil og legge ut eller søke på oppdrag. Vi begynner med følgende kategorier: husarbeid, hagearbeid, dyrepass, bærehjelp, håndverk og eldreomsorg."
    },
    {
      question: "Når lanserer Barnearbeid i mitt område?",
      answer: "Vi jobber med å ekspandere så fort som mulig. Hvis du registrerer interesse øker det sjansen for at vi lanserer raskere i ditt område og reserverer deg tilgang slik at du blir først til å bruke appen i nabolaget ditt."
    },
    {
      question: "Hvordan fungerer betaling?",
      answer: "Oppdragsgiver (demand) betaler enkelt med Vipps eller kort. Trygg Betaling sørger for at du betaler og får betalt riktig ved å holde av betaling til begge parter er enige og fornøyde. Betaling håndteres av Stripe Connect og de bruker 2-4 virkedager for oppdragstaker (youth) å motta betalingen."
    },
    {
      question: "Hvordan fungerer skatt og lignende?",
      answer: "Barnearbeid samarbeider med DLA Piper - Nordens største advokatfirma - for å gjøre alt juridisk rundt småjobber enklest mulig. Nå får du oversikt på barnearbeid.no/legal/skatteinfo. Snart vil appen automatisk holde oversikt over hvor mye du kan tjene/betale skattefritt og varsle deg før du når grenser. Om du passerer, vil vi tilby alternativer som forenkler og automatiserer skatt og rapportering."
    },
    {
      question: "Hvordan sørger dere for sikkerhet og kvalitet?",
      answer: "Alle brukere må godkjenne identiteten sin med Vipps. Unge (youth) må være mellom 13-25. Vi tar sikkerhet seriøst og sørger for å sjekke alle brukere. Begge sider på plattformen mottar vurderinger, og du kan velge å kun jobbe hos / bestille fra de med erfaring. Vi jobber også med: Sertifiseringer og kvalitetssikring for unge (youth), Vandelsattest for oppdragsgivere (demand), En spesialtilpasset forsikring for småjobber"
    }
  ];

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Spørsmål og svar</h2>
        <p className="text-center text-gray-600 mb-12">Få raskt svar på det du lurer på!</p>
        
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                {openItems[index] ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openItems[index] && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 
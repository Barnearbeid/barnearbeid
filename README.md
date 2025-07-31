# Barnearbeid - Småjobber i ditt nærmiljø

<div align="center">

![Barnearbeid Logo](https://img.shields.io/badge/Barnearbeid-Platform-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.0.0-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-blue?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**En moderne plattform som kobler sammen unge og kunder for småjobber i lokalmiljøet**

[🚀 Kom i gang](#-kom-i-gang) • [📖 Dokumentasjon](#-dokumentasjon) • [🤝 Bidrag](#-bidrag) • [📄 Lisens](#-lisens)

</div>

---

## 📋 Innhold

- [Om prosjektet](#-om-prosjektet)
- [Funksjoner](#-funksjoner)
- [Teknisk stack](#-teknisk-stack)
- [Prosjektstruktur](#-prosjektstruktur)
- [Kom i gang](#-kom-i-gang)
- [Git og versjonskontroll](#-git-og-versjonskontroll)
- [Utvikling](#-utvikling)
- [Bygging og deploy](#-bygging-og-deploy)
- [Dokumentasjon](#-dokumentasjon)
- [Bidrag](#-bidrag)
- [Lisens](#-lisens)

## 🎯 Om prosjektet

**Barnearbeid** er en moderne webapplikasjon som gir unge mennesker muligheten til å tilby tjenester i sitt lokalmiljø. Plattformen fungerer som en bro mellom unge som ønsker å tjene penger og kunder som trenger hjelp med ulike oppgaver.

### Hvorfor Barnearbeid?

- **For unge**: Enkel måte å finne betalte oppgaver i nærmiljøet
- **For kunder**: Rask tilgang til pålitelig hjelp for småjobber
- **For samfunnet**: Styrker lokalsamfunnet og gir unge arbeidserfaring

### Målgruppe

- **Ungdommer** (13-18 år) som ønsker å tjene penger
- **Voksne** som trenger hjelp med småjobber
- **Familier** som ønsker pålitelig hjelp i hjemmet

## ✨ Funksjoner

### 🔍 Tjenesteoppdagelse
- **Kategoribasert søk**: Finn tjenester etter type (hagearbeid, barnepass, rengjøring, etc.)
- **Avansert filtrering**: Filtrer etter pris, rating, tilgjengelighet og lokasjon
- **Søkefunksjonalitet**: Rask søk i alle tilgjengelige tjenester
- **Anbefalinger**: Personlig tilpassede forslag basert på tidligere aktivitet

### 🛠️ Tjenesteopprettelse
- **Enkel registrering**: Ungdommer kan enkelt opprette sin første tjeneste
- **Kategorivalg**: Velg fra forhåndsdefinerte kategorier med ikoner
- **Prisfastsettelse**: Fleksibel prissetting med forslag basert på markedet
- **Tilgjengelighet**: Angi når du kan jobbe (dager, tider, ferier)

### 📅 Bookingsystem
- **Dato- og tidsvalg**: Kunder velger når de ønsker tjenesten
- **Bekreftelsesprosess**: Automatisk bekreftelse og påminnelser
- **Kansellering**: Enkel kansellering med rimelig varsling
- **Kalendersynkronisering**: Integrering med personlige kalendere

### 👤 Brukerprofiler
- **Omfattende profiler**: Vis ferdigheter, erfaring og sertifikater
- **Vurderingssystem**: Stjerner og anmeldelser fra tidligere kunder
- **Inntektsoversikt**: Spor inntekter og jobbhistorikk
- **Pålitelighet**: Verifiserte profiler for økt tillit

### 📱 Responsivt design
- **Mobilførst**: Optimalisert for smarttelefoner og nettbrett
- **Adaptivt grensesnitt**: Tilpasser seg alle skjermstørrelser
- **Touch-vennlig**: Enkel navigering på berøringsenheter
- **Offline-støtte**: Grunnleggende funksjonalitet uten internett

### 🎨 Moderne brukergrensesnitt
- **Intuitivt design**: Enkel å forstå og bruke
- **Smooth animasjoner**: Polerte overganger og interaksjoner
- **Tilgjengelighet**: Følger WCAG-retningslinjer
- **Mørk modus**: Støtte for både lyst og mørkt tema

## 🛠️ Teknisk stack

### Frontend
- **React 18**: Moderne JavaScript-bibliotek for brukergrensesnitt
- **React Router**: Klient-side routing for enkeltstående applikasjon
- **Tailwind CSS**: Utility-first CSS-rammeverk for rask styling
- **Lucide React**: Konsistente og skalerbare ikoner

### Byggeverktøy
- **Create React App**: Konfigurasjonsfri React-oppsett
- **PostCSS**: CSS-prosessering og optimalisering
- **Webpack**: Modul-bundler (konfigurert av CRA)

### Utviklingsverktøy
- **ESLint**: Kodekvalitet og konsistens
- **Prettier**: Kodeformatering
- **Git**: Versjonskontroll

### Skrifter og fonter
- **Inter**: Moderne sans-serif font fra Google Fonts
- **System fonts**: Fallback til systemets standardfonter

## 📁 Prosjektstruktur

```
barnearbeid/
├── public/                 # Statiske filer
│   ├── index.html         # HTML-mal
│   └── manifest.json      # PWA-manifest
├── src/                   # Kildekode
│   ├── components/        # Gjenbrukbare komponenter
│   │   ├── Auth.js       # Autentisering
│   │   ├── EditProfile.js # Profilredigering
│   │   ├── FAQ.js        # Ofte stilte spørsmål
│   │   ├── Footer.js     # Bunntekst
│   │   ├── Messaging.js  # Meldingssystem
│   │   ├── Navbar.js     # Navigasjonsmeny
│   │   └── RatingSystem.js # Vurderingssystem
│   ├── pages/            # Sidekomponenter
│   │   ├── CreateJob.js  # Jobbopprettelse
│   │   ├── CreateService.js # Tjenesteopprettelse
│   │   ├── Home.js       # Hjemmeside
│   │   ├── Jobs.js       # Jobblisting
│   │   ├── Profile.js    # Brukerprofil
│   │   ├── ServiceDetail.js # Tjenestedetaljer
│   │   └── Services.js   # Tjenestelisting
│   ├── App.js            # Hovedapplikasjon med routing
│   ├── firebase.js       # Firebase-konfigurasjon
│   ├── index.js          # React oppstartsfil
│   └── index.css         # Globale stiler og Tailwind
├── package.json          # Prosjektavhengigheter
├── tailwind.config.js    # Tailwind CSS-konfigurasjon
└── README.md            # Prosjektdokumentasjon
```

## 🚀 Kom i gang

### Forutsetninger

Før du starter, sørg for at du har følgende installert:

- **Node.js** (versjon 14 eller høyere)
  - Last ned fra [nodejs.org](https://nodejs.org/)
  - Anbefalt: LTS-versjon (Long Term Support)
- **npm** (kommer med Node.js) eller **yarn**
- **Git** for versjonskontroll
- **Kodeeditor** (VS Code anbefales)

### Installasjon

1. **Klon repositoryet**
   ```bash
   git clone https://github.com/ditt-brukernavn/barnearbeid.git
   cd barnearbeid
   ```

2. **Installer avhengigheter**
   ```bash
   npm install
   ```
   Dette installerer alle nødvendige pakker definert i `package.json`.

3. **Start utviklingsserveren**
   ```bash
   npm start
   ```
   Applikasjonen åpnes automatisk i nettleseren på `http://localhost:3000`.

4. **Åpne i nettleseren**
   Naviger til `http://localhost:3000` hvis den ikke åpnes automatisk.

### Tilgjengelige skript

- `npm start` - Starter applikasjonen i utviklingsmodus
- `npm build` - Bygger applikasjonen for produksjon
- `npm test` - Starter testkjøringen
- `npm eject` - Ejekt fra Create React App (irreversibel operasjon)

## 📚 Git og versjonskontroll

### Grunnleggende Git-kommandoer

For å bidra til prosjektet, må du kunne bruke Git. Her er de viktigste kommandoene:

#### 1. Klone repositoryet
```bash
git clone https://github.com/ditt-brukernavn/barnearbeid.git
cd barnearbeid
```
Dette laster ned hele prosjektet til din lokale maskin.

#### 2. Sjekk status
```bash
git status
```
Viser hvilke filer som er endret, lagt til eller slettet.

#### 3. Opprett ny branch
```bash
git checkout -b min-funksjon-branch
```
Alltid gjør endringer i en ny branch, ikke i hovedgrenen (main).

#### 4. Legg til endringer
```bash
git add .                    # Legg til alle endringer
git add src/components/      # Legg til spesifikke filer
git add -p                   # Interaktivt valg av endringer
```

#### 5. Committ endringer
```bash
git commit -m "Legg til ny funksjon for brukerprofiler"
```
Skriv beskrivende commit-meldinger som forklarer hva endringen gjør.

#### 6. Hent siste endringer
```bash
git pull origin main
```
Sørg for at din branch er oppdatert med siste endringer fra hovedgrenen.

#### 7. Push til GitHub
```bash
git push origin min-funksjon-branch
```
Last opp dine endringer til GitHub.

#### 8. Opprett Pull Request
Gå til GitHub og opprett en Pull Request fra din branch til `main`.

### Git workflow

1. **Fork repositoryet** på GitHub
2. **Klon din fork** til lokal maskin
3. **Opprett feature branch** for hver ny funksjon
4. **Gjør endringer** og test grundig
5. **Commit og push** til din fork
6. **Opprett Pull Request** til hovedrepositoryet
7. **Få kodegjennomgang** og adresser eventuelle kommentarer
8. **Merge** når godkjent

## 💻 Utvikling

### Utviklingsmiljø

- **Hot Reloading**: Endringer vises automatisk i nettleseren
- **Error Overlay**: Tydelige feilmeldinger med stack trace
- **Source Maps**: Enkel debugging av minifisert kode
- **ESLint**: Automatisk kodekvalitetskontroll

### Kodekonvensjoner

- **JavaScript**: Bruk moderne ES6+ syntax
- **React**: Funksjonelle komponenter med hooks
- **CSS**: Tailwind utility classes
- **Navngiving**: camelCase for variabler, PascalCase for komponenter
- **Kommentarer**: Forklar kompleks logikk på norsk

### Testing

```bash
npm test
```
Kjører testene i watch-modus. Testene kjøres automatisk når filer endres.

### Linting og formatering

```bash
npm run lint
```
Sjekker kodekvalitet og stil.

## 🏗️ Bygging og deploy

### Produksjonsbygge

```bash
npm run build
```
Dette oppretter en optimalisert versjon i `build/`-mappen.

### Deploy til produksjon

1. **Bygg applikasjonen**
   ```bash
   npm run build
   ```

2. **Test bygget lokalt**
   ```bash
   npx serve -s build
   ```

3. **Deploy til hosting-tjeneste**
   - **Netlify**: Dra `build/`-mappen til Netlify
   - **Vercel**: Koble til GitHub-repositoryet
   - **Firebase**: Bruk Firebase Hosting
   - **GitHub Pages**: Aktiver i repository-innstillinger

### Miljøvariabler

Opprett en `.env`-fil i prosjektroten:

```env
REACT_APP_API_URL=https://api.barnearbeid.no
REACT_APP_FIREBASE_CONFIG=your_firebase_config
```

## 📖 Dokumentasjon

### Komponenter

#### Navbar.js
Hovednavigasjon med responsive design og mobilmeny.

#### Auth.js
Autentiseringskomponent med innlogging og registrering.

#### ServiceCard.js
Kort-komponent for visning av tjenester i lister.

### Sider

#### Home.js
Landingsside med hero-seksjon og funksjonsoversikt.

#### Services.js
Tjenestelisting med søk og filtrering.

#### Profile.js
Brukerprofil med innstillinger og statistikk.

### API-integrasjon

Prosjektet bruker Firebase for backend-tjenester:
- **Authentication**: Brukerinnlogging og -registrering
- **Firestore**: Database for tjenester og brukerdata
- **Storage**: Filopplasting for bilder og dokumenter

## 🤝 Bidrag

Vi setter pris på alle bidrag! Her er hvordan du kan bidra:

### Hvordan bidra

1. **Fork repositoryet**
2. **Opprett feature branch**
   ```bash
   git checkout -b feature/ny-funksjon
   ```
3. **Gjør endringer** og test grundig
4. **Commit endringer**
   ```bash
   git commit -m "Legg til ny funksjon: beskrivelse"
   ```
5. **Push til din fork**
   ```bash
   git push origin feature/ny-funksjon
   ```
6. **Opprett Pull Request**

### Bidragstyper

- **Bug fixes**: Rapporter og fiks feil
- **Nye funksjoner**: Foreslå og implementer nye funksjoner
- **Dokumentasjon**: Forbedre README og kodekommentarer
- **Testing**: Legg til tester og forbedre testdekning
- **Design**: Forbedre brukergrensesnitt og brukeropplevelse

### Rapportering av feil

Når du rapporterer feil, inkluder:
- Beskrivelse av problemet
- Steg for å reprodusere
- Forventet vs faktisk oppførsel
- Skjermbilde (hvis relevant)
- Teknisk informasjon (nettleser, OS, etc.)

## 📄 Lisens

Dette prosjektet er lisensiert under MIT-lisensen. Se [LICENSE](LICENSE)-filen for detaljer.

## 🙏 Takk

- **React-teamet** for det fantastiske rammeverket
- **Tailwind CSS** for det fleksible styling-systemet
- **Lucide** for de vakre ikonene
- **Samfunnet** for bidrag og tilbakemeldinger

---

<div align="center">

**Bygget med ❤️ for norske unge og lokalsamfunn**

[🚀 Kom i gang](#-kom-i-gang) • [📖 Dokumentasjon](#-dokumentasjon) • [🤝 Bidrag](#-bidrag)

</div>
## bospop-emailhandtekening-generator-v2

Interne tool om e-mailhandtekeningen in de Bospop-huisstijl te genereren en te kopiëren naar je e-mailprogramma.

### Structuur

- `index.html`: hoofdpagina met formulier, preview en cookie-banner.
- `css/styles.css`: styling van de pagina.
- `js/main.js`: logica voor validatie, preview, kopiëren en (optioneel) analytics.
- `assets/`: logo, achtergrond, icons en favicons.

### Lokaal draaien

Je kunt de tool op twee manieren lokaal gebruiken:

1. Door `index.html` direct in je browser te openen (voor snelle checks).
2. Via een eenvoudige static server:
   - Installeer Node.js.
   - Voer in de projectmap uit:
     - `npm install` (installeert `serve` automatisch via `npx` wanneer je de scripts gebruikt)
     - `npm run dev`
   - Open daarna de URL die in de terminal wordt getoond (bijv. `http://localhost:3000`).

### Deploy naar Vercel

Deze app is een statische site:

- Root van het project is de map met `index.html`.
- Er is geen build-stap nodig; Vercel kan direct uit deze map serveren.

Stappen:

1. Maak een nieuw project in Vercel en koppel de Git-repo.
2. Build command: leeg laten of `npm run build` (optioneel, doet nu niets bijzonders).
3. Output directory: root (`/`) van de repo.
4. Deploy. De preview- en productie-URL’s gebruiken automatisch de juiste asset-paden.

### Analytics & cookie-consent

- In `js/main.js` staat bovenaan:
  - `const ENABLE_ANALYTICS = false;`
  - `const GA_MEASUREMENT_ID = "G-KFBZF0WNVM";`
- Zolang `ENABLE_ANALYTICS` `false` is:
  - Wordt Google Analytics niet geladen.
  - Verschijnt de cookie-banner niet.
- Zet `ENABLE_ANALYTICS` op `true` als je GA wilt gebruiken en zorg dat `GA_MEASUREMENT_ID` klopt.

### Handmatige test-checklist na deploy

- Formulier invullen:
  - Validatie van verplichte velden (voornaam, achternaam, functie, afdeling, e-mail).
  - Optionele velden (telefoon, LinkedIn, opmerking) werken zonder fouten.
- Preview:
  - Naam, functie, afdeling, e-mail, telefoon, website en optioneel LinkedIn worden correct weergegeven.
  - Footer-afbeelding wordt geladen.
  - Links openen correct (tel:, mailto:, website, LinkedIn).
- Kopiëren:
  - Knop “Kopieer handtekening” zet de HTML in het klembord.
  - Plakken in Outlook toont dezelfde handtekening (inclusief iconen en footer).
- Reset:
  - “Reset” wist het formulier, verbergt foutmeldingen en toont de standaardpreview.
- (Optioneel, als analytics aanstaat):
  - Cookie-banner verschijnt.
  - Na “Ja, toestaan” wordt GA geladen en events voor kopiëren/resetten worden gemeten.


# Roadmap: NTNU Studieadministrativt Årshjul

**GitHub Repository:** [https://github.com/readymedia/ntnu-studieadministrativt-aarshjul](https://github.com/readymedia/ntnu-studieadministrativt-aarshjul)

Dette dokumentet gir en oversikt over status på funksjonalitet basert på den opprinnelige kravspesifikasjonen, og skisserer veien videre for utvikling.

## 1. Status Oversikt

**Nåværende Fase:** Fase 9 (Radial Årskalender).
Kjernefunksjonaliteten (Versjon 1.0) er ferdig. Vi starter nå arbeidet med en avansert visualisering ("Årshjulet") for å vise hele året i ett sirkulært bilde.

## 2. Implementert Funksjonalitet (Fullført)

### Visning ("Utsiden")
- **Tidsvisning:** Dynamisk kalender (Måned/Uke) og Agenda-visning.
- **Visualisering:** Støtte for ikoner og bilder (URL) på hendelser.
- **Eksport:** Mulighet for å laste ned filtrert utvalg som `.ics` fil (Outlook/Google Cal).
- **Design/UU:** Oppfyller krav til kontrast og lesbarhet. Ren layout.
- **Dark Mode:** Full støtte for mørkt tema.
- **Responsivitet:** Mobilvennlig meny (drawer) og tilpasset kalender-visning.
- **Filtrering:**
  - Roller, Område, Campus.
  - **Hierarkisk filtrering:** Fakultet og Institutt.
  - **Søk:** Søker i tittel, beskrivelse og metadata.

### Administrasjon ("Innsiden")
- **Tilgangsstyring:** Enkel "Logg inn" funksjonalitet (Klient-side).
- **CRUD:** Full støtte for å opprette, redigere og slette.
- **Metadata:** Utvidet støtte for Campus, Roller, Ikoner, Lenker og Bilder.
- **Dataverktøy:** Bulk import og eksport av data (JSON).
- **Integrasjoner:** Klargjort UI for konfigurasjon av FS, EpN og TP (API-nøkler, endepunkter, synkroniseringsstatus).

### Data
- **Real World Data:** Importert datasett for 2025.

---

## 3. Planlagt Funksjonalitet (Under utvikling)

### Fase 9: Radial Årskalender (Årshjul)
En ny visningstype som visualiserer året som en sirkel (360°).
- **Konsept:** Tid som sirkel, datastrømmer som konsentriske ringer.
- **Elementer:** Perioder vises som buer (arcs), frister som punkter/markører.
- **Teknisk:** SVG-basert rendering for høy ytelse og skalerbarhet.
- **Interaksjon:** "Focus + Context" ved hover/klikk.

---

## 4. Veien Videre (Post-MVP)

- **Backend:** Utvikle backend-proxy for sikker kommunikasjon med NTNUs APIer.
- **Autentisering:** Erstatte klient-side passord med Feide-integrasjon.
- **Drift:** Sette opp CI/CD pipelines mot Vercel/Azure.

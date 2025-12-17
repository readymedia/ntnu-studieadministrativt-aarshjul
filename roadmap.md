
# Roadmap: NTNU Studieadministrativt Årshjul

**GitHub Repository:** [https://github.com/readymedia/ntnu-studieadministrativt-aarshjul](https://github.com/readymedia/ntnu-studieadministrativt-aarshjul)

Dette dokumentet gir en oversikt over status på funksjonalitet basert på den opprinnelige kravspesifikasjonen, og skisserer veien videre for utvikling.

## 1. Status Oversikt

**Nåværende Fase:** Fase 8 (Integrasjons-forberedelser).
Kjernefunksjonaliteten er ferdig. Vi legger nå inn visuelle plassholdere for fremtidige systemintegrasjoner (FS, TP, EpN) for å demonstrere arkitekturen.

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
- **Integrasjoner:** UI-mockups for kobling mot FS, EpN og TP.

### Data
- **Real World Data:** Importert datasett for 2025.

---

## 3. Neste Steg

- **Integrasjoner:** Realisere API-koblingene (krever backend-proxy).
- **Autentisering:** Bytte ut passord-prompt med Feide-innlogging (når backend er på plass).

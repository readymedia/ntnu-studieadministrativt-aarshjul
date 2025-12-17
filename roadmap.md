
# Roadmap: NTNU Studieadministrativt Årshjul

**GitHub Repository:** [https://github.com/readymedia/ntnu-studieadministrativt-aarshjul](https://github.com/readymedia/ntnu-studieadministrativt-aarshjul)

Dette dokumentet gir en oversikt over status på funksjonalitet basert på den opprinnelige kravspesifikasjonen, og skisserer veien videre for utvikling.

## 1. Status Oversikt

**Nåværende Fase:** Fase 7 (Avansert Datahåndtering).
Applikasjonen er komplett på visning og filtrering. Vi arbeider nå med verktøy for dataflyt (import/eksport) for å forberede fremtidige integrasjoner.

## 2. Implementert Funksjonalitet (Fullført)

### Visning ("Utsiden")
- **Tidsvisning:** Dynamisk kalender (Måned/Uke) og Agenda-visning.
- **Visualisering:** Støtte for ikoner på hendelser.
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
- **Metadata:** Utvidet støtte for Campus, Roller, Ikoner og Lenker.
- **Dataverktøy:** Bulk import og eksport av data (JSON).

### Data
- **Real World Data:** Importert datasett for 2025.

---

## 3. Neste Steg (Fase 7)

- **7.1 Dataverktøy:** Implementere Import/Eksport av JSON for backup og masseoppdatering (Ferdig).
- **7.2 Bilder:** Legge til støtte for bilde-URLer på hendelser.

## 4. Fremtidig Funksjonalitet

- **API Integrasjon:** Erstatte manuell JSON-import med direkte kobling mot FS API.

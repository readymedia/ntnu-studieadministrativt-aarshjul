
# Roadmap: NTNU Studieadministrativt Årshjul

Dette dokumentet gir en oversikt over status på funksjonalitet basert på den opprinnelige kravspesifikasjonen, og skisserer veien videre for utvikling.

## 1. Status Oversikt

**Nåværende Fase:** Fase 4 (Avanserte Funksjoner).
Applikasjonen er nå robust, universelt utformet (kontraster) og har en enkel tilgangskontroll for redigering.

## 2. Implementert Funksjonalitet (Fullført)

### Visning ("Utsiden")
- **Tidsvisning:** Dynamisk kalender (Måned/Uke) og Agenda-visning.
- **Design/UU:** Oppfyller krav til kontrast og lesbarhet. Ren layout.
- **Filtrering:**
  - Roller, Område, Campus.
  - **Hierarkisk filtrering:** Fakultet og Institutt.
  - **Søk:** Søker i tittel, beskrivelse og metadata.

### Administrasjon ("Innsiden")
- **Tilgangsstyring:** Enkel "Logg inn" funksjonalitet (Klient-side) for å beskytte redigering.
- **CRUD:** Full støtte for å opprette, redigere og slette.
- **Metadata:** Utvidet støtte for Campus, Roller, og Lenker.

### Data
- **Real World Data:** Importert datasett for 2025.

---

## 3. Neste Steg (Fase 4)

- **4.1 Varsling / Abonnement:** Mulighet til å laste ned `.ics` fil for kalenderen.
- **4.2 Bilde/Ikon-støtte:** Legge til ikoner eller bilder på events.

## 4. Fremtidig Funksjonalitet

- **Integrasjoner:** Automatisk import fra eksterne systemer (FS).
- **Dark Mode:** Støtte for mørkt tema.

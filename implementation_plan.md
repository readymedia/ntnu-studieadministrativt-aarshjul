
# Implementasjonsplan: NTNU Årshjul (Vercel-ready)

Denne planen deler opp gjenstående arbeid i logiske faser.

---

## Fase 1: Databerikelse og Admin-forbedringer (Fullført)
- [x] **1.1 Støtte for lenker og vedlegg i Admin**
- [x] **1.2 Import av "Real World Data"**

---

## Fase 2: Forbedret Navigasjon og Filtrering (Fullført)
- [x] **2.1 Dybde-filtrering (Fakultet og Institutt)**
- [x] **2.2 Søkeforbedringer**

---

## Fase 3: Robusthet, Design og Vercel-klargjøring (Fullført)
- [x] **3.1 Designsystem-tilpasning & UU**
- [x] **3.2 Enkel Tilgangsstyring**

---

## Fase 4: Avanserte Funksjoner (Fullført)
- [x] **4.1 Varsling / Abonnement (.ics eksport)**
- [x] **4.2 Bilde/Ikon-støtte**

---

## Fase 5: UI/UX og Dark Mode (Fullført)
- [x] **5.1 Infrastruktur:** Konfigurere Tailwind og State for theming.
- [x] **5.2 Komponent-oppdatering:** Tilpasse alle visninger til mørkt tema.

---

## Fase 6: Mobiloptimalisering (Fullført)
- [x] **6.1 Responsiv Sidemeny:** Implementere collapsible sidebar/drawer for mobil.
- [x] **6.2 Kalendertilpasning:** Optimalisere `CalendarView` for touch/små skjermer.

---

## Fase 7: Datahåndtering & Tilpasning (Fullført)
- [x] **7.1 Bulk Import/Eksport:** Legge til verktøy i Admin for å hente ut og laste inn data (JSON).
- [x] **7.2 Bilde-støtte:** Utvide datamodell og UI for å vise bilder (URL) i EventModal.

---

## Fase 8: Integrasjons-forberedelser (Fullført)
- [x] **8.1 Integrasjons-UI:** Legge til menyvalg, konfigurasjonsskjemaer og statusvisning for FS, EpN og TP i Admin-panelet.

---

## Fase 9: Radial Årskalender (Klar for start)
Dette er en avansert visualisering som ikke erstatter, men supplerer de andre visningene.
- [ ] **9.1 Matematikk & Infrastruktur:** Implementere logikk for å konvertere datoer til vinkler (Polar coordinates) og oppsett av SVG-canvas.
- [ ] **9.2 Ring-logikk:** Bygge logikk for å generere konsentriske ringer dynamisk basert på aktive filtre (f.eks. en ring per Studieområde).
- [ ] **9.3 Rendering av Events:** Implementere tegning av `Arcs` (for perioder) og `Markers` (for frister) med korrekt fargekoding iht. Designsystemet.
- [ ] **9.4 Interaksjon:** Legge til Tooltips ved hover og gjenbruk av `EventModal` ved klikk. Implementere "Zoom/Fokus" funksjonalitet.
- [ ] **9.5 Integrasjon:** Legge til nytt menyvalg "Årshjul" i hovedmenyen og koble visningen mot `filteredEvents`.

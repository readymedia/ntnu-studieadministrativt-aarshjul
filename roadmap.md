
# Roadmap: NTNU Studieadministrativt Årshjul

**Versjon:** 1.1  
**Status:** Prototype Ferdigstilt (Klar for demo)

Dette dokumentet gir en oversikt over funksjonaliteten som er implementert i prototypen, samt forslag til videre løp for en eventuell produksjonssetting.

---

## 1. Nåværende Status
Prosjektet har nådd milepælen **"Ferdig Prototype"**. Alle kjernefunksjoner definert i kravspesifikasjonen for frontend er implementert, inkludert visuelle visninger, administrasjonsverktøy, data-import og informasjon om prosjektet.

---

## 2. Implementert Funksjonalitet (✅ Fullført)

### 👁️ Visning og Interaksjon
- [x] **Kalendervisning:** Responsiv "Gantt"-lignende tidslinje (Måned/Uke) med fargekoding per fagområde.
- [x] **Årshjul (Radial):** Interaktiv sirkulær visning som gir totaloversikt over året.
- [x] **Agenda:** Kronologisk listevisning gruppert på måneder.
- [x] **Filtrering:** Dynamisk filtrering på Rolle, Campus, Fagområde, Fakultet og Institutt.
- [x] **Søk:** Sanntidssøk i titler og beskrivelser.
- [x] **Responsivitet:** Tilpasset mobil, nettbrett og desktop (inkludert mobil-meny).
- [x] **Tema:** Støtte for Lyst (Light) og Mørkt (Dark) modus.

### ⚙️ Administrasjon ("Innsiden")
- [x] **Autentisering (Simulert):** Innlogging med ulike roller (Admin, Saksbehandler, Student) for å teste rettighetsstyring.
- [x] **CRUD:** Full støtte for å opprette, lese, oppdatere og slette hendelser.
- [x] **Excel Import:** Dra-og-slipp import av `.xlsx` filer med automatisk mapping av data.
- [x] **Backup:** Eksport og import av hele databasen som JSON.
- [x] **Hard Reset:** Funksjonalitet for å slette alle lokale data og starte på nytt.

### ℹ️ Informasjon og Dokumentasjon
- [x] **Om Prosjektet:** Egen modal som krediterer teamet (Andreas, Ida, Magnus) og forklarer prosjektets formål.
- [x] **Dokumentasjon:** Strukturert `README.md` som sentral portal, støttet av detaljerte planer.

---

## 3. Veien Videre (Future Scope)

For å ta denne løsningen fra prototype til produksjon hos NTNU, anbefales følgende steg:

### Fase A: Backend & Sikkerhet
*   Opprette et backend API (C# .NET / Node.js) for persistent lagring.
*   Erstatte `localStorage` med database (SQL/NoSQL).
*   Integrere **Feide** for ekte pålogging og tilgangsstyring.

### Fase B: Integrasjoner
*   Koble mot **FS (Felles Studentsystem)** API for å hente frister automatisk.
*   Koble mot **EpN (Emner på Nett)** for studieplan-data.
*   Koble mot **TP (Timeplan)** for eksamensdatoer.

### Fase C: Varsling
*   Implementere e-postvarsling eller push-notifikasjoner når frister nærmer seg (for abonnenter).


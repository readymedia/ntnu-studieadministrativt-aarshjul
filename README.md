
# NTNU Studieadministrativt Årshjul (Prototype)

![NTNU Logo](https://www.readymedia.no/NTNU/logo/NTNU_farge_barelogopng.png)

> **Versjon:** 1.0 (Post-MVP / Fase 10)  
> **Status:** Fullt fungerende interaktiv prototype

Dette prosjektet er en **Single Page Application (SPA)** utviklet for å visualisere og administrere studieadministrative frister, hendelser og perioder ved NTNU. Løsningen gir en helhetlig oversikt over studieåret og lar brukere filtrere informasjon basert på rolle, campus og fagområde.

---

## 📚 Dokumentasjons-portal

Her finner du detaljert informasjon om prosjektets status, planer og konfigurasjon:

| Dokument | Beskrivelse |
| :--- | :--- |
| [**🗺 Roadmap**](./roadmap.md) | Oversikt over implementerte funksjoner, status per fase og veien videre ("What's next"). |
| [**📋 Implementasjonsplan**](./implementation_plan.md) | Detaljert logg over fasene utviklingen har gått gjennom, fra oppsett til ferdig prototype. |
| [**⚙️ Metadata**](./metadata.json) | Prosjektdefinisjon og rettigheter brukt av WebContainer/miljøet. |
| [**📦 Package.json**](./package.json) | Oversikt over avhengigheter (dependencies) og scripts. |

---

## 🌟 Funksjonalitet

### For sluttbrukere ("Utsiden")
*   **Visningsmoduser:**
    *   📅 **Kalender:** Klassisk måned- og ukesvisning (Gantt-inspirert swimlanes).
    *   📝 **Agenda:** Kronologisk liste over hendelser gruppert på måned.
    *   ⭕ **Årshjul:** Radial/sirkulær visning av året for et overordnet blikk.
*   **Filtrering:** Dynamisk filtrering på Rolle (eks. Student, Saksbehandler), Campus (Gjøvik, Ålesund, Trondheim), Fakultet og Institutt.
*   **Detaljer:** Klikk på hendelser for å se utdypende beskrivelse, lenker, bilder og metadata.
*   **Eksport:** Mulighet for å laste ned utvalget som `.ics` fil (iCal) for import i Outlook/Google Calendar.
*   **Tema:** Støtte for både lyst og mørkt modus.

### For administratorer ("Innsiden")
*   **Simulert Innlogging:** Test løsningen med ulike brukerprofiler (Admin, Student, Fakultetsadmin) via profil-ikonet.
*   **Redigering:** Full CRUD (Create, Read, Update, Delete) funksjonalitet for hendelser.
*   **Dataverktøy:**
    *   📊 **Excel Import:** Dra-og-slipp import av `.xlsx` filer (følger definert mal).
    *   💾 **JSON Backup:** Eksporter og importer hele databasen som JSON.
    *   ⚠️ **Hard Reset:** Nullstill applikasjonen fullstendig til start-tilstand.

---

## 🛠 Teknisk Stack

Prosjektet er bygget med moderne webteknologier for høy ytelse og enkel vedlikeholdbarhet:

*   **Rammeverk:** [React 19](https://react.dev/) med [TypeScript](https://www.typescriptlang.org/).
*   **Byggverktøy:** [Vite](https://vitejs.dev/) (Rask HMR og bygging).
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS).
*   **Ikoner:** [Lucide React](https://lucide.dev/).
*   **Dato-håndtering:** [date-fns](https://date-fns.org/).
*   **Data-import:** [SheetJS (xlsx)](https://docs.sheetjs.com/) for Excel-parsing i nettleseren.

### Filstruktur
```bash
/
├── components/       # Alle React UI-komponenter
│   ├── AdminView.tsx     # Skjema og verktøy for redigering
│   ├── YearWheelView.tsx # SVG-basert årshjul-logikk
│   ├── CalendarView.tsx  # Tidslinje/Gantt-visning
│   └── ...
├── constants.tsx     # Statiske lister (Roller, Campus, Ikoner)
├── types.ts          # TypeScript definisjoner og Interfaces
├── utils.ts          # Hjelpefunksjoner (Dato-matte, SVG-beregning, ICS-generering)
├── initialData.ts    # Standard data-sett (Fallback data)
├── App.tsx           # Hovedkomponent og state-håndtering
└── index.html        # Entry point
```

---

## 🚀 Hvordan kjøre prosjektet

Siden dette er en standard Vite/React-applikasjon:

1.  **Installer avhengigheter:**
    ```bash
    npm install
    ```

2.  **Start utviklingsserver:**
    ```bash
    npm run dev
    ```
    Applikasjonen vil være tilgjengelig på `http://localhost:3000` (eller annen port vist i terminalen).

3.  **Bygg for produksjon:**
    ```bash
    npm run build
    ```

---

## 👥 Team og Kreditering

Dette prosjektet er et initiativ for å forbedre studiehverdagen og administrasjonen ved NTNU.

*   **Idé, Design og Konsept:**  
    Andreas Aarlott & Ida Eir Lauritzen
*   **Teknisk Utvikling & Implementasjon:**  
    Magnus Sæternes Lian

---

## ⚠️ Disclaimer (Prototype)

Denne applikasjonen er en **mockup/prototype**.
*   Data lagres i nettleserens `localStorage`.
*   Det er ingen backend-tilkobling mot faktiske NTNU-systemer (FS, EpN, TP) per nå.
*   Innlogging er simulert for demonstrasjonsformål.


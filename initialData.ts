
import { CalendarEvent } from './types';

/**
 * CENTRAL DATA BASE FOR ÅRSHJUL
 * Single source of truth.
 * Data imported from requirement specification (Excel dump).
 */
export const INITIAL_EVENTS: CalendarEvent[] = [
  // --- STUDIEPLANPROSESSEN ---
  {
    id: 'sp-etterarbeid',
    title: 'Etterarbeid EpN',
    description: 'Etterbehandling av data fra emnerevisjon utført i EpN for kommende studieår.',
    startDate: '2025-01-16',
    endDate: '2025-05-15',
    type: 'Period',
    area: 'Studieplanprosessen',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler', 'Emneansvarlig'],
    faculty: 'Enhet for FS og eksamen',
    isRecurring: true
  },
  {
    id: 'sp-fakultetsfrist',
    title: 'Fakultetsfrist EpN',
    description: 'Frist for fakultetene til å ferdigstille emner i EpN.',
    startDate: '2025-01-15',
    endDate: '2025-01-15',
    type: 'Deadline',
    area: 'Studieplanprosessen',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler'],
    isRecurring: true
  },
  {
    id: 'sp-nye-program',
    title: 'Frist for innmelding av nye studieprogram',
    description: 'Siste frist for å melde inn nye studieprogram.',
    startDate: '2025-08-15',
    endDate: '2025-08-15',
    type: 'Deadline',
    area: 'Studieplanprosessen',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler', 'Fellesadministrasjon'],
    isRecurring: true
  },
  {
    id: 'sp-utdanning-no',
    title: 'Frist tekster Utdanning.no',
    description: 'Frist for innsending av tekster til utdanning.no og StudyinNorway.',
    startDate: '2025-11-01',
    endDate: '2025-11-01',
    type: 'Deadline',
    area: 'Studieplanprosessen',
    campus: ['Hele NTNU'],
    roles: ['Fellesadministrasjon'],
    isRecurring: true
  },
  {
    id: 'sp-rekrutteringstekster',
    title: 'Oppdatering av rekrutteringstekster',
    description: 'Frist for oppdatering av rekrutteringstekster for Utdanning.no og StudyNorway.',
    startDate: '2025-10-27',
    endDate: '2025-10-31',
    type: 'Period',
    area: 'Studieplanprosessen',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler'],
    isRecurring: true
  },
  {
    id: 'sp-vesentlige-endringer',
    title: 'Frist vesentlige endringer EpN',
    description: 'Fakultetenes frist for vesentlige endringer: Nye emner, emner som utgår, emner som ikke skal undervises, emner som endrer undervisningssemester.',
    startDate: '2025-11-15',
    endDate: '2025-11-15',
    type: 'Deadline',
    area: 'Studieplanprosessen',
    campus: ['Hele NTNU'],
    roles: ['Emneansvarlig', 'Saksbehandler'],
    isRecurring: true
  },
  {
    id: 'sp-studieplaner',
    title: 'Frist studieplaner',
    description: 'Frist for ferdigstilling av studieplaner.',
    startDate: '2025-04-01',
    endDate: '2025-04-01',
    type: 'Deadline',
    area: 'Studieplanprosessen',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler'],
    isRecurring: true
  },
  {
    id: 'sp-epn-aapner',
    title: 'Åpning EpN',
    description: 'EpN åpner for redigering for kommende periode.',
    startDate: '2025-10-01',
    endDate: '2025-10-01',
    type: 'Event',
    area: 'Studieplanprosessen',
    campus: ['Hele NTNU'],
    roles: ['Emneansvarlig', 'Saksbehandler'],
    isRecurring: true
  },

  // --- SEMESTERSTART / REGISTRERING ---
  {
    id: 'sem-reg-host',
    title: 'Frist semesterregistrering HØST',
    description: 'Siste frist for semesterregistrering høst.',
    startDate: '2025-09-01',
    endDate: '2025-09-01',
    type: 'Deadline',
    area: 'Semesterstart',
    campus: ['Hele NTNU'],
    roles: ['Student'],
    isRecurring: true
  },
  {
    id: 'sem-reg-var',
    title: 'Frist semesterregistrering VÅR',
    description: 'Frist semesterregistrering og -betaling vår.',
    startDate: '2025-02-01',
    endDate: '2025-02-01',
    type: 'Deadline',
    area: 'Semesterstart',
    campus: ['Hele NTNU'],
    roles: ['Student'],
    isRecurring: true
  },
  {
    id: 'sem-start-aug',
    title: 'Studiestart / Semesterregistrering',
    description: 'Periode for studiestart og semesterregistrering.',
    startDate: '2025-08-12',
    endDate: '2025-08-30',
    type: 'Period',
    area: 'Semesterstart',
    campus: ['Hele NTNU'],
    roles: ['Student', 'Studieveileder'],
    isRecurring: true
  },
  {
    id: 'sem-insida',
    title: 'Innsidamelding til Studentene',
    description: 'Åpner for semesterregistrering og betaling 01.12.',
    startDate: '2025-11-24',
    endDate: '2025-11-24',
    type: 'Event',
    area: 'Semesterstart',
    campus: ['Hele NTNU'],
    roles: ['Fellesadministrasjon'],
    isRecurring: true
  },

  // --- EKSAMEN ---
  {
    id: 'eks-hoved-host',
    title: 'Hovedperiode eksamen HØST',
    description: 'Ordinær eksamensperiode for høstsemesteret.',
    startDate: '2025-11-20',
    endDate: '2025-12-20',
    type: 'Period',
    area: 'Eksamen',
    campus: ['Hele NTNU'],
    roles: ['Student'],
    isRecurring: true
  },
  {
    id: 'eks-hoved-var',
    title: 'Hovedperiode eksamen VÅR',
    description: 'Ordinær eksamensperiode for vårsemesteret (Merk: Datoer kan variere noe).',
    startDate: '2025-05-05',
    endDate: '2025-06-06',
    type: 'Period',
    area: 'Eksamen',
    campus: ['Hele NTNU'],
    roles: ['Student'],
    isRecurring: true
  },
  {
    id: 'eks-utsatt-som',
    title: 'Utsatt eksamen (SOM)',
    description: 'Vedtatt periode for utsatt eksamen (kont).',
    startDate: '2025-08-04',
    endDate: '2025-08-16',
    type: 'Period',
    area: 'Eksamen',
    campus: ['Hele NTNU'],
    roles: ['Student'],
    isRecurring: true
  },
  {
    id: 'eks-rom-var',
    title: 'Romplassering eksamen VÅR',
    description: 'Fordele studenter på rom og tid. Starter 1 uke før eksamensperioden.',
    startDate: '2025-04-28',
    endDate: '2025-06-07',
    type: 'Period',
    area: 'Eksamen',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler'],
    isRecurring: false
  },
  {
    id: 'eks-rom-host',
    title: 'Romplassering eksamen HØST',
    description: 'Fordele studenter på rom og tid. Starter 1 uke før eksamensperioden.',
    startDate: '2025-11-13',
    endDate: '2025-12-20',
    type: 'Period',
    area: 'Eksamen',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler'],
    isRecurring: false
  },
  {
    id: 'eks-tilrettelegging-var',
    title: 'Frist tilrettelegging eksamen',
    description: 'Frist for å søke om tilrettelegging av eksamen (Vår).',
    startDate: '2025-02-15',
    endDate: '2025-02-15',
    type: 'Deadline',
    area: 'Eksamen',
    campus: ['Hele NTNU'],
    roles: ['Student'],
    isRecurring: true
  },
  {
    id: 'eks-oppmelding-host',
    title: 'Frist oppmelding eksamen HØST',
    description: 'Siste frist for oppmelding til eksamen.',
    startDate: '2025-09-15',
    endDate: '2025-09-15',
    type: 'Deadline',
    area: 'Eksamen',
    campus: ['Hele NTNU'],
    roles: ['Student'],
    isRecurring: true
  },

  // --- OPPTAK ---
  {
    id: 'opt-intma',
    title: 'INTMA Fase - Saksbehandling',
    description: 'Internasjonal master. Søknadsfrist EU 1. mars.',
    startDate: '2025-01-01',
    endDate: '2025-03-15',
    type: 'Period',
    area: 'Opptak',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler'],
    isRecurring: true
  },
  {
    id: 'opt-norskkurs',
    title: 'Opptaksfase - Norskkurs',
    description: 'Hovedopptak norskkurs - begynnelsen av januar.',
    startDate: '2025-01-01',
    endDate: '2025-01-26',
    type: 'Period',
    area: 'Opptak',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler'],
    isRecurring: true
  },
  {
    id: 'opt-phd-emner',
    title: 'Phd-emner - Saksbehandlerfase',
    description: 'Søknadsfrist 1. februar.',
    startDate: '2025-01-01',
    endDate: '2025-02-28',
    type: 'Period',
    area: 'Opptak',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler'],
    isRecurring: true
  },
  {
    id: 'opt-nom-hoved',
    title: 'Hovedopptak NOM (SO)',
    description: 'Publisering av hovedopptaket Samordna Opptak.',
    startDate: '2025-07-15',
    endDate: '2025-07-15',
    type: 'Event',
    area: 'Opptak',
    campus: ['Hele NTNU'],
    roles: ['Student', 'Saksbehandler'],
    isRecurring: true
  },
  {
    id: 'opt-lokale',
    title: 'Lokale opptak forberedelse',
    description: 'Forberedelse til lokale opptak.',
    startDate: '2025-01-15',
    endDate: '2025-01-31',
    type: 'Period',
    area: 'Opptak',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler'],
    isRecurring: true
  },
  {
    id: 'opt-soknadsfrist-so',
    title: 'Søknadsfrist Samordna Opptak',
    description: 'Frist for å søke høyere utdanning via Samordna Opptak.',
    startDate: '2025-04-15',
    endDate: '2025-04-15',
    type: 'Deadline',
    area: 'Opptak',
    campus: ['Hele NTNU'],
    roles: ['Student'],
    isRecurring: true
  },
  {
    id: 'opt-svarfrist-nom',
    title: 'Svarfrist NOM',
    description: 'Svarfrist for hovedopptaket.',
    startDate: '2025-07-25',
    endDate: '2025-07-25',
    type: 'Deadline',
    area: 'Opptak',
    campus: ['Hele NTNU'],
    roles: ['Student'],
    isRecurring: true
  },

  // --- INTERNASJONALISERING ---
  {
    id: 'int-asia',
    title: 'Utvekslingsfrist Asia',
    description: 'Frist utveksling til Asia for høstsemesteret.',
    startDate: '2025-01-25',
    endDate: '2025-01-31',
    type: 'Deadline',
    area: 'Internasjonalisering',
    campus: ['Hele NTNU'],
    roles: ['Student', 'Studieveileder'],
    isRecurring: true
  },
  {
    id: 'int-eaie',
    title: 'EAIE Konferanse',
    description: 'EAIE-konferansen 7.-10. september.',
    startDate: '2025-09-08',
    endDate: '2025-09-14',
    type: 'Event',
    area: 'Internasjonalisering',
    campus: ['Hele NTNU'],
    roles: ['Fellesadministrasjon'],
    isRecurring: true
  },
  {
    id: 'int-mottak',
    title: 'Mottak av internasjonale studenter (Vår)',
    description: 'Mottak av internasjonale studenter januar.',
    startDate: '2025-01-11',
    endDate: '2025-01-17',
    type: 'Period',
    area: 'Internasjonalisering',
    campus: ['Hele NTNU'],
    roles: ['Studieveileder'],
    isRecurring: true
  },
  {
    id: 'int-mottak-host',
    title: 'Mottak av internasjonale studenter (Høst)',
    description: 'Mottak og orienteringsuke august.',
    startDate: '2025-08-02',
    endDate: '2025-08-22',
    type: 'Period',
    area: 'Internasjonalisering',
    campus: ['Hele NTNU'],
    roles: ['Studieveileder'],
    isRecurring: true
  },
  {
    id: 'int-frist-ut-var',
    title: 'Frist utveksling VÅR',
    description: 'Frist for å søke utveksling for vårsemesteret.',
    startDate: '2025-09-15',
    endDate: '2025-09-15',
    type: 'Deadline',
    area: 'Internasjonalisering',
    campus: ['Hele NTNU'],
    roles: ['Student'],
    isRecurring: true
  },
  {
    id: 'int-frist-ut-host',
    title: 'Frist utveksling HØST',
    description: 'Frist for å søke utveksling for høstsemesteret.',
    startDate: '2025-02-01',
    endDate: '2025-02-01',
    type: 'Deadline',
    area: 'Internasjonalisering',
    campus: ['Hele NTNU'],
    roles: ['Student'],
    isRecurring: true
  },

  // --- ANNET / KURS ---
  {
    id: 'annet-fs-kurs-mar',
    title: 'FS-grunnkurs (Mars)',
    description: 'Grunnkurs i FS.',
    startDate: '2025-03-03',
    endDate: '2025-03-09',
    type: 'Period',
    area: 'Annet',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler'],
    isRecurring: false
  },
  {
    id: 'annet-fs-kurs-jun',
    title: 'FS-grunnkurs (Juni)',
    description: 'Grunnkurs i FS.',
    startDate: '2025-06-02',
    endDate: '2025-06-08',
    type: 'Period',
    area: 'Annet',
    campus: ['Hele NTNU'],
    roles: ['Saksbehandler'],
    isRecurring: false
  },
  {
    id: 'annet-kvalitet',
    title: 'Kvalitetsseminar',
    description: 'Kvalitetsseminar 22. og 23. oktober.',
    startDate: '2025-10-22',
    endDate: '2025-10-23',
    type: 'Event',
    area: 'Annet',
    campus: ['Hele NTNU'],
    roles: ['Fellesadministrasjon', 'Saksbehandler'],
    isRecurring: true
  },
  {
    id: 'annet-studiebarometer',
    title: 'Studiebarometeret',
    description: 'Slipp av resultater fra Studiebarometeret.',
    startDate: '2025-02-11',
    endDate: '2025-02-11',
    type: 'Event',
    area: 'Annet',
    campus: ['Hele NTNU'],
    roles: ['Fellesadministrasjon'],
    isRecurring: true
  }
];

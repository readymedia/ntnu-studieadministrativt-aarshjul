
import { BranchingMetadata, AcademicArea, UserRole, Campus } from './types';

export const BRANCHING_DATA: BranchingMetadata = {
  cities: [
    {
      id: 'trd',
      name: 'Trondheim',
      faculties: [
        {
          id: 'ie',
          name: 'Fakultet for informasjonsteknologi og elektroteknikk',
          institutes: [
            { id: 'idi', name: 'Institutt for datateknologi og informatikk' },
            { id: 'iel', name: 'Institutt for elkraftteknikk' }
          ]
        },
        {
          id: 'økonomi',
          name: 'Fakultet for økonomi',
          institutes: [
            { id: 'iot', name: 'Institutt for industriell økonomi og teknologiledelse' }
          ]
        }
      ]
    },
    {
      id: 'gjv',
      name: 'Gjøvik',
      faculties: [
        {
          id: 'ad',
          name: 'Fakultet for arkitektur og design',
          institutes: [
            { id: 'id-gjv', name: 'Institutt for design (Gjøvik)' }
          ]
        }
      ]
    },
    {
      id: 'als',
      name: 'Ålesund',
      faculties: [
        {
          id: 'nv',
          name: 'Fakultet for naturvitenskap',
          institutes: [
            { id: 'iba', name: 'Institutt for biologiske fag Ålesund' }
          ]
        }
      ]
    }
  ]
};

export const AREAS: AcademicArea[] = [
  'Opptak', 'Semesterstart', 'Eksamen', 'Emne- og porteføljearbeid', 'Internasjonalisering', 'Studieplanprosessen', 'Annet'
];

export const ROLES: UserRole[] = [
  'Saksbehandler', 'Studieveileder', 'Emneansvarlig', 'Fellesadministrasjon', 'Student'
];

export const CAMPUSES: Campus[] = ['Trondheim', 'Gjøvik', 'Ålesund', 'Hele NTNU'];

export const AVAILABLE_ICONS = [
  'Calendar', 
  'BookOpen', 
  'GraduationCap', 
  'Globe', 
  'FileText', 
  'AlertCircle', 
  'Clock', 
  'Award'
];

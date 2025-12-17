
export type EventType = 'Deadline' | 'Period' | 'Event';

export type AcademicArea = 
  | 'Opptak' 
  | 'Semesterstart' 
  | 'Eksamen' 
  | 'Emne- og porteføljearbeid' 
  | 'Internasjonalisering'
  | 'Studieplanprosessen'
  | 'Annet';

export type Campus = 'Trondheim' | 'Gjøvik' | 'Ålesund' | 'Hele NTNU';

export type UserRole = 
  | 'Saksbehandler' 
  | 'Studieveileder' 
  | 'Emneansvarlig' 
  | 'Fellesadministrasjon'
  | 'Student';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO format
  endDate: string;   // ISO format
  type: EventType;
  area: AcademicArea;
  campus: Campus[];
  roles: UserRole[];
  faculty?: string;
  institute?: string;
  links?: { title: string; url: string }[];
  isRecurring: boolean;
  updatedBy?: string;
  icon?: string; // New field for icon name
}

export interface FilterState {
  roles: UserRole[];
  areas: AcademicArea[];
  campuses: Campus[];
  faculties: string[];
  institutes: string[];
  search: string;
}

export interface BranchingMetadata {
  cities: {
    id: string;
    name: string;
    faculties: {
      id: string;
      name: string;
      institutes: { id: string; name: string }[];
    }[];
  }[];
}

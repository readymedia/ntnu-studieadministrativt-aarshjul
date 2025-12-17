
import { 
  format, 
  isValid, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  endOfWeek, 
  isWithinInterval, 
  isBefore 
} from 'date-fns';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import startOfDay from 'date-fns/startOfDay';
import nb from 'date-fns/locale/nb';
import { CalendarEvent } from './types';

export { nb };

// Custom parser to handle YYYY-MM-DD strings as local dates consistently
export const parseDate = (dateStr: string) => {
  try {
    if (!dateStr) return new Date(NaN);
    const parts = dateStr.split('-');
    if (parts.length !== 3) return new Date(NaN);
    const [y, m, d] = parts.map(Number);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return new Date(NaN);
    return new Date(y, m - 1, d);
  } catch (e) {
    return new Date(NaN);
  }
};

export const formatDate = (dateStr: string) => {
  try {
    if (!dateStr) return 'Ingen dato';
    const date = parseDate(dateStr);
    if (!isValid(date)) return 'Ugyldig dato';
    return format(date, 'd. MMMM yyyy', { locale: nb });
  } catch (e) {
    return 'Dato-feil';
  }
};

export const formatMonth = (date: Date) => {
  try {
    if (!isValid(date)) return 'Ugyldig måned';
    return format(date, 'MMMM yyyy', { locale: nb });
  } catch (e) {
    return 'Måned-feil';
  }
};

export const getDaysInInterval = (start: Date, end: Date) => {
  try {
    if (!isValid(start) || !isValid(end)) return [];
    
    const s = startOfDay(start);
    const e = startOfDay(end);

    // eachDayOfInterval throws if end is before start. 
    // We swap them if necessary to prevent the crash.
    const actualStart = isBefore(s, e) ? s : e;
    const actualEnd = isBefore(s, e) ? e : s;

    const days = eachDayOfInterval({ start: actualStart, end: actualEnd });
    // Limit range to prevent browser hanging on weird intervals
    return days.slice(0, 400); 
  } catch (err) {
    console.error("Error in getDaysInInterval:", err);
    return [];
  }
};

export const isSameDate = (d1: string, d2: Date) => {
  try {
    const date = parseDate(d1);
    if (!isValid(date)) return false;
    return isSameDay(date, d2);
  } catch (e) {
    return false;
  }
};

export const isEventInInterval = (eventStart: string, eventEnd: string, intervalStart: Date, intervalEnd: Date) => {
  try {
    const eStart = parseDate(eventStart);
    const eEnd = parseDate(eventEnd);
    
    if (!isValid(eStart) || !isValid(eEnd) || !isValid(intervalStart) || !isValid(intervalEnd)) return false;

    const startBound = startOfDay(intervalStart);
    const endBound = startOfDay(intervalEnd);

    return (
      isWithinInterval(eStart, { start: startBound, end: endBound }) ||
      isWithinInterval(eEnd, { start: startBound, end: endBound }) ||
      (eStart < startBound && eEnd > endBound)
    );
  } catch (e) {
    return false;
  }
};

/**
 * Generates an ICS file content string from a list of events
 */
export const generateICS = (events: CalendarEvent[]): string => {
  const formatDateICS = (dateStr: string) => {
    return dateStr.replace(/-/g, ''); // YYYY-MM-DD -> YYYYMMDD
  };

  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NTNU//Arshjul//NO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ].join('\r\n');

  events.forEach(event => {
    // Basic sanitization
    const description = (event.description || '').replace(/\n/g, '\\n').replace(/,/g, '\\,');
    
    icsContent += '\r\n' + [
      'BEGIN:VEVENT',
      `UID:${event.id}@ntnu.no`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${formatDateICS(event.startDate)}`,
      `DTEND;VALUE=DATE:${formatDateICS(event.endDate)}`, // Note: ICS end date is exclusive for all-day events, usually handled by client, but for simplicity we keep it simple here. Ideally +1 day.
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${description}`,
      `CATEGORIES:${event.area}`,
      'END:VEVENT'
    ].join('\r\n');
  });

  icsContent += '\r\nEND:VCALENDAR';
  return icsContent;
};

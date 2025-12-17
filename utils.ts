import { 
  format, 
  isValid, 
  eachDayOfInterval, 
  isSameDay, 
  isWithinInterval, 
  isBefore, 
  differenceInMilliseconds,
  endOfYear,
  addMonths, 
  addWeeks, 
  differenceInDays
} from 'date-fns';
import { nb } from 'date-fns/locale';
import { CalendarEvent } from './types';

export { nb };

// Helper function to replace missing startOfDay import
const startOfDay = (date: Date | number) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

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
    
    // eachDayOfInterval throws if end is before start. 
    // We swap them if necessary to prevent the crash.
    const actualStart = isBefore(start, end) ? start : end;
    const actualEnd = isBefore(start, end) ? end : start;

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
      `DTEND;VALUE=DATE:${formatDateICS(event.endDate)}`, 
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${description}`,
      `CATEGORIES:${event.area}`,
      'END:VEVENT'
    ].join('\r\n');
  });

  icsContent += '\r\nEND:VCALENDAR';
  return icsContent;
};

// --- RADIAL / POLAR MATH HELPER FUNCTIONS ---

export const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  // SVG coordinate system: 0 degrees is usually 3 o'clock. 
  // We want 0 degrees to be 12 o'clock (top), so we subtract 90 degrees.
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

export const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");

  return d;
};

export const describeDonutSector = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  // If full circle
  if (endAngle - startAngle >= 359.9) {
      return [
        "M", x, y - outerRadius,
        "A", outerRadius, outerRadius, 0, 1, 1, x, y + outerRadius,
        "A", outerRadius, outerRadius, 0, 1, 1, x, y - outerRadius,
        "M", x, y - innerRadius,
        "A", innerRadius, innerRadius, 0, 1, 0, x, y + innerRadius,
        "A", innerRadius, innerRadius, 0, 1, 0, x, y - innerRadius,
        "Z"
      ].join(" ");
  }

  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M", startOuter.x, startOuter.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    "L", endInner.x, endInner.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
    "Z"
  ].join(" ");

  return d;
};

export const dateToAngle = (date: Date, year: number) => {
  // startOfYear replacement
  const start = new Date(year, 0, 1);
  start.setHours(0,0,0,0);
  
  const end = endOfYear(new Date(year, 0, 1));
  const totalMs = differenceInMilliseconds(end, start);
  const elapsedMs = differenceInMilliseconds(date, start);
  
  // 360 degrees
  return (elapsedMs / totalMs) * 360;
};
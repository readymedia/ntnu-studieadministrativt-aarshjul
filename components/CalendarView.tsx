
import React, { useState, useMemo } from 'react';
import { CalendarEvent, AcademicArea } from '../types';
import { AREAS } from '../constants';
import { 
  format, 
  addMonths, 
  endOfMonth, 
  endOfWeek, 
  addWeeks, 
  isSameDay, 
  differenceInDays, 
  isValid
} from 'date-fns';
import { nb, getDaysInInterval, isEventInInterval, parseDate } from '../utils'; 
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

type ZoomLevel = 'month' | 'week';

// Local date helpers to replace missing date-fns imports
const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfMonth = (date: Date) => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfWeek = (date: Date, options: { weekStartsOn: number }) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < options.weekStartsOn ? 7 : 0) + day - options.weekStartsOn;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectEvent }) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date(2025, 0, 15);
    return isValid(d) ? d : new Date();
  }); 
  const [zoom, setZoom] = useState<ZoomLevel>('month');

  const { start, end, days } = useMemo(() => {
    try {
      if (!isValid(currentDate)) {
        const fallback = new Date();
        return { start: fallback, end: fallback, days: [] };
      }

      let s: Date, e: Date;
      if (zoom === 'month') {
        s = startOfMonth(currentDate);
        e = endOfMonth(currentDate);
      } else {
        // Use weekStartsOn: 1 (Monday) and local week calculations
        s = startOfWeek(currentDate, { weekStartsOn: 1 });
        e = endOfWeek(currentDate, { weekStartsOn: 1 });
      }
      
      const dayList = getDaysInInterval(s, e);
      return { start: s, end: e, days: dayList };
    } catch (err) {
      console.error("Critical error in date calculation:", err);
      const fallback = new Date();
      return { start: fallback, end: fallback, days: [] };
    }
  }, [currentDate, zoom]);

  const navigate = (direction: number) => {
    setCurrentDate(prev => {
      try {
        if (!isValid(prev)) return new Date();
        if (zoom === 'month') return addMonths(prev, direction);
        return addWeeks(prev, direction);
      } catch (e) {
        return new Date();
      }
    });
  };

  const getEventStyle = (event: CalendarEvent) => {
    try {
      const eStart = parseDate(event.startDate);
      const eEnd = parseDate(event.endDate);
      
      if (!isValid(eStart) || !isValid(eEnd) || !isValid(start) || !isValid(end)) return null;

      const displayStart = eStart < start ? start : eStart;
      const displayEnd = eEnd > end ? end : eEnd;
      
      const startOffset = Math.max(0, differenceInDays(startOfDay(displayStart), startOfDay(start)));
      const duration = Math.max(1, differenceInDays(startOfDay(displayEnd), startOfDay(displayStart)) + 1);
      
      const colors: Record<AcademicArea, string> = {
        'Opptak': 'bg-blue-500 dark:bg-blue-600',
        'Semesterstart': 'bg-green-500 dark:bg-green-600',
        'Eksamen': 'bg-red-500 dark:bg-red-600',
        'Emne- og porteføljearbeid': 'bg-purple-500 dark:bg-purple-600',
        'Internasjonalisering': 'bg-orange-500 dark:bg-orange-600',
        'Studieplanprosessen': 'bg-cyan-600 dark:bg-cyan-700',
        'Annet': 'bg-gray-500 dark:bg-gray-600'
      };

      return {
        gridColumnStart: startOffset + 1,
        gridColumnEnd: `span ${duration}`,
        colorClass: colors[event.area] || 'bg-gray-500 dark:bg-gray-600'
      };
    } catch (e) {
      return null;
    }
  };

  const visibleEvents = useMemo(() => {
    if (!isValid(start) || !isValid(end)) return [];
    return events.filter(e => isEventInInterval(e.startDate, e.endDate, start, end));
  }, [events, start, end]);

  // Optimized column width for mobile vs desktop
  const gridTemplateColumns = days.length > 0 
    ? `repeat(${days.length}, minmax(45px, 1fr))` 
    : '1fr';

  // Safe formatting helper to prevent UI crash
  const getHeaderTitle = () => {
    try {
      if (!isValid(currentDate)) return "Velg dato";
      // Use 'I' for ISO week to be more stable than 'w'
      return format(currentDate, zoom === 'month' ? 'MMMM yyyy' : "'Uke' I, MMM", { locale: nb });
    } catch (e) {
      return "Oversikt";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[65vh] md:h-[70vh] transition-colors duration-200">
      {/* Calendar Header - Optimized for mobile */}
      <div className="p-2 md:p-4 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 bg-gray-50/50 dark:bg-slate-900/50">
        
        <div className="flex w-full md:w-auto items-center justify-between gap-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 capitalize truncate flex-1 md:flex-none">
            {getHeaderTitle()}
          </h2>
          
          <div className="flex bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-0.5 shadow-sm shrink-0">
            <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-gray-600 dark:text-gray-400">
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())} 
              className="px-2 text-xs font-bold text-[#00509e] dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
            >
              I dag
            </button>
            <button onClick={() => navigate(1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-gray-600 dark:text-gray-400">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex w-full md:w-auto bg-gray-200/50 dark:bg-slate-800 p-0.5 md:p-1 rounded-lg">
          <button 
            onClick={() => setZoom('month')}
            className={`flex-1 md:flex-none px-3 md:px-4 py-1.5 rounded-md text-xs font-bold transition-all ${zoom === 'month' ? 'bg-white dark:bg-slate-700 text-[#00509e] dark:text-blue-300 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Måned
          </button>
          <button 
            onClick={() => setZoom('week')}
            className={`flex-1 md:flex-none px-3 md:px-4 py-1.5 rounded-md text-xs font-bold transition-all ${zoom === 'week' ? 'bg-white dark:bg-slate-700 text-[#00509e] dark:text-blue-300 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Uke
          </button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-x-auto overflow-y-auto relative bg-white dark:bg-slate-900 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
        {days.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 gap-2 p-12 text-center">
            <AlertCircle size={48} className="text-red-300 dark:text-red-900" />
            <div>
              <p className="font-bold text-gray-600 dark:text-gray-400">Visningsfeil</p>
              <p className="text-sm">Kunne ikke beregne tidsperioden. Vennligst prøv å gå tilbake til "I dag".</p>
            </div>
          </div>
        ) : (
          <div className="min-w-fit">
            {/* Header row */}
            <div 
              className="grid border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-30 shadow-sm"
              style={{ gridTemplateColumns }}
            >
              {days.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`border-r border-gray-100 dark:border-slate-800 p-2 text-center flex flex-col items-center justify-center ${
                    isSameDay(day, new Date()) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <span className="text-[9px] md:text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">
                    {format(day, 'EEE', { locale: nb })}
                  </span>
                  <span className={`text-xs md:text-sm font-black ${isSameDay(day, new Date()) ? 'text-[#00509e] dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                    {format(day, 'd')}
                  </span>
                </div>
              ))}
            </div>

            {/* Swimlanes */}
            {visibleEvents.length === 0 ? (
              <div className="p-12 text-center text-gray-400 dark:text-gray-600 text-sm italic">Ingen hendelser i denne perioden</div>
            ) : (
              <div className="flex flex-col">
                {AREAS.map(area => {
                  const areaEvents = visibleEvents.filter(e => e.area === area);
                  if (areaEvents.length === 0) return null;

                  return (
                    <div key={area} className="flex flex-col">
                      <div className="bg-gray-50/90 dark:bg-slate-900/90 px-2 md:px-4 py-1 text-[9px] md:text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest border-y border-gray-100 dark:border-slate-800 sticky left-0 z-20 flex items-center gap-2 backdrop-blur-sm w-fit md:w-full rounded-r-md md:rounded-none shadow-sm md:shadow-none my-1 md:my-0">
                         <div className={`w-2 h-2 rounded-full shrink-0 ${getEventStyle(areaEvents[0])?.colorClass || 'bg-gray-300'}`} />
                        {area}
                      </div>
                      
                      <div 
                        className="grid relative min-h-[44px] border-b border-gray-50 dark:border-slate-800/50 py-2"
                        style={{ gridTemplateColumns }}
                      >
                        {/* Vertical Lines */}
                        {days.map((_, i) => (
                          <div 
                            key={i} 
                            className="border-r border-gray-100/50 dark:border-slate-800/40 h-full absolute top-0 pointer-events-none" 
                            style={{ 
                              left: days.length > 0 ? `${(i / days.length) * 100}%` : '0%', 
                              width: '1px' 
                            }} 
                          />
                        ))}

                        {/* Events */}
                        {areaEvents.map(event => {
                          const style = getEventStyle(event);
                          if (!style) return null;
                          const isDeadline = event.type === 'Deadline' && isSameDay(parseDate(event.startDate), parseDate(event.endDate));

                          return (
                            <div
                              key={event.id}
                              onClick={() => onSelectEvent(event)}
                              style={{ 
                                gridColumnStart: style.gridColumnStart, 
                                gridColumnEnd: style.gridColumnEnd 
                              }}
                              className={`
                                relative h-8 my-1 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 group z-10 mx-1
                                ${isDeadline ? 'flex justify-center items-center' : ''}
                              `}
                            >
                              {isDeadline ? (
                                <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${style.colorClass} border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center`}>
                                  <div className="w-1 h-1 bg-white rounded-full" />
                                </div>
                              ) : (
                                <div className={`w-full h-full rounded-lg ${style.colorClass} opacity-90 hover:opacity-100 shadow-sm flex items-center px-2 md:px-3 overflow-hidden border border-black/10`}>
                                  <span className="text-[9px] md:text-[10px] font-black text-white whitespace-nowrap overflow-hidden text-ellipsis tracking-tight shadow-sm">
                                    {event.title}
                                  </span>
                                </div>
                              )}

                              {/* Tooltip - adjusted for touch/mobile */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 md:w-56 bg-gray-900 dark:bg-black text-white p-2 md:p-3 rounded-xl hidden group-hover:block z-50 pointer-events-none shadow-2xl border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[9px] font-black uppercase text-white/50">{event.type}</span>
                                  <div className={`w-2 h-2 rounded-full ${style.colorClass}`} />
                                </div>
                                <div className="font-bold text-xs md:text-sm mb-1">{event.title}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-2 md:p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex flex-wrap gap-2 md:gap-4 justify-center">
        {AREAS.map(area => {
          const colors: Record<string, string> = {
            'Opptak': 'bg-blue-500 dark:bg-blue-600',
            'Semesterstart': 'bg-green-500 dark:bg-green-600',
            'Eksamen': 'bg-red-500 dark:bg-red-600',
            'Emne- og porteføljearbeid': 'bg-purple-500 dark:bg-purple-600',
            'Internasjonalisering': 'bg-orange-500 dark:bg-orange-600',
            'Studieplanprosessen': 'bg-cyan-600 dark:bg-cyan-700',
            'Annet': 'bg-gray-500 dark:bg-gray-600'
          };
          return (
            <div key={area} className="flex items-center gap-1.5 md:gap-2 bg-gray-50 dark:bg-slate-800 px-2 md:px-3 py-1 rounded-full border border-gray-100 dark:border-slate-700">
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${colors[area]}`} />
              <span className="text-[8px] md:text-[9px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-tighter">{area}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;

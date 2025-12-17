
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
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import startOfDay from 'date-fns/startOfDay';
import { nb, getDaysInInterval, isEventInInterval, parseDate } from '../utils'; 
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

type ZoomLevel = 'month' | 'week';

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
        'Opptak': 'bg-blue-500',
        'Semesterstart': 'bg-green-500',
        'Eksamen': 'bg-red-500',
        'Emne- og porteføljearbeid': 'bg-purple-500',
        'Internasjonalisering': 'bg-orange-500',
        'Studieplanprosessen': 'bg-cyan-600',
        'Annet': 'bg-gray-500'
      };

      return {
        gridColumnStart: startOffset + 1,
        gridColumnEnd: `span ${duration}`,
        colorClass: colors[event.area] || 'bg-gray-500'
      };
    } catch (e) {
      return null;
    }
  };

  const visibleEvents = useMemo(() => {
    if (!isValid(start) || !isValid(end)) return [];
    return events.filter(e => isEventInInterval(e.startDate, e.endDate, start, end));
  }, [events, start, end]);

  const gridTemplateColumns = days.length > 0 
    ? `repeat(${days.length}, minmax(60px, 1fr))` 
    : '1fr';

  // Safe formatting helper to prevent UI crash
  const getHeaderTitle = () => {
    try {
      if (!isValid(currentDate)) return "Velg dato";
      // Use 'I' for ISO week to be more stable than 'w'
      return format(currentDate, zoom === 'month' ? 'MMMM yyyy' : "'Uke' I, MMMM yyyy", { locale: nb });
    } catch (e) {
      return "Oversikt";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[70vh]">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800 capitalize w-64 truncate">
            {getHeaderTitle()}
          </h2>
          <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600">
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())} 
              className="px-3 text-xs font-bold text-[#00509e] hover:bg-gray-100 rounded transition-colors"
            >
              I dag
            </button>
            <button onClick={() => navigate(1)} className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex bg-gray-200/50 p-1 rounded-lg">
          <button 
            onClick={() => setZoom('month')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${zoom === 'month' ? 'bg-white text-[#00509e] shadow-sm' : 'text-gray-600'}`}
          >
            Måned
          </button>
          <button 
            onClick={() => setZoom('week')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${zoom === 'week' ? 'bg-white text-[#00509e] shadow-sm' : 'text-gray-600'}`}
          >
            Uke
          </button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-auto relative">
        {days.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 p-12 text-center">
            <AlertCircle size={48} className="text-red-300" />
            <div>
              <p className="font-bold text-gray-600">Visningsfeil</p>
              <p className="text-sm">Kunne ikke beregne tidsperioden. Vennligst prøv å gå tilbake til "I dag".</p>
            </div>
          </div>
        ) : (
          <div className="min-w-fit">
            {/* Header row */}
            <div 
              className="grid border-b border-gray-100 sticky top-0 bg-white z-30"
              style={{ gridTemplateColumns }}
            >
              {days.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`border-r border-gray-100 p-2 text-center flex flex-col items-center justify-center ${
                    isSameDay(day, new Date()) ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-gray-500">
                    {format(day, 'EEE', { locale: nb })}
                  </span>
                  <span className={`text-sm font-black ${isSameDay(day, new Date()) ? 'text-[#00509e]' : 'text-gray-800'}`}>
                    {format(day, 'd')}
                  </span>
                </div>
              ))}
            </div>

            {/* Swimlanes */}
            {visibleEvents.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm italic">Ingen hendelser i denne perioden</div>
            ) : (
              <div className="flex flex-col">
                {AREAS.map(area => {
                  const areaEvents = visibleEvents.filter(e => e.area === area);
                  if (areaEvents.length === 0) return null;

                  return (
                    <div key={area} className="flex flex-col">
                      <div className="bg-gray-50/80 px-4 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-y border-gray-100 sticky left-0 z-20 flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${getEventStyle(areaEvents[0])?.colorClass || 'bg-gray-300'}`} />
                        {area}
                      </div>
                      
                      <div 
                        className="grid relative min-h-[44px] border-b border-gray-50 py-2"
                        style={{ gridTemplateColumns }}
                      >
                        {/* Vertical Lines */}
                        {days.map((_, i) => (
                          <div 
                            key={i} 
                            className="border-r border-gray-100/50 h-full absolute top-0 pointer-events-none" 
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
                                <div className={`w-5 h-5 rounded-full ${style.colorClass} border-2 border-white shadow-md flex items-center justify-center`}>
                                  <div className="w-1 h-1 bg-white rounded-full" />
                                </div>
                              ) : (
                                <div className={`w-full h-full rounded-lg ${style.colorClass} opacity-90 hover:opacity-100 shadow-sm flex items-center px-3 overflow-hidden border border-black/10`}>
                                  <span className="text-[10px] font-black text-white whitespace-nowrap overflow-hidden text-ellipsis tracking-tight">
                                    {event.title}
                                  </span>
                                </div>
                              )}

                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900 text-white p-3 rounded-xl hidden group-hover:block z-50 pointer-events-none shadow-2xl border border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-black uppercase text-white/50">{event.type}</span>
                                  <div className={`w-2 h-2 rounded-full ${style.colorClass}`} />
                                </div>
                                <div className="font-bold text-sm mb-1">{event.title}</div>
                                <div className="text-[10px] opacity-70 leading-relaxed line-clamp-3 italic">
                                  {event.description || 'Ingen beskrivelse'}
                                </div>
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

      <div className="p-3 bg-white border-t border-gray-100 flex flex-wrap gap-4 justify-center">
        {AREAS.map(area => {
          const colors: Record<string, string> = {
            'Opptak': 'bg-blue-500',
            'Semesterstart': 'bg-green-500',
            'Eksamen': 'bg-red-500',
            'Emne- og porteføljearbeid': 'bg-purple-500',
            'Internasjonalisering': 'bg-orange-500',
            'Studieplanprosessen': 'bg-cyan-600',
            'Annet': 'bg-gray-500'
          };
          return (
            <div key={area} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <div className={`w-2 h-2 rounded-full ${colors[area]}`} />
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{area}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;


import React from 'react';
import { CalendarEvent } from '../types';
import { formatDate, parseDate, nb } from '../utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, BookOpen, GraduationCap, Globe, FileText, AlertCircle, Award } from 'lucide-react';

interface AgendaViewProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

// Helper to render icon by name
const IconDisplay = ({ name, size = 18, className = "" }: { name?: string, size?: number, className?: string }) => {
  const icons: any = { Calendar: CalendarIcon, BookOpen, GraduationCap, Globe, FileText, AlertCircle, Clock, Award };
  const Icon = (name && icons[name]) ? icons[name] : CalendarIcon;
  return <Icon size={size} className={className} />;
};

const AgendaView: React.FC<AgendaViewProps> = ({ events, onSelectEvent }) => {
  const sortedEvents = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));
  
  const groupedEvents: Record<string, CalendarEvent[]> = sortedEvents.reduce((acc, event) => {
    const month = format(parseDate(event.startDate), 'MMMM yyyy', { locale: nb });
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
        <CalendarIcon size={48} className="mb-4 opacity-20" />
        <p>Ingen hendelser funnet for de valgte filtrene.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {Object.entries(groupedEvents).map(([month, monthEvents]) => (
        <div key={month} className="space-y-4">
          <h2 className="text-xl font-bold text-[#00509e] dark:text-blue-400 sticky top-0 bg-gray-50/95 dark:bg-slate-950/95 py-2 z-10 capitalize border-b border-gray-200 dark:border-slate-800 transition-colors duration-200">
            {month}
          </h2>
          <div className="space-y-3">
            {monthEvents.map(event => (
              <div 
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4"
              >
                <div className="flex flex-col items-center justify-center min-w-[60px] h-fit bg-gray-50 dark:bg-slate-800 rounded-lg p-2 transition-colors duration-200">
                  <span className="text-xs uppercase text-gray-600 dark:text-gray-400 font-bold">
                    {format(parseDate(event.startDate), 'MMM', { locale: nb })}
                  </span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white">
                    {format(parseDate(event.startDate), 'd')}
                  </span>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {event.icon && (
                        <div className="text-[#00509e] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 p-1 rounded-md transition-colors duration-200">
                          <IconDisplay name={event.icon} size={16} />
                        </div>
                      )}
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{event.title}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                      event.type === 'Deadline' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 
                      event.type === 'Period' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <Clock size={12} />
                      <span>{formatDate(event.startDate)} {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <MapPin size={12} />
                      <span>{event.campus.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgendaView;

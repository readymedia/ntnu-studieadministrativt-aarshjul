
import React from 'react';
import { CalendarEvent } from '../types';
import { formatDate, parseDate, nb } from '../utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

interface AgendaViewProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

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
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <CalendarIcon size={48} className="mb-4 opacity-20" />
        <p>Ingen hendelser funnet for de valgte filtrene.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {Object.entries(groupedEvents).map(([month, monthEvents]) => (
        <div key={month} className="space-y-4">
          <h2 className="text-xl font-bold text-[#00509e] sticky top-0 bg-gray-50/95 py-2 z-10 capitalize border-b border-gray-200">
            {month}
          </h2>
          <div className="space-y-3">
            {monthEvents.map(event => (
              <div 
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-4"
              >
                <div className="flex flex-col items-center justify-center min-w-[60px] h-fit bg-gray-50 rounded-lg p-2">
                  <span className="text-xs uppercase text-gray-600 font-bold">
                    {format(parseDate(event.startDate), 'MMM', { locale: nb })}
                  </span>
                  <span className="text-2xl font-black text-gray-900">
                    {format(parseDate(event.startDate), 'd')}
                  </span>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{event.title}</h3>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      event.type === 'Deadline' ? 'bg-red-100 text-red-700' : 
                      event.type === 'Period' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                      <Clock size={12} />
                      <span>{formatDate(event.startDate)} {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
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

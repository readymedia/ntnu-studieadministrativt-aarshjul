
import React from 'react';
import { CalendarEvent } from '../types';
import { formatDate } from '../utils';
import { X, Calendar, MapPin, Users, Tag, Info, Link as LinkIcon, Edit } from 'lucide-react';

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  isAuthenticated?: boolean;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose, onEdit, isAuthenticated }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#00509e] p-8 text-white relative">
          <div className="flex justify-between items-start mb-4">
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm`}>
              {event.type}
            </span>
            <div className="flex gap-2">
              {isAuthenticated && onEdit && (
                <button 
                  onClick={() => onEdit(event)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                  title="Rediger hendelse"
                >
                  <Edit size={20} />
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                title="Lukk"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <h2 className="text-3xl font-black leading-tight mb-2">{event.title}</h2>
          <div className="flex items-center gap-2 text-white/90 font-medium">
            <Calendar size={18} />
            <span>{formatDate(event.startDate)} {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}</span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#00509e] font-bold uppercase text-xs tracking-widest">
              <Info size={14} />
              Beskrivelse
            </div>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {event.description || 'Ingen beskrivelse tilgjengelig for dette elementet.'}
            </p>
          </section>

          <div className="grid grid-cols-2 gap-8 py-6 border-y border-gray-100">
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                <MapPin size={12} />
                Campus
              </div>
              <div className="flex flex-wrap gap-1">
                {event.campus.map(c => (
                  <span key={c} className="text-sm font-medium text-gray-900">{c}</span>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                <Users size={12} />
                Målgruppe
              </div>
              <div className="flex flex-wrap gap-1">
                {event.roles.length > 0 ? (
                   event.roles.map(r => (
                    <span key={r} className="text-sm font-medium text-gray-900">{r}</span>
                  ))
                ) : (
                  <span className="text-sm italic text-gray-500">Alle roller</span>
                )}
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                <Tag size={12} />
                Fagområde
              </div>
              <span className="text-sm font-medium text-gray-900">{event.area}</span>
            </section>

            {(event.faculty || event.institute) && (
              <section className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                  <Layers size={12} />
                  Enhet
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {event.faculty} {event.institute && ` / ${event.institute}`}
                </div>
              </section>
            )}
          </div>

          {event.links && event.links.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-[#00509e] font-bold uppercase text-xs tracking-widest">
                <LinkIcon size={14} />
                Ressurser og lenker
              </div>
              <div className="space-y-2">
                {event.links.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#00509e] hover:underline font-medium"
                  >
                    <LinkIcon size={12} />
                    {link.title}
                  </a>
                ))}
              </div>
            </section>
          )}

          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              Lukk oversikt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layers = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

export default EventModal;

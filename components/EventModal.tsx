
import React from 'react';
import { CalendarEvent } from '../types';
import { formatDate } from '../utils';
import { X, Calendar, MapPin, Users, Tag, Info, Link as LinkIcon, Edit, BookOpen, GraduationCap, Globe, FileText, AlertCircle, Clock, Award, Layers } from 'lucide-react';

interface EventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  isAuthenticated?: boolean;
}

// Helper to render icon by name
const IconDisplay = ({ name, size = 18, className = "" }: { name?: string, size?: number, className?: string }) => {
  const icons: any = { Calendar, BookOpen, GraduationCap, Globe, FileText, AlertCircle, Clock, Award };
  const Icon = (name && icons[name]) ? icons[name] : Calendar;
  return <Icon size={size} className={className} />;
};

const EventModal: React.FC<EventModalProps> = ({ event, onClose, onEdit, isAuthenticated }) => {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="bg-[#00509e] dark:bg-slate-950 p-8 text-white relative shrink-0">
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
          
          <div className="flex items-start gap-4">
            {event.icon && (
               <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                 <IconDisplay name={event.icon} size={32} className="text-white" />
               </div>
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-black leading-tight mb-2">{event.title}</h2>
              <div className="flex items-center gap-2 text-white/90 font-medium">
                <Calendar size={18} />
                <span>{formatDate(event.startDate)} {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[#00509e] dark:text-blue-400 font-bold uppercase text-xs tracking-widest">
              <Info size={14} />
              Beskrivelse
            </div>
            <p className="text-gray-800 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {event.description || 'Ingen beskrivelse tilgjengelig for dette elementet.'}
            </p>
          </section>

          <div className="grid grid-cols-2 gap-8 py-6 border-y border-gray-100 dark:border-slate-800">
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                <MapPin size={12} />
                Campus
              </div>
              <div className="flex flex-wrap gap-1">
                {event.campus.map(c => (
                  <span key={c} className="text-sm font-medium text-gray-900 dark:text-gray-100">{c}</span>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                <Users size={12} />
                Målgruppe
              </div>
              <div className="flex flex-wrap gap-1">
                {event.roles.length > 0 ? (
                   event.roles.map(r => (
                    <span key={r} className="text-sm font-medium text-gray-900 dark:text-gray-100">{r}</span>
                  ))
                ) : (
                  <span className="text-sm italic text-gray-500 dark:text-gray-400">Alle roller</span>
                )}
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                <Tag size={12} />
                Fagområde
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.area}</span>
            </section>

            {(event.faculty || event.institute) && (
              <section className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                  <Layers size={12} />
                  Enhet
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {event.faculty} {event.institute && ` / ${event.institute}`}
                </div>
              </section>
            )}
          </div>

          {event.links && event.links.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-[#00509e] dark:text-blue-400 font-bold uppercase text-xs tracking-widest">
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
                    className="flex items-center gap-2 text-sm text-[#00509e] dark:text-blue-400 hover:underline font-medium"
                  >
                    <LinkIcon size={12} />
                    {link.title}
                  </a>
                ))}
              </div>
            </section>
          )}

          <div className="flex justify-end shrink-0">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-gray-900 dark:bg-slate-800 text-white rounded-xl font-bold hover:bg-black dark:hover:bg-slate-700 transition-colors"
            >
              Lukk oversikt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;

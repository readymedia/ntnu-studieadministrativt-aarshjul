
import React, { useState, useEffect, useMemo } from 'react';
import { CalendarEvent, FilterState, AcademicArea, UserRole, Campus } from './types';
import { INITIAL_EVENTS } from './initialData';
import Sidebar from './components/Sidebar';
import AgendaView from './components/AgendaView';
import CalendarView from './components/CalendarView';
import AdminView from './components/AdminView';
import EventModal from './components/EventModal';
import { Search, Calendar as CalendarIcon, List, Plus, Bell, Lock, LogOut } from 'lucide-react';

/**
 * ARCHITECTURAL GUIDELINE:
 * All academic data is managed centrally in this component's `events` state.
 * Any new view or component MUST use the `filteredEvents` or `events` passed down from here.
 * This ensures 100% data consistency across Agenda, Calendar, Admin and any future modules.
 */

type ViewMode = 'Agenda' | 'Calendar' | 'Admin';

const App: React.FC = () => {
  // Central Data Store with LocalStorage persistence
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('ntnu_aarshjul_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('Agenda');
  const [filters, setFilters] = useState<FilterState>({
    roles: [],
    areas: [],
    campuses: [],
    faculties: [],
    institutes: [],
    search: ''
  });

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<CalendarEvent | null>(null);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Persistence side-effect
  useEffect(() => {
    localStorage.setItem('ntnu_aarshjul_events', JSON.stringify(events));
  }, [events]);

  // Central filtering logic - used by ALL views
  const filteredEvents = useMemo(() => {
    const term = filters.search.toLowerCase();
    
    return events.filter(event => {
      const matchSearch = event.title.toLowerCase().includes(term) ||
                          event.description.toLowerCase().includes(term) ||
                          (event.faculty && event.faculty.toLowerCase().includes(term)) ||
                          (event.institute && event.institute.toLowerCase().includes(term));
      
      const matchRole = filters.roles.length === 0 || 
                        event.roles.length === 0 || 
                        filters.roles.some(r => event.roles.includes(r));
      
      const matchArea = filters.areas.length === 0 || 
                        filters.areas.includes(event.area);
      
      const matchCampus = filters.campuses.length === 0 || 
                          event.campus.includes('Hele NTNU') || 
                          filters.campuses.some(c => event.campus.includes(c));

      const matchFaculty = filters.faculties.length === 0 ||
                           (event.faculty && filters.faculties.includes(event.faculty));

      const matchInstitute = filters.institutes.length === 0 ||
                             (event.institute && filters.institutes.includes(event.institute));

      return matchSearch && matchRole && matchArea && matchCampus && matchFaculty && matchInstitute;
    });
  }, [events, filters]);

  // Central data mutation handlers
  const handleSaveEvent = (event: CalendarEvent) => {
    setEvents(prev => {
      const index = prev.findIndex(e => e.id === event.id);
      if (index !== -1) {
        const next = [...prev];
        next[index] = event;
        return next;
      }
      return [...prev, event];
    });
    setIsEditing(false);
    setEditTarget(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Er du sikker på at du vil slette dette elementet? Dette vil fjerne det fra alle visninger.')) {
      setEvents(prev => prev.filter(e => e.id !== id));
      setIsEditing(false);
      setEditTarget(null);
    }
  };

  const handleEditRequest = (event: CalendarEvent) => {
    setSelectedEvent(null);
    setEditTarget(event);
    setIsEditing(true);
  };

  const handleLogin = () => {
    const pwd = prompt("Skriv inn passord for å redigere (hint: ntnu):");
    if (pwd === "ntnu") {
      setIsAuthenticated(true);
    } else if (pwd !== null) {
      alert("Feil passord.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsEditing(false);
    setEditTarget(null);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Navigation / Sidebar - Shared filters across all views */}
      <Sidebar filters={filters} setFilters={setFilters} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-6 sticky top-0 z-30 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#00509e] flex items-center gap-2 tracking-tight">
                NTNU Årshjul
              </h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Studieadministrativ oversikt</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00509e] transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Søk (tittel, fakultet...)"
                  className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-[#00509e] transition-all w-full md:w-64 outline-none text-gray-700 placeholder-gray-500"
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>

              <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
                <button 
                  onClick={() => setViewMode('Agenda')}
                  className={`p-2 rounded-full transition-all flex items-center gap-2 px-4 ${viewMode === 'Agenda' ? 'bg-white shadow text-[#00509e] font-bold' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <List size={18} />
                  <span className="text-xs">Agenda</span>
                </button>
                <button 
                  onClick={() => setViewMode('Calendar')}
                  className={`p-2 rounded-full transition-all flex items-center gap-2 px-4 ${viewMode === 'Calendar' ? 'bg-white shadow text-[#00509e] font-bold' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <CalendarIcon size={18} />
                  <span className="text-xs">Kalender</span>
                </button>
              </div>

              <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>

              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => {
                      setEditTarget(null);
                      setIsEditing(true);
                    }}
                    className="bg-[#00509e] text-white p-2 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2 px-4 shadow-sm"
                  >
                    <Plus size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider">Legg til</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    title="Logg ut"
                  >
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="text-gray-500 hover:text-[#00509e] p-2 rounded-full transition-colors flex items-center gap-2"
                >
                  <Lock size={18} />
                  <span className="text-xs font-bold uppercase hidden md:inline">Logg inn</span>
                </button>
              )}
              
              <button className="p-2 text-gray-500 hover:text-[#00509e] transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic View Section - Always consumes from the Central Filtered State */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {isEditing && isAuthenticated ? (
              <AdminView 
                onSave={handleSaveEvent} 
                onDelete={handleDeleteEvent}
                editingEvent={editTarget}
                onClose={() => {
                  setIsEditing(false);
                  setEditTarget(null);
                }}
              />
            ) : viewMode === 'Agenda' ? (
              <AgendaView 
                events={filteredEvents} 
                onSelectEvent={(e) => setSelectedEvent(e)} 
              />
            ) : (
              <CalendarView 
                events={filteredEvents} 
                onSelectEvent={(e) => setSelectedEvent(e)} 
              />
            )}
          </div>
        </div>
      </main>

      {/* Central Detail Modal */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)}
          onEdit={handleEditRequest}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};

export default App;


import React, { useState, useEffect, useMemo } from 'react';
import { CalendarEvent, FilterState, AcademicArea, UserRole, Campus, UserProfile } from './types';
import { INITIAL_EVENTS } from './initialData';
import { generateICS } from './utils';
import Sidebar from './components/Sidebar';
import AgendaView from './components/AgendaView';
import CalendarView from './components/CalendarView';
import YearWheelView from './components/YearWheelView';
import AdminView from './components/AdminView';
import EventModal from './components/EventModal';
import LoginModal from './components/LoginModal';
import ProfileView, { DUMMY_USERS } from './components/ProfileView';
import AboutModal from './components/AboutModal';
import { Search, Calendar as CalendarIcon, List, Plus, Bell, Lock, LogOut, Download, Sun, Moon, Menu, CircleDashed, User, Info } from 'lucide-react';

type ViewMode = 'Agenda' | 'Calendar' | 'YearWheel' | 'Admin' | 'Profile';

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
  
  // Auth state - Now using full User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('ntnu_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  
  // New State for About Modal
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ntnu_theme') === 'dark';
  });

  // Theme effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ntnu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ntnu_theme', 'light');
    }
  }, [isDarkMode]);

  // Persistence side-effect
  useEffect(() => {
    localStorage.setItem('ntnu_aarshjul_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ntnu_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ntnu_user');
    }
  }, [currentUser]);

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

  const handleBulkImport = (newEvents: CalendarEvent[]) => {
    // Replaces ALL events
    setEvents(newEvents);
    setIsEditing(false);
  };

  const handleHardReset = () => {
    if (confirm('ADVARSEL: Er du helt sikker? Dette sletter alle data i systemet.')) {
      setEvents([]); // Or reset to INITIAL_EVENTS if preferred, but user said "sletter alt"
      localStorage.removeItem('ntnu_aarshjul_events');
      setIsEditing(false);
    }
  };

  const handleEditRequest = (event: CalendarEvent) => {
    setSelectedEvent(null);
    setEditTarget(event);
    setIsEditing(true);
  };

  const handleLogin = () => {
    // Default to Admin on simple login
    setCurrentUser(DUMMY_USERS[0]); 
    setShowLoginModal(false);
    setViewMode('Profile'); // Redirect to profile to see status
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewMode('Agenda');
    setIsEditing(false);
  };

  const handleDownloadICS = () => {
    const icsContent = generateICS(filteredEvents);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ntnu_arshjul_eksport.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-200">
      {/* Navigation / Sidebar - Shared filters across all views */}
      <Sidebar 
        filters={filters} 
        setFilters={setFilters} 
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 md:p-6 sticky top-0 z-30 shadow-sm transition-colors duration-200">
          <div className="flex flex-col gap-4">
            
            {/* Top Row: Title and Mobile Toggle */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <Menu size={24} />
                </button>
                
                {/* Logo and Title Group */}
                <div className="flex items-center gap-3 md:gap-5">
                  <div className="relative h-8 md:h-10 w-auto flex items-center">
                    {/* Light Mode Logo */}
                    <img 
                      src="https://www.readymedia.no/NTNU/logo/NTNU_farge_barelogopng.png" 
                      alt="NTNU" 
                      className="h-full w-auto block dark:hidden" 
                    />
                    {/* Dark Mode Logo */}
                    <img 
                      src="https://www.readymedia.no/NTNU/logo/NTNU_farge_barelogopng.png" 
                      alt="NTNU" 
                      className="h-full w-auto hidden dark:block brightness-0 invert" 
                    />
                  </div>

                  <div className="h-8 w-[1px] bg-gray-200 dark:bg-slate-700 hidden sm:block"></div>

                  <div>
                    <h1 className="text-lg md:text-xl font-black text-[#00509e] dark:text-blue-400 tracking-tight leading-none">
                      Årshjul
                    </h1>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest hidden sm:block mt-0.5">
                      Studieadministrativ oversikt
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Right side) */}
              <div className="flex items-center gap-2">
                 
                 {/* About Button */}
                 <button 
                  onClick={() => setShowAboutModal(true)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#00509e] dark:hover:text-blue-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                  title="Om prosjektet"
                >
                  <Info size={20} />
                </button>

                 <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#00509e] dark:hover:text-blue-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                  title={isDarkMode ? "Bytt til lyst modus" : "Bytt til mørkt modus"}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                {currentUser ? (
                  <button 
                    onClick={() => setViewMode('Profile')}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all"
                    title="Min profil"
                  >
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full" />
                    <span className="text-xs font-bold hidden md:inline">{currentUser.name.split(' ')[0]}</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="text-gray-500 hover:text-[#00509e] dark:hover:text-blue-400 p-2 rounded-full transition-colors flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    <Lock size={18} />
                    <span className="text-xs font-bold uppercase hidden md:inline">Logg inn</span>
                  </button>
                )}
              </div>
            </div>

            {/* Second Row: Search and View Toggles */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative group w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00509e] dark:group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Søk (tittel, fakultet...)"
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 dark:text-white border-none rounded-full text-sm focus:ring-2 focus:ring-[#00509e] dark:focus:ring-blue-500 transition-all w-full md:w-64 outline-none text-gray-700 placeholder-gray-500"
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-full border border-gray-200 dark:border-slate-700 flex-shrink-0">
                  <button 
                    onClick={() => setViewMode('Agenda')}
                    className={`p-2 rounded-full transition-all flex items-center gap-2 px-4 ${viewMode === 'Agenda' ? 'bg-white dark:bg-slate-700 shadow text-[#00509e] dark:text-blue-300 font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                  >
                    <List size={18} />
                    <span className="text-xs">Agenda</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('Calendar')}
                    className={`p-2 rounded-full transition-all flex items-center gap-2 px-4 ${viewMode === 'Calendar' ? 'bg-white dark:bg-slate-700 shadow text-[#00509e] dark:text-blue-300 font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                  >
                    <CalendarIcon size={18} />
                    <span className="text-xs">Kalender</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('YearWheel')}
                    className={`p-2 rounded-full transition-all flex items-center gap-2 px-4 ${viewMode === 'YearWheel' ? 'bg-white dark:bg-slate-700 shadow text-[#00509e] dark:text-blue-300 font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                  >
                    <CircleDashed size={18} />
                    <span className="text-xs">Årshjul</span>
                  </button>
                </div>

                <div className="h-8 w-[1px] bg-gray-200 dark:bg-slate-700 mx-2 hidden md:block"></div>
                
                <button 
                  onClick={handleDownloadICS}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#00509e] dark:hover:text-blue-400 transition-colors flex-shrink-0"
                  title="Last ned filtrert utvalg som .ics"
                >
                  <Download size={20} />
                </button>

                {currentUser?.permissions.canEdit && (
                  <button 
                    onClick={() => {
                      setEditTarget(null);
                      setIsEditing(true);
                    }}
                    className="bg-[#00509e] text-white p-2 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2 px-4 shadow-sm flex-shrink-0"
                  >
                    <Plus size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Legg til</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Section */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto h-full">
            {isEditing && currentUser?.permissions.canEdit ? (
              <AdminView 
                onSave={handleSaveEvent} 
                onDelete={handleDeleteEvent}
                onBulkImport={handleBulkImport}
                onHardReset={handleHardReset}
                editingEvent={editTarget}
                allEvents={events} 
                onClose={() => {
                  setIsEditing(false);
                  setEditTarget(null);
                }}
              />
            ) : viewMode === 'Profile' ? (
              <ProfileView 
                currentUser={currentUser} 
                onSwitchUser={(user) => setCurrentUser(user)}
                onLogout={handleLogout}
                onClose={() => setViewMode('Agenda')}
              />
            ) : viewMode === 'Agenda' ? (
              <AgendaView 
                events={filteredEvents} 
                onSelectEvent={(e) => setSelectedEvent(e)} 
              />
            ) : viewMode === 'YearWheel' ? (
              <YearWheelView
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

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal 
            onLogin={handleLogin}
            onClose={() => setShowLoginModal(false)}
          />
        )}
        
        {/* About Modal */}
        {showAboutModal && (
          <AboutModal 
            onClose={() => setShowAboutModal(false)}
          />
        )}
      </main>

      {/* Central Detail Modal */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)}
          onEdit={handleEditRequest}
          isAuthenticated={currentUser?.permissions.canEdit}
        />
      )}
    </div>
  );
};

export default App;

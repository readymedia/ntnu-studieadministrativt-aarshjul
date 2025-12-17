
import React, { useMemo } from 'react';
import { ROLES, AREAS, CAMPUSES, BRANCHING_DATA } from '../constants';
import { FilterState, UserRole, AcademicArea, Campus } from '../types';
import { Filter, Users, MapPin, Layers, Building, GraduationCap, X } from 'lucide-react';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, isOpen, onClose }) => {
  const toggleRole = (role: UserRole) => {
    setFilters(prev => ({
      ...prev,
      roles: prev.roles.includes(role) 
        ? prev.roles.filter(r => r !== role) 
        : [...prev.roles, role]
    }));
  };

  const toggleArea = (area: AcademicArea) => {
    setFilters(prev => ({
      ...prev,
      areas: prev.areas.includes(area) 
        ? prev.areas.filter(a => a !== area) 
        : [...prev.areas, area]
    }));
  };

  const toggleCampus = (campus: Campus) => {
    setFilters(prev => ({
      ...prev,
      campuses: prev.campuses.includes(campus) 
        ? prev.campuses.filter(c => c !== campus) 
        : [...prev.campuses, campus],
      // Clear lower-level filters when changing campus to avoid confusion
      faculties: [],
      institutes: []
    }));
  };

  const toggleFaculty = (facultyName: string) => {
    setFilters(prev => ({
      ...prev,
      faculties: prev.faculties.includes(facultyName)
        ? prev.faculties.filter(f => f !== facultyName)
        : [...prev.faculties, facultyName],
      // Clear institutes if parent faculty changes might affect them
      institutes: []
    }));
  };

  const toggleInstitute = (instituteName: string) => {
    setFilters(prev => ({
      ...prev,
      institutes: prev.institutes.includes(instituteName)
        ? prev.institutes.filter(i => i !== instituteName)
        : [...prev.institutes, instituteName]
    }));
  };

  // Derive available Faculties based on selected Campus
  const availableFaculties = useMemo(() => {
    const relevantCities = filters.campuses.length === 0
      ? BRANCHING_DATA.cities // Show all if no campus selected
      : BRANCHING_DATA.cities.filter(city => filters.campuses.includes(city.name as Campus));
    
    return relevantCities.flatMap(city => city.faculties);
  }, [filters.campuses]);

  // Derive available Institutes based on selected Faculties
  const availableInstitutes = useMemo(() => {
    const relevantFaculties = filters.faculties.length === 0
      ? availableFaculties
      : availableFaculties.filter(fac => filters.faculties.includes(fac.name));
      
    return relevantFaculties.flatMap(fac => fac.institutes);
  }, [availableFaculties, filters.faculties]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 
        transform transition-transform duration-300 ease-in-out h-full overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:block
      `}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#00509e] dark:text-blue-400 font-bold text-lg">
            <Filter size={20} />
            <h2>Filtrering</h2>
          </div>
          <button 
            onClick={onClose} 
            className="md:hidden p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <section>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
            <Users size={16} />
            <span>Roller</span>
          </div>
          <div className="space-y-2">
            {ROLES.map(role => (
              <label key={role} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-slate-800 p-1 rounded transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#00509e] focus:ring-[#00509e] dark:bg-slate-700 dark:border-slate-600"
                  checked={filters.roles.includes(role)}
                  onChange={() => toggleRole(role)}
                />
                <span className={`text-sm ${filters.roles.includes(role) ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                  {role}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
            <Layers size={16} />
            <span>Områder</span>
          </div>
          <div className="space-y-2">
            {AREAS.map(area => (
              <label key={area} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-slate-800 p-1 rounded transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#00509e] focus:ring-[#00509e] dark:bg-slate-700 dark:border-slate-600"
                  checked={filters.areas.includes(area)}
                  onChange={() => toggleArea(area)}
                />
                <span className={`text-sm ${filters.areas.includes(area) ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                  {area}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
            <MapPin size={16} />
            <span>Campus</span>
          </div>
          <div className="space-y-2">
            {CAMPUSES.map(campus => (
              <label key={campus} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-slate-800 p-1 rounded transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#00509e] focus:ring-[#00509e] dark:bg-slate-700 dark:border-slate-600"
                  checked={filters.campuses.includes(campus)}
                  onChange={() => toggleCampus(campus)}
                />
                <span className={`text-sm ${filters.campuses.includes(campus) ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                  {campus}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* DYNAMIC FILTERS: Faculty */}
        {availableFaculties.length > 0 && (
          <section className="animate-in slide-in-from-left-2 duration-300">
             <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 border-t pt-4 border-gray-100 dark:border-slate-800">
              <Building size={16} />
              <span>Fakultet</span>
            </div>
            <div className="space-y-2">
              {availableFaculties.map(fac => (
                <label key={fac.id} className="flex items-start gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-slate-800 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#00509e] focus:ring-[#00509e] mt-0.5 dark:bg-slate-700 dark:border-slate-600"
                    checked={filters.faculties.includes(fac.name)}
                    onChange={() => toggleFaculty(fac.name)}
                  />
                  <span className={`text-sm leading-tight ${filters.faculties.includes(fac.name) ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                    {fac.name}
                  </span>
                </label>
              ))}
            </div>
          </section>
        )}

        {/* DYNAMIC FILTERS: Institute */}
        {availableInstitutes.length > 0 && (
          <section className="animate-in slide-in-from-left-2 duration-300">
             <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 border-t pt-4 border-gray-100 dark:border-slate-800">
              <GraduationCap size={16} />
              <span>Institutt</span>
            </div>
            <div className="space-y-2">
              {availableInstitutes.map(inst => (
                <label key={inst.id} className="flex items-start gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-slate-800 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#00509e] focus:ring-[#00509e] mt-0.5 dark:bg-slate-700 dark:border-slate-600"
                    checked={filters.institutes.includes(inst.name)}
                    onChange={() => toggleInstitute(inst.name)}
                  />
                  <span className={`text-sm leading-tight ${filters.institutes.includes(inst.name) ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                    {inst.name}
                  </span>
                </label>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Sidebar;

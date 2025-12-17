
import React, { useMemo } from 'react';
import { ROLES, AREAS, CAMPUSES, BRANCHING_DATA } from '../constants';
import { FilterState, UserRole, AcademicArea, Campus } from '../types';
import { Filter, Users, MapPin, Layers, Building, GraduationCap } from 'lucide-react';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters }) => {
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
    // If no faculty is selected, show institutes from available faculties (derived from campus)
    // OR show nothing? Usually show nothing or all. Let's show all available based on campus.
    const relevantFaculties = filters.faculties.length === 0
      ? availableFaculties
      : availableFaculties.filter(fac => filters.faculties.includes(fac.name));
      
    return relevantFaculties.flatMap(fac => fac.institutes);
  }, [availableFaculties, filters.faculties]);

  return (
    <div className="w-full md:w-72 bg-white border-r border-gray-200 h-screen overflow-y-auto p-6 space-y-8 sticky top-0 scrollbar-thin scrollbar-thumb-gray-200">
      <div className="flex items-center gap-2 text-[#00509e] font-bold text-lg mb-4">
        <Filter size={20} />
        <h2>Filtrering</h2>
      </div>

      <section>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          <Users size={16} />
          <span>Roller</span>
        </div>
        <div className="space-y-2">
          {ROLES.map(role => (
            <label key={role} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#00509e] focus:ring-[#00509e]"
                checked={filters.roles.includes(role)}
                onChange={() => toggleRole(role)}
              />
              <span className={`text-sm ${filters.roles.includes(role) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                {role}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          <Layers size={16} />
          <span>Områder</span>
        </div>
        <div className="space-y-2">
          {AREAS.map(area => (
            <label key={area} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#00509e] focus:ring-[#00509e]"
                checked={filters.areas.includes(area)}
                onChange={() => toggleArea(area)}
              />
              <span className={`text-sm ${filters.areas.includes(area) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                {area}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          <MapPin size={16} />
          <span>Campus</span>
        </div>
        <div className="space-y-2">
          {CAMPUSES.map(campus => (
            <label key={campus} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#00509e] focus:ring-[#00509e]"
                checked={filters.campuses.includes(campus)}
                onChange={() => toggleCampus(campus)}
              />
              <span className={`text-sm ${filters.campuses.includes(campus) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                {campus}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* DYNAMIC FILTERS: Faculty */}
      {availableFaculties.length > 0 && (
        <section className="animate-in slide-in-from-left-2 duration-300">
           <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 border-t pt-4 border-gray-100">
            <Building size={16} />
            <span>Fakultet</span>
          </div>
          <div className="space-y-2">
            {availableFaculties.map(fac => (
              <label key={fac.id} className="flex items-start gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#00509e] focus:ring-[#00509e] mt-0.5"
                  checked={filters.faculties.includes(fac.name)}
                  onChange={() => toggleFaculty(fac.name)}
                />
                <span className={`text-sm leading-tight ${filters.faculties.includes(fac.name) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
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
           <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 border-t pt-4 border-gray-100">
            <GraduationCap size={16} />
            <span>Institutt</span>
          </div>
          <div className="space-y-2">
            {availableInstitutes.map(inst => (
              <label key={inst.id} className="flex items-start gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#00509e] focus:ring-[#00509e] mt-0.5"
                  checked={filters.institutes.includes(inst.name)}
                  onChange={() => toggleInstitute(inst.name)}
                />
                <span className={`text-sm leading-tight ${filters.institutes.includes(inst.name) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  {inst.name}
                </span>
              </label>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Sidebar;

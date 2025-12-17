
import React, { useState } from 'react';
import { CalendarEvent, AcademicArea, UserRole, Campus, EventType } from '../types';
import { BRANCHING_DATA, AREAS, ROLES, CAMPUSES } from '../constants';
import { Save, Trash2, X, PlusCircle, Link as LinkIcon, Plus, Check } from 'lucide-react';

interface AdminViewProps {
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  editingEvent?: CalendarEvent | null;
  onClose: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onSave, onDelete, editingEvent, onClose }) => {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'Deadline',
    area: 'Annet',
    campus: [],
    roles: [],
    links: [],
    isRecurring: false,
    ...editingEvent
  });

  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
  
  // Local state for adding new links
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Handle branching logic selections
  const selectedCity = BRANCHING_DATA.cities.find(c => c.id === selectedCityId);
  const faculties = selectedCity?.faculties || [];
  const selectedFaculty = faculties.find(f => f.id === selectedFacultyId);
  const institutes = selectedFaculty?.institutes || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert('Vennligst fyll ut alle påkrevde felt (tittel, startdato og sluttdato).');
      return;
    }
    
    // Ensure lists are initialized
    const finalEvent = {
      ...formData,
      campus: formData.campus?.length ? formData.campus : ['Hele NTNU'], // Default fallback
      roles: formData.roles || [],
      links: formData.links || [],
      id: formData.id || Math.random().toString(36).substr(2, 9),
      faculty: selectedFaculty?.name || formData.faculty,
      institute: formData.institute
    } as CalendarEvent;

    onSave(finalEvent);
  };

  const handleAddLink = () => {
    if (!linkTitle || !linkUrl) return;
    
    // Simple URL validation prefix
    let formattedUrl = linkUrl;
    if (!/^https?:\/\//i.test(linkUrl)) {
      formattedUrl = 'https://' + linkUrl;
    }

    setFormData(prev => ({
      ...prev,
      links: [...(prev.links || []), { title: linkTitle, url: formattedUrl }]
    }));
    setLinkTitle('');
    setLinkUrl('');
  };

  const handleRemoveLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links?.filter((_, i) => i !== index)
    }));
  };

  const toggleSelection = <T extends string>(
    item: T, 
    currentList: T[] | undefined, 
    field: 'campus' | 'roles'
  ) => {
    const list = currentList || [];
    const newList = list.includes(item)
      ? list.filter(i => i !== item)
      : [...list, item];
    setFormData(prev => ({ ...prev, [field]: newList }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-4xl mx-auto my-8 flex flex-col max-h-[90vh]">
      <div className="bg-[#00509e] text-white p-6 flex justify-between items-center flex-shrink-0">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {editingEvent ? 'Rediger element' : 'Opprett nytt element'}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-gray-700">Tittel *</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00509e] outline-none"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="F.eks. Frist for oppmelding til eksamen"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-gray-700">Beskrivelse</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-[#00509e] outline-none"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Utfyllende informasjon om hendelsen..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Startdato *</label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00509e] outline-none"
              value={formData.startDate}
              onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Sluttdato *</label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00509e] outline-none"
              value={formData.endDate}
              onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Type</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00509e] outline-none"
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as EventType }))}
            >
              <option value="Deadline">Frist (Deadline)</option>
              <option value="Period">Periode</option>
              <option value="Event">Hendelse (Event)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Område</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00509e] outline-none"
              value={formData.area}
              onChange={e => setFormData(prev => ({ ...prev, area: e.target.value as AcademicArea }))}
            >
              {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
            </select>
          </div>
        </div>

        {/* Target Audience (Campuses & Roles) */}
        <div className="grid md:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 block">Campus (Hvor gjelder dette?)</label>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
              {CAMPUSES.map(campus => (
                <label key={campus} className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    formData.campus?.includes(campus) ? 'bg-[#00509e] border-[#00509e]' : 'bg-white border-gray-300'
                  }`}>
                    {formData.campus?.includes(campus) && <Check size={14} className="text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.campus?.includes(campus)}
                    onChange={() => toggleSelection(campus, formData.campus, 'campus')}
                  />
                  <span className="text-sm text-gray-700">{campus}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 block">Målgruppe (Hvem er dette for?)</label>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
              {ROLES.map(role => (
                <label key={role} className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors">
                   <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    formData.roles?.includes(role) ? 'bg-[#00509e] border-[#00509e]' : 'bg-white border-gray-300'
                  }`}>
                    {formData.roles?.includes(role) && <Check size={14} className="text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.roles?.includes(role)}
                    onChange={() => toggleSelection(role, formData.roles, 'roles')}
                  />
                  <span className="text-sm text-gray-700">{role}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Links & Resources */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <LinkIcon size={16} />
            Ressurser og lenker
          </label>
          
          <div className="flex flex-col md:flex-row gap-3">
            <input
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00509e] outline-none"
              placeholder="Lenketittel (f.eks. 'Les mer på Innsida')"
              value={linkTitle}
              onChange={e => setLinkTitle(e.target.value)}
            />
            <input
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00509e] outline-none"
              placeholder="URL (https://...)"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddLink}
              disabled={!linkTitle || !linkUrl}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={16} />
              Legg til
            </button>
          </div>

          {formData.links && formData.links.length > 0 && (
            <div className="space-y-2 mt-2">
              {formData.links.map((link, idx) => (
                <div key={idx} className="flex items-center justify-between bg-blue-50 p-2 rounded-lg border border-blue-100">
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-[#00509e] hover:underline flex items-center gap-2 font-medium">
                    <LinkIcon size={12} />
                    {link.title}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(idx)}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Organizational Branching */}
        <div className="bg-gray-50 p-6 rounded-xl space-y-6 border border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <PlusCircle size={18} className="text-[#00509e]" />
            Organisatorisk tilhørighet (Metadata)
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Bruk feltene under kun hvis fristen gjelder spesifikt for en enhet.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Studieby</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                value={selectedCityId}
                onChange={e => {
                  setSelectedCityId(e.target.value);
                  setSelectedFacultyId('');
                }}
              >
                <option value="">Velg by...</option>
                {BRANCHING_DATA.cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Fakultet</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
                disabled={!selectedCityId}
                value={selectedFacultyId}
                onChange={e => setSelectedFacultyId(e.target.value)}
              >
                <option value="">Velg fakultet...</option>
                {faculties.map(fac => (
                  <option key={fac.id} value={fac.id}>{fac.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Institutt</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
                disabled={!selectedFacultyId}
                value={formData.institute}
                onChange={e => setFormData(prev => ({ ...prev, institute: e.target.value }))}
              >
                <option value="">Velg institutt...</option>
                {institutes.map(inst => (
                  <option key={inst.id} value={inst.name}>{inst.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex gap-2">
            {editingEvent && (
              <button
                type="button"
                onClick={() => onDelete(editingEvent.id)}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors"
              >
                <Trash2 size={20} />
                Slett
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-[#00509e] text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              <Save size={20} />
              Lagre endringer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminView;

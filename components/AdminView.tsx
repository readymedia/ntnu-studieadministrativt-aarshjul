
import React, { useState } from 'react';
import { CalendarEvent, AcademicArea, UserRole, Campus, EventType } from '../types';
import { BRANCHING_DATA, AREAS, ROLES, CAMPUSES, AVAILABLE_ICONS } from '../constants';
import { Save, Trash2, X, PlusCircle, Link as LinkIcon, Plus, Check, Calendar, BookOpen, GraduationCap, Globe, FileText, AlertCircle, Clock, Award, Upload, Download, Database, Image as ImageIcon, Server, RefreshCw, Power, Settings, CheckCircle } from 'lucide-react';

interface AdminViewProps {
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  onBulkImport: (events: CalendarEvent[]) => void;
  editingEvent?: CalendarEvent | null;
  allEvents: CalendarEvent[];
  onClose: () => void;
}

// Helper to render icon by name
const IconDisplay = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => {
  const icons: any = { Calendar, BookOpen, GraduationCap, Globe, FileText, AlertCircle, Clock, Award };
  const Icon = icons[name] || Calendar;
  return <Icon size={size} className={className} />;
};

interface IntegrationState {
  status: 'idle' | 'syncing' | 'connected' | 'error';
  lastSynced: string | null;
  configOpen: boolean;
  apiUrl: string;
  apiKey: string;
}

const AdminView: React.FC<AdminViewProps> = ({ onSave, onDelete, onBulkImport, editingEvent, allEvents, onClose }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'tools' | 'integrations'>('edit');
  const [importJson, setImportJson] = useState('');
  
  // Enhanced mock state for integrations
  const [integrations, setIntegrations] = useState<Record<string, IntegrationState>>({
    'fs': { status: 'idle', lastSynced: null, configOpen: false, apiUrl: 'https://api.fs.no/v1', apiKey: '' },
    'epn': { status: 'idle', lastSynced: null, configOpen: false, apiUrl: 'https://epn.ntnu.no/api', apiKey: '' },
    'tp': { status: 'idle', lastSynced: null, configOpen: false, apiUrl: 'https://tp.ntnu.no/ws', apiKey: '' }
  });

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
    imageUrl: '',
    isRecurring: false,
    icon: 'Calendar',
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

  const handleDownloadJson = () => {
    const jsonString = JSON.stringify(allEvents, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ntnu_arshjul_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (Array.isArray(parsed)) {
        onBulkImport(parsed);
      } else {
        alert('Ugyldig format. JSON må være en liste med hendelser.');
      }
    } catch (e) {
      alert('Kunne ikke lese JSON. Sjekk formatet.');
    }
  };

  const toggleConfig = (system: string) => {
    setIntegrations(prev => ({
      ...prev,
      [system]: { ...prev[system], configOpen: !prev[system].configOpen }
    }));
  };

  const updateConfig = (system: string, field: 'apiUrl' | 'apiKey', value: string) => {
    setIntegrations(prev => ({
      ...prev,
      [system]: { ...prev[system], [field]: value }
    }));
  };

  // Mock function to simulate API sync
  const handleSimulateSync = (system: string) => {
    setIntegrations(prev => ({ ...prev, [system]: { ...prev[system], status: 'syncing' } }));
    
    setTimeout(() => {
      const now = new Date();
      const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      setIntegrations(prev => ({ 
        ...prev, 
        [system]: { 
          ...prev[system], 
          status: 'connected', 
          lastSynced: timestamp 
        } 
      }));
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden max-w-4xl mx-auto my-8 flex flex-col max-h-[90vh]">
      <div className="bg-[#00509e] dark:bg-slate-950 text-white p-6 flex justify-between items-center flex-shrink-0">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {editingEvent ? 'Rediger element' : 'Administrasjon'}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
          <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
        <button 
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'edit' ? 'bg-white dark:bg-slate-900 text-[#00509e] dark:text-blue-400 border-b-2 border-[#00509e] dark:border-blue-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
        >
          <Calendar size={16} />
          {editingEvent ? 'Rediger detaljer' : 'Opprett ny'}
        </button>
        <button 
          onClick={() => setActiveTab('tools')}
          className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'tools' ? 'bg-white dark:bg-slate-900 text-[#00509e] dark:text-blue-400 border-b-2 border-[#00509e] dark:border-blue-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
        >
          <Database size={16} />
          Dataverktøy
        </button>
        <button 
          onClick={() => setActiveTab('integrations')}
          className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'integrations' ? 'bg-white dark:bg-slate-900 text-[#00509e] dark:text-blue-400 border-b-2 border-[#00509e] dark:border-blue-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
        >
          <Server size={16} />
          Integrasjoner
        </button>
      </div>

      <div className="p-8 overflow-y-auto">
        {activeTab === 'edit' ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tittel *</label>
                <input
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#00509e] dark:focus:ring-blue-500 outline-none"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="F.eks. Frist for oppmelding til eksamen"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Beskrivelse</label>
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg h-24 focus:ring-2 focus:ring-[#00509e] dark:focus:ring-blue-500 outline-none"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Utfyllende informasjon om hendelsen..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Startdato *</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#00509e] dark:focus:ring-blue-500 outline-none"
                  value={formData.startDate}
                  onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sluttdato *</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#00509e] dark:focus:ring-blue-500 outline-none"
                  value={formData.endDate}
                  onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Type</label>
                <select
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#00509e] dark:focus:ring-blue-500 outline-none"
                  value={formData.type}
                  onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as EventType }))}
                >
                  <option value="Deadline">Frist (Deadline)</option>
                  <option value="Period">Periode</option>
                  <option value="Event">Hendelse (Event)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Område</label>
                <select
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-[#00509e] dark:focus:ring-blue-500 outline-none"
                  value={formData.area}
                  onChange={e => setFormData(prev => ({ ...prev, area: e.target.value as AcademicArea }))}
                >
                  {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>
            </div>

            {/* Icon Selector */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ikon / Visuelt symbol</label>
              <div className="flex flex-wrap gap-2 bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-100 dark:border-slate-700">
                {AVAILABLE_ICONS.map(iconName => (
                  <button
                    type="button"
                    key={iconName}
                    onClick={() => setFormData(prev => ({ ...prev, icon: iconName }))}
                    className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                      formData.icon === iconName 
                        ? 'bg-[#00509e] border-[#00509e] text-white shadow-md scale-105' 
                        : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600'
                    }`}
                    title={iconName}
                  >
                    <IconDisplay name={iconName} />
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience (Campuses & Roles) */}
            <div className="grid md:grid-cols-2 gap-8 border-t border-gray-100 dark:border-slate-800 pt-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Campus (Hvor gjelder dette?)</label>
                <div className="space-y-2 bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-100 dark:border-slate-700">
                  {CAMPUSES.map(campus => (
                    <label key={campus} className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 p-1 rounded transition-colors">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        formData.campus?.includes(campus) ? 'bg-[#00509e] border-[#00509e]' : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600'
                      }`}>
                        {formData.campus?.includes(campus) && <Check size={14} className="text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.campus?.includes(campus)}
                        onChange={() => toggleSelection(campus, formData.campus, 'campus')}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{campus}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Målgruppe (Hvem er dette for?)</label>
                <div className="space-y-2 bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-100 dark:border-slate-700">
                  {ROLES.map(role => (
                    <label key={role} className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 p-1 rounded transition-colors">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        formData.roles?.includes(role) ? 'bg-[#00509e] border-[#00509e]' : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600'
                      }`}>
                        {formData.roles?.includes(role) && <Check size={14} className="text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.roles?.includes(role)}
                        onChange={() => toggleSelection(role, formData.roles, 'roles')}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Links & Resources */}
            <div className="border-t border-gray-100 dark:border-slate-800 pt-6 space-y-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <LinkIcon size={16} />
                Ressurser og lenker
              </label>

              {/* Image URL Input */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <ImageIcon size={14} />
                  <span>Bilde (URL)</span>
                </div>
                <input
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[#00509e] dark:focus:ring-blue-500 outline-none"
                  placeholder="https://eksempel.no/bilde.jpg"
                  value={formData.imageUrl || ''}
                  onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  className="flex-1 p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[#00509e] dark:focus:ring-blue-500 outline-none"
                  placeholder="Lenketittel (f.eks. 'Les mer på Innsida')"
                  value={linkTitle}
                  onChange={e => setLinkTitle(e.target.value)}
                />
                <input
                  className="flex-1 p-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-[#00509e] dark:focus:ring-blue-500 outline-none"
                  placeholder="URL (https://...)"
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!linkTitle || !linkUrl}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  <Plus size={16} />
                  Legg til
                </button>
              </div>

              {formData.links && formData.links.length > 0 && (
                <div className="space-y-2 mt-2">
                  {formData.links.map((link, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg border border-blue-100 dark:border-blue-800">
                      <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-[#00509e] dark:text-blue-400 hover:underline flex items-center gap-2 font-medium">
                        <LinkIcon size={12} />
                        {link.title}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(idx)}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Organizational Branching */}
            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl space-y-6 border border-gray-100 dark:border-slate-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <PlusCircle size={18} className="text-[#00509e] dark:text-blue-400" />
                Organisatorisk tilhørighet (Metadata)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Bruk feltene under kun hvis fristen gjelder spesifikt for en enhet.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Studieby</label>
                  <select
                    className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-lg text-sm"
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
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Fakultet</label>
                  <select
                    className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-slate-800 dark:disabled:text-gray-500"
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
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Institutt</label>
                  <select
                    className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded-lg text-sm disabled:bg-gray-100 dark:disabled:bg-slate-800 dark:disabled:text-gray-500"
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
            <div className="flex flex-col md:flex-row justify-between gap-4 pt-4 border-t border-gray-100 dark:border-slate-800 flex-shrink-0">
              <div className="flex gap-2">
                {editingEvent && (
                  <button
                    type="button"
                    onClick={() => onDelete(editingEvent.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
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
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-[#00509e] dark:bg-blue-600 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                  <Save size={20} />
                  Lagre endringer
                </button>
              </div>
            </div>
          </form>
        ) : activeTab === 'tools' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#00509e] dark:text-blue-400 mb-2 flex items-center gap-2">
                <Download size={20} />
                Eksport (Backup)
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Last ned alle registrerte hendelser som en JSON-fil. Dette fungerer som en backup og kan brukes til å flytte data til en annen nettleser eller maskin.
              </p>
              <button
                onClick={handleDownloadJson}
                className="px-6 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Last ned data (.json)
              </button>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                <Upload size={20} />
                Import (JSON)
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Lim inn innholdet fra en JSON-eksportfil for å oppdatere årshjulet. 
                <br/>
                <strong className="text-red-600 dark:text-red-400">ADVARSEL: Dette vil overskrive alle eksisterende data!</strong>
              </p>
              
              <textarea
                className="w-full h-40 p-3 mb-4 text-xs font-mono border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder='[{"id": "...", "title": "...", ...}]'
                value={importJson}
                onChange={e => setImportJson(e.target.value)}
              />
              
              <button
                onClick={handleImportJson}
                disabled={!importJson}
                className="px-6 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg font-bold hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Upload size={16} />
                Importer data
              </button>
            </div>
            
             <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Lukk
                </button>
              </div>
          </div>
        ) : (
          /* INTEGRATIONS TAB (MOCKUP WITH CONFIG) */
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Server size={32} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Eksterne Systemer</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
                     Koble årshjulet mot NTNUs studieadministrative systemer for automatisk oppdatering av frister og datoer.
                     <br/><em className="text-xs opacity-70">(Dette er et demonstrasjonsgrensesnitt. Ingen virkelige data overføres enda.)</em>
                   </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {/* FS Card */}
              <div className="border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm overflow-hidden transition-all">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center font-black text-gray-500 dark:text-gray-400">FS</div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Felles Studentsystem (FS)</h4>
                      <div className="flex items-center gap-2">
                         <p className="text-xs text-gray-500 dark:text-gray-400">Henter eksamensdatoer og frister for opptak.</p>
                         {integrations['fs'].lastSynced && (
                           <span className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
                             Sist synkronisert: {integrations['fs'].lastSynced}
                           </span>
                         )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleConfig('fs')}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Innstillinger"
                    >
                      <Settings size={18} />
                    </button>
                    
                    <button 
                      onClick={() => handleSimulateSync('fs')}
                      disabled={integrations['fs'].status === 'syncing'}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                        integrations['fs'].status === 'connected' 
                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {integrations['fs'].status === 'syncing' ? <RefreshCw size={16} className="animate-spin" /> : <Power size={16} />}
                      {integrations['fs'].status === 'connected' ? 'Synkroniser' : 'Koble til'}
                    </button>
                  </div>
                </div>
                
                {/* FS Config Panel */}
                {integrations['fs'].configOpen && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 p-4 border-t border-gray-100 dark:border-slate-800 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600 dark:text-gray-400">API Endepunkt</label>
                        <input 
                          className="w-full p-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white"
                          value={integrations['fs'].apiUrl}
                          onChange={(e) => updateConfig('fs', 'apiUrl', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600 dark:text-gray-400">API Nøkkel</label>
                        <input 
                          type="password"
                          className="w-full p-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white"
                          value={integrations['fs'].apiKey}
                          placeholder="******************"
                          onChange={(e) => updateConfig('fs', 'apiKey', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* EpN Card */}
              <div className="border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm overflow-hidden transition-all">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center font-black text-gray-500 dark:text-gray-400">EpN</div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Emneplanlegging på Nett</h4>
                       <div className="flex items-center gap-2">
                         <p className="text-xs text-gray-500 dark:text-gray-400">Henter frister for emne- og programrevisjon.</p>
                         {integrations['epn'].lastSynced && (
                           <span className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
                             Sist synkronisert: {integrations['epn'].lastSynced}
                           </span>
                         )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button 
                      onClick={() => toggleConfig('epn')}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Innstillinger"
                    >
                      <Settings size={18} />
                    </button>
                    <button 
                      onClick={() => handleSimulateSync('epn')}
                      disabled={integrations['epn'].status === 'syncing'}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                        integrations['epn'].status === 'connected' 
                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {integrations['epn'].status === 'syncing' ? <RefreshCw size={16} className="animate-spin" /> : <Power size={16} />}
                      {integrations['epn'].status === 'connected' ? 'Synkroniser' : 'Koble til'}
                    </button>
                  </div>
                </div>

                {/* EpN Config Panel */}
                {integrations['epn'].configOpen && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 p-4 border-t border-gray-100 dark:border-slate-800 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600 dark:text-gray-400">API Endepunkt</label>
                        <input 
                          className="w-full p-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white"
                          value={integrations['epn'].apiUrl}
                          onChange={(e) => updateConfig('epn', 'apiUrl', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600 dark:text-gray-400">API Nøkkel</label>
                        <input 
                          type="password"
                          className="w-full p-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white"
                          value={integrations['epn'].apiKey}
                          placeholder="******************"
                          onChange={(e) => updateConfig('epn', 'apiKey', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* TP Card */}
              <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between bg-white dark:bg-slate-800 shadow-sm opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center font-black text-gray-500 dark:text-gray-400">TP</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Timeplan (TP)</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">API ikke tilgjengelig enda.</p>
                  </div>
                </div>
                <div>
                   <span className="text-xs font-bold text-gray-400 border border-gray-200 dark:border-slate-700 px-2 py-1 rounded">Kommer snart</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Lukk
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;


import React from 'react';
import { UserProfile } from '../types';
import { Shield, User, GraduationCap, LogOut, CheckCircle, X } from 'lucide-react';

interface ProfileViewProps {
  currentUser: UserProfile | null;
  onSwitchUser: (user: UserProfile) => void;
  onLogout: () => void;
  onClose: () => void;
}

// Dummy users for simulation
export const DUMMY_USERS: UserProfile[] = [
  {
    id: 'u1',
    name: 'Admin Adminsen',
    role: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin',
    permissions: { canEdit: true, canAdminister: true }
  },
  {
    id: 'u2',
    name: 'Fakultetsadmin Olsen',
    role: 'Saksbehandler',
    avatarUrl: 'https://i.pravatar.cc/150?u=faculty',
    permissions: { canEdit: true, canAdminister: false }
  },
  {
    id: 'u3',
    name: 'Student Studentesen',
    role: 'Student',
    avatarUrl: 'https://i.pravatar.cc/150?u=student',
    permissions: { canEdit: false, canAdminister: false }
  }
];

const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onSwitchUser, onLogout, onClose }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-800">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-[#00509e] to-blue-600 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-all backdrop-blur-sm"
            title="Lukk profil"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-6">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden bg-gray-200">
                {currentUser ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <User size={40} />
                  </div>
                )}
              </div>
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentUser ? currentUser.name : 'Gjestebruker'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                  {currentUser?.role === 'Admin' && <Shield size={16} className="text-[#00509e] dark:text-blue-400" />}
                  {currentUser?.role === 'Student' && <GraduationCap size={16} className="text-green-600 dark:text-green-400" />}
                  {currentUser ? currentUser.role : 'Ingen tilgang'}
                </p>
              </div>
            </div>
            
            {currentUser && (
              <button 
                onClick={onLogout}
                className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Logg ut
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Permissions */}
            <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-100 dark:border-slate-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Dine Rettigheter</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${currentUser?.permissions.canEdit ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-gray-200 text-gray-400 dark:bg-slate-700'}`}>
                    {currentUser?.permissions.canEdit ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Kan redigere innhold</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${currentUser?.permissions.canAdminister ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-gray-200 text-gray-400 dark:bg-slate-700'}`}>
                    {currentUser?.permissions.canAdminister ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Kan importere/eksportere data og slette alt</span>
                </li>
                 <li className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${currentUser ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-gray-200 text-gray-400 dark:bg-slate-700'}`}>
                    {currentUser ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Har tilgang til intern informasjon</span>
                </li>
              </ul>
            </div>

            {/* Simulation Switcher */}
            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <h3 className="font-bold text-[#00509e] dark:text-blue-400 mb-4 uppercase text-xs tracking-wider">Simuler annen bruker (Demo)</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Velg en brukerprofil under for å teste applikasjonen med ulike rettigheter.
              </p>
              
              <div className="space-y-3">
                {DUMMY_USERS.map(user => (
                  <button
                    key={user.id}
                    onClick={() => onSwitchUser(user)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      currentUser?.id === user.id 
                      ? 'bg-white dark:bg-slate-800 border-[#00509e] dark:border-blue-400 ring-1 ring-[#00509e] dark:ring-blue-400 shadow-sm' 
                      : 'bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="text-left">
                      <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">{user.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.role}</div>
                    </div>
                    {currentUser?.id === user.id && (
                      <div className="ml-auto text-[#00509e] dark:text-blue-400">
                        <CheckCircle size={18} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

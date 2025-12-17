
import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface LoginModalProps {
  onLogin: () => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ntnu') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-slate-800">
        <div className="bg-[#00509e] dark:bg-slate-950 p-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-white border border-white/20">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Admin Innlogging</h2>
          <p className="text-white/80 text-sm mt-1">Studieadministrativt Årshjul</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Passord</label>
            <input 
              type="password" 
              autoFocus
              className={`w-full p-3 border rounded-xl outline-none transition-all bg-gray-50 dark:bg-slate-800 dark:text-white ${
                error 
                ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50 dark:bg-red-900/10' 
                : 'border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-[#00509e] focus:border-[#00509e]'
              }`}
              placeholder="Skriv inn passord..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
            />
            {error && (
              <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1 animate-pulse">
                <span>Feil passord. Prøv igjen. (Hint: ntnu)</span>
              </p>
            )}
          </div>
          
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-sm"
            >
              Avbryt
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-[#00509e] dark:bg-blue-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-blue-900/20 text-sm"
            >
              Logg inn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

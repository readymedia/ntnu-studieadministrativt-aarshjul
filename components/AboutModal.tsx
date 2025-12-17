
import React from 'react';
import { X, Users, Code, Info, Database, AlertTriangle, FileSpreadsheet } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#00509e] dark:bg-slate-950 p-6 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Info size={24} />
            </div>
            <h2 className="text-2xl font-bold">Om Prosjektet</h2>
          </div>
          <p className="text-white/80 text-sm max-w-lg">
            Konsept og prototype for NTNU Studieadministrativt Årshjul.
          </p>
        </div>
        
        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8">
          
          {/* Intro */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Code size={20} className="text-[#00509e] dark:text-blue-400" />
                Hva er dette?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                Dette er en <strong>interaktiv mockup/prototype</strong> designet for å visualisere hvordan et dynamisk årshjul kan fungere for NTNU. 
                Løsningen er bygget for å demonstrere funksjonalitet, brukervennlighet og designmuligheter før en eventuell produksjonssetting.
            </p>
          </section>

          {/* The Team */}
          <section className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users size={20} className="text-[#00509e] dark:text-blue-400" />
                Teamet bak initiativet
            </h3>
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#00509e] dark:text-blue-400 font-bold shrink-0">
                        I&A
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">Idé, Design og Initiativ</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Andreas Aarlott & Ida Eir Lauritzen</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                        MSL
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">Teknisk Utvikling</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Satt sammen av Magnus Sæternes Lian, basert på teamets ideer.</p>
                    </div>
                </div>
            </div>
          </section>

          {/* Functionality & Data */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Database size={20} className="text-[#00509e] dark:text-blue-400" />
                Testing og Data
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p>
                    Applikasjonen kjører lokalt i din nettleser. Du kan fritt teste å legge til, redigere og slette hendelser.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>
                        <strong>Nullstilling:</strong> Du kan enkelt slette alle data via Admin-panelet.
                    </li>
                    <li className="flex items-center gap-1">
                        <strong>Excel Import:</strong> Det er mulig å importere egne data ved å laste opp en Excel-fil (<FileSpreadsheet size={12} className="inline"/>) som følger vår mal-struktur.
                    </li>
                </ul>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900/30 flex gap-3">
            <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>NB:</strong> Denne løsningen er en demo (ikke produksjonsklar). Data lagres kun midlertidig i nettleseren din (Local Storage) og er ikke koblet til NTNUs faktiske baksystemer (FS, EpN, etc.) enda.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 font-bold rounded-lg transition-colors text-sm"
            >
              Lukk vindu
            </button>
        </div>

      </div>
    </div>
  );
};

export default AboutModal;

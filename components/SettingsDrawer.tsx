'use client';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Trash2, Moon, Sun, MonitorSmartphone } from 'lucide-react';
import { Language } from '../lib/types';
import { getTranslations } from '../lib/translations';
import { useToast } from './ToastContext';

export default function SettingsDrawer({ 
  open, 
  onClose, 
  lang, 
  setLang,
  isDark,
  setIsDark,
  onClearData
}: { 
  open: boolean, 
  onClose: () => void, 
  lang: Language, 
  setLang: (l: Language) => void,
  isDark: boolean;
  setIsDark: (d: boolean) => void;
  onClearData: () => void;
}) {
  const { showToast } = useToast();
  const t = getTranslations(lang);
  const isRTL = lang === 'ur_script';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            className={`absolute top-0 bottom-0 right-0 w-80 max-w-[85%] bg-white dark:bg-gray-950 z-50 shadow-2xl flex flex-col`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className={`p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800`}>
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Settings className="w-5 h-5"/> {t.settings}
              </h2>
              <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-8">
              {/* Language */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{t.language}</h3>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setLang('en')} className={`p-3 rounded-xl border text-left flex justify-between items-center ${lang === 'en' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'border-gray-200 dark:border-gray-800'}`}>
                    English
                    {lang==='en' && <div className="w-2 h-2 rounded-full bg-blue-600"/>}
                  </button>
                  <button onClick={() => setLang('ur_roman')} className={`p-3 rounded-xl border text-left flex justify-between items-center ${lang === 'ur_roman' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'border-gray-200 dark:border-gray-800'}`}>
                    Urdu (Roman)
                    {lang==='ur_roman' && <div className="w-2 h-2 rounded-full bg-blue-600"/>}
                  </button>
                  <button onClick={() => setLang('ur_script')} className={`p-3 rounded-xl border text-left flex justify-between items-center ${lang === 'ur_script' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'border-gray-200 dark:border-gray-800'}`}>
                    <span>اردو</span>
                    {lang==='ur_script' && <div className="w-2 h-2 rounded-full bg-blue-600"/>}
                  </button>
                </div>
              </div>

              {/* Theme */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{t.darkMode}</h3>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <button onClick={() => setIsDark(false)} className={`flex-1 flex justify-center items-center gap-2 p-2 rounded-lg text-sm font-medium transition-all ${!isDark ? 'bg-white text-blue-600 shadow' : 'text-gray-500'}`}>
                      <Sun className="w-4 h-4"/> Light
                    </button>
                    <button onClick={() => setIsDark(true)} className={`flex-1 flex justify-center items-center gap-2 p-2 rounded-lg text-sm font-medium transition-all ${isDark ? 'bg-gray-950 text-blue-400 shadow' : 'text-gray-400'}`}>
                      <Moon className="w-4 h-4"/> Dark
                    </button>
                </div>
              </div>

              {/* Danger */}
              <div>
                <h3 className="text-sm font-bold text-red-500/50 uppercase tracking-wider mb-3">Danger Zone</h3>
                <button 
                  onClick={() => {
                    if (confirm("Are you sure you want to clear all your saved careers, profile, and chat history?")) {
                      onClearData();
                      onClose();
                      showToast("All data cleared correctly.", "success");
                    }
                  }} 
                  className="w-full p-3 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 bg-red-50 dark:bg-red-900/10 flex justify-center items-center gap-2 font-bold"
                >
                  <Trash2 className="w-5 h-5"/> {t.clearData}
                </button>
              </div>

            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 text-center border-t border-gray-200 dark:border-gray-800">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-3 shadow-[0_0_15px_rgba(0,100,0,0.4)]">🎓</div>
               <h4 className="font-bold text-gray-900 dark:text-white">Rahnuma AI</h4>
               <p className="text-xs text-gray-500 mt-1">Version 1.0.0</p>
               <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Made for AI Seekho 2026 🇵🇰
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

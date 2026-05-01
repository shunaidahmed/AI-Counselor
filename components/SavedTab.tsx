'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartCrack, ArrowLeftRight, Loader2, X, Star } from 'lucide-react';
import { Language, Career } from '../lib/types';
import { getTranslations } from '../lib/translations';
import { compareCareersAI } from '../lib/gemini';
import { useToast } from './ToastContext';

export default function SavedTab({ lang, saved, setSaved, onExplore }: { lang: Language, saved: Career[], setSaved: (s: Career[]) => void, onExplore: () => void }) {
  const { showToast } = useToast();
  const t = getTranslations(lang);
  const isRTL = lang === 'ur_script';
  
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  const toggleSelect = (title: string) => {
    if (selectedCards.includes(title)) {
      setSelectedCards(selectedCards.filter(t => t !== title));
    } else {
      if (selectedCards.length < 2) {
        setSelectedCards([...selectedCards, title]);
      }
    }
  };

  const currentSelection = saved.filter(s => selectedCards.includes(s.title));

  const removeCareer = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(saved.filter(c => c.title !== title));
    setSelectedCards(selectedCards.filter(t => t !== title));
    showToast(`${title} removed.`, 'info');
  };

  const handleCompare = async () => {
    if (selectedCards.length !== 2) return;
    setComparing(true);
    setComparisonResult(null);
    try {
      const res = await compareCareersAI(selectedCards[0], selectedCards[1], lang);
      setComparisonResult(res);
    } catch (e) {
      console.error(e);
      showToast("Something went wrong. Please try again 🙏", 'error');
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-4 bg-white dark:bg-gray-950 z-10 shrink-0 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Meri List</h2>
        <p className="text-xs text-gray-500">Tap 2 careers to compare</p>
      </div>

      <div className="flex-1 p-4 pb-40 md:pb-8 overflow-y-auto w-full content-start custom-scrollbar">
        {saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-60">
            <div className="text-6xl mb-4 drop-shadow-sm">🔭</div>
            <p className="text-center text-base md:text-lg font-bold text-gray-700 dark:text-gray-300 drop-shadow-sm">{t.noSaved}</p>
            <button onClick={onExplore} className="mt-6 bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 backdrop-blur-md text-blue-800 dark:text-blue-300 px-8 py-3 rounded-2xl font-black shadow-sm transition-all border border-blue-100/50 dark:border-blue-800/30">
              Explore Careers
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {saved.map(c => {
                 const isSelected = selectedCards.includes(c.title);
                 return (
                   <motion.div 
                     key={c.title}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => toggleSelect(c.title)}
                     className={`p-5 md:p-6 rounded-[2rem] border transition-all cursor-pointer flex gap-4 backdrop-blur-3xl hover:shadow-lg ${
                       isSelected ? 'bg-blue-50/80 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 shadow-md shadow-blue-900/10' : 'bg-white/40 dark:bg-black/20 border-white/50 dark:border-white/10 shadow-sm'
                     }`}
                   >
                     <div className="text-4xl md:text-5xl mt-1 drop-shadow-sm">{c.emoji}</div>
                     <div className="flex-1">
                       <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white leading-tight drop-shadow-sm">{c.title}</h3>
                       <div className="flex flex-wrap gap-2 mt-3 block">
                         <span className="text-[10px] md:text-xs px-2.5 py-1 rounded-full bg-blue-100/80 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-bold border border-blue-900/10 dark:border-blue-100/10 shadow-inner">{c.pakistanDemand} Demand</span>
                         <span className="text-[10px] md:text-xs px-2.5 py-1 rounded-full bg-white/60 text-gray-700 dark:bg-white/10 dark:text-gray-300 font-bold border border-gray-900/10 dark:border-white/5 shadow-inner">{c.avgSalaryPKR}</span>
                       </div>
                     </div>
                     <button onClick={(e) => removeCareer(c.title, e)} className="p-2 self-start bg-red-50/50 text-red-500 dark:bg-red-900/20 backdrop-blur-md rounded-xl shrink-0 h-10 w-10 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200/50 dark:border-red-800/30">
                       <HeartCrack className="w-5 h-5" />
                     </button>
                   </motion.div>
                 )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Compare Button */}
      {selectedCards.length === 2 && (
         <div className="absolute bottom-[100px] md:bottom-8 left-0 right-0 flex justify-center pointer-events-none px-4 z-20">
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-[430px] pointer-events-auto">
              <button onClick={handleCompare} disabled={comparing} className="w-full py-5 text-lg bg-gradient-to-r from-blue-600 to-indigo-500 hover:to-indigo-400 transition-all text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 flex justify-center items-center gap-3 border-none active:scale-95">
                 {comparing ? <Loader2 className="w-6 h-6 animate-spin" /> : <><ArrowLeftRight className="w-6 h-6" /> Compare {selectedCards[0]} vs {selectedCards[1]}</>}
              </button>
           </motion.div>
         </div>
      )}

      {/* Comparison Modal */}
      <AnimatePresence>
        {comparisonResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            className="absolute inset-0 z-50 bg-white/20 dark:bg-black/40 backdrop-blur-3xl flex justify-center items-center p-0 md:p-8"
          >
            <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl w-full h-full md:h-[90vh] md:max-w-4xl md:rounded-[2.5rem] shadow-2xl flex flex-col pt-0 relative border border-white/40 dark:border-white/10 overflow-hidden">
              <div className="p-5 md:px-8 md:py-6 border-b border-white/40 dark:border-white/10 flex justify-between items-center bg-transparent z-10 pt-12 md:pt-6">
                <h2 className="font-black text-2xl text-gray-900 dark:text-white drop-shadow-sm">AI Comparison</h2>
                <button onClick={() => setComparisonResult(null)} className="p-3 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/60 dark:hover:bg-white/20 transition-all active:scale-95 border border-white/50 dark:border-white/5">
                  <X className="w-6 h-6 text-gray-800 dark:text-gray-200"/>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent custom-scrollbar">
                
                <div className="flex justify-center mb-10">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-500 rounded-[2rem] p-8 w-full max-w-xl shadow-lg border border-blue-500/30 text-white text-center relative overflow-hidden">
                     <div className="text-sm uppercase tracking-[0.2em] text-[#FFD700] font-black mb-3">Recommended Winner</div>
                     <div className="text-4xl md:text-5xl font-black drop-shadow-md">{comparisonResult.winner}</div>
                     <Star className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
                  </div>
                </div>

                <div className="max-w-4xl mx-auto bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2rem] shadow-sm border border-white/50 dark:border-white/10 overflow-hidden text-sm md:text-base">
                  <div className="grid grid-cols-3 bg-white/50 dark:bg-white/10 text-xs md:text-sm font-black uppercase text-gray-800 dark:text-gray-300 py-5 px-6 border-b border-white/40 dark:border-white/5 shadow-inner">
                    <div className="drop-shadow-sm">Aspect</div>
                    <div className="text-center border-l dark:border-white/10 px-2 drop-shadow-sm">{currentSelection[0]?.title}</div>
                    <div className="text-center border-l dark:border-white/10 px-2 drop-shadow-sm">{currentSelection[1]?.title}</div>
                  </div>
                  {comparisonResult.comparisonTable?.map((row:any, idx:number) => (
                     <div key={idx} className="grid grid-cols-3 border-b border-white/40 dark:border-white/5 py-5 px-6 hover:bg-white/30 dark:hover:bg-white/5 transition-colors">
                       <div className="font-bold text-gray-900 dark:text-white pr-2">{row.aspect}</div>
                       <div className="text-center border-l dark:border-white/10 px-4 text-gray-800 dark:text-gray-200 text-sm md:text-base font-medium">{row.careerA}</div>
                       <div className="text-center border-l dark:border-white/10 px-4 text-gray-800 dark:text-gray-200 text-sm md:text-base font-medium">{row.careerB}</div>
                     </div>
                  ))}
                  
                  {/* Additional details from career data */}
                  {(currentSelection[0]?.futureOutlook || currentSelection[1]?.futureOutlook) && (
                    <div className="grid grid-cols-3 border-b border-white/40 dark:border-white/5 py-5 px-6 bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-md rounded-b-[2rem]">
                       <div className="font-bold text-gray-900 dark:text-white pr-2">Future Outlook</div>
                       <div className="text-center border-l border-blue-200/50 dark:border-blue-800/30 px-4 text-gray-800 dark:text-gray-200 text-sm md:text-base font-medium">{currentSelection[0]?.futureOutlook || 'N/A'}</div>
                       <div className="text-center border-l border-blue-200/50 dark:border-blue-800/30 px-4 text-gray-800 dark:text-gray-200 text-sm md:text-base font-medium">{currentSelection[1]?.futureOutlook || 'N/A'}</div>
                    </div>
                  )}
                  
                </div>

                {(currentSelection[0]?.challenges || currentSelection[1]?.challenges) && (
                  <div className="mt-8 max-w-4xl mx-auto bg-red-50/70 dark:bg-red-900/20 backdrop-blur-md border border-red-200/50 dark:border-red-900/40 rounded-[2rem] p-8 shadow-sm">
                    <h4 className="font-black mb-6 text-xl text-red-800 dark:text-red-400 drop-shadow-sm flex items-center gap-2">⚠️ Potential Challenges</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/60 dark:bg-black/30 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-red-100/50 dark:border-red-800/30">
                        <strong className="block mb-3 text-lg font-black text-gray-900 dark:text-white drop-shadow-sm">{currentSelection[0]?.title}</strong>
                        <p className="text-base text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{currentSelection[0]?.challenges || 'N/A'}</p>
                      </div>
                      <div className="bg-white/60 dark:bg-black/30 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-red-100/50 dark:border-red-800/30">
                        <strong className="block mb-3 text-lg font-black text-gray-900 dark:text-white drop-shadow-sm">{currentSelection[1]?.title}</strong>
                        <p className="text-base text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{currentSelection[1]?.challenges || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 max-w-4xl mx-auto p-8 bg-amber-50/70 dark:bg-amber-900/20 backdrop-blur-md border border-amber-200/50 dark:border-amber-900/40 rounded-[2rem] shadow-sm mb-8">
                  <h4 className="font-black mb-4 text-xl text-amber-900 dark:text-amber-500 drop-shadow-sm flex items-center gap-2">💡 Final Advice</h4>
                  <p className="text-base md:text-lg font-medium text-amber-900/90 dark:text-amber-100/90 leading-relaxed">{comparisonResult.finalAdvice}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

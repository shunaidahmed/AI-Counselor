'use client';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Language } from '../lib/types';
import { getTranslations } from '../lib/translations';
import { fetchHomeContents } from '../lib/gemini';
import { GraduationCap, Briefcase, MessageCircle, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function HomeTab({ lang, onNavigate }: { lang: Language, onNavigate: (tab: string) => void }) {
  const t = getTranslations(lang);
  const isRTL = lang === 'ur_script';
  
  const [data, setData] = useState<{quote?: string, fact?: string, trending?: string[]}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchHomeContents(lang);
        setData(res);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [lang]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="p-4 md:p-8 pb-40 md:pb-8 h-full overflow-y-auto bg-transparent relative custom-scrollbar"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Banner */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-500 rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl shadow-blue-900/20 mb-8 relative overflow-hidden border border-white/20 backdrop-blur-xl">
          <Sparkles className="absolute -top-6 -right-6 text-[#FFD700] opacity-30 w-48 h-48 md:w-64 md:h-64 transform rotate-12 blur-sm" />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
          
          <h1 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 relative z-10 leading-tight max-w-2xl drop-shadow-md">
            {t.welcomeBanner}
          </h1>
          {loading ? (
             <div className="flex bg-white/20 rounded-2xl p-4 mt-4 md:mt-6 animate-pulse h-20 md:h-24 max-w-2xl backdrop-blur-sm"></div>
          ) : (
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{ delay: 0.2 }} className="text-blue-50 text-base md:text-xl mt-4 md:mt-6 font-medium italic border-l-4 border-[#FFD700] pl-5 md:pl-6 relative z-10 max-w-2xl drop-shadow-sm leading-relaxed">
              &quot;{data.quote || 'Believe in yourself!'}&quot;
            </motion.p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <button onClick={() => onNavigate('profile')} className="flex flex-col md:items-start justify-between p-6 md:p-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 dark:border-white/10 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 md:hover:-translate-y-1.5 active:scale-95 group h-full hover:bg-white/60 dark:hover:bg-gray-800/50">
            <div className="flex bg-gradient-to-br from-blue-600 to-indigo-500 text-white p-4 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md">
              <GraduationCap className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className="flex items-center justify-between w-full mt-auto gap-2">
              <span className="font-bold text-gray-900 dark:text-white text-lg md:text-xl">{t.buildProfile}</span>
              <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                 <ArrowRight className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-white" />
              </div>
            </div>
          </button>
          
          <button onClick={() => onNavigate('explore')} className="flex flex-col md:items-start justify-between p-6 md:p-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 dark:border-white/10 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 md:hover:-translate-y-1.5 active:scale-95 group h-full hover:bg-white/60 dark:hover:bg-gray-800/50">
            <div className="flex bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-4 rounded-2xl mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-md">
              <Briefcase className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className="flex items-center justify-between w-full mt-auto gap-2">
              <span className="font-bold text-gray-900 dark:text-white text-lg md:text-xl">{t.exploreCareers}</span>
              <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                 <ArrowRight className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-white" />
              </div>
            </div>
          </button>
          
          <button onClick={() => onNavigate('chat')} className="flex flex-col md:items-start justify-between p-6 md:p-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 dark:border-white/10 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 md:hover:-translate-y-1.5 active:scale-95 group h-full hover:bg-white/60 dark:hover:bg-gray-800/50">
            <div className="flex bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white p-4 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md">
              <MessageCircle className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className="flex items-center justify-between w-full mt-auto gap-2">
              <span className="font-bold text-gray-900 dark:text-white text-lg md:text-xl">{t.chatWithAI}</span>
              <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                 <ArrowRight className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-white" />
              </div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Did you know? */}
          <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/40 dark:border-white/10 shadow-sm">
            <h2 className="text-xl md:text-2xl font-black mb-5 text-gray-900 dark:text-white flex items-center gap-3 drop-shadow-sm">
              <span className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-xl text-2xl">💡</span> {t.didYouKnow}
            </h2>
            <div className="bg-[#FFD700]/10 dark:bg-[#FFD700]/5 border border-[#FFD700]/30 rounded-2xl p-6 h-[140px] flex items-center backdrop-blur-md">
              {loading ? (
                <div className="animate-pulse h-12 bg-[#FFD700]/20 rounded-xl w-full"></div>
              ) : (
                <p className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200 leading-relaxed">
                  {data.fact || 'Pakistan has the 5th largest youth population in the world!'}
                </p>
              )}
            </div>
          </div>

          {/* Trending */}
          <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/40 dark:border-white/10 shadow-sm">
            <h2 className="text-xl md:text-2xl font-black mb-5 text-gray-900 dark:text-white flex items-center gap-3 drop-shadow-sm">
              <span className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-2xl">📈</span> {t.trending}
            </h2>
            <div className="flex flex-wrap gap-3">
              {loading ? (
                <>
                  {[1,2,3,4,5].map(i => <div key={i} className="animate-pulse h-12 w-28 bg-white/40 dark:bg-gray-800 rounded-full"></div>)}
                </>
              ) : (
                data.trending?.map((item, i) => (
                  <div key={i} className="px-5 py-3 bg-white/60 dark:bg-white/5 backdrop-blur-md text-blue-600 dark:text-blue-400 border border-white/60 dark:border-white/10 rounded-full text-sm md:text-base font-bold shadow-sm hover:shadow-md transition-shadow cursor-default hover:scale-105 active:scale-95 duration-300">
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Footer spacer */}
        <div className="h-12" />
      </div>
    </motion.div>
  );
}

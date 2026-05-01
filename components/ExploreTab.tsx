'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, Heart, MessageCircle, X, ExternalLink, Briefcase } from 'lucide-react';
import { Language, Career } from '../lib/types';
import { getTranslations } from '../lib/translations';
import { getCareerDetails } from '../lib/gemini';
import { useToast } from './ToastContext';

const CATEGORIES = ["Tech & IT", "Healthcare", "Business", "Engineering", "Creative", "Education", "Law", "Trade"];

const PRE_POPULATED: Career[] = [
  { title: "Software Engineer", category: "Tech & IT", emoji: "💻", avgSalaryPKR: "80,000 - 250,000", pakistanDemand: "High" },
  { title: "Data Scientist", category: "Tech & IT", emoji: "📊", avgSalaryPKR: "100,000 - 300,000", pakistanDemand: "High" },
  { title: "Cybersecurity Analyst", category: "Tech & IT", emoji: "🔒", avgSalaryPKR: "90,000 - 200,000", pakistanDemand: "High" },
  { title: "Frontend Developer", category: "Tech & IT", emoji: "🎨", avgSalaryPKR: "60,000 - 150,000", pakistanDemand: "High" },
  { title: "General Physician", category: "Healthcare", emoji: "🩺", avgSalaryPKR: "70,000 - 200,000", pakistanDemand: "Medium" },
  { title: "Nursing Professional", category: "Healthcare", emoji: "💉", avgSalaryPKR: "50,000 - 120,000", pakistanDemand: "High" },
  { title: "Pharmacist", category: "Healthcare", emoji: "💊", avgSalaryPKR: "50,000 - 100,000", pakistanDemand: "Medium" },
  { title: "Digital Marketer", category: "Business", emoji: "📱", avgSalaryPKR: "50,000 - 150,000", pakistanDemand: "High" },
  { title: "Financial Analyst", category: "Business", emoji: "📈", avgSalaryPKR: "60,000 - 180,000", pakistanDemand: "Medium" },
  { title: "HR Manager", category: "Business", emoji: "🤝", avgSalaryPKR: "50,000 - 150,000", pakistanDemand: "Medium" },
  { title: "Civil Engineer", category: "Engineering", emoji: "🏗️", avgSalaryPKR: "50,000 - 150,000", pakistanDemand: "Medium" },
  { title: "Electrical Engineer", category: "Engineering", emoji: "⚡", avgSalaryPKR: "50,000 - 150,000", pakistanDemand: "Medium" },
  { title: "Graphic Designer", category: "Creative", emoji: "✍️", avgSalaryPKR: "40,000 - 120,000", pakistanDemand: "High" },
  { title: "Content Writer", category: "Creative", emoji: "📝", avgSalaryPKR: "30,000 - 100,000", pakistanDemand: "High" },
  { title: "Teacher / Lecturer", category: "Education", emoji: "📚", avgSalaryPKR: "40,000 - 100,000", pakistanDemand: "Medium" },
  { title: "Corporate Lawyer", category: "Law", emoji: "⚖️", avgSalaryPKR: "60,000 - 200,000", pakistanDemand: "Medium" },
  { title: "Electrician", category: "Trade", emoji: "🔧", avgSalaryPKR: "30,000 - 80,000", pakistanDemand: "High" },
];

export default function ExploreTab({ lang, onSave, onChatAbout }: { lang: Language, onSave: (c: Career)=>void, onChatAbout: (title: string)=>void }) {
  const { showToast } = useToast();
  const t = getTranslations(lang);
  const isRTL = lang === 'ur_script';
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const filtered = PRE_POPULATED.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) && 
    (search ? true : c.category === activeCategory)
  );

  const handleSelect = async (c: Career) => {
    setSelectedCareer(c);
    setDetails(null);
    setLoading(true);
    try {
      const res = await getCareerDetails(c.title, lang);
      setDetails(res);
    } catch (e) {
      console.error(e);
      showToast("Something went wrong. Please try again 🙏", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative bg-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header & Search */}
      <div className="p-4 md:p-6 bg-transparent z-10 shrink-0 border-b border-white/20 dark:border-white/5">
        <div className="relative max-w-2xl mx-auto">
          <Search className={`absolute ${isRTL?'right-4':'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/40 dark:border-white/10 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-2xl py-4 flex items-center justify-center ${isRTL?'pr-12 pl-4':'pl-12 pr-4'} text-gray-800 dark:text-gray-100 outline-none transition-all shadow-sm font-medium`}
          />
        </div>
      </div>

      {/* Tabs (Liquid Glass) */}
      {!search && (
        <div className="flex overflow-x-auto px-4 py-3 md:pt-4 gap-2 shrink-0 no-scrollbar border-b border-white/10 dark:border-white/5 bg-white/20 dark:bg-black/20 backdrop-blur-xl">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-900/20 border-transparent scale-105' : 'bg-white/40 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-white/50 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/10 active:scale-95'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 content-start pb-6 md:p-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map(c => (
              <motion.button 
                key={c.title}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(c)}
                className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_4px_16px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-white/60 dark:border-white/10 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">{c.emoji}</div>
                <h3 className="font-bold text-base md:text-lg leading-tight text-gray-900 dark:text-white drop-shadow-sm">{c.title}</h3>
                <div className={`text-xs px-3 py-1 rounded-full font-bold border border-white/20 shadow-inner ${c.pakistanDemand === 'High' ? 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/80 dark:text-blue-300' : 'bg-orange-100/80 text-orange-800 dark:bg-orange-900/80 dark:text-orange-300'}`}>
                  {c.pakistanDemand} Demand
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal (Liquid Glass Panel) */}
      <AnimatePresence>
        {selectedCareer && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            className="absolute inset-0 z-50 bg-white/30 dark:bg-black/60 backdrop-blur-3xl flex justify-center items-center py-6 px-4 md:p-8"
          >
            <div className="bg-white/70 dark:bg-gray-950/70 backdrop-blur-2xl w-full h-full md:h-auto md:max-w-4xl md:max-h-[90vh] rounded-[2.5rem] shadow-[0_24px_64px_rgba(0,0,0,0.1)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)] flex flex-col pt-4 relative border border-white/60 dark:border-white/10 overflow-hidden">
              
              {/* Modal Drag Handle Line For Mobile Feel */}
              <div className="md:hidden w-16 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />

              <button 
                onClick={() => setSelectedCareer(null)} 
                className={`absolute top-4 md:top-6 ${isRTL?'left-4 md:left-6':'right-4 md:right-6'} p-2.5 bg-white/50 dark:bg-white/10 backdrop-blur rounded-full text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-white/20 transition-all active:scale-90 border border-white/50 dark:border-white/10 z-10`}
              >
                <X className="w-6 h-6"/>
              </button>

              <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-8 md:pb-12 custom-scrollbar">
                <div className="text-center mb-8 pt-4">
                  <div className="text-7xl md:text-8xl mb-4 drop-shadow-md">{selectedCareer.emoji}</div>
                  <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 pb-2">{selectedCareer.title}</h2>
                  <div className="inline-flex mt-2 items-center gap-2 px-4 py-1.5 bg-white/50 dark:bg-white/10 rounded-full font-bold text-sm border border-white/40 dark:border-white/5 backdrop-blur-md text-blue-800 dark:text-blue-300">
                    Average Salary: {selectedCareer.avgSalaryPKR} PKR
                  </div>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-blue-600 dark:text-blue-400">
                    <Loader2 className="w-14 h-14 animate-spin mb-6" />
                    <p className="mt-4 text-xl font-bold">Summoning Advanced Insights...</p>
                  </div>
                ) : details ? (
                  <div className="space-y-6 text-lg text-gray-800 dark:text-gray-200">
                    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm"><strong className="block text-gray-900 dark:text-white font-black mb-2 flex items-center gap-2">🎯 Overview</strong> {details.overview}</div>
                    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm"><strong className="block text-gray-900 dark:text-white font-black mb-2 flex items-center gap-2">☀️ Daily Life</strong> {details.dailyLife}</div>
                    <div className="bg-blue-50/70 dark:bg-blue-900/20 backdrop-blur-md p-6 rounded-3xl border border-blue-100/50 dark:border-blue-800/30 shadow-sm"><strong className="block text-blue-800 dark:text-blue-400 font-black mb-2 flex items-center gap-2">💰 Salary Ranges & Growth</strong> {details.salaryRange}</div>
                    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm"><strong className="block text-gray-900 dark:text-white font-black mb-2 flex items-center gap-2">🎓 Required Education</strong> {details.educationPath}</div>
                    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm"><strong className="block text-gray-900 dark:text-white font-black mb-2 flex items-center gap-2">🏛️ Top Local Universities</strong> {details.topUniversities?.join(', ')}</div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50/70 dark:bg-blue-900/20 backdrop-blur-md p-6 rounded-3xl border border-blue-100/50 dark:border-blue-800/30 shadow-sm"><strong className="block text-blue-800 dark:text-blue-400 font-black mb-2 flex items-center gap-2">🏢 Govt vs Private Sector</strong> {details.govtVsPrivate}</div>
                      <div className="bg-purple-50/70 dark:bg-purple-900/20 backdrop-blur-md p-6 rounded-3xl border border-purple-100/50 dark:border-purple-800/30 shadow-sm"><strong className="block text-purple-800 dark:text-purple-400 font-black mb-2 flex items-center gap-2">🌍 Remote & Freelance</strong> {details.freelanceScope}</div>
                    </div>
                  </div>
                ) : null}

                {!loading && (
                  <div className="mt-12 flex flex-col sm:flex-row flex-wrap gap-4 px-2">
                    <button onClick={() => onSave({...selectedCareer, ...details})} className="flex-1 py-5 px-6 bg-gradient-to-r from-[#FFD700] to-[#F5C200] hover:to-[#E5B500] transition-colors text-amber-900 font-bold rounded-2xl shadow-lg shadow-yellow-500/20 flex justify-center items-center gap-3 text-lg group">
                      <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" /> {t.saveCareer}
                    </button>
                    
                    <a 
                      href={`https://www.google.com/search?q=jobs+for+${encodeURIComponent(selectedCareer.title)}+in+pakistan&ibp=htl;jobs`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 py-5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:to-indigo-700 transition-colors text-white font-bold rounded-2xl shadow-lg shadow-blue-900/30 flex justify-center items-center gap-3 text-lg group"
                    >
                      <Briefcase className="w-6 h-6 group-hover:scale-110 transition-transform" /> View Google Jobs <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                    </a>

                    <button onClick={() => onChatAbout(selectedCareer.title)} className="w-full py-5 px-6 bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 backdrop-blur-md transition-colors text-gray-900 dark:text-white font-bold rounded-2xl shadow-md border border-white/60 dark:border-white/10 flex justify-center items-center gap-3 text-lg group">
                      <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" /> {t.chatAboutThis}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

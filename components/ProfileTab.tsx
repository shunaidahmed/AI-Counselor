'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, Loader2, Share2, RefreshCw, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { Language, UserProfile, ProfileReport, Career } from '../lib/types';
import { getTranslations } from '../lib/translations';
import { generateCareerReport } from '../lib/gemini';
import { useToast } from './ToastContext';

const INITIAL_PROFILE: UserProfile = {
  name: '', age: '', city: '', educationLevel: '', subject: '',
  interests: [], otherInterests: '', skills: [],
  favSubject: '', leastFavSubject: '', dreamProfession: '',
  incomeGoal: 50000, studyAbroad: '', relocate: '', financialConstraints: '', familyPressure: ''
};

const INTERESTS = ["Technology", "Medicine", "Business", "Art & Design", "Teaching", "Law", "Engineering", "Agriculture", "Media", "Social Work", "Sports", "Gaming", "Writing", "Finance", "Fashion", "Cooking", "Music", "Politics"];
const SKILLS = ["Problem Solving", "Communication", "Math", "Coding", "Drawing", "Leadership", "Research", "Creativity", "Public Speaking", "Languages", "Sales", "Empathy", "Writing", "Data Analysis"];
const CITIES = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta", "Multan", "Faisalabad", "Hyderabad", "Rawalpindi", "Other"];
const EDUCATION = ["Matric", "Intermediate", "Bachelor's", "Master's", "PhD", "Dropout", "Other"];

export default function ProfileTab({ 
  lang, 
  profile, 
  setProfile, 
  report, 
  setReport, 
  onSaveCareer 
}: { 
  lang: Language, 
  profile: UserProfile | null, 
  setProfile: (p: UserProfile | null) => void,
  report: ProfileReport | null,
  setReport: (r: ProfileReport | null) => void,
  onSaveCareer: (c: Career) => void 
}) {
  const { showToast } = useToast();
  const t = getTranslations(lang);
  const isRTL = lang === 'ur_script';
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>(profile || INITIAL_PROFILE);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleArrayItem = (key: 'interests' | 'skills', item: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].includes(item) ? prev[key].filter(i => i !== item) : [...prev[key], item]
    }));
    // Clear error for this field if it was set
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required.";
      if (!formData.age) newErrors.age = "Age is required.";
      else if (Number(formData.age) < 12 || Number(formData.age) > 60) newErrors.age = "Age must be between 12 and 60.";
      if (!formData.city) newErrors.city = "City is required.";
      if (!formData.educationLevel) newErrors.educationLevel = "Education level is required.";
      if (!formData.subject.trim()) newErrors.subject = "Major / Subject is required.";
    } else if (currentStep === 2) {
      if (formData.interests.length === 0) newErrors.interests = "Please select at least one interest.";
    } else if (currentStep === 3) {
      if (formData.skills.length === 0) newErrors.skills = "Please select at least one skill.";
      if (!formData.favSubject.trim()) newErrors.favSubject = "Favorite subject is required.";
      if (!formData.leastFavSubject.trim()) newErrors.leastFavSubject = "Least favorite subject is required.";
    } else if (currentStep === 4) {
      if (!formData.studyAbroad) newErrors.studyAbroad = "Please select an option.";
      if (!formData.relocate) newErrors.relocate = "Please select an option.";
      if (!formData.financialConstraints) newErrors.financialConstraints = "Please select an option.";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      showToast("Please fill in the required fields.", "error");
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => s + 1);
    }
  };

  const handleGenerate = () => {
    if (validateStep(4)) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await generateCareerReport(formData, lang);
      setProfile(formData);
      setReport(res);
    } catch(e) {
      console.error(e);
      showToast("Something went wrong. Please try again 🙏", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setReport(null);
    setStep(1);
  };

  if (report) {
    return (
      <div className="h-full overflow-y-auto p-4 md:p-8 pb-40 md:pb-8 bg-transparent custom-scrollbar" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/50 dark:border-white/10 mb-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl pointer-events-none">✨</div>
              <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 mb-4 drop-shadow-sm">Your Career Report 🚀</h2>
              <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 leading-relaxed max-w-2xl mx-auto font-medium">{report.summary}</p>
          </div>

          <h3 className="font-black text-xl md:text-2xl mb-6 text-gray-900 dark:text-white px-2 drop-shadow-sm">Top Recommended Careers</h3>
          <div className="space-y-6 mb-10">
            {report.topCareers.map((c, i) => (
               <div key={i} className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl rounded-[2rem] shadow-sm border border-white/50 dark:border-white/10 overflow-hidden hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="p-6 md:p-8 bg-white/30 dark:bg-black/20 border-b border-white/40 dark:border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-5">
                        <div className="text-6xl md:text-7xl drop-shadow-sm">{c.emoji}</div>
                        <div>
                          <h4 className="font-black text-xl md:text-3xl text-gray-900 dark:text-white drop-shadow-sm">{c.title}</h4>
                          <div className="text-sm md:text-base border border-blue-900/10 dark:border-blue-100/10 bg-blue-100/80 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 px-4 py-1.5 rounded-full inline-block font-bold mt-2 shadow-inner">Match: {c.matchScore}%</div>
                        </div>
                     </div>
                     <div className="relative w-20 h-20 shrink-0 hidden sm:block">
                       <svg className="w-20 h-20 transform -rotate-90 drop-shadow-md">
                          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/40 dark:text-white/10" />
                          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset={226 - (226 * (c.matchScore||0)) / 100} className="text-blue-500 transition-all duration-1000 ease-out" />
                       </svg>
                     </div>
                  </div>
                  <div className="p-6 md:p-10 space-y-8 text-base md:text-lg text-gray-800 dark:text-gray-200">
                     <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/60 dark:border-white/5 shadow-sm">
                       <strong className="text-gray-900 dark:text-white block mb-2 font-black flex items-center gap-2">🎯 Why it fits you:</strong> 
                       {c.whyItFits}
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50/70 dark:bg-blue-900/20 backdrop-blur-md p-6 rounded-3xl border border-blue-100/50 dark:border-blue-800/30 shadow-sm">
                          <strong className="block text-blue-800 dark:text-blue-400 mb-2 font-black">Demand in Pakistan</strong> 
                          <span className="font-bold text-gray-900 dark:text-white text-xl">{c.pakistanDemand}</span>
                        </div>
                        <div className="bg-amber-50/70 dark:bg-amber-900/20 backdrop-blur-md p-6 rounded-3xl border border-amber-100/50 dark:border-amber-900/30 shadow-sm">
                          <strong className="block text-amber-900 dark:text-amber-500 mb-2 font-black">Average Salary (PKR)</strong> 
                          <span className="font-bold text-gray-900 dark:text-white text-xl">{c.avgSalaryPKR}</span>
                        </div>
                     </div>
                     
                     <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/60 dark:border-white/5 shadow-sm">
                       <strong className="block mb-4 text-gray-900 dark:text-white font-black flex items-center gap-2">🗺️ Your Roadmap:</strong>
                       <div className="border-l-4 border-blue-300 dark:border-blue-700 ml-4 space-y-6">
                          {c.roadmap?.map((step, idx) => (
                            <div key={idx} className="relative pl-8">
                              <div className="absolute -left-[14px] top-1 w-6 h-6 rounded-full bg-blue-500 border-4 border-white dark:border-gray-900 shadow-md"></div>
                              <span className="block font-medium text-gray-800 dark:text-gray-200 leading-relaxed">{step}</span>
                            </div>
                          ))}
                       </div>
                     </div>
                     
                     <button onClick={() => onSaveCareer(c)} className="w-full mt-6 py-5 bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 backdrop-blur-md text-blue-600 dark:text-blue-400 font-bold rounded-2xl flex justify-center items-center gap-3 transition-colors text-lg shadow-sm border border-white/60 dark:border-white/5 group">
                       <Bookmark className="w-6 h-6 group-hover:scale-110 transition-transform"/> Save This Career
                     </button>
                  </div>
               </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-red-50/70 dark:bg-red-900/20 backdrop-blur-md border border-red-200/50 dark:border-red-900/40 rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-center shadow-sm">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl pointer-events-none">⚠️</div>
               <h3 className="font-black text-red-800 dark:text-red-400 mb-2 text-lg md:text-xl">Career to Reconsider</h3>
               <h4 className="font-black text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">{report.careerToAvoid.title}</h4>
               <p className="text-base md:text-lg text-red-800/80 dark:text-red-200/80 font-medium leading-relaxed">{report.careerToAvoid.reason}</p>
            </div>

            <div className="bg-amber-50/70 dark:bg-amber-900/20 backdrop-blur-md border border-amber-200/50 dark:border-amber-900/40 rounded-[2rem] p-8 flex flex-col justify-center shadow-sm">
               <h3 className="font-black text-amber-900 dark:text-amber-500 mb-4 text-lg md:text-xl">Personality Insight</h3>
               <p className="text-base md:text-lg text-amber-900/90 dark:text-amber-100/90 font-medium leading-relaxed">{report.personalityInsight}</p>
            </div>
          </div>

          <div className="text-center italic text-blue-600 dark:text-blue-400 font-bold px-6 mb-12 text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-sm">
            &quot;{report.motivationalMessage}&quot;
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <button onClick={handleRetake} className="flex-1 py-5 bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-2xl font-bold flex justify-center items-center gap-3 hover:bg-white/70 dark:hover:bg-white/20 transition-colors shadow-sm text-lg active:scale-95">
                <RefreshCw className="w-6 h-6" /> Retake Test
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`My Rahnuma Report:\n${report.topCareers.map(c => c.title).join(', ')}\n\n"Apka Future, Apki Choice!"`)
                  showToast("Summary copied to clipboard!", 'success');
                }} 
                className="flex-1 py-5 bg-gradient-to-r from-blue-600 to-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-bold flex justify-center items-center gap-3 transition-colors shadow-lg shadow-blue-900/20 text-lg active:scale-95"
              >
                <Share2 className="w-6 h-6" /> Share Results
              </button>
          </div>
        </div>
      </div>
    );
  }

  // WIZARD UI
  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-40 md:pb-12 flex flex-col items-center content-start custom-scrollbar">
         
         <div className="w-full max-w-2xl mt-4 md:mt-8 shrink-0">
           {/* Progress Bar */}
           <div className="mb-8">
             <div className="flex justify-between mb-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-3 flex-1 rounded-full mx-1.5 transition-all duration-500 ${step >= i ? 'bg-gradient-to-r from-blue-600 to-indigo-500 shadow-md shadow-blue-900/20' : 'bg-white/40 dark:bg-white/10 border border-white/50 dark:border-white/5'}`} />
                ))}
             </div>
             <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] text-center mt-4 drop-shadow-sm">
               Step {step} of 4 • {step === 1 ? 'Basics' : step === 2 ? 'Exploration' : step === 3 ? 'Strengths' : 'Constraints'}
             </p>
           </div>
         </div>

         <div className="w-full max-w-2xl flex-1 flex flex-col justify-center">
         {loading ? (
             <div className="h-full flex flex-col items-center justify-center space-y-8">
                <div className="p-6 bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 dark:border-white/10">
                   <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                <div className="text-center">
                  <h3 className="font-black text-2xl md:text-3xl text-gray-900 dark:text-white mb-3 drop-shadow-sm">Analyzing Profile...</h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">Cross-referencing Pakistan&apos;s real-time job market.</p>
                </div>
             </div>
         ) : (
           <>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
                    <div className="mb-10 text-center md:text-left">
                      <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white drop-shadow-sm">Let&apos;s get started.</h2>
                      <p className="text-gray-600 dark:text-gray-300 mt-3 font-medium text-lg md:text-xl">Tell us a bit about who you are right now.</p>
                    </div>
                    <div>
                      <input className={`w-full p-5 rounded-[1.5rem] bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border ${errors.name ? 'border-red-400' : 'border-white/60 dark:border-white/10'} outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-bold text-lg text-gray-900 dark:text-white placeholder:text-gray-500 shadow-sm`} placeholder="Your Full Name" value={formData.name} onChange={e=>{setFormData({...formData, name: e.target.value}); if(errors.name) setErrors({...errors, name: ''});}} />
                      {errors.name && <p className="text-red-500 text-sm mt-2 ml-4 font-bold">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-5 md:gap-6">
                      <div>
                        <input className={`w-full p-5 rounded-[1.5rem] bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border ${errors.age ? 'border-red-400' : 'border-white/60 dark:border-white/10'} outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-bold text-lg text-gray-900 dark:text-white placeholder:text-gray-500 shadow-sm`} placeholder="Age" type="number" min={12} max={60} value={formData.age} onChange={e=>{setFormData({...formData, age: Number(e.target.value)||''}); if(errors.age) setErrors({...errors, age: ''});}} />
                        {errors.age && <p className="text-red-500 text-sm mt-2 ml-4 font-bold">{errors.age}</p>}
                      </div>
                      <div>
                        <select className={`w-full p-5 rounded-[1.5rem] bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border ${errors.city ? 'border-red-400' : 'border-white/60 dark:border-white/10'} outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-bold text-lg text-gray-900 dark:text-white shadow-sm appearance-none cursor-pointer`} value={formData.city} onChange={e=>{setFormData({...formData, city: e.target.value}); if(errors.city) setErrors({...errors, city: ''});}}>
                          <option value="" className="text-gray-500">Select City</option>
                          {CITIES.map(c => <option key={c} value={c} className="text-gray-900 dark:text-white">{c}</option>)}
                        </select>
                        {errors.city && <p className="text-red-500 text-sm mt-2 ml-4 font-bold">{errors.city}</p>}
                      </div>
                    </div>
                    <div>
                      <select className={`w-full p-5 rounded-[1.5rem] bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border ${errors.educationLevel ? 'border-red-400' : 'border-white/60 dark:border-white/10'} outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-bold text-lg text-gray-900 dark:text-white shadow-sm appearance-none cursor-pointer`} value={formData.educationLevel} onChange={e=>{setFormData({...formData, educationLevel: e.target.value}); if(errors.educationLevel) setErrors({...errors, educationLevel: ''});}}>
                        <option value="" className="text-gray-500">Current Education Level</option>
                        {EDUCATION.map(c => <option key={c} value={c} className="text-gray-900 dark:text-white">{c}</option>)}
                      </select>
                      {errors.educationLevel && <p className="text-red-500 text-sm mt-2 ml-4 font-bold">{errors.educationLevel}</p>}
                    </div>
                    <div>
                      <input className={`w-full p-5 rounded-[1.5rem] bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border ${errors.subject ? 'border-red-400' : 'border-white/60 dark:border-white/10'} outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-bold text-lg text-gray-900 dark:text-white placeholder:text-gray-500 shadow-sm`} placeholder="Major / Core Subjects (e.g. Pre-Med, ICS)" value={formData.subject} onChange={e=>{setFormData({...formData, subject: e.target.value}); if(errors.subject) setErrors({...errors, subject: ''});}} />
                      {errors.subject && <p className="text-red-500 text-sm mt-2 ml-4 font-bold">{errors.subject}</p>}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
                    <div className="mb-8 text-center md:text-left">
                      <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white drop-shadow-sm">What sparked your curiosity?</h2>
                      <p className="text-gray-600 dark:text-gray-300 mt-3 font-medium text-lg md:text-xl">Tap to select topics you genuinely enjoy exploring.</p>
                    </div>
                    <div>
                      <div className={`flex flex-wrap gap-3 p-2 rounded-[2rem] bg-white/20 dark:bg-black/10 backdrop-blur border ${errors.interests ? 'border-red-400 p-4' : 'border-white/30 dark:border-white/5'}`}>
                         {INTERESTS.map(i => (
                           <button key={i} onClick={() => toggleArrayItem('interests', i)} className={`px-6 py-3 rounded-full text-base font-bold border-2 transition-all active:scale-95 ${formData.interests.includes(i) ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white border-transparent shadow-md shadow-blue-900/20 scale-105' : 'bg-white/60 dark:bg-white/10 text-gray-800 dark:text-gray-200 border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/20 backdrop-blur-md'}`}>
                             {i}
                           </button>
                         ))}
                      </div>
                      {errors.interests && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.interests}</p>}
                    </div>
                    <textarea className="w-full mt-6 p-4 md:p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all font-medium min-h-[120px] resize-none" placeholder="Anything else you are passionate about?" value={formData.otherInterests} onChange={e=>setFormData({...formData, otherInterests: e.target.value})} />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-4">
                    <div className="mb-8">
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Your super powers.</h2>
                      <p className="text-gray-500 mt-2 font-medium md:text-lg">What comes naturally to you?</p>
                    </div>
                    <div className="mb-8">
                      <div className={`flex flex-wrap gap-2 md:gap-3 p-1 rounded-2xl ${errors.skills ? 'border border-red-400 p-3' : ''}`}>
                         {SKILLS.map(i => (
                           <button key={i} onClick={() => toggleArrayItem('skills', i)} className={`px-5 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-bold border-2 transition-all active:scale-95 ${formData.skills.includes(i) ? 'bg-[#FFD700] text-amber-900 border-[#FFD700] shadow-md shadow-amber-900/10' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300'}`}>
                             {i}
                           </button>
                         ))}
                      </div>
                      {errors.skills && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.skills}</p>}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <input className={`w-full p-4 md:p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border ${errors.favSubject ? 'border-red-400' : 'border-gray-200 dark:border-gray-800'} outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 transition-all font-medium md:text-lg`} placeholder="Favorite Subject in School (e.g., Biology)" value={formData.favSubject} onChange={e=>{setFormData({...formData, favSubject: e.target.value}); if(errors.favSubject) setErrors({...errors, favSubject: ''});}} />
                        {errors.favSubject && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.favSubject}</p>}
                      </div>
                      <div>
                        <input className={`w-full p-4 md:p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border ${errors.leastFavSubject ? 'border-red-400' : 'border-gray-200 dark:border-gray-800'} outline-none focus:border-red-300 focus:ring-2 focus:ring-red-300/30 transition-all font-medium md:text-lg`} placeholder="Least Favorite Subject (e.g., Math)" value={formData.leastFavSubject} onChange={e=>{setFormData({...formData, leastFavSubject: e.target.value}); if(errors.leastFavSubject) setErrors({...errors, leastFavSubject: ''});}} />
                        {errors.leastFavSubject && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.leastFavSubject}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
                    <div className="mb-8 text-center md:text-left">
                      <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white drop-shadow-sm">Real-world factors.</h2>
                      <p className="text-gray-600 dark:text-gray-300 mt-3 font-medium text-lg md:text-xl">Let&apos;s align this with reality.</p>
                    </div>
                    
                    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 dark:border-white/10 shadow-sm">
                      <label className="text-lg font-black text-gray-900 dark:text-white mb-6 block">Expected Starting Monthly Income (PKR)</label>
                      <input type="range" min="20000" max="500000" step="10000" className="w-full accent-blue-600 h-3 bg-white/50 dark:bg-black/30 rounded-full appearance-none cursor-pointer border border-white/60 dark:border-white/10" value={formData.incomeGoal} onChange={e=>setFormData({...formData, incomeGoal: Number(e.target.value)})} />
                      <div className="text-blue-600 dark:text-blue-400 font-black text-3xl mt-6 drop-shadow-sm tracking-tight">Rs. {formData.incomeGoal.toLocaleString()}+/month</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <select className={`w-full p-5 rounded-[1.5rem] bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border ${errors.studyAbroad ? 'border-red-400' : 'border-white/60 dark:border-white/10'} outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-bold text-lg text-gray-900 dark:text-white shadow-sm appearance-none cursor-pointer`} value={formData.studyAbroad} onChange={e=>{setFormData({...formData, studyAbroad: e.target.value}); if(errors.studyAbroad) setErrors({...errors, studyAbroad: ''});}}>
                          <option value="" className="text-gray-500">Study Abroad Outlook?</option>
                          <option value="Yes" className="text-gray-900 dark:text-white">Definitely Yes</option>
                          <option value="No" className="text-gray-900 dark:text-white">Prefer to stay</option>
                          <option value="Maybe" className="text-gray-900 dark:text-white">If opportunity arises</option>
                        </select>
                        {errors.studyAbroad && <p className="text-red-500 text-sm mt-2 ml-4 font-bold">{errors.studyAbroad}</p>}
                      </div>

                      <div>
                        <select className={`w-full p-5 rounded-[1.5rem] bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border ${errors.relocate ? 'border-red-400' : 'border-white/60 dark:border-white/10'} outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-bold text-lg text-gray-900 dark:text-white shadow-sm appearance-none cursor-pointer`} value={formData.relocate} onChange={e=>{setFormData({...formData, relocate: e.target.value}); if(errors.relocate) setErrors({...errors, relocate: ''});}}>
                          <option value="" className="text-gray-500">Relocation within PK?</option>
                          <option value="Yes" className="text-gray-900 dark:text-white">Willing to move to big cities</option>
                          <option value="No" className="text-gray-900 dark:text-white">Can&apos;t leave hometown</option>
                        </select>
                        {errors.relocate && <p className="text-red-500 text-sm mt-2 ml-4 font-bold">{errors.relocate}</p>}
                      </div>
                    </div>

                    <div>
                      <select className={`w-full p-5 rounded-[1.5rem] bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border ${errors.financialConstraints ? 'border-red-400' : 'border-white/60 dark:border-white/10'} outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-bold text-lg text-gray-900 dark:text-white shadow-sm appearance-none cursor-pointer`} value={formData.financialConstraints} onChange={e=>{setFormData({...formData, financialConstraints: e.target.value}); if(errors.financialConstraints) setErrors({...errors, financialConstraints: ''});}}>
                        <option value="" className="text-gray-500">Education Financing?</option>
                        <option value="No constraints" className="text-gray-900 dark:text-white">Privately funded</option>
                        <option value="Limited budget" className="text-gray-900 dark:text-white">Need affordable public unis</option>
                        <option value="Scholarship-dependent" className="text-gray-900 dark:text-white">Need 100% Scholarships</option>
                      </select>
                      {errors.financialConstraints && <p className="text-red-500 text-sm mt-2 ml-4 font-bold">{errors.financialConstraints}</p>}
                    </div>

                    <input className="w-full p-5 rounded-[1.5rem] bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/60 dark:border-white/10 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-bold text-lg text-gray-900 dark:text-white placeholder:text-gray-500 shadow-sm" placeholder="Family business? Govt job pressure? (Optional)" value={formData.familyPressure} onChange={e=>setFormData({...formData, familyPressure: e.target.value})} />
                  </motion.div>
                )}
              </AnimatePresence>
           </>
         )}
         </div>
      </div>

      {/* Footer Nav */}
      {!loading && (
        <div className="absolute left-0 right-0 bottom-[100px] md:bottom-6 p-4 md:px-8 bg-gradient-to-t from-white/80 via-white/50 to-transparent dark:from-black/80 dark:via-black/50 dark:to-transparent z-20 flex justify-center pointer-events-none">
          <div className="w-full max-w-2xl flex gap-3 pointer-events-auto mt-8 md:mt-0 bg-white/60 dark:bg-black/60 backdrop-blur-2xl p-2 rounded-[2rem] shadow-xl border border-white/50 dark:border-white/10">
            {step > 1 && (
              <button onClick={() => setStep(s=>s-1)} className="p-4 md:py-4 md:px-6 bg-white/50 dark:bg-white/5 text-gray-800 dark:text-gray-200 rounded-2xl font-bold flex items-center justify-center shrink-0 transition-all hover:bg-white/80 dark:hover:bg-white/20 active:scale-95 shadow-sm border border-white/40 dark:border-white/5">
                <ChevronLeft className="w-6 h-6 md:hidden"/>
                <span className="hidden md:inline">Back</span>
              </button>
            )}
            <button
              onClick={() => {
                setProfile(formData);
                showToast("Profile saved successfully!", "success");
              }}
              className="px-4 md:px-6 py-4 bg-blue-50/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all active:scale-95 hover:bg-blue-100 dark:hover:bg-blue-800/60 backdrop-blur-md shadow-sm border border-blue-200/50 dark:border-blue-800/30"
              title="Save Profile"
            >
              <Bookmark className="w-6 h-6 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Save</span>
            </button>
            {step < 4 ? (
              <button 
                onClick={handleNext} 
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-bold flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/30 text-lg border-transparent"
              >
                Continue <ArrowRight className="w-5 h-5"/>
              </button>
            ) : (
              <button 
                onClick={handleGenerate} 
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-bold flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/30 text-lg border-transparent"
              >
                {t.generateReport}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

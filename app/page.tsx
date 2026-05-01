'use client';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../lib/useLocalStorage';
import { Language, UserProfile, ProfileReport, Career, ChatMessage } from '../lib/types';
import { getTranslations } from '../lib/translations';
import { Home, User, Compass, MessageSquare, Heart, Settings, Github, Linkedin, Sparkles } from 'lucide-react';

import HomeTab from '../components/HomeTab';
import ProfileTab from '../components/ProfileTab';
import ExploreTab from '../components/ExploreTab';
import ChatTab from '../components/ChatTab';
import SavedTab from '../components/SavedTab';
import SettingsDrawer from '../components/SettingsDrawer';
import TutorialModal from '../components/TutorialModal';
import { useToast } from '../components/ToastContext';

export default function App() {
  const { showToast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [lang, setLang] = useLocalStorage<Language>('rahnuma_lang', 'en');
  const [isDark, setIsDark] = useLocalStorage<boolean>('rahnuma_theme', false);
  const [activeTab, setActiveTab] = useState('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Data State
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('rahnuma_profile', null);
  const [report, setReport] = useLocalStorage<ProfileReport | null>('rahnuma_report', null);
  const [savedCareers, setSavedCareers] = useLocalStorage<Career[]>('rahnuma_saved', []);
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>('rahnuma_chat', []);
  
  // Navigation passing
  const [chatInitialMessage, setChatInitialMessage] = useState<string>('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Sync theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  if (!isMounted) return <div className="h-screen flex items-center justify-center bg-gray-50/50 dark:bg-gray-950/50 backdrop-blur-xl"><div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"/></div>;

  const t = getTranslations(lang);
  const isRTL = lang === 'ur_script';

  const handleClearData = () => {
    setProfile(null);
    setReport(null);
    setSavedCareers([]);
    setChatHistory([]);
    setActiveTab('home');
  };

  const saveCareer = (c: Career) => {
    if (!savedCareers.find(x => x.title === c.title)) {
      setSavedCareers([...savedCareers, c]);
      showToast(`${c.title} saved to Meri List!`, 'success');
    } else {
       showToast(`${c.title} is already saved.`, 'info');
    }
  };

  const handleChatAbout = (title: string) => {
    const msg = lang === 'ur_script' ? `مجھے ${title} کے بارے میں مزید بتائیں۔` : lang === 'ur_roman' ? `Mujhe ${title} ke baray mein mazeed batayein.` : `Tell me more about becoming a ${title}.`;
    setChatInitialMessage(msg);
    setActiveTab('chat');
  };

  return (
    <div className={`min-h-screen bg-gray-50/30 dark:bg-black/90 flex flex-col md:flex-row text-gray-900 dark:text-gray-100 overflow-hidden ${lang === 'ur_script' ? 'font-urdu' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* Animated Background blobs for glassmorphism */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
            <div className="absolute top-[-15%] xl:top-[-10%] right-[-10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-blue-400/40 dark:bg-blue-600/30 rounded-full mix-blend-multiply dark:mix-blend-lighten opacity-60 dark:opacity-30 filter blur-[120px] md:blur-[160px] animate-[pulse_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-10%] xl:bottom-[-5%] left-[-15%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-blue-300/40 dark:bg-blue-800/30 rounded-full mix-blend-multiply dark:mix-blend-lighten opacity-60 dark:opacity-30 filter blur-[120px] md:blur-[160px] animate-[pulse_10s_ease-in-out_infinite_2s]"></div>
            <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-purple-300/40 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten opacity-60 dark:opacity-30 filter blur-[120px] md:blur-[140px] animate-[pulse_12s_ease-in-out_infinite_4s]"></div>
        </div>

        {/* Desktop Sidebar (Liquid Glass) */}
        <aside className="hidden md:flex flex-col w-[280px] lg:w-[320px] bg-white/40 dark:bg-gray-950/40 backdrop-blur-3xl border-r rtl:border-l rtl:border-r-0 border-white/40 dark:border-white/5 shrink-0 h-screen transition-all duration-300 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
          <div className="p-8 shrink-0 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-900/20 border border-white/20">🎓</div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">Rahnuma</span>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5 flex items-center gap-1"><Sparkles className="w-3 h-3"/> AI Counselor</div>
            </div>
          </div>
          <nav className="flex-1 px-5 space-y-3 mt-4 overflow-y-auto">
            <NavItem icon={<Home className="w-5 h-5"/>} label={t.home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} isDesktop />
            <NavItem icon={<User className="w-5 h-5"/>} label={t.profile} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} isDesktop />
            <NavItem icon={<Compass className="w-5 h-5"/>} label={t.explore} active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} isDesktop />
            <NavItem icon={<MessageSquare className="w-5 h-5"/>} label={t.chat} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} isDesktop />
            <NavItem icon={<Heart className="w-5 h-5"/>} label={t.saved} active={activeTab === 'saved'} onClick={() => setActiveTab('saved')} isDesktop />
          </nav>
          
          <div className="p-6 shrink-0 mt-auto flex flex-col gap-4">
             {/* Developer Credits */}
             <div className="bg-white/50 dark:bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/50 dark:border-white/10 shadow-sm">
                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Designed & Built By</div>
                <div className="font-bold text-gray-800 dark:text-gray-200 text-sm flex items-center justify-between">
                  Shunaid Ahmed
                  <div className="flex gap-2">
                    <a href="https://github.com/shunaid" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
                    <a href="https://linkedin.com/in/shunaid" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Linkedin className="w-4 h-4" /></a>
                  </div>
                </div>
             </div>

             <button onClick={() => setIsSettingsOpen(true)} className="flex items-center justify-between w-full p-4 bg-white/40 dark:bg-gray-900/40 hover:bg-white/70 dark:hover:bg-gray-800/60 backdrop-blur-md rounded-2xl transition-all border border-white/40 dark:border-white/5 shadow-sm active:scale-95 group">
               <div className="flex items-center gap-3 font-bold text-gray-700 dark:text-gray-200">
                 <Settings className="w-5 h-5 text-gray-500 group-hover:rotate-45 transition-transform duration-500" />
                 <span>{t.settings}</span>
               </div>
             </button>
          </div>
        </aside>

        {/* Main Application Area */}
        <div className="flex-1 relative flex flex-col h-[100dvh] overflow-hidden z-10 p-0 md:p-4 lg:p-6">
           
           {/* Mobile Header (Liquid Glass) */}
           <div className="md:hidden h-[72px] px-5 flex items-center justify-between bg-white/60 dark:bg-black/60 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 shadow-sm z-40 fixed top-0 left-0 right-0 pt-safe">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md border border-white/20">🎓</div>
               <div className="flex flex-col">
                 <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 leading-none">Rahnuma</span>
               </div>
             </div>
             <button onClick={() => setIsSettingsOpen(true)} className="p-2.5 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-full hover:bg-white/80 dark:hover:bg-white/10 transition-all border border-white/40 dark:border-white/10 shadow-sm active:scale-90">
               <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
             </button>
           </div>

           {/* Main Content Area (Glass Card inside MD screens) */}
           <div className="flex-1 relative overflow-hidden bg-white/60 dark:bg-gray-950/50 backdrop-blur-2xl md:rounded-[2rem] border-0 md:border border-white/40 dark:border-white/10 md:shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:md:shadow-[0_8px_32px_rgba(0,0,0,0.4)] mt-[72px] md:mt-0 pb-[100px] md:pb-0">
             <div className={`absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTab === 'home' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
               <HomeTab lang={lang} onNavigate={setActiveTab} />
             </div>
             <div className={`absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTab === 'profile' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
               <ProfileTab lang={lang} profile={profile} setProfile={setProfile} report={report} setReport={setReport} onSaveCareer={saveCareer} />
             </div>
             <div className={`absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTab === 'explore' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
               <ExploreTab lang={lang} onSave={saveCareer} onChatAbout={handleChatAbout} />
             </div>
             <div className={`absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTab === 'chat' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
               {activeTab === 'chat' && <ChatTab lang={lang} history={chatHistory} setHistory={setChatHistory} profile={profile} initialMessage={activeTab === 'chat' ? chatInitialMessage : undefined} />}
             </div>
             <div className={`absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTab === 'saved' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
               <SavedTab lang={lang} saved={savedCareers} setSaved={setSavedCareers} onExplore={() => setActiveTab('explore')} />
             </div>
           </div>

           {/* Mobile Bottom Nav (Floating Pill) */}
           <div className="md:hidden fixed bottom-4 left-4 right-4 h-[72px] bg-white/70 dark:bg-black/70 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex justify-between items-center px-4 z-40 pb-safe-bottom">
             <NavItem icon={<Home/>} label={t.home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
             <NavItem icon={<User/>} label={t.profile} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
             <NavItem icon={<Compass className="w-7 h-7"/>} label={t.explore} active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} isPrimary />
             <NavItem icon={<MessageSquare/>} label={t.chat} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
             <NavItem icon={<Heart/>} label={t.saved} active={activeTab === 'saved'} onClick={() => setActiveTab('saved')} />
           </div>
        </div>

        {/* Settings Drawer */}
        <SettingsDrawer 
          open={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          lang={lang} setLang={setLang} 
          isDark={isDark} setIsDark={setIsDark}
          onClearData={handleClearData}
        />
        
        {/* Tutorial Modal */}
        <TutorialModal lang={lang} />
    </div>
  );
}

function NavItem({ icon, label, active, onClick, isDesktop, isPrimary }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, isDesktop?: boolean, isPrimary?: boolean }) {
  if (isDesktop) {
    return (
      <button 
        onClick={onClick}
        className={`flex items-center w-full gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${active ? 'bg-white/80 dark:bg-white/10 text-gray-900 dark:text-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-white/60 dark:border-white/10 font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-white/40 dark:hover:bg-white/5 border border-transparent font-medium hover:text-gray-800 dark:hover:text-gray-200'}`}
      >
        <div className={`p-1.5 rounded-xl transition-all duration-300 flex items-center justify-center ${active ? 'bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-900/20' : ''}`}>
          {icon}
        </div>
        <span className="text-[15px] tracking-wide">{label}</span>
      </button>
    );
  }

  // Primary Center Button for Mobile
  if (isPrimary) {
    return (
      <button 
        onClick={onClick}
        className="flex flex-col items-center justify-center relative -top-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-900/30 border-4 border-gray-50 dark:border-gray-950 transition-transform active:scale-95"
      >
        {icon}
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all duration-300 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
    >
      <div className={`transition-all duration-300 ${active ? 'scale-110 drop-shadow-md' : 'scale-100'}`}>
        {icon}
      </div>
      <span className={`text-[10px] tracking-wide transition-all ${active ? 'font-bold opacity-100' : 'font-medium opacity-0 translate-y-1 h-0'}`}>{label}</span>
    </button>
  );
}

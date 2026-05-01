'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Mic, Trash2, Loader2, Sparkles } from 'lucide-react';
import { Language, ChatMessage, UserProfile } from '../lib/types';
import { getTranslations } from '../lib/translations';
import { chatCounselor, getChatSuggestions } from '../lib/gemini';
import { useToast } from './ToastContext';

export default function ChatTab({ 
  lang, 
  history, 
  setHistory, 
  profile, 
  initialMessage 
}: { 
  lang: Language, 
  history: ChatMessage[], 
  setHistory: (h: ChatMessage[]) => void, 
  profile: UserProfile | null,
  initialMessage?: string 
}) {
  const { showToast } = useToast();
  const t = getTranslations(lang);
  const isRTL = lang === 'ur_script';
  const [input, setInput] = useState(initialMessage || '');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const initialSuggestions = isRTL 
    ? ["کون سا کیریئر میرے لیے بہتر ہے؟", "آئی ٹی میں نوکریاں", "سکالرشپ کیسے لیں؟", "فری لانسنگ سے پیسے کیسے کمائیں؟"]
    : lang === 'ur_roman' 
      ? ["Kaun sa career best hai?", "IT mein jobs?", "Scholarship kaise milegi?", "Freelancing se paise kaise kamayein?"]
      : ["What career suits me?", "Best IT jobs in Pakistan", "How to get a scholarship?", "How to earn from freelancing?"];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setInput('');
    setLoading(true);
    setSuggestions([]);

    try {
      const geminiHistory: {role: 'user'|'model', parts: {text: string}[]}[] = history.map(m => ({ 
        role: m.sender === 'user' ? 'user' : 'model', 
        parts: [{text: m.text}]
      }));
      
      const aiResponse = await chatCounselor(geminiHistory, text, profile, lang);
      
      const aiMsg: ChatMessage = { id: (Date.now()+1).toString(), sender: 'ai', text: aiResponse };
      setHistory([...newHistory, aiMsg]);
      
      try {
        const sugs = await getChatSuggestions(aiResponse, lang);
        setSuggestions(sugs);
      } catch (e) { console.error("No suggestions generated")}
      
    } catch (e) {
      console.error(e);
      showToast("Something went wrong. Please try again 🙏", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  useEffect(() => {
    if (initialMessage && history.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleSend(initialMessage);
      setInput('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  const handleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Speech recognition not supported in this browser.", 'error');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = isRTL ? 'ur-PK' : lang === 'ur_roman' ? 'ur-PK' : 'en-PK';
    recognition.start();
    recognition.onresult = (e: any) => {
      setInput(e.results[0][0].transcript);
    };
  };

  return (
    <div className="flex flex-col h-full relative bg-white dark:bg-gray-950" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-10 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-3 max-w-3xl mx-auto w-full">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-sm">🎓</div>
           <div className="flex-1">
             <h2 className="font-bold text-gray-900 dark:text-white leading-tight">Rahnuma AI</h2>
             <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Online</p>
           </div>
           <button onClick={() => setHistory([])} className="p-2.5 text-gray-400 hover:text-red-500 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
             <Trash2 className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 pb-[160px] md:pb-[140px] flex flex-col relative">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 mt-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-60 mt-12 md:mt-24">
               <Sparkles className="w-16 h-16 text-[#FFD700] mb-6 drop-shadow-md" />
               <p className="text-center text-base md:text-lg font-medium mb-8 text-gray-700 dark:text-gray-300">Ask me anything about your career!</p>
               <div className="flex flex-wrap justify-center gap-3">
                 {initialSuggestions.map(s => (
                   <button key={s} onClick={() => handleSend(s)} className="bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-2 border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-800 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-colors">
                     {s}
                   </button>
                 ))}
               </div>
            </div>
          ) : (
            history.map(msg => (
              <motion.div 
                initial={{opacity: 0, y: 15, scale: 0.95}} 
                animate={{opacity: 1, y: 0, scale: 1}}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm md:text-base leading-relaxed break-words ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 border-l-blue-600'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl rounded-tl-none flex items-center justify-center gap-1.5 w-20 shadow-sm">
                <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/0 dark:from-gray-950 dark:via-gray-950 px-4 pb-[100px] md:pb-6 pt-16 flex flex-col pointer-events-none z-20">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-3 pointer-events-auto">
          {suggestions.length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)} className="whitespace-nowrap px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-xs md:text-sm font-bold rounded-xl shadow-sm border border-blue-100 dark:border-blue-900 border-b-2 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2 bg-white dark:bg-gray-900 p-2 md:p-3 rounded-3xl shadow-lg border-2 border-blue-100 dark:border-gray-800">
            <button onClick={handleVoice} className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 bg-transparent rounded-full transition-colors shrink-0">
              <Mic className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <textarea 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Message Rahnuma..."
              className="flex-1 max-h-32 min-h-[44px] md:min-h-[50px] bg-transparent resize-none outline-none text-sm md:text-base p-2 my-auto text-gray-800 dark:text-gray-100 leading-snug"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || loading}
              className={`p-3 md:p-3.5 rounded-full shrink-0 transition-all ${input.trim() && !loading ? 'bg-blue-600 text-white scale-100 shadow-md hover:bg-blue-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 scale-95'}`}
            >
              {loading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Send className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

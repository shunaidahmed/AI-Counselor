'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, ArrowRight, Settings, LayoutGrid } from 'lucide-react';
import { useLocalStorage } from '../lib/useLocalStorage';
import { Language } from '../lib/types';
import { getTranslations } from '../lib/translations';

export default function TutorialModal({ lang }: { lang: Language }) {
  const [hasSeenTutorial, setHasSeenTutorial] = useLocalStorage('rahnuma_tutorial', false);
  const [step, setStep] = useState(0);

  const t = getTranslations(lang);
  const isRTL = lang === 'ur_script';

  // We write the text inline here or extract to translations. 
  // Given we have a fixed set of translations, let's keep inline simple based on language, 
  // but using English as base. We'll add rudimentary translations for Urdu.
  
  const slides = [
    {
      icon: <GraduationCap className="w-16 h-16 text-blue-600" />,
      title: lang === 'ur_script' ? "رہنما AI میں خوش آمدید!" : lang === 'ur_roman' ? "Rahnuma AI mein khush aamdeed!" : "Welcome to Rahnuma AI!",
      text: lang === 'ur_script' ? "آپ کا ذاتی AI کیریئر کونسلر پاکستان کے طلباء کے لیے۔" : lang === 'ur_roman' ? "Apka personal AI career counselor Pakistani students ke liye." : "Your personal AI career counselor for Pakistani students.",
    },
    {
      icon: <LayoutGrid className="w-16 h-16 text-blue-600" />,
      title: lang === 'ur_script' ? "نیویگیشن" : lang === 'ur_roman' ? "Navigation" : "Easy Navigation",
      text: lang === 'ur_script' ? "ہوم، پروفائل، کیریئر اور چیٹ کے درمیان سوئچ کرنے کے لیے مینو کا استعمال کریں۔" : lang === 'ur_roman' ? "Home, Profile, Careers aur Chat mein switch karne ke liye menu use karein." : "Use the menu to easily switch between Home, Profile, Explore, Chat, and Saved careers.",
    },
    {
      icon: <Settings className="w-16 h-16 text-gray-600" />,
      title: lang === 'ur_script' ? "ترتیبات اور زبان" : lang === 'ur_roman' ? "Settings aur Zaban" : "Settings & Language",
      text: lang === 'ur_script' ? "زبان تبدیل کرنے یا ڈارک موڈ آن کرنے کے لیے ترتیبات پر ٹیپ کریں۔" : lang === 'ur_roman' ? "Zaban change karne ya Dark Mode ke liye Settings par tap karein." : "Open settings to change language, manage data, or switch to Dark Mode.",
    },
    {
      icon: <span className="text-6xl">🚀</span>,
      title: lang === 'ur_script' ? "شروع کریں!" : lang === 'ur_roman' ? "Shuru Karein!" : "Let's Get Started!",
      text: lang === 'ur_script' ? "اپنی مرضی کے مطابق کیریئر رپورٹ حاصل کرنے کے لیے اپنا پروفائل بنائیں۔" : lang === 'ur_roman' ? "Apni customized career report hasil karne ke liye apna profile banayein." : "Build your profile to get a customized AI career report based on your skills and goals.",
    }
  ];

  if (hasSeenTutorial) return null;

  return (
    <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl"
      >
        <button 
          onClick={() => setHasSeenTutorial(true)}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold`}
        >
          {lang === 'ur_script' ? 'چھوڑیں' : lang === 'ur_roman' ? 'Skip' : 'Skip'}
        </button>

        <div className="flex flex-col items-center text-center mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-full mb-6 inline-flex">
                {slides[step].icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {slides[step].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed px-2">
                {slides[step].text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex flex-col items-center">
          <div className="flex gap-2 mb-6">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-blue-600' : 'w-2 bg-gray-200 dark:bg-gray-700'}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (step < slides.length - 1) {
                setStep(s => s + 1);
              } else {
                setHasSeenTutorial(true);
              }
            }}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            {step < slides.length - 1 
              ? (lang === 'ur_script' ? 'اگلا' : lang === 'ur_roman' ? 'Next' : 'Next') 
              : (lang === 'ur_script' ? 'شروع کریں' : lang === 'ur_roman' ? 'Start exploring' : 'Start exploring')}
            {step < slides.length - 1 && <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

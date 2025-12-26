import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', label: 'EN', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', label: 'FR', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', label: 'عر', flag: '🇱🇧' }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const isRTL = i18n.language === 'ar';

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 transition-all duration-200 text-white backdrop-blur-sm ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <Globe className="h-4 w-4" />
        <span className={`flex items-center ${isRTL ? 'mr-2' : 'ml-2'}`}>
          <span>{currentLanguage.flag}</span>
          <span className={`font-semibold ${isRTL ? 'mr-2' : 'ml-2'}`}>
            {currentLanguage.label}
          </span>
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute mt-2 w-48 rounded-lg shadow-xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 z-50 ${isRTL ? 'right-0' : 'left-0'}`}
          >
            <div className="py-2" role="menu" aria-orientation="vertical">
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  whileHover={{ x: isRTL ? -5 : 5, backgroundColor: 'rgba(79, 70, 229, 0.1)' }}
                  onClick={() => changeLanguage(language.code)}
                  className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors ${
                    i18n.language === language.code 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-300 font-semibold' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                  role="menuitem"
                >
                  <span className={`text-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
                    {language.flag}
                  </span>
                  <span className="flex-1">{language.name}</span>
                  {i18n.language === language.code && (
                    <motion.span 
                      className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
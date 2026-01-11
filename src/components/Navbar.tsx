import { Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import Auth from './Auth';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-indigo-900/95 dark:bg-gray-900/95 backdrop-blur-md text-white border-b border-indigo-800/50 dark:border-gray-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <motion.div 
            className="flex items-center flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
          >
            <Link to="/" className="flex items-center group touch-manipulation">
              <motion.img 
                src="/matex-logo.png" 
                alt="Matex" 
                className="h-10 sm:h-12 md:h-16 w-auto"
                whileHover={{ 
                  rotate: [0, -5, 5, -5, 0],
                  scale: 1.1
                }}
                transition={{ 
                  duration: 0.6,
                  type: "spring"
                }}
              />
              <motion.span 
                className="ml-1 sm:ml-2 text-lg sm:text-xl font-bold"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Matex
              </motion.span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-6">
            {/* Navigation Links */}
            <nav className="flex items-center gap-1">
              {[
                { path: '/', label: t('nav.home') },
                { path: '/about', label: t('nav.about') },
                { path: '/services', label: t('nav.services') },
                { path: '/clients', label: t('nav.clients') },
                { path: '/careers', label: t('nav.careers') },
                { path: '/faq', label: t('nav.faq') }
              ].map((item, index) => (
                <motion.div 
                  key={item.path}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.05, 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <Link 
                    to={item.path} 
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 relative group"
                  >
                    <motion.span
                      className="relative z-10"
                      whileHover={{ x: 1 }}
                    >
                      {item.label}
                    </motion.span>
                    <motion.span
                      className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-white rounded-full -translate-x-1/2"
                      initial={{ width: 0 }}
                      whileHover={{ width: "80%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            {/* Divider */}
            <div className="h-8 w-px bg-white/20" />
            
            {/* Utility Buttons Group */}
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            
            {/* Auth Section */}
            {user ? (
              <>
                <div className="h-8 w-px bg-white/20" />
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/profile" 
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    {t('nav.profile')}
                  </Link>
                </motion.div>
                <motion.button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-white"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('nav.auth.signOut')}</span>
                </motion.button>
              </>
            ) : (
              <>
                <div className="h-8 w-px bg-white/20" />
                <motion.button
                  onClick={() => setShowAuth(true)}
                  className="px-5 py-2 text-sm font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-white backdrop-blur-sm"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('nav.auth.signIn')}
                </motion.button>
              </>
            )}
          </div>

          <motion.div 
            className="md:hidden flex items-center gap-2 sm:gap-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThemeSwitcher />
            <LanguageSwitcher />
            <button
              aria-label="Menu"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-md hover:bg-indigo-800 active:bg-indigo-700 focus:outline-none transition-all duration-300 touch-manipulation"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              {isOpen ? <X size={22} className="sm:w-6 sm:h-6" /> : <Menu size={22} className="sm:w-6 sm:h-6" />}
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            ref={menuRef}
            className="md:hidden"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
          >
          <div className="px-3 pt-2 pb-4 space-y-1 border-t border-indigo-800/50 dark:border-gray-700/50">
            {[
              { path: '/', label: t('nav.home') },
              { path: '/about', label: t('nav.about') },
              { path: '/services', label: t('nav.services') },
              { path: '/clients', label: t('nav.clients') },
              { path: '/careers', label: t('nav.careers') },
              { path: '/faq', label: t('nav.faq') }
            ].map((item, index) => (
              <motion.div 
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block"
              >
                <Link 
                  to={item.path} 
                  className="block px-4 py-3 rounded-md text-base font-medium hover:bg-indigo-800 active:bg-indigo-700 transition-all duration-300 touch-manipulation"
                  style={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            {user ? (
              <motion.button
                onClick={signOut}
                className="w-full flex items-center px-4 py-3 text-base font-medium hover:bg-indigo-800 active:bg-indigo-700 transition-all duration-300 touch-manipulation rounded-md"
                style={{ minHeight: '48px' }}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                {t('nav.auth.signOut')}
              </motion.button>
            ) : (
              <motion.button
                onClick={() => setShowAuth(true)}
                className="w-full text-left px-4 py-3 text-base font-medium hover:bg-indigo-800 active:bg-indigo-700 transition-all duration-300 touch-manipulation rounded-md"
                style={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('nav.auth.signIn')}
              </motion.button>
            )}
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </nav>
  );
};

export default Navbar;
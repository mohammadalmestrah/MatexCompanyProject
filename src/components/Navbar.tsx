import { Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import Auth from './Auth';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
          >
            <Link to="/" className="flex items-center group">
              <motion.img 
                src="/matex-logo.png" 
                alt="Matex" 
                className="h-16 w-auto"
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
                className="ml-2 text-xl font-bold"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Matex
              </motion.span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-2">
            {/* Navigation Links */}
            <div className="flex items-center space-x-1 mr-4">
              {[
                { path: '/', label: t('nav.home') },
                { path: '/about', label: t('nav.about') },
                { path: '/services', label: t('nav.services') },
                { path: '/clients', label: t('nav.clients') },
                { path: '/careers', label: t('nav.careers') }
              ].map((item, index) => (
                <motion.div 
                  key={item.path}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    delay: index * 0.08, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <Link 
                    to={item.path} 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition-all duration-300 relative group overflow-hidden"
                  >
                    <motion.span
                      className="relative z-10"
                      whileHover={{ x: 2 }}
                    >
                      {item.label}
                    </motion.span>
                    <motion.span
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-white"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-indigo-700/20 rounded-md"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Divider */}
            <div className="h-6 w-px bg-indigo-700 mx-2" />
            
            {/* Utility Buttons */}
            <div className="flex items-center space-x-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            
            {/* Auth Section */}
            {user ? (
              <>
                <div className="h-6 w-px bg-indigo-700 mx-2" />
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition-all duration-300">
                    {t('nav.profile')}
                  </Link>
                </motion.div>
                <motion.button
                  onClick={signOut}
                  className="flex items-center px-4 py-2 text-sm font-medium bg-indigo-800 rounded-md hover:bg-indigo-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('nav.auth.signOut')}
                </motion.button>
              </>
            ) : (
              <>
                <div className="h-6 w-px bg-indigo-700 mx-2" />
                <motion.button
                  onClick={() => setShowAuth(true)}
                  className="px-4 py-2 text-sm font-medium bg-indigo-800 rounded-md hover:bg-indigo-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('nav.auth.signIn')}
                </motion.button>
              </>
            )}
          </div>

          <motion.div 
            className="md:hidden flex items-center space-x-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThemeSwitcher />
            <LanguageSwitcher />
            <button
              aria-label="Menu"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-800 focus:outline-none transition-all duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[
              { path: '/', label: t('nav.home') },
              { path: '/about', label: t('nav.about') },
              { path: '/services', label: t('nav.services') },
              { path: '/clients', label: t('nav.clients') },
              { path: '/careers', label: t('nav.careers') }
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
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            {user ? (
              <motion.button
                onClick={signOut}
                className="w-full flex items-center px-3 py-2 text-base font-medium hover:bg-indigo-800 transition-all duration-300"
                whileHover={{ x: 10 }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                {t('nav.auth.signOut')}
              </motion.button>
            ) : (
              <motion.button
                onClick={() => setShowAuth(true)}
                className="w-full text-left px-3 py-2 text-base font-medium hover:bg-indigo-800 transition-all duration-300"
                whileHover={{ x: 10 }}
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
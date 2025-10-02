import { Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
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
          >
            <Link to="/" className="flex items-center">
              <img src="/matex-logo.png" alt="Matex" className="h-16 w-auto" />
              <span className="ml-2 text-xl font-bold">Matex</span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-4">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition-all duration-300">
                  {t('nav.home')}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition-all duration-300">
                  {t('nav.about')}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to="/services" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition-all duration-300">
                  {t('nav.services')}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to="/clients" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition-all duration-300">
                  {t('nav.clients')}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to="/careers" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition-all duration-300">
                  {t('nav.careers')}
                </Link>
              </motion.div>
            </div>
            <LanguageSwitcher />
            {user ? (
              <>
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
              <motion.button
                onClick={() => setShowAuth(true)}
                className="px-4 py-2 text-sm font-medium bg-indigo-800 rounded-md hover:bg-indigo-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('nav.auth.signIn')}
              </motion.button>
            )}
          </div>

          <motion.div 
            className="md:hidden flex items-center space-x-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
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

      {isOpen && (
        <motion.div 
          className="md:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <motion.div whileHover={{ x: 10 }} className="block">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800 transition-all duration-300">
                {t('nav.home')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} className="block">
              <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800 transition-all duration-300">
                {t('nav.about')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} className="block">
              <Link to="/services" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800 transition-all duration-300">
                {t('nav.services')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} className="block">
              <Link to="/clients" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800 transition-all duration-300">
                {t('nav.clients')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} className="block">
              <Link to="/careers" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800 transition-all duration-300">
                {t('nav.careers')}
              </Link>
            </motion.div>
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

      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </nav>
  );
};

export default Navbar;
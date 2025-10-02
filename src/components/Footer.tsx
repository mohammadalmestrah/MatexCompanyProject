import React from 'react';
import { Mail, Phone, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <div className="space-y-2">
              <motion.a 
                href={`mailto:${t('footer.email')}`}
                className="flex items-center hover:text-gray-300 transition-all duration-300"
                whileHover={{ x: 10, color: '#9CA3AF' }}
              >
                <Mail size={18} className="mr-2" />
                {t('footer.email')}
              </motion.a>
              <motion.a 
                href={`tel:${t('footer.phone')}`}
                className="flex items-center hover:text-gray-300 transition-all duration-300"
                whileHover={{ x: 10, color: '#9CA3AF' }}
              >
                <Phone size={18} className="mr-2" />
                {t('footer.phone')}
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.follow')}</h3>
            <div className="flex space-x-4">
              <motion.a 
                href="https://www.linkedin.com/company/103787906"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-all duration-300"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <Linkedin size={24} />
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/matex.leb?igsh=MWN6azR0cnV4MXBlNg%3D%3D&utm_source=qr"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-all duration-300"
                whileHover={{ scale: 1.2, rotate: -10 }}
              >
                <Instagram size={24} />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter')}</h3>
            <form className="flex">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="px-4 py-2 rounded-l-md w-full text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <motion.button
                type="submit"
                className="bg-indigo-600 px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('footer.subscribe')}
              </motion.button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 10 }}>
                <a href="/about" className="hover:text-gray-300 transition-all duration-300">{t('footer.about')}</a>
              </motion.li>
              <motion.li whileHover={{ x: 10 }}>
                <a href="/careers" className="hover:text-gray-300 transition-all duration-300">{t('nav.careers')}</a>
              </motion.li>
              <motion.li whileHover={{ x: 10 }}>
                <a href="/privacy" className="hover:text-gray-300 transition-all duration-300">{t('nav.legal.privacy')}</a>
              </motion.li>
              <motion.li whileHover={{ x: 10 }}>
                <a href="/terms" className="hover:text-gray-300 transition-all duration-300">{t('nav.legal.terms')}</a>
              </motion.li>
            </ul>
          </div>
        </div>

        <motion.div 
          className="mt-8 pt-8 border-t border-gray-800 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <p>&copy; {new Date().getFullYear()} Matex. {t('footer.rights')}</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
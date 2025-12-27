import React, { useState } from 'react';
import { Mail, Phone, Linkedin, Instagram, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    // Simulate API call - Replace with actual newsletter API integration
    try {
      // TODO: Replace with actual newsletter service (Mailchimp, SendGrid, etc.)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for now (replace with actual API)
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      subscribers.push({
        email,
        timestamp: new Date().toISOString(),
        language: (window as any).i18next?.language || 'en'
      });
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white relative overflow-hidden border-t border-gray-800 dark:border-gray-800">
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </motion.div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <motion.img 
              src="/matex-logo.png" 
              alt="Matex" 
              className="h-12 w-auto mb-4"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            />
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-gray-100">{t('footer.contact')}</h3>
            <div className="space-y-2">
              <motion.a 
                href={`mailto:${t('footer.email')}`}
                className="flex items-center hover:text-gray-300 dark:hover:text-gray-400 transition-all duration-300 text-gray-300 dark:text-gray-400"
                whileHover={{ x: 10, color: '#9CA3AF' }}
              >
                <Mail size={18} className="mr-2" />
                {t('footer.email')}
              </motion.a>
              <motion.a 
                href={`tel:${t('footer.phone')}`}
                className="flex items-center hover:text-gray-300 dark:hover:text-gray-400 transition-all duration-300 text-gray-300 dark:text-gray-400"
                whileHover={{ x: 10, color: '#9CA3AF' }}
              >
                <Phone size={18} className="mr-2" />
                {t('footer.phone')}
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-gray-100">{t('footer.follow')}</h3>
            <div className="flex space-x-4">
              <motion.a 
                href="https://www.linkedin.com/company/103787906"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-all duration-300 relative group"
                whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0], y: -5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Linkedin size={24} />
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/matex.leb?igsh=MWN6azR0cnV4MXBlNg%3D%3D&utm_source=qr"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-all duration-300 relative group"
                whileHover={{ scale: 1.3, rotate: [0, 10, -10, 0], y: -5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Instagram size={24} />
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-gray-100">{t('footer.newsletter')}</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  className="px-4 py-2 rounded-l-md w-full text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-600 border border-gray-300 dark:border-gray-600 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                  disabled={isSubmitting}
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  {isSubmitting ? '...' : t('footer.subscribe')}
                </motion.button>
              </div>
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-green-400 text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {t('footer.newsletter.success')}
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-red-400 text-sm"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {t('footer.newsletter.error')}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-gray-100">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: t('footer.about') },
                { href: "/careers", label: t('nav.careers') },
                { href: "/privacy", label: t('nav.legal.privacy') },
                { href: "/terms", label: t('nav.legal.terms') }
              ].map((link, index) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 10, scale: 1.05 }}
                >
                  <a 
                    href={link.href} 
                    className="hover:text-gray-300 dark:hover:text-gray-400 transition-all duration-300 relative inline-block group text-gray-300 dark:text-gray-400"
                  >
                    {link.label}
                    <motion.span
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"
                    />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

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
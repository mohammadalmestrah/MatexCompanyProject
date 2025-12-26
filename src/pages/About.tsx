import { motion } from 'framer-motion';
import { Building2, Users, Globe, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-indigo-900 dark:bg-gray-900 text-white py-24 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl"></div>
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 
              className="text-5xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {t('about.hero.title')}
            </motion.h1>
            <motion.p 
              className="text-xl text-indigo-200 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t('about.hero.description')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.h2 
                className="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {t('about.founder.title')}
              </motion.h2>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                {t('about.founder.description1')}
              </motion.p>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                {t('about.founder.description2')}
              </motion.p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Users, value: "10+", label: t('about.founder.stats.experts') },
                  { icon: Building2, value: "50+", label: t('about.founder.stats.projects') },
                  { icon: Globe, value: "2+", label: t('about.founder.stats.countries') },
                  { icon: Award, value: "2+", label: t('about.founder.stats.awards') }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05, x: 5 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{stat.value}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, x: 50, rotateY: -20 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
            >
              {/* Decorative background elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              
              {/* Image container with enhanced styling */}
              <div className="relative inline-block rounded-2xl shadow-2xl border-4 border-white dark:border-gray-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                <motion.img 
                  src="/image.png" 
                  alt={t('about.founder.name')}
                  className="rounded-xl object-contain w-auto h-auto max-w-full max-h-[700px] block relative z-10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                  loading="eager"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    const target = e.target as HTMLImageElement;
                    // Try alternative path
                    if (!target.src.includes('image.png')) {
                      target.src = "/image.png";
                    }
                  }}
                  onLoad={() => {
                    console.log('Founder image loaded successfully');
                  }}
                />
                
                {/* Enhanced CEO badge - positioned inside image container */}
                <motion.div 
                  className="absolute bottom-4 right-4 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-4 rounded-xl shadow-2xl border-2 border-white/20 backdrop-blur-sm z-20"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
                  whileHover={{ scale: 1.08, rotate: 2, y: -5 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-lg font-semibold">{t('about.founder.role')}</p>
                  </div>
                  <p className="text-sm text-indigo-100">{t('about.founder.name')}</p>
                </motion.div>
              </div>
              
              {/* Decorative corner accent */}
              <motion.div
                className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full blur-2xl opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-3xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {t('about.locations.title')}
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {t('about.locations.subtitle')}
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Lebanon Location */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="h-64 overflow-hidden relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="/beirut-cityscape.jpg" 
                  alt="Beirut, Lebanon - Aerial view of the coastal city with mosque, harbor, and Lebanese flag"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image not found
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop";
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 right-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-2xl font-bold text-white drop-shadow-lg">Beirut, Lebanon</h4>
                  <p className="text-white/90 text-sm mt-1">🇱🇧 Middle East Hub</p>
                </motion.div>
              </motion.div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Lebanon</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p>{t('about.locations.lebanon.address')}</p>
                  <p>{t('about.locations.lebanon.postal')}</p>
                  <p>{t('about.locations.lebanon.email')}</p>
                  <p>{t('about.locations.lebanon.phone')}</p>
                </div>
              </div>
            </motion.div>

            {/* France Location */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="h-64 overflow-hidden relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop" 
                  alt="Paris, France"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 right-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-2xl font-bold text-white drop-shadow-lg">Paris, France</h4>
                  <p className="text-white/90 text-sm mt-1">🇫🇷 City of Light</p>
                </motion.div>
              </motion.div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">France</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p>{t('about.locations.france.address')}</p>
                  <p>{t('about.locations.france.postal')}</p>
                  <p>{t('about.locations.france.email')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
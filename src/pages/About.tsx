import { motion } from 'framer-motion';
import { Building2, Users, Globe, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">{t('about.hero.title')}</h1>
            <p className="text-xl text-indigo-200 leading-relaxed">
              {t('about.hero.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('about.founder.title')}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('about.founder.description1')}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('about.founder.description2')}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-indigo-600 mr-3" />
                  <div>
                    <h4 className="font-semibold">200+</h4>
                    <p className="text-gray-600">{t('about.founder.stats.experts')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-indigo-600 mr-3" />
                  <div>
                    <h4 className="font-semibold">500+</h4>
                    <p className="text-gray-600">{t('about.founder.stats.projects')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Globe className="h-8 w-8 text-indigo-600 mr-3" />
                  <div>
                    <h4 className="font-semibold">30+</h4>
                    <p className="text-gray-600">{t('about.founder.stats.countries')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-indigo-600 mr-3" />
                  <div>
                    <h4 className="font-semibold">50+</h4>
                    <p className="text-gray-600">{t('about.founder.stats.awards')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg" 
                alt={t('about.founder.name')}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-indigo-600 text-white p-6 rounded-lg">
                <p className="text-lg font-semibold">{t('about.founder.role')}</p>
                <p className="text-sm">{t('about.founder.name')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">{t('about.locations.title')}</h2>
            <p className="text-xl text-gray-600">
              {t('about.locations.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white rounded-xl overflow-hidden shadow-lg"
          >
            <div className="h-64 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg" 
                alt="Lebanon Office"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Lebanon</h3>
              <div className="space-y-2 text-gray-600">
                <p>{t('about.locations.lebanon.address')}</p>
                <p>{t('about.locations.lebanon.postal')}</p>
                <p>{t('about.locations.lebanon.email')}</p>
                <p>{t('about.locations.lebanon.phone')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
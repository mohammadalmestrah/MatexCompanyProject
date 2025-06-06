import { ArrowRight, Briefcase, Target, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: <Target className="h-8 w-8" />,
      title: t('home.services.strategic.title'),
      description: t('home.services.strategic.description')
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t('home.services.team.title'),
      description: t('home.services.team.description')
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: t('home.services.delivery.title'),
      description: t('home.services.delivery.description')
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: t('home.services.consulting.title'),
      description: t('home.services.consulting.description')
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <motion.section 
        className="bg-indigo-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <motion.div 
              className="flex justify-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Link
                to="/services"
                className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                {t('home.hero.cta.services')}
              </Link>
              <Link
                to="/clients"
                className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition"
              >
                {t('home.hero.cta.projects')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            {...fadeInUp}
          >
            {t('home.services.title')}
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
                variants={fadeInUp}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-indigo-600 mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link
                  to="/services"
                  className="text-indigo-600 font-medium flex items-center hover:text-indigo-700"
                >
                  {t('home.hero.cta.services')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="text-4xl font-bold text-indigo-600 mb-2">200+</div>
              <div className="text-gray-600">{t('home.stats.projects')}</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-gray-600">{t('home.stats.satisfaction')}</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600">{t('home.stats.consultants')}</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="text-4xl font-bold text-indigo-600 mb-2">10+</div>
              <div className="text-gray-600">{t('home.stats.experience')}</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-20">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">{t('home.cta.title')}</h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('home.cta.subtitle')}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/clients"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition inline-block"
            >
              {t('home.cta.button')}
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
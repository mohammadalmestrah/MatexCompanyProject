import { motion } from 'framer-motion';
import { Brain, Code, Cloud, LightbulbIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: <Brain className="h-12 w-12" />,
      title: t('services.categories.ai.title'),
      description: t('services.categories.ai.description'),
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
    },
    {
      icon: <Code className="h-12 w-12" />,
      title: t('services.categories.software.title'),
      description: t('services.categories.software.description'),
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
    },
    {
      icon: <Cloud className="h-12 w-12" />,
      title: t('services.categories.cloud.title'),
      description: t('services.categories.cloud.description'),
      image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
    },
    {
      icon: <LightbulbIcon className="h-12 w-12" />,
      title: t('services.categories.consulting.title'),
      description: t('services.categories.consulting.description'),
      image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg"
    }
  ];

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
            <h1 className="text-5xl font-bold mb-6">{t('services.hero.title')}</h1>
            <p className="text-xl text-indigo-200 leading-relaxed">
              {t('services.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="text-indigo-600 mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <Link
                    to="/client-requirements"
                    className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700"
                  >
                    Learn More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
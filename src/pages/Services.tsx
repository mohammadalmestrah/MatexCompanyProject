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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-indigo-900 dark:bg-gray-900 text-white py-24 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-300 rounded-full blur-3xl"></div>
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
              {t('services.hero.title')}
            </motion.h1>
            <motion.p 
              className="text-xl text-indigo-200 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t('services.hero.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.15, 
                  duration: 0.7, 
                  type: "spring",
                  stiffness: 100
                }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group relative border border-gray-200 dark:border-gray-700"
                whileHover={{ y: -10, scale: 1.03, rotateY: 2, z: 20 }}
              >
                <motion.div 
                  className="h-48 overflow-hidden relative"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  <motion.img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-indigo-600/40 via-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <motion.div
                    className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  />
                </motion.div>
                <div className="p-8">
                  <motion.div 
                    className="text-indigo-600 dark:text-indigo-400 mb-4"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      to="/client-requirements"
                      className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                    >
                      Learn More →
                    </Link>
                  </motion.div>
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
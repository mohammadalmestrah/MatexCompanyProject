import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Clients = () => {
  const { t } = useTranslation();

  const clients = [
    {
      name: "Global Tech Solutions",
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
      description: "AI-driven enterprise solutions"
    },
    {
      name: "HealthTech Innovations",
      image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg",
      description: "Healthcare technology platform"
    },
    {
      name: "FinTech Leaders",
      image: "https://images.pexels.com/photos/3183190/pexels-photo-3183190.jpeg",
      description: "Financial technology solutions"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-900 text-white py-24 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
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
              {t('clients.hero.title')}
            </motion.h1>
            <motion.p 
              className="text-xl text-indigo-200 leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t('clients.hero.subtitle')}
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/client-requirements"
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-900 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
              >
                {t('clients.hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.85, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.15, 
                  duration: 0.7, 
                  type: "spring",
                  stiffness: 100
                }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group relative"
                whileHover={{ y: -12, scale: 1.05, rotateY: 3, z: 30 }}
              >
                <motion.div 
                  className="h-48 overflow-hidden relative"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  <motion.img 
                    src={client.image}
                    alt={client.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-indigo-600/40 via-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.div>
                <div className="p-6">
                  <motion.h3 
                    className="text-xl font-bold mb-2"
                    whileHover={{ color: "#4F46E5" }}
                    transition={{ duration: 0.2 }}
                  >
                    {client.name}
                  </motion.h3>
                  <p className="text-gray-600">{client.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-indigo-900 text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h2 
              className="text-3xl font-bold mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {t('clients.testimonials.title')}
            </motion.h2>
            <motion.blockquote 
              className="text-xl italic mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {t('clients.testimonials.quote')}
            </motion.blockquote>
            <motion.div 
              className="font-semibold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {t('clients.testimonials.author')}
            </motion.div>
            <motion.div 
              className="text-indigo-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {t('clients.testimonials.position')}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Clients;
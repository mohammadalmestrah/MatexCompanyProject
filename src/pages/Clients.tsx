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
      <section className="bg-indigo-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">{t('clients.hero.title')}</h1>
            <p className="text-xl text-indigo-200 leading-relaxed mb-8">
              {t('clients.hero.subtitle')}
            </p>
            <Link
              to="/client-requirements"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-900 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
            >
              {t('clients.hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={client.image}
                    alt={client.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{client.name}</h3>
                  <p className="text-gray-600">{client.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8">{t('clients.testimonials.title')}</h2>
            <blockquote className="text-xl italic mb-6">
              {t('clients.testimonials.quote')}
            </blockquote>
            <div className="font-semibold">{t('clients.testimonials.author')}</div>
            <div className="text-indigo-300">{t('clients.testimonials.position')}</div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Clients;
import { ArrowRight, Briefcase, Target, Clock, Users, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

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
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <motion.section 
        className="bg-indigo-900 dark:bg-gray-900 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <motion.div 
            className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {t('home.hero.title')}
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {t('home.hero.subtitle')}
            </motion.p>
            <motion.div 
              className="flex justify-center gap-4 flex-wrap"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                <Link
                  to="/services"
                  className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 inline-block relative overflow-hidden group"
                >
                  <motion.span
                    className="relative z-10"
                    whileHover={{ x: 2 }}
                  >
                    {t('home.hero.cta.services')}
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-indigo-50"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              >
                <Link
                  to="/clients"
                  className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition-all duration-300 inline-block relative overflow-hidden group"
                >
                  <motion.span
                    className="relative z-10"
                    whileHover={{ x: 2 }}
                  >
                    {t('home.hero.cta.projects')}
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('home.services.title')}
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative border border-gray-200 dark:border-gray-700"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-50 dark:from-indigo-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-indigo-600 mb-4 relative z-10"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  {service.icon}
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold mb-2 relative z-10 text-gray-900 dark:text-white"
                  whileHover={{ color: "#4F46E5" }}
                  transition={{ duration: 0.2 }}
                >
                  {service.title}
                </motion.h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 relative z-10">{service.description}</p>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="relative z-10"
                >
                  <Link
                    to="/services"
                    className="text-indigo-600 font-medium flex items-center hover:text-indigo-700 transition-colors group/link"
                  >
                    {t('home.hero.cta.services')} 
                    <motion.span
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </motion.div>

          <TestimonialsCarousel t={t} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "200+", label: t('home.stats.projects') },
              { value: "95%", label: t('home.stats.satisfaction') },
              { value: "50+", label: t('home.stats.consultants') },
              { value: "10+", label: t('home.stats.experience') }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6, 
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.1, y: -8, rotateY: 5, z: 50 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group border border-gray-200 dark:border-gray-700"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-100 dark:from-indigo-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  whileHover={{ scale: 1.1, color: "#4338CA" }}
                >
                  {stat.value}
                </motion.div>
                <motion.div 
                  className="text-gray-600 dark:text-gray-300 relative z-10"
                  whileHover={{ color: "#4F46E5" }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t('home.cta.title')}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
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

// Testimonials Carousel Component
const TestimonialsCarousel = ({ t }: { t: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = t('home.testimonials.items', { returnObjects: true }) as Array<{
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
    image?: string;
  }>;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative">
      <motion.div
        className="overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="flex transition-transform duration-500 ease-in-out"
          animate={{ x: `-${currentIndex * 100}%` }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="min-w-full px-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto"
              >
                <Quote className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-indigo-600'
                : 'w-2 bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all border border-gray-200 dark:border-gray-700"
        aria-label="Previous testimonial"
      >
        <ArrowRight className="h-5 w-5 rotate-180" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all border border-gray-200 dark:border-gray-700"
        aria-label="Next testimonial"
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Home;
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 'services',
      title: t('faq.categories.services.title'),
      icon: <HelpCircle className="h-6 w-6" />,
      questions: t('faq.categories.services.questions', { returnObjects: true }) as Array<{ q: string; a: string }>
    },
    {
      id: 'pricing',
      title: t('faq.categories.pricing.title'),
      icon: <HelpCircle className="h-6 w-6" />,
      questions: t('faq.categories.pricing.questions', { returnObjects: true }) as Array<{ q: string; a: string }>
    },
    {
      id: 'careers',
      title: t('faq.categories.careers.title'),
      icon: <HelpCircle className="h-6 w-6" />,
      questions: t('faq.categories.careers.questions', { returnObjects: true }) as Array<{ q: string; a: string }>
    },
    {
      id: 'contact',
      title: t('faq.categories.contact.title'),
      icon: <HelpCircle className="h-6 w-6" />,
      questions: t('faq.categories.contact.questions', { returnObjects: true }) as Array<{ q: string; a: string }>
    },
    {
      id: 'technical',
      title: t('faq.categories.technical.title'),
      icon: <HelpCircle className="h-6 w-6" />,
      questions: t('faq.categories.technical.questions', { returnObjects: true }) as Array<{ q: string; a: string }>
    }
  ];

  // Flatten all questions for search
  const allQuestions = categories.flatMap((cat, catIndex) =>
    cat.questions.map((item, qIndex) => ({
      ...item,
      category: cat.title,
      categoryId: cat.id,
      globalIndex: catIndex * 1000 + qIndex
    }))
  );

  // Filter questions based on search
  const filteredCategories = searchQuery
    ? categories.map(cat => ({
        ...cat,
        questions: cat.questions.filter(
          item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0)
    : categories;

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
              {t('faq.hero.title')}
            </motion.h1>
            <motion.p
              className="text-xl text-indigo-200 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t('faq.hero.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('faq.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </motion.div>
          {searchQuery && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center"
            >
              {t('faq.search.results', { count: filteredCategories.reduce((acc, cat) => acc + cat.questions.length, 0) })}
            </motion.p>
          )}
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: catIndex * 0.1, duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category.title}
                </h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((item, qIndex) => {
                  const globalIndex = catIndex * 1000 + qIndex;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <motion.div
                      key={qIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: qIndex * 0.05 }}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
                      >
                        <span className="font-semibold text-gray-900 dark:text-white pr-4">
                          {item.q}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {filteredCategories.length === 0 && searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t('faq.search.noResults')}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('faq.cta.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('faq.cta.subtitle')}
            </p>
            <a
              href={`mailto:${t('footer.email')}`}
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              {t('faq.cta.button')}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;


import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck, Bell, HardDrive, Globe, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation();
  
  const sections = [
    {
      icon: <Shield className="w-6 h-6 text-indigo-600" />,
      title: "Data Protection",
      content: "We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction."
    },
    {
      icon: <Lock className="w-6 h-6 text-indigo-600" />,
      title: "Information Security",
      content: "Your data is encrypted both in transit and at rest using state-of-the-art encryption protocols and technologies."
    },
    {
      icon: <Eye className="w-6 h-6 text-indigo-600" />,
      title: "Privacy First",
      content: "We are committed to protecting your privacy and handling your data with transparency and integrity."
    },
    {
      icon: <UserCheck className="w-6 h-6 text-indigo-600" />,
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal information at any time."
    }
  ];

  const dataCollected = [
    {
      icon: <Globe className="w-5 h-5 text-indigo-500" />,
      title: "Browser Information",
      items: ["IP address", "Browser type and version", "Operating system", "Device information"]
    },
    {
      icon: <HardDrive className="w-5 h-5 text-indigo-500" />,
      title: "Usage Data",
      items: ["Pages visited", "Time spent on site", "Links clicked", "User preferences"]
    },
    {
      icon: <Bell className="w-5 h-5 text-indigo-500" />,
      title: "Communication Data",
      items: ["Email correspondence", "Support tickets", "Feedback submissions", "Newsletter preferences"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-indigo-900 dark:bg-gray-900 text-white py-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-indigo-300" />
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-indigo-200 text-lg">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
          </p>
          <p className="text-indigo-300 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </motion.div>

      {/* Key Points Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="text-indigo-600 dark:text-indigo-400">{section.icon}</div>
                <h3 className="text-lg font-semibold ml-3 text-gray-900 dark:text-white">{section.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-8">
            <div className="prose prose-indigo dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Information We Collect</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {dataCollected.map((category, index) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                  >
                    <div className="flex items-center mb-4">
                      <div className="text-indigo-500 dark:text-indigo-400">{category.icon}</div>
                      <h3 className="text-lg font-medium ml-2 text-gray-900 dark:text-white">{category.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {category.items.map((item, i) => (
                        <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                          <span className="w-1.5 h-1.5 bg-indigo-400 dark:bg-indigo-500 rounded-full mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">How We Use Your Information</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We use the collected information for various purposes, including:
                </p>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>Providing and maintaining our services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>Improving and personalizing user experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>Analyzing and optimizing our services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>Communicating with you about updates and promotions</span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Your Privacy Rights</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  You have several rights regarding your personal data, including:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    "Right to access your personal data",
                    "Right to correct inaccurate information",
                    "Right to request deletion of your data",
                    "Right to restrict processing of your data",
                    "Right to data portability",
                    "Right to object to processing"
                  ].map((right, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <UserCheck className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{right}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Contact Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-8"
              >
                <div className="flex items-center mb-6">
                  <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-2xl font-semibold ml-3 text-gray-900 dark:text-white">Contact Us</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p>Email: contact@matexsolution.com</p>
                  <p>Phone: +961 76162549</p>
                  <p>Address: Lebanon</p>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
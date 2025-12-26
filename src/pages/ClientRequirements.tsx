import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Wallet, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ClientRequirements = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    projectType: '',
    projectDescription: '',
    budget: '',
    timeline: '',
    paymentMethod: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        setError(''); // Clear any auth errors when user logs in
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      // Don't set error here - let users fill the form first
    } catch (error) {
      console.error('Error checking authentication:', error);
      // Only set error if there's an actual error, not just missing auth
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Allow navigation between steps without authentication
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Only require authentication on final submission
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please log in to submit your project request. Click "Sign In" in the navigation bar to continue.');
        // Scroll to top to show the error
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const { error: submitError } = await supabase
        .from('client_projects')
        .insert({
          company_name: formData.companyName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          project_type: formData.projectType,
          project_description: formData.projectDescription,
          budget_range: formData.budget,
          timeline: formData.timeline,
          payment_method: formData.paymentMethod,
          payment_status: 'pending',
          project_status: 'new',
          user_id: user.id
        });

      if (submitError) throw submitError;

      setStep(4); // Move to payment
    } catch (error) {
      console.error('Error submitting project:', error);
      setError('Failed to submit project. Please try again.');
    }
  };

  const handlePayPalApprove = async (actions: any) => {
    try {
      await actions.order.capture();
      setSubmitted(true);
      setError('');
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
  };

  const handleWishMoneyPayment = () => {
    window.open(`https://wa.me/76162549`, '_blank');
    setSubmitted(true);
  };

  const handleWisePayment = () => {
    navigator.clipboard.writeText('mohammadmestrah10@gmail.com');
    window.open('https://wise.com/pay', '_blank');
    setSubmitted(true);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('requirements.companyInfo')}</h2>
            {!isAuthenticated && (
              <motion.div 
                className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-600 p-4 mb-6 rounded-r-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400 dark:text-blue-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      <strong>Note:</strong> You can fill out the form now, but you'll need to log in before submitting your project request.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('requirements.companyName')}
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('requirements.contactName')}
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('requirements.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('requirements.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('requirements.projectDetails')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('requirements.projectType')}
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">{t('requirements.selectProjectType')}</option>
                  <option value="web">{t('requirements.types.web')}</option>
                  <option value="mobile">{t('requirements.types.mobile')}</option>
                  <option value="design">{t('requirements.types.design')}</option>
                  <option value="consulting">{t('requirements.types.consulting')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('requirements.projectDescription')}
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('requirements.budgetTimeline')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('requirements.budgetRange')}
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">{t('requirements.selectBudget')}</option>
                  <option value="small">{t('requirements.budgets.small')}</option>
                  <option value="medium">{t('requirements.budgets.medium')}</option>
                  <option value="large">{t('requirements.budgets.large')}</option>
                  <option value="enterprise">{t('requirements.budgets.enterprise')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('requirements.timeline')}
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">{t('requirements.selectTimeline')}</option>
                  <option value="1-3">{t('requirements.timelines.m1_3')}</option>
                  <option value="3-6">{t('requirements.timelines.m3_6')}</option>
                  <option value="6-12">{t('requirements.timelines.m6_12')}</option>
                  <option value="12+">{t('requirements.timelines.m12_plus')}</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('requirements.paymentMethod')}</h2>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-green-500 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('requirements.thanksTitle')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('requirements.thanksBody')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {/* PayPal Option */}
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors bg-white dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('requirements.paypal')}</h3>
                      <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{t('requirements.paypalDesc')}</p>
                    {/* <PayPalScriptProvider options={{ 
                      "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                      currency: "USD"
                    }}>
                      <PayPalButtons
                        createOrder={(actions) => {
                          return actions.order.create({
                            purchase_units: [{
                              amount: {
                                value: "500.00" // Example amount
                              }
                            }]
                          });
                        }}
                        onApprove={handlePayPalApprove}
                        style={{ layout: "horizontal" }}
                      />
                    </PayPalScriptProvider> */}
                  </div>

                  {/* Wish Money Option */}
                  <div 
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer bg-white dark:bg-gray-700"
                    onClick={handleWishMoneyPayment}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('requirements.wishMoney')}</h3>
                      <Wallet className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{t('requirements.wishMoneyDesc')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact: Mohammad Almestrah (76162549)</p>
                  </div>

                  {/* Wise Option */}
                  <div 
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer bg-white dark:bg-gray-700"
                    onClick={handleWisePayment}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('requirements.wise')}</h3>
                      <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{t('requirements.wiseDesc')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email: mohammadmestrah10@gmail.com</p>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</div>
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <motion.h1 
            className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {t('requirements.title')}
          </motion.h1>

          <motion.div 
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <motion.div
                    key={stepNumber}
                    className={`flex items-center ${
                      stepNumber < 4 ? 'flex-1' : ''
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + stepNumber * 0.1, duration: 0.4 }}
                  >
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        step >= stepNumber
                          ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      animate={step >= stepNumber ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {stepNumber}
                    </motion.div>
                    {stepNumber < 4 && (
                      <motion.div
                        className={`flex-1 h-1 mx-4 ${
                          step > stepNumber ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: step > stepNumber ? 1 : 0.3 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {error && (
              <motion.div 
                className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4 rounded-r-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              {renderStep()}
              
              {step < 4 && (
                <div className="mt-8 flex justify-between">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
                    >
                      {t('requirements.back')}
                    </button>
                  )}
                  <motion.button
                    type="submit"
                    className={`px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors ${
                      step === 1 ? 'ml-auto' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {step === 3 ? t('requirements.proceed') : t('requirements.next')}
                  </motion.button>
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientRequirements;
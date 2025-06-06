import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Wallet, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const ClientRequirements = () => {
  const navigate = useNavigate();
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
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      if (!user) {
        setError('Please log in to submit a project request.');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setError('Authentication check failed. Please try again.');
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

    if (!isAuthenticated) {
      setError('You must be logged in to submit a project. Please log in and try again.');
      navigate('/login'); // Assuming you have a login route
      return;
    }

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to submit a project. Please log in and try again.');
        navigate('/login');
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
            <h2 className="text-2xl font-bold mb-6">Company Information</h2>
            {!isAuthenticated && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Please log in to submit a project request.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Project Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a project type</option>
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile App</option>
                  <option value="design">UI/UX Design</option>
                  <option value="consulting">Consulting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Budget & Timeline</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select budget range</option>
                  <option value="small">$5,000 - $10,000</option>
                  <option value="medium">$10,000 - $25,000</option>
                  <option value="large">$25,000 - $50,000</option>
                  <option value="enterprise">$50,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select timeline</option>
                  <option value="1-3">1-3 months</option>
                  <option value="3-6">3-6 months</option>
                  <option value="6-12">6-12 months</option>
                  <option value="12+">12+ months</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                <p className="text-gray-600">
                  Your project requirements and payment have been submitted. We'll contact you shortly.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {/* PayPal Option */}
                  <div className="border rounded-lg p-6 hover:border-indigo-500 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">PayPal</h3>
                      <CreditCard className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="text-gray-600 mb-4">Pay securely with PayPal</p>
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
                    className="border rounded-lg p-6 hover:border-indigo-500 transition-colors cursor-pointer"
                    onClick={handleWishMoneyPayment}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Wish Money</h3>
                      <Wallet className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="text-gray-600 mb-4">Send money via Wish Money</p>
                    <p className="text-sm text-gray-500">Contact: Mohammad Almestrah (76162549)</p>
                  </div>

                  {/* Wise Option */}
                  <div 
                    className="border rounded-lg p-6 hover:border-indigo-500 transition-colors cursor-pointer"
                    onClick={handleWisePayment}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Wise (TransferWise)</h3>
                      <CreditCard className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="text-gray-600 mb-4">International bank transfer via Wise</p>
                    <p className="text-sm text-gray-500">Email: mohammadmestrah10@gmail.com</p>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm mt-2">{error}</div>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center mb-8">
            Project Requirements & Payment
          </h1>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`flex items-center ${
                      stepNumber < 4 ? 'flex-1' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= stepNumber
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div
                        className={`flex-1 h-1 mx-4 ${
                          step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {renderStep()}
              
              {step < 4 && (
                <div className="mt-8 flex justify-between">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                      step === 1 ? 'ml-auto' : ''
                    }`}
                    disabled={!isAuthenticated}
                  >
                    {step === 3 ? 'Proceed to Payment' : 'Next'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientRequirements;
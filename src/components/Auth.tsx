import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader, X, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

interface AuthProps {
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [useOtp, setUseOtp] = useState(import.meta.env.VITE_USE_CUSTOM_OTP === 'true');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const isValidEmail = (value: string) => /.+@.+\..+/.test(value.trim());
  const isValidPassword = (value: string) => value.trim().length >= 6;
  const isFormValid = isValidEmail(email) && isValidPassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        console.log('Attempting signup with email:', email);
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) {
          throw signUpError;
        }

        console.log('Signup successful:', data);
        setSignupSuccess(true);
        // Auto switch to signin mode after successful signup
        setTimeout(() => {
          setMode('signin');
          setSignupSuccess(false);
        }, 3000);
      } else {
        if (useOtp) {
          if (!otpSent) {
            if (import.meta.env.VITE_USE_CUSTOM_OTP === 'true') {
              const res = await fetch('/api/otp/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              });
              if (!res.ok) throw new Error(await res.text());
              setOtpSent(true);
            } else {
              const { error: otpError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                  shouldCreateUser: true
                }
              });
              if (otpError) throw otpError;
              setOtpSent(true);
            }
          } else {
            if (import.meta.env.VITE_USE_CUSTOM_OTP === 'true') {
              const res = await fetch('/api/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otpCode })
              });
              if (!res.ok) throw new Error(t('auth.invalidOtpError'));
              onClose();
            } else {
              const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: otpCode,
                type: 'email'
              } as any);
              if (verifyError || !data?.session) {
                throw verifyError || new Error(t('auth.invalidOtpError'));
              }
              onClose();
            }
          }
        } else {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError || !data?.session) {
            throw signInError || new Error('Invalid login credentials');
          }
          onClose();
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      if (error.message.includes('Email not confirmed')) {
        setError(t('auth.emailNotConfirmedError'));
      } else if (error.message.includes('Invalid login credentials')) {
        setError(t('auth.invalidCredentialsError'));
      } else if (error.message.includes('User already registered')) {
        setError(t('auth.userAlreadyExistsError'));
      } else if (useOtp) {
        setError(t('auth.invalidOtpError'));
      } else {
        setError(error.message || t('auth.genericAuthError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </motion.button>

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8 text-white text-center">
            <h2 className="text-2xl font-bold">
              {t(mode === 'signin' ? 'auth.welcomeBack' : 'auth.createAccount')}
            </h2>
            <p className="text-indigo-200 mt-2">
              {t(mode === 'signin' ? 'auth.signInMessage' : 'auth.signUpMessage')}
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            {signupSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 text-green-700 p-4 rounded-lg mb-4 flex items-center"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                <div>
                  <p className="font-medium">{t('auth.signupSuccess')}</p>
                  <p className="text-sm">{t('auth.signupSuccessMessage')}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    placeholder={t('auth.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              {!useOtp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type={hidePassword ? "password" : "text"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900"
                      placeholder={t('auth.passwordPlaceholder')}
                      required={!useOtp}
                    />
                    <button
                      type="button"
                      onClick={() => setHidePassword(!hidePassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <EyeOff className={`h-5 w-5 ${hidePassword ? 'text-gray-400' : 'text-indigo-600'}`} />
                    </button>
                  </div>
                </div>
              )}

              {useOtp && otpSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth.code')}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    placeholder={t('auth.codePlaceholder')}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">{t('auth.codeSent')}</p>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 text-sm rounded-lg p-3 border border-red-100 flex items-center"
                >
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading || (!useOtp && !isFormValid) || (useOtp && !email)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5" />
                    <span>{t('auth.processing')}</span>
                  </>
                ) : (
                  <span>
                    {mode === 'signin'
                      ? (useOtp ? (otpSent ? t('auth.verifyCode') : t('auth.sendCode')) : t('nav.auth.signIn'))
                      : t('auth.createAccount')}
                  </span>
                )}
              </motion.button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('auth.or')}</span>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="w-full text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t(mode === 'signin' ? 'auth.noAccount' : 'auth.haveAccount')}
              </motion.button>

              {mode === 'signin' && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setUseOtp(!useOtp);
                    setOtpSent(false);
                    setOtpCode('');
                    setError(null);
                  }}
                  className="w-full text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t(useOtp ? 'auth.usePasswordInstead' : 'auth.useEmailCode')}
                </motion.button>
              )}
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Auth;
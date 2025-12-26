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
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 min-h-screen"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ 
            type: "spring", 
            stiffness: 300,
            damping: 30,
            duration: 0.5 
          }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Animated Background Gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </motion.button>

          {/* Header */}
          <motion.div 
            className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 dark:from-indigo-700 dark:via-indigo-800 dark:to-indigo-900 px-6 py-8 text-white text-center relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
            <motion.h2 
              className="text-2xl font-bold relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t(mode === 'signin' ? 'auth.welcomeBack' : 'auth.createAccount')}
            </motion.h2>
            <motion.p 
              className="text-indigo-200 dark:text-indigo-300 mt-2 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t(mode === 'signin' ? 'auth.signInMessage' : 'auth.signUpMessage')}
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.div 
            className="p-6 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {signupSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg mb-4 flex items-center border border-green-200 dark:border-green-800"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                </motion.div>
                <div>
                  <p className="font-medium">{t('auth.signupSuccess')}</p>
                  <p className="text-sm">{t('auth.signupSuccessMessage')}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 z-10" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder={t('auth.emailPlaceholder')}
                    required
                  />
                </div>
              </motion.div>

              {!useOtp && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 z-10" />
                    <input
                      type={hidePassword ? "password" : "text"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder={t('auth.passwordPlaceholder')}
                      required={!useOtp}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setHidePassword(!hidePassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <EyeOff className={`h-5 w-5 ${hidePassword ? 'text-gray-400 dark:text-gray-500' : 'text-indigo-600 dark:text-indigo-400'}`} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {useOtp && otpSent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('auth.code')}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-center text-2xl tracking-widest"
                    placeholder={t('auth.codePlaceholder')}
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">{t('auth.codeSent')}</p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center"
                >
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading || (!useOtp && !isFormValid) || (useOtp && !email)}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-indigo-500/50 dark:shadow-indigo-500/30"
                whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
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

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t('auth.or')}</span>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="w-full text-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                whileHover={{ scale: 1.02, x: 2 }}
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
                  className="w-full text-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t(useOtp ? 'auth.usePasswordInstead' : 'auth.useEmailCode')}
                </motion.button>
              )}
            </form>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Auth;
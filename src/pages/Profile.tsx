import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, ShieldCheck, LogOut, Trash2, Mail, CreditCard, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const email = user?.email ?? '';

  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState<string>('');
  const [twoFAUri, setTwoFAUri] = useState<string>('');
  const [twoFACode, setTwoFACode] = useState('');
  const [loading2FA, setLoading2FA] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maskEmail = useMemo(() => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    const masked = name.length > 2 ? name[0] + '*'.repeat(name.length - 2) + name[name.length - 1] : name;
    return `${masked}@${domain}`;
  }, [email]);

  const start2FASetup = async () => {
    if (!email) return;
    try {
      setLoading2FA(true);
      setError(null);
      const res = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTwoFASecret(data.secret);
      setTwoFAUri(data.otpauth_url);
    } catch (e: any) {
      setError(e.message || 'Failed to start 2FA');
    } finally {
      setLoading2FA(false);
    }
  };

  const verify2FA = async () => {
    if (!email || !twoFACode) return;
    try {
      setLoading2FA(true);
      setError(null);
      const res = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: twoFACode })
      });
      if (!res.ok) throw new Error(await res.text());
      setTwoFAEnabled(true);
    } catch (e: any) {
      setError(e.message || 'Invalid 2FA code');
    } finally {
      setLoading2FA(false);
    }
  };

  const logoutOtherSessions = async () => {
    try {
      // If Supabase configured, this signs out current session only. For true multi-session logout, back your auth with RLS/session table.
      await signOut();
    } catch {}
  };

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      // Placeholder: In production, call a secure backend/edge function to delete the user by server-side key.
      alert('Account deletion requested. Please implement secure backend deletion.');
      await signOut();
    } catch (e) {
      console.error(e);
    }
  };

  const [tab, setTab] = useState<'info' | 'invoices' | 'delete'>('info');

  return (
    <div className="min-h-screen bg-white text-gray-900" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-8 border-b border-white/10 text-sm">
          <button className={`pb-3 transition-colors ${tab==='info' ? 'text-violet-700 border-b-2 border-violet-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setTab('info')}>{t('profile.tabs.info')}</button>
          <button className={`pb-3 transition-colors ${tab==='invoices' ? 'text-violet-700 border-b-2 border-violet-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setTab('invoices')}>{t('profile.tabs.invoices')}</button>
          <button className={`pb-3 transition-colors ${tab==='delete' ? 'text-violet-700 border-b-2 border-violet-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setTab('delete')}>{t('profile.tabs.delete')}</button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mt-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {tab === 'info' && (
          <div className="mt-8 rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">{t('profile.title')}</h2>
            <p className="text-gray-600 mb-6">{t('profile.subtitle')}</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-700 mb-2">{t('profile.name')}</label>
                <input className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 transition" defaultValue={email?.split('@')[0]} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">{t('profile.email')}</label>
                <input className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 transition" defaultValue={maskEmail} />
              </div>
              <button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl py-3 font-medium shadow-[0_10px_25px_-10px_rgba(79,70,229,0.6)] transition text-white">{t('profile.save')}</button>
            </div>
          </div>
        )}

        {tab === 'invoices' && (
          <div className="mt-8 rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">{t('profile.invoicesTitle')}</h2>
            <p className="text-gray-600">{t('profile.invoicesEmpty')}</p>
          </div>
        )}

        {tab === 'delete' && (
          <div className="mt-8 rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2 text-violet-700">{t('profile.deleteTitle')}</h2>
            <p className="text-gray-600 mb-4">{t('profile.deleteBody')}</p>
            <button onClick={deleteAccount} className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-white">{t('profile.deleteCta')}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;



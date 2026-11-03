import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, AlertCircle, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const {
    lang,
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginSocial,
    registerAccount,
    loginUser,
    authNoticeMessage,
    setAuthNoticeMessage
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'social'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleManualAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        const res = await registerAccount(name, identifier, password);
        if (!res.success) {
          setLocalError(res.error || (lang === 'fr' ? 'Échec de l\'inscription' : 'فشل إنشاء الحساب'));
        }
      } else {
        const res = await loginUser(identifier, password);
        if (!res.success) {
          setLocalError(res.error || (lang === 'fr' ? 'Échec de la connexion' : 'فشل تسجيل الدخول'));
        }
      }
    } catch (err: any) {
      console.error('Auth submit error:', err);
      setLocalError(lang === 'fr' ? 'Une erreur est survenue.' : 'حدث خطأ غير متوقع، يرجى المحاولة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 max-w-md w-full shadow-2xl relative transition-colors overflow-hidden"
      >
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Close Modal Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setAuthNoticeMessage(null);
            setMode('login');
            setLocalError(null);
          }}
          className="absolute top-5 ltr:right-5 rtl:left-5 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20 font-black text-xl sm:text-2xl transform -rotate-3">
            RG<span className="text-red-500">S</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            RoiGroupe<span className="text-red-500">S</span><span className="text-amber-500">.com</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-bold">
            {mode === 'login' && (lang === 'fr' ? 'Connectez-vous à votre compte' : 'سجل الدخول إلى حسابك الخاص')}
            {mode === 'register' && (lang === 'fr' ? 'Création d\'un compte membre' : 'تسجيل حساب عضو جديد')}
            {mode === 'social' && (lang === 'fr' ? 'Accès direct et rapide' : 'تسجيل الدخول السريع')}
          </p>
        </div>

        {/* Navigation Tabs (Login / Register) */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => { setMode('login'); setLocalError(null); }}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'fr' ? 'Connexion' : 'تسجيل الدخول'}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setLocalError(null); }}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'fr' ? 'Nouveau compte' : 'تسجيل عضو جديد'}
          </button>
        </div>

        {/* Error/Notice Messages */}
        {(authNoticeMessage || localError) && (
          <div className="mb-5 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-900 dark:text-amber-300 text-xs font-black flex items-start gap-2.5 animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <span className="leading-relaxed">{localError || authNoticeMessage}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {mode === 'social' ? (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <button
                onClick={() => loginSocial('google')}
                className="w-full py-3.5 px-5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-black text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.1 0-5.74-2.09-6.68-4.91H1.28v3.13C3.26 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.6H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.4l4.04-3.13z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.6l4.04 3.13c.94-2.82 3.58-4.98 6.68-4.98z" />
                </svg>
                <span>{lang === 'fr' ? 'Continuer avec Google' : 'الدخول بواسطة حساب Google'}</span>
              </button>

              <button
                onClick={() => loginSocial('facebook')}
                className="w-full py-3.5 px-5 bg-[#1877F2] hover:bg-[#166fe5] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>{lang === 'fr' ? 'Continuer avec Facebook' : 'الدخول بواسطة حساب Facebook'}</span>
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
                >
                  {lang === 'fr' ? 'Utiliser un mot de passe' : 'أو الدخول باسم المستخدم وكلمة المرور'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleManualAuth}
              className="space-y-3.5"
            >
              {/* Full Name Field (Register only) */}
              {mode === 'register' && (
                <div className="relative">
                  <User className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder={lang === 'fr' ? 'Nom complet' : 'الاسم الكامل'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden font-bold"
                  />
                </div>
              )}

              {/* Identifier Field: ALWAYS type="text" for login to allow usernames like 'manager' or 'admin' without browser validation */}
              <div className="relative">
                {mode === 'register' ? (
                  <Mail className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                ) : (
                  <User className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                )}
                <input
                  type={mode === 'register' ? 'email' : 'text'}
                  required
                  placeholder={
                    mode === 'register'
                      ? (lang === 'fr' ? 'Adresse e-mail' : 'البريد الإلكتروني')
                      : (lang === 'fr' ? 'Nom d\'utilisateur ou e-mail' : 'اسم المستخدم أو البريد الإلكتروني')
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden font-bold text-slate-900 dark:text-white"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder={lang === 'fr' ? 'Mot de passe' : 'كلمة المرور'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden font-bold text-slate-900 dark:text-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? (lang === 'fr' ? 'Se connecter' : 'دخول') : (lang === 'fr' ? 'Créer le compte' : 'تسجيل الحساب')}</span>
                    {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>

              {/* Social Login Option Link */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('social');
                    setLocalError(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {lang === 'fr' ? 'Ou se connecter avec Google / Facebook' : 'أو الدخول عبر Google أو Facebook'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured by RoiGroupes Auth</span>
        </div>
      </motion.div>
    </div>
  );
};

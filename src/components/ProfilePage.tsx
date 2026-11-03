import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { processImageFile } from '../utils/imageUpload';
import {
  User,
  Camera,
  Save,
  LogOut,
  ShieldCheck,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Trash2,
  LayoutDashboard,
  ArrowRight,
  ArrowLeft,
  Lock
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { lang, currentUser, updateCurrentUser, logout, navigateToView } = useApp();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setAvatar(currentUser.avatar || '');
      setPhone(currentUser.phone || '');
      setBio(currentUser.bio || '');
      setNewPassword('');
      setSaveSuccess(false);
      setErrorMessage(null);
    } else {
      navigateToView('home');
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      setErrorMessage(null);
      const optimizedBase64 = await processImageFile(file, 280, 0.85);
      setAvatar(optimizedBase64);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setErrorMessage(err?.message || (lang === 'fr' ? 'Échec du traitement de l\'image' : 'حدث خطأ أثناء معالجة الصورة'));
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=f59e0b&color=0f172a&bold=true`;
    setAvatar(defaultAvatar);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage(lang === 'fr' ? 'Veuillez saisir votre nom' : 'يرجى كتابة الاسم الشخصي');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const updates: any = {
        name: name.trim(),
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f59e0b&color=0f172a`,
        phone: phone.trim(),
        bio: bio.trim(),
      };

      if (newPassword.trim()) {
        updates.passwordHash = newPassword.trim();
      }

      const res = await updateCurrentUser(updates);
      if (res && !res.success) {
        setErrorMessage(res.error || (lang === 'fr' ? 'Échec de la sauvegarde' : 'حدث خطأ أثناء حفظ التعديلات'));
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error('Save profile error:', err);
      setErrorMessage(lang === 'fr' ? 'Une erreur est survenue' : 'حدث خطأ غير متوقع');
    } finally {
      setIsSaving(false);
    }
  };

  const isAdmin = currentUser.role === 'admin' || currentUser.id === 'user-admin';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs / Back button */}
        <button
          onClick={() => navigateToView('home')}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors cursor-pointer group"
        >
          {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span className="text-sm font-bold">{lang === 'fr' ? 'Retour à l\'accueil' : 'العودة للرئيسية'}</span>
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Sidebar info */}
            <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 border-b lg:border-b-0 lg:border-l rtl:lg:border-l-0 rtl:lg:border-r border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl group cursor-pointer bg-slate-100 dark:bg-slate-800 transition-transform active:scale-95"
                >
                  <img
                    src={avatar || 'https://ui-avatars.com/api/?name=User&background=f59e0b&color=0f172a'}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2">
                    <Camera className="w-6 h-6 mb-1 text-amber-400" />
                    <span className="text-[10px] font-black">{lang === 'fr' ? 'Changer' : 'تغيير'}</span>
                  </div>
                  {isProcessingImage && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-amber-400">
                      <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2.5 bg-amber-500 text-white rounded-2xl shadow-lg border-2 border-white dark:border-slate-900 hover:scale-110 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">{name}</h2>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-6 ${
                isAdmin
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAdmin ? (lang === 'fr' ? 'Manager' : 'مدير الإدارة') : (lang === 'fr' ? 'Membre vérifié' : 'عضو موثق')}</span>
              </div>

              <div className="w-full space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                {isAdmin && (
                  <button
                    onClick={() => navigateToView('admin')}
                    className="w-full py-3 px-4 bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-white border border-amber-500/30 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{lang === 'fr' ? 'Tableau de bord' : 'لوحة الإدارة'}</span>
                  </button>
                )}
                <button
                  onClick={logout}
                  className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white border border-rose-500/20 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Déconnexion' : 'تسجيل الخروج'}</span>
                </button>
              </div>
            </div>

            {/* Main form */}
            <div className="p-8 lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {lang === 'fr' ? 'Modifier le profil' : 'تعديل بيانات الحساب'}
                </h1>
              </div>

              {saveSuccess && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-3 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{lang === 'fr' ? 'Profil mis à jour avec succès !' : 'تم حفظ البيانات بنجاح!'}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 block">
                      {lang === 'fr' ? 'Nom complet' : 'الاسم الكامل'}
                    </label>
                    <div className="relative">
                      <User className="w-4.5 h-4.5 text-amber-500 absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={lang === 'fr' ? 'Votre nom' : 'اكتب اسمك هنا'}
                        className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl ltr:pl-12 rtl:pr-12 px-4 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 block">
                      {lang === 'fr' ? 'Téléphone / WhatsApp' : 'رقم الهاتف / واتساب'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4.5 h-4.5 text-emerald-500 absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+213 655 00 00 00"
                        className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl ltr:pl-12 rtl:pr-12 px-4 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 dark:text-slate-300 block">
                    {lang === 'fr' ? 'Biographie / Secteur d\'activité' : 'النبذة الشخصية / مجال العمل'}
                  </label>
                  <div className="relative">
                    <FileText className="w-4.5 h-4.5 text-amber-500 absolute ltr:left-4 rtl:right-4 top-4 pointer-events-none" />
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder={lang === 'fr' ? 'Dites-nous en plus sur vous...' : 'اكتب نبذة قصيرة عنك أو عن عملك...'}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl ltr:pl-12 rtl:pr-12 p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 block opacity-60">
                      {lang === 'fr' ? 'Adresse E-mail (Non modifiable)' : 'البريد الإلكتروني (لا يمكن تغييره)'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4.5 h-4.5 text-slate-400 absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        disabled
                        value={currentUser.email}
                        className="w-full h-12 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl ltr:pl-12 rtl:pr-12 px-4 text-slate-500 dark:text-slate-400 font-mono cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 block">
                      {lang === 'fr' ? 'Nouveau mot de passe' : 'كلمة مرور جديدة'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4.5 h-4.5 text-amber-500 absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl ltr:pl-12 rtl:pr-12 px-4 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving || isProcessingImage}
                    className="w-full sm:w-auto px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{lang === 'fr' ? 'Enregistrer les modifications' : 'حفظ التغييرات'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

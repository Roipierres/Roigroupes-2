import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { processImageFile } from '../utils/imageUpload';
import {
  X,
  User,
  Camera,
  Save,
  LogOut,
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  FileText,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Sparkles,
  Trash2,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
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

  // Sync state whenever modal opens or currentUser updates
  useEffect(() => {
    if (currentUser && isOpen) {
      setName(currentUser.name || '');
      setAvatar(currentUser.avatar || '');
      setPhone(currentUser.phone || '');
      setBio(currentUser.bio || '');
      setNewPassword('');
      setSaveSuccess(false);
      setErrorMessage(null);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  // Handle direct file upload from device (camera, phone gallery, PC files)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      setErrorMessage(null);
      // Process & compress on client side via canvas - no external URL needed!
      const optimizedBase64 = await processImageFile(file, 280, 0.85);
      setAvatar(optimizedBase64);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setErrorMessage(err?.message || (lang === 'fr' ? 'Échec du traitement de l\'image' : 'حدث خطأ أثناء معالجة الصورة'));
    } finally {
      setIsProcessingImage(false);
      // Reset input so same file can be re-selected if needed
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
        setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      console.error('Save profile error:', err);
      setErrorMessage(lang === 'fr' ? 'Une erreur est survenue' : 'حدث خطأ غير متوقع');
    } finally {
      setIsSaving(false);
    }
  };

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Background Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-6 ltr:right-4 sm:ltr:right-6 rtl:left-4 sm:rtl:left-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          title={lang === 'fr' ? 'Fermer' : 'إغلاق'}
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Header / Avatar Uploader Section */}
        <div className="text-center mb-5 shrink-0">
          {/* Avatar Container with interactive Camera Overlay */}
          <div className="relative inline-block mb-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-amber-500/30 shadow-xl shadow-amber-500/10 group cursor-pointer bg-slate-100 dark:bg-slate-800 transition-transform active:scale-95 mx-auto"
              title={lang === 'fr' ? 'Cliquez pour choisir une photo' : 'انقر لاختيار صورة من جهازك'}
            >
              <img
                src={avatar || 'https://ui-avatars.com/api/?name=User&background=f59e0b&color=0f172a'}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover / Active Camera Overlay */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2">
                <Camera className="w-6 h-6 mb-1 text-amber-400" />
                <span className="text-[10px] font-black text-center leading-tight">
                  {lang === 'fr' ? 'Changer' : 'تغيير الصورة'}
                </span>
              </div>

              {/* Loading spinner when processing local image */}
              {isProcessingImage && (
                <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-amber-400">
                  <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Direct Device Upload Quick Badge Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 ltr:-right-1.5 rtl:-left-1.5 p-2 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 rounded-2xl shadow-lg border-2 border-white dark:border-slate-900 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title={lang === 'fr' ? 'Importer une photo depuis l\'appareil' : 'رفع صورة من جهازك'}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Hidden File Input for Device Selection (Supports Camera & Gallery) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/jpg"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Action buttons under avatar */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingImage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{lang === 'fr' ? 'Importer une photo depuis l\'appareil' : 'رفع صورة من جهازك'}</span>
            </button>

            {avatar && !avatar.includes('ui-avatars.com') && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title={lang === 'fr' ? 'Réinitialiser la photo' : 'استعادة الصورة الافتراضية'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Profile Name & Role Tag */}
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {name || (lang === 'fr' ? 'Mon Profil' : 'ملفي الشخصي')}
          </h2>

          <div className="flex items-center justify-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isAdmin
                ? 'bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
            }`}>
              <ShieldCheck className="w-3 h-3" />
              <span>{isAdmin ? (lang === 'fr' ? 'Manager' : 'مدير الإدارة') : (lang === 'fr' ? 'Membre vérifié' : 'عضو موثق')}</span>
            </span>

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  navigateToView('admin');
                  onClose();
                }}
                className="mt-2.5 w-full py-2 px-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                <span>{lang === 'fr' ? 'Ouvrir le Tableau de Gestion' : 'الانتقال إلى لوحة إدارة المنصة'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback Notices */}
        {saveSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{lang === 'fr' ? 'Profil mis à jour avec succès !' : 'تم حفظ وتحديث بيانات البروفيل بنجاح!'}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-rose-800 dark:text-rose-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="space-y-3.5 text-xs font-medium overflow-y-auto pr-1">
          {/* Display Name */}
          <div>
            <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">
              {lang === 'fr' ? 'Nom complet / Pseudonyme :' : 'الاسم الكامل أو المستعار :'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-amber-500 absolute ltr:left-3.5 rtl:right-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'fr' ? 'Votre nom' : 'اكتب اسمك هنا'}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl py-3 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden transition-all text-xs"
              />
            </div>
          </div>

          {/* Phone Number / WhatsApp */}
          <div>
            <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">
              {lang === 'fr' ? 'Numéro de téléphone / WhatsApp :' : 'رقم الهاتف أو الواتساب :'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-emerald-500 absolute ltr:left-3.5 rtl:right-3.5 top-3.5 pointer-events-none" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +213 655 00 00 00"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl py-3 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden transition-all text-xs"
              />
            </div>
          </div>

          {/* Bio / Status */}
          <div>
            <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">
              {lang === 'fr' ? 'À propos de vous (Bio / Activité) :' : 'نبذة شخصية أو مجال العمل :'}
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-amber-500 absolute ltr:left-3.5 rtl:right-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={lang === 'fr' ? 'Ex: Développeur, commerçant...' : 'مثال: تاجر، مطور تطبيقات، مهتم بالأمان...'}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl py-3 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden transition-all text-xs"
              />
            </div>
          </div>

          {/* Change Password (Optional) */}
          <div>
            <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">
              {lang === 'fr' ? 'Nouveau mot de passe (optionnel) :' : 'تغيير كلمة المرور (اختياري) :'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-500 absolute ltr:left-3.5 rtl:right-3.5 top-3.5 pointer-events-none" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={lang === 'fr' ? 'Laisser vide pour ne pas changer' : 'اتركه فارغاً إذا كنت لا تريد التغيير'}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl py-3 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden transition-all text-xs"
              />
            </div>
          </div>

          {/* Read-only Email display */}
          <div>
            <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold opacity-60">
              {lang === 'fr' ? 'Adresse E-mail du compte :' : 'البريد الإلكتروني المعتمد :'}
            </label>
            <div className="relative opacity-70">
              <Mail className="w-4 h-4 text-slate-400 absolute ltr:left-3.5 rtl:right-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-slate-500 dark:text-slate-400 font-mono text-xs cursor-not-allowed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2 shrink-0">
            <button
              type="submit"
              disabled={isSaving || isProcessingImage}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Enregistrer les modifications' : 'حفظ التغييرات والصورة'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Se déconnecter' : 'تسجيل الخروج من الحساب'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

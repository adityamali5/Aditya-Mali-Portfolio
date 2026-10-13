import React, { useState, useRef } from 'react';
import {
  X,
  Award,
  User,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Edit3,
  RotateCcw,
  Download,
  Plus,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sliders,
  Mail,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Cloud,
  RefreshCw,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificateItem } from '../types/portfolio';
import { compressImageFile } from '../utils/imageCompressor';
import { isFirebaseConfigured, uploadBase64ToCloud } from '../services/firebase';
import { uploadImageToBackend } from '../services/backendApi';

export const AdminPanel: React.FC = () => {
  const {
    data,
    updateHero,
    updateAbout,
    updateEducation,
    updateExperience,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    updateSkills,
    updateContact,
    resetToDefaults,
    importData,
    isAdminOpen,
    setIsAdminOpen,
    activeAdminTab,
    setActiveAdminTab,
    isCloudConnected,
    cloudSyncStatus,
    syncWithCloud,
  } = usePortfolio();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certToDelete, setCertToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  // Master password for Admin Panel
  const ADMIN_PASSWORD = 'Aditya@14072025';
  const AUTH_STORAGE_KEY = 'aditya_portfolio_admin_auth_session';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'authenticated';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!passwordInput.trim()) {
      setAuthError('Please enter the master admin password.');
      return;
    }

    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticating(true);
      setTimeout(() => {
        try {
          sessionStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
        } catch {
          // ignore
        }
        setIsAuthenticated(true);
        setIsAuthenticating(false);
        setPasswordInput('');
        setAuthError(null);
        showToast('Admin access granted. Welcome Aditya!');
      }, 250);
    } else {
      setAuthError('Incorrect password. Access denied.');
    }
  };

  const handleClosePanel = () => {
    // Automatically immediately lock the panel on closing
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setPasswordInput('');
    setAuthError(null);
    setIsAdminOpen(false);
  };

  // Automatically immediately lock the panel whenever it is closed
  React.useEffect(() => {
    if (!isAdminOpen) {
      setIsAuthenticated(false);
      setPasswordInput('');
      setAuthError(null);
      try {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, [isAdminOpen]);

  // Immediately lock panel on browser tab close or page reload
  React.useEffect(() => {
    const handleTabClose = () => {
      try {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {
        // ignore
      }
    };
    window.addEventListener('beforeunload', handleTabClose);
    window.addEventListener('pagehide', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      window.removeEventListener('pagehide', handleTabClose);
    };
  }, []);

  // Lock and close panel when Escape key is pressed
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAdminOpen) {
        handleClosePanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminOpen]);

  // New certificate form state
  const [certForm, setCertForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    recipient: 'ADITYA MALI',
    badge: 'OFFICIAL CREDENTIAL',
    tag: 'CERTIFIED SKILL',
    verifiedText: '★ VERIFIED',
    category: 'Achievement',
    heading: '',
    highlightText: 'Verified credential and project evaluation',
    imageUrl: '',
    metaLeft: 'TRACK: DEV EXCELLENCE',
    metaRight: 'VERIFIED CREDENTIAL',
    colorTheme: 'cyan', // cyan, purple, blue, amber, emerald
  });

  const [isUploadingCertImage, setIsUploadingCertImage] = useState(false);
  const [isUploadingHeroImage, setIsUploadingHeroImage] = useState(false);
  const certFileInputRef = useRef<HTMLInputElement | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);
  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);
  const mainContentRef = useRef<HTMLElement | null>(null);

  // Local copy of hero for editing
  const [heroForm, setHeroForm] = useState(data.hero);
  // Local copy of about
  const [aboutForm, setAboutForm] = useState(data.about);
  // Local copy of education
  const [eduForm, setEduForm] = useState(data.education);
  // Local copy of contact
  const [contactForm, setContactForm] = useState(data.contact);

  // Keep synced when panel opens
  React.useEffect(() => {
    if (isAdminOpen) {
      setHeroForm(data.hero);
      setAboutForm(data.about);
      setEduForm(data.education);
      setContactForm(data.contact);
    }
  }, [isAdminOpen, data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  if (!isAdminOpen) return null;

  // Handle certificate image upload
  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCertImage(true);
      const compressedDataUrl = await compressImageFile(file, 1400, 0.88);

      if (isFirebaseConfigured) {
        showToast('Uploading certificate photo to Firebase Cloud Storage...');
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const storagePath = `certificates/cert_${Date.now()}_${sanitizedName}`;
        const cloudUrl = await uploadBase64ToCloud(compressedDataUrl, storagePath);
        setCertForm((prev) => ({ ...prev, imageUrl: cloudUrl }));
        showToast('Certificate photo uploaded to Firebase Cloud Storage! ☁️');
      } else {
        showToast('Saving certificate photo permanently to server...');
        const storedUrl = await uploadImageToBackend(compressedDataUrl, file.name, 'certificates');
        setCertForm((prev) => ({ ...prev, imageUrl: storedUrl }));
        showToast('Certificate photo saved permanently to server! 📁');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not process image. Please try a standard JPG or PNG file.');
    } finally {
      setIsUploadingCertImage(false);
    }
  };

  // Handle hero profile photo upload
  const handleHeroPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingHeroImage(true);
      const compressedDataUrl = await compressImageFile(file, 1000, 0.88);

      if (isFirebaseConfigured) {
        showToast('Uploading profile portrait to Firebase Cloud Storage...');
        const storagePath = `photos/hero_portrait_${Date.now()}.jpg`;
        const cloudUrl = await uploadBase64ToCloud(compressedDataUrl, storagePath);
        setHeroForm((prev) => ({ ...prev, photoUrl: cloudUrl }));
        updateHero({ photoUrl: cloudUrl });
        showToast('Profile photo uploaded to Firebase Cloud Storage! ☁️');
      } else {
        showToast('Saving profile photo permanently to server...');
        const storedUrl = await uploadImageToBackend(compressedDataUrl, file.name, 'photos');
        setHeroForm((prev) => ({ ...prev, photoUrl: storedUrl }));
        updateHero({ photoUrl: storedUrl });
        showToast('Profile photo saved permanently to server! 📁');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not process photo file.');
    } finally {
      setIsUploadingHeroImage(false);
    }
  };

  // Color theme mapper for new certificates
  const getColorClasses = (theme: string) => {
    switch (theme) {
      case 'purple':
        return {
          gradientClass: 'from-purple-950 via-slate-900 to-slate-950',
          borderClass: 'border-purple-500/40',
          accentColor: 'text-purple-400',
        };
      case 'blue':
        return {
          gradientClass: 'from-blue-950 via-slate-900 to-slate-950',
          borderClass: 'border-blue-500/40',
          accentColor: 'text-blue-400',
        };
      case 'amber':
        return {
          gradientClass: 'from-amber-950 via-slate-900 to-slate-950',
          borderClass: 'border-amber-500/40',
          accentColor: 'text-amber-400',
        };
      case 'emerald':
        return {
          gradientClass: 'from-emerald-950 via-slate-900 to-slate-950',
          borderClass: 'border-emerald-500/40',
          accentColor: 'text-emerald-400',
        };
      case 'cyan':
      default:
        return {
          gradientClass: 'from-cyan-950 via-slate-900 to-slate-950',
          borderClass: 'border-cyan-500/40',
          accentColor: 'text-cyan-400',
        };
    }
  };

  // Submit / Post new certificate or update existing
  const handlePostCertificate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!certForm.title.trim()) {
      setFormError('Please enter a certificate title before posting.');
      return;
    }
    if (!certForm.description.trim()) {
      setFormError('Please enter a certificate description before posting.');
      return;
    }
    setFormError(null);

    const colors = getColorClasses(certForm.colorTheme);

    if (editingCertId) {
      // Update existing
      updateCertificate(editingCertId, {
        title: certForm.title,
        subtitle: certForm.subtitle || 'Verified Credential',
        description: certForm.description,
        recipient: certForm.recipient || 'ADITYA MALI',
        badge: certForm.badge || 'OFFICIAL CREDENTIAL',
        tag: certForm.tag || 'CERTIFIED SKILL',
        verifiedText: certForm.verifiedText || '★ VERIFIED',
        category: certForm.category || 'Achievement',
        heading: certForm.heading || certForm.title,
        highlightText: certForm.highlightText || 'Verified achievement',
        imageUrl: certForm.imageUrl,
        metaLeft: certForm.metaLeft,
        metaRight: certForm.metaRight,
        ...colors,
      });
      setEditingCertId(null);
      showToast('Certificate successfully updated!');
    } else {
      // Add new
      addCertificate({
        title: certForm.title,
        subtitle: certForm.subtitle || 'Verified Credential',
        description: certForm.description,
        recipient: certForm.recipient || 'ADITYA MALI',
        badge: certForm.badge || 'OFFICIAL CREDENTIAL',
        tag: certForm.tag || 'CERTIFIED SKILL',
        verifiedText: certForm.verifiedText || '★ VERIFIED',
        category: certForm.category || 'Achievement',
        heading: certForm.heading || certForm.title,
        highlightText: certForm.highlightText || 'Verified credential & project excellence',
        imageUrl: certForm.imageUrl,
        metaLeft: certForm.metaLeft || 'ID: CERT-' + Math.floor(1000 + Math.random() * 9000),
        metaRight: certForm.metaRight || 'OFFICIAL VERIFIED',
        ...colors,
      });
      showToast('Certificate successfully published & posted to portfolio!');
    }

    // Reset form
    setCertForm({
      title: '',
      subtitle: '',
      description: '',
      recipient: 'ADITYA MALI',
      badge: 'OFFICIAL CREDENTIAL',
      tag: 'CERTIFIED SKILL',
      verifiedText: '★ VERIFIED',
      category: 'Achievement',
      heading: '',
      highlightText: 'Verified credential and project evaluation',
      imageUrl: '',
      metaLeft: 'TRACK: DEV EXCELLENCE',
      metaRight: 'VERIFIED CREDENTIAL',
      colorTheme: 'cyan',
    });
  };

  const handleStartEditCert = (cert: CertificateItem) => {
    setEditingCertId(cert.id);
    setCertForm({
      title: cert.title,
      subtitle: cert.subtitle,
      description: cert.description,
      recipient: cert.recipient,
      badge: cert.badge,
      tag: cert.tag,
      verifiedText: cert.verifiedText,
      category: cert.category,
      heading: cert.heading,
      highlightText: cert.highlightText,
      imageUrl: cert.imageUrl || '',
      metaLeft: cert.metaLeft,
      metaRight: cert.metaRight,
      colorTheme: 'cyan',
    });
    // Scroll to top of tab
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditCert = () => {
    setEditingCertId(null);
    setCertForm({
      title: '',
      subtitle: '',
      description: '',
      recipient: 'ADITYA MALI',
      badge: 'OFFICIAL CREDENTIAL',
      tag: 'CERTIFIED SKILL',
      verifiedText: '★ VERIFIED',
      category: 'Achievement',
      heading: '',
      highlightText: 'Verified credential and project evaluation',
      imageUrl: '',
      metaLeft: 'TRACK: DEV EXCELLENCE',
      metaRight: 'VERIFIED CREDENTIAL',
      colorTheme: 'cyan',
    });
  };

  const handleDeleteCert = (id: string, title: string) => {
    setCertToDelete({ id, title });
  };

  // Save Hero Section
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(heroForm);
    showToast('Hero section details saved successfully!');
  };

  // Save About Section
  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateAbout(aboutForm);
    showToast('About Me details saved successfully!');
  };

  // Save Education Section
  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault();
    updateEducation(eduForm);
    showToast('Education details saved successfully!');
  };

  // Save Contact Section
  // Save Contact Section
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContact(contactForm);
    showToast('Contact details saved successfully!');
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aditya_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Portfolio backup JSON exported!');
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (importData(parsed)) {
          showToast('Portfolio data imported successfully!');
        } else {
          showToast('Failed to import: Invalid backup JSON format.');
        }
      } catch (err) {
        showToast('Error: Could not parse selected JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const navTabs = [
    { id: 'certificates', label: 'Certificates & Credentials', icon: Award, count: data.certifications.length },
    { id: 'hero', label: 'Hero & Photo', icon: User },
    { id: 'about', label: 'About Me', icon: BookOpen },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills & Tech', icon: Sparkles },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'backup', label: 'Backup & Reset', icon: Sliders },
  ];

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col text-slate-100 overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button in top-right */}
          <button
            onClick={handleClosePanel}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Cancel & Close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Security Icon Badge */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
                <Lock className="w-8 h-8 text-cyan-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 text-xs shadow">
                <KeyRound className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-[11px] font-mono tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Protected Admin Portal
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Admin Authentication</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Enter the master password to access the portfolio content management studio and editing controls.
            </p>
          </div>

          {/* Error Message if any */}
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAuthenticate} className="space-y-4">
            <div>
              <label htmlFor="admin-password-input" className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
                <span>PASSWORD</span>
                <span className="text-[10px] text-slate-500">Aditya Mali Admin</span>
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Enter master password..."
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 outline-none pr-11 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isAuthenticating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-5 pt-4 border-t border-slate-900 text-center">
            <span className="text-[11px] font-mono text-slate-500">
              Session is encrypted & locked to authorized owner
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fade-in">
      <div className="relative w-full max-w-6xl h-[92vh] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-white">Portfolio Admin & Content Studio</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-medium flex items-center gap-1.5 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Backend Storage Active (Disk + API)</span>
                </span>
                {isFirebaseConfigured && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-medium flex items-center gap-1 border border-cyan-500/30">
                    <Cloud className="w-3 h-3 text-cyan-400" />
                    <span>Firebase Cloud</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Edit text, photos, credentials, or post new certificates directly to your site.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isCloudConnected && (
              <button
                type="button"
                onClick={syncWithCloud}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors border border-slate-700"
                title="Force push current portfolio data to Firebase Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${cloudSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <span>Sync Cloud</span>
              </button>
            )}
            {toastMessage && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>{toastMessage}</span>
              </div>
            )}
            <button
              onClick={handleClosePanel}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert for Mobile */}
        {toastMessage && (
          <div className="sm:hidden px-4 py-2 bg-cyan-950 border-b border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Body: Sidebar Tabs + Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-64 bg-slate-900/40 border-r border-slate-800 p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-none">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id as any)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 md:w-full ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Tab Content Body */}
          <main ref={mainContentRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
            
            {/* 1. CERTIFICATES & CREDENTIALS TAB */}
            {activeAdminTab === 'certificates' && (
              <div className="space-y-8 max-w-4xl">
                
                {/* Add / Edit Certificate Form Card */}
                <div className="glass-card rounded-2xl p-5 sm:p-7 border border-cyan-500/30 glow-cyan">
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                        {editingCertId ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {editingCertId ? 'Edit Certificate Credential' : 'Add New Certificate & Post'}
                        </h3>
                        <p className="text-xs text-slate-400">
                          Upload certificate photo, set title, description, issuer, and publish immediately.
                        </p>
                      </div>
                    </div>
                    {editingCertId && (
                      <button
                        onClick={handleCancelEditCert}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handlePostCertificate} className="space-y-5">
                    {/* Certificate Photo Upload */}
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                      <label className="block text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                        Certificate Photo / Credential Document (Optional or Upload Real Image)
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Image Preview Box */}
                        <div className="w-36 h-28 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 relative group">
                          {certForm.imageUrl ? (
                            <>
                              <img
                                src={certForm.imageUrl}
                                alt="Certificate Preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setCertForm((prev) => ({ ...prev, imageUrl: '' }))}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 text-xs transition-opacity"
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <div className="text-center p-2 text-slate-500">
                              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-60" />
                              <span className="text-[10px]">No photo added</span>
                            </div>
                          )}
                        </div>

                        {/* Upload Controls */}
                        <div className="flex-1 space-y-2 w-full">
                          <input
                            type="file"
                            accept="image/*"
                            ref={certFileInputRef}
                            onChange={handleCertImageUpload}
                            className="hidden"
                          />
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => certFileInputRef.current?.click()}
                              disabled={isUploadingCertImage}
                              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{isUploadingCertImage ? 'Processing...' : 'Upload Certificate Photo from Device'}</span>
                            </button>
                            <span className="text-xs text-slate-500">PNG, JPG, WebP supported</span>
                          </div>

                          <div className="pt-1">
                            <input
                              type="text"
                              value={certForm.imageUrl}
                              onChange={(e) => setCertForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                              placeholder="Or paste direct image URL (https://...)"
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Certificate Title <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={certForm.title}
                          onChange={(e) => setCertForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. ISRO SPARK Recognition, Cloud Dev Certificate"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Subtitle / Credential Role
                        </label>
                        <input
                          type="text"
                          value={certForm.subtitle}
                          onChange={(e) => setCertForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                          placeholder="e.g. Software Developer Distinction"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Description Textarea */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Certificate Description & Verification Details <span className="text-cyan-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={certForm.description}
                        onChange={(e) => setCertForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the skills demonstrated, course completed, software created, or honors given..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Metadata & Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={certForm.badge}
                          onChange={(e) => setCertForm((prev) => ({ ...prev, badge: e.target.value }))}
                          placeholder="OFFICIAL CREDENTIAL"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          value={certForm.recipient}
                          onChange={(e) => setCertForm((prev) => ({ ...prev, recipient: e.target.value }))}
                          placeholder="ADITYA MALI"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Color Theme Accent
                        </label>
                        <select
                          value={certForm.colorTheme}
                          onChange={(e) => setCertForm((prev) => ({ ...prev, colorTheme: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          <option value="cyan">Cyan (Tech & Space)</option>
                          <option value="purple">Purple (AI & Engineering)</option>
                          <option value="blue">Blue (Academic & College)</option>
                          <option value="amber">Amber (Honor & Games)</option>
                          <option value="emerald">Emerald (Verified)</option>
                        </select>
                      </div>
                    </div>

                    {formError && (
                      <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Post & Publish Button */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.01]"
                      >
                        <Save className="w-4 h-4" />
                        <span>{editingCertId ? 'Update Certificate' : 'Post & Publish Certificate'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing Certificates Management List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Currently Published Certificates</span>
                      <span className="text-xs font-mono text-cyan-400">({data.certifications.length})</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Drag or edit to modify what is shown on the live portfolio carousel.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          {/* Thumbnail */}
                          <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
                            {cert.imageUrl ? (
                              <img
                                src={cert.imageUrl}
                                alt={cert.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Award className="w-7 h-7 text-cyan-400 opacity-80" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300">
                              {cert.badge}
                            </span>
                            <h4 className="font-bold text-white text-sm truncate mt-1">{cert.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{cert.description}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-mono text-slate-400">{cert.recipient}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStartEditCert(cert)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
                              title="Edit Certificate"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCert(String(cert.id), cert.title)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                              title="Delete Certificate"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 2. HERO & PHOTO TAB */}
            {activeAdminTab === 'hero' && (
              <form onSubmit={handleSaveHero} className="space-y-6 max-w-3xl">
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
                  <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
                    Hero Profile & Photo Settings
                  </h3>

                  {/* Profile Photo Upload */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <label className="block text-xs font-mono text-cyan-400 font-semibold uppercase">
                      Profile Photograph (High Resolution)
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-500/40 shrink-0 shadow-lg">
                        <img
                          src={heroForm.photoUrl}
                          alt="Hero Preview"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="space-y-2 flex-1 w-full">
                        <input
                          type="file"
                          accept="image/*"
                          ref={heroFileInputRef}
                          onChange={handleHeroPhotoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => heroFileInputRef.current?.click()}
                          disabled={isUploadingHeroImage}
                          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{isUploadingHeroImage ? 'Processing...' : 'Change Profile Photo from Device'}</span>
                        </button>
                        <input
                          type="text"
                          value={heroForm.photoUrl}
                          onChange={(e) => setHeroForm((prev) => ({ ...prev, photoUrl: e.target.value }))}
                          placeholder="Or paste photo image URL"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={heroForm.name}
                        onChange={(e) => setHeroForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Role Title / Subtitle</label>
                      <input
                        type="text"
                        value={heroForm.roleTitle}
                        onChange={(e) => setHeroForm((prev) => ({ ...prev, roleTitle: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                      />
                    </div>
                  </div>

                  {/* Bio Paragraph */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Hero Bio Text</label>
                    <textarea
                      rows={3}
                      value={heroForm.bio}
                      onChange={(e) => setHeroForm((prev) => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white leading-relaxed"
                    />
                  </div>

                  {/* Stat Counters */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Stat 1 (Value / Label)</label>
                      <input
                        type="text"
                        value={heroForm.stat1Value}
                        onChange={(e) => setHeroForm((prev) => ({ ...prev, stat1Value: e.target.value }))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-bold mb-1"
                      />
                      <input
                        type="text"
                        value={heroForm.stat1Label}
                        onChange={(e) => setHeroForm((prev) => ({ ...prev, stat1Label: e.target.value }))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Stat 2 (Value / Label)</label>
                      <input
                        type="text"
                        value={heroForm.stat2Value}
                        onChange={(e) => setHeroForm((prev) => ({ ...prev, stat2Value: e.target.value }))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-purple-400 font-bold mb-1"
                      />
                      <input
                        type="text"
                        value={heroForm.stat2Label}
                        onChange={(e) => setHeroForm((prev) => ({ ...prev, stat2Label: e.target.value }))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Stat 3 (Value / Label)</label>
                      <input
                        type="text"
                        value={heroForm.stat3Value}
                        onChange={(e) => setHeroForm((prev) => ({ ...prev, stat3Value: e.target.value }))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-blue-400 font-bold mb-1"
                      />
                      <input
                        type="text"
                        value={heroForm.stat3Label}
                        onChange={(e) => setHeroForm((prev) => ({ ...prev, stat3Label: e.target.value }))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Hero Section</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 3. ABOUT ME TAB */}
            {activeAdminTab === 'about' && (
              <form onSubmit={handleSaveAbout} className="space-y-6 max-w-3xl">
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
                  <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
                    About Section Texts & Roles
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Heading</label>
                    <input
                      type="text"
                      value={aboutForm.heading}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, heading: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Paragraph 1 (Intro)</label>
                    <textarea
                      rows={2}
                      value={aboutForm.paragraph1}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, paragraph1: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Paragraph 2 (ISRO & Software)</label>
                    <textarea
                      rows={3}
                      value={aboutForm.paragraph2}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, paragraph2: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Paragraph 3 (AI Vibe Coding)</label>
                    <textarea
                      rows={2}
                      value={aboutForm.paragraph3}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, paragraph3: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Paragraph 4 (Arrow Puzzle Game)</label>
                    <textarea
                      rows={2}
                      value={aboutForm.paragraph4}
                      onChange={(e) => setAboutForm((prev) => ({ ...prev, paragraph4: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">Role Card</span>
                      <input
                        type="text"
                        value={aboutForm.currentRoleTitle}
                        onChange={(e) => setAboutForm((prev) => ({ ...prev, currentRoleTitle: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                        placeholder="Role Title"
                      />
                      <input
                        type="text"
                        value={aboutForm.currentRoleSub}
                        onChange={(e) => setAboutForm((prev) => ({ ...prev, currentRoleSub: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                        placeholder="Sub text"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono text-purple-400 uppercase">College Card</span>
                      <input
                        type="text"
                        value={aboutForm.institutionName}
                        onChange={(e) => setAboutForm((prev) => ({ ...prev, institutionName: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                        placeholder="College Name"
                      />
                      <input
                        type="text"
                        value={aboutForm.institutionSub}
                        onChange={(e) => setAboutForm((prev) => ({ ...prev, institutionSub: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                        placeholder="Sub text"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save About Section</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 4. EDUCATION TAB */}
            {activeAdminTab === 'education' && (
              <form onSubmit={handleSaveEducation} className="space-y-6 max-w-3xl">
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
                  <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
                    Education Section Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Degree / Course</label>
                      <input
                        type="text"
                        value={eduForm.degree}
                        onChange={(e) => setEduForm((prev) => ({ ...prev, degree: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Institution / College</label>
                      <input
                        type="text"
                        value={eduForm.college}
                        onChange={(e) => setEduForm((prev) => ({ ...prev, college: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Student Description</label>
                    <textarea
                      rows={4}
                      value={eduForm.description}
                      onChange={(e) => setEduForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Areas of Interest</label>
                    <textarea
                      rows={2}
                      value={eduForm.areasOfInterest}
                      onChange={(e) => setEduForm((prev) => ({ ...prev, areasOfInterest: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Education</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 5. EXPERIENCE TAB */}
            {activeAdminTab === 'experience' && (
              <div className="space-y-6 max-w-3xl">
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
                  <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
                    Experience & Internship Details
                  </h3>

                  {data.experience.map((exp, idx) => (
                    <div key={exp.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Role Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const updated = [...data.experience];
                              updated[idx].role = e.target.value;
                              updateExperience(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Organization</label>
                          <input
                            type="text"
                            value={exp.organization}
                            onChange={(e) => {
                              const updated = [...data.experience];
                              updated[idx].organization = e.target.value;
                              updateExperience(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Overview Description</label>
                        <textarea
                          rows={3}
                          value={exp.description}
                          onChange={(e) => {
                            const updated = [...data.experience];
                            updated[idx].description = e.target.value;
                            updateExperience(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Key Responsibilities / Bullets</label>
                        <div className="space-y-2">
                          {exp.bulletPoints.map((bp, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={bp}
                                onChange={(e) => {
                                  const updated = [...data.experience];
                                  updated[idx].bulletPoints[bIdx] = e.target.value;
                                  updateExperience(updated);
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...data.experience];
                                  updated[idx].bulletPoints = updated[idx].bulletPoints.filter((_, i) => i !== bIdx);
                                  updateExperience(updated);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...data.experience];
                              updated[idx].bulletPoints.push('New key accomplishment or duty');
                              updateExperience(updated);
                            }}
                            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 pt-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Bullet Point</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. SKILLS TAB */}
            {activeAdminTab === 'skills' && (
              <div className="space-y-6 max-w-3xl">
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
                  <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
                    Skills & Competencies
                  </h3>

                  {data.skills.map((cat, cIdx) => (
                    <div key={cat.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{cat.title}</span>
                        <span className="text-xs text-slate-400">{cat.subtitle}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {cat.skills.map((skill, sIdx) => (
                          <div key={sIdx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => {
                                const updated = [...data.skills];
                                updated[cIdx].skills[sIdx].name = e.target.value;
                                updateSkills(updated);
                              }}
                              className="bg-transparent text-xs text-white font-medium flex-1 focus:outline-none"
                            />
                            <input
                              type="number"
                              min={1}
                              max={100}
                              value={skill.percent}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updated = [...data.skills];
                                updated[cIdx].skills[sIdx].percent = val;
                                updated[cIdx].skills[sIdx].level = val + '%';
                                updateSkills(updated);
                              }}
                              className="w-14 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 text-right"
                            />
                            <span className="text-xs font-mono text-slate-400">%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. CONTACT TAB */}
            {activeAdminTab === 'contact' && (
              <form onSubmit={handleSaveContact} className="space-y-6 max-w-3xl">
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
                  <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
                    Contact & Collaboration Details
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Direct Email Address</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={contactForm.linkedin || ''}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="https://www.linkedin.com/in/adityamali0890/"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Section Heading</label>
                    <input
                      type="text"
                      value={contactForm.heading}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, heading: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Subheading Text</label>
                    <textarea
                      rows={2}
                      value={contactForm.subheading}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, subheading: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Contact Section</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 8. BACKUP & RESET TAB */}
            {activeAdminTab === 'backup' && (
              <div className="space-y-6 max-w-3xl">
                {/* Built-in Backend Disk Storage & API Status Card */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Built-in Backend & Disk Storage</h3>
                        <p className="text-xs text-slate-400">Zero-setup permanent storage for your portfolio photos, certificates, and text</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-medium flex items-center gap-1.5 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Active & Connected
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Permanently Stored on Server / Disk</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          • Photos &amp; Certificates: Automatically written to <code className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono">public/uploads/</code> on disk.<br />
                          • Portfolio Content: Automatically saved to <code className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono">data/portfolio.json</code>.<br />
                          • Everything works 100% automatically with zero accounts or external configuration needed!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={syncWithCloud}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                        <span>Force Save to Disk</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
                  <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
                    Data Backup, Import & Factory Reset
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Export */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <Download className="w-4 h-4 text-cyan-400" />
                          <span>Export Portfolio JSON</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Download a complete backup of all certificates, custom photos, and text content.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportJSON}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs transition-colors"
                      >
                        Download Backup (.json)
                      </button>
                    </div>

                    {/* Import */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <Upload className="w-4 h-4 text-purple-400" />
                          <span>Import Portfolio JSON</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Restore your certificates and text from a previously exported JSON backup file.
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="application/json"
                        ref={jsonFileInputRef}
                        onChange={handleImportJSON}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => jsonFileInputRef.current?.click()}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-xs transition-colors"
                      >
                        Upload Backup File
                      </button>
                    </div>
                  </div>

                  {/* Factory Reset */}
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400">
                      <AlertCircle className="w-4 h-4" />
                      <h4 className="font-bold text-sm">Reset to Original Defaults</h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      Restores all portfolio sections, original certificates, and default biography texts to their initial state.
                    </p>
                    {isConfirmingReset ? (
                      <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2.5">
                        <p className="text-xs text-rose-200 font-semibold">
                          ⚠️ Are you sure? This will reset all sections and certificates back to original defaults.
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              resetToDefaults();
                              setIsConfirmingReset(false);
                              showToast('Portfolio reset to initial defaults.');
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                          >
                            Confirm Reset
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsConfirmingReset(false)}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsConfirmingReset(true)}
                        className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Portfolio to Defaults</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* Certificate Delete Confirmation Dialog */}
        {certToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-card max-w-sm w-full rounded-2xl p-6 border border-rose-500/40 glow-rose space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Delete Certificate?</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to remove &quot;{certToDelete.title}&quot; from your published portfolio?
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCertToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteCertificate(certToDelete.id);
                    setCertToDelete(null);
                    showToast('Certificate removed successfully.');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

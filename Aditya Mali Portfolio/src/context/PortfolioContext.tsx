import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PortfolioData, CertificateItem, HeroData, AboutData, EducationData, ExperienceItem, SkillCategory, ContactData } from '../types/portfolio';
import { isFirebaseConfigured, fetchPortfolioFromCloud, savePortfolioToCloud } from '../services/firebase';
import { fetchPortfolioFromBackend, savePortfolioToBackend } from '../services/backendApi';

const STORAGE_KEY = 'aditya_portfolio_cms_v1';

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  hero: {
    name: 'Aditya Mali',
    roleTitle: 'Software Developer & ISRO Intern',
    photoUrl: '/src/assets/images/aditya_mali_portrait_1791703483959.jpg',
    bio: 'Crafting mission-ready web applications, intelligent AI-powered solutions, and interactive games like Arrow Puzzle. Blending computer engineering discipline from RITP College with high-reliability aerospace software design at ISRO SPARK.',
    stat1Value: 'ISRO',
    stat1Label: 'SPARK Intern',
    stat2Value: '100%',
    stat2Label: 'Reliability & Speed',
    stat3Value: 'RITP',
    stat3Label: 'Computer Engg.',
    ctaText1: 'Explore Projects & Games',
    ctaText2: 'Want Me To Build Your Website?',
  },
  about: {
    heading: 'About Aditya Mali',
    paragraph1: 'Hello! I am Aditya Mali, a student pursuing Computer Engineering at RITP College.',
    paragraph2: 'I am currently working as a intern at ISRO (Indian Space Research Organisation) in the prestigious SPARK India program. During this intensive experience, I built multiple web applications and learned space-grade standards for software reliability, modular architectures, and responsive data dashboards.',
    paragraph3: 'Beyond traditional coding, I am deeply passionate about modern AI-assisted development ("vibe coding"). This enables me to prototype, build, and deploy high-performance web products with exceptional velocity without compromising code quality.',
    paragraph4: 'I am also the creator of Arrow Puzzle, an educational game engineered specifically to nurture strategic logic and focus in school students.',
    currentRoleTitle: 'ISRO SPARK Intern',
    currentRoleOrg: 'ISRO',
    currentRoleSub: 'Software Developer',
    institutionTitle: 'INSTITUTION',
    institutionName: 'RITP College',
    institutionSub: 'Computer Engineering',
  },
  education: {
    degree: 'Computer Engineering',
    college: 'Rajaram Bapu Institute of Technology (RITP), Lohgaon',
    department: 'Department of Computer Technology',
    statusText: 'Active Engineering Studies',
    description: 'Hello my name is Aditya Mali, a student from Rajaram Bapu Institute of Technology (RITP), Lohgaon\n\nCurrently pursuing a Diploma in Computer Engineering, with a strong interest in software development, web technologies, and application development. Building a solid foundation in programming, problem-solving, database management, and computer science fundamentals while exploring practical, project-based learning.',
    areasOfInterest: 'Web Development, Software Engineering, Game Development, Artificial Intelligence, and Application Development.',
  },
  experience: [
    {
      id: 'isro-spark-1',
      role: 'Software Developer Intern',
      organization: 'ISRO (Indian Space Research Organisation)',
      programTag: 'SPARK India Program',
      typeTag: 'Internship',
      description: 'As an active software developer intern in the SPARK India program at ISRO, I architected and built multiple web applications, gaining firsthand exposure to mission-critical software engineering, telemetry simulators, and high-reliability criteria.',
      bulletPoints: [
        'Full-Stack Web Development: Developed multiple dynamic web applications utilizing responsive modern frontend frameworks and modular services.',
        'Aerospace Systems Interface: Created high-reliability web tools and interactive data dashboards adhering to stringent space-grade standards.',
        'Performance & Responsive Engineering: Ensured zero-lag client side computations and seamless viewport responsiveness across devices.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-isro-spark',
      badge: 'OFFICIAL CREDENTIAL',
      tag: 'SPACE RESEARCH INTERNSHIP',
      verifiedText: '★ VERIFIED',
      title: 'ISRO SPARK India Internship',
      subtitle: 'Software Developer Recognition',
      recipient: 'ADITYA MALI',
      metaLeft: 'ID: ISRO-SPARK-2024',
      metaRight: 'Indian Space Research Org.',
      category: 'ISRO SPARK Program',
      heading: 'ISRO SPARK India Intern',
      description: 'Honored with the official software development internship under ISRO’s prestigious SPARK India program, completing multiple websites, space observation interfaces, and software applications.',
      highlightText: 'Verified Software Development & Web Systems Portfolio',
      gradientClass: 'from-cyan-950 via-slate-900 to-slate-950',
      borderClass: 'border-cyan-500/40',
      accentColor: 'text-cyan-400',
    },
    {
      id: 'cert-ai-mastery',
      badge: 'CERTIFICATE OF MASTERY',
      tag: 'AI DEVELOPMENT',
      verifiedText: '★ SPECIALIST',
      title: 'AI-Assisted Web Engineering',
      subtitle: 'Autonomous Workflows & Vibe Coding',
      recipient: 'ADITYA MALI',
      metaLeft: 'TRACK: ADVANCED AI APPS',
      metaRight: 'MODERN DEV CERTIFIED',
      category: 'AI Web Engineering',
      heading: 'AI & Vibe-Coding Specialization',
      description: 'Certified in rapid AI-driven application scaffolding, LLM integration into modern web apps, and interactive algorithmic game architectures with exceptional turnaround.',
      highlightText: 'Demonstrated in live web deployments & automated tools',
      gradientClass: 'from-purple-950 via-slate-900 to-slate-950',
      borderClass: 'border-purple-500/40',
      accentColor: 'text-purple-400',
    },
    {
      id: 'cert-ritp-academic',
      badge: 'ACADEMIC HONORS',
      tag: 'COLLEGE MERIT',
      verifiedText: '★ RITP COLLEGE',
      title: 'Computer Engineering Excellence',
      subtitle: 'High Distinction in Practical Software',
      recipient: 'ADITYA MALI',
      metaLeft: 'INSTITUTION: RITP',
      metaRight: 'DEPT. OF COMP. ENGG.',
      category: 'RITP Engineering',
      heading: 'Engineering Project Accolade',
      description: 'Recognized for creating educational student tools like Arrow Puzzle and showcasing high aptitude in data structures, web engineering, and software reliability.',
      highlightText: 'Top-tier Project & Development Evaluation at RITP',
      gradientClass: 'from-blue-950 via-slate-900 to-slate-950',
      borderClass: 'border-blue-500/40',
      accentColor: 'text-blue-400',
    },
    {
      id: 'cert-arrow-game',
      badge: 'CREATIVE ENGINEERING',
      tag: 'GAME & LOGIC DESIGN',
      verifiedText: '★ INNOVATOR',
      title: 'Arrow Puzzle Game Innovation',
      subtitle: 'Focus & Strategic Logic for Students',
      recipient: 'ADITYA MALI',
      metaLeft: 'PEDAGOGICAL DESIGN',
      metaRight: 'LOGIC & FOCUS GAME',
      category: 'Cognitive Game Dev',
      heading: 'Cognitive Focus Game Author',
      description: 'Designed and launched the Arrow Puzzle game engine crafted intentionally to support young student concentration, spatial coordination, and systematic problem solving.',
      highlightText: 'Playable directly on web with adaptive difficulty',
      gradientClass: 'from-amber-950 via-slate-900 to-slate-950',
      borderClass: 'border-amber-500/40',
      accentColor: 'text-amber-400',
    },
  ],
  skills: [
    {
      id: 'ai',
      title: 'AI Web Dev',
      subtitle: 'Autonomous coding, AI tooling & smart web integrations',
      colorClass: 'text-cyan-400',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400/60',
      skills: [
        { name: 'AI-Assisted Vibe Coding', level: 'Expert', percent: 98 },
        { name: 'LLM & Prompt Tuning', level: '92%', percent: 92 },
        { name: 'AI Game Prototyping', level: '88%', percent: 88 },
        { name: 'AI Web Automation', level: '85%', percent: 85 },
      ],
    },
    {
      id: 'frontend',
      title: 'Frontend Stack',
      subtitle: 'High performance interfaces with modern responsive design',
      colorClass: 'text-blue-400',
      borderColor: 'border-blue-500/30 hover:border-blue-400/60',
      skills: [
        { name: 'HTML5 / Modern CSS3', level: '98%', percent: 98 },
        { name: 'JavaScript (ES6+)', level: '90%', percent: 90 },
        { name: 'Tailwind CSS', level: '95%', percent: 95 },
        { name: 'React.js Basics & UI', level: '84%', percent: 84 },
      ],
    },
    {
      id: 'backend',
      title: 'Backend & Logic',
      subtitle: 'Core software engineering, APIs & data pipelines',
      colorClass: 'text-purple-400',
      borderColor: 'border-purple-500/30 hover:border-purple-400/60',
      skills: [
        { name: 'Python Development', level: '88%', percent: 88 },
        { name: 'REST API Architecture', level: '85%', percent: 85 },
        { name: 'SQL / Databases', level: '82%', percent: 82 },
        { name: 'Git & GitHub Workflows', level: '90%', percent: 90 },
      ],
    },
  ],
  contact: {
    heading: "Let's Build Your Next Website",
    subheading: 'Need a professional website, an AI-powered application, or an interactive game? Reach out directly to Aditya Mali below.',
    email: 'adityamali0890@gmail.com',
    linkedin: 'https://www.linkedin.com/in/adityamali0890/',
  },
};

export type AdminTab = 'certificates' | 'hero' | 'about' | 'education' | 'experience' | 'skills' | 'contact' | 'backup';

export type CloudSyncStatus = 'synced' | 'syncing' | 'error' | 'unconfigured';

export interface EmailModalData {
  isOpen: boolean;
  to: string;
  subject: string;
  body: string;
  senderName?: string;
  senderEmail?: string;
  isProjectRequest?: boolean;
}

interface PortfolioContextType {
  data: PortfolioData;
  updateHero: (hero: Partial<HeroData>) => void;
  updateAbout: (about: Partial<AboutData>) => void;
  updateEducation: (edu: Partial<EducationData>) => void;
  updateExperience: (items: ExperienceItem[]) => void;
  addCertificate: (cert: Omit<CertificateItem, 'id'>) => string;
  updateCertificate: (id: string, cert: Partial<CertificateItem>) => void;
  deleteCertificate: (id: string) => void;
  updateSkills: (skills: SkillCategory[]) => void;
  updateContact: (contact: Partial<ContactData>) => void;
  resetToDefaults: () => void;
  importData: (imported: PortfolioData) => boolean;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  activeAdminTab: AdminTab;
  setActiveAdminTab: (tab: AdminTab) => void;
  emailModal: EmailModalData;
  openEmailModal: (options?: Partial<Omit<EmailModalData, 'isOpen'>>) => void;
  closeEmailModal: () => void;
  isCloudConnected: boolean;
  cloudSyncStatus: CloudSyncStatus;
  syncWithCloud: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge with defaults to ensure all required fields exist
        return {
          ...DEFAULT_PORTFOLIO_DATA,
          ...parsed,
          hero: { ...DEFAULT_PORTFOLIO_DATA.hero, ...(parsed.hero || {}) },
          about: { ...DEFAULT_PORTFOLIO_DATA.about, ...(parsed.about || {}) },
          education: { ...DEFAULT_PORTFOLIO_DATA.education, ...(parsed.education || {}) },
          experience: parsed.experience && parsed.experience.length > 0 ? parsed.experience : DEFAULT_PORTFOLIO_DATA.experience,
          certifications: parsed.certifications && parsed.certifications.length > 0 ? parsed.certifications : DEFAULT_PORTFOLIO_DATA.certifications,
          skills: parsed.skills && parsed.skills.length > 0 ? parsed.skills : DEFAULT_PORTFOLIO_DATA.skills,
          contact: { ...DEFAULT_PORTFOLIO_DATA.contact, ...(parsed.contact || {}) },
        };
      }
    } catch (e) {
      console.warn('Failed to parse portfolio data from storage, using defaults', e);
    }
    return DEFAULT_PORTFOLIO_DATA;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('certificates');

  const [emailModal, setEmailModal] = useState<EmailModalData>({
    isOpen: false,
    to: DEFAULT_PORTFOLIO_DATA.contact.email,
    subject: '',
    body: '',
    isProjectRequest: false,
  });

  const openEmailModal = (options?: Partial<Omit<EmailModalData, 'isOpen'>>) => {
    setEmailModal({
      isOpen: true,
      to: options?.to || data.contact.email || 'adityamali0890@gmail.com',
      subject: options?.subject || `Connecting with ${data.hero.name}`,
      body: options?.body || `Hi ${data.hero.name},\n\nI was viewing your portfolio and would like to connect regarding a project opportunity.\n\nBest regards!`,
      senderName: options?.senderName || '',
      senderEmail: options?.senderEmail || '',
      isProjectRequest: options?.isProjectRequest || false,
    });
  };

  const closeEmailModal = () => {
    setEmailModal((prev) => ({ ...prev, isOpen: false }));
  };

  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('synced');
  const isInitialLoadDone = useRef(false);

  // Initial fetch on mount: loads data from data/portfolio.json on disk
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setCloudSyncStatus('syncing');
        // 1. Fetch from local backend API (persisted on disk)
        const backendData = await fetchPortfolioFromBackend();
        if (isMounted && backendData) {
          setData((prev) => ({
            ...prev,
            ...backendData,
          }));
          isInitialLoadDone.current = true;
          setCloudSyncStatus('synced');
          return;
        }

        // 2. Fallback to Firebase cloud if configured
        if (isFirebaseConfigured) {
          const cloudData = await fetchPortfolioFromCloud();
          if (isMounted && cloudData) {
            setData((prev) => ({
              ...prev,
              ...cloudData,
            }));
            isInitialLoadDone.current = true;
            setCloudSyncStatus('synced');
            return;
          }
        }

        if (isMounted) {
          isInitialLoadDone.current = true;
          setCloudSyncStatus('synced');
        }
      } catch (err) {
        console.error('Initial data sync error:', err);
        if (isMounted) {
          isInitialLoadDone.current = true;
          setCloudSyncStatus('error');
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasUserModified = useRef(false);

  // Sync state changes to local backend API (disk storage) & Firebase (if configured)
  useEffect(() => {
    // Only save when user explicitly modifies data
    if (!hasUserModified.current) return;

    const timer = setTimeout(async () => {
      await savePortfolioToBackend(data);

      if (isFirebaseConfigured) {
        try {
          setCloudSyncStatus('syncing');
          const ok = await savePortfolioToCloud(data);
          setCloudSyncStatus(ok ? 'synced' : 'error');
        } catch {
          setCloudSyncStatus('error');
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [data]);

  const syncWithCloud = async () => {
    setCloudSyncStatus('syncing');
    const backendOk = await savePortfolioToBackend(data);
    let cloudOk = true;
    if (isFirebaseConfigured) {
      cloudOk = await savePortfolioToCloud(data);
    }
    setCloudSyncStatus(backendOk && cloudOk ? 'synced' : 'error');
  };

  const updateHero = (heroUpdates: Partial<HeroData>) => {
    hasUserModified.current = true;
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...heroUpdates },
    }));
  };

  const updateAbout = (aboutUpdates: Partial<AboutData>) => {
    hasUserModified.current = true;
    setData((prev) => ({
      ...prev,
      about: { ...prev.about, ...aboutUpdates },
    }));
  };

  const updateEducation = (eduUpdates: Partial<EducationData>) => {
    hasUserModified.current = true;
    setData((prev) => ({
      ...prev,
      education: { ...prev.education, ...eduUpdates },
    }));
  };

  const updateExperience = (items: ExperienceItem[]) => {
    hasUserModified.current = true;
    setData((prev) => ({
      ...prev,
      experience: items,
    }));
  };

  const addCertificate = (cert: Omit<CertificateItem, 'id'>): string => {
    hasUserModified.current = true;
    const newId = 'cert-' + Date.now();
    const newCert: CertificateItem = {
      ...cert,
      id: newId,
      gradientClass: cert.gradientClass || 'from-cyan-950 via-slate-900 to-slate-950',
      borderClass: cert.borderClass || 'border-cyan-500/40',
      accentColor: cert.accentColor || 'text-cyan-400',
    };
    setData((prev) => ({
      ...prev,
      certifications: [newCert, ...prev.certifications],
    }));
    return newId;
  };

  const updateCertificate = (id: string, certUpdates: Partial<CertificateItem>) => {
    hasUserModified.current = true;
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) =>
        String(item.id) === String(id) ? { ...item, ...certUpdates } : item
      ),
    }));
  };

  const deleteCertificate = (id: string) => {
    hasUserModified.current = true;
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => String(item.id) !== String(id)),
    }));
  };

  const updateSkills = (skills: SkillCategory[]) => {
    hasUserModified.current = true;
    setData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const updateContact = (contactUpdates: Partial<ContactData>) => {
    hasUserModified.current = true;
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...contactUpdates },
    }));
  };

  const resetToDefaults = () => {
    hasUserModified.current = true;
    setData(DEFAULT_PORTFOLIO_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const importData = (imported: PortfolioData): boolean => {
    try {
      if (imported && imported.hero && imported.certifications) {
        hasUserModified.current = true;
        setData(imported);
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  };

  return (
    <PortfolioContext.Provider
      value={{
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
        emailModal,
        openEmailModal,
        closeEmailModal,
        isCloudConnected: isFirebaseConfigured,
        cloudSyncStatus,
        syncWithCloud,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

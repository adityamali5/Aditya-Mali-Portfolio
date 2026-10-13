export interface CertificateItem {
  id: string;
  badge: string;
  tag: string;
  verifiedText: string;
  title: string;
  subtitle: string;
  recipient: string;
  metaLeft: string;
  metaRight: string;
  category: string;
  heading: string;
  description: string;
  highlightText: string;
  imageUrl?: string; // Base64 data URL or external URL for real certificate image
  gradientClass?: string;
  borderClass?: string;
  accentColor?: string;
  date?: string;
}

export interface HeroData {
  name: string;
  roleTitle: string;
  photoUrl: string;
  bio: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  ctaText1: string;
  ctaText2: string;
}

export interface AboutData {
  heading: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  paragraph4: string;
  currentRoleTitle: string;
  currentRoleOrg: string;
  currentRoleSub: string;
  institutionTitle: string;
  institutionName: string;
  institutionSub: string;
}

export interface EducationData {
  degree: string;
  college: string;
  department: string;
  statusText: string;
  description: string;
  areasOfInterest: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  programTag: string;
  typeTag: string;
  description: string;
  bulletPoints: string[];
}

export interface SkillItem {
  name: string;
  level: string;
  percent: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  colorClass: string;
  borderColor: string;
  skills: SkillItem[];
}

export interface ContactData {
  heading: string;
  subheading: string;
  email: string;
  linkedin?: string;
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  education: EducationData;
  experience: ExperienceItem[];
  certifications: CertificateItem[];
  skills: SkillCategory[];
  contact: ContactData;
}



export interface ContactInfo {
  website: string;
  linkedin: string;
  telegram?: string;
  email: string;
  location: string;
  videoPitch?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  type: string;
  highlights: {
    title: string;
    description: string;
  }[];
}

export interface ProjectItem {
  title: string;
  role: string;
  description: string;
  details: {
    label: string;
    value: string;
  }[];
  link?: string;
}

export interface EducationItem {
  institution: string;
  certification: string;
  year: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string[];
  contact: ContactInfo;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: Record<string, string>;
  education: EducationItem[];
  atsKeywords?: string;
  photo?: string;
  showPhoto?: boolean;
}

export type ResumeHeaderStyle = 'underline' | 'divider' | 'left-bar' | 'minimal' | 'boxed';

export interface ResumeStyleSettings {
  headingFont: string;
  bodyFont: string;
  fontScale: 'compact' | 'standard' | 'spacious';
  accentColor: string;
  primaryColor: string;
  secondaryColor: string;
  paperBackground: string;
  borderColor: string;
  headerStyle: ResumeHeaderStyle;
  uppercaseHeaders: boolean;
}

export const DEFAULT_STYLE_SETTINGS: ResumeStyleSettings = {
  headingFont: 'Outfit, sans-serif',
  bodyFont: 'Inter, sans-serif',
  fontScale: 'standard',
  accentColor: '#6750a4',
  primaryColor: '#1e293b',
  secondaryColor: '#475569',
  paperBackground: '#ffffff',
  borderColor: '#e2e8f0',
  headerStyle: 'underline',
  uppercaseHeaders: true,
};

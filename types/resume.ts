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

export interface ContactInfo {
  website: string;
  linkedin: string;
  telegram?: string; // Made optional
  email: string;
  location: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  type: string; // e.g., Part-time, Full-time
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
  link?: string; // Optional video link
}

export interface EducationItem {
  institution: string;
  certification: string;
  year: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string[]; // Changed to array for paragraphs
  contact: ContactInfo;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: Record<string, string>;
  education: EducationItem[];
  atsKeywords?: string;
}
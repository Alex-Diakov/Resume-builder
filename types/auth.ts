import { ResumeData, ResumeStyleSettings } from './resume';

export interface UserProfilePreferences {
  defaultSpacingPreset?: 'standard' | 'compact' | 'super';
  defaultFormat?: 'pdf' | 'docx';
  autoSaveIntervalMs?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  headline?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  bio?: string;
  avatarColor?: string;
  createdAt: string;
  updatedAt: string;
  tier: 'free' | 'pro';
  preferences?: UserProfilePreferences;
}

export interface UserResumeMeta {
  id: string;
  userId: string;
  title: string;
  targetRole: string;
  data: ResumeData;
  layoutSettings: {
    paddingTopBottom: number;
    paddingLeftRight: number;
    sectionSpacing: number;
    itemSpacing: number;
    spacingPreset: 'standard' | 'compact' | 'super';
  };
  styleSettings?: ResumeStyleSettings;
  createdAt: string;
  updatedAt: string;
}

export interface CloudExportRecord {
  id: string;
  userId: string;
  resumeId: string;
  resumeTitle: string;
  format: 'pdf' | 'docx' | 'print';
  timestamp: string;
  dateStr: string;
}

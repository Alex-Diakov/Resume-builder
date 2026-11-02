import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserResumeMeta, UserProfile } from '../../types/auth';
import { ExportActivityEntry } from '../../services/analytics/analyticsTypes';
import { Button } from '../ui/Button';
import { ActivityKpiSlider } from '../statistics/ActivityKpiSlider';
import { ResumeActivityInfographic } from '../statistics/ResumeActivityInfographic';
import { useAnalyticsStats } from '../../hooks/useAnalyticsStats';
import { 
  FileText, 
  Plus, 
  Copy, 
  Trash2, 
  ExternalLink, 
  BarChart2, 
  User as UserIcon, 
  LogOut, 
  Clock, 
  FileType, 
  Printer, 
  Layers,
  Search,
  ShieldCheck,
  Edit3,
  Check,
  AlertCircle,
  Save,
  Phone,
  Mail,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Sparkles,
  ArrowRight,
  Database,
  Sliders,
  X,
  RefreshCw,
  Filter
} from 'lucide-react';

interface PersonalCabinetProps {
  resumes?: UserResumeMeta[];
  exports?: ExportActivityEntry[];
  activeResumeId: string | null;
  onSelectResume: (resume: UserResumeMeta) => void;
  onCreateNewResume: () => Promise<void> | void;
  onDuplicateResume: (resume: UserResumeMeta) => void;
  onDeleteResume: (resumeId: string) => void;
  onRenameResume?: (resumeId: string, newTitle: string, newRole: string) => Promise<void>;
  onApplyProfileToResume?: (profile: UserProfile) => void;
  onExtractResumeToProfile?: () => Partial<UserProfile>;
  onOpenEditor: () => void;
}

const AVATAR_COLORS = [
  { label: 'M3 Lilac', value: 'bg-[#D0BCFF] text-[#381E72]' },
  { label: 'M3 Emerald', value: 'bg-emerald-400 text-emerald-950' },
  { label: 'M3 Sky', value: 'bg-sky-400 text-sky-950' },
  { label: 'M3 Amber', value: 'bg-amber-400 text-amber-950' },
  { label: 'M3 Violet', value: 'bg-purple-400 text-purple-950' },
  { label: 'M3 Rose', value: 'bg-rose-400 text-rose-950' },
];

export const PersonalCabinet: React.FC<PersonalCabinetProps> = ({
  resumes = [],
  exports = [],
  activeResumeId,
  onSelectResume,
  onCreateNewResume,
  onDuplicateResume,
  onDeleteResume,
  onRenameResume,
  onApplyProfileToResume,
  onExtractResumeToProfile,
  onOpenEditor
}) => {
  const { user, userProfile, signOut, updateUserProfileData } = useAuth();
  const [activeTab, setActiveTab] = useState<'library' | 'telemetry' | 'profile'>('library');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Safe delete modal
  const [deleteModal, setDeleteModal] = useState<{ resumeId: string; title: string } | null>(null);

  // Rename modal
  const [renameModal, setRenameModal] = useState<{ resumeId: string; title: string; targetRole: string } | null>(null);
  const [renameLoading, setRenameLoading] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    headline: '',
    phone: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    bio: '',
    avatarColor: AVATAR_COLORS[0].value,
    defaultSpacingPreset: 'standard' as 'standard' | 'compact' | 'super',
    defaultFormat: 'pdf' as 'pdf' | 'docx'
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Populate profile form whenever userProfile or user changes
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        displayName: userProfile.displayName || user?.displayName || '',
        headline: userProfile.headline || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        website: userProfile.website || '',
        github: userProfile.github || '',
        linkedin: userProfile.linkedin || '',
        bio: userProfile.bio || '',
        avatarColor: userProfile.avatarColor || AVATAR_COLORS[0].value,
        defaultSpacingPreset: userProfile.preferences?.defaultSpacingPreset || 'standard',
        defaultFormat: userProfile.preferences?.defaultFormat || 'pdf'
      });
    } else if (user) {
      setProfileForm(prev => ({
        ...prev,
        displayName: user.displayName || user.email?.split('@')[0] || ''
      }));
    }
  }, [userProfile, user]);

  const [isCreatingResume, setIsCreatingResume] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(current => current?.message === message ? null : current);
    }, 4000);
  };

  const handleCreateResume = async () => {
    if (isCreatingResume) return;
    setIsCreatingResume(true);
    try {
      await onCreateNewResume();
      showToast('New resume created in your library! Click "Open in Canvas" to edit.', 'success');
    } catch (err) {
      showToast('Failed to create new resume. Please try again.', 'error');
    } finally {
      setIsCreatingResume(false);
    }
  };

  const safeResumes = Array.isArray(resumes) ? resumes : [];
  const safeExports = Array.isArray(exports) ? exports : [];

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(now.getMonth());
  const [exportSearchQuery, setExportSearchQuery] = useState('');
  const [exportFilterFormat, setExportFilterFormat] = useState<'all' | 'pdf' | 'docx' | 'print'>('all');

  const { allTimeStats, loadDemo, clearHistory } = useAnalyticsStats(selectedYear, selectedMonthIndex, safeExports);

  const handlePrevMonth = () => {
    if (selectedMonthIndex === 0) {
      setSelectedMonthIndex(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonthIndex(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIndex === 11) {
      setSelectedMonthIndex(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonthIndex(prev => prev + 1);
    }
  };

  const filteredExports = safeExports.filter(e => {
    if (!e) return false;
    const formatMatch = exportFilterFormat === 'all' || e.format === exportFilterFormat;
    const titleMatch = (e.resumeTitle || '').toLowerCase().includes(exportSearchQuery.toLowerCase());
    return formatMatch && titleMatch;
  });

  const filteredResumes = safeResumes.filter(r => {
    if (!r) return false;
    const titleMatch = (r.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = (r.targetRole || '').toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || roleMatch;
  });

  const totalPdf = allTimeStats.pdfExports;
  const totalDocx = allTimeStats.docxExports;
  const totalPrint = allTimeStats.printExports;

  const avatarInitial = (
    profileForm.displayName.trim()?.charAt(0) || 
    user?.displayName?.trim()?.charAt(0) || 
    user?.email?.trim()?.charAt(0) || 
    'U'
  ).toUpperCase();

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateUserProfileData({
        displayName: profileForm.displayName.trim() || 'Career Candidate',
        headline: profileForm.headline.trim(),
        phone: profileForm.phone.trim(),
        location: profileForm.location.trim(),
        website: profileForm.website.trim(),
        github: profileForm.github.trim(),
        linkedin: profileForm.linkedin.trim(),
        bio: profileForm.bio.trim(),
        avatarColor: profileForm.avatarColor,
        preferences: {
          defaultSpacingPreset: profileForm.defaultSpacingPreset,
          defaultFormat: profileForm.defaultFormat
        }
      });
      showToast('Profile and cloud settings saved successfully!', 'success');
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      showToast(err.message || 'Could not update profile. Please try again.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Sync Profile to Active Resume
  const handlePushProfileToResume = () => {
    if (!onApplyProfileToResume) return;
    const constructedProfile: UserProfile = {
      uid: user?.uid || '',
      email: user?.email || '',
      displayName: profileForm.displayName,
      headline: profileForm.headline,
      phone: profileForm.phone,
      location: profileForm.location,
      website: profileForm.website,
      github: profileForm.github,
      linkedin: profileForm.linkedin,
      bio: profileForm.bio,
      createdAt: userProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tier: 'pro'
    };
    onApplyProfileToResume(constructedProfile);
    showToast('Profile contact information applied to active resume canvas!', 'success');
  };

  // Import info from Active Resume into Profile
  const handlePullResumeToProfile = () => {
    if (!onExtractResumeToProfile) return;
    const extracted = onExtractResumeToProfile();
    setProfileForm(prev => ({
      ...prev,
      displayName: extracted.displayName || prev.displayName,
      headline: extracted.headline || prev.headline,
      phone: extracted.phone || prev.phone,
      location: extracted.location || prev.location,
      website: extracted.website || prev.website,
      github: extracted.github || prev.github,
      linkedin: extracted.linkedin || prev.linkedin,
      bio: extracted.bio || prev.bio
    }));
    showToast('Loaded contact details from active resume. Click "Save Profile Changes" to persist.', 'info');
  };

  // Submit Rename
  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameModal || !onRenameResume) return;
    setRenameLoading(true);
    try {
      await onRenameResume(renameModal.resumeId, renameModal.title.trim() || 'Untitled Resume', renameModal.targetRole.trim() || 'Software Engineering');
      showToast('Resume title updated successfully!', 'success');
      setRenameModal(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to rename resume', 'error');
    } finally {
      setRenameLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-md-surface text-md-on-surface font-sans flex flex-col relative selection:bg-md-primary/30">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div 
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-[8px] border shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success' 
              ? 'bg-[#183424] border-emerald-500/40 text-emerald-200' 
              : toast.type === 'error'
              ? 'bg-[#3b171a] border-rose-500/40 text-rose-200'
              : 'bg-[#1e2436] border-sky-500/40 text-sky-200'
          }`}
        >
          {toast.type === 'success' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />}
          <span className="leading-snug">{toast.message}</span>
          <button 
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-white/50 hover:text-white transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SaaS Executive Top Header */}
      <header className="px-6 py-4 border-b border-white/[0.08] bg-md-surface-container-low flex items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-md-sm bg-md-primary/15 border border-md-primary/30 flex items-center justify-center text-md-primary shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-md-on-surface font-display truncate">
              Cognitive Career SaaS
            </h1>
            <span className="text-[11px] text-md-on-surface-variant font-mono truncate block">
              {user?.email || 'Authenticated User'}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav role="tablist" aria-label="Personal Cabinet Sections" className="flex items-center gap-1 bg-md-surface-container p-1 rounded-[10px] border border-white/[0.06]">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'library'}
            onClick={() => setActiveTab('library')}
            className={`px-4 h-10 min-h-[40px] text-xs font-medium rounded-[6px] transition-all cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary ${
              activeTab === 'library'
                ? 'bg-md-primary text-md-on-primary shadow-sm font-semibold'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Resumes ({safeResumes.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'telemetry'}
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 h-10 min-h-[40px] text-xs font-medium rounded-[6px] transition-all cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary ${
              activeTab === 'telemetry'
                ? 'bg-md-primary text-md-on-primary shadow-sm font-semibold'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.04]'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Exports ({safeExports.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            className={`px-4 h-10 min-h-[40px] text-xs font-medium rounded-[6px] transition-all cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary ${
              activeTab === 'profile'
                ? 'bg-md-primary text-md-on-primary shadow-sm font-semibold'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.04]'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile &amp; Settings</span>
          </button>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateResume}
            disabled={isCreatingResume}
            className="gap-2 text-xs cursor-pointer shadow-sm"
          >
            {isCreatingResume ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{isCreatingResume ? 'Creating...' : 'New Resume'}</span>
          </Button>

          <button
            type="button"
            onClick={() => signOut()}
            title="Sign out of account"
            aria-label="Sign out of account"
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-[8px] flex items-center justify-center text-md-on-surface-variant hover:text-rose-400 hover:bg-white/[0.06] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* =========================================================================
            TAB 1: RESUME LIBRARY
            ========================================================================= */}
        {activeTab === 'library' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header row with search and metrics */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-md-on-surface">
                  Resume Library
                </h2>
                <p className="text-xs text-md-on-surface-variant mt-0.5">
                  Manage multiple targeted resumes tailored for distinct company roles and tech stacks.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-md-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resumes..."
                    className="w-full pl-9 pr-3 h-10 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans"
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateResume}
                  disabled={isCreatingResume}
                  className="gap-1.5 shrink-0"
                >
                  {isCreatingResume ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{isCreatingResume ? 'Creating...' : 'Create Resume'}</span>
                </Button>
              </div>
            </div>

            {/* Resume Cards Grid */}
            {filteredResumes.length === 0 ? (
              <div className="p-12 text-center rounded-[12px] border border-dashed border-white/[0.12] bg-md-surface-container-low space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] text-md-on-surface-variant flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-md-on-surface">No resumes found</h3>
                  <p className="text-xs text-md-on-surface-variant mt-1">
                    {searchQuery ? 'Try clearing your search query' : 'Create your first targeted resume to get started'}
                  </p>
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={handleCreateResume} 
                  disabled={isCreatingResume}
                  className="gap-2 mx-auto"
                >
                  {isCreatingResume ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{isCreatingResume ? 'Creating...' : 'Create Resume'}</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredResumes.map((resume) => {
                  if (!resume) return null;
                  const isActive = resume.id === activeResumeId;
                  const expCount = resume.data?.experience?.length || 0;
                  const skillCount = Array.isArray(resume.data?.skills)
                    ? resume.data.skills.reduce((acc, cat) => acc + (cat?.items?.length || 0), 0)
                    : 0;
                  const updatedDateStr = resume.updatedAt 
                    ? new Date(resume.updatedAt).toLocaleDateString() 
                    : 'Recently';

                  return (
                    <div
                      key={resume.id}
                      className={`bg-md-surface-container-low border rounded-[12px] p-5 flex flex-col justify-between transition-all group hover:shadow-md-elevation-2 ${
                        isActive 
                          ? 'border-md-primary/60 ring-1 ring-md-primary/30' 
                          : 'border-white/[0.08] hover:border-white/[0.18]'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] font-mono text-md-primary font-medium uppercase tracking-wider block">
                              {resume.targetRole || 'General Profile'}
                            </span>
                            <h3 className="text-base font-semibold text-md-on-surface font-display truncate mt-0.5">
                              {resume.title || 'Untitled Resume'}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isActive && (
                              <span className="text-[10px] font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                                Active
                              </span>
                            )}
                            {onRenameResume && (
                              <button
                                type="button"
                                onClick={() => setRenameModal({
                                  resumeId: resume.id,
                                  title: resume.title || '',
                                  targetRole: resume.targetRole || ''
                                })}
                                title="Rename title or target role"
                                aria-label="Rename resume"
                                className="w-8 h-8 rounded-[6px] flex items-center justify-center text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.06] transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Resume Meta stats */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
                          <div className="bg-white/[0.02] p-2 rounded-[6px] border border-white/[0.04]">
                            <span className="text-md-on-surface-variant block text-[10px]">EXPERIENCE</span>
                            <span className="text-md-on-surface font-bold">{expCount} roles</span>
                          </div>
                          <div className="bg-white/[0.02] p-2 rounded-[6px] border border-white/[0.04]">
                            <span className="text-md-on-surface-variant block text-[10px]">SKILLS</span>
                            <span className="text-md-on-surface font-bold">{skillCount} items</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-md-on-surface-variant flex items-center gap-1.5 pt-1">
                          <Clock className="w-3 h-3 text-md-on-surface-variant/70" />
                          <span>Updated {updatedDateStr}</span>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                        <Button
                          variant={isActive ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => {
                            onSelectResume(resume);
                            onOpenEditor();
                          }}
                          className="flex-1 gap-1.5 text-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open in Canvas</span>
                        </Button>

                        <button
                          type="button"
                          onClick={() => onDuplicateResume(resume)}
                          title="Duplicate resume"
                          aria-label="Duplicate resume"
                          className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-[8px] flex items-center justify-center hover:bg-white/[0.08] text-md-on-surface-variant hover:text-md-on-surface transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {safeResumes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setDeleteModal({ resumeId: resume.id, title: resume.title || 'this resume' })}
                            title="Delete resume"
                            aria-label="Delete resume"
                            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-[8px] flex items-center justify-center hover:bg-white/[0.08] text-md-on-surface-variant hover:text-rose-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: EXPORT TELEMETRY & ACTIVITY (FULL SUITE)
            ========================================================================= */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header with Title and Demo / Clear Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-md-on-surface">
                  Export Telemetry &amp; Activity
                </h2>
                <p className="text-xs text-md-on-surface-variant mt-0.5">
                  Real-time tracking of generated PDF, Word, and print files
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    loadDemo();
                    showToast('Sample export telemetry loaded for demonstration!', 'info');
                  }}
                  className="text-xs gap-1.5"
                  title="Populate test analytics data"
                >
                  <Sparkles className="w-3.5 h-3.5 text-md-primary" />
                  <span>Load Sample Demo</span>
                </Button>

                {safeExports.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearHistory();
                      showToast('Export telemetry cleared', 'info');
                    }}
                    className="text-xs text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
                    title="Clear export history"
                  >
                    <span>Clear Telemetry</span>
                  </Button>
                )}
              </div>
            </div>

            {/* 1. TOTAL EXPORTS CARD: PROMINENT GRAND TOTAL & FORMAT BREAKDOWN */}
            <div className="bg-md-surface-container-low border border-white/[0.08] rounded-[12px] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-md-on-surface block truncate">
                    Total Exports
                  </span>
                  <span className="text-xs text-md-on-surface-variant block truncate mt-0.5">
                    Synchronized count of all exported and downloaded files
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 shrink-0">
                  <span className="text-3xl font-mono font-bold text-emerald-400 tabular-nums">
                    {allTimeStats.totalExports}
                  </span>
                  <span className="text-xs text-md-on-surface-variant font-medium">total</span>
                </div>
              </div>

              {/* Granular Format Breakdown Pill Matrix */}
              <div className="pt-3 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* PDF */}
                <div className="flex items-center justify-between p-3 rounded-[8px] bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-md-primary shrink-0" />
                    <span className="text-xs text-md-on-surface-variant font-mono">PDF</span>
                  </div>
                  <span className="font-mono font-bold text-md-on-surface text-base tabular-nums">
                    {allTimeStats.pdfExports}
                  </span>
                </div>

                {/* DOCX */}
                <div className="flex items-center justify-between p-3 rounded-[8px] bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <FileType className="w-4 h-4 text-md-secondary shrink-0" />
                    <span className="text-xs text-md-on-surface-variant font-mono">DOCX</span>
                  </div>
                  <span className="font-mono font-bold text-md-on-surface text-base tabular-nums">
                    {allTimeStats.docxExports}
                  </span>
                </div>

                {/* Print */}
                <div className="flex items-center justify-between p-3 rounded-[8px] bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Printer className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-xs text-md-on-surface-variant font-mono">Print</span>
                  </div>
                  <span className="font-mono font-bold text-md-on-surface text-base tabular-nums">
                    {allTimeStats.printExports}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. EXPORT KPIS SLIDER (Monthly breakdown, Streak, Peak, Active days) */}
            <ActivityKpiSlider
              selectedYear={selectedYear}
              selectedMonthIndex={selectedMonthIndex}
              customLogs={safeExports}
            />

            {/* 3. EXPORT HEATMAP CALENDAR (Daily logs, Heatmap grid, Month switcher) */}
            <ResumeActivityInfographic
              selectedYear={selectedYear}
              selectedMonthIndex={selectedMonthIndex}
              customLogs={safeExports}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            {/* 4. CENTRALIZED AUDIT LOG / DOCUMENT HISTORY TABLE */}
            <div className="bg-md-surface-container-low border border-white/[0.08] rounded-[12px] overflow-hidden">
              <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-semibold font-display text-md-on-surface">
                    Document History &amp; Centralized Audit Log
                  </h3>
                  <p className="text-[11px] text-md-on-surface-variant mt-0.5">
                    Centralized audit log of all exported PDF, Word DOCX, and Print copies across your account.
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-md-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={exportSearchQuery}
                      onChange={e => setExportSearchQuery(e.target.value)}
                      placeholder="Filter by title..."
                      className="pl-8 pr-3 h-8 bg-md-surface-container border border-white/[0.08] rounded-[6px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans w-40"
                    />
                  </div>

                  <div className="flex items-center bg-white/[0.04] p-0.5 rounded-[6px] border border-white/[0.06] text-[11px] font-mono">
                    {(['all', 'pdf', 'docx', 'print'] as const).map(fmt => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setExportFilterFormat(fmt)}
                        className={`px-2.5 py-1 rounded-[4px] uppercase transition-colors cursor-pointer ${
                          exportFilterFormat === fmt
                            ? 'bg-md-primary text-md-on-primary font-bold'
                            : 'text-md-on-surface-variant hover:text-md-on-surface'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {filteredExports.length === 0 ? (
                <div className="p-8 text-center text-xs text-md-on-surface-variant">
                  {exportSearchQuery || exportFilterFormat !== 'all'
                    ? 'No export events match your filter criteria.'
                    : 'No exports logged yet. Generate a PDF or Word document in the canvas to record your first export telemetry.'}
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04] max-h-96 overflow-y-auto">
                  {filteredExports.slice(0, 100).map((entry) => {
                    if (!entry) return null;
                    const dateStr = entry.timestamp 
                      ? new Date(entry.timestamp).toLocaleString() 
                      : 'Recent';

                    return (
                      <div key={entry.id} className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-[6px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                            {entry.format === 'pdf' && <FileText className="w-4 h-4 text-md-primary" />}
                            {entry.format === 'docx' && <FileType className="w-4 h-4 text-md-secondary" />}
                            {entry.format === 'print' && <Printer className="w-4 h-4 text-sky-400" />}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-md-on-surface block truncate">
                              {entry.resumeTitle || 'Resume Export'}
                            </span>
                            <span className="text-[11px] text-md-on-surface-variant font-mono">
                              {dateStr}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-md-on-surface-variant shrink-0">
                          {entry.format}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: USER PROFILE & WORKSPACE SETTINGS
            ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-md-on-surface">
                  Executive Career Profile &amp; Cloud Settings
                </h2>
                <p className="text-xs text-md-on-surface-variant mt-0.5">
                  Your master profile synchronizes across all your targeted resumes and cloud workspace services.
                </p>
              </div>

              {/* Profile to Resume Synergy Actions */}
              <div className="flex items-center gap-2">
                {onExtractResumeToProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePullResumeToProfile}
                    className="text-xs gap-1.5"
                    title="Import name, title, contact from active resume"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-md-secondary" />
                    <span>Import from Resume</span>
                  </Button>
                )}

                {onApplyProfileToResume && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePushProfileToResume}
                    className="text-xs gap-1.5"
                    title="Push this profile information into current resume canvas"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-md-primary" />
                    <span>Apply to Active Resume</span>
                  </Button>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Section 1: Identity & Avatar */}
              <div className="bg-md-surface-container-low border border-white/[0.08] rounded-[12px] p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  {/* Dynamic Avatar with selectable theme */}
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center font-display font-bold text-2xl shadow-md border border-white/20 shrink-0 ${profileForm.avatarColor}`}>
                    {avatarInitial}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-md-on-surface">
                        {profileForm.displayName || 'Executive Candidate'}
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                        PRO TIER ACTIVE
                      </span>
                    </div>
                    <span className="text-xs text-md-on-surface-variant font-mono block">
                      {user?.email}
                    </span>

                    {/* Avatar Accent Color Picker */}
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-[11px] text-md-on-surface-variant font-mono">Accent Theme:</span>
                      <div className="flex items-center gap-1.5">
                        {AVATAR_COLORS.map(c => (
                          <button
                            key={c.label}
                            type="button"
                            onClick={() => setProfileForm(prev => ({ ...prev, avatarColor: c.value }))}
                            className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${c.value.split(' ')[0]} ${
                              profileForm.avatarColor === c.value ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                            }`}
                            title={c.label}
                            aria-label={`Select ${c.label}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
                  <div>
                    <label className="block text-xs font-medium text-md-on-surface mb-1.5">
                      Full Name / Display Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.displayName}
                      onChange={e => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      required
                      className="w-full px-3.5 h-11 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-md-on-surface mb-1.5">
                      Professional Headline / Role Title
                    </label>
                    <input
                      type="text"
                      value={profileForm.headline}
                      onChange={e => setProfileForm({ ...profileForm, headline: e.target.value })}
                      placeholder="e.g. Staff Distributed Systems Engineer"
                      className="w-full px-3.5 h-11 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-md-on-surface mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-md-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className="w-full pl-9 pr-3.5 h-11 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-md-on-surface mb-1.5">
                      Location / Region
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-md-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                        placeholder="San Francisco, CA or Remote"
                        className="w-full pl-9 pr-3.5 h-11 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-md-on-surface mb-1.5">
                      Personal Portfolio / Website
                    </label>
                    <div className="relative">
                      <Globe className="w-3.5 h-3.5 text-md-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={profileForm.website}
                        onChange={e => setProfileForm({ ...profileForm, website: e.target.value })}
                        placeholder="https://alexmorgan.dev"
                        className="w-full pl-9 pr-3.5 h-11 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-md-on-surface mb-1.5">
                      LinkedIn URL or Handle
                    </label>
                    <div className="relative">
                      <Linkedin className="w-3.5 h-3.5 text-md-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={profileForm.linkedin}
                        onChange={e => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        placeholder="linkedin.com/in/alexmorgan"
                        className="w-full pl-9 pr-3.5 h-11 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-md-on-surface mb-1.5">
                      GitHub Profile URL or Username
                    </label>
                    <div className="relative">
                      <Github className="w-3.5 h-3.5 text-md-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={profileForm.github}
                        onChange={e => setProfileForm({ ...profileForm, github: e.target.value })}
                        placeholder="github.com/alexmorgan"
                        className="w-full pl-9 pr-3.5 h-11 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-md-on-surface mb-1.5">
                      Executive Bio / Career Mission Summary
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="High-impact technical leader with expertise scaling distributed web applications and driving architectural excellence..."
                      className="w-full px-3.5 py-2.5 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Workspace Preferences & SaaS Diagnostics */}
              <div className="bg-md-surface-container-low border border-white/[0.08] rounded-[12px] p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold font-display text-md-on-surface">
                    Cloud Workspace Defaults
                  </h3>
                  <p className="text-xs text-md-on-surface-variant mt-0.5">
                    Configure your preferred default spacing and export settings for newly generated documents.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-md-on-surface mb-1.5">
                      Default Page Layout Spacing
                    </label>
                    <select
                      value={profileForm.defaultSpacingPreset}
                      onChange={e => setProfileForm({ ...profileForm, defaultSpacingPreset: e.target.value as any })}
                      className="w-full px-3.5 h-11 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans"
                    >
                      <option value="standard">Standard (Balanced Executive Spacing)</option>
                      <option value="compact">Compact (High Information Density)</option>
                      <option value="super">Super Compact (Maximum Density)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-md-on-surface mb-1.5">
                      Preferred Quick Export Format
                    </label>
                    <select
                      value={profileForm.defaultFormat}
                      onChange={e => setProfileForm({ ...profileForm, defaultFormat: e.target.value as any })}
                      className="w-full px-3.5 h-11 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans"
                    >
                      <option value="pdf">Adobe PDF (Vector High-Fidelity)</option>
                      <option value="docx">Microsoft Word DOCX</option>
                    </select>
                  </div>
                </div>

                {/* Account Diagnostics */}
                <div className="pt-4 border-t border-white/[0.06] space-y-3">
                  <h4 className="text-xs font-mono font-semibold text-md-on-surface uppercase tracking-wider">
                    Infrastructure &amp; Account Health
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-[8px] space-y-1">
                      <span className="text-[10px] font-mono text-md-on-surface-variant block">CLOUD DATABASE</span>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Firestore Online</span>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-[8px] space-y-1">
                      <span className="text-[10px] font-mono text-md-on-surface-variant block">ACCOUNT UID</span>
                      <span className="font-mono text-md-on-surface text-[11px] truncate block">
                        {user?.uid}
                      </span>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-[8px] space-y-1">
                      <span className="text-[10px] font-mono text-md-on-surface-variant block">MEMBER SINCE</span>
                      <span className="font-mono text-md-on-surface text-[11px] block">
                        {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSavingProfile}
                  className="gap-2 text-xs font-semibold px-6 shadow-md"
                >
                  {isSavingProfile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-md-on-primary border-t-transparent rounded-full animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="gap-2 text-xs text-rose-300 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL 1: SAFE DELETE RESUME CONFIRMATION (NO window.confirm)
          ========================================================================= */}
      {deleteModal && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-md-surface-container-high border border-white/[0.12] rounded-[12px] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 id="delete-dialog-title" className="text-base font-bold font-display text-md-on-surface">
                Delete Resume Document?
              </h3>
              <p className="text-xs text-md-on-surface-variant leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-md-on-surface font-semibold">"{deleteModal.title}"</strong> from your cloud storage? This action cannot be reversed.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteModal(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const id = deleteModal.resumeId;
                  setDeleteModal(null);
                  onDeleteResume(id);
                  showToast('Resume removed from cloud storage', 'info');
                }}
                className="text-xs bg-rose-600 hover:bg-rose-500 text-white border-rose-500"
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: RENAME RESUME TITLE & TARGET ROLE
          ========================================================================= */}
      {renameModal && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="rename-dialog-title"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-md-surface-container-high border border-white/[0.12] rounded-[12px] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-md-primary" />
                <h3 id="rename-dialog-title" className="text-sm font-bold font-display text-md-on-surface">
                  Rename Resume Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRenameModal(null)}
                className="text-md-on-surface-variant hover:text-md-on-surface cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-md-on-surface mb-1">
                  Resume Title
                </label>
                <input
                  type="text"
                  value={renameModal.title}
                  onChange={e => setRenameModal({ ...renameModal, title: e.target.value })}
                  placeholder="e.g. Senior Backend Architect"
                  required
                  className="w-full px-3 h-10 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-md-on-surface mb-1">
                  Target Specialization / Role
                </label>
                <input
                  type="text"
                  value={renameModal.targetRole}
                  onChange={e => setRenameModal({ ...renameModal, targetRole: e.target.value })}
                  placeholder="e.g. Fintech / Cloud Infrastructure"
                  className="w-full px-3 h-10 bg-md-surface-container border border-white/[0.08] rounded-[8px] text-xs text-md-on-surface focus:outline-none focus:border-md-primary font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRenameModal(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={renameLoading}
                  className="text-xs"
                >
                  {renameLoading ? 'Updating...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

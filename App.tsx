import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ResumePaper } from './components/resume';
import { Toolbar, IntroAnimation, DesignSystemPage, CanvasToolbar } from './components/layout';
import { SidebarEditor } from './components/sidebar';
import { AuthScreen } from './components/auth/AuthScreen';
import { PersonalCabinet } from './components/dashboard/PersonalCabinet';
import { INITIAL_RESUME_DATA } from './constants';
import { useAuth } from './contexts/AuthContext';
import { useResumeContext } from './contexts/ResumeContext';
import { useTranslation } from './contexts/LanguageContext';
import { usePdfExport } from './hooks/usePdfExport';
import { useDocExport } from './hooks/useDocExport';
import { 
  subscribeToUserResumes, 
  saveResumeToCloud, 
  createNewResumeInCloud, 
  duplicateResumeInCloud, 
  deleteResumeFromCloud,
  updateResumeMetadataInCloud
} from './services/firebase/cloudResumeService';
import { 
  subscribeToUserCloudExports, 
  recordCloudExport 
} from './services/firebase/cloudTelemetryService';
import { UserResumeMeta } from './types/auth';
import { ExportActivityEntry } from './services/analytics/analyticsTypes';
import { syncCloudExportsToStorage, recordExportAction } from './services/analytics/analyticsStorage';

// Declare html2pdf on window
declare global {
  interface Window {
    html2pdf: any;
  }
}

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();

  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('intro_seen_v2');
    } catch (e) {
      return true;
    }
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('dashboard');
  const [cloudResumes, setCloudResumes] = useState<UserResumeMeta[]>([]);
  const [cloudExports, setCloudExports] = useState<ExportActivityEntry[]>([]);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  const [activeTab, setActiveTab] = useState<'form' | 'style' | 'json' | 'cognitive' | 'ats' | 'analytics'>('form');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDesignSystem, setShowDesignSystem] = useState(false);

  const {
    resumeData,
    handleUpdateResumeData,
    currentResumeId,
    setCurrentResumeId,
    loadResumeFromCloud,
    setJsonInput,
    setAtsInput,
    styleSettings,
    paddingTopBottom,
    paddingLeftRight,
    sectionSpacing,
    itemSpacing,
    spacingPreset,
    showPageGuides,
    compressPdf,
    pdfImageQuality,
    enableAdaptiveFit,
    zoomLevel,
    isInlineEditing,
    setIsInlineEditing,
  } = useResumeContext();

  const isInitialLoadRef = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.title = "Cognitive Resume SaaS — Executive Career Workspace";
  }, []);

  // 1. Subscribe to Cloud Resumes when user is authenticated
  useEffect(() => {
    if (!user) {
      setCloudResumes([]);
      return;
    }

    const unsubscribe = subscribeToUserResumes(
      user.uid,
      async (resumes) => {
        setCloudResumes(resumes);

        // If user has 0 resumes, bootstrap their first resume automatically
        if (resumes.length === 0 && isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
          try {
            const firstResume = await createNewResumeInCloud(
              user.uid,
              user.displayName ? `${user.displayName}'s Executive Resume` : 'Executive Software Engineer',
              'Staff / Lead Engineer'
            );
            loadResumeFromCloud(firstResume);
          } catch (err) {
            console.error('Failed to bootstrap initial resume:', err);
          }
        } else if (resumes.length > 0 && !currentResumeId) {
          // Default to first resume
          loadResumeFromCloud(resumes[0]);
        }
      },
      (err) => console.error('Subscription error for resumes:', err)
    );

    return () => unsubscribe();
  }, [user, currentResumeId, loadResumeFromCloud]);

  // 2. Subscribe to Cloud Export Telemetry
  useEffect(() => {
    if (!user) {
      setCloudExports([]);
      return;
    }

    const unsubscribe = subscribeToUserCloudExports(
      user.uid,
      (entries) => {
        setCloudExports(entries);
        syncCloudExportsToStorage(entries);
      },
      (err) => console.error('Subscription error for exports:', err)
    );

    return () => unsubscribe();
  }, [user]);

  // 3. Debounced Auto-Save to Firestore when editing active resume
  useEffect(() => {
    if (!user || !currentResumeId || currentView !== 'editor') return;

    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const activeMeta = cloudResumes.find(r => r.id === currentResumeId);
        const payload: UserResumeMeta = {
          id: currentResumeId,
          userId: user.uid,
          title: activeMeta?.title || (resumeData.name ? `${resumeData.name}'s Resume` : 'Professional Resume'),
          targetRole: activeMeta?.targetRole || 'Software Engineering',
          data: resumeData,
          layoutSettings: {
            paddingTopBottom,
            paddingLeftRight,
            sectionSpacing,
            itemSpacing,
            spacingPreset
          },
          styleSettings,
          createdAt: activeMeta?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await saveResumeToCloud(user.uid, payload);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save failed:', err);
        setSaveStatus('saved');
      }
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [resumeData, styleSettings, paddingTopBottom, paddingLeftRight, sectionSpacing, itemSpacing, spacingPreset, user, currentResumeId, currentView]);

  // Cloud Export Action Wrappers
  const handlePrint = useCallback(() => {
    recordExportAction('print', resumeData.name || 'Executive Resume');
    if (user) {
      recordCloudExport(user.uid, 'print', resumeData.name || 'Executive Resume', currentResumeId || 'active')
        .catch(e => console.error('Failed to log print export:', e));
    }
    window.print();
  }, [user, resumeData.name, currentResumeId]);

  const { isGenerating, handleDownloadPdf: rawDownloadPdf } = usePdfExport(
    resumeData, 
    paddingTopBottom, 
    paddingLeftRight, 
    compressPdf, 
    pdfImageQuality
  );
  
  const handleDownloadPdf = useCallback(async () => {
    await rawDownloadPdf();
    recordExportAction('pdf', resumeData.name || 'Executive Resume');
    if (user) {
      recordCloudExport(user.uid, 'pdf', resumeData.name || 'Executive Resume', currentResumeId || 'active')
        .catch(e => console.error('Failed to log PDF export:', e));
    }
  }, [rawDownloadPdf, user, resumeData.name, currentResumeId]);

  const { isGeneratingDoc, handleDownloadDocx: rawDownloadDocx } = useDocExport(
    resumeData,
    paddingTopBottom,
    paddingLeftRight
  );
  
  const handleDownloadDocx = useCallback(async () => {
    await rawDownloadDocx();
    recordExportAction('docx', resumeData.name || 'Executive Resume');
    if (user) {
      recordCloudExport(user.uid, 'docx', resumeData.name || 'Executive Resume', currentResumeId || 'active')
        .catch(e => console.error('Failed to log DOCX export:', e));
    }
  }, [rawDownloadDocx, user, resumeData.name, currentResumeId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        const mergedData = { ...INITIAL_RESUME_DATA, ...parsed };
        setJsonInput(JSON.stringify(mergedData, null, 2));
        setAtsInput(mergedData.atsKeywords || '');
      } catch (err) {
        console.error("Failed to parse uploaded JSON resume file:", err);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Intro Animation Gate
  if (showIntro) {
    return (
      <IntroAnimation 
        onComplete={() => {
          setShowIntro(false);
          try {
            sessionStorage.setItem('intro_seen_v2', 'true');
          } catch (e) {}
        }} 
      />
    );
  }

  // 4. Loading State while checking Firebase Auth status
  if (authLoading) {
    return (
      <div className="h-screen w-full bg-md-surface flex items-center justify-center font-sans text-md-on-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-md-primary border-t-transparent animate-spin" />
          <span className="text-xs text-md-on-surface-variant font-mono">
            Synchronizing SaaS Workspace...
          </span>
        </div>
      </div>
    );
  }

  // 5. Mandatory Authentication Gate
  if (!user) {
    return <AuthScreen />;
  }

  // 6. SaaS Personal Cabinet View
  if (currentView === 'dashboard') {
    return (
      <PersonalCabinet
        resumes={cloudResumes}
        exports={cloudExports}
        activeResumeId={currentResumeId}
        onSelectResume={(selected) => {
          loadResumeFromCloud(selected);
          setCurrentView('editor');
        }}
        onCreateNewResume={async () => {
          if (!user) return;
          try {
            const count = cloudResumes.length + 1;
            const created = await createNewResumeInCloud(
              user.uid,
              `Custom Resume Variant ${count}`,
              'Target Role / Specialization'
            );
            loadResumeFromCloud(created);
            // Resume is now created and loaded in background; keep user in dashboard
          } catch (err) {
            console.error('Failed to create new resume:', err);
            throw err;
          }
        }}
        onDuplicateResume={async (source) => {
          if (!user) return;
          try {
            const duplicated = await duplicateResumeInCloud(user.uid, source);
            loadResumeFromCloud(duplicated);
          } catch (err) {
            console.error('Failed to duplicate resume:', err);
          }
        }}
        onDeleteResume={async (resumeId) => {
          if (!user) return;
          try {
            await deleteResumeFromCloud(user.uid, resumeId);
            if (currentResumeId === resumeId) {
              const remaining = cloudResumes.filter(r => r.id !== resumeId);
              if (remaining.length > 0) {
                loadResumeFromCloud(remaining[0]);
              } else {
                setCurrentResumeId(null);
              }
            }
          } catch (err) {
            console.error('Failed to delete resume:', err);
          }
        }}
        onRenameResume={async (resumeId, newTitle, newRole) => {
          if (!user) return;
          await updateResumeMetadataInCloud(user.uid, resumeId, {
            title: newTitle,
            targetRole: newRole
          });
        }}
        onApplyProfileToResume={(profile) => {
          const updated = {
            ...resumeData,
            name: profile.displayName || resumeData.name,
            title: profile.headline || resumeData.title,
            email: profile.email || resumeData.email,
            phone: profile.phone || resumeData.phone,
            location: profile.location || resumeData.location,
            website: profile.website || resumeData.website,
            github: profile.github || resumeData.github,
            linkedin: profile.linkedin || resumeData.linkedin,
            summary: profile.bio || resumeData.summary
          };
          handleUpdateResumeData(updated);
        }}
        onExtractResumeToProfile={() => ({
          displayName: resumeData.name,
          headline: resumeData.title,
          email: resumeData.email,
          phone: resumeData.phone,
          location: resumeData.location,
          website: resumeData.website,
          github: resumeData.github,
          linkedin: resumeData.linkedin,
          bio: resumeData.summary
        })}
        onOpenEditor={() => setCurrentView('editor')}
      />
    );
  }

  // 7. Full-Featured Canvas & Tool Drawer Editor View
  return (
    <div className="h-screen flex flex-col bg-md-surface text-md-on-surface font-sans overflow-hidden print:h-auto print:block print:overflow-visible print:bg-white relative">
      <Toolbar 
        onFileUpload={handleFileUpload}
        onDownloadPdf={handleDownloadPdf}
        onDownloadDocx={handleDownloadDocx}
        onPrint={handlePrint}
        isGenerating={isGenerating}
        isGeneratingDoc={isGeneratingDoc}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenDesignSystem={() => setShowDesignSystem(true)}
        onOpenDashboard={() => setCurrentView('dashboard')}
        saveStatus={saveStatus}
      />

      <div className="flex flex-1 overflow-hidden relative print:overflow-visible print:block">
        {/* Sidebar Panel: Desktop collapses to 72px vertical rail, mobile collapses to 0 */}
        <aside 
          className={`shrink-0 transition-[width] duration-300 ease-in-out z-20 print:hidden flex overflow-hidden ${
            sidebarOpen 
              ? 'w-full md:w-[490px] lg:w-[530px] border-r border-white/[0.08]' 
              : 'w-0 md:w-[72px] border-r-0 md:border-r border-white/[0.08]'
          }`}
          aria-label="Application tools"
        >
          <div className="w-full md:w-[490px] lg:w-[530px] shrink-0 h-full overflow-hidden">
            <SidebarEditor
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isExpanded={sidebarOpen}
              onToggleExpand={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
        </aside>

        {/* Main Resume Canvas Area with Floating CanvasToolbar */}
        <div className="flex-1 relative overflow-hidden flex flex-col print:overflow-visible print:block">
          <main className="flex-1 overflow-y-auto w-full bg-md-surface p-4 md:p-8 flex justify-center print:p-0 print:block print:overflow-visible relative">
            <div 
              className="w-full max-w-[210mm] transition-transform duration-200 ease-out print:max-w-none print:w-full min-h-full origin-top pb-24 print:pb-0"
              style={{
                transform: zoomLevel !== 1.0 ? `scale(${zoomLevel})` : undefined,
              }}
            >
              <ResumePaper 
                data={resumeData} 
                paddingTopBottom={paddingTopBottom}
                paddingLeftRight={paddingLeftRight}
                sectionSpacing={sectionSpacing}
                itemSpacing={itemSpacing}
                showPageGuides={showPageGuides}
                enableAdaptiveFit={enableAdaptiveFit}
              />
              <footer className="mt-8 mb-4 text-center text-md-on-surface-variant text-xs print:hidden">
                 <p>&copy; {new Date().getFullYear()} Cognitive Resume SaaS. All cloud records synchronized.</p>
              </footer>
            </div>
          </main>

          {/* Floating Canvas Direct Editing Active Indicator */}
          {isInlineEditing && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 print:hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#14161c]/95 border border-emerald-500/40 text-emerald-200 text-xs shadow-2xl backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="font-medium">{t.canvas.bannerActive}</span>
                <button
                  type="button"
                  onClick={() => setIsInlineEditing(false)}
                  className="ml-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-[11px] font-medium border border-emerald-400/30 transition-colors cursor-pointer"
                >
                  {t.canvas.bannerDone}
                </button>
              </div>
            </div>
          )}

          {/* Floating Canvas Docked Toolbar */}
          <CanvasToolbar />
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
           className="md:hidden fixed inset-0 z-10 bg-black/60 backdrop-blur-sm print:hidden" 
           onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Material 3 (2026 Edition) Design System Modal */}
      {showDesignSystem && (
        <DesignSystemPage onClose={() => setShowDesignSystem(false)} />
      )}
    </div>
  );
};

export default App;

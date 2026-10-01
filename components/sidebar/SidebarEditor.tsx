import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Sliders, 
  Brain,
  Target,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ResumeData } from '../../types';
import { SidebarFormTab } from './tabs/SidebarFormTab';
import { SidebarJsonTab } from './tabs/SidebarJsonTab';
import { SidebarAtsTab } from './tabs/SidebarAtsTab';
import { SidebarCognitiveTab } from './tabs/SidebarCognitiveTab';
import { SidebarAnalyticsTab } from './tabs/SidebarAnalyticsTab';
import { useResumeContext } from '../../contexts/ResumeContext';
import { useCognitiveAnalysis } from '../../hooks/useCognitiveAnalysis';

export type SidebarTabType = 'form' | 'json' | 'cognitive' | 'ats' | 'analytics';

export interface SidebarEditorProps {
  activeTab: SidebarTabType;
  setActiveTab: (tab: SidebarTabType) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

interface TabItemConfig {
  id: SidebarTabType;
  label: string;
  shortLabel: string;
  category: 'edit' | 'eval';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  accentColor: string;
  badgeBg: string;
}

const TAB_CONFIGS: TabItemConfig[] = [
  // 1. Authoring & Content
  {
    id: 'form',
    label: 'Form Editor',
    shortLabel: 'Form',
    category: 'edit',
    icon: Sliders,
    description: 'Personal info, experience, skills & formatting',
    accentColor: 'text-md-primary',
    badgeBg: 'bg-md-primary-container/40 text-md-on-primary-container',
  },
  {
    id: 'json',
    label: 'JSON Schema',
    shortLabel: 'JSON',
    category: 'edit',
    icon: Code2,
    description: 'Raw code schema with instant live validation',
    accentColor: 'text-md-success',
    badgeBg: 'bg-md-success-container/40 text-md-on-success-container',
  },
  // 2. Intelligence & Optimization
  {
    id: 'ats',
    label: 'ATS Scanner',
    shortLabel: 'ATS',
    category: 'eval',
    icon: Target,
    description: 'Target keywords & job match score',
    accentColor: 'text-md-tertiary',
    badgeBg: 'bg-md-tertiary-container/40 text-md-on-tertiary-container',
  },
  {
    id: 'cognitive',
    label: 'Cognitive AI',
    shortLabel: 'AI Laws',
    category: 'eval',
    icon: Brain,
    description: 'Neuro-cognitive heuristics & smart rewrites',
    accentColor: 'text-md-primary',
    badgeBg: 'bg-md-primary-container/40 text-md-on-primary-container',
  },
  {
    id: 'analytics',
    label: 'Analytics & Heat',
    shortLabel: 'Stats',
    category: 'eval',
    icon: BarChart2,
    description: 'Recruiter visual flow & section balance',
    accentColor: 'text-md-secondary',
    badgeBg: 'bg-md-secondary-container/40 text-md-on-secondary-container',
  },
];

export const SidebarEditor: React.FC<SidebarEditorProps> = ({
  activeTab,
  setActiveTab,
  isExpanded = true,
  onToggleExpand,
}) => {
  const {
    resumeData,
    jsonInput,
    setJsonInput,
    atsInput,
    setAtsInput,
    jsonError,
    handleUpdateResumeData,
    paddingTopBottom,
    setPaddingTopBottom,
    paddingLeftRight,
    setPaddingLeftRight,
    sectionSpacing,
    setSectionSpacing,
    itemSpacing,
    setItemSpacing,
    spacingPreset,
    handleApplySpacingPreset,
    showPageGuides,
    setShowPageGuides,
    autoFitContent,
    pageFraction,
    enableAdaptiveFit,
    setEnableAdaptiveFit,
  } = useResumeContext();

  const onChangeData = handleUpdateResumeData;
  const onApplySpacingPreset = handleApplySpacingPreset;

  const {
    analysisResult,
    analyzing,
    analyzerWarning,
    analyzedDataString,
    runCognitiveAnalysis,
    handleApplyRewrite
  } = useCognitiveAnalysis(resumeData, onChangeData, setJsonInput);

  // Trigger analysis automatically on switching to the tab if data was modified
  useEffect(() => {
    if (activeTab === 'cognitive' && !analyzing) {
      const currentDataStr = JSON.stringify(resumeData);
      if (currentDataStr !== analyzedDataString) {
        runCognitiveAnalysis();
      }
    }
  }, [activeTab]);

  const currentTabConfig = TAB_CONFIGS.find((t) => t.id === activeTab) || TAB_CONFIGS[0];

  const handleTabClick = (tabId: SidebarTabType) => {
    if (activeTab === tabId) {
      // Toggle drawer when clicking active item (standard pro IDE / productivity pattern)
      if (onToggleExpand) {
        onToggleExpand();
      }
    } else {
      setActiveTab(tabId);
      // Ensure drawer is open when switching to another tab
      if (!isExpanded && onToggleExpand) {
        onToggleExpand();
      }
    }
  };

  const authoringTabs = TAB_CONFIGS.filter(t => t.category === 'edit');
  const intelligenceTabs = TAB_CONFIGS.filter(t => t.category === 'eval');

  const renderRailButton = (tab: TabItemConfig) => {
    const isActive = activeTab === tab.id && isExpanded;
    const Icon = tab.icon;

    // Badges / Error status
    const hasJsonError = tab.id === 'json' && !!jsonError;
    const hasAtsKeywords = tab.id === 'ats' && !!atsInput.trim();
    const isCognitiveRunning = tab.id === 'cognitive' && analyzing;

    return (
      <button
        key={tab.id}
        onClick={() => handleTabClick(tab.id)}
        className={`group relative w-[54px] h-[54px] rounded-md-md flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary/40 select-none ${
          isActive 
            ? 'bg-md-primary/15 text-white shadow-sm ring-1 ring-md-primary/30' 
            : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.04]'
        }`}
        aria-label={tab.label}
        aria-selected={isActive}
        role="tab"
      >
        {/* Active Left Vertical Accent Pill */}
        {isActive && (
          <motion.span
            layoutId="verticalRailIndicator"
            className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-md-primary rounded-r-full shadow-sm"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}

        {/* Icon & Status Badges */}
        <div className="relative flex items-center justify-center">
          <Icon className={`w-5 h-5 transition-transform duration-150 group-hover:scale-105 ${isActive ? tab.accentColor : 'text-md-on-surface-variant group-hover:text-md-on-surface'}`} />
          
          {hasJsonError && (
            <span 
              className="absolute -top-1.5 -right-2 flex h-2.5 w-2.5"
              title="JSON schema syntax error"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-md-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-md-error"></span>
            </span>
          )}

          {hasAtsKeywords && !hasJsonError && (
            <span 
              className="absolute -top-1 -right-1.5 h-2 w-2 rounded-full bg-md-tertiary border border-md-surface-container" 
              title="ATS keywords loaded"
            />
          )}

          {isCognitiveRunning && (
            <span className="absolute -top-1.5 -right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-md-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-md-primary"></span>
            </span>
          )}
        </div>

        {/* Short Label */}
        <span className={`text-[11px] font-medium tracking-tight ${isActive ? 'font-semibold text-white' : 'text-md-on-surface-variant group-hover:text-md-on-surface'}`}>
          {tab.shortLabel}
        </span>

        {/* Floating Tooltip with Description */}
        <div className="pointer-events-none absolute left-full ml-3 px-3 py-2 bg-md-surface-container-high border border-white/[0.12] rounded-md-md shadow-md-elevation-3 text-left whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
          <div className="text-xs font-semibold text-md-on-surface flex items-center gap-1.5">
            <span>{tab.label}</span>
            {hasJsonError && <span className="text-xs text-md-error font-mono font-bold">(Error)</span>}
          </div>
          <div className="text-xs text-md-on-surface-variant max-w-xs mt-0.5">
            {tab.description}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex h-full w-full bg-md-surface-container-low overflow-hidden select-none font-sans print:hidden shadow-md-elevation-3 z-20">
      {/* 1. VERTICAL NAVIGATION RAIL (Fixed 72px width) */}
      <nav 
        className="w-[72px] shrink-0 h-full flex flex-col justify-between items-center py-3.5 bg-md-surface-container-low border-r border-white/[0.08] z-30"
        aria-label="Sidebar Tool Rail"
      >
        {/* Top: Section Groupings */}
        <div className="flex flex-col items-center gap-3.5 w-full">
          {/* Authoring Group */}
          <div className="w-full flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-sans text-md-on-surface-variant font-medium">
              Edit
            </span>
            {authoringTabs.map(renderRailButton)}
          </div>

          {/* Subtle Separator */}
          <div className="w-10 h-[1px] bg-white/[0.08] my-0.5" />

          {/* Intelligence & Evaluation Group */}
          <div className="w-full flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-sans text-md-on-surface-variant font-medium">
              Eval
            </span>
            {intelligenceTabs.map(renderRailButton)}
          </div>
        </div>

        {/* Bottom: Collapse / Expand Controls */}
        <div className="flex flex-col items-center gap-2.5 w-full pt-2.5 border-t border-white/[0.08]">
          {/* Rail Collapse / Expand Toggle Button */}
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="w-11 h-11 flex items-center justify-center text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.06] rounded-md-sm border border-transparent hover:border-white/[0.10] transition-all cursor-pointer group relative mt-1"
              title={isExpanded ? "Collapse Sidebar Panel" : "Expand Sidebar Panel"}
              aria-label={isExpanded ? "Collapse Sidebar Panel" : "Expand Sidebar Panel"}
            >
              {isExpanded ? (
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
              ) : (
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              )}
              <div className="pointer-events-none absolute left-full ml-3 px-3 py-2 bg-md-surface-container-high border border-white/[0.12] rounded-md-sm shadow-md-elevation-2 text-left whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <div className="text-xs font-semibold text-md-on-surface">
                  {isExpanded ? "Collapse Panel" : "Expand Panel"}
                </div>
                <div className="text-xs text-md-on-surface-variant mt-0.5">
                  {isExpanded ? "Free up canvas space" : "Open active tool drawer"}
                </div>
              </div>
            </button>
          )}
        </div>
      </nav>

      {/* 2. EXPANDABLE TOOL DRAWER */}
      {isExpanded && (
        <div className="flex-1 flex flex-col h-full bg-md-surface-container min-w-0 overflow-hidden z-20 animate-fade-in">
          {/* Drawer Header */}
          <header className="flex items-center justify-between px-5 py-3.5 bg-md-surface-container-low border-b border-white/[0.08] shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2 rounded-md-sm ${currentTabConfig.badgeBg}`}>
                <currentTabConfig.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-md-on-surface font-display truncate">
                    {currentTabConfig.label}
                  </h2>
                  <span className="text-xs text-md-on-surface-variant font-normal">
                    · {currentTabConfig.category === 'edit' ? 'Authoring' : 'Intelligence'}
                  </span>
                </div>
                <p className="text-xs text-md-on-surface-variant truncate mt-0.5">
                  {currentTabConfig.description}
                </p>
              </div>
            </div>

            {onToggleExpand && (
              <button
                onClick={onToggleExpand}
                className="p-2 text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.06] rounded-md-sm border border-transparent hover:border-white/[0.10] transition-all cursor-pointer shrink-0 ml-2"
                title="Collapse drawer"
                aria-label="Collapse drawer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </header>

          {/* Drawer Body (Scrollable Component Container) */}
          <main className="flex-1 relative flex flex-col min-h-0 bg-md-surface-container overflow-y-auto">
            {activeTab === 'form' && (
              <SidebarFormTab
                resumeData={resumeData}
                onChangeData={onChangeData}
                paddingTopBottom={paddingTopBottom}
                setPaddingTopBottom={setPaddingTopBottom}
                paddingLeftRight={paddingLeftRight}
                setPaddingLeftRight={setPaddingLeftRight}
                sectionSpacing={sectionSpacing}
                setSectionSpacing={setSectionSpacing}
                itemSpacing={itemSpacing}
                setItemSpacing={setItemSpacing}
                spacingPreset={spacingPreset}
                onApplySpacingPreset={onApplySpacingPreset}
                showPageGuides={showPageGuides}
                setShowPageGuides={setShowPageGuides}
                autoFitContent={autoFitContent}
                pageFraction={pageFraction}
                enableAdaptiveFit={enableAdaptiveFit}
                setEnableAdaptiveFit={setEnableAdaptiveFit}
              />
            )}

            {activeTab === 'json' && (
              <SidebarJsonTab
                jsonInput={jsonInput}
                setJsonInput={setJsonInput}
                jsonError={jsonError}
              />
            )}

            {activeTab === 'cognitive' && (
              <SidebarCognitiveTab
                resumeData={resumeData}
                onChangeData={onChangeData}
                analysisResult={analysisResult}
                analyzing={analyzing}
                analyzerWarning={analyzerWarning}
                runCognitiveAnalysis={runCognitiveAnalysis}
                handleApplyRewrite={handleApplyRewrite}
              />
            )}

            {activeTab === 'ats' && (
              <SidebarAtsTab
                resumeData={resumeData}
                onChangeData={onChangeData}
                atsInput={atsInput}
                setAtsInput={setAtsInput}
              />
            )}

            {activeTab === 'analytics' && (
              <SidebarAnalyticsTab resumeData={resumeData} />
            )}
          </main>
        </div>
      )}
    </div>
  );
};


import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Sliders, 
  Brain,
  Target,
  BarChart2
} from 'lucide-react';
import { ResumeData } from '../../types';
import { SidebarFormTab } from './tabs/SidebarFormTab';
import { SidebarJsonTab } from './tabs/SidebarJsonTab';
import { SidebarAtsTab } from './tabs/SidebarAtsTab';
import { SidebarCognitiveTab } from './tabs/SidebarCognitiveTab';
import { SidebarAnalyticsTab } from './tabs/SidebarAnalyticsTab';
import { useResumeContext } from '../../contexts/ResumeContext';
import { useCognitiveAnalysis } from '../../hooks/useCognitiveAnalysis';

interface SidebarEditorProps {
  activeTab: 'form' | 'json' | 'cognitive' | 'ats' | 'analytics';
  setActiveTab: (tab: 'form' | 'json' | 'cognitive' | 'ats' | 'analytics') => void;
}

export const SidebarEditor: React.FC<SidebarEditorProps> = ({
  activeTab,
  setActiveTab,
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
    pageFraction
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

  // Trigger analysis automatically on switching to the tab if the data has been modified
  useEffect(() => {
    if (activeTab === 'cognitive' && !analyzing) {
      const currentDataStr = JSON.stringify(resumeData);
      if (currentDataStr !== analyzedDataString) {
        runCognitiveAnalysis();
      }
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full bg-ds-panel border-r border-ds-border w-full shrink-0 print:hidden shadow-2xl z-20 font-sans">
      {/* Tab Selectors using Minimalist Underline Design with sliding accent underline */}
      <div className="flex bg-ds-panel px-2.5 py-1.5 gap-1 shrink-0 border-b border-ds-border">
        <motion.button
          onClick={() => setActiveTab('analytics')}
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-2 py-2.5 rounded-ds-md text-[10px] uppercase tracking-wider font-bold flex-1 flex flex-col items-center gap-1 transition-colors duration-200 cursor-pointer select-none group z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ds-primary/40 ${
            activeTab === 'analytics' ? 'text-ds-text-high' : 'text-ds-text-muted hover:text-ds-text-high'
          }`}
        >
          <BarChart2 className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'analytics' ? 'text-ds-secondary' : 'text-ds-text-muted group-hover:text-ds-text-high'}`} />
          <span>Stats</span>
          {activeTab === 'analytics' && (
            <motion.span 
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-1 right-1 h-[2px] bg-ds-secondary rounded-full shadow-ds-sm"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('form')}
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-2 py-2.5 rounded-ds-md text-[10px] uppercase tracking-wider font-bold flex-1 flex flex-col items-center gap-1 transition-colors duration-200 cursor-pointer select-none group z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ds-primary/40 ${
            activeTab === 'form' ? 'text-ds-text-high' : 'text-ds-text-muted hover:text-ds-text-high'
          }`}
        >
          <Sliders className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'form' ? 'text-ds-primary' : 'text-ds-text-muted group-hover:text-ds-text-high'}`} />
          <span>Form</span>
          {activeTab === 'form' && (
            <motion.span 
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-1 right-1 h-[2px] bg-ds-primary rounded-full shadow-ds-glow"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('json')}
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-2 py-2.5 rounded-ds-md text-[10px] uppercase tracking-wider font-bold flex-1 flex flex-col items-center gap-1 transition-colors duration-200 cursor-pointer select-none group z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ds-primary/40 ${
            activeTab === 'json' ? 'text-ds-text-high' : 'text-ds-text-muted hover:text-ds-text-high'
          }`}
        >
          <Code2 className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'json' ? 'text-ds-success' : 'text-ds-text-muted group-hover:text-ds-text-high'}`} />
          <span>JSON</span>
          {activeTab === 'json' && (
            <motion.span 
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-1 right-1 h-[2px] bg-ds-success rounded-full shadow-ds-sm"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('cognitive')}
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-2 py-2.5 rounded-ds-md text-[10px] uppercase tracking-wider font-bold flex-1 flex flex-col items-center gap-1 transition-colors duration-200 cursor-pointer select-none group z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ds-primary/40 ${
            activeTab === 'cognitive' ? 'text-ds-text-high' : 'text-ds-text-muted hover:text-ds-text-high'
          }`}
        >
          <div className="relative">
            <Brain className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'cognitive' ? 'text-ds-primary' : 'text-ds-text-muted group-hover:text-ds-text-high'}`} />
            {activeTab === 'cognitive' && (
              <span className="absolute -top-0.5 -right-1 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ds-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-ds-primary"></span>
              </span>
            )}
          </div>
          <span>Cognitive</span>
          {activeTab === 'cognitive' && (
            <motion.span 
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-1 right-1 h-[2px] bg-ds-primary rounded-full shadow-ds-glow"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('ats')}
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-2 py-2.5 rounded-ds-md text-[10px] uppercase tracking-wider font-bold flex-1 flex flex-col items-center gap-1 transition-colors duration-200 cursor-pointer select-none group z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ds-primary/40 ${
            activeTab === 'ats' ? 'text-ds-text-high' : 'text-ds-text-muted hover:text-ds-text-high'
          }`}
        >
          <Target className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'ats' ? 'text-ds-secondary' : 'text-ds-text-muted group-hover:text-ds-text-high'}`} />
          <span>ATS</span>
          {activeTab === 'ats' && (
            <motion.span 
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-1 right-1 h-[2px] bg-ds-secondary rounded-full shadow-ds-sm"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
        </motion.button>
      </div>

      {/* Main Control Areas */}
      <div className="flex-1 relative flex flex-col min-h-0 bg-ds-container overflow-y-auto">
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
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Sliders, 
  Brain,
  Target
} from 'lucide-react';
import { ResumeData } from '../types';
import { SidebarFormTab } from './SidebarFormTab';
import { SidebarJsonTab } from './SidebarJsonTab';
import { SidebarAtsTab } from './SidebarAtsTab';
import { SidebarCognitiveTab } from './SidebarCognitiveTab';
import { useResumeContext } from '../contexts/ResumeContext';

interface SidebarEditorProps {
  activeTab: 'form' | 'json' | 'cognitive' | 'ats';
  setActiveTab: (tab: 'form' | 'json' | 'cognitive' | 'ats') => void;
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

  // Cognitive Analysis & Attention Laws State Hub
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzerWarning, setAnalyzerWarning] = useState<string | null>(null);
  const [analyzedDataString, setAnalyzedDataString] = useState<string>('');

  const runCognitiveAnalysis = async () => {
    // Exclude the massive photo base64 string from the API payload to prevent HTTP 413 Payload Too Large errors
    const { photo, ...restData } = resumeData;
    const dataToAnalyze = JSON.stringify(restData);
    setAnalyzing(true);
    setAnalyzerWarning(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ resumeData: restData })
      });
      if (!response.ok) {
        throw new Error("Diagnostic server returned error status " + response.status);
      }
      const data = await response.json();
      setAnalysisResult(data);
      setAnalyzedDataString(JSON.stringify(resumeData)); // Keep the actual resumeData string as analyzed representation to track changes
      if (data.warning) {
        setAnalyzerWarning(data.warning);
      }
    } catch (err: any) {
      console.error(err);
      setAnalyzerWarning("Connection error: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyRewrite = (original: string, replacement: string) => {
    const updated = { ...resumeData };
    let found = false;
    
    // Check Title
    if (updated.title === original) {
      updated.title = replacement;
      found = true;
    }
    
    // Check Summary Paragraphs
    if (!found && Array.isArray(updated.summary)) {
      const idx = updated.summary.indexOf(original);
      if (idx !== -1) {
        updated.summary[idx] = replacement;
        found = true;
      }
    }
    
    // Check Experience Highlights
    if (!found && Array.isArray(updated.experience)) {
      updated.experience = updated.experience.map(exp => {
        if (exp.highlights) {
          return {
            ...exp,
            highlights: exp.highlights.map(h => {
              if (h.description === original) {
                found = true;
                return { ...h, description: replacement };
              }
              if (h.title === original) {
                found = true;
                return { ...h, title: replacement };
              }
              return h;
            })
          };
        }
        return exp;
      });
    }

    // Check Project Details and description
    if (!found && Array.isArray(updated.projects)) {
      updated.projects = updated.projects.map(p => {
        if (p.description === original) {
          found = true;
          return { ...p, description: replacement };
        }
        if (p.details) {
          return {
            ...p,
            details: p.details.map(d => {
              if (d.value === original) {
                found = true;
                return { ...d, value: replacement };
              }
              return d;
            })
          };
        }
        return p;
      });
    }
    
    if (found) {
      onChangeData(updated);
      setJsonInput(JSON.stringify(updated, null, 2));
      setAnalyzedDataString(JSON.stringify(updated));
      
      // Filter out or mark as applied
      if (analysisResult && analysisResult.rewrites) {
        setAnalysisResult({
          ...analysisResult,
          rewrites: analysisResult.rewrites.filter((r: any) => r.original !== original)
        });
      }
    } else {
      // Fuzzy substring match backup
      let fuzzyMatch = false;
      if (Array.isArray(updated.experience)) {
        updated.experience = updated.experience.map(exp => {
          if (exp.highlights) {
            return {
              ...exp,
              highlights: exp.highlights.map(h => {
                if (h.description.includes(original) || original.includes(h.description)) {
                  fuzzyMatch = true;
                  return { ...h, description: replacement };
                }
                return h;
              })
            };
          }
          return exp;
        });
      }
      
      if (fuzzyMatch) {
        onChangeData(updated);
        setJsonInput(JSON.stringify(updated, null, 2));
        setAnalyzedDataString(JSON.stringify(updated));
        if (analysisResult && analysisResult.rewrites) {
          setAnalysisResult({
            ...analysisResult,
            rewrites: analysisResult.rewrites.filter((r: any) => r.original !== original)
          });
        }
      } else {
        alert("Located with slight variations: Copy replacement line manually or edit fields directly.");
      }
    }
  };

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
      {/* Tab Selectors using Sleek Minimalist Underline Design with sliding accent underline */}
      <div className="flex bg-ds-panel px-3 py-2 gap-1 shrink-0 border-b border-ds-border">
        <motion.button
          onClick={() => setActiveTab('form')}
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-2 py-3 rounded-xl text-[10px] uppercase tracking-wider font-extrabold flex-1 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer select-none group z-10 ${
            activeTab === 'form' ? 'text-ds-text-high' : 'text-ds-text-muted hover:text-ds-text-high'
          }`}
        >
          <Sliders className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'form' ? 'text-ds-primary' : 'text-ds-text-muted group-hover:text-ds-text-high'}`} />
          <span>Form</span>
          {activeTab === 'form' && (
            <motion.span 
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-ds-primary rounded-full shadow-glow"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('json')}
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-2 py-3 rounded-xl text-[10px] uppercase tracking-wider font-extrabold flex-1 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer select-none group z-10 ${
            activeTab === 'json' ? 'text-ds-text-high' : 'text-ds-text-muted hover:text-ds-text-high'
          }`}
        >
          <Code2 className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'json' ? 'text-emerald-400' : 'text-ds-text-muted group-hover:text-ds-text-high'}`} />
          <span>JSON</span>
          {activeTab === 'json' && (
            <motion.span 
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-emerald-400 rounded-full shadow-[0_1px_10px_rgba(52,211,153,0.5)]"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('cognitive')}
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-2 py-3 rounded-xl text-[10px] uppercase tracking-wider font-extrabold flex-1 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer select-none group z-10 ${
            activeTab === 'cognitive' ? 'text-ds-text-high' : 'text-ds-text-muted hover:text-ds-text-high'
          }`}
        >
          <div className="relative">
            <Brain className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'cognitive' ? 'text-ds-primary' : 'text-ds-text-muted group-hover:text-ds-text-high'}`} />
            {activeTab === 'cognitive' && (
              <span className="absolute -top-0.5 -right-1.5 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ds-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-ds-primary"></span>
              </span>
            )}
          </div>
          <span>Cognitive</span>
          {activeTab === 'cognitive' && (
            <motion.span 
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-ds-primary rounded-full shadow-glow"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('ats')}
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-2 py-3 rounded-xl text-[10px] uppercase tracking-wider font-extrabold flex-1 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer select-none group z-10 ${
            activeTab === 'ats' ? 'text-ds-text-high' : 'text-ds-text-muted hover:text-ds-text-high'
          }`}
        >
          <Target className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'ats' ? 'text-cyan-400' : 'text-ds-text-muted group-hover:text-ds-text-high'}`} />
          <span>ATS</span>
          {activeTab === 'ats' && (
            <motion.span 
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-cyan-400 rounded-full shadow-[0_1px_10px_rgba(34,211,238,0.5)]"
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
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  RefreshCw, 
  Zap, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  Eye,
  Info,
  Layers,
  Activity,
  Award,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  WifiOff
} from 'lucide-react';
import { ResumeData } from '../../../types';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

interface SidebarCognitiveTabProps {
  resumeData: ResumeData;
  onChangeData: (data: ResumeData) => void;
  analysisResult: any;
  analyzing: boolean;
  analyzerWarning: string | null;
  runCognitiveAnalysis: () => Promise<void>;
  handleApplyRewrite: (original: string, replacement: string) => void;
}

export const SidebarCognitiveTab: React.FC<SidebarCognitiveTabProps> = ({
  resumeData,
  onChangeData,
  analysisResult,
  analyzing,
  analyzerWarning,
  runCognitiveAnalysis,
  handleApplyRewrite
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'laws' | 'frames'>('overview');
  const [showHotspotInfo, setShowHotspotInfo] = useState(false);
  const [expandedLaw, setExpandedLaw] = useState<string | null>(null);

  // Network offline state handler for elite high-status HCI design
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Dynamic metric calculations for the 6 Attention/HCI laws, making them perfectly synchronized
  const totalBullets = (resumeData.experience || []).reduce((acc: number, item: any) => acc + (item.highlights?.length || 0), 0);
  const totalSkillsCategories = resumeData.skills ? Object.keys(resumeData.skills).length : 0;
  
  // Track metrics count
  const metricsRegex = /\d%|\$\d|percent|billion|million|\d+\+/i;
  let metricCount = 0;
  (resumeData.experience || []).forEach((exp: any) => {
    (exp.highlights || []).forEach((h: any) => {
      if (h.title && metricsRegex.test(h.title)) metricCount++;
      if (h.description && metricsRegex.test(h.description)) metricCount++;
    });
  });
  (resumeData.projects || []).forEach((proj: any) => {
    if (proj.description && metricsRegex.test(proj.description)) metricCount++;
    (proj.details || []).forEach((d: any) => {
      if (d.value && metricsRegex.test(d.value)) metricCount++;
    });
  });

  // Track strategic completed action keywords
  let completionCount = 0;
  const closureRegex = /completed|shipped|delivered|streamlined|architected|orchestrated|engineered|mitigated/i;
  (resumeData.experience || []).forEach((exp: any) => {
    if (exp.role && closureRegex.test(exp.role)) completionCount++;
    (exp.highlights || []).forEach((h: any) => {
      if (h.title && closureRegex.test(h.title)) completionCount++;
      if (h.description && closureRegex.test(h.description)) completionCount++;
    });
  });

  const summaryText = Array.isArray(resumeData.summary) ? resumeData.summary.join(' ') : (resumeData.summary || '');
  const summaryLength = summaryText.length;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    if (score >= 70) return 'text-amber-300 border-amber-500/30 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/5';
  };

  const getSeverityBadgeVariant = (severity: string): 'danger' | 'warning' | 'info' => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className="flex flex-col pb-16 font-sans text-left">
      {/* COGNITIVE SUB-TABS (STICKY AT TOP) */}
      {!analyzing && analysisResult && (
        <div className="sticky top-0 z-30 bg-ds-container/95 backdrop-blur-md pt-3 pb-2.5 px-4 mb-2 mt-0 border-b border-ds-border">
          <div role="tablist" aria-label="Cognitive Analysis Views" className="flex bg-ds-panel p-1 rounded-ds-md border border-ds-border shadow-ds-sm gap-1">
            <button
              role="tab"
              aria-selected={activeSubTab === 'overview'}
              onClick={() => setActiveSubTab('overview')}
              className={`flex-1 py-1.5 px-2 rounded-ds-sm text-[10px] uppercase font-bold tracking-wider transition-all duration-200 cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/40 ${
                activeSubTab === 'overview' ? 'bg-ds-primary text-white shadow-ds-sm' : 'bg-transparent text-ds-text-medium hover:text-ds-text-high hover:bg-ds-hover'
              }`}
            >
              Overview
            </button>
            <button
              role="tab"
              aria-selected={activeSubTab === 'laws'}
              onClick={() => setActiveSubTab('laws')}
              className={`flex-1 py-1.5 px-2 rounded-ds-sm text-[10px] uppercase font-bold tracking-wider transition-all duration-200 cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/40 ${
                activeSubTab === 'laws' ? 'bg-ds-primary text-white shadow-ds-sm' : 'bg-transparent text-ds-text-medium hover:text-ds-text-high hover:bg-ds-hover'
              }`}
            >
              UX Laws
            </button>
            <button
              role="tab"
              aria-selected={activeSubTab === 'frames'}
              onClick={() => setActiveSubTab('frames')}
              className={`flex-1 py-1.5 px-2 rounded-ds-sm text-[10px] uppercase font-bold tracking-wider transition-all duration-200 cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/40 ${
                activeSubTab === 'frames' ? 'bg-ds-primary text-white shadow-ds-sm' : 'bg-transparent text-ds-text-medium hover:text-ds-text-high hover:bg-ds-hover'
              }`}
            >
              Models
            </button>
          </div>
        </div>
      )}

      {/* OFFLINE RESILIENCE INTEROP WARNING */}
      {isOffline && (
        <div className="mx-4 my-2.5 p-3 bg-ds-danger/10 border border-ds-danger/30 rounded-ds-md text-ds-danger text-xs flex gap-3 leading-relaxed animate-fade-in relative overflow-hidden">
          <WifiOff className="w-4.5 h-4.5 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <strong className="font-bold block uppercase tracking-wider text-[10px]">Offline Mode Active</strong>
            <p className="text-ds-text-medium">
              Offline environment detected. Using local heuristic AI model. Productivity maintained!
            </p>
          </div>
        </div>
      )}

      {/* WARNING/METRIC MESSAGES */}
      {analyzerWarning && !isOffline && (
        <div className="mx-4 my-2.5 p-3 bg-ds-warning/10 border border-ds-warning/30 rounded-ds-md text-ds-warning text-xs flex gap-3 leading-relaxed">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">System Note:</strong>
            <p className="mt-0.5 text-ds-text-high opacity-90">{analyzerWarning}</p>
          </div>
        </div>
      )}

      {/* BODY CONTENT CONTAINER */}
      <div className="px-4 py-3 space-y-4">
        
        {/* RUNNING ANALYSIS STATE */}
        {analyzing && (
          <div className="bg-ds-panel rounded-ds-lg p-6 border border-ds-border text-center space-y-3 animate-pulse shadow-ds-sm">
            <Brain className="w-9 h-9 mx-auto text-ds-primary animate-spin" />
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold text-ds-text-high uppercase tracking-wider">Evaluating visual load...</h5>
              <p className="text-xs text-ds-text-muted">Mapping text density, readability, and focal points.</p>
            </div>
          </div>
        )}

        {/* NOT YET ANALYZED STATE */}
        {!analyzing && !analysisResult && (
          <div className="bg-ds-panel rounded-ds-lg p-6 border border-ds-border text-center space-y-4 shadow-ds-sm">
            <div className="w-11 h-11 rounded-full bg-ds-primary/10 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5 text-ds-primary" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ds-text-high">Resume UX Audit</h4>
              <p className="text-xs text-ds-text-muted leading-relaxed">
                Scan layout structure, measure density, and get AI recommendations to sound more executive.
              </p>
            </div>
            <Button
              onClick={runCognitiveAnalysis}
              fullWidth
              size="md"
              className="gap-2 shadow-ds-glow"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Run UX Audit</span>
            </Button>
          </div>
        )}

        {/* SUCCESSFUL ANALYSIS DASHBOARD */}
        {!analyzing && analysisResult && (
          <div className="space-y-4 animate-fade-in text-left">

            {/* TAB CONTENT: OVERVIEW */}
            {activeSubTab === 'overview' && (
              <div className="space-y-4 animate-fade-in font-sans">
                
                {/* OVERALL COGNITIVE SCORE */}
                <div className="bg-ds-panel p-4 rounded-ds-lg border border-ds-border space-y-4 shadow-ds-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-ds-border pb-3.5">
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase text-ds-primary tracking-wider block">Readability Score (UX)</span>
                      <p className="text-xs text-ds-text-medium leading-relaxed font-sans">
                        {analysisResult.summaryFeedback || "Cognitive scanning assessments completed. Implement recommendations below to maximize structural and linguistic impact."}
                      </p>
                    </div>
                    
                    <div className="shrink-0 flex flex-col items-center justify-center bg-ds-container w-16 h-16 rounded-full border-2 border-ds-primary shadow-ds-glow">
                      <span className="text-xl font-bold font-mono text-ds-text-high leading-none">
                        {analysisResult.overallScore || 0}
                      </span>
                      <span className="text-[8px] text-ds-primary uppercase tracking-widest font-bold mt-0.5">SCORE</span>
                    </div>
                  </div>

                  {/* SPLIT COGNITIVE METRICS PROGRESS BARS */}
                  <div className="space-y-3.5">
                    {/* 1. Cognitive Load Score */}
                    {analysisResult.cognitiveScore !== undefined && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-ds-text-high font-medium flex items-center gap-1.5 text-xs">
                            <Layers className="w-3.5 h-3.5 text-ds-primary" /> Information Chunking (Miller's Law)
                          </span>
                          <span className="font-mono font-bold text-ds-text-high text-xs bg-ds-container px-2 py-0.5 rounded-ds-sm border border-ds-border">{analysisResult.cognitiveScore}/100</span>
                        </div>
                        <div className="w-full bg-ds-container h-2 rounded-full overflow-hidden border border-ds-border">
                          <div 
                            className="bg-ds-primary h-full rounded-full transition-all duration-300" 
                            style={{ width: `${analysisResult.cognitiveScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 2. Scanning Score */}
                    {analysisResult.scanningScore !== undefined && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-ds-text-high font-medium flex items-center gap-1.5 text-xs">
                            <Eye className="w-3.5 h-3.5 text-ds-secondary" /> Scanning Patterns (6-Second Design Flow)
                          </span>
                          <span className="font-mono font-bold text-ds-text-high text-xs bg-ds-container px-2 py-0.5 rounded-ds-sm border border-ds-border">{analysisResult.scanningScore}/100</span>
                        </div>
                        <div className="w-full bg-ds-container h-2 rounded-full overflow-hidden border border-ds-border">
                          <div 
                            className="bg-ds-secondary h-full rounded-full transition-all duration-300" 
                            style={{ width: `${analysisResult.scanningScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 3. KPI Density Score */}
                    {analysisResult.kpiScore !== undefined && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-ds-text-high font-medium flex items-center gap-1.5 text-xs">
                            <Activity className="w-3.5 h-3.5 text-ds-success" /> Numeric Impact Density (Fitts' Target Focus)
                          </span>
                          <span className="font-mono font-bold text-ds-text-high text-xs bg-ds-container px-2 py-0.5 rounded-ds-sm border border-ds-border">{analysisResult.kpiScore}/100</span>
                        </div>
                        <div className="w-full bg-ds-container h-2 rounded-full overflow-hidden border border-ds-border">
                          <div 
                            className="bg-ds-success h-full rounded-full transition-all duration-300" 
                            style={{ width: `${analysisResult.kpiScore}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RE-AUDIT BUTTON */}
                  <div className="pt-2 border-t border-ds-border">
                    <Button
                      onClick={runCognitiveAnalysis}
                      variant="secondary"
                      fullWidth
                      size="sm"
                      className="gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-ds-primary" />
                      <span>Re-Analyze Layout &amp; Content</span>
                    </Button>
                  </div>
                </div>

                {/* EYE-TRACKING SCAN HOTSPOTS */}
                {analysisResult.scanningHotspots && analysisResult.scanningHotspots.length > 0 && (
                  <div className="space-y-3 bg-ds-panel p-4 rounded-ds-lg border border-ds-border shadow-ds-sm">
                    <div className="flex items-center justify-between border-b border-ds-border pb-2.5">
                      <h4 className="text-xs font-bold text-ds-text-high uppercase tracking-wider flex items-center gap-2">
                        <Eye className="w-4 h-4 text-ds-secondary" />
                        <span>Visual Hotspot Triggers (Tobii F-Scan)</span>
                      </h4>
                      <button 
                        onClick={() => setShowHotspotInfo(!showHotspotInfo)}
                        className="text-ds-text-muted hover:text-ds-text-high hover:bg-ds-hover rounded-ds-sm p-1 transition-colors cursor-pointer"
                        title="Explain eye-tracking meaning"
                        aria-label="Explain eye-tracking meaning"
                        aria-expanded={showHotspotInfo}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </div>

                    {showHotspotInfo && (
                      <div className="bg-ds-container border border-ds-secondary/30 p-3 rounded-ds-md text-xs text-ds-text-high space-y-1.5 leading-relaxed font-sans">
                        <strong className="font-bold text-ds-secondary flex items-center gap-1">✨ How Recruiters Web-Scan:</strong>
                        <p className="text-ds-text-muted">
                          According to eye-tracking research, recruiters scan resumes in an <strong className="text-ds-text-high">F-shaped pattern</strong> in about 6 seconds, locking gaze only on prominent anchors.
                        </p>
                        <p className="text-ds-text-muted">
                          <strong className="text-ds-secondary font-semibold">• Active Anchor Focus:</strong> If these hotspots exhibit low-status terms, use the Models tab to automatically upgrade passive statements.
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analysisResult.scanningHotspots.map((hotspot: string, idx: number) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 bg-ds-container text-ds-secondary border border-ds-secondary/30 rounded-ds-md text-xs font-mono flex items-center gap-1.5 font-bold shadow-ds-sm"
                        >
                          <span className="w-1.5 h-1.5 bg-ds-secondary rounded-full animate-pulse" />
                          <span>{hotspot}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: LAWS */}
            {activeSubTab === 'laws' && (
              <div className="space-y-4 animate-fade-in text-left font-sans">
                {/* CURRENT DIAGNOSTICS FINDINGS */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ds-text-muted block px-1">Friction Points &amp; Corrective Actions</span>
                  
                  {(!analysisResult.diagnostics || analysisResult.diagnostics.length === 0) ? (
                    <div className="bg-ds-panel p-5 border border-ds-border rounded-ds-lg text-center text-ds-text-muted">
                      <CheckCircle2 className="w-7 h-7 text-ds-success mx-auto opacity-70 mb-1" />
                      <p className="text-xs">No formatting delays or cognitive layout friction has been detected.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {analysisResult.diagnostics.map((diag: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="bg-ds-panel rounded-ds-lg border border-ds-border p-4 space-y-3 shadow-ds-sm text-left"
                        >
                          {/* Section Header */}
                          <div className="flex items-center justify-between border-b border-ds-border pb-2.5">
                            <span className="text-xs font-bold text-ds-primary uppercase tracking-wider leading-none">
                              Section: {diag.section || "Overall Profile"}
                            </span>
                            <Badge variant={getSeverityBadgeVariant(diag.severity)} size="sm">
                              {diag.severity === 'high' ? 'High Friction' : 'Aesthetic Fix'}
                            </Badge>
                          </div>
                          
                          {/* Rule Problem */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-ds-text-muted uppercase tracking-wider block">Friction Point:</span>
                            <p className="text-xs text-ds-text-high font-medium leading-relaxed font-sans">{diag.finding}</p>
                          </div>

                          {/* Standard Scientific Basis explanation */}
                          <div className="text-xs text-ds-secondary bg-ds-container px-3 py-2 rounded-ds-md flex items-start gap-2 border border-ds-border font-sans leading-relaxed">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-ds-secondary" />
                            <div>
                              <span className="font-bold block text-[10px] uppercase tracking-wider mb-0.5">Psychological Basis:</span>
                              <span className="opacity-90">{diag.psychologicalBasis || "Human UI Processing Laws"}</span>
                            </div>
                          </div>

                          {/* Action Plan */}
                          <div className="text-ds-success bg-ds-container p-3 rounded-ds-md border border-ds-border text-xs leading-relaxed">
                            <strong className="font-bold block text-[10px] uppercase tracking-wider mb-0.5 text-ds-success">Actionable Fix:</strong>
                            <p className="font-sans leading-relaxed text-ds-text-high">{diag.suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: FRAMES */}
            {activeSubTab === 'frames' && (
              <div className="space-y-4 animate-fade-in font-sans">
                {(!analysisResult.rewrites || analysisResult.rewrites.length === 0) ? (
                  <div className="bg-ds-panel p-5 border border-ds-border rounded-ds-lg text-center text-ds-text-muted space-y-1">
                    <CheckCircle2 className="w-7 h-7 text-ds-success mx-auto opacity-70" />
                    <h5 className="text-xs font-bold text-ds-text-high uppercase tracking-wider">All Statements Elevated</h5>
                    <p className="text-xs">No low-status or task-based loops detected.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analysisResult.rewrites.map((rw: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="bg-ds-panel rounded-ds-lg p-4 border border-ds-border space-y-3 relative overflow-hidden shadow-ds-sm text-left"
                      >
                        {/* Rewrite card header */}
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider border-b border-ds-border pb-2.5">
                          <Badge variant="neutral" size="sm">
                            {rw.where || "Job / Role Impact"}
                          </Badge>
                          <Badge variant="success" size="sm">
                            Semantic Elevation
                          </Badge>
                        </div>
                        
                        {/* Before / After box */}
                        <div className="space-y-2.5 text-xs leading-relaxed">
                          {/* Original */}
                          <div className="text-ds-danger bg-ds-container p-3 rounded-ds-md border border-ds-danger/20 leading-relaxed">
                            <span className="block text-[9px] uppercase tracking-wider font-bold mb-0.5">Before (Task-based):</span>
                            <p className="line-through italic opacity-75 font-sans">{rw.original}</p>
                          </div>
                          
                          {/* Recommended Rewrite */}
                          <div className="text-ds-success bg-ds-container p-3 rounded-ds-md border border-ds-success/20 leading-relaxed font-semibold">
                            <span className="block text-[9px] uppercase tracking-wider font-bold mb-0.5">After (Value-driven):</span>
                            <p className="font-sans font-bold leading-relaxed text-ds-text-high">{rw.replacement}</p>
                          </div>
                        </div>

                        {/* Action trigger footer */}
                        <div className="pt-2 flex items-center justify-between gap-3 border-t border-ds-border">
                          <div className="text-xs text-ds-text-muted leading-relaxed pr-1 font-sans flex-1">
                            <strong className="text-ds-primary font-bold">Value: </strong> {rw.benefit}
                          </div>
                          <Button
                            onClick={() => handleApplyRewrite(rw.original, rw.replacement)}
                            size="sm"
                            className="gap-1.5 shrink-0"
                          >
                            <span>Apply Fix</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

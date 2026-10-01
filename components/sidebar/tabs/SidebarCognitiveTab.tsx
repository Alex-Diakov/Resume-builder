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
import { ResumeData, CognitiveAnalysisResult } from '../../../types';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

interface SidebarCognitiveTabProps {
  resumeData: ResumeData;
  onChangeData: (data: ResumeData) => void;
  analysisResult: CognitiveAnalysisResult | null;
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
    <div className="flex flex-col pb-20 font-sans text-left">
      {/* COGNITIVE SUB-TABS (STICKY AT TOP) */}
      {!analyzing && analysisResult && (
        <div className="sticky top-0 z-30 bg-md-surface-container/95 backdrop-blur-md pt-3.5 pb-3 px-5 mb-2 mt-0 border-b border-md-outline-variant/30">
          <div role="tablist" aria-label="Cognitive Analysis Views" className="flex bg-md-surface-container-low p-1 rounded-md-md border border-md-outline-variant/30 shadow-md-elevation-1 gap-1">
            <button
              role="tab"
              aria-selected={activeSubTab === 'overview'}
              onClick={() => setActiveSubTab('overview')}
              className={`flex-1 py-1.5 px-3 rounded-md-sm text-xs font-medium transition-all duration-200 cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary/40 ${
                activeSubTab === 'overview' ? 'bg-md-primary text-md-on-primary font-semibold shadow-md-elevation-1' : 'bg-transparent text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
              }`}
            >
              Overview
            </button>
            <button
              role="tab"
              aria-selected={activeSubTab === 'laws'}
              onClick={() => setActiveSubTab('laws')}
              className={`flex-1 py-1.5 px-3 rounded-md-sm text-xs font-medium transition-all duration-200 cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary/40 ${
                activeSubTab === 'laws' ? 'bg-md-primary text-md-on-primary font-semibold shadow-md-elevation-1' : 'bg-transparent text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
              }`}
            >
              UX Laws
            </button>
            <button
              role="tab"
              aria-selected={activeSubTab === 'frames'}
              onClick={() => setActiveSubTab('frames')}
              className={`flex-1 py-1.5 px-3 rounded-md-sm text-xs font-medium transition-all duration-200 cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary/40 ${
                activeSubTab === 'frames' ? 'bg-md-primary text-md-on-primary font-semibold shadow-md-elevation-1' : 'bg-transparent text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high'
              }`}
            >
              Models
            </button>
          </div>
        </div>
      )}

      {/* OFFLINE RESILIENCE INTEROP WARNING */}
      {isOffline && (
        <div className="mx-5 my-3 p-3.5 bg-md-error-container/20 border border-md-error/30 rounded-md-md text-md-on-error-container text-xs flex gap-3 leading-relaxed animate-fade-in relative overflow-hidden">
          <WifiOff className="w-5 h-5 shrink-0 mt-0.5 animate-pulse text-md-error" />
          <div className="space-y-1">
            <strong className="font-semibold block text-xs text-md-on-surface">Offline Mode Active</strong>
            <p className="text-md-on-surface-variant">
              Offline environment detected. Using local heuristic AI model. Productivity maintained!
            </p>
          </div>
        </div>
      )}

      {/* WARNING/METRIC MESSAGES */}
      {analyzerWarning && !isOffline && (
        <div className="mx-5 my-3 p-3.5 bg-md-warning-container/20 border border-md-warning/30 rounded-md-md text-md-on-warning-container text-xs flex gap-3 leading-relaxed">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-md-warning" />
          <div>
            <strong className="font-semibold text-md-on-surface">System Note:</strong>
            <p className="mt-0.5 text-md-on-surface-variant">{analyzerWarning}</p>
          </div>
        </div>
      )}

      {/* BODY CONTENT CONTAINER */}
      <div className="px-5 py-3.5 space-y-4">
        
        {/* RUNNING ANALYSIS STATE */}
        {analyzing && (
          <div className="bg-md-surface-container-low rounded-md-lg p-6 border border-md-outline-variant/30 text-center space-y-3 animate-pulse shadow-md-elevation-1">
            <Brain className="w-9 h-9 mx-auto text-md-primary animate-spin" />
            <div className="space-y-1.5">
              <h5 className="text-sm font-semibold text-md-on-surface">Evaluating visual load...</h5>
              <p className="text-xs text-md-on-surface-variant">Mapping text density, readability, and focal points.</p>
            </div>
          </div>
        )}

        {/* NOT YET ANALYZED STATE */}
        {!analyzing && !analysisResult && (
          <div className="bg-md-surface-container-low rounded-md-lg p-6 border border-md-outline-variant/30 text-center space-y-4 shadow-md-elevation-1">
            <div className="w-11 h-11 rounded-full bg-md-primary/10 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5 text-md-primary" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-md-on-surface">Resume UX Audit</h4>
              <p className="text-xs text-md-on-surface-variant leading-relaxed">
                Scan layout structure, measure density, and get AI recommendations to sound more executive.
              </p>
            </div>
            <Button
              onClick={runCognitiveAnalysis}
              fullWidth
              size="default"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4 text-md-on-primary" />
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
                <div className="bg-md-surface-container-low p-4.5 rounded-md-lg border border-md-outline-variant/30 space-y-4 shadow-md-elevation-1">
                  <div className="flex items-center justify-between gap-4 border-b border-md-outline-variant/30 pb-3.5">
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="text-xs font-semibold text-md-primary block">Readability Score (UX)</span>
                      <p className="text-xs text-md-on-surface-variant leading-relaxed font-sans">
                        {analysisResult.summaryFeedback || "Cognitive scanning assessments completed. Implement recommendations below to maximize structural and linguistic impact."}
                      </p>
                    </div>
                    
                    <div className="shrink-0 flex flex-col items-center justify-center bg-md-surface-container w-16 h-16 rounded-full border-2 border-md-primary shadow-md-elevation-1">
                      <span className="text-xl font-bold font-mono text-md-on-surface leading-none">
                        {analysisResult.overallScore || 0}
                      </span>
                      <span className="text-[10px] text-md-primary font-bold tracking-wider mt-0.5">SCORE</span>
                    </div>
                  </div>

                  {/* SPLIT COGNITIVE METRICS PROGRESS BARS */}
                  <div className="space-y-3.5">
                    {/* 1. Cognitive Load Score */}
                    {analysisResult.cognitiveScore !== undefined && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-md-on-surface font-medium flex items-center gap-2 text-xs">
                            <Layers className="w-4 h-4 text-md-primary" /> Information Chunking (Miller's Law)
                          </span>
                          <span className="font-mono font-bold text-md-on-surface text-xs bg-md-surface-container px-2 py-0.5 rounded-md-xs border border-md-outline-variant/30">{analysisResult.cognitiveScore}/100</span>
                        </div>
                        <div className="w-full bg-md-surface-container h-2 rounded-full overflow-hidden border border-md-outline-variant/30">
                          <div 
                            className="bg-md-primary h-full rounded-full transition-all duration-300" 
                            style={{ width: `${analysisResult.cognitiveScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 2. Scanning Score */}
                    {analysisResult.scanningScore !== undefined && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-md-on-surface font-medium flex items-center gap-2 text-xs">
                            <Eye className="w-4 h-4 text-md-tertiary" /> Scanning Patterns (6-Second Design Flow)
                          </span>
                          <span className="font-mono font-bold text-md-on-surface text-xs bg-md-surface-container px-2 py-0.5 rounded-md-xs border border-md-outline-variant/30">{analysisResult.scanningScore}/100</span>
                        </div>
                        <div className="w-full bg-md-surface-container h-2 rounded-full overflow-hidden border border-md-outline-variant/30">
                          <div 
                            className="bg-md-tertiary h-full rounded-full transition-all duration-300" 
                            style={{ width: `${analysisResult.scanningScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 3. KPI Density Score */}
                    {analysisResult.kpiScore !== undefined && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-md-on-surface font-medium flex items-center gap-2 text-xs">
                            <Activity className="w-4 h-4 text-md-success" /> Numeric Impact Density (Fitts' Target Focus)
                          </span>
                          <span className="font-mono font-bold text-md-on-surface text-xs bg-md-surface-container px-2 py-0.5 rounded-md-xs border border-md-outline-variant/30">{analysisResult.kpiScore}/100</span>
                        </div>
                        <div className="w-full bg-md-surface-container h-2 rounded-full overflow-hidden border border-md-outline-variant/30">
                          <div 
                            className="bg-md-success h-full rounded-full transition-all duration-300" 
                            style={{ width: `${analysisResult.kpiScore}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RE-AUDIT BUTTON */}
                  <div className="pt-2 border-t border-md-outline-variant/30">
                    <Button
                      onClick={runCognitiveAnalysis}
                      variant="secondary"
                      fullWidth
                      size="sm"
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4 text-md-primary" />
                      <span>Re-Analyze Layout &amp; Content</span>
                    </Button>
                  </div>
                </div>

                {/* EYE-TRACKING SCAN HOTSPOTS */}
                {analysisResult.scanningHotspots && analysisResult.scanningHotspots.length > 0 && (
                  <div className="space-y-3 bg-md-surface-container-low p-4.5 rounded-md-lg border border-md-outline-variant/30 shadow-md-elevation-1">
                    <div className="flex items-center justify-between border-b border-md-outline-variant/30 pb-2.5">
                      <h4 className="text-xs font-semibold text-md-on-surface flex items-center gap-2">
                        <Eye className="w-4 h-4 text-md-tertiary" />
                        <span>Visual Hotspot Triggers (Tobii F-Scan)</span>
                      </h4>
                      <button 
                        onClick={() => setShowHotspotInfo(!showHotspotInfo)}
                        className="text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container rounded-md-sm p-1.5 transition-colors cursor-pointer"
                        title="Explain eye-tracking meaning"
                        aria-label="Explain eye-tracking meaning"
                        aria-expanded={showHotspotInfo}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </div>

                    {showHotspotInfo && (
                      <div className="bg-md-surface-container border border-md-outline-variant/30 p-3.5 rounded-md-md text-xs text-md-on-surface space-y-1.5 leading-relaxed font-sans">
                        <strong className="font-semibold text-md-tertiary flex items-center gap-1.5">✨ How Recruiters Web-Scan:</strong>
                        <p className="text-md-on-surface-variant">
                          According to eye-tracking research, recruiters scan resumes in an <strong className="text-md-on-surface">F-shaped pattern</strong> in about 6 seconds, locking gaze only on prominent anchors.
                        </p>
                        <p className="text-md-on-surface-variant">
                          <strong className="text-md-tertiary font-semibold">• Active Anchor Focus:</strong> If these hotspots exhibit low-status terms, use the Models tab to automatically upgrade passive statements.
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      {analysisResult.scanningHotspots.map((hotspot: string, idx: number) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 bg-md-surface-container text-md-on-surface border border-md-outline-variant/30 rounded-md-sm text-xs font-mono flex items-center gap-1.5 font-medium"
                        >
                          <span className="w-1.5 h-1.5 bg-md-tertiary rounded-full animate-pulse" />
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
                  <span className="text-xs font-semibold text-md-on-surface-variant block px-1">Friction Points &amp; Corrective Actions</span>
                  
                  {(!analysisResult.diagnostics || analysisResult.diagnostics.length === 0) ? (
                    <div className="bg-md-surface-container-low p-5 border border-md-outline-variant/30 rounded-md-lg text-center text-md-on-surface-variant">
                      <CheckCircle2 className="w-7 h-7 text-md-success mx-auto opacity-70 mb-1" />
                      <p className="text-xs">No formatting delays or cognitive layout friction has been detected.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {analysisResult.diagnostics.map((diag: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="bg-md-surface-container-low rounded-md-lg border border-md-outline-variant/30 p-4.5 space-y-3 shadow-md-elevation-1 text-left"
                        >
                          {/* Section Header */}
                          <div className="flex items-center justify-between border-b border-md-outline-variant/30 pb-2.5">
                            <span className="text-xs font-semibold text-md-primary leading-none">
                              Section: {diag.section || "Overall Profile"}
                            </span>
                            <Badge variant={getSeverityBadgeVariant(diag.severity)} size="sm">
                              {diag.severity === 'high' ? 'High Friction' : 'Aesthetic Fix'}
                            </Badge>
                          </div>
                          
                          {/* Rule Problem */}
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-md-on-surface-variant block">Friction Point:</span>
                            <p className="text-xs text-md-on-surface font-medium leading-relaxed font-sans">{diag.finding}</p>
                          </div>

                          {/* Standard Scientific Basis explanation */}
                          <div className="text-xs text-md-on-surface bg-md-surface-container px-3.5 py-2.5 rounded-md-md flex items-start gap-2.5 border border-md-outline-variant/30 font-sans leading-relaxed">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-md-tertiary" />
                            <div>
                              <span className="font-semibold block text-xs text-md-tertiary mb-0.5">Psychological Basis:</span>
                              <span className="text-md-on-surface-variant">{diag.psychologicalBasis || "Human UI Processing Laws"}</span>
                            </div>
                          </div>

                          {/* Action Plan */}
                          <div className="text-md-on-surface bg-md-surface-container p-3.5 rounded-md-md border border-md-outline-variant/30 text-xs leading-relaxed">
                            <strong className="font-semibold block text-xs mb-0.5 text-md-success">Actionable Fix:</strong>
                            <p className="font-sans leading-relaxed text-md-on-surface">{diag.suggestion}</p>
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
                  <div className="bg-md-surface-container-low p-5 border border-md-outline-variant/30 rounded-md-lg text-center text-md-on-surface-variant space-y-1">
                    <CheckCircle2 className="w-7 h-7 text-md-success mx-auto opacity-70" />
                    <h5 className="text-sm font-semibold text-md-on-surface">All Statements Elevated</h5>
                    <p className="text-xs">No low-status or task-based loops detected.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analysisResult.rewrites.map((rw: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="bg-md-surface-container-low rounded-md-lg p-4.5 border border-md-outline-variant/30 space-y-3 relative overflow-hidden shadow-md-elevation-1 text-left"
                      >
                        {/* Rewrite card header */}
                        <div className="flex items-center justify-between text-xs border-b border-md-outline-variant/30 pb-2.5">
                          <Badge variant="surface" size="sm">
                            {rw.where || "Job / Role Impact"}
                          </Badge>
                          <Badge variant="success" size="sm">
                            Semantic Elevation
                          </Badge>
                        </div>
                        
                        {/* Before / After box */}
                        <div className="space-y-2.5 text-xs leading-relaxed">
                          {/* Original */}
                          <div className="bg-md-surface-container p-3 rounded-md-md border border-md-error/30 text-xs leading-relaxed">
                            <span className="block text-xs font-semibold text-md-error mb-0.5">Before (Task-based):</span>
                            <p className="line-through italic text-md-on-surface-variant font-sans">{rw.original}</p>
                          </div>
                          
                          {/* Recommended Rewrite */}
                          <div className="bg-md-surface-container p-3 rounded-md-md border border-md-success/30 text-xs leading-relaxed font-semibold">
                            <span className="block text-xs font-semibold text-md-success mb-0.5">After (Value-driven):</span>
                            <p className="font-sans font-semibold leading-relaxed text-md-on-surface">{rw.replacement}</p>
                          </div>
                        </div>

                        {/* Action trigger footer */}
                        <div className="pt-2.5 flex items-center justify-between gap-3 border-t border-md-outline-variant/30">
                          <div className="text-xs text-md-on-surface-variant leading-relaxed pr-1 font-sans flex-1">
                            <strong className="text-md-primary font-semibold">Value: </strong> {rw.benefit}
                          </div>
                          <Button
                            onClick={() => handleApplyRewrite(rw.original, rw.replacement)}
                            size="sm"
                            className="gap-2 shrink-0"
                          >
                            <span>Apply Fix</span>
                            <ArrowRight className="w-4 h-4 text-md-on-primary" />
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

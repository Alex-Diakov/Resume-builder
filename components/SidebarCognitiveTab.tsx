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
import { ResumeData } from '../types';

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

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-rose-500/20 text-rose-200 border border-rose-500/50 font-bold';
      case 'medium':
        return 'bg-amber-500/20 text-amber-200 border border-amber-500/50 font-bold';
      default:
        return 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 font-bold';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#110f15] pb-16 font-sans text-left">

      {/* OFFLINE RESILIENCE INTEROP WARNING */}
      {isOffline && (
        <div className="mx-4.5 my-3.5 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-100 text-xs flex gap-3 leading-relaxed animate-fade-in relative overflow-hidden">
          <WifiOff className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <strong className="font-bold text-rose-200 block uppercase tracking-wider text-[10px]">Active Networking Offline</strong>
            <p className="text-ds-text-medium">
              Offline environment detected. Relax — we've safely engaged our built-in local heuristic AI model, maintaining 100% productivity with zero downtime!
            </p>
          </div>
        </div>
      )}

      {/* WARNING/METRIC MESSAGES */}
      {analyzerWarning && !isOffline && (
        <div className="m-4.5 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-100 text-xs flex gap-3 leading-relaxed">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-amber-200">System Note:</strong>
            <p className="mt-1 text-[#e1dbec]">{analyzerWarning}</p>
          </div>
        </div>
      )}

      {/* BODY CONTENT CONTAINER */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        
        {/* RUNNING ANALYSIS STATE */}
        {analyzing && (
          <div className="bg-[#1a1820] rounded-2xl p-7 border border-[#2d2a33] text-center space-y-4 animate-pulse shadow-md">
            <Brain className="w-10 h-10 mx-auto text-purple-400 animate-spin" />
            <div className="space-y-2">
              <h5 className="text-sm font-bold text-[#f3edff] uppercase tracking-wider">Evaluating reading gravity ...</h5>
              <p className="text-xs text-[#d1cad8]">Mapping visual load, cognitive processing limits, and scanning anchors.</p>
            </div>
          </div>
        )}

        {/* NOT YET ANALYZED STATE */}
        {!analyzing && !analysisResult && (
          <div className="bg-[#1e1b24] rounded-2xl p-6 border border-[#2d2a33] text-center space-y-5 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div className="space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-ds-text-high">Audit Reading Friction</h4>
              <p className="text-xs text-ds-text-medium leading-relaxed">
                Scan your layout structure, measure information density, spot heat-zones, and unlock 1-click semantic rewriting cards designed for C-level value framing.
              </p>
            </div>
            <button
              onClick={runCognitiveAnalysis}
              className="w-full py-2.5 bg-ds-primary hover:bg-ds-primary-hover text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-md hover:shadow-glow active:scale-95 flex items-center justify-center gap-2 border border-ds-border"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Perform Cognitive Scan</span>
            </button>
          </div>
        )}

        {/* SUCCESSFUL ANALYSIS DASHBOARD */}
        {!analyzing && analysisResult && (
          <div className="space-y-5 animate-fade-in text-left">
            
            {/* COGNITIVE SUB-TABS WITH GLIDE SLIDER EFFECT */}
            <div className="flex bg-ds-container p-1.5 rounded-xl border border-ds-border gap-1 shrink-0 relative">
              <button
                onClick={() => setActiveSubTab('overview')}
                className={`flex-grow relative py-2.5 px-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 z-10 ${
                  activeSubTab === 'overview' ? 'text-white' : 'text-ds-text-medium hover:text-ds-text-high'
                }`}
              >
                {activeSubTab === 'overview' && (
                  <motion.div 
                    layoutId="activeSubTabBg"
                    className="absolute inset-0 bg-ds-primary rounded-xl -z-10 shadow-sm shadow-glow border border-ds-border"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <Eye className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveSubTab('laws')}
                className={`flex-grow relative py-2.5 px-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 z-10 ${
                  activeSubTab === 'laws' ? 'text-white' : 'text-ds-text-medium hover:text-ds-text-high'
                }`}
              >
                {activeSubTab === 'laws' && (
                  <motion.div 
                    layoutId="activeSubTabBg"
                    className="absolute inset-0 bg-ds-primary rounded-xl -z-10 shadow-sm shadow-glow border border-ds-border"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <BookOpen className="w-4 h-4" />
                <span>Laws</span>
              </button>

              <button
                onClick={() => setActiveSubTab('frames')}
                className={`flex-grow relative py-2.5 px-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 z-10 ${
                  activeSubTab === 'frames' ? 'text-white' : 'text-ds-text-medium hover:text-ds-text-high'
                }`}
              >
                {activeSubTab === 'frames' && (
                  <motion.div 
                    layoutId="activeSubTabBg"
                    className="absolute inset-0 bg-ds-primary rounded-xl -z-10 shadow-sm shadow-glow border border-ds-border"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <Zap className="w-4 h-4" />
                <span>Frames</span>
              </button>
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeSubTab === 'overview' && (
              <div className="space-y-5 animate-fade-in font-sans">
                
                {/* OVERALL COGNITIVE SCORE */}
                <div className="bg-ds-panel p-5 rounded-2xl border border-ds-border space-y-5 shadow-lg">
                  <div className="flex items-center justify-between gap-5 border-b border-ds-border/50 pb-4">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <span className="text-[10px] font-black uppercase text-ds-primary tracking-wider block">Recruiter Reading Gravity</span>
                      <p className="text-xs text-ds-text-medium leading-relaxed font-sans">
                        {analysisResult.summaryFeedback || "Cognitive scanning assessments completed. Implement recommendations below to maximize structural and linguistic impact."}
                      </p>
                    </div>
                    
                    <div className="shrink-0 flex flex-col items-center justify-center bg-[#16141a] w-20 h-20 rounded-full border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                      <span className="text-2xl font-black font-mono text-white leading-none">
                        {analysisResult.overallScore || 0}
                      </span>
                      <span className="text-[9px] text-purple-300 uppercase tracking-widest font-black mt-1">SCORE</span>
                    </div>
                  </div>

                  {/* SPLIT COGNITIVE METRICS PROGRESS BARS */}
                  <div className="space-y-4">
                    {/* 1. Cognitive Load Score */}
                    {analysisResult.cognitiveScore !== undefined && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#e1dbec] font-semibold flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-purple-400" /> Information Chunking (Miller's Law)
                          </span>
                          <span className="font-mono font-bold text-white text-xs bg-[#16141a] px-2 py-0.5 rounded border border-[#2d2a33]">{analysisResult.cognitiveScore}/100</span>
                        </div>
                        <div className="w-full bg-[#121015] h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-purple-500 h-full rounded-full transition-all duration-300" 
                            style={{ width: `${analysisResult.cognitiveScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 2. Scanning Score */}
                    {analysisResult.scanningScore !== undefined && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#e1dbec] font-semibold flex items-center gap-1.5">
                            <Eye className="w-4 h-4 text-cyan-400" /> Scanning Patterns (6-Second Design Flow)
                          </span>
                          <span className="font-mono font-bold text-white text-xs bg-[#16141a] px-2 py-0.5 rounded border border-[#2d2a33]">{analysisResult.scanningScore}/100</span>
                        </div>
                        <div className="w-full bg-[#121015] h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-cyan-400 h-full rounded-full transition-all duration-300" 
                            style={{ width: `${analysisResult.scanningScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 3. KPI Density Score */}
                    {analysisResult.kpiScore !== undefined && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#e1dbec] font-semibold flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-emerald-400" /> Numeric Impact Density (Fitts' Target Focus)
                          </span>
                          <span className="font-mono font-bold text-white text-xs bg-[#16141a] px-2 py-0.5 rounded border border-[#2d2a33]">{analysisResult.kpiScore}/100</span>
                        </div>
                        <div className="w-full bg-[#121015] h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full rounded-full transition-all duration-300" 
                            style={{ width: `${analysisResult.kpiScore}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RE-AUDIT BUTTON */}
                  <div className="pt-2 border-t border-[#2d2a33]/40">
                    <button
                      onClick={runCognitiveAnalysis}
                      className="w-full py-2.5 bg-ds-active hover:bg-ds-hover border border-ds-border text-ds-text-high rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                    >
                      <RefreshCw className="w-4 h-4 text-ds-primary animate-pulse" />
                      <span>Re-Analyze Layout & Content</span>
                    </button>
                  </div>
                </div>

                {/* EYE-TRACKING SCAN HOTSPOTS */}
                {analysisResult.scanningHotspots && analysisResult.scanningHotspots.length > 0 && (
                  <div className="space-y-3.5 bg-ds-panel p-5 rounded-2xl border border-ds-border shadow-lg">
                    <div className="flex items-center justify-between border-b border-ds-border pb-2.5">
                      <h4 className="text-xs font-bold text-ds-text-high uppercase tracking-wider flex items-center gap-2">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        <span>Visual Hotspot Triggers (Tobii F-Scan Heat)</span>
                      </h4>
                      <button 
                        onClick={() => setShowHotspotInfo(!showHotspotInfo)}
                        className="text-ds-text-muted hover:text-ds-text-high hover:bg-ds-hover rounded-xl p-1 transition-colors"
                        title="Explain eye-tracking meaning"
                      >
                        <HelpCircle className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    {showHotspotInfo && (
                      <div className="bg-[#121015] border border-cyan-800/30 p-3.5 rounded-xl text-xs text-cyan-100 space-y-2 leading-relaxed font-sans">
                        <strong className="font-bold text-cyan-300 flex items-center gap-1">✨ How Recruiters Web-Scan:</strong>
                        <p>
                          According to professional eye-tracking researches, recruiters scan resumes under an <strong className="text-white">F-shaped pattern</strong> in about 6 seconds, locking gaze only on prominent anchors.
                        </p>
                        <p className="opacity-90">
                          <strong className="text-cyan-300 font-semibold">• Active Anchor Focus:</strong> If these hotspots exhibit low-status terms, use the <strong className="text-white font-bold">Frames Tab</strong> to automatically upgrade passive experience elements into systemic value statements.
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      {analysisResult.scanningHotspots.map((hotspot: string, idx: number) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1.5 bg-[#121015] text-cyan-200 border border-cyan-500/30 rounded-xl text-xs font-mono flex items-center gap-2 font-bold shadow-sm"
                        >
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#9d8ea9] block px-1">Friction Points & Corrective Actions</span>
                  
                  {(!analysisResult.diagnostics || analysisResult.diagnostics.length === 0) ? (
                    <div className="bg-[#1a1820] p-5 border border-[#2d2a33] rounded-2xl text-center text-[#cac4d0]">
                      <CheckCircle2 className="w-8 h-8 text-[#b2f293] mx-auto opacity-70 mb-1" />
                      <p className="text-xs">No formatting delays or cognitive layout friction has been detected.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analysisResult.diagnostics.map((diag: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="bg-[#1a1820] rounded-2xl border border-[#2d2a33] p-5 space-y-4 shadow-md text-left"
                        >
                          {/* Section Header */}
                          <div className="flex items-center justify-between border-b border-[#2d2a33]/50 pb-3">
                            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider leading-none">
                              Section: {diag.section || "Overall Profile"}
                            </span>
                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider leading-none ${getSeverityBadgeClass(diag.severity)}`}>
                              {diag.severity === 'high' ? 'High Friction' : 'Aesthetic Fix'}
                            </span>
                          </div>
                          
                          {/* Rule Problem */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-[#b4acbe] uppercase tracking-wider block">Friction Point:</span>
                            <p className="text-sm text-white font-semibold leading-relaxed font-sans">{diag.finding}</p>
                          </div>

                          {/* Standard Scientific Basis explanation */}
                          <div className="text-xs text-cyan-200 bg-[#121015]/80 px-3 py-2.5 rounded-xl flex items-start gap-2.5 border border-cyan-800/30 font-sans leading-relaxed">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                            <div>
                              <span className="font-bold block text-cyan-300 text-[10px] uppercase tracking-wider mb-0.5">Psychological Foundation:</span>
                              <span className="opacity-95">{diag.psychologicalBasis || "Human UI Processing Law"}</span>
                            </div>
                          </div>

                          {/* Action Plan */}
                          <div className="text-emerald-200 bg-[#121015]/80 p-3.5 rounded-xl border border-emerald-800/30 text-xs leading-relaxed">
                            <strong className="font-bold block text-[10px] uppercase tracking-wider mb-1 text-emerald-400">Actionable Restructure Fix:</strong>
                            <p className="font-sans leading-relaxed">{diag.suggestion}</p>
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
                  <div className="bg-[#1a1820] p-5 border border-[#2d2a33] rounded-2xl text-center text-[#cac4d0] space-y-1">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
                    <h5 className="text-xs font-black text-[#eaddff] uppercase tracking-wider">All Statements Elevated</h5>
                    <p className="text-xs">No low-status or task-based loops detected.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysisResult.rewrites.map((rw: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="bg-[#1a1820] rounded-2xl p-5 border border-[#2d2a33] space-y-4 relative overflow-hidden group hover:border-[#4d3d63] transition-all shadow-md text-left"
                      >
                        {/* Rewrite card header */}
                        <div className="flex items-center justify-between text-[10px] text-[#cac4d0]/60 uppercase tracking-wider border-b border-[#2d2a33]/50 pb-3">
                          <span className="font-bold text-purple-300 bg-purple-500/15 px-2.5 py-1 rounded-md border border-purple-500/20">
                            {rw.where || "Job / Role Impact"}
                          </span>
                          <span className="font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-md border border-emerald-500/20">Semantic Elevation</span>
                        </div>
                        
                        {/* Before / After box */}
                        <div className="space-y-3.5 text-xs leading-relaxed">
                          {/* Original */}
                          <div className="text-rose-200 bg-[#1d1417]/80 p-3.5 rounded-xl border border-rose-950/30 leading-relaxed">
                            <span className="block text-[9px] uppercase tracking-wider font-extrabold text-rose-300 mb-1">Junior / Subordinate Task-Description:</span>
                            <p className="line-through italic opacity-75 font-sans">{rw.original}</p>
                          </div>
                          
                          {/* Recommended Rewrite */}
                          <div className="text-emerald-100 bg-[#121815]/80 p-3.5 rounded-xl border border-emerald-950/30 leading-relaxed font-semibold">
                            <span className="block text-[9px] uppercase tracking-wider font-extrabold text-emerald-300 mb-1">C-Level Value-Driven Action Formula:</span>
                            <p className="font-sans font-bold leading-relaxed">{rw.replacement}</p>
                          </div>
                        </div>

                        {/* Action trigger footer */}
                        <div className="pt-3 flex items-center justify-between gap-4 border-t border-ds-border/60">
                          <div className="text-xs text-ds-text-medium leading-relaxed pr-2 font-sans flex-1">
                            <strong className="text-ds-primary font-bold">Strategic Benefit: </strong> {rw.benefit}
                          </div>
                          <button
                            onClick={() => handleApplyRewrite(rw.original, rw.replacement)}
                            className="px-4.5 py-2.5 bg-ds-primary hover:bg-ds-primary-hover active:scale-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-md border border-ds-border"
                          >
                            <span>Apply Fix</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
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


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Textarea } from '../../ui/Textarea';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { 
  Scan, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  Sparkles, 
  X, 
  Copy, 
  Check,
  Target,
  FileSearch
} from 'lucide-react';
import { ResumeData, AtsResult } from '../../../types';

interface SidebarAtsTabProps {
  resumeData: ResumeData;
  onChangeData?: (data: ResumeData) => void;
  atsInput: string;
  setAtsInput: (input: string) => void;
}

const PRESET_ROLES = [
  {
    title: 'Senior Frontend',
    keywords: 'React, TypeScript, Next.js, Tailwind CSS, State Management, Performance Optimization, Accessibility WCAG, Vite, Unit Testing, CI/CD, Component Design',
  },
  {
    title: 'Product Designer',
    keywords: 'Figma, Design Systems, UX Research, Wireframing, Rapid Prototyping, Usability Testing, User Journeys, Interaction Design, Cross-functional Leadership, WCAG',
  },
  {
    title: 'Full Stack Engineer',
    keywords: 'Node.js, TypeScript, PostgreSQL, REST APIs, GraphQL, Docker, Microservices, Cloud Architecture, System Design, Security Best Practices, Automated Testing',
  },
];

export const SidebarAtsTab: React.FC<SidebarAtsTabProps> = ({ 
  resumeData, 
  atsInput, 
  setAtsInput 
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AtsResult | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const wordCount = atsInput.trim() ? atsInput.trim().split(/\s+/).length : 0;

  const handleCopyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  const handleAnalyze = async () => {
    if (!atsInput.trim()) return;
    setAnalyzing(true);
    setResults(null);
    try {
      const response = await fetch("/api/ats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resumeData,
          jobDescription: atsInput
        })
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults({
        score: 0,
        found: [],
        missing: [],
        improvements: ["Failed to run ATS scan. Check your network or API Key."],
        warning: "Network Error"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full font-sans animate-fade-in p-5 overflow-y-auto text-left space-y-5">
      {/* SECTION 1: Input & Presets */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md-on-surface font-display font-semibold text-sm">
              Target Job &amp; Keywords
            </h3>
            <p className="text-xs text-md-on-surface-variant mt-0.5">
              Paste role requirements or pick a 1-click preset
            </p>
          </div>
          {atsInput.trim() && (
            <button
              onClick={() => setAtsInput('')}
              className="text-xs text-md-on-surface-variant hover:text-md-error flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2 rounded-md-sm hover:bg-md-surface-container-high"
              title="Clear input"
              aria-label="Clear input"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Quick Role Presets */}
        <div className="space-y-2">
          <span className="text-xs text-md-on-surface font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-md-tertiary" />
            Quick Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_ROLES.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => setAtsInput(preset.keywords)}
                className="text-xs px-2.5 py-1 rounded-md-sm bg-md-surface-container border border-md-outline-variant/30 hover:border-md-outline text-md-on-surface hover:bg-md-surface-container-high transition-all cursor-pointer font-medium"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea */}
        <div className="relative space-y-1.5">
          <Textarea
            value={atsInput}
            onChange={(e) => setAtsInput(e.target.value)}
            rows={5}
            placeholder="Paste job description keywords (e.g., React, TypeScript, System Design, WCAG, Figma)..."
            className="font-mono text-xs"
          />
          <div className="flex justify-between items-center px-1 text-xs text-md-on-surface-variant font-mono">
            <span>{wordCount} words detected</span>
            <span>{atsInput.length} chars</span>
          </div>
        </div>

        {/* Primary Scan Button */}
        <Button 
          onClick={handleAnalyze} 
          disabled={analyzing || !atsInput.trim()} 
          fullWidth 
          className="gap-2"
        >
          {analyzing ? (
            <RefreshCw className="w-4 h-4 animate-spin text-md-on-primary" />
          ) : (
            <Scan className="w-4 h-4 text-md-on-primary" />
          )}
          <span>{analyzing ? 'Scanning Resume Content...' : 'Run ATS Scanner'}</span>
        </Button>
      </section>

      {/* SECTION 2: Results Display */}
      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pt-1"
        >
          {/* Warning Banner if API had a fallback */}
          {results.warning && (
            <div className="p-3.5 bg-md-warning-container/20 border border-md-warning/30 rounded-md-md text-md-on-warning-container text-xs flex gap-3 leading-relaxed">
              <Info className="w-4.5 h-4.5 text-md-warning shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Notice:</strong>
                <span className="opacity-90">{results.warning}</span>
              </div>
            </div>
          )}
          
          {/* Match Score Gauge Card */}
          <div className="p-4 rounded-md-lg bg-md-surface-container-low border border-white/[0.08] shadow-md-elevation-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-md-on-surface block">
                  ATS Match Score
                </span>
                <span className="text-xs text-md-on-surface-variant mt-0.5 block font-medium">
                  {results.score >= 80 
                    ? 'Excellent ATS Alignment' 
                    : results.score >= 50 
                      ? 'Moderate Keyword Coverage' 
                      : 'Needs Strategic Optimization'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-mono font-bold text-md-on-surface">
                  {results.score}%
                </span>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                  results.score >= 80 
                    ? 'border-md-success bg-md-success-container/40 text-md-success' 
                    : results.score >= 50 
                      ? 'border-md-tertiary bg-md-tertiary-container/40 text-md-tertiary' 
                      : 'border-md-error bg-md-error-container/40 text-md-error'
                }`}>
                  {results.score >= 80 ? (
                    <CheckCircle2 className="w-4.5 h-4.5" />
                  ) : (
                    <AlertCircle className="w-4.5 h-4.5" />
                  )}
                </div>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full bg-white/[0.04] h-2 rounded-full overflow-hidden border border-white/[0.08]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, results.score))}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  results.score >= 80 
                    ? 'bg-md-success' 
                    : results.score >= 50 
                      ? 'bg-md-tertiary' 
                      : 'bg-md-error'
                }`}
              />
            </div>
          </div>

          {/* Missing Keywords (High Priority) */}
          {results.missing && results.missing.length > 0 && (
            <div className="p-4 rounded-md-lg bg-md-surface-container-low border border-white/[0.08] shadow-md-elevation-1 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-md-error flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Missing Keywords ({results.missing.length})
                </h4>
                <span className="text-xs text-md-on-surface-variant">Click keyword to copy</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.missing.map((k: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleCopyKeyword(k)}
                    className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md-sm text-xs font-mono font-medium bg-md-error-container/30 text-md-on-error-container border border-md-error/30 hover:bg-md-error-container/50 transition-all cursor-pointer"
                    title={`Click to copy "${k}"`}
                    aria-label={`Copy keyword ${k}`}
                  >
                    <span>{k}</span>
                    {copiedKeyword === k ? (
                      <Check className="w-3.5 h-3.5 text-md-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Keywords */}
          {results.found && results.found.length > 0 && (
            <div className="p-4 rounded-md-lg bg-md-surface-container-low border border-white/[0.08] shadow-md-elevation-1 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-md-success flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Matched Keywords ({results.found.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.found.map((k: string, i: number) => (
                  <Badge key={i} variant="success" size="sm">
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Actionable Improvements */}
          {results.improvements && results.improvements.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-md-on-surface">
                ATS Action Steps
              </h4>
              <div className="space-y-2.5">
                {results.improvements.map((imp: string, i: number) => (
                  <div 
                    key={i} 
                    className="flex gap-3 p-3.5 rounded-md-sm bg-md-surface-container-low border border-md-outline-variant/30 text-xs text-md-on-surface leading-relaxed shadow-md-elevation-1 font-medium"
                  >
                    <ChevronRight className="w-4 h-4 text-md-tertiary shrink-0 mt-0.5" />
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Empty State when no results yet */}
      {!results && (
        <div className="p-5 rounded-md-lg border border-dashed border-md-outline-variant/30 text-center space-y-2.5 bg-md-surface-container-low/40">
          <FileSearch className="w-7 h-7 text-md-on-surface-variant mx-auto" />
          <h4 className="text-xs font-semibold text-md-on-surface">Ready for ATS Keyword Scan</h4>
          <p className="text-xs text-md-on-surface-variant leading-relaxed max-w-xs mx-auto">
            Scan your resume against employer requirements. Uncover critical missing keywords and boost your recruiter pass rate.
          </p>
        </div>
      )}
    </div>
  );
};


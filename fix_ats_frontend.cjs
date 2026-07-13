const fs = require('fs');

const frontendCode = `
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Scan, RefreshCw, AlertCircle, CheckCircle2, Info, ChevronRight } from 'lucide-react';

export const SidebarAtsTab = ({ resumeData, onChangeData, atsInput, setAtsInput }: any) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
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
    <div className="flex flex-col h-full font-sans animate-fade-in p-5 overflow-y-auto text-left">
      <div className="space-y-4">
        <div>
          <h3 className="text-ds-text-high font-display font-semibold text-sm mb-1.5">Target Keywords & Roles</h3>
          <p className="text-xs text-ds-text-muted mb-3">
            Paste the job description or specific keywords you want to target.
          </p>
          <Textarea
            value={atsInput}
            onChange={(e) => setAtsInput(e.target.value)}
            rows={6}
            placeholder="E.g., React, TypeScript, Leadership..."
            className="font-mono shadow-inner resize-none"
          />
        </div>
        
        <Button 
          onClick={handleAnalyze} 
          disabled={analyzing || !atsInput.trim()} 
          fullWidth 
          size="lg"
          className="gap-2 shadow-glow"
        >
          {analyzing ? (
            <RefreshCw className="w-4.5 h-4.5 animate-spin" />
          ) : (
            <Scan className="w-4.5 h-4.5" />
          )}
          {analyzing ? 'Analyzing...' : 'Run ATS Scan'}
        </Button>
      </div>

      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-5"
        >
          {results.warning && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-100 text-xs flex gap-3 leading-relaxed">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-200 block mb-0.5">Note:</strong>
                <span className="opacity-90">{results.warning}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between p-4 rounded-2xl bg-ds-container border border-ds-border shadow-md">
            <div>
              <div className="text-[10px] font-black text-ds-text-muted uppercase tracking-wider mb-1">Match Score</div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-display font-bold text-ds-primary leading-none">{results.score}%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-ds-primary flex items-center justify-center bg-ds-primary/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              {results.score >= 80 ? <CheckCircle2 className="text-ds-primary" /> : <AlertCircle className="text-ds-primary/70" />}
            </div>
          </div>

          {results.missing && results.missing.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-rose-400 mb-2.5">Missing Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {results.missing.map((k: string, i: number) => (
                  <Badge key={i} variant="danger" className="text-[10px] bg-rose-500/10 text-rose-300 border-rose-500/30">{k}</Badge>
                ))}
              </div>
            </div>
          )}

          {results.found && results.found.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 mb-2.5">Matched Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {results.found.map((k: string, i: number) => (
                  <Badge key={i} variant="success" className="text-[10px] bg-emerald-500/10 text-emerald-300 border-emerald-500/30">{k}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {results.improvements && results.improvements.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-400 mb-2.5 pt-2">Actionable Improvements</h4>
              <div className="space-y-2">
                {results.improvements.map((imp: string, i: number) => (
                  <div key={i} className="flex gap-2.5 p-3 rounded-xl bg-[#1a1820] border border-[#2d2a33] text-xs text-[#eaddff] leading-relaxed shadow-sm">
                    <ChevronRight className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
`;

fs.writeFileSync('components/SidebarAtsTab.tsx', frontendCode);
console.log('Fixed ATS Tab');

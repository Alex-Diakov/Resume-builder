import React, { useState, useEffect } from 'react';
import { 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Hash,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ResumeData } from '../types';

interface SidebarAtsTabProps {
  resumeData: ResumeData;
  onChangeData: (data: ResumeData) => void;
  atsInput: string;
  setAtsInput: (val: string) => void;
}

export const SidebarAtsTab: React.FC<SidebarAtsTabProps> = ({
  resumeData,
  onChangeData,
  atsInput,
  setAtsInput
}) => {
  const [keywordMatches, setKeywordMatches] = useState<{ score: number; matched: string[]; missing: string[] }>({
    score: 0,
    matched: [],
    missing: []
  });

  // Dynamically calculate matching index on any resume or keyword alteration
  useEffect(() => {
    if (!atsInput.trim()) {
      setKeywordMatches({ score: 0, matched: [], missing: [] });
      return;
    }

    // Split entered text into clean candidate keywords
    const keywords = atsInput
      .split(/[,\n;.]/)
      .map(k => k.trim())
      .filter(k => k.length > 1);

    if (keywords.length === 0) {
      setKeywordMatches({ score: 0, matched: [], missing: [] });
      return;
    }

    // Capture the entire aggregated textual representation of the resume
    const textPieces: string[] = [
      resumeData.name,
      resumeData.title,
      ...(resumeData.summary || []),
      ...(resumeData.experience || []).flatMap(exp => [
        exp.role,
        exp.company,
        ...(exp.highlights || []).flatMap(h => [h.title, h.description])
      ]),
      ...(resumeData.projects || []).flatMap(p => [
        p.title,
        p.role,
        p.description,
        ...(p.details || []).map(d => d.value)
      ]),
      ...Object.entries(resumeData.skills || {}).flatMap(([cat, s]) => [cat, s]),
      ...(resumeData.education || []).flatMap(e => [e.institution, e.certification])
    ];

    const fullResumePayload = textPieces.join(' ').toLowerCase();
    const matched: string[] = [];
    const missing: string[] = [];

    // Deduplicate target keywords to prevent duplicate score bloating
    const uniqueKeywords = Array.from(new Set(keywords));

    uniqueKeywords.forEach(kw => {
      const lowerWord = kw.toLowerCase();
      if (fullResumePayload.includes(lowerWord)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const calculatedScore = Math.round((matched.length / uniqueKeywords.length) * 100);
    setKeywordMatches({ score: calculatedScore, matched, missing });
  }, [atsInput, resumeData]);

  const getScoreFeedback = (score: number) => {
    if (score >= 80) {
      return { 
        title: "Excellent Match Alignment", 
        desc: "Your resume represents strong coverage of the requested keyword parameters. You stand a premium chance of passing high-grade ATS screens.",
        color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
        barColor: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
      };
    }
    if (score >= 50) {
      return { 
        title: "Moderate Keyword Coverage", 
        desc: "Your resume includes standard overlaps, but contains critical gaps. We highly recommend weaving the missing keywords directly into your summary or experience highlights.",
        color: "text-amber-300 border-amber-500/20 bg-amber-500/5",
        barColor: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
      };
    }
    return { 
      title: "Low Keyword Relevance", 
      desc: "Your resume will likely fail to register with automated applicant tracking parsers. Inject at least 4-5 of the missing key terms listed below into your text to raise matching relevance.",
      color: "text-rose-400 border-rose-500/20 bg-rose-500/5",
      barColor: "bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"
    };
  };

  const feedback = getScoreFeedback(keywordMatches.score);

  return (
    <div className="flex flex-col h-full bg-ds-panel pb-16 font-sans">

      <div className="flex-1 overflow-y-auto px-4.5 py-4 space-y-6 text-left">
        
        {/* INPUT CARD */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold text-[#eaddff] uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-cyan-400" />
              <span>Target Role Vacancy Keywords</span>
            </h4>
            <p className="text-[11px] text-ds-text-medium leading-relaxed font-sans">
              Paste keywords from your target Job Description below (separated by commas, lines, or semicolons). Or paste the full descriptive text of requirements.
            </p>
          </div>

          <div className="relative">
            <textarea
              value={atsInput}
              onChange={(e) => setAtsInput(e.target.value)}
              className="w-full p-3.5 bg-ds-container border border-ds-border text-ds-text-high font-mono text-xs rounded-xl focus:border-ds-border-focus focus:outline-none focus:ring-1 focus:ring-ds-primary/20 resize-none transition-colors shadow-inner"
              rows={6}
              placeholder="E.g., React, Kubernetes, Agility, Product Strategy, Roadmap, SaaS, Customer Retention, Figma..."
            />
          </div>
        </div>

        {/* ATS INSIGHTS OVERLAY */}
        {!atsInput.trim() ? (
          <div className="bg-ds-container rounded-xl p-6 border border-ds-border text-center space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#eaddff]">Awaiting Vacancy Details</h4>
              <p className="text-[11px]/relaxed text-ds-text-medium">
                By specifying key target words, our real-time matching system evaluates keyword frequency coverage, identifies structural deficiencies, and maps presence markers instantly.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-in">
            
            {/* SCORE DISPLAY CARD */}
            <div className={`p-4.5 rounded-xl border ${feedback.color} space-y-3.5 shadow-md`}>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-[#cac4d0]/80">Overall Match Quotient</h5>
                  <h3 className="text-sm font-extrabold text-white leading-tight">{feedback.title}</h3>
                </div>
                
                <div className="shrink-0 flex items-center justify-center bg-ds-container w-16 h-16 rounded-xl border border-white/5 shadow-inner">
                  <span className="text-xl font-black font-mono text-white">
                    {keywordMatches.score}%
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full bg-[#111015]/60 h-2 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${feedback.barColor}`}
                  style={{ width: `${keywordMatches.score}%` }}
                />
              </div>

              <p className="text-[11px] text-ds-text-medium leading-relaxed font-sans">{feedback.desc}</p>
            </div>

            {/* KEYWORD BINS */}
            <div className="space-y-4">
              
              {/* SUCCESS Overlap (Green pills) */}
              <div className="bg-ds-container rounded-xl border border-ds-border p-4.5 space-y-3.5 shadow-sm">
                <h5 className="text-[9.5px] text-emerald-400 uppercase font-black tracking-widest flex items-center gap-1.5 border-b border-ds-border pb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Matched Keyword Overlaps ({keywordMatches.matched.length})</span>
                </h5>
                
                {keywordMatches.matched.length === 0 ? (
                  <p className="text-[10px] text-ds-text-muted italic">None of the listed terms are present inside your resume content. Focus on incorporating key phrases below.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {keywordMatches.matched.map((kw, i) => (
                      <span 
                        key={i} 
                        className="px-2.5 py-1 bg-emerald-950/20 text-emerald-300 border border-emerald-800/15 rounded-lg text-[10px] font-mono hover:bg-emerald-950/40 transition-all cursor-default flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* GAPS (Orange pills) */}
              <div className="bg-ds-container rounded-xl border border-ds-border p-4.5 space-y-3.5 shadow-sm">
                <h5 className="text-[9.5px] text-amber-300 uppercase font-black tracking-widest flex items-center gap-1.5 border-b border-ds-border pb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>Identified Keyword Gaps ({keywordMatches.missing.length})</span>
                </h5>
                
                {keywordMatches.missing.length === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/5 border border-emerald-900/10 p-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10.5px]">Congratulations! Absolute maximum alignment achieved. No gaps identified.</span>
                  </div>
                ) : (
                  <div className="space-y-3.5 pt-1">
                    <p className="text-[10px]/relaxed text-ds-text-medium">
                      Recruiters configure searching algorithms with these semantic tags. Integrate these words organically into your job descriptions.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {keywordMatches.missing.map((kw, i) => (
                        <span 
                          key={i} 
                          className="px-2.5 py-1 bg-amber-500/5 text-amber-300 border border-amber-500/10 rounded-lg text-[10px] font-mono hover:bg-amber-500/20 transition-all cursor-default flex items-center gap-1"
                        >
                          <span className="w-[1px] h-2 bg-amber-400/40 mr-1 shrink-0" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* PARSING ANCHOR LAWS BRIEF */}
              <div className="bg-ds-panel border border-ds-border rounded-xl p-4.5 flex gap-3 text-xs leading-relaxed text-ds-text-medium">
                <Layers className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h6 className="font-bold text-[#eaddff] text-[10.5px] uppercase tracking-wider flex items-center gap-1">
                    <span>Automated Resume Indexing Tips</span>
                    <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                  </h6>
                  <p className="text-[10px] text-ds-text-medium">
                    Always include custom skills explicitly in plain text instead of visuals or graphics. Ensure company and role title headers reflect standard dictionary industry terms (e.g., use "Staff Software Engineer" as opposed to "Specialist Code Craftsman").
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

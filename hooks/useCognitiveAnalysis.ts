import { useState } from 'react';
import { ResumeData } from '../types';

export const useCognitiveAnalysis = (resumeData: ResumeData, onChangeData: (data: ResumeData) => void, setJsonInput: (input: string) => void) => {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzerWarning, setAnalyzerWarning] = useState<string | null>(null);
  const [analyzedDataString, setAnalyzedDataString] = useState<string>('');

  const runCognitiveAnalysis = async () => {
    // Exclude the massive photo base64 string from the API payload to prevent HTTP 413 Payload Too Large errors
    const { photo, ...restData } = resumeData;
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

  return {
    analysisResult,
    analyzing,
    analyzerWarning,
    analyzedDataString,
    runCognitiveAnalysis,
    handleApplyRewrite
  };
};

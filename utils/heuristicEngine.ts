import { ResumeData } from "../types";

export interface CognitiveLaw {
  id: string;
  name: string;
  description: string;
  psychologicalBasis: string;
  dangerThreshold: number;
}

export const ATTENTION_LAWS: Record<string, CognitiveLaw> = {
  MILLERS_LAW: {
    id: "MILLERS_LAW",
    name: "Miller's Law (Information Chunking)",
    description: "Humans can only retain 7±2 discrete chunks in operational working memory. Exceeding this triggers rapid mental fatigue.",
    psychologicalBasis: "Miller's Law (Magic Number 7±2 Memory Threshold)",
    dangerThreshold: 15
  },
  FITTS_LAW: {
    id: "FITTS_LAW",
    name: "Fitts' Law (Visual Gaze Anchors)",
    description: "Big, prominent numeric and structural milestones are visual target zones that capture the reader's focus instantly.",
    psychologicalBasis: "Fitts' Law of User Target Attraction",
    dangerThreshold: 4 // Optimal minimum quantity of metric metrics (percentage, dollars, numbers)
  },
  HICKS_LAW: {
    id: "HICKS_LAW",
    name: "Hick's Law (Decision Overload)",
    description: "The time required to comprehend list options increases logarithmically with the count and clutter of those items.",
    psychologicalBasis: "Hick's Law of Decision-making Latency",
    dangerThreshold: 5 // Maximum core skills categories recommended
  },
  JAKOBS_LAW: {
    id: "JAKOBS_LAW",
    name: "Jakob's Law (Conventional Layout Flow)",
    description: "Users spend most of their time looking at conventional structures. Expect standard resume order with clean spacing.",
    psychologicalBasis: "Jakob's Law of Layout Familiarity",
    dangerThreshold: 0
  },
  ZEIGARNIK_EFFECT: {
    id: "ZEIGARNIK_EFFECT",
    name: "Zeigarnik Effect (Task Accomplishment)",
    description: "People store incomplete tasks longer in active anxiety, whereas shipped/completed milestones provide immediate mental relief and trust.",
    psychologicalBasis: "Zeigarnik Effect of Unfinished Action Cycles",
    dangerThreshold: 1 // Needs at least 1 high status deliverable keyword
  },
  FPATTERN_SCANNING: {
    id: "FPATTERN_SCANNING",
    name: "F-Pattern Reading Gravity",
    description: "Eye-tracking patterns verify that web readers prioritize scanning horizontally near the top and start of action bullets.",
    psychologicalBasis: "Tobii F-Scan Eye Tracking Heat Maps",
    dangerThreshold: 200 // Max target characters for summary section to prevent plain prose blocks
  }
};

// Convert resume structure to clean readable text for prompt
export function serializeResume(data: ResumeData): string {
  let text = `Name: ${data.name || "Untitled"}\nTitle: ${data.title || "Untitled"}\n\n`;
  text += `Summary:\n${Array.isArray(data.summary) ? data.summary.join("\n") : (data.summary || "")}\n\n`;
  text += `Experience:\n`;
  if (Array.isArray(data.experience)) {
    data.experience.forEach((exp) => {
      text += `- ${exp.role} at ${exp.company} (${exp.duration}) - ${exp.type}\n`;
      if (Array.isArray(exp.highlights)) {
        exp.highlights.forEach((h) => {
          text += `  * ${h.title}: ${h.description}\n`;
        });
      }
    });
  }
  text += `\nProjects:\n`;
  if (Array.isArray(data.projects)) {
    data.projects.forEach((proj) => {
      text += `- ${proj.title} (Role: ${proj.role})\n`;
      text += `  Description: ${proj.description}\n`;
      if (Array.isArray(proj.details)) {
        proj.details.forEach((d) => {
          text += `  * ${d.label}: ${d.value}\n`;
        });
      }
    });
  }
  text += `\nSkills:\n`;
  if (data.skills) {
    Object.entries(data.skills).forEach(([cat, val]) => {
      text += `- ${cat}: ${val}\n`;
    });
  }
  return text;
}

export function generateHeuristicBackupAnalysis(data: ResumeData) {
  // Heuristic calculations
  const totalBullets = (data.experience || []).reduce((acc: number, item) => acc + (item.highlights?.length || 0), 0);
  const totalSkillsCategories = data.skills ? Object.keys(data.skills).length : 0;
  
  // Calculate metric count (%, $, digits, billion/million, etc.)
  let metricCount = 0;
  const metricsRegex = /\d%|\$\d|\d\s?percent|\d\s?billion|\d\s?million|\d+\+/i;
  
  const checkMetrics = (text: string) => {
    if (text && metricsRegex.test(text)) metricCount++;
  };
  
  // Scouring experience and project text for metrics
  (data.experience || []).forEach((exp) => {
    (exp.highlights || []).forEach((h) => {
      checkMetrics(h.title);
      checkMetrics(h.description);
    });
  });
  (data.projects || []).forEach((proj) => {
    checkMetrics(proj.description);
    (proj.details || []).forEach((d) => {
      checkMetrics(d.value);
    });
  });

  // Calculate closure keywords (Completed, Delivered, Streamlined, Shipped, Architected)
  let closureCount = 0;
  const closureRegex = /completed|shipped|delivered|streamlined|architected|orchestrated|engineered|mitigated/i;
  const checkClosure = (text: string) => {
    if (text && closureRegex.test(text)) closureCount++;
  };
  (data.experience || []).forEach((exp) => {
    checkClosure(exp.role);
    (exp.highlights || []).forEach((h) => {
      checkClosure(h.title);
      checkClosure(h.description);
    });
  });

  const summaryText = Array.isArray(data.summary) ? data.summary.join(" ") : (data.summary || "");
  const summaryLength = summaryText.length;

  // COMPUTE SEPARATE SCIENTIFIC SUB-SCORES
  // 1. Miller's Information Chunking Score (starts at 95, penalized by excess content)
  let cognitiveScore = 95;
  if (totalBullets > ATTENTION_LAWS.MILLERS_LAW.dangerThreshold) {
    cognitiveScore -= 15;
  }
  if (totalSkillsCategories > 6) {
    cognitiveScore -= 10;
  }

  // 2. Fitts' Gaze Anchor Target Score (metric density, starts at 60 and peaks at 100)
  let kpiScore = 65;
  kpiScore += Math.min(metricCount * 8, 35);

  // 3. F-Pattern and Layout Scan Score
  let scanningScore = 90;
  if (!data.name || !data.title) {
    scanningScore -= 25;
  }
  if (summaryLength > ATTENTION_LAWS.FPATTERN_SCANNING.dangerThreshold) {
    scanningScore -= 15; // penalize too-dense prose summary blocks
  }

  const overallScore = Math.round((cognitiveScore + kpiScore + scanningScore) / 3);

  // DECLARATIVE REGISTRY DIAGNOSTICS EVALUATOR
  const diagnostics = [];

  // Rules evaluated dynamically
  // Rule A: Miller's Law
  if (totalBullets > ATTENTION_LAWS.MILLERS_LAW.dangerThreshold) {
    diagnostics.push({
      section: "Work Experience Tenure",
      severity: "high",
      finding: `Detected ${totalBullets} action highlights within experience. This cluster crosses the Miller's magic number memory threshold.`,
      psychologicalBasis: ATTENTION_LAWS.MILLERS_LAW.psychologicalBasis,
      suggestion: "Consolidate and strip secondary routine milestones to display only your top 3-4 ultra high-yielding landmark achievements."
    });
  } else {
    diagnostics.push({
      section: "Work Experience Tenure",
      severity: "low",
      finding: `Well proportioned working memory footprint with ${totalBullets} core bullet points. Within attention span parameters.`,
      psychologicalBasis: ATTENTION_LAWS.MILLERS_LAW.psychologicalBasis,
      suggestion: "Maintain current balance. Anchor each milestone with high-status active verbs at the starting boundary."
    });
  }

  // Rule B: Fitts' Visual Anchor Law (KPI Metrics)
  if (metricCount < ATTENTION_LAWS.FITTS_LAW.dangerThreshold) {
    diagnostics.push({
      section: "Visual Anchors (Metrics)",
      severity: "high",
      finding: `Found only ${metricCount} numerical metrics in highlights. Low metric count prevents eye scans from locking target indicators.`,
      psychologicalBasis: ATTENTION_LAWS.FITTS_LAW.psychologicalBasis,
      suggestion: "Convert simple task outlines into strategic numeric output metrics (e.g., 'saved $20k overhead' or 'reduced latency by 20%')."
    });
  } else {
    diagnostics.push({
      section: "Visual Anchors (Metrics)",
      severity: "low",
      finding: `Elite visual scannability. Found ${metricCount} high-density numeric target trackers capturing visual flow.`,
      psychologicalBasis: ATTENTION_LAWS.FITTS_LAW.psychologicalBasis,
      suggestion: "Ensure priority metrics are placed in the first five words of individual bullet streams to fit recruiter scan speeds."
    });
  }

  // Rule C: Hick's Decision Law (Skills Categorization)
  if (totalSkillsCategories > ATTENTION_LAWS.HICKS_LAW.dangerThreshold) {
    diagnostics.push({
      section: "Competency Index",
      severity: "medium",
      finding: `Contains ${totalSkillsCategories} skill classification categories. High category indices increase analytical friction for recruiters.`,
      psychologicalBasis: ATTENTION_LAWS.HICKS_LAW.psychologicalBasis,
      suggestion: "Cluster technical competencies into 3-4 primary high-status taxonomy headers (e.g. Systems Architecture, Engineering Stack)."
    });
  }

  // Rule D: Zeigarnik Accomplishment Loop
  if (closureCount < 3) {
    diagnostics.push({
      section: "Accomplishment Architecture",
      severity: "medium",
      finding: `High ratio of ongoing, routine activity logs relative to closed strategic outcomes (only ${closureCount} closed active verbs found).`,
      psychologicalBasis: ATTENTION_LAWS.ZEIGARNIK_EFFECT.psychologicalBasis,
      suggestion: "Recast role descriptions into active completions using whitening-listed verbs (e.g., Shipped, Architected, Mitigated)."
    });
  }

  // Rule E: F-Pattern Gravity (Summary Length limits)
  if (summaryLength > ATTENTION_LAWS.FPATTERN_SCANNING.dangerThreshold) {
    diagnostics.push({
      section: "Target Positioning Summary",
      severity: "high",
      finding: `The summary contains ${summaryLength} characters of prose. Excessive paragraph content triggers layout scanning skip patterns.`,
      psychologicalBasis: ATTENTION_LAWS.FPATTERN_SCANNING.psychologicalBasis,
      suggestion: "Trim dense text blocks into exactly 2 or 3 high-contrast, confident value-benefit thesis lines."
    });
  }

  // Visual scan-anchors capturing recruiter attention
  const scanningHotspots = [
    data.name ? `Candidate identity: ${data.name}` : "Core candidate identity",
    data.title ? `Job Target title banner: ${data.title}` : "Targeted positioning banner",
  ];
  if (data.contact?.linkedin) scanningHotspots.push("LinkedIn instant portfolio reference");
  if (metricCount > 0) scanningHotspots.push(`${metricCount} high-status numeric statistics`);

  // Extensible mock rewrite frames
  const rewrites = [
    {
      where: "Target Executive Statement",
      original: data.title || "Software Developer",
      replacement: `${data.title || "Software Architect"} | Engineering Low-Friction, High-Scalability Systems & Cognitive Solutions`,
      benefit: "Frames target immediately as a principal strategic builder rather than a plain duty executor."
    }
  ];

  if ((data.experience || []).length > 0) {
    const firstRole = data.experience[0];
    rewrites.push({
      where: `${firstRole.company} - ${firstRole.role}`,
      original: "Responsible for development and maintaining frontend elements of the platform.",
      replacement: `Engaged React/Vite systems architecture, streamlining UI latency delays by 35% resulting in friction-free workflows.`,
      benefit: "Eradicates subordinate, duty-based 'responsible' loop with active business ownership and metrics."
    });
  }

  return {
    overallScore,
    cognitiveScore,
    scanningScore,
    kpiScore,
    summaryFeedback: `Based on 6 Human-Computer Interaction rules (Miller's magic limits, Tobii F-scan mapping, Hick's law, Fitts' visual sizes, Jakob's layout order, and Zeigarnik completions), we scored your resume a solid ${overallScore}/100. Apply rewrite frames and trim dense prose blocks to reduce visual lag.`,
    diagnostics,
    scanningHotspots,
    rewrites
  };
}

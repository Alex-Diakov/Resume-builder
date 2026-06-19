import React from 'react';
import { ResumeData } from '../types';
import { Globe, Linkedin, Mail, MapPin } from 'lucide-react';
import { formatUrl, highlightText } from '../utils/formatters';
import { SectionHeader } from './SectionHeader';
import { ExperienceBlock } from './ExperienceBlock';
import { ProjectBlock } from './ProjectBlock';

interface ResumePaperProps {
  data: ResumeData;
  paddingTopBottom?: number;
  paddingLeftRight?: number;
  sectionSpacing?: number;
  itemSpacing?: number;
  showPageGuides?: boolean;
}

// Main Component
export const ResumePaper: React.FC<ResumePaperProps> = ({ 
  data,
  paddingTopBottom = 12.7,
  paddingLeftRight = 14,
  sectionSpacing = 1.0,
  itemSpacing = 1.0,
  showPageGuides = true
}) => {
  if (!data) return <div>No Data Loaded</div>;

  const pageStyle = {
    width: '210mm',
    // Min height A4, but allows growing if content pushes
    minHeight: '297mm', 
    paddingTop: `${paddingTopBottom}mm`,
    paddingBottom: `${paddingTopBottom}mm`,
    paddingLeft: `${paddingLeftRight}mm`,
    paddingRight: `${paddingLeftRight}mm`,
    backgroundColor: 'white',
    boxSizing: 'border-box' as const,
  };

  const gapStyle = {
    marginBottom: `${sectionSpacing * 16}px`
  };

  return (
    <div 
      id="resume-content" 
      className="resume-sheet bg-white shadow-xl mx-auto print:shadow-none print:m-0 relative z-0"
      style={pageStyle}
    >
      {/* Architectural PDF Page-Break Guides */}
      {showPageGuides && (
        <>
          <div 
            className="page-guide-indicator absolute left-0 right-0 pointer-events-none border-t border-dashed border-rose-300 text-rose-500 font-mono text-[9px] select-none flex items-center justify-end pr-4 z-10 print:hidden" 
            style={{ top: '297mm', height: '0px' }}
          >
            <span className="bg-rose-50 px-2 py-0.5 border border-rose-100 rounded-md shadow-sm translate-y-[-50%]">Page 1 Ends Here ({Math.round(297)}mm)</span>
          </div>
          <div 
            className="page-guide-indicator absolute left-0 right-0 pointer-events-none border-t border-dashed border-rose-300 text-rose-500 font-mono text-[9px] select-none flex items-center justify-end pr-4 z-10 print:hidden" 
            style={{ top: '594mm', height: '0px' }}
          >
            <span className="bg-rose-50 px-2 py-0.5 border border-rose-100 rounded-md shadow-sm translate-y-[-50%]">Page 2 Ends Here ({Math.round(594)}mm)</span>
          </div>
        </>
      )}

      {/* ATS Text (Invisible to humans, scannable by ATS) */}
      {data.atsKeywords && (
        <div 
          className="absolute top-0 left-0 w-full h-full text-white z-[-1] whitespace-pre-wrap select-none pointer-events-none overflow-hidden" 
          aria-hidden="true"
        >
          {data.atsKeywords}
        </div>
      )}

      {/* --- HEADER --- */}
      <header style={gapStyle}>
        <h1 className="font-display text-resume-name font-bold text-resume-primary mb-1">
          {data.name}
        </h1>
        <h2 className="font-display text-resume-title font-medium text-resume-secondary mb-3">
          {data.title}
        </h2>
        
        {/* Contact Line: Icons + Reordered */}
        <div className="flex flex-wrap items-center gap-x-2 text-resume-meta text-resume-muted leading-none">
          
          {/* 1. Portfolio */}
          {data.contact.website && (
             <>
               <a href={formatUrl(data.contact.website)} target="_blank" rel="noreferrer" className="flex items-center text-resume-accent font-medium hover:text-resume-primary transition-colors group">
                 <Globe className="w-3.5 h-3.5 mr-1.5 text-resume-muted group-hover:text-resume-accent transition-colors" />
                 Portfolio
               </a>
               <span className="text-resume-border">•</span>
             </>
          )}

          {/* 2. LinkedIn */}
          {data.contact.linkedin && (
             <>
               <a href={formatUrl(data.contact.linkedin)} target="_blank" rel="noreferrer" className="flex items-center text-resume-accent font-medium hover:text-resume-primary transition-colors group">
                 <Linkedin className="w-3.5 h-3.5 mr-1.5 text-resume-muted group-hover:text-resume-accent transition-colors" />
                 LinkedIn
               </a>
               <span className="text-resume-border">•</span>
             </>
          )}

          {/* 3. Email */}
          <a href={`mailto:${data.contact.email}`} className="flex items-center text-resume-accent font-medium hover:text-resume-primary transition-colors group">
            <Mail className="w-3.5 h-3.5 mr-1.5 text-resume-muted group-hover:text-resume-accent transition-colors" />
            {data.contact.email}
          </a>
          
          {/* 4. Location (End) */}
          {data.contact.location && (
            <>
              <span className="text-resume-border">•</span>
              <span className="flex items-center cursor-default">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-resume-muted" />
                {data.contact.location}
              </span>
            </>
          )}

        </div>
      </header>

      {/* --- SUMMARY --- */}
      {data.summary && data.summary.length > 0 && (
        <section style={gapStyle}>
          <div className="text-resume-body text-resume-secondary text-justify">
             {Array.isArray(data.summary) ? data.summary.map((para, i) => (
               <span key={i} className={i > 0 ? "ml-1" : ""}>{highlightText(para)} </span>
             )) : (
               <span>{highlightText(data.summary as unknown as string)} </span>
             )}
          </div>
        </section>
      )}

      {/* --- EXPERIENCE --- */}
      {Array.isArray(data.experience) && data.experience.length > 0 && (
        <section style={gapStyle}>
          <SectionHeader title="Experience" sectionSpacing={sectionSpacing} />
          <div className="flex flex-col">
            {data.experience.map((job, index) => (
              <ExperienceBlock key={index} item={job} spacing={itemSpacing} />
            ))}
          </div>
        </section>
      )}

      {/* --- PROJECTS --- */}
      {Array.isArray(data.projects) && data.projects.length > 0 && (
        <section style={gapStyle}>
          <SectionHeader title="Product Ventures & Innovation" sectionSpacing={sectionSpacing} />
          <div className="flex flex-col">
            {data.projects.map((proj, index) => (
              <ProjectBlock key={index} item={proj} spacing={itemSpacing} />
            ))}
          </div>
        </section>
      )}

      {/* --- SKILLS & EDUCATION (Columns) --- */}
      <section className="flex flex-row gap-8 break-inside-avoid" style={{ marginTop: `${sectionSpacing * 12}px` }}>
        {/* Skills */}
        {data.skills && Object.keys(data.skills).length > 0 && (
          <div className="flex-[2]">
             <SectionHeader title="Core Competencies" sectionSpacing={sectionSpacing} />
             <div className="space-y-2">
                {Object.entries(data.skills).map(([category, skills]) => (
                  <div key={category} className="text-resume-body">
                    <span className="font-bold text-resume-primary text-[9.5pt] uppercase mr-2">{category}:</span>
                    <span className="text-resume-secondary">{skills}</span>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Education */}
        {Array.isArray(data.education) && data.education.length > 0 && (
          <div className="flex-[1]">
            <SectionHeader title="Education" sectionSpacing={sectionSpacing} />
            <ul className="space-y-2">
              {data.education.map((edu, idx) => (
                <li key={idx} className="text-resume-body">
                  <div className="font-bold text-resume-primary text-[10pt]">{edu.certification}</div>
                  <div className="text-resume-meta text-resume-muted">{edu.institution} | {edu.year}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

    </div>
  );
};

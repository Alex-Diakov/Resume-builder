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

interface RenderBlock {
  id: string;
  type: 'header' | 'summary' | 'section-header' | 'experience-item' | 'project-item' | 'skills-education';
  title?: string;
  item?: any;
  estimatedHeight: number; // in mm
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
  if (!data) return <div className="p-8 text-center bg-white rounded-lg text-slate-500">No Data Loaded</div>;

  // 1. Build list of all renderable blocks sequentially
  const blocks: RenderBlock[] = [];

  // Block A: Header Block
  blocks.push({
    id: 'header',
    type: 'header',
    estimatedHeight: 32 + (sectionSpacing * 3)
  });

  // Block B: Summary paragraph(s)
  if (data.summary && (Array.isArray(data.summary) ? data.summary.length > 0 : data.summary)) {
    const summaryText = Array.isArray(data.summary) ? data.summary.join(' ') : (data.summary as unknown as string);
    const totalChars = summaryText.length;
    const lines = Math.ceil(totalChars / 110);
    // 4.2mm per line + spacing of sectionSpacing
    const estHeight = (lines * 4.2) + (sectionSpacing * 4) + 2;
    blocks.push({
      id: 'summary',
      type: 'summary',
      estimatedHeight: estHeight
    });
  }

  // Block C: Experience section header and individual items
  if (Array.isArray(data.experience) && data.experience.length > 0) {
    blocks.push({
      id: 'header-experience',
      type: 'section-header',
      title: 'Experience',
      estimatedHeight: 8 + sectionSpacing * 8
    });
    
    data.experience.forEach((job, index) => {
      let jobHeight = 8; // base for job title/location line
      if (Array.isArray(job.highlights)) {
        job.highlights.forEach(h => {
          const charCount = (h.title?.length || 0) + (h.description?.length || 0) + 15;
          const lines = Math.ceil(charCount / 95);
          jobHeight += (lines * 4.2) + 2.0;
        });
      }
      jobHeight += itemSpacing * 3.2; // bottom margin margin-bottom helper
      
      blocks.push({
        id: `experience-${index}`,
        type: 'experience-item',
        item: job,
        estimatedHeight: jobHeight
      });
    });
  }

  // Block D: Projects (Product Ventures & Innovation) section header and items
  if (Array.isArray(data.projects) && data.projects.length > 0) {
    blocks.push({
      id: 'header-projects',
      type: 'section-header',
      title: 'Product Ventures & Innovation',
      estimatedHeight: 8 + sectionSpacing * 8
    });
    
    data.projects.forEach((proj, index) => {
      let projHeight = 6; // base for project title line
      const descChars = proj.description?.length || 0;
      const descLines = Math.ceil(descChars / 110);
      projHeight += (descLines * 4.2) + 2;
      
      if (Array.isArray(proj.details)) {
        proj.details.forEach(d => {
          const charCount = (d.label?.length || 0) + (d.value?.length || 0) + 8;
          const lines = Math.ceil(charCount / 75);
          projHeight += (lines * 3.8);
        });
      }
      projHeight += itemSpacing * 3.2; // bottom margin margin-bottom helper
      
      blocks.push({
        id: `project-${index}`,
        type: 'project-item',
        item: proj,
        estimatedHeight: projHeight
      });
    });
  }

  // Block E: Skills and Education Column block container
  const hasSkills = data.skills && Object.keys(data.skills).length > 0;
  const hasEdu = Array.isArray(data.education) && data.education.length > 0;

  if (hasSkills || hasEdu) {
    let skillsHeight = 0;
    if (hasSkills) {
      skillsHeight += 8 + sectionSpacing * 8; // header
      Object.entries(data.skills).forEach(([category, skills]) => {
        const chars = category.length + skills.length + 8;
        const lines = Math.ceil(chars / 75);
        skillsHeight += (lines * 4.2) + 2;
      });
    }
    
    let eduHeight = 0;
    if (hasEdu) {
      eduHeight += 8 + sectionSpacing * 8; // header
      data.education.forEach(() => {
        eduHeight += 12; // base description height
      });
    }
    
    const colHeight = Math.max(skillsHeight, eduHeight);
    blocks.push({
      id: 'skills-education',
      type: 'skills-education',
      estimatedHeight: colHeight
    });
  }

  // 2. Mathematical page budget distribution algorithm
  // A4 height is 297mm. Deduct top & bottom padding, and room for the page numbers and safe margins.
  const pageBudget = 297 - (paddingTopBottom * 2) - 10;

  const pages: { blocks: RenderBlock[] }[] = [{ blocks: [] }];
  let currentPageIndex = 0;
  let currentHeightSum = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    
    // Look-ahead Orphan Prevention:
    // If the next block is a section header, check if it and the first item of that section both fit on the current page.
    // If they can't, start a new page immediately for the section header. This guarantees that Section Headers are never orphaned!
    if (block.type === 'section-header') {
      const nextBlock = blocks[i + 1];
      const combinedHeight = block.estimatedHeight + (nextBlock ? nextBlock.estimatedHeight : 0);
      if (currentHeightSum + combinedHeight > pageBudget && pages[currentPageIndex].blocks.length > 0) {
        pages.push({ blocks: [] });
        currentPageIndex++;
        currentHeightSum = 0;
      }
    }
    
    // Fallback standard pagination check
    if (currentHeightSum + block.estimatedHeight > pageBudget && pages[currentPageIndex].blocks.length > 0) {
      pages.push({ blocks: [] });
      currentPageIndex++;
      currentHeightSum = 0;
    }
    
    pages[currentPageIndex].blocks.push(block);
    currentHeightSum += block.estimatedHeight;
  }

  const gapStyle = {
    marginBottom: `${sectionSpacing * 16}px`
  };

  return (
    <div 
      id="resume-content" 
      className="flex flex-col gap-8 print:gap-0 bg-transparent print:bg-white pb-16 print:pb-0 relative z-0"
    >
      {/* Dynamic ATS Text (Placed in the main content so it is indexing ready, but completely invisible once printed) */}
      {data.atsKeywords && (
        <div 
          className="absolute top-0 left-0 w-full h-full text-white z-[-1] whitespace-pre-wrap select-none pointer-events-none overflow-hidden" 
          aria-hidden="true"
        >
          {data.atsKeywords}
        </div>
      )}

      {pages.map((page, pageIdx) => (
        <div
          key={pageIdx}
          className="resume-page bg-white shadow-xl mx-auto rounded-md relative flex flex-col justify-between"
          style={{
            width: '210mm',
            height: '297mm', // Strict physical A4 page size
            paddingTop: `${paddingTopBottom}mm`,
            paddingBottom: `${paddingTopBottom}mm`,
            paddingLeft: `${paddingLeftRight}mm`,
            paddingRight: `${paddingLeftRight}mm`,
            boxSizing: 'border-box' as const,
            overflow: 'hidden' as const
          }}
        >
          {/* Main Content Area */}
          <div className="flex flex-col flex-1">
            {page.blocks.map((block) => {
              switch (block.type) {
                case 'header':
                  return (
                    <header key={block.id} style={gapStyle}>
                      <div className="flex items-start gap-4">
                        {data.photo && data.showPhoto !== false && (
                          <div className="shrink-0">
                            <img 
                              src={data.photo} 
                              alt={data.name} 
                              className="w-[96px] h-[96px] object-cover rounded-xl border border-resume-border shadow-sm bg-slate-50"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h1 className="font-display text-resume-name font-bold text-resume-primary mb-1 leading-tight">
                            {data.name}
                          </h1>
                          <h2 className="font-display text-resume-title font-medium text-resume-secondary mb-2.5">
                            {data.title}
                          </h2>
                          
                          <div className="flex flex-wrap items-center gap-x-2 text-resume-meta text-resume-muted leading-none">
                            {data.contact.website && (
                              <>
                                <a href={formatUrl(data.contact.website)} target="_blank" rel="noreferrer" className="flex items-center text-resume-accent font-medium hover:text-resume-primary transition-colors group">
                                  <Globe className="w-3.5 h-3.5 mr-1.5 text-resume-muted group-hover:text-resume-accent transition-colors" />
                                  Portfolio
                                </a>
                                <span className="text-resume-border">•</span>
                              </>
                            )}

                            {data.contact.linkedin && (
                              <>
                                <a href={formatUrl(data.contact.linkedin)} target="_blank" rel="noreferrer" className="flex items-center text-resume-accent font-medium hover:text-resume-primary transition-colors group">
                                  <Linkedin className="w-3.5 h-3.5 mr-1.5 text-resume-muted group-hover:text-resume-accent transition-colors" />
                                  LinkedIn
                                </a>
                                <span className="text-resume-border">•</span>
                              </>
                            )}

                            <a href={`mailto:${data.contact.email}`} className="flex items-center text-resume-accent font-medium hover:text-resume-primary transition-colors group">
                              <Mail className="w-3.5 h-3.5 mr-1.5 text-resume-muted group-hover:text-resume-accent transition-colors" />
                              {data.contact.email}
                            </a>
                            
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
                        </div>
                      </div>
                    </header>
                  );

                case 'summary':
                  return (
                    <section key={block.id} style={gapStyle}>
                      <div className="text-resume-body text-resume-secondary text-justify">
                         {Array.isArray(data.summary) ? data.summary.map((para, i) => (
                           <span key={i} className={i > 0 ? "ml-1" : ""}>{highlightText(para)} </span>
                         )) : (
                           <span>{highlightText(data.summary as unknown as string)} </span>
                         )}
                      </div>
                    </section>
                  );

                case 'section-header':
                  return (
                    <SectionHeader key={block.id} title={block.title || ''} sectionSpacing={sectionSpacing} />
                  );

                case 'experience-item':
                  return (
                    <ExperienceBlock key={block.id} item={block.item} spacing={itemSpacing} />
                  );

                case 'project-item':
                  return (
                    <ProjectBlock key={block.id} item={block.item} spacing={itemSpacing} />
                  );

                case 'skills-education':
                  return (
                    <section key={block.id} className="flex flex-row gap-8 break-inside-avoid" style={{ marginTop: `${sectionSpacing * 12}px` }}>
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
                  );

                default:
                  return null;
              }
            })}
          </div>

          {/* Math-Perfect Page Footer */}
          {showPageGuides && (
            <div className="resume-footer text-[8px] text-resume-muted font-mono flex justify-between border-t border-resume-border pt-1.5 mt-2 select-none print:flex">
              <span className="uppercase tracking-wider font-semibold opacity-75">{data.name} — {data.title}</span>
              <span className="font-bold">Page {pageIdx + 1} of {pages.length}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

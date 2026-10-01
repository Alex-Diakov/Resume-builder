import React, { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { ResumeData } from '../../types';
import { Globe, Linkedin, Mail, MapPin, PlayCircle } from 'lucide-react';
import { formatUrl, highlightText } from '../../utils/formatters';
import { SectionHeader } from './SectionHeader';
import { ExperienceBlock } from './ExperienceBlock';
import { ProjectBlock } from './ProjectBlock';
import { allocatePages, createRenderBlocks, RenderBlock } from '../../services/export/pageAllocator';
import { useResumeContext } from '../../contexts/ResumeContext';

interface ResumePaperProps {
  data: ResumeData;
  paddingTopBottom?: number;
  paddingLeftRight?: number;
  sectionSpacing?: number;
  itemSpacing?: number;
  showPageGuides?: boolean;
  enableAdaptiveFit?: boolean;
}

// Single block renderer reused across both measurement sandbox and final page canvases
const renderBlockItem = (
  block: RenderBlock,
  data: ResumeData,
  sectionSpacing: number,
  itemSpacing: number,
  handleOpenLink: (e: React.MouseEvent<HTMLAnchorElement>, rawUrl?: string) => void
) => {
  const gapStyle = {
    marginBottom: `${sectionSpacing * 16}px`
  };

  switch (block.type) {
    case 'header':
      return (
        <header style={gapStyle}>
          <div className="flex items-start gap-4">
            {data.photo && data.showPhoto !== false && (
              <div className="shrink-0">
                <img 
                  src={data.photo} 
                  alt={data.name} 
                  className="w-[96px] h-[96px] object-cover rounded-md-lg border border-resume-border shadow-sm bg-white"
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
              
              <div className="resume-contact-bar flex flex-wrap items-center gap-x-2 text-resume-meta text-resume-muted">
                {data.contact.website && (
                  <>
                    <a 
                      href={formatUrl(data.contact.website) || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => handleOpenLink(e, data.contact.website)}
                      className="resume-contact-item inline-flex items-center text-resume-accent font-medium hover:text-resume-primary transition-colors cursor-pointer group"
                    >
                      <span className="resume-contact-icon inline-flex items-center justify-center w-3.5 h-3.5 mr-1.5 shrink-0">
                        <Globe className="w-3.5 h-3.5 text-current shrink-0 block" />
                      </span>
                      <span className="resume-contact-text inline-block leading-[14px]">Portfolio</span>
                    </a>
                    <span className="text-resume-border select-none inline-flex items-center">•</span>
                  </>
                )}

                {data.contact.linkedin && (
                  <>
                    <a 
                      href={formatUrl(data.contact.linkedin) || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => handleOpenLink(e, data.contact.linkedin)}
                      className="resume-contact-item inline-flex items-center text-resume-accent font-medium hover:text-resume-primary transition-colors cursor-pointer group"
                    >
                      <span className="resume-contact-icon inline-flex items-center justify-center w-3.5 h-3.5 mr-1.5 shrink-0">
                        <Linkedin className="w-3.5 h-3.5 text-current shrink-0 block" />
                      </span>
                      <span className="resume-contact-text inline-block leading-[14px]">LinkedIn</span>
                    </a>
                    <span className="text-resume-border select-none inline-flex items-center">•</span>
                  </>
                )}

                {data.contact.videoPitch && (
                  <>
                    <a 
                      href={formatUrl(data.contact.videoPitch) || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => handleOpenLink(e, data.contact.videoPitch)}
                      className="resume-contact-item inline-flex items-center text-resume-accent font-medium hover:text-resume-primary transition-colors cursor-pointer group"
                    >
                      <span className="resume-contact-icon inline-flex items-center justify-center w-3.5 h-3.5 mr-1.5 shrink-0">
                        <PlayCircle className="w-3.5 h-3.5 text-current shrink-0 block" />
                      </span>
                      <span className="resume-contact-text inline-block leading-[14px]">Video Pitch</span>
                    </a>
                    <span className="text-resume-border select-none inline-flex items-center">•</span>
                  </>
                )}

                <a 
                  href={`mailto:${data.contact.email}`} 
                  className="resume-contact-item inline-flex items-center text-resume-accent font-medium hover:text-resume-primary transition-colors cursor-pointer group"
                >
                  <span className="resume-contact-icon inline-flex items-center justify-center w-3.5 h-3.5 mr-1.5 shrink-0">
                    <Mail className="w-3.5 h-3.5 text-current shrink-0 block" />
                  </span>
                  <span className="resume-contact-text inline-block leading-[14px]">{data.contact.email}</span>
                </a>
                
                {data.contact.location && (
                  <>
                    <span className="text-resume-border select-none inline-flex items-center">•</span>
                    <span className="resume-contact-item inline-flex items-center text-resume-muted cursor-default">
                      <span className="resume-contact-icon inline-flex items-center justify-center w-3.5 h-3.5 mr-1.5 shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-current shrink-0 block" />
                      </span>
                      <span className="resume-contact-text inline-block leading-[14px]">{data.contact.location}</span>
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
        <section style={gapStyle}>
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
        <SectionHeader title={block.title || ''} sectionSpacing={sectionSpacing} />
      );

    case 'experience-item':
      return (
        <ExperienceBlock item={block.item} spacing={itemSpacing} />
      );

    case 'project-item':
      return (
        <ProjectBlock item={block.item} spacing={itemSpacing} />
      );

    case 'skills-education':
      return (
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
      );

    default:
      return null;
  }
};

// Main Component
export const ResumePaper: React.FC<ResumePaperProps> = ({ 
  data,
  paddingTopBottom = 12.7,
  paddingLeftRight = 14,
  sectionSpacing = 1.0,
  itemSpacing = 1.0,
  showPageGuides = true,
  enableAdaptiveFit = true
}) => {
  const { setResumeHeight } = useResumeContext();
  const measureContainerRef = useRef<HTMLDivElement>(null);
  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number> | null>(null);

  if (!data) return <div className="p-8 text-center bg-md-surface-container-low rounded-md-lg text-md-on-surface-variant border border-white/[0.08]">No Data Loaded</div>;

  // A4 physical height is 297mm.
  // Net printable budget deducts top & bottom padding, and 6.0mm for footer and micro safety margin.
  const pageBudget = Math.max(100, 297 - (paddingTopBottom * 2) - 6.0);

  // Generate candidate blocks list for measuring & allocating
  const candidateBlocks = createRenderBlocks(data, sectionSpacing, itemSpacing, measuredHeights || undefined);

  // Measure Real DOM heights in hidden offscreen sandbox
  useLayoutEffect(() => {
    const container = measureContainerRef.current;
    if (!container) return;

    const contentWidthMm = 210 - (paddingLeftRight * 2);
    const containerWidthPx = container.getBoundingClientRect().width;
    if (containerWidthPx <= 0) return;
    const pxPerMm = containerWidthPx / contentWidthMm;

    const measured: Record<string, number> = {};
    const nodes = container.querySelectorAll<HTMLElement>('[data-measure-id]');
    let totalHeightPx = 0;

    nodes.forEach((node) => {
      const id = node.getAttribute('data-measure-id');
      if (!id) return;
      const rect = node.getBoundingClientRect();
      const firstChild = node.firstElementChild as HTMLElement | null;
      let extraMargin = 0;
      if (firstChild) {
        const style = window.getComputedStyle(firstChild);
        const mt = parseFloat(style.marginTop) || 0;
        const mb = parseFloat(style.marginBottom) || 0;
        extraMargin = mt + mb;
      }
      const blockPx = rect.height + extraMargin;
      totalHeightPx += blockPx;
      measured[id] = blockPx / pxPerMm;
    });

    if (setResumeHeight && totalHeightPx > 0) {
      setResumeHeight(totalHeightPx);
    }

    setMeasuredHeights((prev) => {
      if (!prev) return measured;
      let changed = false;
      for (const key in measured) {
        if (Math.abs((prev[key] || 0) - measured[key]) > 0.4) {
          changed = true;
          break;
        }
      }
      return changed ? measured : prev;
    });
  }, [data, paddingLeftRight, sectionSpacing, itemSpacing, setResumeHeight]);

  // Allocate pages using measured or calibrated heights with the Anti-Void Adaptive Engine
  const pages = allocatePages(
    data,
    sectionSpacing,
    itemSpacing,
    pageBudget,
    measuredHeights || undefined,
    { enableAdaptiveFit }
  );

  const handleOpenLink = useCallback((e: React.MouseEvent<HTMLAnchorElement>, rawUrl?: string) => {
    const url = formatUrl(rawUrl);
    if (!url || url === '#') {
      e.preventDefault();
      return;
    }
    try {
      const newTab = window.open(url, '_blank', 'noopener,noreferrer');
      if (newTab) {
        e.preventDefault();
      }
    } catch (err) {
      // Fall back to native anchor navigation
    }
  }, []);

  return (
    <>
      {/* Hidden Real-DOM Measurement Sandbox (Ensures 100% pixel-perfect physical geometry) */}
      <div 
        ref={measureContainerRef}
        aria-hidden="true"
        className="fixed -left-[99999px] top-0 pointer-events-none opacity-0 select-none overflow-hidden z-[-9999] print:hidden"
        style={{
          width: `${210 - (paddingLeftRight * 2)}mm`,
          boxSizing: 'border-box'
        }}
      >
        {candidateBlocks.map((block) => (
          <div key={block.id} data-measure-id={block.id} className="w-full">
            {renderBlockItem(block, data, sectionSpacing, itemSpacing, handleOpenLink)}
          </div>
        ))}
      </div>

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

        {pages.map((page, pageIdx) => {
          // Use page-specific effective spacing if adaptive anti-void micro-compression was applied
          const effectiveItem = page.effectiveItemSpacing ?? itemSpacing;
          const effectiveSection = page.effectiveSectionSpacing ?? sectionSpacing;

          return (
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
                {page.blocks.map((block) => (
                  <React.Fragment key={block.id}>
                    {renderBlockItem(block, data, effectiveSection, effectiveItem, handleOpenLink)}
                  </React.Fragment>
                ))}
              </div>

              {/* Math-Perfect Page Footer */}
              {showPageGuides && (
                <div className="resume-footer text-[8px] text-resume-muted font-mono flex justify-between border-t border-resume-border pt-1.5 mt-2 select-none print:flex">
                  <span className="uppercase tracking-wider font-semibold opacity-75">{data.name} — {data.title}</span>
                  <span className="font-bold">Page {pageIdx + 1} of {pages.length}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

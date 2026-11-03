import React, { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { ResumeData } from '../../types';
import { Globe, Linkedin, Mail, MapPin, PlayCircle } from 'lucide-react';
import { formatUrl, highlightText } from '../../utils/formatters';
import { SectionHeader } from './SectionHeader';
import { ExperienceBlock } from './ExperienceBlock';
import { ProjectBlock } from './ProjectBlock';
import { InlineEditable } from './InlineEditable';
import { allocatePages, createRenderBlocks, RenderBlock } from '../../services/export/pageAllocator';
import { useResumeContext } from '../../contexts/ResumeContext';
import { useTranslation } from '../../contexts/LanguageContext';

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
  handleOpenLink: (e: React.MouseEvent<HTMLAnchorElement>, rawUrl?: string) => void,
  isInlineEditing: boolean = false,
  onUpdateResume?: (updater: (prev: ResumeData) => ResumeData) => void
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
              <InlineEditable
                value={data.name}
                onChange={(newVal) => onUpdateResume?.(prev => ({ ...prev, name: newVal }))}
                enabled={isInlineEditing}
                tag="h1"
                className="font-display text-resume-name font-bold text-resume-primary mb-1 leading-tight block"
                style={{ fontFamily: 'var(--doc-font-heading, Outfit, sans-serif)' }}
                placeholder="Полное Имя"
                tooltip="Кликните для редактирования имени"
              />

              <InlineEditable
                value={data.title}
                onChange={(newVal) => onUpdateResume?.(prev => ({ ...prev, title: newVal }))}
                enabled={isInlineEditing}
                tag="h2"
                className="font-display text-resume-title font-medium text-resume-secondary mb-2.5 block"
                style={{ fontFamily: 'var(--doc-font-heading, Outfit, sans-serif)' }}
                placeholder="Профессия / Должность"
                tooltip="Кликните для редактирования должности"
              />
              
              <div className="resume-contact-bar flex flex-wrap items-center gap-y-1 text-resume-meta text-resume-muted">
                {data.contact.website && (
                  <>
                    <span 
                      className="resume-contact-item group cursor-pointer inline-flex items-center"
                      style={{ display: 'inline-table', verticalAlign: 'middle', borderCollapse: 'collapse', textDecoration: 'none' }}
                    >
                      <span 
                        className="resume-contact-icon text-resume-accent group-hover:text-resume-primary transition-colors" 
                        style={{ display: 'table-cell', verticalAlign: 'middle', width: '13px', paddingRight: '4px', lineHeight: 0 }}
                      >
                        <Globe style={{ display: 'block', width: '12px', height: '12px' }} />
                      </span>
                      <span 
                        className="resume-contact-text text-resume-accent group-hover:text-resume-primary transition-colors font-medium" 
                        style={{ display: 'table-cell', verticalAlign: 'middle', lineHeight: 1 }}
                      >
                        {isInlineEditing ? (
                          <InlineEditable
                            value={data.contact.website}
                            onChange={(newVal) => onUpdateResume?.(prev => ({ ...prev, contact: { ...prev.contact, website: newVal } }))}
                            enabled={true}
                            placeholder="URL портфолио"
                          />
                        ) : (
                          <a
                            href={formatUrl(data.contact.website) || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => handleOpenLink(e, data.contact.website)}
                            className="hover:underline"
                          >
                            Portfolio
                          </a>
                        )}
                      </span>
                    </span>
                    <span className="resume-contact-dot" style={{ display: 'inline-table', verticalAlign: 'middle', padding: '0 6px', color: 'var(--doc-border, #cbd5e1)', lineHeight: 1, userSelect: 'none' }}>•</span>
                  </>
                )}

                {data.contact.linkedin && (
                  <>
                    <span 
                      className="resume-contact-item group cursor-pointer inline-flex items-center"
                      style={{ display: 'inline-table', verticalAlign: 'middle', borderCollapse: 'collapse', textDecoration: 'none' }}
                    >
                      <span 
                        className="resume-contact-icon text-resume-accent group-hover:text-resume-primary transition-colors" 
                        style={{ display: 'table-cell', verticalAlign: 'middle', width: '13px', paddingRight: '4px', lineHeight: 0 }}
                      >
                        <Linkedin style={{ display: 'block', width: '12px', height: '12px' }} />
                      </span>
                      <span 
                        className="resume-contact-text text-resume-accent group-hover:text-resume-primary transition-colors font-medium" 
                        style={{ display: 'table-cell', verticalAlign: 'middle', lineHeight: 1 }}
                      >
                        {isInlineEditing ? (
                          <InlineEditable
                            value={data.contact.linkedin}
                            onChange={(newVal) => onUpdateResume?.(prev => ({ ...prev, contact: { ...prev.contact, linkedin: newVal } }))}
                            enabled={true}
                            placeholder="LinkedIn URL"
                          />
                        ) : (
                          <a
                            href={formatUrl(data.contact.linkedin) || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => handleOpenLink(e, data.contact.linkedin)}
                            className="hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                      </span>
                    </span>
                    <span className="resume-contact-dot" style={{ display: 'inline-table', verticalAlign: 'middle', padding: '0 6px', color: 'var(--doc-border, #cbd5e1)', lineHeight: 1, userSelect: 'none' }}>•</span>
                  </>
                )}

                {data.contact.videoPitch && (
                  <>
                    <span 
                      className="resume-contact-item group cursor-pointer inline-flex items-center"
                      style={{ display: 'inline-table', verticalAlign: 'middle', borderCollapse: 'collapse', textDecoration: 'none' }}
                    >
                      <span 
                        className="resume-contact-icon text-resume-accent group-hover:text-resume-primary transition-colors" 
                        style={{ display: 'table-cell', verticalAlign: 'middle', width: '13px', paddingRight: '4px', lineHeight: 0 }}
                      >
                        <PlayCircle style={{ display: 'block', width: '12px', height: '12px' }} />
                      </span>
                      <span 
                        className="resume-contact-text text-resume-accent group-hover:text-resume-primary transition-colors font-medium" 
                        style={{ display: 'table-cell', verticalAlign: 'middle', lineHeight: 1 }}
                      >
                        {isInlineEditing ? (
                          <InlineEditable
                            value={data.contact.videoPitch}
                            onChange={(newVal) => onUpdateResume?.(prev => ({ ...prev, contact: { ...prev.contact, videoPitch: newVal } }))}
                            enabled={true}
                            placeholder="Video Pitch URL"
                          />
                        ) : (
                          <a
                            href={formatUrl(data.contact.videoPitch) || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => handleOpenLink(e, data.contact.videoPitch)}
                            className="hover:underline"
                          >
                            Video Pitch
                          </a>
                        )}
                      </span>
                    </span>
                    <span className="resume-contact-dot" style={{ display: 'inline-table', verticalAlign: 'middle', padding: '0 6px', color: 'var(--doc-border, #cbd5e1)', lineHeight: 1, userSelect: 'none' }}>•</span>
                  </>
                )}

                <span 
                  className="resume-contact-item group cursor-pointer inline-flex items-center"
                  style={{ display: 'inline-table', verticalAlign: 'middle', borderCollapse: 'collapse', textDecoration: 'none' }}
                >
                  <span 
                    className="resume-contact-icon text-resume-accent group-hover:text-resume-primary transition-colors" 
                    style={{ display: 'table-cell', verticalAlign: 'middle', width: '13px', paddingRight: '4px', lineHeight: 0 }}
                  >
                    <Mail style={{ display: 'block', width: '12px', height: '12px' }} />
                  </span>
                  <span 
                    className="resume-contact-text text-resume-accent group-hover:text-resume-primary transition-colors font-medium" 
                    style={{ display: 'table-cell', verticalAlign: 'middle', lineHeight: 1 }}
                  >
                    <InlineEditable
                      value={data.contact.email}
                      onChange={(newVal) => onUpdateResume?.(prev => ({ ...prev, contact: { ...prev.contact, email: newVal } }))}
                      enabled={isInlineEditing}
                      placeholder="email@example.com"
                    />
                  </span>
                </span>
                
                {data.contact.location && (
                  <>
                    <span className="resume-contact-dot" style={{ display: 'inline-table', verticalAlign: 'middle', padding: '0 6px', color: 'var(--doc-border, #cbd5e1)', lineHeight: 1, userSelect: 'none' }}>•</span>
                    <span 
                      className="resume-contact-item text-resume-muted cursor-default inline-flex items-center"
                      style={{ display: 'inline-table', verticalAlign: 'middle', borderCollapse: 'collapse' }}
                    >
                      <span 
                        className="resume-contact-icon" 
                        style={{ display: 'table-cell', verticalAlign: 'middle', width: '13px', paddingRight: '4px', lineHeight: 0 }}
                      >
                        <MapPin style={{ display: 'block', width: '12px', height: '12px' }} />
                      </span>
                      <span 
                        className="resume-contact-text" 
                        style={{ display: 'table-cell', verticalAlign: 'middle', lineHeight: 1 }}
                      >
                        <InlineEditable
                          value={data.contact.location}
                          onChange={(newVal) => onUpdateResume?.(prev => ({ ...prev, contact: { ...prev.contact, location: newVal } }))}
                          enabled={isInlineEditing}
                          placeholder="Город, Страна"
                        />
                      </span>
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
               <React.Fragment key={i}>
                 {isInlineEditing ? (
                   <InlineEditable
                     value={para}
                     onChange={(newVal) => onUpdateResume?.(prev => {
                       const arr = Array.isArray(prev.summary) ? [...prev.summary] : [prev.summary];
                       arr[i] = newVal;
                       return { ...prev, summary: arr };
                     })}
                     enabled={true}
                     multiline={true}
                     tag="p"
                     className={`mb-1.5 ${i > 0 ? "mt-1" : ""}`}
                     placeholder="Текст резюме / Summary"
                   />
                 ) : (
                   <span className={i > 0 ? "ml-1" : ""}>{highlightText(para)} </span>
                 )}
               </React.Fragment>
             )) : (
               isInlineEditing ? (
                 <InlineEditable
                   value={data.summary as unknown as string}
                   onChange={(newVal) => onUpdateResume?.(prev => ({ ...prev, summary: [newVal] }))}
                   enabled={true}
                   multiline={true}
                   tag="p"
                   placeholder="Текст резюме / Summary"
                 />
               ) : (
                 <span>{highlightText(data.summary as unknown as string)} </span>
               )
             )}
          </div>
        </section>
      );

    case 'section-header':
      return (
        <SectionHeader title={block.title || ''} sectionSpacing={sectionSpacing} />
      );

    case 'experience-item': {
      const expIdx = parseInt(block.id.replace('experience-', ''), 10);
      return (
        <ExperienceBlock 
          item={block.item} 
          spacing={itemSpacing} 
          isInlineEditing={isInlineEditing}
          onUpdateRole={(val) => onUpdateResume?.(prev => {
            const exp = [...prev.experience];
            if (exp[expIdx]) exp[expIdx] = { ...exp[expIdx], role: val };
            return { ...prev, experience: exp };
          })}
          onUpdateCompany={(val) => onUpdateResume?.(prev => {
            const exp = [...prev.experience];
            if (exp[expIdx]) exp[expIdx] = { ...exp[expIdx], company: val };
            return { ...prev, experience: exp };
          })}
          onUpdateDuration={(val) => onUpdateResume?.(prev => {
            const exp = [...prev.experience];
            if (exp[expIdx]) exp[expIdx] = { ...exp[expIdx], duration: val };
            return { ...prev, experience: exp };
          })}
          onUpdateHighlightTitle={(hIdx, val) => onUpdateResume?.(prev => {
            const exp = [...prev.experience];
            if (exp[expIdx] && exp[expIdx].highlights[hIdx]) {
              const highlights = [...exp[expIdx].highlights];
              highlights[hIdx] = { ...highlights[hIdx], title: val };
              exp[expIdx] = { ...exp[expIdx], highlights };
            }
            return { ...prev, experience: exp };
          })}
          onUpdateHighlightDesc={(hIdx, val) => onUpdateResume?.(prev => {
            const exp = [...prev.experience];
            if (exp[expIdx] && exp[expIdx].highlights[hIdx]) {
              const highlights = [...exp[expIdx].highlights];
              highlights[hIdx] = { ...highlights[hIdx], description: val };
              exp[expIdx] = { ...exp[expIdx], highlights };
            }
            return { ...prev, experience: exp };
          })}
        />
      );
    }

    case 'project-item': {
      const projIdx = parseInt(block.id.replace('project-', ''), 10);
      return (
        <ProjectBlock 
          item={block.item} 
          spacing={itemSpacing} 
          isInlineEditing={isInlineEditing}
          onUpdateTitle={(val) => onUpdateResume?.(prev => {
            const proj = [...prev.projects];
            if (proj[projIdx]) proj[projIdx] = { ...proj[projIdx], title: val };
            return { ...prev, projects: proj };
          })}
          onUpdateRole={(val) => onUpdateResume?.(prev => {
            const proj = [...prev.projects];
            if (proj[projIdx]) proj[projIdx] = { ...proj[projIdx], role: val };
            return { ...prev, projects: proj };
          })}
          onUpdateDescription={(val) => onUpdateResume?.(prev => {
            const proj = [...prev.projects];
            if (proj[projIdx]) proj[projIdx] = { ...proj[projIdx], description: val };
            return { ...prev, projects: proj };
          })}
          onUpdateDetailLabel={(dIdx, val) => onUpdateResume?.(prev => {
            const proj = [...prev.projects];
            if (proj[projIdx] && proj[projIdx].details[dIdx]) {
              const details = [...proj[projIdx].details];
              details[dIdx] = { ...details[dIdx], label: val };
              proj[projIdx] = { ...proj[projIdx], details };
            }
            return { ...prev, projects: proj };
          })}
          onUpdateDetailValue={(dIdx, val) => onUpdateResume?.(prev => {
            const proj = [...prev.projects];
            if (proj[projIdx] && proj[projIdx].details[dIdx]) {
              const details = [...proj[projIdx].details];
              details[dIdx] = { ...details[dIdx], value: val };
              proj[projIdx] = { ...proj[projIdx], details };
            }
            return { ...prev, projects: proj };
          })}
        />
      );
    }

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
                      <span className="font-bold text-resume-primary text-[9.5pt] uppercase mr-2">
                        <InlineEditable
                          value={category}
                          onChange={(newCategory) => onUpdateResume?.(prev => {
                            const newSkills: Record<string, string> = {};
                            for (const [k, v] of Object.entries(prev.skills || {})) {
                              if (k === category) {
                                newSkills[newCategory] = v;
                              } else {
                                newSkills[k] = v;
                              }
                            }
                            return { ...prev, skills: newSkills };
                          })}
                          enabled={isInlineEditing}
                          placeholder="Категория"
                        />:
                      </span>
                      <InlineEditable
                        value={skills}
                        onChange={(newVal) => onUpdateResume?.(prev => ({
                          ...prev,
                          skills: { ...prev.skills, [category]: newVal }
                        }))}
                        enabled={isInlineEditing}
                        className="text-resume-secondary"
                        placeholder="Навыки через запятую"
                      />
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
                    <div className="font-bold text-resume-primary text-[10pt]">
                      <InlineEditable
                        value={edu.certification}
                        onChange={(newVal) => onUpdateResume?.(prev => {
                          const edus = [...prev.education];
                          edus[idx] = { ...edus[idx], certification: newVal };
                          return { ...prev, education: edus };
                        })}
                        enabled={isInlineEditing}
                        placeholder="Специальность / Сертификат"
                      />
                    </div>
                    <div className="text-resume-meta text-resume-muted">
                      <InlineEditable
                        value={edu.institution}
                        onChange={(newVal) => onUpdateResume?.(prev => {
                          const edus = [...prev.education];
                          edus[idx] = { ...edus[idx], institution: newVal };
                          return { ...prev, education: edus };
                        })}
                        enabled={isInlineEditing}
                        placeholder="Учебное заведение"
                      />
                      {' | '}
                      <InlineEditable
                        value={edu.year}
                        onChange={(newVal) => onUpdateResume?.(prev => {
                          const edus = [...prev.education];
                          edus[idx] = { ...edus[idx], year: newVal };
                          return { ...prev, education: edus };
                        })}
                        enabled={isInlineEditing}
                        placeholder="Год"
                      />
                    </div>
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
  const { setResumeHeight, styleSettings, isInlineEditing, handleUpdateResumeData } = useResumeContext();
  const { t } = useTranslation();
  const measureContainerRef = useRef<HTMLDivElement>(null);
  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number> | null>(null);

  const onUpdateResume = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    const nextData = updater(data);
    handleUpdateResumeData(nextData);
  }, [data, handleUpdateResumeData]);

  const docCssVars: React.CSSProperties = {
    ['--doc-text-primary' as any]: styleSettings?.primaryColor || '#1e293b',
    ['--doc-text-secondary' as any]: styleSettings?.secondaryColor || '#475569',
    ['--doc-accent' as any]: styleSettings?.accentColor || '#6750a4',
    ['--doc-border' as any]: styleSettings?.borderColor || '#e2e8f0',
    ['--doc-paper' as any]: styleSettings?.paperBackground || '#ffffff',
    ['--doc-font-heading' as any]: styleSettings?.headingFont || 'Outfit, sans-serif',
    ['--doc-font-body' as any]: styleSettings?.bodyFont || 'Inter, sans-serif',
    fontFamily: styleSettings?.bodyFont || 'Inter, sans-serif',
  };

  const fontScaleStyle: React.CSSProperties = {
    fontSize: styleSettings?.fontScale === 'compact' ? '9.5pt' : styleSettings?.fontScale === 'spacious' ? '10.5pt' : '10pt',
  };

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
          boxSizing: 'border-box',
          ...docCssVars,
          ...fontScaleStyle
        }}
      >
        {candidateBlocks.map((block) => (
          <div key={block.id} data-measure-id={block.id} className="w-full">
            {renderBlockItem(block, data, sectionSpacing, itemSpacing, handleOpenLink, false)}
          </div>
        ))}
      </div>

      <div 
        id="resume-content" 
        className="flex flex-col gap-8 print:gap-0 bg-transparent print:bg-white pb-16 print:pb-0 relative z-0"
        style={docCssVars}
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
              className={`resume-page shadow-xl mx-auto rounded-md relative flex flex-col justify-between transition-all duration-200 ${
                isInlineEditing ? 'ring-2 ring-emerald-500/30' : ''
              }`}
              style={{
                width: '210mm',
                height: '297mm', // Strict physical A4 page size
                paddingTop: `${paddingTopBottom}mm`,
                paddingBottom: `${paddingTopBottom}mm`,
                paddingLeft: `${paddingLeftRight}mm`,
                paddingRight: `${paddingLeftRight}mm`,
                backgroundColor: styleSettings?.paperBackground || '#ffffff',
                boxSizing: 'border-box' as const,
                overflow: 'hidden' as const,
                ...docCssVars,
                ...fontScaleStyle
              }}
            >
              {/* Main Content Area */}
              <div className="flex flex-col flex-1">
                {page.blocks.map((block) => (
                  <React.Fragment key={block.id}>
                    {renderBlockItem(
                      block, 
                      data, 
                      effectiveSection, 
                      effectiveItem, 
                      handleOpenLink, 
                      isInlineEditing, 
                      onUpdateResume
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Math-Perfect Page Footer */}
              {showPageGuides && (
                <div className="resume-footer text-[8px] text-resume-muted font-mono flex justify-between border-t border-resume-border pt-1.5 mt-2 select-none print:flex">
                  <span className="uppercase tracking-wider font-semibold opacity-75">{data.name} — {data.title}</span>
                  <span className="font-bold">{t.canvas.page} {pageIdx + 1} {t.canvas.of} {pages.length}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

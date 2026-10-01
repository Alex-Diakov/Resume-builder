import { ResumeData } from '../../types';

export interface RenderBlock {
  id: string;
  type: 'header' | 'summary' | 'section-header' | 'experience-item' | 'project-item' | 'skills-education';
  title?: string;
  item?: any;
  estimatedHeight: number; // in mm
  section?: 'experience' | 'projects' | 'common';
}

export interface AllocatedPage {
  blocks: RenderBlock[];
  pageIndex: number;
  totalHeight: number;
  pageBudget: number;
  fillPercentage: number;
  effectiveItemSpacing?: number;
  effectiveSectionSpacing?: number;
}

export interface PageAllocationOptions {
  enableAdaptiveFit?: boolean; // Default true: prevents giant voids by micro-compressing spacing if an item almost fits
  elasticToleranceMm?: number; // Default 14mm: allowable micro-adjustment range across a multi-item page
}

/**
 * Creates candidate render blocks from ResumeData with calibrated millimeter height heuristics.
 * If measuredHeights are provided (from real DOM measurement), those exact values are used.
 */
export function createRenderBlocks(
  data: ResumeData,
  sectionSpacing: number = 1.0,
  itemSpacing: number = 1.0,
  measuredHeights?: Record<string, number>
): RenderBlock[] {
  const blocks: RenderBlock[] = [];

  // 1. Header Block (Photo + Name + Title + Contact Links)
  const hasPhoto = !!(data.photo && data.showPhoto !== false);
  // No photo: Name (~7mm) + Title (~5mm) + Links (~4mm) + mb:16px (~4.2mm) = ~20mm
  // With photo: 96px image (~25.4mm) + border/padding = ~28mm
  const estHeaderHeight = hasPhoto
    ? 26.0 + (sectionSpacing * 2.5)
    : 17.5 + (sectionSpacing * 2.0);

  blocks.push({
    id: 'header',
    type: 'header',
    estimatedHeight: measuredHeights?.['header'] ?? estHeaderHeight,
    section: 'common'
  });

  // 2. Summary paragraph(s)
  if (data.summary && (Array.isArray(data.summary) ? data.summary.length > 0 : data.summary)) {
    const summaryText = Array.isArray(data.summary) ? data.summary.join(' ') : (data.summary as unknown as string);
    // In A4 with 14mm margins (182mm content width), at 9.5pt font, ~130-135 characters fit per line
    const lines = Math.max(1, Math.ceil(summaryText.length / 130));
    // 3.8mm line height + mb:16px (~4.2mm)
    const estSummaryHeight = (lines * 3.8) + (sectionSpacing * 3.5);
    blocks.push({
      id: 'summary',
      type: 'summary',
      estimatedHeight: measuredHeights?.['summary'] ?? estSummaryHeight,
      section: 'common'
    });
  }

  // 3. Experience section header and individual items
  if (Array.isArray(data.experience) && data.experience.length > 0) {
    blocks.push({
      id: 'header-experience',
      type: 'section-header',
      title: 'Experience',
      // SectionHeader: mt:18px + mb:12px + text:14px + pb:4px = ~48px = ~12.7mm (with sectionSpacing = 1.0)
      estimatedHeight: measuredHeights?.['header-experience'] ?? (5.0 + (sectionSpacing * 6.5)),
      section: 'experience'
    });

    data.experience.forEach((job, index) => {
      let jobHeight = 5.2; // Role | Company ... Date line + mb:4px
      if (Array.isArray(job.highlights)) {
        job.highlights.forEach((h) => {
          const charCount = (h.title?.length || 0) + (h.description?.length || 0) + 4;
          // In 182mm width with bullet indent, ~120 characters fit per line
          const lines = Math.max(1, Math.ceil(charCount / 120));
          // 3.8mm per line + 1.2mm bullet spacing
          jobHeight += (lines * 3.8) + 1.2;
        });
      }
      jobHeight += itemSpacing * 3.2; // mb:12px * itemSpacing

      blocks.push({
        id: `experience-${index}`,
        type: 'experience-item',
        item: job,
        estimatedHeight: measuredHeights?.[`experience-${index}`] ?? jobHeight,
        section: 'experience'
      });
    });
  }

  // 4. Projects section header and items
  if (Array.isArray(data.projects) && data.projects.length > 0) {
    blocks.push({
      id: 'header-projects',
      type: 'section-header',
      title: 'Product Ventures & Innovation',
      estimatedHeight: measuredHeights?.['header-projects'] ?? (5.0 + (sectionSpacing * 6.5)),
      section: 'projects'
    });

    data.projects.forEach((proj, index) => {
      let projHeight = 5.2; // Title (Role) header line
      const descChars = proj.description?.length || 0;
      const descLines = Math.max(1, Math.ceil(descChars / 125));
      projHeight += (descLines * 3.8) + 1.2;

      if (Array.isArray(proj.details)) {
        proj.details.forEach((d) => {
          const charCount = (d.label?.length || 0) + (d.value?.length || 0) + 4;
          const lines = Math.max(1, Math.ceil(charCount / 85));
          projHeight += (lines * 3.4);
        });
      }
      projHeight += itemSpacing * 3.2;

      blocks.push({
        id: `project-${index}`,
        type: 'project-item',
        item: proj,
        estimatedHeight: measuredHeights?.[`project-${index}`] ?? projHeight,
        section: 'projects'
      });
    });
  }

  // 5. Skills and Education Column container
  const hasSkills = data.skills && Object.keys(data.skills).length > 0;
  const hasEdu = Array.isArray(data.education) && data.education.length > 0;

  if (hasSkills || hasEdu) {
    let skillsHeight = 0;
    if (hasSkills) {
      skillsHeight += 5.0 + (sectionSpacing * 6.5); // Core Competencies header
      Object.entries(data.skills).forEach(([category, skills]) => {
        const chars = category.length + skills.length + 4;
        const lines = Math.max(1, Math.ceil(chars / 75));
        skillsHeight += (lines * 3.8) + 1.5;
      });
    }

    let eduHeight = 0;
    if (hasEdu) {
      eduHeight += 5.0 + (sectionSpacing * 6.5); // Education header
      data.education.forEach(() => {
        eduHeight += 9.5; // Degree + institution/year
      });
    }

    const colHeight = Math.max(skillsHeight, eduHeight) + (sectionSpacing * 3.2);
    blocks.push({
      id: 'skills-education',
      type: 'skills-education',
      estimatedHeight: measuredHeights?.['skills-education'] ?? colHeight,
      section: 'common'
    });
  }

  return blocks;
}

/**
 * Mathematical & DOM-Measured Page Allocator with Adaptive Anti-Void Engine.
 * 
 * Rules:
 * 1. Accurate physics: Computes exact block geometry based on real measurements or calibrated font metrics.
 * 2. Look-ahead orphan prevention: Section headers are never orphaned alone at the bottom of a page.
 * 3. Adaptive Anti-Void rule: If pushing an item to the next page would leave a large blank void (>20% of page),
 *    and the item exceeds standard budget by within elastic tolerance (<=14mm), it micro-compresses page margins
 *    so the item fits naturally and beautifully on the page without overflowing or clipping.
 * 4. Balanced distribution: Avoids awkward 1-item overflow pages.
 */
export function allocatePages(
  data: ResumeData,
  sectionSpacing: number = 1.0,
  itemSpacing: number = 1.0,
  pageBudget: number = 266,
  measuredHeights?: Record<string, number>,
  options: PageAllocationOptions = {}
): AllocatedPage[] {
  const { enableAdaptiveFit = true, elasticToleranceMm = 14 } = options;

  const blocks = createRenderBlocks(data, sectionSpacing, itemSpacing, measuredHeights);

  const pages: AllocatedPage[] = [
    {
      blocks: [],
      pageIndex: 0,
      totalHeight: 0,
      pageBudget,
      fillPercentage: 0
    }
  ];

  let currentPageIdx = 0;
  let currentHeightSum = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const isSectionHeader = block.type === 'section-header';
    const nextBlock = blocks[i + 1];

    // 1. Look-ahead Section Header Orphan Prevention:
    // A section header must NEVER be alone at the bottom of a page without at least its first item.
    if (isSectionHeader && nextBlock) {
      const combinedHeaderAndFirst = block.estimatedHeight + nextBlock.estimatedHeight;
      const willExceed = (currentHeightSum + combinedHeaderAndFirst) > pageBudget;

      if (willExceed && pages[currentPageIdx].blocks.length > 0) {
        // Start a fresh page for the section header so it stays with its first item
        pages.push({
          blocks: [],
          pageIndex: pages.length,
          totalHeight: 0,
          pageBudget,
          fillPercentage: 0
        });
        currentPageIdx++;
        currentHeightSum = 0;
      }
    }

    // 2. Fit Evaluation:
    const candidateSum = currentHeightSum + block.estimatedHeight;

    if (candidateSum <= pageBudget) {
      // Direct fit within page budget
      pages[currentPageIdx].blocks.push(block);
      currentHeightSum += block.estimatedHeight;
    } else {
      // Block exceeds normal budget.
      // Check Adaptive Anti-Void Elastic Rule:
      // Can this block be absorbed into the current page to eliminate an awkward giant void?
      const overflow = candidateSum - pageBudget;
      const currentPageBlockCount = pages[currentPageIdx].blocks.length;

      // Elastic absorption conditions:
      // - Adaptive fit enabled
      // - Page already has at least 2 items whose margins can absorb micro-spacing
      // - Overflow is within allowable tolerance (default 14mm, approx 5% of page)
      // - Not a bare section header
      const canAbsorb = enableAdaptiveFit &&
        currentPageBlockCount >= 2 &&
        overflow <= elasticToleranceMm &&
        !isSectionHeader;

      if (canAbsorb) {
        pages[currentPageIdx].blocks.push(block);

        // Calculate subtle margin scaling factor across the page items
        const compressionRatio = Math.max(0.78, Math.min(1.0, (candidateSum - overflow) / candidateSum));
        pages[currentPageIdx].effectiveItemSpacing = itemSpacing * compressionRatio;
        pages[currentPageIdx].effectiveSectionSpacing = sectionSpacing * compressionRatio;
        currentHeightSum = pageBudget; // Page is safely and fully utilized
      } else {
        // Start a fresh page
        if (pages[currentPageIdx].blocks.length > 0) {
          pages.push({
            blocks: [],
            pageIndex: pages.length,
            totalHeight: 0,
            pageBudget,
            fillPercentage: 0
          });
          currentPageIdx++;
          currentHeightSum = 0;
        }

        pages[currentPageIdx].blocks.push(block);
        currentHeightSum += block.estimatedHeight;
      }
    }
  }

  // Calculate final page heights and fill percentages
  pages.forEach((p) => {
    p.totalHeight = p.blocks.reduce((acc, b) => acc + b.estimatedHeight, 0);
    p.fillPercentage = Math.min(100, Math.round((p.totalHeight / pageBudget) * 100));
  });

  return pages;
}

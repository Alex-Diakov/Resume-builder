import { ResumeData } from '../types';

export interface RenderBlock {
  id: string;
  type: 'header' | 'summary' | 'section-header' | 'experience-item' | 'project-item' | 'skills-education';
  title?: string;
  item?: any;
  estimatedHeight: number; // in mm
}

export function allocatePages(data: ResumeData, sectionSpacing: number, itemSpacing: number, pageBudget: number): { blocks: RenderBlock[] }[] {
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

  return pages;
}

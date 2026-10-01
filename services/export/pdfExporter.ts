import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '../../types';

export interface PdfExportOptions {
  compress: boolean;
  quality: number; // 0.1 to 1.0
}

export interface CompressionProfile {
  name: string;
  imageType: 'image/png' | 'image/jpeg';
  pdfFormat: 'PNG' | 'JPEG';
  quality: number;
  scale: number;
  expectedSavings: string;
  estimatedSize: string;
}

export function getCompressionProfile(compress: boolean, quality: number, pageCount: number = 2): CompressionProfile {
  if (!compress) {
    const minKb = pageCount * 350;
    const maxKb = pageCount * 450;
    return {
      name: 'Lossless Vector-Grade (PNG)',
      imageType: 'image/png',
      pdfFormat: 'PNG',
      quality: 1.0,
      scale: 2.0,
      expectedSavings: '0%',
      estimatedSize: `~${(minKb / 1024).toFixed(1)} - ${(maxKb / 1024).toFixed(1)} MB`
    };
  }

  if (quality >= 0.8) {
    // High-Res JPEG: 2.0x DPI scale, 0.88 quality
    const minKb = pageCount * 300;
    const maxKb = pageCount * 380;
    return {
      name: 'High Fidelity (JPEG 88%)',
      imageType: 'image/jpeg',
      pdfFormat: 'JPEG',
      quality: 0.88,
      scale: 2.0,
      expectedSavings: '~20 - 25%',
      estimatedSize: `~${minKb} - ${maxKb} KB`
    };
  }

  if (quality >= 0.6) {
    // Balanced: 2.0x DPI scale, 0.72 quality
    const minKb = pageCount * 200;
    const maxKb = pageCount * 260;
    return {
      name: 'Balanced ATS (JPEG 72%)',
      imageType: 'image/jpeg',
      pdfFormat: 'JPEG',
      quality: 0.72,
      scale: 2.0,
      expectedSavings: '~45 - 50%',
      estimatedSize: `~${minKb} - ${maxKb} KB`
    };
  }

  // Smallest / Compact: 1.5x DPI scale, 0.55 quality
  const minKb = pageCount * 110;
  const maxKb = pageCount * 140;
  return {
    name: 'Compact Email-Ready (JPEG 55%)',
    imageType: 'image/jpeg',
    pdfFormat: 'JPEG',
    quality: 0.55,
    scale: 1.5,
    expectedSavings: '~70 - 75%',
    estimatedSize: `~${minKb} - ${maxKb} KB`
  };
}

export function generatePdfFileName(resumeData: ResumeData): string {
  const rawFullName = (resumeData.name || 'Resume').trim();
  const nameParts = rawFullName.split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const rawTitleAndBusiness = (resumeData.title || '').trim();
  let titlePart = rawTitleAndBusiness;
  let businessTypePart = '';

  const dividers = ['|', '—', '-', ','];
  for (const div of dividers) {
    if (rawTitleAndBusiness.includes(div)) {
      const parts = rawTitleAndBusiness.split(div);
      titlePart = parts[0].trim();
      businessTypePart = parts.slice(1).join(' ').trim();
      break;
    }
  }

  const cleanFirst = firstName.replace(/[^a-zA-Z0-9а-яА-Я-]/g, '').trim();
  const cleanLast = lastName.replace(/[^a-zA-Z0-9а-яА-Я- ]/g, '').replace(/\s+/g, '_').trim();
  const cleanTitle = titlePart.replace(/[^a-zA-Z0-9а-яА-Я- ]/g, '').replace(/\s+/g, '_').trim();
  const cleanBusiness = businessTypePart.replace(/[^a-zA-Z0-9а-яА-Я- ]/g, '').replace(/\s+/g, '_').trim();

  let nameStr = '';
  if (cleanFirst) nameStr += cleanFirst;
  if (cleanLast) nameStr += (nameStr ? `_${cleanLast}` : cleanLast);
  if (cleanTitle) nameStr += (nameStr ? `_${cleanTitle}` : cleanTitle);
  if (cleanBusiness) nameStr += (nameStr ? `_${cleanBusiness}` : cleanBusiness);

  return `${nameStr || 'Resume'}.pdf`;
}

export async function exportToPdf(
  resumeData: ResumeData,
  options: PdfExportOptions
): Promise<void> {
  // Ensure web fonts are completely loaded and rendered prior to pixel rasterization
  await document.fonts.ready;

  const element = document.getElementById('resume-content');
  if (!element) {
    throw new Error('Resume content element not found in DOM');
  }

  const pageElements = Array.from(element.querySelectorAll<HTMLElement>('.resume-page'));
  if (pageElements.length === 0) {
    throw new Error('No resume pages found to export');
  }

  // Profile configuration based on mathematical compression parameters
  const profile = getCompressionProfile(options.compress, options.quality, pageElements.length);
  const fileName = generatePdfFileName(resumeData);

  // Initialize jsPDF with standard physical A4 (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true, // internal lossless stream compression for PDF objects
  });

  // Temporarily hide visual guide elements
  const guides = element.querySelectorAll<HTMLElement>('.page-guide-indicator');
  const previousGuidesDisplay: string[] = [];
  guides.forEach((g, i) => {
    previousGuidesDisplay[i] = g.style.display;
    g.style.display = 'none';
  });

  try {
    for (let pageIdx = 0; pageIdx < pageElements.length; pageIdx++) {
      const pageEl = pageElements[pageIdx];

      // If not the first page, add a new A4 page to the document
      if (pageIdx > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Temporarily remove preview shadow and border radius for clean vector-edge PDF margins
      const originalClassName = pageEl.className;
      pageEl.classList.remove('shadow-xl', 'rounded-md');

      let canvas: HTMLCanvasElement;
      try {
        // Render the discrete page container to canvas with isolated subpixel boundaries
        canvas = await html2canvas(pageEl, {
          scale: profile.scale,
          useCORS: true,
          backgroundColor: '#ffffff', // Ensures JPEG does not produce dark alpha artifacts
          logging: false,
          scrollY: 0,
          scrollX: 0,
          windowWidth: 1200, // Guarantees desktop layout breakpoints regardless of current viewport size
          onclone: (clonedDoc) => {
            // ISOLATED PDF EXPORT ALIGNMENT GUARD:
            // In browser DOM, flexbox items-center vertically centers the 14px SVG and 12.67px text.
            // However, html2canvas renders text via ctx.fillText at (bounds.top + fontMetrics.baseline)
            // using alphabetic baseline (~21px for Plus Jakarta Sans), while SVG replaced elements
            // are rendered via ctx.drawImage directly at bounds.top.
            // Without compensation in html2canvas, SVG icons render ~7.5px too high relative to text.
            // By shifting .resume-contact-icon in clonedDoc only, we ensure the exported PDF has
            // subpixel-perfect vertical alignment between icons, text, and bullet dots without
            // affecting the live UI or browser print styles.
            const contactIcons = clonedDoc.querySelectorAll<HTMLElement>('.resume-contact-icon');
            contactIcons.forEach((icon) => {
              icon.style.position = 'relative';
              icon.style.top = '7.5px';
            });
          },
        });
      } finally {
        pageEl.className = originalClassName;
      }

      // Compress or format image according to profile
      const imageData = canvas.toDataURL(profile.imageType, profile.quality);

      // Add image mapping exactly to 210mm x 297mm physical A4 dimensions
      pdf.addImage(
        imageData,
        profile.pdfFormat,
        0,
        0,
        210,
        297,
        undefined,
        'FAST'
      );

      // 1. Inject clickable native PDF links (Portfolio, LinkedIn, Email, Projects, etc.)
      injectClickableLinks(pdf, pageEl);

      // 2. Inject invisible, selectable & searchable text layer for cursor highlight, copy-paste, and ATS
      injectSelectableTextLayer(pdf, pageEl);
    }

    // Save output PDF file
    pdf.save(fileName);

    // Track export metric
    try {
      const currentCount = parseInt(localStorage.getItem('resume_download_count') || '0', 10);
      localStorage.setItem('resume_download_count', (currentCount + 1).toString());
      window.dispatchEvent(new Event('resume_downloaded'));
    } catch (e) {
      console.warn('Unable to record download telemetry', e);
    }
  } finally {
    // Restore guide indicators
    guides.forEach((g, i) => {
      g.style.display = previousGuidesDisplay[i] || '';
    });
  }
}

/**
 * Injects clickable native PDF hyperlink annotations for all <a> elements on the page.
 * Coordinates are converted to physical A4 millimeters (210mm x 297mm).
 */
function injectClickableLinks(pdf: jsPDF, pageEl: HTMLElement): void {
  const links = Array.from(pageEl.querySelectorAll<HTMLAnchorElement>('a[href]'));
  if (links.length === 0) return;

  const pageRect = pageEl.getBoundingClientRect();
  if (pageRect.width === 0 || pageRect.height === 0) return;

  const scaleX = 210 / pageRect.width;
  const scaleY = 297 / pageRect.height;

  for (const a of links) {
    const rect = a.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    let href = a.getAttribute('href') || a.href;
    if (!href || href === '#' || href.startsWith('javascript:')) continue;

    // Normalize URL
    if (!href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('http://') && !href.startsWith('https://')) {
      href = `https://${href}`;
    }

    const x = (rect.left - pageRect.left) * scaleX;
    const y = (rect.top - pageRect.top) * scaleY;
    const w = rect.width * scaleX;
    const h = rect.height * scaleY;

    try {
      pdf.link(x, y, w, h, { url: href });
    } catch (e) {
      console.warn('Could not inject PDF link:', href, e);
    }
  }
}

/**
 * Injects an invisible, selectable, and searchable text layer matching the exact geometry
 * and font size of DOM text elements. Uses PDF renderingMode 'invisible' (3 Tr).
 * This enables text highlighting, copy-pasting, Ctrl+F searching, and ATS parsing in any PDF viewer.
 */
function injectSelectableTextLayer(pdf: jsPDF, pageEl: HTMLElement): void {
  const pageRect = pageEl.getBoundingClientRect();
  if (pageRect.width === 0 || pageRect.height === 0) return;

  const scaleX = 210 / pageRect.width;
  const scaleY = 297 / pageRect.height;

  const walker = document.createTreeWalker(pageEl, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!node.textContent || !node.textContent.trim()) {
        return NodeFilter.FILTER_REJECT;
      }
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      // Skip hidden guide indicators or invisible overlay markers
      if (parent.closest('.pointer-events-none') || parent.closest('.page-guide-indicator')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.textContent;
    if (!text || !text.trim()) continue;

    const parent = node.parentElement;
    if (!parent) continue;

    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = Array.from(range.getClientRects());
    if (rects.length === 0) continue;

    const parentStyle = window.getComputedStyle(parent);
    const fontSizePx = parseFloat(parentStyle.fontSize) || 12;
    // 1px ≈ 0.75pt in standard 96 DPI CSS vs 72 DPI PDF point system
    const fontSizePt = Math.max(6, Math.min(36, fontSizePx * 0.75));

    try {
      pdf.setFontSize(fontSizePt);

      if (rects.length === 1) {
        const r = rects[0];
        const x = (r.left - pageRect.left) * scaleX;
        // Text baseline in PDF is positioned at bottom of font line, ~82% down the client rect
        const y = (r.top - pageRect.top) * scaleY + (r.height * scaleY * 0.82);
        pdf.text(text.trim(), x, y, { renderingMode: 'invisible' });
      } else {
        // Multi-line wrapped text: group words into physical lines by vertical coordinate
        const words = text.split(/(\s+)/);
        let offset = 0;
        let lineY = -9999;
        let lineTokens: string[] = [];
        let lineRect: { left: number; top: number; right: number; bottom: number; height: number } | null = null;

        for (const token of words) {
          if (!token) continue;
          const wordRange = document.createRange();
          wordRange.setStart(node, offset);
          wordRange.setEnd(node, offset + token.length);
          offset += token.length;

          const wRect = wordRange.getBoundingClientRect();
          if (wRect.width > 0 && wRect.height > 0) {
            // New line detected if delta Y > 4px
            if (Math.abs(wRect.top - lineY) > 4) {
              if (lineTokens.length > 0 && lineRect) {
                const lineStr = lineTokens.join('').trim();
                if (lineStr) {
                  const x = (lineRect.left - pageRect.left) * scaleX;
                  const y = (lineRect.top - pageRect.top) * scaleY + (lineRect.height * scaleY * 0.82);
                  pdf.text(lineStr, x, y, { renderingMode: 'invisible' });
                }
              }
              lineY = wRect.top;
              lineTokens = [token];
              lineRect = {
                left: wRect.left,
                top: wRect.top,
                right: wRect.right,
                bottom: wRect.bottom,
                height: wRect.height
              };
            } else {
              lineTokens.push(token);
              if (lineRect) {
                lineRect.right = Math.max(lineRect.right, wRect.right);
                lineRect.height = Math.max(lineRect.height, wRect.height);
              }
            }
          } else if (lineTokens.length > 0) {
            lineTokens.push(token);
          }
        }

        if (lineTokens.length > 0 && lineRect) {
          const lineStr = lineTokens.join('').trim();
          if (lineStr) {
            const x = (lineRect.left - pageRect.left) * scaleX;
            const y = (lineRect.top - pageRect.top) * scaleY + (lineRect.height * scaleY * 0.82);
            pdf.text(lineStr, x, y, { renderingMode: 'invisible' });
          }
        }
      }
    } catch (e) {
      // Graceful fallback for any unsupported unicode glyphs
    }
  }
}

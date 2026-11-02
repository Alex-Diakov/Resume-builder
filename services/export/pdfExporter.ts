import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
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

/**
 * Converts any modern CSS color string (including CSS Color 4 color(srgb ...),
 * color-mix(...), oklch(...), lab(...), etc.) into a legacy rgba(...) or rgb(...)
 * string that html2canvas can safely tokenize and parse without throwing.
 */
function createColorSanitizer() {
  let scratchCanvas: HTMLCanvasElement | null = null;
  let scratchCtx: CanvasRenderingContext2D | null = null;

  try {
    scratchCanvas = document.createElement('canvas');
    scratchCanvas.width = 1;
    scratchCanvas.height = 1;
    scratchCtx = scratchCanvas.getContext('2d', { willReadFrequently: true });
  } catch (e) {
    scratchCtx = null;
  }

  const colorToRgba = (colorStr: string): string => {
    if (!scratchCtx) return colorStr;
    try {
      scratchCtx.clearRect(0, 0, 1, 1);
      scratchCtx.fillStyle = 'rgba(0,0,0,0)';
      scratchCtx.fillStyle = colorStr;
      scratchCtx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = scratchCtx.getImageData(0, 0, 1, 1).data;
      return `rgba(${r}, ${g}, ${b}, ${+(a / 255).toFixed(3)})`;
    } catch {
      return colorStr;
    }
  };

  const sanitizeValue = (val: any): any => {
    if (!val || typeof val !== 'string') return val;
    if (
      !val.includes('color(') &&
      !val.includes('color-mix(') &&
      !val.includes('oklch(') &&
      !val.includes('oklab(') &&
      !val.includes('lab(') &&
      !val.includes('lch(')
    ) {
      return val;
    }

    return val.replace(
      /(?:color-mix|color|oklch|oklab|lab|lch)\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/gi,
      (match) => colorToRgba(match)
    );
  };

  return { sanitizeValue, colorToRgba };
}

/**
 * Executes a rendering action with a transparent getComputedStyle proxy installed
 * on both the main window and any cloned document windows to guarantee html2canvas
 * never encounters unsupported CSS Color Module 4 functions.
 */
async function runWithColorSanitization<T>(action: () => Promise<T>): Promise<T> {
  const { sanitizeValue } = createColorSanitizer();
  const originalGetComputedStyle = window.getComputedStyle;

  const createProxiedStyle = (realStyle: CSSStyleDeclaration): CSSStyleDeclaration => {
    return new Proxy(realStyle, {
      get(target, prop) {
        const origVal = (target as any)[prop];
        if (typeof origVal === 'function') {
          if (prop === 'getPropertyValue') {
            return function (propertyName: string) {
              const raw = target.getPropertyValue(propertyName);
              return sanitizeValue(raw);
            };
          }
          return origVal.bind(target);
        }
        if (typeof origVal === 'string') {
          return sanitizeValue(origVal);
        }
        return origVal;
      }
    });
  };

  window.getComputedStyle = function (element: Element, pseudoElt?: string | null): CSSStyleDeclaration {
    const style = originalGetComputedStyle.call(window, element, pseudoElt);
    return createProxiedStyle(style);
  };

  try {
    return await action();
  } finally {
    window.getComputedStyle = originalGetComputedStyle;
  }
}

async function attemptServerPdfExport(resumeData: ResumeData, fileName: string): Promise<boolean> {
  const contentEl = document.getElementById('resume-content');
  if (!contentEl) return false;

  // Clone content safely to avoid mutating the live interactive DOM
  const clone = contentEl.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.page-guide-indicator').forEach((el) => el.remove());
  clone.querySelectorAll('.resume-page').forEach((page) => {
    page.classList.remove('shadow-xl', 'rounded-md');
  });

  // Extract computed document variables for exact color fidelity
  const rootStyle = window.getComputedStyle(contentEl);
  const docVarsList = [
    '--doc-text-primary',
    '--doc-text-secondary',
    '--doc-text-muted',
    '--doc-accent',
    '--doc-border',
    '--doc-paper',
    '--doc-font-heading',
    '--doc-font-body'
  ];
  const docVars: Record<string, string> = {};
  docVarsList.forEach((v) => {
    const val = rootStyle.getPropertyValue(v);
    if (val) docVars[v] = val.trim();
  });

  // Extract compiled CSS rules from live document stylesheets for exact 1:1 parity with canvas
  let inlinedStyles = '';
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        if (sheet.cssRules) {
          for (const rule of Array.from(sheet.cssRules)) {
            inlinedStyles += rule.cssText + '\n';
          }
        }
      } catch (crossOriginErr) {
        // Cross-origin sheets (like Google Fonts) cannot be read via cssRules and are preserved via link tags
      }
    }
  } catch (e) {
    console.warn('[PDF Export] Notice: Could not read all stylesheet rules:', e);
  }

  // Collect active style tags and stylesheet links from head (exclude relative links that headless Puppeteer cannot resolve)
  const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .filter((tag) => !tag.getAttribute('href')?.startsWith('/'))
    .map((tag) => tag.outerHTML)
    .join('\n');

  const combinedStyles = `${linkTags}\n<style id="active-dom-styles">\n${inlinedStyles}\n</style>`;

  const payload = {
    html: clone.innerHTML,
    styles: combinedStyles,
    docVars,
    title: fileName.replace(/\.pdf$/i, '')
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  let response: globalThis.Response;
  try {
    response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  } catch (fetchErr: any) {
    clearTimeout(timeoutId);
    console.warn('[PDF Export] Server export fetch aborted or network error:', fetchErr?.message || fetchErr);
    return false;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => '');
    console.warn('[PDF Export] Server renderer returned non-OK status:', response.status, errorDetails);
    return false;
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/pdf')) {
    console.warn('[PDF Export] Unexpected Content-Type from server:', contentType);
    return false;
  }

  const blob = await response.blob();
  if (!blob || blob.size === 0) {
    return false;
  }

  saveAs(blob, fileName);
  return true;
}

export async function exportToPdf(
  resumeData: ResumeData,
  options: PdfExportOptions
): Promise<void> {
  const fileName = generatePdfFileName(resumeData);

  // 1. Primary Strategy: Server-side Headless Chromium (Puppeteer)
  // Generates 100% native vector PDF with pixel-perfect alignment matching the canvas
  try {
    const success = await attemptServerPdfExport(resumeData, fileName);
    if (success) {
      try {
        const { recordActivity } = await import('../../utils/activityStorage');
        recordActivity(
          resumeData.name ? `${resumeData.name} (PDF)` : 'Professional Resume (PDF)',
          'exported'
        );
      } catch (e) {
        // Non-blocking telemetry
      }
      return;
    }
  } catch (serverErr) {
    console.warn('[PDF Export] Server vector renderer unavailable, engaging client fallback:', serverErr);
  }

  // 2. Resilient Fallback: High-resolution client-side jsPDF + html2canvas pipeline
  await runClientSidePdfExport(resumeData, options, fileName);
}

async function runClientSidePdfExport(
  resumeData: ResumeData,
  options: PdfExportOptions,
  fileName: string
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

  const { sanitizeValue } = createColorSanitizer();

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
        // Render with safe color sanitization active to catch any computed color(...) values
        canvas = await runWithColorSanitization(async () => {
          return await html2canvas(pageEl, {
            scale: Math.max(profile.scale, 2.5),
            useCORS: true,
            backgroundColor: pageEl.style.backgroundColor || '#ffffff', // Honors customized paper background tone
            logging: false,
            scrollY: 0,
            scrollX: 0,
            width: pageEl.offsetWidth,
            height: pageEl.offsetHeight,
            onclone: (clonedDoc) => {
              // 1. Install getComputedStyle proxy in cloned iframe window if present
              const clonedWin = clonedDoc.defaultView;
              if (clonedWin && clonedWin.getComputedStyle) {
                const origClonedGetComputedStyle = clonedWin.getComputedStyle;
                clonedWin.getComputedStyle = function (el: Element, pseudo?: string | null) {
                  const style = origClonedGetComputedStyle.call(clonedWin, el, pseudo);
                  return new Proxy(style, {
                    get(target, prop) {
                      const origVal = (target as any)[prop];
                      if (typeof origVal === 'function') {
                        if (prop === 'getPropertyValue') {
                          return (p: string) => sanitizeValue(target.getPropertyValue(p));
                        }
                        return origVal.bind(target);
                      }
                      if (typeof origVal === 'string') {
                        return sanitizeValue(origVal);
                      }
                      return origVal;
                    }
                  });
                };
              }

              // 2. Synchronize stylesheet links and font definitions into cloned head
              Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style')).forEach((tag) => {
                const href = tag.getAttribute('href');
                if (!href || !clonedDoc.head.querySelector(`link[href="${href}"]`)) {
                  clonedDoc.head.appendChild(tag.cloneNode(true));
                }
              });

              // 3. Propagate all document CSS variables onto cloned root and body
              const liveRoot = document.getElementById('resume-content');
              if (liveRoot) {
                const rootStyle = window.getComputedStyle(liveRoot);
                const docVars = [
                  '--doc-text-primary',
                  '--doc-text-secondary',
                  '--doc-accent',
                  '--doc-border',
                  '--doc-paper',
                  '--doc-font-heading',
                  '--doc-font-body'
                ];
                docVars.forEach((v) => {
                  const val = rootStyle.getPropertyValue(v);
                  if (val) {
                    clonedDoc.documentElement.style.setProperty(v, val);
                    if (clonedDoc.body) clonedDoc.body.style.setProperty(v, val);
                  }
                });
              }

              // 4. Normalize and lock computed font metrics on all heading elements to prevent baseline upward shift
              const liveHeadings = pageEl.querySelectorAll<HTMLElement>('h1, h2, h3');
              const clonedHeadings = clonedDoc.querySelectorAll<HTMLElement>('h1, h2, h3');
              liveHeadings.forEach((liveNode, idx) => {
                const cloneNode = clonedHeadings[idx];
                if (cloneNode) {
                  const comp = window.getComputedStyle(liveNode);
                  cloneNode.style.fontFamily = comp.fontFamily;
                  cloneNode.style.fontSize = comp.fontSize;
                  cloneNode.style.lineHeight = comp.lineHeight;
                  cloneNode.style.letterSpacing = comp.letterSpacing;
                  cloneNode.style.fontWeight = comp.fontWeight;
                  cloneNode.style.boxSizing = 'border-box';
                }
              });

              // 5. Contact icons & text optical table-cell alignment calibration for html2canvas
              const clonedContactItems = clonedDoc.querySelectorAll<HTMLElement>('.resume-contact-item');
              clonedContactItems.forEach((item) => {
                item.style.display = 'inline-table';
                item.style.verticalAlign = 'middle';
                item.style.borderCollapse = 'collapse';
              });

              const clonedContactIcons = clonedDoc.querySelectorAll<HTMLElement>('.resume-contact-icon');
              clonedContactIcons.forEach((icon) => {
                icon.style.display = 'table-cell';
                icon.style.verticalAlign = 'middle';
                icon.style.lineHeight = '0';
                icon.style.width = '13px';
                icon.style.paddingRight = '4px';
                const svg = icon.querySelector<SVGElement>('svg');
                if (svg) {
                  svg.style.display = 'block';
                  svg.style.width = '12px';
                  svg.style.height = '12px';
                  svg.style.margin = '0';
                }
              });

              const clonedContactTexts = clonedDoc.querySelectorAll<HTMLElement>('.resume-contact-text');
              clonedContactTexts.forEach((txt) => {
                txt.style.display = 'table-cell';
                txt.style.verticalAlign = 'middle';
                txt.style.lineHeight = '1';
              });

              // 6. Section divider table optical vertical centering calibration for html2canvas
              const clonedDividerTables = clonedDoc.querySelectorAll<HTMLElement>('.section-header-divider-table, .section-header-leftbar-table');
              clonedDividerTables.forEach((table) => {
                table.style.display = 'table';
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
              });

              const clonedDividerLines = clonedDoc.querySelectorAll<HTMLElement>('.section-header-line');
              clonedDividerLines.forEach((line) => {
                line.style.height = '1px';
                line.style.display = 'block';
                line.style.width = '100%';
                line.style.margin = '0';
                line.style.lineHeight = '0';
                line.style.fontSize = '0';
                line.style.position = 'relative';
                line.style.top = '0.5px';
              });

              // 7. Explicitly establish light background & print text
              if (clonedDoc.body) {
                clonedDoc.body.style.backgroundColor = pageEl.style.backgroundColor || '#ffffff';
                clonedDoc.body.style.color = '#1e293b';
              }
            },
          });
        });

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

        // 1. Inject clickable native PDF links while pageEl is in clean, unshadowed geometry
        injectClickableLinks(pdf, pageEl);

        // 2. Inject invisible, selectable & searchable text layer matching clean geometry
        injectSelectableTextLayer(pdf, pageEl);
      } finally {
        pageEl.className = originalClassName;
      }
    }

    // Save output PDF file
    pdf.save(fileName);

    // Track export metric
    try {
      const { recordActivity } = await import('../../utils/activityStorage');
      recordActivity(
        resumeData.name
          ? `${resumeData.name} (PDF)`
          : 'Professional Resume (PDF)',
        'exported'
      );
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
      // Precise typographic font ascent offset: 1pt = 0.352778mm; ascent is ~0.75 of font size
      const fontAscentMm = fontSizePt * 0.352778 * 0.75;

      if (rects.length === 1) {
        const r = rects[0];
        const x = (r.left - pageRect.left) * scaleX;
        const topMm = (r.top - pageRect.top) * scaleY;
        const y = topMm + fontAscentMm;
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
                  const topMm = (lineRect.top - pageRect.top) * scaleY;
                  const y = topMm + fontAscentMm;
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
            const topMm = (lineRect.top - pageRect.top) * scaleY;
            const y = topMm + fontAscentMm;
            pdf.text(lineStr, x, y, { renderingMode: 'invisible' });
          }
        }
      }
    } catch (e) {
      // Graceful fallback for any unsupported unicode glyphs
    }
  }
}

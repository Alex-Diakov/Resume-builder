import { Router, Request, Response } from 'express';
import puppeteer, { Browser } from 'puppeteer';
import fs from 'fs';
import path from 'path';

const router = Router();

// Cache compiled distribution CSS in memory for near-instant injection
let cachedCss: string = '';
function getCompiledStyles(): string {
  if (cachedCss) return cachedCss;
  try {
    const assetsDir = path.join(process.cwd(), 'dist', 'assets');
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      const cssFile = files.find((f) => f.endsWith('.css'));
      if (cssFile) {
        cachedCss = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
        return cachedCss;
      }
    }
  } catch (err) {
    console.warn('[PDF Export] Could not read dist/assets css:', err);
  }

  try {
    const indexCssPath = path.join(process.cwd(), 'index.css');
    if (fs.existsSync(indexCssPath)) {
      cachedCss = fs.readFileSync(indexCssPath, 'utf-8');
      return cachedCss;
    }
  } catch (err) {
    console.warn('[PDF Export] Could not read index.css:', err);
  }

  return cachedCss;
}

// Pre-warm styles
getCompiledStyles();

// Reusable headless browser instance with lifecycle safeguards
let cachedBrowser: Browser | null = null;
let browserLaunchPromise: Promise<Browser> | null = null;

async function closeCachedBrowser(): Promise<void> {
  if (cachedBrowser) {
    try {
      await cachedBrowser.close();
    } catch {
      // Ignore cleanup error
    }
    cachedBrowser = null;
  }
  browserLaunchPromise = null;
}

async function getBrowser(): Promise<Browser> {
  if (cachedBrowser && cachedBrowser.connected) {
    return cachedBrowser;
  }

  if (cachedBrowser && !cachedBrowser.connected) {
    await closeCachedBrowser();
  }

  if (!browserLaunchPromise) {
    browserLaunchPromise = puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--disable-extensions',
        '--font-render-hinting=none',
      ],
      timeout: 10000,
    }).then((browser) => {
      cachedBrowser = browser;
      browserLaunchPromise = null;
      browser.on('disconnected', () => {
        cachedBrowser = null;
      });
      return browser;
    }).catch(async (err) => {
      await closeCachedBrowser();
      throw err;
    });
  }

  return browserLaunchPromise;
}

router.post('/export-pdf', async (req: Request, res: Response) => {
  const { html, styles, docVars, title } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'Missing html content in request payload.' });
  }

  let page: any = null;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    // Guard page commands with strict 7s timeout to prevent hanging
    page.setDefaultTimeout(7000);
    page.setDefaultNavigationTimeout(7000);

    // Standard physical A4 viewport at 2x device scale for crisp vector fidelity
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2,
    });

    const docVarsCss = docVars && typeof docVars === 'object'
      ? Object.entries(docVars)
          .map(([key, value]) => `${key}: ${value};`)
          .join('\n')
      : '';

    const sanitizedTitle = (title || 'Resume').replace(/["\r\n]/g, '');
    const compiledAppCss = getCompiledStyles();

    const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${sanitizedTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  ${compiledAppCss ? `<style id="app-compiled-css">${compiledAppCss}</style>` : ''}
  ${styles || ''}
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    :root {
      ${docVarsCss}
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    #resume-content {
      padding: 0 !important;
      margin: 0 !important;
      background: transparent !important;
      gap: 0 !important;
      display: block !important;
      ${docVarsCss}
    }
    .resume-page {
      box-shadow: none !important;
      border-radius: 0 !important;
      border: none !important;
      margin: 0 auto !important;
      page-break-after: always !important;
      break-after: page !important;
      width: 210mm !important;
      min-height: 297mm !important;
      max-height: 297mm !important;
      overflow: hidden !important;
      position: relative !important;
      ${docVarsCss}
    }
    .resume-page:last-child {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    .page-guide-indicator {
      display: none !important;
    }
  </style>
</head>
<body>
  <div id="resume-content">
    ${html}
  </div>
</body>
</html>`;

    // Fast deterministic render with 5000ms ceiling
    await page.setContent(completeHtml, {
      waitUntil: 'load',
      timeout: 5000,
    });

    // Ensure all web fonts are ready, with bounded 1200ms ceiling
    await page.evaluate(async () => {
      if (document.fonts) {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 1200))
        ]);
      }
    });

    // Generate real vector PDF buffer with exact zero-margin physical A4
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      timeout: 5000,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(sanitizedTitle)}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.end(pdfBuffer);

  } catch (error: any) {
    console.error('[PDF Export] Server export failure:', error);
    // Recycle browser instance on error so future requests start fresh
    await closeCachedBrowser();
    return res.status(500).json({
      error: 'Server-side PDF generation failed',
      details: error?.message || String(error),
      fallback: true
    });
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
  }
});

export default router;

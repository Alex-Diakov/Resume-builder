# Headless Chromium Vector PDF Generation & Optical Geometry Alignment

Eliminate visual misalignment in exported resume PDFs by deploying a high-fidelity headless Chromium (Puppeteer) rendering pipeline, establishing strict cap-height vertical centering for section dividers, and locking contact icons and text to identical typographic baselines.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Summary of Confirmed Architectural Decisions:**
> - **PDF Rendering Engine**: Server-side Headless Chromium (Puppeteer) selected for 100% true Blink layout engine accuracy, vector-grade text rendering, and complete elimination of `html2canvas` cross-axis flexbox/inline distortion.
> - **Section Header Divider Math**: Centered strictly along the mathematical cap-height optical centerline of the uppercase section title letters.
> - **Safety Net Fallback**: Dual-mode export architecture where the client seamlessly falls back to high-resolution vector browser print if the server headless worker encounters timeout or container constraints.

---

## 1. Overview & Core Concept

### What It Does
Provides an industrial-grade PDF export pipeline for the Resume Visual Studio. Instead of client-side canvas rasterization approximations (`html2canvas`) that corrupt SVG bounding boxes and baseline calculations, the system renders the exact resume DOM inside a true headless Chromium browser instance (`page.pdf()`), outputting pristine vector PDFs where fonts, clickable hyperlinks, divider lines, and contact icons align with sub-millimeter precision.

### Target Audience & Persona
Product Designers, Staff Engineers, and Executives exporting resumes for top-tier job applications, ATS scanners, and print portfolios where visual hierarchy and pixel alignment are under rigorous review.

### Key Value
- **Zero Baseline Drift**: Contact icons (`Globe`, `LinkedIn`, `PlayCircle`, `Mail`, `MapPin`) sit on the exact optical baseline of adjacent contact text.
- **Mathematical Divider Alignment**: Horizontal divider rules and vertical accent bars pass through the precise 50% cap-height centerline of heading text.
- **True Vector Output**: Razor-sharp text selection, ATS parsing, and native clickable links with zero raster artifacting.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Visual Styling**: The user configures layout geometry, margins, typography pairings, and section header styles (`divider`, `left-bar`, `boxed`) in the Resume Visual Studio sidebar.
2. **Export Trigger**: The user clicks **Export PDF** in the toolbar.
3. **Execution & Feedback**:
   - The toolbar displays a sleek indeterminate loading indicator (`Exporting Vector PDF...`).
   - The app dispatches the resume document markup and computed theme variables to the backend `/api/export-pdf` route.
   - Puppeteer renders the exact DOM in headless Chromium and returns a pristine vector A4 PDF stream.
   - The browser automatically triggers native file download with an SEO/ATS-friendly filename (e.g. `Alex_Diakov_Senior_UIUX_Designer.pdf`).
   - If offline or backend unavailable, the client gracefully falls back to browser-grade print rasterization.

### Visual Identity & Alignment Geometry
- **Section Dividers (`divider`)**:
  - The section heading (e.g. `EXPERIENCE`) is rendered with `line-height: 1` and `vertical-align: middle`.
  - The horizontal rule is a 1px solid stroke with `background-color: var(--doc-border)` positioned in an adjacent table-cell with `vertical-align: middle`.
  - The line passes through the exact 50% height of uppercase glyphs (e.g., crossbars of `E` and `H`).
- **Contact Bar (`resume-contact-bar`)**:
  - Each item is structured with `display: inline-flex; align-items: center; vertical-align: middle;`.
  - SVG icons are sized to 12px with a calibrated baseline offset (`translateY(0.5px)` or `table-cell` center) matching the exact cap-height of the 9pt metadata font.
  - Bullet separators (`•`) are vertically centered between items with consistent 6px horizontal padding.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Headless Chromium (Puppeteer) vs Client-Side Canvas
- **Chosen Approach**: Server-side rendering using Puppeteer's native `page.pdf({ format: 'A4', printBackground: true })`.
- **Why**: `html2canvas` is a reverse-engineered JavaScript approximation of CSS. It notoriously fails on SVG bounding boxes inside flex items, ignores `align-items: center` cross-axis math for 1px elements, and causes sub-pixel text rasterization drift. Chromium's native Blink engine executes the full CSS specifications identically to what a user sees in Google Chrome.
- **Fallback Guarantee**: In case of server execution timeouts or cloud environment sandbox limitations, the export system includes an automated fallback to high-resolution print stream so the user is never blocked.

### Decision 2: Typography & Optical Cap-Height Alignment
- **Chosen Approach**: Use strict CSS table layout (`display: table`, `table-cell`, `vertical-align: middle`) with `line-height: 1` for both section dividers and left accent bars.
- **Why**: CSS table-cell vertical centering has been fully defined since CSS 2.1 and renders identically across every browser and PDF engine. By constraining line-height to 1, the box model height matches the font ascent/descent box, preventing trailing half-leading from pushing the letters downward.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (BROWSER)                              │
│                                                                        │
│   Toolbar [Export PDF]                                                 │
│           │                                                            │
│           ▼                                                            │
│   usePdfExport Hook                                                    │
│     ├── 1. Primary: POST /api/export-pdf (Resume HTML + CSS Tokens)     │
│     └── 2. Fallback: Client jsPDF Lossless Engine                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ HTTP POST
┌────────────────────────────────────────────────────────────────────────┐
│                     EXPRESS BACKEND (server.ts)                        │
│                                                                        │
│   /api/export-pdf Router                                               │
│     ├── Injects Clean Standalone HTML Template                         │
│     ├── Launches Headless Chromium (puppeteer.launch)                  │
│     │     ├── Sets Viewport 210mm x 297mm (A4 @ 96 DPI)                │
│     │     ├── Awaits document.fonts.ready                              │
│     │     └── Calls page.pdf({ printBackground: true, format: 'A4' })  │
│     └── Streams PDF Buffer to Client with Content-Disposition         │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Implementation Steps

1. **Express PDF Export Route (`server/routes/pdfExport.ts`)**:
   - Create a dedicated POST endpoint `/api/export-pdf`.
   - Accept the resume HTML string, document CSS variables, and page title.
   - Assemble a self-contained HTML page loading Google Fonts (`Outfit`, `Plus Jakarta Sans`, `Inter`, `Playfair Display`).
   - Launch Puppeteer with `--no-sandbox`, `--disable-setuid-sandbox`, and `--disable-dev-shm-usage`.
   - Render page, await font loading, and generate A4 PDF with zero margins (`margin: { top: 0, right: 0, bottom: 0, left: 0 }`).
   - Return application/pdf buffer directly to the client.

2. **DOM Alignment Hardening (`ResumePaper.tsx` & `SectionHeader.tsx`)**:
   - In `ResumePaper.tsx`, wrap contact icons and text in clean inline-table cells with `vertical-align: middle` and exact 12px SVG sizing.
   - In `SectionHeader.tsx`, enforce `line-height: 1`, `margin: 0`, and `vertical-align: middle` across `divider`, `left-bar`, and `boxed` variants so the divider line passes through the mathematical center of the heading text.

3. **Client-Side Export Service (`services/export/pdfExporter.ts`)**:
   - Update `exportToPdf` to call `/api/export-pdf` first.
   - Receive the streamed blob and trigger download via `file-saver` or anchor download.
   - If the endpoint fails or network is offline, automatically fall back to the optimized client-side vector pipeline.

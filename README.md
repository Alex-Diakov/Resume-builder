# ✨ ATS-Optimized JSON Resume Builder

A high-fidelity, data-driven resume web application built with React, TypeScript, and Tailwind CSS. Designed specifically for professionals who want a pixel-perfect, print-ready aesthetic combined with powerful mechanics to beat Applicant Tracking Systems (ATS).

![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)

## 🚀 The Concept

Most beautifully designed resumes fail in automated ATS screenings because the parsers can't read the complex layouts. Standard text-based resumes pass the ATS but fail to impress human recruiters.

**This application solves both problems:**
1. **The Human Layer:** A pixel-perfect, typography-driven A4 layout engineered for readability, visual hierarchy, and immediate impact.
2. **The Machine Layer:** A dedicated "Invisible ATS Text" feature that injects raw, keyword-dense text into the DOM that is visually hidden from humans but perfectly readable by web scrapers and ATS bots during PDF generation.

## 🎯 Key Features

- 📄 **Data-Driven Content:** Your entire resume is powered by a single configuration object (`constants.tsx` / JSON). No more fighting with text boxes or alignment issues.
- 🖨️ **Pixel-Perfect PDF Generation:** Engineered with strict CSS print media query rules (`@media print`) and integrated with `html2pdf.js` for flawless A4 scaling.
- 🛠️ **Built-in Editor:** Edit your resume data natively within the browser via an integrated JSON editor.
- 💾 **Local Persistence:** Changes are automatically cached in `localStorage` so you never lose your progress.
- 🔄 **Import / Export:** Download your resume's JSON data as a backup or import existing `.json` templates.
- 👻 **Invisible ATS Layer:** Inject job descriptions, hidden keywords, and plain-text summaries behind your beautiful UI to rank higher in recruiter search results.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PDF Generation:** [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)

## 📦 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/resume-builder.git
   cd resume-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📝 Usage Guide

### 1. Editing as JSON
Click the **"Edit Data"** button in the navigation bar to open the raw JSON editor. You can change your name, experience, links, and text directly. Click "Save" to instantly reflect changes on the canvas.

### 2. Setting up ATS Keywords
Click the **"ATS Text"** button. Paste the raw text of the job description you are applying for, or a massive list of industry keywords. This text will be rendered in the background (white text on a white background, hidden with `z-index`) ensuring ATS systems scrape the data without affecting your visual presentation.

### 3. Printing and Exporting
- **Print:** Uses the browser's native print dialogue via `window.print()`. Margins, shadows, and navigation bars are automatically stripped away using `print:` Tailwind modifiers.
- **Download PDF:** Utilizes `html2pdf.js` to clone the DOM, precisely scale it to an A4 canvas, and generate a high-quality PDF.

## 🗂️ Project Structure

```text
├── src/
│   ├── components/
│   │   └── ResumePaper.tsx    # The core A4 rendering canvas
│   ├── App.tsx                # Main logic, modal management, and PDF generation
│   ├── constants.tsx          # Initial resume data template
│   ├── types.ts               # TypeScript interfaces for the JSON structure
│   ├── index.css              # Global styles & specific print rules
│   └── main.tsx               # Entry point
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/resume-builder/issues).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

# 📄 The Executive Manifesto: Neuro-Cognitive ATS Optimizer
> **A resume is not a list of tasks. It is an executive manifesto. It is a psychological instrument of high-stakes persuasion.**
> Built for professionals across the globe who demand flawless typography, deterministic structure, and science-backed framing to conquer Applicant Tracking Systems (ATS) and human recruiters alike.

---

## ⚡ The Philosophy

For decades, professionals have been taught to treat resumes as historical ledgers—a dry catalog of past duties. **This is a fundamental mistake.** 

In the modern attention economy, human recruiters spend an average of **6.4 seconds** scanning a resume. ATS algorithms filter candidates with merciless binary precision. 

Your resume must be engineered not as a history book, but as a **high-precision teleological weapon**. It must translate subordinate-level duties into C-level business outcomes. It must respect Miller's Law of working memory. It must guide the eye along the natural F-Pattern scanning flow. 

This application was architected on this exact philosophy. It addresses the two most critical friction points in modern executive job hunting: **visual presentation inconsistency** and **algorithm-level cognitive overload**.

Unlike standard template builders, this tool implements a **Neuro-Cognitive AI Engine** (powered by Gemini) running purely on the server to perform elite C-level executive optimizations.

```
 ┌────────────────────────────────────────────────────────┐
 │                      WORSKPACE HUB                     │
 │  ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
 │  │  Forms Edit  │ ⇆ │  JSON Sync   │ ⇆ │ Cognitive  │  │
 │  └──────────────┘   └──────────────┘   └────────────┘  │
 │                                                  ▲     │
 └─────────────────────────┬────────────────────────│─────┘
                           ▼                        │
          ┌────────────────────────────────┐     ┌─────────────┐
          │  REAL-TIME LIVE SYNC CANVASES  │     │ Express API │
          └────────────────────────────────┘     └─────────────┘
```

---

## 🔥 Key Features & Value Propositions

### 1. 🧠 Neuro-Cognitive AI Scanner (Gemini-Powered)
*   **Executive Framing Rewrites**: Automatically translates weak, duty-based bullets ("helped make website") into C-level business outcomes ("Architected diagnostic digital platform, reducing latency and saving 40 engineering hours per quarter").
*   **Psychological Information Laws**: Real-time evaluation against Miller's Law (working memory fatigue) and the 6-Second Screen Rule.
*   **KPI & Visual Scanning Scores**: Quantifies metrics density and grades the F-Pattern eye-tracking flow of your layout.
*   **Graceful Degradation Engine**: If the neural network (Gemini API) experiences transient errors, the server instantly falls back to a deterministic **Local Heuristic Assessment Engine** for zero-downtime operations.

### 2. 🎚 High-Fidelity A4 Print Layout (Pixel-Perfect Grids)
*   Eliminates broken content overflow, orphaned sections, and chaotic double pages.
*   Includes built-in layout modes (`Standard`, `Compact`, `Super Compact`) and structural guides to ensure everything fits perfectly onto A4 bounds.
*   Live page fraction calculators warn you when content spills over.

### 3. 🔄 Bidirectional Dynamic Live Sync
*   **Structured Form Input Panel**: A simplified, responsive input form for swift draft edits and quick additions.
*   **Raw Code Data Stream (JSON)**: For power-users who want to import or export their resumes in portable, clean JSON formatting. Any keypress instantly replicates.

### 4. 🖨 Perfect Borderless PDF Print Layouts
*   Includes native 1-click PDF generation via standard print workflows, guaranteeing pixel-perfect styling match between the web app and the downloaded PDF.

---

## 🛠 Tech Stack

The workspace operates as a full-stack application securely keeping all AI operations server-side.

*   **Frontend**: React 18 + TypeScript
*   **Backend**: Node.js + Express (serving Vite middleware)
*   **AI Engine**: Official Google Gen AI TypeScript SDK (`@google/genai`) -> *gemini-3.5-flash*
*   **CSS Utility Framework**: Tailwind CSS
*   **Motion System**: Framer Motion (`motion/react`)

---

## ⚙️ Quick Start Guide

### 1. Install Project Dependencies
```bash
npm install
```

### 2. Configure Environment Secrets
Create a `.env` file (or configure Settings -> Secrets) and add your Gemini API Key. This must remain server-side.
```env
GEMINI_API_KEY="your_api_key_here"
```

### 3. Launch Full-Stack Development Server
```bash
npm run dev
```
The server binds to `0.0.0.0:3000`. The frontend will Hot-Reload, and Express API routes will be available at `/api/*`.

### 4. Build for Production Deployment
```bash
npm run build
npm run start
```
Compiled, production-ready static assets will be packed into the `/dist` directory.

---

## 📂 Portable JSON Resume Model

Your professional identity is yours to own. The configuration is structured inside a highly standardized, portable schema designed for global professionals:

```json
{
  "personal": {
    "name": "Jane Doe",
    "title": "Chief Operating Officer",
    "email": "jane.doe@executive-network.com",
    "phone": "+1 (555) 019-2834",
    "location": "New York, USA",
    "website": "linkedin.com/in/janedoe"
  },
  "summary": "Strategic operational executive specializing in enterprise scaling, structural optimization, and driving multi-million dollar revenue growth...",
  "experience": [
    {
      "company": "Global Enterprise Corp.",
      "role": "VP of Operations",
      "period": "2020 - Present",
      "description": "Architected a comprehensive logistical overhaul that improved Q4 delivery metrics by 40%..."
    }
  ]
}
```

---

## 🛡 License
This project is licensed under the terms of the MIT License. Feel free to use, modify, share, and expand as you like!

---
> **A resume is the highest ROI document you will ever write. Treat it accordingly.** 🎯

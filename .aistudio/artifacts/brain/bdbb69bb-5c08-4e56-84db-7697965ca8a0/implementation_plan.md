# Full-Spectrum Localization Audit & 100% Translation Coverage (EN / UK / RU)

Comprehensive audit and end-to-end localization blueprint eliminating all remaining hardcoded strings across the resume builder form, style customizer, ATS engine, cognitive AI tab, and personal cabinet dialogs.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following parameters were confirmed during interactive clarification and govern the implementation:

- **Confirmed Priority**: 100% full coverage across all editor tabs (Form, Style, ATS, Cognitive AI, JSON, Analytics) and Personal Cabinet (Library, Telemetry, Modals).
- **Confirmed Placeholders**: All input placeholders, helper text, and tooltips will be localized in Ukrainian, Russian, and English.
- **Confirmed Style Presets**: Theme descriptions, layout spacing presets, font size scales, and header styles will be translated into Ukrainian, Russian, and English.

---

## 1. Overview & Core Concept

- **What It Does**: Expands the type-safe i18n architecture from the top-level navigation to granular form inputs, section headers, accordions, style scrubbers, delete/rename modals, and analytical tooltips across English, Ukrainian, and Russian.
- **Target Audience**: Bilingual and multilingual candidates and recruiters who require a fully localized native experience without mixed languages or untranslated gaps.
- **Key Value**: Delivers complete linguistic consistency. No partial translation, no hardcoded English strings left in forms, and seamless real-time switching across the entire workspace.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Editing in Personal Cabinet**:
   - The user opens the **Resume Library**: search bar, role filter dropdown, "Open in Canvas", "Duplicate", "Delete", and safe delete/rename modals are fully rendered in the active language.
   - The user opens **Export Telemetry**: KPI titles, activity timeline headers, format labels, and empty states are localized.
   - The user opens **Profile & Settings**: all input labels, helper text, and action buttons are localized.
2. **Editing Resume Content (Sidebar Tabs)**:
   - **Form Tab**: Accordion titles (*Personal Details*, *Summary*, *Work Experience*, *Projects*, *Skills*, *Education*), add/remove buttons, and field placeholders are fully translated.
   - **Style Tab**: Sections (*Theme Presets*, *Typography*, *Colors*, *Spacing & Density*, *Header Styles*), slider labels, and tooltips are localized.
   - **ATS & Cognitive Tabs**: Scanners, keyword match tags, and AI rewrite suggestions are localized.

### Visual Identity & Theme
- **Typographic Balance**: Strict Cyrillic-compliant typography using Inter and Outfit with identical line-height and letter-spacing across English, Ukrainian, and Russian.
- **Material 3 Expressive Layout**: Clean layout density preserved in all 3 languages, preventing text truncation or awkward wraps on buttons and tabs.

---

## 3. Key Product Decisions & Trade-Offs

- **Hierarchical Modular Schema Extension**:
  - *Chosen Approach*: Group translations into semantic namespaces: `t.form.*`, `t.style.*`, `t.ats.*`, `t.cognitive.*`, `t.cabinet.*`, `t.modals.*`.
  - *Why*: Keeps translation dictionaries maintainable, prevents collisions, and enables TypeScript autocomplete with zero runtime overhead.
- **Safe Dynamic Fallbacks**:
  - *Chosen Approach*: Every key is validated by the `TranslationSchema` interface so missing strings fail at compile-time rather than runtime.
- **Preservation of User Document Data**:
  - *Chosen Approach*: System labels and guidance are localized, while the user's actual resume text (custom accomplishments, company names) remains strictly untouched.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Language Context Provider                         │
│             Locale State: 'en' | 'uk' | 'ru' (Reactive)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌─────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ PersonalCabinet │       │   SidebarForm    │       │   SidebarStyle   │
│ - Library Grid  │       │ - Personal Info  │       │ - Themes & Fonts │
│ - Rename Modal  │       │ - Experience     │       │ - Spacing Scrub  │
│ - Delete Modal  │       │ - Projects       │       │ - Header Styles  │
│ - Telemetry Log │       │ - Skills & Edu   │       │ - Auto-fit Engine│
└─────────────────┘       └──────────────────┘       └──────────────────┘
```

### Namespace Mapping & Additions
- **`translations/types.ts`**:
  - `form`: Personal, summary, experience, project, skills, education field labels and localized placeholders.
  - `style`: Theme names, font descriptions, spacing density options, header style names.
  - `cabinet`: Modals (rename, delete confirmation), search filters, export logs.
- **`translations/en.ts`**, **`translations/uk.ts`**, **`translations/ru.ts`**:
  - Complete, professional phrasing in Ukrainian (IT/business executive standard), Russian, and English.
- **Components to update**:
  - `PersonalInfoSection.tsx`, `SummarySection.tsx`, `ExperienceSection.tsx`, `ProjectsSection.tsx`, `SkillsSection.tsx`, `EducationSection.tsx`, `LayoutSection.tsx`.
  - `SidebarStyleTab.tsx`.
  - `PersonalCabinet.tsx` (modals and table headers).

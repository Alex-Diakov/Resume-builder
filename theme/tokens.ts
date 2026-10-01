/**
 * Design System M3 (2026 Edition) - Canonical Single Source of Truth
 * 
 * All design tokens across colors, surfaces, typography, shadows, radii,
 * and print metrics are declared here as the unified authority.
 * 
 * Editing values here automatically propagates across:
 * 1. Runtime CSS custom properties on document.documentElement
 * 2. Tailwind utility classes (via var(--token))
 * 3. The interactive Design System Studio and documentation swatches
 */

export interface ColorToken {
  id: string;
  name: string;
  variable: string;
  tailwind: string;
  hex: string;
  category: 'brand' | 'surface' | 'content' | 'status' | 'outline' | 'print';
  contrast: string;
  usage: string;
}

export interface RadiusToken {
  id: string;
  name: string;
  variable: string;
  tailwind: string;
  value: string;
  usage: string;
}

export interface ShadowToken {
  id: string;
  name: string;
  variable: string;
  tailwind: string;
  value: string;
  usage: string;
}

export interface TypographyToken {
  name: string;
  role: string;
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  weight: string;
  tailwind: string;
  usage: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  previewColors: string[]; // 3 colors for swatch icon
  colors: Record<string, string>; // Maps CSS variable to hex/rgba value
}

// ---------------------------------------------------------------------------
// WCAG Contrast Utilities
// ---------------------------------------------------------------------------
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16)
    };
  }
  if (cleanHex.length === 6) {
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16)
    };
  }
  return null;
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(1));
}

export function getWCAGRating(ratio: number): string {
  if (ratio >= 7) return `AAA (${ratio}:1)`;
  if (ratio >= 4.5) return `AA (${ratio}:1)`;
  if (ratio >= 3) return `AA Large (${ratio}:1)`;
  return `Low (${ratio}:1)`;
}

// ---------------------------------------------------------------------------
// CANONICAL DEFAULT COLOR TOKENS (SSOT)
// ---------------------------------------------------------------------------
export const DEFAULT_COLOR_TOKENS: ColorToken[] = [
  // Brand & Key Interactive
  {
    id: 'primary',
    name: 'Primary Accent (Tone 80)',
    variable: '--md-sys-color-primary',
    tailwind: 'md-primary',
    hex: '#D0BCFF',
    category: 'brand',
    contrast: 'AAA / 12.1:1',
    usage: 'Key interactive elements, active rail icons, high-emphasis text, focus rings'
  },
  {
    id: 'on-primary',
    name: 'On Primary (Tone 20)',
    variable: '--md-sys-color-on-primary',
    tailwind: 'md-on-primary',
    hex: '#381E72',
    category: 'brand',
    contrast: 'AAA / 11.8:1',
    usage: 'Text and icon color placed on top of Primary fills'
  },
  {
    id: 'primary-container',
    name: 'Primary Container (Tone 30)',
    variable: '--md-sys-color-primary-container',
    tailwind: 'md-primary-container',
    hex: '#4F378B',
    category: 'brand',
    contrast: 'Elevation',
    usage: 'Active accordion headers, tonal buttons, prominent cards, text selection'
  },
  {
    id: 'on-primary-container',
    name: 'On Primary Container (Tone 90)',
    variable: '--md-sys-color-on-primary-container',
    tailwind: 'md-on-primary-container',
    hex: '#EADDFF',
    category: 'brand',
    contrast: 'AAA / 14.2:1',
    usage: 'Text and icons placed inside Primary Container fills'
  },
  {
    id: 'secondary',
    name: 'Secondary Accent (Tone 80)',
    variable: '--md-sys-color-secondary',
    tailwind: 'md-secondary',
    hex: '#CCC2DC',
    category: 'brand',
    contrast: 'AAA / 11.5:1',
    usage: 'Secondary action buttons, filter chips, navigation indicators'
  },
  {
    id: 'secondary-container',
    name: 'Secondary Container',
    variable: '--md-sys-color-secondary-container',
    tailwind: 'md-secondary-container',
    hex: '#4A4458',
    category: 'brand',
    contrast: 'Elevation',
    usage: 'Selected navigation rail items, tonal background badges'
  },
  {
    id: 'tertiary',
    name: 'Tertiary / Tech Cyan',
    variable: '--md-sys-color-tertiary',
    tailwind: 'md-tertiary',
    hex: '#7DD0DF',
    category: 'brand',
    contrast: 'AAA / 13.5:1',
    usage: 'ATS keyword anchors, skill tags, diagnostic analytics'
  },
  {
    id: 'tertiary-container',
    name: 'Tertiary Container',
    variable: '--md-sys-color-tertiary-container',
    tailwind: 'md-tertiary-container',
    hex: '#1F4D56',
    category: 'brand',
    contrast: 'Elevation',
    usage: 'Matched keyword chip backgrounds, heuristic score badges'
  },

  // Tonal Surface Hierarchy (Material 3 Dark)
  {
    id: 'surface',
    name: 'Surface Canvas (Base)',
    variable: '--md-sys-color-surface',
    tailwind: 'md-surface',
    hex: '#141218',
    category: 'surface',
    contrast: 'Base Elevation',
    usage: 'Root viewport canvas behind document preview and background sheets'
  },
  {
    id: 'surface-container-lowest',
    name: 'Surface Container Lowest',
    variable: '--md-sys-color-surface-container-lowest',
    tailwind: 'md-surface-container-lowest',
    hex: '#0F0D13',
    category: 'surface',
    contrast: 'Depth',
    usage: 'Deep code areas, JSON editor background canvas, input fields'
  },
  {
    id: 'surface-container-low',
    name: 'Surface Container Low',
    variable: '--md-sys-color-surface-container-low',
    tailwind: 'md-surface-container-low',
    hex: '#1D1B20',
    category: 'surface',
    contrast: 'Elevation 1',
    usage: 'Sidebar navigation rail, top app bar, inactive accordions'
  },
  {
    id: 'surface-container',
    name: 'Surface Container (Standard)',
    variable: '--md-sys-color-surface-container',
    tailwind: 'md-surface-container',
    hex: '#211F26',
    category: 'surface',
    contrast: 'Elevation 2',
    usage: 'Expanded form accordion bodies, card groups, active tool drawers'
  },
  {
    id: 'surface-container-high',
    name: 'Surface Container High',
    variable: '--md-sys-color-surface-container-high',
    tailwind: 'md-surface-container-high',
    hex: '#2B2930',
    category: 'surface',
    contrast: 'Elevation 3',
    usage: 'Dialog surfaces, menu dropdowns, export sheet, hover card elevations'
  },
  {
    id: 'surface-container-highest',
    name: 'Surface Container Highest',
    variable: '--md-sys-color-surface-container-highest',
    tailwind: 'md-surface-container-highest',
    hex: '#36343B',
    category: 'surface',
    contrast: 'Elevation 4',
    usage: 'Floating tooltips, quick actions, active drag states, slider tracks'
  },

  // Content, Typography & Outlines
  {
    id: 'on-surface',
    name: 'On Surface (High Emphasis)',
    variable: '--md-sys-color-on-surface',
    tailwind: 'md-on-surface',
    hex: '#E6E0E9',
    category: 'content',
    contrast: 'AAA / 15.6:1',
    usage: 'Primary headlines, prominent form inputs, card titles, button labels'
  },
  {
    id: 'on-surface-variant',
    name: 'On Surface Variant (Medium)',
    variable: '--md-sys-color-on-surface-variant',
    tailwind: 'md-on-surface-variant',
    hex: '#CAC4D0',
    category: 'content',
    contrast: 'AAA / 11.2:1',
    usage: 'Input labels, descriptive paragraphs, secondary captions, inactive icons'
  },
  {
    id: 'outline',
    name: 'Outline (Standard)',
    variable: '--md-sys-color-outline',
    tailwind: 'md-outline',
    hex: '#938F99',
    category: 'outline',
    contrast: 'AA / 5.5:1',
    usage: 'Unfocused text field borders, chip borders, key element strokes'
  },
  {
    id: 'outline-variant',
    name: 'Outline Variant (Subtle Hairline)',
    variable: '--md-sys-color-outline-variant',
    tailwind: 'md-outline-variant',
    hex: '#49454F',
    category: 'outline',
    contrast: 'Divider',
    usage: 'Section dividers, panel perimeter hairlines, quiet separators'
  },

  // Semantic Status Roles
  {
    id: 'error',
    name: 'Status Error',
    variable: '--md-sys-color-error',
    tailwind: 'md-error',
    hex: '#F2B8B5',
    category: 'status',
    contrast: 'AAA / 8.5:1',
    usage: 'Validation errors, overflow notices, destructive actions'
  },
  {
    id: 'error-container',
    name: 'Error Container',
    variable: '--md-sys-color-error-container',
    tailwind: 'md-error-container',
    hex: '#8C1D18',
    category: 'status',
    contrast: 'Elevation',
    usage: 'Error banner backgrounds, delete button hover fill'
  },
  {
    id: 'success',
    name: 'Status Success',
    variable: '--md-sys-color-success',
    tailwind: 'md-success',
    hex: '#85D996',
    category: 'status',
    contrast: 'AAA / 11.8:1',
    usage: 'High ATS scores, verified metrics, auto-fit confirmation'
  },
  {
    id: 'success-container',
    name: 'Success Container',
    variable: '--md-sys-color-success-container',
    tailwind: 'md-success-container',
    hex: '#0E5224',
    category: 'status',
    contrast: 'Elevation',
    usage: 'Save success alerts, score chip backgrounds'
  },
  {
    id: 'warning',
    name: 'Status Warning',
    variable: '--md-sys-color-warning',
    tailwind: 'md-warning',
    hex: '#F5BE48',
    category: 'status',
    contrast: 'AAA / 12.4:1',
    usage: 'Length alerts, cognitive load threshold warnings'
  },

  // Document Print & Canvas (Protected Vector A4 Tokens)
  {
    id: 'doc-paper',
    name: 'Document Paper',
    variable: '--doc-paper',
    tailwind: 'resume-paper',
    hex: '#FFFFFF',
    category: 'print',
    contrast: 'Paper Base',
    usage: 'Pure physical A4 sheet base'
  },
  {
    id: 'doc-primary',
    name: 'Document Charcoal',
    variable: '--doc-text-primary',
    tailwind: 'resume-primary',
    hex: '#1E293B',
    category: 'print',
    contrast: 'Slate 800',
    usage: 'Candidate name, company titles, section headers on paper'
  },
  {
    id: 'doc-secondary',
    name: 'Document Slate',
    variable: '--doc-text-secondary',
    tailwind: 'resume-secondary',
    hex: '#475569',
    category: 'print',
    contrast: 'Slate 600',
    usage: 'Bullet points, job responsibilities, body copy'
  },
  {
    id: 'doc-accent',
    name: 'Document Accent',
    variable: '--doc-accent',
    tailwind: 'resume-accent',
    hex: '#6750A4',
    category: 'print',
    contrast: 'M3 Violet',
    usage: 'Section border lines, subtle link accents on paper'
  }
];

// Backward-compatibility token alias helper
export const ALIAS_MAP: Record<string, string> = {
  '--color-surface-bg': '--md-sys-color-surface',
  '--color-surface-panel': '--md-sys-color-surface-container-low',
  '--color-surface-container': '--md-sys-color-surface-container',
  '--color-surface-active': '--md-sys-color-surface-container-high',
  '--color-surface-hover': '--md-sys-color-surface-container-highest',
  '--color-brand-primary': '--md-sys-color-primary',
  '--color-brand-secondary': '--md-sys-color-tertiary',
  '--color-text-high': '--md-sys-color-on-surface',
  '--color-text-medium': '--md-sys-color-on-surface-variant',
  '--color-text-muted': '--md-sys-color-outline',
  '--color-status-success': '--md-sys-color-success',
  '--color-status-warning': '--md-sys-color-warning',
  '--color-status-error': '--md-sys-color-error',
  '--color-status-info': '--md-sys-color-tertiary',
};

// ---------------------------------------------------------------------------
// SHAPE & RADIUS TOKENS (SSOT)
// ---------------------------------------------------------------------------
export const DEFAULT_RADIUS_TOKENS: RadiusToken[] = [
  { id: 'none', name: 'Shape None', variable: '--md-sys-shape-none', tailwind: 'rounded-md-none', value: '0px', usage: 'Square corners, full bleed panels' },
  { id: 'xs', name: 'Shape Extra Small (XS)', variable: '--md-sys-shape-xs', tailwind: 'rounded-md-xs', value: '4px', usage: 'Micro badges, status indicators, tiny tags' },
  { id: 'sm', name: 'Shape Small (SM)', variable: '--md-sys-shape-sm', tailwind: 'rounded-md-sm', value: '8px', usage: 'Chips, small cards, tooltips, slider thumbs' },
  { id: 'md', name: 'Shape Medium (MD)', variable: '--md-sys-shape-md', tailwind: 'rounded-md-md', value: '12px', usage: 'Standard text fields, dropdown menus, cards' },
  { id: 'lg', name: 'Shape Large (LG)', variable: '--md-sys-shape-lg', tailwind: 'rounded-md-lg', value: '16px', usage: 'Accordion expansion panels, dialogs, sheet containers' },
  { id: 'xl', name: 'Shape Extra Large (XL)', variable: '--md-sys-shape-xl', tailwind: 'rounded-md-xl', value: '28px', usage: 'Large dialogs, floating action sheets, search pill wraps' },
  { id: 'full', name: 'Shape Full', variable: '--md-sys-shape-full', tailwind: 'rounded-full', value: '9999px', usage: 'M3 filled/tonal buttons, switch tracks, circular avatars' },
];

// ---------------------------------------------------------------------------
// ELEVATION & SHADOW TOKENS (SSOT)
// ---------------------------------------------------------------------------
export const DEFAULT_SHADOW_TOKENS: ShadowToken[] = [
  { id: 'elev-0', name: 'Elevation Level 0', variable: '--md-sys-elevation-0', tailwind: 'shadow-md-elevation-0', value: 'none', usage: 'Flat surfaces resting on parent canvas' },
  { id: 'elev-1', name: 'Elevation Level 1', variable: '--md-sys-elevation-1', tailwind: 'shadow-md-elevation-1', value: '0px 1px 3px 1px rgba(0, 0, 0, 0.25)', usage: 'Standard cards, subtle panel separation' },
  { id: 'elev-2', name: 'Elevation Level 2', variable: '--md-sys-elevation-2', tailwind: 'shadow-md-elevation-2', value: '0px 2px 6px 2px rgba(0, 0, 0, 0.30)', usage: 'Hovered cards, inactive dropdowns, top bar in scroll' },
  { id: 'elev-3', name: 'Elevation Level 3', variable: '--md-sys-elevation-3', tailwind: 'shadow-md-elevation-3', value: '0px 4px 8px 3px rgba(0, 0, 0, 0.35)', usage: 'Navigation drawer, expanded menus, active dialogs' },
  { id: 'elev-4', name: 'Elevation Level 4', variable: '--md-sys-elevation-4', tailwind: 'shadow-md-elevation-4', value: '0px 6px 10px 4px rgba(0, 0, 0, 0.40)', usage: 'Floating Action Buttons (FAB), toast notifications' },
  { id: 'elev-5', name: 'Elevation Level 5', variable: '--md-sys-elevation-5', tailwind: 'shadow-md-elevation-5', value: '0px 8px 12px 6px rgba(0, 0, 0, 0.45)', usage: 'Modal overlays, high-priority system alerts' },
  { id: 'paper', name: 'Paper Elevation', variable: '--shadow-paper', tailwind: 'shadow-ds-paper', value: '0 10px 30px -5px rgba(0, 0, 0, 0.45)', usage: 'A4 resume page realistic physical depth over canvas' },
];

// ---------------------------------------------------------------------------
// TYPOGRAPHY TOKENS (SSOT)
// ---------------------------------------------------------------------------
export const DEFAULT_TYPOGRAPHY_TOKENS: TypographyToken[] = [
  { name: 'Headline Medium', role: 'Main Titles', fontFamily: 'Plus Jakarta Sans', fontSize: '28px (1.75rem)', lineHeight: '1.25', letterSpacing: '-0.02em', weight: '700', tailwind: 'font-display font-bold text-2xl tracking-tight', usage: 'Primary screen headers, top branding' },
  { name: 'Title Large', role: 'Section Headers', fontFamily: 'Plus Jakarta Sans', fontSize: '20px (1.25rem)', lineHeight: '1.3', letterSpacing: '-0.01em', weight: '600', tailwind: 'font-sans font-semibold text-lg', usage: 'Modal titles, major category headlines' },
  { name: 'Title Medium', role: 'Card & Accordion Titles', fontFamily: 'Plus Jakarta Sans', fontSize: '15px (0.9375rem)', lineHeight: '1.4', letterSpacing: '0', weight: '600', tailwind: 'font-sans font-semibold text-[15px]', usage: 'Editor accordion titles, section cards' },
  { name: 'Body Large', role: 'Default UI Copy', fontFamily: 'Plus Jakarta Sans', fontSize: '14px (0.875rem)', lineHeight: '1.5', letterSpacing: '0.01em', weight: '400', tailwind: 'font-sans font-normal text-sm', usage: 'Form inputs, descriptions, resume highlights' },
  { name: 'Body Medium', role: 'Secondary Descriptions', fontFamily: 'Plus Jakarta Sans', fontSize: '13px (0.8125rem)', lineHeight: '1.5', letterSpacing: '0.01em', weight: '400', tailwind: 'font-sans font-normal text-[13px]', usage: 'Supporting text under inputs, helper notes' },
  { name: 'Label Large', role: 'Buttons & Actions', fontFamily: 'Plus Jakarta Sans', fontSize: '13px (0.8125rem)', lineHeight: '1.3', letterSpacing: '0.02em', weight: '600', tailwind: 'font-sans font-semibold text-[13px]', usage: 'M3 Button labels, tab bar buttons' },
  { name: 'Label Medium', role: 'Form & Chip Labels', fontFamily: 'Plus Jakarta Sans', fontSize: '11.5px (0.72rem)', lineHeight: '1.3', letterSpacing: '0.03em', weight: '500', tailwind: 'font-sans font-medium text-xs', usage: 'Field labels, filter chips, status badges' },
  { name: 'Code / Mono', role: 'Data & Keywords', fontFamily: 'Fira Code', fontSize: '12px (0.75rem)', lineHeight: '1.4', letterSpacing: '0', weight: '500', tailwind: 'font-mono text-xs', usage: 'JSON editor, token variable names, ATS keywords' },
];

// ---------------------------------------------------------------------------
// CURATED THEME PRESETS (Instant 1-Click System Tuning)
// ---------------------------------------------------------------------------
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'm3-violet',
    name: 'M3 Deep Violet (Default)',
    tagline: 'Refined Google Material 3 dark palette with calibrated lavender accents',
    previewColors: ['#D0BCFF', '#4F378B', '#141218'],
    colors: {
      '--md-sys-color-primary': '#D0BCFF',
      '--md-sys-color-on-primary': '#381E72',
      '--md-sys-color-primary-container': '#4F378B',
      '--md-sys-color-on-primary-container': '#EADDFF',
      '--md-sys-color-secondary': '#CCC2DC',
      '--md-sys-color-secondary-container': '#4A4458',
      '--md-sys-color-tertiary': '#7DD0DF',
      '--md-sys-color-tertiary-container': '#1F4D56',
      '--md-sys-color-surface': '#141218',
      '--md-sys-color-surface-container-lowest': '#0F0D13',
      '--md-sys-color-surface-container-low': '#1D1B20',
      '--md-sys-color-surface-container': '#211F26',
      '--md-sys-color-surface-container-high': '#2B2930',
      '--md-sys-color-surface-container-highest': '#36343B',
      '--md-sys-color-on-surface': '#E6E0E9',
      '--md-sys-color-on-surface-variant': '#CAC4D0',
      '--md-sys-color-outline': '#938F99',
      '--md-sys-color-outline-variant': '#49454F',
    }
  },
  {
    id: 'cyber-emerald',
    name: 'Cyberpunk Emerald',
    tagline: 'High-tech neo-terminal aesthetic with vibrant radioactive emerald accents',
    previewColors: ['#4ADE80', '#14532D', '#0B130E'],
    colors: {
      '--md-sys-color-primary': '#4ADE80',
      '--md-sys-color-on-primary': '#052E16',
      '--md-sys-color-primary-container': '#14532D',
      '--md-sys-color-on-primary-container': '#BBF7D0',
      '--md-sys-color-secondary': '#86EFAC',
      '--md-sys-color-secondary-container': '#163E2B',
      '--md-sys-color-tertiary': '#2DD4BF',
      '--md-sys-color-tertiary-container': '#115E59',
      '--md-sys-color-surface': '#0B130E',
      '--md-sys-color-surface-container-lowest': '#070C09',
      '--md-sys-color-surface-container-low': '#121C16',
      '--md-sys-color-surface-container': '#17241C',
      '--md-sys-color-surface-container-high': '#1E2F25',
      '--md-sys-color-surface-container-highest': '#273B2F',
      '--md-sys-color-on-surface': '#E1EFE6',
      '--md-sys-color-on-surface-variant': '#C0D5C7',
      '--md-sys-color-outline': '#718277',
      '--md-sys-color-outline-variant': '#334539',
    }
  },
  {
    id: 'nordic-ice',
    name: 'Nordic Ice & Cyan',
    tagline: 'Arctic architectural dark theme with crystal cyan precision lines',
    previewColors: ['#7DD0DF', '#1F4D56', '#0B1116'],
    colors: {
      '--md-sys-color-primary': '#7DD0DF',
      '--md-sys-color-on-primary': '#00363F',
      '--md-sys-color-primary-container': '#1F4D56',
      '--md-sys-color-on-primary-container': '#A6EEFB',
      '--md-sys-color-secondary': '#94D8E2',
      '--md-sys-color-secondary-container': '#2A4650',
      '--md-sys-color-tertiary': '#A5B4FC',
      '--md-sys-color-tertiary-container': '#312E81',
      '--md-sys-color-surface': '#0B1116',
      '--md-sys-color-surface-container-lowest': '#070B0E',
      '--md-sys-color-surface-container-low': '#121A21',
      '--md-sys-color-surface-container': '#17212B',
      '--md-sys-color-surface-container-high': '#202D3A',
      '--md-sys-color-surface-container-highest': '#2A3B4C',
      '--md-sys-color-on-surface': '#E1E9EF',
      '--md-sys-color-on-surface-variant': '#C2D0DC',
      '--md-sys-color-outline': '#7B8B99',
      '--md-sys-color-outline-variant': '#384552',
    }
  },
  {
    id: 'obsidian-crimson',
    name: 'Obsidian Crimson',
    tagline: 'Executive dark velvet surfaces with striking rose-coral focal points',
    previewColors: ['#FB7185', '#881337', '#140C0E'],
    colors: {
      '--md-sys-color-primary': '#FB7185',
      '--md-sys-color-on-primary': '#4C0519',
      '--md-sys-color-primary-container': '#881337',
      '--md-sys-color-on-primary-container': '#FECDD3',
      '--md-sys-color-secondary': '#FDA4AF',
      '--md-sys-color-secondary-container': '#4C1D24',
      '--md-sys-color-tertiary': '#F472B6',
      '--md-sys-color-tertiary-container': '#701A45',
      '--md-sys-color-surface': '#140C0E',
      '--md-sys-color-surface-container-lowest': '#0D0709',
      '--md-sys-color-surface-container-low': '#1C1114',
      '--md-sys-color-surface-container': '#25161A',
      '--md-sys-color-surface-container-high': '#2F1C22',
      '--md-sys-color-surface-container-highest': '#3B242B',
      '--md-sys-color-on-surface': '#EFE2E4',
      '--md-sys-color-on-surface-variant': '#D8C3C7',
      '--md-sys-color-outline': '#947B82',
      '--md-sys-color-outline-variant': '#4A353B',
    }
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    tagline: 'Warm golden luxury tones over deep espresso-charcoal foundations',
    previewColors: ['#FBBF24', '#78350F', '#13100B'],
    colors: {
      '--md-sys-color-primary': '#FBBF24',
      '--md-sys-color-on-primary': '#451A03',
      '--md-sys-color-primary-container': '#78350F',
      '--md-sys-color-on-primary-container': '#FDE68A',
      '--md-sys-color-secondary': '#FCD34D',
      '--md-sys-color-secondary-container': '#453018',
      '--md-sys-color-tertiary': '#FB923C',
      '--md-sys-color-tertiary-container': '#7C2D12',
      '--md-sys-color-surface': '#13100B',
      '--md-sys-color-surface-container-lowest': '#0C0A07',
      '--md-sys-color-surface-container-low': '#1B1610',
      '--md-sys-color-surface-container': '#231D15',
      '--md-sys-color-surface-container-high': '#2D251B',
      '--md-sys-color-surface-container-highest': '#3A2F23',
      '--md-sys-color-on-surface': '#EEE6DC',
      '--md-sys-color-on-surface-variant': '#D6C8B8',
      '--md-sys-color-outline': '#918576',
      '--md-sys-color-outline-variant': '#483E31',
    }
  },
  {
    id: 'monochrome-pro',
    name: 'Monochrome Platinum',
    tagline: 'Ultra-minimalist Swiss design language in pure greyscale & platinum',
    previewColors: ['#E2E8F0', '#334155', '#0F1115'],
    colors: {
      '--md-sys-color-primary': '#E2E8F0',
      '--md-sys-color-on-primary': '#0F172A',
      '--md-sys-color-primary-container': '#334155',
      '--md-sys-color-on-primary-container': '#F8FAFC',
      '--md-sys-color-secondary': '#CBD5E1',
      '--md-sys-color-secondary-container': '#333A44',
      '--md-sys-color-tertiary': '#94A3B8',
      '--md-sys-color-tertiary-container': '#1E293B',
      '--md-sys-color-surface': '#0F1115',
      '--md-sys-color-surface-container-lowest': '#0A0B0E',
      '--md-sys-color-surface-container-low': '#16191F',
      '--md-sys-color-surface-container': '#1D2129',
      '--md-sys-color-surface-container-high': '#262B35',
      '--md-sys-color-surface-container-highest': '#313744',
      '--md-sys-color-on-surface': '#F1F5F9',
      '--md-sys-color-on-surface-variant': '#CBD5E1',
      '--md-sys-color-outline': '#7E8794',
      '--md-sys-color-outline-variant': '#3D434E',
    }
  }
];

// Backwards-compatible export array
export const COLOR_TOKENS = DEFAULT_COLOR_TOKENS;
export const RADIUS_TOKENS = DEFAULT_RADIUS_TOKENS;
export const SHADOW_TOKENS = DEFAULT_SHADOW_TOKENS;
export const TYPOGRAPHY_TOKENS = DEFAULT_TYPOGRAPHY_TOKENS;

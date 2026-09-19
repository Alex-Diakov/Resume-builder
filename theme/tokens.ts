/**
 * Design System M3 (2026 Edition) - Single Source of Truth
 * All design tokens across colors, surfaces, typography, shadows, radii, and print metrics.
 */

export interface ColorToken {
  name: string;
  variable: string;
  tailwind: string;
  hex: string;
  category: 'brand' | 'surface' | 'content' | 'status' | 'print';
  contrast: string;
  usage: string;
}

export interface RadiusToken {
  name: string;
  variable: string;
  tailwind: string;
  value: string;
  usage: string;
}

export interface ShadowToken {
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

export const COLOR_TOKENS: ColorToken[] = [
  // Brand
  { name: 'Brand Primary', variable: '--color-brand-primary', tailwind: 'ds-primary', hex: '#A855F7', category: 'brand', contrast: 'AAA / 9.2:1', usage: 'Main call-to-actions, active highlights, key badges' },
  { name: 'Brand Primary Hover', variable: '--color-brand-primary-hover', tailwind: 'ds-primary-hover', hex: '#9333EA', category: 'brand', contrast: 'AAA / 7.6:1', usage: 'Interactive hover on primary buttons' },
  { name: 'Brand Primary Light', variable: '--color-brand-primary-light', tailwind: 'ds-primary-light', hex: 'rgba(168,85,247,0.12)', category: 'brand', contrast: 'Tint', usage: 'Subtle container overlays and chip backgrounds' },
  { name: 'Brand Secondary', variable: '--color-brand-secondary', tailwind: 'ds-secondary', hex: '#22D3EE', category: 'brand', contrast: 'AAA / 13.8:1', usage: 'Tech accents, ATS keyword anchors, secondary buttons' },
  { name: 'Brand Secondary Hover', variable: '--color-brand-secondary-hover', tailwind: 'ds-secondary-hover', hex: '#0891B2', category: 'brand', contrast: 'AA / 5.2:1', usage: 'Secondary hover states and links' },
  { name: 'Brand Secondary Light', variable: '--color-brand-secondary-light', tailwind: 'ds-secondary-light', hex: 'rgba(34,211,238,0.10)', category: 'brand', contrast: 'Tint', usage: 'Subtle keyword chip highlights' },
  
  // Surfaces
  { name: 'Surface Background', variable: '--color-surface-bg', tailwind: 'ds-bg', hex: '#0D0C11', category: 'surface', contrast: 'Base', usage: 'Root viewport canvas, deep obsidian tone' },
  { name: 'Surface Panel', variable: '--color-surface-panel', tailwind: 'ds-panel', hex: '#14121A', category: 'surface', contrast: 'Elevation 1', usage: 'Toolbar, sidebar background, floating panels' },
  { name: 'Surface Container', variable: '--color-surface-container', tailwind: 'ds-container', hex: '#1B1922', category: 'surface', contrast: 'Elevation 2', usage: 'Nested groups, input card wraps, editor sections' },
  { name: 'Surface Active', variable: '--color-surface-active', tailwind: 'ds-active', hex: '#25222D', category: 'surface', contrast: 'Elevation 3', usage: 'Selected tabs, active items, pressed button state' },
  { name: 'Surface Hover', variable: '--color-surface-hover', tailwind: 'ds-hover', hex: '#1F1D26', category: 'surface', contrast: 'Interactive', usage: 'Row & card hover interactions' },

  // Content
  { name: 'Text High Emphasis', variable: '--color-text-high', tailwind: 'ds-text-high', hex: '#F5F2FA', category: 'content', contrast: '16.8:1 AAA', usage: 'Headings, primary button labels, critical values' },
  { name: 'Text Medium Emphasis', variable: '--color-text-medium', tailwind: 'ds-text-medium', hex: '#D6CFDE', category: 'content', contrast: '12.4:1 AAA', usage: 'Body descriptions, form labels, section items' },
  { name: 'Text Muted', variable: '--color-text-muted', tailwind: 'ds-text-muted', hex: '#A69BB0', category: 'content', contrast: '5.8:1 AA', usage: 'Placeholders, secondary metadata, helper text' },
  { name: 'Text Disabled', variable: '--color-text-disabled', tailwind: 'ds-text-disabled', hex: '#6D6178', category: 'content', contrast: '2.8:1', usage: 'Disabled controls and inactive track indicators' },

  // Status
  { name: 'Status Success', variable: '--color-status-success', tailwind: 'ds-success', hex: '#34D399', category: 'status', contrast: '11.5:1 AAA', usage: 'High ATS scores, verified metrics, saved state' },
  { name: 'Status Warning', variable: '--color-status-warning', tailwind: 'ds-warning', hex: '#FBC02D', category: 'status', contrast: '12.9:1 AAA', usage: 'Length alerts, cognitive load warnings' },
  { name: 'Status Error', variable: '--color-status-error', tailwind: 'ds-error', hex: '#F87171', category: 'status', contrast: '8.4:1 AAA', usage: 'Overflow alerts, JSON syntax errors, missing fields' },
  { name: 'Status Info', variable: '--color-status-info', tailwind: 'ds-info', hex: '#38BDF8', category: 'status', contrast: '10.2:1 AAA', usage: 'Informational toasts, guiding hints, feature badges' },

  // Print & Document (A4 Canvas)
  { name: 'Document Paper', variable: '--doc-paper', tailwind: 'resume-paper', hex: '#FFFFFF', category: 'print', contrast: 'Paper Base', usage: 'White A4 paper background' },
  { name: 'Document Charcoal', variable: '--doc-text-primary', tailwind: 'resume-primary', hex: '#1E293B', category: 'print', contrast: 'Slate 800', usage: 'Candidate name, company titles, section headers on paper' },
  { name: 'Document Slate', variable: '--doc-text-secondary', tailwind: 'resume-secondary', hex: '#475569', category: 'print', contrast: 'Slate 600', usage: 'Bullet points, job responsibilities, body copy' },
  { name: 'Document Muted', variable: '--doc-text-muted', tailwind: 'resume-muted', hex: '#64748B', category: 'print', contrast: 'Slate 500', usage: 'Dates, locations, secondary meta information' },
  { name: 'Document Accent', variable: '--doc-accent', tailwind: 'resume-accent', hex: '#7C52FF', category: 'print', contrast: 'Periwinkle', usage: 'Section border lines, subtle link accents on paper' },
  { name: 'Document Hairline', variable: '--doc-border', tailwind: 'resume-border', hex: '#E2E8F0', category: 'print', contrast: 'Slate 200', usage: 'Dividers and structural guidelines' },
];

export const RADIUS_TOKENS: RadiusToken[] = [
  { name: 'Radius XS', variable: '--radius-xs', tailwind: 'rounded-ds-xs', value: '4px', usage: 'Inline badges, micro chips, checkboxes' },
  { name: 'Radius SM', variable: '--radius-sm', tailwind: 'rounded-ds-sm', value: '6px', usage: 'Input controls, small tooltips, buttons' },
  { name: 'Radius MD', variable: '--radius-md', tailwind: 'rounded-ds-md', value: '10px', usage: 'Standard cards, modals, dropdown menus' },
  { name: 'Radius LG', variable: '--radius-lg', tailwind: 'rounded-ds-lg', value: '14px', usage: 'Parent containers, large sections, editor tabs' },
  { name: 'Radius XL', variable: '--radius-xl', tailwind: 'rounded-ds-xl', value: '20px', usage: 'Floating pill headers, dialog wrappers' },
  { name: 'Radius Full', variable: '--radius-full', tailwind: 'rounded-full', value: '9999px', usage: 'Circular avatars, status pills, toggle switches' },
];

export const SHADOW_TOKENS: ShadowToken[] = [
  { name: 'Elevation 1 (Low)', variable: '--shadow-sm', tailwind: 'shadow-ds-sm', value: '0 1px 2px 0 rgba(0, 0, 0, 0.25)', usage: 'Subtle container separation' },
  { name: 'Elevation 2 (Mid)', variable: '--shadow-md', tailwind: 'shadow-ds-md', value: '0 4px 14px -2px rgba(0, 0, 0, 0.45)', usage: 'Dropdowns, active cards, tooltips' },
  { name: 'Elevation 3 (High)', variable: '--shadow-lg', tailwind: 'shadow-ds-lg', value: '0 12px 28px -4px rgba(0, 0, 0, 0.65)', usage: 'Floating dialogs, full preview sheets' },
  { name: 'Brand Glow', variable: '--shadow-glow', tailwind: 'shadow-ds-glow', value: '0 0 15px rgba(168, 85, 247, 0.25)', usage: 'Focused primary actions, AI active indicators' },
  { name: 'Paper Elevation', variable: '--shadow-paper', tailwind: 'shadow-ds-paper', value: '0 10px 30px -5px rgba(0, 0, 0, 0.45), 0 4px 12px -2px rgba(0, 0, 0, 0.25)', usage: 'A4 resume page depth over canvas' },
];

export const TYPOGRAPHY_TOKENS: TypographyToken[] = [
  { name: 'Display Heading', role: 'Header Brand', fontFamily: 'Outfit', fontSize: '24px (1.5rem)', lineHeight: '1.2', letterSpacing: '-0.02em', weight: '700', tailwind: 'font-display font-bold text-2xl tracking-tight', usage: 'App title, main dialog headers' },
  { name: 'Section Title', role: 'Subheader', fontFamily: 'Plus Jakarta Sans', fontSize: '15px (0.9375rem)', lineHeight: '1.3', letterSpacing: '-0.01em', weight: '600', tailwind: 'font-sans font-semibold text-sm', usage: 'Editor accordion titles, card headers' },
  { name: 'Body Regular', role: 'Default UI Copy', fontFamily: 'Plus Jakarta Sans', fontSize: '13px (0.8125rem)', lineHeight: '1.5', letterSpacing: '0', weight: '400', tailwind: 'font-sans font-normal text-[13px]', usage: 'Form descriptions, helper notes, body text' },
  { name: 'Caption / Label', role: 'Control Labels', fontFamily: 'Plus Jakarta Sans', fontSize: '11px (0.6875rem)', lineHeight: '1.4', letterSpacing: '0.04em', weight: '600', tailwind: 'font-sans font-semibold text-[11px] tracking-wider uppercase', usage: 'Input field labels, pill tags, metrics captions' },
  { name: 'Code / Mono', role: 'Data & Keywords', fontFamily: 'Fira Code', fontSize: '12px (0.75rem)', lineHeight: '1.4', letterSpacing: '0', weight: '500', tailwind: 'font-mono text-xs', usage: 'JSON editor, token variable names, ATS keywords' },
];

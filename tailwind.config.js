// Helper enabling Tailwind opacity modifiers (e.g. border-md-primary/40, bg-md-outline-variant/30) with CSS variables
const withColorMix = (variableName) => ({ opacityValue }) => {
  if (opacityValue !== undefined) {
    return `color-mix(in srgb, var(${variableName}) calc(${opacityValue} * 100%), transparent)`;
  }
  return `var(${variableName})`;
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 (M3) Semantic Color Roles with full opacity support
        md: {
          surface: withColorMix('--md-sys-color-surface'),
          'surface-dim': withColorMix('--md-sys-color-surface-dim'),
          'surface-bright': withColorMix('--md-sys-color-surface-bright'),
          'surface-container-lowest': withColorMix('--md-sys-color-surface-container-lowest'),
          'surface-container-low': withColorMix('--md-sys-color-surface-container-low'),
          'surface-container': withColorMix('--md-sys-color-surface-container'),
          'surface-container-high': withColorMix('--md-sys-color-surface-container-high'),
          'surface-container-highest': withColorMix('--md-sys-color-surface-container-highest'),
          'on-surface': withColorMix('--md-sys-color-on-surface'),
          'on-surface-variant': withColorMix('--md-sys-color-on-surface-variant'),
          outline: withColorMix('--md-sys-color-outline'),
          'outline-variant': withColorMix('--md-sys-color-outline-variant'),
          'inverse-surface': withColorMix('--md-sys-color-inverse-surface'),
          'inverse-on-surface': withColorMix('--md-sys-color-inverse-on-surface'),
          primary: withColorMix('--md-sys-color-primary'),
          'on-primary': withColorMix('--md-sys-color-on-primary'),
          'primary-container': withColorMix('--md-sys-color-primary-container'),
          'on-primary-container': withColorMix('--md-sys-color-on-primary-container'),
          'inverse-primary': withColorMix('--md-sys-color-inverse-primary'),
          secondary: withColorMix('--md-sys-color-secondary'),
          'on-secondary': withColorMix('--md-sys-color-on-secondary'),
          'secondary-container': withColorMix('--md-sys-color-secondary-container'),
          'on-secondary-container': withColorMix('--md-sys-color-on-secondary-container'),
          tertiary: withColorMix('--md-sys-color-tertiary'),
          'on-tertiary': withColorMix('--md-sys-color-on-tertiary'),
          'tertiary-container': withColorMix('--md-sys-color-tertiary-container'),
          'on-tertiary-container': withColorMix('--md-sys-color-on-tertiary-container'),
          error: withColorMix('--md-sys-color-error'),
          'on-error': withColorMix('--md-sys-color-on-error'),
          'error-container': withColorMix('--md-sys-color-error-container'),
          'on-error-container': withColorMix('--md-sys-color-on-error-container'),
          success: withColorMix('--md-sys-color-success'),
          'on-success': withColorMix('--md-sys-color-on-success'),
          'success-container': withColorMix('--md-sys-color-success-container'),
          'on-success-container': withColorMix('--md-sys-color-on-success-container'),
          warning: withColorMix('--md-sys-color-warning'),
          'on-warning': withColorMix('--md-sys-color-on-warning'),
          'warning-container': withColorMix('--md-sys-color-warning-container'),
          'on-warning-container': withColorMix('--md-sys-color-on-warning-container'),
          info: withColorMix('--md-sys-color-info'),
          'on-info': withColorMix('--md-sys-color-on-info'),
          'info-container': withColorMix('--md-sys-color-info-container'),
          'on-info-container': withColorMix('--md-sys-color-on-info-container'),
        },
        ds: {
          bg: 'var(--color-surface-bg)',
          panel: 'var(--color-surface-panel)',
          container: 'var(--color-surface-container)',
          active: 'var(--color-surface-active)',
          hover: 'var(--color-surface-hover)',
          primary: 'var(--color-brand-primary)',
          'primary-hover': 'var(--color-brand-primary-hover)',
          'primary-light': 'var(--color-brand-primary-light)',
          secondary: 'var(--color-brand-secondary)',
          'secondary-hover': 'var(--color-brand-secondary-hover)',
          'secondary-light': 'var(--color-brand-secondary-light)',
          'text-high': 'var(--color-text-high)',
          'text-medium': 'var(--color-text-medium)',
          'text-muted': 'var(--color-text-muted)',
          'text-disabled': 'var(--color-text-disabled)',
          border: 'var(--color-border-main)',
          'border-focus': 'var(--color-border-focus)',
          'border-accordion-open': 'var(--color-border-accordion-open, #4f378b)',
          'accordion-open-bg': 'var(--color-accordion-open-bg, #211f26)',
          success: 'var(--color-status-success)',
          'success-bg': 'var(--color-status-success-bg)',
          warning: 'var(--color-status-warning)',
          'warning-bg': 'var(--color-status-warning-bg)',
          error: 'var(--color-status-error)',
          'error-bg': 'var(--color-status-error-bg)',
          info: 'var(--color-status-info)',
          'info-bg': 'var(--color-status-info-bg)',
        },
        resume: {
          primary: 'var(--doc-text-primary, #1E293B)',    // Slate 800 - soft, premium anthracite
          secondary: 'var(--doc-text-secondary, #475569)',  // Slate 600 - exquisite muted slate for description & body text
          accent: 'var(--doc-accent, #6750a4)',     // M3 Deep Violet Accent
          muted: 'var(--doc-text-muted, #64748B)',      // Slate 500 - clean light slate for metadata
          border: 'var(--doc-border, #E2E8F0)',     // Slate 200 - clean separators
          paper: 'var(--doc-paper, #FFFFFF)',       // Clean white document paper
        },
        m3: {
          primary: 'var(--md-sys-color-primary)',
          onPrimary: 'var(--md-sys-color-on-primary)',
          primaryContainer: 'var(--md-sys-color-primary-container)',
          onPrimaryContainer: 'var(--md-sys-color-on-primary-container)',
          secondary: 'var(--md-sys-color-secondary)',
          surface: 'var(--md-sys-color-surface)', 
          surfaceContainer: 'var(--md-sys-color-surface-container)', 
          surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
          outline: 'var(--md-sys-color-outline)', 
          outlineVariant: 'var(--md-sys-color-outline-variant)', 
          onSurface: 'var(--md-sys-color-on-surface)',
          onSurfaceVariant: 'var(--md-sys-color-on-surface-variant)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', 'JetBrains Mono', 'monospace'],
      },
      spacing: {
        '4.5': '1.125rem',
      },
      screens: {
        print: { raw: 'print' },
      },
      fontSize: {
        'resume-name': ['28pt', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'resume-title': ['13pt', { lineHeight: '1.2', letterSpacing: '0.01em' }],
        'resume-section': ['10.5pt', { lineHeight: '1.2', letterSpacing: '0.06em' }],
        'resume-body': ['10pt', { lineHeight: '1.5' }],
        'resume-meta': ['9.5pt', { lineHeight: '1.5' }],
      },
      borderRadius: {
        // M3 Shape Scale
        'md-none': '0px',
        'md-xs': 'var(--md-sys-shape-xs, 4px)',
        'md-sm': 'var(--md-sys-shape-sm, 8px)',
        'md-md': 'var(--md-sys-shape-md, 12px)',
        'md-lg': 'var(--md-sys-shape-lg, 16px)',
        'md-xl': 'var(--md-sys-shape-xl, 28px)',
        'md-full': '9999px',
        // Legacy ds radii
        'ds-xs': 'var(--radius-xs, 4px)',
        'ds-sm': 'var(--radius-sm, 6px)',
        'ds-md': 'var(--radius-md, 10px)',
        'ds-lg': 'var(--radius-lg, 14px)',
        'ds-xl': 'var(--radius-xl, 20px)',
      },
      boxShadow: {
        // M3 Elevation Levels
        'md-elevation-0': 'var(--md-sys-elevation-0, none)',
        'md-elevation-1': 'var(--md-sys-elevation-1)',
        'md-elevation-2': 'var(--md-sys-elevation-2)',
        'md-elevation-3': 'var(--md-sys-elevation-3)',
        'md-elevation-4': 'var(--md-sys-elevation-4)',
        'md-elevation-5': 'var(--md-sys-elevation-5)',
        // Legacy ds shadows
        'ds-sm': 'var(--shadow-sm)',
        'ds-md': 'var(--shadow-md)',
        'ds-lg': 'var(--shadow-lg)',
        'ds-glow': 'var(--shadow-glow)',
        'ds-paper': 'var(--shadow-paper)',
      }
    },
  },
  plugins: [],
}

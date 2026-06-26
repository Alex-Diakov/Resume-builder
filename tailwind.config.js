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
          success: 'var(--color-status-success)',
          warning: 'var(--color-status-warning)',
          error: 'var(--color-status-error)',
        },
        resume: {
          primary: '#1E293B',    // Slate 800 - soft, premium anthracite
          secondary: '#475569',  // Slate 600 - exquisite muted slate for description & body text
          accent: '#7c52ff',     // Vibrant Periwinkle-Purple (Material 3 Seed)
          muted: '#64748B',      // Slate 500 - clean light slate for metadata
          border: '#E2E8F0',     // Slate 200 - clean separators
        },
        m3: {
          primary: 'var(--color-brand-primary)',
          onPrimary: '#1a003d',
          primaryContainer: 'var(--color-brand-primary-light)',
          onPrimaryContainer: 'var(--color-text-high)',
          secondary: 'var(--color-brand-secondary)',
          surface: 'var(--color-surface-panel)', 
          surfaceContainer: 'var(--color-surface-container)', 
          surfaceContainerHigh: 'var(--color-surface-active)',
          outline: 'var(--color-border-main)', 
          outlineVariant: 'var(--color-text-muted)', 
          onSurface: 'var(--color-text-high)',
          onSurfaceVariant: 'var(--color-text-medium)',
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
      }
    },
  },
  plugins: [],
}

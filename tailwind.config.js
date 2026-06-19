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
        resume: {
          primary: '#1E293B',    // Slate 800 - soft, premium anthracite
          secondary: '#475569',  // Slate 600 - exquisite muted slate for description & body text
          accent: '#7c52ff',     // Vibrant Periwinkle-Purple (Material 3 Seed)
          muted: '#64748B',      // Slate 500 - clean light slate for metadata
          border: '#E2E8F0',     // Slate 200 - clean separators
        },
        m3: {
          primary: '#bb86fc', // Pastel violet key
          onPrimary: '#2d005d',
          primaryContainer: '#4f378b', // Rich purple backing
          onPrimaryContainer: '#eaddff',
          secondary: '#33b5e5', // High fidelity cyber blue-green
          surface: '#121115', // True dark violet-gray surface
          surfaceContainer: '#1c1b21', // Lighter container
          surfaceContainerHigh: '#26242c', // Active items
          outline: '#49454f', // Clean outline border
          outlineVariant: '#79747e', // Faded outline border
          onSurface: '#e6e1e5',
          onSurfaceVariant: '#cac4d0',
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

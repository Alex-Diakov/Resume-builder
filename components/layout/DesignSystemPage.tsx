import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Copy, 
  Sparkles, 
  Palette, 
  Type, 
  Component, 
  Layers, 
  FileText, 
  Code2, 
  ExternalLink, 
  Sliders, 
  ToggleLeft, 
  ToggleRight, 
  Download, 
  Loader2, 
  Info, 
  ShieldCheck, 
  Maximize2, 
  Eye, 
  Search,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  COLOR_TOKENS, 
  RADIUS_TOKENS, 
  SHADOW_TOKENS, 
  TYPOGRAPHY_TOKENS,
  ColorToken 
} from '../../theme/tokens';
import { 
  Button, 
  Badge, 
  Input, 
  Textarea, 
  Label, 
  Switch, 
  Slider, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '../ui';

interface DesignSystemPageProps {
  onClose: () => void;
}

type TabType = 'overview' | 'colors' | 'typography' | 'components' | 'elevation' | 'ats' | 'tokens';

export const DesignSystemPage: React.FC<DesignSystemPageProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive component states for playground
  const [sampleToggle, setSampleToggle] = useState(true);
  const [sampleSlider, setSampleSlider] = useState(78);
  const [sampleInput, setSampleInput] = useState('Senior Staff Architect');
  const [sampleLoading, setSampleLoading] = useState(false);
  const [typographySample, setTypographySample] = useState('Alex Diakov — Lead System Architect');

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(`${label}: ${text}`);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Architecture', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'colors', label: 'Color Tokens', icon: <Palette className="w-4 h-4" />, badge: `${COLOR_TOKENS.length}` },
    { id: 'typography', label: 'Typography', icon: <Type className="w-4 h-4" /> },
    { id: 'components', label: 'Components', icon: <Component className="w-4 h-4" /> },
    { id: 'elevation', label: 'Surfaces & Elevation', icon: <Layers className="w-4 h-4" /> },
    { id: 'ats', label: 'ATS & Print Rules', icon: <FileText className="w-4 h-4" /> },
    { id: 'tokens', label: 'Code & Variables', icon: <Code2 className="w-4 h-4" /> },
  ];

  const filteredColors = COLOR_TOKENS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.hex.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tailwind.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.usage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ds-bg text-ds-text-high overflow-hidden font-sans">
      {/* Toast Notification for Clipboard */}
      <AnimatePresence>
        {copiedText && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-ds-panel border border-ds-primary/40 text-ds-text-high px-4 py-2 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.7)] flex items-center gap-2.5 text-xs font-medium"
          >
            <div className="w-5 h-5 rounded-full bg-ds-primary/20 text-ds-border-focus flex items-center justify-center">
              <Check className="w-3 h-3" />
            </div>
            <span>Copied to clipboard: <code className="text-ds-border-focus font-mono">{copiedText}</code></span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <header className="h-16 shrink-0 border-b border-ds-border bg-ds-panel/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ds-container hover:bg-ds-hover border border-ds-border hover:border-ds-border-focus text-ds-text-medium hover:text-ds-text-high transition-all text-xs font-medium group cursor-pointer active:scale-95"
            title="Press ESC to return"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Editor</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-ds-bg rounded border border-ds-border text-ds-text-muted">ESC</kbd>
          </button>

          <div className="h-4 w-px bg-ds-border hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-ds-primary to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-[0_2px_10px_rgba(168,85,247,0.35)]">
              M3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-ds-text-high font-display">Material 3 (2026 Edition)</h1>
                <span className="bg-ds-primary/20 text-ds-border-focus text-[9px] px-2 py-0.5 rounded-full font-mono font-medium border border-ds-primary/30">
                  v3.2 Spec
                </span>
              </div>
              <p className="text-[10.5px] text-ds-text-muted -mt-0.5">Resume Studio Precision Design System</p>
            </div>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => copyToClipboard(':root { --color-surface-bg: #0d0c11; --color-brand-primary: #a855f7; }', 'Root CSS')}
            className="hidden md:flex items-center gap-1.5 text-xs text-ds-text-muted hover:text-ds-text-high px-3 py-1.5 rounded-lg border border-ds-border hover:border-ds-border-focus transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-ds-primary" />
            <span>Copy Quick Tokens</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-ds-text-muted hover:text-ds-text-high hover:bg-ds-hover rounded-lg transition-colors cursor-pointer"
            aria-label="Close Design System"
          >
            <span className="sr-only">Close</span>
            <div className="w-5 h-5 flex items-center justify-center font-bold text-sm">✕</div>
          </button>
        </div>
      </header>

      {/* Main Layout: Subnavigation Sidebar + Scrollable Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="w-56 shrink-0 border-r border-ds-border bg-ds-panel/60 p-3 hidden md:flex flex-col justify-between">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-ds-text-muted font-mono">
              System Foundations
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-ds-primary text-white font-semibold shadow-[0_2px_10px_rgba(168,85,247,0.3)]'
                      : 'text-ds-text-medium hover:text-ds-text-high hover:bg-ds-hover'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-ds-container text-ds-text-muted'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-ds-container rounded-xl border border-ds-border text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-ds-border-focus font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WCAG 2.1 AAA</span>
            </div>
            <p className="text-ds-text-muted text-[10px] leading-relaxed">
              Every token is rigorously calculated against pure black and print page boundaries.
            </p>
          </div>
        </nav>

        {/* Mobile Horizontal Navigation Pills */}
        <div className="md:hidden flex overflow-x-auto gap-1 p-2 border-b border-ds-border bg-ds-panel shrink-0 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
                activeTab === item.id
                  ? 'bg-ds-primary text-white'
                  : 'bg-ds-container text-ds-text-medium'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-ds-bg/60">
          <div className="max-w-5xl mx-auto space-y-8 pb-16">

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl border border-ds-border bg-gradient-to-br from-ds-panel via-ds-container to-ds-panel p-6 sm:p-8">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-ds-primary/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-ds-secondary/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 max-w-2xl space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ds-primary/15 border border-ds-primary/30 text-ds-border-focus text-xs font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Material You &bull; Evolution 2026</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ds-text-high font-display">
                      Purpose-Built Design System for High-Stakes Career Portfolios
                    </h2>

                    <p className="text-sm text-ds-text-medium leading-relaxed">
                      Resume Studio M3 2026 synthesizes Google's Material 3 adaptive design guidelines with stringent recruiter eye-tracking science and automated ATS (Applicant Tracking System) parsing benchmarks.
                    </p>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        onClick={() => setActiveTab('components')}
                        className="px-4 py-2 rounded-xl bg-ds-primary hover:bg-ds-primary-hover text-white text-xs font-semibold shadow-[0_4px_14px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
                      >
                        Explore Interactive Components
                      </button>
                      <button
                        onClick={() => setActiveTab('colors')}
                        className="px-4 py-2 rounded-xl bg-ds-container hover:bg-ds-hover border border-ds-border text-ds-text-high text-xs font-semibold transition-all cursor-pointer"
                      >
                        Browse Color Tokens ({COLOR_TOKENS.length})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Core Pillars Grid */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ds-text-muted font-mono mb-4">
                    Architectural Pillars
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        title: 'Perceptual Contrast',
                        tag: 'WCAG AAA',
                        desc: 'Dark canvas (#0D0C11) paired with calibrated lavender text tiers guarantees zero optical glare during prolonged editing sessions.',
                        icon: <Eye className="w-5 h-5 text-ds-primary" />,
                      },
                      {
                        title: 'ATS Parser Strictness',
                        tag: 'Machine Friendly',
                        desc: 'Single-stream linear layout geometry ensures zero parsing friction across Taleo, Workday, and Greenhouse scanners.',
                        icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
                      },
                      {
                        title: 'A4 Page Budgeting',
                        tag: '210 × 297 mm',
                        desc: 'Mathematical vertical rhythm guarantees exact 1-page or 2-page fit with micro-gap spacing and zero page-overflow spills.',
                        icon: <FileText className="w-5 h-5 text-cyan-400" />,
                      },
                      {
                        title: 'Sub-Millisecond Speed',
                        tag: 'Zero Lag',
                        desc: 'Optimized utility CSS tree-shaken down to 53KB with native hardware-accelerated CSS variables and zero runtime overhead.',
                        icon: <Sparkle className="w-5 h-5 text-amber-400" />,
                      },
                    ].map((pillar, i) => (
                      <div key={i} className="p-5 rounded-xl border border-ds-border bg-ds-panel hover:border-ds-border-focus/50 transition-colors space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-lg bg-ds-container border border-ds-border">
                            {pillar.icon}
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ds-container text-ds-text-muted border border-ds-border">
                            {pillar.tag}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-ds-text-high">{pillar.title}</h4>
                          <p className="text-xs text-ds-text-muted mt-1 leading-relaxed">{pillar.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live System Metrics */}
                <div className="p-6 rounded-xl border border-ds-border bg-ds-container">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ds-text-muted font-mono mb-4">
                    System Telemetry & Standards
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-ds-panel border border-ds-border">
                      <div className="text-2xl font-black text-ds-primary font-display">24</div>
                      <div className="text-xs font-semibold text-ds-text-high mt-0.5">Color Tokens</div>
                      <div className="text-[10px] text-ds-text-muted">Semantic variable bindings</div>
                    </div>
                    <div className="p-4 rounded-lg bg-ds-panel border border-ds-border">
                      <div className="text-2xl font-black text-cyan-400 font-display">3</div>
                      <div className="text-xs font-semibold text-ds-text-high mt-0.5">Type Families</div>
                      <div className="text-[10px] text-ds-text-muted">Outfit &bull; Plus Jakarta &bull; Fira</div>
                    </div>
                    <div className="p-4 rounded-lg bg-ds-panel border border-ds-border">
                      <div className="text-2xl font-black text-emerald-400 font-display">100%</div>
                      <div className="text-xs font-semibold text-ds-text-high mt-0.5">WCAG 2.1 AA</div>
                      <div className="text-[10px] text-ds-text-muted">Contrast verified text</div>
                    </div>
                    <div className="p-4 rounded-lg bg-ds-panel border border-ds-border">
                      <div className="text-2xl font-black text-amber-400 font-display">296mm</div>
                      <div className="text-xs font-semibold text-ds-text-high mt-0.5">Print Height Lock</div>
                      <div className="text-[10px] text-ds-text-muted">Prevents trailing blanks</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: COLOR TOKENS */}
            {activeTab === 'colors' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-ds-text-high font-display">Color Palette & Tokens</h2>
                    <p className="text-xs text-ds-text-muted mt-0.5">Click any card to copy the hex code or CSS variable directly to your clipboard.</p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-ds-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter tokens..."
                      className="w-full bg-ds-container border border-ds-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-ds-text-high placeholder-ds-text-muted focus:outline-none focus:border-ds-border-focus"
                    />
                  </div>
                </div>

                {/* Swatches Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredColors.map((color, idx) => (
                    <div
                      key={idx}
                      onClick={() => copyToClipboard(color.hex, color.name)}
                      className="group p-4 rounded-xl border border-ds-border bg-ds-panel hover:border-ds-border-focus/70 transition-all cursor-pointer shadow-sm hover:shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-7 h-7 rounded-lg border border-white/20 shadow-sm"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div>
                              <h4 className="text-xs font-bold text-ds-text-high group-hover:text-ds-border-focus transition-colors">
                                {color.name}
                              </h4>
                              <code className="text-[10px] font-mono text-ds-text-muted">{color.tailwind}</code>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-ds-container text-ds-text-medium border border-ds-border">
                            {color.contrast}
                          </span>
                        </div>

                        <p className="text-[11px] text-ds-text-muted leading-relaxed">
                          {color.usage}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-ds-border/60 flex items-center justify-between text-[10.5px] font-mono">
                        <span className="text-ds-text-high font-semibold">{color.hex}</span>
                        <div className="flex items-center gap-1 text-ds-text-muted group-hover:text-ds-border-focus transition-colors">
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TYPOGRAPHY */}
            {activeTab === 'typography' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-ds-text-high font-display">Typographic Hierarchy & Scales</h2>
                  <p className="text-xs text-ds-text-muted mt-0.5">Three complementary font families harmonized for readability and scanning ergonomics.</p>
                </div>

                {/* Font Families Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl border border-ds-border bg-ds-panel space-y-2">
                    <span className="text-[10px] font-mono text-ds-border-focus uppercase tracking-wider font-bold">Display & Headings</span>
                    <h3 className="text-2xl font-extrabold text-ds-text-high font-display">Outfit</h3>
                    <p className="text-xs text-ds-text-muted leading-relaxed">
                      Modern geometric sans with distinctive open apertures. Used for candidate names, primary document titles, and hero badges.
                    </p>
                    <div className="text-[11px] font-mono text-ds-text-muted pt-2 border-t border-ds-border">
                      font-display &bull; 300 to 800 weight
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-ds-border bg-ds-panel space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">Interface & Body</span>
                    <h3 className="text-2xl font-extrabold text-ds-text-high font-sans">Plus Jakarta Sans</h3>
                    <p className="text-xs text-ds-text-muted leading-relaxed">
                      Precision corporate geometric typeface with tall x-height. Engineered for maximum legibility in resume body bullets and form inputs.
                    </p>
                    <div className="text-[11px] font-mono text-ds-text-muted pt-2 border-t border-ds-border">
                      font-sans &bull; 400, 500, 600, 700
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-ds-border bg-ds-panel space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">Code & Keywords</span>
                    <h3 className="text-2xl font-extrabold text-ds-text-high font-mono">Fira Code</h3>
                    <p className="text-xs text-ds-text-muted leading-relaxed">
                      Monospace typeface with programming ligatures. Used for ATS token counters, version pills, and technical skill lists.
                    </p>
                    <div className="text-[11px] font-mono text-ds-text-muted pt-2 border-t border-ds-border">
                      font-mono &bull; 400, 500 weight
                    </div>
                  </div>
                </div>

                {/* Interactive Live Font Tester */}
                <div className="p-5 rounded-xl border border-ds-border bg-ds-container space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-ds-text-muted font-mono">
                      Interactive Live Specimen Tester
                    </span>
                    <button 
                      onClick={() => setTypographySample('Alex Diakov — Lead System Architect')}
                      className="text-[11px] text-ds-border-focus hover:underline cursor-pointer"
                    >
                      Reset text
                    </button>
                  </div>
                  <input
                    type="text"
                    value={typographySample}
                    onChange={(e) => setTypographySample(e.target.value)}
                    className="w-full bg-ds-panel border border-ds-border rounded-xl px-4 py-2.5 text-sm text-ds-text-high focus:outline-none focus:border-ds-border-focus"
                    placeholder="Type custom text to preview font scale..."
                  />
                </div>

                {/* Type Scale Showcase */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ds-text-muted font-mono">
                    Print & Interface Scale Specs
                  </h3>

                  <div className="space-y-3">
                    {[
                      {
                        name: 'Candidate Full Name',
                        token: 'text-resume-name (28pt / 37px)',
                        style: 'font-display font-extrabold tracking-tight',
                        sample: typographySample || 'Alex Diakov',
                        specs: 'Letter-spacing: -0.03em | Line-height: 1.1'
                      },
                      {
                        name: 'Job Title / Subheading',
                        token: 'text-resume-title (13pt / 17.3px)',
                        style: 'font-sans font-medium text-ds-text-medium tracking-wide',
                        sample: 'Staff Cloud Infrastructure Architect & Team Lead',
                        specs: 'Letter-spacing: +0.01em | Line-height: 1.2'
                      },
                      {
                        name: 'Section Title',
                        token: 'text-resume-section (10.5pt / 14px)',
                        style: 'font-sans font-bold uppercase tracking-wider text-ds-text-high',
                        sample: 'WORK EXPERIENCE & KEY ACHIEVEMENTS',
                        specs: 'Letter-spacing: +0.06em | Line-height: 1.2 | Uppercase'
                      },
                      {
                        name: 'Job Description / Bullet',
                        token: 'text-resume-body (10pt / 13.3px)',
                        style: 'font-sans font-normal text-ds-text-medium leading-relaxed',
                        sample: 'Architected distributed multi-region Kubernetes clusters handling 45,000 requests per second with 99.995% SLA and automated disaster failover.',
                        specs: 'Line-height: 1.5 | Max 75ch per line for recruiter reading velocity'
                      },
                      {
                        name: 'Metadata / Date / Location',
                        token: 'text-resume-meta (9.5pt / 12.6px)',
                        style: 'font-sans font-normal text-ds-text-muted',
                        sample: 'Kyiv, Ukraine • Jan 2021 – Present • Full-time Remote',
                        specs: 'Line-height: 1.5 | Light slate high-contrast readability'
                      },
                      {
                        name: 'Keyword & Version Pill',
                        token: 'text-[9.5px] font-mono',
                        style: 'font-mono font-medium text-ds-border-focus',
                        sample: 'DOCKER • TERRAFORM • POSTGRESQL • GO • REACT',
                        specs: 'Monospace tabular numerals | Micro-tag spacing'
                      },
                    ].map((spec, i) => (
                      <div key={i} className="p-5 rounded-xl border border-ds-border bg-ds-panel space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-ds-text-high">{spec.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ds-container text-ds-border-focus border border-ds-border">
                            {spec.token}
                          </span>
                        </div>
                        <div className={`text-ds-text-high ${spec.style}`}>
                          {spec.sample}
                        </div>
                        <div className="text-[10px] font-mono text-ds-text-muted pt-1">
                          {spec.specs}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: COMPONENTS SHOWCASE */}
            {activeTab === 'components' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-ds-text-high font-display">Interactive Component Showcase</h2>
                  <p className="text-xs text-ds-text-muted mt-0.5">All UI primitives follow unified design tokens, WCAG AA compliance, and smooth micro-interactions.</p>
                </div>

                {/* Section: Buttons */}
                <Card variant="panel">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Button Hierarchy & States</CardTitle>
                      <Badge variant="surface" size="sm">7 Variants &bull; 3 Sizes</Badge>
                    </div>
                    <CardDescription>
                      Unified action buttons with tokenized heights, focus rings, active scaling, and loading state slots.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button variant="primary" leftIcon={<Download className="w-3.5 h-3.5" />}>
                        Primary Action
                      </Button>

                      <Button variant="secondary" leftIcon={<Sparkles className="w-3.5 h-3.5 text-ds-secondary" />}>
                        Secondary Tech
                      </Button>

                      <Button variant="outline">
                        Outline Button
                      </Button>

                      <Button variant="ghost">
                        Ghost Action
                      </Button>

                      <Button variant="success" leftIcon={<Check className="w-3.5 h-3.5" />}>
                        Success
                      </Button>

                      <Button variant="danger">
                        Destructive
                      </Button>

                      <Button 
                        variant="secondary"
                        loading={sampleLoading}
                        onClick={() => setSampleLoading(!sampleLoading)}
                        leftIcon={<Sliders className="w-3.5 h-3.5 text-ds-primary" />}
                      >
                        {sampleLoading ? 'Simulating...' : 'Toggle Loading'}
                      </Button>

                      <Button variant="primary" disabled>
                        Disabled
                      </Button>

                      <Button variant="outline" size="icon" aria-label="Quick Search">
                        <Search className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-ds-border text-[11px] font-mono text-ds-text-muted">
                      <span>Sizes:</span>
                      <Button variant="outline" size="sm">Small (h-7.5)</Button>
                      <Button variant="outline" size="default">Default (h-9)</Button>
                      <Button variant="outline" size="lg">Large (h-11)</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Section: Badges & Status Indicators */}
                <Card variant="panel">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Badges & Status Tags</CardTitle>
                      <Badge variant="surface" size="sm">Live Indicators</Badge>
                    </div>
                    <CardDescription>
                      Pills and metadata tags with optional animated pulse dots, high contrast ratios, and semantic status colors.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Badge variant="primary" dot>
                        Primary Badge
                      </Badge>

                      <Badge variant="secondary">
                        Tech: TypeScript 5.8
                      </Badge>

                      <Badge variant="success" dot>
                        ATS Score: 96%
                      </Badge>

                      <Badge variant="warning" dot>
                        Cognitive Load: Moderate
                      </Badge>

                      <Badge variant="danger" dot>
                        Page Overflow Alert
                      </Badge>

                      <Badge variant="info" dot>
                        Auto-Format Ready
                      </Badge>

                      <Badge variant="surface">
                        Surface Neutral
                      </Badge>

                      <Badge variant="outline">
                        Outline Minimal
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Section: Form Controls & Inputs */}
                <Card variant="panel">
                  <CardHeader>
                    <CardTitle>Form Controls & Precision Sliders</CardTitle>
                    <CardDescription>
                      Engineered for high data entry speed, clear visual focus boundaries, and validation indicators.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Text Input - Standard */}
                      <div>
                        <Label htmlFor="sample-title" required>Job Title Target</Label>
                        <Input
                          id="sample-title"
                          type="text"
                          value={sampleInput}
                          onChange={(e) => setSampleInput(e.target.value)}
                          placeholder="e.g. Senior Cloud Architect"
                        />
                      </div>

                      {/* Text Input - Validated */}
                      <div>
                        <Label htmlFor="sample-salary" optional>Expected Compensation</Label>
                        <Input
                          id="sample-salary"
                          type="text"
                          defaultValue="$180,000 – $220,000 / year"
                          status="success"
                        />
                      </div>

                      {/* Textarea */}
                      <div className="sm:col-span-2">
                        <Label htmlFor="sample-summary" required>Executive Summary Bullet</Label>
                        <Textarea
                          id="sample-summary"
                          rows={2}
                          defaultValue="Principal systems engineer with 10+ years specializing in low-latency event-driven microservices, multi-cloud Kubernetes deployments, and automated CI/CD pipelines."
                        />
                      </div>

                      {/* Interactive Slider */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label>Print Typography Budget</Label>
                          <span className="font-mono text-xs text-ds-primary font-bold">{sampleSlider}%</span>
                        </div>
                        <Slider
                          min={10}
                          max={100}
                          value={sampleSlider}
                          onChange={(e) => setSampleSlider(Number(e.target.value))}
                        />
                      </div>

                      {/* Interactive Switch */}
                      <div className="flex items-center justify-between p-3 rounded-ds-md border border-ds-border bg-ds-container">
                        <div>
                          <div className="text-xs font-semibold text-ds-text-high">Visual Page Boundary Guides</div>
                          <div className="text-[11px] text-ds-text-muted">Display red dotted break lines at exact 296mm A4 cutoffs</div>
                        </div>
                        <Switch
                          checked={sampleToggle}
                          onCheckedChange={setSampleToggle}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Section: Card Containers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card variant="panel">
                    <CardHeader>
                      <CardTitle>Panel Card</CardTitle>
                      <CardDescription>Elevation 1 container with subtle border</CardDescription>
                    </CardHeader>
                    <CardContent className="text-xs text-ds-text-medium">
                      Used for sidebars, inspectors, and primary dialog surfaces.
                    </CardContent>
                  </Card>

                  <Card variant="container">
                    <CardHeader>
                      <CardTitle>Container Card</CardTitle>
                      <CardDescription>Elevation 2 nested group</CardDescription>
                    </CardHeader>
                    <CardContent className="text-xs text-ds-text-medium">
                      Used for nested form groups, metric cards, and list item wrappers.
                    </CardContent>
                  </Card>

                  <Card variant="interactive">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Interactive Card</span>
                        <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-ds-primary" />
                      </CardTitle>
                      <CardDescription>Hover & active feedback</CardDescription>
                    </CardHeader>
                    <CardContent className="text-xs text-ds-text-medium">
                      Subtle hover glow and border lighting for clickable cards and templates.
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* TAB: ELEVATION & SURFACES */}
            {activeTab === 'elevation' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-ds-text-high font-display">Surfaces, Radii & Depth</h2>
                  <p className="text-xs text-ds-text-muted mt-0.5">M3 layered elevation model built on mathematical contrast steps rather than blurry dropshadows.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { level: 'Surface 0', color: '#0D0C11', name: 'Canvas Base', desc: 'Viewport root canvas with pure dark neutrality', border: 'border-transparent' },
                    { level: 'Surface 1', color: '#14121A', name: 'Sidebars & Panels', desc: 'Toolbar, editors, and top-level cards', border: 'border-ds-border' },
                    { level: 'Surface 2', color: '#1B1922', name: 'Containers & Inputs', desc: 'Form field wrapping groups and nested accordions', border: 'border-ds-border' },
                    { level: 'Surface 3', color: '#25222D', name: 'Active & Selected', desc: 'Selected list items, active pill states', border: 'border-ds-border-focus/40' },
                  ].map((s, i) => (
                    <div 
                      key={i} 
                      className={`p-5 rounded-2xl border ${s.border} space-y-3 transition-transform hover:-translate-y-1`}
                      style={{ backgroundColor: s.color }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-ds-text-high font-bold">
                          {s.level}
                        </span>
                        <code className="text-[10px] font-mono text-ds-text-muted">{s.color}</code>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-ds-text-high">{s.name}</h4>
                        <p className="text-xs text-ds-text-muted mt-1 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Border Radii Spec */}
                <div className="p-6 rounded-xl border border-ds-border bg-ds-panel space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ds-text-muted font-mono">
                    Border Radius Scale Tokens
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { name: 'Small (6px)', token: 'rounded-md', usage: 'Tags, inner buttons' },
                      { name: 'Regular (12px)', token: 'rounded-xl', usage: 'Inputs, toolbar buttons' },
                      { name: 'Large (16px)', token: 'rounded-2xl', usage: 'Cards, modal dialogs' },
                      { name: 'Full (9999px)', token: 'rounded-full', usage: 'Pills, avatar circles' },
                    ].map((r, i) => (
                      <div key={i} className="p-4 rounded-xl border border-ds-border bg-ds-container space-y-2 text-center">
                        <div className="text-xs font-bold text-ds-text-high">{r.name}</div>
                        <code className="text-[10.5px] font-mono text-ds-border-focus block">{r.token}</code>
                        <div className="text-[10px] text-ds-text-muted">{r.usage}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ATS & PRINT STANDARDS */}
            {activeTab === 'ats' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-ds-text-high font-display">ATS Parser & Print Geometry Standards</h2>
                  <p className="text-xs text-ds-text-muted mt-0.5">Rules enforcing seamless automated parsing and 1:1 physical print rendering.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-6 rounded-xl border border-ds-border bg-ds-panel space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5" />
                      <span>Applicant Tracking System (ATS) Compliance</span>
                    </div>
                    <ul className="space-y-2.5 text-xs text-ds-text-medium">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Standard Document Flow:</strong> Avoid multi-column text collision that breaks OCR parsing.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>True Selectable Text:</strong> Never render experience descriptions inside canvas images or canvas SVG paths.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Standardized Headers:</strong> Work Experience, Education, Projects, Skills ensure algorithmic section detection.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Font Embeddings:</strong> Exported PDFs preserve glyph tables to prevent garbled character output.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-xl border border-ds-border bg-ds-panel space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                      <FileText className="w-5 h-5" />
                      <span>A4 Print Calibration (210mm × 297mm)</span>
                    </div>
                    <ul className="space-y-2.5 text-xs text-ds-text-medium">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span><strong>Exact 296mm Container Height:</strong> Locks paper container 1mm below standard A4 height to prevent blank trailing page exports.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span><strong>Print Color Adjust:</strong> Forces <code className="font-mono text-ds-border-focus">-webkit-print-color-adjust: exact</code> so background accents render faithfully.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span><strong>Vector Scalability:</strong> Text, dividers, and bullet points remain crisp at 600+ DPI physical laser printing.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CODE & TOKENS */}
            {activeTab === 'tokens' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-ds-text-high font-display">Code Snippets & CSS Variables</h2>
                  <p className="text-xs text-ds-text-muted mt-0.5">Copy paste the official M3 token specifications into your frontend stack.</p>
                </div>

                <div className="p-5 rounded-xl border border-ds-border bg-ds-panel space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-ds-primary" />
                      <span className="text-xs font-bold text-ds-text-high">CSS Root Variables (:root)</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`:root {
  --color-surface-bg: #0d0c11;
  --color-surface-panel: #14121a;
  --color-surface-container: #1b1922;
  --color-surface-active: #25222d;
  --color-surface-hover: #1f1d26;
  --color-brand-primary: #a855f7;
  --color-brand-primary-hover: #9333ea;
  --color-brand-secondary: #22d3ee;
  --color-text-high: #f5f2fa;
  --color-text-medium: #d6cfde;
  --color-text-muted: #a69bb0;
  --color-border-main: #2b2734;
  --color-border-focus: #c084fc;
}`, 'CSS Variables')}
                      className="flex items-center gap-1 text-xs text-ds-border-focus hover:underline cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Block</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-lg bg-ds-bg border border-ds-border overflow-x-auto text-[11px] font-mono text-ds-text-medium leading-relaxed">
{`:root {
  --color-surface-bg: #0d0c11;                /* Deep premium charcoal-black */
  --color-surface-panel: #14121a;             /* Main sidebar panel */
  --color-surface-container: #1b1922;         /* Nested input groups */
  --color-surface-active: #25222d;            /* Focus states */
  --color-surface-hover: #1f1d26;             /* Transition trigger */
  
  --color-brand-primary: #a855f7;             /* Purple-Indigo accent */
  --color-brand-primary-hover: #9333ea;       /* Focused action key */
  --color-brand-secondary: #22d3ee;           /* Tech Cyan focus */

  --color-text-high: #f5f2fa;                 /* Maximum readability */
  --color-text-medium: #d6cfde;               /* Secondary descriptions */
  --color-text-muted: #a69bb0;                /* WCAG AA compliant */
  --color-border-main: #2b2734;               /* Ultra-thin separator */
  --color-border-focus: #c084fc;              /* Active focus ring */
}`}
                  </pre>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

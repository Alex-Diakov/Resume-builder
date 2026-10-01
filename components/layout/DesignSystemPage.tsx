import React, { useState, useEffect, useMemo } from 'react';
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
  RotateCcw,
  Search,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  SlidersHorizontal,
  Wand2,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  DEFAULT_RADIUS_TOKENS, 
  DEFAULT_SHADOW_TOKENS, 
  DEFAULT_TYPOGRAPHY_TOKENS,
  ColorToken,
  getContrastRatio,
  getWCAGRating
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

type TabType = 'overview' | 'studio' | 'colors' | 'typography' | 'components' | 'elevation' | 'code';

export const DesignSystemPage: React.FC<DesignSystemPageProps> = ({ onClose }) => {
  const { 
    tokens, 
    presets, 
    activePresetId, 
    isCustomized, 
    updateColorToken, 
    applyPreset, 
    resetToDefaults,
    exportRootCss,
    exportJsonTokens
  } = useTheme();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Selected token for fine-tuning editor
  const [editingToken, setEditingToken] = useState<ColorToken | null>(null);
  const [customHexInput, setCustomHexInput] = useState<string>('');

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

  // Sync token editor input when an item is selected
  const handleSelectTokenToEdit = (token: ColorToken) => {
    setEditingToken(token);
    setCustomHexInput(token.hex);
  };

  const handleApplyCustomHex = (variable: string, hex: string) => {
    updateColorToken(variable, hex);
    setCustomHexInput(hex);
    if (editingToken && editingToken.variable === variable) {
      setEditingToken({ ...editingToken, hex });
    }
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Architecture', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'studio', label: 'Live Theme Studio', icon: <Wand2 className="w-4 h-4" />, badge: 'Live Tuner' },
    { id: 'colors', label: 'Color Tokens (SSOT)', icon: <Palette className="w-4 h-4" />, badge: `${tokens.length}` },
    { id: 'typography', label: 'Typography', icon: <Type className="w-4 h-4" /> },
    { id: 'components', label: 'Components', icon: <Component className="w-4 h-4" /> },
    { id: 'elevation', label: 'Surfaces & Elevation', icon: <Layers className="w-4 h-4" /> },
    { id: 'code', label: 'Code & Variables', icon: <Code2 className="w-4 h-4" /> },
  ];

  const filteredColors = useMemo(() => {
    return tokens.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.hex.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.variable.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tailwind.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.usage.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tokens, searchQuery, selectedCategory]);

  const activePreset = presets.find(p => p.id === activePresetId);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-md-surface text-md-on-surface overflow-hidden font-sans select-none">
      {/* Toast Notification for Clipboard */}
      <AnimatePresence>
        {copiedText && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-md-surface-container-high border border-md-primary/40 text-md-on-surface px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-medium"
          >
            <div className="w-5 h-5 rounded-full bg-md-primary/20 text-md-primary flex items-center justify-center">
              <Check className="w-3 h-3" />
            </div>
            <span>Copied: <code className="text-md-primary font-mono">{copiedText}</code></span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <header className="h-16 shrink-0 border-b border-white/[0.08] bg-md-surface-container-low/95 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] text-md-on-surface-variant hover:text-md-on-surface transition-all text-xs font-medium group cursor-pointer active:scale-95"
            title="Press ESC to return"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Editor</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white/[0.06] rounded border border-white/[0.1] text-md-on-surface-variant">ESC</kbd>
          </button>

          <div className="h-4 w-px bg-white/[0.08] hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md-md bg-md-primary text-md-on-primary flex items-center justify-center font-bold text-sm shadow-sm">
              M3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-md-on-surface font-display">Material 3 Design System</h1>
                <span className="bg-md-primary/15 text-md-primary text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold border border-md-primary/30">
                  {isCustomized ? 'Custom Tuned' : (activePreset?.name || 'SSOT Active')}
                </span>
              </div>
              <p className="text-[11px] text-md-on-surface-variant -mt-0.5">Unified Token Source of Truth & Live Studio</p>
            </div>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2.5">
          {isCustomized && (
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-1.5 text-xs text-md-on-surface-variant hover:text-md-error px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-md-error-container/20 border border-white/[0.08] hover:border-md-error/30 transition-all cursor-pointer"
              title="Reset all tokens back to default Material 3 specifications"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          )}

          <button
            onClick={() => copyToClipboard(exportRootCss(), ':root CSS')}
            className="hidden sm:flex items-center gap-1.5 text-xs text-md-on-surface-variant hover:text-md-on-surface px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] transition-colors cursor-pointer"
            title="Copy current live tokens as CSS variables"
          >
            <Copy className="w-3.5 h-3.5 text-md-primary" />
            <span>Copy CSS</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.06] rounded-full transition-colors cursor-pointer"
            aria-label="Close Design System"
          >
            <div className="w-5 h-5 flex items-center justify-center font-bold text-sm">✕</div>
          </button>
        </div>
      </header>

      {/* Main Layout: Subnavigation Sidebar + Scrollable Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="w-58 shrink-0 border-r border-white/[0.08] bg-md-surface-container-low/60 p-3 hidden md:flex flex-col justify-between select-none">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-md-on-surface-variant font-mono">
              System Foundations
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-md-primary text-md-on-primary font-semibold shadow-sm'
                      : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                      isActive ? 'bg-md-on-primary/20 text-md-on-primary' : 'bg-white/[0.06] text-md-on-surface-variant'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3.5 bg-md-surface-container rounded-md-lg border border-white/[0.06] text-[11px] space-y-2">
            <div className="flex items-center gap-1.5 text-md-primary font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Real-Time SSOT</span>
            </div>
            <p className="text-md-on-surface-variant text-[10.5px] leading-relaxed">
              Every token edited in this studio automatically writes to runtime CSS variables and reflects across the entire application instantly.
            </p>
          </div>
        </nav>

        {/* Mobile Horizontal Navigation Pills */}
        <div className="md:hidden flex overflow-x-auto gap-1 p-2 border-b border-white/[0.08] bg-md-surface-container-low shrink-0 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 ${
                activeTab === item.id
                  ? 'bg-md-primary text-md-on-primary font-semibold'
                  : 'bg-white/[0.04] text-md-on-surface-variant'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-md-surface">
          <div className="max-w-5xl mx-auto space-y-8 pb-20 select-text">

            {/* TAB: ARCHITECTURE OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-md-xl border border-white/[0.08] bg-md-surface-container-low p-6 sm:p-8">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-md-primary/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-md-tertiary/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 max-w-2xl space-y-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-md-primary/15 text-md-primary border border-md-primary/30">
                      <Sparkles className="w-3 h-3" />
                      Single Source of Truth Architecture
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-md-on-surface">
                      One Unified Token System. Zero Desynchronization.
                    </h2>

                    <p className="text-sm text-md-on-surface-variant leading-relaxed">
                      All visual dimensions — tonal surfaces, interactive accents, translucent hairline strokes, typography, and paper physics — are mapped to semantic CSS tokens. Changing a token here updates the live application in real-time.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Button 
                        variant="primary" 
                        leftIcon={<Wand2 className="w-4 h-4" />}
                        onClick={() => setActiveTab('studio')}
                      >
                        Open Live Theme Studio
                      </Button>
                      <Button 
                        variant="secondary"
                        leftIcon={<Palette className="w-4 h-4" />}
                        onClick={() => setActiveTab('colors')}
                      >
                        Explore All 24 Tokens
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 1-Click Preset Switcher Banner */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-md-on-surface font-display">Curated Production Presets</h3>
                      <p className="text-xs text-md-on-surface-variant">Switch the entire application mood with a single click.</p>
                    </div>
                    {isCustomized && (
                      <button 
                        onClick={resetToDefaults}
                        className="text-xs text-md-primary hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore Factory Defaults</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {presets.map((preset) => {
                      const isActive = activePresetId === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => applyPreset(preset.id)}
                          className={`p-4 rounded-md-lg border transition-all cursor-pointer text-left space-y-3 relative group ${
                            isActive
                              ? 'bg-md-primary/10 border-md-primary/40 ring-1 ring-md-primary/30 shadow-md-elevation-1'
                              : 'bg-md-surface-container-low border-white/[0.06] hover:border-white/[0.14] hover:bg-md-surface-container'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Swatch Trio */}
                              <div className="flex -space-x-1.5 overflow-hidden">
                                {preset.previewColors.map((color, idx) => (
                                  <div
                                    key={idx}
                                    className="w-5 h-5 rounded-full border border-md-surface shadow-xs"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                              <h4 className="text-xs font-semibold text-md-on-surface">{preset.name}</h4>
                            </div>

                            {isActive && (
                              <CheckCircle2 className="w-4 h-4 text-md-primary shrink-0" />
                            )}
                          </div>

                          <p className="text-[11px] text-md-on-surface-variant leading-relaxed line-clamp-2">
                            {preset.tagline}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Core Architectural Foundations */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-md-on-surface-variant font-mono">
                    System Foundations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {[
                      {
                        title: 'Tonal Elevation',
                        tag: 'M3 2026',
                        desc: 'Five-tier container hierarchy (lowest to highest) provides natural depth without optical glare.',
                        icon: <Layers className="w-4 h-4 text-md-primary" />,
                      },
                      {
                        title: 'Subtle Hairlines',
                        tag: 'color-mix',
                        desc: 'Translucent borders dynamically blend with parent surface colors, eliminating harsh chalky wireframes.',
                        icon: <SlidersHorizontal className="w-4 h-4 text-md-tertiary" />,
                      },
                      {
                        title: 'WCAG AAA Contrast',
                        tag: 'Accessible',
                        desc: 'Every headline, body copy, and badge is verified for maximum legibility in low and high ambient light.',
                        icon: <Eye className="w-4 h-4 text-md-success" />,
                      },
                      {
                        title: 'A4 Physical Budget',
                        tag: '210 × 297 mm',
                        desc: 'Mathematical vertical rhythm locks page height to prevent trailing blank page spills.',
                        icon: <FileText className="w-4 h-4 text-md-warning" />,
                      },
                    ].map((pillar, i) => (
                      <div key={i} className="p-4 rounded-md-lg border border-white/[0.06] bg-md-surface-container-low space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-md-sm bg-white/[0.04] border border-white/[0.06]">
                            {pillar.icon}
                          </div>
                          <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-md-on-surface-variant border border-white/[0.06]">
                            {pillar.tag}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-md-on-surface">{pillar.title}</h4>
                          <p className="text-[11px] text-md-on-surface-variant mt-1 leading-relaxed">{pillar.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LIVE THEME STUDIO / TUNER */}
            {activeTab === 'studio' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-md-on-surface font-display">Live Token Tuner & Studio</h2>
                  <p className="text-xs text-md-on-surface-variant mt-0.5">
                    Click any key token to edit its color live. Your changes instantly propagate across the entire editor and document workspace.
                  </p>
                </div>

                {/* Preset Fast Switcher */}
                <div className="p-4 rounded-md-xl border border-white/[0.08] bg-md-surface-container-low space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-md-on-surface">Select Base Palette:</span>
                    <span className="text-[11px] font-mono text-md-primary">
                      {isCustomized ? 'Custom Overrides Active' : activePreset?.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {presets.map((preset) => {
                      const isActive = activePresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => applyPreset(preset.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            isActive
                              ? 'bg-md-primary text-md-on-primary font-semibold shadow-sm'
                              : 'bg-white/[0.04] text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.08] border border-white/[0.06]'
                          }`}
                        >
                          <div 
                            className="w-3 h-3 rounded-full border border-white/20" 
                            style={{ backgroundColor: preset.previewColors[0] }} 
                          />
                          <span>{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Key Token Tuners */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Primary Brand Color', variable: '--md-sys-color-primary', desc: 'Main interactive elements, active rail icons, focus rings' },
                    { label: 'Primary Container', variable: '--md-sys-color-primary-container', desc: 'Active headers, tonal button fills, selection highlight' },
                    { label: 'Secondary Accent', variable: '--md-sys-color-secondary', desc: 'Secondary buttons, filter chips, navigation indicators' },
                    { label: 'Tertiary / Tech Color', variable: '--md-sys-color-tertiary', desc: 'ATS keyword anchors, skill tags, diagnostic metrics' },
                    { label: 'Base Canvas Background', variable: '--md-sys-color-surface', desc: 'Root background behind document canvas and sidebar' },
                    { label: 'Sidebar & Panel Surface', variable: '--md-sys-color-surface-container-low', desc: 'Toolbar, navigation rail, inactive accordion headers' },
                    { label: 'Expanded Container Surface', variable: '--md-sys-color-surface-container', desc: 'Accordion bodies, tool drawers, form card groups' },
                    { label: 'Subtle Hairline Outline', variable: '--md-sys-color-outline-variant', desc: 'Panel dividers, card outlines, subtle separators' },
                  ].map((item) => {
                    const currentToken = tokens.find(t => t.variable === item.variable);
                    const currentHex = currentToken?.hex || '#ffffff';
                    
                    return (
                      <div
                        key={item.variable}
                        className="p-4 rounded-md-lg border border-white/[0.06] bg-md-surface-container-low hover:border-white/[0.12] transition-colors space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-semibold text-md-on-surface">{item.label}</h4>
                            <code className="text-[10px] font-mono text-md-on-surface-variant">{item.variable}</code>
                          </div>
                          
                          {/* Live Color Picker Trigger */}
                          <div className="flex items-center gap-2">
                            <label className="relative cursor-pointer flex items-center">
                              <input
                                type="color"
                                value={currentHex.startsWith('#') && currentHex.length === 7 ? currentHex : '#d0bcff'}
                                onChange={(e) => handleApplyCustomHex(item.variable, e.target.value)}
                                className="sr-only"
                              />
                              <div
                                className="w-8 h-8 rounded-md-sm border border-white/20 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                                style={{ backgroundColor: `var(${item.variable})` }}
                                title="Click to open color picker"
                              />
                            </label>
                            
                            <input
                              type="text"
                              value={currentHex}
                              onChange={(e) => handleApplyCustomHex(item.variable, e.target.value)}
                              className="w-24 px-2 py-1 rounded bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-md-on-surface focus:outline-none focus:border-md-primary"
                            />
                          </div>
                        </div>

                        <p className="text-[11px] text-md-on-surface-variant leading-relaxed">
                          {item.desc}
                        </p>

                        <div className="flex items-center justify-between text-[10.5px] font-mono pt-1 border-t border-white/[0.04]">
                          <span className="text-md-on-surface-variant">Live contrast:</span>
                          <span className="font-semibold text-md-primary">{currentToken?.contrast || 'AA'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live Preview Playground */}
                <div className="p-6 rounded-md-xl border border-white/[0.08] bg-md-surface-container space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-md-on-surface font-display">Live Reactive Playground</h3>
                      <p className="text-xs text-md-on-surface-variant">These controls use the exact tokens you tune above.</p>
                    </div>
                    <Badge variant="primary" dot>Live Synced</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-2">
                      <span className="text-[11px] text-md-on-surface-variant font-medium">Buttons & Actions</span>
                      <div className="flex flex-col gap-2">
                        <Button variant="primary" fullWidth leftIcon={<Check className="w-3.5 h-3.5" />}>Primary Button</Button>
                        <Button variant="secondary" fullWidth>Secondary Button</Button>
                        <Button variant="outline" fullWidth>Outline Button</Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] text-md-on-surface-variant font-medium">Form Input & Badges</span>
                      <div className="space-y-2.5">
                        <Input placeholder="Type to test focus rings..." defaultValue="Live token testing" />
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="primary">Primary</Badge>
                          <Badge variant="secondary">Secondary</Badge>
                          <Badge variant="success" dot>98% ATS</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] text-md-on-surface-variant font-medium">Sliders & Toggles</span>
                      <div className="p-3 bg-md-surface-container-low rounded-md-md border border-white/[0.06] space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span>Adaptive Fit</span>
                          <Switch checked={sampleToggle} onCheckedChange={setSampleToggle} size="sm" />
                        </div>
                        <Slider 
                          value={sampleSlider} 
                          min={0} 
                          max={100} 
                          onChange={(e) => setSampleSlider(Number(e.target.value))} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: COLOR TOKENS SWATCHES */}
            {activeTab === 'colors' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-md-on-surface font-display">Color Palette & Tokens (SSOT)</h2>
                    <p className="text-xs text-md-on-surface-variant mt-0.5">Click any token to copy its CSS variable or hex value.</p>
                  </div>

                  {/* Search filter */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-md-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter tokens by name, hex, tailwind..."
                      className="w-full bg-md-surface-container-low border border-white/[0.08] rounded-full pl-9 pr-3 py-1.5 text-xs text-md-on-surface placeholder:text-md-on-surface-variant focus:outline-none focus:border-md-primary"
                    />
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { id: 'all', label: 'All Tokens' },
                    { id: 'brand', label: 'Brand & Accents' },
                    { id: 'surface', label: 'Tonal Surfaces' },
                    { id: 'content', label: 'Typography & Content' },
                    { id: 'outline', label: 'Outlines & Dividers' },
                    { id: 'status', label: 'Status & Badges' },
                    { id: 'print', label: 'Print & Canvas' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
                        selectedCategory === cat.id
                          ? 'bg-md-primary text-md-on-primary font-semibold'
                          : 'bg-white/[0.04] text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.08]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Swatches Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredColors.map((color) => (
                    <div
                      key={color.variable}
                      onClick={() => copyToClipboard(color.variable, color.name)}
                      className="group p-4 rounded-md-lg border border-white/[0.06] bg-md-surface-container-low hover:border-md-primary/40 transition-all cursor-pointer shadow-sm flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            {/* Live CSS variable driven swatch */}
                            <div 
                              className="w-8 h-8 rounded-md-sm border border-white/20 shadow-sm shrink-0"
                              style={{ backgroundColor: `var(${color.variable})` }}
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-md-on-surface group-hover:text-md-primary transition-colors truncate">
                                {color.name}
                              </h4>
                              <code className="text-[10px] font-mono text-md-on-surface-variant">{color.tailwind}</code>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-md-on-surface-variant border border-white/[0.06]">
                            {color.contrast}
                          </span>
                        </div>

                        <p className="text-[11px] text-md-on-surface-variant leading-relaxed line-clamp-2">
                          {color.usage}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10.5px] font-mono">
                        <span className="text-md-on-surface font-semibold">{color.hex}</span>
                        <div className="flex items-center gap-1 text-md-on-surface-variant group-hover:text-md-primary transition-colors">
                          <Copy className="w-3 h-3" />
                          <span>Copy var</span>
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
                  <h2 className="text-xl font-bold text-md-on-surface font-display">Typographic Hierarchy & Scales</h2>
                  <p className="text-xs text-md-on-surface-variant mt-0.5">Plus Jakarta Sans & Fira Code calibrated for readability and fast parsing ergonomics.</p>
                </div>

                {/* Font Families */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-md-lg border border-white/[0.06] bg-md-surface-container-low space-y-2">
                    <span className="text-[10px] font-mono text-md-primary uppercase tracking-wider font-bold">Display & Interface</span>
                    <h3 className="text-2xl font-bold text-md-on-surface font-display">Plus Jakarta Sans</h3>
                    <p className="text-xs text-md-on-surface-variant leading-relaxed">
                      Clean geometric sans designed specifically for high-density document reading, UI headers, and recruiter evaluation speed.
                    </p>
                    <div className="text-[11px] font-mono text-md-on-surface-variant pt-2 border-t border-white/[0.04]">
                      font-sans, font-display &bull; 400 to 700 weight
                    </div>
                  </div>

                  <div className="p-5 rounded-md-lg border border-white/[0.06] bg-md-surface-container-low space-y-2">
                    <span className="text-[10px] font-mono text-md-tertiary uppercase tracking-wider font-bold">Code & Data</span>
                    <h3 className="text-2xl font-bold text-md-on-surface font-mono">Fira Code</h3>
                    <p className="text-xs text-md-on-surface-variant leading-relaxed">
                      High-legibility monospace with programming ligatures for JSON schemas, token variable names, and ATS metadata strings.
                    </p>
                    <div className="text-[11px] font-mono text-md-on-surface-variant pt-2 border-t border-white/[0.04]">
                      font-mono &bull; 400 to 600 weight
                    </div>
                  </div>
                </div>

                {/* Typography Hierarchy Table */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-md-on-surface-variant font-mono">
                    Type Scales
                  </h3>
                  <div className="space-y-2.5">
                    {DEFAULT_TYPOGRAPHY_TOKENS.map((token, i) => (
                      <div key={i} className="p-4 rounded-md-lg border border-white/[0.06] bg-md-surface-container-low space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-md-on-surface">{token.name} ({token.role})</span>
                          <span className="font-mono text-[10px] text-md-primary">{token.fontSize} &bull; {token.lineHeight}</span>
                        </div>
                        <div className={token.tailwind}>
                          {token.name} — Quick brown fox jumps over the lazy dog
                        </div>
                        <div className="text-[10px] font-mono text-md-on-surface-variant">
                          {token.usage}
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
                  <h2 className="text-xl font-bold text-md-on-surface font-display">Interactive Component Showcase</h2>
                  <p className="text-xs text-md-on-surface-variant mt-0.5">Every UI primitive is linked to the active tokens in real-time.</p>
                </div>

                {/* Section: Buttons */}
                <Card variant="panel">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Button Hierarchy & States</CardTitle>
                      <Badge variant="surface" size="sm">7 Variants</Badge>
                    </div>
                    <CardDescription>
                      M3 compliant button variants with tokenized focus rings, active scaling, and loading state slots.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Button variant="primary">Primary Action</Button>
                      <Button variant="secondary">Secondary Action</Button>
                      <Button variant="tonal">Tonal Button</Button>
                      <Button variant="elevated">Elevated Button</Button>
                      <Button variant="outline">Outline Button</Button>
                      <Button variant="ghost">Ghost Button</Button>
                      <Button variant="success">Success Action</Button>
                      <Button variant="danger">Destructive Action</Button>
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
                      Metadata chips and indicator tags with semantic status roles.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Badge variant="primary" dot>Primary Badge</Badge>
                      <Badge variant="secondary">Secondary: TypeScript 5.8</Badge>
                      <Badge variant="success" dot>ATS Score: 98%</Badge>
                      <Badge variant="warning" dot>Moderate Load</Badge>
                      <Badge variant="danger" dot>Overflow Notice</Badge>
                      <Badge variant="info" dot>Realtime Synced</Badge>
                      <Badge variant="surface">Surface Container</Badge>
                      <Badge variant="outline">Outline Stroke</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Section: Form Controls & Inputs */}
                <Card variant="panel">
                  <CardHeader>
                    <CardTitle>Form Controls & Sliders</CardTitle>
                    <CardDescription>
                      Interactive inputs, switches, and sliders tuned for high-velocity resume creation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="sample-title" required>Job Title Target</Label>
                        <Input
                          id="sample-title"
                          type="text"
                          value={sampleInput}
                          onChange={(e) => setSampleInput(e.target.value)}
                          placeholder="e.g. Senior Staff Architect"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sample-switch">Adaptive Anti-Void Micro-Compression</Label>
                          <Switch
                            id="sample-switch"
                            checked={sampleToggle}
                            onCheckedChange={setSampleToggle}
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-md-on-surface-variant">Section Spacing:</span>
                            <span className="font-mono text-md-primary font-medium">{sampleSlider}%</span>
                          </div>
                          <Slider
                            value={sampleSlider}
                            min={0}
                            max={100}
                            onChange={(e) => setSampleSlider(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* TAB: SURFACES & ELEVATION */}
            {activeTab === 'elevation' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-md-on-surface font-display">Tonal Surfaces & Elevation Tiers</h2>
                  <p className="text-xs text-md-on-surface-variant mt-0.5">Material 3 elevation system using calibrated container backgrounds and micro-shadows.</p>
                </div>

                {/* Surface Tiers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Surface Canvas (Base)', bg: 'bg-md-surface', var: '--md-sys-color-surface', desc: 'Root background layer' },
                    { name: 'Container Lowest', bg: 'bg-md-surface-container-lowest', var: '--md-sys-color-surface-container-lowest', desc: 'Deep code areas, JSON editor' },
                    { name: 'Container Low', bg: 'bg-md-surface-container-low', var: '--md-sys-color-surface-container-low', desc: 'Sidebar rail, top app bar' },
                    { name: 'Container (Standard)', bg: 'bg-md-surface-container', var: '--md-sys-color-surface-container', desc: 'Accordion bodies, main drawer' },
                    { name: 'Container High', bg: 'bg-md-surface-container-high', var: '--md-sys-color-surface-container-high', desc: 'Dropdown menus, modal surfaces' },
                    { name: 'Container Highest', bg: 'bg-md-surface-container-highest', var: '--md-sys-color-surface-container-highest', desc: 'Floating tooltips, quick actions' },
                  ].map((s, idx) => (
                    <div key={idx} className={`p-5 rounded-md-lg border border-white/[0.08] ${s.bg} space-y-2`}>
                      <div className="text-xs font-semibold text-md-on-surface">{s.name}</div>
                      <code className="text-[10px] font-mono text-md-on-surface-variant block">{s.var}</code>
                      <p className="text-[11px] text-md-on-surface-variant">{s.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Elevation Shadows */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-md-on-surface-variant font-mono">
                    Elevation Shadow Tokens
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {DEFAULT_SHADOW_TOKENS.map((sh) => (
                      <div
                        key={sh.id}
                        className={`p-4 rounded-md-lg bg-md-surface-container-low border border-white/[0.06] ${sh.tailwind} space-y-2 text-center`}
                      >
                        <div className="text-xs font-semibold text-md-on-surface">{sh.name}</div>
                        <code className="text-[10px] font-mono text-md-primary block">{sh.tailwind}</code>
                        <div className="text-[10px] text-md-on-surface-variant">{sh.usage}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CODE & VARIABLES */}
            {activeTab === 'code' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-md-on-surface font-display">Exportable Tokens (SSOT)</h2>
                    <p className="text-xs text-md-on-surface-variant mt-0.5">
                      Production-ready CSS variables and JSON schema dynamically generated from current active state.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="primary" 
                      leftIcon={<Copy className="w-3.5 h-3.5" />}
                      onClick={() => copyToClipboard(exportRootCss(), 'CSS Variables')}
                    >
                      Copy :root CSS
                    </Button>
                    <Button 
                      variant="secondary" 
                      leftIcon={<Copy className="w-3.5 h-3.5" />}
                      onClick={() => copyToClipboard(exportJsonTokens(), 'JSON Schema')}
                    >
                      Copy JSON
                    </Button>
                  </div>
                </div>

                {/* CSS Block Display */}
                <div className="p-4 rounded-md-lg bg-md-surface-container-lowest border border-white/[0.08] overflow-x-auto">
                  <pre className="text-xs font-mono text-md-on-surface leading-relaxed whitespace-pre">
                    {exportRootCss()}
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

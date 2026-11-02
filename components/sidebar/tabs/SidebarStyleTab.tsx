import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  RotateCcw, 
  Sparkles, 
  Check, 
  FileText,
  SlidersHorizontal,
  Maximize2,
  Columns
} from 'lucide-react';
import { useResumeContext } from '../../../contexts/ResumeContext';
import { ResumeHeaderStyle, ResumeStyleSettings, DEFAULT_STYLE_SETTINGS } from '../../../types';
import { Button } from '../../ui/Button';
import { Switch } from '../../ui/Switch';
import { ScrubberInput } from '../../ui/ScrubberInput';

interface ThemePreset {
  id: string;
  name: string;
  accent: string;
  primary: string;
  secondary: string;
  border: string;
  paper: string;
  headingFont: string;
  bodyFont: string;
  headerStyle: ResumeHeaderStyle;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'm3-violet',
    name: 'M3 Violet',
    accent: '#6750a4',
    primary: '#1e293b',
    secondary: '#475569',
    border: '#e2e8f0',
    paper: '#ffffff',
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'Inter, sans-serif',
    headerStyle: 'underline',
  },
  {
    id: 'executive-navy',
    name: 'Executive Navy',
    accent: '#1e40af',
    primary: '#0f172a',
    secondary: '#334155',
    border: '#cbd5e1',
    paper: '#ffffff',
    headingFont: '"Plus Jakarta Sans", sans-serif',
    bodyFont: 'Inter, sans-serif',
    headerStyle: 'divider',
  },
  {
    id: 'emerald-growth',
    name: 'Emerald Growth',
    accent: '#059669',
    primary: '#064e3b',
    secondary: '#374151',
    border: '#d1fae5',
    paper: '#ffffff',
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'Inter, sans-serif',
    headerStyle: 'left-bar',
  },
  {
    id: 'crimson-bold',
    name: 'Crimson Executive',
    accent: '#b91c1c',
    primary: '#18181b',
    secondary: '#3f3f46',
    border: '#f4f4f5',
    paper: '#ffffff',
    headingFont: '"Plus Jakarta Sans", sans-serif',
    bodyFont: 'Inter, sans-serif',
    headerStyle: 'boxed',
  },
  {
    id: 'editorial-serif',
    name: 'Editorial Serif',
    accent: '#4338ca',
    primary: '#18181b',
    secondary: '#52525b',
    border: '#e4e4e7',
    paper: '#fefdfb',
    headingFont: '"Playfair Display", serif',
    bodyFont: 'Merriweather, serif',
    headerStyle: 'minimal',
  },
  {
    id: 'monochrome-pro',
    name: 'Monochrome Pure',
    accent: '#18181b',
    primary: '#09090b',
    secondary: '#52525b',
    border: '#e4e4e7',
    paper: '#ffffff',
    headingFont: '"Plus Jakarta Sans", sans-serif',
    bodyFont: 'Inter, sans-serif',
    headerStyle: 'underline',
  },
];

const FONT_PAIRINGS = [
  {
    id: 'modern-tech',
    label: 'Modern Tech',
    heading: 'Outfit, sans-serif',
    body: 'Inter, sans-serif',
  },
  {
    id: 'executive-sans',
    label: 'Executive Sans',
    heading: '"Plus Jakarta Sans", sans-serif',
    body: '"Plus Jakarta Sans", sans-serif',
  },
  {
    id: 'editorial-classic',
    label: 'Editorial Serif',
    heading: '"Playfair Display", serif',
    body: 'Merriweather, serif',
  },
  {
    id: 'engineering-mono',
    label: 'Monospace Code',
    heading: '"Fira Code", monospace',
    body: 'Inter, sans-serif',
  },
];

const HEADING_FONT_OPTIONS = [
  { value: 'Outfit, sans-serif', label: 'Outfit (Modern Display)' },
  { value: '"Plus Jakarta Sans", sans-serif', label: 'Plus Jakarta Sans (Executive)' },
  { value: 'Inter, sans-serif', label: 'Inter (Clean Neutral)' },
  { value: '"Playfair Display", serif', label: 'Playfair Display (Editorial Serif)' },
  { value: 'Merriweather, serif', label: 'Merriweather (Classic Serif)' },
  { value: '"Fira Code", monospace', label: 'Fira Code (Monospace Tech)' },
];

const BODY_FONT_OPTIONS = [
  { value: 'Inter, sans-serif', label: 'Inter (High Legibility)' },
  { value: '"Plus Jakarta Sans", sans-serif', label: 'Plus Jakarta Sans (Crisp Modern)' },
  { value: 'Merriweather, serif', label: 'Merriweather (Warm Serif)' },
  { value: '"Fira Code", monospace', label: 'Fira Code (Code & Monospace)' },
];

const HEADER_STYLES: { id: ResumeHeaderStyle; label: string }[] = [
  { id: 'underline', label: 'Underline' },
  { id: 'divider', label: 'Divider' },
  { id: 'left-bar', label: 'Left Bar' },
  { id: 'boxed', label: 'Boxed' },
  { id: 'minimal', label: 'Minimal' },
];

const ACCENT_SWATCHES = [
  '#6750a4', // M3 Violet
  '#1e40af', // Royal Blue
  '#0284c7', // Sky Cyan
  '#059669', // Emerald
  '#d97706', // Amber Gold
  '#b91c1c', // Crimson
  '#475569', // Slate
  '#18181b', // Pure Black
];

const PAPER_SWATCHES = [
  { label: 'White', value: '#ffffff' },
  { label: 'Off-White', value: '#fcfcfc' },
  { label: 'Ivory', value: '#fefdfb' },
  { label: 'Slate', value: '#f8fafc' },
];

export const SidebarStyleTab: React.FC = () => {
  const {
    styleSettings,
    handleUpdateStyleSettings,
    paddingTopBottom,
    setPaddingTopBottom,
    paddingLeftRight,
    setPaddingLeftRight,
    sectionSpacing,
    setSectionSpacing,
    itemSpacing,
    setItemSpacing,
    spacingPreset,
    handleApplySpacingPreset,
    showPageGuides,
    setShowPageGuides,
    enableAdaptiveFit,
    setEnableAdaptiveFit,
    autoFitContent
  } = useResumeContext();

  const [activeSection, setActiveSection] = useState<'themes' | 'typography' | 'headers' | 'layout'>('themes');
  const [resetConfirm, setResetConfirm] = useState(false);

  const applyPreset = (preset: ThemePreset) => {
    handleUpdateStyleSettings({
      accentColor: preset.accent,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      borderColor: preset.border,
      paperBackground: preset.paper,
      headingFont: preset.headingFont,
      bodyFont: preset.bodyFont,
      headerStyle: preset.headerStyle,
    });
  };

  const handleResetDefaults = () => {
    handleUpdateStyleSettings(DEFAULT_STYLE_SETTINGS);
    handleApplySpacingPreset('standard');
    setShowPageGuides(true);
    setEnableAdaptiveFit(true);
    setResetConfirm(true);
    setTimeout(() => setResetConfirm(false), 2000);
  };

  return (
    <div className="p-4 flex flex-col gap-3.5 text-xs text-md-on-surface">
      {/* Inspector Segmented Switcher & Quick Actions */}
      <div className="flex items-center gap-1.5">
        <div className="flex-1 grid grid-cols-4 gap-0.5 p-0.5 bg-md-surface-container border border-md-outline-variant/30 rounded-btn-md">
          <button
            type="button"
            onClick={() => setActiveSection('themes')}
            className={`py-1 text-[11px] font-medium rounded-btn-sm transition-all ${
              activeSection === 'themes'
                ? 'bg-md-primary text-md-on-primary shadow-xs font-semibold'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.04]'
            }`}
          >
            Themes
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('typography')}
            className={`py-1 text-[11px] font-medium rounded-btn-sm transition-all ${
              activeSection === 'typography'
                ? 'bg-md-primary text-md-on-primary shadow-xs font-semibold'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.04]'
            }`}
          >
            Fonts
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('headers')}
            className={`py-1 text-[11px] font-medium rounded-btn-sm transition-all ${
              activeSection === 'headers'
                ? 'bg-md-primary text-md-on-primary shadow-xs font-semibold'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.04]'
            }`}
          >
            Headers
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('layout')}
            className={`py-1 text-[11px] font-medium rounded-btn-sm transition-all ${
              activeSection === 'layout'
                ? 'bg-md-primary text-md-on-primary shadow-xs font-semibold'
                : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.04]'
            }`}
          >
            Layout
          </button>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="h-7 px-2 flex items-center gap-1 text-[11px] font-medium rounded-btn-md border border-md-outline-variant/30 text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.04] transition-colors shrink-0"
          title="Restore factory default styling"
        >
          <RotateCcw className="w-3 h-3" />
          {resetConfirm ? 'Reset' : 'Defaults'}
        </button>
      </div>

      {/* 1. THEMES VIEW */}
      {activeSection === 'themes' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-md-on-surface-variant">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Theme Palettes
            </span>
            <span className="text-[10px]">One-click styling</span>
          </div>

          {/* Compact 2-column theme cards */}
          <div className="grid grid-cols-2 gap-1.5">
            {THEME_PRESETS.map((preset) => {
              const isSelected = 
                styleSettings.accentColor.toLowerCase() === preset.accent.toLowerCase() &&
                styleSettings.headingFont === preset.headingFont;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`p-2 rounded-btn-md border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-md-primary bg-md-primary-container/20 ring-1 ring-md-primary shadow-xs'
                      : 'border-md-outline-variant/30 bg-md-surface-container hover:bg-md-surface-container-high'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold text-[11px] text-md-on-surface truncate">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-md-primary text-md-on-primary flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Swatch dots */}
                  <div className="flex items-center gap-1 mt-0.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-black/20" 
                      style={{ backgroundColor: preset.accent }} 
                    />
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-black/20" 
                      style={{ backgroundColor: preset.primary }} 
                    />
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-black/20" 
                      style={{ backgroundColor: preset.secondary }} 
                    />
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-black/20 ml-auto" 
                      style={{ backgroundColor: preset.paper }} 
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Brand Accent Color Property Row */}
          <div className="p-2.5 bg-md-surface-container border border-md-outline-variant/30 rounded-btn-md flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-md-on-surface">
                Brand Accent Color
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={styleSettings.accentColor}
                  onChange={(e) => handleUpdateStyleSettings({ accentColor: e.target.value })}
                  className="w-5 h-5 rounded-btn-sm border border-md-outline-variant/40 cursor-pointer p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={styleSettings.accentColor}
                  onChange={(e) => handleUpdateStyleSettings({ accentColor: e.target.value })}
                  className="w-16 bg-md-surface-container-high border border-md-outline-variant/30 rounded-btn-sm px-1.5 py-0.5 font-mono text-[11px] text-right text-md-on-surface focus:outline-none focus:border-md-primary"
                />
              </div>
            </div>

            {/* Quick Accent Swatches Row */}
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/[0.04]">
              {ACCENT_SWATCHES.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => handleUpdateStyleSettings({ accentColor: hex })}
                  className={`w-5 h-5 rounded-btn-sm transition-all flex items-center justify-center border ${
                    styleSettings.accentColor.toLowerCase() === hex.toLowerCase()
                      ? 'ring-2 ring-md-primary ring-offset-1 ring-offset-md-surface border-white scale-110'
                      : 'border-white/10 hover:scale-105'
                  }`}
                  style={{ backgroundColor: hex }}
                  title={hex}
                >
                  {styleSettings.accentColor.toLowerCase() === hex.toLowerCase() && (
                    <Check className="w-2.5 h-2.5 text-white drop-shadow-xs stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. TYPOGRAPHY VIEW */}
      {activeSection === 'typography' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-md-on-surface-variant">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Font Pairings
            </span>
            <span className="text-[10px]">Harmonious typographic scale</span>
          </div>

          {/* Quick Pairing Chips Matrix */}
          <div className="grid grid-cols-2 gap-1.5">
            {FONT_PAIRINGS.map((pair) => {
              const isSelected = 
                styleSettings.headingFont === pair.heading && 
                styleSettings.bodyFont === pair.body;

              return (
                <button
                  key={pair.id}
                  type="button"
                  onClick={() => handleUpdateStyleSettings({ headingFont: pair.heading, bodyFont: pair.body })}
                  className={`px-2 py-1.5 rounded-btn-md border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-md-primary bg-md-primary-container/20 text-md-on-primary-container ring-1 ring-md-primary'
                      : 'border-md-outline-variant/30 bg-md-surface-container hover:bg-md-surface-container-high text-md-on-surface'
                  }`}
                >
                  <span className="font-medium text-[11px] truncate">
                    {pair.label}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-md-primary stroke-[3] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Font Family Dropdowns */}
          <div className="p-2.5 bg-md-surface-container border border-md-outline-variant/30 rounded-btn-md flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-md-on-surface flex items-center gap-1.5">
                <Type className="w-3 h-3 text-md-primary" />
                Heading Font
              </label>
              <select
                value={styleSettings.headingFont}
                onChange={(e) => handleUpdateStyleSettings({ headingFont: e.target.value })}
                className="bg-md-surface-container-high border border-md-outline-variant/30 rounded-btn-sm px-2 py-1 text-xs text-md-on-surface focus:outline-none focus:border-md-primary cursor-pointer"
              >
                {HEADING_FONT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-md-on-surface flex items-center gap-1.5">
                <Type className="w-3 h-3 text-md-secondary" />
                Body Font
              </label>
              <select
                value={styleSettings.bodyFont}
                onChange={(e) => handleUpdateStyleSettings({ bodyFont: e.target.value })}
                className="bg-md-surface-container-high border border-md-outline-variant/30 rounded-btn-sm px-2 py-1 text-xs text-md-on-surface focus:outline-none focus:border-md-primary cursor-pointer"
              >
                {BODY_FONT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Font Size Scale Segmented Control */}
          <div className="p-2.5 bg-md-surface-container border border-md-outline-variant/30 rounded-btn-md flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-md-on-surface">
                Font Size Scale
              </span>
              <span className="text-[10px] font-mono text-md-on-surface-variant">
                {styleSettings.fontScale === 'compact' ? '9.5pt' : styleSettings.fontScale === 'spacious' ? '10.5pt' : '10.0pt'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 p-0.5 bg-md-surface-container-high border border-md-outline-variant/20 rounded-btn-sm">
              {(['compact', 'standard', 'spacious'] as const).map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => handleUpdateStyleSettings({ fontScale: scale })}
                  className={`py-1 text-[11px] font-medium rounded-btn-xs transition-all ${
                    styleSettings.fontScale === scale
                      ? 'bg-md-primary text-md-on-primary shadow-xs'
                      : 'text-md-on-surface-variant hover:text-md-on-surface'
                  }`}
                >
                  {scale === 'compact' ? 'Compact' : scale === 'standard' ? 'Standard' : 'Spacious'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. HEADERS VIEW */}
      {activeSection === 'headers' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-md-on-surface-variant">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Section Divider Style
            </span>
            <span className="text-[10px]">Single-row preview grid</span>
          </div>

          {/* Single-Row 5-Column Preview Grid (Figma/Linear Style) */}
          <div className="grid grid-cols-5 gap-1.5">
            {HEADER_STYLES.map((style) => {
              const isSelected = styleSettings.headerStyle === style.id;

              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleUpdateStyleSettings({ headerStyle: style.id })}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-btn-md border transition-all h-[52px] ${
                    isSelected
                      ? 'border-md-primary bg-md-primary-container/25 ring-1 ring-md-primary'
                      : 'border-md-outline-variant/30 bg-md-surface-container hover:bg-md-surface-container-high'
                  }`}
                  title={style.label}
                >
                  {/* Visual SVG Mini Glyph */}
                  <div className="w-full h-5 flex items-center justify-center mb-1">
                    {style.id === 'underline' && (
                      <div className="w-4/5 flex flex-col gap-0.5">
                        <div className="w-2/3 h-1 bg-md-on-surface/80 rounded-xs" />
                        <div className="w-full h-0.5 rounded-full" style={{ backgroundColor: styleSettings.accentColor }} />
                      </div>
                    )}
                    {style.id === 'divider' && (
                      <div className="w-4/5 flex items-center gap-1">
                        <div className="w-2.5 h-1 bg-md-on-surface/80 rounded-xs shrink-0" />
                        <div className="flex-1 h-px bg-md-outline-variant/80" />
                      </div>
                    )}
                    {style.id === 'left-bar' && (
                      <div className="w-4/5 flex items-center gap-1">
                        <div className="w-1 h-3 rounded-xs shrink-0" style={{ backgroundColor: styleSettings.accentColor }} />
                        <div className="w-3/4 h-1 bg-md-on-surface/80 rounded-xs" />
                      </div>
                    )}
                    {style.id === 'boxed' && (
                      <div 
                        className="w-4/5 h-3.5 rounded-xs border-l-2 flex items-center px-1"
                        style={{ 
                          borderColor: styleSettings.accentColor,
                          backgroundColor: `${styleSettings.accentColor}25`
                        }}
                      >
                        <div className="w-2/3 h-0.5 bg-md-on-surface/80 rounded-xs" />
                      </div>
                    )}
                    {style.id === 'minimal' && (
                      <div className="w-4/5 flex items-center">
                        <div className="w-3/4 h-1 rounded-xs" style={{ backgroundColor: styleSettings.accentColor }} />
                      </div>
                    )}
                  </div>

                  <span className={`text-[10px] truncate leading-none ${isSelected ? 'font-semibold text-md-on-surface' : 'text-md-on-surface-variant'}`}>
                    {style.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Uppercase Headers Switch Row */}
          <div className="p-2.5 bg-md-surface-container border border-md-outline-variant/30 rounded-btn-md flex items-center justify-between">
            <span className="text-[11px] font-medium text-md-on-surface">
              Force All-Caps Section Headers
            </span>
            <Switch
              size="sm"
              checked={styleSettings.uppercaseHeaders}
              onCheckedChange={(checked) => handleUpdateStyleSettings({ uppercaseHeaders: checked })}
            />
          </div>

          {/* Document Paper Color Swatch Row */}
          <div className="p-2.5 bg-md-surface-container border border-md-outline-variant/30 rounded-btn-md flex items-center justify-between">
            <span className="text-[11px] font-medium text-md-on-surface">
              Paper Background Tone
            </span>
            <div className="flex items-center gap-1.5">
              {PAPER_SWATCHES.map((paper) => (
                <button
                  key={paper.value}
                  type="button"
                  onClick={() => handleUpdateStyleSettings({ paperBackground: paper.value })}
                  className={`w-6 h-6 rounded-btn-sm border flex items-center justify-center transition-all ${
                    styleSettings.paperBackground.toLowerCase() === paper.value.toLowerCase()
                      ? 'border-md-primary ring-1 ring-md-primary scale-105'
                      : 'border-white/10 hover:scale-105'
                  }`}
                  style={{ backgroundColor: paper.value }}
                  title={paper.label}
                >
                  {styleSettings.paperBackground.toLowerCase() === paper.value.toLowerCase() && (
                    <Check className="w-3 h-3 text-slate-800 stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. LAYOUT & SPACING VIEW */}
      {activeSection === 'layout' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-md-on-surface-variant">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Document Geometry
            </span>
            <button
              type="button"
              onClick={autoFitContent}
              className="text-[11px] flex items-center gap-1 text-md-primary font-medium hover:underline"
            >
              <Sparkles className="w-3 h-3" />
              Auto-Fit Content
            </button>
          </div>

          {/* Density Presets */}
          <div className="grid grid-cols-3 gap-1 p-0.5 bg-md-surface-container border border-md-outline-variant/30 rounded-btn-md">
            {(['standard', 'compact', 'super'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleApplySpacingPreset(preset)}
                className={`py-1 text-[11px] font-medium rounded-btn-xs transition-all ${
                  spacingPreset === preset
                    ? 'bg-md-primary text-md-on-primary shadow-xs'
                    : 'text-md-on-surface-variant hover:text-md-on-surface'
                }`}
              >
                {preset === 'standard' ? 'Standard' : preset === 'compact' ? 'Compact' : 'Super'}
              </button>
            ))}
          </div>

          {/* High-Precision Scrubber Inputs */}
          <div className="p-2.5 bg-md-surface-container border border-md-outline-variant/30 rounded-btn-md flex flex-col gap-1 divide-y divide-white/[0.04]">
            <ScrubberInput
              label="Top & Bottom Margins"
              value={paddingTopBottom}
              onChange={setPaddingTopBottom}
              min={6}
              max={25}
              step={0.5}
              unit="mm"
            />
            <ScrubberInput
              label="Left & Right Margins"
              value={paddingLeftRight}
              onChange={setPaddingLeftRight}
              min={8}
              max={25}
              step={0.5}
              unit="mm"
            />
            <ScrubberInput
              label="Section Spacing"
              value={sectionSpacing}
              onChange={setSectionSpacing}
              min={0.4}
              max={1.6}
              step={0.05}
              unit="x"
            />
            <ScrubberInput
              label="Item & Bullet Spacing"
              value={itemSpacing}
              onChange={setItemSpacing}
              min={0.4}
              max={1.6}
              step={0.05}
              unit="x"
            />
          </div>

          {/* Geometry Toggles */}
          <div className="p-2.5 bg-md-surface-container border border-md-outline-variant/30 rounded-btn-md flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-md-on-surface">
                Show Page Guides & Numbers
              </span>
              <Switch
                size="sm"
                checked={showPageGuides}
                onCheckedChange={setShowPageGuides}
              />
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.04]">
              <span className="text-[11px] font-medium text-md-on-surface">
                Adaptive Anti-Void Micro-Fit
              </span>
              <Switch
                size="sm"
                checked={enableAdaptiveFit}
                onCheckedChange={setEnableAdaptiveFit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Settings, ChevronDown, ChevronRight, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button, Slider, Switch } from '../../../ui';

interface LayoutSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  paddingTopBottom: number;
  setPaddingTopBottom: (val: number) => void;
  paddingLeftRight: number;
  setPaddingLeftRight: (val: number) => void;
  sectionSpacing: number;
  setSectionSpacing: (val: number) => void;
  itemSpacing: number;
  setItemSpacing: (val: number) => void;
  spacingPreset: 'standard' | 'compact' | 'super';
  onApplySpacingPreset: (preset: 'standard' | 'compact' | 'super') => void;
  showPageGuides: boolean;
  setShowPageGuides: (val: boolean) => void;
  autoFitContent: () => void;
  pageFraction: string;
  enableAdaptiveFit?: boolean;
  setEnableAdaptiveFit?: (val: boolean) => void;
}

export const LayoutSection: React.FC<LayoutSectionProps> = ({
  isOpen,
  onToggle,
  paddingTopBottom,
  setPaddingTopBottom,
  paddingLeftRight,
  setPaddingLeftRight,
  sectionSpacing,
  setSectionSpacing,
  itemSpacing,
  setItemSpacing,
  spacingPreset,
  onApplySpacingPreset,
  showPageGuides,
  setShowPageGuides,
  autoFitContent,
  pageFraction,
  enableAdaptiveFit = true,
  setEnableAdaptiveFit
}) => {
  return (
    <div
      className={`border transition-all duration-200 rounded-md-lg overflow-hidden ${
        isOpen
          ? 'border-md-primary/35 bg-md-surface-container shadow-md-elevation-1'
          : 'border-white/[0.08] bg-md-surface-container-low hover:bg-md-surface-container hover:border-white/[0.16]'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between p-4.5 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary/40 ${
          isOpen ? 'text-md-on-surface bg-md-surface-container border-b border-white/[0.08]' : 'text-md-on-surface-variant hover:text-md-on-surface bg-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <Settings className={`w-5 h-5 transition-colors ${isOpen ? 'text-md-primary' : 'text-md-on-surface-variant'}`} />
          <span className="font-display tracking-wide">Layout & Formatting</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-md-primary" /> : <ChevronRight className="w-5 h-5 text-md-on-surface-variant" />}
      </button>

      {isOpen && (
        <div className="p-5 space-y-5 bg-transparent animate-fade-in font-sans">
          {/* AUTO-FIT HEADER & ACTION */}
          <div className="flex items-center justify-between pb-1">
            <div>
              <span className="text-xs text-md-on-surface font-medium block">
                Auto-Formatting
              </span>
              <span className="text-[11px] text-md-on-surface-variant">
                Dynamic page packing &amp; void prevention
              </span>
            </div>
            <Button
              onClick={autoFitContent}
              size="sm"
              title="Automatically calibrate spacing to balance content and eliminate empty voids"
              className="gap-2"
            >
              <Sparkles className="w-4 h-4 text-md-on-primary animate-pulse" />
              <span>Auto-Fit Pages</span>
            </Button>
          </div>

          {/* ADAPTIVE ANTI-VOID TOGGLE */}
          {setEnableAdaptiveFit && (
            <div className="p-3.5 rounded-md-md bg-white/[0.02] border border-white/[0.08] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-md-on-surface">Adaptive Anti-Void Engine</span>
                  {enableAdaptiveFit ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-md-success-container/40 text-md-on-success-container text-[10px] font-medium rounded-md-xs">
                      <CheckCircle2 className="w-3 h-3 text-md-success" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-md-warning-container/40 text-md-on-warning-container text-[10px] font-medium rounded-md-xs">
                      <ShieldAlert className="w-3 h-3 text-md-warning" />
                      Off
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-md-on-surface-variant leading-tight">
                  Prevents large blank gaps by adapting item spacing to fit content naturally on each page.
                </p>
              </div>
              <Switch checked={enableAdaptiveFit} onCheckedChange={setEnableAdaptiveFit} />
            </div>
          )}

          {/* PRESET PILLS */}
          <div className="space-y-2">
            <span className="block text-xs text-md-on-surface-variant font-medium">
              Content Density
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {(['standard', 'compact', 'super'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => onApplySpacingPreset(preset)}
                  className={`py-2 px-3 rounded-md-sm text-xs font-medium transition-all text-center cursor-pointer select-none border capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary/40 ${
                    spacingPreset === preset
                      ? 'bg-md-primary text-md-on-primary font-semibold shadow-md-elevation-1 border-transparent'
                      : 'bg-white/[0.03] text-md-on-surface-variant border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] hover:text-md-on-surface'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* FINE TUNING SLIDERS */}
          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-xs text-md-on-surface-variant font-medium">
                  Top / Bottom Padding
                </span>
                <span className="text-xs text-md-on-surface font-mono bg-md-surface-container-lowest px-2 py-0.5 rounded-md-xs border border-white/[0.08]">{paddingTopBottom}mm</span>
              </div>
              <Slider
                min={5}
                max={20}
                step={0.5}
                value={paddingTopBottom}
                onChange={(e) => setPaddingTopBottom(parseFloat(e.target.value))}
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-xs text-md-on-surface-variant font-medium">
                  Left / Right Padding
                </span>
                <span className="text-xs text-md-on-surface font-mono bg-md-surface-container-lowest px-2 py-0.5 rounded-md-xs border border-white/[0.08]">{paddingLeftRight}mm</span>
              </div>
              <Slider
                min={8}
                max={20}
                step={0.5}
                value={paddingLeftRight}
                onChange={(e) => setPaddingLeftRight(parseFloat(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-xs text-md-on-surface-variant font-medium">
                    Section Spacing
                  </span>
                  <span className="text-xs text-md-on-surface font-mono bg-md-surface-container-lowest px-2 py-0.5 rounded-md-xs border border-white/[0.08]">
                    {Math.round(sectionSpacing * 100)}%
                  </span>
                </div>
                <Slider
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  value={sectionSpacing}
                  onChange={(e) => setSectionSpacing(parseFloat(e.target.value))}
                />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-xs text-md-on-surface-variant font-medium">
                    Item Spacing
                  </span>
                  <span className="text-xs text-md-on-surface font-mono bg-md-surface-container-lowest px-2 py-0.5 rounded-md-xs border border-white/[0.08]">
                    {Math.round(itemSpacing * 100)}%
                  </span>
                </div>
                <Slider
                  min={0.4}
                  max={1.5}
                  step={0.05}
                  value={itemSpacing}
                  onChange={(e) => setItemSpacing(parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* PAGE GUIDE TOGGLE */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
            <span className="text-xs text-md-on-surface-variant font-medium">
              Show A4 Page Break Guides
            </span>
            <Switch checked={showPageGuides} onCheckedChange={setShowPageGuides} />
          </div>
          <div className="text-xs text-md-on-surface-variant text-center leading-normal pt-2.5 border-t border-white/[0.08]">
            Content density scale: <strong className="text-md-primary font-mono">{pageFraction}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

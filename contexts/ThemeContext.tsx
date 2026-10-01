import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ColorToken, 
  RadiusToken, 
  ShadowToken, 
  DEFAULT_COLOR_TOKENS, 
  DEFAULT_RADIUS_TOKENS, 
  DEFAULT_SHADOW_TOKENS,
  THEME_PRESETS, 
  ThemePreset,
  ALIAS_MAP,
  getContrastRatio,
  getWCAGRating
} from '../theme/tokens';

interface ThemeContextType {
  tokens: ColorToken[];
  radiusTokens: RadiusToken[];
  shadowTokens: ShadowToken[];
  presets: ThemePreset[];
  activePresetId: string;
  isCustomized: boolean;
  updateColorToken: (variable: string, newHex: string) => void;
  applyPreset: (presetId: string) => void;
  resetToDefaults: () => void;
  exportRootCss: () => string;
  exportJsonTokens: () => string;
  getColorValue: (variable: string) => string;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_PRESET_KEY = 'resume_studio_theme_preset';
const STORAGE_CUSTOM_COLORS_KEY = 'resume_studio_custom_colors';

// Helper to apply CSS variables directly to the root DOM node
function applyVariableToDom(variable: string, value: string) {
  document.documentElement.style.setProperty(variable, value);

  // Synchronize any legacy or backward compatibility alias
  Object.entries(ALIAS_MAP).forEach(([aliasVar, targetVar]) => {
    if (targetVar === variable) {
      document.documentElement.style.setProperty(aliasVar, value);
    }
  });
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<ColorToken[]>(() => {
    return DEFAULT_COLOR_TOKENS.map(t => ({ ...t }));
  });

  const [activePresetId, setActivePresetId] = useState<string>('m3-violet');
  const [isCustomized, setIsCustomized] = useState<boolean>(false);

  // Initialize theme from localStorage or defaults on first mount
  useEffect(() => {
    try {
      const savedPreset = localStorage.getItem(STORAGE_PRESET_KEY);
      const savedCustom = localStorage.getItem(STORAGE_CUSTOM_COLORS_KEY);

      if (savedCustom) {
        const customOverrides: Record<string, string> = JSON.parse(savedCustom);
        setTokens(prev => prev.map(tok => {
          if (customOverrides[tok.variable]) {
            const newHex = customOverrides[tok.variable];
            applyVariableToDom(tok.variable, newHex);
            const ratio = getContrastRatio(newHex, '#141218');
            return {
              ...tok,
              hex: newHex,
              contrast: getWCAGRating(ratio)
            };
          }
          return tok;
        }));
        setActivePresetId('custom');
        setIsCustomized(true);
      } else if (savedPreset && savedPreset !== 'm3-violet') {
        const preset = THEME_PRESETS.find(p => p.id === savedPreset);
        if (preset) {
          Object.entries(preset.colors).forEach(([variable, value]) => {
            applyVariableToDom(variable, value);
          });
          setTokens(prev => prev.map(tok => {
            if (preset.colors[tok.variable]) {
              const newHex = preset.colors[tok.variable];
              const ratio = getContrastRatio(newHex, preset.colors['--md-sys-color-surface'] || '#141218');
              return {
                ...tok,
                hex: newHex,
                contrast: getWCAGRating(ratio)
              };
            }
            return tok;
          }));
          setActivePresetId(preset.id);
        }
      }
    } catch (e) {
      console.warn('Could not restore theme preferences from storage', e);
    }
  }, []);

  // Update a single color token live across DOM, state, and localStorage
  const updateColorToken = useCallback((variable: string, newHex: string) => {
    // 1. Immediately inject onto DOM root
    applyVariableToDom(variable, newHex);

    // 2. Update React state
    setTokens(prev => {
      const surfaceToken = prev.find(t => t.variable === '--md-sys-color-surface');
      const surfaceHex = variable === '--md-sys-color-surface' ? newHex : (surfaceToken?.hex || '#141218');

      const updated = prev.map(tok => {
        if (tok.variable === variable) {
          const ratio = getContrastRatio(newHex, surfaceHex);
          return {
            ...tok,
            hex: newHex,
            contrast: getWCAGRating(ratio)
          };
        }
        return tok;
      });

      // 3. Persist overrides in storage
      try {
        const overrides: Record<string, string> = {};
        updated.forEach(t => {
          const defaultTok = DEFAULT_COLOR_TOKENS.find(d => d.variable === t.variable);
          if (defaultTok && defaultTok.hex.toLowerCase() !== t.hex.toLowerCase()) {
            overrides[t.variable] = t.hex;
          }
        });
        if (Object.keys(overrides).length > 0) {
          localStorage.setItem(STORAGE_CUSTOM_COLORS_KEY, JSON.stringify(overrides));
          localStorage.setItem(STORAGE_PRESET_KEY, 'custom');
        } else {
          localStorage.removeItem(STORAGE_CUSTOM_COLORS_KEY);
        }
      } catch (err) {
        // LocalStorage quota or access error
      }

      return updated;
    });

    setActivePresetId('custom');
    setIsCustomized(true);
  }, []);

  // 1-Click apply curated theme preset
  const applyPreset = useCallback((presetId: string) => {
    const preset = THEME_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    // Apply all preset colors to DOM
    Object.entries(preset.colors).forEach(([variable, value]) => {
      applyVariableToDom(variable, value);
    });

    const targetSurface = preset.colors['--md-sys-color-surface'] || '#141218';

    setTokens(prev => prev.map(tok => {
      if (preset.colors[tok.variable]) {
        const newHex = preset.colors[tok.variable];
        const ratio = getContrastRatio(newHex, targetSurface);
        return {
          ...tok,
          hex: newHex,
          contrast: getWCAGRating(ratio)
        };
      }
      return tok;
    }));

    setActivePresetId(preset.id);
    setIsCustomized(preset.id !== 'm3-violet');

    try {
      localStorage.setItem(STORAGE_PRESET_KEY, preset.id);
      localStorage.removeItem(STORAGE_CUSTOM_COLORS_KEY);
    } catch (e) {}
  }, []);

  // Reset back to factory default M3 specifications
  const resetToDefaults = useCallback(() => {
    // Remove inline DOM style overrides
    DEFAULT_COLOR_TOKENS.forEach(tok => {
      document.documentElement.style.removeProperty(tok.variable);
    });
    Object.keys(ALIAS_MAP).forEach(alias => {
      document.documentElement.style.removeProperty(alias);
    });

    setTokens(DEFAULT_COLOR_TOKENS.map(t => ({ ...t })));
    setActivePresetId('m3-violet');
    setIsCustomized(false);

    try {
      localStorage.removeItem(STORAGE_PRESET_KEY);
      localStorage.removeItem(STORAGE_CUSTOM_COLORS_KEY);
    } catch (e) {}
  }, []);

  // Read the active resolved value of any CSS variable
  const getColorValue = useCallback((variable: string) => {
    const found = tokens.find(t => t.variable === variable);
    if (found) return found.hex;
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }, [tokens]);

  // Export full :root CSS block ready for production stylesheets
  const exportRootCss = useCallback(() => {
    const lines = [
      '/* ==========================================================================',
      '   Cognitive Resume Studio - Exported Material 3 Design Tokens (SSOT)',
      `   Generated: ${new Date().toISOString()}`,
      `   Active Preset: ${activePresetId.toUpperCase()}`,
      '   ========================================================================== */',
      ':root {'
    ];

    lines.push('  /* 1. Primary & Brand Roles */');
    tokens.filter(t => t.category === 'brand').forEach(t => {
      lines.push(`  ${t.variable}: ${t.hex}; /* ${t.name} */`);
    });

    lines.push('\n  /* 2. Tonal Surface Hierarchy */');
    tokens.filter(t => t.category === 'surface').forEach(t => {
      lines.push(`  ${t.variable}: ${t.hex}; /* ${t.name} */`);
    });

    lines.push('\n  /* 3. Typography & Outline Roles */');
    tokens.filter(t => t.category === 'content' || t.category === 'outline').forEach(t => {
      lines.push(`  ${t.variable}: ${t.hex}; /* ${t.name} */`);
    });

    lines.push('\n  /* 4. Semantic Status Roles */');
    tokens.filter(t => t.category === 'status').forEach(t => {
      lines.push(`  ${t.variable}: ${t.hex}; /* ${t.name} */`);
    });

    lines.push('\n  /* 5. Document Print Tokens */');
    tokens.filter(t => t.category === 'print').forEach(t => {
      lines.push(`  ${t.variable}: ${t.hex}; /* ${t.name} */`);
    });

    lines.push('}');
    return lines.join('\n');
  }, [tokens, activePresetId]);

  // Export JSON schema of all tokens
  const exportJsonTokens = useCallback(() => {
    const payload = {
      version: '3.2.0',
      system: 'Material Design 3 (2026 Edition)',
      activePreset: activePresetId,
      updatedAt: new Date().toISOString(),
      tokens: {
        colors: tokens.reduce((acc, t) => {
          acc[t.id] = {
            name: t.name,
            variable: t.variable,
            hex: t.hex,
            category: t.category,
            tailwind: t.tailwind,
            usage: t.usage
          };
          return acc;
        }, {} as Record<string, any>),
        radii: DEFAULT_RADIUS_TOKENS.reduce((acc, r) => {
          acc[r.id] = { name: r.name, value: r.value, tailwind: r.tailwind };
          return acc;
        }, {} as Record<string, any>),
        elevations: DEFAULT_SHADOW_TOKENS.reduce((acc, s) => {
          acc[s.id] = { name: s.name, value: s.value, tailwind: s.tailwind };
          return acc;
        }, {} as Record<string, any>)
      }
    };
    return JSON.stringify(payload, null, 2);
  }, [tokens, activePresetId]);

  const value = useMemo(() => ({
    tokens,
    radiusTokens: DEFAULT_RADIUS_TOKENS,
    shadowTokens: DEFAULT_SHADOW_TOKENS,
    presets: THEME_PRESETS,
    activePresetId,
    isCustomized,
    updateColorToken,
    applyPreset,
    resetToDefaults,
    exportRootCss,
    exportJsonTokens,
    getColorValue,
  }), [
    tokens,
    activePresetId,
    isCustomized,
    updateColorToken,
    applyPreset,
    resetToDefaults,
    exportRootCss,
    exportJsonTokens,
    getColorValue,
  ]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

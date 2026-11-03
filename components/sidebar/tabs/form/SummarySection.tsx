import React from 'react';
import { Maximize2, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button, Textarea } from '../../../ui';
import { useTranslation } from '../../../../contexts/LanguageContext';

interface SummarySectionProps {
  isOpen: boolean;
  onToggle: () => void;
  summary: string[];
  handleUpdateSummaryPara: (index: number, val: string) => void;
  handleAddSummaryPara: () => void;
  handleRemoveSummaryPara: (index: number) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  isOpen,
  onToggle,
  summary,
  handleUpdateSummaryPara,
  handleAddSummaryPara,
  handleRemoveSummaryPara,
}) => {
  const { t } = useTranslation();

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
          <Maximize2 className={`w-5 h-5 transition-colors ${isOpen ? 'text-md-primary' : 'text-md-on-surface-variant'}`} />
          <span className="font-display tracking-wide">{t.form.summary}</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-md-primary" /> : <ChevronRight className="w-5 h-5 text-md-on-surface-variant" />}
      </button>

      {isOpen && (
        <div className="p-5 space-y-4 bg-transparent">
          {(summary || []).map((para, i) => (
            <div key={i} className="flex gap-3 items-start animate-fade-in">
              <Textarea
                value={para}
                onChange={(e) => handleUpdateSummaryPara(i, e.target.value)}
                placeholder={t.form.summaryPlaceholder}
                className="flex-1"
                rows={3}
              />
              <button
                type="button"
                onClick={() => handleRemoveSummaryPara(i)}
                className="p-2 text-md-error hover:text-md-error hover:bg-md-error-container/20 rounded-md-sm cursor-pointer transition-colors shrink-0 mt-1"
                title={t.common.delete}
                aria-label={t.common.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <Button onClick={handleAddSummaryPara} variant="secondary" fullWidth className="gap-2">
            <Plus className="w-4 h-4 text-md-primary" /> {t.form.addParagraph}
          </Button>
        </div>
      )}
    </div>
  );
};

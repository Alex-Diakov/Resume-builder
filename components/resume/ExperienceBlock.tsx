import React from 'react';
import { ExperienceItem } from '../../types';
import { highlightText } from '../../utils/formatters';
import { InlineEditable } from './InlineEditable';

export interface ExperienceBlockProps {
  item: ExperienceItem;
  spacing?: number;
  isInlineEditing?: boolean;
  onUpdateRole?: (val: string) => void;
  onUpdateCompany?: (val: string) => void;
  onUpdateDuration?: (val: string) => void;
  onUpdateHighlightTitle?: (hIdx: number, val: string) => void;
  onUpdateHighlightDesc?: (hIdx: number, val: string) => void;
}

export const ExperienceBlock: React.FC<ExperienceBlockProps> = ({
  item,
  spacing = 1.0,
  isInlineEditing = false,
  onUpdateRole,
  onUpdateCompany,
  onUpdateDuration,
  onUpdateHighlightTitle,
  onUpdateHighlightDesc,
}) => (
  <div 
    className="last:mb-0 break-inside-avoid"
    style={{ marginBottom: `${spacing * 12}px` }}
  >
    {/* Header Line: Role | Company ......... Date */}
    <div className="flex justify-between items-baseline mb-1">
      <div className="text-[11pt] text-resume-primary">
        <InlineEditable
          value={item.role}
          onChange={(newVal) => onUpdateRole?.(newVal)}
          enabled={isInlineEditing}
          className="font-bold"
          placeholder="Должность"
        />{' '}
        <span className="mx-1.5 text-resume-border">|</span>{' '}
        <InlineEditable
          value={item.company}
          onChange={(newVal) => onUpdateCompany?.(newVal)}
          enabled={isInlineEditing}
          className="font-medium"
          placeholder="Компания"
        />
      </div>
      <InlineEditable
        value={item.duration}
        onChange={(newVal) => onUpdateDuration?.(newVal)}
        enabled={isInlineEditing}
        className="text-resume-meta text-resume-muted font-normal whitespace-nowrap"
        placeholder="Период работы"
      />
    </div>
    
    {/* Bullets */}
    {Array.isArray(item.highlights) && item.highlights.length > 0 && (
      <ul className="list-none space-y-1">
        {item.highlights.map((h, idx) => (
          <li key={idx} className="text-resume-body text-resume-secondary relative pl-3.5 before:content-['•'] before:absolute before:left-0 before:text-resume-muted">
            <InlineEditable
              value={h.title}
              onChange={(newVal) => onUpdateHighlightTitle?.(idx, newVal)}
              enabled={isInlineEditing}
              className="font-semibold mr-1"
              placeholder="Категория"
            />
            {': '}
            {isInlineEditing ? (
              <InlineEditable
                value={h.description}
                onChange={(newVal) => onUpdateHighlightDesc?.(idx, newVal)}
                enabled={true}
                multiline={true}
                className="inline"
                placeholder="Описание достижения"
              />
            ) : (
              highlightText(h.description)
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

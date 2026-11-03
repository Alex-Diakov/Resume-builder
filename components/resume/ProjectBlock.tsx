import React from 'react';
import { ProjectItem } from '../../types';
import { highlightText } from '../../utils/formatters';
import { InlineEditable } from './InlineEditable';

export interface ProjectBlockProps {
  item: ProjectItem;
  spacing?: number;
  isInlineEditing?: boolean;
  onUpdateTitle?: (val: string) => void;
  onUpdateRole?: (val: string) => void;
  onUpdateDescription?: (val: string) => void;
  onUpdateDetailLabel?: (dIdx: number, val: string) => void;
  onUpdateDetailValue?: (dIdx: number, val: string) => void;
}

export const ProjectBlock: React.FC<ProjectBlockProps> = ({
  item,
  spacing = 1.0,
  isInlineEditing = false,
  onUpdateTitle,
  onUpdateRole,
  onUpdateDescription,
  onUpdateDetailLabel,
  onUpdateDetailValue,
}) => (
  <div 
    className="last:mb-0 break-inside-avoid"
    style={{ marginBottom: `${spacing * 12}px` }}
  >
    {/* Header Line: Title (Role) */}
    <div className="flex justify-between items-baseline mb-1">
      <div className="text-[11pt] text-resume-primary font-bold">
        <InlineEditable
          value={item.title}
          onChange={(newVal) => onUpdateTitle?.(newVal)}
          enabled={isInlineEditing}
          placeholder="Название проекта"
        />{' '}
        <span className="font-normal text-resume-muted text-[10pt] ml-1">
          (
          <InlineEditable
            value={item.role}
            onChange={(newVal) => onUpdateRole?.(newVal)}
            enabled={isInlineEditing}
            placeholder="Роль в проекте"
          />
          )
        </span>
      </div>
    </div>
    
    <div className="text-resume-body text-resume-secondary mb-1.5">
      {isInlineEditing ? (
        <InlineEditable
          value={item.description}
          onChange={(newVal) => onUpdateDescription?.(newVal)}
          enabled={true}
          multiline={true}
          placeholder="Описание проекта"
        />
      ) : (
        highlightText(item.description)
      )}
    </div>

    {Array.isArray(item.details) && item.details.length > 0 && (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-resume-meta text-resume-muted">
        {item.details.map((d, idx) => (
          <span key={idx}>
            <InlineEditable
              value={d.label}
              onChange={(newVal) => onUpdateDetailLabel?.(idx, newVal)}
              enabled={isInlineEditing}
              className="font-semibold text-resume-primary opacity-80"
              placeholder="Метрика"
            />
            {': '}
            <InlineEditable
              value={d.value}
              onChange={(newVal) => onUpdateDetailValue?.(idx, newVal)}
              enabled={isInlineEditing}
              placeholder="Значение"
            />
          </span>
        ))}
      </div>
    )}
  </div>
);

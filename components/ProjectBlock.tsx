import React from 'react';
import { ProjectItem } from '../types';
import { highlightText } from '../utils/formatters';

export const ProjectBlock: React.FC<{ item: ProjectItem; spacing?: number }> = ({ item, spacing = 1.0 }) => (
  <div 
    className="last:mb-0 break-inside-avoid"
    style={{ marginBottom: `${spacing * 12}px` }} // tighter baseline
  >
    {/* Header Line: Title (Role) */}
    <div className="flex justify-between items-baseline mb-1">
      <div className="text-[11pt] text-resume-primary font-bold">
        {item.title} <span className="font-normal text-resume-muted text-[10pt] ml-1">({item.role})</span>
      </div>
    </div>
    
    <p className="text-resume-body text-resume-secondary mb-1.5">
      {highlightText(item.description)}
    </p>

    {Array.isArray(item.details) && item.details.length > 0 && (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-resume-meta text-resume-muted">
        {item.details.map((d, idx) => (
          <span key={idx}>
            <span className="font-semibold text-resume-primary opacity-80">{d.label}:</span> {d.value}
          </span>
        ))}
      </div>
    )}
  </div>
);

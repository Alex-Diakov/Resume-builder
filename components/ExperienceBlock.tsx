import React from 'react';
import { ExperienceItem } from '../types';
import { highlightText } from '../utils/formatters';

export const ExperienceBlock: React.FC<{ item: ExperienceItem; spacing?: number }> = ({ item, spacing = 1.0 }) => (
  <div 
    className="last:mb-0 break-inside-avoid"
    style={{ marginBottom: `${spacing * 12}px` }} // slightly tighter baseline for beautiful formatting
  >
    {/* Header Line: Role | Company ......... Date */}
    <div className="flex justify-between items-baseline mb-1">
      <div className="text-[11pt] text-resume-primary">
        <span className="font-bold">{item.role}</span>
        <span className="mx-1.5 text-resume-border">|</span>
        <span className="font-medium">{item.company}</span>
      </div>
      <span className="text-resume-meta text-resume-muted font-normal whitespace-nowrap">
        {item.duration}
      </span>
    </div>
    
    {/* Bullets */}
    {Array.isArray(item.highlights) && item.highlights.length > 0 && (
      <ul className="list-none space-y-1">
        {item.highlights.map((h, idx) => (
          <li key={idx} className="text-resume-body text-resume-secondary relative pl-3.5 before:content-['•'] before:absolute before:left-0 before:text-resume-muted">
            <span className="font-semibold mr-1">{h.title}:</span>
            {highlightText(h.description)}
          </li>
        ))}
      </ul>
    )}
  </div>
);

import React from 'react';

export const SectionHeader: React.FC<{ title: string; sectionSpacing?: number }> = ({ title, sectionSpacing = 1.0 }) => (
  <h3 
    className="font-display text-resume-section font-bold uppercase text-resume-primary border-b border-resume-border pb-1 first:mt-0 tracking-wider break-after-avoid"
    style={{ 
      marginTop: `${sectionSpacing * 18}px`,
      marginBottom: `${sectionSpacing * 12}px`
    }}
  >
    {title}
  </h3>
);

import React from 'react';

export const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h3 className="text-resume-section font-bold uppercase text-resume-primary border-b border-resume-border pb-1 mb-4 mt-6 first:mt-0 tracking-wider break-after-avoid">
    {title}
  </h3>
);

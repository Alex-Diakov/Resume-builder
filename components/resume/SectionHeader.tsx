import React from 'react';
import { useResumeContext } from '../../contexts/ResumeContext';
import { ResumeHeaderStyle } from '../../types';

export interface SectionHeaderProps {
  title: string;
  sectionSpacing?: number;
  headerStyle?: ResumeHeaderStyle;
  uppercaseHeaders?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  sectionSpacing = 1.0,
  headerStyle: propHeaderStyle,
  uppercaseHeaders: propUppercase
}) => {
  const { styleSettings } = useResumeContext();
  const headerStyle = propHeaderStyle ?? styleSettings?.headerStyle ?? 'underline';
  const isUppercase = propUppercase ?? styleSettings?.uppercaseHeaders ?? true;

  const displayTitle = isUppercase ? title.toUpperCase() : title;
  const paddingTop = `${sectionSpacing * 16}px`;
  const paddingBottom = `${sectionSpacing * 10}px`;

  const headingStyle: React.CSSProperties = {
    fontFamily: 'var(--doc-font-heading, Outfit, sans-serif)',
    lineHeight: '1.25',
    margin: 0,
  };

  if (headerStyle === 'left-bar') {
    return (
      <div 
        className="section-header-wrap w-full first:pt-0 break-after-avoid"
        style={{ paddingTop, paddingBottom, boxSizing: 'border-box' }}
      >
        <div 
          className="section-header-leftbar-table"
          style={{ 
            display: 'table', 
            width: '100%', 
            borderCollapse: 'collapse' 
          }}
        >
          <div 
            style={{ 
              display: 'table-cell', 
              verticalAlign: 'middle', 
              width: '1%', 
              whiteSpace: 'nowrap', 
              paddingRight: '8px',
              lineHeight: '0'
            }}
          >
            <span 
              className="rounded-xs"
              style={{ 
                display: 'block', 
                width: '4px', 
                height: '11px', 
                backgroundColor: 'var(--doc-accent, #6750a4)' 
              }} 
            />
          </div>
          <div 
            style={{ 
              display: 'table-cell', 
              verticalAlign: 'middle', 
              width: '99%' 
            }}
          >
            <h3 
              className="font-display text-resume-section font-bold text-resume-primary tracking-wider"
              style={{ ...headingStyle, lineHeight: '1', margin: 0, padding: 0 }}
            >
              {displayTitle}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  if (headerStyle === 'boxed') {
    return (
      <div 
        className="section-header-wrap w-full first:pt-0 break-after-avoid"
        style={{ paddingTop, paddingBottom, boxSizing: 'border-box' }}
      >
        <div 
          style={{ 
            display: 'table',
            width: '100%',
            borderCollapse: 'collapse',
            borderLeft: '4px solid var(--doc-accent, #6750a4)',
            backgroundColor: 'color-mix(in srgb, var(--doc-accent, #6750a4) 8%, transparent)',
            borderRadius: '2px'
          }}
        >
          <div 
            style={{ 
              display: 'table-cell', 
              verticalAlign: 'middle', 
              padding: '4px 10px' 
            }}
          >
            <h3 
              className="font-display text-resume-section font-bold text-resume-primary tracking-wider"
              style={{ ...headingStyle, lineHeight: '1.1', margin: 0, padding: 0 }}
            >
              {displayTitle}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  if (headerStyle === 'divider') {
    return (
      <div 
        className="section-header-wrap w-full first:pt-0 break-after-avoid"
        style={{ paddingTop, paddingBottom, boxSizing: 'border-box' }}
      >
        <div 
          className="section-header-divider-table"
          style={{ 
            display: 'table', 
            width: '100%', 
            tableLayout: 'auto',
            borderCollapse: 'collapse' 
          }}
        >
          <div 
            style={{ 
              display: 'table-cell', 
              verticalAlign: 'middle', 
              whiteSpace: 'nowrap', 
              width: '1%', 
              paddingRight: '12px' 
            }}
          >
            <h3 
              className="font-display text-resume-section font-bold text-resume-primary tracking-wider"
              style={{ ...headingStyle, lineHeight: '1', display: 'block', margin: 0, padding: 0 }}
            >
              {displayTitle}
            </h3>
          </div>
          <div 
            style={{ 
              display: 'table-cell', 
              verticalAlign: 'middle', 
              width: '99%',
              lineHeight: '0'
            }}
          >
            <div 
              className="section-header-line" 
              style={{ 
                height: '1px', 
                backgroundColor: 'var(--doc-border, #e2e8f0)', 
                width: '100%', 
                display: 'block', 
                margin: '0',
                lineHeight: '0',
                fontSize: '0',
                position: 'relative',
                top: '0.5px'
              }} 
            />
          </div>
        </div>
      </div>
    );
  }

  if (headerStyle === 'minimal') {
    return (
      <div 
        className="section-header-wrap w-full first:pt-0 break-after-avoid"
        style={{ paddingTop, paddingBottom, boxSizing: 'border-box' }}
      >
        <h3 
          className="font-display text-resume-section font-bold text-resume-accent tracking-wider"
          style={headingStyle}
        >
          {displayTitle}
        </h3>
      </div>
    );
  }

  // Default: 'underline'
  return (
    <div 
      className="section-header-wrap w-full first:pt-0 break-after-avoid"
      style={{ paddingTop, paddingBottom, boxSizing: 'border-box' }}
    >
      <h3 
        className="font-display text-resume-section font-bold text-resume-primary border-b-2 pb-1 tracking-wider"
        style={{ 
          ...headingStyle,
          borderColor: 'var(--doc-accent, #6750a4)'
        }}
      >
        {displayTitle}
      </h3>
    </div>
  );
};

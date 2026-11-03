import React, { useRef, useEffect } from 'react';

interface InlineEditableProps {
  value: string;
  onChange: (newValue: string) => void;
  enabled?: boolean;
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  placeholder?: string;
  tooltip?: string;
}

export const InlineEditable: React.FC<InlineEditableProps> = ({
  value,
  onChange,
  enabled = false,
  multiline = false,
  className = '',
  style,
  tag = 'span',
  placeholder = '',
  tooltip,
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const isEditingRef = useRef(false);

  // Sync value from props when not actively focused
  useEffect(() => {
    if (!isEditingRef.current && elementRef.current) {
      if (elementRef.current.innerText !== (value || '')) {
        elementRef.current.innerText = value || '';
      }
    }
  }, [value]);

  if (!enabled) {
    const Tag = tag as any;
    return (
      <Tag className={className} style={style}>
        {value || placeholder}
      </Tag>
    );
  }

  const Tag = tag as any;

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    isEditingRef.current = false;
    const newText = e.currentTarget.innerText;
    if (newText !== value) {
      onChange(newText);
    }
  };

  const handleFocus = () => {
    isEditingRef.current = true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // If single-line, Enter commits the edit
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
    // Escape cancels the edit and restores previous text
    if (e.key === 'Escape') {
      e.preventDefault();
      if (elementRef.current) {
        elementRef.current.innerText = value || '';
      }
      e.currentTarget.blur();
    }
  };

  const editableClasses = [
    className,
    'outline-none transition-all duration-150 rounded cursor-text',
    'hover:bg-indigo-500/10 hover:ring-1 hover:ring-indigo-400/50',
    'focus:bg-white/95 focus:text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:shadow-md px-0.5 -mx-0.5',
  ].filter(Boolean).join(' ');

  return (
    <Tag
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={editableClasses}
      style={style}
      title={tooltip || 'Кликните, чтобы редактировать текст прямо на листе'}
      data-placeholder={placeholder}
    >
      {value || placeholder}
    </Tag>
  );
};

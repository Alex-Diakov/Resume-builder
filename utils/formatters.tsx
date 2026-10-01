import React from 'react';

// Helper to bold specific patterns (numbers, metrics)
export const highlightText = (text?: string) => {
  if (!text) return text;
  const regex = /(\d+(?:[.,]\d+)?(?:%|x)|\$[0-9.]+[MK]?\+?)/g;
  const parts = text.split(regex);
  return parts.map((part, i) => 
    regex.test(part) ? <strong key={i} className="font-semibold text-resume-primary">{part}</strong> : part
  );
};

// Helper to ensure URL has proper protocol and clean format
export const formatUrl = (url?: string): string => {
  if (!url) return '';
  let trimmed = url.trim();
  if (!trimmed || trimmed === '#') return '';

  // If already starts with a protocol or special scheme
  if (/^(https?|mailto|tel):/i.test(trimmed)) {
    // Canonicalize linkedin.com without www to avoid redirect/CORS issues
    trimmed = trimmed.replace(/^https?:\/\/linkedin\.com/i, 'https://www.linkedin.com');
    return trimmed;
  }

  // Handle protocol-relative URL
  if (trimmed.startsWith('//')) {
    trimmed = `https:${trimmed}`;
  } else {
    // If domain starts with linkedin.com
    if (/^linkedin\.com/i.test(trimmed)) {
      trimmed = `https://www.${trimmed}`;
    } else {
      trimmed = `https://${trimmed}`;
    }
  }

  return trimmed;
};

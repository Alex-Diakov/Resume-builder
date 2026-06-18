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

// Helper to ensure URL has proper protocol
export const formatUrl = (url: string) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

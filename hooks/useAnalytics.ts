import { useState, useEffect, useCallback } from 'react';
import { ResumeData } from '../types';

export interface AnalyticsData {
  detectedRole: string;
  detectedIndustry: string;
}

// Generate a lightweight hash of the most critical text blocks to detect meaningful changes
const getResumeHash = (data: ResumeData) => {
  const coreString = JSON.stringify({
    e: data.experience,
    s: data.summary,
    p: data.projects,
    sk: data.skills,
    t: data.title
  });
  // Simple fast string hashing
  let hash = 0;
  for (let i = 0; i < coreString.length; i++) {
    hash = Math.imul(31, hash) + coreString.charCodeAt(i) | 0;
  }
  return hash.toString();
};

export const useAnalytics = (resumeData: ResumeData) => {
  const [downloadCount, setDownloadCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // Load download count from local storage
  useEffect(() => {
    const count = localStorage.getItem('resume_download_count');
    if (count) {
      setDownloadCount(parseInt(count, 10));
    }
    
    // Load initial cached analytics if hash matches
    const currentHash = getResumeHash(resumeData);
    const cachedHash = localStorage.getItem('analytics_hash');
    const cachedData = localStorage.getItem('analytics_data');
    if (cachedHash === currentHash && cachedData) {
      try {
        setAnalyticsData(JSON.parse(cachedData));
      } catch (e) {
        console.error("Failed to parse cached analytics");
      }
    }
  }, []);

  const incrementDownloadCount = useCallback(() => {
    setDownloadCount(prev => {
      const next = prev + 1;
      localStorage.setItem('resume_download_count', next.toString());
      return next;
    });
  }, []);

  const runAnalytics = useCallback(async (force = false) => {
    const currentHash = getResumeHash(resumeData);
    const cachedHash = localStorage.getItem('analytics_hash');
    const cachedData = localStorage.getItem('analytics_data');

    // If not forcing, and hashes match, just load from cache
    if (!force && cachedHash === currentHash && cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setAnalyticsData(parsed);
        return;
      } catch (e) {
        // Fallback to fetch if parsing fails
      }
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resumeData })
      });
      const data = await response.json();
      setAnalyticsData(data);
      
      // Save to cache
      localStorage.setItem('analytics_hash', currentHash);
      localStorage.setItem('analytics_data', JSON.stringify(data));
    } catch (error) {
      console.error('Analytics Error:', error);
      setAnalyticsData({
        detectedRole: "Unknown Role",
        detectedIndustry: "General"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeData]);

  // Auto-run analytics when resume data changes (debounced to avoid spamming the API)
  useEffect(() => {
    const currentHash = getResumeHash(resumeData);
    const cachedHash = localStorage.getItem('analytics_hash');
    
    // If the data is new or we don't have analytics loaded yet
    if (cachedHash !== currentHash || (!analyticsData && !isAnalyzing)) {
      const timer = setTimeout(() => {
        runAnalytics();
      }, 1500); // 1.5s debounce
      return () => clearTimeout(timer);
    }
  }, [resumeData, runAnalytics, analyticsData, isAnalyzing]);

  return { downloadCount, incrementDownloadCount, isAnalyzing, analyticsData, runAnalytics };
};

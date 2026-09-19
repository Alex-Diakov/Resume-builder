import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { ResumeData } from '../../../types';
import { Activity, RefreshCw } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

interface SidebarAnalyticsTabProps {
  resumeData: ResumeData;
}

export const SidebarAnalyticsTab: React.FC<SidebarAnalyticsTabProps> = ({ resumeData }) => {
  const { downloadCount, isAnalyzing, analyticsData, runAnalytics } = useAnalytics(resumeData);
  const [currentCount, setCurrentCount] = useState(downloadCount);

  useEffect(() => {
    // Listen for custom event when downloads happen in other components
    const handleDownload = () => {
      const count = parseInt(localStorage.getItem('resume_download_count') || '0', 10);
      setCurrentCount(count);
    };
    handleDownload(); // init
    window.addEventListener('resume_downloaded', handleDownload);
    return () => window.removeEventListener('resume_downloaded', handleDownload);
  }, []);

  return (
    <div className="flex flex-col pb-16 font-sans text-left">
      <div className="px-4 py-3 space-y-4">
        
        {/* STATS HEADER */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ds-text-high font-display">Resume Overview</h3>
              <p className="text-[10px] text-ds-text-muted mt-0.5">Automatic Document Intelligence</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => runAnalytics(true)}
              disabled={isAnalyzing}
              title="Refresh Analytics"
              aria-label="Refresh Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-ds-primary' : 'text-ds-text-muted hover:text-ds-text-high'}`} />
            </Button>
          </div>

          <div className="bg-ds-panel border border-ds-border rounded-ds-lg p-4 flex items-center justify-between shadow-ds-sm">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-ds-text-muted block">Total Exports</span>
              <span className="text-[10px] text-ds-text-muted mt-0.5 block">Documents generated</span>
            </div>
            <div className="text-2xl font-mono font-bold text-ds-text-high">
              {currentCount}
            </div>
          </div>

          <div className="bg-ds-panel border border-ds-border rounded-ds-lg p-4 space-y-3.5 shadow-ds-sm relative overflow-hidden">
            {isAnalyzing && (
              <div className="absolute inset-0 bg-ds-panel/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-ds-primary animate-bounce" />
              </div>
            )}
            
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-ds-text-muted mb-2">Target Role</h4>
              <div className="flex flex-wrap gap-1.5">
                {analyticsData?.detectedRole ? (
                  analyticsData.detectedRole.split(/,|\/| and /i).map((role, idx) => (
                    <Badge key={idx} variant="primary" size="sm">
                      {role.trim()}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-ds-text-muted font-medium">Not Analyzed</span>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-ds-border" />

            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-ds-text-muted mb-2">Target Industry</h4>
              <div className="flex flex-wrap gap-1.5">
                {analyticsData?.detectedIndustry ? (
                  analyticsData.detectedIndustry.split(/,|\/| and /i).map((ind, idx) => (
                    <Badge key={idx} variant="secondary" size="sm">
                      {ind.trim()}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-ds-text-muted font-medium">Not Analyzed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

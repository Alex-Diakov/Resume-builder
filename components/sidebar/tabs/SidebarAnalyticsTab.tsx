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
    <div className="flex flex-col pb-20 font-sans text-left">
      <div className="px-5 py-4 space-y-4">
        
        {/* STATS HEADER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-md-on-surface font-display">Resume Overview</h3>
              <p className="text-xs text-md-on-surface-variant mt-0.5">Automatic Document Intelligence</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => runAnalytics(true)}
              disabled={isAnalyzing}
              title="Refresh Analytics"
              aria-label="Refresh Analytics"
              className="p-2 rounded-md-sm hover:bg-md-surface-container-high cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin text-md-primary' : 'text-md-on-surface-variant hover:text-md-on-surface'}`} />
            </Button>
          </div>

          <div className="bg-md-surface-container-low border border-md-outline-variant/30 rounded-md-lg p-4.5 flex items-center justify-between shadow-md-elevation-1">
            <div>
              <span className="text-xs font-semibold text-md-on-surface block">Total Exports</span>
              <span className="text-xs text-md-on-surface-variant mt-0.5 block">Documents generated</span>
            </div>
            <div className="text-3xl font-mono font-bold text-md-on-surface">
              {currentCount}
            </div>
          </div>

          <div className="bg-md-surface-container-low border border-md-outline-variant/30 rounded-md-lg p-4.5 space-y-4 shadow-md-elevation-1 relative overflow-hidden">
            {isAnalyzing && (
              <div className="absolute inset-0 bg-md-surface-container-low/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-md-primary animate-bounce" />
              </div>
            )}
            
            <div>
              <h4 className="text-xs font-semibold text-md-on-surface mb-2.5">Target Role</h4>
              <div className="flex flex-wrap gap-2">
                {analyticsData?.detectedRole ? (
                  analyticsData.detectedRole.split(/,|\/| and /i).map((role, idx) => (
                    <Badge key={idx} variant="primary" size="sm">
                      {role.trim()}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-md-on-surface-variant font-medium">Not Analyzed</span>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-md-outline-variant/30" />

            <div>
              <h4 className="text-xs font-semibold text-md-on-surface mb-2.5">Target Industry</h4>
              <div className="flex flex-wrap gap-2">
                {analyticsData?.detectedIndustry ? (
                  analyticsData.detectedIndustry.split(/,|\/| and /i).map((ind, idx) => (
                    <Badge key={idx} variant="secondary" size="sm">
                      {ind.trim()}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-md-on-surface-variant font-medium">Not Analyzed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

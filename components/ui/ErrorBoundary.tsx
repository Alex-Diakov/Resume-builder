import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CRITICAL-UI-ERROR] Uncaught error in component tree:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetStorage = () => {
    try {
      localStorage.removeItem('resume_data_v1');
      localStorage.removeItem('resume_export_telemetry_v2');
      sessionStorage.clear();
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-md-surface flex items-center justify-center p-6 font-sans text-md-on-surface">
          <div className="max-w-md w-full bg-md-surface-container-low border border-rose-500/30 rounded-md-xl p-6 shadow-md-elevation-3 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-base font-semibold font-display text-md-on-surface">
                Application Incident Recovered
              </h2>
              <p className="text-xs text-md-on-surface-variant leading-relaxed">
                An unexpected interface issue occurred. Your data has been protected. You can reload or reset your local workspace.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-black/40 border border-white/[0.06] rounded-md-sm p-3 font-mono text-[11px] text-rose-300 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <Button
                variant="primary"
                onClick={this.handleReload}
                className="w-full sm:w-auto gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload App</span>
              </Button>

              <Button
                variant="outline"
                onClick={this.handleResetStorage}
                className="w-full sm:w-auto gap-2 text-md-on-surface-variant hover:text-rose-400 hover:border-rose-500/40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

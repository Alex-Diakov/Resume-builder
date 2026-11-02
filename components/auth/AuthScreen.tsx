import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  User as UserIcon,
  Zap,
  BarChart2,
  CheckCircle2
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password, name.trim());
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Try signing in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in popup was closed before completion.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-md-surface flex flex-col justify-between font-sans text-md-on-surface">
      {/* Top Header */}
      <header className="w-full px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md-md bg-md-primary/15 border border-md-primary/30 flex items-center justify-center text-md-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-semibold text-sm tracking-tight block">
              Cognitive Resume Architect
            </span>
            <span className="text-[11px] text-md-on-surface-variant font-mono">
              Enterprise Career SaaS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-md-on-surface-variant">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted Cloud Workspace</span>
        </div>
      </header>

      {/* Main Authentication Grid */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-md-surface-container-low border border-white/[0.08] rounded-md-xl shadow-md-elevation-3 overflow-hidden">
          
          {/* Left Column: Value Proposition & Feature Highlights */}
          <div className="p-8 md:p-10 bg-gradient-to-br from-md-surface-container-high/40 to-transparent border-b md:border-b-0 md:border-r border-white/[0.08] flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-md-primary font-semibold">
                SaaS Personal Workspace
              </span>
              <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-md-on-surface leading-tight">
                Craft, target &amp; monitor executive-grade resumes.
              </h1>
              <p className="text-xs text-md-on-surface-variant leading-relaxed">
                Log in to access your personal cabinet, maintain multiple tailored resume variants, and track real-time export telemetry.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-md-on-surface">Multi-Resume Cloud Library</h4>
                  <p className="text-[11px] text-md-on-surface-variant mt-0.5">
                    Save unlimited role-specific resumes synced securely across devices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-md-primary/15 text-md-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-md-on-surface">Neuro-Cognitive AI Diagnostics</h4>
                  <p className="text-[11px] text-md-on-surface-variant mt-0.5">
                    Evaluated against Miller's Law, F-Pattern scanning, and high-impact framing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-md-on-surface">Export Telemetry &amp; Heatmap</h4>
                  <p className="text-[11px] text-md-on-surface-variant mt-0.5">
                    Synchronized tracking of PDF, Word DOCX, and print versions over time.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-md-on-surface-variant/80 font-mono">
              SOC2 &amp; GDPR compliant cloud data isolation.
            </div>
          </div>

          {/* Right Column: Interactive Login / Sign Up Form */}
          <div className="p-8 md:p-10 flex flex-col justify-center space-y-6">
            {/* Segmented Mode Selector */}
            <div role="tablist" aria-label="Authentication Options" className="grid grid-cols-2 p-1 bg-md-surface-container rounded-[10px] border border-white/[0.06]">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signin'}
                onClick={() => { setMode('signin'); setErrorMessage(null); }}
                className={`h-10 min-h-[40px] px-4 py-2 text-xs font-medium rounded-[6px] transition-all cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary ${
                  mode === 'signin' 
                    ? 'bg-md-primary text-md-on-primary shadow-sm font-semibold' 
                    : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.04]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                onClick={() => { setMode('signup'); setErrorMessage(null); }}
                className={`h-10 min-h-[40px] px-4 py-2 text-xs font-medium rounded-[6px] transition-all cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary ${
                  mode === 'signup' 
                    ? 'bg-md-primary text-md-on-primary shadow-sm font-semibold' 
                    : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.04]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Google One-Click Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-11 min-h-[44px] px-5 py-2.5 rounded-[8px] bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2 focus-visible:ring-offset-md-surface"
              aria-label="Continue with Google"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-white/[0.08]" />
              <span className="text-[11px] text-md-on-surface-variant font-mono uppercase">or email</span>
              <div className="flex-1 h-[1px] bg-white/[0.08]" />
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-md-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs text-md-on-surface-variant flex items-center gap-1.5 font-medium">
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Full Name</span>
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Diakov"
                    required={mode === 'signup'}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-md-on-surface-variant flex items-center gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Work Email</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-md-on-surface-variant flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Password</span>
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                className="gap-2 py-2.5 mt-2"
              >
                <span>{loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Workspace' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <p className="text-[11px] text-center text-md-on-surface-variant">
              By proceeding, you agree to secure account telemetry &amp; privacy terms.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-md-on-surface-variant border-t border-white/[0.08]">
        © {new Date().getFullYear()} Cognitive Resume Builder &amp; Executive Career SaaS.
      </footer>
    </div>
  );
};

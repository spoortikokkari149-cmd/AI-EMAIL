import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  Key, 
  User, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Eye, 
  EyeOff, 
  Terminal,
  Zap,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type AuthMode = 'login' | 'signup' | 'forgot';

export function AuthPage() {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    signupWithEmail, 
    resetPassword, 
    authError, 
    clearAuthError 
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [localValidation, setLocalValidation] = useState<string | null>(null);

  const switchMode = (newMode: AuthMode) => {
    clearAuthError();
    setLocalValidation(null);
    setResetSuccessMessage(null);
    setMode(newMode);
  };

  const handleGoogleLogin = async () => {
    setLocalValidation(null);
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
    } catch {
      // Auth error handled in context
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalValidation(null);
    setResetSuccessMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setLocalValidation('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      setIsSubmitting(true);
      try {
        await resetPassword(email);
        setResetSuccessMessage(`Password recovery instructions transmitted to ${email}. Check your inbox.`);
      } catch {
        // Handled in context
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!password) {
      setLocalValidation('Password is required.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setLocalValidation('Security protocol requires password to be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalValidation('Passwords do not match. Please verify.');
        return;
      }

      setIsSubmitting(true);
      try {
        await signupWithEmail(email, password, displayName);
      } catch {
        // Handled in context
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      try {
        await loginWithEmail(email, password);
      } catch {
        // Handled in context
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#070b14] text-slate-100 overflow-hidden px-4 py-8">
      {/* Background Cyber Grid & Glowing Accents */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center relative mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 p-1 rounded-full shadow-lg">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            AI Email Threat Detection System
          </h1>
          <p className="mt-2 text-sm text-cyan-300/80 max-w-sm mx-auto">
            Intelligent Detection of Phishing, Spam, Scams and Malicious Emails
          </p>
          
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            ZERO-TRUST SECURITY PERIMETER
          </div>
        </div>

        {/* Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-slate-900/75 border border-cyan-500/20 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.12)]">
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-slate-800 pb-3 mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 text-center py-2 text-sm font-medium transition-all relative ${
                mode === 'login' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
              {mode === 'login' && (
                <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 text-center py-2 text-sm font-medium transition-all relative ${
                mode === 'signup' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
              {mode === 'signup' && (
                <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              className={`flex-1 text-center py-2 text-sm font-medium transition-all relative ${
                mode === 'forgot' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Recovery
              {mode === 'forgot' && (
                <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
              )}
            </button>
          </div>

          {/* Validation & Error Alerts */}
          {(authError || localValidation) && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                {localValidation || authError}
              </div>
            </div>
          )}

          {resetSuccessMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{resetSuccessMessage}</div>
            </div>
          )}

          {/* Google Sign-In Button */}
          {mode !== 'forgot' && (
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleSubmitting || isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-sm font-medium text-slate-100 transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
              >
                {isGoogleSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
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
                )}
                <span>Continue with Google</span>
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-mono">
                  <span className="bg-[#0b101d] px-3 text-slate-500">Or use email credential</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Analyst Name / Call Sign
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins (SOC Level 2)"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@enterprise.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase text-slate-400">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Credentials...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <span>Authenticate & Launch Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'signup' ? (
                <>
                  <span>Create Security Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Send Recovery Instructions</span>
                  <Zap className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              FIREBASE AUTH 10.x
            </span>
            <span>256-BIT ENCRYPTION</span>
          </div>
        </div>
      </div>
    </div>
  );
}

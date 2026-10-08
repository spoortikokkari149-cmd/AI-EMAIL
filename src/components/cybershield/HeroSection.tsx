import { useState } from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Radio, 
  AlertCircle, 
  FileSearch, 
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Zap,
  Lock
} from 'lucide-react';
import { ThreeCyberShield, type ShieldMode } from './ThreeCyberShield';

interface HeroSectionProps {
  onOpenReportModal: () => void;
  onOpenScanner?: () => void;
}

export function HeroSection({ onOpenReportModal, onOpenScanner }: HeroSectionProps) {
  const [shieldMode, setShieldMode] = useState<ShieldMode>('defense');

  return (
    <section id="hero" className="relative pt-6 pb-16 lg:py-20 overflow-hidden">
      {/* 3D Grid Perspective Floor */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(600px) rotateX(25deg)',
          transformOrigin: 'top center',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>DEFENSE MATRIX 3.0 &bull; LIVE 3D THREAT TELEMETRY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Master Scam Patterns. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Armor Your Digital Life.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              CyberShield educates users on recognizing high-stealth phishing campaigns, OTP theft, deceptive shopping clones, and investment fraud. Interact with 3D threat models and test real-time prevention habits.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#scams"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Inspect Scam Anatomy</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onOpenReportModal}
                className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition flex items-center gap-2 cursor-pointer"
              >
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Simulate Incident Report</span>
              </button>

              {onOpenScanner && (
                <button
                  type="button"
                  onClick={onOpenScanner}
                  className="px-5 py-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-xs sm:text-sm font-mono transition flex items-center gap-2 cursor-pointer"
                >
                  <FileSearch className="w-4 h-4 text-cyan-400" />
                  <span>Scan .eml File</span>
                </button>
              )}
            </div>

            {/* Live Security Indicators */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block uppercase">OTP Guard</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Lock className="w-3 h-3" /> Zero-Share
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block uppercase">Phish Radar</span>
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 mt-0.5">
                  <Zap className="w-3 h-3" /> 99.8% Catch
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block uppercase">AI Sentinel</span>
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1 mt-0.5">
                  <Terminal className="w-3 h-3" /> Standing By
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D WebGL Holographic Shield Scene */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Lighting Orbs */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/15 via-blue-600/10 to-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* 3D Holographic Shield Canvas with mouse parallax */}
            <div className="w-full relative">
              <ThreeCyberShield
                mode={shieldMode}
                onModeChange={(m) => setShieldMode(m)}
              />

              {/* Floating 3D Telemetry Chips with perspective depth */}
              <div className="hidden sm:flex absolute top-4 left-0 -translate-x-4 p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-xl items-center gap-2 transform -rotate-2 hover:rotate-0 transition-transform">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>3D Shield Integrity: 100%</span>
              </div>

              <div className="hidden sm:flex absolute bottom-12 right-0 translate-x-4 p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-amber-500/30 text-xs font-mono text-amber-300 shadow-xl items-center gap-2 transform rotate-2 hover:rotate-0 transition-transform">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Global Threat Radar: Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

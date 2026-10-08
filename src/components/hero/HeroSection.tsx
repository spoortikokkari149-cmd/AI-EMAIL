import { 
  ShieldAlert, 
  ArrowRight, 
  Mail, 
  MessageSquare, 
  Camera, 
  AlertTriangle, 
  Cpu, 
  Radio, 
  FileSearch, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { CyberShieldCanvas, type CyberShieldState } from './CyberShieldCanvas';

interface HeroSectionProps {
  onScrollToAnalyzer: () => void;
  onScrollToMessage: () => void;
  onScrollToScreenshot: () => void;
  onScrollToIntelligence: () => void;
  shieldState?: CyberShieldState;
}

export function HeroSection({ 
  onScrollToAnalyzer, 
  onScrollToMessage, 
  onScrollToScreenshot,
  onScrollToIntelligence,
  shieldState = 'idle'
}: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden pt-8 pb-16 lg:py-20 border-b border-cyan-500/15">
      {/* Background Cyber Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Cyber Glow Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Text & Navigation Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-semibold tracking-wide">OMNI-CHANNEL AI THREAT PLATFORM</span>
              <span className="text-cyan-600">&bull;</span>
              <span className="text-cyan-400 font-bold">ACTIVE</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                AI Cyber Threat &amp; <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                  Scam Detection Platform
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Single unified defense against <strong className="text-white">Email Phishing</strong>, <strong className="text-cyan-300">SMS / Chat Scams</strong>, and <strong className="text-purple-300">Fraudulent Screenshots</strong> with voice-enabled AI assistance.
              </p>
            </div>

            {/* 3 Main Vector Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                type="button"
                onClick={onScrollToAnalyzer}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Mail className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Analyze Email (.EML)</span>
              </button>

              <button
                type="button"
                onClick={onScrollToMessage}
                className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-sky-500/40 text-sky-300 hover:text-white font-medium text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>Message Scam Detector</span>
              </button>

              <button
                type="button"
                onClick={onScrollToScreenshot}
                className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/40 text-purple-300 hover:text-white font-medium text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-purple-400" />
                <span>Analyze Screenshot</span>
              </button>
            </div>

            {/* Feature Mini Pills */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-left">
              <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="text-[10px] font-mono text-cyan-400 uppercase">Detection Vectors</div>
                <div className="text-xs font-bold text-slate-200">Email + SMS + OCR</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="text-[10px] font-mono text-cyan-400 uppercase">AI Assistant</div>
                <div className="text-xs font-bold text-slate-200">Voice + Command Router</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="text-[10px] font-mono text-cyan-400 uppercase">3D Visual Core</div>
                <div className="text-xs font-bold text-slate-200">State-Reactive WebGL</div>
              </div>
            </div>
          </div>

          {/* Right 3D Visual Column */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full max-w-[540px] aspect-square relative flex items-center justify-center">
              {/* Interactive 3D Cyber Shield WebGL Scene */}
              <CyberShieldCanvas state={shieldState} />

              {/* Floating 3D Email Card (Requirement #8) */}
              <div 
                className="absolute -bottom-4 sm:bottom-4 -left-2 sm:left-4 z-20 backdrop-blur-xl bg-slate-950/85 border border-red-500/40 rounded-2xl p-4 shadow-[0_0_35px_rgba(239,68,68,0.25)] max-w-[230px] animate-[bounce_5s_ease-in-out_infinite]"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Email Analysis</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/70 border border-red-500/40 text-[10px] font-mono font-bold text-red-400">
                    <AlertTriangle className="w-3 h-3" />
                    Threat Detected
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    Risk Score: <span className="text-red-400">87%</span>
                  </div>
                </div>
              </div>

              {/* Floating 3D Smartphone Message Card (Requirement #8) */}
              <div 
                className="absolute top-4 sm:top-10 -right-2 sm:right-2 z-20 backdrop-blur-xl bg-slate-950/85 border border-sky-500/40 rounded-2xl p-3.5 shadow-[0_0_30px_rgba(14,165,233,0.2)] max-w-[210px] animate-[bounce_6s_ease-in-out_infinite]"
                style={{ animationDelay: '1.5s' }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-sky-300">
                    <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                    <span>SMS Smishing Lure</span>
                  </div>
                  <span className="text-[10px] font-mono text-red-400 font-bold">92%</span>
                </div>
                <p className="text-[10px] text-slate-300 font-sans line-clamp-2">
                  "Your SBI A/C is blocked today. Verify PAN KYC: http://sbi-verify.xyz"
                </p>
              </div>

              {/* Top Floating Reactive AI Status Badge */}
              <div className="absolute top-0 left-4 sm:left-12 z-20 backdrop-blur-md bg-slate-900/85 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-[11px] font-mono text-cyan-300 flex items-center gap-2 shadow-lg">
                <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="uppercase">Core State: {shieldState}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

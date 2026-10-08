import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileWarning, 
  Link2, 
  Cpu, 
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import type { EmailThreatAnalysis, ParsedEmlData } from '../../types/threat';

interface ThreatOverviewCardProps {
  analysis: EmailThreatAnalysis;
  parsed: ParsedEmlData;
}

export function ThreatOverviewCard({ analysis, parsed }: ThreatOverviewCardProps) {
  const { threatType, threatLevel, riskScore, confidence, summary, modelUsed } = analysis;

  const getThreatLevelStyle = (level: string) => {
    switch (level) {
      case 'Critical':
        return {
          bg: 'bg-red-950/40',
          border: 'border-red-500/50',
          text: 'text-red-400',
          glow: 'shadow-[0_0_40px_rgba(239,68,68,0.25)]',
          badge: 'bg-red-500/20 text-red-300 border-red-500/50',
          gaugeStroke: '#ef4444',
          glowHex: '#ef4444',
        };
      case 'High':
        return {
          bg: 'bg-orange-950/40',
          border: 'border-orange-500/50',
          text: 'text-orange-400',
          glow: 'shadow-[0_0_40px_rgba(249,115,22,0.25)]',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
          gaugeStroke: '#f97316',
          glowHex: '#f97316',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/50',
          text: 'text-amber-400',
          glow: 'shadow-[0_0_35px_rgba(245,158,11,0.2)]',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          gaugeStroke: '#f59e0b',
          glowHex: '#f59e0b',
        };
      case 'Low':
        return {
          bg: 'bg-blue-950/40',
          border: 'border-blue-500/50',
          text: 'text-blue-400',
          glow: 'shadow-[0_0_30px_rgba(59,130,246,0.2)]',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
          gaugeStroke: '#38bdf8',
          glowHex: '#38bdf8',
        };
      default:
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/50',
          text: 'text-emerald-400',
          glow: 'shadow-[0_0_35px_rgba(16,185,129,0.2)]',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          gaugeStroke: '#10b981',
          glowHex: '#10b981',
        };
    }
  };

  const style = getThreatLevelStyle(threatLevel);
  const isMalicious = threatLevel === 'Critical' || threatLevel === 'High';

  // 3D Circular Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div className={`rounded-2xl border ${style.border} ${style.bg} ${style.glow} p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden transition-all duration-300`}>
      {/* Background ambient lighting */}
      <div 
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: style.glowHex }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Verdict & Threat Classification */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${style.badge}`}>
              {isMalicious ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {threatLevel} Threat Severity
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-mono text-cyan-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              {modelUsed || 'AI Neural Classifier'}
            </span>

            <span className="text-xs text-slate-400 font-mono">
              AI Confidence: <strong className="text-white">{confidence}%</strong>
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {threatType}
            </h2>
            <p className="text-xs text-cyan-400/90 font-mono mt-1 flex items-center gap-1.5">
              <span>Target:</span>
              <span className="text-slate-200 font-bold truncate max-w-md">{parsed.subject}</span>
            </p>
          </div>

          {/* AI Forensic Explanation Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 leading-relaxed shadow-inner">
            <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 font-bold">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Forensic AI Threat Telemetry Verdict:
            </div>
            {summary}
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Suspicious URLs</div>
              <div className="text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                <Link2 className="w-4 h-4 text-cyan-400" />
                {analysis.suspiciousUrls.length}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Threat Indicators</div>
              <div className="text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                <Activity className="w-4 h-4 text-amber-400" />
                {analysis.securityFindings.length}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Attachments</div>
              <div className="text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                <FileWarning className="w-4 h-4 text-purple-400" />
                {parsed.attachments.length}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Origin Domain</div>
              <div className="text-xs font-bold text-cyan-300 truncate mt-1" title={parsed.from}>
                {analysis.senderAnalysis.senderEmail.split('@')[1] || 'Unknown'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: 3D-Style Circular Risk Meter */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 border-t lg:border-t-0 lg:border-l border-slate-800/80">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer Decorative Cyber Ticks Ring */}
            <div 
              className="absolute inset-0 rounded-full border border-dashed border-slate-800 animate-[spin_40s_linear_infinite]"
              style={{ padding: '6px' }}
            />

            {/* Glowing 3D Depth Backdrop Ring */}
            <div 
              className="absolute w-36 h-36 rounded-full blur-xl opacity-30"
              style={{ backgroundColor: style.gaugeStroke }}
            />

            {/* SVG 3D-Style Gauge */}
            <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]" viewBox="0 0 130 130">
              {/* Outer track */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-slate-900 fill-none"
                strokeWidth="11"
              />
              {/* Inner track accent */}
              <circle
                cx="65"
                cy="65"
                r={radius - 9}
                className="stroke-slate-800/60 fill-none"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {/* Animated Progress Arc */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke={style.gaugeStroke}
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 8px ${style.gaugeStroke})`,
                  transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </svg>

            {/* Center 3D Hub Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-white tracking-tighter drop-shadow-md font-mono">
                {riskScore}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Risk Score
              </span>
              <span className={`text-[11px] font-mono font-bold mt-0.5 ${style.text}`}>
                / 100
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs font-mono text-slate-400">
              Calculated Threat Index: <strong className={style.text}>{threatLevel.toUpperCase()}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

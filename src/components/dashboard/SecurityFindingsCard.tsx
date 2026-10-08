import { 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Crosshair 
} from 'lucide-react';
import type { SecurityFinding } from '../../types/threat';

interface SecurityFindingsCardProps {
  findings: SecurityFinding[];
}

export function SecurityFindingsCard({ findings }: SecurityFindingsCardProps) {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-400 font-mono text-[10px] font-bold">
            CRITICAL
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded bg-orange-950/60 border border-orange-500/40 text-orange-400 font-mono text-[10px] font-bold">
            HIGH
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-400 font-mono text-[10px] font-bold">
            MEDIUM
          </span>
        );
      case 'Low':
        return (
          <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/40 text-blue-400 font-mono text-[10px] font-bold">
            LOW
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Detailed Security Findings & Telemetry
          </h3>
        </div>
        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
          {findings.length} Finding{findings.length === 1 ? '' : 's'}
        </span>
      </div>

      {findings.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-xs text-slate-300">No malicious indicators or anomalies were detected.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {findings.map((f, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border text-xs transition-all ${
                f.severity === 'Critical'
                  ? 'bg-red-950/20 border-red-500/30'
                  : f.severity === 'High'
                  ? 'bg-orange-950/20 border-orange-500/30'
                  : f.severity === 'Medium'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-slate-950/50 border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  {getSeverityBadge(f.severity)}
                  <span className="text-[11px] font-mono uppercase text-slate-400">
                    {f.category}
                  </span>
                </div>

                {f.mitreAttackId && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                    <Crosshair className="w-3 h-3 text-cyan-400" />
                    MITRE {f.mitreAttackId}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-100 mb-1">
                {f.title}
              </h4>
              <p className="text-slate-300/90 leading-relaxed text-xs">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

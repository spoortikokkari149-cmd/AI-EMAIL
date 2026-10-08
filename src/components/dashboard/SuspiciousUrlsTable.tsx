import { useState } from 'react';
import { 
  Link2, 
  ExternalLink, 
  AlertTriangle, 
  ShieldAlert, 
  Copy, 
  Check, 
  Globe, 
  ShieldCheck 
} from 'lucide-react';
import type { SuspiciousUrl } from '../../types/threat';

interface SuspiciousUrlsTableProps {
  urls: SuspiciousUrl[];
}

export function SuspiciousUrlsTable({ urls }: SuspiciousUrlsTableProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = (defanged: string) => {
    navigator.clipboard.writeText(defanged);
    setCopiedUrl(defanged);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Malicious':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-[10px] font-mono font-bold text-red-400">
            <ShieldAlert className="w-3 h-3 text-red-400" />
            MALICIOUS
          </span>
        );
      case 'Suspicious':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-400">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            SUSPICIOUS
          </span>
        );
      case 'Neutral':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
            NEUTRAL
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            CLEAN
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            URL & Hyperlink IOC Analysis
          </h3>
        </div>
        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
          {urls.length} link{urls.length === 1 ? '' : 's'} inspected
        </span>
      </div>

      <p className="text-xs text-slate-400">
        All links are presented in defanged format (<code className="text-cyan-400">hxxp[s]://</code>) to prevent accidental execution.
      </p>

      {urls.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl">
          <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400">No external hyperlinks were discovered in this email message.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {urls.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-xs font-mono transition-all ${
                item.riskLevel === 'Malicious'
                  ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/50'
                  : item.riskLevel === 'Suspicious'
                  ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-slate-950/50 border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {getRiskBadge(item.riskLevel)}
                  <span className="text-[11px] text-cyan-300 font-bold">
                    Host: {item.domain}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(item.defangedUrl)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition cursor-pointer"
                  title="Copy defanged IOC"
                >
                  {copiedUrl === item.defangedUrl ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy IOC</span>
                    </>
                  )}
                </button>
              </div>

              {/* Defanged URL */}
              <div className="p-2 rounded bg-slate-950/90 border border-slate-800/80 break-all text-slate-300 text-[11px] mb-2 font-mono">
                {item.defangedUrl}
              </div>

              {/* Anchor text discrepancy */}
              {item.anchorText && (
                <div className="text-[11px] text-slate-400 mb-2">
                  <span className="text-slate-500">Visible Anchor Text:</span>{' '}
                  <span className="text-slate-200 font-sans">"{item.anchorText}"</span>
                </div>
              )}

              {/* Reason flags */}
              {item.reasons.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-slate-800/60 font-sans text-xs">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    Telemetry Flags:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {item.reasons.map((r, rIdx) => (
                      <li key={rIdx} className="leading-snug">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

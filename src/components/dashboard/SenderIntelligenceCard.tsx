import { 
  UserCheck, 
  AlertOctagon, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  AtSign, 
  CornerDownRight, 
  ShieldCheck,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';
import type { SenderAnalysis, ParsedEmlData } from '../../types/threat';

interface SenderIntelligenceCardProps {
  senderAnalysis: SenderAnalysis;
  parsed: ParsedEmlData;
  onOpenRawHeaders: () => void;
}

export function SenderIntelligenceCard({ 
  senderAnalysis, 
  parsed, 
  onOpenRawHeaders 
}: SenderIntelligenceCardProps) {
  const { 
    senderName, 
    senderEmail, 
    replyTo, 
    returnPath, 
    isSpoofed, 
    spfStatus, 
    dkimStatus, 
    dmarcStatus, 
    notes 
  } = senderAnalysis;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pass':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-mono font-semibold text-emerald-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            PASS
          </span>
        );
      case 'Fail':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-[11px] font-mono font-semibold text-red-400">
            <XCircle className="w-3 h-3 text-red-400" />
            FAIL
          </span>
        );
      case 'SoftFail':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-[11px] font-mono font-semibold text-amber-400">
            <AlertOctagon className="w-3 h-3 text-amber-400" />
            SOFTFAIL
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-400">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            NONE
          </span>
        );
    }
  };

  const isReplyToMismatch = replyTo && replyTo !== senderEmail && !replyTo.includes(senderEmail);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <AtSign className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Sender & Origin Telemetry
          </h3>
        </div>

        <button
          onClick={onOpenRawHeaders}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
        >
          View Full MIME Headers
        </button>
      </div>

      {/* Spoofing Banner if detected */}
      {isSpoofed && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-bold text-red-300">Identity Spoofing Anomaly Detected:</strong>
            <p className="text-red-300/80 leading-relaxed">{notes}</p>
          </div>
        </div>
      )}

      {/* Main Sender Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {/* Visible Sender */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
            From (Display Name & Address)
          </div>
          <div className="text-sm font-semibold text-slate-100 break-all">
            {senderName || senderEmail}
          </div>
          <div className="text-[11px] text-cyan-400/90 break-all">
            &lt;{senderEmail}&gt;
          </div>
        </div>

        {/* Return-Path */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
            Return-Path (Envelope Sender)
          </div>
          <div className="text-sm font-semibold text-slate-200 break-all">
            {returnPath || '(Not declared in headers)'}
          </div>
          {returnPath && returnPath !== senderEmail && (
            <div className="text-[10px] text-amber-400 flex items-center gap-1 pt-0.5">
              <ArrowRightLeft className="w-3 h-3" />
              Differs from From header
            </div>
          )}
        </div>
      </div>

      {/* Reply-To Discrepancy Alert */}
      {replyTo && (
        <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-start gap-3 ${
          isReplyToMismatch 
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' 
            : 'bg-slate-950/40 border-slate-800 text-slate-300'
        }`}>
          <CornerDownRight className={`w-4 h-4 shrink-0 mt-0.5 ${isReplyToMismatch ? 'text-amber-400' : 'text-slate-400'}`} />
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Reply-To Destination
            </span>
            <span className="font-semibold break-all text-slate-100">
              {replyTo}
            </span>
            {isReplyToMismatch && (
              <p className="text-[11px] text-amber-300/90 pt-1">
                Caution: Replies will not go to the visible sender. This is a common tactic in Business Email Compromise (BEC) and phishing campaigns.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Authentication Mechanisms */}
      <div className="pt-2 border-t border-slate-800">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2.5">
          Mail Authentication Protocol Records
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">SPF</div>
              <div className="text-[10px] text-slate-500">Sender Policy Framework</div>
            </div>
            {getStatusBadge(spfStatus)}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">DKIM</div>
              <div className="text-[10px] text-slate-500">DomainKeys Identified Mail</div>
            </div>
            {getStatusBadge(dkimStatus)}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">DMARC</div>
              <div className="text-[10px] text-slate-500">Domain-based Auth & Reporting</div>
            </div>
            {getStatusBadge(dmarcStatus)}
          </div>
        </div>
      </div>
    </div>
  );
}

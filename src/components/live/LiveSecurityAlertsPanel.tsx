import { useState, useEffect } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  AlertTriangle, 
  FileWarning, 
  Globe, 
  UserX, 
  Pause, 
  Play, 
  Trash2,
  Terminal,
  Activity
} from 'lucide-react';

export interface ThreatAlert {
  id: string;
  timestamp: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  message: string;
  sourceIp: string;
  domain: string;
  mitreTag: string;
}

const SEED_ALERTS: ThreatAlert[] = [
  {
    id: 'alt-101',
    timestamp: '10:42:15',
    type: 'Phishing Campaign',
    severity: 'CRITICAL',
    message: 'Phishing campaign detected - Mass credential harvesting targeting Office 365 tenants',
    sourceIp: '198.51.100.42',
    domain: 'm1crosoft-auth-alert.xyz',
    mitreTag: 'T1566.002',
  },
  {
    id: 'alt-102',
    timestamp: '10:41:50',
    type: 'Suspicious Domain',
    severity: 'HIGH',
    message: 'Suspicious domain identified - Lookalike PayPal verification portal blocked at DNS gateway',
    sourceIp: '104.21.44.11',
    domain: 'paypa1-security-check.click',
    mitreTag: 'T1566.002',
  },
  {
    id: 'alt-103',
    timestamp: '10:40:22',
    type: 'Email Spoofing',
    severity: 'HIGH',
    message: 'Email spoofing attempt detected - Envelope Return-Path divergence on executive mailbox',
    sourceIp: '203.0.113.88',
    domain: 'direct-bankpay.top',
    mitreTag: 'T1656',
  },
  {
    id: 'alt-104',
    timestamp: '10:38:09',
    type: 'Malicious Attachment',
    severity: 'CRITICAL',
    message: 'Malicious attachment detected - Script dropper masquerading as PDF invoice (INV-9941.pdf.scr)',
    sourceIp: '45.33.32.156',
    domain: 'intuit-notices.buzz',
    mitreTag: 'T1566.001',
  },
  {
    id: 'alt-105',
    timestamp: '10:35:44',
    type: 'High-Risk Sender',
    severity: 'MEDIUM',
    message: 'High-risk sender detected - Disposable foreign relay host attempting bulk spam delivery',
    sourceIp: '185.220.101.5',
    domain: 'disposable-mailer.cfd',
    mitreTag: 'T1589',
  },
];

const NEW_ALERT_POOL: Omit<ThreatAlert, 'id' | 'timestamp'>[] = [
  {
    type: 'Business Email Compromise',
    severity: 'CRITICAL',
    message: 'BEC wire diversion detected - Urgent confidential settlement request intercepted',
    sourceIp: '194.26.29.112',
    domain: 'corporate-legal-transfer.xyz',
    mitreTag: 'T1656',
  },
  {
    type: 'OAuth Consent Phishing',
    severity: 'HIGH',
    message: 'Malicious app consent lure detected - Requesting read permissions for mailboxes',
    sourceIp: '91.240.118.89',
    domain: 'cloud-apps-authorization.online',
    mitreTag: 'T1528',
  },
  {
    type: 'Zero-Day QR Phishing (Quishing)',
    severity: 'HIGH',
    message: 'Quishing pattern detected - Embedded QR code directing to credential capture proxy',
    sourceIp: '185.191.171.12',
    domain: 'mfa-security-redirect.live',
    mitreTag: 'T1566.003',
  },
  {
    type: 'DMARC Alignment Failure',
    severity: 'MEDIUM',
    message: 'Strict DMARC reject enforced on spoofed banking notification origin',
    sourceIp: '193.106.191.24',
    domain: 'chase-security-verify.cam',
    mitreTag: 'T1566.002',
  },
];

export function LiveSecurityAlertsPanel() {
  const [alerts, setAlerts] = useState<ThreatAlert[]>(SEED_ALERTS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    let alertCounter = 200;

    const interval = setInterval(() => {
      const randomSeed = NEW_ALERT_POOL[Math.floor(Math.random() * NEW_ALERT_POOL.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const uniqueSuffix = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).substring(2, 7);

      const newAlert: ThreatAlert = {
        ...randomSeed,
        id: `alt-${Date.now()}-${++alertCounter}-${uniqueSuffix}`,
        timestamp: timeStr,
      };

      setAlerts((prev) => [newAlert, ...prev.slice(0, 7)]);
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-950/80 border-red-500/60 text-red-400 font-bold';
      case 'HIGH':
        return 'bg-orange-950/80 border-orange-500/60 text-orange-400 font-bold';
      default:
        return 'bg-amber-950/80 border-amber-500/60 text-amber-400 font-semibold';
    }
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-cyan-500/30 p-5 shadow-[0_0_40px_rgba(6,182,212,0.12)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide flex items-center gap-2">
              Live SOC Threat Intelligence Feed
            </h3>
            <p className="text-[11px] font-mono text-cyan-300/80">
              Simulated real-time mail perimeter sensor event stream
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white transition cursor-pointer"
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span>Resume Feed</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setAlerts(SEED_ALERTS)}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            title="Reset alerts"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Alert Feed Items */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 text-xs font-mono transition-all duration-200 group flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getSeverityBadge(alt.severity)}`}>
                  {alt.severity}
                </span>

                <span className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {alt.type}
                </span>

                <span className="text-[10px] text-slate-400">
                  [{alt.timestamp}]
                </span>

                <span className="text-[10px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                  {alt.mitreTag}
                </span>
              </div>

              <p className="text-slate-300 text-xs font-sans font-normal leading-relaxed">
                {alt.message}
              </p>
            </div>

            <div className="flex sm:flex-col items-start sm:items-end justify-between text-[11px] text-slate-400 shrink-0 border-t sm:border-t-0 border-slate-800 pt-1 sm:pt-0">
              <span className="text-cyan-300 font-bold">{alt.domain}</span>
              <span className="text-slate-400 text-[10px]">IP: {alt.sourceIp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-cyan-400" />
          FEED LATENCY: &lt; 24ms
        </span>
        <span className="text-cyan-400/90">STREAM: ACTIVE (DEMO MODE)</span>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  Mail, 
  MessageSquare, 
  Camera, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  Zap,
  BarChart3,
  Layers
} from 'lucide-react';

interface UnifiedDashboardOverviewProps {
  onNavigate: (sectionId: string) => void;
  emailsCount: number;
  messagesCount: number;
  screenshotsCount: number;
  threatsDetectedCount: number;
}

export function UnifiedDashboardOverview({
  onNavigate,
  emailsCount,
  messagesCount,
  screenshotsCount,
  threatsDetectedCount,
}: UnifiedDashboardOverviewProps) {
  // Activity trend mock timeline data for the modern chart
  const weeklyActivity = [
    { day: 'Mon', email: 42, msg: 68, screen: 19, threats: 28 },
    { day: 'Tue', email: 58, msg: 84, screen: 24, threats: 36 },
    { day: 'Wed', email: 73, msg: 95, screen: 31, threats: 49 },
    { day: 'Thu', email: 61, msg: 72, screen: 26, threats: 32 },
    { day: 'Fri', email: 89, msg: 110, screen: 38, threats: 58 },
    { day: 'Sat', email: 45, msg: 63, screen: 18, threats: 24 },
    { day: 'Sun', email: 38, msg: 52, screen: 15, threats: 19 },
  ];

  return (
    <section id="dashboard-overview" className="w-full py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            UNIFIED SOC TELEMETRY CONSOLE
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cyber Threat Operations Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated cross-vector security telemetry across Email payloads, SMS/Chat messages, and image screenshots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('analyzer-section')}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Scan Email</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('message-detector')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Check SMS</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('screenshot-analyzer')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5 text-purple-400" />
            <span>Analyze Image</span>
          </button>
        </div>
      </div>

      {/* Top 4 Primary Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Emails Analyzed</span>
            <Mail className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {emailsCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-cyan-400/80 font-mono mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            MIME &amp; RFC 822 Forensics
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Messages Analyzed</span>
            <MessageSquare className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {messagesCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-sky-400/80 font-mono mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            SMS, WhatsApp &amp; Telegram
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-purple-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Screenshots Scanned</span>
            <Camera className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {screenshotsCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-purple-400/80 font-mono mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            Multimodal OCR Vision
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-red-500/30 hover:border-red-500/60 transition-all group shadow-[0_0_25px_rgba(239,68,68,0.15)]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Threats Intercepted</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono">
            {threatsDetectedCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-red-400/80 font-mono mt-1 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Neutralized at Perimeter
          </span>
        </div>
      </div>

      {/* Threat Category Severity Cards Grid (Requirement #7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 space-y-1.5">
          <div className="flex items-center justify-between text-red-400 text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              CRITICAL THREATS
            </span>
            <span>75–100% Risk</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Active credential harvesting, Trojans, ransomware scripts, and wire diversion scams.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-500/40 space-y-1.5">
          <div className="flex items-center justify-between text-orange-400 text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              HIGH RISK
            </span>
            <span>50–74% Risk</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Impersonated brands, unverified redirect links, courier fees, and deceptive APK payloads.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1.5">
          <div className="flex items-center justify-between text-amber-400 text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              SUSPICIOUS
            </span>
            <span>30–49% Risk</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Urgent countdowns, SPF softfails, unverified Telegram groups, and prize solicitations.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              SAFE &amp; VERIFIED
            </span>
            <span>0–29% Risk</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Cryptographically signed DKIM/SPF domains and verified consumer correspondences.
          </p>
        </div>
      </div>

      {/* Modern Threat Activity Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Weekly Multi-Vector Threat Ingestion Volume
            </h3>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Emails
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Messages
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Screenshots
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Threat Intercepts
            </span>
          </div>
        </div>

        {/* Visual Bar Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4">
          {weeklyActivity.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="w-full h-36 bg-slate-950/80 rounded-xl p-1.5 flex items-end justify-center gap-1 border border-slate-800/80">
                {/* Email bar */}
                <div
                  className="w-1.5 sm:w-2 bg-cyan-400 rounded-t"
                  style={{ height: `${(item.email / 110) * 100}%` }}
                  title={`Emails: ${item.email}`}
                />
                {/* Message bar */}
                <div
                  className="w-1.5 sm:w-2 bg-sky-400 rounded-t"
                  style={{ height: `${(item.msg / 110) * 100}%` }}
                  title={`Messages: ${item.msg}`}
                />
                {/* Screenshot bar */}
                <div
                  className="w-1.5 sm:w-2 bg-purple-400 rounded-t"
                  style={{ height: `${(item.screen / 110) * 100}%` }}
                  title={`Screenshots: ${item.screen}`}
                />
                {/* Threat bar */}
                <div
                  className="w-1.5 sm:w-2 bg-red-400 rounded-t"
                  style={{ height: `${(item.threats / 110) * 100}%` }}
                  title={`Threats Blocked: ${item.threats}`}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-400 font-bold">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

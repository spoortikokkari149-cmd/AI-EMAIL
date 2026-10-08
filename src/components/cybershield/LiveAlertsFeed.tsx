import { useState, useEffect } from 'react';
import { 
  Radio, 
  AlertTriangle, 
  ShieldAlert, 
  Pause, 
  Play, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';

export interface ThreatAlert {
  id: string;
  threatType: string;
  sourceTarget: string;
  vector: string;
  region: string;
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  timeAgo: string;
  description: string;
  mitigation: string;
}

const INITIAL_ALERTS: ThreatAlert[] = [
  {
    id: 'ALT-9821',
    threatType: 'IRS & Tax Rebate SMS Smishing',
    sourceTarget: 'Consumer Mobile Subscribers',
    vector: 'SMS link: irs-tax-refund-claim[.]top',
    region: 'North America',
    severity: 'CRITICAL',
    timeAgo: 'Just now',
    description: 'Surge in spoofed tax agency messages claiming pending refunds of $1,400 with links to fake SSN harvesting forms.',
    mitigation: 'Government agencies never initiate contact regarding refunds or audits via SMS or social media.',
  },
  {
    id: 'ALT-9820',
    threatType: 'Package Delivery Address Failure',
    sourceTarget: 'USPS / DHL / FedEx Customers',
    vector: 'SMS / iMessage redirection',
    region: 'Global',
    severity: 'HIGH',
    timeAgo: '4m ago',
    description: 'Victims receive text messages stating a parcel is on hold due to incomplete street numbers, prompting a $1.50 re-delivery fee.',
    mitigation: 'The re-delivery fee is a pretext to harvest credit card and CVV information.',
  },
  {
    id: 'ALT-9819',
    threatType: 'Bank Wire Disruption Robocall',
    sourceTarget: 'Chase / Wells Fargo Account Holders',
    vector: 'Automated spoofed caller ID',
    region: 'US-East',
    severity: 'CRITICAL',
    timeAgo: '11m ago',
    description: 'Robocalls spoofing bank fraud departments asking victims to press 1 to cancel a wire, connecting to offshore scammers.',
    mitigation: 'Hang up and immediately dial the customer service number on the back of your physical bank debit card.',
  },
  {
    id: 'ALT-9818',
    threatType: 'Cloned Crypto Staking Portal',
    sourceTarget: 'MetaMask & Phantom Wallet Users',
    vector: 'Google Ads Search Hijacking',
    region: 'EMEA',
    severity: 'ELEVATED',
    timeAgo: '23m ago',
    description: 'Malicious sponsored search ads imitating popular decentralized exchanges prompt victims to enter 12-word seed phrases.',
    mitigation: 'Never type your secret recovery phrase into any web browser tab or search result.',
  },
  {
    id: 'ALT-9817',
    threatType: 'Remote Job / Check Overpayment Scam',
    sourceTarget: 'LinkedIn & Indeed Job Seekers',
    vector: 'Telegram & WhatsApp Recruiters',
    region: 'APAC & US',
    severity: 'HIGH',
    timeAgo: '38m ago',
    description: 'Fake employers send fake cashier checks to buy home office equipment, demanding a refund of the overage.',
    mitigation: 'Cashier checks can take up to 2 weeks to bounce. Never forward money based on an uncleared deposit.',
  },
];

export function LiveAlertsFeed() {
  const [alerts, setAlerts] = useState<ThreatAlert[]>(INITIAL_ALERTS);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<ThreatAlert | null>(null);

  // Rotating timer simulation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setAlerts((prev) => {
        const last = prev[prev.length - 1];
        const rest = prev.slice(0, prev.length - 1);
        return [last, ...rest];
      });
    }, 6500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-950/60 border-red-500/50 text-red-400';
      case 'HIGH':
        return 'bg-orange-950/60 border-orange-500/50 text-orange-400';
      default:
        return 'bg-amber-950/60 border-amber-500/50 text-amber-400';
    }
  };

  return (
    <section id="alerts" className="py-12 lg:py-16 bg-[#050811] border-y border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ticker Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase font-mono">
              Live Threat Sentinel Feed
            </h3>
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Simulated real-time fraud radar
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
              <span>{isPaused ? 'Resume Stream' : 'Pause'}</span>
            </button>
          </div>
        </div>

        {/* Alerts Carousel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alerts.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAlert(item)}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className={`px-2 py-0.5 rounded border font-bold ${getSeverityBadge(item.severity)}`}>
                  {item.severity}
                </span>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {item.region}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {item.timeAgo}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {item.threatType}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                  Vector: {item.vector}
                </p>
              </div>

              <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>View Incident Defense Protocol</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${getSeverityBadge(selectedAlert.severity)}`}>
                  {selectedAlert.severity} PRIORITY
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5">
                  {selectedAlert.threatType}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300 font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Target Demographic & Vector:</span>
                <p className="text-cyan-300">{selectedAlert.sourceTarget}</p>
                <p className="text-slate-400 break-all">{selectedAlert.vector}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Incident Intel:</span>
                <p className="font-sans text-slate-200">{selectedAlert.description}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 space-y-1 font-sans">
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300 font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Immediate Safety Action</span>
                </div>
                <p className="text-xs leading-relaxed">
                  {selectedAlert.mitigation}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

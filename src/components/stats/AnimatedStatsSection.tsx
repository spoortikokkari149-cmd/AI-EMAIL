import { useEffect, useRef, useState } from 'react';
import { 
  Mail, 
  ShieldAlert, 
  Fish, 
  Link2, 
  ShieldCheck, 
  TrendingUp,
  Activity
} from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  targetValue: number;
  suffix?: string;
  icon: typeof Mail;
  color: string;
  borderGlow: string;
  description: string;
}

const STATS_DATA: StatItem[] = [
  {
    id: 'emails-analyzed',
    label: 'Emails Analyzed',
    targetValue: 14892,
    icon: Mail,
    color: 'text-cyan-400',
    borderGlow: 'hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]',
    description: 'Total messages parsed & scanned',
  },
  {
    id: 'threats-detected',
    label: 'Threats Detected',
    targetValue: 3421,
    icon: ShieldAlert,
    color: 'text-red-400',
    borderGlow: 'hover:border-red-500/50 hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]',
    description: 'Zero-day attacks neutralized',
  },
  {
    id: 'phishing-emails',
    label: 'Phishing Emails',
    targetValue: 2180,
    icon: Activity,
    color: 'text-amber-400',
    borderGlow: 'hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]',
    description: 'Credential harvesting lures',
  },
  {
    id: 'suspicious-links',
    label: 'Suspicious Links',
    targetValue: 5749,
    icon: Link2,
    color: 'text-purple-400',
    borderGlow: 'hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]',
    description: 'Defanged malicious URLs blocked',
  },
  {
    id: 'safe-emails',
    label: 'Safe Emails Verified',
    targetValue: 11471,
    icon: ShieldCheck,
    color: 'text-emerald-400',
    borderGlow: 'hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]',
    description: 'Cryptographically authenticated',
  },
];

export function AnimatedStatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({
    'emails-analyzed': 0,
    'threats-detected': 0,
    'phishing-emails': 0,
    'suspicious-links': 0,
    'safe-emails': 0,
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1800; // ms
    const startTime = performance.now();

    const animateCounters = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const nextCounts: Record<string, number> = {};
      STATS_DATA.forEach((item) => {
        nextCounts[item.id] = Math.floor(item.targetValue * easeProgress);
      });

      setCounts(nextCounts);

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };

    requestAnimationFrame(animateCounters);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="w-full py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            TELEMETRY METRICS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Threat Landscape Statistics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
            Real-time aggregate detection telemetry across enterprise mail gateways
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {STATS_DATA.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 transition-all duration-300 hover:-translate-y-1 ${item.borderGlow} group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
                </div>

                <div className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
                  {(counts[item.id] || 0).toLocaleString()}
                </div>

                <div className="text-xs font-semibold text-slate-200 mt-1">
                  {item.label}
                </div>

                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

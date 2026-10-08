import { useEffect, useState, useRef } from 'react';
import { ShieldCheck, TrendingUp, Users, Zap } from 'lucide-react';

interface StatItem {
  label: string;
  sublabel: string;
  targetValue: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  icon: any;
  color: string;
}

const STATS: StatItem[] = [
  {
    label: 'Global Losses Cataloged',
    sublabel: 'Financial damages mapped across major fraud vectors',
    targetValue: 4.2,
    decimals: 1,
    prefix: '$',
    suffix: 'B+',
    icon: TrendingUp,
    color: 'text-amber-400',
  },
  {
    label: 'Phishing Signature Accuracy',
    sublabel: 'AI-assisted detection and heuristic validation rate',
    targetValue: 99.8,
    decimals: 1,
    suffix: '%',
    icon: ShieldCheck,
    color: 'text-cyan-400',
  },
  {
    label: 'Simulated Alerts Processed',
    sublabel: 'Daily telemetry vectors intercepted and categorized',
    targetValue: 340,
    decimals: 0,
    suffix: 'K+',
    icon: Zap,
    color: 'text-emerald-400',
  },
  {
    label: 'Educated Community Citizens',
    sublabel: 'Individuals trained on zero-trust scam resistance',
    targetValue: 1.2,
    decimals: 1,
    suffix: 'M+',
    icon: Users,
    color: 'text-blue-400',
  },
];

export function StatsCounter() {
  const [counts, setCounts] = useState<number[]>(STATS.map(() => 0));
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const duration = 1800;
          const startTime = performance.now();

          const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            setCounts(STATS.map((s) => s.targetValue * ease));

            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="py-12 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            const formatted =
              (stat.prefix || '') +
              counts[idx].toFixed(stat.decimals || 0) +
              stat.suffix;

            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden space-y-3 group hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    METRIC // 0{idx + 1}
                  </span>
                  <div className={`w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${stat.color} font-mono`}>
                    {formatted}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {stat.label}
                  </h4>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {stat.sublabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

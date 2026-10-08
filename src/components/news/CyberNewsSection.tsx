import { useState } from 'react';
import { 
  Newspaper, 
  Clock, 
  ExternalLink, 
  Tag, 
  ShieldAlert, 
  Flame, 
  Radio, 
  ChevronRight 
} from 'lucide-react';

interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  date: string;
  category: 'Zero-Day' | 'Phishing Alert' | 'BEC Fraud' | 'Malware Telemetry';
  severity: 'Critical' | 'High' | 'Notice';
  readTime: string;
  source: string;
}

const DEMO_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    headline: 'Adversary-in-the-Middle (AiTM) Phishing Surge Bypasses Legacy SMS Authentication',
    summary: 'Threat groups deploy automated reverse-proxy phishing kits (Evilginx3) to intercept session tokens and cookies in real-time, sidestepping single-factor password verifications.',
    date: 'Oct 07, 2026',
    category: 'Phishing Alert',
    severity: 'Critical',
    readTime: '3 min read',
    source: 'CyberShield SOC Wire (Demo)',
  },
  {
    id: 'news-2',
    headline: 'BEC Actors Deploy Synthetic Voice Clones Alongside Spoofed Wire Settlement Invoices',
    summary: 'Financially motivated syndicates increasingly blend synthetic AI voice messages with forged executive email accounts to execute rapid high-value wire diversion requests.',
    date: 'Oct 06, 2026',
    category: 'BEC Fraud',
    severity: 'Critical',
    readTime: '4 min read',
    source: 'Enterprise Fraud Intel (Demo)',
  },
  {
    id: 'news-3',
    headline: 'Quishing Vectors Surge 340% Across Enterprise Mailboxes Using Embedded Vector Graphics',
    summary: 'Attackers embed SVG and vector-based QR codes that bypass conventional OCR image filters, directing smartphone users to rogue credential harvesting landing pages.',
    date: 'Oct 05, 2026',
    category: 'Zero-Day',
    severity: 'High',
    readTime: '2 min read',
    source: 'Perimeter Defense Lab (Demo)',
  },
  {
    id: 'news-4',
    headline: 'Lumma Info-Stealer Campaign Disguised as Corporate Non-Disclosure Agreements (.pdf.scr)',
    summary: 'Security researchers observed an ongoing campaign utilizing deceptive double extensions to compromise developer credentials, Discord tokens, and crypto browser wallets.',
    date: 'Oct 04, 2026',
    category: 'Malware Telemetry',
    severity: 'High',
    readTime: '3 min read',
    source: 'Threat Vector Watch (Demo)',
  },
];

export function CyberNewsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredNews = DEMO_NEWS_ITEMS.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'text-red-400 bg-red-950/60 border-red-500/50';
      case 'High':
        return 'text-orange-400 bg-orange-950/60 border-orange-500/50';
      default:
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/50';
    }
  };

  return (
    <section id="cyber-news" className="w-full py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              CYBER OPERATIONS NEWS WIRE
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Cybersecurity Threat Intelligence News
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Curated intelligence briefings on zero-day vectors, malware payloads, and global email phishing trends.
            </p>
          </div>

          {/* Prominent Demo Disclaimer Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[11px] font-mono text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>SIMULATED CONTENT (DEMO SOC DISPATCHES)</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 text-xs font-mono">
          {['All', 'Zero-Day', 'Phishing Alert', 'BEC Fraud', 'Malware Telemetry'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/90 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getSeverityStyle(item.severity)}`}>
                      {item.severity}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.readTime}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-2">
                  {item.headline}
                </h3>

                <p className="text-xs text-slate-300/90 leading-relaxed mb-4">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="truncate">{item.source} &bull; {item.date}</span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0 font-bold">
                  Read Dispatch <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

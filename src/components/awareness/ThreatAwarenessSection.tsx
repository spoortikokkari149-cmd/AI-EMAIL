import { useState } from 'react';
import { 
  ShieldAlert, 
  Key, 
  ShoppingBag, 
  TrendingDown, 
  Link2, 
  UserX, 
  Briefcase, 
  FileWarning, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface ThreatAwarenessItem {
  id: string;
  title: string;
  warningLevel: 'Critical' | 'High' | 'Medium';
  category: string;
  icon: typeof ShieldAlert;
  color: string;
  neonBorder: string;
  summary: string;
  tactics: string[];
  preventionTips: string[];
}

const THREAT_AWARENESS_CARDS: ThreatAwarenessItem[] = [
  {
    id: 'phishing',
    title: 'Phishing Campaigns',
    warningLevel: 'Critical',
    category: 'Credential Harvesting',
    icon: ShieldAlert,
    color: 'text-red-400',
    neonBorder: 'border-red-500/40 hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]',
    summary: 'Deceptive emails impersonating Microsoft 365, Google, banks, or delivery services directing victims to cloned credential harvesting portals.',
    tactics: ['Urgent account suspension threats', 'Lookalike login URLs', 'Masked sender display names'],
    preventionTips: [
      'Inspect destination domain carefully before typing passwords',
      'Never trust email display names without verifying sender address',
      'Deploy hardware FIDO2 / WebAuthn MFA keys resistant to phishing',
    ],
  },
  {
    id: 'otp-fraud',
    title: 'OTP & 2FA Fraud',
    warningLevel: 'Critical',
    category: 'Authentication Bypass',
    icon: Key,
    color: 'text-amber-400',
    neonBorder: 'border-amber-500/40 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    summary: 'Adversaries trick users into relaying One-Time Passwords or approve push notifications via fake SMS/email account validation prompts.',
    tactics: ['Urgent SIM swap or banking alerts', 'Adversary-in-the-Middle (AiTM) proxies', 'Social engineering telephone follow-up'],
    preventionTips: [
      'No reputable financial or IT staff will EVER request your OTP',
      'Check URL domain bar before submitting any verification digits',
      'Switch from SMS OTP to authenticator apps or Passkeys',
    ],
  },
  {
    id: 'fake-shopping',
    title: 'Fake Shopping & Lures',
    warningLevel: 'Medium',
    category: 'E-Commerce Scams',
    icon: ShoppingBag,
    color: 'text-sky-400',
    neonBorder: 'border-sky-500/40 hover:border-sky-500 hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]',
    summary: 'Bogus receipts and package tracking notifications (Amazon, FedEx, DHL) containing fake discount portals designed to steal credit card data.',
    tactics: ['Counterfeit invoice receipts', 'Package customs fee notices', 'Excessive unrealistic discounts'],
    preventionTips: [
      'Check tracking numbers directly on official courier website',
      'Look for missing order records in your actual account portal',
      'Never input card numbers into unfamiliar checkout interfaces',
    ],
  },
  {
    id: 'investment-scam',
    title: 'Investment & Crypto Scams',
    warningLevel: 'High',
    category: 'Financial Fraud',
    icon: TrendingDown,
    color: 'text-purple-400',
    neonBorder: 'border-purple-500/40 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
    summary: 'Unsolicited opportunities promising guaranteed cryptocurrency returns, forex automation, or fake stock pre-IPO access.',
    tactics: ['High pressure guaranteed returns', 'Fabricated trading dashboard balances', 'Demands for withdrawal fee upfront'],
    preventionTips: [
      'Legitimate brokers never solicit through blind unsolicited emails',
      'Check regulatory registration on SEC / CFTC / FCA registries',
      'Be extremely skeptical of guaranteed yields exceeding market rates',
    ],
  },
  {
    id: 'malicious-links',
    title: 'Malicious Hyperlinks',
    warningLevel: 'Critical',
    category: 'Drive-by Downloads',
    icon: Link2,
    color: 'text-cyan-400',
    neonBorder: 'border-cyan-500/40 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]',
    summary: 'Links pointing to zero-day browser exploit kits, URL shorteners masking bad destinations, or malicious JavaScript redirect chains.',
    tactics: ['Anchor text mismatch (display text differs from href)', 'Open redirect abuse on reputable domains', 'URL shorteners (bit.ly, tinyurl)'],
    preventionTips: [
      'Hover over every hyperlink to preview target domain',
      'Always defang or inspect untrusted links through a sandbox',
      'Enable browser endpoint sandboxing and DNS sinkholing',
    ],
  },
  {
    id: 'email-spoofing',
    title: 'Email Header Spoofing',
    warningLevel: 'High',
    category: 'Identity Forgery',
    icon: UserX,
    color: 'text-rose-400',
    neonBorder: 'border-rose-500/40 hover:border-rose-500 hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]',
    summary: 'Exploitation of SMTP server weaknesses without strict DMARC/SPF/DKIM enforcement to forge legitimate sender domain addresses.',
    tactics: ['Return-Path envelope divergence', 'Missing DKIM cryptographic signature', 'Permissive DMARC p=none policy'],
    preventionTips: [
      'Enforce DMARC policy with p=reject on all corporate domains',
      'Inspect Authentication-Results header lines for SPF/DKIM flags',
      'Configure email gateways to quarantine mismatched envelope senders',
    ],
  },
  {
    id: 'bec',
    title: 'Business Email Compromise',
    warningLevel: 'Critical',
    category: 'CEO Fraud / Wire Theft',
    icon: Briefcase,
    color: 'text-orange-400',
    neonBorder: 'border-orange-500/40 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]',
    summary: 'Executive impersonation pressuring accounting staff to divert wire payments or change vendor bank routing numbers urgently.',
    tactics: ['Confidential acquisition cover story', 'Discrepant Reply-To destination', 'Strict prohibition against phone verification'],
    preventionTips: [
      'Mandate out-of-band dual authorization (phone/voice) for wire transfers',
      'Flag all external emails containing keywords "wire", "urgent", "confidential"',
      'Establish strict formal approval chains for vendor account revisions',
    ],
  },
  {
    id: 'malware-attachments',
    title: 'Malware & Trojan Delivery',
    warningLevel: 'Critical',
    category: 'Payload Execution',
    icon: FileWarning,
    color: 'text-indigo-400',
    neonBorder: 'border-indigo-500/40 hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]',
    summary: 'Masqueraded files (.pdf.scr, .iso, .zip, macro-enabled .docm) delivering ransomware, info-stealers (RedLine, Lumma), and backdoors.',
    tactics: ['Double extension trick (invoice.pdf.exe)', 'Password-protected archives to bypass AV scans', 'OneNote or LNK shortcut droppers'],
    preventionTips: [
      'Never enable macros on downloaded Office documents',
      'Block executable and container formats (.scr, .iso, .vbs) at firewall',
      'Detonate unknown attachments inside an isolated cloud sandbox',
    ],
  },
];

export function ThreatAwarenessSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getWarningBadge = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-950/70 border-red-500/50 text-red-400';
      case 'High':
        return 'bg-orange-950/70 border-orange-500/50 text-orange-400';
      default:
        return 'bg-amber-950/70 border-amber-500/50 text-amber-400';
    }
  };

  return (
    <section id="threat-intelligence" className="w-full py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            CYBERSHIELD THREAT DIRECTORY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cyber Threat Awareness Matrix
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl mx-auto">
            Deep forensic breakdown of the most dangerous email threat vectors, attacker evasion techniques, and enterprise defense countermeasures.
          </p>
        </div>

        {/* 3D Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {THREAT_AWARENESS_CARDS.map((card) => {
            const Icon = card.icon;
            const isExpanded = expandedId === card.id;

            return (
              <div
                key={card.id}
                className={`rounded-2xl bg-slate-900/60 backdrop-blur-xl border transition-all duration-300 flex flex-col p-5 group ${card.neonBorder}`}
              >
                {/* Card Top */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${getWarningBadge(card.warningLevel)}`}>
                    {card.warningLevel}
                  </span>
                </div>

                {/* Title & Category */}
                <div className="mb-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    {card.category}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h3>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-300/90 leading-relaxed mb-4 flex-1">
                  {card.summary}
                </p>

                {/* Attacker Tactics Mini List */}
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 text-[11px] font-mono text-slate-400">
                  <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
                    Typical Modus Operandi:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {card.tactics.slice(0, 2).map((t, idx) => (
                      <li key={idx} className="truncate">{t}</li>
                    ))}
                  </ul>
                </div>

                {/* Expand Prevention Tips */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800 space-y-2 text-xs animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] font-bold">
                      <Lightbulb className="w-3.5 h-3.5" />
                      PREVENTION COUNTERMEASURES
                    </div>
                    <ul className="space-y-1.5 text-slate-300">
                      {card.preventionTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : card.id)}
                  className="mt-3 pt-2 border-t border-slate-800/80 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center justify-between w-full cursor-pointer transition-colors"
                >
                  <span>{isExpanded ? 'Hide Prevention Guide' : 'View Prevention Tips'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

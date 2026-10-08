import { useState } from 'react';
import { 
  Key, 
  ShoppingBag, 
  TrendingUp, 
  HelpCircle, 
  HeartHandshake, 
  MailWarning, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight, 
  X,
  Eye,
  CheckCircle2,
  Lock
} from 'lucide-react';

export interface ScamItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  riskTier: 'Critical' | 'High' | 'Severe';
  colorClass: string;
  borderClass: string;
  glowClass: string;
  triggers: string[];
  victimQuotes: string[];
  defenseStrategy: string;
  stats: string;
  description: string;
}

export const SCAM_DATABASE: ScamItem[] = [
  {
    id: 'phishing',
    title: 'Phishing & Spear-Phishing',
    subtitle: 'Credential Harvesting & Deceptive Portals',
    icon: MailWarning,
    riskTier: 'Critical',
    colorClass: 'text-red-400',
    borderClass: 'border-red-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(239,68,68,0.2)]',
    triggers: ['Urgent Account Suspension', 'Unauthorized Sign-In Warning', 'Payroll Verification'],
    victimQuotes: [
      '"Your Microsoft 365 license will expire in 2 hours. Click to verify your password."',
      '"We noticed an unusual charge of $842 on your account. Log in here to dispute."',
    ],
    defenseStrategy: 'Never click email links to authenticate. Always navigate independently via bookmarks or the official mobile app.',
    stats: 'Over 3.4 billion phishing emails sent daily worldwide.',
    description: 'Fraudulent emails, texts, and websites precisely styled to resemble trusted companies, tricking victims into typing passwords and SSNs.',
  },
  {
    id: 'otp-fraud',
    title: 'OTP & 2FA Interception',
    subtitle: 'Live Voice & Social Engineering Extortion',
    icon: Key,
    riskTier: 'Critical',
    colorClass: 'text-orange-400',
    borderClass: 'border-orange-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(249,115,22,0.2)]',
    triggers: ['Bank Fraud Department Impersonation', 'Urgent Wire Block Assistance'],
    victimQuotes: [
      '"Hello, this is Bank Fraud Prevention. We stopped a $1,200 wire. Please read back the 6-digit code we just sent to your phone to reverse the transaction."',
    ],
    defenseStrategy: 'Banks and service providers will NEVER call to ask for your One-Time Password. Treat OTPs like your ATM PIN — never read them aloud.',
    stats: 'Responsible for 44% of account takeover incidents in 2025.',
    description: 'Attackers initiate a password reset or funds transfer, then phone the victim pretending to be security support to coax out the 2FA code.',
  },
  {
    id: 'fake-shops',
    title: 'Fake E-Commerce & Clone Portals',
    subtitle: 'Ghost Webstores & Payment Sniffers',
    icon: ShoppingBag,
    riskTier: 'High',
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    triggers: ['90% Liquidation Sale Ads', 'Limited Inventory Rush', 'Wire/Zelle Only Checkout'],
    victimQuotes: [
      '"Special Warehouse Clearance! Premium Noise-Cancelling Headphones now only $29 (was $350) for the next 15 minutes only!"',
    ],
    defenseStrategy: 'Verify domain WHOIS registration age (newly registered domains under 60 days are high risk). Check for legitimate payment methods like credit cards.',
    stats: 'Over 78,000 clone stores established during holiday peak seasons.',
    description: 'Cloned webstores hosted on disposable domains that collect credit card details without ever shipping physical merchandise.',
  },
  {
    id: 'crypto-ponzi',
    title: 'Crypto & Investment Schemes',
    subtitle: 'Fake Trading Bots & Pig Butchering',
    icon: TrendingUp,
    riskTier: 'Severe',
    colorClass: 'text-purple-400',
    borderClass: 'border-purple-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(168,85,247,0.2)]',
    triggers: ['Guaranteed 15% Daily Yield', 'Exclusive Insider Telegram Channel', 'Fake Trading Dashboard'],
    victimQuotes: [
      '"My mentor introduced me to an algorithmic AI trading platform that doubled my deposit in 48 hours. Deposit $1,000 to unlock tier 1 profits."',
    ],
    defenseStrategy: 'Any platform promising guaranteed returns with zero downside is mathematically fraudulent. If a platform demands tax payments to withdraw, it is a scam.',
    stats: 'Billions stolen yearly via "Pig Butchering" (Sha Zhu Pan) schemes.',
    description: 'Sophisticated syndicates create realistic web dashboards displaying fake trading gains, encouraging larger deposits before disappearing with funds.',
  },
  {
    id: 'tech-support',
    title: 'Tech Support & Remote Access',
    subtitle: 'Screen-Lock Trojans & AnyDesk Scams',
    icon: HelpCircle,
    riskTier: 'High',
    colorClass: 'text-blue-400',
    borderClass: 'border-blue-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(59,130,246,0.2)]',
    triggers: ['Beeping Red Browser Warning', 'Call Microsoft Hotline Immediately', 'Fake Refund Overpayment'],
    victimQuotes: [
      '"CRITICAL ALERT: Trojan virus detected on Windows kernel! Do not turn off your PC. Call 1-800-XXX-XXXX immediately to prevent data wipe."',
    ],
    defenseStrategy: 'Operating systems never include phone numbers on crash screens. Never grant remote desktop access (AnyDesk, TeamViewer) to unsolicited callers.',
    stats: 'Disproportionately targets senior citizens and small business offices.',
    description: 'Pop-ups freeze browser tabs and prompt calls to fake call centers. Callers manipulate browser developer tools to fake bank balance discrepancies.',
  },
  {
    id: 'romance-scam',
    title: 'Romance & Social Grooming',
    subtitle: 'Emotional Coercion & Emergency Wire Demands',
    icon: HeartHandshake,
    riskTier: 'Severe',
    colorClass: 'text-pink-400',
    borderClass: 'border-pink-500/40',
    glowClass: 'shadow-[0_0_30px_rgba(236,72,153,0.2)]',
    triggers: ['Rapid Love Bombing', 'Sudden Travel / Medical Crisis', 'Inability to Video Call'],
    victimQuotes: [
      '"I am an engineer working on an offshore oil rig. Customs seized my equipment and I need $4,500 wire transfer to release my shipment so I can fly to visit you."',
    ],
    defenseStrategy: 'Perform reverse image searches on profile pictures. Never send wire transfers, gift cards, or crypto to someone you have never met in person.',
    stats: 'Average victim loss exceeds $14,000 per romance fraud report.',
    description: 'Perpetrators spend months establishing emotional intimacy online before manufacturing high-stakes financial emergencies.',
  },
];

export function ScamCardsSection() {
  const [activeScam, setActiveScam] = useState<ScamItem | null>(null);

  return (
    <section id="scams" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <AlertTriangle className="w-3.5 h-3.5" />
            Threat Anatomy & Attack Signatures
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Recognize The 6 Most Common Online Scam Patterns
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Cybercriminals exploit human psychology through urgency, fear, greed, and authority. Hover to inspect 3D layers and click to view forensic breakdowns.
          </p>
        </div>

        {/* 3D Cards Grid with Perspective */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCAM_DATABASE.map((scam) => {
            const IconComponent = scam.icon;
            return (
              <div
                key={scam.id}
                onClick={() => setActiveScam(scam)}
                className={`group relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border ${scam.borderClass} p-6 transition-all duration-300 hover:-translate-y-2 hover:${scam.glowClass} cursor-pointer flex flex-col justify-between overflow-hidden`}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 3D Accent Corner Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-slate-950/80 border ${scam.borderClass} flex items-center justify-center ${scam.colorClass} shadow-lg group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${scam.borderClass} ${scam.colorClass} bg-slate-950/70`}>
                      {scam.riskTier} Risk
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {scam.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      {scam.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-3">
                    {scam.description}
                  </p>

                  {/* Primary Trigger Words */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">
                      Common Psychological Triggers:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {scam.triggers.map((trig, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300"
                        >
                          {trig}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Scam Anatomy
                  </span>
                  <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D Interactive Detail Modal */}
      {activeScam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-2xl rounded-2xl bg-slate-900 border ${activeScam.borderClass} p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-5 animate-in fade-in zoom-in-95 duration-200`}>
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-slate-950 border ${activeScam.borderClass} flex items-center justify-center ${activeScam.colorClass}`}>
                  <activeScam.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">
                      {activeScam.title}
                    </h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${activeScam.borderClass} ${activeScam.colorClass}`}>
                      {activeScam.riskTier}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    {activeScam.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveScam(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <strong className="text-white block mb-1">Threat Overview:</strong>
                <p>{activeScam.description}</p>
              </div>

              {/* Real World Phrases */}
              <div className="space-y-1.5">
                <strong className="font-mono text-slate-400 uppercase tracking-wider text-[11px] block">
                  Authentic Bait Phrases Used by Scammers:
                </strong>
                <div className="space-y-1.5 font-mono">
                  {activeScam.victimQuotes.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 text-red-200/90 text-xs italic"
                    >
                      {q}
                    </div>
                  ))}
                </div>
              </div>

              {/* Golden Prevention Rule */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-cyan-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-cyan-300 font-mono">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Golden Prevention Protocol</span>
                </div>
                <p className="text-xs leading-relaxed">
                  {activeScam.defenseStrategy}
                </p>
              </div>

              {/* Statistical Impact */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                <span>Global Threat Metric:</span>
                <span className="text-white font-bold">{activeScam.stats}</span>
              </div>
            </div>

            {/* Modal Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveScam(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

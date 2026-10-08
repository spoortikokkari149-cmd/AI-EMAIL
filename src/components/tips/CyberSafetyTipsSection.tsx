import { useState } from 'react';
import { 
  UserCheck, 
  Link2, 
  KeyRound, 
  FileCheck2, 
  SpellCheck, 
  ShieldCheck, 
  Check, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface SafetyTip {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof UserCheck;
  color: string;
  tag: string;
  description: string;
  actionItems: string[];
}

const SAFETY_TIPS: SafetyTip[] = [
  {
    id: 'verify-sender',
    title: 'Verify Sender Identity',
    subtitle: 'Look beyond the visible display name',
    icon: UserCheck,
    color: 'text-cyan-400',
    tag: 'Identity Defense',
    description: 'Attackers frequently forge display names (e.g., "Microsoft Support") while sending from disposable or compromised freemail accounts.',
    actionItems: [
      'Expand sender details to inspect the actual email address in angle brackets',
      'Verify domain matches official corporate website (no extra characters)',
      'Check if Return-Path matches the visible From header',
    ],
  },
  {
    id: 'check-links',
    title: 'Audit Suspicious Links',
    subtitle: 'Never click uninspected URLs',
    icon: Link2,
    color: 'text-blue-400',
    tag: 'Link Hardening',
    description: 'Deceptive hyperlinks often display reputable anchor text while routing to external phishing kits or malicious redirectors.',
    actionItems: [
      'Hover over every button/link to inspect the true destination URL in status bar',
      'Look out for deceptive subdomains (e.g., paypal.com.attacker-login.xyz)',
      'Manually navigate to official websites instead of clicking email links',
    ],
  },
  {
    id: 'never-share-otp',
    title: 'Never Disclose OTPs',
    subtitle: 'One-Time Passwords are confidential',
    icon: KeyRound,
    color: 'text-amber-400',
    tag: 'Credential Guard',
    description: 'Legitimate service representatives, IT engineers, and bank managers will NEVER ask you to disclose verification codes.',
    actionItems: [
      'Regard any request for your SMS/Email verification code as hostile fraud',
      'Be cautious of urgent phone calls claiming your account was compromised',
      'Report unauthorized OTP delivery immediately to service providers',
    ],
  },
  {
    id: 'inspect-attachments',
    title: 'Inspect Attachments',
    subtitle: 'Treat all downloaded files with caution',
    icon: FileCheck2,
    color: 'text-purple-400',
    tag: 'Payload Prevention',
    description: 'Malware often masquerades as mundane documents, invoices, resumes, or shipping manifests with double file extensions.',
    actionItems: [
      'Beware of files ending with .scr, .iso, .vbs, .exe, or .docm macros',
      'Never enable macros or click "Enable Content" on downloaded Office files',
      'Scan all unsolicited files with antivirus or cloud sandboxes before opening',
    ],
  },
  {
    id: 'domain-spelling',
    title: 'Examine Domain Spelling',
    subtitle: 'Watch out for typosquatting tricks',
    icon: SpellCheck,
    color: 'text-emerald-400',
    tag: 'Anti-Typosquatting',
    description: 'Adversaries register subtle character swaps (micros0ft.com, goog1e.com, rn vs m) that look identical at quick glance.',
    actionItems: [
      'Carefully inspect every character in the sending and linking domain names',
      'Beware of homoglyph Unicode characters designed to deceive visual reading',
      'Bookmark critical banking and corporate sign-in portals',
    ],
  },
  {
    id: 'enable-mfa',
    title: 'Enable Multi-Factor Auth',
    subtitle: 'Enforce strong zero-trust login barriers',
    icon: ShieldCheck,
    color: 'text-rose-400',
    tag: 'Account Hardening',
    description: 'Even if credentials are compromised in a phishing leak, strong MFA (Authenticator App / FIDO2 Passkey) prevents account takeover.',
    actionItems: [
      'Activate App-based MFA (Google Authenticator, Microsoft Authenticator) or Passkeys',
      'Avoid relying solely on SMS text verification where possible',
      'Store backup recovery codes in a secure offline vault',
    ],
  },
];

export function CyberSafetyTipsSection() {
  const [checkedTips, setCheckedTips] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedTips(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="safety-tips" className="w-full py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            ZERO-TRUST HYGIENE GUIDELINES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cyber Safety & Threat Prevention Tips
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl mx-auto">
            Essential defensive security habits to protect organizational mailboxes and personal accounts against sophisticated social engineering.
          </p>
        </div>

        {/* Grid with 3D tilt style cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAFETY_TIPS.map((tip) => {
            const Icon = tip.icon;
            const isAcknowledged = !!checkedTips[tip.id];

            return (
              <div
                key={tip.id}
                className={`p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.18)] transition-all duration-300 flex flex-col group ${
                  isAcknowledged ? 'bg-cyan-950/20 border-cyan-500/40' : ''
                }`}
              >
                {/* Top icon & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform ${tip.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                    {tip.tag}
                  </span>
                </div>

                {/* Title & subtitle */}
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {tip.title}
                </h3>
                <p className="text-xs text-cyan-400/80 font-mono mb-3">
                  {tip.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-300/90 leading-relaxed mb-4">
                  {tip.description}
                </p>

                {/* Action Checklist */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 mb-4 flex-1">
                  <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Recommended Defense Protocol:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {tip.actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mark as understood button */}
                <button
                  type="button"
                  onClick={() => toggleCheck(tip.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    isAcknowledged
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${isAcknowledged ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{isAcknowledged ? 'Defense Habit Acknowledged' : 'Mark Practice as Reviewed'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

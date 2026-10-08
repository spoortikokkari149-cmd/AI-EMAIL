import { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Smartphone, 
  Eye, 
  HardDrive, 
  CreditCard, 
  FileCheck, 
  Sparkles,
  Trophy
} from 'lucide-react';

interface SafetyHabit {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  difficulty: 'Essential' | 'Advanced' | 'Master';
  description: string;
  proTip: string;
}

const SAFETY_HABITS: SafetyHabit[] = [
  {
    id: 'passkeys',
    title: 'Adopt Passkeys & FIDO2 Security Keys',
    subtitle: 'Eliminate Phishable Password Vulnerabilities',
    icon: Lock,
    difficulty: 'Essential',
    description: 'Passkeys utilize cryptographic public-key cryptography bound to your device hardware. Even if you land on a cloned phishing site, the browser refuses to leak credentials.',
    proTip: 'Enable passkeys on Google, Apple, and Microsoft accounts first.',
  },
  {
    id: 'callback',
    title: 'The Out-of-Band Callback Rule',
    subtitle: 'Neutralize Voice Impersonation & Caller Spoofing',
    icon: Smartphone,
    difficulty: 'Essential',
    description: 'If anyone calls claiming to be from your bank, police, or tech support, immediately hang up. Look up the verified phone number on your bank card or statement and dial them back.',
    proTip: 'Incoming caller ID can be spoofed in under 10 seconds using VoIP tools.',
  },
  {
    id: 'credit-freeze',
    title: 'Freeze Your Credit Files',
    subtitle: 'Stop Identity Theft Before It Starts',
    icon: FileCheck,
    difficulty: 'Advanced',
    description: 'Freezing your credit with major credit bureaus (Equifax, Experian, TransUnion) blocks scammers from opening loans or credit lines in your name, even if they possess your SSN.',
    proTip: 'Credit freezes are 100% free by law and can be thawed temporarily when needed.',
  },
  {
    id: 'virtual-cards',
    title: 'Deploy Virtual Single-Use Cards',
    subtitle: 'Isolate Risk on E-Commerce Platforms',
    icon: CreditCard,
    difficulty: 'Advanced',
    description: 'Use burner or merchant-locked virtual card numbers with preset spend limits for unfamiliar online merchants. If the shop is compromised, the card cannot be drained.',
    proTip: 'Many modern banks and services like Privacy.com offer free virtual cards.',
  },
  {
    id: 'backups',
    title: 'Air-Gapped 3-2-1 Backups',
    subtitle: 'Absolute Immunity Against Ransomware Extortion',
    icon: HardDrive,
    difficulty: 'Master',
    description: 'Maintain 3 copies of vital data on 2 different media types, with at least 1 copy stored offline (air-gapped disconnected hard drive or immutable cloud storage).',
    proTip: 'Ransomware often scans local network shares to encrypt connected drives.',
  },
  {
    id: 'url-inspection',
    title: 'Examine URL Anatomy & Domain Roots',
    subtitle: 'Spot Subdomain Masquerades Instantly',
    icon: Eye,
    difficulty: 'Essential',
    description: 'Attackers create deceptive subdomains like "paypal.com.account-verify.xyz". The real domain is always the string immediately preceding the final slash or dot.',
    proTip: 'Never trust logos or look; trust only the exact top-level domain.',
  },
];

export function SafetyTipsGrid() {
  const [checkedHabits, setCheckedHabits] = useState<Record<string, boolean>>({
    passkeys: true,
    callback: true,
  });

  const toggleHabit = (id: string) => {
    setCheckedHabits((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(checkedHabits).filter(Boolean).length;
  const scorePercent = Math.round((completedCount / SAFETY_HABITS.length) * 100);

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'ARMORED FORTRESS', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' };
    if (score >= 50) return { label: 'DEFENDED CITADEL', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40' };
    return { label: 'VULNERABLE PERIMETER', color: 'text-amber-400 border-amber-500/40 bg-amber-950/40' };
  };

  const badge = getScoreBadge(scorePercent);

  return (
    <section id="safety" className="py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cyber Defense Habits
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Essential Protocols To Safeguard Your Digital Presence
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive armor checklist. Check off the security habits you practice to calculate your live CyberShield rating.
            </p>
          </div>

          {/* Interactive Score Calculator Meter */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl flex items-center gap-4 shadow-xl">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-800"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-cyan-400 transition-all duration-700 ease-out"
                  strokeWidth="3.5"
                  strokeDasharray={`${scorePercent}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-white">
                {scorePercent}%
              </div>
            </div>

            <div className="space-y-1 font-mono text-xs">
              <span className="text-[10px] text-slate-500 uppercase block">Personal Armor Rating</span>
              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${badge.color}`}>
                {badge.label}
              </span>
              <div className="text-[11px] text-slate-400">
                {completedCount} of {SAFETY_HABITS.length} habits active
              </div>
            </div>
          </div>
        </div>

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAFETY_HABITS.map((habit) => {
            const Icon = habit.icon;
            const isChecked = !!checkedHabits[habit.id];

            return (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between select-none ${
                  isChecked
                    ? 'bg-slate-900/80 border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isChecked ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900 text-slate-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {habit.difficulty}
                      </span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-transparent'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-base font-bold transition-colors ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                      {habit.title}
                    </h3>
                    <p className="text-xs font-mono text-cyan-400/80 mt-0.5">
                      {habit.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300/80 leading-relaxed">
                    {habit.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  <strong className="text-cyan-300">Pro-Tip:</strong> {habit.proTip}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

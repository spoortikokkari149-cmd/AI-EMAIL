import React, { useState } from 'react';
import { 
  History, 
  Mail, 
  MessageSquare, 
  Camera, 
  Link2, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Eye, 
  X, 
  Terminal, 
  Calendar,
  Filter
} from 'lucide-react';
import type { ThreatHistoryItem, ThreatHistoryType } from '../../types/threat';

interface ThreatHistorySectionProps {
  realHistoryItems: ThreatHistoryItem[];
  onInspectItem?: (item: ThreatHistoryItem) => void;
}

const DEMO_SEEDED_HISTORY: ThreatHistoryItem[] = [
  {
    id: 'th-1',
    date: 'Oct 08, 2026 10:14 AM',
    type: 'Email',
    title: 'Urgent M365 Password Expiration Alert',
    category: 'Credential Phishing',
    riskScore: 94,
    threatLevel: 'Critical',
    status: 'Blocked',
    summary: 'Sender From domain diverged from Return-Path. Contained fake Microsoft login portal (office365-verify.click).',
  },
  {
    id: 'th-2',
    date: 'Oct 08, 2026 09:42 AM',
    type: 'Message',
    title: 'SBI NetBanking PAN KYC Disconnection SMS',
    category: 'Bank Smishing',
    riskScore: 92,
    threatLevel: 'Critical',
    status: 'Blocked',
    summary: 'SMS claimed immediate account termination unless victim submitted PAN KYC to rogue .xyz domain.',
  },
  {
    id: 'th-3',
    date: 'Oct 07, 2026 06:18 PM',
    type: 'Screenshot',
    title: 'WhatsApp VIP Crypto Arbitrage Chat Capture',
    category: 'Investment Scam',
    riskScore: 96,
    threatLevel: 'Critical',
    status: 'Quarantined',
    summary: 'Multimodal vision extracted text promising 400% weekly return with deposit to unauthorized Bitcoin wallet.',
  },
  {
    id: 'th-4',
    date: 'Oct 07, 2026 03:22 PM',
    type: 'Email',
    title: 'Dependabot Security Advisory - GitHub Inc.',
    category: 'Legitimate Notice',
    riskScore: 6,
    threatLevel: 'Clean',
    status: 'Clean',
    summary: 'Cryptographically verified DKIM and SPF from smtp.github.com. All links lead to official github.com repo.',
  },
  {
    id: 'th-5',
    date: 'Oct 06, 2026 11:05 AM',
    type: 'URL',
    title: 'http://paypa1-security-check.click/login',
    category: 'Deceptive Lookalike Domain',
    riskScore: 89,
    threatLevel: 'High',
    status: 'Flagged',
    summary: 'Typosquatting detected (digit 1 replaces letter l). Hosted on disposable Cloudflare tunnel.',
  },
  {
    id: 'th-6',
    date: 'Oct 06, 2026 08:30 AM',
    type: 'Message',
    title: 'FedEx Parcel Delivery Fee Redirection Notice',
    category: 'Courier Smishing',
    riskScore: 85,
    threatLevel: 'High',
    status: 'Blocked',
    summary: 'Demanded $2.49 redelivery fee. Captured full credit card number and CVV on phishing landing mirror.',
  },
];

export function ThreatHistorySection({ realHistoryItems, onInspectItem }: ThreatHistorySectionProps) {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [useDemoMode, setUseDemoMode] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState<ThreatHistoryItem | null>(null);

  // Combine real items and demo items if demo mode is active
  const allItems = useDemoMode 
    ? [...realHistoryItems, ...DEMO_SEEDED_HISTORY]
    : realHistoryItems;

  const filteredItems = allItems.filter(item => {
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getTypeIcon = (type: ThreatHistoryType) => {
    switch (type) {
      case 'Email': return <Mail className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Message': return <MessageSquare className="w-3.5 h-3.5 text-sky-400" />;
      case 'Screenshot': return <Camera className="w-3.5 h-3.5 text-purple-400" />;
      default: return <Link2 className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Blocked':
        return 'bg-red-950/80 border-red-500/60 text-red-400 font-bold';
      case 'Quarantined':
        return 'bg-orange-950/80 border-orange-500/60 text-orange-400 font-bold';
      case 'Flagged':
        return 'bg-amber-950/80 border-amber-500/60 text-amber-400 font-semibold';
      default:
        return 'bg-emerald-950/80 border-emerald-500/60 text-emerald-400 font-semibold';
    }
  };

  return (
    <section id="threat-history" className="w-full py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              FORENSIC TELEMETRY ARCHIVE
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Threat History &amp; Audit Log
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Historical ledger of analyzed email files, SMS/Chat messages, and mobile screenshot captures.
            </p>
          </div>

          {/* Demo Mode Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Demo History Mode:</span>
            <button
              type="button"
              onClick={() => setUseDemoMode(!useDemoMode)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                useDemoMode
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {useDemoMode ? 'Demo Seeds ON' : 'Live Only'}
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threat logs by title or keyword..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs font-mono">
            <span className="text-slate-500 text-[11px] hidden lg:inline">Type:</span>
            {['All', 'Email', 'Message', 'Screenshot', 'URL'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  selectedType === t
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}

            <span className="text-slate-500 text-[11px] ml-2 hidden lg:inline">Status:</span>
            {['All', 'Blocked', 'Quarantined', 'Clean'].map(s => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  selectedStatus === s
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* History Table / Card Stream */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs font-mono">
              No historical incident telemetry found matching query.
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
                      {getTypeIcon(item.type)}
                      <span className="font-bold text-slate-200">{item.type}</span>
                    </span>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>

                    <span className="text-[11px] font-mono text-slate-500">
                      {item.date}
                    </span>

                    <span className="text-[11px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                      {item.category}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {item.summary}
                  </p>
                </div>

                {/* Score & View Button */}
                <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 border-slate-800 pt-2 md:pt-0 justify-between md:justify-end">
                  <div className="text-right font-mono">
                    <div className="text-[10px] text-slate-500 uppercase">Risk Score</div>
                    <div className={`text-base font-extrabold ${item.riskScore >= 70 ? 'text-red-400' : item.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {item.riskScore}%
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModalItem(item)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Details Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {getTypeIcon(activeModalItem.type)}
                <h3 className="text-base font-bold text-white">
                  Incident Forensics: {activeModalItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Category</span>
                <span className="text-slate-200 font-bold">{activeModalItem.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Risk Score</span>
                <span className="text-red-400 font-extrabold text-base">{activeModalItem.riskScore}%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                Forensic Analysis Summary:
              </span>
              <p>{activeModalItem.summary}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Close Audit Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

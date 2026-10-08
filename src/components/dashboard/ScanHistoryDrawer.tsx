import { useState } from 'react';
import { 
  X, 
  Search, 
  Trash2, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Filter, 
  ArrowRight,
  FileCode,
  FileText
} from 'lucide-react';
import type { EmailScanRecord } from '../../types/threat';

interface ScanHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scans: EmailScanRecord[];
  onSelectScan: (scan: EmailScanRecord) => void;
  onDeleteScan: (scanId: string) => Promise<void>;
}

export function ScanHistoryDrawer({
  isOpen,
  onClose,
  scans,
  onSelectScan,
  onDeleteScan,
}: ScanHistoryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredScans = scans.filter((s) => {
    const matchesSearch =
      s.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fileName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      levelFilter === 'All' || s.threatLevel === levelFilter;

    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this scan from database?')) return;
    setDeletingId(id);
    try {
      await onDeleteScan(id);
    } finally {
      setDeletingId(null);
    }
  };

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md h-full bg-[#070b14] border-l border-cyan-500/30 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Scan Telemetry Vault
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {scans.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject or sender..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
            {['All', 'Critical', 'High', 'Medium', 'Clean'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg border transition shrink-0 cursor-pointer ${
                  levelFilter === lvl
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {filteredScans.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <FileCode className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p>No historical scans found matching current filters.</p>
            </div>
          ) : (
            filteredScans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => {
                  onSelectScan(scan);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/40 transition cursor-pointer group space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getBadgeStyle(scan.threatLevel)}`}>
                    {scan.threatLevel} ({scan.riskScore}/100)
                  </span>

                  <button
                    onClick={(e) => handleDelete(e, scan.id)}
                    disabled={deletingId === scan.id}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 line-clamp-1">
                    {scan.subject || scan.fileName}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                    From: {scan.senderEmail || 'Unknown'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>{new Date(scan.createdAt).toLocaleDateString()} {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  Send, 
  ShieldAlert, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Building,
  DollarSign
} from 'lucide-react';

interface ScamReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScamReportModal({ isOpen, onClose }: ScamReportModalProps) {
  const [category, setCategory] = useState('Phishing & Fake Login');
  const [suspectIdentifier, setSuspectIdentifier] = useState('');
  const [lossAmount, setLossAmount] = useState('None ($0)');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedDocket, setSubmittedDocket] = useState<{
    id: string;
    timestamp: string;
    category: string;
    suspect: string;
    mitigationSteps: string[];
  } | null>(null);

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const docketId = `CS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const steps = [
        'If monetary credentials or card numbers were entered, notify your bank fraud division immediately to freeze transactions.',
        'Change passwords on all associated accounts from a clean, separate device and terminate all active sessions.',
        'File an official complaint with regulatory authorities (FTC.gov / IC3.gov or your regional fraud bureau).',
        'Place a temporary credit freeze with the major credit reporting agencies.',
      ];

      setSubmittedDocket({
        id: docketId,
        timestamp: new Date().toISOString(),
        category,
        suspect: suspectIdentifier || 'Unspecified',
        mitigationSteps: steps,
      });
      setIsSubmitting(false);
    }, 900);
  };

  const handleCopy = () => {
    if (!submittedDocket) return;
    const text = `CyberShield Incident Report Docket: ${submittedDocket.id}\nCategory: ${submittedDocket.category}\nSuspect: ${submittedDocket.suspect}\nTimestamp: ${submittedDocket.timestamp}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setSubmittedDocket(null);
    setSuspectIdentifier('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Simulate Scam Incident Report
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Educational Forensics & Triage Demo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedDocket ? (
          /* Confirmation Result Docket */
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-sm text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  INCIDENT DOCKET CREATED
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/30 text-white font-bold">
                  {submittedDocket.id}
                </span>
              </div>
              <p className="font-sans text-xs text-emerald-200/90 leading-relaxed">
                Your simulated report has been triaged. In a real incident, immediate action within the first 60 minutes is crucial.
              </p>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                Immediate Action Checklist:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300 font-sans">
                {submittedDocket.mitigationSteps.map((step, idx) => (
                  <li key={idx} className="leading-snug">
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Docket' : 'Copy Docket'}</span>
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold cursor-pointer"
              >
                Submit Another Demo
              </button>
            </div>
          </div>
        ) : (
          /* Report Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono uppercase text-[10px] mb-1">
                Scam Classification
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option>Phishing & Fake Login</option>
                <option>OTP / Bank Caller Fraud</option>
                <option>Crypto & High-Yield Investment</option>
                <option>Fake E-Commerce & Ghost Store</option>
                <option>Tech Support / Remote Access</option>
                <option>Romance & Emergency Wire Request</option>
                <option>Other Emerging Vector</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-mono uppercase text-[10px] mb-1">
                  Suspect Contact (URL, Phone, or Email)
                </label>
                <input
                  type="text"
                  required
                  value={suspectIdentifier}
                  onChange={(e) => setSuspectIdentifier(e.target.value)}
                  placeholder="e.g. hxxps://secure-verify.xyz or +1-800..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono uppercase text-[10px] mb-1">
                  Simulated Loss Range
                </label>
                <select
                  value={lossAmount}
                  onChange={(e) => setLossAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option>None ($0 - Prevented in time)</option>
                  <option>Under $500</option>
                  <option>$500 - $5,000</option>
                  <option>Over $5,000</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-mono uppercase text-[10px] mb-1">
                Incident Narrative / Details
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe how the contact initiated, what pretext was given, and what actions were requested..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:border-cyan-400 focus:outline-none resize-none font-sans"
              />
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-slate-400 text-[11px] font-mono leading-relaxed">
              <strong>Notice:</strong> This is an interactive educational simulation designed for awareness training. No real-world telemetry is transmitted to third parties.
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer font-mono"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold font-mono tracking-wider shadow-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Simulating Triage...' : 'Execute Triage Demo'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

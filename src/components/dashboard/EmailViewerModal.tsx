import { useState } from 'react';
import { 
  FileText, 
  Terminal, 
  Copy, 
  Check, 
  X, 
  Mail, 
  ShieldAlert, 
  Route 
} from 'lucide-react';
import type { ParsedEmlData } from '../../types/threat';

interface EmailViewerModalProps {
  parsed: ParsedEmlData;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'headers' | 'body' | 'hops';
}

export function EmailViewerModal({ 
  parsed, 
  isOpen, 
  onClose, 
  defaultTab = 'headers' 
}: EmailViewerModalProps) {
  const [activeTab, setActiveTab] = useState<'headers' | 'body' | 'hops'>(defaultTab);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyHeaders = () => {
    const rawHeaders = Object.entries(parsed.headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    navigator.clipboard.writeText(rawHeaders);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070b14]/90">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white line-clamp-1">
                {parsed.subject}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                File: {parsed.fileName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-4 px-6 pt-3 border-b border-slate-800 bg-slate-950/60 text-xs font-mono">
          <button
            onClick={() => setActiveTab('headers')}
            className={`pb-2.5 transition border-b-2 font-semibold cursor-pointer ${
              activeTab === 'headers'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            MIME Headers ({Object.keys(parsed.headers).length})
          </button>

          <button
            onClick={() => setActiveTab('body')}
            className={`pb-2.5 transition border-b-2 font-semibold cursor-pointer ${
              activeTab === 'body'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sanitized Body Preview
          </button>

          <button
            onClick={() => setActiveTab('hops')}
            className={`pb-2.5 transition border-b-2 font-semibold cursor-pointer ${
              activeTab === 'hops'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Received Hops ({parsed.receivedChain.length})
          </button>

          <div className="ml-auto pb-2">
            {activeTab === 'headers' && (
              <button
                onClick={handleCopyHeaders}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                <span>{copied ? 'Copied' : 'Copy Headers'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          {activeTab === 'headers' && (
            <div className="space-y-2">
              {Object.entries(parsed.headers).map(([key, val], idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <span className="font-bold text-cyan-400 block mb-0.5">{key}:</span>
                  <span className="text-slate-300 break-all">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'body' && (
            <div className="space-y-4 font-sans">
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Sanitized Sandbox Mode: Script execution, tracking pixels, and interactive forms are neutralized.</span>
              </div>

              {parsed.htmlText ? (
                <div className="p-4 rounded-xl bg-white text-slate-900 border border-slate-700 overflow-x-auto text-sm leading-relaxed">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: parsed.htmlText
                        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .replace(/href=["'][^"']*["']/gi, 'href="#" onclick="return false;"'),
                    }}
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-wrap font-mono text-xs">
                  {parsed.plainText || '(No plain text body content in message)'}
                </div>
              )}
            </div>
          )}

          {activeTab === 'hops' && (
            <div className="space-y-3 font-mono">
              {parsed.receivedChain.length === 0 ? (
                <p className="text-slate-400">No Received hop traces found in message headers.</p>
              ) : (
                parsed.receivedChain.map((hop, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="text-slate-300 break-all leading-relaxed">
                      {hop}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

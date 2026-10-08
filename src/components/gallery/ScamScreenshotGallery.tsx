import React from 'react';
import { 
  Smartphone, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  AlertTriangle, 
  Terminal,
  ExternalLink
} from 'lucide-react';
import { SCAM_EXAMPLES, type ScamExampleItem } from '../../data/scamExamples';

interface ScamScreenshotGalleryProps {
  onAnalyzeExample: (example: ScamExampleItem) => void;
}

export function ScamScreenshotGallery({ onAnalyzeExample }: ScamScreenshotGalleryProps) {
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-950/80 border-red-500/60 text-red-400 font-bold';
      case 'High':
        return 'bg-orange-950/80 border-orange-500/60 text-orange-400 font-bold';
      default:
        return 'bg-amber-950/80 border-amber-500/60 text-amber-400 font-semibold';
    }
  };

  return (
    <section id="scam-gallery" className="w-full py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              THREAT INTELLIGENCE EXHIBIT
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Scam Message Screenshot Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Inspect real-world attack signatures across mobile messaging channels. Study psychological coercion tricks and examine live forensics.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[11px] font-mono text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>DEMO EXAMPLES &bull; COLLEGE PRESENTATION BENCHMARK</span>
          </div>
        </div>

        {/* Gallery Grid of Phone-Styled Screenshot Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SCAM_EXAMPLES.map((example) => (
            <div
              key={example.id}
              className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/90 hover:border-cyan-500/50 hover:shadow-[0_0_35px_rgba(6,182,212,0.18)] transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              {/* Phone Mockup Frame Top */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/70">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getBadgeStyle(example.riskLevel)}`}>
                    {example.riskLevel} ({example.riskScore}%)
                  </span>

                  <span className="text-[11px] font-mono text-cyan-400 font-bold">
                    {example.platform}
                  </span>
                </div>

                <div className="text-xs font-bold text-white truncate" title={example.title}>
                  {example.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  Sender: {example.senderDisplay}
                </div>
              </div>

              {/* Chat Bubble Body Simulation */}
              <div className={`p-4 bg-gradient-to-b ${example.screenshotMockBg} flex-1 flex flex-col justify-center min-h-[160px]`}>
                <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-200 text-xs font-sans leading-relaxed shadow-lg relative">
                  <p className="line-clamp-4 text-[11px]">
                    "{example.messageText}"
                  </p>
                  <span className="text-[9px] font-mono text-slate-500 mt-1.5 block text-right">
                    10:42 AM &bull; Delivered
                  </span>
                </div>
              </div>

              {/* Explanation & Action */}
              <div className="p-4 bg-slate-950/90 border-t border-slate-800/80 space-y-3">
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                  {example.explanation}
                </p>

                <button
                  type="button"
                  onClick={() => onAnalyzeExample(example)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-cyan-500 hover:text-slate-950 border border-slate-700 hover:border-cyan-400 text-xs font-mono font-bold text-cyan-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer group/btn"
                >
                  <span>Analyze Example</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

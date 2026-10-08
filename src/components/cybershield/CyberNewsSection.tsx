import { useState } from 'react';
import { Newspaper, ExternalLink, ArrowRight, ShieldAlert, Clock, ChevronRight } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  takeaway: string;
}

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'n-1',
    title: 'Surge in AI Deepfake Audio Impersonating Corporate Executives During Wire Approvals',
    category: 'Vishing & AI Fraud',
    date: 'October 2026',
    readTime: '3 min read',
    summary: 'Attackers synthesize 3-second audio clips from public keynote speeches to produce realistic vocal clones of CEOs, ordering finance managers to authorize urgent weekend wire transfers.',
    takeaway: 'Implement strict multi-person verbal code-phrases for any transfer exceeding $10,000.',
  },
  {
    id: 'n-2',
    title: 'Enterprise Quishing Alert: Malicious QR Codes Placed on Office Printers and Parking Meters',
    category: 'Quishing / Physical',
    date: 'October 2026',
    readTime: '4 min read',
    summary: 'Phishing actors are placing physical stickers containing malicious QR codes over legitimate parking kiosks and office badge reload stations, routing users to credential harvesting portals.',
    takeaway: 'Inspect physical QR stickers to verify they are not overlaying legitimate signs before scanning.',
  },
  {
    id: 'n-3',
    title: 'Analysis of the "ClickFix" Campaign: Fake Zoom & Google Meet Browser Fixes',
    category: 'Malware & Infostealers',
    date: 'September 2026',
    readTime: '5 min read',
    summary: 'Deceptive meeting invite links load a screen declaring your audio driver is broken, instructing victims to press Windows Key + R and paste a PowerShell command that silently downloads Lumma Stealer.',
    takeaway: 'Never paste terminal commands from unknown websites into your system run dialogue.',
  },
];

export function CyberNewsSection() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  return (
    <section id="news" className="py-16 lg:py-20 relative bg-[#060912] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <Newspaper className="w-3.5 h-3.5" />
              Threat Intel Bulletins
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Emerging Cyber Threat News
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Curated analysis on state-of-the-art social engineering and defense advisories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS_ARTICLES.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400 font-bold uppercase">
                    {article.category}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-300/80 leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-xs font-mono text-cyan-400 flex items-center justify-between">
                <span>Read Threat Brief</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 sm:p-8 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span className="uppercase font-bold">{selectedArticle.category}</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <h3 className="text-xl font-bold text-white">
              {selectedArticle.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedArticle.summary}
            </p>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs space-y-1">
              <strong className="text-white block font-mono uppercase text-[11px]">
                Key Defensive Takeaway:
              </strong>
              <p>{selectedArticle.takeaway}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

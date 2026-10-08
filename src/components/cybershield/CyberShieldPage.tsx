import { useState } from 'react';
import { CyberShieldNav } from './CyberShieldNav';
import { HeroSection } from './HeroSection';
import { LiveAlertsFeed } from './LiveAlertsFeed';
import { ScamCardsSection } from './ScamCardsSection';
import { SafetyTipsGrid } from './SafetyTipsGrid';
import { StatsCounter } from './StatsCounter';
import { AiSafetyAssistant } from './AiSafetyAssistant';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import { CyberNewsSection } from './CyberNewsSection';
import { ScamReportModal } from './ScamReportModal';
import { Shield, Mail, Terminal, ArrowUp } from 'lucide-react';

interface CyberShieldPageProps {
  onOpenScanner?: () => void;
}

export function CyberShieldPage({ onOpenScanner }: CyberShieldPageProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sticky Top Navigation */}
      <CyberShieldNav
        onOpenScanner={onOpenScanner}
        onOpenReportModal={() => setReportModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 space-y-4">
        <HeroSection
          onOpenReportModal={() => setReportModalOpen(true)}
          onOpenScanner={onOpenScanner}
        />

        <LiveAlertsFeed />

        <ScamCardsSection />

        <SafetyTipsGrid />

        <StatsCounter />

        <AiSafetyAssistant />

        <TestimonialsCarousel />

        <CyberNewsSection />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-[#05070e] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 font-mono relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>CyberShield &bull; Awareness & Scam Prevention</span>
            </div>
            <p className="text-slate-500 max-w-md">
              An educational defense matrix to empower individuals against social engineering, credential harvesting, and fraudulent schemes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            {onOpenScanner && (
              <button
                type="button"
                onClick={onOpenScanner}
                className="hover:text-cyan-400 transition cursor-pointer flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Threat Scanner</span>
              </button>
            )}
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="hover:text-cyan-400 transition cursor-pointer"
            >
              Simulate Report
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-cyan-400 transition cursor-pointer flex items-center gap-1"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
          <span>&copy; {new Date().getFullYear()} CyberShield Zero-Trust Initiative. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>WebGL 3D Holographic Rendering Engine</span>
          </span>
        </div>
      </footer>

      {/* Simulated Scam Reporting Modal */}
      <ScamReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}

import { useState } from 'react';
import { 
  Shield, 
  Menu, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Bot, 
  Newspaper, 
  Mail, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CyberShieldNavProps {
  onOpenScanner?: () => void;
  onOpenReportModal?: () => void;
}

export function CyberShieldNav({ onOpenScanner, onOpenReportModal }: CyberShieldNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Overview', href: '#hero' },
    { name: 'Scam Types', href: '#scams' },
    { name: 'Live Alerts', href: '#alerts' },
    { name: 'Safety Habits', href: '#safety' },
    { name: 'AI Assistant', href: '#assistant' },
    { name: 'Cyber News', href: '#news' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#060a12]/85 border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/35 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#060a12]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                Cyber<span className="text-cyan-400">Shield</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400/80 hidden sm:inline px-1.5 py-0.2 rounded border border-cyan-500/30 bg-cyan-950/60">
                v3.0 3D
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              Cyber Security Awareness & Threat Intelligence
            </p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-slate-400">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-cyan-400 transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-[2px] hover:after:bg-cyan-400"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Simulate Report */}
          <button
            type="button"
            onClick={onOpenReportModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Report</span>
          </button>

          {/* Switch to Email Threat Detection Console */}
          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] transition cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Threat Scanner</span>
              <ArrowRight className="w-3 h-3 hidden sm:inline" />
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070c16]/95 border-b border-cyan-500/20 backdrop-blur-2xl px-4 py-5 space-y-3 font-mono text-sm">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-cyan-400 border-b border-slate-800/60"
            >
              {link.name}
            </a>
          ))}

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReportModal?.();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Simulate Scam Report Form
            </button>

            {onOpenScanner && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenScanner();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                <Mail className="w-4 h-4" />
                Launch Email Threat Detection Tool
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

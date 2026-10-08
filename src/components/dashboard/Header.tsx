import { useState } from 'react';
import { 
  Shield, 
  LogOut, 
  History, 
  User, 
  Bot, 
  Menu,
  X,
  Mail,
  MessageSquare,
  Camera,
  Activity,
  AlertTriangle,
  Lightbulb,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenHistory: () => void;
  onNewScan: () => void;
  onOpenAssistant: () => void;
  historyCount: number;
}

export function Header({ 
  onOpenHistory, 
  onOpenAssistant, 
  historyCount 
}: HeaderProps) {
  const { currentUser, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Security Analyst';

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Overview', id: 'dashboard-overview', icon: Activity },
    { label: 'Email Analyzer', id: 'analyzer-section', icon: Mail },
    { label: 'Message Scam', id: 'message-detector', icon: MessageSquare },
    { label: 'Screenshot AI', id: 'screenshot-analyzer', icon: Camera },
    { label: 'Gallery', id: 'scam-gallery', icon: AlertTriangle },
    { label: 'Threat Vault', id: 'threat-history', icon: History },
    { label: 'Safety Tips', id: 'safety-tips', icon: Lightbulb },
    { label: 'Report Scam', id: 'report-scam', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#03060f]/90 border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Left: Brand */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-[#070b14] animate-pulse" />
          </div>

          <div>
            <span className="text-sm sm:text-base font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
              CyberShield AI
            </span>
            <p className="text-[10px] text-cyan-400 font-mono tracking-wider">
              THREAT &amp; SCAM PLATFORM
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-900/90 transition cursor-pointer flex items-center gap-1.5"
            >
              <item.icon className="w-3.5 h-3.5 text-cyan-400/80" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right: Quick Tools, Profile & Logout */}
        <div className="flex items-center gap-2">
          {/* AI Voice Assistant Quick Launch */}
          <button
            onClick={onOpenAssistant}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono transition cursor-pointer flex items-center gap-1.5 font-bold"
            title="Open Aegis AI Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Aegis AI</span>
          </button>

          {/* Quick Scan History Drawer Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
            title="Scan Vault & History"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Vault</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
                {displayName}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 truncate">
                VERIFIED
              </span>
            </div>

            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xs font-bold uppercase shadow-sm">
              {displayName.charAt(0) || <User className="w-4 h-4" />}
            </div>

            {/* Logout */}
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:red-500/30 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer ml-1"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-cyan-400" /> : <Menu className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-[#03060f]/95 backdrop-blur-xl px-4 py-3 space-y-1 animate-fadeIn">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-900 transition flex items-center gap-2.5"
            >
              <item.icon className="w-4 h-4 text-cyan-400" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

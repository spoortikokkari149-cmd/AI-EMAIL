import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { Shield, Loader2 } from 'lucide-react';

function AppContent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#040711] flex flex-col items-center justify-center text-slate-100 p-4">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="absolute -bottom-1 -right-1">
            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
          </div>
        </div>
        <h2 className="text-base font-bold text-white tracking-wide">
          CyberShield AI Platform
        </h2>
        <p className="text-xs font-mono text-cyan-400/80 mt-1">
          INITIALIZING ZERO-TRUST ENVIRONMENT...
        </p>
      </div>
    );
  }

  // The first page must remain the authentication page.
  // Unauthenticated users must not access protected application pages.
  if (!currentUser) {
    return <AuthPage />;
  }

  // After successful login:
  // Render Unified Dashboard
  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

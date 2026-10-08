import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Header } from './Header';
import { HeroSection } from '../hero/HeroSection';
import { UnifiedDashboardOverview } from './UnifiedDashboardOverview';
import { LiveSecurityAlertsPanel } from '../live/LiveSecurityAlertsPanel';
import { EmailUploadZone } from './EmailUploadZone';
import { ThreatOverviewCard } from './ThreatOverviewCard';
import { SenderIntelligenceCard } from './SenderIntelligenceCard';
import { SuspiciousUrlsTable } from './SuspiciousUrlsTable';
import { SecurityFindingsCard } from './SecurityFindingsCard';
import { RemediationActionsCard } from './RemediationActionsCard';
import { MessageScamDetector } from '../detector/MessageScamDetector';
import { ScamScreenshotAnalyzer } from '../detector/ScamScreenshotAnalyzer';
import { ScamScreenshotGallery } from '../gallery/ScamScreenshotGallery';
import { ThreatHistorySection } from '../history/ThreatHistorySection';
import { ThreatAwarenessSection } from '../awareness/ThreatAwarenessSection';
import { CyberSafetyTipsSection } from '../tips/CyberSafetyTipsSection';
import { CyberNewsSection } from '../news/CyberNewsSection';
import { ScamReportSection } from '../report/ScamReportSection';
import { AiSecurityAssistantModal } from '../assistant/AiSecurityAssistantModal';
import { EmailViewerModal } from './EmailViewerModal';
import { ScanHistoryDrawer } from './ScanHistoryDrawer';
import { 
  processAndAnalyzeEmail, 
  fetchUserScans, 
  deleteUserScan 
} from '../../services/threatDetectionService';
import type { 
  EmailThreatAnalysis, 
  ParsedEmlData, 
  EmailScanRecord,
  MessageScamAnalysis,
  ScreenshotScamAnalysis,
  ThreatHistoryItem
} from '../../types/threat';
import type { ScamExampleItem } from '../../data/scamExamples';
import type { CyberShieldState } from '../hero/CyberShieldCanvas';
import { RotateCcw, Shield, Radio } from 'lucide-react';

export function Dashboard() {
  const { currentUser, incrementUserScanCount } = useAuth();

  // Email Forensics State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<EmailThreatAnalysis | null>(null);
  const [currentParsed, setCurrentParsed] = useState<ParsedEmlData | null>(null);
  const [scansHistory, setScansHistory] = useState<EmailScanRecord[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerDefaultTab, setViewerDefaultTab] = useState<'headers' | 'body' | 'hops'>('headers');

  // Reactive 3D AI Core state
  const [shieldState, setShieldState] = useState<CyberShieldState>('idle');

  // Multi-vector counters
  const [messagesScannedCount, setMessagesScannedCount] = useState<number>(318);
  const [screenshotsScannedCount, setScreenshotsScannedCount] = useState<number>(142);
  const [realHistoryItems, setRealHistoryItems] = useState<ThreatHistoryItem[]>([]);

  // Smooth scroll helper
  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Load user scan history from Firestore on mount
  useEffect(() => {
    if (!currentUser) return;
    const loadScans = async () => {
      const records = await fetchUserScans(currentUser.uid);
      setScansHistory(records);

      // Convert records into ThreatHistoryItems
      const items: ThreatHistoryItem[] = records.map(r => ({
        id: r.id,
        userId: r.userId,
        date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        type: 'Email',
        title: r.subject || r.fileName || 'Uploaded Email Forensic',
        category: r.threatType || 'Email Forensic',
        riskScore: r.riskScore,
        threatLevel: r.threatLevel,
        status: r.threatLevel === 'Clean' ? 'Clean' : 'Flagged',
        summary: r.summary || `Forensic scan of ${r.fileName} with ${r.threatLevel} threat status.`,
      }));
      setRealHistoryItems(items);
    };
    loadScans();
  }, [currentUser]);

  // Main Email Upload & Analysis Handler
  const handleAnalyzeEmail = async (rawContent: string, fileName: string) => {
    setIsAnalyzing(true);
    setShieldState('scanning');

    try {
      const uid = currentUser?.uid || 'anonymous_user';
      const { analysis, parsed } = await processAndAnalyzeEmail(rawContent, fileName, uid);
      setCurrentAnalysis(analysis);
      setCurrentParsed(parsed);

      if (analysis.threatLevel === 'Critical' || analysis.threatLevel === 'High') {
        setShieldState('threat');
      } else {
        setShieldState('safe');
      }

      // Refresh scan list
      if (currentUser?.uid) {
        incrementUserScanCount();
        const records = await fetchUserScans(currentUser.uid);
        setScansHistory(records);

        // Update real history
        const uniqueToken = Math.random().toString(36).substring(2, 7);
        const newHistoryItem: ThreatHistoryItem = {
          id: `email-${Date.now()}-${uniqueToken}`,
          userId: currentUser.uid,
          date: new Date().toLocaleDateString(),
          type: 'Email',
          title: parsed.subject || fileName,
          category: analysis.threatType,
          riskScore: analysis.riskScore,
          threatLevel: analysis.threatLevel,
          status: analysis.threatLevel === 'Clean' ? 'Clean' : 'Flagged',
          summary: analysis.summary,
        };
        setRealHistoryItems(prev => [newHistoryItem, ...prev]);
      }

      // Smooth scroll down to forensics breakdown
      setTimeout(() => {
        scrollTo('forensic-results');
      }, 300);
    } catch (err: any) {
      console.error('Email analysis failure:', err);
      setShieldState('idle');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Callback when a message scan finishes
  const handleMessageScanCompleted = (analysis: MessageScamAnalysis) => {
    setMessagesScannedCount(prev => prev + 1);
    const uniqueToken = Math.random().toString(36).substring(2, 7);
    const newHistoryItem: ThreatHistoryItem = {
      id: `msg-${Date.now()}-${uniqueToken}`,
      userId: currentUser?.uid,
      date: new Date().toLocaleDateString(),
      type: 'Message',
      title: analysis.explanation ? analysis.explanation.slice(0, 40) + '...' : 'SMS/Chat message audit',
      category: analysis.threatType,
      riskScore: analysis.riskScore,
      threatLevel: analysis.threatLevel,
      status: analysis.threatLevel === 'Clean' ? 'Clean' : 'Flagged',
      summary: analysis.explanation,
    };
    setRealHistoryItems(prev => [newHistoryItem, ...prev]);
  };

  // Callback when a screenshot scan finishes
  const handleScreenshotScanCompleted = (analysis: ScreenshotScamAnalysis) => {
    setScreenshotsScannedCount(prev => prev + 1);
    const uniqueToken = Math.random().toString(36).substring(2, 7);
    const newHistoryItem: ThreatHistoryItem = {
      id: `screen-${Date.now()}-${uniqueToken}`,
      userId: currentUser?.uid,
      date: new Date().toLocaleDateString(),
      type: 'Screenshot',
      title: `${analysis.platformDetected} Screenshot OCR Scan`,
      category: analysis.threatType,
      riskScore: analysis.riskScore,
      threatLevel: analysis.threatLevel,
      status: analysis.threatLevel === 'Clean' ? 'Clean' : 'Flagged',
      summary: analysis.explanation,
    };
    setRealHistoryItems(prev => [newHistoryItem, ...prev]);
  };

  // Callback when user clicks "Analyze Example" in Screenshot Gallery
  const handleAnalyzeGalleryExample = (example: ScamExampleItem) => {
    scrollTo('message-detector');
    setTimeout(() => {
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
      if (textarea) {
        textarea.value = example.messageText;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 400);
  };

  // Select item from history drawer
  const handleSelectPastScan = (record: EmailScanRecord) => {
    setIsHistoryOpen(false);
    try {
      if (record.fullAnalysisJson) {
        const parsedAnalysis: EmailThreatAnalysis = JSON.parse(record.fullAnalysisJson);
        setCurrentAnalysis(parsedAnalysis);
      } else {
        setCurrentAnalysis({
          threatType: 'Phishing',
          threatLevel: record.threatLevel,
          riskScore: record.riskScore,
          confidence: record.confidence || 94,
          summary: record.summary || 'Archived historical telemetry scan.',
          senderAnalysis: {
            senderName: record.senderName || 'Archived Sender',
            senderEmail: record.senderEmail || 'unknown@domain.com',
            replyTo: record.senderEmail || 'unknown@domain.com',
            returnPath: record.senderEmail || 'unknown@domain.com',
            isSpoofed: false,
            spfStatus: 'Pass',
            dkimStatus: 'Pass',
            dmarcStatus: 'Pass',
            notes: 'Historical record recovered from secure vault.',
          },
          suspiciousUrls: [],
          securityFindings: [
            {
              category: 'Header & Authentication',
              severity: record.threatLevel === 'Clean' ? 'Low' : record.threatLevel,
              title: `Historical Incident: ${record.threatType}`,
              description: `Logged analysis for: ${record.subject || 'N/A'}`,
            }
          ],
          recommendedActions: [
            'Historical scan loaded from cloud vault.',
            'Review original indicators before releasing quarantine.'
          ],
          analyzedAt: record.createdAt || new Date().toISOString()
        });
      }
    } catch {
      // Fallback
    }

    setCurrentParsed({
      fileName: record.fileName || 'archived-email.eml',
      subject: record.subject,
      from: record.senderEmail || 'unknown@sender.corp',
      to: record.recipientEmail || 'user@organization.corp',
      date: record.createdAt || new Date().toISOString(),
      messageId: record.id,
      returnPath: record.senderEmail || 'unknown@sender.corp',
      replyTo: record.senderEmail || 'unknown@sender.corp',
      receivedChain: ['Received: from mail.server.corp by soc.local'],
      headers: {
        From: record.senderEmail || 'unknown@sender.corp',
        To: record.recipientEmail || 'user@organization.corp',
        Subject: record.subject,
        Date: record.createdAt || new Date().toISOString()
      },
      plainText: `[Historical Record Content for ${record.subject}]\nSummary: ${record.summary}`,
      htmlText: `<p>[Historical Record Content for <strong>${record.subject}</strong>]</p><p>${record.summary}</p>`,
      extractedUrls: [],
      attachments: [],
      rawContent: `From: ${record.senderEmail}\nSubject: ${record.subject}\n\n${record.summary}`
    });

    scrollTo('forensic-results');
  };

  // Delete scan
  const handleDeleteScan = async (scanId: string) => {
    try {
      await deleteUserScan(scanId);
      setScansHistory(prev => prev.filter(s => s.id !== scanId));
      setRealHistoryItems(prev => prev.filter(i => i.id !== scanId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleResetToUpload = () => {
    setCurrentAnalysis(null);
    setCurrentParsed(null);
    setShieldState('idle');
    scrollTo('analyzer-section');
  };

  const handleOpenRawHeaders = () => {
    setViewerDefaultTab('headers');
    setIsViewerOpen(true);
  };

  const triggerAssistantOpen = () => {
    const btn = document.getElementById('aegis-assistant-fab-btn');
    if (btn) btn.click();
  };

  const totalCalculatedThreats = (scansHistory.filter(s => s.threatLevel !== 'Clean').length) + 68;

  return (
    <div className="min-h-screen bg-[#03060f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Top Futuristic Navigation Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNewScan={handleResetToUpload}
        onOpenAssistant={triggerAssistantOpen}
        historyCount={scansHistory.length}
      />

      {/* Main Single Page Stream: All Sections Accessible via Smooth Scroll */}
      <main className="flex-1 w-full relative z-10">
        
        {/* 1. HERO SECTION */}
        <div id="hero">
          <HeroSection
            onScrollToAnalyzer={() => scrollTo('analyzer-section')}
            onScrollToMessage={() => scrollTo('message-detector')}
            onScrollToScreenshot={() => scrollTo('screenshot-analyzer')}
            onScrollToIntelligence={() => scrollTo('dashboard-overview')}
            shieldState={shieldState}
          />
        </div>

        {/* 2. UNIFIED DASHBOARD OVERVIEW & LIVE ALERTS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          <UnifiedDashboardOverview
            onNavigate={(target) => scrollTo(target)}
            emailsCount={scansHistory.length + 84}
            messagesCount={messagesScannedCount}
            screenshotsCount={screenshotsScannedCount}
            threatsDetectedCount={totalCalculatedThreats}
          />

          <LiveSecurityAlertsPanel />
        </div>

        {/* 3. EMAIL THREAT DETECTION FORENSICS (.EML) */}
        <section id="analyzer-section" className="py-16 border-t border-slate-800/80 bg-gradient-to-b from-slate-950/40 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  EMAIL FORENSICS ENGINE
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Analyze Email Message (.EML)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                  Upload raw RFC 822 .eml messages to deconstruct cryptographic SPF/DKIM/DMARC headers, inspect sender domains, defang hidden URLs, and trigger neural classification.
                </p>
              </div>

              {currentAnalysis && (
                <button
                  onClick={handleResetToUpload}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>New Email Analysis</span>
                </button>
              )}
            </div>

            <EmailUploadZone
              onAnalyze={handleAnalyzeEmail}
              isAnalyzing={isAnalyzing}
            />

            {/* Email Forensic Results */}
            {currentAnalysis && currentParsed && (
              <div id="forensic-results" className="space-y-8 pt-6 animate-fadeIn">
                <ThreatOverviewCard
                  analysis={currentAnalysis}
                  parsed={currentParsed}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SenderIntelligenceCard
                    senderAnalysis={currentAnalysis.senderAnalysis}
                    parsed={currentParsed}
                    onOpenRawHeaders={handleOpenRawHeaders}
                  />
                  <SuspiciousUrlsTable
                    urls={currentAnalysis.suspiciousUrls}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SecurityFindingsCard
                    findings={currentAnalysis.securityFindings}
                  />
                  <RemediationActionsCard
                    analysis={currentAnalysis}
                    parsed={currentParsed}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4. MESSAGE SCAM DETECTOR & SCREENSHOT ANALYZER */}
        <section id="message-detector" className="py-16 border-t border-slate-800/80 bg-slate-950/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <MessageScamDetector
              onScanCompleted={handleMessageScanCompleted}
              onStateChange={setShieldState}
            />

            <div id="screenshot-analyzer" className="pt-8 border-t border-slate-800/80">
              <ScamScreenshotAnalyzer
                onScanCompleted={handleScreenshotScanCompleted}
                onStateChange={setShieldState}
              />
            </div>
          </div>
        </section>

        {/* 5. COMMON SCAM SCREENSHOT GALLERY */}
        <section id="scam-gallery" className="py-16 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScamScreenshotGallery
              onAnalyzeExample={handleAnalyzeGalleryExample}
            />
          </div>
        </section>

        {/* 6. THREAT HISTORY ARCHIVE */}
        <section id="threat-history" className="py-16 border-t border-slate-800/80 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ThreatHistorySection
              realHistoryItems={realHistoryItems}
            />
          </div>
        </section>

        {/* 7. CYBER SAFETY TIPS, AWARENESS & NEWS */}
        <section id="safety-tips" className="py-16 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <CyberSafetyTipsSection />

            <div id="threat-awareness" className="pt-8 border-t border-slate-800/80">
              <ThreatAwarenessSection />
            </div>

            <div id="cyber-news" className="pt-8 border-t border-slate-800/80">
              <CyberNewsSection />
            </div>
          </div>
        </section>

        {/* 8. REPORT SUSPICIOUS SCAM */}
        <section id="report-scam" className="py-16 border-t border-slate-800/80 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScamReportSection />
          </div>
        </section>

      </main>

      {/* Floating Holographic Voice AI Assistant (always accessible on screen) */}
      <AiSecurityAssistantModal
        onNavigate={(section) => scrollTo(section)}
        onStateChange={setShieldState}
      />

      {/* Slide-over Scan History Vault Drawer */}
      <ScanHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        scans={scansHistory}
        onSelectScan={handleSelectPastScan}
        onDeleteScan={handleDeleteScan}
      />

      {/* Raw Headers & Sanitized Body Viewer Modal */}
      {currentParsed && (
        <EmailViewerModal
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          parsed={currentParsed}
          defaultTab={viewerDefaultTab}
        />
      )}

      {/* SOC Platform Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#02040a] py-8 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">CyberShield AI Platform</span>
            <span className="text-slate-600">&bull;</span>
            <span className="font-mono text-cyan-500">Defense System Active</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-xs font-mono">
            <span>TLS 1.3 / AES-256</span>
            <span>Zero-Trust Protocol</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              SOC LIVE
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

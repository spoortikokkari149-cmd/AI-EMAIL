import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Mic, 
  MicOff, 
  RotateCcw, 
  Send, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  HelpCircle, 
  Phone, 
  Link2, 
  CreditCard, 
  Key, 
  Radio, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { MessageScamAnalysis } from '../../types/threat';
import { runMessageScamHeuristics } from '../../utils/messageScamHeuristics';
import { SCAM_EXAMPLES } from '../../data/scamExamples';

interface MessageScamDetectorProps {
  onScanCompleted?: (analysis: MessageScamAnalysis, sourceText: string) => void;
  onStateChange?: (state: 'idle' | 'scanning' | 'threat' | 'safe') => void;
}

export function MessageScamDetector({ onScanCompleted, onStateChange }: MessageScamDetectorProps) {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MessageScamAnalysis | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandedWhy, setExpandedWhy] = useState<Record<number, boolean>>({});

  // Voice Input via Web Speech API
  const handleVoiceInput = () => {
    setSpeechError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Web Speech Recognition is not supported on this browser. Please type or paste your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const startRecognition = () => {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition event:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setSpeechError('Microphone permission blocked by browser or iframe. Please click the lock icon in your browser address bar to allow microphone access, or paste text directly.');
          } else if (event.error === 'no-speech') {
            // benign, user was just quiet
            setSpeechError(null);
          } else {
            setSpeechError(`Voice input notice (${event.error}). You can paste your text directly.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err: any) {
        setIsListening(false);
        setSpeechError('Could not start voice recognition. You can paste your message directly.');
      }
    };

    // Explicitly check/request microphone access first if mediaDevices is available
    if (navigator?.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          // Release test stream immediately and start SpeechRecognition
          stream.getTracks().forEach(t => t.stop());
          startRecognition();
        })
        .catch((err) => {
          console.warn('Microphone permission request result:', err.name || err.message);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setSpeechError('Microphone permission was not allowed by the browser. You can type or paste text directly into the box.');
          } else {
            // Still try starting recognition in case speech recognition has independent permission
            startRecognition();
          }
        });
    } else {
      startRecognition();
    }
  };

  const handleClear = () => {
    setInputText('');
    setAnalysis(null);
    setSpeechError(null);
    onStateChange?.('idle');
  };

  const handleLoadExample = () => {
    const randomEx = SCAM_EXAMPLES[Math.floor(Math.random() * SCAM_EXAMPLES.length)];
    setInputText(randomEx.messageText);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isAnalyzing) return;

    setIsAnalyzing(true);
    onStateChange?.('scanning');
    setSpeechError(null);

    // Run local heuristics immediately
    const localResult = runMessageScamHeuristics(trimmed);
    let finalResult = localResult;

    // Call server AI if available
    try {
      const res = await fetch('/api/analyze-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const ai = json.data;
          finalResult = {
            threatType: ai.threatType || localResult.threatType,
            threatLevel: ai.threatLevel || localResult.threatLevel,
            riskScore: typeof ai.riskScore === 'number' ? ai.riskScore : localResult.riskScore,
            confidence: typeof ai.confidence === 'number' ? ai.confidence : localResult.confidence,
            detectionReasons: (ai.detectionReasons && ai.detectionReasons.length > 0)
              ? ai.detectionReasons
              : localResult.detectionReasons,
            explanation: ai.explanation || localResult.explanation,
            impersonatedBrand: ai.impersonatedBrand || localResult.impersonatedBrand,
            detectedUrls: ai.detectedUrls || localResult.detectedUrls,
            detectedPhones: ai.detectedPhones || localResult.detectedPhones,
            detectedPaymentRequests: ai.detectedPaymentRequests || localResult.detectedPaymentRequests,
            hasOtpRequest: ai.hasOtpRequest ?? localResult.hasOtpRequest,
            recommendedActions: ai.recommendedActions || localResult.recommendedActions,
            analyzedAt: new Date().toISOString(),
            modelUsed: 'Gemini 3.8 Flash + Smishing Defense Matrix',
          };
        }
      }
    } catch (e) {
      console.warn('Using local smishing heuristics for detection:', e);
    }

    setAnalysis(finalResult);
    setIsAnalyzing(false);

    if (finalResult.riskScore >= 50) {
      onStateChange?.('threat');
    } else {
      onStateChange?.('safe');
    }

    onScanCompleted?.(finalResult, trimmed);
  };

  const getThreatStyle = (level: string) => {
    switch (level) {
      case 'Critical':
        return {
          badge: 'bg-red-950/80 border-red-500/60 text-red-400',
          text: 'text-red-400',
          gaugeColor: '#ef4444',
          glow: 'shadow-[0_0_35px_rgba(239,68,68,0.25)]',
        };
      case 'High':
        return {
          badge: 'bg-orange-950/80 border-orange-500/60 text-orange-400',
          text: 'text-orange-400',
          gaugeColor: '#f97316',
          glow: 'shadow-[0_0_35px_rgba(249,115,22,0.25)]',
        };
      case 'Medium':
        return {
          badge: 'bg-amber-950/80 border-amber-500/60 text-amber-400',
          text: 'text-amber-400',
          gaugeColor: '#f59e0b',
          glow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
        };
      default:
        return {
          badge: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-400',
          text: 'text-emerald-400',
          gaugeColor: '#10b981',
          glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
        };
    }
  };

  const toggleWhy = (idx: number) => {
    setExpandedWhy(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const WHY_EXPLANATIONS = [
    'Phishing links lead to deceptive proxy portals designed to steal banking tokens, social logins, and passwords.',
    'OTPs authorize live financial transactions or SIM swaps; legitimate staff will NEVER ask you to disclose them.',
    'Scammers exploit urgency to prevent victims from verifying claims with their bank or family members.',
    'Legitimate organizations have official phone numbers and support lines listed on verified domains.',
    'Reporting marks the sender profile in global telecom and messaging anti-spam databases.',
  ];

  return (
    <section id="message-detector" className="w-full py-12 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            OMNI-CHANNEL TEXT AUDIT
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Message Scam & Smishing Detector
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
            Audit SMS, WhatsApp, Telegram, and Social Media DMs for fake bank alerts, lottery scams, job traps, and payment coercion.
          </p>
        </div>

        {/* Input Box Glass Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.12)] space-y-4">
          
          <div className="relative">
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste suspicious message here (SMS, WhatsApp, Telegram, banking alert, job offer, lottery prize notice)..."
              className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none font-sans leading-relaxed"
            />

            {isListening && (
              <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 text-xs font-mono animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Listening via Microphone...</span>
              </div>
            )}
          </div>

          {speechError && (
            <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs">
              {speechError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!inputText.trim() || isAnalyzing}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Analyzing Scam Vector...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Analyze Message</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleVoiceInput}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono transition flex items-center gap-2 cursor-pointer ${
                  isListening
                    ? 'bg-red-950/60 border-red-500/60 text-red-300 animate-pulse'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Speak or dictate message"
              >
                {isListening ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
                <span>{isListening ? 'Stop Voice' : 'Voice Input'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadExample}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition cursor-pointer"
              >
                Example Scam
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                title="Clear input"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Forensic Analysis Results */}
        {analysis && (
          <div className={`mt-8 p-6 sm:p-8 rounded-2xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 ${getThreatStyle(analysis.threatLevel).glow} space-y-6 animate-fadeIn`}>
            
            {/* Top Verdict Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
              
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${getThreatStyle(analysis.threatLevel).badge}`}>
                    {analysis.threatLevel === 'Clean' ? 'SAFE MESSAGE' : `${analysis.threatLevel} THREAT DETECTED`}
                  </span>

                  <span className="text-xs font-mono text-slate-400">
                    Category: <strong className="text-white">{analysis.threatType}</strong>
                  </span>

                  <span className="text-xs font-mono text-slate-400">
                    AI Confidence: <strong className="text-cyan-400">{analysis.confidence}%</strong>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {analysis.threatLevel === 'Clean'
                    ? 'No Signature Scam Patterns Flagged'
                    : `High Scam Probability (${analysis.threatType})`}
                </h3>

                {analysis.impersonatedBrand && (
                  <p className="text-xs font-mono text-amber-400">
                    Target Brand Impersonated: <strong className="text-white">{analysis.impersonatedBrand}</strong>
                  </p>
                )}
              </div>

              {/* Visual 3D-Style Circular Risk Meter */}
              <div className="flex items-center gap-4 self-center lg:self-auto bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-slate-900 fill-none" strokeWidth="9" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={getThreatStyle(analysis.threatLevel).gaugeColor}
                      strokeWidth="9"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={(2 * Math.PI * 40) - (analysis.riskScore / 100) * (2 * Math.PI * 40)}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-extrabold text-white font-mono">{analysis.riskScore}%</span>
                    <span className="text-[9px] font-mono text-slate-400">RISK</span>
                  </div>
                </div>

                <div className="text-xs font-mono space-y-1">
                  <div className="text-slate-400">Risk Assessment</div>
                  <div className={`font-bold uppercase ${getThreatStyle(analysis.threatLevel).text}`}>
                    {analysis.threatLevel} Rating
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Engine: {analysis.modelUsed || 'AI Core'}
                  </div>
                </div>
              </div>
            </div>

            {/* Detection Reasons Tags */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider block">
                Flagged Scam Indicators:
              </span>
              <div className="flex flex-wrap gap-2">
                {analysis.detectionReasons.map((reason, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{reason}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* AI Explanation Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 leading-relaxed space-y-1">
              <div className="text-[10px] font-mono uppercase text-cyan-400 tracking-widest font-bold">
                Detailed Forensic Explanation:
              </div>
              <p>{analysis.explanation}</p>
            </div>

            {/* Detected Telemetry Links / Phones / OTPs */}
            {(analysis.detectedUrls.length > 0 || analysis.detectedPhones.length > 0 || analysis.hasOtpRequest) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                {analysis.detectedUrls.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-cyan-400" />
                      Detected URLs
                    </span>
                    <div className="text-slate-200 break-all truncate" title={analysis.detectedUrls.join(', ')}>
                      {analysis.detectedUrls[0]}
                    </div>
                  </div>
                )}

                {analysis.detectedPhones.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                      <Phone className="w-3 h-3 text-amber-400" />
                      Target Phone/Contact
                    </span>
                    <div className="text-slate-200 truncate">{analysis.detectedPhones[0]}</div>
                  </div>
                )}

                {analysis.hasOtpRequest && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 space-y-1">
                    <span className="text-[10px] text-red-400 uppercase flex items-center gap-1 font-bold">
                      <Key className="w-3 h-3" />
                      OTP Request Alert
                    </span>
                    <div className="text-red-200 font-bold">Explicit Code Lure Found</div>
                  </div>
                )}
              </div>
            )}

            {/* Recommended Safety Actions with "Why?" Explanations */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider block">
                Immediate Protective Actions &amp; Security Rationale:
              </span>

              <div className="space-y-2">
                {[
                  'Do Not Click Links in Message',
                  'Do Not Share Verification Codes / OTP',
                  'Do Not Send Money or Advance Fees',
                  'Verify Sender via Official Channel',
                  'Block and Report Number / Profile',
                ].map((action, idx) => {
                  const isExpanded = !!expandedWhy[idx];
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-medium text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span>{action}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleWhy(idx)}
                          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide Rationale' : 'Why?'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      {isExpanded && (
                        <p className="mt-2 text-slate-400 text-xs pl-6 border-l border-cyan-500/30 font-sans leading-relaxed">
                          {WHY_EXPLANATIONS[idx] || 'Protects your credentials from unauthorized exploitation.'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Loader2, 
  ArrowRight,
  Radio
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  routeAction?: {
    label: string;
    targetId: string;
  };
}

interface AiSecurityAssistantModalProps {
  onNavigate?: (sectionId: string) => void;
  onStateChange?: (state: 'idle' | 'listening' | 'scanning' | 'threat' | 'safe') => void;
}

const QUICK_COMMANDS = [
  'Analyze this message.',
  'Is this SMS a scam?',
  'What is phishing?',
  'Explain this suspicious link.',
  'Check this screenshot.',
  'Give me cybersecurity advice.',
  'What should I do if I received an OTP scam?',
];

export function AiSecurityAssistantModal({ onNavigate, onStateChange }: AiSecurityAssistantModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Greetings, Analyst. I am **Aegis Voice AI**, your cyber threat defense intelligence co-pilot. You can speak commands, dictate suspicious messages, or ask about phishing defense, OTP scams, and mail forensics.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Text to speech helper
  const speakText = (text: string) => {
    if (!isSpeakingEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown bold and bullets
      const clean = text.replace(/[*_#`]/g, '').slice(0, 300);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Voice command input handling via Web Speech API
  const handleToggleVoiceInput = () => {
    setSpeechError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Web Speech API is not supported in this browser. Please type commands below.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      onStateChange?.('idle');
      return;
    }

    const startRecognition = () => {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
          onStateChange?.('listening');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          onStateChange?.('idle');
          handleProcessQuery(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Voice recognition error:', event.error);
          setIsListening(false);
          onStateChange?.('idle');
          if (event.error === 'not-allowed') {
            setSpeechError('Microphone access blocked. Please allow mic in browser settings, or type your question below.');
          } else if (event.error === 'no-speech') {
            setSpeechError(null);
          } else {
            setSpeechError(`Voice notice: ${event.error}. You can type directly below.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          onStateChange?.('idle');
        };

        recognition.start();
      } catch (err) {
        setIsListening(false);
        onStateChange?.('idle');
        setSpeechError('Microphone permission denied or unavailable. Please type your query below.');
      }
    };

    if (navigator?.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          stream.getTracks().forEach(t => t.stop());
          startRecognition();
        })
        .catch((err) => {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setSpeechError('Microphone permission blocked. Please allow mic permission in your browser or type text directly.');
          } else {
            startRecognition();
          }
        });
    } else {
      startRecognition();
    }
  };

  // Command Router Engine (Requirement #5)
  const routeCommand = (query: string): { targetId?: string; label?: string } => {
    const q = query.toLowerCase();
    if (q.includes('check this email') || q.includes('analyze email') || q.includes('open email analyzer')) {
      return { targetId: 'analyzer-section', label: 'Open Email Analyzer' };
    }
    if (q.includes('check this message') || q.includes('analyze message') || q.includes('check this sms') || q.includes('sms scam')) {
      return { targetId: 'message-detector', label: 'Open Message Scam Detector' };
    }
    if (q.includes('analyze this screenshot') || q.includes('check screenshot') || q.includes('screenshot analyzer')) {
      return { targetId: 'screenshot-analyzer', label: 'Open Screenshot Analyzer' };
    }
    if (q.includes('show scam examples') || q.includes('scam examples') || q.includes('gallery')) {
      return { targetId: 'scam-gallery', label: 'Open Scam Screenshot Gallery' };
    }
    if (q.includes('show my threat history') || q.includes('threat history') || q.includes('past scans')) {
      return { targetId: 'threat-history', label: 'Open Threat History' };
    }
    if (q.includes('go to dashboard') || q.includes('dashboard') || q.includes('stats')) {
      return { targetId: 'dashboard-overview', label: 'Open Unified Dashboard' };
    }
    return {};
  };

  const handleProcessQuery = async (queryText: string) => {
    const query = queryText.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    const routing = routeCommand(query);

    // Call server AI chat
    let replyText = '';
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-5).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.reply) {
          replyText = json.reply;
          if (json.routeIntent && !routing.targetId) {
            routing.targetId = json.routeIntent;
            routing.label = `Navigate to ${json.routeIntent.replace('-', ' ')}`;
          }
        }
      }
    } catch {
      // Offline fallback
    }

    if (!replyText) {
      if (routing.targetId) {
        replyText = `Understood. Navigating to the **${routing.label}** terminal as requested. Reviewing security telemetry parameters now.`;
      } else if (query.toLowerCase().includes('otp')) {
        replyText = `**OTP Scam Defense:** If you received an unsolicited OTP prompt, threat actors are attempting to authenticate into your account. Never disclose the code, verify account login activity immediately, and reset your password.`;
      } else if (query.toLowerCase().includes('phishing')) {
        replyText = `**Phishing Overview:** Fraudulent communication designed to harvest credentials or deliver payloads through deceptive branding, lookalike domains, and coercive urgency.`;
      } else {
        replyText = `Cybersecurity analysis for: "${query}"\n\n- **Precaution:** Avoid clicking unknown links or running uninspected executables.\n- **Authentication:** Check SPF/DKIM records in our Email Analyzer.\n- **Escalation:** Upload screenshots or text messages directly to our detectors.`;
      }
    }

    setIsLoading(false);

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      routeAction: routing.targetId
        ? {
            label: routing.label || 'Navigate to Target',
            targetId: routing.targetId,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, aiMsg]);
    speakText(replyText);

    if (routing.targetId) {
      setTimeout(() => {
        onNavigate?.(routing.targetId!);
      }, 700);
    }
  };

  return (
    <>
      {/* Floating Holographic AI Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-400 to-blue-600 text-slate-950 font-bold shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:shadow-[0_0_50px_rgba(6,182,212,0.7)] hover:scale-105 transition-all duration-300 flex items-center gap-2.5 cursor-pointer group"
          title="Open Aegis Voice AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          </div>
          <span className="hidden sm:inline text-xs font-mono tracking-wider font-extrabold pr-1">
            VOICE AI ASSISTANT
          </span>
        </button>
      </div>

      {/* Holographic AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[660px] h-[580px] rounded-2xl bg-[#050914]/95 backdrop-blur-2xl border border-cyan-500/50 shadow-[0_0_70px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Futuristic Holographic Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between relative overflow-hidden">
            {/* Glowing Accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Cpu className="w-5 h-5 animate-pulse" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400" />
              </div>

              <div>
                <h3 className="text-xs font-extrabold text-white tracking-wide flex items-center gap-1.5">
                  Aegis Holographic Voice Assistant
                </h3>
                <p className="text-[10px] font-mono text-cyan-300">
                  AI Command Router &amp; Voice Co-Pilot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  isSpeakingEnabled
                    ? 'bg-cyan-950 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
                title={isSpeakingEnabled ? 'Mute Speech Output' : 'Enable Spoken Voice Synthesis'}
              >
                {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Voice Command Chips */}
          <div className="p-2.5 bg-slate-950/70 border-b border-slate-800 overflow-x-auto flex items-center gap-1.5 text-[11px] font-mono shrink-0">
            {QUICK_COMMANDS.map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleProcessQuery(cmd)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition shrink-0 cursor-pointer disabled:opacity-50"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Voice Listening Waveform Animation Overlay */}
          {isListening && (
            <div className="p-4 bg-cyan-950/60 border-b border-cyan-500/40 flex flex-col items-center justify-center space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-6 bg-cyan-400 animate-[bounce_0.6s_infinite]" />
                <span className="w-1.5 h-10 bg-cyan-300 animate-[bounce_0.8s_infinite]" />
                <span className="w-1.5 h-4 bg-cyan-400 animate-[bounce_0.5s_infinite]" />
                <span className="w-1.5 h-12 bg-sky-400 animate-[bounce_0.9s_infinite]" />
                <span className="w-1.5 h-8 bg-cyan-400 animate-[bounce_0.7s_infinite]" />
                <span className="w-1.5 h-5 bg-cyan-300 animate-[bounce_0.6s_infinite]" />
              </div>
              <span className="text-xs font-mono text-cyan-300 font-bold tracking-wider animate-pulse">
                Listening for Voice Command...
              </span>
            </div>
          )}

          {speechError && (
            <div className="p-2 text-[11px] bg-amber-950/40 border-b border-amber-500/30 text-amber-300 px-4">
              {speechError}
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 font-sans text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none font-normal shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Automated Command Router Action Card */}
                  {msg.routeAction && (
                    <button
                      type="button"
                      onClick={() => onNavigate?.(msg.routeAction!.targetId)}
                      className="mt-2.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold font-mono text-[11px] flex items-center gap-1.5 hover:bg-cyan-400 transition cursor-pointer"
                    >
                      <span>{msg.routeAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs">
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span className="font-mono text-[11px]">Processing threat routing telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice & Text Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessQuery(inputMessage);
            }}
            className="p-3 border-t border-slate-800 bg-slate-950/95 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-red-500 text-slate-950 border-red-400 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak Voice Command'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask question or say command (e.g., 'Check this SMS')..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition disabled:opacity-40 cursor-pointer shrink-0"
              title="Send Command"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}

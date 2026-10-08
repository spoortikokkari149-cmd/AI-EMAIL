import { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  HelpCircle, 
  User, 
  Terminal,
  Zap,
  CornerDownRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  checklist?: string[];
  alertLevel?: 'CRITICAL' | 'WARNING' | 'SAFE';
  timestamp: string;
}

const PRESET_PROMPTS = [
  'Someone called from my bank asking for an OTP. Is it real?',
  'I clicked a suspicious delivery text link. What should I do right now?',
  'How do I check if an e-commerce website is a cloned scam store?',
  'A Telegram contact promises 20% weekly yield on a crypto platform.',
];

const KNOWLEDGE_BASE: Record<string, { reply: string; checklist: string[]; alertLevel: 'CRITICAL' | 'WARNING' | 'SAFE' }> = {
  otp: {
    reply: 'ABSOLUTE CRITICAL WARNING: This is a classic OTP interception scam. Legitimate bank anti-fraud agents NEVER ask you to verbalize, text, or read back One-Time Passwords. An attacker has triggered a login or wire transfer and needs you to provide the 2FA key.',
    checklist: [
      'Hang up immediately. Do NOT press any numbers or argue.',
      'Check your bank app independently to confirm whether any unauthorized logins occurred.',
      'Call the verified phone number printed on the physical back of your debit/credit card.',
      'Request your bank place an immediate security verbal passphrase on telephone banking.',
    ],
    alertLevel: 'CRITICAL',
  },
  clicked: {
    reply: 'IMMEDIATE MITIGATION PROTOCOL: If you only loaded the link, do not enter any credentials, personal details, or credit cards. If you entered a password, act within the next 5 minutes.',
    checklist: [
      'Do NOT enter passwords, phone numbers, or credit card digits on the loaded page.',
      'Close the tab and clear browser cookies and cache for that session.',
      'If you typed an account password, immediately change that password on the genuine service from a different browser.',
      'If you downloaded an attachment or APK, disconnect your Wi-Fi immediately and run a reputable anti-malware scan.',
    ],
    alertLevel: 'WARNING',
  },
  shop: {
    reply: 'CLONE STORE RECOGNITION: Fraudulent e-commerce sites appear during holiday surges or via social media advertisements offering 80-95% discounts.',
    checklist: [
      'Check Domain Age: Run a free WHOIS check. Legitimate retail brands are registered for years; fake stores are typically less than 60 days old.',
      'Examine Payment Gateways: Fake stores often disable standard credit cards and only accept non-reversible wires, Zelle, or gift cards.',
      'Check Contact Information: Clone stores use generic Gmail addresses or omit physical headquarters addresses and phone numbers.',
    ],
    alertLevel: 'WARNING',
  },
  crypto: {
    reply: 'CRITICAL SCAM ADVISORY: This is a 100% textbook "Pig Butchering" or high-yield investment fraud (HYIP). No legal financial instrument on Earth can guarantee 20% weekly returns.',
    checklist: [
      'Do NOT deposit any additional funds or crypto tokens.',
      'Any balance shown on the trading dashboard is completely simulated by the scammers.',
      'If they demand an "exit tax" or "withdrawal clearance fee", it is an extortion attempt. Cease contact immediately.',
      'Report the wallet address and Telegram handle to IC3.gov and your regional financial conduct authority.',
    ],
    alertLevel: 'CRITICAL',
  },
};

export function AiSafetyAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-0',
      sender: 'assistant',
      text: 'Greetings. I am Aegis, your CyberShield Safety Assistant. Describe any suspicious communication, link, phone call, or transaction you encountered for immediate forensic triage.',
      timestamp: 'Active Now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Analyze text matching knowledge base
    const lower = userText.toLowerCase();
    let responseItem = KNOWLEDGE_BASE.clicked;

    if (lower.includes('otp') || lower.includes('code') || lower.includes('phone') || lower.includes('bank call')) {
      responseItem = KNOWLEDGE_BASE.otp;
    } else if (lower.includes('crypto') || lower.includes('telegram') || lower.includes('yield') || lower.includes('invest')) {
      responseItem = KNOWLEDGE_BASE.crypto;
    } else if (lower.includes('shop') || lower.includes('store') || lower.includes('discount') || lower.includes('buy')) {
      responseItem = KNOWLEDGE_BASE.shop;
    }

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: responseItem.reply,
        checklist: responseItem.checklist,
        alertLevel: responseItem.alertLevel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <section id="assistant" className="py-16 lg:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <Bot className="w-3.5 h-3.5" />
            Aegis AI Safety Sentinel Demo
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Instant Cyber Threat Advice On Demand
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Unsure whether an incoming message is legitimate? Ask Aegis for instant threat triage.
          </p>
        </div>

        {/* Chat Console Card */}
        <div className="rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl flex flex-col h-[520px] overflow-hidden">
          {/* Console Header */}
          <div className="px-6 py-3.5 border-b border-slate-800 bg-[#070b14]/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white font-mono block">
                  AEGIS // SENTINEL CORE v3.1
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Neural Scam Knowledge Base Online
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
              ENCRYPTED DIALOG
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-mono">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-xl p-3.5 space-y-2.5 ${
                    m.sender === 'user'
                      ? 'bg-cyan-600 text-slate-950 font-sans font-medium'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                  {m.alertLevel && (
                    <div className={`p-2 rounded border text-[11px] font-bold ${
                      m.alertLevel === 'CRITICAL'
                        ? 'bg-red-950/60 border-red-500/40 text-red-400'
                        : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                    }`}>
                      THREAT CLASSIFICATION: {m.alertLevel} SEVERITY
                    </div>
                  )}

                  {m.checklist && m.checklist.length > 0 && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-800/80 text-[11px]">
                      <span className="text-slate-400 font-bold uppercase block">
                        Recommended Containment Steps:
                      </span>
                      <ul className="space-y-1 text-slate-300 font-sans">
                        {m.checklist.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <span className="text-[9px] text-slate-500 block text-right font-mono">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-cyan-400 font-mono">
                <Bot className="w-4 h-4 animate-spin" />
                <span>Aegis is triaging threat signatures...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/50 flex gap-2 overflow-x-auto text-[11px] font-mono scrollbar-none">
            {PRESET_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition shrink-0 whitespace-nowrap cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t border-slate-800 bg-[#070b14] flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Aegis about a suspicious email, text message, call, or website..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

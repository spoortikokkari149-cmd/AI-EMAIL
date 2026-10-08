import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Send, 
  CheckCircle2, 
  RotateCcw, 
  Terminal, 
  Mail, 
  Link2, 
  FileText, 
  ShieldAlert,
  Loader2
} from 'lucide-react';

export function ScamReportSection() {
  const [sourceEmail, setSourceEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [threatType, setThreatType] = useState('Phishing');
  const [suspiciousUrl, setSuspiciousUrl] = useState('');
  const [description, setDescription] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [incidentId, setIncidentId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setIncidentId(`INC-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1200);
  };

  const handleReset = () => {
    setSourceEmail('');
    setSubject('');
    setThreatType('Phishing');
    setSuspiciousUrl('');
    setDescription('');
    setAdditionalDetails('');
    setIsSubmitted(false);
  };

  return (
    <section id="report-scam" className="w-full py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
            <AlertOctagon className="w-3.5 h-3.5 text-cyan-400" />
            INCIDENT ESCALATION PORTAL
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Report Suspicious Email or Scam
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
            Submit malicious email lures, phishing landing pages, or fraudulent wire solicitations for threat detonation analysis.
          </p>
        </div>

        {/* Card Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.12)]">
          {/* Demo Notice */}
          <div className="mb-6 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>SIMULATION ENVIRONMENT: Demonstrates SOC Incident Submission workflow</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500">Demo Prototype</span>
          </div>

          {isSubmitted ? (
            /* Success State */
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">
                  Suspicious Email Incident Logged
                </h3>
                <p className="text-xs font-mono text-emerald-400">
                  Assigned Tracking Reference: <strong className="text-white">#{incidentId}</strong>
                </p>
              </div>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you for contributing to threat intelligence. The submitted indicators of compromise (IOCs) have been cataloged for perimeter detonation.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-400 max-w-md w-full text-left space-y-1">
                <div>&bull; Source: <span className="text-slate-200">{sourceEmail || 'N/A'}</span></div>
                <div>&bull; Threat Class: <span className="text-cyan-400">{threatType}</span></div>
                <div>&bull; Status: <span className="text-emerald-400 font-bold">ANALYSIS SIMULATION COMPLETED</span></div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 hover:text-white transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Submit Another Suspicious Item</span>
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source / Sender */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Sender / Source Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={sourceEmail}
                      onChange={(e) => setSourceEmail(e.target.value)}
                      placeholder="e.g. support@micros0ft-login.xyz"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                {/* Threat Type */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Suspected Threat Classification *
                  </label>
                  <select
                    value={threatType}
                    onChange={(e) => setThreatType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="Phishing">Phishing / Credential Harvesting</option>
                    <option value="Business Email Compromise (BEC)">Business Email Compromise (BEC / Wire Scam)</option>
                    <option value="Malicious Link">Malicious Link / Drive-By Download</option>
                    <option value="Malware Attachment">Dangerous File Attachment</option>
                    <option value="OTP / 2FA Fraud">OTP & Multi-Factor Fraud</option>
                    <option value="Investment / Crypto Scam">Investment Scam / Extortion</option>
                    <option value="Other">Other Suspicious Activity</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. URGENT: Your Account Will Be Terminated"
                  className="w-full px-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Suspicious URL */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Suspicious Hyperlink / URL (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={suspiciousUrl}
                    onChange={(e) => setSuspiciousUrl(e.target.value)}
                    placeholder="e.g. hxxps://office365-verify.click/auth"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Description of Malicious Indicator *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail what prompted suspicion: urgent language, unusual sender address, strange payment demands..."
                  className="w-full p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Additional Forensics / Header Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Optional header details, Return-Path, Originating IP, or victim email address..."
                  className="w-full p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono resize-none text-[11px]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Transmitting IOC Telemetry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Transmit Incident Report (Demo)</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

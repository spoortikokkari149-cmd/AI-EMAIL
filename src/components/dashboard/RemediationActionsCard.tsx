import { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  FileJson, 
  FileText, 
  Printer, 
  CheckSquare, 
  Square,
  Share2
} from 'lucide-react';
import type { EmailThreatAnalysis, ParsedEmlData } from '../../types/threat';

interface RemediationActionsCardProps {
  analysis: EmailThreatAnalysis;
  parsed: ParsedEmlData;
}

export function RemediationActionsCard({ analysis, parsed }: RemediationActionsCardProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleDownloadJson = () => {
    const reportData = {
      scanMetadata: {
        timestamp: new Date().toISOString(),
        tool: 'AI Email Threat Detection',
        fileName: parsed.fileName,
      },
      parsedHeaders: parsed.headers,
      analysis,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-report-${parsed.fileName.replace(/\.[^/.]+$/, '')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const md = `
# Cybersecurity Threat Analysis Report: ${parsed.subject}

- **Date of Scan:** ${analysis.analyzedAt}
- **Target File:** ${parsed.fileName}
- **Threat Classification:** ${analysis.threatType}
- **Severity Rating:** ${analysis.threatLevel} (Risk Score: ${analysis.riskScore}/100)
- **Model / Engine:** ${analysis.modelUsed || 'Gemini 3.8 Flash + Cyber Defense Matrix'}

## Executive Summary
${analysis.summary}

## Sender Telemetry
- **From:** ${analysis.senderAnalysis.senderName} <${analysis.senderAnalysis.senderEmail}>
- **Return-Path:** ${analysis.senderAnalysis.returnPath}
- **Reply-To:** ${analysis.senderAnalysis.replyTo}
- **SPF Status:** ${analysis.senderAnalysis.spfStatus}
- **DKIM Status:** ${analysis.senderAnalysis.dkimStatus}
- **DMARC Status:** ${analysis.senderAnalysis.dmarcStatus}
- **Notes:** ${analysis.senderAnalysis.notes}

## Indicators of Compromise (URLs)
${analysis.suspiciousUrls.map(u => `- **Defanged:** \`${u.defangedUrl}\` | Risk: ${u.riskLevel} | Domain: ${u.domain}\n  Reasons: ${u.reasons.join(', ')}`).join('\n') || 'None detected.'}

## Security Findings
${analysis.securityFindings.map(f => `### [${f.severity}] ${f.title} (${f.category})\n${f.description}\n${f.mitreAttackId ? `MITRE: ${f.mitreAttackId}\n` : ''}`).join('\n')}

## Recommended Containment Actions
${analysis.recommendedActions.map(a => `- [ ] ${a}`).join('\n')}
    `.trim();

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-report-${parsed.fileName.replace(/\.[^/.]+$/, '')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Remediation Protocol & Incident Response
          </h3>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition cursor-pointer"
            title="Export JSON IOC"
          >
            <FileJson className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON IOC</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition cursor-pointer"
            title="Download Markdown Report"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Markdown</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            title="Print Threat Brief"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-slate-400">
          Prioritized defense measures recommended by the security analyzer based on detected attack vectors:
        </p>

        <div className="space-y-2 pt-1">
          {analysis.recommendedActions.map((action, idx) => {
            const isDone = !!completedSteps[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`p-3 rounded-xl border text-xs flex items-start gap-3 transition-all cursor-pointer ${
                  isDone 
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200/80 line-through' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-cyan-500/30'
                }`}
              >
                <div className="shrink-0 mt-0.5 text-cyan-400">
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="leading-relaxed">
                  {action}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

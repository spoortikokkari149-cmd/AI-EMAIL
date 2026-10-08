import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileCode, 
  Sparkles, 
  Terminal, 
  FileText, 
  AlertCircle, 
  ShieldAlert, 
  Loader2,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { SAMPLE_EMAILS, type SampleEmailItem } from '../../data/sampleEmails';

interface EmailUploadZoneProps {
  onAnalyze: (rawContent: string, fileName: string) => Promise<void>;
  isAnalyzing: boolean;
}

export function EmailUploadZone({ onAnalyze, isAnalyzing }: EmailUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedContent, setPastedContent] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setUploadError(null);
    if (!file.name.toLowerCase().endsWith('.eml') && !file.type.includes('message') && !file.name.endsWith('.txt')) {
      setUploadError('Please select a valid .eml (RFC 822) email message file.');
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (!content || !content.trim()) {
        setUploadError('The selected .eml file is empty.');
        return;
      }
      await onAnalyze(content, file.name);
    };
    reader.onerror = () => {
      setUploadError('Failed to read the file.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleLoadSample = async (sample: SampleEmailItem) => {
    setUploadError(null);
    setSelectedFileName(`${sample.id}.eml`);
    await onAnalyze(sample.rawEml, `${sample.id}.eml`);
  };

  const handlePastedSubmit = async () => {
    if (!pastedContent.trim()) {
      setUploadError('Please paste RFC 822 email headers and content.');
      return;
    }
    setShowPasteModal(false);
    setSelectedFileName('pasted_message.eml');
    await onAnalyze(pastedContent, 'pasted_message.eml');
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-10 text-center ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
            : 'border-cyan-500/30 bg-slate-900/60 hover:border-cyan-400/60 hover:bg-slate-900/80'
        } backdrop-blur-xl`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".eml,message/rfc822,text/plain"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        {isAnalyzing ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white tracking-wide">
                Executing Forensic Threat Scan...
              </h3>
              <p className="text-xs font-mono text-cyan-300/80">
                Parsing headers &bull; Inspecting URLs &bull; Querying AI Threat Classifier
              </p>
            </div>

            <div className="w-full max-w-xs bg-slate-950 rounded-full h-1.5 overflow-hidden border border-cyan-500/30">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-2/3 animate-[pulse_1.5s_infinite]" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Drag & Drop <span className="text-cyan-400">.eml</span> Email File
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Upload exported email messages from Outlook, Gmail, Apple Mail, or Thunderbird for deep security inspection
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] transition cursor-pointer flex items-center gap-2"
              >
                <FileCode className="w-4 h-4" />
                Browse .eml File
              </button>

              <button
                type="button"
                onClick={() => setShowPasteModal(true)}
                className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-slate-100 text-xs font-medium transition cursor-pointer flex items-center gap-2"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Paste Raw RFC 822 Text
              </button>
            </div>

            {selectedFileName && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
                <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                {selectedFileName}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error notification */}
      {uploadError && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Instant Sample Test Cases */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Pre-Loaded Test Samples</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Click any attack profile to run instant forensic analysis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_EMAILS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleLoadSample(sample)}
              disabled={isAnalyzing}
              className="text-left p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all duration-150 group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${sample.badgeColor}`}>
                  {sample.badge}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                {sample.name}
              </p>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {sample.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Paste Raw Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Paste Raw RFC 822 EML Content</h3>
              </div>
              <button
                onClick={() => setShowPasteModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste the full email text including MIME headers (From, Subject, Received, etc.) and message body.
            </p>

            <textarea
              rows={12}
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
              placeholder={`Received: from mail.example.com...\nFrom: sender@example.com\nTo: recipient@example.com\nSubject: Security alert\n\nEmail body content here...`}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-cyan-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePastedSubmit}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md"
              >
                Analyze Pasted Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

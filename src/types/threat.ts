export type ThreatLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Clean';

export type ThreatType = 
  | 'Phishing'
  | 'Business Email Compromise (BEC)'
  | 'Malware Delivery'
  | 'Credential Harvesting'
  | 'Spam / Extortion'
  | 'Legitimate / Benign'
  | 'Scam'
  | 'Fraud'
  | 'Suspicious'
  | 'Safe';

export interface SuspiciousUrl {
  url: string;
  defangedUrl: string;
  anchorText?: string;
  domain: string;
  riskLevel: 'Malicious' | 'Suspicious' | 'Neutral' | 'Safe';
  reasons: string[];
}

export interface SecurityFinding {
  category: 'Header & Authentication' | 'Urgency & Social Engineering' | 'Malicious Links' | 'Payload & Attachments' | 'Impersonation';
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  title: string;
  description: string;
  mitreAttackId?: string;
}

export interface SenderAnalysis {
  senderName: string;
  senderEmail: string;
  replyTo: string;
  returnPath: string;
  isSpoofed: boolean;
  spfStatus: 'Pass' | 'Fail' | 'SoftFail' | 'None';
  dkimStatus: 'Pass' | 'Fail' | 'None';
  dmarcStatus: 'Pass' | 'Fail' | 'None';
  notes: string;
}

export interface EmailThreatAnalysis {
  threatType: ThreatType;
  threatLevel: ThreatLevel;
  riskScore: number; // 0 - 100
  confidence: number; // 0 - 100
  summary: string;
  senderAnalysis: SenderAnalysis;
  suspiciousUrls: SuspiciousUrl[];
  securityFindings: SecurityFinding[];
  recommendedActions: string[];
  analyzedAt: string;
  modelUsed?: string;
}

export interface ParsedEmlData {
  fileName: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  messageId: string;
  returnPath: string;
  replyTo: string;
  receivedChain: string[];
  headers: Record<string, string>;
  plainText: string;
  htmlText: string;
  extractedUrls: Array<{ url: string; anchorText?: string }>;
  attachments: Array<{ filename: string; contentType: string; size?: number }>;
  rawContent: string;
}

export interface EmailScanRecord {
  id: string;
  userId: string;
  fileName: string;
  subject: string;
  senderEmail: string;
  senderName: string;
  recipientEmail: string;
  threatType: string;
  threatLevel: ThreatLevel;
  riskScore: number;
  confidence: number;
  suspiciousUrlsCount: number;
  findingsCount: number;
  summary: string;
  createdAt: string;
  fullAnalysisJson: string;
}

export interface MessageScamAnalysis {
  threatType: 'Phishing' | 'Scam' | 'Spam' | 'Fraud' | 'Suspicious' | 'Safe';
  threatLevel: ThreatLevel;
  riskScore: number;
  confidence: number;
  detectionReasons: string[];
  explanation: string;
  impersonatedBrand?: string;
  detectedUrls: string[];
  detectedPhones: string[];
  detectedPaymentRequests: string[];
  hasOtpRequest: boolean;
  recommendedActions: string[];
  analyzedAt: string;
  modelUsed?: string;
}

export interface ScreenshotScamAnalysis {
  extractedText: string;
  platformDetected: string;
  threatType: string;
  threatLevel: ThreatLevel;
  riskScore: number;
  confidence: number;
  detectedIndicators: string[];
  suspiciousUrls: string[];
  phoneNumbers: string[];
  paymentUpiRequests: string[];
  hasOtpRequest: boolean;
  impersonationTarget: string;
  explanation: string;
  recommendedAction: string;
  imageUrl?: string;
  analyzedAt: string;
  modelUsed?: string;
}

export type ThreatHistoryType = 'Email' | 'Message' | 'Screenshot' | 'URL';

export interface ThreatHistoryItem {
  id: string;
  userId?: string;
  date: string;
  type: ThreatHistoryType;
  title: string;
  category: string;
  riskScore: number;
  threatLevel: ThreatLevel;
  status: 'Blocked' | 'Quarantined' | 'Flagged' | 'Clean';
  summary: string;
  rawDetails?: any;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
  totalScans: number;
}

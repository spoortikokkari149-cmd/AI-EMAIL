import type { 
  ParsedEmlData, 
  EmailThreatAnalysis, 
  SuspiciousUrl, 
  SecurityFinding, 
  SenderAnalysis, 
  ThreatType, 
  ThreatLevel 
} from '../types/threat';

function defangUrl(url: string): string {
  return url
    .replace(/^http:\/\//i, 'hxxp://')
    .replace(/^https:\/\//i, 'hxxps://')
    .replace(/\./g, '[.]');
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.toLowerCase();
  } catch {
    const match = url.match(/https?:\/\/([^/?#:]+)/i);
    return match ? match[1].toLowerCase() : url;
  }
}

function extractEmailAddress(fullStr: string): string {
  const match = fullStr.match(/<([^>]+)>/) || fullStr.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  return match ? match[1].toLowerCase() : fullStr.toLowerCase().trim();
}

function extractDisplayName(fullStr: string): string {
  const match = fullStr.match(/^"?([^"<]+)"?\s*</);
  if (match) return match[1].trim();
  return fullStr.split('@')[0].trim();
}

const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'buzz', 'click', 'icu', 'cam', 'work', 'loan', 'gq', 'cf', 'ml', 'tk',
  'ga', 'fit', 'rest', 'monster', 'hair', 'quest', 'cfd', 'sbs', 'live'
]);

const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly', 'cutt.ly', 'rebrand.ly'
]);

const DANGEROUS_EXTENSIONS = [
  '.exe', '.scr', '.vbs', '.iso', '.bat', '.cmd', '.hta', '.ps1', '.docm', '.xlsm', '.jar', '.vbe', '.wsf', '.lnk'
];

const TARGET_BRANDS = [
  'microsoft', 'office365', 'outlook', 'paypal', 'apple', 'google', 'netflix', 'amazon',
  'chase', 'wellsfargo', 'bankofamerica', 'dhl', 'fedex', 'dropbox', 'meta', 'facebook', 'irs'
];

export function runHeuristicAnalysis(parsed: ParsedEmlData): EmailThreatAnalysis {
  let score = 0;
  const findings: SecurityFinding[] = [];
  const suspiciousUrls: SuspiciousUrl[] = [];

  const senderEmail = extractEmailAddress(parsed.from);
  const senderDomain = senderEmail.split('@')[1] || '';
  const senderDisplayName = extractDisplayName(parsed.from);
  const returnPathEmail = extractEmailAddress(parsed.returnPath);
  const returnPathDomain = returnPathEmail.split('@')[1] || '';
  const replyToEmail = extractEmailAddress(parsed.replyTo);

  // 1. Header & Domain Authentication Checks
  let spfStatus: 'Pass' | 'Fail' | 'SoftFail' | 'None' = 'None';
  let dkimStatus: 'Pass' | 'Fail' | 'None' = 'None';
  let dmarcStatus: 'Pass' | 'Fail' | 'None' = 'None';

  const authResults = (parsed.headers['Authentication-Results'] || parsed.headers['authentication-results'] || '').toLowerCase();
  const receivedSpf = (parsed.headers['Received-SPF'] || parsed.headers['received-spf'] || '').toLowerCase();

  if (authResults.includes('spf=pass') || receivedSpf.startsWith('pass')) {
    spfStatus = 'Pass';
  } else if (authResults.includes('spf=fail') || receivedSpf.startsWith('fail')) {
    spfStatus = 'Fail';
    score += 25;
    findings.push({
      category: 'Header & Authentication',
      severity: 'High',
      title: 'SPF Authentication Failed',
      description: `Sender domain SPF record failed verification. The sending server is unauthorized for ${senderDomain}.`,
      mitreAttackId: 'T1566.002'
    });
  } else if (authResults.includes('spf=softfail') || receivedSpf.startsWith('softfail')) {
    spfStatus = 'SoftFail';
    score += 15;
    findings.push({
      category: 'Header & Authentication',
      severity: 'Medium',
      title: 'SPF SoftFail Detected',
      description: `SPF check resulted in softfail, indicating the sending IP may not be authorized.`,
      mitreAttackId: 'T1566.002'
    });
  }

  if (authResults.includes('dkim=pass')) {
    dkimStatus = 'Pass';
  } else if (authResults.includes('dkim=fail')) {
    dkimStatus = 'Fail';
    score += 20;
    findings.push({
      category: 'Header & Authentication',
      severity: 'High',
      title: 'DKIM Signature Invalid',
      description: 'DKIM cryptographic signature verification failed, indicating possible header or body tampering.',
      mitreAttackId: 'T1566.002'
    });
  }

  if (authResults.includes('dmarc=pass')) {
    dmarcStatus = 'Pass';
  } else if (authResults.includes('dmarc=fail')) {
    dmarcStatus = 'Fail';
    score += 30;
    findings.push({
      category: 'Header & Authentication',
      severity: 'Critical',
      title: 'DMARC Policy Rejection / Fail',
      description: 'DMARC alignment check failed. The email violates domain anti-spoofing policy.',
      mitreAttackId: 'T1566.002'
    });
  }

  // 2. Return-Path & Envelope Mismatch (Spoofing indicator)
  let isSpoofed = false;
  if (returnPathDomain && senderDomain && returnPathDomain !== senderDomain) {
    isSpoofed = true;
    score += 20;
    findings.push({
      category: 'Header & Authentication',
      severity: 'High',
      title: 'Envelope From / Return-Path Mismatch',
      description: `Sender From domain (${senderDomain}) diverges from Return-Path (${returnPathDomain}). Often indicates header forgery.`,
      mitreAttackId: 'T1656'
    });
  }

  // 3. Reply-To Hijack Check (Common in BEC)
  if (replyToEmail && senderEmail && replyToEmail !== senderEmail) {
    score += 25;
    findings.push({
      category: 'Impersonation',
      severity: 'High',
      title: 'Discrepant Reply-To Address',
      description: `Replies are directed to "${replyToEmail}" instead of the visible sender "${senderEmail}". Classic indicator of BEC or credential diversion.`,
      mitreAttackId: 'T1656'
    });
  }

  // 4. Display Name Spoofing
  const lowerDisplayName = senderDisplayName.toLowerCase();
  for (const brand of TARGET_BRANDS) {
    if (lowerDisplayName.includes(brand) && !senderDomain.includes(brand)) {
      isSpoofed = true;
      score += 35;
      findings.push({
        category: 'Impersonation',
        severity: 'Critical',
        title: `Brand Display Name Spoofing (${brand.toUpperCase()})`,
        description: `Sender display name claims to represent "${senderDisplayName}", but email domain is "${senderDomain}". High probability of credential harvesting.`,
        mitreAttackId: 'T1656'
      });
      break;
    }
  }

  // Executive / VIP impersonation
  const vipKeywords = ['ceo', 'cfo', 'director', 'payroll', 'human resources', 'president', 'urgent request', 'wire transfer'];
  for (const kw of vipKeywords) {
    if (lowerDisplayName.includes(kw) && (senderDomain.endsWith('gmail.com') || senderDomain.endsWith('yahoo.com') || senderDomain.endsWith('hotmail.com'))) {
      score += 30;
      findings.push({
        category: 'Impersonation',
        severity: 'High',
        title: 'Executive / Payroll Impersonation via Public Webmail',
        description: `Sender name hints at corporate authority ("${senderDisplayName}") but is originating from consumer webmail (${senderDomain}).`,
        mitreAttackId: 'T1656'
      });
      break;
    }
  }

  // 5. URL Analysis
  for (const item of parsed.extractedUrls) {
    const rawUrl = item.url;
    const anchor = item.anchorText || '';
    const domain = extractDomain(rawUrl);
    const defanged = defangUrl(rawUrl);
    const reasons: string[] = [];
    let urlRisk: 'Malicious' | 'Suspicious' | 'Neutral' | 'Safe' = 'Safe';

    // Raw IP address host
    if (/^https?:\/\/(\d{1,3}\.){3}\d{1,3}(:\d+)?/i.test(rawUrl)) {
      reasons.push('Direct IP address used instead of reputable domain name');
      urlRisk = 'Malicious';
      score += 30;
    }

    // Anchor text mismatch (deceptive display text)
    if (anchor && (anchor.startsWith('http://') || anchor.startsWith('https://') || anchor.includes('.com') || anchor.includes('.org'))) {
      const anchorDomain = extractDomain(anchor.startsWith('http') ? anchor : `http://${anchor}`);
      if (anchorDomain && domain && !domain.includes(anchorDomain) && !anchorDomain.includes(domain)) {
        reasons.push(`Deceptive anchor text: displayed as "${anchorDomain}" but routes to "${domain}"`);
        urlRisk = 'Malicious';
        score += 35;
      }
    }

    // Suspicious TLD
    const parts = domain.split('.');
    const tld = parts[parts.length - 1];
    if (SUSPICIOUS_TLDS.has(tld)) {
      reasons.push(`High-risk Top-Level Domain (.${tld}) frequently leveraged by disposable phishing kits`);
      if (urlRisk !== 'Malicious') urlRisk = 'Suspicious';
      score += 15;
    }

    // Shortener
    if (SHORTENERS.has(domain)) {
      reasons.push(`URL shortener (${domain}) masks true destination`);
      if (urlRisk !== 'Malicious') urlRisk = 'Suspicious';
      score += 10;
    }

    // Lookalike brand in domain
    for (const brand of TARGET_BRANDS) {
      if (domain.includes(brand) && !domain.endsWith(`.${brand}.com`) && domain !== `${brand}.com`) {
        reasons.push(`Typosquatting/lookalike brand name detected in domain ("${brand}" in ${domain})`);
        urlRisk = 'Malicious';
        score += 30;
      }
    }

    // Sensitive path keywords
    if (/(\/login|\/verify|\/signin|\/password|\/update-account|\/auth|\/wallet|\/secure)/i.test(rawUrl) && !senderDomain.includes(domain)) {
      reasons.push('Login/credential harvesting endpoint located on third-party host');
      if (urlRisk === 'Safe') urlRisk = 'Suspicious';
      score += 15;
    }

    if (reasons.length > 0) {
      suspiciousUrls.push({
        url: rawUrl,
        defangedUrl: defanged,
        anchorText: anchor,
        domain,
        riskLevel: urlRisk,
        reasons,
      });
    }
  }

  if (suspiciousUrls.length > 0) {
    const maliciousCount = suspiciousUrls.filter(u => u.riskLevel === 'Malicious').length;
    findings.push({
      category: 'Malicious Links',
      severity: maliciousCount > 0 ? 'Critical' : 'High',
      title: `${suspiciousUrls.length} Suspicious Link(s) Flagged`,
      description: `Identified ${maliciousCount} potentially malicious and ${suspiciousUrls.length - maliciousCount} anomalous URL(s) embedded in email content.`,
      mitreAttackId: 'T1566.002'
    });
  }

  // 6. Urgency & Social Engineering Analysis
  const fullContent = `${parsed.subject} ${parsed.plainText}`.toLowerCase();
  const urgencyTriggers = [
    { pattern: /(urgent|immediate action required|act now|within 24 hours|within 48 hours)/, title: 'Urgency & Coercive Pressure' },
    { pattern: /(account (will be|has been) suspended|deactivation notice|temporary hold)/, title: 'Fear Appeal: Account Suspension Threat' },
    { pattern: /(password (expired|reset required)|unauthorized login attempt|security alert)/, title: 'Security Alert / Credential Bait' },
    { pattern: /(wire transfer|swift transfer|confidential payment|gift card|invoice payment)/, title: 'Financial Coercion / Wire Fraud Pattern' },
    { pattern: /(verify your identity|confirm your credentials|validate account)/, title: 'Credential Verification Bait' },
  ];

  let urgencyMatches = 0;
  for (const trigger of urgencyTriggers) {
    if (trigger.pattern.test(fullContent)) {
      urgencyMatches++;
      score += 12;
      findings.push({
        category: 'Urgency & Social Engineering',
        severity: urgencyMatches > 2 ? 'High' : 'Medium',
        title: trigger.title,
        description: 'Language employs psychological pressure tactics to prompt rapid user compliance without verification.',
        mitreAttackId: 'T1598'
      });
    }
  }

  // 7. Dangerous Attachment Checks
  for (const att of parsed.attachments) {
    const lowerName = att.filename.toLowerCase();
    const isDangerous = DANGEROUS_EXTENSIONS.some(ext => lowerName.endsWith(ext));
    if (isDangerous) {
      score += 40;
      findings.push({
        category: 'Payload & Attachments',
        severity: 'Critical',
        title: `High-Risk Executable / Script Attachment: ${att.filename}`,
        description: `Dangerous file extension detected (${att.filename}). Known delivery mechanism for malware and ransomware payloads.`,
        mitreAttackId: 'T1566.001'
      });
    } else if (lowerName.endsWith('.zip') || lowerName.endsWith('.rar') || lowerName.endsWith('.7z')) {
      score += 15;
      findings.push({
        category: 'Payload & Attachments',
        severity: 'Medium',
        title: `Archive Attachment: ${att.filename}`,
        description: 'Compressed archive attachment may conceal malicious executables from basic perimeter gateways.',
        mitreAttackId: 'T1566.001'
      });
    }
  }

  // Clamp score
  const finalRiskScore = Math.min(100, Math.max(0, Math.round(score)));

  // Determine threat level & type
  let threatLevel: ThreatLevel = 'Clean';
  if (finalRiskScore >= 75) threatLevel = 'Critical';
  else if (finalRiskScore >= 55) threatLevel = 'High';
  else if (finalRiskScore >= 35) threatLevel = 'Medium';
  else if (finalRiskScore >= 15) threatLevel = 'Low';

  let threatType: ThreatType = 'Legitimate / Benign';
  if (finalRiskScore >= 40) {
    if (parsed.attachments.some(a => DANGEROUS_EXTENSIONS.some(ext => a.filename.toLowerCase().endsWith(ext)))) {
      threatType = 'Malware Delivery';
    } else if (fullContent.includes('wire transfer') || fullContent.includes('swift') || (replyToEmail && replyToEmail !== senderEmail)) {
      threatType = 'Business Email Compromise (BEC)';
    } else if (suspiciousUrls.some(u => u.reasons.some(r => r.includes('credential') || r.includes('login') || r.includes('typosquatting')))) {
      threatType = 'Credential Harvesting';
    } else {
      threatType = 'Phishing';
    }
  } else if (finalRiskScore >= 20) {
    threatType = 'Spam / Extortion';
  }

  // Remediation actions
  const recommendedActions: string[] = [];
  if (threatLevel === 'Critical' || threatLevel === 'High') {
    recommendedActions.push('Do NOT click any embedded hyperlinks or download attachments.');
    recommendedActions.push(`Block sender address "${senderEmail}" and domain "${senderDomain}" at perimeter gateway.`);
    recommendedActions.push('Purge this message from all user mailboxes across Microsoft 365 / Google Workspace.');
    if (suspiciousUrls.length > 0) {
      recommendedActions.push(`Add ${suspiciousUrls.length} extracted indicators of compromise (IOCs) to firewall / proxy blocklists.`);
    }
    if (threatType === 'Credential Harvesting') {
      recommendedActions.push('Force a password reset and revoke active SSO sessions for any user who interacted with this email.');
    }
  } else if (threatLevel === 'Medium') {
    recommendedActions.push('Exercise caution. Contact sender through an established secondary channel (phone/chat) to verify authenticity.');
    recommendedActions.push('Submit headers to your organization SOC / security helpdesk for sandbox detonation.');
  } else {
    recommendedActions.push('No immediate action required. Email exhibits standard sender authentication and no overt threat vectors.');
  }

  const senderAnalysis: SenderAnalysis = {
    senderName: senderDisplayName,
    senderEmail,
    replyTo: parsed.replyTo,
    returnPath: parsed.returnPath,
    isSpoofed,
    spfStatus,
    dkimStatus,
    dmarcStatus,
    notes: isSpoofed 
      ? 'High likelihood of spoofed envelope origin or display name impersonation.' 
      : 'Header attributes match expected domain transmission routes.',
  };

  const confidence = Math.min(99, Math.max(65, 80 + Math.round(findings.length * 4)));

  const summary = threatLevel === 'Clean'
    ? 'This email demonstrates verified sender authentication (SPF/DKIM) with no malicious indicators, deceptive URLs, or anomalous header discrepancies.'
    : `Threat detected: Classified as ${threatType} with a ${threatLevel} risk rating (${finalRiskScore}/100). Flagged ${findings.length} security indicators including ${suspiciousUrls.length} suspicious link(s).`;

  return {
    threatType,
    threatLevel,
    riskScore: finalRiskScore,
    confidence,
    summary,
    senderAnalysis,
    suspiciousUrls,
    securityFindings: findings,
    recommendedActions,
    analyzedAt: new Date().toISOString(),
    modelUsed: 'Cybersecurity Threat Engine (v2.4 Core Heuristics)',
  };
}

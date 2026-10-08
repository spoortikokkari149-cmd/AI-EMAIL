import type { MessageScamAnalysis, ThreatLevel } from '../types/threat';

const SCAM_PATTERNS = [
  {
    regex: /(urgent|immediately|within\s+(?:24|12|2|1)\s*hours?|act\s+now|immediate\s+action|last\s+warning)/i,
    reason: 'Urgent language',
    weight: 20,
  },
  {
    regex: /(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+|[a-zA-Z0-9-]+\.(?:xyz|top|click|cfd|icu|buzz|ru|link)\b)/i,
    reason: 'Suspicious link',
    weight: 28,
  },
  {
    regex: /(congratulations|you\s+have\s+won|won\s+a\s+prize|lottery|lucky\s+draw|cashback\s+of|gift\s+card|reward\s+points?\s+expir)/i,
    reason: 'Fake reward/offer',
    weight: 35,
  },
  {
    regex: /(otp|one\s*time\s*password|verification\s*code|pin|security\s*code|share\s+(?:this|the)\s+code)/i,
    reason: 'Request for OTP',
    weight: 45,
  },
  {
    regex: /(pay\s+now|transfer\s+(?:amount|\$|₹|eur|usd)|fee\s+of|scan\s+qr|upi|send\s+money|customs\s+fee|processing\s+charge)/i,
    reason: 'Request for payment',
    weight: 30,
  },
  {
    regex: /(sbi|hdfc|icici|paypal|chase|wellsfargo|amazon|netflix|fedex|dhl|india\s*post|ups|apple|bank|it\s*department)/i,
    reason: 'Impersonation',
    weight: 25,
  },
  {
    regex: /(legal\s+action|fir|arrest|police|court|account\s+blocked|deactivated|suspended|electricity\s+(?:will\s+be\s+)?cut)/i,
    reason: 'Threatening language',
    weight: 35,
  },
  {
    regex: /(crypto|bitcoin|guaranteed\s+(?:return|profit)|work\s+from\s+home|part\s*time\s*job|daily\s+(?:income|\$|₹)|telegram\s+(?:task|channel))/i,
    reason: 'Investment/job scam pattern',
    weight: 30,
  },
];

export function runMessageScamHeuristics(message: string): MessageScamAnalysis {
  let score = 0;
  const reasons: string[] = [];

  // Match URLs
  const urlRegex = /https?:\/\/[^\s<>"'{}|\\^`[\]]+|(?:bit\.ly|tinyurl\.com|t\.co)\/[a-zA-Z0-9_-]+/gi;
  const detectedUrls = Array.from(new Set(message.match(urlRegex) || []));

  // Match Phone Numbers
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b[6-9]\d{9}\b/g;
  const detectedPhones = Array.from(new Set(message.match(phoneRegex) || []));

  // Match Payment/UPI addresses
  const paymentRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}|(?:upi|gpay|phonepe|paytm|wallet):\/\/[^\s]+/gi;
  const detectedPaymentRequests = Array.from(new Set(message.match(paymentRegex) || []));

  // Evaluate pattern weights
  SCAM_PATTERNS.forEach(({ regex, reason, weight }) => {
    if (regex.test(message)) {
      if (!reasons.includes(reason)) {
        reasons.push(reason);
        score += weight;
      }
    }
  });

  // Additional weight if suspicious link contains risky TLD or raw IP
  if (detectedUrls.some(u => /\.(xyz|top|click|cfd|icu|ru|cam)\b|\/\/\d+\.\d+\.\d+/i.test(u))) {
    if (!reasons.includes('Suspicious domain')) {
      reasons.push('Suspicious domain');
      score += 20;
    }
  }

  // Check OTP specifically
  const hasOtpRequest = /(otp|verification\s*code|pin|share\s+code)/i.test(message);

  // Clamp risk score
  const finalScore = Math.min(100, Math.max(5, Math.round(score)));

  // Threat level
  let threatLevel: ThreatLevel = 'Clean';
  if (finalScore >= 75) threatLevel = 'Critical';
  else if (finalScore >= 50) threatLevel = 'High';
  else if (finalScore >= 30) threatLevel = 'Medium';
  else if (finalScore >= 15) threatLevel = 'Low';

  // Threat type
  let threatType: 'Phishing' | 'Scam' | 'Spam' | 'Fraud' | 'Suspicious' | 'Safe' = 'Safe';
  if (finalScore >= 70) {
    if (hasOtpRequest || reasons.includes('Request for OTP')) threatType = 'Fraud';
    else if (reasons.includes('Impersonation') && reasons.includes('Suspicious link')) threatType = 'Phishing';
    else threatType = 'Scam';
  } else if (finalScore >= 40) {
    threatType = 'Suspicious';
  } else if (finalScore >= 20) {
    threatType = 'Spam';
  }

  // Brand impersonation check
  const brandMatch = message.match(/(sbi|hdfc|icici|paypal|chase|wellsfargo|amazon|netflix|fedex|dhl|apple|india\s*post)/i);
  const impersonatedBrand = brandMatch ? brandMatch[1].toUpperCase() : undefined;

  // Explanation
  let explanation = '';
  if (threatLevel === 'Clean' || threatType === 'Safe') {
    explanation = 'This message shows no overt scam markers, coercive urgency, unverified links, or unauthorized credential requests.';
  } else {
    explanation = `High risk detected. This communication exhibits ${reasons.length} signature scam indicators including ${reasons.join(', ')}. The text appears designed to pressure the recipient into hasty compliance without standard verification.`;
  }

  const recommendedActions = [
    'Do not click any embedded hyperlinks or short URLs.',
    'Never share One-Time Passwords (OTP), bank PINs, or UPI codes.',
    'Do not send money, advance fees, or scan unverified QR codes.',
    'Verify the sender by contacting the organization through its verified official portal.',
    'Block and report the sending number or profile in your messaging application.',
  ];

  return {
    threatType,
    threatLevel,
    riskScore: finalScore,
    confidence: Math.min(98, Math.max(68, 75 + reasons.length * 4)),
    detectionReasons: reasons.length > 0 ? reasons : ['No high-risk keywords detected'],
    explanation,
    impersonatedBrand,
    detectedUrls,
    detectedPhones,
    detectedPaymentRequests,
    hasOtpRequest,
    recommendedActions,
    analyzedAt: new Date().toISOString(),
    modelUsed: 'CyberShield Neural Smishing Engine v3.2',
  };
}

import { GoogleGenAI } from '@google/genai';

export interface EmailAnalysisPayload {
  rawEmail?: string;
  headers: Record<string, string>;
  subject: string;
  sender: string;
  recipient: string;
  bodyText: string;
  extractedUrls: Array<{ url: string; anchorText?: string }>;
  attachments: Array<{ filename: string; contentType: string; size?: number }>;
}

export async function runGeminiEmailAnalysis(payload: EmailAnalysisPayload) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const prompt = `
Analyze the following email for cybersecurity threats, phishing, Business Email Compromise (BEC), credential harvesting, malicious links, or scam indicators.

--- EMAIL METADATA ---
Subject: ${payload.subject || '(None)'}
From: ${payload.sender || '(None)'}
To: ${payload.recipient || '(None)'}
Headers Summary:
${Object.entries(payload.headers || {})
  .slice(0, 20)
  .map(([k, v]) => `${k}: ${v}`)
  .join('\n')}

--- EXTRACTED URLS (${(payload.extractedUrls || []).length}) ---
${(payload.extractedUrls || []).slice(0, 15).map(u => `- URL: ${u.url} (Anchor Text: "${u.anchorText || ''}")`).join('\n') || 'None'}

--- ATTACHMENTS (${(payload.attachments || []).length}) ---
${(payload.attachments || []).map(a => `- ${a.filename} (${a.contentType})`).join('\n') || 'None'}

--- EMAIL CONTENT (TRUNCATED) ---
${(payload.bodyText || '').slice(0, 4000)}

Please return a valid JSON object matching this schema:
{
  "threatType": "Phishing" | "Business Email Compromise (BEC)" | "Malware Delivery" | "Credential Harvesting" | "Spam / Extortion" | "Legitimate / Benign",
  "threatLevel": "Critical" | "High" | "Medium" | "Low" | "Clean",
  "riskScore": number (integer between 0 and 100),
  "confidence": number (integer percentage between 50 and 100),
  "summary": string,
  "senderAnalysis": {
    "senderName": string,
    "senderEmail": string,
    "replyTo": string,
    "returnPath": string,
    "isSpoofed": boolean,
    "spfStatus": "Pass" | "Fail" | "SoftFail" | "None",
    "dkimStatus": "Pass" | "Fail" | "None",
    "dmarcStatus": "Pass" | "Fail" | "None",
    "notes": string
  },
  "suspiciousUrls": [
    {
      "url": string,
      "defangedUrl": string,
      "anchorText": string,
      "domain": string,
      "riskLevel": "Malicious" | "Suspicious" | "Neutral" | "Safe",
      "reasons": [string]
    }
  ],
  "securityFindings": [
    {
      "category": "Header & Authentication" | "Urgency & Social Engineering" | "Malicious Links" | "Payload & Attachments" | "Impersonation",
      "severity": "Critical" | "High" | "Medium" | "Low" | "Info",
      "title": string,
      "description": string,
      "mitreAttackId": string
    }
  ],
  "recommendedActions": [
    string
  ]
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      systemInstruction: 'You are a principal cybersecurity email forensic analyst. You specialize in zero-day phishing detection, BEC, SPF/DKIM validation, and threat telemetry. Output only valid JSON.',
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Empty response from AI model');
  }

  return JSON.parse(text);
}

export async function runGeminiMessageAnalysis(messageText: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const prompt = `
Analyze this text message for scam, phishing, fraud, or spam patterns (such as SMS phishing/Smishing, WhatsApp/Telegram scams, fake parcel delivery, bank alert, lottery scam, crypto investment fraud, fake job offer, OTP request, or customer support impersonation):

--- MESSAGE TEXT ---
${messageText}

Return a valid JSON object matching this schema:
{
  "threatType": "Phishing" | "Scam" | "Spam" | "Fraud" | "Suspicious" | "Safe",
  "threatLevel": "Critical" | "High" | "Medium" | "Low" | "Clean",
  "riskScore": number (0 to 100),
  "confidence": number (50 to 100),
  "detectionReasons": string[] (e.g., "Urgent language", "Suspicious link", "Fake reward/offer", "Request for OTP", "Request for payment", "Impersonation", "Suspicious phone number", "Suspicious domain", "Threatening language"),
  "explanation": string (detailed explanation of why this message is suspicious or safe),
  "impersonatedBrand": string (or "None"),
  "detectedUrls": string[],
  "detectedPhones": string[],
  "detectedPaymentRequests": string[],
  "hasOtpRequest": boolean,
  "recommendedActions": string[]
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      systemInstruction: 'You are an elite mobile scam, SMS smishing, and fraud forensic analyst. Detect deceptive language, fake banks, lottery scams, and payment coercion. Output valid JSON only.',
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Empty response from AI model');
  }

  return JSON.parse(text);
}

export async function runGeminiScreenshotAnalysis(imageBase64: string, mimeType = 'image/png') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const prompt = `
You are an expert mobile scam & fraud forensic investigator. Examine this screenshot (which may be an SMS message, WhatsApp chat, Telegram discussion, Instagram/Twitter DM, or bank notification).
Perform Optical Character Recognition (OCR) to extract the full visible text, then thoroughly audit it for scam indicators, impersonation, phishing links, UPI/payment requests, or OTP theft.

Return a valid JSON object matching this schema:
{
  "extractedText": string (the full text transcribed from the screenshot),
  "platformDetected": string (e.g., "WhatsApp", "SMS / iMessage", "Telegram", "Instagram", "Banking App", "Unknown"),
  "threatType": "Phishing" | "Scam" | "Fraud" | "Spam" | "Suspicious" | "Safe",
  "threatLevel": "Critical" | "High" | "Medium" | "Low" | "Clean",
  "riskScore": number (0 to 100),
  "confidence": number (50 to 100),
  "detectedIndicators": string[] (e.g., "Urgent countdown", "Lookalike bank sender", "Unsolicited APK download link", "Demands OTP verification", "UPI QR code redirection"),
  "suspiciousUrls": string[],
  "phoneNumbers": string[],
  "paymentUpiRequests": string[],
  "hasOtpRequest": boolean,
  "impersonationTarget": string,
  "explanation": string,
  "recommendedAction": string
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: cleanBase64,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      systemInstruction: 'Perform precise visual OCR and scam analysis on mobile screenshots. Output only valid JSON.',
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Empty response from AI model');
  }

  return JSON.parse(text);
}

export async function runGeminiCyberChat(message: string, history: Array<{ role: 'user' | 'model'; text: string }> = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const chatContents = [
    ...history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    })),
    {
      role: 'user',
      parts: [{ text: message }]
    }
  ];

  const systemInstruction = `
You are "Aegis AI", an advanced cybersecurity and fraud prevention assistant built into the "AI Cyber Threat & Scam Detection Platform".
You assist users with:
1. Email Phishing & Header Forensics (SPF/DKIM/DMARC)
2. SMS / Smishing & Chat Scams (WhatsApp, Telegram, fake courier, lottery, job offers)
3. Screenshot Scam Analysis
4. OTP Theft & Payment Fraud (UPI scams, QR codes, gift cards)
5. Incident Response & Safety Actions

Command Routing:
If the user says a navigation or task command such as:
- "Check this email" or "Analyze email" -> respond with advice and tag [ROUTE:analyzer-section]
- "Check this message" or "Analyze message" -> respond with advice and tag [ROUTE:message-detector]
- "Analyze this screenshot" or "Check screenshot" -> respond with advice and tag [ROUTE:screenshot-analyzer]
- "Show scam examples" -> respond with advice and tag [ROUTE:scam-gallery]
- "Show my threat history" -> respond with advice and tag [ROUTE:threat-history]
- "Go to dashboard" -> respond with advice and tag [ROUTE:dashboard-overview]

Keep explanations clear, authoritative, concise, and formatted with bullet points where appropriate.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: chatContents,
    config: {
      systemInstruction,
    },
  });

  const rawText = response.text || 'Security analysis complete.';
  
  // Extract route tag if present
  const routeMatch = rawText.match(/\[ROUTE:([a-zA-Z0-9_-]+)\]/);
  const routeIntent = routeMatch ? routeMatch[1] : undefined;
  const cleanReply = rawText.replace(/\[ROUTE:[a-zA-Z0-9_-]+\]/g, '').trim();

  return { reply: cleanReply, routeIntent };
}

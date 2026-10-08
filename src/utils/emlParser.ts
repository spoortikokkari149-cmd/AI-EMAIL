import type { ParsedEmlData } from '../types/threat';

function decodeMimeWord(str: string): string {
  return str.replace(/=\?([^?]+)\?([BQbq])\?([^?]+)\?=/g, (_, _charset, encoding, encodedText) => {
    try {
      if (encoding.toUpperCase() === 'B') {
        return atob(encodedText);
      } else if (encoding.toUpperCase() === 'Q') {
        return encodedText.replace(/=([0-9A-Fa-f]{2})/g, (_m: string, hex: string) =>
          String.fromCharCode(parseInt(hex, 16))
        ).replace(/_/g, ' ');
      }
    } catch {
      return encodedText;
    }
    return encodedText;
  });
}

function cleanHtmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseEmlContent(raw: string, fileName = 'email.eml'): ParsedEmlData {
  // Normalize line breaks
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split headers and body at first blank line
  const splitIndex = normalized.indexOf('\n\n');
  const headerBlock = splitIndex !== -1 ? normalized.slice(0, splitIndex) : normalized;
  const bodyBlock = splitIndex !== -1 ? normalized.slice(splitIndex + 2) : '';

  // Parse headers with multiline unfolding
  const headers: Record<string, string> = {};
  const receivedChain: string[] = [];
  const lines = headerBlock.split('\n');
  let currentKey = '';
  let currentValue = '';

  for (const line of lines) {
    if (/^\s+/.test(line)) {
      // Continuation of previous header line
      if (currentKey) {
        currentValue += ' ' + line.trim();
      }
    } else {
      if (currentKey) {
        const decoded = decodeMimeWord(currentValue.trim());
        if (currentKey.toLowerCase() === 'received') {
          receivedChain.push(decoded);
        } else {
          headers[currentKey] = decoded;
        }
      }
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        currentKey = line.slice(0, colonIndex).trim();
        currentValue = line.slice(colonIndex + 1).trim();
      } else {
        currentKey = '';
        currentValue = '';
      }
    }
  }

  if (currentKey) {
    const decoded = decodeMimeWord(currentValue.trim());
    if (currentKey.toLowerCase() === 'received') {
      receivedChain.push(decoded);
    } else {
      headers[currentKey] = decoded;
    }
  }

  // Find header values case-insensitively
  const getHeader = (name: string): string => {
    const target = name.toLowerCase();
    for (const [k, v] of Object.entries(headers)) {
      if (k.toLowerCase() === target) return v;
    }
    return '';
  };

  const subject = getHeader('Subject') || '(No Subject)';
  const from = getHeader('From') || '';
  const to = getHeader('To') || '';
  const date = getHeader('Date') || '';
  const messageId = getHeader('Message-ID') || '';
  const returnPath = getHeader('Return-Path') || '';
  const replyTo = getHeader('Reply-To') || '';
  const contentType = getHeader('Content-Type') || '';

  let plainText = '';
  let htmlText = '';
  const attachments: Array<{ filename: string; contentType: string; size?: number }> = [];

  // Check for multipart boundary
  const boundaryMatch = contentType.match(/boundary=["']?([^"';]+)["']?/i);
  if (boundaryMatch) {
    const boundary = boundaryMatch[1];
    const parts = bodyBlock.split(new RegExp(`--${boundary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:--)?`));

    for (const part of parts) {
      const trimmedPart = part.trim();
      if (!trimmedPart) continue;

      const partSplit = trimmedPart.indexOf('\n\n');
      const partHeaders = partSplit !== -1 ? trimmedPart.slice(0, partSplit) : '';
      const partBody = partSplit !== -1 ? trimmedPart.slice(partSplit + 2) : trimmedPart;

      const partContentType = (partHeaders.match(/Content-Type:\s*([^;\s\n]+)/i)?.[1] || '').toLowerCase();
      const filenameMatch = partHeaders.match(/filename=["']?([^"';\n]+)["']?/i) ||
                            partHeaders.match(/name=["']?([^"';\n]+)["']?/i);

      if (filenameMatch) {
        attachments.push({
          filename: decodeMimeWord(filenameMatch[1]),
          contentType: partContentType || 'application/octet-stream',
          size: partBody.length,
        });
      } else if (partContentType.includes('text/html')) {
        htmlText += partBody + '\n';
      } else if (partContentType.includes('text/plain')) {
        plainText += partBody + '\n';
      } else if (!plainText && !htmlText) {
        plainText += partBody + '\n';
      }
    }
  } else {
    if (contentType.toLowerCase().includes('text/html')) {
      htmlText = bodyBlock;
    } else {
      plainText = bodyBlock;
    }
  }

  // Fallback body conversions
  if (!plainText && htmlText) {
    plainText = cleanHtmlToText(htmlText);
  }

  // Extract URLs and Anchor pairs
  const extractedUrls: Array<{ url: string; anchorText?: string }> = [];
  const seenUrls = new Set<string>();

  // Extract from HTML <a> tags first
  if (htmlText) {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = linkRegex.exec(htmlText)) !== null) {
      const url = match[1].trim();
      const anchor = cleanHtmlToText(match[2]).trim();
      if (url.startsWith('http://') || url.startsWith('https://')) {
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          extractedUrls.push({ url, anchorText: anchor });
        }
      }
    }
  }

  // Extract from raw plain text as well
  const rawUrlRegex = /https?:\/\/[^\s<>"'{}|\\^`[\]]+/gi;
  let rawMatch;
  while ((rawMatch = rawUrlRegex.exec(plainText)) !== null) {
    const url = rawMatch[0].replace(/[.,;:)!]+$/, ''); // Strip trailing punctuation
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      extractedUrls.push({ url, anchorText: '' });
    }
  }

  return {
    fileName,
    subject,
    from,
    to,
    date,
    messageId,
    returnPath,
    replyTo,
    receivedChain,
    headers,
    plainText: plainText.trim(),
    htmlText: htmlText.trim(),
    extractedUrls,
    attachments,
    rawContent: raw,
  };
}

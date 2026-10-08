import { parseEmlContent } from '../utils/emlParser';
import { runHeuristicAnalysis } from '../utils/heuristicEngine';
import type { 
  EmailThreatAnalysis, 
  ParsedEmlData, 
  EmailScanRecord 
} from '../types/threat';
import { 
  db, 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';

export async function processAndAnalyzeEmail(
  rawContent: string,
  fileName: string,
  userId: string
): Promise<{ parsed: ParsedEmlData; analysis: EmailThreatAnalysis; scanId: string }> {
  // 1. Parse EML
  const parsed = parseEmlContent(rawContent, fileName);

  // 2. Run local heuristics first
  const heuristicAnalysis = runHeuristicAnalysis(parsed);
  let finalAnalysis = heuristicAnalysis;

  // 3. Attempt server-side Gemini threat analysis
  try {
    const res = await fetch('/api/analyze-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: parsed.subject,
        sender: parsed.from,
        recipient: parsed.to,
        headers: parsed.headers,
        extractedUrls: parsed.extractedUrls,
        attachments: parsed.attachments,
        bodyText: parsed.plainText || parsed.htmlText,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const aiData = json.data;
        // Merge AI analysis with heuristic findings for high-confidence cybersecurity intelligence
        finalAnalysis = {
          threatType: aiData.threatType || heuristicAnalysis.threatType,
          threatLevel: aiData.threatLevel || heuristicAnalysis.threatLevel,
          riskScore: typeof aiData.riskScore === 'number' ? aiData.riskScore : heuristicAnalysis.riskScore,
          confidence: typeof aiData.confidence === 'number' ? aiData.confidence : heuristicAnalysis.confidence,
          summary: aiData.summary || heuristicAnalysis.summary,
          senderAnalysis: {
            ...heuristicAnalysis.senderAnalysis,
            ...(aiData.senderAnalysis || {}),
          },
          suspiciousUrls: (aiData.suspiciousUrls && aiData.suspiciousUrls.length > 0)
            ? aiData.suspiciousUrls
            : heuristicAnalysis.suspiciousUrls,
          securityFindings: (aiData.securityFindings && aiData.securityFindings.length > 0)
            ? [
                ...aiData.securityFindings,
                ...heuristicAnalysis.securityFindings.filter(
                  hf => !aiData.securityFindings.some((af: { title: string }) => af.title === hf.title)
                ),
              ]
            : heuristicAnalysis.securityFindings,
          recommendedActions: (aiData.recommendedActions && aiData.recommendedActions.length > 0)
            ? aiData.recommendedActions
            : heuristicAnalysis.recommendedActions,
          analyzedAt: new Date().toISOString(),
          modelUsed: 'Gemini 3.8 Flash + Cyber Defense Matrix',
        };
      }
    }
  } catch (err) {
    console.warn('Server AI analysis not reachable; using specialized SOC heuristics:', err);
  }

  // 4. Save to Firestore
  const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const scanRecord: EmailScanRecord = {
    id: scanId,
    userId,
    fileName: parsed.fileName.slice(0, 255),
    subject: parsed.subject.slice(0, 255),
    senderEmail: finalAnalysis.senderAnalysis.senderEmail.slice(0, 255),
    senderName: finalAnalysis.senderAnalysis.senderName.slice(0, 255),
    recipientEmail: parsed.to.slice(0, 255),
    threatType: finalAnalysis.threatType,
    threatLevel: finalAnalysis.threatLevel,
    riskScore: finalAnalysis.riskScore,
    confidence: finalAnalysis.confidence,
    suspiciousUrlsCount: finalAnalysis.suspiciousUrls.length,
    findingsCount: finalAnalysis.securityFindings.length,
    summary: finalAnalysis.summary.slice(0, 1000),
    createdAt: new Date().toISOString(),
    fullAnalysisJson: JSON.stringify({
      analysis: finalAnalysis,
      parsed: {
        ...parsed,
        rawContent: parsed.rawContent.slice(0, 20000), // Cap raw length to protect storage
      },
    }),
  };

  try {
    const scanRef = doc(db, 'emailScans', scanId);
    await setDoc(scanRef, scanRecord);
  } catch (err) {
    console.warn('Scan record save to Firestore notice:', err);
    try {
      handleFirestoreError(err, OperationType.CREATE, `emailScans/${scanId}`);
    } catch {
      // Allow user to view scan even if DB write was interrupted
    }
  }

  return { parsed, analysis: finalAnalysis, scanId };
}

export async function fetchUserScans(userId: string): Promise<EmailScanRecord[]> {
  try {
    const scansRef = collection(db, 'emailScans');
    const q = query(scansRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const results: EmailScanRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push(docSnap.data() as EmailScanRecord);
    });
    // Sort descending by createdAt
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('Error fetching user scans from Firestore:', err);
    try {
      handleFirestoreError(err, OperationType.LIST, 'emailScans');
    } catch {
      // Return empty array on failure
    }
    return [];
  }
}

export async function deleteUserScan(scanId: string): Promise<void> {
  try {
    const scanRef = doc(db, 'emailScans', scanId);
    await deleteDoc(scanRef);
  } catch (err) {
    console.error('Error deleting scan:', err);
    handleFirestoreError(err, OperationType.DELETE, `emailScans/${scanId}`);
  }
}

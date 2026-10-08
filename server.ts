import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { 
  runGeminiEmailAnalysis, 
  runGeminiMessageAnalysis, 
  runGeminiScreenshotAnalysis, 
  runGeminiCyberChat 
} from './src/server/geminiAnalyze.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

app.post('/api/analyze-email', async (req, res) => {
  try {
    const analysis = await runGeminiEmailAnalysis(req.body);
    res.json({ success: true, data: analysis });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Server error analyzing email:', message);
    res.json({ success: false, error: message });
  }
});

app.post('/api/analyze-message', async (req, res) => {
  try {
    const analysis = await runGeminiMessageAnalysis(req.body.message || '');
    res.json({ success: true, data: analysis });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Server error analyzing message:', message);
    res.json({ success: false, error: message });
  }
});

app.post('/api/analyze-screenshot', async (req, res) => {
  try {
    const analysis = await runGeminiScreenshotAnalysis(req.body.image || '', req.body.mimeType || 'image/png');
    res.json({ success: true, data: analysis });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Server error analyzing screenshot:', message);
    res.json({ success: false, error: message });
  }
});

app.post('/api/ai-assistant', async (req, res) => {
  try {
    const chatResult = await runGeminiCyberChat(req.body.message || '', req.body.history || []);
    res.json({ success: true, reply: chatResult.reply, routeIntent: chatResult.routeIntent });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Server error in AI assistant:', message);
    res.json({ success: false, error: message });
  }
});

// Serve frontend static build if exists
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AI Cyber Threat & Scam Detection Platform running on port ${PORT}`);
});

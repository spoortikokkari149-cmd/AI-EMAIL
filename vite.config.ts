import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { 
  runGeminiEmailAnalysis, 
  runGeminiMessageAnalysis, 
  runGeminiScreenshotAnalysis, 
  runGeminiCyberChat 
} from './src/server/geminiAnalyze';

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Helper to read body
        const readBody = (): Promise<string> => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              resolve(body);
            });
          });
        };

        if (req.url === '/api/analyze-email' && req.method === 'POST') {
          const body = await readBody();
          try {
            const payload = JSON.parse(body);
            const analysis = await runGeminiEmailAnalysis(payload);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, data: analysis }));
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error('[API /api/analyze-email error]:', message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: false, error: message }));
          }
          return;
        }

        if (req.url === '/api/analyze-message' && req.method === 'POST') {
          const body = await readBody();
          try {
            const payload = JSON.parse(body);
            const analysis = await runGeminiMessageAnalysis(payload.message || '');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, data: analysis }));
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error('[API /api/analyze-message error]:', message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: false, error: message }));
          }
          return;
        }

        if (req.url === '/api/analyze-screenshot' && req.method === 'POST') {
          const body = await readBody();
          try {
            const payload = JSON.parse(body);
            const analysis = await runGeminiScreenshotAnalysis(payload.image || '', payload.mimeType || 'image/png');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, data: analysis }));
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error('[API /api/analyze-screenshot error]:', message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: false, error: message }));
          }
          return;
        }

        if (req.url === '/api/ai-assistant' && req.method === 'POST') {
          const body = await readBody();
          try {
            const payload = JSON.parse(body);
            const chatResult = await runGeminiCyberChat(payload.message || '', payload.history || []);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, reply: chatResult.reply, routeIntent: chatResult.routeIntent }));
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error('[API /api/ai-assistant error]:', message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: false, error: message }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

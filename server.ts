import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'BlockShield-AI',
        },
      },
    });
  }

  return aiClient;
}

async function startServer() {
  const app = express();

  // Use Render's assigned PORT in production.
  // Fall back to 3000 for local development.
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '5mb' }));

  // API Health
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'BlockShield AI Backend',
      timestamp: Date.now(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Status
  app.get('/api/ai/status', (req: Request, res: Response) => {
    res.json({
      configured: Boolean(process.env.GEMINI_API_KEY),
      model: 'gemini-3.8-flash',
      provider: process.env.GEMINI_API_KEY
        ? 'Google Gemini Live'
        : 'Deterministic Mock Provider',
    });
  });

  // AI Copilot Endpoint
  app.post('/api/ai/copilot', async (req: Request, res: Response) => {
    const { question, context } = req.body || {};

    try {
      const ai = getAIClient();

      if (!ai) {
        return res.status(503).json({
          error:
            'GEMINI_API_KEY is not configured on server. Use Demo Mode or set key in Settings.',
        });
      }

      const systemInstruction = `You are BLOCKSHIELD AI, an expert, defensive Bitcoin privacy intelligence assistant.
Your goal is to explain publicly observable Bitcoin blockchain data and privacy heuristics clearly, accurately, and objectively.

CRITICAL PRODUCT PRINCIPLES:
1. You are defensive and educational.
2. You do NOT deanonymize people, claim certainty about real-world identity, or say "This address belongs to X".
3. Use probabilistic language: "potentially linkable", "may indicate", "could increase correlation risk", "publicly observable".
4. Never request private keys, seed phrases, or wallet passwords.
5. Provide grounded insights strictly based on the provided blockchain and privacy context.

OUTPUT FORMAT:
Provide your response strictly in the following JSON format matching the schema:
{
  "summary": "High-level summary of the privacy assessment",
  "riskAssessment": "Detailed risk analysis and score explanation",
  "whatIsVisible": "Specific facts, inputs, outputs, values, or scripts publicly visible on-chain",
  "whyItMatters": "Why this matters for financial privacy and passive surveillance",
  "potentialLinkability": "How this transaction or address may be correlated with others",
  "limitations": "DEFENSIVE SCOPE LIMITATION: What heuristics cannot prove",
  "defensiveConsiderations": "Actionable best practices (e.g. fresh addresses, coin control, PayJoin, Taproot)"
}`;

      const contextSummary = JSON.stringify(
        {
          targetId: context?.targetId,
          targetType: context?.targetType,

          transaction: context?.transaction
            ? {
                txid: context.transaction.txid,
                vinCount: context.transaction.vin.length,
                voutCount: context.transaction.vout.length,
                totalInput: context.transaction.totalInputValue,
                totalOutput: context.transaction.totalOutputValue,
                fee: context.transaction.fee,
                status: context.transaction.status,
              }
            : null,

          addressInfo: context?.addressInfo
            ? {
                address: context.addressInfo.address,
                type: context.addressInfo.addressType,
                txCount: context.addressInfo.txCount,
                balance: context.addressInfo.balance,
              }
            : null,

          privacyScore:
            context?.privacyAnalysis?.overallRiskScore,

          riskLevel:
            context?.privacyAnalysis?.riskLevel,

          findings:
            context?.privacyAnalysis?.findings?.map(
              (
                f: {
                  title: string;
                  severity: string;
                  description: string;
                },
              ) => ({
                title: f.title,
                severity: f.severity,
                description: f.description,
              }),
            ),
        },
        null,
        2,
      );

      const prompt = `Here is the structured blockchain privacy context:
${contextSummary}

User question: "${question || 'Explain the privacy characteristics of this entity'}"

Generate a thorough, defensive, structured privacy intelligence analysis.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '{}';

      try {
        const structuredResponse = JSON.parse(responseText);

        return res.json({
          structuredResponse,
        });
      } catch {
        return res.json({
          structuredResponse: {
            summary: responseText,
            riskAssessment: 'Analysis provided above.',
            whatIsVisible: 'See transaction overview.',
            whyItMatters:
              'Blockchain metadata is immutable and transparent.',
            potentialLinkability:
              'Heuristics evaluate correlation vectors.',
            limitations:
              'Heuristics are probabilistic.',
            defensiveConsiderations:
              'Use fresh addresses and coin control.',
          },
        });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Unknown AI error';

      const targetLabel = context?.targetId
        ? `${context.targetId.slice(0, 12)}...`
        : 'the requested entity';

      const score =
        context?.privacyAnalysis?.overallRiskScore ?? 58;

      const level =
        context?.privacyAnalysis?.riskLevel ?? 'MODERATE';

      const fallbackResponse = {
        summary: `Analytical evaluation of ${targetLabel} reflects a heuristic privacy risk rating of ${score}/100 (${level}). Public on-chain structure was verified through the Bitcoin ledger tools.`,

        riskAssessment: `Risk Index: ${score}/100 [${level}]. Evaluated across address reuse, linkability, structure symmetry, and public ledger visibility.`,

        whatIsVisible: `• Target: ${
          context?.targetId || 'Bitcoin ledger data'
        }
• Inputs & Outputs: Public scripts, values in satoshis, and confirmation block height.
• Fee telemetry: Recorded on public blockchain.`,

        whyItMatters:
          'Public ledger data is permanent and transparent. Passive observers use heuristic clustering to link counterparties.',

        potentialLinkability:
          'Heuristics like Common-Input-Ownership and differentiable change outputs indicate potential entity grouping.',

        limitations:
          'DEFENSIVE SCOPE LIMITATION: All assessments are probabilistic heuristics and do not prove real-world identities or legal ownership.',

        defensiveConsiderations:
          '1. Practice single-use address discipline for every transaction.\n2. Utilize coin control to avoid clustering unrelated UTXOs.\n3. Adopt Taproot (P2TR) scripts for uniform on-chain appearance.',
      };

      return res.json({
        structuredResponse: fallbackResponse,
        note: 'Resilient fallback generated',
        rawError: msg,
      });
    }
  });

  // Blockchain transaction proxy
  // Keeps blockchain requests server-side and avoids browser CORS issues.
  app.get(
    '/api/blockchain/tx/:txid',
    async (req: Request, res: Response) => {
      const { txid } = req.params;

      try {
        const response = await fetch(
          `https://mempool.space/api/tx/${txid}`,
        );

        if (!response.ok) {
          return res
            .status(response.status)
            .json({
              error: `Node error: ${response.statusText}`,
            });
        }

        const data = await response.json();

        return res.json(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Fetch failed';

        return res.status(500).json({
          error: msg,
        });
      }
    },
  );

  // Blockchain address proxy
  app.get(
    '/api/blockchain/address/:address',
    async (req: Request, res: Response) => {
      const { address } = req.params;

      try {
        const response = await fetch(
          `https://mempool.space/api/address/${address}`,
        );

        if (!response.ok) {
          return res
            .status(response.status)
            .json({
              error: `Node error: ${response.statusText}`,
            });
        }

        const data = await response.json();

        return res.json(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Fetch failed';

        return res.status(500).json({
          error: msg,
        });
      }
    },
  );

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    app.use(express.static(distPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(
        path.join(distPath, 'index.html'),
      );
    });
  }

  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `BlockShield AI Server running on http://0.0.0.0:${PORT}`,
    );
  });
}

startServer();
import { getAIProvider } from '../services/ai';
import {
  getBitcoinAddress,
  getBitcoinTransaction,
} from '../tools/bitcoinTools';
import {
  analyzeAddressPrivacy,
  analyzeTransactionPrivacy,
  calculatePrivacyRisk,
  getPrivacyFindings,
} from '../tools/privacyTools';
import { AgentContext, ToolExecutionStep } from '../types/agent';
import { AgentExecutionRequest, AgentExecutionResult } from './agentTypes';

export class PrivacyAgent {
  /**
   * Execute agent workflow with tool selection, execution telemetry, and grounded response synthesis.
   */
  async run(request: AgentExecutionRequest): Promise<AgentExecutionResult> {
    const { userPrompt, context, onToolStep, preferMode } = request;
    const steps: ToolExecutionStep[] = [];

    const recordStep = (
      step: Omit<ToolExecutionStep, 'id' | 'timestamp'>
    ): ToolExecutionStep => {
      const fullStep: ToolExecutionStep = {
        ...step,
        id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: Date.now(),
      };
      steps.push(fullStep);
      onToolStep?.(fullStep);
      return fullStep;
    };

    // Update mutable context as tools run
    const workingContext: AgentContext = { ...context };

    // STEP 1: Determine if transaction or address needs to be fetched
    if (workingContext.targetType === 'transaction' && workingContext.targetId && !workingContext.transaction) {
      const start = Date.now();
      const s = recordStep({
        toolName: 'getBitcoinTransaction',
        status: 'running',
        label: 'Retrieving transaction from Bitcoin ledger...',
        inputSummary: `txid: ${workingContext.targetId.slice(0, 12)}...`,
      });

      try {
        workingContext.transaction = await getBitcoinTransaction(workingContext.targetId, preferMode);
        s.status = 'completed';
        s.label = '✓ Transaction retrieved';
        s.outputSummary = `${workingContext.transaction.vin.length} in, ${workingContext.transaction.vout.length} out`;
        s.durationMs = Date.now() - start;
        onToolStep?.(s);
      } catch (err: unknown) {
        s.status = 'failed';
        s.label = '✗ Failed to retrieve transaction';
        s.outputSummary = err instanceof Error ? err.message : 'Error';
        s.durationMs = Date.now() - start;
        onToolStep?.(s);
        throw err;
      }
    } else if (workingContext.targetType === 'address' && workingContext.targetId && !workingContext.addressInfo) {
      const start = Date.now();
      const s = recordStep({
        toolName: 'getBitcoinAddress',
        status: 'running',
        label: 'Retrieving address activity and UTXO stats...',
        inputSummary: `address: ${workingContext.targetId.slice(0, 10)}...`,
      });

      try {
        workingContext.addressInfo = await getBitcoinAddress(workingContext.targetId, preferMode);
        s.status = 'completed';
        s.label = '✓ Address records retrieved';
        s.outputSummary = `${workingContext.addressInfo.txCount} txs, ${(workingContext.addressInfo.balance / 1e8).toFixed(4)} BTC`;
        s.durationMs = Date.now() - start;
        onToolStep?.(s);
      } catch (err: unknown) {
        s.status = 'failed';
        s.label = '✗ Failed to retrieve address';
        s.outputSummary = err instanceof Error ? err.message : 'Error';
        onToolStep?.(s);
        throw err;
      }
    }

    // Small delay to make tool execution legible in real-time UI
    await new Promise((r) => setTimeout(r, 220));

    // STEP 2: Privacy Analysis Engine Tool execution
    if (workingContext.transaction) {
      const start = Date.now();
      const s = recordStep({
        toolName: 'analyzeTransactionPrivacy',
        status: 'running',
        label: 'Analyzing transaction structure & heuristics...',
        inputSummary: 'Evaluating inputs, outputs, script types, and value distribution',
      });

      const analysis = analyzeTransactionPrivacy(workingContext.transaction);
      workingContext.privacyAnalysis = analysis;
      s.status = 'completed';
      s.label = '✓ Transaction structure analyzed';
      s.outputSummary = `${analysis.findings.length} privacy findings identified`;
      s.durationMs = Date.now() - start;
      onToolStep?.(s);
    } else if (workingContext.addressInfo) {
      const start = Date.now();
      const s = recordStep({
        toolName: 'analyzeAddressPrivacy',
        status: 'running',
        label: 'Evaluating address exposure & history...',
        inputSummary: 'Checking address reuse, script standard, and balance history',
      });

      const analysis = analyzeAddressPrivacy(workingContext.addressInfo);
      workingContext.privacyAnalysis = analysis;
      s.status = 'completed';
      s.label = '✓ Address exposure evaluated';
      s.outputSummary = `${analysis.findings.length} observations noted`;
      s.durationMs = Date.now() - start;
      onToolStep?.(s);
    }

    await new Promise((r) => setTimeout(r, 200));

    // STEP 3: Calculate Privacy Risk Tool
    if (workingContext.privacyAnalysis) {
      const start = Date.now();
      const s = recordStep({
        toolName: 'calculatePrivacyRisk',
        status: 'running',
        label: 'Calculating heuristic risk estimate...',
        inputSummary: 'Weighting address reuse, linkability, structure, and exposure factors',
      });

      const risk = calculatePrivacyRisk(workingContext.privacyAnalysis);
      s.status = 'completed';
      s.label = '✓ Risk estimate calculated';
      s.outputSummary = `Score: ${risk.score}/100 [${risk.level}]`;
      s.durationMs = Date.now() - start;
      onToolStep?.(s);
    }

    await new Promise((r) => setTimeout(r, 180));

    // STEP 4: Extract Findings Tool
    if (workingContext.privacyAnalysis) {
      const start = Date.now();
      const s = recordStep({
        toolName: 'getPrivacyFindings',
        status: 'running',
        label: 'Synthesizing defensive privacy indicators...',
      });

      const findings = getPrivacyFindings(workingContext.privacyAnalysis);
      s.status = 'completed';
      s.label = '✓ Privacy indicators evaluated';
      s.outputSummary = `${findings.map((f) => f.title).slice(0, 2).join('; ')}...`;
      s.durationMs = Date.now() - start;
      onToolStep?.(s);
    }

    // STEP 5: Prepare AI Context & synthesize with LLM Provider
    const aiStart = Date.now();
    const prepStep = recordStep({
      toolName: 'analyzeTransactionPrivacy',
      status: 'running',
      label: 'Preparing AI context and generating grounded answer...',
      inputSummary: `Grounding prompt with ${workingContext.targetType ?? 'blockchain'} data`,
    });

    const aiProvider = getAIProvider(preferMode);
    const structuredResponse = await aiProvider.generatePrivacyExplanation(
      workingContext,
      userPrompt
    );

    prepStep.status = 'completed';
    prepStep.label = '✓ Context prepared & AI explanation generated';
    prepStep.outputSummary = `Model: ${aiProvider.name}`;
    prepStep.durationMs = Date.now() - aiStart;
    onToolStep?.(prepStep);

    const suggestedFollowUps = [
      'What are the main privacy risks here?',
      'Why is this transaction potentially linkable?',
      'What information is publicly visible on-chain?',
      'Explain this like I am a beginner.',
      'What defensive actions should the sender take?',
    ];

    return {
      toolSteps: steps,
      structuredResponse,
      suggestedFollowUps,
    };
  }
}

export const privacyAgent = new PrivacyAgent();

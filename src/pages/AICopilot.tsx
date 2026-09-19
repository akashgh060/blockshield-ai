import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Layers,
  Terminal,
  Shield,
  Loader2,
  Cpu,
  RefreshCw,
  HelpCircle,
  Code2,
  AlertCircle,
} from 'lucide-react';
import { AgentContext, ChatMessage, StructuredAIResponse, ToolExecutionStep } from '../types/agent';
import { BitcoinAddressInfo, BitcoinTransaction } from '../types/bitcoin';
import { PrivacyAnalysis } from '../types/privacy';
import { privacyAgent } from '../agents/privacyAgent';
import { ToolActivityStream } from '../components/copilot/ToolActivityStream';
import { StructuredResponseView } from '../components/copilot/StructuredResponseView';
import { DEMO_SCENARIOS } from '../services/bitcoin/demoData';

interface AICopilotProps {
  initialTransaction?: BitcoinTransaction | null;
  initialAddressInfo?: BitcoinAddressInfo | null;
  initialAnalysis?: PrivacyAnalysis | null;
  isDemoMode: boolean;
}

export const AICopilot: React.FC<AICopilotProps> = ({
  initialTransaction,
  initialAddressInfo,
  initialAnalysis,
  isDemoMode,
}) => {
  const [activeContext, setActiveContext] = useState<AgentContext>({
    targetId:
      initialTransaction?.txid ||
      initialAddressInfo?.address ||
      DEMO_SCENARIOS.low_risk.txid,
    targetType: initialAddressInfo ? 'address' : 'transaction',
    transaction: initialTransaction || null,
    addressInfo: initialAddressInfo || null,
    privacyAnalysis: initialAnalysis || null,
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentToolSteps, setCurrentToolSteps] = useState<ToolExecutionStep[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showRawInspector, setShowRawInspector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompt chips
  const promptChips = [
    'Is this transaction private?',
    'What information is publicly visible?',
    'Why is this transaction potentially linkable?',
    'Explain this like I am a beginner.',
    'What are the main privacy risks?',
    'What does the transaction graph show?',
  ];

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, currentToolSteps]);

  // Initial welcome message or run initial query if context just loaded
  useEffect(() => {
    if (chatMessages.length === 0) {
      // Execute initial grounded synthesis for current target
      handleRunPrompt('Explain the privacy characteristics and risk estimate of this transaction.');
    }
  }, []);

  const handleRunPrompt = async (promptText: string) => {
    const text = promptText.trim();
    if (!text || isExecuting) return;

    setInputMessage('');
    setIsExecuting(true);
    setCurrentToolSteps([]);

    // Append user message
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const result = await privacyAgent.run({
        userPrompt: text,
        context: activeContext,
        preferMode: isDemoMode ? 'demo' : 'live',
        onToolStep: (step) => {
          setCurrentToolSteps((prev) => {
            const idx = prev.findIndex((s) => s.id === step.id);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = step;
              return updated;
            }
            return [...prev, step];
          });
        },
      });

      // Update activeContext with whatever the agent fetched or analyzed
      if (result.structuredResponse) {
        const agentMsg: ChatMessage = {
          id: `msg-agent-${Date.now()}`,
          sender: 'agent',
          text: result.structuredResponse.summary,
          structuredResponse: result.structuredResponse,
          toolSteps: result.toolSteps,
          timestamp: Date.now(),
        };
        setChatMessages((prev) => [...prev, agentMsg]);
      }
    } catch (err: unknown) {
      const errorMsg: ChatMessage = {
        id: `msg-error-${Date.now()}`,
        sender: 'system',
        text: `Execution notice: ${err instanceof Error ? err.message : 'Agent pipeline error'}.`,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div id="ai-copilot-page" className="py-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-base font-bold text-white tracking-wide">
                BLOCKSHIELD PRIVACY COPILOT
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Agentic Tool-Calling
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Conversational intelligence grounded in real Bitcoin ledger verification & defensive privacy heuristics
            </p>
          </div>
        </div>

        {/* Model and Mode Badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>gemini-3.8-flash</span>
          </div>
          <div
            className={`px-2.5 py-1 rounded border flex items-center gap-1.5 ${
              isDemoMode
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>{isDemoMode ? 'DEMO AGENT' : 'LIVE AGENT'}</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chat & Tool Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Chat History Container */}
          <div
            id="chat-messages-container"
            className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 min-h-[500px] max-h-[640px] overflow-y-auto space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isSystem = msg.sender === 'system';

                if (isSystem) {
                  return (
                    <div
                      key={msg.id}
                      className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{msg.text}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                      <span>{isUser ? 'You' : 'BlockShield Agent'}</span>
                      <span>•</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {isUser ? (
                      <div className="max-w-[85%] bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-none text-xs leading-relaxed font-sans shadow-md">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="max-w-full w-full">
                        {msg.structuredResponse ? (
                          <StructuredResponseView response={msg.structuredResponse} />
                        ) : (
                          <div className="bg-slate-900 border border-slate-800 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none text-xs leading-relaxed font-sans shadow-md">
                            {msg.text}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Active Real-Time Tool Stream */}
              {isExecuting && (
                <div className="pt-2 animate-in fade-in duration-200">
                  <ToolActivityStream steps={currentToolSteps} isExecuting={isExecuting} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Chips Bar */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Suggested Follow-up Prompts
              </span>
              <div className="flex flex-wrap gap-1.5">
                {promptChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunPrompt(chip)}
                    disabled={isExecuting}
                    className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 text-slate-300 hover:text-white text-[11px] font-sans transition-all disabled:opacity-50 text-left"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunPrompt(inputMessage);
            }}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-lg"
          >
            <input
              type="text"
              id="copilot-user-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question about this Bitcoin transaction or address..."
              disabled={isExecuting}
              className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none font-sans"
            />
            <button
              type="submit"
              disabled={isExecuting || !inputMessage.trim()}
              id="copilot-send-btn"
              className="p-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-colors cursor-pointer"
              aria-label="Send message to copilot"
            >
              {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Right Column: Structured Analysis Context (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-slate-200 font-bold">
                  Active Analysis Context
                </h3>
              </div>
              <button
                onClick={() => setShowRawInspector(!showRawInspector)}
                className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
              >
                <Code2 className="w-3 h-3" />
                <span>{showRawInspector ? 'Hide Raw JSON' : 'Inspect Raw JSON'}</span>
              </button>
            </div>

            {/* Target ID Box */}
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                Target {activeContext.targetType?.toUpperCase() || 'TRANSACTION'}
              </span>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 break-all">
                {activeContext.targetId}
              </div>
            </div>

            {/* Quick Risk Indicator */}
            {activeContext.privacyAnalysis && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">
                    Privacy Risk Score
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black font-mono text-amber-400">
                      {activeContext.privacyAnalysis.overallRiskScore}
                    </span>
                    <span className="text-xs font-mono text-slate-500">/ 100</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded border text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border-amber-500/30 uppercase">
                  {activeContext.privacyAnalysis.riskLevel} Risk
                </span>
              </div>
            )}

            {/* Blockchain Details Snapshot */}
            {activeContext.transaction && (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/70">
                  <span className="text-slate-500 text-[10px] block">Inputs / Outputs</span>
                  <span className="text-slate-200 font-bold mt-0.5 block">
                    {activeContext.transaction.vin.length} in / {activeContext.transaction.vout.length} out
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/70">
                  <span className="text-slate-500 text-[10px] block">Total Volume</span>
                  <span className="text-slate-200 font-bold mt-0.5 block">
                    {(activeContext.transaction.totalOutputValue / 1e8).toFixed(4)} BTC
                  </span>
                </div>
              </div>
            )}

            {/* Key Findings List */}
            {activeContext.privacyAnalysis?.findings && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">
                  Observed Privacy Findings ({activeContext.privacyAnalysis.findings.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                  {activeContext.privacyAnalysis.findings.map((f) => (
                    <div
                      key={f.id}
                      className="p-2 rounded bg-slate-950/70 border border-slate-800/80 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-200 text-[11px]">{f.title}</div>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw JSON Inspector */}
            {showRawInspector && (
              <div className="pt-2 border-t border-slate-800 space-y-1 animate-in fade-in duration-150">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">
                  Grounding Metadata (Raw Agent State)
                </span>
                <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-60">
                  {JSON.stringify(
                    {
                      targetId: activeContext.targetId,
                      targetType: activeContext.targetType,
                      privacyScore: activeContext.privacyAnalysis?.overallRiskScore,
                      riskLevel: activeContext.privacyAnalysis?.riskLevel,
                      vinCount: activeContext.transaction?.vin.length,
                      voutCount: activeContext.transaction?.vout.length,
                      findings: activeContext.privacyAnalysis?.findings.map((f) => f.title),
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

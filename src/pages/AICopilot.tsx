import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Shield,
  Loader2,
  Cpu,
  Code2,
  AlertCircle,
  Activity,
  Eye,
  Network,
  Lock,
  Zap,
  Terminal,
  ChevronRight,
  RefreshCw,
  Database,
  MessageSquare,
} from 'lucide-react';

import {
  AgentContext,
  ChatMessage,
  ToolExecutionStep,
} from '../types/agent';

import {
  BitcoinAddressInfo,
  BitcoinTransaction,
} from '../types/bitcoin';

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
  const [activeContext, setActiveContext] =
    useState<AgentContext>({
      targetId:
        initialTransaction?.txid ||
        initialAddressInfo?.address ||
        DEMO_SCENARIOS.low_risk.txid,

      targetType: initialAddressInfo
        ? 'address'
        : 'transaction',

      transaction: initialTransaction || null,
      addressInfo: initialAddressInfo || null,
      privacyAnalysis: initialAnalysis || null,
    });

  const [inputMessage, setInputMessage] =
    useState('');

  const [isExecuting, setIsExecuting] =
    useState(false);

  const [currentToolSteps, setCurrentToolSteps] =
    useState<ToolExecutionStep[]>([]);

  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>([]);

  const [showRawInspector, setShowRawInspector] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const hasInitialized =
    useRef(false);

  /* =========================================================
     PROMPTS
  ========================================================== */

  const promptChips = [
    'Is this transaction private?',
    'What information is publicly visible?',
    'Why is this potentially linkable?',
    'Explain this like I am a beginner.',
    'What are the main privacy risks?',
    'What does the transaction graph show?',
  ];

  /* =========================================================
     SCROLL
  ========================================================== */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [chatMessages, currentToolSteps]);

  /* =========================================================
     INITIAL AGENT RUN
  ========================================================== */

  useEffect(() => {
    if (hasInitialized.current) return;

    hasInitialized.current = true;

    handleRunPrompt(
      'Explain the privacy characteristics and risk estimate of this transaction.'
    );
  }, []);

  /* =========================================================
     RUN AGENT
  ========================================================== */

  const handleRunPrompt = async (
    promptText: string
  ) => {
    const text = promptText.trim();

    if (!text || isExecuting) return;

    setInputMessage('');
    setIsExecuting(true);
    setCurrentToolSteps([]);

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [
      ...prev,
      userMsg,
    ]);

    try {
      const result = await privacyAgent.run({
        userPrompt: text,

        context: activeContext,

        preferMode: isDemoMode
          ? 'demo'
          : 'live',

        onToolStep: (step) => {
          setCurrentToolSteps((prev) => {
            const index = prev.findIndex(
              (item) => item.id === step.id
            );

            if (index >= 0) {
              const updated = [...prev];
              updated[index] = step;
              return updated;
            }

            return [...prev, step];
          });
        },
      });

      /*
       * Keep the active context synchronized with the
       * agent's latest grounded response.
       */
      if (result.structuredResponse) {
        const response =
          result.structuredResponse;

        const agentMsg: ChatMessage = {
          id: `msg-agent-${Date.now()}`,
          sender: 'agent',
          text: response.summary,
          structuredResponse: response,
          toolSteps: result.toolSteps,
          timestamp: Date.now(),
        };

        setChatMessages((prev) => [
          ...prev,
          agentMsg,
        ]);
      }
    } catch (err: unknown) {
      const errorMsg: ChatMessage = {
        id: `msg-error-${Date.now()}`,
        sender: 'system',
        text: `Execution notice: ${
          err instanceof Error
            ? err.message
            : 'Agent pipeline error'
        }.`,
        timestamp: Date.now(),
      };

      setChatMessages((prev) => [
        ...prev,
        errorMsg,
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  /* =========================================================
     RESET CHAT
  ========================================================== */

  const resetConversation = () => {
    if (isExecuting) return;

    setChatMessages([]);
    setCurrentToolSteps([]);

    setTimeout(() => {
      handleRunPrompt(
        'Explain the privacy characteristics and risk estimate of this transaction.'
      );
    }, 50);
  };

  /* =========================================================
     RISK
  ========================================================== */

  const riskScore =
    activeContext.privacyAnalysis
      ?.overallRiskScore ?? 0;

  const riskLevel =
    activeContext.privacyAnalysis
      ?.riskLevel ?? 'unknown';

  const riskStyle =
    riskScore >= 75
      ? 'text-rose-300 border-rose-400/30 bg-rose-400/[0.07]'
      : riskScore >= 50
      ? 'text-orange-300 border-orange-400/30 bg-orange-400/[0.07]'
      : riskScore >= 25
      ? 'text-amber-300 border-amber-400/30 bg-amber-400/[0.07]'
      : 'text-emerald-300 border-emerald-400/30 bg-emerald-400/[0.07]';

  return (
    <div
      id="ai-copilot-page"
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b1017] shadow-2xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-cyan-400/[0.07] blur-3xl" />

          <div className="absolute -bottom-40 left-1/4 w-96 h-96 rounded-full bg-blue-500/[0.04] blur-3xl" />
        </div>

        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-300 mb-4">
                <Bot className="w-3.5 h-3.5" />
                AI Privacy Intelligence
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
                BlockShield
                <span className="text-cyan-300">
                  {' '}
                  Privacy Copilot
                </span>
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Ask questions about Bitcoin privacy and receive
                explainable answers grounded in blockchain
                observations and defensive privacy heuristics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                icon={
                  <Cpu className="w-3.5 h-3.5" />
                }
                label="Agentic Analysis"
              />

              <StatusBadge
                live={!isDemoMode}
                label={
                  isDemoMode
                    ? 'Demo Mode'
                    : 'Live Mainnet'
                }
              />

              <button
                type="button"
                onClick={resetConversation}
                disabled={isExecuting}
                className="h-9 px-3 rounded-xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.05] disabled:opacity-40 text-slate-400 hover:text-white text-[10px] font-mono uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN LAYOUT
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(350px,0.65fr)] gap-6 items-start">

        {/* ===================================================
            CHAT COLUMN
        ==================================================== */}

        <div className="space-y-4">

          <section className="rounded-2xl border border-white/[0.08] bg-[#0b1017] overflow-hidden shadow-xl">

            {/* Chat header */}

            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-cyan-300" />
                </div>

                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    Privacy Conversation
                  </h2>

                  <p className="text-[10px] text-slate-600 mt-0.5">
                    GROUNDED BLOCKCHAIN ANALYSIS
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                <span className="hidden sm:block text-[9px] font-mono uppercase tracking-wider text-emerald-300">
                  Ready
                </span>
              </div>
            </div>

            {/* Chat messages */}

            <div
              id="chat-messages-container"
              className="p-4 sm:p-5 min-h-[500px] max-h-[700px] overflow-y-auto"
            >
              <div className="space-y-5">

                {chatMessages.length === 0 && (
                  <EmptyCopilotState />
                )}

                {chatMessages.map((msg) => {
                  const isUser =
                    msg.sender === 'user';

                  const isSystem =
                    msg.sender === 'system';

                  if (isSystem) {
                    return (
                      <div
                        key={msg.id}
                        className="flex items-start gap-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-3.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-400/[0.08] flex items-center justify-center shrink-0">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                        </div>

                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300">
                            Execution Notice
                          </div>

                          <p className="text-xs text-slate-400 mt-1 leading-5">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isUser
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={
                          isUser
                            ? 'w-full max-w-[85%]'
                            : 'w-full'
                        }
                      >

                        {/* Sender */}

                        <div
                          className={`flex items-center gap-2 mb-2 ${
                            isUser
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          {!isUser && (
                            <div className="w-5 h-5 rounded-md bg-cyan-400/[0.08] border border-cyan-400/15 flex items-center justify-center">
                              <Bot className="w-3 h-3 text-cyan-300" />
                            </div>
                          )}

                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
                            {isUser
                              ? 'You'
                              : 'BlockShield Agent'}
                          </span>

                          <span className="text-[9px] text-slate-700">
                            •
                          </span>

                          <span className="text-[9px] font-mono text-slate-700">
                            {new Date(
                              msg.timestamp
                            ).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* User message */}

                        {isUser ? (
                          <div className="ml-auto rounded-2xl rounded-tr-sm border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-3 text-xs leading-5 text-cyan-50 shadow-lg">
                            {msg.text}
                          </div>
                        ) : (
                          <div>
                            {msg.structuredResponse ? (
                              <div className="rounded-2xl rounded-tl-sm border border-white/[0.07] bg-black/15 overflow-hidden">
                                <StructuredResponseView
                                  response={
                                    msg.structuredResponse
                                  }
                                />
                              </div>
                            ) : (
                              <div className="rounded-2xl rounded-tl-sm border border-white/[0.07] bg-black/15 px-4 py-3 text-xs leading-5 text-slate-300">
                                {msg.text}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Active tool execution */}

                {isExecuting && (
                  <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] overflow-hidden">
                    <div className="px-4 py-3 border-b border-cyan-400/[0.08] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-cyan-400/[0.08] flex items-center justify-center">
                        <Activity className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                      </div>

                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300">
                          Agent Pipeline Running
                        </div>

                        <div className="text-[9px] text-slate-600 mt-0.5">
                          Gathering and analyzing observable evidence
                        </div>
                      </div>

                      <Loader2 className="w-3.5 h-3.5 text-cyan-300 animate-spin ml-auto" />
                    </div>

                    <div className="p-3">
                      <ToolActivityStream
                        steps={currentToolSteps}
                        isExecuting={isExecuting}
                      />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Suggested prompts */}

            <div className="px-4 sm:px-5 pb-4">
              <div className="rounded-xl border border-white/[0.06] bg-black/15 p-3.5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />

                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
                    Suggested Questions
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {promptChips.map(
                    (prompt, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          handleRunPrompt(prompt)
                        }
                        disabled={isExecuting}
                        className="group px-3 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] hover:bg-cyan-400/[0.05] hover:border-cyan-400/20 disabled:opacity-40 text-[10px] text-slate-400 hover:text-cyan-200 transition-all flex items-center gap-1.5"
                      >
                        {prompt}

                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              INPUT
          ================================================== */}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunPrompt(inputMessage);
            }}
            className="rounded-2xl border border-white/[0.08] bg-[#0b1017] p-2 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-cyan-400/[0.06] border border-cyan-400/10 items-center justify-center shrink-0">
                <Terminal className="w-4 h-4 text-cyan-300" />
              </div>

              <input
                type="text"
                id="copilot-user-input"
                value={inputMessage}
                onChange={(e) =>
                  setInputMessage(e.target.value)
                }
                placeholder="Ask about this Bitcoin transaction or address..."
                disabled={isExecuting}
                className="flex-1 h-10 bg-transparent px-2 sm:px-3 text-xs text-slate-100 placeholder:text-slate-600 outline-none"
              />

              <button
                type="submit"
                disabled={
                  isExecuting ||
                  !inputMessage.trim()
                }
                id="copilot-send-btn"
                className="h-10 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-semibold text-xs flex items-center gap-2 transition-all"
              >
                {isExecuting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}

                <span className="hidden sm:inline">
                  Ask
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* ===================================================
            CONTEXT COLUMN
        ==================================================== */}

        <aside className="space-y-4">

          {/* Active context */}

          <section className="rounded-2xl border border-white/[0.08] bg-[#0b1017] overflow-hidden shadow-xl">

            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-300" />

                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                  Analysis Context
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowRawInspector(
                    !showRawInspector
                  )
                }
                className="text-[9px] font-mono uppercase tracking-wider text-slate-600 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                <Code2 className="w-3 h-3" />

                {showRawInspector
                  ? 'Hide'
                  : 'Inspect'}
              </button>
            </div>

            <div className="p-5 space-y-4">

              {/* Target */}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
                    Active Target
                  </span>

                  <span className="text-[9px] font-mono text-cyan-300 uppercase">
                    {activeContext.targetType}
                  </span>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-black/25 p-3">
                  <div className="font-mono text-[10px] sm:text-[11px] leading-5 text-slate-300 break-all">
                    {activeContext.targetId}
                  </div>
                </div>
              </div>

              {/* Risk */}

              <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />

                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
                        Privacy Risk
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-semibold font-mono text-white">
                        {riskScore}
                      </span>

                      <span className="text-xs font-mono text-slate-600">
                        /100
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-lg border text-[9px] font-mono uppercase tracking-wider ${riskStyle}`}
                  >
                    {riskLevel}
                  </span>
                </div>

                <div className="mt-4 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      riskScore >= 75
                        ? 'bg-rose-400'
                        : riskScore >= 50
                        ? 'bg-orange-400'
                        : riskScore >= 25
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{
                      width: `${Math.min(
                        Math.max(
                          riskScore,
                          0
                        ),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Transaction stats */}

              {activeContext.transaction && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="w-3.5 h-3.5 text-purple-300" />

                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
                      Transaction Snapshot
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <ContextMetric
                      label="Inputs"
                      value={activeContext.transaction.vin.length.toString()}
                    />

                    <ContextMetric
                      label="Outputs"
                      value={activeContext.transaction.vout.length.toString()}
                    />

                    <ContextMetric
                      label="Volume"
                      value={`${(
                        activeContext.transaction
                          .totalOutputValue /
                        1e8
                      ).toFixed(4)} BTC`}
                    />

                    <ContextMetric
                      label="Fee"
                      value={`${activeContext.transaction.fee.toLocaleString()} sats`}
                    />
                  </div>
                </div>
              )}

              {/* Address stats */}

              {activeContext.addressInfo && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-3.5 h-3.5 text-blue-300" />

                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
                      Address Snapshot
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <ContextMetric
                      label="Transactions"
                      value={activeContext.addressInfo.txCount.toString()}
                    />

                    <ContextMetric
                      label="Balance"
                      value={`${(
                        activeContext.addressInfo
                          .balance /
                        1e8
                      ).toFixed(4)} BTC`}
                    />

                    <ContextMetric
                      label="Received"
                      value={`${(
                        activeContext.addressInfo
                          .totalReceived /
                        1e8
                      ).toFixed(3)} BTC`}
                    />

                    <ContextMetric
                      label="Sent"
                      value={`${(
                        activeContext.addressInfo
                          .totalSent /
                        1e8
                      ).toFixed(3)} BTC`}
                    />
                  </div>
                </div>
              )}

              {/* Findings */}

              {activeContext.privacyAnalysis
                ?.findings && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-300" />

                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
                        Privacy Findings
                      </span>
                    </div>

                    <span className="text-[9px] font-mono text-slate-700">
                      {
                        activeContext
                          .privacyAnalysis
                          .findings.length
                      }
                    </span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {activeContext.privacyAnalysis.findings.map(
                      (finding) => (
                        <div
                          key={finding.id}
                          className="rounded-xl border border-white/[0.06] bg-black/20 p-3"
                        >
                          <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 mt-1.5 shrink-0" />

                            <div>
                              <div className="text-[10px] font-semibold text-slate-300">
                                {finding.title}
                              </div>

                              <p className="mt-1 text-[10px] leading-4 text-slate-600">
                                {finding.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Raw JSON */}

              {showRawInspector && (
                <div className="pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-3.5 h-3.5 text-emerald-300" />

                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
                      Agent State
                    </span>
                  </div>

                  <pre className="rounded-xl border border-white/[0.06] bg-black/30 p-3 text-[9px] leading-4 font-mono text-emerald-300/80 overflow-x-auto max-h-72">
                    {JSON.stringify(
                      {
                        targetId:
                          activeContext.targetId,

                        targetType:
                          activeContext.targetType,

                        privacyScore:
                          activeContext
                            .privacyAnalysis
                            ?.overallRiskScore,

                        riskLevel:
                          activeContext
                            .privacyAnalysis
                            ?.riskLevel,

                        inputs:
                          activeContext.transaction
                            ?.vin.length,

                        outputs:
                          activeContext.transaction
                            ?.vout.length,

                        findings:
                          activeContext.privacyAnalysis?.findings.map(
                            (item) =>
                              item.title
                          ),
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              SYSTEM STATUS
          ================================================== */}

          <section className="rounded-2xl border border-white/[0.08] bg-[#0b1017] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-300" />

              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Copilot Runtime
              </h3>
            </div>

            <div className="space-y-2">
              <RuntimeRow
                label="Agent"
                value="Online"
                good
              />

              <RuntimeRow
                label="Blockchain Data"
                value={
                  isDemoMode
                    ? 'Demo Dataset'
                    : 'Mainnet'
                }
                good
              />

              <RuntimeRow
                label="Privacy Engine"
                value="Active"
                good
              />

              <RuntimeRow
                label="Tool Calling"
                value="Enabled"
                good
              />
            </div>
          </section>

          {/* =================================================
              SAFETY NOTE
          ================================================== */}

          <section className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.02] p-5">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />

              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300">
                  Defensive Intelligence
                </div>

                <p className="mt-1.5 text-[11px] leading-5 text-slate-600">
                  BlockShield uses publicly observable blockchain
                  information. Copilot responses describe
                  potential privacy and linkability signals and
                  do not establish real-world identity or
                  ownership.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

/* =============================================================
   SUPPORT COMPONENTS
============================================================= */

interface StatusBadgeProps {
  icon?: React.ReactNode;
  label: string;
  live?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  icon,
  label,
  live,
}) => {
  return (
    <div
      className={`h-9 px-3 rounded-xl border flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider ${
        live === undefined
          ? 'border-white/[0.08] bg-white/[0.025] text-slate-400'
          : live
          ? 'border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-300'
          : 'border-amber-400/20 bg-amber-400/[0.05] text-amber-300'
      }`}
    >
      {icon || (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            live
              ? 'bg-emerald-400'
              : 'bg-amber-400'
          }`}
        />
      )}

      {label}
    </div>
  );
};

interface ContextMetricProps {
  label: string;
  value: string;
}

const ContextMetric: React.FC<ContextMetricProps> = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
      <div className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
        {label}
      </div>

      <div className="mt-1.5 text-[11px] font-mono font-semibold text-slate-300 break-all">
        {value}
      </div>
    </div>
  );
};

interface RuntimeRowProps {
  label: string;
  value: string;
  good?: boolean;
}

const RuntimeRow: React.FC<RuntimeRowProps> = ({
  label,
  value,
  good,
}) => {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-b-0">
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600">
        {label}
      </span>

      <span className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            good
              ? 'bg-emerald-400'
              : 'bg-slate-600'
          }`}
        />

        {value}
      </span>
    </div>
  );
};

const EmptyCopilotState: React.FC = () => {
  return (
    <div className="min-h-[430px] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] flex items-center justify-center">
          <Bot className="w-7 h-7 text-cyan-300" />
        </div>

        <h3 className="mt-5 text-sm font-semibold text-white">
          Privacy Copilot
        </h3>

        <p className="mt-2 text-xs leading-5 text-slate-600">
          Ask a question about the active Bitcoin transaction
          or address. The agent will inspect available
          blockchain evidence before answering.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <span className="px-2.5 py-1 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[9px] font-mono text-slate-600">
            PUBLIC DATA
          </span>

          <span className="px-2.5 py-1 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[9px] font-mono text-slate-600">
            EXPLAINABLE
          </span>

          <span className="px-2.5 py-1 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[9px] font-mono text-slate-600">
            DEFENSIVE
          </span>
        </div>
      </div>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import {
  Search,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Sparkles,
  Bot,
  ArrowRight,
  Layers,
  Shield,
  ExternalLink,
  Activity,
  Eye,
  Network,
  Lock,
  Database,
  Clock3,
  Zap,
} from 'lucide-react';

import { BitcoinTransaction } from '../types/bitcoin';
import { PrivacyAnalysis } from '../types/privacy';
import { getBitcoinTransaction } from '../tools/bitcoinTools';
import { analyzeTransactionPrivacy } from '../tools/privacyTools';
import { PrivacyScoreGauge } from '../components/privacy/PrivacyScoreGauge';
import { FindingCard } from '../components/privacy/FindingCard';
import { TransactionGraph } from '../components/graph/TransactionGraph';
import {
  DEMO_SCENARIOS,
  DemoScenario,
} from '../services/bitcoin/demoData';
import { NavTab } from '../components/layout/Navbar';

interface TransactionAnalyzerProps {
  initialTxid?: string;
  isDemoMode: boolean;
  onSendToCopilot: (
    tx: BitcoinTransaction,
    analysis: PrivacyAnalysis
  ) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const TransactionAnalyzer: React.FC<TransactionAnalyzerProps> = ({
  initialTxid,
  isDemoMode,
  onSendToCopilot,
  setActiveTab,
}) => {
  const [txidInput, setTxidInput] = useState(
    initialTxid || DEMO_SCENARIOS.low_risk.txid
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] =
    useState<BitcoinTransaction | null>(null);
  const [analysis, setAnalysis] =
    useState<PrivacyAnalysis | null>(null);
  const [copied, setCopied] = useState(false);

  const validateTxid = (txid: string): boolean => {
    return /^[0-9a-fA-F]{64}$/.test(txid.trim());
  };

  const executeAnalysis = async (targetTxid: string) => {
    const cleanTxid = targetTxid.trim();

    if (!cleanTxid) {
      setError('Please enter a Bitcoin transaction ID.');
      return;
    }

    if (!validateTxid(cleanTxid)) {
      setError(
        'Invalid TXID format. A Bitcoin transaction ID must contain exactly 64 hexadecimal characters.'
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const tx = await getBitcoinTransaction(
        cleanTxid,
        isDemoMode ? 'demo' : 'live'
      );

      const privacyAnalysis = analyzeTransactionPrivacy(tx);

      setTransaction(tx);
      setAnalysis(privacyAnalysis);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to retrieve this transaction. Check the TXID or try a demo scenario.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTxid) {
      setTxidInput(initialTxid);
      executeAnalysis(initialTxid);
    } else {
      executeAnalysis(DEMO_SCENARIOS.low_risk.txid);
    }
  }, [initialTxid, isDemoMode]);

  const copyTxid = async () => {
    if (!transaction) return;

    try {
      await navigator.clipboard.writeText(transaction.txid);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError('Unable to copy the transaction ID.');
    }
  };

  const handleScenarioSelect = (scenario: DemoScenario) => {
    setTxidInput(scenario.txid);
    executeAnalysis(scenario.txid);
  };

  const getRiskTone = (score: number) => {
    if (score >= 75) {
      return {
        label: 'VERY HIGH',
        className:
          'text-rose-300 border-rose-400/30 bg-rose-400/10',
      };
    }

    if (score >= 50) {
      return {
        label: 'HIGH',
        className:
          'text-orange-300 border-orange-400/30 bg-orange-400/10',
      };
    }

    if (score >= 25) {
      return {
        label: 'MODERATE',
        className:
          'text-amber-300 border-amber-400/30 bg-amber-400/10',
      };
    }

    return {
      label: 'LOW',
      className:
        'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
    };
  };

  return (
    <div
      id="transaction-analyzer-page"
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6"
    >
      {/* =========================================================
          PAGE HEADER
      ========================================================== */}

      <header className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b1017] shadow-2xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-cyan-500/[0.07] blur-3xl" />
          <div className="absolute -bottom-40 left-1/4 w-96 h-96 rounded-full bg-blue-500/[0.05] blur-3xl" />
        </div>

        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-300 mb-4">
                <Activity className="w-3.5 h-3.5" />
                Transaction Intelligence
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
                Bitcoin Transaction
                <span className="text-cyan-300"> Privacy Inspector</span>
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Analyze publicly observable transaction structure,
                address reuse, linkability signals, and heuristic privacy
                exposure without requiring private keys or credentials.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                  {isDemoMode ? 'Demo Intelligence' : 'Live Mainnet'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          SEARCH / ANALYSIS CONSOLE
      ========================================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1017] shadow-xl">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.05),transparent_35%)]" />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-cyan-300" />
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white">
                Analyze Transaction
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Enter a Bitcoin TXID to inspect observable privacy signals.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeAnalysis(txidInput);
            }}
            className="flex flex-col lg:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                id="txid-search-input"
                type="text"
                value={txidInput}
                onChange={(e) => setTxidInput(e.target.value)}
                placeholder="64-character Bitcoin transaction ID..."
                spellCheck={false}
                autoComplete="off"
                className="w-full h-12 rounded-xl border border-white/[0.10] bg-black/30 px-4 pr-12 text-xs sm:text-sm font-mono text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:border-cyan-400/50 focus:bg-black/40 focus:ring-2 focus:ring-cyan-400/10"
              />

              {txidInput && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-600">
                  {txidInput.trim().length}/64
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              id="analyze-tx-submit-btn"
              className="h-12 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/30"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}

              {loading ? 'Analyzing...' : 'Analyze Transaction'}
            </button>
          </form>

          {/* Demo Scenario Selector */}

          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Quick Scenarios
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {Object.values(DEMO_SCENARIOS).map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => handleScenarioSelect(scenario)}
                    className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.05] hover:border-cyan-400/20 text-[10px] font-medium text-slate-400 hover:text-cyan-200 transition-all"
                  >
                    {scenario.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error */}

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-4">
              <div className="w-8 h-8 rounded-lg bg-rose-400/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-rose-300" />
              </div>

              <div>
                <div className="text-xs font-semibold text-rose-200">
                  Analysis Error
                </div>

                <p className="text-xs text-rose-300/80 mt-1 leading-5">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          LOADING
      ========================================================== */}

      {loading && (
        <section className="rounded-2xl border border-cyan-400/10 bg-[#0b1017] p-8 sm:p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-cyan-300 animate-spin" />
          </div>

          <h3 className="mt-5 text-sm font-semibold text-white">
            Running Privacy Analysis
          </h3>

          <p className="mt-2 text-xs text-slate-500 max-w-lg mx-auto leading-5">
            Inspecting transaction structure, inputs, outputs, address
            reuse, common-input ownership signals, and observable
            linkability patterns.
          </p>

          <div className="mt-6 max-w-md mx-auto h-1 rounded-full bg-white/[0.05] overflow-hidden">
            <div className="h-full w-2/3 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </section>
      )}

      {/* =========================================================
          RESULTS
      ========================================================== */}

      {transaction && analysis && !loading && (
        <div className="space-y-6">

          {/* =====================================================
              AI COPILOT ACTION
          ====================================================== */}

          <section className="relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-r from-cyan-400/[0.07] via-blue-500/[0.04] to-transparent">
            <div className="absolute -right-16 -top-20 w-48 h-48 rounded-full bg-cyan-400/[0.06] blur-3xl" />

            <div className="relative p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-cyan-300" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">
                      Privacy Copilot is ready
                    </h3>

                    <span className="px-2 py-0.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] text-[9px] font-mono uppercase tracking-wider text-cyan-300">
                      Grounded AI
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    Send this transaction and its privacy analysis to the
                    AI Copilot for an explainable defensive assessment.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSendToCopilot(transaction, analysis);
                  setActiveTab('copilot');
                }}
                id="analyze-with-copilot-btn"
                className="h-10 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all shrink-0"
              >
                Explain with AI Copilot
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>

          {/* =====================================================
              TRANSACTION OVERVIEW
          ====================================================== */}

          <section className="rounded-2xl border border-white/[0.08] bg-[#0b1017] shadow-xl overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-400/[0.08] border border-blue-400/15 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-blue-300" />
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    Transaction Telemetry
                  </h3>

                  <p className="text-[10px] text-slate-600 mt-0.5 font-mono">
                    PUBLICLY OBSERVABLE DATA
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300">
                  {transaction.status.confirmed
                    ? 'Confirmed'
                    : 'In Mempool'}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {/* TXID */}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
                    Transaction ID
                  </span>

                  <span className="text-[9px] font-mono text-slate-600">
                    SHA-256 / TXID
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-black/25 p-3">
                  <span className="flex-1 text-[10px] sm:text-xs font-mono text-slate-300 break-all">
                    {transaction.txid}
                  </span>

                  <button
                    onClick={copyTxid}
                    title="Copy TXID"
                    className="w-9 h-9 rounded-lg border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.06] flex items-center justify-center text-slate-500 hover:text-white transition-all shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Metrics */}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
                <Metric
                  label="Block Height"
                  value={`#${transaction.status.block_height ?? 'Mempool'}`}
                  icon={<Layers className="w-3.5 h-3.5" />}
                />

                <Metric
                  label="Inputs / Outputs"
                  value={`${transaction.vin.length} → ${transaction.vout.length}`}
                  icon={<Network className="w-3.5 h-3.5" />}
                />

                <Metric
                  label="Fee Paid"
                  value={`${transaction.fee.toLocaleString()} sats`}
                  icon={<Zap className="w-3.5 h-3.5" />}
                />

                <Metric
                  label="Fee Rate"
                  value={
                    transaction.feeRate
                      ? `${transaction.feeRate} sat/vB`
                      : 'N/A'
                  }
                  icon={<Activity className="w-3.5 h-3.5" />}
                />

                <Metric
                  label="Output Volume"
                  value={`${(
                    transaction.totalOutputValue / 1e8
                  ).toFixed(4)} BTC`}
                  accent
                  icon={<Database className="w-3.5 h-3.5" />}
                />

                <Metric
                  label="Confirmations"
                  value={`${transaction.confirmations ?? 6}+`}
                  icon={<Clock3 className="w-3.5 h-3.5" />}
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              SCORE + SUMMARY
          ====================================================== */}

          <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)] gap-6">

            <div className="rounded-2xl border border-white/[0.08] bg-[#0b1017] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-300" />

                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    Privacy Risk Assessment
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <PrivacyScoreGauge analysis={analysis} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0b1017] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-300" />

                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    Risk Snapshot
                  </h3>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full border text-[9px] font-mono font-semibold tracking-wider ${getRiskTone(
                    analysis.score
                  ).className}`}
                >
                  {getRiskTone(analysis.score).label}
                </span>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <div className="text-4xl font-semibold tracking-tight text-white">
                  {analysis.score}
                  <span className="text-sm text-slate-600 ml-1">
                    /100
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2 leading-5">
                  Heuristic privacy exposure score based on observable
                  transaction characteristics. This is not an identity
                  attribution.
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <SnapshotRow
                  label="Inputs"
                  value={transaction.vin.length.toString()}
                />

                <SnapshotRow
                  label="Outputs"
                  value={transaction.vout.length.toString()}
                />

                <SnapshotRow
                  label="Findings"
                  value={analysis.findings.length.toString()}
                />

                <SnapshotRow
                  label="Mode"
                  value={isDemoMode ? 'Demo' : 'Live'}
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              GRAPH
          ====================================================== */}

          <section className="rounded-2xl border border-white/[0.08] bg-[#0b1017] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-400/[0.08] border border-purple-400/15 flex items-center justify-center">
                  <Network className="w-4 h-4 text-purple-300" />
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    Transaction Relationship Graph
                  </h3>

                  <p className="text-[10px] text-slate-600 mt-0.5">
                    INPUT → TRANSACTION → OUTPUT
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-300" />
                Interactive
              </span>
            </div>

            <div className="p-3 sm:p-5">
              <TransactionGraph
                transaction={transaction}
                analysis={analysis}
              />
            </div>
          </section>

          {/* =====================================================
              INPUTS / OUTPUTS
          ====================================================== */}

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Inputs */}

            <AddressFlowCard
              title="Transaction Inputs"
              count={transaction.vin.length}
              total={`${(
                transaction.totalInputValue / 1e8
              ).toFixed(4)} BTC`}
              tone="blue"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {transaction.vin.map((inp, i) => {
                const addr =
                  inp.prevout?.scriptpubkey_address ||
                  'Unparsed Outpoint';

                const isReused = analysis.metrics.addressReuseCount
                  ? transaction.vout.some(
                      (o) => o.scriptpubkey_address === addr
                    )
                  : false;

                return (
                  <FlowItem
                    key={i}
                    index={i}
                    address={addr}
                    value={
                      inp.prevout?.value
                        ? `${(
                            inp.prevout.value / 1e8
                          ).toFixed(4)} BTC`
                        : 'N/A'
                    }
                    type={
                      inp.prevout?.scriptpubkey_type ||
                      'p2wpkh'
                    }
                    reused={isReused}
                  />
                );
              })}
            </AddressFlowCard>

            {/* Outputs */}

            <AddressFlowCard
              title="Transaction Outputs"
              count={transaction.vout.length}
              total={`${(
                transaction.totalOutputValue / 1e8
              ).toFixed(4)} BTC`}
              tone="green"
              icon={<ArrowRight className="w-4 h-4 rotate-180" />}
            >
              {transaction.vout.map((out, i) => {
                const addr =
                  out.scriptpubkey_address ||
                  'OP_RETURN / Unparsed';

                const isReused = transaction.vin.some(
                  (v) =>
                    v.prevout?.scriptpubkey_address === addr
                );

                return (
                  <FlowItem
                    key={i}
                    index={i}
                    address={addr}
                    value={`${(
                      out.value / 1e8
                    ).toFixed(4)} BTC`}
                    sats={`${out.value.toLocaleString()} sats`}
                    type={
                      out.scriptpubkey_type ||
                      'p2wpkh'
                    }
                    reused={isReused}
                    output
                  />
                );
              })}
            </AddressFlowCard>
          </section>

          {/* =====================================================
              PRIVACY FINDINGS
          ====================================================== */}

          <section>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-300" />

                  <h3 className="text-sm font-semibold text-white">
                    Privacy Findings
                  </h3>
                </div>

                <p className="text-xs text-slate-500 mt-1">
                  Observable signals identified by the BlockShield
                  heuristic engine.
                </p>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600">
                {analysis.findings.length} observations
              </span>
            </div>

            <div className="space-y-3">
              {analysis.findings.map((finding) => (
                <FindingCard
                  key={finding.id}
                  finding={finding}
                />
              ))}
            </div>
          </section>

          {/* =====================================================
              DEFENSIVE RECOMMENDATIONS
          ====================================================== */}

          <section className="relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.025]">
            <div className="absolute -right-20 -bottom-24 w-64 h-64 rounded-full bg-emerald-400/[0.04] blur-3xl" />

            <div className="relative p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-emerald-300" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Defensive Privacy Considerations
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Practical considerations based on the observed
                    transaction patterns.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.defensiveRecommendations.map(
                  (rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-black/15 p-4"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-400/[0.08] border border-emerald-400/15 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-mono text-emerald-300">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <p className="text-xs leading-5 text-slate-400">
                        {rec}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* =====================================================
              DISCLAIMER / LIMITATIONS
          ====================================================== */}

          <section className="rounded-xl border border-white/[0.06] bg-black/15 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />

              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Analysis Limitation
                </div>

                <p className="text-[11px] text-slate-600 leading-5 mt-1">
                  BlockShield analyzes public blockchain data and
                  heuristic patterns. A privacy risk score does not
                  establish ownership, identity, intent, or off-chain
                  relationships. Results should be interpreted as
                  probabilistic privacy signals rather than definitive
                  attribution.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

/* ===============================================================
   SUPPORT COMPONENTS
================================================================ */

interface MetricProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
}

const Metric: React.FC<MetricProps> = ({
  label,
  value,
  icon,
  accent,
}) => {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3.5">
      <div className="flex items-center gap-1.5 text-slate-600">
        {icon}

        <span className="text-[9px] font-mono uppercase tracking-wider">
          {label}
        </span>
      </div>

      <div
        className={`mt-2 text-xs sm:text-sm font-semibold font-mono ${
          accent ? 'text-cyan-300' : 'text-slate-200'
        }`}
      >
        {value}
      </div>
    </div>
  );
};

interface SnapshotRowProps {
  label: string;
  value: string;
}

const SnapshotRow: React.FC<SnapshotRowProps> = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-b-0">
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600">
        {label}
      </span>

      <span className="text-[11px] font-mono text-slate-300">
        {value}
      </span>
    </div>
  );
};

interface AddressFlowCardProps {
  title: string;
  count: number;
  total: string;
  tone: 'blue' | 'green';
  icon: React.ReactNode;
  children: React.ReactNode;
}

const AddressFlowCard: React.FC<AddressFlowCardProps> = ({
  title,
  count,
  total,
  tone,
  icon,
  children,
}) => {
  const toneClasses =
    tone === 'blue'
      ? {
          icon: 'text-blue-300 bg-blue-400/[0.08] border-blue-400/15',
          title: 'text-blue-300',
        }
      : {
          icon: 'text-emerald-300 bg-emerald-400/[0.08] border-emerald-400/15',
          title: 'text-emerald-300',
        };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0b1017] overflow-hidden">
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg border flex items-center justify-center ${toneClasses.icon}`}
            >
              {icon}
            </div>

            <div>
              <h3
                className={`text-xs font-semibold uppercase tracking-wider ${toneClasses.title}`}
              >
                {title}
              </h3>

              <p className="text-[10px] text-slate-600 mt-0.5">
                {count} records
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono text-slate-500">
            {total}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-2.5 max-h-[440px] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

interface FlowItemProps {
  index: number;
  address: string;
  value: string;
  sats?: string;
  type: string;
  reused: boolean;
  output?: boolean;
}

const FlowItem: React.FC<FlowItemProps> = ({
  index,
  address,
  value,
  sats,
  type,
  reused,
  output,
}) => {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 hover:bg-white/[0.025] transition-colors p-3.5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[9px] font-mono text-slate-500">
            {String(index).padStart(2, '0')}
          </span>

          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
            {output ? 'OUTPUT' : 'INPUT'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {reused && (
            <span className="px-1.5 py-0.5 rounded-md border border-amber-400/20 bg-amber-400/[0.07] text-[9px] font-mono text-amber-300">
              REUSED
            </span>
          )}

          <span className="px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[9px] font-mono uppercase text-slate-500">
            {type}
          </span>
        </div>
      </div>

      <div className="font-mono text-[10px] sm:text-[11px] text-slate-300 break-all leading-5">
        {address}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-[9px] text-slate-600">
          Observable address
        </span>

        <div className="text-right">
          <div
            className={`text-[11px] font-mono font-semibold ${
              output ? 'text-emerald-300' : 'text-slate-300'
            }`}
          >
            {value}
          </div>

          {sats && (
            <div className="text-[9px] font-mono text-slate-600 mt-0.5">
              {sats}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
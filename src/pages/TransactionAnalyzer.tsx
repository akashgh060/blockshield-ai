import React, { useState, useEffect } from 'react';
import {
  Search,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Sparkles,
  Bot,
  ArrowRight,
  Clock,
  Layers,
  Shield,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { BitcoinTransaction } from '../types/bitcoin';
import { PrivacyAnalysis } from '../types/privacy';
import { getBitcoinTransaction } from '../tools/bitcoinTools';
import { analyzeTransactionPrivacy } from '../tools/privacyTools';
import { PrivacyScoreGauge } from '../components/privacy/PrivacyScoreGauge';
import { FindingCard } from '../components/privacy/FindingCard';
import { TransactionGraph } from '../components/graph/TransactionGraph';
import { DEMO_SCENARIOS, DemoScenario } from '../services/bitcoin/demoData';
import { NavTab } from '../components/layout/Navbar';

interface TransactionAnalyzerProps {
  initialTxid?: string;
  isDemoMode: boolean;
  onSendToCopilot: (tx: BitcoinTransaction, analysis: PrivacyAnalysis) => void;
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
  const [transaction, setTransaction] = useState<BitcoinTransaction | null>(null);
  const [analysis, setAnalysis] = useState<PrivacyAnalysis | null>(null);
  const [copied, setCopied] = useState(false);

  const validateTxid = (txid: string): boolean => {
    const clean = txid.trim();
    return /^[0-9a-fA-F]{64}$/.test(clean);
  };

  const executeAnalysis = async (targetTxid: string) => {
    const cleanTxid = targetTxid.trim();
    if (!cleanTxid) {
      setError('Please enter a 64-character Bitcoin transaction ID (TXID).');
      return;
    }

    if (!validateTxid(cleanTxid)) {
      setError('Invalid TXID format: Must be exactly 64 hexadecimal characters.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const tx = await getBitcoinTransaction(cleanTxid, isDemoMode ? 'demo' : 'live');
      const privAnalysis = analyzeTransactionPrivacy(tx);
      setTransaction(tx);
      setAnalysis(privAnalysis);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to retrieve transaction. Check network connectivity or try a demo scenario.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Run initial analysis on mount or when initialTxid changes
  useEffect(() => {
    if (initialTxid) {
      setTxidInput(initialTxid);
      executeAnalysis(initialTxid);
    } else {
      executeAnalysis(DEMO_SCENARIOS.low_risk.txid);
    }
  }, [initialTxid, isDemoMode]);

  const copyTxid = () => {
    if (!transaction) return;
    navigator.clipboard.writeText(transaction.txid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScenarioSelect = (scenario: DemoScenario) => {
    setTxidInput(scenario.txid);
    executeAnalysis(scenario.txid);
  };

  return (
    <div id="transaction-analyzer-page" className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* Search Header */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            <h2 className="font-mono text-lg font-bold text-white tracking-wide">
              BITCOIN TRANSACTION PRIVACY INSPECTOR
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyze publicly observable transaction structure, heuristic linkability, and address reuse.
          </p>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeAnalysis(txidInput);
          }}
          className="flex flex-col sm:flex-row items-stretch gap-2.5"
        >
          <div className="relative flex-1">
            <input
              id="txid-search-input"
              type="text"
              value={txidInput}
              onChange={(e) => setTxidInput(e.target.value)}
              placeholder="Enter 64-character Bitcoin Transaction ID (TXID)..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 placeholder-slate-500 transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            id="analyze-tx-submit-btn"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-cyan-950/50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Analyze Transaction</span>
          </button>
        </form>

        {/* Demo Scenarios Quick Pickers */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo Scenarios:
          </span>
          {Object.values(DEMO_SCENARIOS).map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => handleScenarioSelect(scenario)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] font-sans hover:text-white transition-colors"
            >
              {scenario.name}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Analysis Error: </span>
              <span>{error}</span>
            </div>
          </div>
        )}
      </section>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center space-y-4 animate-pulse">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <div className="font-mono text-sm text-slate-200">
            Querying Bitcoin Ledger & Running Privacy Heuristics...
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Extracting script formats, evaluating common-input-ownership clusters, and calculating heuristic risk.
          </p>
        </div>
      )}

      {/* Main Results View */}
      {transaction && analysis && !loading && (
        <div className="space-y-8">
          {/* Quick AI Action Bar */}
          <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900 border border-cyan-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-xs sm:text-sm font-sans">
                  Deep Privacy AI Agent Available for this Transaction
                </h4>
                <p className="text-xs text-slate-400">
                  Ask questions, simulate privacy scenarios, and receive grounded defensive recommendations.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onSendToCopilot(transaction, analysis);
                setActiveTab('copilot');
              }}
              id="analyze-with-copilot-btn"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-950/50"
            >
              <span>Explain with AI Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Transaction Metadata Grid */}
          <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-slate-200 font-bold">
                  On-Chain Transaction Telemetry
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                  {transaction.status.confirmed ? 'Confirmed' : 'In Mempool'}
                </span>
              </div>
            </div>

            {/* TXID Display */}
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                Transaction ID (TXID)
              </span>
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 break-all">
                <span className="flex-1">{transaction.txid}</span>
                <button
                  onClick={copyTxid}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Copy TXID"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Metric Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Block Height</span>
                <span className="text-slate-200 font-bold mt-0.5 block">
                  #{transaction.status.block_height ?? 'Mempool'}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Inputs / Outputs</span>
                <span className="text-slate-200 font-bold mt-0.5 block">
                  {transaction.vin.length} in → {transaction.vout.length} out
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Fee Paid</span>
                <span className="text-slate-200 font-bold mt-0.5 block">
                  {transaction.fee.toLocaleString()} sats
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Fee Rate</span>
                <span className="text-slate-200 font-bold mt-0.5 block">
                  {transaction.feeRate ? `${transaction.feeRate} sat/vB` : 'N/A'}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Total Volume</span>
                <span className="text-cyan-400 font-bold mt-0.5 block">
                  {(transaction.totalOutputValue / 1e8).toFixed(4)} BTC
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Confirmations</span>
                <span className="text-slate-200 font-bold mt-0.5 block">
                  {transaction.confirmations ?? 6}+
                </span>
              </div>
            </div>
          </section>

          {/* Privacy Score Gauge */}
          <PrivacyScoreGauge analysis={analysis} />

          {/* Interactive Transaction Graph */}
          <TransactionGraph transaction={transaction} analysis={analysis} />

          {/* Inputs & Outputs Breakdown */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs Column */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="font-mono text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Inputs ({transaction.vin.length})
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  Total: {(transaction.totalInputValue / 1e8).toFixed(4)} BTC
                </span>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {transaction.vin.map((inp, i) => {
                  const addr = inp.prevout?.scriptpubkey_address || 'Unparsed Outpoint';
                  const isReused = analysis.metrics.addressReuseCount
                    ? transaction.vout.some((o) => o.scriptpubkey_address === addr)
                    : false;

                  return (
                    <div
                      key={i}
                      className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-500">#{i}</span>
                        <div className="flex items-center gap-1.5">
                          {isReused && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Reused
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-300 uppercase">
                            {inp.prevout?.scriptpubkey_type || 'p2wpkh'}
                          </span>
                        </div>
                      </div>
                      <div className="font-mono text-slate-200 break-all text-[11px]">{addr}</div>
                      <div className="text-right font-mono text-slate-300 text-[11px]">
                        {inp.prevout?.value ? `${(inp.prevout.value / 1e8).toFixed(4)} BTC` : 'N/A'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Outputs Column */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Outputs ({transaction.vout.length})
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  Total: {(transaction.totalOutputValue / 1e8).toFixed(4)} BTC
                </span>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {transaction.vout.map((out, i) => {
                  const addr = out.scriptpubkey_address || 'OP_RETURN / Unparsed';
                  const isReused = transaction.vin.some(
                    (v) => v.prevout?.scriptpubkey_address === addr
                  );

                  return (
                    <div
                      key={i}
                      className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-500">#{i}</span>
                        <div className="flex items-center gap-1.5">
                          {isReused && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Reused
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 uppercase">
                            {out.scriptpubkey_type || 'p2wpkh'}
                          </span>
                        </div>
                      </div>
                      <div className="font-mono text-slate-200 break-all text-[11px]">{addr}</div>
                      <div className="text-right font-mono text-emerald-400 font-semibold text-[11px]">
                        {(out.value / 1e8).toFixed(4)} BTC ({out.value.toLocaleString()} sats)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Privacy Findings List */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-200">
                  Privacy Findings & Observations ({analysis.findings.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Detailed breakdown of observable heuristics, reasons, and defensive limitations
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {analysis.findings.map((finding) => (
                <FindingCard key={finding.id} finding={finding} />
              ))}
            </div>
          </section>

          {/* Defensive Recommendations Section */}
          <section className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="font-mono text-sm uppercase tracking-wider text-slate-100 font-bold">
                Actionable Defensive Privacy Steps
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              {analysis.defensiveRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

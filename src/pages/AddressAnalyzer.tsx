import React, { useEffect, useState } from 'react';
import {
  Activity,
  Search,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Sparkles,
  Bot,
  ArrowRight,
  Shield,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Database,
  Wallet,
  Eye,
  Network,
  Lock,
  Zap,
} from 'lucide-react';

import {
  AddressActivityItem,
  BitcoinAddressInfo,
} from '../types/bitcoin';
import { PrivacyAnalysis } from '../types/privacy';
import {
  getAddressHistory,
  getBitcoinAddress,
} from '../tools/bitcoinTools';
import { analyzeAddressPrivacy } from '../tools/privacyTools';
import { PrivacyScoreGauge } from '../components/privacy/PrivacyScoreGauge';
import { FindingCard } from '../components/privacy/FindingCard';
import { DEMO_SCENARIOS } from '../services/bitcoin/demoData';
import { NavTab } from '../components/layout/Navbar';

interface AddressAnalyzerProps {
  initialAddress?: string;
  isDemoMode: boolean;
  onSendToCopilot: (
    addressInfo: BitcoinAddressInfo,
    analysis: PrivacyAnalysis
  ) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const AddressAnalyzer: React.FC<AddressAnalyzerProps> = ({
  initialAddress,
  isDemoMode,
  onSendToCopilot,
  setActiveTab,
}) => {
  const [addressInput, setAddressInput] = useState(
    initialAddress || DEMO_SCENARIOS.address_reuse.address
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [addressInfo, setAddressInfo] =
    useState<BitcoinAddressInfo | null>(null);

  const [history, setHistory] =
    useState<AddressActivityItem[]>([]);

  const [analysis, setAnalysis] =
    useState<PrivacyAnalysis | null>(null);

  const [copied, setCopied] = useState(false);

  /* =========================================================
     VALIDATION
  ========================================================== */

  const validateAddress = (addr: string): boolean => {
    const clean = addr.trim();

    return /^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{38,90})$/.test(
      clean
    );
  };

  /* =========================================================
     ANALYSIS
  ========================================================== */

  const executeAnalysis = async (targetAddr: string) => {
    const cleanAddr = targetAddr.trim();

    if (!cleanAddr) {
      setError('Please enter a valid Bitcoin address.');
      return;
    }

    if (!validateAddress(cleanAddr)) {
      setError(
        'Invalid Bitcoin address format. Supported formats: Legacy (1...), SegWit (bc1q...), Taproot (bc1p...), P2SH (3...).'
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const mode = isDemoMode ? 'demo' : 'live';

      const info = await getBitcoinAddress(
        cleanAddr,
        mode
      );

      const hist = await getAddressHistory(
        cleanAddr,
        mode
      );

      const privacyAnalysis =
        analyzeAddressPrivacy(info);

      setAddressInfo(info);
      setHistory(hist);
      setAnalysis(privacyAnalysis);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to retrieve address data. Check network connection or select a demo address.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialAddress) {
      setAddressInput(initialAddress);
      executeAnalysis(initialAddress);
    } else {
      executeAnalysis(
        DEMO_SCENARIOS.address_reuse.address
      );
    }
  }, [initialAddress, isDemoMode]);

  /* =========================================================
     COPY
  ========================================================== */

  const copyAddress = async () => {
    if (!addressInfo) return;

    try {
      await navigator.clipboard.writeText(
        addressInfo.address
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError('Unable to copy the Bitcoin address.');
    }
  };

  /* =========================================================
     DEMO PRESETS
  ========================================================== */

  const demoPresets = [
    {
      label: 'High Reuse',
      addr: DEMO_SCENARIOS.address_reuse.address,
      desc: 'Multiple observed transactions',
    },
    {
      label: 'Fresh Address',
      addr: DEMO_SCENARIOS.low_risk.address,
      desc: 'Low historical reuse',
    },
    {
      label: 'Consolidation Target',
      addr: DEMO_SCENARIOS.high_linkability.address,
      desc: 'Potential co-spending linkability',
    },
  ];

  return (
    <div
      id="address-analyzer-page"
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b1017] shadow-2xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-cyan-400/[0.07] blur-3xl" />

          <div className="absolute -bottom-40 left-1/4 w-96 h-96 rounded-full bg-blue-500/[0.05] blur-3xl" />
        </div>

        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-300 mb-4">
                <Activity className="w-3.5 h-3.5" />
                Address Intelligence
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
                Bitcoin Address
                <span className="text-cyan-300">
                  {' '}
                  Privacy Auditor
                </span>
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Inspect address history, reuse patterns, balance
                flows, and potential linkability signals using
                publicly observable Bitcoin data.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />

                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                  {isDemoMode
                    ? 'Demo Intelligence'
                    : 'Live Mainnet'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH CONSOLE
      ====================================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1017] shadow-xl">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.05),transparent_35%)]" />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-cyan-300" />
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white">
                Analyze Bitcoin Address
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Enter a public Bitcoin address to inspect
                observable privacy exposure.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeAnalysis(addressInput);
            }}
            className="flex flex-col lg:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                id="address-search-input"
                type="text"
                value={addressInput}
                onChange={(e) =>
                  setAddressInput(e.target.value)
                }
                placeholder="bc1q..., bc1p..., 1..., or 3..."
                spellCheck={false}
                autoComplete="off"
                className="w-full h-12 rounded-xl border border-white/[0.10] bg-black/30 px-4 text-xs sm:text-sm font-mono text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:border-cyan-400/50 focus:bg-black/40 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="analyze-address-submit-btn"
              className="h-12 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/30"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}

              {loading
                ? 'Analyzing...'
                : 'Analyze Address'}
            </button>
          </form>

          {/* Presets */}

          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />

                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Quick Profiles
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {demoPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    title={preset.desc}
                    onClick={() => {
                      setAddressInput(preset.addr);
                      executeAnalysis(preset.addr);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.05] hover:border-cyan-400/20 text-[10px] font-medium text-slate-400 hover:text-cyan-200 transition-all"
                  >
                    {preset.label}
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
                  Address Analysis Error
                </div>

                <p className="text-xs text-rose-300/80 mt-1 leading-5">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <section className="rounded-2xl border border-cyan-400/10 bg-[#0b1017] p-8 sm:p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-cyan-300 animate-spin" />
          </div>

          <h3 className="mt-5 text-sm font-semibold text-white">
            Scanning Address History
          </h3>

          <p className="mt-2 text-xs text-slate-500 max-w-lg mx-auto leading-5">
            Inspecting transaction history, balance flows,
            address reuse, and observable privacy signals.
          </p>

          <div className="mt-6 max-w-md mx-auto h-1 rounded-full bg-white/[0.05] overflow-hidden">
            <div className="h-full w-2/3 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </section>
      )}

      {/* =====================================================
          RESULTS
      ====================================================== */}

      {addressInfo && analysis && !loading && (
        <div className="space-y-6">

          {/* ===================================================
              COPILOT BANNER
          ==================================================== */}

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
                      Address Profile Ready
                    </h3>

                    <span className="px-2 py-0.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] text-[9px] font-mono uppercase tracking-wider text-cyan-300">
                      Grounded AI
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    Send this address profile to the AI Copilot
                    for an explainable privacy assessment.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSendToCopilot(
                    addressInfo,
                    analysis
                  );

                  setActiveTab('copilot');
                }}
                id="analyze-addr-with-copilot-btn"
                className="h-10 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all shrink-0"
              >
                Explain with AI Copilot
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>

          {/* ===================================================
              ADDRESS PROFILE
          ==================================================== */}

          <section className="rounded-2xl border border-white/[0.08] bg-[#0b1017] shadow-xl overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-400/[0.08] border border-cyan-400/15 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-300" />
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    Address Profile
                  </h3>

                  <p className="text-[10px] text-slate-600 mt-0.5 font-mono">
                    PUBLICLY OBSERVABLE ADDRESS DATA
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] text-[9px] font-mono uppercase tracking-wider text-cyan-300">
                {addressInfo.addressType} Standard
              </span>
            </div>

            <div className="p-5 sm:p-6">

              {/* Address */}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
                    Public Bitcoin Address
                  </span>

                  <span className="text-[9px] font-mono text-slate-600">
                    NO PRIVATE DATA
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-black/25 p-3">
                  <span className="flex-1 text-[10px] sm:text-xs font-mono text-slate-300 break-all">
                    {addressInfo.address}
                  </span>

                  <button
                    onClick={copyAddress}
                    title="Copy address"
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">

                <AddressMetric
                  label="Transactions"
                  value={`${addressInfo.txCount}`}
                  icon={
                    <Activity className="w-3.5 h-3.5" />
                  }
                  warning={addressInfo.txCount > 1}
                />

                <AddressMetric
                  label="Balance"
                  value={`${(
                    addressInfo.balance / 1e8
                  ).toFixed(4)} BTC`}
                  icon={
                    <Wallet className="w-3.5 h-3.5" />
                  }
                  accent
                />

                <AddressMetric
                  label="Total Received"
                  value={`${(
                    addressInfo.totalReceived / 1e8
                  ).toFixed(4)} BTC`}
                  icon={
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                  }
                />

                <AddressMetric
                  label="Total Sent"
                  value={`${(
                    addressInfo.totalSent / 1e8
                  ).toFixed(4)} BTC`}
                  icon={
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  }
                />
              </div>
            </div>
          </section>

          {/* ===================================================
              PRIVACY SCORE
          ==================================================== */}

          <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)] gap-6">

            <div className="rounded-2xl border border-white/[0.08] bg-[#0b1017] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-300" />

                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    Address Privacy Assessment
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <PrivacyScoreGauge
                  analysis={analysis}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0b1017] p-5">
              <div className="flex items-center gap-2 mb-5">
                <Eye className="w-4 h-4 text-cyan-300" />

                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                  Exposure Snapshot
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MiniStat
                  label="Transactions"
                  value={addressInfo.txCount.toString()}
                />

                <MiniStat
                  label="Findings"
                  value={analysis.findings.length.toString()}
                />

                <MiniStat
                  label="Received"
                  value={`${(
                    addressInfo.totalReceived /
                    1e8
                  ).toFixed(3)} BTC`}
                />

                <MiniStat
                  label="Sent"
                  value={`${(
                    addressInfo.totalSent /
                    1e8
                  ).toFixed(3)} BTC`}
                />
              </div>

              <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="w-3.5 h-3.5 text-purple-300" />

                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
                    Observable Surface
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-5">
                  Historical transactions and value flows can
                  reveal patterns that may increase address
                  linkability.
                </p>
              </div>
            </div>
          </section>

          {/* ===================================================
              ACTIVITY TIMELINE
          ==================================================== */}

          <section className="rounded-2xl border border-white/[0.08] bg-[#0b1017] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-400/[0.08] border border-blue-400/15 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-300" />
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    On-Chain Activity
                  </h3>

                  <p className="text-[10px] text-slate-600 mt-0.5">
                    HISTORICAL LEDGER INTERACTIONS
                  </p>
                </div>
              </div>

              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
                {history.length} records
              </span>
            </div>

            <div className="p-4 sm:p-5">
              {history.length === 0 ? (
                <div className="py-10 text-center">
                  <Database className="w-7 h-7 mx-auto text-slate-700" />

                  <p className="mt-3 text-xs text-slate-500">
                    No historical activity available.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {history.map((item, index) => {
                    const isIncoming =
                      item.type === 'incoming';

                    const isOutgoing =
                      item.type === 'outgoing';

                    return (
                      <div
                        key={
                          item.txid ||
                          index
                        }
                        className="group rounded-xl border border-white/[0.06] bg-black/20 hover:bg-white/[0.025] transition-all p-3.5 sm:p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                                isIncoming
                                  ? 'bg-emerald-400/[0.08] border-emerald-400/15 text-emerald-300'
                                  : isOutgoing
                                  ? 'bg-rose-400/[0.08] border-rose-400/15 text-rose-300'
                                  : 'bg-purple-400/[0.08] border-purple-400/15 text-purple-300'
                              }`}
                            >
                              {isIncoming ? (
                                <ArrowDownLeft className="w-4 h-4" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-mono font-semibold uppercase ${
                                    isIncoming
                                      ? 'text-emerald-300'
                                      : isOutgoing
                                      ? 'text-rose-300'
                                      : 'text-purple-300'
                                  }`}
                                >
                                  {item.type}
                                </span>

                                <span className="text-slate-700">
                                  •
                                </span>

                                <span className="text-[10px] text-slate-600">
                                  {new Date(
                                    item.timestamp
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="mt-1 font-mono text-[10px] text-slate-500 truncate max-w-[300px] sm:max-w-[500px]">
                                {item.txid.slice(0, 20)}
                                ...
                                {item.txid.slice(-8)}
                              </div>
                            </div>
                          </div>

                          <div className="sm:text-right pl-12 sm:pl-0">
                            <div
                              className={`text-sm font-mono font-semibold ${
                                isIncoming
                                  ? 'text-emerald-300'
                                  : 'text-slate-200'
                              }`}
                            >
                              {isIncoming
                                ? '+'
                                : '-'}
                              {(
                                item.amount /
                                1e8
                              ).toFixed(4)}{' '}
                              BTC
                            </div>

                            <div className="text-[9px] font-mono text-slate-600 mt-0.5">
                              {item.amount.toLocaleString()}{' '}
                              sats
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* ===================================================
              FINDINGS
          ==================================================== */}

          <section>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-300" />

                  <h3 className="text-sm font-semibold text-white">
                    Address Exposure Findings
                  </h3>
                </div>

                <p className="text-xs text-slate-500 mt-1">
                  Observable signals identified by the privacy
                  analysis engine.
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

          {/* ===================================================
              DEFENSIVE PRIVACY
          ==================================================== */}

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
                    Interpret these signals as probabilistic
                    privacy indicators, not identity attribution.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.defensiveRecommendations.map(
                  (recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-black/15 p-4"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-400/[0.08] border border-emerald-400/15 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-mono text-emerald-300">
                          {String(index + 1).padStart(
                            2,
                            '0'
                          )}
                        </span>
                      </div>

                      <p className="text-xs leading-5 text-slate-400">
                        {recommendation}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* ===================================================
              LIMITATION
          ==================================================== */}

          <section className="rounded-xl border border-white/[0.06] bg-black/15 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />

              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Analysis Limitation
                </div>

                <p className="text-[11px] text-slate-600 leading-5 mt-1">
                  BlockShield analyzes public Bitcoin blockchain
                  data and heuristic patterns. Address activity does
                  not establish ownership, identity, intent, or
                  off-chain relationships. Findings represent
                  potential privacy exposure rather than definitive
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

/* =============================================================
   SUPPORT COMPONENTS
============================================================= */

interface AddressMetricProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
  warning?: boolean;
}

const AddressMetric: React.FC<AddressMetricProps> = ({
  label,
  value,
  icon,
  accent,
  warning,
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
          warning
            ? 'text-amber-300'
            : accent
            ? 'text-cyan-300'
            : 'text-slate-200'
        }`}
      >
        {value}
      </div>
    </div>
  );
};

interface MiniStatProps {
  label: string;
  value: string;
}

const MiniStat: React.FC<MiniStatProps> = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
      <div className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
        {label}
      </div>

      <div className="mt-1.5 text-sm font-mono font-semibold text-slate-200">
        {value}
      </div>
    </div>
  );
};
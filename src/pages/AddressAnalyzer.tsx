import React, { useState, useEffect } from 'react';
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
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { AddressActivityItem, BitcoinAddressInfo } from '../types/bitcoin';
import { PrivacyAnalysis } from '../types/privacy';
import { getAddressHistory, getBitcoinAddress } from '../tools/bitcoinTools';
import { analyzeAddressPrivacy } from '../tools/privacyTools';
import { PrivacyScoreGauge } from '../components/privacy/PrivacyScoreGauge';
import { FindingCard } from '../components/privacy/FindingCard';
import { DEMO_SCENARIOS } from '../services/bitcoin/demoData';
import { NavTab } from '../components/layout/Navbar';

interface AddressAnalyzerProps {
  initialAddress?: string;
  isDemoMode: boolean;
  onSendToCopilot: (addressInfo: BitcoinAddressInfo, analysis: PrivacyAnalysis) => void;
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
  const [addressInfo, setAddressInfo] = useState<BitcoinAddressInfo | null>(null);
  const [history, setHistory] = useState<AddressActivityItem[]>([]);
  const [analysis, setAnalysis] = useState<PrivacyAnalysis | null>(null);
  const [copied, setCopied] = useState(false);

  const validateAddress = (addr: string): boolean => {
    const clean = addr.trim();
    // Support P2PKH (1...), P2SH (3...), Bech32 SegWit (bc1q...), Bech32m Taproot (bc1p...)
    return /^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{38,90})$/.test(
      clean
    );
  };

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
      const info = await getBitcoinAddress(cleanAddr, mode);
      const hist = await getAddressHistory(cleanAddr, mode);
      const privAnalysis = analyzeAddressPrivacy(info);

      setAddressInfo(info);
      setHistory(hist);
      setAnalysis(privAnalysis);
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
      executeAnalysis(DEMO_SCENARIOS.address_reuse.address);
    }
  }, [initialAddress, isDemoMode]);

  const copyAddress = () => {
    if (!addressInfo) return;
    navigator.clipboard.writeText(addressInfo.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const demoPresets = [
    {
      label: 'High Reuse Address',
      addr: DEMO_SCENARIOS.address_reuse.address,
      desc: 'Observed in multiple transactions',
    },
    {
      label: 'Fresh Taproot Address',
      addr: DEMO_SCENARIOS.low_risk.address,
      desc: 'Single use SegWit/Taproot',
    },
    {
      label: 'Consolidation Target',
      addr: DEMO_SCENARIOS.high_linkability.address,
      desc: 'Subject of multiple input co-spends',
    },
  ];

  return (
    <div id="address-analyzer-page" className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* Search Header */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="font-mono text-lg font-bold text-white tracking-wide">
              BITCOIN ADDRESS PRIVACY & EXPOSURE AUDITOR
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate historical address reuse, balance accumulation, and co-spending linkability.
          </p>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeAnalysis(addressInput);
          }}
          className="flex flex-col sm:flex-row items-stretch gap-2.5"
        >
          <div className="relative flex-1">
            <input
              id="address-search-input"
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter Bitcoin address (e.g., bc1q..., bc1p..., 1...)"
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 placeholder-slate-500 transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            id="analyze-address-submit-btn"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-cyan-950/50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Analyze Address</span>
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Address Presets:
          </span>
          {demoPresets.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setAddressInput(preset.addr);
                executeAnalysis(preset.addr);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] font-sans hover:text-white transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Address Inspection Error: </span>
              <span>{error}</span>
            </div>
          </div>
        )}
      </section>

      {/* Loading State */}
      {loading && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center space-y-4 animate-pulse">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <div className="font-mono text-sm text-slate-200">
            Scanning Bitcoin Address Ledger History...
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Auditing total transactions, historical balance flows, script standard, and privacy reuse factors.
          </p>
        </div>
      )}

      {/* Results View */}
      {addressInfo && analysis && !loading && (
        <div className="space-y-8">
          {/* AI Banner */}
          <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900 border border-cyan-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-xs sm:text-sm font-sans">
                  Query AI Copilot Regarding this Address Profile
                </h4>
                <p className="text-xs text-slate-400">
                  Receive plain-English breakdowns of address reuse risks and UTXO isolation strategies.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onSendToCopilot(addressInfo, analysis);
                setActiveTab('copilot');
              }}
              id="analyze-addr-with-copilot-btn"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-950/50"
            >
              <span>Explain with AI Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Address Overview Card */}
          <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-slate-200 font-bold">
                  Address Profile & Format
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase font-semibold">
                {addressInfo.addressType.toUpperCase()} Standard
              </span>
            </div>

            {/* Address String */}
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                Public Bitcoin Address
              </span>
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 break-all">
                <span className="flex-1">{addressInfo.address}</span>
                <button
                  onClick={copyAddress}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Copy address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Stats Metric Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Transaction Count</span>
                <span className={`text-base font-bold mt-0.5 block ${addressInfo.txCount > 1 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {addressInfo.txCount} {addressInfo.txCount === 1 ? 'tx' : 'txs (Reused)'}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Confirmed Balance</span>
                <span className="text-cyan-400 font-bold text-base mt-0.5 block">
                  {(addressInfo.balance / 1e8).toFixed(4)} BTC
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Total Received</span>
                <span className="text-slate-200 font-bold text-base mt-0.5 block">
                  {(addressInfo.totalReceived / 1e8).toFixed(4)} BTC
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Total Sent</span>
                <span className="text-slate-200 font-bold text-base mt-0.5 block">
                  {(addressInfo.totalSent / 1e8).toFixed(4)} BTC
                </span>
              </div>
            </div>
          </section>

          {/* Privacy Score Gauge */}
          <PrivacyScoreGauge analysis={analysis} />

          {/* Activity Timeline */}
          <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-slate-200 font-bold">
                  On-Chain Activity Timeline ({history.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">Historical ledger interactions</span>
            </div>

            <div className="space-y-3">
              {history.map((item, index) => {
                const isIncoming = item.type === 'incoming';
                const isOutgoing = item.type === 'outgoing';

                return (
                  <div
                    key={item.txid || index}
                    className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg border ${
                          isIncoming
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isOutgoing
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        }`}
                      >
                        {isIncoming ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-bold text-slate-200 uppercase">{item.type}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 text-[11px] font-sans">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                          TX: {item.txid.slice(0, 16)}...{item.txid.slice(-8)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span
                        className={`text-sm font-bold block ${
                          isIncoming ? 'text-emerald-400' : 'text-slate-200'
                        }`}
                      >
                        {isIncoming ? '+' : '-'}
                        {(item.amount / 1e8).toFixed(4)} BTC
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {item.amount.toLocaleString()} sats
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Privacy Findings */}
          <section className="space-y-4">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-200">
              Address Exposure Findings ({analysis.findings.length})
            </h3>
            <div className="space-y-3">
              {analysis.findings.map((finding) => (
                <FindingCard key={finding.id} finding={finding} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

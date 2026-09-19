import React from 'react';
import {
  FileCheck,
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  Scale,
  CheckCircle2,
  XCircle,
  Cpu,
  Info,
} from 'lucide-react';

export const Methodology: React.FC = () => {
  const factors = [
    {
      name: 'Address Reuse',
      weight: '30%',
      description:
        'Calculates whether input addresses reappear as outputs, or whether an address has been observed across multiple previous blocks. Reuse collapses isolated transactions into a correlated identity graph.',
    },
    {
      name: 'Linkability (CIOH)',
      weight: '25%',
      description:
        'Evaluates the Common-Input-Ownership Heuristic. When multiple UTXOs are spent together in a non-collaborative transaction, outside surveillance algorithms infer single-entity control.',
    },
    {
      name: 'Transaction Structure & Change',
      weight: '20%',
      description:
        'Analyzes output symmetry, round-number payment amounts, and script type heterogeneity. Distinguishable change outputs allow observers to trace which party received change.',
    },
    {
      name: 'Public Exposure',
      weight: '15%',
      description:
        'Reflects the immutable reality of Bitcoin: total values transferred, fee rates, confirmation timestamps, and script hashes are visible to any node or explorer globally.',
    },
    {
      name: 'Historical Patterns',
      weight: '10%',
      description:
        'Assesses the duration and volume of historical activity. Addresses or clusters with longer interaction timelines offer richer telemetry for heuristic clustering.',
    },
  ];

  return (
    <div id="methodology-page" className="py-6 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>TRANSPARENCY & METHODOLOGY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
          BLOCKSHIELD METHODOLOGY
        </h1>
        <p className="text-base text-slate-300 font-sans leading-relaxed max-w-3xl">
          Complete transparency into our mathematical risk calculation, heuristic assumptions, defensive boundaries, and cypherpunk privacy principles.
        </p>
      </div>

      {/* 4 Security Pillars */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
          <Eye className="w-6 h-6 text-cyan-400" />
          <span className="font-bold text-slate-100">PUBLIC DATA ONLY</span>
          <span className="text-[11px] text-slate-400 font-sans">
            Inspects only publicly broadcast transactions on the Bitcoin ledger.
          </span>
        </div>

        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
          <Lock className="w-6 h-6 text-emerald-400" />
          <span className="font-bold text-slate-100">NO PRIVATE KEYS</span>
          <span className="text-[11px] text-slate-400 font-sans">
            Never requests or processes private keys, xprv keys, or passwords.
          </span>
        </div>

        <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
          <Shield className="w-6 h-6 text-purple-400" />
          <span className="font-bold text-slate-100">NO SEED PHRASES</span>
          <span className="text-[11px] text-slate-400 font-sans">
            Zero wallet access or key generation. Non-custodial privacy intelligence.
          </span>
        </div>

        <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
          <Scale className="w-6 h-6 text-amber-400" />
          <span className="font-bold text-slate-100">NO IDENTITY CLAIMS</span>
          <span className="text-[11px] text-slate-400 font-sans">
            Probabilistic heuristics only. Never makes unsupported identity claims.
          </span>
        </div>
      </section>

      {/* Foundational Declaration Box */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 text-cyan-200 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold font-mono tracking-wide text-cyan-300">
            CORE MATHEMATICAL PRINCIPLE:
          </span>
          <p className="leading-relaxed font-sans">
            &quot;Privacy analysis is probabilistic, not proof of ownership or identity.&quot;
            Heuristics identify patterns commonly exploited by chain surveillance firms, allowing Bitcoin users to proactively recognize and eliminate correlation vectors.
          </p>
        </div>
      </div>

      {/* Mathematical Breakdown of the 5 Factors */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div>
          <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider">
            Heuristic Risk Formula & Factor Weights
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            How the 0–100 Heuristic Privacy Risk Estimate is derived
          </p>
        </div>

        <div className="space-y-4">
          {factors.map((f, i) => (
            <div
              key={i}
              className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-sm font-sans">{f.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Weight: {f.weight}
                  </span>
                </div>
                <p className="text-slate-300 font-sans leading-relaxed text-xs">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What AI Can Explain vs What AI Cannot Determine */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>What BlockShield AI Can Verify</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Input and output counts, satoshi amounts, and fee rates.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Address reuse across confirmed blockchain transactions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Script type standards (Legacy, Nested SegWit, Taproot).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Co-spending patterns and equal-output CoinJoin signatures.</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900/80 border border-rose-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
            <XCircle className="w-4 h-4" />
            <span>What Heuristics Cannot Prove</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Real-world names, physical location, or legal ownership.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Off-chain exchange account linkage (KYC databases).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>IP address broadcast origin or network relay gossip.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Internal wallet configuration (multi-account HD derivation).</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

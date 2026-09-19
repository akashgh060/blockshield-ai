import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  Shield,
  Eye,
  Network,
  RefreshCw,
  Lock,
  Zap,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const PrivacyGuide: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const misconceptions = [
    {
      myth: 'Bitcoin is 100% anonymous digital cash.',
      reality:
        'Bitcoin is pseudonymous, not anonymous. Every transaction, satoshi amount, input source, and destination script is stored permanently on an open public ledger visible to anyone on Earth.',
    },
    {
      myth: 'If I do not put my name on an address, no one can link it to me.',
      reality:
        'Address reuse, KYC exchanges (where you verify your ID to purchase BTC), common-input spending, and off-chain telemetry (IP broadcasts, merchant invoices) allow chain analysis firms to cluster your addresses into a single real-world identity.',
    },
    {
      myth: 'A high privacy risk score means my Bitcoin is "tainted" or broken.',
      reality:
        'Risk scores in BlockShield AI are heuristic correlation estimates. They measure how easily a passive outside observer can guess which output is your change or link your previous payments together.',
    },
    {
      myth: 'CoinJoins are illegal and only used for illicit activities.',
      reality:
        'CoinJoins are cooperative cryptographic protocols designed to restore the digital fungibility and privacy that physical paper cash inherently possesses. Financial privacy is a fundamental human right.',
    },
  ];

  const defensivePractices = [
    {
      title: 'Single-Use Address Hygiene',
      description:
        'Never reuse an address. Generate a fresh address for every incoming payment. Address reuse aggregates your transaction history and destroys pseudonymity.',
      tag: 'Basic Hygiene',
    },
    {
      title: 'Coin Control',
      description:
        'Select specifically which UTXOs you spend in a transaction. This prevents your wallet from accidentally co-spending KYC-acquired coins with privately acquired coins.',
      tag: 'Intermediate',
    },
    {
      title: 'Taproot (P2TR) Migration',
      description:
        'Modern BIP 341 Taproot scripts make complex multisig transactions, lightning channel closes, and single-signature payments look identical on-chain.',
      tag: 'Protocol Standard',
    },
    {
      title: 'PayJoin (BIP 78)',
      description:
        'A collaborative payment where both the sender and the receiver contribute inputs. This completely breaks the Common-Input-Ownership Heuristic used by surveillance firms.',
      tag: 'Advanced Defensive',
    },
    {
      title: 'Lightning Network',
      description:
        'Conduct everyday microtransactions off-chain via routed payment channels. Only channel opening and closing transactions are recorded on the base ledger.',
      tag: 'Layer 2 Privacy',
    },
  ];

  return (
    <div id="privacy-guide-page" className="py-6 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>CYPHERPUNK BITCOIN EDUCATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
          BITCOIN PRIVACY GUIDE
        </h1>
        <p className="text-base text-slate-300 font-sans leading-relaxed max-w-3xl">
          Privacy without the jargon. Learn how Bitcoin&apos;s open ledger operates, why addresses become linkable, and how defensive privacy engineering protects financial sovereignty.
        </p>
      </div>

      {/* 3 Foundation Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base">The Open Ledger</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Bitcoin is an immutable public balance sheet. Anyone with an internet connection can download every block and inspect every transaction ever broadcast since the Genesis block in 2009.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Network className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base">Heuristic Clustering</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Surveillance algorithms analyze transaction structures. The Common-Input-Ownership Heuristic assumes that when you spend multiple coins together, you control all of them under one entity.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base">Defensive Cypherpunk Tools</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            By following strict single-use address hygiene, coin control, and collaborative protocols like PayJoin and CoinJoin, users can maintain robust privacy on an open ledger.
          </p>
        </div>
      </section>

      {/* Interactive Misconceptions (Debunking) */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider">
              Common Privacy Misconceptions
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Separating cryptographic reality from popular assumptions
          </p>
        </div>

        <div className="space-y-4">
          {misconceptions.map((item, index) => (
            <div
              key={index}
              className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-3"
            >
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                    Misconception:
                  </span>
                  <p className="font-semibold text-slate-100 text-sm mt-0.5">{item.myth}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                    Cypherpunk Reality:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans mt-0.5">
                    {item.reality}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Defensive Best Practices */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider">
              Defensive Best Practices Checklist
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proven engineering habits for preserving financial confidentiality on Bitcoin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {defensivePractices.map((practice, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2 shadow-lg hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-100 text-sm font-sans">{practice.title}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {practice.tag}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {practice.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

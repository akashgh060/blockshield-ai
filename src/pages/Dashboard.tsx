import React from 'react';
import {
  Shield,
  Search,
  Bot,
  Activity,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Lock,
  Cpu,
  Terminal,
} from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario } from '../services/bitcoin/demoData';
import { NavTab } from '../components/layout/Navbar';

interface DashboardProps {
  setActiveTab: (tab: NavTab) => void;
  onSelectScenario: (scenario: DemoScenario, targetTab: 'transaction' | 'copilot') => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  onOpenJudgeDemo: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  onSelectScenario,
  isDemoMode,
  setIsDemoMode,
  onOpenJudgeDemo,
}) => {
  const scenarios = Object.values(DEMO_SCENARIOS);

  return (
    <div id="dashboard-page" className="space-y-10 py-6 max-w-7xl mx-auto">
      {/* Demo Mode Notice Banner if active */}
      {isDemoMode && (
        <div
          id="demo-mode-dashboard-banner"
          className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900 border border-amber-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-300 text-xs uppercase tracking-wider">
                  Deterministic Demo Mode Active
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Offline Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Loaded with 3 curated Bitcoin privacy scenarios. You can inspect transactions or run the AI agent without external API keys.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenJudgeDemo}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-md shadow-amber-950/40"
            >
              <span>Judge Quick Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDemoMode(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
            >
              Switch to Live Node
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
        {/* Decorative Grid and Accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI-POWERED BITCOIN PRIVACY INTELLIGENCE</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-mono leading-tight">
              BLOCKSHIELD AI
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-sans">
              YOUR BITCOIN. YOUR PRIVACY.
            </h2>
          </div>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            Turn public Bitcoin blockchain data into understandable privacy intelligence.
            Detect address reuse, analyze linkability risks, inspect payment graphs, and query a tool-calling AI agent grounded in real blockchain heuristics.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              id="hero-analyze-tx-button"
              onClick={() => setActiveTab('transaction')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-950/60 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Analyze Transaction</span>
            </button>

            <button
              id="hero-try-demo-button"
              onClick={onOpenJudgeDemo}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Try Demo Scenarios</span>
            </button>

            <button
              id="hero-copilot-button"
              onClick={() => setActiveTab('copilot')}
              className="px-5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold text-sm border border-blue-500/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-blue-400" />
              <span>Open AI Copilot</span>
            </button>
          </div>

          {/* Security Notice Mini Banner */}
          <div className="pt-4 flex items-center gap-2.5 text-xs text-slate-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Custody Protocol: Never enter your seed phrase or private key.</span>
          </div>
        </div>
      </section>

      {/* 4 Core Intelligence Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-200">
              Defensive Intelligence Pillars
            </h3>
          </div>
          <span className="text-xs text-slate-400">Probabilistic on-chain analysis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Privacy Risk */}
          <div
            onClick={() => setActiveTab('transaction')}
            className="group bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-5 shadow-lg transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm font-sans">Heuristic Privacy Risk</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Evaluates transactions on a 0–100 risk scale (Low, Moderate, High, Very High) derived from 5 mathematical factors.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-medium text-cyan-400 group-hover:translate-x-0.5 transition-transform">
              <span>Inspect Scorer</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 2: Address Reuse */}
          <div
            onClick={() => setActiveTab('address')}
            className="group bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-5 shadow-lg transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm font-sans">Address Reuse Detection</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Flags direct input-output reuse and multiple historical activities that collapse user pseudonymity into a single profile.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-medium text-amber-400 group-hover:translate-x-0.5 transition-transform">
              <span>Inspect Addresses</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 3: Linkability */}
          <div
            onClick={() => setActiveTab('transaction')}
            className="group bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 rounded-xl p-5 shadow-lg transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm font-sans">Linkability & Clustering</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Identifies Common-Input-Ownership Heuristics (CIOH), round payment amounts, and asymmetrical change outputs.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-medium text-blue-400 group-hover:translate-x-0.5 transition-transform">
              <span>View Payment Flows</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 4: AI Copilot */}
          <div
            onClick={() => setActiveTab('copilot')}
            className="group bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-xl p-5 shadow-lg transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm font-sans">Tool-Calling AI Agent</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Queries blockchain tools in real time, streams execution telemetry, and generates grounded, defensive explanations.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-xs font-medium text-purple-400 group-hover:translate-x-0.5 transition-transform">
              <span>Chat with Agent</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Curated Hackathon Demo Scenarios */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-200">
              Interactive Test Scenarios
            </h3>
            <p className="text-xs text-slate-400">
              Select any pre-configured Bitcoin transaction to test privacy heuristics instantly
            </p>
          </div>
          <button
            onClick={onOpenJudgeDemo}
            className="text-xs text-amber-400 hover:text-amber-300 font-mono font-medium flex items-center gap-1"
          >
            <span>Open Scenario Picker</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario) => {
            const isLow = scenario.id === 'low_risk';
            const isReuse = scenario.id === 'address_reuse';

            return (
              <div
                key={scenario.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">{scenario.name}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isLow
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : isReuse
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      Score: {scenario.expectedScoreRange}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {scenario.description}
                  </p>

                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-400 break-all">
                    TX: {scenario.txid.slice(0, 16)}...{scenario.txid.slice(-8)}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => onSelectScenario(scenario, 'transaction')}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors text-center"
                  >
                    Inspect TX
                  </button>
                  <button
                    onClick={() => onSelectScenario(scenario, 'copilot')}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors text-center flex items-center justify-center gap-1"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Run AI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cypherpunk Defensive Manifesto Card */}
      <section className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cypherpunk Engineering Philosophy</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            &quot;Privacy is necessary for an open society in the electronic age. Privacy is not secrecy. A private matter is something one doesn&apos;t want the whole world to know, but a secret matter is something one doesn&apos;t want anybody to know.&quot;
          </p>
          <span className="text-xs text-slate-400 font-mono block">
            — Eric Hughes, A Cypherpunk&apos;s Manifesto (1993)
          </span>
        </div>

        <button
          onClick={() => setActiveTab('guide')}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-medium whitespace-nowrap flex items-center gap-1.5"
        >
          <span>Read Privacy Guide</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </section>
    </div>
  );
};

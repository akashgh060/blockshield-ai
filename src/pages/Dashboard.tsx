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
  Lock,
  Cpu,
  Terminal,
  Network,
  Eye,
  Zap,
  ExternalLink,
} from 'lucide-react';

import { DEMO_SCENARIOS, DemoScenario } from '../services/bitcoin/demoData';
import { NavTab } from '../components/layout/Navbar';

interface DashboardProps {
  setActiveTab: (tab: NavTab) => void;
  onSelectScenario: (
    scenario: DemoScenario,
    targetTab: 'transaction' | 'copilot'
  ) => void;
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
    <div
      id="dashboard-page"
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 space-y-7"
    >
      {/* =====================================================
          DEMO MODE BANNER
          ===================================================== */}
      {isDemoMode && (
        <section
          id="demo-mode-dashboard-banner"
          className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-[#0d1218]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.07] via-transparent to-transparent pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-lg border border-amber-400/20 bg-amber-400/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold font-mono uppercase tracking-[0.12em] text-amber-300">
                    Deterministic Demo Mode
                  </span>

                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/20">
                    Offline Ready
                  </span>
                </div>

                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  Three curated Bitcoin privacy scenarios are loaded for
                  repeatable demonstrations.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenJudgeDemo}
                className="btn btn-sm"
                style={{
                  color: '#ffe7a8',
                  background: 'rgba(245,184,75,.10)',
                  borderColor: 'rgba(245,184,75,.25)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Judge Demo
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => setIsDemoMode(false)}
                className="btn btn-sm"
              >
                Switch to Live
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          HERO
          ===================================================== */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1017] shadow-[0_20px_70px_rgba(0,0,0,.18)]">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />

        {/* Glow */}
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-cyan-400/[0.055] blur-3xl pointer-events-none" />

        <div className="absolute -bottom-32 -left-32 w-[360px] h-[360px] rounded-full bg-blue-500/[0.04] blur-3xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-[1.25fr_.75fr] gap-10 p-6 sm:p-9 lg:p-11">
          {/* Hero copy */}
          <div className="flex flex-col justify-center">
            <div className="eyebrow">
              AI-powered Bitcoin privacy intelligence
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.055em] text-white leading-[0.98]">
              BLOCKSHIELD
              <span className="text-cyan-400"> AI</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 font-medium">
              Your Bitcoin. Your privacy.
            </p>

            <p className="mt-5 max-w-2xl text-sm sm:text-[15px] leading-7 text-slate-400">
              Analyze publicly observable Bitcoin activity and turn complex
              blockchain signals into understandable privacy intelligence.
            </p>

            {/* Actions */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              <button
                id="hero-analyze-tx-button"
                onClick={() => setActiveTab('transaction')}
                className="btn btn-primary btn-lg"
              >
                <Search className="w-4 h-4" />
                Analyze Transaction
              </button>

              <button
                id="hero-copilot-button"
                onClick={() => setActiveTab('copilot')}
                className="btn btn-lg"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                AI Copilot
              </button>

              <button
                id="hero-try-demo-button"
                onClick={onOpenJudgeDemo}
                className="btn btn-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Judge Demo
              </button>
            </div>

            {/* Security note */}
            <div className="mt-7 flex items-start gap-2.5 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
              <span>
                Defensive analysis only. Never enter a seed phrase, private
                key, password, or other secret.
              </span>
            </div>
          </div>

          {/* Hero intelligence panel */}
          <div className="flex items-center">
            <div className="w-full rounded-xl border border-slate-800 bg-[#080d13]/80 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold font-mono tracking-[0.12em] text-slate-500 uppercase">
                      Intelligence Console
                    </p>
                    <p className="text-xs font-semibold text-slate-200">
                      Privacy Analysis Engine
                    </p>
                  </div>
                </div>

                <span className="badge badge-live">Operational</span>
              </div>

              <div className="py-5 space-y-4">
                {[
                  {
                    label: 'Address Reuse',
                    value: 'Detected',
                    width: '72%',
                    cls: 'bg-amber-400',
                  },
                  {
                    label: 'Linkability',
                    value: 'Analyzing',
                    width: '84%',
                    cls: 'bg-cyan-400',
                  },
                  {
                    label: 'Transaction Structure',
                    value: 'Evaluated',
                    width: '61%',
                    cls: 'bg-blue-400',
                  },
                  {
                    label: 'Public Exposure',
                    value: 'Visible',
                    width: '48%',
                    cls: 'bg-emerald-400',
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-slate-400">
                        {item.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {item.value}
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.cls}`}
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">
                    Network
                  </p>
                  <p className="mt-1 text-xs font-mono text-slate-300">
                    MAINNET
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">
                    Engine
                  </p>
                  <p className="mt-1 text-xs font-mono text-slate-300">
                    HEURISTIC
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">
                    Scale
                  </p>
                  <p className="mt-1 text-xs font-mono text-cyan-300">
                    0–100
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CORE ANALYSIS TOOLS
          ===================================================== */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-200">
                Privacy Intelligence
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Defensive signals derived from observable blockchain activity.
            </p>
          </div>

          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600">
            Probabilistic analysis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {/* Risk */}
          <button
            onClick={() => setActiveTab('transaction')}
            className="group text-left rounded-xl border border-slate-800 bg-[#0c1219] p-5 hover:border-cyan-400/25 hover:bg-[#0e151d] transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-cyan-400/10 border border-cyan-400/15 flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>

              <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 transition-colors" />
            </div>

            <h3 className="mt-5 text-sm font-semibold text-slate-100">
              Privacy Risk
            </h3>

            <p className="mt-2 text-xs leading-6 text-slate-500">
              Score transaction privacy from 0–100 using five explainable
              heuristic factors.
            </p>

            <div className="mt-4 text-[10px] font-mono uppercase tracking-wider text-cyan-400">
              Analyze transaction
            </div>
          </button>

          {/* Address */}
          <button
            onClick={() => setActiveTab('address')}
            className="group text-left rounded-xl border border-slate-800 bg-[#0c1219] p-5 hover:border-amber-400/25 hover:bg-[#0e151d] transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/15 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-300" />
              </div>

              <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-amber-300 transition-colors" />
            </div>

            <h3 className="mt-5 text-sm font-semibold text-slate-100">
              Address Reuse
            </h3>

            <p className="mt-2 text-xs leading-6 text-slate-500">
              Identify repeated address activity that may increase
              pseudonymous linkability.
            </p>

            <div className="mt-4 text-[10px] font-mono uppercase tracking-wider text-amber-300">
              Analyze address
            </div>
          </button>

          {/* Graph */}
          <button
            onClick={() => setActiveTab('transaction')}
            className="group text-left rounded-xl border border-slate-800 bg-[#0c1219] p-5 hover:border-blue-400/25 hover:bg-[#0e151d] transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-blue-400/10 border border-blue-400/15 flex items-center justify-center">
                <Network className="w-4 h-4 text-blue-300" />
              </div>

              <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-blue-300 transition-colors" />
            </div>

            <h3 className="mt-5 text-sm font-semibold text-slate-100">
              Linkability Graph
            </h3>

            <p className="mt-2 text-xs leading-6 text-slate-500">
              Inspect transaction structure, inputs, outputs and potential
              clustering signals.
            </p>

            <div className="mt-4 text-[10px] font-mono uppercase tracking-wider text-blue-300">
              Inspect graph
            </div>
          </button>

          {/* AI */}
          <button
            onClick={() => setActiveTab('copilot')}
            className="group text-left rounded-xl border border-slate-800 bg-[#0c1219] p-5 hover:border-emerald-400/25 hover:bg-[#0e151d] transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-emerald-400/10 border border-emerald-400/15 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-300" />
              </div>

              <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-emerald-300 transition-colors" />
            </div>

            <h3 className="mt-5 text-sm font-semibold text-slate-100">
              AI Privacy Copilot
            </h3>

            <p className="mt-2 text-xs leading-6 text-slate-500">
              Ask privacy questions and receive structured explanations
              grounded in blockchain analysis.
            </p>

            <div className="mt-4 text-[10px] font-mono uppercase tracking-wider text-emerald-300">
              Open copilot
            </div>
          </button>
        </div>
      </section>

      {/* =====================================================
          QUICK ANALYSIS
          ===================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* Scenario list */}
        <div className="rounded-xl border border-slate-800 bg-[#0b1017] overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-slate-200">
                  Quick Analysis Scenarios
                </h2>
              </div>

              <p className="mt-1 text-[11px] text-slate-500">
                Use deterministic examples for demonstrations.
              </p>
            </div>

            <button
              onClick={onOpenJudgeDemo}
              className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300"
            >
              Open demo
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {scenarios.map((scenario, index) => (
              <div
                key={scenario.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.015] transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-7 h-7 shrink-0 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-slate-500">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-slate-200">
                      {scenario.name}
                    </h3>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      {scenario.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectScenario(scenario, 'transaction')}
                  className="btn btn-sm shrink-0"
                >
                  Analyze
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System status */}
        <div className="rounded-xl border border-slate-800 bg-[#0b1017] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-200">
                System Status
              </h2>
            </div>

            <span className="badge badge-live">Online</span>
          </div>

          <div className="mt-5 space-y-3">
            {[
              ['Bitcoin Mainnet', 'Operational'],
              ['Privacy Engine', 'Operational'],
              ['Transaction Graph', 'Ready'],
              ['AI Copilot', 'Available'],
            ].map(([label, status]) => (
              <div
                key={label}
                className="flex items-center justify-between py-2.5 border-b border-slate-800/70 last:border-0"
              >
                <span className="text-xs text-slate-400">{label}</span>

                <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-slate-600">
              <Eye className="w-3 h-3" />
              Public blockchain data only
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          METHODOLOGY STRIP
          ===================================================== */}
      <section className="rounded-xl border border-slate-800 bg-[#0b1017] p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="md:col-span-2">
            <div className="eyebrow">How the score works</div>

            <h2 className="mt-3 text-lg font-semibold text-slate-100">
              Explainable privacy heuristics
            </h2>

            <p className="mt-2 text-xs leading-6 text-slate-500">
              BlockShield combines multiple observable signals instead of
              making identity claims about Bitcoin users.
            </p>
          </div>

          {[
            ['30%', 'Address Reuse'],
            ['25%', 'Linkability'],
            ['20%', 'Transaction Structure'],
          ].map(([weight, label]) => (
            <div
              key={label}
              className="rounded-lg border border-slate-800 bg-slate-950/40 p-4"
            >
              <p className="text-xl font-bold tracking-tight text-cyan-400">
                {weight}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
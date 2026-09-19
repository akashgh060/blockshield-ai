import React from 'react';
import {
  Sparkles,
  Shield,
  ArrowRight,
  X,
  Zap,
  Network,
  Bot,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Clock3,
} from 'lucide-react';

import {
  DEMO_SCENARIOS,
  DemoScenario,
} from '../../services/bitcoin/demoData';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (
    scenario: DemoScenario,
    targetView: 'transaction' | 'address' | 'copilot'
  ) => void;
}

export const JudgeDemoModal: React.FC<
  JudgeDemoModalProps
> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  if (!isOpen) return null;

  const scenariosList = Object.values(
    DEMO_SCENARIOS
  );

  const getScenarioConfig = (
    id: string
  ) => {
    if (id === 'low_risk') {
      return {
        icon: CheckCircle2,
        label: 'LOW RISK',
        accent: 'emerald',
        iconClass: 'text-emerald-300',
        badgeClass:
          'border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300',
        borderClass:
          'border-emerald-400/10 hover:border-emerald-400/30',
        glowClass:
          'bg-emerald-400/[0.04]',
      };
    }

    if (id === 'address_reuse') {
      return {
        icon: AlertTriangle,
        label: 'MODERATE RISK',
        accent: 'amber',
        iconClass: 'text-amber-300',
        badgeClass:
          'border-amber-400/20 bg-amber-400/[0.07] text-amber-300',
        borderClass:
          'border-amber-400/10 hover:border-amber-400/30',
        glowClass:
          'bg-amber-400/[0.04]',
      };
    }

    return {
      icon: Network,
      label: 'HIGH RISK',
      accent: 'rose',
      iconClass: 'text-rose-300',
      badgeClass:
        'border-rose-400/20 bg-rose-400/[0.07] text-rose-300',
      borderClass:
        'border-rose-400/10 hover:border-rose-400/30',
      glowClass:
        'bg-rose-400/[0.04]',
    };
  };

  return (
    <div
      id="judge-demo-modal-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        id="judge-demo-modal-content"
        className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/[0.10] bg-[#090d13] shadow-[0_30px_100px_rgba(0,0,0,0.65)]"
      >
        {/* =================================================
            AMBIENT BACKGROUND
        ================================================== */}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/3 w-[500px] h-[300px] rounded-full bg-cyan-400/[0.045] blur-3xl" />

          <div className="absolute -bottom-40 right-0 w-[400px] h-[300px] rounded-full bg-purple-500/[0.035] blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize:
                '32px 32px',
            }}
          />
        </div>

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="relative px-5 sm:px-7 pt-5 sm:pt-6 pb-5 border-b border-white/[0.07]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative w-11 h-11 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-cyan-300" />

                <span className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full border-2 border-[#090d13] bg-emerald-400" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm sm:text-base font-semibold tracking-tight text-white">
                    Hackathon Judge Demo
                  </h2>

                  <span className="px-2 py-0.5 rounded-md border border-cyan-400/15 bg-cyan-400/[0.05] text-[9px] font-mono uppercase tracking-wider text-cyan-300">
                    Deterministic
                  </span>

                  <span className="px-2 py-0.5 rounded-md border border-amber-400/15 bg-amber-400/[0.05] text-[9px] font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1">
                    <Clock3 className="w-2.5 h-2.5" />
                    &lt;3 min
                  </span>
                </div>

                <p className="mt-1.5 max-w-2xl text-[11px] sm:text-xs leading-5 text-slate-500">
                  Choose a controlled Bitcoin privacy scenario
                  and demonstrate the complete BlockShield
                  analysis pipeline.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.06] text-slate-500 hover:text-white flex items-center justify-center transition-all shrink-0"
              aria-label="Close demo modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Demo pipeline */}

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <PipelineStep
              number="01"
              icon={<Eye className="w-3.5 h-3.5" />}
              label="Observe"
              active
            />

            <PipelineStep
              number="02"
              icon={<Network className="w-3.5 h-3.5" />}
              label="Analyze"
              active
            />

            <PipelineStep
              number="03"
              icon={<Gauge className="w-3.5 h-3.5" />}
              label="Score"
              active
            />

            <PipelineStep
              number="04"
              icon={<Bot className="w-3.5 h-3.5" />}
              label="Explain"
              active
            />
          </div>
        </div>

        {/* =================================================
            SCENARIOS
        ================================================== */}

        <div className="relative overflow-y-auto max-h-[58vh] px-5 sm:px-7 py-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500">
                Available Scenarios
              </div>

              <div className="text-[11px] text-slate-700 mt-1">
                Select one to start the guided analysis.
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Offline demo data
            </div>
          </div>

          <div className="space-y-3">
            {scenariosList.map(
              (scenario, index) => {
                const config =
                  getScenarioConfig(
                    scenario.id
                  );

                const Icon = config.icon;

                return (
                  <div
                    key={scenario.id}
                    className={`group relative overflow-hidden rounded-2xl border ${config.borderClass} bg-[#0c1118] transition-all duration-200`}
                  >
                    {/* Accent glow */}

                    <div
                      className={`absolute inset-y-0 left-0 w-1 ${config.glowClass}`}
                    />

                    <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-white/[0.015] blur-2xl pointer-events-none" />

                    <div className="relative p-4 sm:p-5">
                      {/* Top row */}

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${config.badgeClass}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-semibold text-white">
                                {scenario.name}
                              </h3>

                              <span
                                className={`px-2 py-0.5 rounded-md border text-[9px] font-mono uppercase tracking-wider ${config.badgeClass}`}
                              >
                                {config.label}
                              </span>
                            </div>

                            <div className="mt-1.5 text-[10px] font-mono text-slate-600">
                              SCENARIO {String(index + 1).padStart(2, '0')}
                              <span className="mx-2 text-slate-800">
                                /
                              </span>
                              EXPECTED SCORE
                              <span className="ml-1.5 text-slate-400">
                                {scenario.expectedScoreRange}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="hidden sm:block text-[9px] font-mono uppercase tracking-wider text-slate-700">
                            TXID
                          </span>

                          <code className="px-2 py-1 rounded-lg border border-white/[0.05] bg-black/25 text-[9px] font-mono text-slate-500">
                            {scenario.txid.slice(
                              0,
                              10
                            )}
                            ...
                          </code>
                        </div>
                      </div>

                      {/* Description */}

                      <p className="mt-4 text-xs leading-5 text-slate-400 max-w-3xl">
                        {scenario.description}
                      </p>

                      {/* Heuristic */}

                      <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/20 p-3">
                        <div className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-cyan-400/[0.06] border border-cyan-400/10 flex items-center justify-center shrink-0">
                            <Zap className="w-3 h-3 text-cyan-300" />
                          </div>

                          <div>
                            <div className="text-[9px] font-mono uppercase tracking-wider text-cyan-300">
                              Key Heuristic
                            </div>

                            <div className="mt-1 text-[10px] leading-4 text-slate-500">
                              {scenario.keyHeuristic}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider text-slate-700">
                          <Shield className="w-3 h-3 text-slate-600" />
                          Defensive analysis only
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectScenario(
                                scenario,
                                'transaction'
                              );
                              onClose();
                            }}
                            className="h-9 px-3.5 rounded-xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.06] hover:border-white/[0.14] text-slate-300 hover:text-white text-[10px] font-medium flex items-center justify-center gap-2 transition-all"
                          >
                            <Network className="w-3.5 h-3.5 text-cyan-300" />

                            Inspect Transaction

                            <ArrowRight className="w-3 h-3 text-slate-600" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onSelectScenario(
                                scenario,
                                'copilot'
                              );
                              onClose();
                            }}
                            className="h-9 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[10px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/20"
                          >
                            <Bot className="w-3.5 h-3.5" />

                            Run AI Copilot

                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="relative px-5 sm:px-7 py-4 border-t border-white/[0.07] bg-black/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Shield className="w-3.5 h-3.5 text-emerald-300 mt-0.5 shrink-0" />

              <p className="text-[9px] sm:text-[10px] leading-4 text-slate-600">
                All scenario data is simulated and deterministic.
                No private keys, seed phrases, or real-world identity
                claims are involved.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-emerald-300">
                Demo Mode Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =============================================================
   PIPELINE STEP
============================================================= */

interface PipelineStepProps {
  number: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const PipelineStep: React.FC<
  PipelineStepProps
> = ({
  number,
  icon,
  label,
  active,
}) => {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 flex items-center gap-2.5 ${
        active
          ? 'border-white/[0.07] bg-white/[0.025]'
          : 'border-white/[0.04] bg-white/[0.01]'
      }`}
    >
      <span className="text-[8px] font-mono text-slate-700">
        {number}
      </span>

      <span
        className={
          active
            ? 'text-cyan-300'
            : 'text-slate-700'
        }
      >
        {icon}
      </span>

      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
        {label}
      </span>

      {active && (
        <CheckMark />
      )}
    </div>
  );
};

const CheckMark: React.FC = () => {
  return (
    <span className="ml-auto w-3.5 h-3.5 rounded-full bg-emerald-400/[0.08] border border-emerald-400/15 flex items-center justify-center">
      <span className="w-1 h-1 rounded-full bg-emerald-400" />
    </span>
  );
};
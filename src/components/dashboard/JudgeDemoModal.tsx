import React from 'react';
import { Sparkles, Shield, ArrowRight, X, Check, Zap, Network, RefreshCw } from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario } from '../../services/bitcoin/demoData';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: DemoScenario, targetView: 'transaction' | 'address' | 'copilot') => void;
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  if (!isOpen) return null;

  const scenariosList = Object.values(DEMO_SCENARIOS);

  return (
    <div
      id="judge-demo-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="judge-demo-modal-content"
        className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                HACKATHON JUDGE DEMO FLOW
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Ready in &lt;3 min
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Select a defensive Bitcoin privacy test scenario with simulated deterministic on-chain data.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            aria-label="Close demo modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Scenarios Cards */}
        <div className="space-y-3">
          {scenariosList.map((scenario) => {
            const isLow = scenario.id === 'low_risk';
            const isReuse = scenario.id === 'address_reuse';

            const borderTheme = isLow
              ? 'hover:border-emerald-500/60 border-emerald-500/20'
              : isReuse
              ? 'hover:border-amber-500/60 border-amber-500/20'
              : 'hover:border-rose-500/60 border-rose-500/20';

            const badgeTheme = isLow
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : isReuse
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/30';

            return (
              <div
                key={scenario.id}
                className={`bg-slate-950/70 p-4 rounded-xl border transition-all ${borderTheme} space-y-2.5`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm font-sans">{scenario.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${badgeTheme}`}>
                      {scenario.expectedScoreRange}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    TXID: {scenario.txid.slice(0, 8)}...
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {scenario.description}
                </p>

                <div className="bg-slate-900/80 p-2 rounded text-[11px] text-slate-400 font-sans border border-slate-800/60 flex items-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-cyan-300">Key Heuristic: </strong>
                    {scenario.keyHeuristic}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex flex-wrap items-center gap-2 justify-end">
                  <button
                    onClick={() => {
                      onSelectScenario(scenario, 'transaction');
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect Transaction</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectScenario(scenario, 'copilot');
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-900/30"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Copilot</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>* All data is simulated for deterministic offline demonstration</span>
          <span className="font-mono text-cyan-400">DEMO MODE ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

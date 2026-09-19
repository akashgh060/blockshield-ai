import React from 'react';
import { CheckCircle2, Clock, Loader2, XCircle, Terminal } from 'lucide-react';
import { ToolExecutionStep } from '../../types/agent';

interface ToolActivityStreamProps {
  steps: ToolExecutionStep[];
  isExecuting: boolean;
}

export const ToolActivityStream: React.FC<ToolActivityStreamProps> = ({ steps, isExecuting }) => {
  if (steps.length === 0 && !isExecuting) return null;

  return (
    <div
      id="ai-tool-activity-box"
      className="bg-slate-950 border border-cyan-500/20 rounded-xl p-4 shadow-xl font-mono text-xs space-y-3"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold tracking-wider text-slate-200 uppercase text-[11px]">
            AI Tool Activity
          </span>
        </div>
        {isExecuting ? (
          <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Agent Executing Pipeline...</span>
          </div>
        ) : (
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Pipeline Complete
          </span>
        )}
      </div>

      <div className="space-y-2">
        {steps.map((step) => {
          const isDone = step.status === 'completed';
          const isRunning = step.status === 'running';
          const isFailed = step.status === 'failed';

          return (
            <div
              key={step.id}
              className={`flex items-start justify-between gap-3 p-2 rounded border transition-all ${
                isRunning
                  ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-300'
                  : isDone
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                  : isFailed
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  : 'bg-slate-900/20 border-slate-800/40 text-slate-500'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">
                  {isRunning && <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {isFailed && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                  {step.status === 'pending' && <Clock className="w-3.5 h-3.5 text-slate-600" />}
                </div>

                <div>
                  <div className="font-medium text-[11px] flex items-center gap-2">
                    <span>{step.label}</span>
                    <span className="text-[9px] text-slate-500 font-normal">
                      [{step.toolName}]
                    </span>
                  </div>
                  {step.outputSummary && (
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                      ↳ {step.outputSummary}
                    </div>
                  )}
                </div>
              </div>

              {step.durationMs !== undefined && (
                <span className="text-[10px] text-slate-500 shrink-0">
                  {step.durationMs}ms
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

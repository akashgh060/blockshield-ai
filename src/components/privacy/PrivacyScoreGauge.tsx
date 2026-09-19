import React from 'react';
import { Shield, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PrivacyAnalysis, RiskLevel } from '../../types/privacy';

interface PrivacyScoreGaugeProps {
  analysis: PrivacyAnalysis;
}

export const PrivacyScoreGauge: React.FC<PrivacyScoreGaugeProps> = ({ analysis }) => {
  const { overallRiskScore, riskLevel, riskBreakdown, heuristicLabel, disclaimer } = analysis;

  const getLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'LOW':
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: CheckCircle2,
          bar: 'bg-emerald-500',
        };
      case 'MODERATE':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: Info,
          bar: 'bg-amber-500',
        };
      case 'HIGH':
        return {
          text: 'text-orange-400',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          icon: AlertTriangle,
          bar: 'bg-orange-500',
        };
      case 'VERY HIGH':
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: AlertCircle,
          bar: 'bg-rose-500',
        };
    }
  };

  const style = getLevelColor(riskLevel);
  const StatusIcon = style.icon;

  const factors = [
    riskBreakdown.addressReuse,
    riskBreakdown.linkability,
    riskBreakdown.transactionStructure,
    riskBreakdown.publicExposure,
    riskBreakdown.historicalPatterns,
  ];

  return (
    <div
      id="privacy-risk-score-card"
      className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden"
    >
      {/* Background subtle radial glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono text-sm uppercase tracking-wider text-slate-200 font-semibold">
              {heuristicLabel}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Defensive evaluation of publicly observable correlation indicators
          </p>
        </div>

        {/* Risk Level Badge */}
        <div className={`px-3 py-1 rounded-full border text-xs font-mono font-bold flex items-center gap-1.5 ${style.badge}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{riskLevel} RISK</span>
        </div>
      </div>

      {/* Score Display & Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Big Number */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-slate-800/70 text-center">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            Overall Risk Index
          </span>
          <div className="flex items-baseline gap-1 my-2">
            <span className={`text-5xl font-black font-mono tracking-tight ${style.text}`}>
              {overallRiskScore}
            </span>
            <span className="text-lg font-mono text-slate-500">/ 100</span>
          </div>

          {/* Mini progress track */}
          <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out ${style.bar}`}
              style={{ width: `${overallRiskScore}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-mono">
            {overallRiskScore < 35
              ? 'Minimal on-chain linkage'
              : overallRiskScore < 65
              ? 'Moderate correlation vectors'
              : 'Substantial heuristic clustering'}
          </span>
        </div>

        {/* Contributing Factors Breakdown */}
        <div className="md:col-span-8 space-y-3.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase">
            <span>Contributing Factor</span>
            <span>Estimated Weight & Score</span>
          </div>

          {factors.map((factor) => {
            const factorColor =
              factor.score > 60 ? 'bg-rose-500' : factor.score > 35 ? 'bg-amber-500' : 'bg-emerald-500';
            const factorTextColor =
              factor.score > 60 ? 'text-rose-400' : factor.score > 35 ? 'text-amber-400' : 'text-emerald-400';

            return (
              <div
                key={factor.name}
                className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50 hover:border-slate-700/80 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-200">{factor.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[10px] text-slate-400 font-sans">
                      ({Math.round(factor.weight * 100)}% weight)
                    </span>
                    <span className={`font-bold ${factorTextColor}`}>{factor.score} / 100</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden mb-1">
                  <div
                    className={`h-full ${factorColor} transition-all duration-500`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {factor.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="mt-6 pt-4 border-t border-slate-800/70 flex items-start gap-2.5 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-sans">{disclaimer}</p>
      </div>
    </div>
  );
};

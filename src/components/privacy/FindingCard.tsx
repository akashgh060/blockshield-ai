import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Shield,
  Lightbulb,
} from 'lucide-react';
import { PrivacyFinding, SeverityLevel } from '../../types/privacy';

interface FindingCardProps {
  finding: PrivacyFinding;
  defaultExpanded?: boolean;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getSeverityStyle = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return {
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          border: 'border-rose-500/20 hover:border-rose-500/40',
          icon: AlertCircle,
          iconColor: 'text-rose-400',
        };
      case 'medium':
        return {
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          border: 'border-amber-500/20 hover:border-amber-500/40',
          icon: AlertTriangle,
          iconColor: 'text-amber-400',
        };
      case 'low':
      default:
        return {
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          border: 'border-slate-800 hover:border-slate-700',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
        };
    }
  };

  const style = getSeverityStyle(finding.severity);
  const Icon = style.icon;

  return (
    <div
      id={`finding-card-${finding.id}`}
      className={`bg-slate-900/80 border rounded-xl p-4 transition-all duration-200 ${style.border}`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 ${style.iconColor} shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="font-semibold text-slate-100 text-sm">{finding.title}</h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${style.badge}`}>
                {finding.severity} SEVERITY
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Confidence: {Math.round(finding.confidence * 100)}%
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{finding.description}</p>
          </div>
        </div>

        {/* Toggle Expand */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors shrink-0"
          aria-label={isExpanded ? 'Collapse finding details' : 'Expand finding details'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {/* Why It Matters */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-semibold text-[11px] uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>Why It Matters</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">{finding.reason}</p>
          </div>

          {/* Defensive Limitations */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono font-semibold text-[11px] uppercase">
              <Info className="w-3.5 h-3.5" />
              <span>Limitations</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans">{finding.limitations}</p>
          </div>

          {/* Educational Note */}
          {finding.educationalNote && (
            <div className="md:col-span-2 bg-blue-950/20 p-3 rounded-lg border border-blue-800/30 flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-blue-200/90 text-xs font-sans">
                <strong className="text-blue-300">Cypherpunk Privacy Note: </strong>
                {finding.educationalNote}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

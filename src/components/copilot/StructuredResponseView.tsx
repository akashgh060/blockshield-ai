import React from 'react';
import {
  Shield,
  Eye,
  AlertTriangle,
  Network,
  Info,
  CheckCircle2,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { StructuredAIResponse } from '../../types/agent';

interface StructuredResponseViewProps {
  response: StructuredAIResponse;
}

export const StructuredResponseView: React.FC<StructuredResponseViewProps> = ({ response }) => {
  const [copied, setCopied] = React.useState(false);

  const fullText = `=== PRIVACY SUMMARY ===\n${response.summary}\n\n=== RISK ===\n${response.riskAssessment}\n\n=== WHAT IS VISIBLE ===\n${response.whatIsVisible}\n\n=== WHY IT MATTERS ===\n${response.whyItMatters}\n\n=== POTENTIAL LINKABILITY ===\n${response.potentialLinkability}\n\n=== LIMITATIONS ===\n${response.limitations}\n\n=== DEFENSIVE PRIVACY CONSIDERATIONS ===\n${response.defensiveConsiderations}`;

  const copyResponse = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="structured-ai-response-box"
      className="bg-slate-900/95 border border-cyan-500/30 rounded-xl p-5 shadow-2xl space-y-4 font-sans text-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <span className="font-mono font-bold text-slate-100 uppercase tracking-wider text-xs">
              Grounded AI Privacy Intelligence
            </span>
            <span className="block text-[10px] text-slate-400">
              Structured analysis backed by blockchain tools
            </span>
          </div>
        </div>

        <button
          onClick={copyResponse}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors"
          title="Copy full intelligence report"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* 1. PRIVACY SUMMARY */}
      <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
        <div className="flex items-center gap-1.5 font-mono font-semibold text-cyan-400 text-[11px] uppercase tracking-wide">
          <FileText className="w-3.5 h-3.5" />
          <span>Privacy Summary</span>
        </div>
        <p className="text-slate-200 leading-relaxed">{response.summary}</p>
      </div>

      {/* 2. RISK & WHAT IS VISIBLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* RISK */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 font-mono font-semibold text-amber-400 text-[11px] uppercase tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Risk Assessment</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{response.riskAssessment}</p>
        </div>

        {/* WHAT IS VISIBLE */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 font-mono font-semibold text-blue-400 text-[11px] uppercase tracking-wide">
            <Eye className="w-3.5 h-3.5" />
            <span>What Is Visible On-Chain</span>
          </div>
          <p className="text-slate-300 whitespace-pre-line leading-relaxed font-mono text-[11px]">
            {response.whatIsVisible}
          </p>
        </div>
      </div>

      {/* 3. WHY IT MATTERS & POTENTIAL LINKABILITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* WHY IT MATTERS */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 font-mono font-semibold text-purple-400 text-[11px] uppercase tracking-wide">
            <Info className="w-3.5 h-3.5" />
            <span>Why It Matters</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{response.whyItMatters}</p>
        </div>

        {/* POTENTIAL LINKABILITY */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 font-mono font-semibold text-orange-400 text-[11px] uppercase tracking-wide">
            <Network className="w-3.5 h-3.5" />
            <span>Potential Linkability</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{response.potentialLinkability}</p>
        </div>
      </div>

      {/* 4. DEFENSIVE PRIVACY CONSIDERATIONS */}
      <div className="bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-500/20 space-y-1.5">
        <div className="flex items-center gap-1.5 font-mono font-semibold text-emerald-400 text-[11px] uppercase tracking-wide">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Defensive Privacy Considerations</span>
        </div>
        <p className="text-emerald-100/90 whitespace-pre-line leading-relaxed">
          {response.defensiveConsiderations}
        </p>
      </div>

      {/* 5. LIMITATIONS */}
      <div className="bg-slate-950/90 p-3 rounded-lg border border-amber-500/20 flex items-start gap-2 text-slate-400 text-[11px]">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed italic">{response.limitations}</p>
      </div>
    </div>
  );
};

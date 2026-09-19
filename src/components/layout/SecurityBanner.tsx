import React from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  KeyRound,
  X,
} from 'lucide-react';

interface SecurityBannerProps {
  onDismiss?: () => void;
}

export const SecurityBanner: React.FC<
  SecurityBannerProps
> = ({ onDismiss }) => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025]">
        {/* Ambient glow */}
        <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-emerald-400/[0.04] blur-3xl pointer-events-none" />

        <div className="relative px-4 sm:px-5 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">

            {/* Icon */}
            <div className="w-9 h-9 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>

            {/* Main message */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                  Privacy-Safe Analysis
                </span>

                <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />

                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">
                  Defensive Intelligence
                </span>
              </div>

              <p className="mt-1 text-[10px] sm:text-[11px] leading-4 text-slate-500">
                BlockShield only uses publicly observable Bitcoin
                data. Never enter a seed phrase, private key,
                password, or other secret credential.
              </p>
            </div>

            {/* Security indicators */}
            <div className="flex items-center gap-1.5 shrink-0">
              <SecurityPill
                icon={<Eye className="w-3 h-3" />}
                label="Public Data"
              />

              <SecurityPill
                icon={<Lock className="w-3 h-3" />}
                label="Non-Custodial"
              />

              <SecurityPill
                icon={<KeyRound className="w-3 h-3" />}
                label="No Keys"
              />

              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  aria-label="Dismiss security notice"
                  className="ml-1 w-7 h-7 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] flex items-center justify-center text-slate-600 hover:text-slate-300 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SecurityPillProps {
  icon: React.ReactNode;
  label: string;
}

const SecurityPill: React.FC<
  SecurityPillProps
> = ({ icon, label }) => {
  return (
    <div className="hidden md:flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-white/[0.06] bg-white/[0.015] text-[8px] font-mono uppercase tracking-wider text-slate-600">
      <span className="text-emerald-400/70">
        {icon}
      </span>

      {label}
    </div>
  );
};

export default SecurityBanner;
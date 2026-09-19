import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const SecurityBanner: React.FC = () => {
  return (
    <div
      id="security-notice-banner"
      className="w-full bg-amber-950/40 border-y border-amber-500/20 px-4 py-2.5 text-xs text-amber-200/90 flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2.5 max-w-7xl mx-auto w-full">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-medium tracking-wide">
          DEFENSIVE INTELLIGENCE NOTICE:
        </span>
        <span className="text-amber-300/80">
          Never enter a seed phrase, private key, or wallet password. BlockShield AI inspects only publicly broadcast blockchain ledger transactions.
        </span>
      </div>
    </div>
  );
};

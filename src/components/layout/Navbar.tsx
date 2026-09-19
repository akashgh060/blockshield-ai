import React from 'react';
import {
  Shield,
  Bot,
  Layers,
  BookOpen,
  FileCheck,
  Search,
  Activity,
  Radio,
  Sparkles,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'transaction' | 'address' | 'copilot' | 'guide' | 'methodology';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isDemoMode: boolean;
  setIsDemoMode: (demo: boolean) => void;
  onOpenQuickDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDemoMode,
  setIsDemoMode,
  onOpenQuickDemo,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'transaction', label: 'Analyze TX', icon: Search },
    { id: 'address', label: 'Analyze Address', icon: Activity },
    { id: 'copilot', label: 'AI Copilot', icon: Bot },
    { id: 'guide', label: 'Privacy Guide', icon: BookOpen },
    { id: 'methodology', label: 'Methodology', icon: FileCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            id="brand-home-button"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-950/50 group-hover:border-cyan-400 transition-colors">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white font-mono text-base">
                  BLOCKSHIELD
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-sans">
                Privacy Intelligence for Bitcoin
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {item.label}
                  {item.id === 'copilot' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Status Indicators & Demo Mode Switch */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Trigger Button */}
          {onOpenQuickDemo && (
            <button
              id="quick-demo-nav-btn"
              onClick={onOpenQuickDemo}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Judge Demo</span>
            </button>
          )}

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
            <button
              id="toggle-mode-demo"
              onClick={() => setIsDemoMode(true)}
              className={`px-2 py-1 rounded transition-colors ${
                isDemoMode
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Demo Data
            </button>
            <button
              id="toggle-mode-live"
              onClick={() => setIsDemoMode(false)}
              className={`px-2 py-1 rounded transition-colors ${
                !isDemoMode
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Node
            </button>
          </div>

          {/* Network Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 text-[11px]">Bitcoin Mainnet</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950 px-2 py-1.5 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded text-[10px] font-medium whitespace-nowrap ${
                isActive ? 'text-cyan-400 bg-slate-900' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

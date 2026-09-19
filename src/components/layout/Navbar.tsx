import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Search,
  MapPin,
  Bot,
  BookOpen,
  FlaskConical,
  Menu,
  X,
  ChevronDown,
  Activity,
  Database,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'transaction'
  | 'address'
  | 'copilot'
  | 'guide'
  | 'methodology';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  /**
   * Demo mode state.
   */
  isDemoMode?: boolean;

  /**
   * Kept for compatibility with App.tsx.
   */
  setIsDemoMode?: (value: boolean) => void;

  /**
   * Opens the quick demo flow from App.tsx.
   */
  onOpenQuickDemo?: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  description: string;
}

const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDemoMode = false,
  setIsDemoMode,
  onOpenQuickDemo,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);

  const mainNav: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Privacy intelligence overview',
    },
    {
      id: 'copilot',
      label: 'AI Copilot',
      icon: Bot,
      description: 'Explainable privacy analysis',
    },
    {
      id: 'guide',
      label: 'Privacy Guide',
      icon: BookOpen,
      description: 'Bitcoin privacy fundamentals',
    },
    {
      id: 'methodology',
      label: 'Methodology',
      icon: FlaskConical,
      description: 'Risk scoring methodology',
    },
  ];

  const analysisItems: NavItem[] = [
    {
      id: 'transaction',
      label: 'Transaction',
      icon: Search,
      description: 'Analyze a Bitcoin transaction',
    },
    {
      id: 'address',
      label: 'Address',
      icon: MapPin,
      description: 'Analyze address exposure',
    },
  ];

  const navigate = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
    setAnalysisOpen(false);
  };

  const handleDemoToggle = () => {
    if (setIsDemoMode) {
      setIsDemoMode(!isDemoMode);
    }

    if (!isDemoMode && onOpenQuickDemo) {
      onOpenQuickDemo();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#070a0f]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-all duration-200 group-hover:border-white/20 group-hover:bg-white/[0.07]">
              <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-lg opacity-0 transition-opacity group-hover:opacity-100" />

              <Shield
                size={21}
                strokeWidth={1.8}
                className="relative text-cyan-300"
              />
            </div>

            <div className="hidden sm:block text-left">
              <div className="text-[15px] font-semibold tracking-[-0.02em] text-white">
                BlockShield
              </div>

              <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white/35">
                Bitcoin Privacy Intelligence
              </div>
            </div>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={[
                    'group relative flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200',
                    active
                      ? 'bg-white/[0.07] text-white'
                      : 'text-white/45 hover:bg-white/[0.04] hover:text-white/80',
                  ].join(' ')}
                >
                  <Icon
                    size={15}
                    strokeWidth={1.8}
                    className={
                      active
                        ? 'text-cyan-300'
                        : 'text-white/40 group-hover:text-white/65'
                    }
                  />

                  <span>{item.label}</span>

                  {active && (
                    <span className="absolute bottom-0 left-1/2 h-px w-8 -translate-x-1/2 bg-cyan-300/80" />
                  )}
                </button>
              );
            })}

            {/* Analysis dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAnalysisOpen((value) => !value)}
                className={[
                  'flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200',
                  activeTab === 'transaction' ||
                  activeTab === 'address' ||
                  analysisOpen
                    ? 'bg-white/[0.07] text-white'
                    : 'text-white/45 hover:bg-white/[0.04] hover:text-white/80',
                ].join(' ')}
              >
                <Activity
                  size={15}
                  strokeWidth={1.8}
                  className={
                    activeTab === 'transaction' ||
                    activeTab === 'address'
                      ? 'text-cyan-300'
                      : 'text-white/40'
                  }
                />

                <span>Analysis</span>

                <ChevronDown
                  size={13}
                  className={[
                    'transition-transform duration-200',
                    analysisOpen ? 'rotate-180' : '',
                  ].join(' ')}
                />
              </button>

              {analysisOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close analysis menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setAnalysisOpen(false)}
                  />

                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[290px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b1017]/98 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
                    <div className="px-3 pb-2 pt-2">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                        Blockchain Analysis
                      </div>
                    </div>

                    {analysisItems.map((item) => {
                      const Icon = item.icon;
                      const active = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigate(item.id)}
                          className={[
                            'flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200',
                            active
                              ? 'bg-cyan-400/[0.08]'
                              : 'hover:bg-white/[0.05]',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
                              active
                                ? 'border-cyan-300/20 bg-cyan-300/[0.08]'
                                : 'border-white/[0.07] bg-white/[0.03]',
                            ].join(' ')}
                          >
                            <Icon
                              size={16}
                              className={
                                active
                                  ? 'text-cyan-300'
                                  : 'text-white/45'
                              }
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div
                              className={[
                                'text-[13px] font-medium',
                                active
                                  ? 'text-white'
                                  : 'text-white/70',
                              ].join(' ')}
                            >
                              {item.label}
                            </div>

                            <div className="mt-0.5 truncate text-[10px] text-white/30">
                              {item.description}
                            </div>
                          </div>

                          <ChevronDown
                            size={13}
                            className="-rotate-90 text-white/20"
                          />
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right controls */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Network */}
            <div className="mr-1 hidden items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 xl:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/40">
                Bitcoin Mainnet
              </span>

              <Database
                size={12}
                className="text-white/25"
              />
            </div>

            {/* Demo / Live */}
            <button
              type="button"
              onClick={handleDemoToggle}
              className={[
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-200',
                isDemoMode
                  ? 'border-amber-300/20 bg-amber-300/[0.07] text-amber-200 hover:bg-amber-300/[0.11]'
                  : 'border-white/[0.07] bg-white/[0.025] text-white/40 hover:bg-white/[0.05] hover:text-white/60',
              ].join(' ')}
            >
              <span
                className={[
                  'h-1.5 w-1.5 rounded-full',
                  isDemoMode
                    ? 'bg-amber-300'
                    : 'bg-emerald-400',
                ].join(' ')}
              />

              {isDemoMode ? 'Demo Mode' : 'Live Mode'}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/65 transition-colors hover:bg-white/[0.06] md:hidden"
            aria-label={
              mobileOpen
                ? 'Close navigation'
                : 'Open navigation'
            }
          >
            {mobileOpen ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[72px] z-40 border-b border-white/[0.07] bg-[#080c12]/98 backdrop-blur-2xl md:hidden">
          <div className="max-h-[calc(100vh-72px)] overflow-y-auto px-4 py-5">
            {/* Mobile status */}
            <div className="mb-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">
                  Bitcoin Mainnet
                </span>
              </div>

              <button
                type="button"
                onClick={handleDemoToggle}
                className={[
                  'rounded-lg border px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em]',
                  isDemoMode
                    ? 'border-amber-300/20 bg-amber-300/[0.07] text-amber-200'
                    : 'border-white/[0.07] bg-white/[0.03] text-white/40',
                ].join(' ')}
              >
                {isDemoMode
                  ? 'Demo Mode'
                  : 'Live Mode'}
              </button>
            </div>

            {/* Main links */}
            <div className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className={[
                      'flex w-full items-center gap-3 rounded-xl p-3.5 text-left transition-all',
                      active
                        ? 'border border-cyan-300/10 bg-cyan-300/[0.06]'
                        : 'border border-transparent hover:bg-white/[0.04]',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'flex h-9 w-9 items-center justify-center rounded-lg',
                        active
                          ? 'bg-cyan-300/[0.08] text-cyan-300'
                          : 'bg-white/[0.035] text-white/40',
                      ].join(' ')}
                    >
                      <Icon size={17} />
                    </div>

                    <div className="flex-1">
                      <div
                        className={[
                          'text-[13px] font-medium',
                          active
                            ? 'text-white'
                            : 'text-white/65',
                        ].join(' ')}
                      >
                        {item.label}
                      </div>

                      <div className="mt-0.5 text-[10px] text-white/30">
                        {item.description}
                      </div>
                    </div>

                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile analysis */}
            <div className="mt-5">
              <div className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Analysis
              </div>

              <div className="space-y-1">
                {analysisItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(item.id)}
                      className={[
                        'flex w-full items-center gap-3 rounded-xl p-3.5 text-left transition-all',
                        active
                          ? 'border border-cyan-300/10 bg-cyan-300/[0.06]'
                          : 'border border-transparent hover:bg-white/[0.04]',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'flex h-9 w-9 items-center justify-center rounded-lg',
                          active
                            ? 'bg-cyan-300/[0.08] text-cyan-300'
                            : 'bg-white/[0.035] text-white/40',
                        ].join(' ')}
                      >
                        <Icon size={17} />
                      </div>

                      <div className="flex-1">
                        <div
                          className={[
                            'text-[13px] font-medium',
                            active
                              ? 'text-white'
                              : 'text-white/65',
                          ].join(' ')}
                        >
                          {item.label}
                        </div>

                        <div className="mt-0.5 text-[10px] text-white/30">
                          {item.description}
                        </div>
                      </div>

                      <ChevronDown
                        size={14}
                        className="-rotate-90 text-white/20"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Defensive notice */}
            <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center gap-2">
                <Shield
                  size={14}
                  className="text-cyan-300/70"
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Defensive Analysis
                </span>
              </div>

              <p className="mt-2 text-[10px] leading-relaxed text-white/30">
                BlockShield analyzes publicly observable Bitcoin
                patterns. Never enter seed phrases, private keys,
                passwords, or other secrets.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Navbar };
export default Navbar;
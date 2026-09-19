import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import {
  Activity,
  Brain,
  BookOpen,
  Menu,
  ShieldCheck,
  X,
  Zap,
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
  isDemoMode?: boolean;
  setIsDemoMode?: (value: boolean) => void;
  onOpenQuickDemo?: () => void;
}

const navigationItems = [
  { id: 'dashboard' as NavTab, label: 'Dashboard', icon: Activity },
  { id: 'copilot' as NavTab, label: 'AI Copilot', icon: Brain },
  { id: 'guide' as NavTab, label: 'Privacy Guide', icon: BookOpen },
  { id: 'methodology' as NavTab, label: 'Methodology', icon: ShieldCheck },
];

const analysisItems = [
  { id: 'transaction' as NavTab, label: 'Transaction Analyzer' },
  { id: 'address' as NavTab, label: 'Address Analyzer' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDemoMode = false,
  setIsDemoMode,
  onOpenQuickDemo,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (tab: NavTab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  const handleDemo = () => {
    const next = !isDemoMode;

    setIsDemoMode?.(next);

    if (next) {
      onOpenQuickDemo?.();
    }
  };

  return (
    <>
      {/* =========================
          NAVBAR
      ========================== */}
      <header
        className="
          relative
          z-[9999]
          w-full
          border-b
          border-white/[0.08]
          bg-[#070a0f]
        "
        style={{ isolation: 'isolate' }}
      >
        <div
          className="
            mx-auto
            flex
            min-h-[76px]
            w-full
            max-w-[1800px]
            items-center
            gap-3
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* LOGO */}
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06]">
              <ShieldCheck
                size={21}
                className="text-cyan-400"
              />
            </div>

            <div className="hidden shrink-0 text-left sm:block">
              <div className="text-[14px] font-bold tracking-[0.18em] text-white">
                BLOCKSHIELD
              </div>

              <div className="mt-0.5 whitespace-nowrap text-[8px] uppercase tracking-[0.18em] text-slate-500">
                Bitcoin Privacy Intelligence
              </div>
            </div>
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden shrink-0 items-center gap-1 lg:flex">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={[
                    'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-[11px] font-medium whitespace-nowrap transition-all',
                    active
                      ? 'bg-white/[0.08] text-white'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-white',
                  ].join(' ')}
                >
                  <Icon
                    size={15}
                    className={
                      active
                        ? 'text-cyan-400'
                        : 'text-slate-500'
                    }
                  />

                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* TRANSACTION */}
            <button
              type="button"
              onClick={() => navigate('transaction')}
              className={[
                'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-[11px] font-medium whitespace-nowrap transition-all',
                activeTab === 'transaction'
                  ? 'bg-cyan-400/[0.08] text-cyan-300'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-white',
              ].join(' ')}
            >
              <Activity size={15} />

              <span>Transaction</span>
            </button>

            {/* ADDRESS */}
            <button
              type="button"
              onClick={() => navigate('address')}
              className={[
                'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-[11px] font-medium whitespace-nowrap transition-all',
                activeTab === 'address'
                  ? 'bg-cyan-400/[0.08] text-cyan-300'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-white',
              ].join(' ')}
            >
              <Activity size={15} />

              <span>Address</span>
            </button>
          </nav>

          {/* CENTER PRIVACY STATUS */}
          <div className="flex min-w-0 flex-1 items-center justify-center px-2 sm:px-3">
            <div className="flex min-w-0 max-w-full items-center gap-2 overflow-hidden rounded-lg border border-cyan-400/30 bg-cyan-400/[0.08] px-3 py-2 shadow-[0_0_20px_rgba(34,211,238,0.08)] sm:gap-3 sm:px-5 sm:py-2.5">
              <ShieldCheck
                size={15}
                className="shrink-0 text-cyan-400 sm:h-4 sm:w-4"
              />

              <span className="shrink-0 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.10em] text-cyan-300 sm:text-[10px] sm:tracking-[0.16em]">
                Privacy
              </span>

              <span className="shrink-0 text-slate-500">
                •
              </span>

              <span className="shrink-0 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.10em] text-white sm:text-[10px] sm:tracking-[0.16em]">
                Safe Analysis
              </span>

              <span className="shrink-0 text-slate-500">
                •
              </span>

              <span className="shrink-0 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.10em] text-cyan-400 sm:text-[10px] sm:tracking-[0.16em]">
                Defensive Intelligence
              </span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {/* BITCOIN LIVE */}
            <div className="hidden shrink-0 items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-2 2xl:flex">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

              <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                Bitcoin Live
              </span>
            </div>

            {/* JUDGE DEMO */}
            <button
              type="button"
              onClick={handleDemo}
              className="hidden shrink-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[11px] font-semibold whitespace-nowrap text-slate-400 transition-all hover:border-orange-400/30 hover:text-orange-300 lg:flex"
            >
              <Zap size={14} />

              {isDemoMode
                ? 'Demo Active'
                : 'Judge Demo'}
            </button>

            {/* HAMBURGER */}
            <button
              type="button"
              aria-label={
                menuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={menuOpen}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                setMenuOpen((current) => !current);
              }}
              className="relative z-[2147483647] flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.04] text-white transition-all hover:border-cyan-400/30 hover:bg-cyan-400/[0.08] hover:text-cyan-300"
            >
              {menuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =========================
          POPUP MENU
      ========================== */}
      {menuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[2147483646] bg-black/65 backdrop-blur-sm"
            style={{ isolation: 'isolate' }}
          >
            {/* BACKDROP */}
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-transparent"
            />

            {/* POPUP CONTAINER */}
            <div
              className="
                absolute
                right-4
                top-[84px]
                z-[2147483647]
                flex
                max-h-[calc(100vh-100px)]
                w-[min(420px,calc(100vw-32px))]
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.10]
                bg-[#0a0e14]
                shadow-[0_25px_80px_rgba(0,0,0,0.65)]
              "
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {/* POPUP HEADER */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                    BlockShield AI
                  </div>

                  <div className="mt-1 text-[9px] uppercase tracking-[0.14em] text-slate-500">
                    Navigation
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 transition hover:border-white/[0.15] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [scrollbar-width:thin]">
                {/* PRIVACY STATUS */}
                <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] px-4 py-3">
                  <ShieldCheck
                    size={16}
                    className="shrink-0 text-cyan-400"
                  />

                  <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.12em] text-cyan-300">
                    Privacy
                  </span>

                  <span className="text-slate-600">
                    •
                  </span>

                  <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                    Safe Analysis
                  </span>

                  <span className="text-slate-600">
                    •
                  </span>

                  <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.12em] text-cyan-400">
                    Defensive Intelligence
                  </span>
                </div>

                {/* MAIN */}
                <div className="mt-4">
                  <div className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.20em] text-slate-600">
                    Main
                  </div>

                  <div className="space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const active =
                        activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            navigate(item.id)
                          }
                          className={[
                            'flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all',
                            active
                              ? 'bg-cyan-400/[0.10] text-white'
                              : 'text-slate-300 hover:bg-white/[0.05] hover:text-white',
                          ].join(' ')}
                        >
                          <div
                            className={[
                              'flex h-9 w-9 items-center justify-center rounded-lg',
                              active
                                ? 'bg-cyan-400/[0.12]'
                                : 'bg-white/[0.03]',
                            ].join(' ')}
                          >
                            <Icon
                              size={17}
                              className={
                                active
                                  ? 'text-cyan-400'
                                  : 'text-slate-500'
                              }
                            />
                          </div>

                          <span>{item.label}</span>

                          {active && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ON-CHAIN ANALYSIS */}
                <div className="mt-5 border-t border-white/[0.07] pt-4">
                  <div className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.20em] text-slate-600">
                    On-Chain Analysis
                  </div>

                  <div className="space-y-1">
                    {analysisItems.map((item) => {
                      const active =
                        activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            navigate(item.id)
                          }
                          className={[
                            'flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all',
                            active
                              ? 'bg-cyan-400/[0.10] text-cyan-300'
                              : 'text-slate-300 hover:bg-white/[0.05] hover:text-white',
                          ].join(' ')}
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03]">
                            <Activity
                              size={17}
                              className={
                                active
                                  ? 'text-cyan-400'
                                  : 'text-slate-500'
                              }
                            />
                          </div>

                          <span>{item.label}</span>

                          {active && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="mt-5 flex gap-2 border-t border-white/[0.07] pt-4">
                  {/* BITCOIN LIVE */}
                  <div className="flex flex-1 items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                      Bitcoin Live
                    </span>
                  </div>

                  {/* JUDGE DEMO */}
                  <button
                    type="button"
                    onClick={handleDemo}
                    className="flex items-center gap-2 rounded-xl border border-orange-400/20 bg-orange-400/[0.07] px-4 py-3 text-[10px] font-semibold text-orange-300 transition hover:bg-orange-400/[0.12]"
                  >
                    <Zap size={14} />

                    {isDemoMode
                      ? 'Demo Active'
                      : 'Judge Demo'}
                  </button>
                </div>

                {/* EXTRA BOTTOM SPACE FOR SCROLL */}
                <div className="h-4" />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Navbar;
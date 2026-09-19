import React, { useState } from 'react';

import {
  Navbar,
  NavTab,
} from './components/layout/Navbar';

import {
  JudgeDemoModal,
} from './components/dashboard/JudgeDemoModal';

import { Dashboard } from './pages/Dashboard';

import {
  TransactionAnalyzer,
} from './pages/TransactionAnalyzer';

import {
  AddressAnalyzer,
} from './pages/AddressAnalyzer';

import {
  AICopilot,
} from './pages/AICopilot';

import {
  PrivacyGuide,
} from './pages/PrivacyGuide';

import {
  Methodology,
} from './pages/Methodology';

import {
  BitcoinAddressInfo,
  BitcoinTransaction,
} from './types/bitcoin';

import {
  PrivacyAnalysis,
} from './types/privacy';

import {
  DemoScenario,
  DEMO_SCENARIOS,
} from './services/bitcoin/demoData';

import {
  setGlobalBitcoinMode,
} from './services/bitcoin';

import { Shield } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] =
    useState<NavTab>('dashboard');

  const [isDemoMode, setIsDemoModeState] =
    useState<boolean>(true);

  const [isJudgeDemoOpen, setIsJudgeDemoOpen] =
    useState<boolean>(false);

  const [selectedTxid, setSelectedTxid] =
    useState<string>(
      DEMO_SCENARIOS.low_risk.txid
    );

  const [selectedAddress, setSelectedAddress] =
    useState<string>(
      DEMO_SCENARIOS.address_reuse.address
    );

  const [activeTx, setActiveTx] =
    useState<BitcoinTransaction | null>(null);

  const [activeAddressInfo, setActiveAddressInfo] =
    useState<BitcoinAddressInfo | null>(null);

  const [activeAnalysis, setActiveAnalysis] =
    useState<PrivacyAnalysis | null>(null);

  const setIsDemoMode = (value: boolean) => {
    setIsDemoModeState(value);

    setGlobalBitcoinMode(
      value ? 'demo' : 'live'
    );
  };

  const handleSelectScenario = (
    scenario: DemoScenario,
    target:
      | 'transaction'
      | 'address'
      | 'copilot'
  ) => {
    setSelectedTxid(scenario.txid);

    setSelectedAddress(scenario.address);

    setActiveTx(
      scenario.transaction
    );

    setActiveAnalysis(null);

    setActiveTab(target);

    setIsJudgeDemoOpen(false);
  };

  const handleSendTxToCopilot = (
    tx: BitcoinTransaction,
    analysis: PrivacyAnalysis
  ) => {
    setActiveTx(tx);

    setActiveAnalysis(analysis);

    setActiveAddressInfo(null);

    setSelectedTxid(tx.txid);

    setActiveTab('copilot');
  };

  const handleSendAddrToCopilot = (
    addrInfo: BitcoinAddressInfo,
    analysis: PrivacyAnalysis
  ) => {
    setActiveAddressInfo(addrInfo);

    setActiveAnalysis(analysis);

    setActiveTx(null);

    setSelectedAddress(
      addrInfo.address
    );

    setActiveTab('copilot');
  };

  return (
    <div className="min-h-screen w-full bg-[#070a0f] font-sans text-slate-100">

      {/* =========================================================
          NAVBAR
          Security / Privacy messaging is now INSIDE Navbar.
          No separate SecurityBanner.
      ========================================================= */}

      <div className="relative z-[300] block w-full">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDemoMode={isDemoMode}
          setIsDemoMode={setIsDemoMode}
          onOpenQuickDemo={() =>
            setIsJudgeDemoOpen(true)
          }
        />
      </div>

      {/* =========================================================
          MAIN APPLICATION
      ========================================================= */}

      <main className="relative z-0 min-h-[calc(100vh-76px)] w-full">

        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onSelectScenario={
              handleSelectScenario
            }
            isDemoMode={isDemoMode}
            setIsDemoMode={setIsDemoMode}
            onOpenJudgeDemo={() =>
              setIsJudgeDemoOpen(true)
            }
          />
        )}

        {activeTab === 'transaction' && (
          <TransactionAnalyzer
            initialTxid={selectedTxid}
            isDemoMode={isDemoMode}
            onSendToCopilot={
              handleSendTxToCopilot
            }
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'address' && (
          <AddressAnalyzer
            initialAddress={
              selectedAddress
            }
            isDemoMode={isDemoMode}
            onSendToCopilot={
              handleSendAddrToCopilot
            }
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'copilot' && (
          <AICopilot
            initialTransaction={
              activeTx
            }
            initialAddressInfo={
              activeAddressInfo
            }
            initialAnalysis={
              activeAnalysis
            }
            isDemoMode={isDemoMode}
          />
        )}

        {activeTab === 'guide' && (
          <PrivacyGuide />
        )}

        {activeTab === 'methodology' && (
          <Methodology />
        )}

      </main>

      {/* =========================================================
          JUDGE DEMO MODAL
      ========================================================= */}

      <JudgeDemoModal
        isOpen={isJudgeDemoOpen}
        onClose={() =>
          setIsJudgeDemoOpen(false)
        }
        onSelectScenario={
          handleSelectScenario
        }
      />

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="relative z-10 w-full border-t border-white/[0.07] bg-[#070a0f] px-4 py-8 text-xs text-slate-400 sm:px-6 lg:px-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">

          <div className="flex items-center gap-2 text-center sm:text-left">

            <Shield
              className="h-4 w-4 shrink-0 text-cyan-400"
            />

            <span className="font-mono font-bold text-slate-200">
              BLOCKSHIELD AI
            </span>

            <span className="hidden text-slate-500 sm:inline">
              —
            </span>

            <span className="hidden sm:inline">
              Cypherpunk Privacy Intelligence for Bitcoin
            </span>

          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] text-slate-500 sm:gap-4 sm:text-[11px]">

            <span>
              Deterministic Heuristics
            </span>

            <span className="text-slate-700">
              •
            </span>

            <span>
              Zero Custody
            </span>

            <span className="text-slate-700">
              •
            </span>

            <span>
              Public Ledger Verification
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default App;
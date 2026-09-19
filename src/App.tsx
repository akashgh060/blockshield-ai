import React, { useState } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { SecurityBanner } from './components/layout/SecurityBanner';
import { JudgeDemoModal } from './components/dashboard/JudgeDemoModal';
import { Dashboard } from './pages/Dashboard';
import { TransactionAnalyzer } from './pages/TransactionAnalyzer';
import { AddressAnalyzer } from './pages/AddressAnalyzer';
import { AICopilot } from './pages/AICopilot';
import { PrivacyGuide } from './pages/PrivacyGuide';
import { Methodology } from './pages/Methodology';
import { BitcoinAddressInfo, BitcoinTransaction } from './types/bitcoin';
import { PrivacyAnalysis } from './types/privacy';
import { DemoScenario, DEMO_SCENARIOS } from './services/bitcoin/demoData';
import { setGlobalBitcoinMode } from './services/bitcoin';
import { Shield } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(true);
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState<boolean>(false);

  // Cross-page inspection context
  const [selectedTxid, setSelectedTxid] = useState<string>(DEMO_SCENARIOS.low_risk.txid);
  const [selectedAddress, setSelectedAddress] = useState<string>(DEMO_SCENARIOS.address_reuse.address);
  const [activeTx, setActiveTx] = useState<BitcoinTransaction | null>(null);
  const [activeAddressInfo, setActiveAddressInfo] = useState<BitcoinAddressInfo | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<PrivacyAnalysis | null>(null);

  const setIsDemoMode = (val: boolean) => {
    setIsDemoModeState(val);
    setGlobalBitcoinMode(val ? 'demo' : 'live');
  };

  const handleSelectScenario = (
    scenario: DemoScenario,
    target: 'transaction' | 'address' | 'copilot'
  ) => {
    setSelectedTxid(scenario.txid);
    setSelectedAddress(scenario.address);
    setActiveTx(scenario.transaction);
    setActiveTab(target);
  };

  const handleSendTxToCopilot = (tx: BitcoinTransaction, analysis: PrivacyAnalysis) => {
    setActiveTx(tx);
    setActiveAnalysis(analysis);
    setActiveAddressInfo(null);
    setSelectedTxid(tx.txid);
    setActiveTab('copilot');
  };

  const handleSendAddrToCopilot = (addrInfo: BitcoinAddressInfo, analysis: PrivacyAnalysis) => {
    setActiveAddressInfo(addrInfo);
    setActiveAnalysis(analysis);
    setActiveTx(null);
    setSelectedAddress(addrInfo.address);
    setActiveTab('copilot');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Global Security Banner */}
      <SecurityBanner />

      {/* Global Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        onOpenQuickDemo={() => setIsJudgeDemoOpen(true)}
      />

      {/* Main Page Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onSelectScenario={handleSelectScenario}
            isDemoMode={isDemoMode}
            setIsDemoMode={setIsDemoMode}
            onOpenJudgeDemo={() => setIsJudgeDemoOpen(true)}
          />
        )}

        {activeTab === 'transaction' && (
          <TransactionAnalyzer
            initialTxid={selectedTxid}
            isDemoMode={isDemoMode}
            onSendToCopilot={handleSendTxToCopilot}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'address' && (
          <AddressAnalyzer
            initialAddress={selectedAddress}
            isDemoMode={isDemoMode}
            onSendToCopilot={handleSendAddrToCopilot}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'copilot' && (
          <AICopilot
            initialTransaction={activeTx}
            initialAddressInfo={activeAddressInfo}
            initialAnalysis={activeAnalysis}
            isDemoMode={isDemoMode}
          />
        )}

        {activeTab === 'guide' && <PrivacyGuide />}

        {activeTab === 'methodology' && <Methodology />}
      </main>

      {/* Global Judge Demo Modal */}
      <JudgeDemoModal
        isOpen={isJudgeDemoOpen}
        onClose={() => setIsJudgeDemoOpen(false)}
        onSelectScenario={handleSelectScenario}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-mono font-bold text-slate-200">BLOCKSHIELD AI</span>
            <span>— Cypherpunk Privacy Intelligence for Bitcoin</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Deterministic Heuristics</span>
            <span>•</span>
            <span>Zero Custody</span>
            <span>•</span>
            <span>Public Ledger Verification</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

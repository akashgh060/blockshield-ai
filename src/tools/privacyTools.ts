import { privacyEngine } from '../services/privacy/privacyEngine';
import { BitcoinAddressInfo, BitcoinTransaction } from '../types/bitcoin';
import { PrivacyAnalysis, PrivacyFinding } from '../types/privacy';

export function analyzeTransactionPrivacy(tx: BitcoinTransaction): PrivacyAnalysis {
  return privacyEngine.analyzeTransaction(tx);
}

export function analyzeAddressPrivacy(addrInfo: BitcoinAddressInfo): PrivacyAnalysis {
  return privacyEngine.analyzeAddress(addrInfo);
}

export function calculatePrivacyRisk(analysis: PrivacyAnalysis): {
  score: number;
  level: string;
  breakdown: PrivacyAnalysis['riskBreakdown'];
} {
  return {
    score: analysis.overallRiskScore,
    level: analysis.riskLevel,
    breakdown: analysis.riskBreakdown,
  };
}

export function getPrivacyFindings(analysis: PrivacyAnalysis): PrivacyFinding[] {
  return analysis.findings;
}

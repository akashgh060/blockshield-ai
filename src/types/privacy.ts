export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';

export interface PrivacyFinding {
  id: string;
  category: 'address_reuse' | 'linkability' | 'transaction_structure' | 'public_exposure' | 'historical_patterns';
  title: string;
  severity: SeverityLevel;
  confidence: number; // 0.0 to 1.0
  description: string;
  reason: string;
  limitations: string;
  educationalNote?: string;
}

export interface RiskFactorScore {
  name: string;
  score: number; // 0 to 100
  weight: number; // 0 to 1
  impact: 'low' | 'medium' | 'high';
  summary: string;
}

export interface PrivacyMetrics {
  inputCount: number;
  outputCount: number;
  totalInputValue: number;
  totalOutputValue: number;
  feePaid: number;
  distinctInputAddresses: number;
  distinctOutputAddresses: number;
  addressReuseCount: number;
  hasRoundNumberOutput: boolean;
  hasChangeOutputHeuristic: boolean;
  isEqualOutputCoinjoin: boolean;
  scriptTypeHomogeneity: 'uniform' | 'mixed' | 'legacy_mixed';
  consolidationRatio: number; // inputs / outputs
  peeledLogLength?: number;
}

export interface PrivacyAnalysis {
  targetId: string; // TXID or Address
  targetType: 'transaction' | 'address';
  timestamp: number;
  overallRiskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  heuristicLabel: string;
  findings: PrivacyFinding[];
  metrics: PrivacyMetrics;
  riskBreakdown: {
    addressReuse: RiskFactorScore;
    linkability: RiskFactorScore;
    transactionStructure: RiskFactorScore;
    publicExposure: RiskFactorScore;
    historicalPatterns: RiskFactorScore;
  };
  limitations: string[];
  defensiveRecommendations: string[];
  disclaimer: string;
}

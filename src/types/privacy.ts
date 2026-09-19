export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type RiskLevel =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'VERY HIGH';

export type PrivacyFindingCategory =
  | 'address_reuse'
  | 'linkability'
  | 'transaction_structure'
  | 'public_exposure'
  | 'historical_patterns';

export interface PrivacyFinding {
  id: string;

  category: PrivacyFindingCategory;

  title: string;

  severity: SeverityLevel;

  /**
   * Confidence in the heuristic finding.
   * Range: 0.0 - 1.0
   */
  confidence: number;

  description: string;

  reason: string;

  limitations: string;

  educationalNote?: string;
}

export interface RiskFactorScore {
  name: string;

  /**
   * Individual factor score.
   * Range: 0 - 100
   */
  score: number;

  /**
   * Weight used in the overall privacy score.
   * Range: 0 - 1
   */
  weight: number;

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

  scriptTypeHomogeneity:
    | 'uniform'
    | 'mixed'
    | 'legacy_mixed';

  /**
   * Number of inputs divided by number of outputs.
   */
  consolidationRatio: number;

  peeledLogLength?: number;
}

export interface PrivacyRiskBreakdown {
  addressReuse: RiskFactorScore;

  linkability: RiskFactorScore;

  transactionStructure: RiskFactorScore;

  publicExposure: RiskFactorScore;

  historicalPatterns: RiskFactorScore;
}

export interface PrivacyAnalysis {
  /**
   * Transaction ID or Bitcoin address being analyzed.
   */
  targetId: string;

  /**
   * Type of analysis.
   */
  targetType: 'transaction' | 'address';

  /**
   * Analysis timestamp.
   */
  timestamp: number;

  /**
   * Overall privacy risk score.
   *
   * 0 = lower observed privacy risk
   * 100 = higher observed privacy risk
   */
  overallRiskScore: number;

  /**
   * Backward-compatible alias for UI components
   * that still reference analysis.score.
   *
   * Always contains the same value as overallRiskScore.
   */
  score: number;

  /**
   * Human-readable risk classification.
   */
  riskLevel: RiskLevel;

  /**
   * Short explanation of the scoring result.
   */
  heuristicLabel: string;

  /**
   * Privacy findings discovered during analysis.
   */
  findings: PrivacyFinding[];

  /**
   * Observable transaction/address metrics.
   */
  metrics: PrivacyMetrics;

  /**
   * Individual weighted risk factors.
   */
  riskBreakdown: PrivacyRiskBreakdown;

  /**
   * Important limitations of blockchain-only analysis.
   */
  limitations: string[];

  /**
   * Defensive privacy considerations.
   */
  defensiveRecommendations: string[];

  /**
   * Safety and interpretation disclaimer.
   */
  disclaimer: string;
}
import { RiskFactorScore, RiskLevel } from '../../types/privacy';

export interface ScoreCalculationResult {
  overallRiskScore: number;
  riskLevel: RiskLevel;
  heuristicLabel: string;
  riskBreakdown: {
    addressReuse: RiskFactorScore;
    linkability: RiskFactorScore;
    transactionStructure: RiskFactorScore;
    publicExposure: RiskFactorScore;
    historicalPatterns: RiskFactorScore;
  };
}

export function calculatePrivacyScore(params: {
  addressReuseCount: number;
  inputCount: number;
  outputCount: number;
  hasChangeOutputHeuristic: boolean;
  isEqualOutputCoinjoin: boolean;
  scriptTypeHomogeneity: 'uniform' | 'mixed' | 'legacy_mixed';
  txHistoryCount?: number;
  isAddressAnalysis?: boolean;
}): ScoreCalculationResult {
  const {
    addressReuseCount,
    inputCount,
    outputCount,
    hasChangeOutputHeuristic,
    isEqualOutputCoinjoin,
    scriptTypeHomogeneity,
    txHistoryCount = 1,
    isAddressAnalysis = false,
  } = params;

  // 1. Address Reuse Factor (Weight: 30%)
  let addressReuseScore = 15;
  if (addressReuseCount > 0) {
    addressReuseScore = 90;
  } else if (txHistoryCount > 10) {
    addressReuseScore = 85;
  } else if (txHistoryCount > 3) {
    addressReuseScore = 65;
  } else if (txHistoryCount > 1) {
    addressReuseScore = 45;
  }

  // 2. Linkability Factor (Weight: 25%)
  let linkabilityScore = 20;
  if (isEqualOutputCoinjoin) {
    linkabilityScore = 10; // Plausible deniability
  } else if (inputCount >= 3) {
    linkabilityScore = 85; // Strong CIOH consolidation
  } else if (inputCount === 2) {
    linkabilityScore = 60;
  } else if (inputCount === 1 && outputCount === 2) {
    linkabilityScore = hasChangeOutputHeuristic ? 70 : 40;
  }

  // 3. Transaction Structure Factor (Weight: 20%)
  let structureScore = 25;
  if (isEqualOutputCoinjoin) {
    structureScore = 15;
  } else {
    if (hasChangeOutputHeuristic) structureScore += 35;
    if (scriptTypeHomogeneity === 'legacy_mixed') structureScore += 30;
    if (scriptTypeHomogeneity === 'mixed') structureScore += 15;
    if (outputCount > 5) structureScore += 10;
  }
  structureScore = Math.min(100, structureScore);

  // 4. Public Exposure Factor (Weight: 15%)
  // All public Bitcoin txs have intrinsic ledger visibility
  const publicExposureScore = isAddressAnalysis ? (txHistoryCount > 5 ? 75 : 50) : 45;

  // 5. Historical Patterns Factor (Weight: 10%)
  let historyScore = 20;
  if (txHistoryCount > 15) historyScore = 90;
  else if (txHistoryCount > 5) historyScore = 65;
  else if (txHistoryCount > 1) historyScore = 40;

  // Weighted overall calculation
  const weightedTotal =
    addressReuseScore * 0.30 +
    linkabilityScore * 0.25 +
    structureScore * 0.20 +
    publicExposureScore * 0.15 +
    historyScore * 0.10;

  const finalScore = Math.round(Math.max(5, Math.min(95, weightedTotal)));

  let riskLevel: RiskLevel = 'LOW';
  if (finalScore >= 75) {
    riskLevel = 'VERY HIGH';
  } else if (finalScore >= 55) {
    riskLevel = 'HIGH';
  } else if (finalScore >= 35) {
    riskLevel = 'MODERATE';
  } else {
    riskLevel = 'LOW';
  }

  return {
    overallRiskScore: finalScore,
    riskLevel,
    heuristicLabel: 'Heuristic Privacy Risk Estimate',
    riskBreakdown: {
      addressReuse: {
        name: 'Address Reuse',
        score: addressReuseScore,
        weight: 0.30,
        impact: addressReuseScore > 60 ? 'high' : addressReuseScore > 30 ? 'medium' : 'low',
        summary: addressReuseScore > 60
          ? 'High correlation risk from repetitive address utilization.'
          : 'Minimal or zero address reuse identified.',
      },
      linkability: {
        name: 'Linkability',
        score: linkabilityScore,
        weight: 0.25,
        impact: linkabilityScore > 60 ? 'high' : linkabilityScore > 30 ? 'medium' : 'low',
        summary: linkabilityScore > 60
          ? 'Observable input clustering (CIOH) or asymmetrical payment paths.'
          : 'Low input-output correlation or equal-value distribution.',
      },
      transactionStructure: {
        name: 'Transaction Structure',
        score: structureScore,
        weight: 0.20,
        impact: structureScore > 60 ? 'high' : structureScore > 30 ? 'medium' : 'low',
        summary: structureScore > 60
          ? 'Distinguishable change output or heterogeneous script fingerprint.'
          : 'Balanced outputs with uniform script standards.',
      },
      publicExposure: {
        name: 'Public Exposure',
        score: publicExposureScore,
        weight: 0.15,
        impact: 'medium',
        summary: 'All values, scripts, and confirmation timings are visible on the public blockchain.',
      },
      historicalPatterns: {
        name: 'Historical Patterns',
        score: historyScore,
        weight: 0.10,
        impact: historyScore > 60 ? 'high' : historyScore > 30 ? 'medium' : 'low',
        summary: historyScore > 60
          ? 'Extended timeline of historical interactions available for analysis.'
          : 'Limited historical footprint observed on-chain.',
      },
    },
  };
}

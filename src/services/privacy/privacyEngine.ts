import {
  BitcoinAddressInfo,
  BitcoinTransaction,
} from '../../types/bitcoin';

import { PrivacyAnalysis } from '../../types/privacy';

import {
  evaluateAddressFindings,
  evaluateTransactionFindings,
  evaluateTransactionMetrics,
} from './heuristics';

import { calculatePrivacyScore } from './privacyScore';

export class PrivacyEngine {
  /**
   * Analyze a single Bitcoin transaction for
   * publicly observable privacy indicators.
   */
  public analyzeTransaction(
    tx: BitcoinTransaction
  ): PrivacyAnalysis {
    const metrics = evaluateTransactionMetrics(tx);

    const findings = evaluateTransactionFindings(
      tx,
      metrics
    );

    const scoreResult = calculatePrivacyScore({
      addressReuseCount: metrics.addressReuseCount,

      inputCount: metrics.inputCount,

      outputCount: metrics.outputCount,

      hasChangeOutputHeuristic:
        metrics.hasChangeOutputHeuristic,

      isEqualOutputCoinjoin:
        metrics.isEqualOutputCoinjoin,

      scriptTypeHomogeneity:
        metrics.scriptTypeHomogeneity,

      isAddressAnalysis: false,
    });

    const limitations: string[] = [
      'Heuristic privacy analysis is probabilistic and evaluates publicly observable patterns only.',

      'Analysis cannot determine legal ownership, off-chain identity, or physical custody of private keys.',

      'External off-chain metadata such as exchange KYC, IP broadcasts, merchant records, or other external information can affect privacy in ways that are not visible on-chain.',

      'Collaborative transactions such as CoinJoin or PayJoin may intentionally produce patterns that differ from ordinary Bitcoin transaction heuristics.',
    ];

    const defensiveRecommendations: string[] = [];

    /*
     * Address reuse
     */
    if (metrics.addressReuseCount > 0) {
      defensiveRecommendations.push(
        'Consider using a fresh receiving address for future incoming transactions.'
      );
    }

    /*
     * UTXO consolidation
     */
    if (
      metrics.inputCount > 2 &&
      !metrics.isEqualOutputCoinjoin
    ) {
      defensiveRecommendations.push(
        'Avoid unnecessary consolidation of multiple small UTXOs in a single transaction; consider coin control when appropriate.'
      );
    }

    /*
     * Change-output heuristic
     */
    if (metrics.hasChangeOutputHeuristic) {
      defensiveRecommendations.push(
        'Consider privacy-preserving transaction techniques such as PayJoin when appropriate and supported by the wallet.'
      );
    }

    /*
     * Script-type consistency
     */
    if (
      metrics.scriptTypeHomogeneity !== 'uniform'
    ) {
      defensiveRecommendations.push(
        'Using consistent modern script types can reduce some transaction-pattern fingerprinting.'
      );
    }

    /*
     * Default recommendation
     */
    if (
      defensiveRecommendations.length === 0
    ) {
      defensiveRecommendations.push(
        'Maintain good coin-control and single-use address practices for future transactions.'
      );
    }

    const overallRiskScore =
      scoreResult.overallRiskScore;

    return {
      targetId: tx.txid,

      targetType: 'transaction',

      timestamp: Date.now(),

      overallRiskScore,

      /*
       * Backward-compatible UI field.
       *
       * Some existing components use:
       * analysis.score
       *
       * Keep it synchronized with overallRiskScore.
       */
      score: overallRiskScore,

      riskLevel:
        scoreResult.riskLevel,

      heuristicLabel:
        scoreResult.heuristicLabel,

      findings,

      metrics,

      riskBreakdown:
        scoreResult.riskBreakdown,

      limitations,

      defensiveRecommendations,

      disclaimer:
        'This score is an analytical estimate based on publicly observable blockchain patterns. It does not identify individuals or prove ownership of an address.',
    };
  }

  /**
   * Analyze a Bitcoin address for historical
   * and structural privacy exposure.
   */
  public analyzeAddress(
    addressInfo: BitcoinAddressInfo
  ): PrivacyAnalysis {
    const findings =
      evaluateAddressFindings(
        addressInfo
      );

    const scoreResult =
      calculatePrivacyScore({
        addressReuseCount:
          addressInfo.txCount > 1
            ? 1
            : 0,

        inputCount: 1,

        outputCount: 1,

        hasChangeOutputHeuristic:
          false,

        isEqualOutputCoinjoin:
          false,

        scriptTypeHomogeneity:
          addressInfo.addressType === 'p2pkh'
            ? 'legacy_mixed'
            : 'uniform',

        txHistoryCount:
          addressInfo.txCount,

        isAddressAnalysis: true,
      });

    const limitations: string[] = [
      'Address analysis only observes confirmed transactions recorded on the public Bitcoin ledger.',

      'The analysis cannot verify whether an address belongs to a cold-storage wallet, exchange wallet, merchant, service, or other entity.',

      'An address reaching a zero balance does not erase historical transaction relationships recorded on-chain.',

      'Off-chain information may materially change the interpretation of an address but is outside the scope of this analysis.',
    ];

    const defensiveRecommendations: string[] = [];

    /*
     * Reused address
     */
    if (addressInfo.txCount > 1) {
      defensiveRecommendations.push(
        'Consider discontinuing further use of this address and generating fresh addresses for future transfers.'
      );
    }

    /*
     * Legacy address
     */
    if (
      addressInfo.addressType === 'p2pkh'
    ) {
      defensiveRecommendations.push(
        'Consider using modern wallet address types such as Native SegWit or Taproot when supported by your wallet and recipient.'
      );
    }

    /*
     * Default recommendation
     */
    if (
      defensiveRecommendations.length === 0
    ) {
      defensiveRecommendations.push(
        'Keep addresses compartmentalized and avoid unnecessary reuse or co-spending of UTXOs.'
      );
    }

    const overallRiskScore =
      scoreResult.overallRiskScore;

    /*
     * Address-level metrics.
     *
     * Some address providers may not expose
     * complete transaction-level metrics, so
     * these values intentionally use safe fallbacks.
     */
    const metrics = {
      inputCount:
        addressInfo.chain_stats
          ?.spent_txo_count || 0,

      outputCount:
        addressInfo.chain_stats
          ?.funded_txo_count || 0,

      totalInputValue:
        addressInfo.totalSent,

      totalOutputValue:
        addressInfo.totalReceived,

      feePaid: 0,

      distinctInputAddresses: 1,

      distinctOutputAddresses: 1,

      addressReuseCount:
        addressInfo.txCount > 1
          ? addressInfo.txCount
          : 0,

      hasRoundNumberOutput: false,

      hasChangeOutputHeuristic: false,

      isEqualOutputCoinjoin: false,

      scriptTypeHomogeneity:
        addressInfo.addressType === 'p2pkh'
          ? 'legacy_mixed' as const
          : 'uniform' as const,

      consolidationRatio: 1,
    };

    return {
      targetId:
        addressInfo.address,

      targetType:
        'address',

      timestamp:
        Date.now(),

      overallRiskScore,

      /*
       * Backward-compatible UI field.
       */
      score:
        overallRiskScore,

      riskLevel:
        scoreResult.riskLevel,

      heuristicLabel:
        scoreResult.heuristicLabel,

      findings,

      metrics,

      riskBreakdown:
        scoreResult.riskBreakdown,

      limitations,

      defensiveRecommendations,

      disclaimer:
        'This score is an analytical estimate based on publicly observable blockchain patterns. It does not identify individuals or prove ownership of an address.',
    };
  }
}

export const privacyEngine =
  new PrivacyEngine();

export * from './heuristics';

export * from './privacyScore';
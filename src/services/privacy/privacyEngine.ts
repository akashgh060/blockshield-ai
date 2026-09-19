import { BitcoinAddressInfo, BitcoinTransaction } from '../../types/bitcoin';
import { PrivacyAnalysis } from '../../types/privacy';
import {
  evaluateAddressFindings,
  evaluateTransactionFindings,
  evaluateTransactionMetrics,
} from './heuristics';
import { calculatePrivacyScore } from './privacyScore';

export class PrivacyEngine {
  /**
   * Analyze a single Bitcoin transaction for observable privacy indicators
   */
  public analyzeTransaction(tx: BitcoinTransaction): PrivacyAnalysis {
    const metrics = evaluateTransactionMetrics(tx);
    const findings = evaluateTransactionFindings(tx, metrics);
    const scoreResult = calculatePrivacyScore({
      addressReuseCount: metrics.addressReuseCount,
      inputCount: metrics.inputCount,
      outputCount: metrics.outputCount,
      hasChangeOutputHeuristic: metrics.hasChangeOutputHeuristic,
      isEqualOutputCoinjoin: metrics.isEqualOutputCoinjoin,
      scriptTypeHomogeneity: metrics.scriptTypeHomogeneity,
      isAddressAnalysis: false,
    });

    const limitations = [
      'Heuristic privacy analysis is probabilistic and evaluates publicly observable patterns only.',
      'Analysis cannot determine legal ownership, off-chain identity, or physical custody of private keys.',
      'External off-chain metadata (e.g., exchange KYC, IP broadcasts, merchant receipts) can alter privacy in ways not visible on-chain.',
      'Collaborative transactions (CoinJoin, PayJoin) may intentionally violate standard heuristics to provide plausible deniability.',
    ];

    const defensiveRecommendations: string[] = [];
    if (metrics.addressReuseCount > 0) {
      defensiveRecommendations.push('Ensure your wallet generates a fresh receiving address for every incoming transaction.');
    }
    if (metrics.inputCount > 2 && !metrics.isEqualOutputCoinjoin) {
      defensiveRecommendations.push('Avoid consolidating multiple small UTXOs in a single transaction unless necessary; use coin control.');
    }
    if (metrics.hasChangeOutputHeuristic) {
      defensiveRecommendations.push('Consider tools like PayJoin (BIP 78) or Stonewall to obscure change output identification.');
    }
    if (metrics.scriptTypeHomogeneity !== 'uniform') {
      defensiveRecommendations.push('Migrate fully to modern uniform scripts (such as Native SegWit or Taproot) to minimize software fingerprinting.');
    }
    if (defensiveRecommendations.length === 0) {
      defensiveRecommendations.push('Maintain ongoing coin control and single-use address discipline for future transactions.');
    }

    return {
      targetId: tx.txid,
      targetType: 'transaction',
      timestamp: Date.now(),
      overallRiskScore: scoreResult.overallRiskScore,
      riskLevel: scoreResult.riskLevel,
      heuristicLabel: scoreResult.heuristicLabel,
      findings,
      metrics,
      riskBreakdown: scoreResult.riskBreakdown,
      limitations,
      defensiveRecommendations,
      disclaimer:
        'This score is an analytical estimate based on publicly observable patterns. It does NOT identify individuals or prove ownership.',
    };
  }

  /**
   * Analyze an address for historical and structural privacy exposure
   */
  public analyzeAddress(addressInfo: BitcoinAddressInfo): PrivacyAnalysis {
    const findings = evaluateAddressFindings(addressInfo);
    const scoreResult = calculatePrivacyScore({
      addressReuseCount: addressInfo.txCount > 1 ? 1 : 0,
      inputCount: 1,
      outputCount: 1,
      hasChangeOutputHeuristic: false,
      isEqualOutputCoinjoin: false,
      scriptTypeHomogeneity: addressInfo.addressType === 'p2pkh' ? 'legacy_mixed' : 'uniform',
      txHistoryCount: addressInfo.txCount,
      isAddressAnalysis: true,
    });

    const limitations = [
      'Address analysis only observes confirmed transactions on the public Bitcoin ledger.',
      'Cannot verify whether an address belongs to a cold storage vault, an exchange hot wallet, or a smart contract escrow.',
      'Zero address balance does not erase historical transaction linkages recorded in prior blocks.',
    ];

    const defensiveRecommendations: string[] = [];
    if (addressInfo.txCount > 1) {
      defensiveRecommendations.push('Discontinue further use of this address; generate new addresses via your wallet for future transfers.');
    }
    if (addressInfo.addressType === 'p2pkh') {
      defensiveRecommendations.push('Upgrade to Taproot (P2TR) or Native SegWit (P2WPKH) for improved fee efficiency and on-chain privacy.');
    }
    if (defensiveRecommendations.length === 0) {
      defensiveRecommendations.push('Keep this address isolated and avoid co-spending its UTXOs with KYC-linked wallets.');
    }

    return {
      targetId: addressInfo.address,
      targetType: 'address',
      timestamp: Date.now(),
      overallRiskScore: scoreResult.overallRiskScore,
      riskLevel: scoreResult.riskLevel,
      heuristicLabel: scoreResult.heuristicLabel,
      findings,
      metrics: {
        inputCount: addressInfo.chain_stats?.spent_txo_count || 0,
        outputCount: addressInfo.chain_stats?.funded_txo_count || 0,
        totalInputValue: addressInfo.totalSent,
        totalOutputValue: addressInfo.totalReceived,
        feePaid: 0,
        distinctInputAddresses: 1,
        distinctOutputAddresses: 1,
        addressReuseCount: addressInfo.txCount > 1 ? addressInfo.txCount : 0,
        hasRoundNumberOutput: false,
        hasChangeOutputHeuristic: false,
        isEqualOutputCoinjoin: false,
        scriptTypeHomogeneity: addressInfo.addressType === 'p2pkh' ? 'legacy_mixed' : 'uniform',
        consolidationRatio: 1,
      },
      riskBreakdown: scoreResult.riskBreakdown,
      limitations,
      defensiveRecommendations,
      disclaimer:
        'This score is an analytical estimate based on publicly observable patterns. It does NOT identify individuals or prove ownership.',
    };
  }
}

export const privacyEngine = new PrivacyEngine();
export * from './heuristics';
export * from './privacyScore';

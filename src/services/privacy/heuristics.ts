import { BitcoinAddressInfo, BitcoinTransaction } from '../../types/bitcoin';
import { PrivacyFinding, PrivacyMetrics } from '../../types/privacy';

export function evaluateTransactionMetrics(tx: BitcoinTransaction): PrivacyMetrics {
  const inputAddresses = (tx.vin || [])
    .map((i) => i.prevout?.scriptpubkey_address)
    .filter((a): a is string => Boolean(a));

  const outputAddresses = (tx.vout || [])
    .map((o) => o.scriptpubkey_address)
    .filter((a): a is string => Boolean(a));

  const distinctInputs = new Set(inputAddresses);
  const distinctOutputs = new Set(outputAddresses);

  // Check reuse between inputs and outputs
  let addressReuseCount = 0;
  for (const outAddr of outputAddresses) {
    if (distinctInputs.has(outAddr)) {
      addressReuseCount++;
    }
  }

  // Check equal-output CoinJoin or Stonewall pattern
  const outputValues = (tx.vout || []).map((o) => o.value);
  const valueCounts = new Map<number, number>();
  for (const val of outputValues) {
    valueCounts.set(val, (valueCounts.get(val) || 0) + 1);
  }
  let isEqualOutput = false;
  for (const count of valueCounts.values()) {
    if (count >= 2) {
      isEqualOutput = true;
      break;
    }
  }

  // Check round number heuristic (e.g., multiples of 100,000 sats or 0.01 / 0.1 BTC)
  const hasRoundNumberOutput = outputValues.some((v) => {
    if (v <= 0) return false;
    return v % 10_000_000 === 0 || v % 1_000_000 === 0 || (v % 500_000 === 0 && v >= 1_000_000);
  });

  // Check change output heuristic: if 2 outputs, one is round and one is irregular
  let hasChangeOutputHeuristic = false;
  if (tx.vout.length === 2 && hasRoundNumberOutput) {
    const isBothRound = outputValues.every((v) => v % 1_000_000 === 0);
    if (!isBothRound) {
      hasChangeOutputHeuristic = true;
    }
  }

  // Check script type homogeneity
  const scriptTypes = new Set<string>();
  tx.vin.forEach((i) => {
    if (i.prevout?.scriptpubkey_type) scriptTypes.add(i.prevout.scriptpubkey_type);
  });
  tx.vout.forEach((o) => {
    if (o.scriptpubkey_type) scriptTypes.add(o.scriptpubkey_type);
  });

  let scriptTypeHomogeneity: 'uniform' | 'mixed' | 'legacy_mixed' = 'uniform';
  if (scriptTypes.size > 2) {
    scriptTypeHomogeneity = 'legacy_mixed';
  } else if (scriptTypes.size > 1) {
    scriptTypeHomogeneity = 'mixed';
  }

  const consolidationRatio = tx.vout.length > 0 ? tx.vin.length / tx.vout.length : 1;

  return {
    inputCount: tx.vin.length,
    outputCount: tx.vout.length,
    totalInputValue: tx.totalInputValue,
    totalOutputValue: tx.totalOutputValue,
    feePaid: tx.fee,
    distinctInputAddresses: distinctInputs.size,
    distinctOutputAddresses: distinctOutputs.size,
    addressReuseCount,
    hasRoundNumberOutput,
    hasChangeOutputHeuristic,
    isEqualOutputCoinjoin: isEqualOutput,
    scriptTypeHomogeneity,
    consolidationRatio,
  };
}

export function evaluateTransactionFindings(
  tx: BitcoinTransaction,
  metrics: PrivacyMetrics
): PrivacyFinding[] {
  const findings: PrivacyFinding[] = [];

  // 1. ADDRESS REUSE HEURISTIC
  if (metrics.addressReuseCount > 0) {
    findings.push({
      id: 'f-addr-reuse-self',
      category: 'address_reuse',
      title: 'Direct Address Reuse Detected',
      severity: 'high',
      confidence: 0.94,
      description:
        'An address appearing in the transaction inputs was also reused as an output destination, commonly indicating change returned to an already-used key.',
      reason:
        'Public observers can trivially correlate the change recipient with the original sender, undermining the pseudonymity provided by fresh address generation.',
      limitations:
        'While address reuse strongly implies intentional or wallet-default reuse, it does not confirm the real-world identity or legal owner behind the key.',
      educationalNote:
        'Cypherpunk best practice recommends using a fresh, single-use address for every transaction to avoid historical balance clustering.',
    });
  }

  // 2. COMMON-INPUT-OWNERSHIP HEURISTIC (CIOH)
  if (metrics.inputCount > 1 && !metrics.isEqualOutputCoinjoin) {
    findings.push({
      id: 'f-cioh-consolidation',
      category: 'linkability',
      title: 'Common-Input-Ownership Correlation',
      severity: metrics.inputCount >= 3 ? 'high' : 'medium',
      confidence: 0.82,
      description: `This transaction spends from ${metrics.inputCount} separate inputs simultaneously. Blockchain surveillance heuristics assume that all co-spent inputs are controlled by the same wallet entity.`,
      reason:
        'Combining multiple UTXOs in a single standard transaction merges their public transaction histories into a shared ownership cluster.',
      limitations:
        'Heuristic assumes single ownership; however, collaborative transactions, multisig schemes, or PayJoin / CoinJoin protocols can co-spend inputs from distinct entities.',
      educationalNote:
        'Consolidating UTXOs during high fee periods exposes correlation between previously unlinked addresses.',
    });
  }

  // 3. CHANGE OUTPUT HEURISTIC / ROUND PAYMENT
  if (metrics.hasChangeOutputHeuristic) {
    findings.push({
      id: 'f-change-round-number',
      category: 'transaction_structure',
      title: 'Differentiable Change Output Heuristic',
      severity: 'medium',
      confidence: 0.76,
      description:
        'The transaction contains an exact round-number payment paired with an uneven output, which publicly differentiates the intended payment from the change balance.',
      reason:
        'Human commercial payments are frequently denominated in round fiat or round satoshi figures, leaving the irregular leftover satoshis as recognizable change.',
      limitations:
        'Payment terms could have intentionally specified an irregular quantity, or the sender may have conducted a sweep without change.',
      educationalNote:
        'When change is easily distinguishable, blockchain observers can trace which output remained with the original sender.',
    });
  }

  // 4. SCRIPT TYPE FINGERPRINTING
  if (metrics.scriptTypeHomogeneity === 'legacy_mixed' || metrics.scriptTypeHomogeneity === 'mixed') {
    findings.push({
      id: 'f-script-mismatch',
      category: 'transaction_structure',
      title: 'Heterogeneous Script Fingerprint',
      severity: 'medium',
      confidence: 0.68,
      description:
        'Transaction inputs and outputs utilize differing script formats (e.g. mixing Legacy P2PKH, Nested SegWit, or Taproot).',
      reason:
        'Inconsistent script standards can leak information about the wallet implementation, migration state, or distinguish the change output from external destinations.',
      limitations:
        'Users frequently receive funds from third parties using legacy systems while using modern wallets themselves.',
      educationalNote:
        'Uniform script transactions (like all-Taproot or all-SegWit) minimize observable software fingerprinting.',
    });
  }

  // 5. PRIVACY-ENHANCING STRUCTURE (Equal-Output / CoinJoin / Stonewall)
  if (metrics.isEqualOutputCoinjoin) {
    findings.push({
      id: 'f-privacy-equal-outputs',
      category: 'transaction_structure',
      title: 'Equal-Output Privacy Structure Detected',
      severity: 'low',
      confidence: 0.88,
      description:
        'Transaction features multiple outputs with identical values, presenting plausible deniability regarding which output belongs to which participant.',
      reason:
        'Equal output values break deterministic subset-sum analysis, significantly reducing outside observers ability to track payment flow.',
      limitations:
        'Subsequent spending of these outputs without privacy discipline (e.g. toxic change consolidation) could diminish initial privacy gains.',
      educationalNote:
        'Protocols like Whirlpool and Stonewall use equal output amounts to create cryptographic entropy and forward-looking privacy.',
    });
  }

  // 6. PUBLIC BLOCKCHAIN EXPOSURE
  findings.push({
    id: 'f-public-exposure',
    category: 'public_exposure',
    title: 'Public Ledger Traceability',
    severity: 'low',
    confidence: 1.0,
    description: `Transaction value (${metrics.totalOutputValue.toLocaleString()} sats across ${metrics.outputCount} output${metrics.outputCount > 1 ? 's' : ''}) and timestamps are permanently verifiable on Bitcoin's distributed ledger.`,
    reason:
      'Bitcoin is an open, transparent protocol without confidential transactions; all transfer amounts and destination scripts are publicly auditable.',
    limitations:
      'Visibility of transaction metadata does not associate public keys with personal identities without external off-chain intelligence or KYC linkage.',
    educationalNote:
      'Defensive Bitcoin privacy focuses on minimizing correlation and metadata leakage across unassociated payments.',
  });

  return findings;
}

export function evaluateAddressFindings(
  addressInfo: BitcoinAddressInfo
): PrivacyFinding[] {
  const findings: PrivacyFinding[] = [];

  // Address reuse check
  if (addressInfo.txCount > 1) {
    findings.push({
      id: 'f-addr-frequent-reuse',
      category: 'address_reuse',
      title: 'Repeated Address Activity Detected',
      severity: addressInfo.txCount > 5 ? 'high' : 'medium',
      confidence: 0.95,
      description: `This address has been observed in ${addressInfo.txCount} distinct transactions across the blockchain history.`,
      reason:
        'Every additional transaction associated with the same address aggregates public transaction volume, counterparties, and spending patterns into a single correlation graph.',
      limitations:
        'Historical transaction counts indicate volume but do not indicate whether the key holder is an individual, merchant, multisig, or service pool.',
      educationalNote:
        'Hierarchical Deterministic (HD) wallets can generate a virtually infinite sequence of fresh addresses from a single backup.',
    });
  } else {
    findings.push({
      id: 'f-addr-single-use',
      category: 'address_reuse',
      title: 'Single-Use or Fresh Address Pattern',
      severity: 'low',
      confidence: 0.9,
      description: 'Address has limited historical transaction exposure, adhering to basic privacy hygiene.',
      reason: 'Low transaction count reduces the attack surface for clustering algorithms.',
      limitations: 'Address privacy can still be compromised if past input sources were poorly isolated.',
      educationalNote: 'Maintaining single-use address hygiene is the foundation of defensive Bitcoin privacy.',
    });
  }

  // Address format type analysis
  if (addressInfo.addressType === 'p2pkh') {
    findings.push({
      id: 'f-addr-legacy-format',
      category: 'transaction_structure',
      title: 'Legacy P2PKH Format In Use',
      severity: 'medium',
      confidence: 0.92,
      description: 'Address uses legacy base58 encoding (starts with "1"), which does not benefit from modern SegWit or Taproot privacy features.',
      reason: 'Legacy scripts have larger block weight, higher transaction fees, and distinct signature fingerprints.',
      limitations: 'Older cold storage setups may safely store funds in legacy formats without active exposure until spent.',
      educationalNote: 'Taproot (P2TR) addresses blend complex multisig conditions with simple key-path spends, improving on-chain fungibility.',
    });
  } else if (addressInfo.addressType === 'p2tr') {
    findings.push({
      id: 'f-addr-taproot-format',
      category: 'transaction_structure',
      title: 'Modern Taproot (P2TR) Format',
      severity: 'low',
      confidence: 0.95,
      description: 'Address utilizes BIP 341 Taproot output script (Bech32m "bc1p...").',
      reason: 'Taproot standardizes single-key and complex contract outputs into indistinguishable Schnorr public keys on-chain.',
      limitations: 'Privacy benefits are maximized when both sender and receiver transact using Taproot.',
      educationalNote: 'Taproot enhances on-chain privacy by making cooperative multisig spends appear identical to standard single-sig spends.',
    });
  }

  return findings;
}

import { AgentContext, ChatMessage, StructuredAIResponse } from '../../types/agent';
import { AIProvider } from './aiProvider';

export class MockAIProvider implements AIProvider {
  name = 'BlockShield Deterministic Cypherpunk Privacy AI (Offline / Demo)';
  isDemo = true;

  async generatePrivacyExplanation(
    context: AgentContext,
    question: string
  ): Promise<StructuredAIResponse> {
    // Artificial small delay to make tool execution visible and lifelike
    await new Promise((r) => setTimeout(r, 450));
    return this.buildStructuredResponse(context, question);
  }

  async chatWithContext(
    context: AgentContext,
    _conversation: ChatMessage[],
    userMessage: string
  ): Promise<StructuredAIResponse> {
    await new Promise((r) => setTimeout(r, 550));
    return this.buildStructuredResponse(context, userMessage);
  }

  private buildStructuredResponse(context: AgentContext, query: string): StructuredAIResponse {
    const tx = context.transaction;
    const addr = context.addressInfo;
    const analysis = context.privacyAnalysis;
    const lowerQuery = query.toLowerCase();

    const targetLabel = tx
      ? `Transaction ${tx.txid.slice(0, 10)}...${tx.txid.slice(-6)}`
      : addr
      ? `Address ${addr.address.slice(0, 8)}...${addr.address.slice(-6)}`
      : 'the requested blockchain entity';

    const score = analysis?.overallRiskScore ?? 50;
    const level = analysis?.riskLevel ?? 'MODERATE';
    const findingTitles = analysis?.findings.map((f) => f.title).join(', ') || 'No critical privacy defects found';

    // Tailor answer based on query
    let summary = `Analytical review of ${targetLabel} reveals an estimated privacy risk score of ${score}/100 (${level}). The public structure reflects ${
      tx
        ? `${tx.vin.length} input(s) paying out to ${tx.vout.length} output(s) with total volume of ${(tx.totalOutputValue / 1e8).toFixed(4)} BTC.`
        : addr
        ? `${addr.txCount} historical transactions totaling ${(addr.totalReceived / 1e8).toFixed(4)} BTC received.`
        : 'general blockchain data'
    }`;

    if (lowerQuery.includes('beginner') || lowerQuery.includes('explain this like')) {
      summary = `In simple terms: Bitcoin is not an anonymous vault; it is a shared public accounting book. For ${targetLabel}, anyone on the internet can see how much was sent and when. We rate the privacy risk at ${score}/100 (${level}) because public clues allow observers to guess transaction relationships.`;
    }

    const riskAssessment = `Score: ${score}/100 [${level}]. Key factors identified: ${findingTitles}. This metric represents an analytical estimate based solely on publicly observable patterns on the Bitcoin blockchain.`;

    const whatIsVisible = tx
      ? `• Transaction ID (TXID): ${tx.txid}\n• Block confirmation: Height #${tx.status.block_height ?? 'Mempool'}\n• Transaction Fee: ${tx.fee.toLocaleString()} satoshis (${tx.feeRate ?? 'N/A'} sat/vB)\n• Inputs (${tx.vin.length}): Public scripts & prior outpoint references\n• Outputs (${tx.vout.length}): Exact satoshi quantities and script types (${tx.vout.map((v) => v.scriptpubkey_type || 'p2wpkh').join(', ')})`
      : addr
      ? `• Public Address: ${addr?.address}\n• Total Received: ${(addr?.totalReceived ?? 0) / 1e8} BTC across ${addr?.txCount} transactions\n• Current Confirmed Balance: ${(addr?.balance ?? 0) / 1e8} BTC\n• Address Script Type: ${addr?.addressType.toUpperCase()}`
      : '• Publicly recorded on-chain data including values, script hashes, and timestamps.';

    const whyItMatters =
      'Public blockchain metadata allows commercial chain surveillance and passive observers to run heuristic clustering. Over time, recurring transaction patterns, round numbers, and co-spent UTXOs may aggregate isolated transactions into a coherent cluster, reducing privacy from third parties.';

    let potentialLinkability = tx
      ? tx.vin.length > 1
        ? `High potential linkability via Common-Input-Ownership Heuristic (CIOH). Observers reasonably infer that the ${tx.vin.length} inputs are held under shared private key management.`
        : analysis?.metrics.addressReuseCount
        ? 'High direct correlation: The exact input address was reused for the change output, proving the sender retained change.'
        : analysis?.metrics.hasChangeOutputHeuristic
        ? 'Moderate linkability: The presence of an exact round payment makes it straightforward to distinguish the commercial recipient from the internal change.'
        : 'Low to moderate linkability: Transaction exhibits uniform outputs or balanced inputs that resist direct change identification.'
      : 'Address reuse across multiple blocks allows external analysts to correlate counterparties and build an activity timeline.';

    const limitations =
      'DEFENSIVE SCOPE LIMITATION: BlockShield AI does not deanonymize entities, identify real-world owners, or claim certainty regarding identity. All assessments are probabilistic heuristics based exclusively on the public Bitcoin ledger.';

    const defensiveConsiderations =
      '1. Practice strict single-use address hygiene; never reuse addresses for receiving or change.\n2. Utilize Coin Control to avoid co-spending unrelated UTXOs.\n3. Consider modern privacy protocols such as collaborative transactions (Whirlpool, JoinMarket) or PayJoin (BIP 78).\n4. Adopt uniform Taproot (P2TR) scripts to standardize transaction appearance across the network.';

    return {
      summary,
      riskAssessment,
      whatIsVisible,
      whyItMatters,
      potentialLinkability,
      limitations,
      defensiveConsiderations,
    };
  }
}

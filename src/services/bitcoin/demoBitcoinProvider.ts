import {
  AddressActivityItem,
  BitcoinAddressInfo,
  BitcoinTransaction,
  BlockInfo,
} from '../../types/bitcoin';
import { BitcoinProvider, getAddressType } from './bitcoinProvider';
import { DEMO_SCENARIOS } from './demoData';

export class DemoBitcoinProvider implements BitcoinProvider {
  name = 'DemoBitcoinProvider (Simulated Offline/Deterministic)';
  isDemo = true;

  async getTransaction(txid: string): Promise<BitcoinTransaction> {
    const clean = txid.trim().toLowerCase();
    for (const key of Object.keys(DEMO_SCENARIOS)) {
      const scenario = DEMO_SCENARIOS[key];
      if (scenario.txid.toLowerCase() === clean) {
        return scenario.transaction;
      }
    }

    // If a generic valid 64-hex TXID is provided in demo mode, construct a realistic deterministic mock
    return this.generateDeterministicTx(clean);
  }

  async getAddress(address: string): Promise<BitcoinAddressInfo> {
    const clean = address.trim();
    for (const key of Object.keys(DEMO_SCENARIOS)) {
      const scenario = DEMO_SCENARIOS[key];
      if (scenario.focusAddress === clean) {
        return scenario.addressInfo;
      }
    }

    return this.generateDeterministicAddress(clean);
  }

  async getTransactionHistory(address: string): Promise<AddressActivityItem[]> {
    const clean = address.trim();
    for (const key of Object.keys(DEMO_SCENARIOS)) {
      const scenario = DEMO_SCENARIOS[key];
      if (scenario.focusAddress === clean) {
        return scenario.addressHistory;
      }
    }

    return [
      {
        txid: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        timestamp: Date.now() / 1000 - 86400 * 2,
        type: 'incoming',
        amount: 3500000,
        confirmations: 284,
        counterparties: ['bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'],
      },
    ];
  }

  async getBlock(blockHeightOrHash: number | string): Promise<BlockInfo> {
    return {
      id: '00000000000000000002ab4ef901c84f509e86ba33b8214fa39801d90479133a',
      height: typeof blockHeightOrHash === 'number' ? blockHeightOrHash : 842105,
      version: 536870912,
      timestamp: 1714829310,
      tx_count: 2845,
      size: 1582910,
      weight: 3992100,
      merkle_root: '912a7fe92a10b4f8490a6cd8885623cf632832194b15099ce69527f619e0b12c',
    };
  }

  private generateDeterministicTx(txid: string): BitcoinTransaction {
    const defaultScenario = DEMO_SCENARIOS.high_linkability;
    return {
      ...defaultScenario.transaction,
      txid,
      status: {
        ...defaultScenario.transaction.status,
        block_height: 842150,
      },
    };
  }

  private generateDeterministicAddress(address: string): BitcoinAddressInfo {
    const type = getAddressType(address);
    return {
      address,
      addressType: type,
      chain_stats: {
        funded_txo_count: 3,
        funded_txo_sum: 25000000,
        spent_txo_count: 2,
        spent_txo_sum: 18000000,
        tx_count: 3,
      },
      balance: 7000000,
      totalReceived: 25000000,
      totalSent: 18000000,
      firstSeenTimestamp: 1708000000,
      lastSeenTimestamp: 1714800000,
      txCount: 3,
    };
  }
}

export type AddressType = 'p2pkh' | 'p2sh' | 'p2wpkh' | 'p2wsh' | 'p2tr' | 'unknown';

export interface BitcoinInput {
  txid: string;
  vout: number;
  prevout?: {
    scriptpubkey_address?: string;
    scriptpubkey_type?: string;
    value: number; // in satoshis
  };
  scriptsig?: string;
  witness?: string[];
  sequence: number;
  is_coinbase?: boolean;
}

export interface BitcoinOutput {
  scriptpubkey_address?: string;
  scriptpubkey_type?: string;
  value: number; // in satoshis
  n?: number;
}

export interface BitcoinTransaction {
  txid: string;
  version: number;
  locktime: number;
  size: number;
  weight: number;
  fee: number; // in satoshis
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  vin: BitcoinInput[];
  vout: BitcoinOutput[];
  // Derived metrics
  totalInputValue: number;
  totalOutputValue: number;
  feeRate?: number; // sat/vB
  confirmations?: number;
}

export interface AddressStats {
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
  tx_count: number;
}

export interface BitcoinAddressInfo {
  address: string;
  addressType: AddressType;
  chain_stats: AddressStats;
  mempool_stats?: AddressStats;
  balance: number; // in satoshis
  totalReceived: number; // in satoshis
  totalSent: number; // in satoshis
  firstSeenTimestamp?: number;
  lastSeenTimestamp?: number;
  txCount: number;
}

export interface AddressActivityItem {
  txid: string;
  timestamp: number;
  type: 'incoming' | 'outgoing' | 'consolidation' | 'self_transfer';
  amount: number;
  fee?: number;
  confirmations: number;
  counterparties: string[];
}

export interface BlockInfo {
  id: string;
  height: number;
  version: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  merkle_root: string;
}

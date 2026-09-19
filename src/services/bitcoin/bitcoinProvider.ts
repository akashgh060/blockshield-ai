import {
  AddressActivityItem,
  AddressType,
  BitcoinAddressInfo,
  BitcoinTransaction,
  BlockInfo,
} from '../../types/bitcoin';

export interface BitcoinProvider {
  name: string;
  isDemo: boolean;
  getTransaction(txid: string): Promise<BitcoinTransaction>;
  getAddress(address: string): Promise<BitcoinAddressInfo>;
  getTransactionHistory(address: string): Promise<AddressActivityItem[]>;
  getBlock(blockHeightOrHash: number | string): Promise<BlockInfo>;
}

// Validation helpers
export function isValidTxid(txid: string): boolean {
  if (!txid) return false;
  const cleaned = txid.trim().toLowerCase();
  return /^[0-9a-f]{64}$/.test(cleaned);
}

export function getAddressType(address: string): AddressType {
  const clean = address.trim();
  if (/^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(clean)) return 'p2pkh';
  if (/^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(clean)) return 'p2sh';
  if (/^bc1q[02-9ac-hj-np-z]{38,59}$/i.test(clean)) return 'p2wpkh'; // or p2wsh if 59 chars
  if (/^bc1p[02-9ac-hj-np-z]{58}$/i.test(clean)) return 'p2tr';
  return 'unknown';
}

export function isValidBitcoinAddress(address: string): boolean {
  if (!address) return false;
  const type = getAddressType(address);
  return type !== 'unknown';
}

export function formatSatoshis(sats: number): string {
  const btc = sats / 100_000_000;
  return `${btc.toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 })} BTC`;
}

export function formatSatoshisCompact(sats: number): string {
  if (sats >= 100_000_000) {
    return `${(sats / 100_000_000).toFixed(4)} BTC`;
  }
  return `${sats.toLocaleString()} sats`;
}

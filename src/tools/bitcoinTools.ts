import { getBitcoinProvider } from '../services/bitcoin';
import { AddressActivityItem, BitcoinAddressInfo, BitcoinTransaction } from '../types/bitcoin';

export async function getBitcoinTransaction(
  txid: string,
  preferMode?: 'demo' | 'live'
): Promise<BitcoinTransaction> {
  const provider = getBitcoinProvider(preferMode);
  return provider.getTransaction(txid);
}

export async function getBitcoinAddress(
  address: string,
  preferMode?: 'demo' | 'live'
): Promise<BitcoinAddressInfo> {
  const provider = getBitcoinProvider(preferMode);
  return provider.getAddress(address);
}

export async function getAddressHistory(
  address: string,
  preferMode?: 'demo' | 'live'
): Promise<AddressActivityItem[]> {
  const provider = getBitcoinProvider(preferMode);
  return provider.getTransactionHistory(address);
}

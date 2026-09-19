import {
  AddressActivityItem,
  BitcoinAddressInfo,
  BitcoinInput,
  BitcoinOutput,
  BitcoinTransaction,
  BlockInfo,
} from '../../types/bitcoin';
import { BitcoinProvider, getAddressType } from './bitcoinProvider';

interface MempoolTxResponse {
  txid: string;
  version: number;
  locktime: number;
  vin: Array<{
    txid: string;
    vout: number;
    prevout?: {
      scriptpubkey_address?: string;
      scriptpubkey_type?: string;
      value: number;
    };
    scriptsig?: string;
    witness?: string[];
    sequence: number;
    is_coinbase?: boolean;
  }>;
  vout: Array<{
    scriptpubkey_address?: string;
    scriptpubkey_type?: string;
    value: number;
  }>;
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}

interface MempoolAddressResponse {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats?: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
}

export class LiveBitcoinProvider implements BitcoinProvider {
  name = 'LiveBitcoinProvider (Bitcoin Mainnet via Mempool.space / Blockstream)';
  isDemo = false;
  private baseUrl: string;

  constructor(baseUrl = 'https://mempool.space/api') {
    this.baseUrl = baseUrl;
  }

  private async fetchWithTimeout(url: string, timeoutMs = 9000): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      return res;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Connection timed out while fetching Bitcoin blockchain data. Please try again or switch to Demo Mode.');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  async getTransaction(txid: string): Promise<BitcoinTransaction> {
    const clean = txid.trim().toLowerCase();
    const primaryUrl = `${this.baseUrl}/tx/${clean}`;
    let res: Response;

    try {
      res = await this.fetchWithTimeout(primaryUrl);
    } catch {
      // Try fallback to blockstream.info or local backend proxy
      try {
        res = await this.fetchWithTimeout(`https://blockstream.info/api/tx/${clean}`);
      } catch (e) {
        throw new Error('Unable to retrieve this transaction right now from public nodes. Try again or use Demo Mode.');
      }
    }

    if (res.status === 404) {
      throw new Error(`Transaction ${clean.slice(0, 10)}... was not found on Bitcoin mainnet.`);
    }
    if (res.status === 429) {
      throw new Error('Public Bitcoin node rate limit exceeded. Please wait a moment or use Demo Mode.');
    }
    if (!res.ok) {
      throw new Error(`Blockchain node error (${res.status}): Unable to load transaction data.`);
    }

    const raw: MempoolTxResponse = await res.json();

    let totalInput = 0;
    const vin: BitcoinInput[] = (raw.vin || []).map((input) => {
      const val = input.prevout?.value || 0;
      totalInput += val;
      return {
        txid: input.txid,
        vout: input.vout,
        prevout: input.prevout ? {
          scriptpubkey_address: input.prevout.scriptpubkey_address,
          scriptpubkey_type: input.prevout.scriptpubkey_type,
          value: input.prevout.value,
        } : undefined,
        scriptsig: input.scriptsig,
        witness: input.witness,
        sequence: input.sequence,
        is_coinbase: input.is_coinbase,
      };
    });

    let totalOutput = 0;
    const vout: BitcoinOutput[] = (raw.vout || []).map((output, idx) => {
      totalOutput += output.value || 0;
      return {
        scriptpubkey_address: output.scriptpubkey_address,
        scriptpubkey_type: output.scriptpubkey_type,
        value: output.value || 0,
        n: idx,
      };
    });

    const feeRate = raw.weight > 0 ? Number(((raw.fee || 0) / (raw.weight / 4)).toFixed(1)) : 0;

    return {
      txid: raw.txid,
      version: raw.version,
      locktime: raw.locktime,
      size: raw.size,
      weight: raw.weight,
      fee: raw.fee || 0,
      status: {
        confirmed: raw.status?.confirmed ?? false,
        block_height: raw.status?.block_height,
        block_hash: raw.status?.block_hash,
        block_time: raw.status?.block_time,
      },
      vin,
      vout,
      totalInputValue: totalInput,
      totalOutputValue: totalOutput,
      feeRate,
    };
  }

  async getAddress(address: string): Promise<BitcoinAddressInfo> {
    const clean = address.trim();
    const url = `${this.baseUrl}/address/${clean}`;
    let res: Response;

    try {
      res = await this.fetchWithTimeout(url);
    } catch {
      try {
        res = await this.fetchWithTimeout(`https://blockstream.info/api/address/${clean}`);
      } catch {
        throw new Error('Unable to retrieve this address right now from public nodes. Try again or use Demo Mode.');
      }
    }

    if (res.status === 404) {
      throw new Error(`Address ${clean.slice(0, 10)}... was not found on Bitcoin mainnet.`);
    }
    if (res.status === 429) {
      throw new Error('Public node rate limit exceeded. Please try again in a few seconds.');
    }
    if (!res.ok) {
      throw new Error(`Failed to query address (${res.status}).`);
    }

    const data: MempoolAddressResponse = await res.json();
    const type = getAddressType(clean);

    const chainReceived = data.chain_stats?.funded_txo_sum || 0;
    const chainSpent = data.chain_stats?.spent_txo_sum || 0;
    const mempoolReceived = data.mempool_stats?.funded_txo_sum || 0;
    const mempoolSpent = data.mempool_stats?.spent_txo_sum || 0;

    const totalReceived = chainReceived + mempoolReceived;
    const totalSent = chainSpent + mempoolSpent;
    const balance = totalReceived - totalSent;
    const txCount = (data.chain_stats?.tx_count || 0) + (data.mempool_stats?.tx_count || 0);

    return {
      address: clean,
      addressType: type,
      chain_stats: data.chain_stats,
      mempool_stats: data.mempool_stats,
      balance,
      totalReceived,
      totalSent,
      txCount,
    };
  }

  async getTransactionHistory(address: string): Promise<AddressActivityItem[]> {
    const clean = address.trim();
    const url = `${this.baseUrl}/address/${clean}/txs`;
    let res: Response;

    try {
      res = await this.fetchWithTimeout(url);
    } catch {
      return [];
    }

    if (!res.ok) return [];

    const txs: MempoolTxResponse[] = await res.json();
    return txs.slice(0, 10).map((tx) => {
      // Determine if incoming or outgoing
      let isIncoming = false;
      let amount = 0;
      const counterparties: string[] = [];

      for (const out of tx.vout || []) {
        if (out.scriptpubkey_address === clean) {
          isIncoming = true;
          amount += out.value;
        } else if (out.scriptpubkey_address) {
          counterparties.push(out.scriptpubkey_address);
        }
      }

      let isSpending = false;
      for (const inp of tx.vin || []) {
        if (inp.prevout?.scriptpubkey_address === clean) {
          isSpending = true;
        }
      }

      let type: AddressActivityItem['type'] = 'incoming';
      if (isSpending && isIncoming) {
        type = 'self_transfer';
      } else if (isSpending) {
        type = 'outgoing';
        amount = tx.fee || 0;
      }

      return {
        txid: tx.txid,
        timestamp: tx.status?.block_time || Date.now() / 1000,
        type,
        amount,
        fee: tx.fee,
        confirmations: tx.status?.confirmed ? 6 : 0,
        counterparties: counterparties.slice(0, 3),
      };
    });
  }

  async getBlock(blockHeightOrHash: number | string): Promise<BlockInfo> {
    const url = `${this.baseUrl}/block/${blockHeightOrHash}`;
    const res = await this.fetchWithTimeout(url);
    if (!res.ok) {
      throw new Error(`Failed to load block ${blockHeightOrHash}`);
    }
    return res.json();
  }
}

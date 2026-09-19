import { AddressActivityItem, BitcoinAddressInfo, BitcoinTransaction } from '../../types/bitcoin';

export interface DemoScenario {
  id: 'low_risk' | 'address_reuse' | 'high_linkability';
  name: string;
  badge: string;
  badgeColor: string;
  txid: string;
  focusAddress: string;
  address: string;
  description: string;
  keyHeuristic: string;
  expectedScoreRange: string;
  suggestedQuestion: string;
  transaction: BitcoinTransaction;
  addressInfo: BitcoinAddressInfo;
  addressHistory: AddressActivityItem[];
}

// 1. Scenario 1: Low Privacy Risk (Equal-output / Stonewall privacy structure)
const lowRiskTxid = '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b';
const lowRiskAddress = 'bc1p5d7rjq7g6rd2ee076mqeydf9bd2wv01smcesfcf3q9vvhnsqqqhscz6r85';

const lowRiskTx: BitcoinTransaction = {
  txid: lowRiskTxid,
  version: 2,
  locktime: 842100,
  size: 340,
  weight: 1120,
  fee: 4520,
  status: {
    confirmed: true,
    block_height: 842105,
    block_hash: '00000000000000000002ab4ef901c84f509e86ba33b8214fa39801d90479133a',
    block_time: 1714829310,
  },
  vin: [
    {
      txid: '912a7fe92a10b4f8490a6cd8885623cf632832194b15099ce69527f619e0b12c',
      vout: 0,
      prevout: {
        scriptpubkey_address: 'bc1p5d7rjq7g6rd2ee076mqeydf9bd2wv01smcesfcf3q9vvhnsqqqhscz6r85',
        scriptpubkey_type: 'v1_p2tr',
        value: 5000000, // 0.05000000 BTC
      },
      sequence: 4294967293,
    },
    {
      txid: 'f83210aa983f478ecb192834b7f8910471923058193859182301938491029384',
      vout: 1,
      prevout: {
        scriptpubkey_address: 'bc1p6k4mqq9sclp99w23r4evcx4r88ksp7u820jfx663f7r8z2p2v96sl23h4p',
        scriptpubkey_type: 'v1_p2tr',
        value: 4850000, // 0.04850000 BTC
      },
      sequence: 4294967293,
    },
  ],
  vout: [
    {
      scriptpubkey_address: 'bc1p823m7c5t2w888d9c3xvv8q210mkls209k3j4m5n6p7q8r9s0t1u2v3w4x5',
      scriptpubkey_type: 'v1_p2tr',
      value: 3500000, // 0.035 BTC (equal output 1)
      n: 0,
    },
    {
      scriptpubkey_address: 'bc1p998w4k2l1m3n5p7q9r0s2t4u6v8w0x2y4z6a8b0c2d4e6f8g0h2j4k6l8m',
      scriptpubkey_type: 'v1_p2tr',
      value: 3500000, // 0.035 BTC (equal output 2)
      n: 1,
    },
    {
      scriptpubkey_address: 'bc1pv23n5m8k9l0p4q6r8s0t2u4v6w8x0y2z4a6b8c0d2e4f6g8h0j2k4l6m8n',
      scriptpubkey_type: 'v1_p2tr',
      value: 1495480, // change 1
      n: 2,
    },
    {
      scriptpubkey_address: 'bc1p777m9k2l4n6p8q0r2s4t6u8v0w2x4y6z8a0b2c4d6e8f0g2h4j6k8l0m2n',
      scriptpubkey_type: 'v1_p2tr',
      value: 1350000, // change 2
      n: 3,
    },
  ],
  totalInputValue: 9850000,
  totalOutputValue: 9845480,
  feeRate: 13.3,
};

const lowRiskAddressInfo: BitcoinAddressInfo = {
  address: lowRiskAddress,
  addressType: 'p2tr',
  chain_stats: {
    funded_txo_count: 1,
    funded_txo_sum: 5000000,
    spent_txo_count: 1,
    spent_txo_sum: 5000000,
    tx_count: 1,
  },
  balance: 0,
  totalReceived: 5000000,
  totalSent: 5000000,
  firstSeenTimestamp: 1714801200,
  lastSeenTimestamp: 1714829310,
  txCount: 1,
};

// 2. Scenario 2: Address Reuse Scenario
const reuseTxid = '8f941198305c48b7f2b45e99812904c632832810938491028349102938471928';
const reuseAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'; // Classic legacy address format representation

const reuseTx: BitcoinTransaction = {
  txid: reuseTxid,
  version: 1,
  locktime: 0,
  size: 258,
  weight: 1032,
  fee: 15200,
  status: {
    confirmed: true,
    block_height: 841920,
    block_hash: '000000000000000000010992384a8bc948271029384719283746192837461928',
    block_time: 1714605000,
  },
  vin: [
    {
      txid: '2093849182039481029384910293849102938491029384910293849102938491',
      vout: 0,
      prevout: {
        scriptpubkey_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        scriptpubkey_type: 'p2pkh',
        value: 12500000, // 0.125 BTC
      },
      sequence: 4294967295,
    },
  ],
  vout: [
    {
      scriptpubkey_address: '1Dice8EMZmqKvrGE4Qc9bUFf9PX3xaYDp',
      scriptpubkey_type: 'p2pkh',
      value: 4500000, // 0.045 BTC
      n: 0,
    },
    {
      scriptpubkey_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // REUSE: Same address as input used for change!
      scriptpubkey_type: 'p2pkh',
      value: 7984800,
      n: 1,
    },
  ],
  totalInputValue: 12500000,
  totalOutputValue: 12484800,
  feeRate: 58.9,
};

const reuseAddressInfo: BitcoinAddressInfo = {
  address: reuseAddress,
  addressType: 'p2pkh',
  chain_stats: {
    funded_txo_count: 14,
    funded_txo_sum: 98450000,
    spent_txo_count: 12,
    spent_txo_sum: 90465200,
    tx_count: 14,
  },
  balance: 7984800,
  totalReceived: 98450000,
  totalSent: 90465200,
  firstSeenTimestamp: 1682900000,
  lastSeenTimestamp: 1714605000,
  txCount: 14,
};

// 3. Scenario 3: Higher Linkability Scenario (Multi-input consolidation + Round number payment + Script mismatch)
const highLinkTxid = 'd923058192304810293840192384019283401928340192834019283401928340';
const highLinkAddress = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';

const highLinkTx: BitcoinTransaction = {
  txid: highLinkTxid,
  version: 2,
  locktime: 842000,
  size: 612,
  weight: 2180,
  fee: 18450,
  status: {
    confirmed: true,
    block_height: 842010,
    block_hash: '0000000000000000000293847102938471928374619283746192837461928374',
    block_time: 1714702500,
  },
  vin: [
    {
      txid: '3849102938401928340192834019283401928340192834019283401928340192',
      vout: 0,
      prevout: {
        scriptpubkey_address: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
        scriptpubkey_type: 'p2pkh', // Legacy input 1
        value: 15000000, // 0.15 BTC
      },
      sequence: 4294967295,
    },
    {
      txid: '4950192834019283401928340192834019283401928340192834019283401928',
      vout: 1,
      prevout: {
        scriptpubkey_address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
        scriptpubkey_type: 'p2sh', // P2SH input 2 (Consolidation from different address formats)
        value: 20000000, // 0.20 BTC
      },
      sequence: 4294967295,
    },
    {
      txid: '5061928340192834019283401928340192834019283401928340192834019283',
      vout: 0,
      prevout: {
        scriptpubkey_address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
        scriptpubkey_type: 'v0_p2wpkh', // SegWit input 3
        value: 18500000, // 0.185 BTC
      },
      sequence: 4294967295,
    },
  ],
  vout: [
    {
      scriptpubkey_address: 'bc1q7cyrfmck2ffu2ud3rn5l5a8yv6f0x240jy2sqt',
      scriptpubkey_type: 'v0_p2wpkh',
      value: 10000000, // 0.10000000 BTC (Clear round number payment!)
      n: 0,
    },
    {
      scriptpubkey_address: 'bc1qxyz98327498127398127398127398127398123',
      scriptpubkey_type: 'v0_p2wpkh',
      value: 43481550, // 0.43481550 BTC (Uneven remainder, high probability of being the change output)
      n: 1,
    },
  ],
  totalInputValue: 53500000,
  totalOutputValue: 53481550,
  feeRate: 33.8,
};

const highLinkAddressInfo: BitcoinAddressInfo = {
  address: highLinkAddress,
  addressType: 'p2wpkh',
  chain_stats: {
    funded_txo_count: 8,
    funded_txo_sum: 145000000,
    spent_txo_count: 7,
    spent_txo_sum: 132000000,
    tx_count: 9,
  },
  balance: 13000000,
  totalReceived: 145000000,
  totalSent: 132000000,
  firstSeenTimestamp: 1698200000,
  lastSeenTimestamp: 1714702500,
  txCount: 9,
};

export const DEMO_SCENARIOS: Record<string, DemoScenario> = {
  low_risk: {
    id: 'low_risk',
    name: 'Low Privacy Risk',
    badge: 'Privacy-Preserving (Score ~18)',
    badgeColor: 'emerald',
    txid: lowRiskTxid,
    focusAddress: lowRiskAddress,
    address: lowRiskAddress,
    description: 'Collaborative transaction structure with dual equal-sized outputs, Taproot script uniformity, and zero address reuse.',
    keyHeuristic: 'Equal-output distribution & Taproot script consistency masks payment flow direction.',
    expectedScoreRange: '10–25 / 100 (LOW)',
    suggestedQuestion: 'Why is this transaction considered lower risk for correlation?',
    transaction: lowRiskTx,
    addressInfo: lowRiskAddressInfo,
    addressHistory: [
      {
        txid: lowRiskTxid,
        timestamp: 1714829310,
        type: 'outgoing',
        amount: 5000000,
        fee: 4520,
        confirmations: 42,
        counterparties: ['bc1p823m7c5t2w888d9c3xvv8q210mkls209k3j4m5n6p7q8r9s0t1u2v3w4x5'],
      },
    ],
  },
  address_reuse: {
    id: 'address_reuse',
    name: 'Address Reuse Detected',
    badge: 'Address Correlation (Score ~58)',
    badgeColor: 'amber',
    txid: reuseTxid,
    focusAddress: reuseAddress,
    address: reuseAddress,
    description: 'Direct address reuse observed: the same legacy P2PKH address is used as an input and recipient of the change output.',
    keyHeuristic: 'Self-change address reuse definitively links historical activity to this spending event.',
    expectedScoreRange: '50–65 / 100 (MODERATE)',
    suggestedQuestion: 'How does reusing an address compromise financial privacy on Bitcoin?',
    transaction: reuseTx,
    addressInfo: reuseAddressInfo,
    addressHistory: [
      {
        txid: reuseTxid,
        timestamp: 1714605000,
        type: 'self_transfer',
        amount: 7984800,
        fee: 15200,
        confirmations: 128,
        counterparties: ['1Dice8EMZmqKvrGE4Qc9bUFf9PX3xaYDp'],
      },
      {
        txid: '7102938471928374619283746192837461928374619283746192837461928374',
        timestamp: 1712000000,
        type: 'incoming',
        amount: 12500000,
        confirmations: 3820,
        counterparties: ['1BoatSLRHtKNngkdXEeobR76b53LETtpyT'],
      },
    ],
  },
  high_linkability: {
    id: 'high_linkability',
    name: 'High Linkability & Consolidation',
    badge: 'Consolidation & Round Payment (Score ~84)',
    badgeColor: 'rose',
    txid: highLinkTxid,
    focusAddress: highLinkAddress,
    address: highLinkAddress,
    description: 'Multiple inputs across different script types consolidated into a single transaction, combined with a round-number payment and obvious change output.',
    keyHeuristic: 'Common-Input-Ownership Heuristic (CIOH) + Round Payment Heuristic + Script Fingerprint mismatch.',
    expectedScoreRange: '75–90 / 100 (VERY HIGH)',
    suggestedQuestion: 'Why is this transaction potentially linkable to a single entity?',
    transaction: highLinkTx,
    addressInfo: highLinkAddressInfo,
    addressHistory: [
      {
        txid: highLinkTxid,
        timestamp: 1714702500,
        type: 'consolidation',
        amount: 18500000,
        fee: 18450,
        confirmations: 95,
        counterparties: ['bc1q7cyrfmck2ffu2ud3rn5l5a8yv6f0x240jy2sqt'],
      },
    ],
  },
};

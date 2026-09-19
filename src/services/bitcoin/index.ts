import { BitcoinProvider } from './bitcoinProvider';
import { DemoBitcoinProvider } from './demoBitcoinProvider';
import { LiveBitcoinProvider } from './liveBitcoinProvider';

let currentMode: 'demo' | 'live' = 'demo';
const demoProvider = new DemoBitcoinProvider();
const liveProvider = new LiveBitcoinProvider();

export function getBitcoinProvider(preferMode?: 'demo' | 'live'): BitcoinProvider {
  const mode = preferMode ?? currentMode;
  return mode === 'live' ? liveProvider : demoProvider;
}

export function setGlobalBitcoinMode(mode: 'demo' | 'live') {
  currentMode = mode;
}

export function getGlobalBitcoinMode(): 'demo' | 'live' {
  return currentMode;
}

export * from './bitcoinProvider';
export * from './demoBitcoinProvider';
export * from './demoData';
export * from './liveBitcoinProvider';

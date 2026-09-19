import { AIProvider } from './aiProvider';
import { LiveAIProvider } from './liveAIProvider';
import { MockAIProvider } from './mockAIProvider';

const mockProvider = new MockAIProvider();
const liveProvider = new LiveAIProvider();

let preferLive = false;

export function getAIProvider(forceMode?: 'demo' | 'live'): AIProvider {
  if (forceMode === 'demo') return mockProvider;
  if (forceMode === 'live') return liveProvider;
  return preferLive ? liveProvider : mockProvider;
}

export function setPreferLiveAI(val: boolean) {
  preferLive = val;
}

export function isPreferLiveAI(): boolean {
  return preferLive;
}

export * from './aiProvider';
export * from './liveAIProvider';
export * from './mockAIProvider';

import { BitcoinAddressInfo, BitcoinTransaction } from './bitcoin';
import { PrivacyAnalysis } from './privacy';

export type AgentToolName =
  | 'getBitcoinTransaction'
  | 'getBitcoinAddress'
  | 'getAddressHistory'
  | 'analyzeTransactionPrivacy'
  | 'analyzeAddressPrivacy'
  | 'calculatePrivacyRisk'
  | 'getPrivacyFindings';

export interface ToolExecutionStep {
  id: string;
  toolName: AgentToolName;
  status: 'pending' | 'running' | 'completed' | 'failed';
  label: string;
  timestamp: number;
  inputSummary?: string;
  outputSummary?: string;
  durationMs?: number;
}

export interface AgentContext {
  targetId?: string;
  targetType?: 'transaction' | 'address';
  transaction?: BitcoinTransaction | null;
  addressInfo?: BitcoinAddressInfo | null;
  privacyAnalysis?: PrivacyAnalysis | null;
  network?: 'mainnet' | 'testnet' | 'demo';
  isDemo?: boolean;
  selectedQuestion?: string;
}

export interface StructuredAIResponse {
  summary: string;
  riskAssessment: string;
  whatIsVisible: string;
  whyItMatters: string;
  potentialLinkability: string;
  limitations: string;
  defensiveConsiderations: string;
  rawMarkdown?: string;
}

export interface ChatMessage {
  id: string;
  role?: 'user' | 'assistant' | 'system';
  sender?: 'user' | 'agent' | 'system';
  content?: string;
  text?: string;
  timestamp: number;
  toolSteps?: ToolExecutionStep[];
  structuredResponse?: StructuredAIResponse;
  suggestedQuestions?: string[];
}

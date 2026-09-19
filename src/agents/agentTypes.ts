import { AgentContext, AgentToolName, StructuredAIResponse, ToolExecutionStep } from '../types/agent';

export interface AgentExecutionRequest {
  userPrompt: string;
  context: AgentContext;
  onToolStep?: (step: ToolExecutionStep) => void;
  preferMode?: 'demo' | 'live';
}

export interface AgentExecutionResult {
  toolSteps: ToolExecutionStep[];
  structuredResponse: StructuredAIResponse;
  suggestedFollowUps: string[];
}

export interface ToolDefinition {
  name: AgentToolName;
  description: string;
  parameters: Record<string, unknown>;
}

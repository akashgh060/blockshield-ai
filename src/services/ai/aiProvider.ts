import { AgentContext, ChatMessage, StructuredAIResponse } from '../../types/agent';

export interface AIProvider {
  name: string;
  isDemo: boolean;
  generatePrivacyExplanation(
    context: AgentContext,
    question: string
  ): Promise<StructuredAIResponse>;
  chatWithContext(
    context: AgentContext,
    conversation: ChatMessage[],
    userMessage: string
  ): Promise<StructuredAIResponse>;
}

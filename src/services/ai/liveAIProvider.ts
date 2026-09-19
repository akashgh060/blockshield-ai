import { AgentContext, ChatMessage, StructuredAIResponse } from '../../types/agent';
import { AIProvider } from './aiProvider';
import { MockAIProvider } from './mockAIProvider';

export class LiveAIProvider implements AIProvider {
  name = 'Google Gemini 3.8 Flash Privacy Intelligence (Live Server)';
  isDemo = false;
  private fallback = new MockAIProvider();

  async generatePrivacyExplanation(
    context: AgentContext,
    question: string
  ): Promise<StructuredAIResponse> {
    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'explain',
          question,
          context,
        }),
      });

      if (!res.ok) {
        // Fallback gracefully to mock provider
        return this.fallback.generatePrivacyExplanation(context, question);
      }

      const data = await res.json();
      if (data && data.structuredResponse) {
        return data.structuredResponse;
      }
      return this.fallback.generatePrivacyExplanation(context, question);
    } catch {
      return this.fallback.generatePrivacyExplanation(context, question);
    }
  }

  async chatWithContext(
    context: AgentContext,
    conversation: ChatMessage[],
    userMessage: string
  ): Promise<StructuredAIResponse> {
    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat',
          question: userMessage,
          conversation,
          context,
        }),
      });

      if (!res.ok) {
        return this.fallback.chatWithContext(context, conversation, userMessage);
      }

      const data = await res.json();
      if (data && data.structuredResponse) {
        return data.structuredResponse;
      }
      return this.fallback.chatWithContext(context, conversation, userMessage);
    } catch {
      return this.fallback.chatWithContext(context, conversation, userMessage);
    }
  }
}

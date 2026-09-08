import { Role } from '../users/enums/role.enum';
import { ChatMessage } from './types/chat-message';

export class PromptBuilder {
  private prompt: string;

  constructor(basePrompt: string) {
    this.prompt = basePrompt;
  }

  withUserRole(role: Role): PromptBuilder {
    this.prompt = `${this.prompt}
    
Роль пользователя:
${role}`;
    return this;
  }

  withContext(chunks: string[]): PromptBuilder {
    this.prompt = `${this.prompt}
    
Контекст:

${chunks.join('\n\n')}

Конец контекста.`;
    return this;
  }

  withChatHistory(chatHistory: ChatMessage[]): PromptBuilder {
    this.prompt = `${this.prompt}
    
История диалога:

${this.mapChatHistoryToMultistring(chatHistory)}

Конец истории диалога.`;
    return this;
  }

  private mapChatHistoryToMultistring(chatHistory: ChatMessage[]): string {
    return chatHistory
      .map(
        (m: ChatMessage): string =>
          `Вопрос пользователя: ${m.userRequest}\nОтвет ИИ ассистента: ${m.aiAnswer}`,
      )
      .join('\n\n');
  }

  withQuestion(request: string): PromptBuilder {
    this.prompt = `${this.prompt}
    
Вопрос пользователя:
${request}`;
    return this;
  }

  build(): string {
    return this.prompt;
  }
}

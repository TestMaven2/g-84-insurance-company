import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { PromptService } from '../prompts/prompt.service';
import { ChatMessage } from './types/chat-message';
import { User } from '../users/user.entity';
import { ContextService } from './context.service';
import { QdrantVectorStore } from '@langchain/qdrant';
import { QdrantClient } from '../vector-storage/qdrant/qdrant-client';
import { SearchFilterAnd } from '../vector-storage/qdrant/types/filters/search-filter-and';
import { Role } from '../users/enums/role.enum';
import { DocumentInterface } from '@langchain/core/documents';

@Injectable()
export class ChatService {
  private readonly chatHistory: Map<number, ChatMessage[]> = new Map<
    number,
    ChatMessage[]
  >();

  constructor(
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
    private readonly contextService: ContextService,
    private readonly vectorStore: QdrantVectorStore,
    private readonly qdrantClient: QdrantClient,
  ) {}

  async generateResponse(request: string, user: User): Promise<string> {
    const chatHistory: ChatMessage[] = this.getChatHistoryByUserId(user.id);

    let prompt: string = this.promptService
      .buildPromptForInsuranceType()
      .withUserRole(user.role)
      .withChatHistory(chatHistory)
      .withQuestion(request)
      .build();

    const insuranceType: string = await this.aiService.generateResponse(prompt);

    const filter: SearchFilterAnd = this.qdrantClient.createSearchFilter(
      insuranceType,
      user.role === Role.CUSTOMER,
    );

    const relevantChunks: [DocumentInterface, number][] =
      await this.vectorStore.similaritySearchWithScore(request, 5, filter);

    const context: string[] =
      this.contextService.generateContext(relevantChunks);

    prompt = this.promptService
      .buildPromptForChat()
      .withUserRole(user.role)
      .withContext(context)
      .withChatHistory(chatHistory)
      .withQuestion(request)
      .build();

    const aiResponse: string = await this.aiService.generateResponse(prompt);

    this.addChatHistoryByUserId(user.id, request, aiResponse);

    return aiResponse;
  }

  private getChatHistoryByUserId(userId: number): ChatMessage[] {
    return this.chatHistory.get(userId)?.slice(-10) ?? [];
  }

  private addChatHistoryByUserId(
    userId: number,
    userRequest: string,
    aiResponse: string,
  ): void {
    const message: ChatMessage = new ChatMessage();
    message.userRequest = userRequest;
    message.aiAnswer = aiResponse;

    if (this.chatHistory.has(userId)) {
      this.chatHistory.get(userId)?.push(message);
    } else {
      this.chatHistory.set(userId, [message]);
    }
  }
}

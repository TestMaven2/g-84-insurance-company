import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorStorageService } from '../vector-storage/vector-storage.service';
import { AiService } from '../ai/ai.service';
import { PromptService } from './prompt.service';
import { ChatMessage } from './types/chat-message';
import { User } from '../users/user.entity';

@Injectable()
export class ChatService {
  private readonly chatHistory: Map<number, ChatMessage[]> = new Map<
    number,
    ChatMessage[]
  >();

  constructor(
    private readonly embeddingsService: EmbeddingsService,
    private readonly vectorStorageService: VectorStorageService,
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
  ) {}

  async generateResponse(request: string, user: User): Promise<string> {
    const embedding: number[] = (
      await this.embeddingsService.generateEmbeddings([request])
    )[0];

    const chatHistory: ChatMessage[] = this.getChatHistoryByUserId(user.id);

    let prompt: string = this.promptService
      .buildPromptForInsuranceType()
      .withUserRole(user.role)
      .withChatHistory(chatHistory)
      .withQuestion(request)
      .build();

    console.log('\nCreated prompt for insurance type:\n');
    console.log(prompt + '\n');

    const insuranceType: string = await this.aiService.generateResponse(prompt);

    const relevantChunks: string[] =
      await this.vectorStorageService.getRelevantChunks(
        embedding,
        insuranceType,
        user.role,
      );

    prompt = this.promptService
      .buildPromptForChat()
      .withUserRole(user.role)
      .withContext(relevantChunks)
      .withChatHistory(chatHistory)
      .withQuestion(request)
      .build();

    console.log('\nCreated prompt for AI chat:\n');
    console.log(prompt + '\n');

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

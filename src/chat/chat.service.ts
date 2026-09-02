import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorStorageService } from '../vector-storage/vector-storage.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly embeddingsService: EmbeddingsService,
    private readonly vectorStorageService: VectorStorageService,
    private readonly aiService: AiService,
  ) {}

  async generateResponse(request: string): Promise<string> {
    const embedding: number[] = (
      await this.embeddingsService.generateEmbeddings([request])
    )[0];

    const relevantChunks: string[] =
      await this.vectorStorageService.getRelevantChunks(embedding);

    console.log('Question:');
    console.log(request + '\n');
    console.log('Relevant chunks:' + '\n');
    relevantChunks.forEach((c: string): void => console.log(c + '\n'));

    const prompt: string = this.createPrompt(relevantChunks, request);

    console.log('\nCreated prompt:\n');
    console.log(prompt + '\n');

    return this.aiService.generateResponse(prompt);
  }

  private createPrompt(chunks: string[], request: string): string {
    return `Сгенерируй ответ, основываясь только на предоставленном контексте.
Дай только ответ, не упоминай в ответе контекст.

Контекст:

${chunks.join('\n\n')}

Конец контекста.

Вопрос:
${request}`;
  }
}

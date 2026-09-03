import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorStorageService } from '../vector-storage/vector-storage.service';
import { AiService } from '../ai/ai.service';
import { PromptService } from './prompt.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly embeddingsService: EmbeddingsService,
    private readonly vectorStorageService: VectorStorageService,
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
  ) {}

  async generateResponse(request: string): Promise<string> {
    const embedding: number[] = (
      await this.embeddingsService.generateEmbeddings([request])
    )[0];

    let prompt: string =
      this.promptService.createPromptForInsuranceType(request);

    const insuranceType: string = await this.aiService.generateResponse(prompt);

    const relevantChunks: string[] =
      await this.vectorStorageService.getRelevantChunks(
        embedding,
        insuranceType,
      );

    console.log('Question:');
    console.log(request + '\n');
    console.log('Relevant chunks:' + '\n');
    relevantChunks.forEach((c: string): void => console.log(c + '\n'));

    prompt = this.promptService.createPromptForUserRequest(
      relevantChunks,
      request,
    );

    console.log('\nCreated prompt:\n');
    console.log(prompt + '\n');

    return this.aiService.generateResponse(prompt);
  }
}

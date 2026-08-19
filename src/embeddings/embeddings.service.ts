import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Injectable()
export class EmbeddingsService {
  constructor(private readonly aiService: AiService) {}

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] =
      await this.aiService.generateEmbeddings(texts);

    for (const embedding of embeddings) {
      console.log('\nEmbedding calculated:');
      console.log(embedding);
    }

    return embeddings;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateEmbeddingsRequestDto } from './dto/create-embeddings-request.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class EmbeddingsService {
  constructor(private readonly aiService: AiService) {}

  async generateEmbeddings(
    requestDto: CreateEmbeddingsRequestDto,
  ): Promise<void> {
    const embeddings: number[][] = await this.aiService.generateEmbeddings(
      requestDto.texts,
    );

    for (const embedding of embeddings) {
      console.log('\nEmbedding calculated:');
      console.log(embedding);
    }
  }
}

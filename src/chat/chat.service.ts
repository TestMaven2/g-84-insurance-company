import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorStorageService } from '../vector-storage/vector-storage.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly embeddingsService: EmbeddingsService,
    private readonly vectorStorageService: VectorStorageService,
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

    return 'Здесь будет ответ ИИ';
  }
}

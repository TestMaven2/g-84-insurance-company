import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { QdrantPoint } from './qdrant/types/qdrant-point';
import { randomUUID } from 'node:crypto';
import { QdrantClient } from './qdrant/qdrant-client';
import { QdrantResult } from './qdrant/types/qdrant-result';
import { Chunk } from '../ingestion/types/chunk';

@Injectable()
export class VectorStorageService {
  constructor(
    private readonly embeddingsService: EmbeddingsService,
    private readonly client: QdrantClient,
  ) {}

  async saveToDb(payloads: Chunk[]): Promise<void> {
    const texts: string[] = payloads.map((p: Chunk): string => p.text);

    const embeddings: number[][] =
      await this.embeddingsService.generateEmbeddings(texts);

    const points: QdrantPoint[] = this.generatePoints(embeddings, payloads);

    await this.client.save(points);
  }

  private generatePoints(
    embeddings: number[][],
    payloads: object[],
  ): QdrantPoint[] {
    const result: QdrantPoint[] = [];

    for (let i: number = 0; i < embeddings.length; i++) {
      const point: QdrantPoint = new QdrantPoint();
      point.id = randomUUID();
      point.vector = embeddings[i];
      point.payload = payloads[i];
      result.push(point);
    }

    return result;
  }

  async getRelevantChunks(embedding: number[]): Promise<string[]> {
    const relevantChunks: QdrantResult[] =
      await this.client.getRelevantChunks(embedding);

    return relevantChunks.map((c: QdrantResult): string => c.payload.text);
  }
}

import { Injectable } from '@nestjs/common';
import { QdrantPoint } from './types/qdrant-point';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { QdrantResponse } from './types/qdrant-response';
import { QdrantResult } from './types/qdrant-result';

@Injectable()
export class QdrantClient {
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    const dbUrl: string = this.configService.getOrThrow('QDRANT_URL');
    const collectionName: string = this.configService.getOrThrow(
      'KNOWLEDGE_DB_COLLECTION_NAME',
    );
    this.baseUrl = `${dbUrl}/collections/${collectionName}`;
  }

  async save(points: QdrantPoint[]): Promise<void> {
    try {
      await axios.put(this.baseUrl, {
        vectors: {
          size: 1536,
          distance: 'Cosine',
        },
      });
    } catch {
      // Collection already exists
    }

    await axios.put(`${this.baseUrl}/points`, {
      points: points,
    });
  }

  async getRelevantChunks(embedding: number[]): Promise<QdrantResult[]> {
    const response: QdrantResponse = await axios.post(
      `${this.baseUrl}/points/search`,
      {
        vector: embedding,
        limit: 5,
        with_payload: true,
        with_vector: false,
      },
    );

    return response.data.result;
  }
}

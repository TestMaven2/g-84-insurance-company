import { Injectable } from '@nestjs/common';
import { QdrantPoint } from './types/qdrant-point';
import axios from 'axios';

@Injectable()
export class QdrantClient {
  async save(points: QdrantPoint[]): Promise<void> {
    try {
      await axios.put('http://localhost:6333/collections/test', {
        vectors: {
          size: 1536,
          distance: 'Cosine',
        },
      });
    } catch {
      // Collection already exists
    }

    await axios.put('http://localhost:6333/collections/test/points', {
      points: points,
    });
  }
}

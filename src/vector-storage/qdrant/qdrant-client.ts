import { Injectable } from '@nestjs/common';
import { QdrantPoint } from './types/qdrant-point';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { QdrantResponse } from './types/qdrant-response';
import { QdrantResult } from './types/qdrant-result';
import { SearchFilter } from './types/filters/search-filter';
import { SearchFilterMatcher } from './types/filters/search-filter-matcher';
import { SearchFilterParameter } from './types/filters/search-filter-parameter';

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

  async getRelevantChunks(
    embedding: number[],
    insuranceType: string,
  ): Promise<QdrantResult[]> {
    const response: QdrantResponse = await axios.post(
      `${this.baseUrl}/points/search`,
      {
        vector: embedding,
        limit: 5,
        with_payload: true,
        with_vector: false,
        filter: this.createSearchFilter(insuranceType),
      },
    );

    return response.data.result;
  }

  private createSearchFilter(insuranceType: string): SearchFilter {
    const filter: SearchFilter = new SearchFilter();

    if (insuranceType === 'both') {
      return filter;
    }

    const matcher1: SearchFilterMatcher = new SearchFilterMatcher();
    matcher1.value = insuranceType;
    const matcher2: SearchFilterMatcher = new SearchFilterMatcher();
    matcher2.value = 'both';

    const parameter1: SearchFilterParameter = new SearchFilterParameter();
    parameter1.match = matcher1;
    const parameter2: SearchFilterParameter = new SearchFilterParameter();
    parameter2.match = matcher2;

    filter.should = [parameter1, parameter2];

    return filter;
  }
}

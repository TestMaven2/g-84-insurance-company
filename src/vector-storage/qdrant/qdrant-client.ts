import { Injectable } from '@nestjs/common';
import { QdrantPoint } from './types/qdrant-point';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { QdrantResponse } from './types/qdrant-response';
import { QdrantResult } from './types/qdrant-result';
import { SearchFilterOr } from './types/filters/search-filter-or';
import { SearchFilterMatcher } from './types/filters/search-filter-matcher';
import { SearchFilterParameter } from './types/filters/search-filter-parameter';
import { SearchFilterAnd } from './types/filters/search-filter-and';

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
    onlyPublicDocs: boolean,
  ): Promise<QdrantResult[]> {
    const response: QdrantResponse = await axios.post(
      `${this.baseUrl}/points/search`,
      {
        vector: embedding,
        limit: 5,
        with_payload: true,
        with_vector: false,
        filter: this.createSearchFilter(insuranceType, onlyPublicDocs),
      },
    );

    return response.data.result;
  }

  private createSearchFilter(
    insuranceType: string,
    onlyPublicDocs: boolean,
  ): SearchFilterAnd {
    const filter: SearchFilterAnd = new SearchFilterAnd();

    if (onlyPublicDocs) {
      const publicMatcher: SearchFilterMatcher = new SearchFilterMatcher();
      publicMatcher.value = true;

      const publicParameter: SearchFilterParameter =
        new SearchFilterParameter();
      publicParameter.key = 'publicAccess';
      publicParameter.match = publicMatcher;

      filter.must.push(publicParameter);
    }

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

    const filterOr: SearchFilterOr = new SearchFilterOr();
    filterOr.should = [parameter1, parameter2];

    filter.must.push(filterOr);

    return filter;
  }
}

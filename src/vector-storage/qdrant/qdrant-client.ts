import { Injectable, OnModuleInit } from '@nestjs/common';
import { QdrantPoint } from './types/search/qdrant-point';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { SearchFilterOr } from './types/filters/search-filter-or';
import { SearchFilterMatcher } from './types/filters/search-filter-matcher';
import { SearchFilterParameter } from './types/filters/search-filter-parameter';
import { SearchFilterAnd } from './types/filters/search-filter-and';
import { QdrantScrollResponse } from './types/scroll/qdrant-scroll-response';

@Injectable()
export class QdrantClient implements OnModuleInit {
  private readonly baseUrl: string;
  private readonly archiveUrl: string;

  constructor(private readonly configService: ConfigService) {
    const dbUrl: string = this.configService.getOrThrow('QDRANT_URL');
    const collectionName: string = this.configService.getOrThrow(
      'KNOWLEDGE_DB_COLLECTION_NAME',
    );
    this.baseUrl = `${dbUrl}/collections/${collectionName}`;

    const archiveCollectionName: string = this.configService.getOrThrow(
      'ARCHIVE_DB_COLLECTION_NAME',
    );
    this.archiveUrl = `${dbUrl}/collections/${archiveCollectionName}`;
  }

  async onModuleInit(): Promise<void> {
    for (const url of [this.baseUrl, this.archiveUrl]) {
      try {
        await axios.put(url, {
          vectors: {
            size: 1536,
            distance: 'Cosine',
          },
        });
      } catch {
        // Collection already exists
      }
    }
  }

  async save(points: QdrantPoint[], toArchive?: boolean): Promise<void> {
    const url: string = toArchive ? this.archiveUrl : this.baseUrl;

    await axios.put(`${url}/points`, {
      points: points,
    });
  }

  createSearchFilter(
    insuranceType: string,
    onlyPublicDocs: boolean,
  ): SearchFilterAnd {
    const filter: SearchFilterAnd = new SearchFilterAnd();

    if (onlyPublicDocs) {
      const publicMatcher: SearchFilterMatcher = new SearchFilterMatcher();
      publicMatcher.value = true;

      const publicParameter: SearchFilterParameter =
        new SearchFilterParameter();
      publicParameter.key = 'metadata.publicAccess';
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

  async findPointsByDocumentId(documentId: string): Promise<QdrantPoint[]> {
    const points: QdrantPoint[] = [];
    let offset: string | null = null;

    do {
      const response: QdrantScrollResponse = await axios.post(
        `${this.baseUrl}/points/scroll`,
        {
          with_payload: true,
          with_vector: true,
          filter: this.createScrollFilter(documentId),
          offset: offset,
        },
      );

      points.push(...response.data.result.points);
      offset = response.data.result.next_page_offset;
    } while (offset !== null);

    return points;
  }

  createScrollFilter(documentId: string): SearchFilterAnd {
    const matcher: SearchFilterMatcher = new SearchFilterMatcher();
    matcher.value = documentId;

    const parameter: SearchFilterParameter = new SearchFilterParameter();
    parameter.key = 'metadata.documentId';
    parameter.match = matcher;

    const filter: SearchFilterAnd = new SearchFilterAnd();
    filter.must = [parameter];

    return filter;
  }

  async deletePointsByDocumentId(documentId: string): Promise<void> {
    const filter: SearchFilterAnd = this.createScrollFilter(documentId);

    await axios.post(`${this.baseUrl}/points/delete`, { filter: filter });
  }
}

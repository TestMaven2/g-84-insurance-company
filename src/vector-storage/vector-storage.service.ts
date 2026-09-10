import { Injectable } from '@nestjs/common';
import { QdrantFilterBuilder } from './qdrant/qdrant-filter.builder';
import { Chunk } from '../ingestion/types/chunk';
import { DocumentVersionConflictException } from '../exceptions/types/document-version-conflict.exception';
import { Document } from 'langchain';
import { QdrantVectorStore } from '@langchain/qdrant';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/js-client-rest';
import { SearchFilterOr } from './qdrant/types/filters/search-filter-or';
import { Schemas } from '@qdrant/js-client-rest';
import { LangChainPayload } from './qdrant/types/langchain-payload';

@Injectable()
export class VectorStorageService {
  private readonly collectionName: string;
  private readonly archiveName: string;

  constructor(
    private readonly client: QdrantClient,
    private readonly vectorStore: QdrantVectorStore,
    private readonly configService: ConfigService,
    private readonly filterBuilder: QdrantFilterBuilder,
  ) {
    this.collectionName = this.configService.getOrThrow(
      'KNOWLEDGE_DB_COLLECTION_NAME',
    );

    this.archiveName = this.configService.getOrThrow(
      'ARCHIVE_DB_COLLECTION_NAME',
    );
  }

  async saveToDb(
    payloads: Chunk[],
    documentId: string,
    documentVersion: number,
  ): Promise<void> {
    await this.archiveOldDocumentVersion(documentId, documentVersion);

    const documents: Document[] = this.convertChunksToDocuments(payloads);
    await this.vectorStore.addDocuments(documents);
  }

  private convertChunksToDocuments(chunks: Chunk[]): Document[] {
    return chunks.map((chunk: Chunk): Document => {
      const { text, ...metadata }: Chunk = chunk;

      return new Document({
        pageContent: text,
        metadata,
      });
    });
  }

  private async archiveOldDocumentVersion(
    documentId: string,
    documentVersion: number,
  ): Promise<void> {
    const filter: SearchFilterOr =
      this.filterBuilder.buildScrollFilter(documentId);

    const points: Schemas['Record'][] = [];

    let offset: Schemas['ScrollResult']['next_page_offset'] = null;

    do {
      const result = await this.client.scroll(this.collectionName, {
        filter,
        offset: offset ?? undefined,
        with_payload: true,
        with_vector: true,
      });

      points.push(...result.points);

      offset = result.next_page_offset;
    } while (offset !== null);

    if (points.length === 0) {
      return;
    }

    const payload: LangChainPayload = points[0]
      .payload as unknown as LangChainPayload;
    const oldVersion: number = payload.metadata.documentVersion;

    if (documentVersion <= oldVersion) {
      throw new DocumentVersionConflictException(oldVersion, documentVersion);
    }
    const archivePoints = points.map((point) => ({
      id: point.id,
      vector: point.vector as number[],
      payload: point.payload,
      limit: 100,
    }));

    await this.client.upsert(this.archiveName, {
      wait: true,
      points: archivePoints,
    });

    await this.client.delete(this.collectionName, {
      filter: filter,
    });
  }
}

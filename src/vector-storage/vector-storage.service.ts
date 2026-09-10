import { Injectable } from '@nestjs/common';
import { QdrantPoint } from './qdrant/types/search/qdrant-point';
import { QdrantClient } from './qdrant/qdrant-client';
import { QdrantResult } from './qdrant/types/search/qdrant-result';
import { Chunk } from '../ingestion/types/chunk';
import { Role } from '../users/enums/role.enum';
import { DocumentVersionConflictException } from '../exceptions/types/document-version-conflict.exception';
import { Document } from 'langchain';
import { QdrantVectorStore } from '@langchain/qdrant';

@Injectable()
export class VectorStorageService {
  constructor(
    private readonly client: QdrantClient,
    private readonly vectorStore: QdrantVectorStore,
  ) {}

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
    const points: QdrantPoint[] =
      await this.client.findPointsByDocumentId(documentId);

    if (points.length === 0) {
      return;
    }

    const oldVersion: number = points[0].payload.documentVersion;

    if (documentVersion <= oldVersion) {
      throw new DocumentVersionConflictException(oldVersion, documentVersion);
    }

    await this.client.save(points, true);
    await this.client.deletePointsByDocumentId(documentId);
  }

  async getRelevantChunks(
    embedding: number[],
    insuranceType: string,
    userRole: Role,
  ): Promise<QdrantResult[]> {
    const onlyPublicDocs: boolean = userRole === Role.CUSTOMER;

    return this.client.getRelevantChunks(
      embedding,
      insuranceType,
      onlyPublicDocs,
    );
  }
}

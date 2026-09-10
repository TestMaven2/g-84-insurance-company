import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantResult } from '../vector-storage/qdrant/types/search/qdrant-result';
import { QdrantPayload } from '../vector-storage/qdrant/types/search/qdrant-payload';
import { DocumentInterface } from '@langchain/core/documents';

@Injectable()
export class ContextService {
  constructor(private readonly configService: ConfigService) {}

  private convertDocumentToQdrantResult(
    document: DocumentInterface,
    score: number,
  ): QdrantResult {
    const payload: QdrantPayload = new QdrantPayload();
    payload.text = document.pageContent;
    payload.documentId = document.metadata['documentId'] as string;
    payload.index = document.metadata['index'] as number;

    const result: QdrantResult = new QdrantResult();
    result.id = document.id as string;
    result.version = document.metadata['documentVersion'] as number;
    result.score = score;
    result.payload = payload;

    return result;
  }

  generateContext(chunks: [DocumentInterface, number][]): string[] {
    const chunksByDocId: Map<string, QdrantResult[]> =
      this.groupChunksByDocumentId(
        chunks.map((c: [DocumentInterface, number]): QdrantResult =>
          this.convertDocumentToQdrantResult(c[0], c[1]),
        ),
      );

    this.sortChunksByIndex(chunksByDocId);

    for (const entry of chunksByDocId.entries()) {
      const unionChunks: QdrantResult[] = this.unionNeighborChunks(entry[1]);
      chunksByDocId.set(entry[0], unionChunks);
    }

    let processedChunks: QdrantResult[] = this.flatGroupedChunks(chunksByDocId);

    processedChunks.sort(
      (c1: QdrantResult, c2: QdrantResult): number => c2.score - c1.score,
    );

    processedChunks = this.getLimitedChunks(processedChunks);

    return processedChunks.map((c: QdrantResult): string => c.payload.text);
  }

  private getLimitedChunks(chunks: QdrantResult[]): QdrantResult[] {
    const maxLengthInWords: number = Number(
      this.configService.getOrThrow('MAX_CONTEXT_LENGTH_IN_WORDS'),
    );

    const result: QdrantResult[] = [];
    let currentLengthInWords: number = 0;

    for (const chunk of chunks) {
      const chunkLengthInWords: number = chunk.payload.text.split(/\s+/).length;
      if (currentLengthInWords + chunkLengthInWords <= maxLengthInWords) {
        result.push(chunk);
        currentLengthInWords += chunkLengthInWords;
      }
    }

    return result;
  }

  private flatGroupedChunks(
    chunksByDocId: Map<string, QdrantResult[]>,
  ): QdrantResult[] {
    const result: QdrantResult[] = [];
    for (const chunks of chunksByDocId.values()) {
      chunks.forEach((c: QdrantResult): void => {
        result.push(c);
      });
    }
    return result;
  }

  private unionNeighborChunks(chunks: QdrantResult[]): QdrantResult[] {
    if (chunks.length < 2) {
      return chunks;
    }

    const result: QdrantResult[] = [];
    let currentChunk: QdrantResult = chunks[0];

    for (let i: number = 1; i < chunks.length; i++) {
      const nextChunk: QdrantResult = chunks[i];

      if (nextChunk.payload.index - currentChunk.payload.index === 1) {
        currentChunk = this.unionChunksWithOverlapCutting(
          currentChunk,
          nextChunk,
        );
      } else {
        result.push(currentChunk);
        currentChunk = nextChunk;
      }
    }

    result.push(currentChunk);
    return result;
  }

  private unionChunksWithOverlapCutting(
    previousChunk: QdrantResult,
    nextChunk: QdrantResult,
  ): QdrantResult {
    const unionPayload: QdrantPayload = new QdrantPayload();
    unionPayload.text = this.concatTextsWithOverlapCutting(
      previousChunk.payload.text,
      nextChunk.payload.text,
    );
    unionPayload.documentId = previousChunk.payload.documentId;
    unionPayload.index = nextChunk.payload.index;

    const union: QdrantResult = new QdrantResult();
    union.score = Math.max(previousChunk.score, nextChunk.score);
    union.payload = unionPayload;

    return union;
  }

  private concatTextsWithOverlapCutting(text1: string, text2: string): string {
    const overlap: number = Number(
      this.configService.getOrThrow('CHUNK_OVERLAP'),
    );

    const text2WithoutOverlap: string = text2
      .split(/\s+/)
      .slice(overlap)
      .join(' ');

    return `${text1} ${text2WithoutOverlap}`;
  }

  private sortChunksByIndex(chunksByDocId: Map<string, QdrantResult[]>): void {
    for (const chunks of chunksByDocId.values()) {
      chunks.sort(
        (c1: QdrantResult, c2: QdrantResult): number =>
          c1.payload.index - c2.payload.index,
      );
    }
  }

  private groupChunksByDocumentId(
    chunks: QdrantResult[],
  ): Map<string, QdrantResult[]> {
    const chunksByDocId: Map<string, QdrantResult[]> = new Map<
      string,
      QdrantResult[]
    >();

    chunks.forEach((c: QdrantResult): void => {
      const documentId: string = c.payload.documentId;

      if (chunksByDocId.has(documentId)) {
        chunksByDocId.get(documentId)?.push(c);
      } else {
        chunksByDocId.set(documentId, [c]);
      }
    });

    return chunksByDocId;
  }
}

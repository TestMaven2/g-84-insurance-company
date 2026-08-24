import { Injectable } from '@nestjs/common';
import { TxtExtractor } from './extractors/txt.extractor';
import { CleanService } from './clean.service';
import { ChunkingService } from './chunking.service';
import { VectorStorageService } from '../vector-storage/vector-storage.service';

@Injectable()
export class IngestionService {
  constructor(
    private readonly txtExtractor: TxtExtractor,
    private readonly cleanService: CleanService,
    private readonly chunkingService: ChunkingService,
    private readonly vectorStorageService: VectorStorageService,
  ) {}

  async ingest(file: Express.Multer.File): Promise<void> {
    const text: string = this.txtExtractor.extract(file.buffer);
    const cleanedText: string = this.cleanService.cleanText(text);
    const chunks: string[] = this.chunkingService.getChunks(cleanedText);
    const payloads: object[] = this.mapChunksToPayloads(chunks);
    await this.vectorStorageService.saveToDb(payloads);
  }

  private mapChunksToPayloads(chunks: string[]): object[] {
    return chunks.map((c: string): object => ({ text: c }));
  }
}

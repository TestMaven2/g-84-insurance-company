import { Injectable } from '@nestjs/common';
import { CleanService } from './clean.service';
import { ChunkingService } from './chunking.service';
import { VectorStorageService } from '../vector-storage/vector-storage.service';
import { MultiformatExtractor } from './extractors/multiformat.extractor';
import { Chunk } from './types/chunk';

@Injectable()
export class IngestionService {
  constructor(
    private readonly multiformatExtractor: MultiformatExtractor,
    private readonly cleanService: CleanService,
    private readonly chunkingService: ChunkingService,
    private readonly vectorStorageService: VectorStorageService,
  ) {}

  async ingest(file: Express.Multer.File): Promise<void> {
    const pages: string[] = await this.multiformatExtractor.extract(file);
    const cleanedPages: string[] = this.cleanService.cleanTexts(pages);
    const chunks: Chunk[] = this.chunkingService.chunkBySizeWithOverlap(
      cleanedPages,
      file.originalname,
    );
    await this.vectorStorageService.saveToDb(chunks);
  }
}

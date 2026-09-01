import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { TxtExtractor } from './extractors/txt.extractor';
import { CleanService } from './clean.service';
import { ChunkingService } from './chunking.service';
import { VectorStorageModule } from '../vector-storage/vector-storage.module';
import { DocxExtractor } from './extractors/docx.extractor';
import { PdfExtractor } from './extractors/pdf.extractor';
import { MultiformatExtractor } from './extractors/multiformat.extractor';

@Module({
  controllers: [IngestionController],
  providers: [
    IngestionService,
    TxtExtractor,
    DocxExtractor,
    PdfExtractor,
    MultiformatExtractor,
    CleanService,
    ChunkingService,
  ],
  imports: [VectorStorageModule],
})
export class IngestionModule {}

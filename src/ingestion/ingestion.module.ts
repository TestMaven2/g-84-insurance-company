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
import { PromptsModule } from '../prompts/prompts.module';
import { AiModule } from '../ai/ai.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuarantineDocument } from './quarantine-document.entity';

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
  imports: [
    VectorStorageModule,
    PromptsModule,
    AiModule,
    TypeOrmModule.forFeature([QuarantineDocument]),
  ],
})
export class IngestionModule {}

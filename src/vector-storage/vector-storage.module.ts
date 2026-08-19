import { Module } from '@nestjs/common';
import { VectorStorageController } from './vector-storage.controller';
import { VectorStorageService } from './vector-storage.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { QdrantClient } from './qdrant/qdrant-client';

@Module({
  controllers: [VectorStorageController],
  providers: [VectorStorageService, QdrantClient],
  imports: [EmbeddingsModule],
})
export class VectorStorageModule {}

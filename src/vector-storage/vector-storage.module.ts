import { Module } from '@nestjs/common';
import { VectorStorageService } from './vector-storage.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { QdrantClient } from './qdrant/qdrant-client';

@Module({
  providers: [VectorStorageService, QdrantClient],
  imports: [EmbeddingsModule],
  exports: [VectorStorageService],
})
export class VectorStorageModule {}

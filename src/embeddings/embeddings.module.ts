import { Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { AiModule } from '../ai/ai.module';

@Module({
  providers: [EmbeddingsService],
  imports: [AiModule],
  exports: [EmbeddingsService],
})
export class EmbeddingsModule {}

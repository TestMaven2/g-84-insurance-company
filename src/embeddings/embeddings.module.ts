import { Module } from '@nestjs/common';
import { EmbeddingsController } from './embeddings.controller';
import { EmbeddingsService } from './embeddings.service';
import { AiModule } from '../ai/ai.module';

@Module({
  controllers: [EmbeddingsController],
  providers: [EmbeddingsService],
  imports: [AiModule],
})
export class EmbeddingsModule {}

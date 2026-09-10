import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { VectorStorageModule } from '../vector-storage/vector-storage.module';
import { AiModule } from '../ai/ai.module';
import { ContextService } from './context.service';
import { PromptsModule } from '../prompts/prompts.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ContextService],
  imports: [EmbeddingsModule, VectorStorageModule, AiModule, PromptsModule],
})
export class ChatModule {}

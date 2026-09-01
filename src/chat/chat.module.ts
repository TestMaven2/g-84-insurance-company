import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { VectorStorageModule } from '../vector-storage/vector-storage.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [EmbeddingsModule, VectorStorageModule],
})
export class ChatModule {}

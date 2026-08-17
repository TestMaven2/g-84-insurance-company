import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { GeminiClient } from './clients/gemini.client';
import { OpenAiClient } from './clients/openai.client';

@Module({
  controllers: [AiController],
  providers: [AiService, GeminiClient, OpenAiClient],
})
export class AiModule {}

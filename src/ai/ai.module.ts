import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GeminiClient } from './clients/gemini.client';
import { OpenAiClient } from './clients/openai.client';

@Module({
  providers: [AiService, GeminiClient, OpenAiClient],
  exports: [AiService],
})
export class AiModule {}

import { Injectable } from '@nestjs/common';
import { AiChatRequestDto } from './dto/ai-chat-request.dto';
import { GeminiClient } from './clients/gemini.client';
import { GeminiPart } from './types/gemini/gemini-part';
import { GeminiContent } from './types/gemini/gemini-content';
import { GeminiRequest } from './types/gemini/gemini-request';

@Injectable()
export class AiService {
  constructor(private readonly client: GeminiClient) {}

  async generateResponse(chatRequestDto: AiChatRequestDto): Promise<string> {
    const part: GeminiPart = new GeminiPart();
    part.text = chatRequestDto.message;

    const content: GeminiContent = new GeminiContent();
    content.parts = [part];

    const request: GeminiRequest = new GeminiRequest();
    request.contents = [content];

    return this.client.generateContent(request);
  }

  // Вариант для OpenAI
  // async generateResponse(aiChatRequestDto: AiChatRequestDto): Promise<string> {
  //   const request: OpenAiRequest = new OpenAiRequest();
  //   request.model = this.configService.getOrThrow('OPENAI_MODEL');
  //   request.input = aiChatRequestDto.message;
  //
  //   return this.client.generateContent(request);
  // }
}

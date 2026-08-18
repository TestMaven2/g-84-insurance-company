import { Injectable } from '@nestjs/common';
import { AiChatRequestDto } from './dto/ai-chat-request.dto';
import { GeminiClient } from './clients/gemini.client';
import { GeminiPart } from './types/gemini/gemini-part';
import { GeminiContent } from './types/gemini/gemini-content';
import { GeminiChatRequest } from './types/gemini/gemini-chat-request';
import { GeminiEmbedRequest } from './types/gemini/gemini-embed-request';
import { GeminiEmbedContentConfig } from './types/gemini/gemini-embed-content-config';

@Injectable()
export class AiService {
  constructor(private readonly client: GeminiClient) {}

  async generateResponse(chatRequestDto: AiChatRequestDto): Promise<string> {
    const part: GeminiPart = new GeminiPart();
    part.text = chatRequestDto.message;

    const content: GeminiContent = new GeminiContent();
    content.parts = [part];

    const request: GeminiChatRequest = new GeminiChatRequest();
    request.contents = [content];

    return this.client.generateContent(request);
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const parts: GeminiPart[] = this.convertTextsToParts(texts);
    const result: number[][] = [];

    for (const part of parts) {
      const content: GeminiContent = new GeminiContent();
      content.parts = [part];

      const request: GeminiEmbedRequest = new GeminiEmbedRequest();
      request.content = content;
      request.embedContentConfig = new GeminiEmbedContentConfig();

      const embedding: number[] = await this.client.generateEmbedding(request);
      result.push(embedding);
    }

    return result;
  }

  private convertTextsToParts(texts: string[]): GeminiPart[] {
    return texts.map((t: string): GeminiPart => {
      const part: GeminiPart = new GeminiPart();
      part.text = t;
      return part;
    });
  }

  // Вариант для OpenAI
  // async generateResponse(aiChatRequestDto: AiChatRequestDto): Promise<string> {
  //   const request: OpenAiRequest = new OpenAiRequest();
  //   request.model = this.configService.getOrThrow('OPENAI_MODEL');
  //   request.input = aiChatRequestDto.message;
  //
  //   return this.client.generateContent(request);
  // }

  // async generateEmbeddings(texts: string[]): Promise<number[][]> {
  //   const model: string = this.configService.getOrThrow(
  //     'OPENAI_EMBEDDING_MODEL',
  //   );
  //
  //   const request: OpenAiRequest = new OpenAiRequest();
  //   request.model = model;
  //   request.input = texts;
  //
  //   return this.client.generateEmbeddings(request);
  // }
}

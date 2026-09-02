import { Injectable } from '@nestjs/common';
import { GeminiClient } from './clients/gemini.client';
import { GeminiPart } from './types/gemini/gemini-part';
import { GeminiContent } from './types/gemini/gemini-content';
import { GeminiChatRequest } from './types/gemini/gemini-chat-request';
import { GeminiEmbedRequest } from './types/gemini/gemini-embed-request';
import { GeminiEmbedContentConfig } from './types/gemini/gemini-embed-content-config';
import { OpenAiClient } from './clients/openai.client';
import { ConfigService } from '@nestjs/config';
import { OpenAiRequest } from './types/openai/openai-request';
import { ConfigurationException } from '../exceptions/types/configuration.exception';

@Injectable()
export class AiService {
  constructor(
    private readonly geminiClient: GeminiClient,
    private readonly openAiClient: OpenAiClient,
    private readonly configService: ConfigService,
  ) {}

  async generateResponse(prompt: string): Promise<string> {
    const generationAiProvider: string = this.configService.getOrThrow(
      'PRIMARY_GENERATION_AI_PROVIDER',
      'gemini',
    );

    switch (generationAiProvider) {
      case 'gemini': {
        const part: GeminiPart = new GeminiPart();
        part.text = prompt;

        const content: GeminiContent = new GeminiContent();
        content.parts = [part];

        const request: GeminiChatRequest = new GeminiChatRequest();
        request.contents = [content];

        return this.geminiClient.generateContent(request);
      }

      case 'openai': {
        const request: OpenAiRequest = new OpenAiRequest();
        request.model = this.configService.getOrThrow('OPENAI_MODEL');
        request.input = prompt;

        return this.openAiClient.generateContent(request);
      }

      default:
        throw new ConfigurationException(
          `${generationAiProvider} generation AI provider is not supported`,
        );
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddingsAiProvider: string = this.configService.getOrThrow(
      'PRIMARY_EMBEDDINGS_AI_PROVIDER',
      'gemini',
    );

    switch (embeddingsAiProvider) {
      case 'gemini': {
        const parts: GeminiPart[] = this.convertTextsToParts(texts);
        const result: number[][] = [];

        for (const part of parts) {
          const content: GeminiContent = new GeminiContent();
          content.parts = [part];

          const request: GeminiEmbedRequest = new GeminiEmbedRequest();
          request.content = content;
          request.embedContentConfig = new GeminiEmbedContentConfig();

          const embedding: number[] =
            await this.geminiClient.generateEmbedding(request);
          result.push(embedding);
        }

        return result;
      }

      case 'openai': {
        const model: string = this.configService.getOrThrow(
          'OPENAI_EMBEDDING_MODEL',
        );

        const request: OpenAiRequest = new OpenAiRequest();
        request.model = model;
        request.input = texts;

        return this.openAiClient.generateEmbeddings(request);
      }

      default:
        throw new ConfigurationException(
          `${embeddingsAiProvider} embeddings AI provider is not supported`,
        );
    }
  }

  private convertTextsToParts(texts: string[]): GeminiPart[] {
    return texts.map((t: string): GeminiPart => {
      const part: GeminiPart = new GeminiPart();
      part.text = t;
      return part;
    });
  }
}

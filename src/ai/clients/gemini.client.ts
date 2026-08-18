import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiChatRequest } from '../types/gemini/gemini-chat-request';
import axios, { AxiosResponse } from 'axios';
import { GeminiChatResponse } from '../types/gemini/gemini-chat-response';
import { GeminiEmbedRequest } from '../types/gemini/gemini-embed-request';
import { GeminiEmbedResponse } from '../types/gemini/gemini-embed-response';

@Injectable()
export class GeminiClient {
  constructor(private readonly configService: ConfigService) {}

  async generateContent(request: GeminiChatRequest): Promise<string> {
    const baseUrl: string = this.configService.getOrThrow('GEMINI_API_URL');
    const key: string = this.configService.getOrThrow('GEMINI_API_KEY');
    const url: string = baseUrl + key;

    const response: AxiosResponse<GeminiChatResponse> =
      await axios.post<GeminiChatResponse>(url, request);

    return response.data.candidates[0].content.parts[0].text;
  }

  async generateEmbedding(request: GeminiEmbedRequest): Promise<number[]> {
    const baseUrl: string = this.configService.getOrThrow(
      'GEMINI_EMBEDDING_URL',
    );
    const key: string = this.configService.getOrThrow('GEMINI_API_KEY');
    const url: string = baseUrl + key;

    const response: AxiosResponse<GeminiEmbedResponse> =
      await axios.post<GeminiEmbedResponse>(url, request);

    return response.data.embedding.values;
  }
}

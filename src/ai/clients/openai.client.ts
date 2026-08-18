import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { OpenAiRequest } from '../types/openai/openai-request';
import { OpenAiResponse } from '../types/openai/openai-response';
import { OpenAiEmbeddingsResponse } from '../types/openai/openai-embeddings-response';
import { OpenAiEmbedding } from '../types/openai/openai-embedding';

@Injectable()
export class OpenAiClient {
  constructor(private readonly configService: ConfigService) {}

  async generateContent(request: OpenAiRequest): Promise<string> {
    const url: string = this.configService.getOrThrow('OPENAI_API_URL');

    const response: AxiosResponse<OpenAiResponse> =
      await axios.post<OpenAiResponse>(url, request, {
        headers: {
          Authorization: `Bearer ${this.configService.getOrThrow('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
      });

    return response.data.output[0].content[0].text;
  }

  async generateEmbeddings(request: OpenAiRequest): Promise<number[][]> {
    const url: string = this.configService.getOrThrow('OPENAI_EMBEDDING_URL');

    const response: AxiosResponse<OpenAiEmbeddingsResponse> =
      await axios.post<OpenAiEmbeddingsResponse>(url, request, {
        headers: {
          Authorization: `Bearer ${this.configService.getOrThrow('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
      });

    return response.data.data.map(
      (e: OpenAiEmbedding): number[] => e.embedding,
    );
  }
}

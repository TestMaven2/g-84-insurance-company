import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiRequest } from '../types/gemini/gemini-request';
import axios, { AxiosResponse } from 'axios';
import { GeminiResponse } from '../types/gemini/gemini-response';

@Injectable()
export class GeminiClient {
  constructor(private readonly configService: ConfigService) {}

  async generateContent(request: GeminiRequest): Promise<string> {
    const baseUrl: string = this.configService.getOrThrow('GEMINI_API_URL');
    const key: string = this.configService.getOrThrow('GEMINI_API_KEY');
    const url: string = baseUrl + key;

    const response: AxiosResponse<GeminiResponse> =
      await axios.post<GeminiResponse>(url, request);

    return response.data.candidates[0].content.parts[0].text;
  }
}

import { GeminiContent } from './gemini-content';
import { GeminiEmbedContentConfig } from './gemini-embed-content-config';

export class GeminiEmbedRequest {
  content: GeminiContent;
  embedContentConfig: GeminiEmbedContentConfig;
}

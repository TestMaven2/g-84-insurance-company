import { Injectable } from '@nestjs/common';
import mammoth from 'mammoth';

@Injectable()
export class DocxExtractor {
  async extract(content: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer: content });
    return result.value;
  }
}
